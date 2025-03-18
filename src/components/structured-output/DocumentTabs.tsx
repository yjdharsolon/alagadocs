
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SectionContent from './SectionContent';
import DocumentView from './DocumentView';
import { FileText, Users, Stethoscope, ClipboardList, PenTool, Pill, UserCircle } from 'lucide-react';
import { MedicalSections } from './types';

interface DocumentTabsProps {
  structuredData: MedicalSections;
}

const DocumentTabs = ({ structuredData }: DocumentTabsProps) => {
  // Helper function to format content that might be an array or object
  const formatContent = (content: any): string => {
    if (content === undefined || content === null) {
      return '';
    }
    
    if (typeof content === 'string') {
      return content;
    }
    
    // Handle arrays
    if (Array.isArray(content)) {
      return content.map(item => 
        typeof item === 'string' ? item : JSON.stringify(item, null, 2)
      ).join('\n');
    }
    
    // Handle objects
    return JSON.stringify(content, null, 2);
  };
  
  // Determine document format based on available fields
  const getDocumentFormat = (): 'standard' | 'soap' | 'consultation' | 'prescription' => {
    if (structuredData.subjective && structuredData.objective) {
      return 'soap';
    } else if (structuredData.reasonForConsultation && structuredData.impression) {
      return 'consultation';
    } else if (structuredData.patientInformation && structuredData.prescriberInformation) {
      return 'prescription';
    } else {
      return 'standard';
    }
  };
  
  const documentFormat = getDocumentFormat();
  
  // Render different tab sets based on document format
  if (documentFormat === 'consultation') {
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
  } else if (documentFormat === 'prescription') {
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
  } else if (documentFormat === 'soap') {
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
  } else {
    // Default to standard format
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
  }
};

export default DocumentTabs;
