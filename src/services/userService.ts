
import { supabase } from '@/integrations/supabase/client';

/**
 * Updates user profile information
 * @param userId The ID of the user
 * @param profileData The profile data to update
 * @returns The updated profile data
 */
export const updateUserProfile = async (userId: string, profileData: {
  full_name?: string;
  medical_role?: string;
  specialization?: string;
  preferences?: Record<string, any>;
}) => {
  try {
    // Update auth metadata (name)
    if (profileData.full_name) {
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: profileData.full_name }
      });
      
      if (authError) {
        console.error('Error updating user metadata:', authError);
        throw new Error(`Error updating user metadata: ${authError.message}`);
      }
    }
    
    // Update profile record in profiles table
    const { data, error } = await supabase
      .from('profiles')
      .update({
        medical_role: profileData.medical_role,
        specialization: profileData.specialization,
        preferences: profileData.preferences,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating profile:', error);
      throw new Error(`Error updating profile: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    throw error;
  }
};

/**
 * Gets a user's profile
 * @param userId The ID of the user
 * @returns The user's profile data
 */
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching profile:', error);
      throw new Error(`Error fetching profile: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
};

/**
 * Sets user preferences
 * @param userId The ID of the user
 * @param preferences The preferences to set
 * @returns Success status
 */
export const setUserPreferences = async (userId: string, preferences: Record<string, any>) => {
  try {
    // Get existing profile
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('preferences')
      .eq('id', userId)
      .single();
      
    if (fetchError) {
      console.error('Error fetching profile for preferences update:', fetchError);
      throw new Error(`Error fetching profile: ${fetchError.message}`);
    }
    
    // Merge existing preferences with new ones
    const updatedPreferences = {
      ...(profile?.preferences || {}),
      ...preferences
    };
    
    // Update the preferences
    const { error } = await supabase
      .from('profiles')
      .update({
        preferences: updatedPreferences,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
      
    if (error) {
      console.error('Error updating preferences:', error);
      throw new Error(`Error updating preferences: ${error.message}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error in setUserPreferences:', error);
    throw error;
  }
};
