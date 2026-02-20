import { useState, useCallback, useEffect } from 'react';
import '../../styles/components/IssueFilters.css';

const FilterCategoryPanel = ({ category, selectedFilters, filterMode, onSelectFilter }) => {
  const isFilterSelected = (item) => {
    return !!selectedFilters.find(
      (f) => String(f.id) === String(item.id) && f.dataType === category.dataType
    );
  };

  const visibleItems = (category.content || []).filter((item) => {
    if (isFilterSelected(item)) return false;
    if (category.hideEmpty && item.count === 0) return false;
    return true;
  });

  if (!visibleItems || visibleItems.length === 0) return null;

  return (
    <div className="filter-list">
      {visibleItems.map((item) => (
        <button
          key={item.id}
          className={`single-filter ${category.dataType === 'tags' ? 'single-filter-type-tag' : 'single-filter-type-general'} ${(category.dataType === 'assigned_to' || category.dataType === 'owner') ? 'single-filter-type-user' : ''}`}
          onClick={() => onSelectFilter(category, item, filterMode)}
          style={{
            borderColor: (item.color && category.dataType !== 'tags') ? item.color : 'transparent',
            background: (item.color && category.dataType === 'tags') ? item.color : undefined,
          }}
        >
          <span className="name">{item.name}</span>
          {item.count > 0 && <span className="number">{item.count}</span>}
        </button>
      ))}
    </div>
  );
};

const AppliedFiltersSection = ({ title, filters, onRemoveFilter }) => {
  if (!filters || filters.length === 0) return null;

  return (
    <div className={`filters-${title.toLowerCase()}`}>
      <div className="filters-title">{title}</div>
      <div className="filters-wrapper">
        {filters.map((filter) => (
          <div
            key={`${filter.dataType}:${filter.id}:${filter.mode}`}
            className={`single-applied-filter ${filter.mode}`}
          >
            <span className="name">{filter.name}</span>
            <button
              className="remove-filter"
              onClick={() => onRemoveFilter(filter.dataType, filter.id, filter.mode)}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const IssueFilters = ({
  filterCategories,
  selectedFilters,
  searchQuery,
  hasActiveFilters,
  filtersLoading,
  onAddFilter,
  onRemoveFilter,
  onSearchChange,
  onClearAll,
}) => {
  const [searchValue, setSearchValue] = useState(searchQuery);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [openedCategory, setOpenedCategory] = useState(null);
  const [filterMode, setFilterMode] = useState('include');

  useEffect(() => {
    setSearchValue(searchQuery);
  }, [searchQuery]);

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

  const toggleCategory = (dataType) => {
    setOpenedCategory(openedCategory === dataType ? null : dataType);
  };

  const handleSelectFilter = (category, item, mode) => {
    onAddFilter(category.dataType, item.id, mode);
  };

  const includedFilters = selectedFilters.filter((f) => f.mode === 'include');
  const excludedFilters = selectedFilters.filter((f) => f.mode === 'exclude');

  return (
    <div className="issue-filters-sidebar">
      <div className="issue-filters-search-bar">
        <input
          type="text"
          className="issue-search-input"
          placeholder="Search issues..."
          value={searchValue}
          onChange={handleSearchInput}
        />
      </div>

      {(includedFilters.length > 0 || excludedFilters.length > 0) && (
        <div className="filters-applied">
          <AppliedFiltersSection
            title="Included"
            filters={includedFilters}
            onRemoveFilter={onRemoveFilter}
          />
          <AppliedFiltersSection
            title="Excluded"
            filters={excludedFilters}
            onRemoveFilter={onRemoveFilter}
          />
        </div>
      )}

      {hasActiveFilters && (
        <button className="issue-filter-clear-btn" onClick={onClearAll}>
          Clear all filters
        </button>
      )}

      <div className="filters-advanced">
        <div className="filters-advanced-form">
          <label
            className={`filter-mode-option include ${filterMode === 'include' ? 'active' : ''}`}
            onClick={() => setFilterMode('include')}
          >
            <span className="radio-mark">
              <span className={`radio-mark-inner include ${filterMode === 'include' ? 'checked' : ''}`} />
            </span>
            <span>Include</span>
          </label>
          <label
            className={`filter-mode-option exclude ${filterMode === 'exclude' ? 'active' : ''}`}
            onClick={() => setFilterMode('exclude')}
          >
            <span className="radio-mark">
              <span className={`radio-mark-inner exclude ${filterMode === 'exclude' ? 'checked' : ''}`} />
            </span>
            <span>Exclude</span>
          </label>
        </div>
      </div>

      <div className="filters-cats">
        {filtersLoading ? (
          <div className="filters-loading">Loading filters...</div>
        ) : filterCategories.length === 0 ? (
          <div className="filters-empty">No filter options available</div>
        ) : (
          <ul>
            {filterCategories.map((category) => {
              if (category.hideEmpty && (!category.content || category.content.filter((t) => t.count > 0).length === 0)) {
                return null;
              }
              const isOpen = openedCategory === category.dataType;
              return (
                <li key={category.dataType} className={isOpen ? 'selected' : ''}>
                  <button
                    className={`filters-cat-single ${isOpen ? 'selected' : ''}`}
                    onClick={() => toggleCategory(category.dataType)}
                  >
                    <span className="title">{category.title}</span>
                    <span className={`arrow ${isOpen ? 'arrow-down' : 'arrow-right'}`} />
                  </button>
                  {isOpen && (
                    <FilterCategoryPanel
                      category={category}
                      selectedFilters={selectedFilters}
                      filterMode={filterMode}
                      onSelectFilter={handleSelectFilter}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default IssueFilters;
