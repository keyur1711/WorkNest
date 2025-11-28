import { apiClient } from "../utils/apiClient";

export const getFavorites = async () => {
  const response = await apiClient.get("/favorites");
  return response;
};

export const addToFavorites = async (spaceId) => {
  const response = await apiClient.post(`/favorites/${spaceId}`);
  return response;
};

export const removeFromFavorites = async (spaceId) => {
  const response = await apiClient.delete(`/favorites/${spaceId}`);
  return response;
};
