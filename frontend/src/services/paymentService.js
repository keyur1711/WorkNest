import { apiClient } from '../utils/apiClient';

// Create Razorpay order for a booking
export const createPaymentOrder = async (bookingId) => {
  const response = await apiClient.post('/payments/create-order', { bookingId });
  return response;
};

// Verify payment after Razorpay checkout
export const verifyPayment = async (paymentData) => {
  const response = await apiClient.post('/payments/verify-payment', paymentData);
  return response;
};

// Get payment status for a booking
export const getPaymentStatus = async (bookingId) => {
  const response = await apiClient.get(`/payments/status/${bookingId}`);
  return response;
};

