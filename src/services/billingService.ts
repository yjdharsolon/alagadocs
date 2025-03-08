
import { apiService } from './apiService';

export const billingService = {
  processPayment: async (paymentDetails: any) => {
    // This would be implemented to connect to a real backend
    return apiService.post('/billing', paymentDetails);
  },
  
  getPaymentHistory: async () => {
    // This would be implemented to connect to a real backend
    return apiService.get('/billing/history');
  }
};
