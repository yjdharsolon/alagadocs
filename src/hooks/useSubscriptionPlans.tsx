
import { useState } from 'react';

export type BillingPlan = {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  transcriptionMinutes: number;
  isPopular?: boolean;
};

export function useSubscriptionPlans() {
  const [selectedPlan, setSelectedPlan] = useState<BillingPlan | null>(null);

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

  return {
    selectedPlan,
    billingPlans,
    handlePlanSelection,
    setSelectedPlan
  };
}
