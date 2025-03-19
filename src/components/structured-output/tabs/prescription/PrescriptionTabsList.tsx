
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, ClipboardList, UserCircle, Pill, Building2 } from 'lucide-react';

const PrescriptionTabsList: React.FC = () => {
  return (
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
  );
};

export default PrescriptionTabsList;
