import api from './api';

export const fetchIssues = async (projectId, params = {}) => {
  const response = await api.get('/issues', {
    params: {
      project: projectId,
      ...params,
    },
  });
  return {
    issues: response.data,
    totalCount: parseInt(response.headers['x-pagination-count'] || '0'),
    currentPage: parseInt(response.headers['x-pagination-current'] || '1'),
  };
};

export const fetchIssueByRef = async (projectId, ref) => {
  const response = await api.get('/issues/by_ref', {
    params: {
      project: projectId,
      ref,
    },
  });
  return response.data;
};

export const fetchIssueById = async (issueId) => {
  const response = await api.get(`/issues/${issueId}`);
  return response.data;
};

export const updateIssueAssignment = async (issueId, assignedTo, version) => {
  const response = await api.patch(`/issues/${issueId}`, {
    assigned_to: assignedTo,
    version,
  });
  return response.data;
};
