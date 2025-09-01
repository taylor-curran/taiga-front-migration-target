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
        is_featured: true,
        page_size: 4
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch featured projects:', error);
    return [];
  }
};

export const fetchMostLikedProjects = async () => {
  try {
    const response = await api.get('/projects', {
      params: {
        page_size: 4,
        order_by: '-total_fans'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch most liked projects:', error);
    return [];
  }
};

export const fetchMostActiveProjects = async () => {
  try {
    const response = await api.get('/projects', {
      params: {
        page_size: 4,
        order_by: '-total_activity'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch most active projects:', error);
    return [];
  }
};

export const fetchDiscoverStats = async () => {
  try {
    // Fetch total count of public projects
    const response = await api.get('/projects', {
      params: {
        page_size: 1
      },
      headers: {
        'x-disable-pagination': 'True'
      }
    });
    // The x-pagination-count header contains the total count
    const totalCount = response.headers['x-pagination-count'] || 0;
    return { projects: { total: parseInt(totalCount) || 0 } };
  } catch (error) {
    console.error('Failed to fetch discover stats:', error);
    // Fallback: try to get a rough count
    try {
      const fallback = await api.get('/projects');
      return { projects: { total: fallback.data.length || 0 } };
    } catch {
      return { projects: { total: 0 } };
    }
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
