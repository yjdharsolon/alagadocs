
import { TransactionHistory } from './types';

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
