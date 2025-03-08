
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

export interface TextTemplate {
  id: string;
  title: string;
  description?: string;
  sections: string[];
  isDefault: boolean;
}

// Define StructuredNote type to be used in the application
export type StructuredNote = MedicalSections;

// Add template-specific types
export interface TemplateSection {
  id: string;
  name: string;
  description?: string;
  required: boolean;
}

export interface TemplateFormValues {
  title: string;
  description: string;
  sections: TemplateSection[];
  isDefault: boolean;
}
