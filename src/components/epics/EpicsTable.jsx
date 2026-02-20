import EpicRow from './EpicRow';

const EpicsTable = ({ epics, loading, onToggleExpand }) => {
  if (loading) {
    return (
      <div className="epics-table-loading">
        Loading epics...
      </div>
    );
  }

  if (!epics || epics.length === 0) {
    return null;
  }

  return (
    <div className="epics-table">
      <div className="epics-table-header">
        <div className="epic-expand-toggle" />
        <div className="epic-color" />
        <div className="epic-ref">Ref</div>
        <div className="epic-subject">Subject</div>
        <div className="epic-progress">Progress</div>
        <div className="epic-status">Status</div>
        <div className="epic-assignee">Assigned to</div>
      </div>
      {epics.map((epic) => (
        <EpicRow
          key={epic.id}
          epic={epic}
          onToggleExpand={onToggleExpand}
        />
      ))}
    </div>
  );
};

export default EpicsTable;
