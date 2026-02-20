import api from './api';

export const getUserByUsername = async (username) => {
  try {
    const response = await api.get('/users', {
      params: { username }
    });
    const users = response.data;
    if (users.length > 0) {
      return users[0];
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch user by username:', error);
    return null;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch current user:', error);
    return null;
  }
};

export const getUserStats = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/stats`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user stats:', error);
    return null;
  }
};

export const getUserContacts = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/contacts`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user contacts:', error);
    return [];
  }
};

export const getUserTimeline = async (userId, page = 1) => {
  try {
    const response = await api.get(`/timeline/user/${userId}`, {
      params: { page, page_size: 20 }
    });
    return {
      items: response.data,
      hasNext: !!response.headers['x-pagination-next']
    };
  } catch (error) {
    console.error('Failed to fetch user timeline:', error);
    return { items: [], hasNext: false };
  }
};

export const getUserProjects = async (userId) => {
  try {
    const response = await api.get('/projects', {
      params: { member: userId, page_size: 100, order_by: 'user_order' }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user projects:', error);
    return [];
  }
};

export const getUserLikedProjects = async (userId) => {
  try {
    const response = await api.get('/projects', {
      params: { is_fan: true, page_size: 100 }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch liked projects:', error);
    return [];
  }
};

export const getUserWatchedProjects = async (userId) => {
  try {
    const response = await api.get('/projects', {
      params: { is_watcher: true, page_size: 100 }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch watched projects:', error);
    return [];
  }
};

export const updateUserProfile = async (userId, data) => {
  try {
    const response = await api.patch(`/users/${userId}`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to update user profile:', error);
    throw error;
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.post('/users/change_password', {
      current_password: currentPassword,
      password: newPassword
    });
    return response.data;
  } catch (error) {
    console.error('Failed to change password:', error);
    throw error;
  }
};

export const changeAvatar = async (file) => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/users/change_avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to change avatar:', error);
    throw error;
  }
};

export const removeAvatar = async () => {
  try {
    const response = await api.post('/users/remove_avatar');
    return response.data;
  } catch (error) {
    console.error('Failed to remove avatar:', error);
    throw error;
  }
};

export const getNotifyPolicies = async () => {
  try {
    const response = await api.get('/notify-policies');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch notification policies:', error);
    return [];
  }
};

export const updateNotifyPolicy = async (policyId, data) => {
  try {
    const response = await api.put(`/notify-policies/${policyId}`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to update notification policy:', error);
    throw error;
  }
};

export const exportUserProfile = async () => {
  try {
    const response = await api.get('/users/me', {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Failed to export profile:', error);
    throw error;
  }
};
