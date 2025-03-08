
import React from 'react';

interface SectionContentProps {
  title: string;
  content: string;
}

const SectionContent = ({ title, content }: SectionContentProps) => {
  if (!content) return null;
  
  return (
    <section className="mb-4">
      <h3 className="text-lg font-bold mb-2">{title}:</h3>
      <p className="whitespace-pre-wrap p-3 bg-gray-50 rounded-md border">
        {content}
      </p>
    </section>
  );
};

export default SectionContent;
