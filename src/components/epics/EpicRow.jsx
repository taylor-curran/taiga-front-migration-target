import { useState } from 'react';
import { Link } from 'react-router-dom';
import RelatedUserStories from './RelatedUserStories';
import EpicStatusDropdown from './EpicStatusDropdown';
import { fetchRelatedUserStories } from '../../services/epics.service';

const EpicRow = ({ epic, projectSlug, statuses, options, onStatusChange }) => {
  const [expanded, setExpanded] = useState(false);
  const [stories, setStories] = useState([]);
  const [loadingStories, setLoadingStories] = useState(false);

  const totalStories =
    (epic.user_stories_counts?.opened || 0) +
    (epic.user_stories_counts?.closed || 0);
  const closedStories = epic.user_stories_counts?.closed || 0;
  const progressPercent = totalStories > 0
    ? Math.round((closedStories / totalStories) * 100)
    : 0;

  const handleToggleStories = async () => {
    if (totalStories === 0) return;
    const next = !expanded;
    setExpanded(next);
    if (next && stories.length === 0) {
      setLoadingStories(true);
      try {
        const data = await fetchRelatedUserStories(epic.id);
        setStories(data);
      } catch (err) {
        console.error('Failed to load related user stories:', err);
      } finally {
        setLoadingStories(false);
      }
    }
  };

  const rowClasses = [
    'epic-row',
    epic.is_blocked ? 'is-blocked' : '',
    epic.is_closed ? 'is-closed' : '',
    expanded ? 'unfold' : '',
    totalStories > 0 ? 'not-empty' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className="epic-row-wrapper">
      <div className={rowClasses} onClick={handleToggleStories}>
        {options.name !== false && (
          <div className="epic-name">
            <span className="fold-icon">
              {totalStories > 0 && (
                <span className={`chevron ${expanded ? 'expanded' : ''}`}>&#9660;</span>
              )}
            </span>
            <span
              className="epic-pill"
              style={{ backgroundColor: epic.color || '#999' }}
            />
            <Link
              to={`/project/${projectSlug}/epic/${epic.ref}`}
              className="epic-link"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="ref">#{epic.ref}</span>
              <span className="subject">{epic.subject}</span>
            </Link>
          </div>
        )}

        {options.assigned && (
          <div className="epic-assigned">
            {epic.assigned_to_extra_info ? (
              <img
                src={epic.assigned_to_extra_info.photo || '/images/unnamed.png'}
                alt={epic.assigned_to_extra_info.full_name_display || 'Assigned'}
                className="avatar"
                title={epic.assigned_to_extra_info.full_name_display}
              />
            ) : (
              <span className="unassigned">--</span>
            )}
          </div>
        )}

        {options.status && (
          <div className="epic-status-cell" onClick={(e) => e.stopPropagation()}>
            <EpicStatusDropdown
              currentStatus={epic.status_extra_info}
              statuses={statuses}
              onStatusChange={(statusId) => onStatusChange(epic, statusId)}
            />
          </div>
        )}

        {options.progress && (
          <div className="epic-progress">
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="progress-text">
              {closedStories}/{totalStories}
            </span>
          </div>
        )}
      </div>

      {expanded && (
        <div className="epic-stories-wrapper">
          {loadingStories ? (
            <div className="loading-stories">Loading stories...</div>
          ) : (
            <RelatedUserStories
              stories={stories}
              projectSlug={projectSlug}
              showClosed={options.closed_us}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default EpicRow;
