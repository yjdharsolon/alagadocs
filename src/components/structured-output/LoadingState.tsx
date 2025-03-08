
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState = () => {
  return (
    <div className="container mx-auto py-12 px-4 flex flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h2 className="text-xl font-semibold">Structuring your medical note...</h2>
      <p className="text-gray-500 mt-2">This may take a few moments</p>
    </div>
  );
};

export default LoadingState;
