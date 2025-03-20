
import React from 'react';

interface AIResponseProps {
  response: string;
}

const AIResponse: React.FC<AIResponseProps> = ({ response }) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Response:</h3>
      <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
        {response}
      </div>
    </div>
  );
};

export default AIResponse;
