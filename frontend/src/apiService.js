// Frontend API Service Helper
const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Get user from localStorage
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getAuthToken();
    const user = this.getUser();
    return !!(token && user);
  }

  // Logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  // Generic API call method
  async apiCall(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401 || response.status === 403) {
          this.logout();
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Auth methods
  async register(userData) {
    return this.apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getProfile() {
    return this.apiCall('/auth/profile');
  }

  async logoutUser() {
    try {
      await this.apiCall('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      this.logout();
    }
  }

  // Health check
  async healthCheck() {
    return this.apiCall('/health');
  }

  // Future methods for forms, documents, etc.
  async getForms() {
    return this.apiCall('/forms');
  }

  async createForm(formData) {
    return this.apiCall('/forms', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  async updateForm(formId, formData) {
    return this.apiCall(`/forms/${formId}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
    });
  }

  async deleteForm(formId) {
    return this.apiCall(`/forms/${formId}`, {
      method: 'DELETE',
    });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

// Export individual methods for convenience
export const {
  register,
  login,
  getProfile,
  logoutUser,
  healthCheck,
  getForms,
  createForm,
  updateForm,
  deleteForm,
  isAuthenticated,
  getUser,
} = apiService;