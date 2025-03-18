
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowUp, List, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NoDataViewProps {
  error?: string | null;
  onRetry?: () => void;
}

const NoDataView = ({ error, onRetry }: NoDataViewProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-6 space-y-6 max-w-4xl mx-auto">
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle className="text-center">How to get structured medical notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            {error && (
              <div className="text-destructive mb-4 p-4 border border-destructive/30 rounded bg-destructive/10">
                <p>Error: {error}</p>
              </div>
            )}
            
            <p className="text-muted-foreground">You can try one of these options:</p>
            
            {onRetry && (
              <div className="flex justify-center my-4">
                <Button onClick={onRetry} className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Retry Structuring
                </Button>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="flex flex-col items-center p-6 border rounded-md bg-secondary">
                <ArrowUp className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-medium mb-2">Start a new transcription</h3>
                <p className="text-sm text-muted-foreground mb-4">Upload a new audio file to transcribe</p>
                <Button onClick={() => navigate('/upload')}>
                  Upload Audio
                </Button>
              </div>
              
              <div className="flex flex-col items-center p-6 border rounded-md bg-secondary">
                <List className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-medium mb-2">View your transcriptions</h3>
                <p className="text-sm text-muted-foreground mb-4">Access your previous transcriptions</p>
                <Button variant="outline" onClick={() => navigate('/transcribe')} className="border-primary text-primary hover:bg-primary/10">
                  View Transcriptions
                </Button>
              </div>
            </div>
          </div>
          
          <div className="pt-4 text-sm text-muted-foreground">
            <p>If you're experiencing persistent issues, please contact support for assistance.</p>
            <Button variant="link" onClick={() => window.history.back()} className="text-primary">
              ← Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoDataView;
