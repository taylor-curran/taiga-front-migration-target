import { Link } from 'react-router-dom';
import moment from 'moment';

const SEVERITY_COLORS = {
  'Wishlist': '#70CF64',
  'Minor': '#B2DA5F',
  'Normal': '#E5CE62',
  'Important': '#E89C5A',
  'Critical': '#E44057'
};

const PRIORITY_COLORS = {
  'Low': '#70CF64',
  'Normal': '#E5CE62',
  'High': '#E89C5A',
  'Urgent': '#E44057',
  'Blocker': '#E44057'
};

const TYPE_COLORS = {
  'Bug': '#E44057',
  'Question': '#5178D3',
  'Enhancement': '#70CF64'
};

const IssueCard = ({ issue, projectSlug }) => {
  const severityColor = SEVERITY_COLORS[issue.severity_extra_info?.name] || '#999';
  const priorityColor = PRIORITY_COLORS[issue.priority_extra_info?.name] || '#999';
  const typeColor = TYPE_COLORS[issue.type_extra_info?.name] || '#999';

  return (
    <tr className={`issue-row ${issue.is_blocked ? 'issue-blocked' : ''} ${issue.is_closed ? 'issue-closed' : ''}`}>
      <td className="issue-cell issue-type-cell">
        <span
          className="issue-badge"
          style={{ backgroundColor: typeColor }}
          title={issue.type_extra_info?.name || 'Unknown'}
        >
          {issue.type_extra_info?.name || '-'}
        </span>
      </td>
      <td className="issue-cell issue-severity-cell">
        <span
          className="issue-badge"
          style={{ backgroundColor: severityColor }}
          title={issue.severity_extra_info?.name || 'Unknown'}
        >
          {issue.severity_extra_info?.name || '-'}
        </span>
      </td>
      <td className="issue-cell issue-priority-cell">
        <span
          className="issue-badge"
          style={{ backgroundColor: priorityColor }}
          title={issue.priority_extra_info?.name || 'Unknown'}
        >
          {issue.priority_extra_info?.name || '-'}
        </span>
      </td>
      <td className="issue-cell issue-subject-cell">
        <Link
          to={`/project/${projectSlug}/issues/${issue.ref}`}
          className="issue-link"
          title={`#${issue.ref} ${issue.subject}`}
        >
          <span className="issue-ref">#{issue.ref}</span>
          <span className="issue-subject">{issue.subject}</span>
        </Link>
        {issue.is_blocked && (
          <span className="issue-blocked-badge" title={issue.blocked_note}>
            Blocked
          </span>
        )}
        {issue.tags && issue.tags.length > 0 && (
          <div className="issue-tags">
            {issue.tags.map((tag) => (
              <span
                key={tag[0]}
                className="issue-tag"
                style={{ backgroundColor: tag[1] || '#ccc' }}
                title={tag[0]}
              >
                {tag[0]}
              </span>
            ))}
          </div>
        )}
      </td>
      <td className="issue-cell issue-status-cell">
        <span
          className="issue-status-badge"
          style={{ borderColor: issue.status_extra_info?.color || '#999' }}
        >
          {issue.status_extra_info?.name || '-'}
        </span>
      </td>
      <td className="issue-cell issue-modified-cell">
        <span title={moment(issue.modified_date).format('DD MMM YYYY HH:mm')}>
          {moment(issue.modified_date).format('DD MMM YYYY')}
        </span>
      </td>
      <td className="issue-cell issue-assigned-cell">
        {issue.assigned_to_extra_info ? (
          <div className="issue-assignee" title={issue.assigned_to_extra_info.full_name_display}>
            <img
              className="assignee-avatar"
              src={issue.assigned_to_extra_info.photo || '/default-avatar.png'}
              alt={issue.assigned_to_extra_info.full_name_display}
            />
            <span className="assignee-name">{issue.assigned_to_extra_info.full_name_display}</span>
          </div>
        ) : (
          <span className="unassigned">Unassigned</span>
        )}
      </td>
    </tr>
  );
};

export default IssueCard;
