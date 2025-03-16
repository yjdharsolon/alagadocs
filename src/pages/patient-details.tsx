
import React from 'react';
import Layout from '@/components/Layout';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PatientDisplayCard } from '@/components/upload/PatientDisplayCard';
import { PatientDetailsHeader } from '@/components/patient/PatientDetailsHeader';
import { MedicalRecordsSection } from '@/components/patient/MedicalRecordsSection';
import { PatientInfoSection } from '@/components/patient/PatientInfoSection';
import { usePatientDetails } from '@/hooks/usePatientDetails';
import { usePatientRecords } from '@/hooks/usePatientRecords';

export default function PatientDetailsPage() {
  const { user } = useAuth();
  const { patient } = usePatientDetails();
  const { 
    loading, 
    patientNotes, 
    handleStartConsultation, 
    handleEditPatient, 
    handleBack 
  } = usePatientRecords(patient);

  if (!patient) {
    return (
      <Layout>
        <div className="container mx-auto py-8 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <PatientDetailsHeader onBack={handleBack} />

        <PatientDisplayCard 
          patient={patient} 
          onChangePatient={handleBack}
        />

        <Tabs defaultValue="records" className="mt-6">
          <TabsList>
            <TabsTrigger value="records">Medical Records</TabsTrigger>
            <TabsTrigger value="info">Patient Information</TabsTrigger>
          </TabsList>
          
          <TabsContent value="records" className="mt-4">
            <MedicalRecordsSection
              loading={loading}
              patientNotes={patientNotes}
              onStartConsultation={handleStartConsultation}
            />
          </TabsContent>
          
          <TabsContent value="info" className="mt-4">
            <PatientInfoSection
              patient={patient}
              onEditPatient={handleEditPatient}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};
