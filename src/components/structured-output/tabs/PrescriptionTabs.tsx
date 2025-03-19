
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SectionContent from '../SectionContent';
import DocumentView from '../DocumentView';
import { FileText, ClipboardList, UserCircle, Pill, Building2 } from 'lucide-react';
import { MedicalSections } from '../types';
import { formatContent } from './TabUtils';
import { useAuth } from '@/hooks/useAuth';
import { getUserSettings } from '@/services/userService';

interface PrescriptionTabsProps {
  structuredData: MedicalSections;
}

const PrescriptionTabs: React.FC<PrescriptionTabsProps> = ({ structuredData }) => {
  const { user } = useAuth();
  const [prescriberInfo, setPrescriberInfo] = useState<any>(null);

  useEffect(() => {
    const loadPrescriberInfo = async () => {
      if (user) {
        try {
          const profileData = await getUserSettings(user.id);
          setPrescriberInfo(profileData);
        } catch (error) {
          console.error('Error loading prescriber information:', error);
        }
      }
    };

    loadPrescriberInfo();
  }, [user]);

  // Format medications to show numbering
  const formatMedications = (medications: any[]) => {
    if (!medications || !Array.isArray(medications)) return "No medications specified";
    
    return medications.map((med, index) => {
      const medNumber = med.id || (index + 1);
      return `${medNumber}. ${med.name} ${med.strength || ''} (${med.dosageForm || 'Not specified'})
      Sig: ${med.sigInstructions || 'Not specified'}
      Quantity: ${med.quantity || 'Not specified'}
      Refills: ${med.refills || 'Not specified'}
      ${med.specialInstructions ? `Special Instructions: ${med.specialInstructions}` : ''}
      `;
    }).join("\n\n");
  };

  // Format prescriber information with professional details
  const formatPrescriberInfo = () => {
    if (!prescriberInfo) return structuredData.prescriberInformation || "No prescriber information";

    let formattedInfo = '';
    const name = `${prescriberInfo.first_name || ''} ${prescriberInfo.middle_name ? prescriberInfo.middle_name.charAt(0) + '. ' : ''}${prescriberInfo.last_name || ''}${prescriberInfo.name_extension ? ', ' + prescriberInfo.name_extension : ''}`;
    
    formattedInfo += `${name}${prescriberInfo.medical_title ? ', ' + prescriberInfo.medical_title : ''}\n`;
    formattedInfo += `${prescriberInfo.profession || ''}\n`;
    
    if (prescriberInfo.prc_license) {
      formattedInfo += `PRC License No: ${prescriberInfo.prc_license}\n`;
    }
    
    if (prescriberInfo.ptr_number) {
      formattedInfo += `PTR No: ${prescriberInfo.ptr_number}\n`;
    }
    
    if (prescriberInfo.s2_number) {
      formattedInfo += `S2 No: ${prescriberInfo.s2_number}\n`;
    }
    
    if (prescriberInfo.clinic_name) {
      formattedInfo += `\n${prescriberInfo.clinic_name}\n`;
    }
    
    if (prescriberInfo.clinic_address) {
      formattedInfo += `${prescriberInfo.clinic_address}\n`;
    }
    
    if (prescriberInfo.clinic_schedule) {
      formattedInfo += `Hours: ${prescriberInfo.clinic_schedule}\n`;
    }
    
    if (prescriberInfo.contact_number) {
      formattedInfo += `Contact: ${prescriberInfo.contact_number}\n`;
    }
    
    return formattedInfo || structuredData.prescriberInformation || "No prescriber information";
  };

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
          value="patient-info" 
          className="data-[state=active]:bg-[#33C3F0] data-[state=active]:text-white transition-colors duration-200"
        >
          <UserCircle className="h-4 w-4 mr-2" />
          Patient
        </TabsTrigger>
        <TabsTrigger 
          value="medications" 
          className="data-[state=active]:bg-[#33C3F0] data-[state=active]:text-white transition-colors duration-200"
        >
          <Pill className="h-4 w-4 mr-2" />
          Medications
        </TabsTrigger>
        <TabsTrigger 
          value="prescriber" 
          className="data-[state=active]:bg-[#33C3F0] data-[state=active]:text-white transition-colors duration-200"
        >
          <Building2 className="h-4 w-4 mr-2" />
          Prescriber
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
          content={
            Array.isArray(structuredData.medications)
              ? formatMedications(structuredData.medications)
              : formatContent(structuredData.medications)
          } 
        />
        <SectionContent 
          title="PRESCRIBER INFORMATION" 
          content={formatPrescriberInfo()}
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
          content={
            Array.isArray(structuredData.medications)
              ? formatMedications(structuredData.medications)
              : formatContent(structuredData.medications)
          } 
        />
      </TabsContent>
      
      <TabsContent value="prescriber">
        <SectionContent 
          title="PRESCRIBER INFORMATION" 
          content={formatPrescriberInfo()}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PrescriptionTabs;
