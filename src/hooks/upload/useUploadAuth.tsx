
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useUploadAuth = (user: any, signOut: () => Promise<void>, setError: (error: string | null) => void) => {
  const [sessionChecked, setSessionChecked] = useState(false);
  const navigate = useNavigate();

  // Verify authentication status on mount - but only once
  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      if (!user) {
        toast.error('Please log in to upload audio');
        navigate('/login');
        return;
      }
      
      try {
        // Only check if session exists, don't refresh it here
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error);
          if (isMounted) {
            setError('Authentication error. Please log in again.');
            toast.error('Session error. Please log in again.');
            // Navigate with a slight delay to allow toast to be seen
            setTimeout(() => handleLogoutAndLogin(), 1500);
          }
          return;
        }
        
        if (!data.session) {
          console.error('No valid session found');
          if (isMounted) {
            setError('No active session. Please log in again.');
            toast.error('No active session. Please log in again.');
            setTimeout(() => handleLogoutAndLogin(), 1500);
          }
          return;
        }
        
        // Check token expiration - only refresh if it's close to expiring
        const expiresAt = data.session.expires_at;
        const currentTime = Math.floor(Date.now() / 1000);
        const timeToExpire = expiresAt - currentTime;
        
        // Only refresh if token is about to expire within 10 minutes
        if (timeToExpire < 600) {
          console.log('Token expiring soon, refreshing');
          const { error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError) {
            console.error('Error refreshing token:', refreshError);
            if (isMounted) {
              setError('Authentication error. Please log in again.');
              toast.error('Session refresh failed. Please log in again.');
              setTimeout(() => handleLogoutAndLogin(), 1500);
            }
            return;
          }
          console.log('Auth session refreshed successfully');
        } else {
          console.log('Auth session verified successfully, refresh not needed');
        }
        
        if (isMounted) {
          setSessionChecked(true);
        }
      } catch (err) {
        console.error('Error checking auth session:', err);
        if (isMounted) {
          setError('Error verifying authentication. Please try again.');
        }
      }
    };
    
    checkAuth();
    
    return () => {
      isMounted = false;
    };
  }, [user, navigate, setError]);

  const handleLogoutAndLogin = async () => {
    try {
      await signOut();
      navigate('/login');
      toast.success('Logged out successfully. Please log in again to continue.');
    } catch (err) {
      console.error('Error during logout:', err);
      // Force navigate to login even if signOut fails
      navigate('/login');
    }
  };

  return {
    sessionChecked,
    handleLogoutAndLogin
  };
};
