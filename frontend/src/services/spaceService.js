import { apiClient } from '../utils/apiClient';

// Get all spaces with optional filters
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

// Get a single space by ID
export const getSpace = async (id) => {
  const response = await apiClient.get(`/spaces/${id}`);
  return response;
};

// Get filter options (cities and types)
export const getFilters = async () => {
  const response = await apiClient.get('/spaces/filters');
  return response;
};

