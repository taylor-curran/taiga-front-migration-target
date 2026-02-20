import IssueRow from './IssueRow';

const IssueList = ({ issues, projectSlug, loading, showTags = false }) => {
  if (loading) {
    return (
      <div className="issue-list-loading">
        Loading issues...
      </div>
    );
  }

  if (!issues || issues.length === 0) {
    return (
      <div className="issue-list-empty">
        <div className="empty-large">
          <h2>There are no issues</h2>
          <p>Issues track bugs, questions, and enhancements for this project.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="issue-list">
      <div className="issue-table">
        <div className="issue-row issue-header-row">
          <div className="issue-ref">Ref</div>
          <div className="issue-subject">Subject</div>
          <div className="issue-priority">Priority</div>
          <div className="issue-severity">Severity</div>
          <div className="issue-status">Status</div>
          <div className="issue-assignee">Assigned to</div>
        </div>
        {issues.map((issue) => (
          <IssueRow
            key={issue.id}
            issue={issue}
            projectSlug={projectSlug}
            showTags={showTags}
          />
        ))}
      </div>
    </div>
  );
};

export default IssueList;
