
import React from 'react';

interface PatientPageHeaderProps {
  title: string;
}

export const PatientPageHeader: React.FC<PatientPageHeaderProps> = ({ title }) => {
  return (
    <h1 className="text-2xl font-bold mb-6">{title}</h1>
  );
};
