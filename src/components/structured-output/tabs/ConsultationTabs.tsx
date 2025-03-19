
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SectionContent from '../SectionContent';
import DocumentView from '../DocumentView';
import { FileText, Users, Stethoscope, ClipboardList, PenTool } from 'lucide-react';
import { MedicalSections } from '../types';
import { formatContent } from './TabUtils';

interface ConsultationTabsProps {
  structuredData: MedicalSections;
}

const ConsultationTabs: React.FC<ConsultationTabsProps> = ({ structuredData }) => {
  return (
    <Tabs defaultValue="document" className="w-full">
      <TabsList className="grid w-full grid-cols-5 mb-6 border border-[#E0E0E0] p-1 rounded-md">
        <TabsTrigger 
          value="document" 
          className="data-[state=active]:bg-[#33C3F0] data-[state=active]:text-white transition-colors duration-200"
        >
          <FileText className="h-4 w-4 mr-2" />
          Document
        </TabsTrigger>
        <TabsTrigger 
          value="all" 
          className="data-[state=active]:bg-[#33C3F0] data-[state=active]:text-white transition-colors duration-200"
        >
          <ClipboardList className="h-4 w-4 mr-2" />
          All Sections
        </TabsTrigger>
        <TabsTrigger 
          value="reason-history" 
          className="data-[state=active]:bg-[#33C3F0] data-[state=active]:text-white transition-colors duration-200"
        >
          <Users className="h-4 w-4 mr-2" />
          Reason & History
        </TabsTrigger>
        <TabsTrigger 
          value="findings" 
          className="data-[state=active]:bg-[#33C3F0] data-[state=active]:text-white transition-colors duration-200"
        >
          <Stethoscope className="h-4 w-4 mr-2" />
          Findings
        </TabsTrigger>
        <TabsTrigger 
          value="impression-recommendations" 
          className="data-[state=active]:bg-[#33C3F0] data-[state=active]:text-white transition-colors duration-200"
        >
          <PenTool className="h-4 w-4 mr-2" />
          Impression & Plan
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="document" className="space-y-6">
        <DocumentView structuredData={structuredData} />
      </TabsContent>
      
      <TabsContent value="all" className="space-y-6">
        <SectionContent title="REASON FOR CONSULTATION" content={formatContent(structuredData.reasonForConsultation)} />
        <SectionContent title="HISTORY" content={formatContent(structuredData.history)} />
        <SectionContent title="FINDINGS" content={formatContent(structuredData.findings)} />
        <SectionContent title="IMPRESSION" content={formatContent(structuredData.impression)} />
        <SectionContent title="RECOMMENDATIONS" content={formatContent(structuredData.recommendations)} />
      </TabsContent>
      
      <TabsContent value="reason-history">
        <SectionContent title="REASON FOR CONSULTATION" content={formatContent(structuredData.reasonForConsultation)} />
        <SectionContent title="HISTORY" content={formatContent(structuredData.history)} />
      </TabsContent>
      
      <TabsContent value="findings">
        <SectionContent title="FINDINGS" content={formatContent(structuredData.findings)} />
      </TabsContent>
      
      <TabsContent value="impression-recommendations">
        <SectionContent title="IMPRESSION" content={formatContent(structuredData.impression)} />
        <SectionContent title="RECOMMENDATIONS" content={formatContent(structuredData.recommendations)} />
      </TabsContent>
    </Tabs>
  );
};

export default ConsultationTabs;
