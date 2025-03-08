
export interface MedicalSections {
  chiefComplaint: string;
  historyOfPresentIllness: string;
  pastMedicalHistory: string;
  medications: string;
  allergies: string;
  physicalExamination: string;
  assessment: string;
  plan: string;
}

export interface MedicalSection {
  id: string;
  title: string;
  content: string;
}

// Define StructuredNote type to be used in the application
export type StructuredNote = MedicalSections;

