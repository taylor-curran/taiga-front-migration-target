import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../services/notifications.service';

const NotificationContext = createContext(null);

const DEMO_USER_ID = 1;
const POLL_INTERVAL = 30000;

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const pollTimerRef = useRef(null);

  const loadNotifications = useCallback(async (page = 1, append = false) => {
    setLoading(true);
    const result = await fetchNotifications(DEMO_USER_ID, page);
    setNotifications((prev) =>
      append ? [...prev, ...result.items] : result.items
    );
    setTotalCount(result.total);
    setHasMore(result.next !== null);
    setCurrentPage(page);

    const unread = append
      ? 0
      : result.items.filter((n) => !n.read).length;
    if (!append) {
      setUnreadCount(unread);
    }

    setLoading(false);
    return result;
  }, []);

  const loadUnreadCount = useCallback(async () => {
    const result = await fetchNotifications(DEMO_USER_ID, 1, true);
    setUnreadCount(result.total);
  }, []);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    await loadNotifications(currentPage + 1, true);
  }, [hasMore, loading, currentPage, loadNotifications]);

  const dismissNotification = useCallback(async (notificationId) => {
    const success = await markNotificationAsRead(notificationId);
    if (success) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
    return success;
  }, []);

  const dismissAll = useCallback(async () => {
    const success = await markAllNotificationsAsRead();
    if (success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    }
    return success;
  }, []);

  const refresh = useCallback(() => {
    return loadNotifications(1, false);
  }, [loadNotifications]);

  useEffect(() => {
    loadNotifications(1, false);
  }, [loadNotifications]);

  useEffect(() => {
    pollTimerRef.current = setInterval(() => {
      loadUnreadCount();
    }, POLL_INTERVAL);
    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
      }
    };
  }, [loadUnreadCount]);

  const value = {
    notifications,
    unreadCount,
    totalCount,
    loading,
    hasMore,
    loadNotifications,
    loadMore,
    dismissNotification,
    dismissAll,
    refresh,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export default NotificationContext;
