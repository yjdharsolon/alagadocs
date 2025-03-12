
import React from 'react';
import Layout from '@/components/Layout';
import { Loader2 } from 'lucide-react';

const LoadingTranscription = () => {
  return (
    <Layout>
      <div className="container mx-auto py-10 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p className="text-xl font-semibold mb-2">Processing Your Audio</p>
        <p className="text-muted-foreground">Please wait while we prepare your transcription...</p>
      </div>
    </Layout>
  );
};

export default LoadingTranscription;
