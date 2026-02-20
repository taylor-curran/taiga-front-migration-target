import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';
import { getEventTypeLabel, getObjectUrl, getProjectUrl } from '../services/notifications.service';
import moment from 'moment';
import '../styles/pages/Notifications.css';

const NotificationBell = () => {
  const [visible, setVisible] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    loading,
    dismissNotification,
    dismissAll,
  } = useNotifications();

  const unreadNotifications = notifications.filter((n) => !n.read);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = useCallback((notification, url) => {
    if (!notification.read) {
      dismissNotification(notification.id);
    }
    setVisible(false);
    if (url) {
      navigate(url);
    }
  }, [dismissNotification, navigate]);

  const handleDismissAll = useCallback(() => {
    dismissAll();
  }, [dismissAll]);

  return (
    <div className="notification-bell" ref={dropdownRef}>
      <button
        className={`bell-icon${unreadCount > 0 ? ' pending-notifications' : ''}`}
        onClick={() => setVisible(!visible)}
        title="Notifications"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className={`counter${unreadCount > 99 ? ' large' : ''}`}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {visible && (
        <div className="navbar-dropdown-notifications">
          <div className="dropdown-header">
            {unreadCount > 0 ? (
              <button className="action" onClick={handleDismissAll}>
                Dismiss all
              </button>
            ) : (
              <span className="action disabled">Dismiss all</span>
            )}
          </div>

          <div className="notifications-wrapper">
            {!loading && unreadNotifications.length === 0 && (
              <div className="empty">
                <span>No new notifications</span>
              </div>
            )}

            <div className="notifications-list">
              {unreadNotifications.map((notification, index) => {
                const user = notification.data?.user;
                const project = notification.data?.project;
                const obj = notification.data?.obj;
                const eventLabel = getEventTypeLabel(notification.event_type);
                const objectUrl = getObjectUrl(notification);
                const projectUrl = getProjectUrl(notification);

                return (
                  <div key={notification.id || index} className="entry new">
                    <div className="entry-avatar">
                      {user?.photo ? (
                        <img src={user.photo} alt={user.name || ''} />
                      ) : (
                        <div className="avatar-placeholder">
                          {(user?.name || '?').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="entry-content">
                      <p>
                        <span className="user-link">{user?.name || 'Someone'}</span>
                        {' '}{eventLabel}{' '}
                        {obj && (
                          <span
                            className="object-link"
                            role="button"
                            tabIndex={0}
                            onClick={() => handleNotificationClick(notification, objectUrl)}
                            onKeyDown={(e) => e.key === 'Enter' && handleNotificationClick(notification, objectUrl)}
                          >
                            #{obj.ref} {obj.subject}
                          </span>
                        )}
                      </p>
                      <div className="entry-extra-data">
                        {project && (
                          <span
                            className="entry-project"
                            role="button"
                            tabIndex={0}
                            onClick={() => handleNotificationClick(notification, projectUrl)}
                            onKeyDown={(e) => e.key === 'Enter' && handleNotificationClick(notification, projectUrl)}
                          >
                            {project.name}
                          </span>
                        )}
                        <span className="entry-date">
                          {moment(notification.created).fromNow()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="notifications-bottom">
            <Link to="/notifications" onClick={() => setVisible(false)}>
              View all
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
