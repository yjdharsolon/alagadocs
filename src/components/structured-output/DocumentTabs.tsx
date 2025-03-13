
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SectionContent from './SectionContent';
import DocumentView from './DocumentView';
import { MedicalSections } from './types';

interface DocumentTabsProps {
  structuredData: MedicalSections;
}

const DocumentTabs = ({ structuredData }: DocumentTabsProps) => {
  return (
    <Tabs defaultValue="document" className="w-full">
      <TabsList className="grid w-full grid-cols-6 mb-6">
        <TabsTrigger value="document">Document</TabsTrigger>
        <TabsTrigger value="all">All Sections</TabsTrigger>
        <TabsTrigger value="cc-hpi">CC & HPI</TabsTrigger>
        <TabsTrigger value="medical-info">Medical Info</TabsTrigger>
        <TabsTrigger value="assessment">Assessment</TabsTrigger>
        <TabsTrigger value="plan">Plan</TabsTrigger>
      </TabsList>
      
      <TabsContent value="document" className="space-y-6">
        <DocumentView structuredData={structuredData} />
      </TabsContent>
      
      <TabsContent value="all" className="space-y-6">
        <SectionContent title="CHIEF COMPLAINT" content={structuredData.chiefComplaint} />
        <SectionContent title="HISTORY OF PRESENT ILLNESS" content={structuredData.historyOfPresentIllness} />
        <SectionContent title="PAST MEDICAL HISTORY" content={structuredData.pastMedicalHistory} />
        <SectionContent title="MEDICATIONS" content={structuredData.medications} />
        <SectionContent title="ALLERGIES" content={structuredData.allergies} />
        <SectionContent title="PHYSICAL EXAMINATION" content={structuredData.physicalExamination} />
        <SectionContent title="ASSESSMENT" content={structuredData.assessment} />
        <SectionContent title="PLAN" content={structuredData.plan} />
      </TabsContent>
      
      <TabsContent value="cc-hpi">
        <SectionContent title="CHIEF COMPLAINT" content={structuredData.chiefComplaint} />
        <SectionContent title="HISTORY OF PRESENT ILLNESS" content={structuredData.historyOfPresentIllness} />
      </TabsContent>
      
      <TabsContent value="medical-info">
        <SectionContent title="PAST MEDICAL HISTORY" content={structuredData.pastMedicalHistory} />
        <SectionContent title="MEDICATIONS" content={structuredData.medications} />
        <SectionContent title="ALLERGIES" content={structuredData.allergies} />
        <SectionContent title="PHYSICAL EXAMINATION" content={structuredData.physicalExamination} />
      </TabsContent>
      
      <TabsContent value="assessment">
        <SectionContent title="ASSESSMENT" content={structuredData.assessment} />
      </TabsContent>
      
      <TabsContent value="plan">
        <SectionContent title="PLAN" content={structuredData.plan} />
      </TabsContent>
    </Tabs>
  );
};

export default DocumentTabs;
