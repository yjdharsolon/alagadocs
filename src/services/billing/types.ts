
/**
 * Types for billing service
 */

export type BillingTransaction = {
  userId: string;
  planId: string;
  paymentMethod: string;
  amount: number;
  currency: string;
};

export type BillingResult = {
  success: boolean;
  transactionId?: string;
  error?: string;
};

export type TransactionHistory = {
  id: string;
  user_id: string;
  plan_id: string;
  payment_method: string;
  amount: number;
  currency: string;
  status: 'success' | 'failed' | 'pending';
  created_at: string;
};

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'unpaid' | 'inactive';

export type Subscription = {
  id: string;
  user_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  created_at: string;
  updated_at: string;
};
