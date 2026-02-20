import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';
import { getEventTypeLabel, getObjectUrl, getProjectUrl } from '../services/notifications.service';
import moment from 'moment';
import '../styles/pages/Notifications.css';

const NotificationAvatar = ({ user }) => {
  if (!user) return null;
  const photoUrl = user.photo || user.big_photo;
  const name = user.name || user.username || '';
  return (
    <div className="entry-avatar">
      {photoUrl ? (
        <img src={photoUrl} alt={name} />
      ) : (
        <div className="avatar-placeholder">{name.charAt(0).toUpperCase()}</div>
      )}
    </div>
  );
};

const NotificationEntry = ({ notification, onDismiss }) => {
  const navigate = useNavigate();
  const user = notification.data?.user;
  const project = notification.data?.project;
  const obj = notification.data?.obj;
  const isUnread = !notification.read;
  const eventLabel = getEventTypeLabel(notification.event_type);

  const handleClick = useCallback((url) => {
    if (isUnread && onDismiss) {
      onDismiss(notification.id);
    }
    if (url) {
      navigate(url);
    }
  }, [isUnread, onDismiss, notification.id, navigate]);

  const objectUrl = getObjectUrl(notification);
  const projectUrl = getProjectUrl(notification);
  const userName = user?.name || user?.username || 'Someone';
  const objRef = obj ? `#${obj.ref}` : '';
  const objSubject = obj?.subject || '';

  return (
    <div className={`entry${isUnread ? ' new' : ''}`}>
      <NotificationAvatar user={user} />
      <div className="entry-content">
        <p>
          <span
            className="user-link"
            role="button"
            tabIndex={0}
            onClick={() => handleClick(user?.is_profile_visible ? `/profile/${user.username}` : null)}
            onKeyDown={(e) => e.key === 'Enter' && handleClick(user?.is_profile_visible ? `/profile/${user.username}` : null)}
          >
            {userName}
          </span>
          {' '}{eventLabel}{' '}
          {obj && (
            <span
              className="object-link"
              role="button"
              tabIndex={0}
              onClick={() => handleClick(objectUrl)}
              onKeyDown={(e) => e.key === 'Enter' && handleClick(objectUrl)}
            >
              {objRef} {objSubject}
            </span>
          )}
        </p>
        <div className="entry-extra-data">
          {project && (
            <span
              className="entry-project"
              role="button"
              tabIndex={0}
              onClick={() => handleClick(projectUrl)}
              onKeyDown={(e) => e.key === 'Enter' && handleClick(projectUrl)}
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
};

const Notifications = () => {
  const {
    notifications,
    loading,
    hasMore,
    loadMore,
    dismissNotification,
    dismissAll,
  } = useNotifications();

  const hasUnread = notifications.some((n) => !n.read);

  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop - clientHeight < 200 && hasMore && !loading) {
      loadMore();
    }
  }, [hasMore, loading, loadMore]);

  return (
    <div className="wrapper">
      <div className="notifications-page centered">
        <header className="notifications-header">
          <h1 className="title">My notifications</h1>
          {hasUnread ? (
            <button className="action" onClick={dismissAll}>
              Dismiss all
            </button>
          ) : (
            <span className="action disabled">Dismiss all</span>
          )}
        </header>

        <section className="notifications-list" onScroll={handleScroll}>
          {loading && notifications.length === 0 && (
            <div className="spin">
              <div className="spinner" />
            </div>
          )}

          {!loading && notifications.length === 0 && (
            <div className="empty">
              <span>No notifications yet</span>
            </div>
          )}

          {notifications.map((notification, index) => (
            <NotificationEntry
              key={notification.id || index}
              notification={notification}
              onDismiss={dismissNotification}
            />
          ))}

          {loading && notifications.length > 0 && (
            <div className="spin">
              <div className="spinner" />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Notifications;
