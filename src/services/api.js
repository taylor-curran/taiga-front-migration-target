import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.taiga.io/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for language and auth
api.interceptors.request.use(
  (config) => {
    const lang = localStorage.getItem('lang') || 'en';
    config.headers['Accept-Language'] = lang;
    
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
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

// Project Management API Functions

export const fetchProjectBySlug = async (slug) => {
  try {
    const response = await api.get(`/projects/by_slug`, {
      params: { slug }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch project by slug:', error);
    throw error;
  }
};

export const fetchProjectById = async (projectId) => {
  try {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch project:', error);
    throw error;
  }
};

export const createProject = async (projectData) => {
  try {
    const response = await api.post('/projects', projectData);
    return response.data;
  } catch (error) {
    console.error('Failed to create project:', error);
    throw error;
  }
};

export const updateProject = async (projectId, projectData) => {
  try {
    const response = await api.patch(`/projects/${projectId}`, projectData);
    return response.data;
  } catch (error) {
    console.error('Failed to update project:', error);
    throw error;
  }
};

export const deleteProject = async (projectId) => {
  try {
    await api.delete(`/projects/${projectId}`);
    return true;
  } catch (error) {
    console.error('Failed to delete project:', error);
    throw error;
  }
};

export const duplicateProject = async (projectId, data) => {
  try {
    const response = await api.post(`/projects/${projectId}/duplicate`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to duplicate project:', error);
    throw error;
  }
};

export const updateProjectLogo = async (projectId, logoFile) => {
  try {
    const formData = new FormData();
    formData.append('logo', logoFile);
    const response = await api.post(`/projects/${projectId}/change_logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update project logo:', error);
    throw error;
  }
};

export const removeProjectLogo = async (projectId) => {
  try {
    const response = await api.post(`/projects/${projectId}/remove_logo`);
    return response.data;
  } catch (error) {
    console.error('Failed to remove project logo:', error);
    throw error;
  }
};

// Project Membership API Functions

export const fetchProjectMembers = async (projectId) => {
  try {
    const response = await api.get('/memberships', {
      params: { project: projectId }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch project members:', error);
    throw error;
  }
};

export const inviteMember = async (projectId, memberData) => {
  try {
    const response = await api.post('/memberships', {
      project: projectId,
      ...memberData
    });
    return response.data;
  } catch (error) {
    console.error('Failed to invite member:', error);
    throw error;
  }
};

export const updateMembership = async (membershipId, data) => {
  try {
    const response = await api.patch(`/memberships/${membershipId}`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to update membership:', error);
    throw error;
  }
};

export const removeMembership = async (membershipId) => {
  try {
    await api.delete(`/memberships/${membershipId}`);
    return true;
  } catch (error) {
    console.error('Failed to remove membership:', error);
    throw error;
  }
};

export const resendInvitation = async (membershipId) => {
  try {
    const response = await api.post(`/memberships/${membershipId}/resend_invitation`);
    return response.data;
  } catch (error) {
    console.error('Failed to resend invitation:', error);
    throw error;
  }
};

// Project Roles API Functions

export const fetchProjectRoles = async (projectId) => {
  try {
    const response = await api.get('/roles', {
      params: { project: projectId }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch project roles:', error);
    throw error;
  }
};

// User API Functions

export const fetchCurrentUser = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch current user:', error);
    throw error;
  }
};

export const fetchUserProjects = async (userId) => {
  try {
    const response = await api.get('/projects', {
      params: { member: userId }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user projects:', error);
    throw error;
  }
};

// Project Templates

export const PROJECT_TEMPLATES = {
  SCRUM: 1,
  KANBAN: 2
};

export default api;
