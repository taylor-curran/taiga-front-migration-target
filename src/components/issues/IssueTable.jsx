import IssueCard from './IssueCard';

const IssueTable = ({ issues, projectSlug, sortBy, onSortChange }) => {
  const handleSort = (field) => {
    if (sortBy === field) {
      onSortChange(`-${field}`);
    } else if (sortBy === `-${field}`) {
      onSortChange('');
    } else {
      onSortChange(field);
    }
  };

  const getSortIndicator = (field) => {
    if (sortBy === field) return ' \u25B2';
    if (sortBy === `-${field}`) return ' \u25BC';
    return '';
  };

  if (!issues || issues.length === 0) {
    return (
      <div className="issues-empty-state">
        <h3>No issues found</h3>
        <p>Try adjusting your search criteria or filters.</p>
      </div>
    );
  }

  return (
    <div className="issues-table-wrapper">
      <table className="issues-table">
        <thead>
          <tr>
            <th className="sortable" onClick={() => handleSort('type')}>
              Type{getSortIndicator('type')}
            </th>
            <th className="sortable" onClick={() => handleSort('severity')}>
              Severity{getSortIndicator('severity')}
            </th>
            <th className="sortable" onClick={() => handleSort('priority')}>
              Priority{getSortIndicator('priority')}
            </th>
            <th className="sortable" onClick={() => handleSort('ref')}>
              Issue{getSortIndicator('ref')}
            </th>
            <th className="sortable" onClick={() => handleSort('status')}>
              Status{getSortIndicator('status')}
            </th>
            <th className="sortable" onClick={() => handleSort('modified_date')}>
              Modified{getSortIndicator('modified_date')}
            </th>
            <th className="sortable" onClick={() => handleSort('assigned_to')}>
              Assigned to{getSortIndicator('assigned_to')}
            </th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              projectSlug={projectSlug}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IssueTable;
