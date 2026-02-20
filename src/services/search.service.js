import api from './api';

let abortController = null;

export const searchInProject = async (projectId, text) => {
  if (abortController) {
    abortController.abort();
  }

  abortController = new AbortController();

  const response = await api.get('/search', {
    params: {
      project: projectId,
      text: text,
      get_all: false,
    },
    signal: abortController.signal,
  });

  abortController = null;
  return response.data;
};

export const fetchProjectBySlug = async (slug) => {
  const response = await api.get(`/projects/by_slug`, {
    params: { slug },
  });
  return response.data;
};
