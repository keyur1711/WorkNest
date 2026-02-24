import { apiClient } from '../utils/apiClient';
export const createPaymentOrder = async (bookingId) => {
  const response = await apiClient.post('/payments/create-order', { bookingId });
  return response;
};
export const verifyPayment = async (paymentData) => {
  const response = await apiClient.post('/payments/verify-payment', paymentData);
  return response;
};
export const getPaymentStatus = async (bookingId) => {
  const response = await apiClient.get(`/payments/status/${bookingId}`);
  return response;
};