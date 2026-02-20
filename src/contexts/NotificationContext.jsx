import { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadNotifications = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    setLoading(true);
    try {
      const response = await api.get(`/users/${user.id}/notifications`, {
        params: { page_size: 25 }
      });
      const data = response.data?.objects || response.data || [];
      setNotifications(Array.isArray(data) ? data : []);
      const unread = Array.isArray(data) ? data.filter((n) => !n.read).length : 0;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Failed to load notifications:', err);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
    }
  }, [isAuthenticated, loadNotifications]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await api.post(`/users/${user.id}/notifications/read`, {
        id: notificationId,
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  }, [user]);

  const markAllAsRead = useCallback(async () => {
    try {
      await api.post(`/users/${user.id}/notifications/read`);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  }, [user]);

  const value = {
    notifications,
    unreadCount,
    loading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export default NotificationContext;
