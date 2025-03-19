
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useProfileFields, ProfileData } from '@/hooks/useProfileFields';
import ProfileTabs from '@/components/profile/ProfileTabs';

export default function ProfilePage() {
  const { user } = useAuth();
  const { profileData, loading, updateProfile } = useProfileFields();
  const [formData, setFormData] = useState<ProfileData>({});
  const [activeTab, setActiveTab] = useState('personal');

  // Initialize form data when profile data is loaded
  useEffect(() => {
    if (profileData) {
      setFormData(profileData);
    }
  }, [profileData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        
        <ProfileTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </Layout>
  );
}
