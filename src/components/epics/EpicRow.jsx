import { useState } from 'react';

const EpicRow = ({ epic, onToggleExpand }) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
    if (onToggleExpand) {
      onToggleExpand(epic, !expanded);
    }
  };

  const progress = epic.user_stories_counts
    ? Math.round(
        ((epic.user_stories_counts.total - (epic.user_stories_counts.opened || 0)) /
          Math.max(epic.user_stories_counts.total, 1)) * 100
      )
    : 0;

  return (
    <div className={`epic-row ${expanded ? 'expanded' : ''}`}>
      <div className="epic-row-main" onClick={handleToggle}>
        <div className="epic-expand-toggle">
          <span className={`expand-arrow ${expanded ? 'open' : ''}`}>&#9654;</span>
        </div>
        <div className="epic-color" style={{ backgroundColor: epic.color || '#999' }} />
        <div className="epic-ref">#{epic.ref}</div>
        <div className="epic-subject">{epic.subject}</div>
        <div className="epic-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-text">{progress}%</span>
        </div>
        <div className="epic-status">
          <span
            className="status-badge"
            style={{ color: epic.status_extra_info?.color || '#999' }}
          >
            {epic.status_extra_info?.name || '-'}
          </span>
        </div>
        <div className="epic-assignee">
          {epic.assigned_to_extra_info ? (
            <span className="assignee-name">
              {epic.assigned_to_extra_info.full_name_display || epic.assigned_to_extra_info.username}
            </span>
          ) : (
            <span className="unassigned">Unassigned</span>
          )}
        </div>
      </div>
      {expanded && epic.relatedUserStories && (
        <div className="epic-user-stories">
          {epic.relatedUserStories.length === 0 ? (
            <p className="no-stories">No related user stories</p>
          ) : (
            <ul className="story-list">
              {epic.relatedUserStories.map((story) => (
                <li key={story.id} className="story-row">
                  <span className="story-ref">#{story.ref}</span>
                  <span className="story-subject">{story.subject}</span>
                  <span
                    className="story-status"
                    style={{ color: story.status_extra_info?.color || '#999' }}
                  >
                    {story.status_extra_info?.name || '-'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default EpicRow;
