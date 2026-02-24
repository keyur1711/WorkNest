import { apiClient } from '../utils/apiClient';
export const getSpaces = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.city) params.append('city', filters.city);
  if (filters.type) params.append('type', filters.type);
  if (filters.minPrice) params.append('minPrice', filters.minPrice);
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
  if (filters.search) params.append('search', filters.search);
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);
  if (filters.sort) params.append('sort', filters.sort);
  const queryString = params.toString();
  const endpoint = queryString ? `/spaces?${queryString}` : '/spaces';
  const response = await apiClient.get(endpoint);
  return response;
};
export const getSpace = async (id) => {
  const response = await apiClient.get(`/spaces/${id}`);
  return response;
};
export const getFilters = async () => {
  const response = await apiClient.get('/spaces/filters');
  return response;
};