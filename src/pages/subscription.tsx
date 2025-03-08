
import React from 'react';
import Layout from '@/components/Layout';
import { useBilling } from '@/hooks/useBilling';
import ProtectedRoute from '@/components/ProtectedRoute';
import CurrentSubscription from '@/components/billing/CurrentSubscription';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function SubscriptionPage() {
  const {
    isLoading,
    currentSubscription,
    billingPlans,
    cancelSubscription,
    isProcessing
  } = useBilling();
  
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate('/billing');
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto py-10 px-4">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">Your Subscription</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Manage your current subscription and billing details
              </p>
            </div>
            
            <CurrentSubscription 
              subscription={currentSubscription}
              plans={billingPlans}
              onUpgrade={handleUpgrade}
              onCancel={cancelSubscription}
              isLoading={isLoading}
              isProcessing={isProcessing}
            />
            
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => navigate('/billing')}
              >
                View All Plans
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
