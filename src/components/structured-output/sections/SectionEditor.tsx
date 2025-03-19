
import React, { useState } from 'react';

interface SectionEditorProps {
  id: string;
  title: string;
  content: string;
  isEditing: boolean;
  viewFormat: 'paragraph' | 'bullets';
  onEditStart: (id: string) => void;
  onContentChange: (id: string, content: string) => void;
  onKeyDown: (e: React.KeyboardEvent, id: string) => void;
}

const SectionEditor: React.FC<SectionEditorProps> = ({
  id,
  title,
  content,
  isEditing,
  viewFormat,
  onEditStart,
  onContentChange,
  onKeyDown
}) => {
  const formattedContent = content || '';
  
  return (
    <div className="mb-6">
      <h3 
        className="text-lg font-bold mb-2" 
        id={`${id}-heading`}
      >
        {title}:
      </h3>
      <div 
        className={`p-2 border border-gray-200 rounded-md min-h-[100px] ${
          isEditing ? 'focus:border-primary focus:ring-1 focus:ring-primary' : ''
        } ${viewFormat === 'bullets' ? 'list-content' : 'paragraph-content'}`}
        contentEditable
        suppressContentEditableWarning
        onFocus={() => onEditStart(id)}
        onBlur={(e) => onContentChange(id, e.currentTarget.innerText)}
        onKeyDown={(e) => onKeyDown(e, id)}
        dangerouslySetInnerHTML={{ 
          __html: viewFormat === 'bullets' 
            ? formattedContent.split('\n')
                .filter(line => line.trim() !== '')
                .map(line => `<li>${line}</li>`)
                .join('') || ''
            : formattedContent.replace(/\n/g, '<br>') || ''
        }}
        aria-labelledby={`${id}-heading`}
        role="textbox"
        aria-multiline="true"
        tabIndex={0}
        aria-label={`Edit ${title}`}
        data-testid={`${id}-editor`}
      />
      <div className="text-xs text-muted-foreground mt-1" aria-live="polite">
        {isEditing ? 'Press Ctrl+Enter to save, Escape to cancel' : 'Click to edit'}
      </div>
    </div>
  );
};

export default SectionEditor;
