
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches the user's profile from the database
 * @param userId The ID of the user
 * @returns The user profile data
 */
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
};

/**
 * Updates the user's profile in the database
 * @param userId The ID of the user
 * @param profileData The profile data to update
 * @returns The updated profile data
 */
export const updateUserProfile = async (userId: string, profileData: any) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    throw error;
  }
};

/**
 * Gets the user's role from the database
 * @param userId The ID of the user
 * @returns The user's role
 */
export const getUserRole = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching user role:', error);
      throw error;
    }
    
    return data?.role || null;
  } catch (error) {
    console.error('Error in getUserRole:', error);
    throw error;
  }
};

/**
 * Updates the user's role in the database
 * @param userId The ID of the user
 * @param role The role to set
 * @returns The result of the operation
 */
export const updateUserRole = async (userId: string, role: string) => {
  try {
    // First check if a role entry already exists
    const { data: existingRole } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    let result;
    
    if (existingRole) {
      // Update existing role
      const { data, error } = await supabase
        .from('user_roles')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating user role:', error);
        throw error;
      }
      
      result = data;
    } else {
      // Insert new role
      const { data, error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role })
        .select()
        .single();
      
      if (error) {
        console.error('Error inserting user role:', error);
        throw error;
      }
      
      result = data;
    }
    
    return result;
  } catch (error) {
    console.error('Error in updateUserRole:', error);
    throw error;
  }
};

/**
 * Gets the user's profile settings including medical professional details
 */
export const getUserSettings = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id, 
        first_name, 
        middle_name,
        last_name, 
        name_extension,
        medical_title,
        profession,
        prc_license,
        ptr_number,
        s2_number,
        clinic_name,
        clinic_address,
        clinic_schedule,
        contact_number
      `)
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching user settings:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getUserSettings:', error);
    throw error;
  }
};
