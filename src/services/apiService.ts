
/**
 * API Service - Handles all API calls to the backend
 */

// Base API URL - Will be replaced with actual API URL in production
const API_BASE_URL = '/api';

/**
 * API Service object with methods for making HTTP requests
 */
export const apiService = {
  /**
   * Make a GET request
   */
  get: async (endpoint: string, options: RequestInit = {}) => {
    return fetchWithErrorHandling(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'GET',
    });
  },

  /**
   * Make a POST request
   */
  post: async (endpoint: string, data: any, options: RequestInit = {}) => {
    return fetchWithErrorHandling(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },

  /**
   * Make a PUT request
   */
  put: async (endpoint: string, data: any, options: RequestInit = {}) => {
    return fetchWithErrorHandling(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Make a DELETE request
   */
  delete: async (endpoint: string, options: RequestInit = {}) => {
    return fetchWithErrorHandling(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'DELETE',
    });
  }
};

/**
 * Generic fetch wrapper with error handling
 */
async function fetchWithErrorHandling(url: string, options: RequestInit = {}) {
  try {
    const headers = options.body instanceof FormData
      ? { ...options.headers } 
      : {
        'Content-Type': 'application/json',
        ...options.headers,
      };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'An unknown error occurred',
      }));
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    // For non-JSON responses (like file downloads)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}
