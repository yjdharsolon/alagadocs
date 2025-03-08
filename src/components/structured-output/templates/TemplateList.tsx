
import React from 'react';
import { TextTemplate } from '../types';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Check, Star, StarOff } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface TemplateListProps {
  templates: TextTemplate[];
  onEdit: (template: TextTemplate) => void;
  onDelete: (templateId: string) => void;
  onSetDefault: (templateId: string) => void;
}

const TemplateList = ({ templates, onEdit, onDelete, onSetDefault }: TemplateListProps) => {
  if (templates.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/30">
        <p className="text-muted-foreground mb-2">No templates found</p>
        <p className="text-sm text-muted-foreground">Create a template to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map(template => (
        <Card key={template.id} className={template.isDefault ? 'border-primary/50 bg-primary/5' : ''}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg">{template.title}</CardTitle>
              {template.isDefault && (
                <Badge variant="outline" className="bg-primary/20 text-primary">
                  Default
                </Badge>
              )}
            </div>
            {template.description && (
              <CardDescription className="line-clamp-2">
                {template.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-muted-foreground mb-1">Sections:</p>
            <div className="flex flex-wrap gap-1">
              {template.sections.slice(0, 3).map((section, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {section}
                </Badge>
              ))}
              {template.sections.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{template.sections.length - 3} more
                </Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onEdit(template)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Template</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{template.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => onDelete(template.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            
            {!template.isDefault ? (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => onSetDefault(template.id)}
              >
                <Star className="h-3.5 w-3.5" />
                Set as Default
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 opacity-50 cursor-not-allowed"
                disabled
              >
                <Check className="h-3.5 w-3.5" />
                Default
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default TemplateList;
