import api from './api';

const PAGE_SIZE = 20;

export const fetchIssues = async (projectId, params = {}) => {
  const queryParams = {
    project: projectId,
    page_size: PAGE_SIZE,
    ...params
  };
  const response = await api.get('/issues', { params: queryParams });
  return {
    issues: response.data,
    totalCount: parseInt(response.headers['x-pagination-count'] || '0'),
    nextPage: response.headers['x-pagination-next'],
    prevPage: response.headers['x-pagination-prev']
  };
};

export const fetchIssueByRef = async (projectId, ref) => {
  const response = await api.get('/issues/by_ref', {
    params: { project: projectId, ref }
  });
  return response.data;
};

export const fetchIssueById = async (issueId) => {
  const response = await api.get(`/issues/${issueId}`);
  return response.data;
};

export const createIssue = async (data) => {
  const response = await api.post('/issues', data);
  return response.data;
};

export const updateIssue = async (issueId, data) => {
  const response = await api.patch(`/issues/${issueId}`, data);
  return response.data;
};

export const deleteIssue = async (issueId) => {
  const response = await api.delete(`/issues/${issueId}`);
  return response.data;
};

export const fetchIssueStatuses = async (projectId) => {
  const response = await api.get('/issue-statuses', {
    params: { project: projectId }
  });
  return response.data;
};

export const fetchIssueTypes = async (projectId) => {
  const response = await api.get('/issue-types', {
    params: { project: projectId }
  });
  return response.data;
};

export const fetchIssuePriorities = async (projectId) => {
  const response = await api.get('/priorities', {
    params: { project: projectId }
  });
  return response.data;
};

export const fetchIssueSeverities = async (projectId) => {
  const response = await api.get('/severities', {
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
