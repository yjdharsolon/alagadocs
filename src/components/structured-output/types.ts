
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

// Add the StructuredNote type that was missing
export type StructuredNote = MedicalSections;
