import { Link } from 'react-router-dom';

const IssueCard = ({ issue, projectSlug }) => {
  const severityClass = issue.severity
    ? `severity-${issue.severity}`
    : '';
  const priorityClass = issue.priority
    ? `priority-${issue.priority}`
    : '';

  return (
    <div className={`issue-card ${severityClass} ${priorityClass}`}>
      <div className="issue-card-header">
        <span className="issue-ref">#{issue.ref}</span>
        <Link
          to={`/project/${projectSlug}/issue/${issue.ref}`}
          className="issue-subject"
        >
          {issue.subject}
        </Link>
      </div>

      <div className="issue-card-meta">
        {issue.status_extra_info && (
          <span
            className="issue-status"
            style={{ color: issue.status_extra_info.color }}
          >
            {issue.status_extra_info.name}
          </span>
        )}
        {issue.type_extra_info && (
          <span className="issue-type">
            {issue.type_extra_info.name}
          </span>
        )}
        {issue.severity_extra_info && (
          <span className="issue-severity">
            {issue.severity_extra_info.name}
          </span>
        )}
        {issue.priority_extra_info && (
          <span className="issue-priority">
            {issue.priority_extra_info.name}
          </span>
        )}
      </div>

      <div className="issue-card-footer">
        {issue.assigned_to_extra_info ? (
          <span className="issue-assignee">
            <img
              src={issue.assigned_to_extra_info.photo || '/default-avatar.png'}
              alt={issue.assigned_to_extra_info.full_name_display}
              className="assignee-avatar"
            />
            {issue.assigned_to_extra_info.full_name_display}
          </span>
        ) : (
          <span className="issue-unassigned">Unassigned</span>
        )}
        {issue.total_voters !== undefined && (
          <span className="issue-votes">
            {issue.total_voters} {issue.total_voters === 1 ? 'vote' : 'votes'}
          </span>
        )}
      </div>
    </div>
  );
};

export default IssueCard;
