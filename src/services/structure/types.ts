
import { MedicalSections } from '@/components/structured-output/types';

export interface FormatOption {
  id: string;
  name: string;
  sections: string[];
}

export interface StructureOptions {
  role?: string;
  template?: { sections: string[] };
  patientId?: string;
}
