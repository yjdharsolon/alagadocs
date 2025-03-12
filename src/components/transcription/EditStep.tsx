
import React, { useEffect } from 'react';
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
  useEffect(() => {
    // Log when component mounts to verify it's being rendered
    console.log("EditStep rendered with text:", transcriptionText?.substring(0, 50));
    console.log("Audio URL:", audioUrl);
  }, [transcriptionText, audioUrl]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <AudioPlayer audioUrl={audioUrl || ''} />
        
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Tips:</h3>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Use the Edit tab to correct transcription errors</li>
            <li>• Switch to the Format tab to structure your text as a clinical note</li>
            <li>• Choose from different note types like SOAP, Consultation, etc.</li>
            <li>• You can edit the formatted text before saving</li>
          </ul>
        </div>
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
