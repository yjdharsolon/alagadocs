
import { supabase } from '@/integrations/supabase/client';
import { BillingTransaction, BillingResult } from './types';

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
