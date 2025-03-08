import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { structureText, saveStructuredText, getStructuredText } from '@/services/structuredTextService';
import DocumentTabs from '@/components/structured-output/DocumentTabs';
import LoadingState from '@/components/structured-output/LoadingState';
import ActionButtons from '@/components/structured-output/ActionButtons';
import { StructuredNote } from '@/components/structured-output/types';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { formatClipboardText } from '@/components/structured-output/utils/exportUtils';

export default function StructuredOutput() {
  const { user, getUserRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [structuredData, setStructuredData] = useState<StructuredNote | null>(null);
  const [processingText, setProcessingText] = useState(false);
  
  const transcriptionData = location.state?.transcriptionData;
  const transcriptionId = location.state?.transcriptionId;
  const audioUrl = location.state?.audioUrl;
  
  useEffect(() => {
    const processTranscription = async () => {
      if (!transcriptionData || !transcriptionId || !user) {
        setLoading(false);
        return;
      }
      
      try {
        const existingData = await getStructuredText(transcriptionId);
        
        if (existingData?.content) {
          setStructuredData(existingData.content);
          setLoading(false);
          return;
        }
        
        setProcessingText(true);
        const userRole = await getUserRole();
        const structuredResult = await structureText(transcriptionData.text, userRole);
        
        if (structuredResult) {
          setStructuredData(structuredResult);
          
          await saveStructuredText(user.id, transcriptionId, structuredResult);
          toast.success('Medical notes structured successfully');
        }
      } catch (error) {
        console.error('Error processing transcription:', error);
        toast.error('Failed to structure the transcription. Please try again.');
      } finally {
        setProcessingText(false);
        setLoading(false);
      }
    };
    
    processTranscription();
  }, [transcriptionData, transcriptionId, user, getUserRole]);
  
  if (!loading && (!transcriptionData || !transcriptionId)) {
    toast.error('No transcription data found. Please upload an audio file first.');
    navigate('/upload');
    return null;
  }
  
  const handleBackToTranscription = () => {
    navigate('/transcribe', { 
      state: { 
        transcriptionData,
        transcriptionId,
        audioUrl
      } 
    });
  };
  
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
        <div className="mb-6 flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={handleBackToTranscription}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Transcription
          </Button>
          
          <h1 className="text-2xl font-bold">Structured Medical Notes</h1>
          
          <div className="w-[100px]"></div>
        </div>
        
        {loading || processingText ? (
          <LoadingState message={processingText ? "Structuring your medical notes..." : "Loading..."} />
        ) : structuredData ? (
          <>
            <DocumentTabs structuredData={structuredData} />
            <ActionButtons 
              onCopy={handleCopyToClipboard}
              onEdit={() => navigate('/edit-transcript', { 
                state: { 
                  structuredData,
                  transcriptionId,
                  audioUrl
                } 
              })}
              user={user}
              sections={structuredData}
              structuredText={JSON.stringify(structuredData)}
            />
          </>
        ) : (
          <div className="text-center p-10">
            <p className="text-lg text-gray-600 mb-4">
              No structured data available. There was an error processing your transcription.
            </p>
            <Button onClick={() => navigate('/upload')}>
              Upload New Audio
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
