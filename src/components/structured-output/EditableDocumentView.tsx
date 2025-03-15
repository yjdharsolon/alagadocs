
import React, { useState, useRef, useEffect } from 'react';
import { MedicalSections } from './types';
import { Button } from '@/components/ui/button';
import { Save, List, AlignLeft } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { toast } from 'react-hot-toast';

interface EditableDocumentViewProps {
  structuredData: MedicalSections;
  onSave?: (updatedData: MedicalSections) => void;
}

const EditableDocumentView = ({ 
  structuredData, 
  onSave 
}: EditableDocumentViewProps) => {
  const [editableData, setEditableData] = useState<MedicalSections>({...structuredData});
  const [viewFormat, setViewFormat] = useState<'paragraph' | 'bullets'>('paragraph');
  const [currentlyEditingId, setCurrentlyEditingId] = useState<string | null>(null);
  
  // Array of section configurations
  const sections = [
    { id: 'chiefComplaint', title: 'CHIEF COMPLAINT', content: editableData.chiefComplaint },
    { id: 'historyOfPresentIllness', title: 'HISTORY OF PRESENT ILLNESS', content: editableData.historyOfPresentIllness },
    { id: 'pastMedicalHistory', title: 'PAST MEDICAL HISTORY', content: editableData.pastMedicalHistory },
    { id: 'medications', title: 'MEDICATIONS', content: editableData.medications },
    { id: 'allergies', title: 'ALLERGIES', content: editableData.allergies },
    { id: 'physicalExamination', title: 'PHYSICAL EXAMINATION', content: editableData.physicalExamination },
    { id: 'assessment', title: 'ASSESSMENT', content: editableData.assessment },
    { id: 'plan', title: 'PLAN', content: editableData.plan }
  ];

  const handleContentChange = (sectionId: keyof MedicalSections, content: string) => {
    setEditableData(prev => ({
      ...prev,
      [sectionId]: content
    }));
    setCurrentlyEditingId(null);
  };

  const handleEditStart = (sectionId: string) => {
    setCurrentlyEditingId(sectionId);
  };

  const handleKeyDown = (e: React.KeyboardEvent, sectionId: keyof MedicalSections) => {
    // If Escape key is pressed, cancel editing
    if (e.key === 'Escape') {
      setCurrentlyEditingId(null);
    }
    // If Enter + Ctrl is pressed, save the content
    else if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      const content = (e.target as HTMLDivElement).innerText;
      handleContentChange(sectionId, content);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editableData);
      toast.success('Document changes saved successfully');
    }
  };

  // Function to convert paragraph to bullets and vice versa
  const toggleFormat = (newFormat: 'paragraph' | 'bullets') => {
    setViewFormat(newFormat);
    
    // No content transformation needed for now as we're just changing how it's displayed,
    // but we could add content transformation logic here if needed
  };

  return (
    <div className="editable-document-view">
      <div className="flex justify-between mb-4 items-center">
        <Button 
          onClick={handleSave} 
          className="flex items-center gap-2"
          aria-label="Save document changes"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          Save Changes
        </Button>
        
        <div className="space-y-1">
          <div className="text-sm font-medium" id="view-format-label">View Format</div>
          <ToggleGroup 
            type="single" 
            value={viewFormat}
            onValueChange={(value) => value && toggleFormat(value as 'paragraph' | 'bullets')}
            aria-labelledby="view-format-label"
          >
            <ToggleGroupItem value="paragraph" aria-label="Paragraph view">
              <AlignLeft className="h-4 w-4 mr-1" aria-hidden="true" />
              <span className="hidden sm:inline">Paragraph</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="bullets" aria-label="Bullet points view">
              <List className="h-4 w-4 mr-1" aria-hidden="true" />
              <span className="hidden sm:inline">Bullets</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      
      <div 
        className="document-content p-6 bg-white border rounded-md shadow-sm" 
        role="region" 
        aria-label="Editable medical document"
      >
        {sections.map((section) => {
          const sectionId = section.id as keyof MedicalSections;
          const isEditing = currentlyEditingId === section.id;
          
          return (
            <div key={section.id} className="mb-6">
              <h3 
                className="text-lg font-bold mb-2" 
                id={`${section.id}-heading`}
              >
                {section.title}:
              </h3>
              <div 
                className={`p-2 border border-gray-200 rounded-md min-h-[100px] ${
                  isEditing ? 'focus:border-primary focus:ring-1 focus:ring-primary' : ''
                } ${viewFormat === 'bullets' ? 'list-content' : 'paragraph-content'}`}
                contentEditable
                suppressContentEditableWarning
                onFocus={() => handleEditStart(section.id)}
                onBlur={(e) => handleContentChange(sectionId, e.currentTarget.innerText)}
                onKeyDown={(e) => handleKeyDown(e, sectionId)}
                dangerouslySetInnerHTML={{ 
                  __html: viewFormat === 'bullets' 
                    ? section.content?.split('\n')
                        .filter(line => line.trim() !== '')
                        .map(line => `<li>${line}</li>`)
                        .join('') || ''
                    : section.content?.replace(/\n/g, '<br>') || ''
                }}
                aria-labelledby={`${section.id}-heading`}
                role="textbox"
                aria-multiline="true"
                tabIndex={0}
                aria-label={`Edit ${section.title}`}
                data-testid={`${section.id}-editor`}
              />
              <div className="text-xs text-muted-foreground mt-1" aria-live="polite">
                {isEditing ? 'Press Ctrl+Enter to save, Escape to cancel' : 'Click to edit'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EditableDocumentView;
