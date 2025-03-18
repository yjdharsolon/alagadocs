
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MoveUp, MoveDown, Trash2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { TemplateFormValues } from '../../types';

interface TemplateSectionProps {
  index: number;
  sectionId: string;
  form: UseFormReturn<TemplateFormValues>;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
}

const TemplateSectionItem = ({ 
  index, 
  sectionId, 
  form, 
  onRemove, 
  onMove, 
  isFirst, 
  isLast 
}: TemplateSectionProps) => {
  const { control } = form;

  return (
    <Card className="relative">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8">
            <FormField
              control={control}
              name={`sections.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter section name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="md:col-span-4 flex items-end justify-end gap-2 pb-2">
            <FormField
              control={control}
              name={`sections.${index}.required`}
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormLabel className="!mt-0">Required</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-1">
              <Button 
                type="button" 
                size="icon" 
                variant="ghost" 
                onClick={() => onMove(sectionId, 'up')}
                disabled={isFirst}
              >
                <MoveUp className="h-4 w-4" />
              </Button>
              <Button 
                type="button" 
                size="icon" 
                variant="ghost" 
                onClick={() => onMove(sectionId, 'down')}
                disabled={isLast}
              >
                <MoveDown className="h-4 w-4" />
              </Button>
              <Button 
                type="button" 
                size="icon" 
                variant="ghost"
                className="text-destructive hover:text-destructive/80"
                onClick={() => onRemove(sectionId)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateSectionItem;
