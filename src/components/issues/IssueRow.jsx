import { Link } from 'react-router-dom';

const IssueRow = ({ issue, projectSlug, showTags = false }) => {
  const getPriorityClass = (priority) => {
    if (!priority) return '';
    const name = (priority.name || '').toLowerCase();
    if (name === 'high' || name === 'critical') return 'priority-high';
    if (name === 'normal') return 'priority-normal';
    return 'priority-low';
  };

  const getSeverityClass = (severity) => {
    if (!severity) return '';
    const name = (severity.name || '').toLowerCase();
    if (name === 'critical' || name === 'blocker') return 'severity-critical';
    if (name === 'major') return 'severity-major';
    return 'severity-normal';
  };

  return (
    <div className="issue-row">
      <div className="issue-ref">
        <Link to={`/project/${projectSlug}/issue/${issue.ref}`}>
          #{issue.ref}
        </Link>
      </div>
      <div className="issue-subject">
        <Link to={`/project/${projectSlug}/issue/${issue.ref}`}>
          {issue.subject}
        </Link>
        {showTags && issue.tags && issue.tags.length > 0 && (
          <div className="issue-tags">
            {issue.tags.map((tag) => (
              <span
                key={Array.isArray(tag) ? tag[0] : tag}
                className="issue-tag"
                style={{ backgroundColor: Array.isArray(tag) ? tag[1] : '#ccc' }}
              >
                {Array.isArray(tag) ? tag[0] : tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className={`issue-priority ${getPriorityClass(issue.priority_extra_info)}`}>
        {issue.priority_extra_info?.name || '-'}
      </div>
      <div className={`issue-severity ${getSeverityClass(issue.severity_extra_info)}`}>
        {issue.severity_extra_info?.name || '-'}
      </div>
      <div className="issue-status">
        <span
          className="status-badge"
          style={{ color: issue.status_extra_info?.color || '#999' }}
        >
          {issue.status_extra_info?.name || '-'}
        </span>
      </div>
      <div className="issue-assignee">
        {issue.assigned_to_extra_info ? (
          <span className="assignee-name">
            {issue.assigned_to_extra_info.full_name_display || issue.assigned_to_extra_info.username}
          </span>
        ) : (
          <span className="unassigned">Unassigned</span>
        )}
      </div>
    </div>
  );
};

export default IssueRow;
