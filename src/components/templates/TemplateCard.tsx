
import React from 'react';
import { TextTemplate } from '@/components/structured-output/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Edit, Trash2 } from 'lucide-react';

interface TemplateCardProps {
  template: TextTemplate;
  onEdit: (template: TextTemplate) => void;
  onDelete: (id: string) => void;
  deleting: string | null;
  selectable?: boolean;
  onSelect?: (template: TextTemplate) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ 
  template, 
  onEdit, 
  onDelete, 
  deleting, 
  selectable = false,
  onSelect 
}) => {
  const handleSelect = () => {
    if (onSelect && selectable) {
      onSelect(template);
    }
  };

  return (
    <Card 
      className={`overflow-hidden transition-shadow hover:shadow-md ${selectable ? 'cursor-pointer' : ''}`} 
      onClick={selectable ? handleSelect : undefined}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{template.title}</CardTitle>
        {template.description && (
          <CardDescription>{template.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-4">
          {template.sections.length} sections
        </div>
        <div className="space-y-1">
          {template.sections.slice(0, 3).map((section, index) => (
            <div key={index} className="text-sm py-1 px-2 bg-secondary/20 rounded">
              {section}
            </div>
          ))}
          {template.sections.length > 3 && (
            <div className="text-sm text-muted-foreground">
              +{template.sections.length - 3} more sections
            </div>
          )}
        </div>
      </CardContent>
      {!selectable && (
        <CardFooter className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(template);
            }}
            className="flex items-center gap-1"
          >
            <Edit className="h-3 w-3" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(template.id);
            }}
            disabled={deleting === template.id}
          >
            {deleting === template.id ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <>
                <Trash2 className="h-3 w-3" />
                Delete
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default TemplateCard;
