
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { 
  getUserSubscription, 
  updateUserSubscription, 
  cancelUserSubscription 
} from '@/services/billingService';
import toast from 'react-hot-toast';
import { BillingPlan } from './useSubscriptionPlans';

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'unpaid' | 'inactive';

export type Subscription = {
  id: string;
  planId: string;
  status: SubscriptionStatus;
  createdAt: string;
  updatedAt: string;
};

export function useSubscriptionManagement(setSelectedPlan: (plan: BillingPlan | null) => void, billingPlans: BillingPlan[]) {
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  // Load user's current subscription
  useEffect(() => {
    async function loadSubscription() {
      if (user) {
        setIsLoading(true);
        try {
          const subscription = await getUserSubscription(user.id);
          
          if (subscription) {
            setCurrentSubscription({
              id: subscription.id,
              planId: subscription.plan_id,
              status: subscription.status as SubscriptionStatus,
              createdAt: subscription.created_at,
              updatedAt: subscription.updated_at
            });
            
            // Set selected plan based on current subscription
            const userPlan = billingPlans.find(plan => plan.id === subscription.plan_id);
            if (userPlan) {
              setSelectedPlan(userPlan);
            }
          }
        } catch (error) {
          console.error('Error loading subscription:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setCurrentSubscription(null);
        setIsLoading(false);
      }
    }
    
    loadSubscription();
  }, [user, billingPlans, setSelectedPlan]);

  const cancelSubscription = async () => {
    if (!user) {
      toast.error('You must be logged in to cancel your subscription');
      return;
    }

    if (!currentSubscription || currentSubscription.status !== 'active') {
      toast.error('No active subscription to cancel');
      return;
    }

    setIsProcessing(true);

    try {
      const canceled = await cancelUserSubscription(user.id);
      
      if (canceled) {
        toast.success('Subscription canceled successfully!');
        
        // Update local subscription state
        const updatedSubscription = await getUserSubscription(user.id);
        if (updatedSubscription) {
          setCurrentSubscription({
            id: updatedSubscription.id,
            planId: updatedSubscription.plan_id,
            status: updatedSubscription.status as SubscriptionStatus,
            createdAt: updatedSubscription.created_at,
            updatedAt: updatedSubscription.updated_at
          });
        }
      } else {
        toast.error('Failed to cancel subscription. Please contact support.');
      }
    } catch (error) {
      console.error('Subscription cancellation error:', error);
      toast.error('Failed to cancel subscription. Please try again later.');
    } finally {
      setIsProcessing(false);
    }
  };

  const updateSubscription = async (userId: string, planId: string) => {
    try {
      const updated = await updateUserSubscription(userId, planId);
      
      if (updated) {
        const updatedSubscription = await getUserSubscription(userId);
        if (updatedSubscription) {
          setCurrentSubscription({
            id: updatedSubscription.id,
            planId: updatedSubscription.plan_id,
            status: updatedSubscription.status as SubscriptionStatus,
            createdAt: updatedSubscription.created_at,
            updatedAt: updatedSubscription.updated_at
          });
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Subscription update error:', error);
      return false;
    }
  };

  return {
    currentSubscription,
    isLoading,
    isProcessing,
    setIsProcessing,
    cancelSubscription,
    updateSubscription
  };
}
