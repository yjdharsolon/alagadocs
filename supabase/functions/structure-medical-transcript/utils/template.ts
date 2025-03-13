
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
export function getSystemPrompt(role: string, template?: { sections: string[] }): string {
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

Return the structured information in JSON format with these sections as keys with camelCase format. 
If certain sections are not present in the transcription, include the key with an empty string or "Not mentioned" as the value.
Be accurate, concise and professional in your structuring. Do not invent information not present in the transcription.

Example response format (using camelCase for keys):
{
  ${sections.map(section => `"${toCamelCase(section)}": "..."`).join(',\n  ')}
}
`;

  return basePrompt;
}
