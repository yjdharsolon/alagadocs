
import React from 'react';
import TranscriptionEditor from '@/components/transcription/TranscriptionEditor';
import AudioPlayer from '@/components/transcription/AudioPlayer';

interface EditStepProps {
  audioUrl: string;
  transcriptionText: string;
  onTranscriptionChange: (text: string) => void;
  onSave: () => void;
  onContinueToStructured: () => void;
  isSaving: boolean;
  saveError?: string | null;
  saveSuccess?: boolean;
}

const EditStep: React.FC<EditStepProps> = ({
  audioUrl,
  transcriptionText,
  onTranscriptionChange,
  onSave,
  onContinueToStructured,
  isSaving,
  saveError,
  saveSuccess
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <AudioPlayer audioUrl={audioUrl} />
      </div>
      
      <div className="lg:col-span-2">
        <TranscriptionEditor
          transcriptionText={transcriptionText}
          onTranscriptionChange={onTranscriptionChange}
          onSave={onSave}
          onContinueToStructured={onContinueToStructured}
          isSaving={isSaving}
          saveError={saveError}
          saveSuccess={saveSuccess}
        />
      </div>
    </div>
  );
};

export default EditStep;
