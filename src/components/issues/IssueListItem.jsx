import { Link } from 'react-router-dom';
import moment from 'moment';
import '../../styles/components/issues/IssueListItem.css';

const IssueListItem = ({ issue, projectSlug }) => {
  const statusColor = issue.status_extra_info?.color || '#999';
  const typeColor = issue.type_extra_info?.color || '#999';
  const severityColor = issue.severity_extra_info?.color || '#999';
  const priorityColor = issue.priority_extra_info?.color || '#999';

  return (
    <div className={`issue-list-item ${issue.is_closed ? 'is-closed' : ''}`}>
      <div className="issue-type-indicator" title={issue.type_extra_info?.name || 'Type'}>
        <span className="issue-type-dot" style={{ backgroundColor: typeColor }} />
      </div>

      <div className="issue-severity-indicator" title={issue.severity_extra_info?.name || 'Severity'}>
        <span className="issue-severity-dot" style={{ backgroundColor: severityColor }} />
      </div>

      <div className="issue-priority-indicator" title={issue.priority_extra_info?.name || 'Priority'}>
        <span className="issue-priority-dot" style={{ backgroundColor: priorityColor }} />
      </div>

      <div className="issue-subject-cell">
        <Link
          to={`/project/${projectSlug}/issue/${issue.ref}`}
          className="issue-link"
          title={`#${issue.ref} ${issue.subject}`}
        >
          <span className="issue-ref">#{issue.ref}</span>
          <span className="issue-subject">{issue.subject}</span>
        </Link>
        {issue.is_blocked && (
          <span className="issue-blocked-badge" title={issue.blocked_note}>Blocked</span>
        )}
      </div>

      <div className="issue-status-cell">
        <span
          className="issue-status-badge"
          style={{ backgroundColor: statusColor }}
        >
          {issue.status_extra_info?.name || 'Unknown'}
        </span>
      </div>

      <div className="issue-modified-cell" title={moment(issue.modified_date).format('DD MMM YYYY HH:mm')}>
        {moment(issue.modified_date).format('DD MMM YYYY')}
      </div>

      <div className="issue-assigned-cell">
        {issue.assigned_to_extra_info ? (
          <span className="issue-assignee" title={issue.assigned_to_extra_info.full_name_display}>
            {issue.assigned_to_extra_info.photo ? (
              <img
                className="assignee-avatar"
                src={issue.assigned_to_extra_info.photo}
                alt={issue.assigned_to_extra_info.full_name_display}
              />
            ) : (
              <span className="assignee-initials">
                {issue.assigned_to_extra_info.full_name_display?.charAt(0) || '?'}
              </span>
            )}
          </span>
        ) : (
          <span className="issue-unassigned">--</span>
        )}
      </div>
    </div>
  );
};

export default IssueListItem;
