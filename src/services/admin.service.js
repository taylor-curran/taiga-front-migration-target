import api from './api';

export const fetchProjectBySlug = async (slug) => {
  const response = await api.get('/projects/by_slug', { params: { slug } });
  return response.data;
};

export const fetchProjectById = async (projectId) => {
  const response = await api.get(`/projects/${projectId}`);
  return response.data;
};

export const updateProject = async (projectId, data) => {
  const response = await api.patch(`/projects/${projectId}`, data);
  return response.data;
};

export const deleteProject = async (projectId) => {
  const response = await api.delete(`/projects/${projectId}`);
  return response.data;
};

export const exportProject = async (projectId) => {
  const response = await api.post(`/exporter/${projectId}`);
  return response;
};

export const updateProjectLogo = async (projectId, file) => {
  const formData = new FormData();
  formData.append('logo', file);
  const response = await api.post(`/projects/${projectId}/change_logo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const removeProjectLogo = async (projectId) => {
  const response = await api.post(`/projects/${projectId}/remove_logo`);
  return response.data;
};

export const fetchMemberships = async (projectId, params = {}) => {
  const response = await api.get('/memberships', {
    params: { project: projectId, ...params },
  });
  return {
    memberships: response.data,
    count: parseInt(response.headers['x-pagination-count'] || '0'),
    currentPage: parseInt(params.page || '1'),
    paginatedBy: parseInt(response.headers['x-paginated-by'] || '0'),
  };
};

export const createMembership = async (data) => {
  const response = await api.post('/memberships', data);
  return response.data;
};

export const bulkCreateMemberships = async (projectId, bulkMemberships) => {
  const response = await api.post('/memberships/bulk_create', {
    project_id: projectId,
    bulk_memberships: bulkMemberships,
  });
  return response.data;
};

export const updateMembership = async (membershipId, data) => {
  const response = await api.patch(`/memberships/${membershipId}`, data);
  return response.data;
};

export const deleteMembership = async (membershipId) => {
  const response = await api.delete(`/memberships/${membershipId}`);
  return response.data;
};

export const resendInvitation = async (membershipId) => {
  const response = await api.post(`/memberships/${membershipId}/resend_invitation`);
  return response.data;
};

export const fetchRoles = async (projectId) => {
  const response = await api.get('/roles', { params: { project: projectId } });
  return response.data;
};

export const createRole = async (data) => {
  const response = await api.post('/roles', data);
  return response.data;
};

export const updateRole = async (roleId, data) => {
  const response = await api.patch(`/roles/${roleId}`, data);
  return response.data;
};

export const deleteRole = async (roleId, moveTo) => {
  const response = await api.delete(`/roles/${roleId}`, {
    params: moveTo ? { moveTo } : {},
  });
  return response.data;
};

export const fetchWebhooks = async (projectId) => {
  const response = await api.get('/webhooks', { params: { project: projectId } });
  return response.data;
};

export const createWebhook = async (data) => {
  const response = await api.post('/webhooks', data);
  return response.data;
};

export const updateWebhook = async (webhookId, data) => {
  const response = await api.patch(`/webhooks/${webhookId}`, data);
  return response.data;
};

export const deleteWebhook = async (webhookId) => {
  const response = await api.delete(`/webhooks/${webhookId}`);
  return response.data;
};

export const testWebhook = async (webhookId) => {
  const response = await api.post(`/webhooks/${webhookId}/test`);
  return response.data;
};

export const fetchWebhookLogs = async (webhookId) => {
  const response = await api.get('/webhooklogs', { params: { webhook: webhookId } });
  return response.data;
};

export const fetchModuleStats = async (projectId, module) => {
  const response = await api.get(`/projects/${projectId}/modules/${module}`);
  return response.data;
};

export const updateModuleStats = async (projectId, module, data) => {
  const response = await api.patch(`/projects/${projectId}/modules/${module}`, data);
  return response.data;
};

export const fetchCustomAttributes = async (type, projectId) => {
  const response = await api.get(`/${type}-custom-attributes`, {
    params: { project: projectId },
  });
  return response.data;
};

export const createCustomAttribute = async (type, data) => {
  const response = await api.post(`/${type}-custom-attributes`, data);
  return response.data;
};

export const updateCustomAttribute = async (type, attributeId, data) => {
  const response = await api.patch(`/${type}-custom-attributes/${attributeId}`, data);
  return response.data;
};

export const deleteCustomAttribute = async (type, attributeId) => {
  const response = await api.delete(`/${type}-custom-attributes/${attributeId}`);
  return response.data;
};

export const bulkUpdateCustomAttributeOrder = async (type, projectId, bulkOrder) => {
  const response = await api.post(`/${type}-custom-attributes/bulk_update_order`, {
    project_id: projectId,
    bulk_custom_attributes: bulkOrder,
  });
  return response.data;
};

export const fetchProjectValues = async (resource, projectId, type) => {
  const response = await api.get(`/${resource}`, {
    params: { project: projectId },
  });
  return response.data;
};

export const createProjectValue = async (resource, data) => {
  const response = await api.post(`/${resource}`, data);
  return response.data;
};

export const updateProjectValue = async (resource, valueId, data) => {
  const response = await api.patch(`/${resource}/${valueId}`, data);
  return response.data;
};

export const deleteProjectValue = async (resource, valueId) => {
  const response = await api.delete(`/${resource}/${valueId}`);
  return response.data;
};
