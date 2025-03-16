
import React from 'react';

interface SectionViewProps {
  title: string;
  content: string;
}

const SectionView: React.FC<SectionViewProps> = ({ title, content }) => {
  // If there's no content, don't render the section
  if (!content?.trim()) return null;
  
  return (
    <div className="mb-4">
      <h3 className="text-lg font-bold">{title}</h3>
      <div className="mt-2 text-gray-700 whitespace-pre-wrap">
        {content}
      </div>
    </div>
  );
};

export default SectionView;
