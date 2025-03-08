
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import AudioPlayer from '@/components/transcription/AudioPlayer';
import TranscriptionEditor from '@/components/transcription/TranscriptionEditor';
import { useTranscriptionEdit } from '@/hooks/useTranscriptionEdit';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function EditTranscriptPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const {
    transcriptionText,
    audioUrl,
    isSaving,
    error,
    saveSuccess,
    setTranscriptionText,
    handleSave,
    handleContinueToStructured
  } = useTranscriptionEdit(location.state);

  const handleBack = () => {
    navigate('/transcribe', { state: location.state });
  };

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleBack}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Edit Transcription</h1>
          </div>
          
          <p className="text-muted-foreground mb-6">
            Review and edit your transcription while listening to the audio
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Audio Player */}
            <div className="md:col-span-1">
              <AudioPlayer audioUrl={audioUrl} />
            </div>
            
            {/* Transcription Editor */}
            <div className="md:col-span-2">
              <TranscriptionEditor
                transcriptionText={transcriptionText}
                onTranscriptionChange={setTranscriptionText}
                onSave={handleSave}
                onContinueToStructured={handleContinueToStructured}
                isSaving={isSaving}
                saveError={error}
                saveSuccess={saveSuccess}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
