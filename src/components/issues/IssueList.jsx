import IssueCard from './IssueCard';

const IssueList = ({ issues, projectSlug, loading }) => {
  if (loading) {
    return <div className="issue-list-loading">Loading issues...</div>;
  }

  if (!issues || issues.length === 0) {
    return (
      <div className="issue-list-empty">
        <h3>No issues found</h3>
        <p>Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="issue-list">
      <div className="issue-list-header">
        <span className="issue-col-ref">ID</span>
        <span className="issue-col-subject">Subject</span>
        <span className="issue-col-status">Status</span>
        <span className="issue-col-assignee">Assigned to</span>
      </div>
      {issues.map((issue) => (
        <IssueCard
          key={issue.id}
          issue={issue}
          projectSlug={projectSlug}
        />
      ))}
    </div>
  );
};

export default IssueList;
