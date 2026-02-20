const IssueFilters = ({ filters, onFilterChange, statuses = [], priorities = [], severities = [], types = [] }) => {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="issue-filters">
      <h3 className="filters-title">Filters</h3>

      {types.length > 0 && (
        <div className="filter-group">
          <label className="filter-label">Type</label>
          <select
            className="filter-select"
            value={filters.type || ''}
            onChange={(e) => handleChange('type', e.target.value)}
          >
            <option value="">All types</option>
            {types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {statuses.length > 0 && (
        <div className="filter-group">
          <label className="filter-label">Status</label>
          <select
            className="filter-select"
            value={filters.status || ''}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="">All statuses</option>
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {priorities.length > 0 && (
        <div className="filter-group">
          <label className="filter-label">Priority</label>
          <select
            className="filter-select"
            value={filters.priority || ''}
            onChange={(e) => handleChange('priority', e.target.value)}
          >
            <option value="">All priorities</option>
            {priorities.map((priority) => (
              <option key={priority.id} value={priority.id}>
                {priority.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {severities.length > 0 && (
        <div className="filter-group">
          <label className="filter-label">Severity</label>
          <select
            className="filter-select"
            value={filters.severity || ''}
            onChange={(e) => handleChange('severity', e.target.value)}
          >
            <option value="">All severities</option>
            {severities.map((severity) => (
              <option key={severity.id} value={severity.id}>
                {severity.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default IssueFilters;
