import { apiClient } from '../utils/apiClient';

export const submitContactForm = async (formData) => {
  const response = await apiClient.post('/contact', formData);
  return response;
};

