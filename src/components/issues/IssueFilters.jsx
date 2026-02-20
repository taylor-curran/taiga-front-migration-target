import { useState } from 'react';
import '../../styles/components/IssueFilters.css';

const FilterSection = ({ title, items, selectedIds, onToggle, colorField }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="filter-section">
      <button
        className={`filter-section-header ${expanded ? 'expanded' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        <span>{title}</span>
        <span className="filter-toggle">{expanded ? '-' : '+'}</span>
      </button>
      {expanded && (
        <ul className="filter-options">
          {items.map((item) => (
            <li key={item.id} className="filter-option">
              <label className="filter-label">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => onToggle(item.id)}
                />
                {colorField && item[colorField] && (
                  <span
                    className="filter-color"
                    style={{ backgroundColor: item[colorField] }}
                  />
                )}
                <span className="filter-name">{item.name}</span>
                {item.count !== undefined && (
                  <span className="filter-count">{item.count}</span>
                )}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const IssueFilters = ({
  filtersData,
  selectedFilters,
  onFilterChange,
}) => {
  const handleToggle = (filterType, id) => {
    const current = selectedFilters[filterType] || [];
    const updated = current.includes(id)
      ? current.filter((v) => v !== id)
      : [...current, id];
    onFilterChange(filterType, updated);
  };

  if (!filtersData) return null;

  return (
    <aside className="issues-filters">
      <div className="filters-header">
        <h3>Filters</h3>
      </div>

      {filtersData.types && filtersData.types.length > 0 && (
        <FilterSection
          title="Type"
          items={filtersData.types}
          selectedIds={selectedFilters.type || []}
          onToggle={(id) => handleToggle('type', id)}
          colorField="color"
        />
      )}

      {filtersData.severities && filtersData.severities.length > 0 && (
        <FilterSection
          title="Severity"
          items={filtersData.severities}
          selectedIds={selectedFilters.severity || []}
          onToggle={(id) => handleToggle('severity', id)}
          colorField="color"
        />
      )}

      {filtersData.priorities && filtersData.priorities.length > 0 && (
        <FilterSection
          title="Priority"
          items={filtersData.priorities}
          selectedIds={selectedFilters.priority || []}
          onToggle={(id) => handleToggle('priority', id)}
          colorField="color"
        />
      )}

      {filtersData.statuses && filtersData.statuses.length > 0 && (
        <FilterSection
          title="Status"
          items={filtersData.statuses}
          selectedIds={selectedFilters.status || []}
          onToggle={(id) => handleToggle('status', id)}
          colorField="color"
        />
      )}

      {filtersData.assigned_to && filtersData.assigned_to.length > 0 && (
        <FilterSection
          title="Assigned to"
          items={filtersData.assigned_to.map((m) => ({
            id: m.id,
            name: m.full_name || 'Unassigned',
            count: m.count,
          }))}
          selectedIds={selectedFilters.assigned_to || []}
          onToggle={(id) => handleToggle('assigned_to', id)}
        />
      )}
    </aside>
  );
};

export default IssueFilters;
