import api from './api';

export const fetchWikiPageBySlug = async (projectId, slug) => {
  const response = await api.get('/wiki', {
    params: { project: projectId, slug }
  });
  const pages = response.data;
  if (pages.length > 0) {
    return pages[0];
  }
  return null;
};

export const fetchWikiPage = async (wikiId) => {
  const response = await api.get(`/wiki/${wikiId}`);
  return response.data;
};

export const fetchWikiPages = async (projectId) => {
  const response = await api.get('/wiki', {
    params: { project: projectId }
  });
  return response.data;
};

export const fetchWikiLinks = async (projectId) => {
  const response = await api.get('/wiki-links', {
    params: { project: projectId }
  });
  return response.data;
};

export const fetchProjectBySlug = async (slug) => {
  const response = await api.get('/projects/by_slug', {
    params: { slug }
  });
  return response.data;
};
