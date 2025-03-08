
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getUserTransactionHistory, TransactionHistory } from '@/services/billingService';

export function useTransactionHistory() {
  const [transactions, setTransactions] = useState<TransactionHistory[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const { user } = useAuth();

  // Load transaction history
  useEffect(() => {
    async function loadTransactionHistory() {
      if (user) {
        setIsLoadingTransactions(true);
        try {
          const history = await getUserTransactionHistory(user.id);
          setTransactions(history);
        } catch (error) {
          console.error('Error loading transaction history:', error);
        } finally {
          setIsLoadingTransactions(false);
        }
      } else {
        setTransactions([]);
      }
    }
    
    loadTransactionHistory();
  }, [user]);

  const refreshTransactionHistory = async () => {
    if (user) {
      setIsLoadingTransactions(true);
      try {
        const history = await getUserTransactionHistory(user.id);
        setTransactions(history);
      } catch (error) {
        console.error('Error refreshing transaction history:', error);
      } finally {
        setIsLoadingTransactions(false);
      }
    }
  };

  return {
    transactions,
    isLoadingTransactions,
    refreshTransactionHistory
  };
}
