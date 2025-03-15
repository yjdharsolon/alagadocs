
import React from 'react';
import { MedicalSections } from './types';
import { ButtonGroup } from './buttons/ButtonGroup';

interface ActionButtonsProps {
  onCopy?: () => void;
  onEdit?: () => void;
  user?: any;
  sections?: MedicalSections;
  structuredText?: string;
  transcriptionId?: string;
  patientId?: string | null;
  patientName?: string | null;
}

const ActionButtons = ({ 
  onCopy, 
  onEdit, 
  user, 
  sections, 
  structuredText,
  transcriptionId,
  patientId,
  patientName
}: ActionButtonsProps) => {
  console.log('ActionButtons patientId:', patientId); // Debug log
  console.log('ActionButtons patientName:', patientName); // Debug log
  
  return (
    <ButtonGroup
      onEdit={onEdit}
      user={user}
      sections={sections}
      structuredText={structuredText}
      transcriptionId={transcriptionId}
      patientId={patientId}
      patientName={patientName}
    />
  );
};

export default ActionButtons;
