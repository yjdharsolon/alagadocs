
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { MedicalSections } from '../types';
import { useAuth } from '@/hooks/useAuth';
import { getUserSettings } from '@/services/userService';

// Import refactored components
import PrescriptionTabsList from './prescription/PrescriptionTabsList';
import PrescriptionDocument from './prescription/PrescriptionDocument';
import AllSectionsTab from './prescription/AllSectionsTab';
import PatientInfoTab from './prescription/PatientInfoTab';
import MedicationsTab from './prescription/MedicationsTab';
import PrescriberTab from './prescription/PrescriberTab';

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

  return (
    <Tabs defaultValue="document" className="w-full">
      <PrescriptionTabsList />
      
      <TabsContent value="document">
        <PrescriptionDocument structuredData={structuredData} />
      </TabsContent>
      
      <TabsContent value="all">
        <AllSectionsTab 
          structuredData={structuredData} 
          prescriberInfo={prescriberInfo} 
        />
      </TabsContent>
      
      <TabsContent value="patient-info">
        <PatientInfoTab patientInformation={structuredData.patientInformation} />
      </TabsContent>
      
      <TabsContent value="medications">
        <MedicationsTab medications={structuredData.medications} />
      </TabsContent>
      
      <TabsContent value="prescriber">
        <PrescriberTab 
          prescriberInfo={prescriberInfo} 
          structuredPrescriberInfo={structuredData.prescriberInformation} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default PrescriptionTabs;
