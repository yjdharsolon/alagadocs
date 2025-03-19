
import { supabase } from '@/integrations/supabase/client';
import { getUserProfile } from '../userService';

/**
 * Enhances prescription data with patient and user information
 */
export async function enhancePrescriptionData(structuredData: any, patientId?: string): Promise<any> {
  // Get current date
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Default patient info if we can't find actual patient data
  let patientInfo = {
    name: "Not specified",
    sex: "Not specified",
    age: "Not specified",
    date: currentDate
  };
  
  // Try to get patient data if ID is provided
  if (patientId) {
    try {
      const { data: patient } = await supabase
        .from('patients')
        .select('first_name, last_name, gender, age, date_of_birth')
        .eq('id', patientId)
        .maybeSingle();
        
      if (patient) {
        patientInfo = {
          name: `${patient.first_name} ${patient.last_name}`,
          sex: patient.gender || "Not specified",
          age: patient.age ? patient.age.toString() : "Not specified",
          date: currentDate
        };
      }
    } catch (error) {
      console.error('Error fetching patient data:', error);
    }
  } else {
    // Try to get patient from session storage as fallback
    try {
      const storedPatient = sessionStorage.getItem('selectedPatient');
      if (storedPatient) {
        const patient = JSON.parse(storedPatient);
        patientInfo = {
          name: `${patient.first_name} ${patient.last_name}`,
          sex: patient.gender || "Not specified",
          age: patient.age ? patient.age.toString() : "Not specified",
          date: currentDate
        };
      }
    } catch (error) {
      console.error('Error getting patient from session storage:', error);
    }
  }
  
  // Get current user data for prescriber information with proper formatting
  let prescriberInfo = {
    name: "Attending Physician",
    licenseNumber: "License number not specified",
    s2Number: "",
    ptrNumber: "",
    title: ""
  };
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const userData = await getUserProfile(session.user.id);
      if (userData) {
        // Format name properly with middle initial if available
        const firstName = userData.first_name || '';
        const middleName = userData.middle_name ? userData.middle_name.charAt(0) + '. ' : '';
        const lastName = userData.last_name || '';
        const nameExtension = userData.name_extension ? `, ${userData.name_extension}` : '';
        
        prescriberInfo = {
          name: `${firstName} ${middleName}${lastName}${nameExtension}`.trim() || "Attending Physician",
          licenseNumber: userData.prc_license || "License number not specified",
          title: userData.medical_title || "",
          s2Number: userData.s2_number || "",
          ptrNumber: userData.ptr_number || ""
        };
      }
    }
  } catch (error) {
    console.error('Error getting user data:', error);
  }
  
  // Merge the data
  return {
    ...structuredData,
    patientInformation: patientInfo,
    prescriberInformation: prescriberInfo
  };
}
