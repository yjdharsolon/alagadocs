
import React from 'react';
import Layout from '@/components/Layout';
import { useBilling } from '@/hooks/useBilling';
import ProtectedRoute from '@/components/ProtectedRoute';
import BillingHeader from '@/components/billing/BillingHeader';
import CurrentSubscription from '@/components/billing/CurrentSubscription';
import TransactionHistory from '@/components/billing/TransactionHistory';
import PlanSelection from '@/components/billing/PlanSelection';
import PaymentForm from '@/components/billing/PaymentForm';
import SupportFooter from '@/components/billing/SupportFooter';

export default function BillingPage() {
  const {
    isProcessing,
    isLoading,
    selectedPlan,
    paymentMethod,
    billingPlans,
    currentSubscription,
    transactions,
    isLoadingTransactions,
    handlePlanSelection,
    handlePaymentMethodChange,
    processPayment,
    cancelSubscription
  } = useBilling();

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto py-10 px-4">
          <div className="max-w-5xl mx-auto space-y-10">
            <BillingHeader 
              title="Subscription Plans" 
              description="Choose the perfect plan for your needs. Upgrade or downgrade at any time."
            />

            {/* Current Subscription */}
            {(currentSubscription || isLoading) && (
              <CurrentSubscription 
                subscription={currentSubscription}
                plans={billingPlans}
                onUpgrade={() => {}}
                onCancel={cancelSubscription}
                isLoading={isLoading}
                isProcessing={isProcessing}
              />
            )}

            {/* Transaction History */}
            <TransactionHistory 
              transactions={transactions}
              isLoading={isLoadingTransactions}
            />

            {/* Plans Selection */}
            <PlanSelection 
              plans={billingPlans} 
              selectedPlan={selectedPlan} 
              onSelectPlan={handlePlanSelection} 
            />

            {/* Payment Section */}
            {selectedPlan && (
              <PaymentForm 
                selectedPlan={selectedPlan}
                paymentMethod={paymentMethod}
                onPaymentMethodChange={handlePaymentMethodChange}
                onSubmit={processPayment}
                isProcessing={isProcessing}
              />
            )}
            
            <SupportFooter />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
