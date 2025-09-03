import './ProjectStats.css';

const ProjectStats = ({ project, stats }) => {
  if (!project) return null;

  return (
    <section className="project-stats">
      <h2 className="stats-title">Project Statistics</h2>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-icon">❤️</span>
          <div className="stat-content">
            <span className="stat-number">{project.total_fans || 0}</span>
            <span className="stat-label">Fans</span>
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-icon">👁️</span>
          <div className="stat-content">
            <span className="stat-number">{project.total_watchers || 0}</span>
            <span className="stat-label">Watchers</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectStats;
