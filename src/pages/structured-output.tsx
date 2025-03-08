
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { structureText } from '@/services/transcriptionService';
import { parseStructuredText } from '@/utils/textParser';
import LoadingState from '@/components/structured-output/LoadingState';
import DocumentCard from '@/components/structured-output/DocumentCard';
import { MedicalSections } from '@/components/structured-output/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const StructuredOutputPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [structuredText, setStructuredText] = useState<string>('');
  const [sections, setSections] = useState<MedicalSections>({
    chiefComplaint: '',
    historyOfPresentIllness: '',
    pastMedicalHistory: '',
    medications: '',
    allergies: '',
    physicalExamination: '',
    assessment: '',
    plan: ''
  });
  const [timestamp, setTimestamp] = useState<string>('');
  
  const transcription = location.state?.transcription;
  const userRole = location.state?.userRole || localStorage.getItem('userRole') || 'doctor';
  
  useEffect(() => {
    if (!transcription) {
      toast.error('No transcription provided');
      navigate('/upload');
      return;
    }
    
    // If there's already structured text in the location state, use that
    if (location.state?.structuredText) {
      setSections(location.state.structuredText);
      setStructuredText(typeof location.state.structuredText === 'string' 
        ? location.state.structuredText 
        : JSON.stringify(location.state.structuredText));
      setTimestamp(location.state.timestamp || new Date().toISOString());
      setLoading(false);
      return;
    }
    
    // Call the GPT API to structure the text
    generateStructuredText();
  }, [transcription]);
  
  const generateStructuredText = async () => {
    try {
      setLoading(true);
      const result = await structureText(transcription, userRole);
      setStructuredText(result);
      
      // Parse the structured text into sections
      const parsedSections = parseStructuredText(result);
      setSections(parsedSections);
      
      // Set current timestamp
      setTimestamp(new Date().toISOString());
      
      toast.success('Text structured successfully!');
    } catch (error: any) {
      console.error('Error structuring text:', error);
      toast.error(error.message || 'Error structuring text');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = () => {
    navigate('/edit-transcript', { 
      state: { 
        structuredText: sections,
        transcription,
        userRole,
        timestamp
      } 
    });
  };
  
  if (loading) {
    return (
      <Layout>
        <LoadingState />
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Structured Medical Notes</h1>
        
        <Alert className="mb-6 max-w-3xl mx-auto">
          <Info className="h-4 w-4" />
          <AlertTitle>Role-based formatting</AlertTitle>
          <AlertDescription>
            Notes are formatted based on your selected role: <strong>{userRole}</strong>
          </AlertDescription>
        </Alert>
        
        <DocumentCard 
          user={user}
          sections={sections}
          structuredText={structuredText}
          handleEdit={handleEdit}
          timestamp={timestamp}
        />
      </div>
    </Layout>
  );
};

export default StructuredOutputPage;
