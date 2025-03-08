
import React from 'react';

interface BillingHeaderProps {
  title: string;
  description: string;
}

export default function BillingHeader({ title, description }: BillingHeaderProps) {
  return (
    <div className="text-center space-y-2">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        {description}
      </p>
    </div>
  );
}
