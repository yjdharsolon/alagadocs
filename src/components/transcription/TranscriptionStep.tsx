
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TranscriptionStepProps {
  transcriptionData: any;
  audioUrl: string;
  onStartEditing: () => void;
}

const TranscriptionStep: React.FC<TranscriptionStepProps> = ({
  transcriptionData,
  audioUrl,
  onStartEditing
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardContent className="p-6">
            <div className="prose max-w-none">
              <h2 className="text-lg font-medium mb-4">Transcribed Text</h2>
              <div className="whitespace-pre-wrap bg-muted p-4 rounded-md">
                {transcriptionData.text}
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={onStartEditing}>
                Edit Transcription
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardContent className="p-6">
            <h2 className="text-lg font-medium mb-4">Audio Recording</h2>
            
            {audioUrl ? (
              <div className="flex flex-col items-center">
                <audio 
                  src={audioUrl} 
                  controls 
                  className="w-full mb-4"
                ></audio>
                <p className="text-sm text-muted-foreground text-center">
                  You can replay the audio to check the accuracy of the transcription.
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">No audio available</p>
              </div>
            )}
            
            <div className="mt-6">
              <h3 className="text-md font-medium mb-2">Transcription Details</h3>
              <div className="text-sm">
                <p><span className="font-medium">Duration:</span> {transcriptionData.duration?.toFixed(2) || 'N/A'} seconds</p>
                <p><span className="font-medium">Language:</span> {transcriptionData.language || 'English'}</p>
                <p><span className="font-medium">Created:</span> {new Date().toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TranscriptionStep;
