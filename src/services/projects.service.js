import api from './api';

export const createProject = async (data) => {
  const response = await api.post('/projects', data);
  return response.data;
};

export const duplicateProject = async (projectId, data) => {
  const members = data.users.map((member) => ({ id: member }));
  const params = {
    name: data.name,
    description: data.description,
    is_private: data.is_private,
    users: members,
  };
  const response = await api.post(`/projects/${projectId}/duplicate`, params);
  return response.data;
};

export const getProjects = async (params = {}, pagination = true) => {
  const headers = {};
  if (!pagination) {
    headers['x-lazy-pagination'] = true;
  }
  const response = await api.get('/projects', { params, headers });
  return response.data;
};

export const getProjectBySlug = async (slug) => {
  const response = await api.get(`/projects/by_slug?slug=${slug}`);
  return response.data;
};

export const getProjectsByUserId = async (userId, paginate = false) => {
  const headers = {};
  if (!paginate) {
    headers['x-disable-pagination'] = '1';
  }
  const params = { member: userId, order_by: 'user_order' };
  const response = await api.get('/projects', { params, headers });
  return response.data;
};

export const getListProjectsByUserId = async (userId, paginate = false) => {
  const headers = {};
  if (!paginate) {
    headers['x-disable-pagination'] = '1';
  }
  const params = { member: userId, order_by: 'user_order', slight: true };
  const response = await api.get('/projects', { params, headers });
  return response.data;
};

export const getProjectStats = async (projectId) => {
  const response = await api.get(`/projects/${projectId}`);
  return response.data;
};

export const bulkUpdateOrder = async (bulkData) => {
  const response = await api.post('/bulk-update-projects-order', bulkData);
  return response.data;
};

export const getTimeline = async (projectId, page) => {
  const params = { page, only_relevant: true };
  const response = await api.get(`/timeline/project/${projectId}`, {
    params,
    headers: { 'x-lazy-pagination': true },
  });
  return {
    data: response.data,
    headers: response.headers,
  };
};

export const likeProject = async (projectId) => {
  const response = await api.post(`/projects/${projectId}/like`);
  return response.data;
};

export const unlikeProject = async (projectId) => {
  const response = await api.post(`/projects/${projectId}/unlike`);
  return response.data;
};

export const watchProject = async (projectId, notifyLevel) => {
  const data = {
    notify_level: notifyLevel,
    live_notify_level: notifyLevel,
  };
  const response = await api.post(`/projects/${projectId}/watch`, data);
  return response.data;
};

export const unwatchProject = async (projectId) => {
  const response = await api.post(`/projects/${projectId}/unwatch`);
  return response.data;
};

export const contactProject = async (projectId, message) => {
  const response = await api.post('/contact', {
    project: projectId,
    comment: message,
  });
  return response.data;
};

export const transferValidateToken = async (projectId, token) => {
  const response = await api.post(`/projects/${projectId}/transfer_validate_token`, { token });
  return response.data;
};

export const transferAccept = async (projectId, token, reason) => {
  const response = await api.post(`/projects/${projectId}/transfer_accept`, { token, reason });
  return response.data;
};

export const transferReject = async (projectId, token, reason) => {
  const response = await api.post(`/projects/${projectId}/transfer_reject`, { token, reason });
  return response.data;
};

export const transferRequest = async (projectId) => {
  const response = await api.post(`/projects/${projectId}/transfer_request`);
  return response.data;
};

export const transferStart = async (projectId, userId, reason) => {
  const response = await api.post(`/projects/${projectId}/transfer_start`, {
    user: userId,
    reason,
  });
  return response.data;
};
