import { apiClient } from '../utils/apiClient';
export const getSpaceReviews = async (spaceId) => {
  const response = await apiClient.get(`/spaces/${spaceId}/reviews`);
  return response;
};
export const getSpaceReviewCount = async (spaceId) => {
  try {
    const response = await getSpaceReviews(spaceId);
    return (response.reviews || []).length;
  } catch (err) {
    console.error('Error fetching review count:', err);
    return 0;
  }
};
export const submitBookingReview = async ({ bookingId, rating, comment }) => {
  const response = await apiClient.post('/reviews', { bookingId, rating, comment });
  return response;
};
export const getBookingReview = async (bookingId) => {
  const response = await apiClient.get(`/reviews/booking/${bookingId}`);
  return response;
};