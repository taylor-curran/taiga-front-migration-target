import api from './api';

export const fetchProjectBySlug = async (slug) => {
  const resolverResponse = await api.get('/resolver', {
    params: { project: slug }
  });
  const projectId = resolverResponse.data.project;
  const response = await api.get(`/projects/${projectId}`);
  return response.data;
};

export const fetchIssues = async (projectId, params = {}) => {
  const queryParams = {
    project: projectId,
    page_size: 25,
    ...params
  };
  const response = await api.get('/issues', { params: queryParams });
  return {
    issues: response.data,
    totalCount: parseInt(response.headers['x-pagination-count'] || '0'),
    currentPage: parseInt(queryParams.page || '1'),
    pageSize: queryParams.page_size
  };
};

export const fetchIssueByRef = async (projectId, ref) => {
  const response = await api.get('/issues/by_ref', {
    params: { project: projectId, ref }
  });
  return response.data;
};

export const fetchIssueFiltersData = async (projectId) => {
  const response = await api.get('/issues/filters_data', {
    params: { project: projectId }
  });
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

export const fetchSeverities = async (projectId) => {
  const response = await api.get('/severities', {
    params: { project: projectId }
  });
  return response.data;
};

export const fetchPriorities = async (projectId) => {
  const response = await api.get('/priorities', {
    params: { project: projectId }
  });
  return response.data;
};

export const fetchProjectMembers = async (projectId) => {
  const response = await api.get('/memberships', {
    params: { project: projectId }
  });
  return response.data;
};
