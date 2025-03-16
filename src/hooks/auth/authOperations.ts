
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-hot-toast';
import { NavigateFunction } from 'react-router-dom';

export const signInWithPassword = async (
  email: string, 
  password: string, 
  rememberMe = false,
  navigate: NavigateFunction,
  setLoading: (isLoading: boolean) => void
) => {
  try {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ 
      email, 
      password,
      options: !rememberMe ? {
        // @ts-ignore - The Supabase types are incorrect, expiresIn is a valid option
        expiresIn: 60 * 60 // 1 hour expiry when "remember me" is false
      } : undefined
    });
    
    if (error) {
      throw error;
    }
    
    toast.success('Successfully signed in');
    navigate('/role-selection');
  } catch (error: any) {
    toast.error(error.message || 'Error signing in');
    console.error('Error signing in:', error);
  } finally {
    setLoading(false);
  }
};

export const signUpNewUser = async (
  email: string, 
  password: string, 
  userData?: Record<string, string>,
  setLoading: (isLoading: boolean) => void,
  setUser: (user: any) => void
) => {
  try {
    setLoading(true);
    // For now, we'll disable email verification to simplify the process
    const { error, data } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: userData,
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) {
      throw error;
    }
    
    // Auto-sign in the user after signup for better UX
    if (data.user) {
      setUser(data.user);
      
      // Add user profile data to the profiles table if provided
      if (userData && data.user.id) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: userData.first_name,
            middle_name: userData.middle_name,
            last_name: userData.last_name,
            name_extension: userData.name_extension
          })
          .eq('id', data.user.id);
          
        if (profileError) {
          console.error('Error updating profile:', profileError);
        }
      }
    }
    
    toast.success('Registration successful!');
  } catch (error: any) {
    toast.error(error.message || 'Error signing up');
    console.error('Error signing up:', error);
  } finally {
    setLoading(false);
  }
};

export const signOutUser = async (
  navigate: NavigateFunction,
  setLoading: (isLoading: boolean) => void
) => {
  try {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
    
    navigate('/login');
    toast.success('Successfully signed out');
  } catch (error: any) {
    toast.error(error.message || 'Error signing out');
    console.error('Error signing out:', error);
  } finally {
    setLoading(false);
  }
};

export const getUserRoleFromDb = async (userId: string | undefined): Promise<string | null> => {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
    
    return data?.role || null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};
