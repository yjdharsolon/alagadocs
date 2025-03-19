export interface MedicalSections {
  // Standard history & physical format fields
  chiefComplaint?: string;
  historyOfPresentIllness?: string;
  pastMedicalHistory?: string;
  medications?: string | any[]; // Updated to support both string and array types
  allergies?: string;
  physicalExamination?: string;
  assessment?: string;
  plan?: string;
  
  // SOAP format fields
  subjective?: string;
  objective?: string;
  
  // Consultation format fields
  reasonForConsultation?: string;
  history?: string;
  findings?: string;
  impression?: string;
  recommendations?: string;
  
  // Prescription format fields
  patientInformation?: {
    name: string;
    sex: string;
    age: string;
    date: string;
  };
  prescriberInformation?: {
    name: string;
    licenseNumber: string;
    // signature field completely removed
    s2Number?: string;  // S2 number
    ptrNumber?: string; // PTR number
    // title field removed
  };
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

// Database response type for text_templates table
export interface TextTemplateResponse {
  id: string;
  title: string;
  description: string | null;
  sections: any;
  is_default: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}
