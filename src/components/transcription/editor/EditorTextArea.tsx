
import React, { useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { FixedSizeList as List } from 'react-window';

interface EditorTextAreaProps {
  transcriptionText: string;
  onTranscriptionChange: (text: string) => void;
}

const EditorTextArea: React.FC<EditorTextAreaProps> = ({
  transcriptionText,
  onTranscriptionChange
}) => {
  // Memoize expensive calculations
  const lines = useMemo(() => {
    if (!transcriptionText) return [];
    return transcriptionText.split('\n');
  }, [transcriptionText]);
  
  const isLargeContent = lines.length > 200;
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTranscriptionChange(e.target.value);
  };
  
  // Render optimized view for large content
  const renderOptimizedTextarea = () => {
    return (
      <div className="space-y-2">
        <div className="border rounded-md">
          <List
            height={300}
            itemCount={lines.length}
            itemSize={20}
            width="100%"
            className="bg-background text-sm font-mono overflow-x-auto"
          >
            {({ index, style }) => (
              <div style={style} className="px-3 py-0.5">
                {lines[index]}
              </div>
            )}
          </List>
        </div>
        <Textarea 
          className="min-h-[100px] font-mono text-sm"
          value={transcriptionText}
          onChange={handleTextChange}
          placeholder="Your transcription text will appear here for editing..."
          aria-label="Transcription text editor"
        />
      </div>
    );
  };
  
  // Standard rendering for smaller content
  const renderStandardTextarea = () => (
    <Textarea 
      className="min-h-[300px] sm:min-h-[400px] font-mono text-sm resize-none"
      value={transcriptionText}
      onChange={handleTextChange}
      placeholder="Your transcription text will appear here for editing..."
      aria-label="Transcription text editor"
    />
  );

  return isLargeContent ? renderOptimizedTextarea() : renderStandardTextarea();
};

export default EditorTextArea;
