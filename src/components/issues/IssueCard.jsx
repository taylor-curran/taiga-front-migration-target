import { Link } from 'react-router-dom';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const IssueCard = ({ issue, projectSlug }) => {
  const typeColor = issue.type_extra_info?.color || '#E44057';
  const severityColor = issue.severity_extra_info?.color || '#70728F';
  const priorityColor = issue.priority_extra_info?.color || '#70728F';

  return (
    <div className="issue-row">
      <div className="issue-level-field" title={issue.type_extra_info?.name || 'Type'}>
        <span className="level-dot" style={{ backgroundColor: typeColor }} />
      </div>
      <div className="issue-level-field" title={issue.severity_extra_info?.name || 'Severity'}>
        <span className="level-dot" style={{ backgroundColor: severityColor }} />
      </div>
      <div className="issue-level-field" title={issue.priority_extra_info?.name || 'Priority'}>
        <span className="level-dot" style={{ backgroundColor: priorityColor }} />
      </div>

      <div className="issue-subject-field">
        <Link to={`/project/${projectSlug}/issue/${issue.ref}`} title={`#${issue.ref} ${issue.subject}`}>
          <span className="issue-ref">#{issue.ref}</span>
          <span className="issue-subject">{issue.subject}</span>
          {issue.tags && issue.tags.map((tag, i) => (
            <span
              key={i}
              className="issue-tag"
              style={{ backgroundColor: tag[1] || '#A9AABC' }}
            >
              {tag[0]}
            </span>
          ))}
        </Link>
      </div>

      <div className="issue-status-field">
        <span
          className="issue-status-bind"
          style={{ color: issue.status_extra_info?.color }}
        >
          {issue.status_extra_info?.name || ''}
        </span>
      </div>

      <div className="issue-modified-field">
        {formatDate(issue.modified_date)}
      </div>

      <div className="issue-assigned-field">
        {issue.assigned_to_extra_info ? (
          <img
            src={issue.assigned_to_extra_info.photo || '/default-avatar.png'}
            alt={issue.assigned_to_extra_info.full_name_display}
            className="assignee-avatar"
          />
        ) : (
          <span className="unassigned-icon">?</span>
        )}
      </div>
    </div>
  );
};

export default IssueCard;
