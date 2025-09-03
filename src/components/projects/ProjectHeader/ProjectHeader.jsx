import './ProjectHeader.css';

const ProjectHeader = ({ project }) => {
  if (!project) return null;

  return (
    <section className="project-header">
      <div className="project-logo">
        <img
          src={project.logo_big_url || project.logo_small_url || '/default-project-logo.png'}
          alt={project.name}
        />
      </div>
      <div className="project-title-wrapper">
        <div className="project-options">
          <div className="project-title">
            <h1 className="project-name">{project.name}</h1>
            {project.is_private && (
              <span className="private-indicator" title="Private Project">
                🔒
              </span>
            )}
          </div>
          <div className="project-stats-inline">
            <span className="stat" title={`${project.total_fans || 0} fans`}>
              ❤️ <span>{project.total_fans || 0}</span>
            </span>
            <span className="stat" title={`${project.total_watchers || 0} watchers`}>
              👁️ <span>{project.total_watchers || 0}</span>
            </span>
          </div>
        </div>
        <p className="project-description">{project.description}</p>
      </div>
    </section>
  );
};

export default ProjectHeader;
