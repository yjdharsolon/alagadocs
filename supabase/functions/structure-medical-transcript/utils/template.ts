
/**
 * Converts a string to camelCase format
 */
export function toCamelCase(str: string): string {
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

/**
 * Generates a system prompt for OpenAI based on the user's role and template
 */
export const getSystemPrompt = (role: string, template?: { sections: string[] }): string => {
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

Extract all relevant information from the transcription. If any information is not present, use "Not specified" as the value. Be accurate and maintain medical terminology. Do not add any fields that are not in the template above.`;
  }

  // SOAP format prompt
  if (template?.sections && template.sections.includes('Subjective') && 
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

  // Consultation note format
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
