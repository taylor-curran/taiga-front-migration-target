import { useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import moment from 'moment';

const Notifications = () => {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchNotifications();
    }
  };

  return (
    <div className="notifications-container">
      <button className="notifications-trigger" onClick={togglePanel}>
        Notifications
        {unreadCount > 0 && (
          <span className="notifications-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notifications-panel">
          <div className="notifications-header">
            <h3 className="notifications-title">Notifications</h3>
            {unreadCount > 0 && (
              <button
                className="notifications-mark-all"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>

          {loading ? (
            <div className="notifications-loading">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="notifications-empty">
              <p>No notifications</p>
            </div>
          ) : (
            <ul className="notifications-list">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="notification-content">
                    <p className="notification-text">
                      {notification.data?.message || notification.event || 'New notification'}
                    </p>
                    <span className="notification-time">
                      {moment(notification.created_datetime).fromNow()}
                    </span>
                  </div>
                  {!notification.read && (
                    <span className="notification-dot" />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
