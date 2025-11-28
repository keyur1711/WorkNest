import { apiClient } from '../utils/apiClient';

export const createBooking = async (bookingData) => {
  const response = await apiClient.post('/bookings', bookingData);
  return response;
};

export const getMyBookings = async () => {
  const response = await apiClient.get('/bookings/my-bookings');
  return response;
};

export const getBooking = async (id) => {
  const response = await apiClient.get(`/bookings/${id}`);
  return response;
};

export const cancelBooking = async (id) => {
  const response = await apiClient.patch(`/bookings/${id}/cancel`);
  return response;
};

export const createTourBooking = async (tourData) => {
  const response = await apiClient.post('/bookings/tour', tourData);
  return response;
};

export const getMyTourBookings = async () => {
  const response = await apiClient.get('/bookings/tour/my-tours');
  return response;
};