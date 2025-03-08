
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SectionContent from './SectionContent';
import { MedicalSections } from './types';

interface DocumentTabsProps {
  sections: MedicalSections;
}

const DocumentTabs = ({ sections }: DocumentTabsProps) => {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-4">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="cc-hpi">CC & HPI</TabsTrigger>
        <TabsTrigger value="assessment">Assessment</TabsTrigger>
        <TabsTrigger value="plan">Plan</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="space-y-6">
        <SectionContent title="CHIEF COMPLAINT" content={sections.chiefComplaint} />
        <SectionContent title="HISTORY OF PRESENT ILLNESS" content={sections.historyOfPresentIllness} />
        <SectionContent title="PAST MEDICAL HISTORY" content={sections.pastMedicalHistory} />
        <SectionContent title="MEDICATIONS" content={sections.medications} />
        <SectionContent title="ALLERGIES" content={sections.allergies} />
        <SectionContent title="PHYSICAL EXAMINATION" content={sections.physicalExamination} />
        <SectionContent title="ASSESSMENT" content={sections.assessment} />
        <SectionContent title="PLAN" content={sections.plan} />
      </TabsContent>
      
      <TabsContent value="cc-hpi">
        <SectionContent title="CHIEF COMPLAINT" content={sections.chiefComplaint} />
        <SectionContent title="HISTORY OF PRESENT ILLNESS" content={sections.historyOfPresentIllness} />
      </TabsContent>
      
      <TabsContent value="assessment">
        <SectionContent title="ASSESSMENT" content={sections.assessment} />
      </TabsContent>
      
      <TabsContent value="plan">
        <SectionContent title="PLAN" content={sections.plan} />
      </TabsContent>
    </Tabs>
  );
};

export default DocumentTabs;
