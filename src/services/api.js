import axios from 'axios';
import { API_BASE_URL, DEFAULT_LANGUAGE, STORAGE_KEYS } from '../utils/constants';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    const lang = localStorage.getItem(STORAGE_KEYS.LANG) || DEFAULT_LANGUAGE;
    config.headers['Accept-Language'] = lang;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (refreshToken) {
        try {
          const refreshResponse = await axios.post(
            `${api.defaults.baseURL}/auth/refresh`,
            { refresh: refreshToken }
          );

          const newToken = refreshResponse.data.auth_token;
          const newRefresh = refreshResponse.data.refresh;

          localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefresh);

          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_INFO);
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export const healthCheck = async () => {
  try {
    const response = await api.get('/');
    return { status: 'healthy', data: response.data };
  } catch (error) {
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

export const fetchPublicProjects = async (params = {}) => {
  const queryParams = {
    page_size: 20,
    ...params
  };
  const response = await api.get('/projects', { params: queryParams });
  return {
    projects: response.data,
    totalCount: parseInt(response.headers['x-pagination-count'] || '0'),
    nextPage: response.headers['x-pagination-next'],
    prevPage: response.headers['x-pagination-prev']
  };
};

export const searchProjects = async (query, filters = {}) => {
  const params = {
    q: query,
    ...filters,
    page_size: 20
  };
  return fetchPublicProjects(params);
};

export default api;
