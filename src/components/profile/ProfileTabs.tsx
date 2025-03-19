
import React from 'react';
import { Card, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ProfileData } from '@/hooks/useProfileFields';
import PersonalInfoTab from './PersonalInfoTab';
import ProfessionalTab from './ProfessionalTab';
import ClinicTab from './ClinicTab';

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formData: ProfileData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  activeTab,
  setActiveTab,
  formData,
  handleChange,
  handleSubmit,
  loading
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="personal">Personal Info</TabsTrigger>
        <TabsTrigger value="professional">Professional</TabsTrigger>
        <TabsTrigger value="clinic">Clinic Info</TabsTrigger>
      </TabsList>

      <Card>
        <form onSubmit={handleSubmit}>
          <TabsContent value="personal" className="space-y-4">
            <PersonalInfoTab formData={formData} handleChange={handleChange} />
          </TabsContent>

          <TabsContent value="professional" className="space-y-4">
            <ProfessionalTab formData={formData} handleChange={handleChange} />
          </TabsContent>

          <TabsContent value="clinic" className="space-y-4">
            <ClinicTab formData={formData} handleChange={handleChange} />
          </TabsContent>

          <CardFooter>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Tabs>
  );
}

export default ProfileTabs;
