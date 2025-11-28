import { apiClient } from '../utils/apiClient';

export const authService = {
  register(payload) {
    return apiClient.post('/auth/register', payload);
  },

  login(payload) {
    return apiClient.post('/auth/login', payload);
  },

  me(token) {
    return apiClient.get('/auth/me', { token });
  },

  getUserProfile() {
    return apiClient.get('/auth/me');
  },

  updateUserProfile(data) {
    return apiClient.patch('/auth/me', data);
  }
};

export const getUserProfile = () => authService.getUserProfile();
export const updateUserProfile = (data) => authService.updateUserProfile(data);
