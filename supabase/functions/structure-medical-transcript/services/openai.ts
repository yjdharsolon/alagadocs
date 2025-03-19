
import { getSystemPrompt } from "../utils/template.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

/**
 * Calls OpenAI API to structure medical text
 */
export async function structureWithOpenAI(text: string, role: string, template?: { sections: string[] }): Promise<any> {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set');
  }
  
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
    // Parse the OpenAI response content
    const content = data.choices[0].message.content;
    const parsedContent = JSON.parse(content);
    
    // Normalize the parsed content
    const normalizedContent = normalizeResponse(parsedContent, template);
    
    return JSON.stringify(normalizedContent);
  } catch (e) {
    // If parsing fails, return the raw content
    return data.choices[0].message.content;
  }
}

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
  } else if (data.medications) {
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
      // For prescription, we're now only handling medications from the AI
      // The patient and prescriber info will be added by the frontend
      
      // Ensure medications is an array of objects
      let medications = [];
      if (Array.isArray(data.medications)) {
        medications = data.medications.map((med: any, index: number) => {
          return {
            id: index + 1, // Add numbering to medications
            genericName: ensureString(med.genericName || med.name || ''), // Prefer genericName but fall back to name
            brandName: ensureString(med.brandName || ''), // Add brandName field
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
            id: 1, // Add numbering (single medication)
            genericName: ensureString(data.medications.genericName || data.medications.name || ''),
            brandName: ensureString(data.medications.brandName || ''),
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
      
      // Return just the medications array - patient and prescriber info
      // will be added by the frontend
      return {
        medications: medications,
        // These empty objects will be filled by the frontend
        patientInformation: {}, 
        prescriberInformation: {}
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
