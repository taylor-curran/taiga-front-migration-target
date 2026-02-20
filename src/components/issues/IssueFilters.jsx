const IssueFilters = ({
  filtersData,
  activeFilters,
  onFilterChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}) => {
  const handleFilterSelect = (filterType, value) => {
    const current = activeFilters[filterType] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange({ ...activeFilters, [filterType]: updated });
  };

  const isFilterActive = (filterType, value) => {
    return (activeFilters[filterType] || []).includes(value);
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).reduce((count, arr) => count + (arr ? arr.length : 0), 0);
  };

  return (
    <div className="issues-controls">
      <div className="issues-search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search issues..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="issues-filters-bar">
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="">Sort by...</option>
          <option value="-modified_date">Recently modified</option>
          <option value="-created_date">Recently created</option>
          <option value="ref">Reference</option>
          <option value="severity">Severity</option>
          <option value="priority">Priority</option>
          <option value="status">Status</option>
          <option value="type">Type</option>
          <option value="assigned_to">Assignee</option>
        </select>

        {getActiveFilterCount() > 0 && (
          <button
            className="clear-filters-btn"
            onClick={() => onFilterChange({})}
          >
            Clear filters ({getActiveFilterCount()})
          </button>
        )}
      </div>

      {filtersData && (
        <div className="issues-filter-groups">
          {filtersData.types && filtersData.types.length > 0 && (
            <div className="filter-group">
              <span className="filter-group-label">Type:</span>
              <div className="filter-options">
                {filtersData.types.map((type) => (
                  <button
                    key={type.id}
                    className={`filter-option ${isFilterActive('type', type.id) ? 'active' : ''}`}
                    onClick={() => handleFilterSelect('type', type.id)}
                  >
                    {type.name}
                    {type.count !== undefined && (
                      <span className="filter-count">{type.count}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {filtersData.severities && filtersData.severities.length > 0 && (
            <div className="filter-group">
              <span className="filter-group-label">Severity:</span>
              <div className="filter-options">
                {filtersData.severities.map((severity) => (
                  <button
                    key={severity.id}
                    className={`filter-option ${isFilterActive('severity', severity.id) ? 'active' : ''}`}
                    onClick={() => handleFilterSelect('severity', severity.id)}
                  >
                    {severity.name}
                    {severity.count !== undefined && (
                      <span className="filter-count">{severity.count}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {filtersData.priorities && filtersData.priorities.length > 0 && (
            <div className="filter-group">
              <span className="filter-group-label">Priority:</span>
              <div className="filter-options">
                {filtersData.priorities.map((priority) => (
                  <button
                    key={priority.id}
                    className={`filter-option ${isFilterActive('priority', priority.id) ? 'active' : ''}`}
                    onClick={() => handleFilterSelect('priority', priority.id)}
                  >
                    {priority.name}
                    {priority.count !== undefined && (
                      <span className="filter-count">{priority.count}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {filtersData.statuses && filtersData.statuses.length > 0 && (
            <div className="filter-group">
              <span className="filter-group-label">Status:</span>
              <div className="filter-options">
                {filtersData.statuses.map((status) => (
                  <button
                    key={status.id}
                    className={`filter-option ${isFilterActive('status', status.id) ? 'active' : ''}`}
                    onClick={() => handleFilterSelect('status', status.id)}
                    style={{ borderLeft: `3px solid ${status.color || '#999'}` }}
                  >
                    {status.name}
                    {status.count !== undefined && (
                      <span className="filter-count">{status.count}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {filtersData.assigned_to && filtersData.assigned_to.length > 0 && (
            <div className="filter-group">
              <span className="filter-group-label">Assignee:</span>
              <div className="filter-options">
                {filtersData.assigned_to.map((assignee) => (
                  <button
                    key={assignee.id || 'unassigned'}
                    className={`filter-option ${isFilterActive('assigned_to', assignee.id) ? 'active' : ''}`}
                    onClick={() => handleFilterSelect('assigned_to', assignee.id)}
                  >
                    {assignee.full_name || 'Unassigned'}
                    {assignee.count !== undefined && (
                      <span className="filter-count">{assignee.count}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {filtersData.tags && filtersData.tags.length > 0 && (
            <div className="filter-group">
              <span className="filter-group-label">Tags:</span>
              <div className="filter-options">
                {filtersData.tags.map((tag) => (
                  <button
                    key={tag.name}
                    className={`filter-option ${isFilterActive('tags', tag.name) ? 'active' : ''}`}
                    onClick={() => handleFilterSelect('tags', tag.name)}
                    style={{ borderLeft: `3px solid ${tag.color || '#ccc'}` }}
                  >
                    {tag.name}
                    {tag.count !== undefined && (
                      <span className="filter-count">{tag.count}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IssueFilters;
