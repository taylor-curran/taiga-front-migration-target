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

// Fetch project by slug
export const fetchProjectBySlug = async (slug) => {
  try {
    const response = await api.get(`/projects/by_slug`, {
      params: { slug }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch project:', error);
    return null;
  }
};

// Fetch project stats
export const fetchProjectStats = async (projectId) => {
  try {
    const response = await api.get(`/projects/${projectId}/stats`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch project stats:', error);
    return null;
  }
};

// Fetch sprints (milestones) for a project
export const fetchSprints = async (projectId, params = {}) => {
  try {
    const response = await api.get('/milestones', {
      params: {
        project: projectId,
        ...params
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch sprints:', error);
    return [];
  }
};

// Fetch user stories for backlog (unassigned to any sprint)
export const fetchBacklogUserStories = async (projectId, params = {}) => {
  try {
    const response = await api.get('/userstories', {
      params: {
        project: projectId,
        milestone__isnull: true,
        ...params
      }
    });
    return {
      userStories: response.data,
      totalCount: parseInt(response.headers['x-pagination-count'] || '0')
    };
  } catch (error) {
    console.error('Failed to fetch backlog user stories:', error);
    return { userStories: [], totalCount: 0 };
  }
};

// Fetch user stories for a specific sprint
export const fetchSprintUserStories = async (projectId, milestoneId) => {
  try {
    const response = await api.get('/userstories', {
      params: {
        project: projectId,
        milestone: milestoneId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch sprint user stories:', error);
    return [];
  }
};

// Fetch user story statuses for a project
export const fetchUserStoryStatuses = async (projectId) => {
  try {
    const response = await api.get('/userstory-statuses', {
      params: { project: projectId }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user story statuses:', error);
    return [];
  }
};

// Create a new sprint
export const createSprint = async (sprintData) => {
  try {
    const response = await api.post('/milestones', sprintData);
    return response.data;
  } catch (error) {
    console.error('Failed to create sprint:', error);
    throw error;
  }
};

// Update a sprint
export const updateSprint = async (sprintId, sprintData) => {
  try {
    const response = await api.patch(`/milestones/${sprintId}`, sprintData);
    return response.data;
  } catch (error) {
    console.error('Failed to update sprint:', error);
    throw error;
  }
};

// Create a new user story
export const createUserStory = async (userStoryData) => {
  try {
    const response = await api.post('/userstories', userStoryData);
    return response.data;
  } catch (error) {
    console.error('Failed to create user story:', error);
    throw error;
  }
};

// Update user story
export const updateUserStory = async (userStoryId, data) => {
  try {
    const response = await api.patch(`/userstories/${userStoryId}`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to update user story:', error);
    throw error;
  }
};

// Bulk update user stories order
export const bulkUpdateUserStoriesOrder = async (projectId, bulkData) => {
  try {
    const response = await api.post('/userstories/bulk_update_backlog_order', {
      project_id: projectId,
      bulk_userstories: bulkData
    });
    return response.data;
  } catch (error) {
    console.error('Failed to bulk update user stories order:', error);
    throw error;
  }
};

// Move user stories to a sprint
export const moveUserStoriesToSprint = async (projectId, milestoneId, userStoryIds) => {
  try {
    const response = await api.post('/userstories/bulk_update_milestone', {
      project_id: projectId,
      milestone_id: milestoneId,
      bulk_userstories: userStoryIds.map((id, index) => ({ us_id: id, order: index }))
    });
    return response.data;
  } catch (error) {
    console.error('Failed to move user stories to sprint:', error);
    throw error;
  }
};

export default api;
