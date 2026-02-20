import '../../styles/components/IssueDetailSidebar.css';

const AttributeDisplay = ({ label, value, color }) => (
  <div className="attribute-row">
    <span className="attribute-label">{label}</span>
    <span className="attribute-value" style={color ? { color } : {}}>
      {value || '--'}
    </span>
  </div>
);

const IssueDetailSidebar = ({
  issue,
  issueTypes,
  severities,
  priorities,
  statuses,
}) => {
  if (!issue) return null;

  const getAttr = (list, id) => {
    const item = (list || []).find((i) => i.id === id);
    return item ? { name: item.name, color: item.color } : { name: '--', color: null };
  };

  const status = getAttr(statuses, issue.status);
  const type = getAttr(issueTypes, issue.type);
  const severity = getAttr(severities, issue.severity);
  const priority = getAttr(priorities, issue.priority);

  return (
    <aside className="issue-detail-sidebar">
      <section className="sidebar-section sidebar-status">
        <div className="status-display" style={{ borderColor: status.color }}>
          <span className="status-label">Status</span>
          <span className="status-value" style={{ color: status.color }}>
            {status.name}
          </span>
        </div>
      </section>

      <section className="sidebar-section sidebar-attributes">
        <AttributeDisplay label="Type" value={type.name} color={type.color} />
        <AttributeDisplay label="Severity" value={severity.name} color={severity.color} />
        <AttributeDisplay label="Priority" value={priority.name} color={priority.color} />
      </section>

      <section className="sidebar-section sidebar-assigned">
        <span className="attribute-label">Assigned to</span>
        {issue.assigned_to_extra_info ? (
          <div className="assigned-info">
            <img
              className="assigned-avatar"
              src={issue.assigned_to_extra_info.photo}
              alt={issue.assigned_to_extra_info.full_name_display}
            />
            <span className="assigned-name">
              {issue.assigned_to_extra_info.full_name_display}
            </span>
          </div>
        ) : (
          <span className="attribute-value">Unassigned</span>
        )}
      </section>

      {issue.watchers && issue.watchers.length > 0 && (
        <section className="sidebar-section sidebar-watchers">
          <span className="attribute-label">Watchers</span>
          <span className="attribute-value">{issue.watchers.length}</span>
        </section>
      )}

      {issue.due_date && (
        <section className="sidebar-section sidebar-due-date">
          <span className="attribute-label">Due date</span>
          <span className={`attribute-value ${issue.is_closed ? 'closed' : ''}`}>
            {issue.due_date}
          </span>
        </section>
      )}
    </aside>
  );
};

export default IssueDetailSidebar;
