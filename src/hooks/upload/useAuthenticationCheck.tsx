
import { supabase } from '@/integrations/supabase/client';

export const useAuthenticationCheck = () => {
  /**
   * Verifies and refreshes the user session if needed
   * @returns A promise resolving to the session data or null if error
   */
  const verifyAndRefreshSession = async () => {
    try {
      // Get session but don't force a refresh
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        throw new Error('Authentication error. Please log in again.');
      }
      
      // Only refresh if the token is about to expire
      const expiresAt = sessionData.session.expires_at;
      const currentTime = Math.floor(Date.now() / 1000);
      const timeToExpire = expiresAt - currentTime;
      
      // Refresh only if less than 10 minutes left
      if (timeToExpire < 600) {
        console.log('Token about to expire, refreshing before upload');
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          throw new Error('Authentication error. Please refresh your session.');
        }
      }
      
      return sessionData;
    } catch (error) {
      console.error('Authentication check error:', error);
      throw error;
    }
  };

  return {
    verifyAndRefreshSession
  };
};
