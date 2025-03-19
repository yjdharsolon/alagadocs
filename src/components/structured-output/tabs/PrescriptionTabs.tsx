
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SectionContent from '../SectionContent';
import DocumentView from '../DocumentView';
import { FileText, ClipboardList, UserCircle, Pill } from 'lucide-react';
import { MedicalSections } from '../types';
import { formatContent } from './TabUtils';

interface PrescriptionTabsProps {
  structuredData: MedicalSections;
}

const PrescriptionTabs: React.FC<PrescriptionTabsProps> = ({ structuredData }) => {
  return (
    <Tabs defaultValue="document" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-6 border border-[#E0E0E0] p-1 rounded-md">
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
          value="patient-info" 
          className="data-[state=active]:bg-[#33C3F0] data-[state=active]:text-white transition-colors duration-200"
        >
          <UserCircle className="h-4 w-4 mr-2" />
          Patient Info
        </TabsTrigger>
        <TabsTrigger 
          value="medications" 
          className="data-[state=active]:bg-[#33C3F0] data-[state=active]:text-white transition-colors duration-200"
        >
          <Pill className="h-4 w-4 mr-2" />
          Medications
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="document" className="space-y-6">
        <DocumentView structuredData={structuredData} />
      </TabsContent>
      
      <TabsContent value="all" className="space-y-6">
        <SectionContent 
          title="PATIENT INFORMATION" 
          content={formatContent(structuredData.patientInformation)} 
        />
        <SectionContent 
          title="MEDICATIONS" 
          content={formatContent(structuredData.medications)} 
        />
        <SectionContent 
          title="PRESCRIBER INFORMATION" 
          content={formatContent(structuredData.prescriberInformation)} 
        />
      </TabsContent>
      
      <TabsContent value="patient-info">
        <SectionContent 
          title="PATIENT INFORMATION" 
          content={formatContent(structuredData.patientInformation)} 
        />
      </TabsContent>
      
      <TabsContent value="medications">
        <SectionContent 
          title="MEDICATIONS" 
          content={formatContent(structuredData.medications)} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default PrescriptionTabs;
