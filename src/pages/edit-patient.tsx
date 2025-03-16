
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { PatientForm } from '@/components/patient/PatientForm';
import { PatientPageHeader } from '@/components/patient/PatientPageHeader';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function EditPatientPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState<any>(null);
  const searchParams = new URLSearchParams(location.search);
  const patientId = searchParams.get('id');
  
  useEffect(() => {
    const fetchPatient = async () => {
      if (!patientId) {
        toast.error('No patient ID provided');
        navigate('/select-patient');
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .eq('id', patientId)
          .single();
        
        if (error) throw error;
        
        if (!data) {
          toast.error('Patient not found');
          navigate('/select-patient');
          return;
        }
        
        setPatientData(data);
      } catch (error: any) {
        console.error('Error fetching patient:', error);
        toast.error(error.message || 'Failed to fetch patient data');
        navigate('/select-patient');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatient();
  }, [patientId, navigate]);
  
  const handleCancel = () => {
    navigate(`/patient-details?id=${patientId}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-6 px-4 flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <PatientPageHeader title="Edit Patient" />
        <PatientForm 
          onCancel={handleCancel} 
          patientData={patientData}
          isEditing={true}
        />
      </div>
    </Layout>
  );
}
