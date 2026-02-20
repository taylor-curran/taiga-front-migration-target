import '../../styles/components/IssueAssignee.css';

const IssueAssignee = ({ issue }) => {
  const assignee = issue?.assigned_to_extra_info;

  if (!assignee) {
    return (
      <span className="issue-assignee issue-assignee--unassigned">
        <span className="issue-assignee__avatar-placeholder">--</span>
        <span className="issue-assignee__name">Unassigned</span>
      </span>
    );
  }

  return (
    <span className="issue-assignee">
      <img
        className="issue-assignee__avatar"
        src={assignee.photo || '/default-avatar.png'}
        alt={assignee.full_name_display}
      />
      <span className="issue-assignee__name">
        {assignee.full_name_display}
      </span>
    </span>
  );
};

export default IssueAssignee;
