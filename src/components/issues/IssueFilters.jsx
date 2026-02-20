import { useState, useCallback } from 'react';
import '../../styles/components/IssueFilters.css';

const FilterCategoryPanel = ({ category, activeFilters, onAddFilter, onRemoveFilter }) => {
  const [expanded, setExpanded] = useState(false);
  const activeIds = activeFilters[category.dataType] || [];
  const excludedIds = activeFilters[`exclude_${category.dataType}`] || [];

  const visibleItems = category.hideEmpty
    ? category.content.filter((item) => item.count > 0 || activeIds.includes(String(item.id)))
    : category.content;

  if (!visibleItems || visibleItems.length === 0) return null;

  const displayItems = expanded ? visibleItems : visibleItems.slice(0, 5);
  const hasMore = visibleItems.length > 5;

  const isActive = (itemId) => activeIds.includes(String(itemId));
  const isExcluded = (itemId) => excludedIds.includes(String(itemId));

  const handleClick = (item) => {
    const id = String(item.id);
    if (isActive(id)) {
      onRemoveFilter(category.dataType, id, 'include');
    } else {
      onAddFilter(category.dataType, id, 'include');
    }
  };

  const handleExclude = (e, item) => {
    e.stopPropagation();
    const id = String(item.id);
    if (isExcluded(id)) {
      onRemoveFilter(category.dataType, id, 'exclude');
    } else {
      onAddFilter(category.dataType, id, 'exclude');
    }
  };

  return (
    <div className="filter-category">
      <h4 className="filter-category-title">{category.title}</h4>
      <ul className="filter-category-list">
        {displayItems.map((item) => (
          <li
            key={item.id}
            className={`filter-item ${isActive(item.id) ? 'active' : ''} ${isExcluded(item.id) ? 'excluded' : ''}`}
            onClick={() => handleClick(item)}
          >
            <span className="filter-item-name">
              {item.color && (
                <span
                  className="filter-color-dot"
                  style={{ backgroundColor: item.color }}
                />
              )}
              {item.name}
            </span>
            <span className="filter-item-actions">
              {item.count !== undefined && (
                <span className="filter-item-count">{item.count}</span>
              )}
              <button
                className={`filter-exclude-btn ${isExcluded(item.id) ? 'active' : ''}`}
                onClick={(e) => handleExclude(e, item)}
                title={isExcluded(item.id) ? 'Remove exclusion' : 'Exclude'}
              >
                &times;
              </button>
            </span>
          </li>
        ))}
      </ul>
      {hasMore && (
        <button
          className="filter-show-more"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show less' : `Show all (${visibleItems.length})`}
        </button>
      )}
    </div>
  );
};

const SelectedFilterTag = ({ filter, onRemove }) => (
  <span className={`selected-filter-tag ${filter.mode === 'exclude' ? 'exclude' : ''}`}>
    <span className="selected-filter-type">{filter.dataType}:</span>
    {filter.color && (
      <span
        className="filter-color-dot"
        style={{ backgroundColor: filter.color }}
      />
    )}
    <span className="selected-filter-name">{filter.name}</span>
    {filter.mode === 'exclude' && <span className="selected-filter-mode">(excluded)</span>}
    <button
      className="selected-filter-remove"
      onClick={() => onRemove(filter.dataType, filter.id, filter.mode)}
      title="Remove filter"
    >
      &times;
    </button>
  </span>
);

const IssueFilters = ({
  filterCategories,
  selectedFilters,
  searchQuery,
  orderBy,
  hasActiveFilters,
  filtersLoading,
  onAddFilter,
  onRemoveFilter,
  onSearchChange,
  onOrderChange,
  onClearAll,
}) => {
  const [panelOpen, setPanelOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(searchQuery);
  const [debounceTimer, setDebounceTimer] = useState(null);

  const handleSearchInput = useCallback((e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    const timer = setTimeout(() => {
      onSearchChange(value);
    }, 300);
    setDebounceTimer(timer);
  }, [debounceTimer, onSearchChange]);

  return (
    <div className="issue-filters">
      <div className="issue-filters-bar">
        <div className="issue-filters-search">
          <input
            type="text"
            className="issue-search-input"
            placeholder="Search issues..."
            value={searchValue}
            onChange={handleSearchInput}
          />
        </div>

        <div className="issue-filters-controls">
          <select
            className="issue-order-select"
            value={orderBy}
            onChange={(e) => onOrderChange(e.target.value)}
          >
            <option value="created_date">Newest first</option>
            <option value="-created_date">Oldest first</option>
            <option value="status">Status</option>
            <option value="priority">Priority</option>
            <option value="severity">Severity</option>
            <option value="type">Type</option>
            <option value="assigned_to">Assignee</option>
            <option value="-modified_date">Recently modified</option>
            <option value="-total_voters">Most voted</option>
          </select>

          <button
            className={`issue-filter-toggle-btn ${panelOpen ? 'active' : ''}`}
            onClick={() => setPanelOpen(!panelOpen)}
          >
            Filters
            {selectedFilters.length > 0 && (
              <span className="filter-badge">{selectedFilters.length}</span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              className="issue-filter-clear-btn"
              onClick={onClearAll}
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {selectedFilters.length > 0 && (
        <div className="issue-filters-selected">
          {selectedFilters.map((filter) => (
            <SelectedFilterTag
              key={`${filter.dataType}:${filter.id}:${filter.mode}`}
              filter={filter}
              onRemove={onRemoveFilter}
            />
          ))}
        </div>
      )}

      {panelOpen && (
        <div className="issue-filters-panel">
          {filtersLoading ? (
            <div className="filters-loading">Loading filters...</div>
          ) : filterCategories.length === 0 ? (
            <div className="filters-empty">No filter options available</div>
          ) : (
            <div className="filters-grid">
              {filterCategories.map((category) => (
                <FilterCategoryPanel
                  key={category.dataType}
                  category={category}
                  activeFilters={
                    selectedFilters.reduce((acc, f) => {
                      const key = f.mode === 'exclude' ? `exclude_${f.dataType}` : f.dataType;
                      if (!acc[key]) acc[key] = [];
                      acc[key].push(f.id);
                      return acc;
                    }, {})
                  }
                  onAddFilter={onAddFilter}
                  onRemoveFilter={onRemoveFilter}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IssueFilters;
