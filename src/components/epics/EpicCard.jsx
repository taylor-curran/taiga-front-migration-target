import { Link } from 'react-router-dom';

const EpicCard = ({ epic, projectSlug }) => {
  const progressPercent =
    epic.user_stories_counts
      ? Math.round(
          ((epic.user_stories_counts.total - (epic.user_stories_counts.opened || 0)) /
            Math.max(epic.user_stories_counts.total, 1)) *
            100
        )
      : 0;

  return (
    <div className="epic-card">
      <div className="epic-card-header">
        <span className="epic-ref">#{epic.ref}</span>
        <Link
          to={`/project/${projectSlug}/epic/${epic.ref}`}
          className="epic-subject"
        >
          {epic.subject}
        </Link>
        {epic.color && (
          <span
            className="epic-color-indicator"
            style={{ backgroundColor: epic.color }}
          />
        )}
      </div>

      <div className="epic-card-meta">
        {epic.status_extra_info && (
          <span
            className="epic-status"
            style={{ color: epic.status_extra_info.color }}
          >
            {epic.status_extra_info.name}
          </span>
        )}
      </div>

      {epic.user_stories_counts && (
        <div className="epic-progress">
          <div className="epic-progress-bar">
            <div
              className="epic-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="epic-progress-text">
            {progressPercent}% complete ({epic.user_stories_counts.total} user stories)
          </span>
        </div>
      )}

      <div className="epic-card-footer">
        {epic.assigned_to_extra_info ? (
          <span className="epic-assignee">
            <img
              src={epic.assigned_to_extra_info.photo || '/default-avatar.png'}
              alt={epic.assigned_to_extra_info.full_name_display}
              className="assignee-avatar"
            />
            {epic.assigned_to_extra_info.full_name_display}
          </span>
        ) : (
          <span className="epic-unassigned">Unassigned</span>
        )}
      </div>
    </div>
  );
};

export default EpicCard;
