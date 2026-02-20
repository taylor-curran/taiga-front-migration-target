const AdminProjectProfile = ({ project }) => {
  if (!project) {
    return <div className="admin-loading">Loading project details...</div>;
  }

  return (
    <div className="admin-project-profile">
      <h2>Project Details</h2>
      <form className="admin-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label htmlFor="project-name">Project Name</label>
          <input
            id="project-name"
            type="text"
            defaultValue={project.name || ''}
            placeholder="Project name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="project-description">Description</label>
          <textarea
            id="project-description"
            defaultValue={project.description || ''}
            placeholder="Project description"
            rows={4}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Creation date</label>
            <p className="form-value">
              {project.created_date
                ? new Date(project.created_date).toLocaleDateString()
                : '-'}
            </p>
          </div>
          <div className="form-group">
            <label>Total fans</label>
            <p className="form-value">{project.total_fans || 0}</p>
          </div>
        </div>
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              defaultChecked={project.is_looking_for_people}
            />
            Looking for people
          </label>
        </div>
        <button type="submit" className="btn-primary" disabled>
          Save (read-only)
        </button>
      </form>
    </div>
  );
};

export default AdminProjectProfile;
