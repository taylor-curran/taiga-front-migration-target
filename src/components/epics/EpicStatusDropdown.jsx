import { useState, useRef, useEffect } from 'react';

const EpicStatusDropdown = ({ currentStatus, statuses, onStatusChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (statusId) => {
    setOpen(false);
    onStatusChange(statusId);
  };

  const sortedStatuses = statuses
    ? [...statuses].sort((a, b) => a.order - b.order)
    : [];

  return (
    <div className="status-holder" ref={ref}>
      <button
        className="status-button"
        style={{ color: currentStatus?.color || '#999' }}
        onClick={() => setOpen(!open)}
      >
        <span>{currentStatus?.name || 'Unknown'}</span>
        <span className="arrow-down">&#9662;</span>
      </button>
      {open && (
        <ul className="epic-statuses">
          {sortedStatuses.map((status) => (
            <li
              key={status.id}
              className="status-item"
              onClick={() => handleSelect(status.id)}
            >
              {status.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EpicStatusDropdown;
