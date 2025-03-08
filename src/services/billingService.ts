import { supabase } from '@/integrations/supabase/client';

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

/**
 * Process a billing transaction
 * @param transaction The transaction details
 * @returns Result of the transaction
 */
export const processBillingTransaction = async (
  transaction: BillingTransaction
): Promise<BillingResult> => {
  try {
    // Call the Supabase Edge Function for payment processing
    const { data, error } = await supabase.functions.invoke('process-payment', {
      body: transaction,
    });
    
    if (error) {
      console.error('Error processing payment:', error);
      return { 
        success: false, 
        error: `Error in payment processing: ${error.message}`
      };
    }
    
    // For demo purposes, simulate successful transaction
    // In production, this would be handled by the Edge Function
    if (!data) {
      // Log the transaction to the transactions table
      const transactionId = `tx_${Math.random().toString(36).substring(2, 12)}`;
      
      // Note: This is a simplified version for demo purposes
      // In a real app, you'd need to create this table first
      console.log('Creating transaction:', {
        id: transactionId,
        user_id: transaction.userId,
        plan_id: transaction.planId,
        payment_method: transaction.paymentMethod,
        amount: transaction.amount,
        currency: transaction.currency,
        status: 'success',
        created_at: new Date().toISOString()
      });
      
      return {
        success: true,
        transactionId
      };
    }
    
    return data as BillingResult;
  } catch (error: any) {
    console.error('Payment processing error:', error);
    return { 
      success: false, 
      error: `Payment processing failed: ${error.message}`
    };
  }
};

/**
 * Get subscription status for a user
 * @param userId The ID of the user
 * @returns The user's current subscription details
 */
export const getUserSubscription = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Subscription fetch error:', error);
    return null;
  }
};

/**
 * Update subscription status for a user
 * @param userId The ID of the user
 * @param planId The ID of the plan
 * @returns Success or failure of the update
 */
export const updateUserSubscription = async (userId: string, planId: string) => {
  try {
    // Check if user already has a subscription
    const existingSubscription = await getUserSubscription(userId);
    
    if (existingSubscription) {
      // Update existing subscription
      const { error } = await supabase
        .from('subscriptions')
        .update({ 
          plan_id: planId,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
        
      return !error;
    } else {
      // Create new subscription
      const { error } = await supabase
        .from('subscriptions')
        .insert([{ 
          user_id: userId, 
          plan_id: planId,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
        
      return !error;
    }
  } catch (error) {
    console.error('Subscription update error:', error);
    return false;
  }
};

/**
 * Cancel user's subscription
 * @param userId The ID of the user
 * @returns Success or failure of the cancellation
 */
export const cancelUserSubscription = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('subscriptions')
      .update({ 
        status: 'canceled',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
      
    return !error;
  } catch (error) {
    console.error('Subscription cancellation error:', error);
    return false;
  }
};

/**
 * Get transaction history for a user
 * @param userId The ID of the user
 * @returns Array of transaction records
 */
export const getUserTransactionHistory = async (userId: string): Promise<TransactionHistory[]> => {
  try {
    // This is a mock implementation
    // In a real app, you'd query the actual transactions table
    const mockTransactions: TransactionHistory[] = [
      {
        id: "tx_abc123def456",
        user_id: userId,
        plan_id: "pro",
        payment_method: "credit_card",
        amount: 29.99,
        currency: "USD",
        status: "success",
        created_at: new Date(Date.now() - 3600000 * 24 * 7).toISOString() // 7 days ago
      },
      {
        id: "tx_ghi789jkl012",
        user_id: userId,
        plan_id: "basic",
        payment_method: "gcash",
        amount: 9.99,
        currency: "USD",
        status: "success",
        created_at: new Date(Date.now() - 3600000 * 24 * 15).toISOString() // 15 days ago
      }
    ];
    
    return mockTransactions;
  } catch (error) {
    console.error('Transaction history fetch error:', error);
    return [];
  }
};

export type { TransactionHistory };
