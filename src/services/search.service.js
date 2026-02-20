import api from './api';

export const searchService = {
  async search(projectId, text, options = {}) {
    const params = {
      project: projectId,
      text,
      get_all: false,
      ...options,
    };
    const response = await api.get('/search', { params });
    return response.data;
  },
};
