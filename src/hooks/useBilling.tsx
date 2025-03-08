
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { processBillingTransaction, getUserSubscription, updateUserSubscription } from '@/services/billingService';
import toast from 'react-hot-toast';

export type PaymentMethod = 'card' | 'gcash' | 'paymaya' | 'bank_transfer';

export type BillingPlan = {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  transcriptionMinutes: number;
  isPopular?: boolean;
};

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'unpaid' | 'inactive';

export type Subscription = {
  id: string;
  planId: string;
  status: SubscriptionStatus;
  createdAt: string;
  updatedAt: string;
};

export function useBilling() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<BillingPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Standard plans available
  const billingPlans: BillingPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: 9.99,
      currency: 'USD',
      features: [
        '30 minutes of transcription per month',
        'Basic text structuring',
        'Email support'
      ],
      transcriptionMinutes: 30
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 29.99,
      currency: 'USD',
      features: [
        '120 minutes of transcription per month',
        'Advanced text structuring',
        'Priority email support',
        'Custom templates'
      ],
      transcriptionMinutes: 120,
      isPopular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99.99,
      currency: 'USD',
      features: [
        'Unlimited transcription minutes',
        'Premium text structuring',
        'Priority support 24/7',
        'Custom templates',
        'API access',
        'Multiple user accounts'
      ],
      transcriptionMinutes: -1 // Unlimited
    }
  ];

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
  }, [user]);

  const handlePlanSelection = (plan: BillingPlan) => {
    setSelectedPlan(plan);
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

  const processPayment = async () => {
    if (!user) {
      toast.error('You must be logged in to complete this transaction');
      return;
    }

    if (!selectedPlan) {
      toast.error('Please select a plan to continue');
      return;
    }

    setIsProcessing(true);

    try {
      const result = await processBillingTransaction({
        userId: user.id,
        planId: selectedPlan.id,
        paymentMethod,
        amount: selectedPlan.price,
        currency: selectedPlan.currency
      });

      if (result.success) {
        // Update subscription in database
        const updated = await updateUserSubscription(user.id, selectedPlan.id);
        
        if (updated) {
          toast.success('Payment processed successfully!');
          
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
          toast.error('Failed to update subscription. Please contact support.');
        }
      } else {
        toast.error(`Payment failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error('Failed to process payment. Please try again later.');
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    isLoading,
    selectedPlan,
    paymentMethod,
    billingPlans,
    currentSubscription,
    handlePlanSelection,
    handlePaymentMethodChange,
    processPayment
  };
}
