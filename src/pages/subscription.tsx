
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
  } = useBilling();
  
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate('/billing');
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto py-10 px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Subscription Management</h1>
              <p className="text-muted-foreground">
                View and manage your current subscription plan
              </p>
            </div>

            <CurrentSubscription
              subscription={currentSubscription}
              plans={billingPlans}
              onUpgrade={handleUpgrade}
              isLoading={isLoading}
            />

            <div className="flex flex-col items-center mt-8 space-y-4 pt-6 border-t">
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Need help with your subscription or have billing questions?
                Our support team is here to help.
              </p>
              <Button variant="outline" className="w-full max-w-xs">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
