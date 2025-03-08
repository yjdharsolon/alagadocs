
/**
 * Parses structured text into sections using regex patterns
 * @param text The structured text to parse
 * @returns Object containing parsed sections
 */
export const parseStructuredText = (text: string) => {
  // Basic parsing of headers and content
  const parsedSections: {[key: string]: string} = {
    chiefComplaint: '',
    historyOfPresentIllness: '',
    pastMedicalHistory: '',
    medications: '',
    allergies: '',
    physicalExamination: '',
    assessment: '',
    plan: ''
  };
  
  // Simple regex-based parsing for each section
  // Chief Complaint
  const ccMatch = text.match(/chief complaint:?([^#]+)/i);
  if (ccMatch) parsedSections.chiefComplaint = ccMatch[1].trim();
  
  // History of Present Illness
  const hpiMatch = text.match(/history of present illness:?([^#]+)/i);
  if (hpiMatch) parsedSections.historyOfPresentIllness = hpiMatch[1].trim();
  
  // Past Medical History
  const pmhMatch = text.match(/past medical history:?([^#]+)/i);
  if (pmhMatch) parsedSections.pastMedicalHistory = pmhMatch[1].trim();
  
  // Medications
  const medMatch = text.match(/medications:?([^#]+)/i);
  if (medMatch) parsedSections.medications = medMatch[1].trim();
  
  // Allergies
  const allergyMatch = text.match(/allergies:?([^#]+)/i);
  if (allergyMatch) parsedSections.allergies = allergyMatch[1].trim();
  
  // Physical Examination
  const peMatch = text.match(/physical examination:?([^#]+)/i);
  if (peMatch) parsedSections.physicalExamination = peMatch[1].trim();
  
  // Assessment
  const assessMatch = text.match(/assessment:?([^#]+)/i);
  if (assessMatch) parsedSections.assessment = assessMatch[1].trim();
  
  // Plan
  const planMatch = text.match(/plan:?([^#]+)/i);
  if (planMatch) parsedSections.plan = planMatch[1].trim();
  
  return parsedSections;
};
