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
      // Prevent browser caching for API requests.
      // Some endpoints were returning 304 with no JSON body, which breaks parsing.
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        ...(headers || {})
      }
    };
    if (data !== undefined) {
      config.body = JSON.stringify(data);
    }
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
      if (endpoint.includes('/admin/')) {
        console.log('Admin API call:', endpoint, 'Token present:', !!token);
      }
    } else {
      console.warn('No token available for request:', endpoint);
    }
    let response;
    try {
      response = await fetch(url, config);
      // Some browsers/proxies still return 304 with no body; fetch marks it as !ok.
      if (response.status === 304) {
        response = await fetch(url, {
          ...config,
          cache: 'reload',
          headers: {
            ...config.headers,
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache'
          }
        });
      }
    } catch (error) {
      throw new Error('Unable to connect to the server. Please try again.');
    }
    if (!response.ok) {
      const { message, payload } = await parseErrorMessage(response);
      const error = new Error(message);
      error.status = response.status;
      error.payload = payload;
      if (response.status === 401) {
        const isProfileCheck = endpoint.includes('/auth/me');
        const isLoginPage = window.location.pathname === '/login';
        const isAdminRoute = window.location.pathname.startsWith('/admin');
        const isOwnerRoute = window.location.pathname.startsWith('/workspace-owner');
        console.error('401 Error on:', endpoint, {
          hasToken: !!token,
          isAdminRoute,
          isOwnerRoute,
          isProfileCheck,
          pathname: window.location.pathname
        });
        if ((isAdminRoute || isOwnerRoute) && !isLoginPage && !isProfileCheck) {
          const stored = localStorage.getItem('wn:auth');
          if (stored) {
            console.warn('401 on admin route but token exists in storage - might be timing issue, not clearing token');
            throw error;
          }
        }
        if (!isLoginPage && !isProfileCheck) {
          try {
            localStorage.removeItem('wn:auth');
          } catch (e) {
          }
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