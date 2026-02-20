import EpicCard from './EpicCard';

const EpicList = ({ epics, projectSlug, loading }) => {
  if (loading) {
    return <div className="epic-list-loading">Loading epics...</div>;
  }

  if (!epics || epics.length === 0) {
    return (
      <div className="epic-list-empty">
        <h3>No epics found</h3>
        <p>This project has no epics yet.</p>
      </div>
    );
  }

  return (
    <div className="epic-list">
      {epics.map((epic) => (
        <EpicCard
          key={epic.id}
          epic={epic}
          projectSlug={projectSlug}
        />
      ))}
    </div>
  );
};

export default EpicList;
