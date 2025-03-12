
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const TranscriptionError = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>No Transcription Found</CardTitle>
            <CardDescription>
              There was an issue loading your transcription data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Please return to the upload page and try again.</p>
            <Button 
              className="bg-primary text-white px-4 py-2 rounded"
              onClick={() => navigate('/upload')}
            >
              Return to Upload
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TranscriptionError;
