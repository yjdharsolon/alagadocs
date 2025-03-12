
import React from 'react';

interface AuthenticationCheckProps {
  isLoading: boolean;
}

export const AuthenticationCheck: React.FC<AuthenticationCheckProps> = ({ isLoading }) => {
  if (!isLoading) return null;
  
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
      <p className="text-muted-foreground">Verifying authentication...</p>
    </div>
  );
};
