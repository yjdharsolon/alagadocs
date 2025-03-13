
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

export default function StructuredOutput() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const transcriptionData = location.state?.transcriptionData;
  const transcriptionId = location.state?.transcriptionId;
  const audioUrl = location.state?.audioUrl;
  
  const {
    user,
    loading,
    processingText,
    structuredData,
    templates,
    error,
    handleBackToTranscription,
    handleTemplateSelect,
    handleEdit
  } = useStructuredOutput({
    transcriptionData,
    transcriptionId,
    audioUrl
  });
  
  // If no data and not loading, redirect to upload
  React.useEffect(() => {
    if (!loading && !processingText && !transcriptionData && !transcriptionId) {
      toast.error('No transcription data found. Please upload an audio file first.');
      navigate('/upload');
    }
  }, [loading, processingText, transcriptionData, transcriptionId, navigate]);
  
  const handleCopyToClipboard = () => {
    if (!structuredData) return;
    
    const formattedText = formatClipboardText(structuredData);
    
    navigator.clipboard.writeText(formattedText)
      .then(() => {
        toast.success('Copied to clipboard');
      })
      .catch(() => toast.error('Failed to copy to clipboard'));
  };
  
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
        
        {loading || processingText ? (
          <LoadingState message={processingText ? "Structuring your medical notes..." : "Loading your structured notes..."} />
        ) : structuredData ? (
          <>
            <DocumentTabs structuredData={structuredData} />
            <StructuredOutputActions 
              onEdit={handleEdit}
              onCopy={handleCopyToClipboard}
              templates={templates}
              onTemplateSelect={handleTemplateSelect}
              user={user}
              structuredData={structuredData}
            />
          </>
        ) : (
          <NoDataView />
        )}
      </div>
    </Layout>
  );
}
