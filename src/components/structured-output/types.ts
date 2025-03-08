
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
