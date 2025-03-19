import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

interface RequestBody {
  text: string;
  role?: string;
  template?: {
    sections: string[];
  };
}

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { text, role = 'Doctor', template } = await req.json() as RequestBody;

    if (!text) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
      });
    }

    const systemPrompt = getSystemPrompt(role, template);
    
    console.log("Calling OpenAI with system prompt:", systemPrompt);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    try {
      // Parse the response as JSON if possible
      const structuredContent = JSON.parse(data.choices[0].message.content);
      
      // Normalize the response to ensure consistent formats
      const normalizedContent = normalizeResponse(structuredContent, template);
      
      return new Response(JSON.stringify(normalizedContent), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
      });
    } catch (e) {
      console.log("Could not parse as JSON, returning raw content");
      // If not valid JSON, return the raw text
      return new Response(JSON.stringify({
        content: data.choices[0].message.content 
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
      });
    }
  } catch (error) {
    console.error("Error in structure-text function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      },
    });
  }
});

/**
 * Normalizes the OpenAI response to ensure consistent formats
 */
function normalizeResponse(data: any, template?: { sections: string[] }): any {
  // Determine the format type based on the template or data fields
  let formatType = 'standard';
  
  if (template?.sections) {
    if (template.sections.includes('Subjective')) formatType = 'soap';
    else if (template.sections.includes('Reason for Consultation')) formatType = 'consultation';
    else if (template.sections.includes('Prescription')) formatType = 'prescription';
  } else if (data.subjective && data.objective) {
    formatType = 'soap';
  } else if (data.reasonForConsultation) {
    formatType = 'consultation';
  } else if (data.patientInformation || data.medications) {
    formatType = 'prescription';
  }
  
  // Normalize based on format type
  switch (formatType) {
    case 'soap':
      return {
        subjective: ensureString(data.subjective),
        objective: ensureString(data.objective),
        assessment: ensureString(data.assessment),
        plan: ensureString(data.plan)
      };
    case 'consultation':
      return {
        reasonForConsultation: ensureString(data.reasonForConsultation),
        history: ensureString(data.history),
        findings: ensureString(data.findings),
        impression: ensureString(data.impression),
        recommendations: ensureString(data.recommendations)
      };
    case 'prescription':
      // Ensure patientInformation is an object with string values
      const patientInfo = typeof data.patientInformation === 'object' ? 
        {
          name: ensureString(data.patientInformation.name),
          sex: ensureString(data.patientInformation.sex),
          age: ensureString(data.patientInformation.age),
          date: ensureString(data.patientInformation.date)
        } : 
        { name: '', sex: '', age: '', date: '' };
      
      // Ensure medications is an array of objects
      let medications;
      if (Array.isArray(data.medications)) {
        medications = data.medications.map((med: any) => {
          return {
            name: ensureString(med.name),
            strength: ensureString(med.strength),
            dosageForm: ensureString(med.dosageForm),
            sigInstructions: ensureString(med.sigInstructions),
            quantity: ensureString(med.quantity),
            refills: ensureString(med.refills),
            specialInstructions: ensureString(med.specialInstructions)
          };
        });
      } else if (typeof data.medications === 'object') {
        // Handle case where medications is an object, not an array
        medications = [
          {
            name: ensureString(data.medications.name || ''),
            strength: ensureString(data.medications.strength || ''),
            dosageForm: ensureString(data.medications.dosageForm || ''),
            sigInstructions: ensureString(data.medications.sigInstructions || ''),
            quantity: ensureString(data.medications.quantity || ''),
            refills: ensureString(data.medications.refills || ''),
            specialInstructions: ensureString(data.medications.specialInstructions || '')
          }
        ];
      } else {
        medications = [];
      }
      
      // Ensure prescriberInformation is an object with string values
      const prescriberInfo = typeof data.prescriberInformation === 'object' ?
        {
          name: ensureString(data.prescriberInformation.name),
          licenseNumber: ensureString(data.prescriberInformation.licenseNumber),
          signature: ensureString(data.prescriberInformation.signature || '[SIGNATURE]')
        } :
        { name: '', licenseNumber: '', signature: '[SIGNATURE]' };
      
      return {
        patientInformation: patientInfo,
        medications: medications,
        prescriberInformation: prescriberInfo
      };
    default:
      // Standard history & physical format
      return {
        chiefComplaint: ensureString(data.chiefComplaint),
        historyOfPresentIllness: ensureString(data.historyOfPresentIllness),
        pastMedicalHistory: ensureString(data.pastMedicalHistory),
        medications: ensureString(data.medications),
        allergies: ensureString(data.allergies),
        physicalExamination: ensureString(data.physicalExamination),
        assessment: ensureString(data.assessment),
        plan: ensureString(data.plan)
      };
  }
}

