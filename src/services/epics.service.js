import api from './api';

export const fetchEpics = async (projectId, page = 1) => {
  const response = await api.get('/epics', {
    params: { project: projectId, page }
  });
  return {
    epics: response.data,
    hasNext: !!response.headers['x-pagination-next'],
    totalCount: parseInt(response.headers['x-pagination-count'] || '0')
  };
};

export const fetchEpicByRef = async (projectId, ref) => {
  const response = await api.get('/epics/by_ref', {
    params: { project: projectId, ref }
  });
  return response.data;
};

export const fetchEpicById = async (epicId) => {
  const response = await api.get(`/epics/${epicId}`);
  return response.data;
};

export const createEpic = async (epicData) => {
  const response = await api.post('/epics', epicData);
  return response.data;
};

export const updateEpic = async (epicId, data) => {
  const response = await api.patch(`/epics/${epicId}`, data);
  return response.data;
};

export const deleteEpic = async (epicId) => {
  const response = await api.delete(`/epics/${epicId}`);
  return response.data;
};

export const updateEpicStatus = async (epicId, statusId, version) => {
  const response = await api.patch(`/epics/${epicId}`, {
    status: statusId,
    version
  });
  return response.data;
};

export const updateEpicAssignedTo = async (epicId, userId, version) => {
  const response = await api.patch(`/epics/${epicId}`, {
    assigned_to: userId,
    version
  });
  return response.data;
};

export const fetchRelatedUserStories = async (epicId) => {
  const response = await api.get(`/epics/${epicId}/related_userstories`);
  return response.data;
};

export const addRelatedUserStory = async (epicId, userStoryId) => {
  const response = await api.post(`/epics/${epicId}/related_userstories`, {
    user_story: userStoryId,
    epic: epicId
  });
  return response.data;
};

export const removeRelatedUserStory = async (epicId, userStoryId) => {
  const response = await api.delete(
    `/epics/${epicId}/related_userstories/${userStoryId}`
  );
  return response.data;
};

export const bulkCreateRelatedUserStories = async (epicId, projectId, subjects) => {
  const response = await api.post(
    `/epics/${epicId}/related_userstories/bulk_create`,
    {
      bulk_userstories: subjects,
      project_id: projectId
    }
  );
  return response.data;
};

export const reorderEpic = async (epicId, data, setOrders = {}) => {
  const response = await api.patch(`/epics/${epicId}`, data, {
    headers: { 'set-orders': JSON.stringify(setOrders) }
  });
  return response.data;
};

export const fetchProjectBySlug = async (slug) => {
  const response = await api.get('/projects/by_slug', {
    params: { slug }
  });
  return response.data;
};
