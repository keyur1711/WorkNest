import { apiClient } from '../utils/apiClient';
export const ownerService = {
  getOverview() {
    return apiClient.get('/owner/dashboard/overview');
  },
  getSpaces() {
    return apiClient.get('/owner/spaces');
  },
  createSpace(data) {
    return apiClient.post('/owner/spaces', data);
  },
  updateSpace(id, data) {
    return apiClient.patch(`/owner/spaces/${id}`, data);
  },
  deleteSpace(id) {
    return apiClient.delete(`/owner/spaces/${id}`);
  },
  getBookings(scope = 'active') {
    return apiClient.get(`/owner/bookings?scope=${scope}`);
  },
  getTourRequests() {
    return apiClient.get('/owner/tour-requests');
  },
  updateTourStatus(tourId, status) {
    return apiClient.patch(`/owner/tour-requests/${tourId}/status`, { status });
  },
  getAgreements() {
    return apiClient.get('/owner/agreements');
  },
  createAgreement(data) {
    return apiClient.post('/owner/agreements', data);
  },
  updateAgreement(id, data) {
    return apiClient.patch(`/owner/agreements/${id}`, data);
  },
  getReviews() {
    return apiClient.get('/owner/reviews');
  },
  updateReview(id, data) {
    return apiClient.patch(`/owner/reviews/${id}`, data);
  },
  getEarningsReport() {
    return apiClient.get('/owner/reports/earnings');
  },
  submitSupportTicket(data) {
    return apiClient.post('/owner/support', data);
  },
  completeBooking(bookingId) {
    return apiClient.patch(`/owner/bookings/${bookingId}/complete`);
  }
};