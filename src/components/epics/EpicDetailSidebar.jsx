import EpicStatusDropdown from './EpicStatusDropdown';

const EpicDetailSidebar = ({ epic, statuses, onStatusChange, onDelete }) => {
  return (
    <aside className="epic-detail-sidebar">
      <section className="ticket-header">
        <span className="ticket-title">
          <span
            className="epic-color-badge"
            style={{ backgroundColor: epic.color || '#999' }}
          />
          #{epic.ref}
        </span>
        <EpicStatusDropdown
          currentStatus={epic.status_extra_info}
          statuses={statuses}
          onStatusChange={onStatusChange}
        />
      </section>

      <section className="ticket-section ticket-assigned-to">
        <h3>Assigned to</h3>
        {epic.assigned_to_extra_info ? (
          <div className="assigned-user">
            <img
              src={epic.assigned_to_extra_info.photo || '/images/unnamed.png'}
              alt={epic.assigned_to_extra_info.full_name_display}
              className="avatar"
            />
            <span>{epic.assigned_to_extra_info.full_name_display}</span>
          </div>
        ) : (
          <span className="unassigned-label">Unassigned</span>
        )}
      </section>

      <section className="ticket-section ticket-watchers">
        <h3>Watchers</h3>
        {epic.watchers && epic.watchers.length > 0 ? (
          <span>{epic.watchers.length} watcher(s)</span>
        ) : (
          <span className="no-watchers">No watchers</span>
        )}
      </section>

      <section className="ticket-section ticket-settings">
        <div className="setting-badges">
          {epic.team_requirement && (
            <span className="badge badge-team">Team requirement</span>
          )}
          {epic.client_requirement && (
            <span className="badge badge-client">Client requirement</span>
          )}
          {epic.is_blocked && (
            <span className="badge badge-blocked">
              Blocked{epic.blocked_note ? `: ${epic.blocked_note}` : ''}
            </span>
          )}
        </div>
        {onDelete && (
          <button className="btn-delete" onClick={onDelete}>
            Delete epic
          </button>
        )}
      </section>
    </aside>
  );
};

export default EpicDetailSidebar;
