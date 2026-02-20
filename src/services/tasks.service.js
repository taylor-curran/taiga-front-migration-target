import api from './api';

export const listTasks = async (params = {}) => {
  const response = await api.get('/tasks', { params });
  return response.data;
};

export const listInAllProjects = async (params = {}) => {
  const response = await api.get('/tasks', {
    params,
    headers: { 'x-disable-pagination': '1' },
  });
  return response.data;
};

export const getTask = async (taskId) => {
  const response = await api.get(`/tasks/${taskId}`);
  return response.data;
};

export const createTask = async (data) => {
  const response = await api.post('/tasks', data);
  return response.data;
};

export const updateTask = async (taskId, data) => {
  const response = await api.patch(`/tasks/${taskId}`, data);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data;
};

export const getTaskByRef = async (projectId, ref) => {
  const response = await api.get('/tasks/by_ref', {
    params: { project: projectId, ref },
  });
  return response.data;
};

export const bulkCreateTasks = async (projectId, milestoneId, bulkTasks) => {
  const response = await api.post('/tasks/bulk_create', {
    project_id: projectId,
    milestone_id: milestoneId,
    bulk_tasks: bulkTasks,
  });
  return response.data;
};
