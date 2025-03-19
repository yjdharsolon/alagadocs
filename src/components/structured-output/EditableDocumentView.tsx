
import React, { useState } from 'react';
import { MedicalSections } from './types';
import { toast } from 'sonner';
import { getDocumentFormat } from './tabs/TabUtils';
import { PrescriptionEditor } from './prescription';
import SectionEditor from './sections/SectionEditor';
import DocumentEditorToolbar from './toolbar/DocumentEditorToolbar';
import { formatContent } from './utils/contentFormatter';

interface EditableDocumentViewProps {
  structuredData: MedicalSections;
  onSave?: (updatedData: MedicalSections, stayInEditMode?: boolean) => void;
}

const EditableDocumentView = ({ 
  structuredData, 
  onSave 
}: EditableDocumentViewProps) => {
  const [editableData, setEditableData] = useState<MedicalSections>({...structuredData});
  const [viewFormat, setViewFormat] = useState<'paragraph' | 'bullets'>('paragraph');
  const [currentlyEditingId, setCurrentlyEditingId] = useState<string | null>(null);
  
  // Detect document format
  const documentFormat = getDocumentFormat(structuredData);
  
  // For prescription format, use the specialized editor
  if (documentFormat === 'prescription') {
    return (
      <PrescriptionEditor 
        structuredData={structuredData}
        onSave={(updatedData, stayInEditMode = false) => {
          console.log('[EditableDocumentView] Received save with updatedData and stayInEditMode:', stayInEditMode);
          if (onSave) {
            console.log('[EditableDocumentView] Calling parent onSave with stayInEditMode:', stayInEditMode);
            // Pass both the updatedData and stayInEditMode flag to the parent onSave
            onSave(updatedData, stayInEditMode);
          }
        }}
      />
    );
  }
  
  // Array of section configurations for standard formats
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
      // For standard formats, we don't stay in edit mode after saving
      onSave(editableData, false);
    }
  };

  // Function to toggle between paragraph and bullets view format
  const toggleFormat = (newFormat: 'paragraph' | 'bullets') => {
    setViewFormat(newFormat);
  };

  return (
    <div className="editable-document-view">
      <DocumentEditorToolbar 
        onSave={handleSave}
        viewFormat={viewFormat}
        onFormatChange={toggleFormat}
      />
      
      <div 
        className="document-content p-6 bg-white border rounded-md shadow-sm" 
        role="region" 
        aria-label="Editable medical document"
      >
        {sections.map((section) => {
          const sectionId = section.id as keyof MedicalSections;
          const isEditing = currentlyEditingId === section.id;
          const formattedContent = formatContent(section.content);
          
          return (
            <SectionEditor
              key={section.id}
              id={section.id}
              title={section.title}
              content={formattedContent}
              isEditing={isEditing}
              viewFormat={viewFormat}
              onEditStart={handleEditStart}
              onContentChange={(id, content) => handleContentChange(id as keyof MedicalSections, content)}
              onKeyDown={(e, id) => handleKeyDown(e, id as keyof MedicalSections)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default EditableDocumentView;
