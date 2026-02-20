import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import '../styles/components/Notifications.css';

const EVENT_TYPE_LABELS = {
  1: 'assigned you',
  2: 'mentioned you',
  3: 'added you as watcher',
  4: 'added you as member',
  5: 'commented',
  6: 'mentioned you in a comment',
};

const Notifications = () => {
  const { isAuthenticated } = useAuth();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();

  if (!isAuthenticated) {
    return (
      <div className="notifications-page">
        <div className="notifications-login-required">
          <h2>Login Required</h2>
          <p>You need to be logged in to view your notifications.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="notifications-centered">
        <header className="notifications-header">
          <h1 className="notifications-title">My Notifications</h1>
          {notifications.length > 0 && unreadCount > 0 && (
            <button
              className="dismiss-all-btn"
              onClick={markAllAsRead}
            >
              Dismiss all
            </button>
          )}
          {(notifications.length === 0 || unreadCount === 0) && (
            <span className="dismiss-all-disabled">Dismiss all</span>
          )}
        </header>

        {loading ? (
          <div className="notifications-loading">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="notifications-empty">
            <h2>No notifications</h2>
            <p>You have no notifications at this time.</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => {
              const eventLabel = EVENT_TYPE_LABELS[notification.event_type] || 'updated';
              const userName = notification.data?.user?.name || 'Someone';
              const objSubject = notification.data?.obj?.subject || '';
              const objRef = notification.data?.obj?.ref || '';
              const projectName = notification.data?.project?.name || '';

              return (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                >
                  <div className="notification-content">
                    <div className="notification-text">
                      <span className="notification-user">{userName}</span>
                      {' '}{eventLabel}{' '}
                      {objRef && (
                        <span className="notification-ref">#{objRef} </span>
                      )}
                      {objSubject && (
                        <span className="notification-subject">{objSubject}</span>
                      )}
                    </div>
                    {projectName && (
                      <div className="notification-project">
                        in {projectName}
                      </div>
                    )}
                    <div className="notification-time">
                      {notification.created_datetime
                        ? new Date(notification.created_datetime).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : ''}
                    </div>
                  </div>
                  {!notification.read && (
                    <button
                      className="notification-dismiss"
                      onClick={() => markAsRead(notification.id)}
                      title="Mark as read"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
