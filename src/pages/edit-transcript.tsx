
import React from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import AudioPlayer from '@/components/transcription/AudioPlayer';
import TranscriptionEditor from '@/components/transcription/TranscriptionEditor';
import { useTranscriptionEdit } from '@/hooks/useTranscriptionEdit';

export default function EditTranscriptPage() {
  const location = useLocation();
  
  const {
    transcriptionText,
    audioUrl,
    isSaving,
    setTranscriptionText,
    handleSave,
    handleContinueToStructured
  } = useTranscriptionEdit(location.state);

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Edit Transcription</h1>
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
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
