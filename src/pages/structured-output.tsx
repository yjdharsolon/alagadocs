import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clipboard, Download, Pencil } from 'lucide-react';
import StructuredOutputHeader from '@/components/structured-output/StructuredOutputHeader';
import DocumentView from '@/components/structured-output/DocumentView';
import EditableDocumentView from '@/components/structured-output/EditableDocumentView';
import { MedicalSections, StructuredNote } from '@/components/structured-output/types';
import LoadingState from '@/components/structured-output/LoadingState';
import NoDataView from '@/components/structured-output/NoDataView';
import { SaveNoteButton } from '@/components/structured-output/buttons/SaveNoteButton';
import CopyButton from '@/components/structured-output/buttons/CopyButton';
import ExportButton from '@/components/structured-output/buttons/ExportButton';
import ViewNotesButton from '@/components/structured-output/buttons/ViewNotesButton';
import EditButton from '@/components/structured-output/buttons/EditButton';
import { getStructuredNoteById } from '@/services/structuredNoteService';

export default function StructuredOutputPage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const noteId = searchParams.get('noteId');
  
  const [loading, setLoading] = useState(true);
  const [structuredData, setStructuredData] = useState<MedicalSections | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const transcriptionData = location.state?.transcriptionData;
  const audioUrl = location.state?.audioUrl;
  const transcriptionId = location.state?.transcriptionId;
  const patientId = location.state?.patientId || 
    (transcriptionData?.patient_id ? transcriptionData.patient_id : null);

  useEffect(() => {
    const loadNote = async () => {
      if (noteId) {
        try {
          setLoading(true);
          const note = await getStructuredNoteById(noteId);
          if (note?.content) {
            setStructuredData(note.content);
          }
        } catch (error) {
          console.error('Error loading note:', error);
        } finally {
          setLoading(false);
        }
      } else if (location.state?.structuredData) {
        setStructuredData(location.state.structuredData);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    loadNote();
  }, [noteId, location.state]);

  const handleBackClick = () => {
    if (transcriptionData) {
      navigate('/edit-transcript', { 
        state: { 
          transcriptionData,
          audioUrl 
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
    return <LoadingState message="Loading structured data..." />;
  }

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <StructuredOutputHeader onBack={handleBackClick} />
        
        {!structuredData ? (
          <NoDataView />
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Medical Report
              </h2>
              
              <div className="flex gap-2">
                {!isEditMode ? (
                  <>
                    <SaveNoteButton 
                      user={user} 
                      sections={structuredData}
                      structuredText={structuredText}
                      patientId={patientId}
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
