
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';
import { TemplateFormValues } from '../../types';

interface TemplateHeaderProps {
  form: UseFormReturn<TemplateFormValues>;
}

const TemplateHeader = ({ form }: TemplateHeaderProps) => {
  const { control } = form;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter template title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="isDefault"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
              <div className="space-y-0.5">
                <FormLabel>Default Template</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Set this as your default template
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description (Optional)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter a description for this template..." 
                {...field} 
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default TemplateHeader;
