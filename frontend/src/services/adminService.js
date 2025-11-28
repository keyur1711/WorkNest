import { apiClient } from '../utils/apiClient';

// Statistics
export const getStats = async () => {
  const response = await apiClient.get('/admin/stats');
  return response;
};

// User Management
export const getUsers = async (page = 1, limit = 100, role = null) => {
  const params = new URLSearchParams({ page, limit });
  if (role) params.append('role', role);
  const response = await apiClient.get(`/admin/users?${params}`);
  return response;
};

export const getUser = async (id) => {
  const response = await apiClient.get(`/admin/users/${id}`);
  return response;
};

export const updateUser = async (id, data) => {
  const response = await apiClient.patch(`/admin/users/${id}`, data);
  return response;
};

export const deleteUser = async (id) => {
  const response = await apiClient.delete(`/admin/users/${id}`);
  return response;
};

// Space Management
export const getAdminSpaces = async (page = 1, limit = 100, city = null, type = null) => {
  const params = new URLSearchParams({ page, limit });
  if (city) params.append('city', city);
  if (type) params.append('type', type);
  const response = await apiClient.get(`/admin/spaces?${params}`);
  return response;
};

export const getAdminSpace = async (id) => {
  const response = await apiClient.get(`/admin/spaces/${id}`);
  return response;
};

export const createSpace = async (data) => {
  const response = await apiClient.post('/admin/spaces', data);
  return response;
};

export const updateSpace = async (id, data) => {
  const response = await apiClient.patch(`/admin/spaces/${id}`, data);
  return response;
};

export const deleteSpace = async (id) => {
  const response = await apiClient.delete(`/admin/spaces/${id}`);
  return response;
};

// Booking Management
export const getAdminBookings = async (page = 1, limit = 100, status = null) => {
  const params = new URLSearchParams({ page, limit });
  if (status) params.append('status', status);
  const response = await apiClient.get(`/admin/bookings?${params}`);
  return response;
};

export const getAdminBooking = async (id) => {
  const response = await apiClient.get(`/admin/bookings/${id}`);
  return response;
};

export const updateBookingStatus = async (id, status) => {
  const response = await apiClient.patch(`/admin/bookings/${id}/status`, { status });
  return response;
};

// Tour Booking Management
export const getAdminTourBookings = async (page = 1, limit = 100, status = null) => {
  const params = new URLSearchParams({ page, limit });
  if (status) params.append('status', status);
  const response = await apiClient.get(`/admin/tour-bookings?${params}`);
  return response;
};

export const updateTourBookingStatus = async (id, status) => {
  const response = await apiClient.patch(`/admin/tour-bookings/${id}/status`, { status });
  return response;
};

