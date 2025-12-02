import { apiClient } from '../utils/apiClient';

// Get reviews for a specific space
export const getSpaceReviews = async (spaceId) => {
  const response = await apiClient.get(`/spaces/${spaceId}/reviews`);
  return response;
};

// Get review count for a space
export const getSpaceReviewCount = async (spaceId) => {
  try {
    const response = await getSpaceReviews(spaceId);
    return (response.reviews || []).length;
  } catch (err) {
    console.error('Error fetching review count:', err);
    return 0;
  }
};

