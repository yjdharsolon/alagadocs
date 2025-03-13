
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const NoDataView = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-10 space-y-6">
      <Alert variant="destructive" className="max-w-lg mx-auto">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle>No structured data available</AlertTitle>
        <AlertDescription>
          There was an error processing your transcription or no transcription data was found.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-2">
        <p className="text-lg text-muted-foreground">
          You can try one of these options to continue:
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
          <Button onClick={() => navigate('/upload')} className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload New Audio
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate('/transcribe')}
          >
            Return to Transcription
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NoDataView;
