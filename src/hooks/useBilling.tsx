
import { useState } from 'react';
import { useAuth } from './useAuth';
import { processBillingTransaction } from '@/services/billingService';
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

export function useBilling() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<BillingPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
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
        toast.success('Payment processed successfully!');
        // Could trigger a refresh of user subscription status here
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
    selectedPlan,
    paymentMethod,
    billingPlans,
    handlePlanSelection,
    handlePaymentMethodChange,
    processPayment
  };
}
