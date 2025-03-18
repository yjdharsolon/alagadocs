
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface FormatSelectionTabProps {
  formats: Array<{
    formatType: string;
    formattedText: string;
    structuredData: any;
    selected: boolean;
  }>;
  onToggleSelection: (formatType: string) => void;
}

const FormatSelectionTab: React.FC<FormatSelectionTabProps> = ({
  formats,
  onToggleSelection,
}) => {
  const getFormatDisplayName = (formatType: string) => {
    switch (formatType) {
      case 'history': return 'History & Physical';
      case 'consultation': return 'Consultation';
      case 'prescription': return 'Prescription';
      default: return formatType.charAt(0).toUpperCase() + formatType.slice(1);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Select formats to save:</h3>
          <p className="text-sm text-muted-foreground">
            Choose which document formats you want to include in your saved note.
          </p>
          
          <div className="space-y-3 mt-4">
            {formats.map((format) => (
              <div key={format.formatType} className="flex items-center space-x-2">
                <Checkbox 
                  id={`format-${format.formatType}`}
                  checked={format.selected}
                  onCheckedChange={() => onToggleSelection(format.formatType)}
                />
                <Label
                  htmlFor={`format-${format.formatType}`}
                  className="cursor-pointer font-medium"
                >
                  {getFormatDisplayName(format.formatType)}
                </Label>
              </div>
            ))}
          </div>
          
          <div className="text-sm text-muted-foreground mt-2">
            {formats.filter(f => f.selected).length === 0 ? (
              <p className="text-yellow-600">Please select at least one format to save</p>
            ) : (
              <p>{formats.filter(f => f.selected).length} format(s) selected</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormatSelectionTab;
