
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const NoDataView = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center p-10">
      <p className="text-lg text-gray-600 mb-4">
        No structured data available. There was an error processing your transcription.
      </p>
      <Button onClick={() => navigate('/upload')}>
        Upload New Audio
      </Button>
    </div>
  );
};

export default NoDataView;
