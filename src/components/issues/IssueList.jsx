import { Link } from 'react-router-dom';
import moment from 'moment';
import '../../styles/components/IssueList.css';

const SORT_FIELDS = [
  { key: 'type', label: 'Type', className: 'level-field' },
  { key: 'severity', label: 'Severity', className: 'level-field' },
  { key: 'priority', label: 'Priority', className: 'level-field' },
  { key: 'ref', label: 'Issue', className: 'subject-field' },
  { key: 'status', label: 'Status', className: 'issue-status-field' },
  { key: 'modified_date', label: 'Modified', className: 'modified-field' },
  { key: 'assigned_to', label: 'Assigned to', className: 'assigned-field' },
];

const SortArrow = () => (
  <svg className="sort-arrows" viewBox="0 0 16 16" width="12" height="12">
    <path
      className="arrow-up"
      d="M11.6232 6.57199C12.5713 6.57199 12.9872 5.37569 12.2435 4.7876L8.62027 1.92248C8.25672 1.635 7.74328 1.635 7.37973 1.92248L3.75652 4.7876C3.01283 5.37569 3.42868 6.57199 4.37679 6.57199L11.6232 6.57199Z"
    />
    <path
      className="arrow-down"
      d="M11.6232 9.42892C12.5713 9.42892 12.9872 10.6252 12.2435 11.2133L8.62027 14.0784C8.25672 14.3659 7.74328 14.3659 7.37973 14.0784L3.75652 11.2133C3.01283 10.6252 3.42868 9.42892 4.37679 9.42892H11.6232Z"
    />
  </svg>
);

const IssueList = ({
  issues,
  projectSlug,
  orderBy,
  onSort,
  issueTypes,
  severities,
  priorities,
  statuses,
}) => {
  const getTypeName = (typeId) => {
    const type = issueTypes.find((t) => t.id === typeId);
    return type ? type.name : '';
  };

  const getTypeColor = (typeId) => {
    const type = issueTypes.find((t) => t.id === typeId);
    return type ? type.color : '#999';
  };

  const getSeverityName = (sevId) => {
    const sev = severities.find((s) => s.id === sevId);
    return sev ? sev.name : '';
  };

  const getSeverityColor = (sevId) => {
    const sev = severities.find((s) => s.id === sevId);
    return sev ? sev.color : '#999';
  };

  const getPriorityName = (priId) => {
    const pri = priorities.find((p) => p.id === priId);
    return pri ? pri.name : '';
  };

  const getPriorityColor = (priId) => {
    const pri = priorities.find((p) => p.id === priId);
    return pri ? pri.color : '#999';
  };

  const getStatusName = (statusId) => {
    const status = statuses.find((s) => s.id === statusId);
    return status ? status.name : '';
  };

  const getStatusColor = (statusId) => {
    const status = statuses.find((s) => s.id === statusId);
    return status ? status.color : '#999';
  };

  const handleSort = (field) => {
    if (onSort) {
      const newOrder =
        orderBy === field ? `-${field}` : orderBy === `-${field}` ? field : field;
      onSort(newOrder);
    }
  };

  const getSortClass = (field) => {
    if (orderBy === field) return 'sort-asc';
    if (orderBy === `-${field}`) return 'sort-desc';
    return '';
  };

  if (!issues || issues.length === 0) {
    return (
      <section className="issues-empty">
        <p className="issues-empty-title">There are no issues yet</p>
        <p className="issues-empty-subtitle">Create a new issue to get started</p>
      </section>
    );
  }

  return (
    <section className="issues-table">
      <div className="issues-row issues-header">
        {SORT_FIELDS.map((field) => (
          <div
            key={field.key}
            className={`${field.className} ${getSortClass(field.key)}`}
            onClick={() => handleSort(field.key)}
          >
            <span>{field.label}</span>
            <SortArrow />
          </div>
        ))}
      </div>

      {issues.map((issue) => (
        <div
          key={issue.id}
          className={`issues-row issues-data-row ${issue.is_blocked ? 'is-blocked' : ''}`}
        >
          <div className="level-field">
            <span
              className="level-badge"
              style={{ backgroundColor: getTypeColor(issue.type) }}
              title={getTypeName(issue.type)}
            >
              {getTypeName(issue.type)}
            </span>
          </div>
          <div className="level-field">
            <span
              className="level-badge"
              style={{ backgroundColor: getSeverityColor(issue.severity) }}
              title={getSeverityName(issue.severity)}
            >
              {getSeverityName(issue.severity)}
            </span>
          </div>
          <div className="level-field">
            <span
              className="level-badge"
              style={{ backgroundColor: getPriorityColor(issue.priority) }}
              title={getPriorityName(issue.priority)}
            >
              {getPriorityName(issue.priority)}
            </span>
          </div>
          <div className="subject-field">
            <Link
              to={`/project/${projectSlug}/issue/${issue.ref}`}
              title={`#${issue.ref} ${issue.subject}`}
            >
              <span className="issue-ref">#{issue.ref}</span>
              <span className="issue-subject">{issue.subject}</span>
            </Link>
          </div>
          <div className="issue-status-field">
            <span
              className="status-badge"
              style={{ color: getStatusColor(issue.status) }}
            >
              {getStatusName(issue.status)}
            </span>
          </div>
          <div className="modified-field">
            {moment(issue.modified_date).format('DD MMM YYYY')}
          </div>
          <div className="assigned-field">
            {issue.assigned_to_extra_info ? (
              <div className="assigned-user" title={issue.assigned_to_extra_info.full_name_display}>
                <img
                  className="avatar"
                  src={issue.assigned_to_extra_info.photo}
                  alt={issue.assigned_to_extra_info.full_name_display}
                />
              </div>
            ) : (
              <span className="unassigned">--</span>
            )}
          </div>
        </div>
      ))}
    </section>
  );
};

export default IssueList;
