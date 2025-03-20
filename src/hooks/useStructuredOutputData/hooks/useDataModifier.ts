
import { useState, useRef } from 'react';
import { MedicalSections } from '@/components/structured-output/types';

/**
 * Hook to safely set structured data and track direct modifications
 */
export const useDataModifier = () => {
  const isDataBeingModifiedDirectly = useRef(false);
  const lastDirectUpdateTime = useRef(Date.now());

  const setStructuredDataSafely = (data: MedicalSections | null) => {
    isDataBeingModifiedDirectly.current = true;
    lastDirectUpdateTime.current = Date.now();
    
    console.log('[useDataModifier] Setting structured data safely:', 
      data ? JSON.stringify({
        hasPatientInfo: !!data.patientInformation,
        medicationsCount: data.medications ? 
          (Array.isArray(data.medications) ? data.medications.length : 'not array') : 
          'none',
        keys: Object.keys(data)
      }) : 'null');
    
    if (data?.medications) {
      console.log('[useDataModifier] Medications in safely set data:', 
        Array.isArray(data.medications) ? 
          JSON.stringify(data.medications, null, 2) : 
          data.medications);
    }
    
    // Return the data so the parent component can set state
    setTimeout(() => {
      console.log('[useDataModifier] Reset direct modification flag');
      isDataBeingModifiedDirectly.current = false;
    }, 1000);
    
    return data;
  };

  return {
    setStructuredDataSafely,
    isDataBeingModifiedDirectly,
    lastDirectUpdateTime
  };
};
