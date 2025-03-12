
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const PendingTranscription = () => {
  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-2">Processing Transcription</h1>
        <p className="text-muted-foreground mb-6">
          Your audio is being transcribed. Please wait...
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Audio Processing</CardTitle>
                <CardDescription>
                  Your audio is being analyzed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p className="text-sm">Transcribing audio to text...</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Transcription</CardTitle>
                <CardDescription>
                  Text will appear here once processing is complete
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-[90%] mb-2" />
                <Skeleton className="h-4 w-[80%] mb-2" />
                <Skeleton className="h-4 w-[85%] mb-2" />
                <Skeleton className="h-4 w-[75%]" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PendingTranscription;
