import { apiClient } from '../utils/apiClient';

export const selectSubscriptionPlan = async (planKey) => {
  const response = await apiClient.post('/subscriptions/select', { planKey });
  return response;
};

export const createSubscriptionOrder = async (planKey) => {
  const response = await apiClient.post('/subscriptions/create-order', { planKey });
  return response;
};

export const verifySubscriptionPayment = async (paymentData) => {
  const response = await apiClient.post('/subscriptions/verify-payment', paymentData);
  return response;
};

export const getMySubscription = async () => {
  const response = await apiClient.get('/subscriptions/me');
  return response;
};