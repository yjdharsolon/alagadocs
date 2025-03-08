
import { supabase } from "@/integrations/supabase/client";
import { BillingTransaction, BillingResult } from './types';

/**
 * Process a billing transaction
 * @param transaction The transaction details
 * @returns A result indicating success or failure
 */
export const processTransaction = async (transaction: BillingTransaction): Promise<BillingResult> => {
  try {
    const { data, error } = await supabase.functions.invoke('process-payment', {
      body: {
        userId: transaction.userId,
        planId: transaction.planId,
        paymentMethod: transaction.paymentMethod,
        amount: transaction.amount,
        currency: transaction.currency,
      },
    });

    if (error) {
      console.error('Payment processing error:', error);
      return { 
        success: false, 
        error: error.message || 'Payment processing failed' 
      };
    }

    if (!data.success) {
      return { 
        success: false, 
        error: data.error || 'Payment processing failed' 
      };
    }

    return { 
      success: true, 
      transactionId: data.transactionId 
    };
  } catch (error) {
    console.error('Transaction error:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred during payment processing' 
    };
  }
};
