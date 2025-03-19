
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SectionContent from '../SectionContent';
import DocumentView from '../DocumentView';
import { MedicalSections } from '../types';
import { formatContent } from './TabUtils';

interface SoapTabsProps {
  structuredData: MedicalSections;
}

const SoapTabs: React.FC<SoapTabsProps> = ({ structuredData }) => {
  return (
    <Tabs defaultValue="document" className="w-full">
      <TabsList className="grid w-full grid-cols-5 mb-6 border border-[#E0E0E0] p-1 rounded-md">
        <TabsTrigger 
          value="document" 
          className="data-[state=active]:bg-[#33C3F0] data-[state=active]:text-white transition-colors duration-200"
        >
          Document
        </TabsTrigger>
        <TabsTrigger 
          value="all" 
          className="data-[state=active]:bg-[#33C3F0] data-[state=active]:text-white transition-colors duration-200"
        >
          All Sections
        </TabsTrigger>
        <TabsTrigger 
          value="subjective" 
          className="data-[state=active]:bg-[#33C3F0] data-[state=active]:text-white transition-colors duration-200"
        >
          Subjective
        </TabsTrigger>
        <TabsTrigger 
          value="objective" 
          className="data-[state=active]:bg-[#33C3F0] data-[state=active]:text-white transition-colors duration-200"
        >
          Objective
        </TabsTrigger>
        <TabsTrigger 
          value="assessment-plan" 
          className="data-[state=active]:bg-[#33C3F0] data-[state=active]:text-white transition-colors duration-200"
        >
          A & P
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="document" className="space-y-6">
        <DocumentView structuredData={structuredData} />
      </TabsContent>
      
      <TabsContent value="all" className="space-y-6">
        <SectionContent title="SUBJECTIVE" content={formatContent(structuredData.subjective)} />
        <SectionContent title="OBJECTIVE" content={formatContent(structuredData.objective)} />
        <SectionContent title="ASSESSMENT" content={formatContent(structuredData.assessment)} />
        <SectionContent title="PLAN" content={formatContent(structuredData.plan)} />
      </TabsContent>
      
      <TabsContent value="subjective">
        <SectionContent title="SUBJECTIVE" content={formatContent(structuredData.subjective)} />
      </TabsContent>
      
      <TabsContent value="objective">
        <SectionContent title="OBJECTIVE" content={formatContent(structuredData.objective)} />
      </TabsContent>
      
      <TabsContent value="assessment-plan">
        <SectionContent title="ASSESSMENT" content={formatContent(structuredData.assessment)} />
        <SectionContent title="PLAN" content={formatContent(structuredData.plan)} />
      </TabsContent>
    </Tabs>
  );
};

export default SoapTabs;
