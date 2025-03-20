
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { saveStructuredNote } from '@/services/structuredOutputService';
import { MedicalSections } from '@/components/structured-output/types';

interface StructuredOutputProps {
  structuredOutput: MedicalSections;
  isSaving: boolean;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
}

const StructuredOutput: React.FC<StructuredOutputProps> = ({ 
  structuredOutput, 
  isSaving, 
  setIsSaving 
}) => {
  const handleSaveStructuredNote = async () => {
    if (!structuredOutput) return;
    
    try {
      setIsSaving(true);
      const tempTranscriptionId = 'temp-' + Date.now().toString();
      const { id } = await saveStructuredNote(structuredOutput, tempTranscriptionId);
      toast.success('Note saved successfully!');
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Structured Output:</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleSaveStructuredNote}
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          ) : (
            <Save className="mr-2 h-3 w-3" />
          )}
          Save Note
        </Button>
      </div>
      <div className="space-y-4">
        {Object.entries(structuredOutput).map(([key, value]) => (
          <div key={key} className="border rounded-md p-4 bg-white">
            <h4 className="font-medium capitalize mb-2">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </h4>
            <p className="text-sm whitespace-pre-wrap">{value as string}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StructuredOutput;
