
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    console.log("Received structure-medical-text request");
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

    console.log(`Processing text with role: ${role}`);
    const systemPrompt = getSystemPrompt(role, template);
    
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
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log("Received response from OpenAI");
    
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
    console.error("Error in structure-medical-text:", error);
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
  
  // SOAP format prompt
  if (template?.sections && 
      template.sections.includes('Subjective') && 
      template.sections.includes('Objective') && 
      template.sections.includes('Assessment') && 
      template.sections.includes('Plan')) {
    return `You are a medical assistant helping to format transcribed medical conversations into a structured SOAP note.
Format the provided transcription into a SOAP note with these exact sections:

1. Subjective:
   - Patient's symptoms
   - Patient's complaints
   - Patient's history related to current problem
   - Patient's own words and descriptions

2. Objective:
   - Physical examination findings
   - Vital signs
   - Laboratory and diagnostic results
   - Measurable, observable data

3. Assessment:
   - Diagnosis or clinical impression
   - Differential diagnoses if applicable
   - Analysis of the findings

4. Plan:
   - Treatment plan
   - Medications prescribed
   - Further testing needed
   - Follow-up instructions
   - Patient education

IMPORTANT: You MUST return the structured information in this exact JSON format with all values as strings:
{
  "subjective": "string",
  "objective": "string",
  "assessment": "string",
  "plan": "string"
}

Extract all relevant information from the transcription. If any information is not present for a section, include that section with an empty string or "Not documented" as the value. Be accurate, concise and maintain medical terminology.`;
  }
  
  // Prescription format prompt
  if (template?.sections && template.sections.includes('Prescription')) {
    return `You are a medical assistant helping to format prescription information from transcribed medical conversations.
Format the provided transcription into a structured prescription with these exact sections:

1. Patient Information:
   - Patient Name
   - Sex/Gender
   - Age
   - Date

2. Medication Details (for each medication):
   - Medication Name and Strength
   - Dosage Form (tablets, capsules, etc.)
   - Sig (Instructions)
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

Extract all relevant information from the transcription. If any information is not present, use "Not specified" as the value. Be accurate and maintain medical terminology.`;
  }
  
  // Consultation format prompt
  if (template?.sections && template.sections.includes('Reason for Consultation')) {
    return `You are a medical assistant helping to format transcribed medical conversations into a structured consultation note.
Format the provided transcription into a consultation note with these exact sections:

1. Reason for Consultation:
   - Why the patient was referred
   - Main clinical question

2. History:
   - Relevant patient history
   - Current symptoms

3. Findings:
   - Examination findings
   - Test results
   - Observations

4. Impression:
   - Diagnosis or clinical impression
   - Analysis of the case

5. Recommendations:
   - Treatment plan
   - Follow-up suggestions
   - Referrals if needed
   - Medication recommendations

IMPORTANT: You MUST return the structured information in this exact JSON format with all values as strings:
{
  "reasonForConsultation": "string",
  "history": "string",
  "findings": "string",
  "impression": "string",
  "recommendations": "string"
}

Extract all relevant information from the transcription. If any information is not present for a section, include that section with an empty string or "Not documented" as the value. Be accurate, concise and maintain medical terminology.`;
  }
  
  const sectionsList = sections.map(section => `- ${section}`).join('\n');
  
  const basePrompt = `
You are an expert medical assistant helping to structure transcriptions of medical conversations or dictations. You're assisting a healthcare professional with role: ${role}.

Take the provided transcription text and organize it into a structured medical note with the following sections:
${sectionsList}

IMPORTANT: You MUST return the structured information in JSON format with these sections as keys with camelCase format. ALL VALUES MUST BE STRINGS, not objects or arrays.
If certain sections are not present in the transcription, include the key with an empty string or "Not mentioned" as the value.
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
