import api from './api';

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

export const fetchIssueFiltersData = async (projectId) => {
  const response = await api.get('/issues/filters_data', {
    params: { project: projectId }
  });
  return response.data;
};

export const fetchIssueStats = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/issues_stats`);
  return response.data;
};

export const createIssue = async (issueData) => {
  const response = await api.post('/issues', issueData);
  return response.data;
};

export const updateIssue = async (issueId, issueData) => {
  const response = await api.patch(`/issues/${issueId}`, issueData);
  return response.data;
};

export const deleteIssue = async (issueId) => {
  const response = await api.delete(`/issues/${issueId}`);
  return response.data;
};

export const upvoteIssue = async (issueId) => {
  const response = await api.post(`/issues/${issueId}/upvote`);
  return response.data;
};

export const downvoteIssue = async (issueId) => {
  const response = await api.post(`/issues/${issueId}/downvote`);
  return response.data;
};

export const watchIssue = async (issueId) => {
  const response = await api.post(`/issues/${issueId}/watch`);
  return response.data;
};

export const unwatchIssue = async (issueId) => {
  const response = await api.post(`/issues/${issueId}/unwatch`);
  return response.data;
};

export const fetchIssuesForAllProjects = async (params = {}) => {
  const response = await api.get('/issues', {
    params: { ...params, page_size: 25 },
    headers: { 'x-disable-pagination': '1' }
  });
  return response.data;
};

export const bulkCreateIssues = async (projectId, milestoneId, bulkIssues) => {
  const response = await api.post('/issues/bulk_create', {
    project_id: projectId,
    milestone_id: milestoneId,
    bulk_issues: bulkIssues
  });
  return response.data;
};

export const assignIssue = async (issueId, userId) => {
  return updateIssue(issueId, { assigned_to: userId });
};

export const updateIssueStatus = async (issueId, statusId, version) => {
  return updateIssue(issueId, { status: statusId, version });
};

export const promoteIssueToUserStory = async (issueId, projectId) => {
  const response = await api.post(`/issues/${issueId}/promote_to_us`, {
    project_id: projectId
  });
  return response.data;
};
