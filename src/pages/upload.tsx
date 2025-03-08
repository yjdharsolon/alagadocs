
import React from 'react';
import Layout from '@/components/Layout';
import { UploadForm } from '@/components/upload/UploadForm';

export default function AudioUploadPage() {
  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-2">Upload Audio</h1>
        <p className="text-muted-foreground mb-6">
          Upload an audio file or record your voice to transcribe
        </p>
        
        <UploadForm />
      </div>
    </Layout>
  );
}
