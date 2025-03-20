
import { useState, useEffect } from 'react';
import { PrescriberInfo } from '../types/prescriptionTypes';
import { MedicalSections } from '../../types';
import { useProfileFields } from '@/hooks/useProfileFields';

/**
 * Hook for managing prescriber information in the prescription editor
 */
export const usePrescriberInfoState = (structuredData: MedicalSections) => {
  const { profileData } = useProfileFields();
  
  // Initialize prescriber info with empty values
  const [prescriberInfo, setPrescriberInfo] = useState<PrescriberInfo>({
    name: '',
    licenseNumber: '',
    s2Number: '',
    ptrNumber: ''
  });

  // Update prescriber info from profile data when it loads
  useEffect(() => {
    if (profileData) {
      // Format name with proper spacing
      const firstName = profileData.first_name || '';
      const middleName = profileData.middle_name ? `${profileData.middle_name.charAt(0)}. ` : '';
      const lastName = profileData.last_name || '';
      const nameExtension = profileData.name_extension ? `, ${profileData.name_extension}` : '';
      
      const fullName = `${firstName} ${middleName}${lastName}${nameExtension}`.trim();
      
      setPrescriberInfo(prev => ({
        ...prev,
        name: fullName || prev.name || '',
        licenseNumber: profileData.prc_license || prev.licenseNumber || '',
        s2Number: profileData.s2_number || prev.s2Number || '',
        ptrNumber: profileData.ptr_number || prev.ptrNumber || ''
      }));
    }
  }, [profileData]);

  // Effect to initialize with structured data if present
  useEffect(() => {
    if (structuredData.prescriberInformation) {
      setPrescriberInfo(prev => ({
        ...prev,
        ...(structuredData.prescriberInformation || {})
      }));
    }
  }, [structuredData.prescriberInformation]);

  // Handle prescriber info changes
  const handlePrescriberInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrescriberInfo({
      ...prescriberInfo,
      [e.target.name]: e.target.value
    });
  };

  return {
    prescriberInfo,
    setPrescriberInfo,
    handlePrescriberInfoChange
  };
};
