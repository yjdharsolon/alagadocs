
export type Patient = {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  name_extension?: string;
  date_of_birth?: string;
  email?: string;
  phone?: string;
  patient_id?: string;
  // Personal information fields
  age?: number;
  gender?: string;
  civil_status?: string;
  nationality?: string;
  blood_type?: string;
  // Emergency contact information
  emergency_contact_name?: string;
  emergency_contact_relationship?: string;
  emergency_contact_phone?: string;
  // Medical information
  allergies?: string;
  medical_conditions?: string;
};
