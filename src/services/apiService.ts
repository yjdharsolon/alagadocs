
/**
 * API Service - Handles all API calls to the backend
 */

// Base API URL - Will be replaced with actual API URL in production
const API_BASE_URL = '/api';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchWithErrorHandling(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'An unknown error occurred',
      }));
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * Audio Upload API
 */
export const uploadAudio = async (file: File) => {
  const formData = new FormData();
  formData.append('audio', file);

  return await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  }).then(res => res.json());
};

/**
 * Transcription API
 */
export const transcribeAudio = async (audioUrl: string) => {
  return await fetchWithErrorHandling(`${API_BASE_URL}/transcribe`, {
    method: 'POST',
    body: JSON.stringify({ audioUrl }),
  });
};

/**
 * Text Structuring API
 */
export const structureText = async (text: string) => {
  return await fetchWithErrorHandling(`${API_BASE_URL}/structure`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
};

/**
 * Billing API
 */
export const processPayment = async (paymentDetails: any) => {
  return await fetchWithErrorHandling(`${API_BASE_URL}/billing`, {
    method: 'POST',
    body: JSON.stringify(paymentDetails),
  });
};

/**
 * Get User Profile
 */
export const getUserProfile = async () => {
  return await fetchWithErrorHandling(`${API_BASE_URL}/profile`, {
    method: 'GET',
  });
};

/**
 * Update User Profile
 */
export const updateUserProfile = async (profileData: any) => {
  return await fetchWithErrorHandling(`${API_BASE_URL}/profile`, {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
};
