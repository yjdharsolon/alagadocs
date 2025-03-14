
import { supabase } from '@/integrations/supabase/client';
import { Subscription } from './types';

/**
 * Get subscription status for a user
 * @param userId The ID of the user
 * @returns The user's current subscription details
 */
export const getUserSubscription = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Subscription fetch error:', error);
    return null;
  }
};

/**
 * Update subscription status for a user
 * @param userId The ID of the user
 * @param planId The ID of the plan
 * @returns Success or failure of the update
 */
export const updateUserSubscription = async (userId: string, planId: string) => {
  try {
    // Check if user already has a subscription
    const existingSubscription = await getUserSubscription(userId);
    
    if (existingSubscription) {
      // Update existing subscription
      const { error } = await supabase
        .from('subscriptions')
        .update({ 
          plan_id: planId,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
        
      return !error;
    } else {
      // Create new subscription
      const { error } = await supabase
        .from('subscriptions')
        .insert([{ 
          user_id: userId, 
          plan_id: planId,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
        
      return !error;
    }
  } catch (error) {
    console.error('Subscription update error:', error);
    return false;
  }
};

/**
 * Cancel user's subscription
 * @param userId The ID of the user
 * @returns Success or failure of the cancellation
 */
export const cancelUserSubscription = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({ 
        status: 'canceled',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
      
    return !error;
  } catch (error) {
    console.error('Subscription cancellation error:', error);
    return false;
  }
};
