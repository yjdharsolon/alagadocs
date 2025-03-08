import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { structureText } from '@/services/transcriptionService';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import DocumentCard from '@/components/structured-output/DocumentCard';
import DocumentTabs from '@/components/structured-output/DocumentTabs';
import ActionButtons from '@/components/structured-output/ActionButtons';
import LoadingState from '@/components/structured-output/LoadingState';
import { MedicalSections } from '@/components/structured-output/types';

// Define a proper interface for MedicalSection items that will be used in this component
interface MedicalSection {
  id: string;
  title: string;
  content: string;
}

export default function StructuredOutputPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [transcriptionText, setTranscriptionText] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [sections, setSections] = useState<MedicalSection[]>([]);
  
  useEffect(() => {
    const textFromState = location.state?.transcriptionText;
    const audioUrlFromState = location.state?.audioUrl;
    
    if (!textFromState) {
      toast.error('No transcription to structure. Please transcribe audio first.');
      navigate('/upload');
      return;
    }
    
    setTranscriptionText(textFromState);
    if (audioUrlFromState) setAudioUrl(audioUrlFromState);
    
    // Start structuring process
    structureTranscription(textFromState);
  }, [location.state, navigate]);
  
  const structureTranscription = async (text: string) => {
    try {
      setIsLoading(true);
      
      // Get the user's selected role from localStorage or use a default
      const userRole = localStorage.getItem('userRole') || 'doctor';
      
      // Get structured text from the service
      const structuredText = await structureText(text, userRole);
      
      // Parse the structured text into sections
      const parsedSections = parseStructuredText(structuredText);
      setSections(parsedSections);
      
    } catch (error) {
      console.error('Error structuring text:', error);
      toast.error('Error structuring text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to parse the structured text into sections
  const parseStructuredText = (text: string): MedicalSection[] => {
    // This is a simple parser that assumes each section starts with a heading
    // A more robust parser would be needed for production
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const sections: MedicalSection[] = [];
    let currentSection: MedicalSection | null = null;
    
    for (const line of lines) {
      // If line is a heading (assuming headings are in all caps or start with #)
      if (line.toUpperCase() === line || line.startsWith('#')) {
        // If we've been building a section, push it
        if (currentSection) {
          sections.push(currentSection);
        }
        
        // Start a new section
        const title = line.replace(/^#\s*/, '').trim();
        currentSection = {
          id: title.toLowerCase().replace(/\s+/g, '-'),
          title,
          content: ''
        };
      } else if (currentSection) {
        // Add content to the current section
        currentSection.content += (currentSection.content ? '\n' : '') + line;
      }
    }
    
    // Don't forget the last section
    if (currentSection) {
      sections.push(currentSection);
    }
    
    return sections;
  };
  
  const handleSaveDocument = () => {
    // Here we would save the document to the database
    toast.success('Document saved successfully');
  };
  
  const handleCopyDocument = () => {
    // Create a formatted string from all sections
    const formattedText = sections
      .map(section => `${section.title}\n${section.content}\n`)
      .join('\n');
    
    navigator.clipboard.writeText(formattedText)
      .then(() => toast.success('Document copied to clipboard'))
      .catch(() => toast.error('Failed to copy document'));
  };
  
  const handleEditSection = (sectionId: string, newContent: string) => {
    setSections(prevSections => 
      prevSections.map(section => 
        section.id === sectionId ? { ...section, content: newContent } : section
      )
    );
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Structured Medical Document</h1>
          <p className="text-muted-foreground mb-6">
            Your transcription has been formatted into a professional medical document
          </p>
          
          {isLoading ? (
            <LoadingState />
          ) : (
            <div className="grid gap-6">
              <DocumentCard 
                user={user}
                sections={sections as unknown as MedicalSections}
                structuredText={transcriptionText}
                handleEdit={() => {}}
              />
              
              <DocumentTabs 
                sections={sections as unknown as MedicalSections}
              />
              
              <ActionButtons 
                user={user}
                sections={sections as unknown as MedicalSections}
                structuredText={transcriptionText}
                handleEdit={() => {}}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
