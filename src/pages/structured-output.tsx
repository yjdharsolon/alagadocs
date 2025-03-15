
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import StructuredOutputHeader from '@/components/structured-output/StructuredOutputHeader';
import DocumentView from '@/components/structured-output/DocumentView';
import EditableDocumentView from '@/components/structured-output/EditableDocumentView';
import { MedicalSections, StructuredNote } from '@/components/structured-output/types';
import LoadingState from '@/components/structured-output/LoadingState';
import NoDataView from '@/components/structured-output/NoDataView';
import { SaveNoteButton } from '@/components/structured-output/buttons/SaveNoteButton';
import CopyButton from '@/components/structured-output/buttons/CopyButton';
import ExportButton from '@/components/structured-output/buttons/ExportButton';
import EditButton from '@/components/structured-output/buttons/EditButton';
import { getStructuredNoteById } from '@/services/structuredNoteService';
import { structureText } from '@/services/structureService';
import { toast } from 'sonner';

export default function StructuredOutputPage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const noteId = searchParams.get('noteId');
  
  const [loading, setLoading] = useState(true);
  const [processingText, setProcessingText] = useState(false);
  const [structuredData, setStructuredData] = useState<MedicalSections | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get all potential sources of patient information
  const transcriptionData = location.state?.transcriptionData;
  const audioUrl = location.state?.audioUrl;
  const transcriptionId = location.state?.transcriptionId;
  
  // Check for patient info from location state first (highest priority)
  const statePatientId = location.state?.patientId;
  const statePatientName = location.state?.patientName;
  
  // Then check transcriptionData (medium priority)
  const transcriptionPatientId = transcriptionData?.patient_id;
  
  // Finally, try to get from sessionStorage as fallback (lowest priority)
  const [patientInfo, setPatientInfo] = useState<{id: string | null, name: string | null}>({
    id: null,
    name: null
  });
  
  // Consolidate patient information from all possible sources
  useEffect(() => {
    // First priority: Use data from location state
    if (statePatientId) {
      setPatientInfo({
        id: statePatientId,
        name: statePatientName || null
      });
      return;
    }
    
    // Second priority: Use data from transcription
    if (transcriptionPatientId) {
      setPatientInfo({
        id: transcriptionPatientId,
        name: null // We don't have the name from transcription data
      });
      return;
    }
    
    // Third priority: Try to get from sessionStorage
    try {
      const storedPatient = sessionStorage.getItem('selectedPatient');
      if (storedPatient) {
        const patientData = JSON.parse(storedPatient);
        setPatientInfo({
          id: patientData.id,
          name: `${patientData.first_name} ${patientData.last_name}`
        });
      }
    } catch (error) {
      console.error('Error retrieving patient from sessionStorage:', error);
    }
  }, [statePatientId, statePatientName, transcriptionPatientId]);

  console.log('StructuredOutputPage patientInfo:', patientInfo);

  useEffect(() => {
    const loadNote = async () => {
      if (noteId) {
        try {
          setLoading(true);
          const note = await getStructuredNoteById(noteId);
          if (note?.content) {
            setStructuredData(note.content);
          } else {
            setError('Note not found');
          }
        } catch (error) {
          console.error('Error loading note:', error);
          setError('Error loading note');
        } finally {
          setLoading(false);
        }
      } else if (location.state?.structuredData) {
        setStructuredData(location.state.structuredData);
        setLoading(false);
      } else if (transcriptionData && transcriptionData.text) {
        processTranscription();
      } else {
        setLoading(false);
        setError('No transcription data found');
      }
    };

    loadNote();
  }, [noteId, location.state]);

  const processTranscription = async () => {
    if (!transcriptionData || !transcriptionData.text) {
      setError('Missing transcription text');
      setLoading(false);
      return;
    }
    
    try {
      setProcessingText(true);
      console.log('Processing transcription:', transcriptionData.text);
      
      const structuredResult = await structureText(transcriptionData.text);
      
      if (structuredResult) {
        console.log('Structured result received:', structuredResult);
        setStructuredData(structuredResult);
        toast.success('Medical notes structured successfully');
      } else {
        throw new Error('No structured data returned');
      }
    } catch (error: any) {
      console.error('Error processing transcription:', error);
      setError(`Failed to structure the transcription: ${error.message}`);
      toast.error('Failed to structure the transcription');
    } finally {
      setProcessingText(false);
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    if (transcriptionData) {
      navigate('/edit-transcript', { 
        state: { 
          transcriptionData,
          audioUrl,
          patientId: patientInfo.id,
          patientName: patientInfo.name
        } 
      });
    } else {
      navigate('/select-patient');
    }
  };

  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSaveEdit = (updatedData: MedicalSections) => {
    setStructuredData(updatedData);
    setIsEditMode(false);
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    processTranscription();
  };

  const getStructuredText = () => {
    if (!structuredData) return '';
    
    return Object.entries(structuredData)
      .map(([key, value]) => {
        const title = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .toUpperCase();
        
        return `${title}:\n${value}\n`;
      })
      .join('\n');
  };

  const structuredText = getStructuredText();
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-6 px-4">
          <StructuredOutputHeader onBack={handleBackClick} />
          <LoadingState 
            message={processingText ? "Processing transcription..." : "Loading structured data..."} 
            subMessage={processingText ? "Converting your transcription into structured medical notes. This may take a moment." : undefined}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <StructuredOutputHeader 
          onBack={handleBackClick} 
          subtitle={transcriptionData?.text ? `Based on transcription: "${transcriptionData.text.substring(0, 40)}${transcriptionData.text.length > 40 ? '...' : ''}"` : undefined}
        />
        
        {!structuredData ? (
          <NoDataView error={error} onRetry={handleRetry} />
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Medical Report {patientInfo.name ? 
                  `for ${patientInfo.name}` : 
                  patientInfo.id ? `(Patient ID: ${patientInfo.id})` : ''}
              </h2>
              
              <div className="flex gap-2">
                {!isEditMode ? (
                  <>
                    <SaveNoteButton 
                      user={user} 
                      sections={structuredData}
                      structuredText={structuredText}
                      patientId={patientInfo.id}
                      transcriptionId={transcriptionId || ''}
                    />
                    <CopyButton sections={structuredData} />
                    <ExportButton sections={structuredData} />
                    <EditButton onClick={handleToggleEditMode} />
                  </>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={handleToggleEditMode}
                  >
                    Cancel Editing
                  </Button>
                )}
              </div>
            </div>
            
            <Separator className="my-4" />
            
            {isEditMode ? (
              <EditableDocumentView 
                structuredData={structuredData} 
                onSave={handleSaveEdit}
              />
            ) : (
              <DocumentView structuredData={structuredData} />
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
