import api from './api';

export const fetchProjectMembers = async (projectId) => {
  const response = await api.get('/memberships', {
    params: {
      project: projectId,
    },
    headers: {
      'x-disable-pagination': 'True',
    },
  });
  return response.data;
};

export const fetchProjectMembersPaginated = async (projectId, params = {}) => {
  const response = await api.get('/memberships', {
    params: {
      project: projectId,
      ...params,
    },
  });
  return {
    members: response.data,
    totalCount: parseInt(response.headers['x-pagination-count'] || '0'),
    currentPage: parseInt(response.headers['x-pagination-current'] || '1'),
  };
};

export const fetchMemberById = async (membershipId) => {
  const response = await api.get(`/memberships/${membershipId}`);
  return response.data;
};