/**
 * Ensures a value is a string
 */
function ensureString(value: any): string {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function getSystemPrompt(role: string, template?: { sections: string[] }): string {
  // SOAP format prompt
  if (template?.sections && 
      template.sections.includes('Subjective') && 
      template.sections.includes('Objective') && 
      template.sections.includes('Assessment') && 
      template.sections.includes('Plan')) {
    return `You are a highly experienced medical scribe with over 10 years of experience working in clinical settings in the Philippines. You are proficient in converting casual or layman's descriptions into structured, professional SOAP notes as a doctor would write.

Format the provided transcription into a SOAP note with these exact sections:

1. Subjective:
   - Transform patient's symptoms and complaints into proper medical terminology
   - Convert casual descriptions into professional medical language
   - Include relevant patient history while maintaining medical precision
   - Organize information logically as a physician would document

2. Objective:
   - Format examination findings using standard medical terminology
   - Document vital signs and measurements precisely
   - Present laboratory and diagnostic results in medical format
   - Ensure all objective data is presented clearly and professionally

3. Assessment:
   - Convert preliminary diagnoses into proper medical terminology
   - Present differential diagnoses if applicable using medical nomenclature
   - Analyze findings using professional medical reasoning

4. Plan:
   - Document treatment plans with precise medical terminology
   - List medications with proper names (both generic and brands available in the Philippines)
   - Include proper follow-up instructions and testing recommendations
   - Present patient education in professional medical language

IMPORTANT: You MUST return the structured information in this exact JSON format with all values as strings:
{
  "subjective": "string",
  "objective": "string",
  "assessment": "string",
  "plan": "string"
}

Extract all relevant information from the transcription. If information is missing for a section, include that section with "Not documented" as the value. Convert patient descriptions into proper medical terminology (e.g., "Masakit ang batok ko pag-ising" becomes "Patient reports cervicalgia with morning stiffness"). Be accurate, concise, and follow standard medical writing practices.`;
  }
  
  // Prescription format prompt
  if (template?.sections && template.sections.includes('Prescription')) {
    return `You are a highly experienced medical scribe with over 10 years of experience working in clinical settings in the Philippines. You are proficient in converting casual or layman's descriptions into structured, professional prescriptions as a doctor would write.

Format the provided transcription into a structured prescription with these exact sections:

1. Patient Information:
   - Patient Name
   - Sex/Gender
   - Age
   - Date

2. Medication Details (for each medication):
   - Medication Name and Strength (include both generic and brands available in the Philippines)
   - Dosage Form (tablets, capsules, etc.)
   - Sig (Instructions in clear medical terminology)
   - Quantity
   - Refills
   - Special Instructions

3. Prescriber Information:
   - Name
   - License/Registration Number
   - Signature (indicate [SIGNATURE])

IMPORTANT: You MUST return the structured information in this exact JSON format with all values as strings:
{
  "patientInformation": {
    "name": "string",
    "sex": "string",
    "age": "string",
    "date": "string"
  },
  "medications": [
    {
      "name": "string",
      "strength": "string",
      "dosageForm": "string",
      "sigInstructions": "string",
      "quantity": "string",
      "refills": "string",
      "specialInstructions": "string"
    }
  ],
  "prescriberInformation": {
    "name": "string",
    "licenseNumber": "string",
    "signature": "[SIGNATURE]"
  }
}

Extract all relevant information from the transcription. If any information is not present, use "Not specified" as the value. Convert patient descriptions into proper medical terminology. Be accurate, concise, and follow standard medical writing practices. Ensure medications mentioned are available in the Philippines.`;
  }
  
  // Consultation format prompt
  if (template?.sections && template.sections.includes('Reason for Consultation')) {
    return `You are a highly experienced medical scribe with over 10 years of experience working in clinical settings in the Philippines. You are proficient in converting casual or layman's descriptions into structured, professional consultation notes as a doctor would write.

Format the provided transcription into a consultation note with these exact sections:

1. Reason for Consultation:
   - Convert patient's reason for referral into proper medical terminology
   - Present the main clinical question in professional medical language

2. History:
   - Transform patient history descriptions into proper medical terminology
   - Convert symptoms described in layman's terms to medical language
   - Organize information as a physician would document

3. Findings:
   - Document examination findings using standard medical terminology
   - Present test results in professional medical format
   - Convert casual observations into precise medical language

4. Impression:
   - Present diagnosis or clinical impression using proper medical terminology
   - Analyze the case using professional medical reasoning and language

5. Recommendations:
   - Document treatment plan with precise medical terminology
   - List follow-up suggestions in professional medical language
   - Include referrals and medication recommendations with proper names (both generic and brands available in the Philippines)

IMPORTANT: You MUST return the structured information in this exact JSON format with all values as strings:
{
  "reasonForConsultation": "string",
  "history": "string",
  "findings": "string",
  "impression": "string",
  "recommendations": "string"
}

Extract all relevant information from the transcription. If information is missing for a section, include that section with "Not documented" as the value. Convert patient descriptions into proper medical terminology (e.g., "Masakit ang batok ko pag-ising" becomes "Patient reports cervicalgia with morning stiffness"). Be accurate, concise, and follow standard medical writing practices.`;
  }

  const standardSections = [
    "Chief Complaint",
    "History of Present Illness",
    "Past Medical History",
    "Medications",
    "Allergies",
    "Physical Examination",
    "Assessment",
    "Plan"
  ];
  
  const sections = template?.sections || standardSections;
  
  const sectionsList = sections.map(section => `- ${section}`).join('\n');
  
  const basePrompt = `
You are a highly experienced medical scribe with over 10 years of experience working in clinical settings in the Philippines. You are proficient in converting casual or layman's descriptions into structured, professional medical documentation as a doctor would write. You're assisting a healthcare professional with role: ${role}.

Take the provided transcription text and organize it into a structured medical note with the following sections:
${sectionsList}

Follow these important guidelines:
1. Transform free-text descriptions into structured, professional documentation
2. Convert common patient complaints into proper medical terminology (e.g., "Masakit ang batok ko pag-ising" becomes "Patient reports cervicalgia with morning stiffness")
3. Use precise medical terminology while maintaining clarity and conciseness
4. When mentioning medications, prioritize those available in Philippine pharmacies, providing both generic and branded options when applicable
5. Maintain a professional tone and follow standardized medical writing practices

IMPORTANT: You MUST return the structured information in JSON format with these sections as keys with camelCase format. ALL VALUES MUST BE STRINGS, not objects or arrays.
If certain sections are not present in the transcription, include the key with an empty string or "Not documented" as the value.
Be accurate, concise and professional in your structuring. Do not invent information not present in the transcription.

Example response format (using camelCase for keys):
{
  ${sections.map(section => `"${toCamelCase(section)}": "string"`).join(',\n  ')}
}
`;

  return basePrompt;
}

function toCamelCase(str: string): string {
  return str
    .split(' ')
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
}
