
import { useSubscriptionPlans, BillingPlan } from './useSubscriptionPlans';
import { useSubscriptionManagement, Subscription, SubscriptionStatus } from './useSubscriptionManagement';
import { usePaymentManagement, PaymentMethod } from './usePaymentManagement';
import { useTransactionHistory } from './useTransactionHistory';

export type { BillingPlan, Subscription, SubscriptionStatus, PaymentMethod };

export function useBilling() {
  const { 
    selectedPlan,
    billingPlans,
    handlePlanSelection,
    setSelectedPlan
  } = useSubscriptionPlans();

  const {
    currentSubscription,
    isLoading,
    isProcessing: isSubscriptionProcessing,
    setIsProcessing: setSubscriptionProcessing,
    cancelSubscription,
    updateSubscription
  } = useSubscriptionManagement(setSelectedPlan, billingPlans);

  const {
    paymentMethod,
    isProcessing: isPaymentProcessing,
    handlePaymentMethodChange,
    processPayment: processPaymentBase
  } = usePaymentManagement(updateSubscription);

  const {
    transactions,
    isLoadingTransactions,
    refreshTransactionHistory
  } = useTransactionHistory();

  // Wrap the processPayment function to also refresh transaction history
  const processPayment = async () => {
    const result = await processPaymentBase(selectedPlan);
    if (result) {
      await refreshTransactionHistory();
    }
    return result;
  };

  // Combine isProcessing states
  const isProcessing = isSubscriptionProcessing || isPaymentProcessing;

  return {
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
  };
}
