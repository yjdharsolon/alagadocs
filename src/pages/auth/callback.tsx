
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import toast from 'react-hot-toast';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      try {
        // Check if we have a session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data?.session) {
          // Successfully logged in
          toast.success('Successfully signed in');
          navigate('/role-selection');
        } else {
          // No session found
          navigate('/login');
        }
      } catch (error: any) {
        console.error('Error during auth callback:', error);
        toast.error(error.message || 'Authentication failed');
        navigate('/login');
      }
    };

    handleAuthRedirect();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}
