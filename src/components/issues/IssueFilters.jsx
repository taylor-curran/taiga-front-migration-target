import { useState } from 'react';

const IssueFilters = ({
  filters,
  onFilterChange,
  onSearchChange,
  searchQuery,
  sortBy,
  onSortChange,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount = [
    filters.selectedStatus,
    filters.selectedType,
    filters.selectedPriority,
    filters.selectedSeverity,
  ].filter(Boolean).length;

  return (
    <div className="issue-filters">
      <button
        className="filter-button"
        onClick={() => setShowFilters(!showFilters)}
      >
        ☰ Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
      </button>

      <input
        type="search"
        className="issue-search-input"
        placeholder="subject or reference"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <span className="tags-toggle">tags</span>

      {showFilters && (
        <div className="issue-filter-controls">
          <select
            className="issue-sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="">Sort by...</option>
            <option value="-created_date">Newest first</option>
            <option value="created_date">Oldest first</option>
            <option value="-modified_date">Recently updated</option>
            <option value="severity">Severity</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
            <option value="-total_voters">Most voted</option>
          </select>

          {filters.statuses && filters.statuses.length > 0 && (
            <select
              className="issue-status-filter"
              value={filters.selectedStatus || ''}
              onChange={(e) => onFilterChange('status', e.target.value)}
            >
              <option value="">All statuses</option>
              {filters.statuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name} ({status.count || 0})
                </option>
              ))}
            </select>
          )}

          {filters.types && filters.types.length > 0 && (
            <select
              className="issue-type-filter"
              value={filters.selectedType || ''}
              onChange={(e) => onFilterChange('type', e.target.value)}
            >
              <option value="">All types</option>
              {filters.types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name} ({type.count || 0})
                </option>
              ))}
            </select>
          )}

          {filters.priorities && filters.priorities.length > 0 && (
            <select
              className="issue-priority-filter"
              value={filters.selectedPriority || ''}
              onChange={(e) => onFilterChange('priority', e.target.value)}
            >
              <option value="">All priorities</option>
              {filters.priorities.map((priority) => (
                <option key={priority.id} value={priority.id}>
                  {priority.name} ({priority.count || 0})
                </option>
              ))}
            </select>
          )}

          {filters.severities && filters.severities.length > 0 && (
            <select
              className="issue-severity-filter"
              value={filters.selectedSeverity || ''}
              onChange={(e) => onFilterChange('severity', e.target.value)}
            >
              <option value="">All severities</option>
              {filters.severities.map((severity) => (
                <option key={severity.id} value={severity.id}>
                  {severity.name} ({severity.count || 0})
                </option>
              ))}
            </select>
          )}
        </div>
      )}
    </div>
  );
};

export default IssueFilters;
