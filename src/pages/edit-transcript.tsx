
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import AudioPlayer from '@/components/transcription/AudioPlayer';
import TranscriptionEditor from '@/components/transcription/TranscriptionEditor';
import { useTranscriptionEdit } from '@/hooks/useTranscriptionEdit';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bot, AlertCircle, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function EditTranscriptPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  
  const {
    transcriptionText,
    audioUrl,
    isSaving,
    error,
    saveSuccess,
    setTranscriptionText,
    handleSave,
    handleContinueToStructured
  } = useTranscriptionEdit(location.state);

  const handleBack = () => {
    navigate('/transcribe', { state: location.state });
  };
  
  const handleAiAssistRequest = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a question or request for the AI assistant.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      setAiError(null);
      
      // Use our current transcription text as context
      const fullPrompt = `Here is a medical transcription: "${transcriptionText}"\n\nRequest: ${aiPrompt}`;
      
      const { data, error } = await supabase.functions.invoke('medical-ai-chat', {
        body: { prompt: fullPrompt, type: 'analyze' }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      setAiResponse(data.message);
    } catch (err) {
      console.error('Error getting AI assistance:', err);
      setAiError(err instanceof Error ? err.message : 'Failed to process your request');
      toast({
        title: "Error",
        description: "Failed to get AI assistance. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleBack}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-3xl font-bold">Edit Transcription</h1>
            </div>
            
            <Button
              variant={showAiAssistant ? "secondary" : "outline"}
              onClick={() => setShowAiAssistant(!showAiAssistant)}
              className="gap-2"
            >
              {showAiAssistant ? (
                <>
                  <X className="h-4 w-4" />
                  Hide AI Assistant
                </>
              ) : (
                <>
                  <Bot className="h-4 w-4" />
                  AI Assistant
                </>
              )}
            </Button>
          </div>
          
          <p className="text-muted-foreground mb-6">
            Review and edit your transcription while listening to the audio
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Audio Player */}
            <div className="lg:col-span-1">
              <AudioPlayer audioUrl={audioUrl} />
              
              {/* AI Assistant Section */}
              {showAiAssistant && (
                <Card className="mt-6 p-4">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <Bot className="h-4 w-4 mr-2" />
                    AI Medical Assistant
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Ask questions about the transcription or get analysis
                  </p>
                  
                  <Textarea 
                    placeholder="E.g., What medication is mentioned? Or, Analyze this patient case."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="mb-3"
                    rows={3}
                  />
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleAiAssistRequest}
                      disabled={isProcessing || !aiPrompt.trim()}
                      className="w-full"
                    >
                      {isProcessing ? 'Processing...' : 'Get AI Analysis'}
                    </Button>
                  </div>
                  
                  {aiError && (
                    <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md flex items-start">
                      <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{aiError}</p>
                    </div>
                  )}
                  
                  {aiResponse && (
                    <div className="mt-4">
                      <Separator className="my-3" />
                      <h4 className="font-medium mb-2">AI Response:</h4>
                      <div className="p-3 bg-muted rounded-md text-sm whitespace-pre-wrap">
                        {aiResponse}
                      </div>
                    </div>
                  )}
                </Card>
              )}
            </div>
            
            {/* Right Column: Transcription Editor */}
            <div className="lg:col-span-2">
              <TranscriptionEditor
                transcriptionText={transcriptionText}
                onTranscriptionChange={setTranscriptionText}
                onSave={handleSave}
                onContinueToStructured={handleContinueToStructured}
                isSaving={isSaving}
                saveError={error}
                saveSuccess={saveSuccess}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
