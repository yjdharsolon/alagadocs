
import React from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import StructuredOutputHeader from '@/components/structured-output/StructuredOutputHeader';
import StructuredOutputContent from '@/components/structured-output/StructuredOutputContent';
import { useStructuredOutputPage } from '@/hooks/useStructuredOutput/index';
import { useStructuredOutputData } from '@/hooks/useStructuredOutputData';
import { CompactPatientHeader } from '@/components/patient/CompactPatientHeader';

export default function StructuredOutputPage() {
  const { user } = useAuth();
  
  // Use the data loading hook
  const {
    loading,
    processingText,
    structuredData,
    setStructuredData,
    error,
    patientInfo,
    transcriptionData,
    audioUrl,
    transcriptionId
  } = useStructuredOutputData();
  
  // Attempt to get additional patient data from session storage
  const [patientDetails, setPatientDetails] = React.useState<{
    dateOfBirth?: string;
    age?: number;
    gender?: string;
  }>({});
  
  React.useEffect(() => {
    try {
      const storedPatient = sessionStorage.getItem('selectedPatient');
      if (storedPatient) {
        const patientData = JSON.parse(storedPatient);
        setPatientDetails({
          dateOfBirth: patientData.date_of_birth,
          age: patientData.age,
          gender: patientData.gender
        });
      }
    } catch (error) {
      console.error('Error retrieving patient details:', error);
    }
  }, []);
  
  // Enhance patientInfo with demographic data
  const enhancedPatientInfo = React.useMemo(() => ({
    ...patientInfo,
    dateOfBirth: patientDetails.dateOfBirth,
    age: patientDetails.age,
    gender: patientDetails.gender
  }), [patientInfo, patientDetails]);
  
  // Use the navigation and edit mode hook
  const {
    isEditMode,
    handleBackClick,
    handleToggleEditMode,
    handleSaveEdit,
    handleRetry,
    handleNoteSaved,
    handleEndConsult,
    noteSaved
  } = useStructuredOutputPage({
    structuredData,
    setStructuredData,
    transcriptionData,
    audioUrl,
    error
  });

  console.log('noteSaved state:', noteSaved);
  console.log('handleEndConsult is defined:', !!handleEndConsult);

  return (
    <Layout>
      <div className="container mx-auto py-4 px-4">
        <StructuredOutputHeader 
          onBack={handleBackClick} 
          subtitle={transcriptionData?.text ? `Based on transcription: "${transcriptionData.text.substring(0, 40)}${transcriptionData.text.length > 40 ? '...' : ''}"` : undefined}
        />
        
        {patientInfo.name && (
          <CompactPatientHeader 
            firstName={patientInfo.name.split(' ')[0]}
            lastName={patientInfo.name.split(' ').slice(1).join(' ')}
            dateOfBirth={patientDetails.dateOfBirth}
            age={patientDetails.age}
            gender={patientDetails.gender}
            patientId={patientInfo.id}
          />
        )}
        
        <StructuredOutputContent
          loading={loading}
          processingText={processingText}
          structuredData={structuredData}
          error={error}
          patientInfo={enhancedPatientInfo}
          user={user}
          transcriptionId={transcriptionId || ''}
          isEditMode={isEditMode}
          onToggleEditMode={handleToggleEditMode}
          onSaveEdit={handleSaveEdit}
          onRetry={handleRetry}
          onNoteSaved={handleNoteSaved}
          onEndConsult={handleEndConsult}
          noteSaved={noteSaved}
        />
      </div>
    </Layout>
  );
}
