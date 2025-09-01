import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.taiga.io/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for language
api.interceptors.request.use(
  (config) => {
    const lang = localStorage.getItem('lang') || 'en';
    config.headers['Accept-Language'] = lang;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

// Health check function
export const healthCheck = async () => {
  try {
    const response = await api.get('/');
    console.log('API Health Check Success:', response.status);
    return { status: 'healthy', data: response.data };
  } catch (error) {
    console.error('API Health Check Failed:', error.message);
    return { status: 'unhealthy', error: error.message };
  }
};

export const fetchFeaturedProjects = async () => {
  try {
    const response = await api.get('/projects', {
      params: {
        discover_mode: true,
        is_featured: true
      }
    });
    return response.data.slice(0, 4);
  } catch (error) {
    console.error('Failed to fetch featured projects:', error);
    return [];
  }
};

export const fetchMostLikedProjects = async (params = {}) => {
  try {
    const response = await api.get('/projects', {
      params: {
        discover_mode: true,
        ...params
      }
    });
    return response.data.slice(0, 4);
  } catch (error) {
    console.error('Failed to fetch most liked projects:', error);
    return [];
  }
};

export const fetchMostActiveProjects = async (params = {}) => {
  try {
    const response = await api.get('/projects', {
      params: {
        discover_mode: true,
        ...params
      }
    });
    return response.data.slice(0, 4);
  } catch (error) {
    console.error('Failed to fetch most active projects:', error);
    return [];
  }
};

export const fetchDiscoverStats = async () => {
  try {
    const response = await api.get('/stats/discover');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch discover stats:', error);
    return { projects: { total: 0 } };
  }
};

export const fetchLocales = async () => {
  try {
    const response = await api.get('/locales');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch locales:', error);
    return [];
  }
};

export default api;
