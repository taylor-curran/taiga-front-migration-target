import { useState } from 'react';
import EpicRow from './EpicRow';

const DEFAULT_OPTIONS = {
  name: true,
  assigned: true,
  status: true,
  progress: true,
  closed: false,
  closed_us: false
};

const EpicsTable = ({ epics, projectSlug, statuses, onStatusChange, onLoadMore, hasMore }) => {
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [showOptions, setShowOptions] = useState(false);

  const toggleOption = (key) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const visibleEpics = options.closed
    ? epics
    : epics.filter((e) => !e.is_closed);

  return (
    <div className="epics-table">
      <div className="epics-table-header">
        <div className="header-name">Name</div>
        {options.assigned && <div className="header-assigned">Assigned to</div>}
        {options.status && <div className="header-status">Status</div>}
        {options.progress && <div className="header-progress">Progress</div>}
        <div className="epics-table-options-wrapper">
          <button
            className="epics-table-option-button"
            onClick={() => setShowOptions(!showOptions)}
          >
            View options &#9662;
          </button>
          {showOptions && (
            <div
              className="epics-table-dropdown"
              onMouseLeave={() => setShowOptions(false)}
            >
              {[
                { key: 'assigned', label: 'Assigned to' },
                { key: 'status', label: 'Status' },
                { key: 'progress', label: 'Progress' },
                { key: 'closed', label: 'Closed epics' },
                { key: 'closed_us', label: 'Closed user stories' }
              ].map(({ key, label }) => (
                <div className="fieldset" key={key}>
                  <label htmlFor={`switch-${key}`}>{label}</label>
                  <div className="check">
                    <input
                      id={`switch-${key}`}
                      type="checkbox"
                      checked={options[key]}
                      onChange={() => toggleOption(key)}
                    />
                    <span className="check-label">
                      {options[key] ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="epics-table-body">
        {visibleEpics.map((epic) => (
          <EpicRow
            key={epic.id}
            epic={epic}
            projectSlug={projectSlug}
            statuses={statuses}
            options={options}
            onStatusChange={onStatusChange}
          />
        ))}
        {hasMore && (
          <div className="load-more-container">
            <button className="btn-load-more" onClick={onLoadMore}>
              Load more epics
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EpicsTable;
