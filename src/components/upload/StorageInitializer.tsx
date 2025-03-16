
import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import toast from 'react-hot-toast';

interface StorageInitializerProps {
  userId: string | undefined;
  onError: (error: string) => void;
}

export const StorageInitializer: React.FC<StorageInitializerProps> = ({ 
  userId,
  onError
}) => {
  useEffect(() => {
    const initializeStorageBucket = async () => {
      try {
        if (!userId) return;
        
        // Get the current session without refreshing
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !sessionData.session) {
          console.error('No valid session:', sessionError);
          onError('Authentication error. Please log in again.');
          return;
        }
        
        // Call the function to ensure storage bucket exists but don't block UI
        supabase.functions.invoke('ensure-transcription-bucket')
          .then(({ error: bucketError }) => {
            if (bucketError) {
              console.error('Error initializing storage bucket:', bucketError);
              onError('Error initializing storage. Please try again or contact support.');
            }
          });
      } catch (err) {
        console.error('Error initializing storage bucket:', err);
        onError('Error initializing storage. Please try again or contact support.');
      }
    };

    initializeStorageBucket();
  }, [userId, onError]);

  return null;
};
