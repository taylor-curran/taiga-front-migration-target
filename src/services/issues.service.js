import api from './api';

const FILTER_CATEGORIES = [
  'tags',
  'status',
  'type',
  'severity',
  'priority',
  'assigned_to',
  'owner',
  'role',
];

const VALID_QUERY_PARAMS = [
  'exclude_tags',
  'tags',
  'exclude_status',
  'status',
  'exclude_type',
  'type',
  'exclude_severity',
  'severity',
  'exclude_priority',
  'priority',
  'exclude_assigned_to',
  'assigned_to',
  'exclude_role',
  'role',
  'exclude_owner',
  'owner',
  'order_by',
  'page',
  'q',
];

export { FILTER_CATEGORIES, VALID_QUERY_PARAMS };

export const fetchIssues = async (projectId, filters = {}) => {
  const params = { project: projectId, ...filters };
  const response = await api.get('/issues', { params });
  return {
    issues: response.data,
    totalCount: parseInt(response.headers['x-pagination-count'] || '0', 10),
    currentPage: parseInt(response.headers['x-pagination-current'] || '1', 10),
    paginatedBy: parseInt(response.headers['x-paginated-by'] || '20', 10),
  };
};

export const fetchIssueFiltersData = async (projectId, filters = {}) => {
  const params = { project: projectId };

  for (const key of FILTER_CATEGORIES) {
    if (filters[key] !== undefined) {
      params[key] = filters[key];
    }
    const excludeKey = `exclude_${key}`;
    if (filters[excludeKey] !== undefined) {
      params[excludeKey] = filters[excludeKey];
    }
  }

  if (filters.q) {
    params.q = filters.q;
  }

  const response = await api.get('/issues/filters_data', { params });
  const data = response.data;

  return {
    statuses: (data.statuses || []).map((it) => ({
      ...it,
      id: String(it.id),
    })),
    types: (data.types || []).map((it) => ({
      ...it,
      id: String(it.id),
    })),
    severities: (data.severities || []).map((it) => ({
      ...it,
      id: String(it.id),
    })),
    priorities: (data.priorities || []).map((it) => ({
      ...it,
      id: String(it.id),
    })),
    tags: (data.tags || []).map((it) => ({
      ...it,
      id: it.name,
    })),
    assignedTo: (data.assigned_to || []).map((it) => ({
      ...it,
      id: it.id ? String(it.id) : 'null',
      name: it.full_name || 'Unassigned',
    })),
    owners: (data.owners || []).map((it) => ({
      ...it,
      id: String(it.id),
      name: it.full_name,
    })),
    roles: (data.roles || []).map((it) => ({
      ...it,
      id: it.id ? String(it.id) : 'null',
      name: it.name || 'Unassigned',
    })),
  };
};

export const fetchIssueStats = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/issues_stats`);
  return response.data;
};
