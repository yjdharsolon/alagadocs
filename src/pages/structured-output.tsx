
import React from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import StructuredOutputHeader from '@/components/structured-output/StructuredOutputHeader';
import StructuredOutputContent from '@/components/structured-output/StructuredOutputContent';
import { useStructuredOutputPage } from '@/hooks/useStructuredOutput/index';
import { useStructuredOutputData } from '@/hooks/useStructuredOutputData';

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

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <StructuredOutputHeader 
          onBack={handleBackClick} 
          subtitle={transcriptionData?.text ? `Based on transcription: "${transcriptionData.text.substring(0, 40)}${transcriptionData.text.length > 40 ? '...' : ''}"` : undefined}
        />
        
        <StructuredOutputContent
          loading={loading}
          processingText={processingText}
          structuredData={structuredData}
          error={error}
          patientInfo={patientInfo}
          user={user}
          transcriptionId={transcriptionId || ''}
          isEditMode={isEditMode}
          onToggleEditMode={handleToggleEditMode}
          onSaveEdit={handleSaveEdit}
          onRetry={handleRetry}
          onNoteSaved={handleNoteSaved}
          noteSaved={noteSaved}
        />
      </div>
    </Layout>
  );
}
