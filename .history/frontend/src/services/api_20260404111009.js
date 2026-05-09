import axios from 'axios';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor to add token and handle FormData
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // If the request data is FormData, remove Content-Type header
    // so the browser can set it with the correct boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    // Log request for debugging (optional, remove in production)
    if (import.meta.env.DEV) {
      console.log(`%c📤 ${config.method.toUpperCase()} ${config.url}`, 'color: #00bcd4');
      if (config.data && !(config.data instanceof FormData)) {
        console.log('   Data:', config.data);
      }
      if (config.data instanceof FormData) {
        const formDataObj = {};
        config.data.forEach((value, key) => {
          formDataObj[key] = value instanceof File ? `File: ${value.name} (${(value.size / 1024).toFixed(2)} KB)` : value;
        });
        console.log('   FormData:', formDataObj);
      }
    }
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    // Log response for debugging
    if (import.meta.env.DEV) {
      console.log(`%c📥 ${response.status} ${response.config.url}`, 'color: #4caf50');
      if (response.data && response.data.data) {
        const dataSize = JSON.stringify(response.data.data).length;
        console.log(`   Response size: ${(dataSize / 1024).toFixed(2)} KB`);
      }
    }
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.error || error.response.data?.message || 'Server error';
      
      console.error(`%c❌ API Error: ${error.response.status} - ${errorMessage}`, 'color: #f44336');
      console.error('   URL:', error.config?.url);
      console.error('   Data:', error.response.data);
      
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/login' && !window.location.pathname.startsWith('/admin')) {
            window.location.href = '/login';
          }
          break;
        case 403:
          console.error('Forbidden access - insufficient permissions');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 413:
          console.error('File too large - max size 5MB');
          alert('File is too large. Maximum size is 5MB.');
          break;
        case 422:
          console.error('Validation error:', error.response.data.errors);
          break;
        case 500:
          console.error('Server error - please try again later');
          break;
        default:
          break;
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('%c❌ No response received from server', 'color: #f44336');
      console.error('   Request:', error.request);
      
      // Show user-friendly message
      error.message = 'Unable to connect to server. Please check if the backend is running.';
    } else {
      // Something else happened
      console.error('%c❌ Request error:', 'color: #f44336', error.message);
    }
    
    // Create user-friendly error object
    const customError = {
      message: error.response?.data?.error || error.message || 'An error occurred',
      status: error.response?.status || 500,
      data: error.response?.data,
      originalError: error
    };
    
    return Promise.reject(customError);
  }
);

// Helper function for file uploads with progress (for BLOB storage)
export const uploadFile = async (url, file, fieldName = 'image', onProgress) => {
  if (!file) {
    throw new Error('No file provided');
  }
  
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only image files (JPEG, PNG, GIF, WEBP) are allowed');
  }
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size should be less than 5MB');
  }
  
  const formData = new FormData();
  formData.append(fieldName, file);
  
  try {
    const response = await api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
        if (import.meta.env.DEV) {
          const percentCompleted = progressEvent.total 
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          console.log(`   Upload progress: ${percentCompleted}%`);
        }
      }
    });
    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// Helper function for multiple file uploads
