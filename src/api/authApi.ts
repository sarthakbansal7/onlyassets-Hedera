import { backendDomain } from '@/lib/network';

// Types
export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isVerified: boolean;
  kycStatus: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  fullName: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  preferences?: {
    notifications?: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    currency?: string;
    language?: string;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: string[];
}

// Base API configuration
const API_BASE_URL = `${backendDomain}/api/auth`;

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper function to handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }
  
  return data;
};

// Auth API functions
export const authApi = {
  // Register new user
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      });

      const result = await handleResponse<AuthResponse>(response);
      
      // Store token in localStorage
      if (result.success && result.data.token) {
        localStorage.setItem('authToken', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
      }
      
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Login user
  login: async (credentials: LoginData): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(credentials),
      });

      const result = await handleResponse<AuthResponse>(response);
      
      // Store token in localStorage
      if (result.success && result.data.token) {
        localStorage.setItem('authToken', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Get user profile
  getProfile: async (): Promise<{ success: boolean; data: { user: User } }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (updateData: Partial<User>): Promise<{ success: boolean; data: { user: User } }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      const result = await handleResponse<{ success: boolean; data: { user: User } }>(response);
      
      // Update stored user data
      if (result.success) {
        localStorage.setItem('user', JSON.stringify(result.data.user));
      }
      
      return result;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  // Logout user
  logout: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      const result = await handleResponse<{ success: boolean; message: string }>(response);
      
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      return result;
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get current user from localStorage
  getCurrentUser: (): User | null => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Get auth token
  getToken: (): string | null => {
    return localStorage.getItem('authToken');
  },

  // Clear auth data
  clearAuthData: (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Health check
  healthCheck: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }
};

// Export individual functions for convenience
export const {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
  isAuthenticated,
  getCurrentUser,
  getToken,
  clearAuthData,
  healthCheck
} = authApi;

export default authApi;