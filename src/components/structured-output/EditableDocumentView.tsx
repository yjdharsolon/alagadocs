import React, { useState, FormEvent, useEffect } from 'react';
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
  updateDataDirectly?: (data: MedicalSections) => void;
}

const EditableDocumentView = ({ 
  structuredData, 
  onSave,
  updateDataDirectly
}: EditableDocumentViewProps) => {
  // Initialize editable data as a deep clone to avoid reference issues
  const [editableData, setEditableData] = useState<MedicalSections>(
    JSON.parse(JSON.stringify(structuredData))
  );
  const [viewFormat, setViewFormat] = useState<'paragraph' | 'bullets'>('paragraph');
  const [currentlyEditingId, setCurrentlyEditingId] = useState<string | null>(null);
  
  // Log component initialization
  console.log('[EditableDocumentView] Initialized with structuredData:', JSON.stringify({
    hasPatientInfo: !!structuredData.patientInformation,
    medicationsCount: structuredData.medications ? 
      (Array.isArray(structuredData.medications) ? structuredData.medications.length : 'not array') : 
      'none',
    updateDataDirectlyProvided: !!updateDataDirectly
  }));
  
  // Update editable data when structuredData changes
  useEffect(() => {
    console.log('[EditableDocumentView] structuredData updated, refreshing editable data');
    // Deep clone to avoid reference issues
    setEditableData(JSON.parse(JSON.stringify(structuredData)));
  }, [structuredData]);
  
  // Detect document format
  const documentFormat = getDocumentFormat(structuredData);
  
  // For prescription format, use the specialized editor
  if (documentFormat === 'prescription') {
    console.log('[EditableDocumentView] Rendering PrescriptionEditor');
    return (
      <PrescriptionEditor 
        structuredData={structuredData}
        onSave={(updatedData, stayInEditMode = false) => {
          console.log('[EditableDocumentView] PrescriptionEditor onSave called with stayInEditMode:', stayInEditMode);
          
          // CRITICAL: Always update UI directly first
          if (updateDataDirectly) {
            console.log('[EditableDocumentView] Directly updating UI with prescription data');
            // Deep clone to avoid reference issues
            const safeData = JSON.parse(JSON.stringify(updatedData));
            updateDataDirectly(safeData);
          }
          
          if (onSave) {
            console.log('[EditableDocumentView] Calling parent onSave with stayInEditMode:', stayInEditMode);
            // Pass both the updatedData and stayInEditMode flag to the parent onSave
            onSave(updatedData, stayInEditMode);
          }
        }}
        updateDataDirectly={updateDataDirectly}
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
    console.log(`[EditableDocumentView] Content changed for section: ${sectionId}`);
    setEditableData(prev => ({
      ...prev,
      [sectionId]: content
    }));
    setCurrentlyEditingId(null);
  };

  const handleEditStart = (sectionId: string) => {
    console.log(`[EditableDocumentView] Started editing section: ${sectionId}`);
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

  const handleSave = (e?: React.MouseEvent) => {
    if (e) e.preventDefault(); // Prevent form submission
    
    console.log('[EditableDocumentView] handleSave called, editableData:', JSON.stringify({
      hasPatientInfo: !!editableData.patientInformation,
      medicationsCount: editableData.medications ? 
        (Array.isArray(editableData.medications) ? editableData.medications.length : 'not array') : 
        'none'
    }));
    
    // CRITICAL: Always update UI directly first
    if (updateDataDirectly) {
      console.log('[EditableDocumentView] Directly updating UI');
      // Use deep clone to avoid reference issues
      const safeData = JSON.parse(JSON.stringify(editableData));
      updateDataDirectly(safeData);
    }
    
    if (onSave) {
      // For standard formats, we don't stay in edit mode after saving
      onSave(editableData, false);
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    handleSave();
  };

  // Function to toggle between paragraph and bullets view format
  const toggleFormat = (newFormat: 'paragraph' | 'bullets') => {
    console.log(`[EditableDocumentView] Toggled format from ${viewFormat} to ${newFormat}`);
    setViewFormat(newFormat);
  };

  return (
    <form onSubmit={handleFormSubmit} className="editable-document-view">
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
    </form>
  );
};

export default EditableDocumentView;
