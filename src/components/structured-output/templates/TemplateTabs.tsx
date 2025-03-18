
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TemplateTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  selectedTemplate: any | null;
  children: React.ReactNode;
}

const TemplateTabs = ({ 
  activeTab, 
  onTabChange, 
  selectedTemplate, 
  children 
}: TemplateTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="mb-6 grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="view">View Templates</TabsTrigger>
        <TabsTrigger value={selectedTemplate ? 'edit' : 'create'}>
          {selectedTemplate ? 'Edit Template' : 'Create Template'}
        </TabsTrigger>
      </TabsList>
      
      {children}
    </Tabs>
  );
};

export default TemplateTabs;
