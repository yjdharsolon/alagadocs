
import React from 'react';
import { MedicalSections } from './types';
import ButtonGroup from './buttons/ButtonGroup';

interface ActionButtonsProps {
  onCopy: () => void;
  onEdit: () => void;
  user?: any;
  sections?: MedicalSections;
  structuredText?: string;
}

const ActionButtons = ({ onCopy, onEdit, user, sections, structuredText }: ActionButtonsProps) => {
  // We're maintaining the onCopy prop for backward compatibility, although individual buttons now handle their logic
  const handleCopy = () => {
    if (onCopy) {
      onCopy();
    }
  };

  return (
    <ButtonGroup
      onEdit={onEdit}
      user={user}
      sections={sections}
      structuredText={structuredText}
    />
  );
};

export default ActionButtons;
