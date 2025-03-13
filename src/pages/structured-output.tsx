
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { formatClipboardText } from '@/components/structured-output/utils/exportUtils';
import DocumentTabs from '@/components/structured-output/DocumentTabs';
import LoadingState from '@/components/structured-output/LoadingState';
import StructuredOutputHeader from '@/components/structured-output/StructuredOutputHeader';
import StructuredOutputActions from '@/components/structured-output/StructuredOutputActions';
import NoDataView from '@/components/structured-output/NoDataView';
import { useStructuredOutput } from '@/hooks/useStructuredOutput';
import toast from 'react-hot-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { getTranscription } from '@/services/transcriptionService';
import EditableDocumentView from '@/components/structured-output/EditableDocumentView';

export default function StructuredOutput() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Get data from location state or search params
  const transcriptionData = location.state?.transcriptionData;
  const transcriptionId = location.state?.transcriptionId || searchParams.get('id');
  const audioUrl = location.state?.audioUrl;
  
  const [isLoadingTranscription, setIsLoadingTranscription] = useState(false);
  const [loadedTranscription, setLoadedTranscription] = useState<any>(null);
  
  // Fetch transcription if no data but ID is available
  useEffect(() => {
    async function fetchTranscription() {
      if (!transcriptionData && transcriptionId) {
        try {
          setIsLoadingTranscription(true);
          console.log('Fetching transcription with ID:', transcriptionId);
          const data = await getTranscription(transcriptionId);
          console.log('Loaded transcription data:', data);
          setLoadedTranscription(data);
          setIsLoadingTranscription(false);
        } catch (error) {
          console.error('Error fetching transcription:', error);
          setIsLoadingTranscription(false);
          toast.error('Failed to fetch transcription data');
        }
      }
    }
    
    fetchTranscription();
  }, [transcriptionId, transcriptionData]);
  
  // Use the refactored hook
  const {
    user,
    loading,
    processingText,
    structuredData,
    templates,
    error,
    isEditMode,
    handleBackToTranscription,
    handleTemplateSelect,
    handleEdit,
    updateStructuredData,
    handleToggleEditMode
  } = useStructuredOutput({
    transcriptionData: loadedTranscription || transcriptionData,
    transcriptionId: transcriptionId || 'no-id',
    audioUrl
  });
  
  // Handle copy to clipboard functionality
  const handleCopyToClipboard = () => {
    if (!structuredData) return;
    
    const formattedText = formatClipboardText(structuredData);
    
    navigator.clipboard.writeText(formattedText)
      .then(() => {
        toast.success('Copied to clipboard');
      })
      .catch(() => toast.error('Failed to copy to clipboard'));
  };
  
  // Show combined loading state if either fetching transcription or processing it
  const isLoading = loading || isLoadingTranscription;
  const isProcessing = processingText;
  
  // Check if we have no data to show at all
  const noDataToShow = !isLoading && 
                       !isProcessing && 
                       !structuredData && 
                       (!transcriptionData && !loadedTranscription);
  
  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <StructuredOutputHeader onBack={handleBackToTranscription} />
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {isLoading || isProcessing ? (
          <LoadingState message={isProcessing ? "Structuring your medical notes..." : "Loading your structured notes..."} />
        ) : structuredData ? (
          <>
            {isEditMode ? (
              <EditableDocumentView 
                structuredData={structuredData}
                onSave={updateStructuredData}
              />
            ) : (
              <DocumentTabs structuredData={structuredData} />
            )}
            
            <StructuredOutputActions 
              onEdit={handleEdit}
              onCopy={handleCopyToClipboard}
              templates={templates}
              onTemplateSelect={handleTemplateSelect}
              user={user}
              structuredData={structuredData}
              onToggleEditMode={handleToggleEditMode}
              isEditMode={isEditMode}
            />
          </>
        ) : (
          <NoDataView />
        )}
      </div>
    </Layout>
  );
}
