
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const AskAI = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    
    setIsLoading(true);
    setResponse('');
    
    try {
      const { data, error } = await supabase.functions.invoke('openai-chat', {
        body: { prompt: prompt.trim() }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      setResponse(data.message);
      toast.success('Response received!');
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      toast.error('Failed to get AI response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Ask AI Assistant</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block mb-2 text-sm font-medium">
            Your question or prompt
          </label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask me anything..."
            className="min-h-24"
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading || !prompt.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : 'Ask AI'}
        </Button>
      </form>
      
      {response && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Response:</h3>
          <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
            {response}
          </div>
        </div>
      )}
    </Card>
  );
};

export default AskAI;
