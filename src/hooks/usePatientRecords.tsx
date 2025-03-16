
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Patient } from '@/types/patient';
import { getUserStructuredNotes } from '@/services/structuredNoteService';

export const usePatientRecords = (patient: Patient | null) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [patientNotes, setPatientNotes] = useState<any[]>([]);
  
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

  const handleStartConsultation = () => {
    navigate('/upload', { 
      state: { 
        patient: patient 
      } 
    });
  };

  const handleEditPatient = () => {
    navigate(`/edit-patient?id=${patient?.id}`);
  };

  const handleBack = () => {
    navigate('/select-patient');
  };

  return {
    loading,
    patientNotes,
    handleStartConsultation,
    handleEditPatient,
    handleBack
  };
};
