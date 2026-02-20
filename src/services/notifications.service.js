import api from './api';

const NOTIFICATION_EVENT_TYPES = {
  ASSIGNED: 1,
  MENTIONED: 2,
  ADDED_AS_WATCHER: 3,
  ADDED_AS_MEMBER: 4,
  COMMENTED: 5,
  MENTIONED_IN_COMMENT: 6,
};

const EVENT_TYPE_LABELS = {
  [NOTIFICATION_EVENT_TYPES.ASSIGNED]: 'assigned you to',
  [NOTIFICATION_EVENT_TYPES.MENTIONED]: 'mentioned you in',
  [NOTIFICATION_EVENT_TYPES.ADDED_AS_WATCHER]: 'added you as watcher of',
  [NOTIFICATION_EVENT_TYPES.ADDED_AS_MEMBER]: 'added you as a member',
  [NOTIFICATION_EVENT_TYPES.COMMENTED]: 'commented on',
  [NOTIFICATION_EVENT_TYPES.MENTIONED_IN_COMMENT]: 'mentioned you in a comment on',
};

const CONTENT_TYPE_URL_MAP = {
  issue: 'issues',
  task: 'tasks',
  userstory: 'userstories',
};

export const getEventTypeLabel = (eventType) => {
  return EVENT_TYPE_LABELS[eventType] || 'updated';
};

export const getObjectUrl = (notification) => {
  const obj = notification.data?.obj;
  const project = notification.data?.project;
  if (!obj || !project) return null;

  const contentType = obj.content_type;
  const section = CONTENT_TYPE_URL_MAP[contentType];
  if (!section) return null;

  return `/project/${project.slug}/${section}/${obj.ref}`;
};

export const getProjectUrl = (notification) => {
  const project = notification.data?.project;
  if (!project) return null;
  return `/project/${project.slug}`;
};

export const fetchNotifications = async (userId, page = 1, onlyUnread = false) => {
  try {
    const params = { page };
    if (onlyUnread) {
      params.only_unread = true;
    }
    const response = await api.get(`/users/${userId}/notifications`, { params });
    const total = parseInt(response.headers['x-pagination-count'] || '0', 10);
    const nextPage = response.headers['x-pagination-next'] || null;
    return {
      items: response.data || [],
      total,
      next: nextPage ? page + 1 : null,
    };
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return { items: [], total: 0, next: null };
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    await api.post(`/notifications/${notificationId}/read`);
    return true;
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    return false;
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    await api.post('/notifications/read');
    return true;
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
    return false;
  }
};

export { NOTIFICATION_EVENT_TYPES };

export default {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getEventTypeLabel,
  getObjectUrl,
  getProjectUrl,
  NOTIFICATION_EVENT_TYPES,
};
