
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { FileText } from 'lucide-react';

interface DirectInputCardProps {
  value: string;
  onChange: (value: string) => void;
}

export const DirectInputCard: React.FC<DirectInputCardProps> = ({ value, onChange }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Direct Text Input
        </CardTitle>
        <CardDescription>
          Type your consultation notes directly
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your consultation notes here..."
          className="min-h-[300px] flex-grow resize-none"
          data-testid="direct-text-input"
        />
      </CardContent>
    </Card>
  );
};
