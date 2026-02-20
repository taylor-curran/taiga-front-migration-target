import api from './api';

export const searchService = {
  async search(projectId, query) {
    const response = await api.get('/search', {
      params: {
        project: projectId,
        text: query,
      },
    });
    return response.data;
  },

  async searchInProject(projectSlug, query) {
    const projectRes = await api.get('/projects/by_slug', {
      params: { slug: projectSlug },
    });
    const projectId = projectRes.data.id;
    return this.search(projectId, query);
  },
};

export default searchService;
