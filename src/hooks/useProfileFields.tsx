
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-hot-toast';
import { useAuth } from './useAuth';

export interface ProfileData {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  name_extension?: string;
  medical_title?: string;
  profession?: string;
  prc_license?: string;
  ptr_number?: string;
  s2_number?: string;
  clinic_name?: string;
  clinic_address?: string;
  clinic_schedule?: string;
  contact_number?: string;
}

export const useProfileFields = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) {
        throw error;
      }
      
      setProfileData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load profile data');
      console.error('Error fetching profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedData: ProfileData) => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      setProfileData(prev => prev ? { ...prev, ...updatedData } : updatedData);
      toast.success('Profile updated successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      toast.error('Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  return {
    profileData,
    loading,
    error,
    updateProfile,
    fetchProfileData
  };
};
