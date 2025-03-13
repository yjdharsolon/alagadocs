
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Upload, FileText, List } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>How to get structured medical notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-medium">You can try one of these options:</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col items-center p-4 border rounded-md bg-gray-50">
                <Upload className="h-10 w-10 text-primary mb-2" />
                <h3 className="font-medium">Start a new transcription</h3>
                <p className="text-sm text-muted-foreground mb-3">Upload a new audio file to transcribe</p>
                <Button onClick={() => navigate('/upload')} className="mt-auto">
                  Upload Audio
                </Button>
              </div>
              
              <div className="flex flex-col items-center p-4 border rounded-md bg-gray-50">
                <List className="h-10 w-10 text-primary mb-2" />
                <h3 className="font-medium">View your transcriptions</h3>
                <p className="text-sm text-muted-foreground mb-3">Access your previous transcriptions</p>
                <Button variant="outline" onClick={() => navigate('/transcribe')} className="mt-auto">
                  View Transcriptions
                </Button>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              If you're experiencing persistent issues, please contact support for assistance.
            </p>
            <Button variant="link" onClick={() => window.history.back()} className="text-sm">
              ← Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoDataView;
