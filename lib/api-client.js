// API Client Utility
// Centralized API handling for frontend with automatic cookie-based auth

/**
 * API Client class for making requests
 * Uses cookie-based authentication (session_token cookie set by the server)
 */
class ApiClient {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Important for cookies
    };

    // For non-FormData requests, stringify the body
    if (options.body && !options.isFormData) {
      config.body = JSON.stringify(options.body);
    } else if (options.body && options.isFormData) {
      // For FormData, let the browser set the content type
      config.body = options.body;
      delete config.headers['Content-Type'];
    }

    const response = await fetch(url, config);

    // Handle response
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Handle errors
    if (!response.ok) {
      // Handle 401 - Unauthorized
      if (response.status === 401) {
        // Only redirect to login if we're not already on the login page
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }

      const errorMessage = typeof data === 'object' && data?.error
        ? data.error
        : typeof data === 'string'
        ? data
        : 'An error occurred';

      throw new Error(errorMessage);
    }

    return data;
  }

  // GET request
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  post(endpoint, body = {}, isFormData = false) {
    return this.request(endpoint, {
      method: 'POST',
      body,
      isFormData,
    });
  }

  // PUT request
  put(endpoint, body = {}, isFormData = false) {
    return this.request(endpoint, {
      method: 'PUT',
      body,
      isFormData,
    });
  }

  // PATCH request
  patch(endpoint, body) {
    return this.request(endpoint, {
      method: 'PATCH',
      body,
    });
  }

  // DELETE request
  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Export singleton instance
export const api = new ApiClient();

// Export class for custom instances
export { ApiClient };

// ============================================
// Authentication API Methods
// ============================================

export const authApi = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  logout: () => api.post('/api/auth/logout'),
  me: () => api.get('/api/auth/me'),
  updateProfile: (data) => api.put('/api/auth/profile', data),
  changePassword: (data) => api.post('/api/auth/change-password', data),
};

// ============================================
// User API Methods
// ============================================

export const userApi = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data) => api.put('/api/users/profile', data),
};

// ============================================
// Document API Methods
// ============================================

export const documentApi = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/api/documents${query ? `?${query}` : ''}`);
  },
  get: (id) => api.get(`/api/documents/${id}`),
  upload: (formData) => api.post('/api/documents', formData, true),
  update: (id, data) => api.put(`/api/documents/${id}`, data),
  delete: (id) => api.delete(`/api/documents/${id}`),
};

// ============================================
// Statement API Methods
// ============================================

export const statementApi = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/api/statements${query ? `?${query}` : ''}`);
  },
  get: (id) => api.get(`/api/statements/${id}`),
  create: (data) => api.post('/api/statements', data),
  update: (id, data) => api.put(`/api/statements/${id}`, data),
  delete: (id) => api.delete(`/api/statements/${id}`),
};

// ============================================
// Consent API Methods
// ============================================

export const consentApi = {
  list: () => api.get('/api/consent'),
  get: (id) => api.get(`/api/consent/${id}`),
  create: (data) => api.post('/api/consent', data),
  update: (id, data) => api.put(`/api/consent/${id}`, data),
  revoke: (id) => api.post(`/api/consent/${id}/revoke`),
};

// ============================================
// Admin API Methods
// ============================================

export const adminApi = {
  // Users
  listUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/api/admin/users${query ? `?${query}` : ''}`);
  },
  getUser: (id) => api.get(`/api/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/api/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),

  // Analytics
  getAnalytics: () => api.get('/api/admin/analytics'),

  // Audit Logs
  listAuditLogs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/api/admin/audit-logs${query ? `?${query}` : ''}`);
  },

  // Announcements
  listAnnouncements: () => api.get('/api/admin/announcements'),
  getAnnouncement: (id) => api.get(`/api/admin/announcements/${id}`),
  createAnnouncement: (data) => api.post('/api/admin/announcements', data),
  updateAnnouncement: (id, data) => api.put(`/api/admin/announcements/${id}`, data),
  deleteAnnouncement: (id) => api.delete(`/api/admin/announcements/${id}`),
};
