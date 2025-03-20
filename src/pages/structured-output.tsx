
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import StructuredOutputHeader from '@/components/structured-output/StructuredOutputHeader';
import StructuredOutputContent from '@/components/structured-output/StructuredOutputContent';
import { useStructuredOutputPage } from '@/hooks/useStructuredOutput/index';
import { useStructuredOutputData } from '@/hooks/useStructuredOutputData';
import { CompactPatientHeader } from '@/components/patient/CompactPatientHeader';
import LoadingState from '@/components/structured-output/LoadingState';

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
    transcriptionId,
    formattedVersions,
    activeFormatType,
    handleFormatTypeChange,
    toggleFormatSelection,
    getSelectedFormats,
    refreshData
  } = useStructuredOutputData();
  
  // Attempt to get additional patient data from session storage
  const [patientDetails, setPatientDetails] = React.useState<{
    dateOfBirth?: string;
    age?: number;
    gender?: string;
  }>({});
  
  // Use the navigation and edit mode hook - Make sure all hooks are called unconditionally
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
    error,
    patientInfo: {
      ...patientInfo,
      dateOfBirth: patientDetails.dateOfBirth,
      age: patientDetails.age,
      gender: patientDetails.gender
    },
    transcriptionId
  });

  // Move all effects together to maintain consistent hook order
  useEffect(() => {
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
  
  // This effect needs to always be present, not conditionally 
  useEffect(() => {
    if (structuredData?.medications) {
      console.log('[StructuredOutputPage] Current medications in structuredData:', 
        Array.isArray(structuredData.medications) 
          ? JSON.stringify(structuredData.medications, null, 2) 
          : structuredData.medications
      );
    }
  }, [structuredData?.medications]);

  // Display appropriate loading state based on what's happening
  if (loading || processingText) {
    return (
      <Layout>
        <div className="container mx-auto py-4 px-4">
          <StructuredOutputHeader 
            onBack={handleBackClick} 
            subtitle="Processing your transcription..."
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
          
          <LoadingState 
            message={processingText ? "Converting your transcription into structured medical notes..." : "Preparing your medical documentation"} 
            subMessage={processingText ? "Our AI is analyzing your transcription and creating multiple format options. This typically takes 30-60 seconds." : "Loading your structured data..."}
          />
        </div>
      </Layout>
    );
  }

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
          loading={false}
          processingText={false}
          structuredData={structuredData}
          error={error}
          patientInfo={{
            ...patientInfo,
            dateOfBirth: patientDetails.dateOfBirth,
            age: patientDetails.age,
            gender: patientDetails.gender
          }}
          user={user}
          transcriptionId={transcriptionId || ''}
          isEditMode={isEditMode}
          onToggleEditMode={handleToggleEditMode}
          onSaveEdit={handleSaveEdit}
          onRetry={handleRetry}
          onNoteSaved={handleNoteSaved}
          onEndConsult={handleEndConsult}
          noteSaved={noteSaved}
          formattedVersions={formattedVersions}
          activeFormatType={activeFormatType}
          onFormatTypeChange={handleFormatTypeChange}
          onToggleFormatSelection={toggleFormatSelection}
          refreshData={refreshData}
        />
      </div>
    </Layout>
  );
}
