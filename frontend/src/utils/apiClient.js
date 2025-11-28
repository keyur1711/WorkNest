const DEFAULT_API_BASE =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const parseErrorMessage = async (response) => {
  let payload;

  try {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      payload = await response.json();
    }
  } catch (error) {
    // Ignore JSON parse errors – we'll fall back to generic messages
  }

  if (payload?.message) {
    return { message: payload.message, payload };
  }

  if (payload?.errors?.length) {
    return { message: payload.errors[0].msg, payload };
  }

  return { message: `Request failed with status ${response.status}`, payload };
};

export const apiClient = {
  async request(endpoint, { method = 'GET', data, token, headers } = {}) {
    let url;

    if (endpoint.startsWith('http')) {
      url = endpoint;
    } else if (endpoint.startsWith('/')) {
      url = `${DEFAULT_API_BASE}${endpoint}`;
    } else {
      url = `${DEFAULT_API_BASE}/${endpoint}`;
    }

    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(headers || {})
      }
    };

    if (data !== undefined) {
      config.body = JSON.stringify(data);
    }

    // Get token from localStorage if not provided
    if (!token) {
      try {
        const stored = localStorage.getItem('wn:auth');
        if (stored) {
          const parsed = JSON.parse(stored);
          token = parsed.token;
        }
      } catch (e) {
        console.error('Error reading token from localStorage:', e);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Debug log for admin routes
      if (endpoint.includes('/admin/')) {
        console.log('Admin API call:', endpoint, 'Token present:', !!token);
      }
    } else {
      console.warn('No token available for request:', endpoint);
    }

    let response;
    try {
      response = await fetch(url, config);
    } catch (error) {
      throw new Error('Unable to connect to the server. Please try again.');
    }

    if (!response.ok) {
      const { message, payload } = await parseErrorMessage(response);
      const error = new Error(message);
      error.status = response.status;
      error.payload = payload;
      
      // Handle 401 (Unauthorized) - token expired or invalid
      if (response.status === 401) {
        const isProfileCheck = endpoint.includes('/auth/me');
        const isLoginPage = window.location.pathname === '/login';
        const isAdminRoute = window.location.pathname.startsWith('/admin');
        const isOwnerRoute = window.location.pathname.startsWith('/workspace-owner');
        
        // Log the error for debugging
        console.error('401 Error on:', endpoint, {
          hasToken: !!token,
          isAdminRoute,
          isOwnerRoute,
          isProfileCheck,
          pathname: window.location.pathname
        });
        
        // For admin/owner routes right after login, don't clear token immediately
        // This might be a timing issue where token isn't ready yet
        if ((isAdminRoute || isOwnerRoute) && !isLoginPage && !isProfileCheck) {
          const stored = localStorage.getItem('wn:auth');
          if (stored) {
            console.warn('401 on admin route but token exists in storage - might be timing issue, not clearing token');
            // Don't clear token or redirect - just throw the error
            throw error;
          }
        }
        
        // For other cases, clear token and redirect
        if (!isLoginPage && !isProfileCheck) {
          // Clear invalid token from localStorage
          try {
            localStorage.removeItem('wn:auth');
          } catch (e) {
            // Ignore errors
          }
          // Redirect to login page
          window.location.href = '/login';
        }
      }
      
      throw error;
    }

    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }

    return response.text();
  },

  get(endpoint, options) {
    return this.request(endpoint, { method: 'GET', ...(options || {}) });
  },

  post(endpoint, data, options) {
    return this.request(endpoint, {
      method: 'POST',
      data,
      ...(options || {})
    });
  },

  patch(endpoint, data, options) {
    return this.request(endpoint, {
      method: 'PATCH',
      data,
      ...(options || {})
    });
  },

  delete(endpoint, options) {
    return this.request(endpoint, { method: 'DELETE', ...(options || {}) });
  }
};