export const uploadMultipleFiles = async (url, files, fieldName = 'images', onProgress) => {
  if (!files || files.length === 0) {
    throw new Error('No files provided');
  }
  
  const formData = new FormData();
  files.forEach(file => {
    formData.append(fieldName, file);
  });
  
  try {
    const response = await api.post(url, formData, {
      onUploadProgress: onProgress
    });
    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// Helper function to get image URL from BLOB data
export const getImageUrl = (imageData) => {
  if (!imageData) return null;
  
  // If it's already a data URL or http URL
  if (typeof imageData === 'string') {
    if (imageData.startsWith('data:') || imageData.startsWith('http')) {
      return imageData;
    }
  }
  
  // If it's an object with url property
  if (typeof imageData === 'object' && imageData.url) {
    return imageData.url;
  }
  
  // If it's an object with id (fetch from API)
  if (typeof imageData === 'object' && imageData.id) {
    return `${API_BASE_URL.replace('/api', '')}/api/media/${imageData.id}`;
  }
  
  return null;
};

// Helper function to handle API errors
export const handleApiError = (error, showAlert = true) => {
  const message = error.message || error.data?.error || 'An error occurred';
  
  if (showAlert) {
    // You can replace this with a toast notification library
    console.error('Error:', message);
    // Uncomment to use browser alert (not recommended for production)
    // alert(message);
  }
  
  return {
    success: false,
    message,
    status: error.status || 500,
    data: error.data
  };
};

// Cache for GET requests
const cache = new Map();

// Helper function for GET requests with caching
export const getWithCache = async (url, useCache = true, ttl = 60000) => {
  const cacheKey = url;
  
  if (useCache && cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (Date.now() - cached.timestamp < ttl) {
      if (import.meta.env.DEV) {
        console.log(`%c🔄 Using cached data for ${url}`, 'color: #ff9800');
      }
      return cached.data;
    }
    cache.delete(cacheKey);
  }
  
  const response = await api.get(url);
  
  if (useCache && response.data.success) {
    cache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now()
    });
  }
  
  return response.data;
};

// Clear cache for specific URL or all
export const clearCache = (url = null) => {
  if (url) {
    cache.delete(url);
    if (import.meta.env.DEV) {
      console.log(`Cache cleared for: ${url}`);
    }
  } else {
    cache.clear();
    if (import.meta.env.DEV) {
      console.log('All cache cleared');
    }
  }
};

// Retry failed requests
export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        if (import.meta.env.DEV) {
          console.log(`Retrying... (${i + 1}/${maxRetries})`);
        }
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  
  throw lastError;
};

// Pages API helpers
export const pagesApi = {
  // Get all pages
  getAll: () => api.get('/pages'),
  
  // Get single page by ID
  getById: (id) => api.get(`/pages/${id}`),
  
  // Get page by slug
  getBySlug: (slug) => api.get(`/pages/slug/${slug}`),
  
  // Create new page
  create: (data) => api.post('/pages', data),
  
  // Update page
  update: (id, data) => api.put(`/pages/${id}`, data),
  
  // Delete page
  delete: (id) => api.delete(`/pages/${id}`)
};

// Sections API helpers
export const sectionsApi = {
  // Get sections by page ID
  getByPageId: (pageId) => api.get(`/sections/page/${pageId}`),
  
  // Create section
  create: (data) => api.post('/sections', data),
  
  // Update section
  update: (id, data) => api.put(`/sections/${id}`, data),
  
  // Delete section
  delete: (id) => api.delete(`/sections/${id}`),
  
  // Reorder sections
  reorder: (sections) => api.post('/sections/reorder', { sections })
};

// Media API helpers (for BLOB storage)
export const mediaApi = {
  // Get all media
  getAll: () => api.get('/media'),
  
  // Get single media by ID
  getById: (id) => api.get(`/media/${id}`),
  
  // Upload image (stores as BLOB)
  upload: (file, onProgress) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress
    });
  },
  
  // Delete media
  delete: (id) => api.delete(`/media/${id}`)
};

// Auth API helpers
export const authApi = {
  // Login
  login: (email, password) => api.post('/auth/login', { email, password }),
  
  // Get current user
  getMe: () => api.get('/auth/me'),
  
  // Register new user
  register: (userData) => api.post('/auth/register', userData)
};

// Settings API helpers
export const settingsApi = {
  // Get company settings
  getCompany: () => api.get('/settings/company'),
  
  // Update company settings
  updateCompany: (data) => api.put('/settings/company', data),
  
  // Upload company logo (stores as BLOB)
  uploadLogo: (file, onProgress) => {
    const formData = new FormData();
    formData.append('logo', file);
    return api.post('/settings/upload-logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress
    });
  }
};

export default api;