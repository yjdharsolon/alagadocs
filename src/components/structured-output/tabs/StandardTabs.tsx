
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SectionContent from '../SectionContent';
import DocumentView from '../DocumentView';
import { MedicalSections } from '../types';
import { formatContent } from './TabUtils';

interface StandardTabsProps {
  structuredData: MedicalSections;
}

const StandardTabs: React.FC<StandardTabsProps> = ({ structuredData }) => {
  return (
    <Tabs defaultValue="document" className="w-full">
      <TabsList className="grid w-full grid-cols-6 mb-6 border border-[#E0E0E0] p-1 rounded-md">
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
          value="cc-hpi" 
          className="data-[state=active]:bg-[#33C3F0] data-[state=active]:text-white transition-colors duration-200"
        >
          CC & HPI
        </TabsTrigger>
        <TabsTrigger 
          value="medical-info" 
          className="data-[state=active]:bg-[#33C3F0] data-[state=active]:text-white transition-colors duration-200"
        >
          Medical Info
        </TabsTrigger>
        <TabsTrigger 
          value="assessment" 
          className="data-[state=active]:bg-[#33C3F0] data-[state=active]:text-white transition-colors duration-200"
        >
          Assessment
        </TabsTrigger>
        <TabsTrigger 
          value="plan" 
          className="data-[state=active]:bg-[#33C3F0] data-[state=active]:text-white transition-colors duration-200"
        >
          Plan
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="document" className="space-y-6">
        <DocumentView structuredData={structuredData} />
      </TabsContent>
      
      <TabsContent value="all" className="space-y-6">
        <SectionContent title="CHIEF COMPLAINT" content={formatContent(structuredData.chiefComplaint)} />
        <SectionContent title="HISTORY OF PRESENT ILLNESS" content={formatContent(structuredData.historyOfPresentIllness)} />
        <SectionContent title="PAST MEDICAL HISTORY" content={formatContent(structuredData.pastMedicalHistory)} />
        <SectionContent title="MEDICATIONS" content={formatContent(structuredData.medications)} />
        <SectionContent title="ALLERGIES" content={formatContent(structuredData.allergies)} />
        <SectionContent title="PHYSICAL EXAMINATION" content={formatContent(structuredData.physicalExamination)} />
        <SectionContent title="ASSESSMENT" content={formatContent(structuredData.assessment)} />
        <SectionContent title="PLAN" content={formatContent(structuredData.plan)} />
      </TabsContent>
      
      <TabsContent value="cc-hpi">
        <SectionContent title="CHIEF COMPLAINT" content={formatContent(structuredData.chiefComplaint)} />
        <SectionContent title="HISTORY OF PRESENT ILLNESS" content={formatContent(structuredData.historyOfPresentIllness)} />
      </TabsContent>
      
      <TabsContent value="medical-info">
        <SectionContent title="PAST MEDICAL HISTORY" content={formatContent(structuredData.pastMedicalHistory)} />
        <SectionContent title="MEDICATIONS" content={formatContent(structuredData.medications)} />
        <SectionContent title="ALLERGIES" content={formatContent(structuredData.allergies)} />
        <SectionContent title="PHYSICAL EXAMINATION" content={formatContent(structuredData.physicalExamination)} />
      </TabsContent>
      
      <TabsContent value="assessment">
        <SectionContent title="ASSESSMENT" content={formatContent(structuredData.assessment)} />
      </TabsContent>
      
      <TabsContent value="plan">
        <SectionContent title="PLAN" content={formatContent(structuredData.plan)} />
      </TabsContent>
    </Tabs>
  );
};

export default StandardTabs;
