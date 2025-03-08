
import { useState } from 'react';
import { useAuth } from './useAuth';
import { processBillingTransaction } from '@/services/billingService';
import toast from 'react-hot-toast';
import { BillingPlan } from './useSubscriptionPlans';

export type PaymentMethod = 'card' | 'gcash' | 'paymaya' | 'bank_transfer';

export function usePaymentManagement(updateSubscription: (userId: string, planId: string) => Promise<boolean>) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

  const processPayment = async (selectedPlan: BillingPlan | null) => {
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
        const updated = await updateSubscription(user.id, selectedPlan.id);
        
        if (updated) {
          toast.success('Payment processed successfully!');
          return true;
        } else {
          toast.error('Failed to update subscription. Please contact support.');
        }
      } else {
        toast.error(`Payment failed: ${result.error}`);
      }
      return false;
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error('Failed to process payment. Please try again later.');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    paymentMethod,
    isProcessing,
    handlePaymentMethodChange,
    processPayment
  };
}
