
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Patient } from '@/types/patient';
import { getUserStructuredNotes } from '@/services/structuredNoteService';
import { usePatientNavigation } from './usePatientNavigation';

export const usePatientRecords = (patient: Patient | null, searchQuery?: string, searchResults?: Patient[]) => {
  const [loading, setLoading] = useState(true);
  const [patientNotes, setPatientNotes] = useState<any[]>([]);
  const { 
    handleStartConsultation, 
    handleEditPatient, 
    handleBack 
  } = usePatientNavigation(patient, searchQuery, searchResults);
  
  useEffect(() => {
    async function fetchPatientNotes() {
      if (!patient?.id) return;
      
      try {
        setLoading(true);
        console.log('Fetching notes for patient ID:', patient.id);
        const notes = await getUserStructuredNotes();
        console.log('All notes fetched:', notes);
        
        const filtered = notes.filter(note => {
          console.log('Note patient_id:', note.patient_id, 'Patient id:', patient.id);
          return note.patient_id === patient.id;
        });
        
        console.log('Filtered patient notes:', filtered);
        setPatientNotes(filtered);
      } catch (error) {
        console.error('Error fetching patient notes:', error);
        toast.error('Failed to load patient records');
      } finally {
        setLoading(false);
      }
    }

    fetchPatientNotes();
  }, [patient]);

  return {
    loading,
    patientNotes,
    handleStartConsultation,
    handleEditPatient,
    handleBack
  };
};
