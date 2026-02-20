import { useState } from 'react';

const ProjectSettings = ({ project, loading }) => {
  const [activeSection, setActiveSection] = useState('general');

  if (loading) {
    return <div className="project-settings-loading">Loading project settings...</div>;
  }

  if (!project) {
    return <div className="project-settings-empty">Project not found.</div>;
  }

  return (
    <div className="project-settings">
      <h3 className="project-settings-title">Project Settings</h3>

      <div className="project-settings-tabs">
        <button
          className={`settings-tab ${activeSection === 'general' ? 'active' : ''}`}
          onClick={() => setActiveSection('general')}
        >
          General
        </button>
        <button
          className={`settings-tab ${activeSection === 'modules' ? 'active' : ''}`}
          onClick={() => setActiveSection('modules')}
        >
          Modules
        </button>
        <button
          className={`settings-tab ${activeSection === 'export' ? 'active' : ''}`}
          onClick={() => setActiveSection('export')}
        >
          Export
        </button>
      </div>

      {activeSection === 'general' && (
        <div className="settings-section">
          <div className="settings-field">
            <label className="settings-label">Project Name</label>
            <p className="settings-value">{project.name}</p>
          </div>
          <div className="settings-field">
            <label className="settings-label">Description</label>
            <p className="settings-value">{project.description || 'No description'}</p>
          </div>
          <div className="settings-field">
            <label className="settings-label">Visibility</label>
            <p className="settings-value">
              {project.is_private ? 'Private' : 'Public'}
            </p>
          </div>
          <div className="settings-field">
            <label className="settings-label">Looking for people</label>
            <p className="settings-value">
              {project.is_looking_for_people ? 'Yes' : 'No'}
            </p>
          </div>
        </div>
      )}

      {activeSection === 'modules' && (
        <div className="settings-section">
          <div className="module-toggle">
            <span className="module-name">Epics</span>
            <span className={`module-status ${project.is_epics_activated ? 'active' : ''}`}>
              {project.is_epics_activated ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div className="module-toggle">
            <span className="module-name">Backlog</span>
            <span className={`module-status ${project.is_backlog_activated ? 'active' : ''}`}>
              {project.is_backlog_activated ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div className="module-toggle">
            <span className="module-name">Kanban</span>
            <span className={`module-status ${project.is_kanban_activated ? 'active' : ''}`}>
              {project.is_kanban_activated ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div className="module-toggle">
            <span className="module-name">Issues</span>
            <span className={`module-status ${project.is_issues_activated ? 'active' : ''}`}>
              {project.is_issues_activated ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div className="module-toggle">
            <span className="module-name">Wiki</span>
            <span className={`module-status ${project.is_wiki_activated ? 'active' : ''}`}>
              {project.is_wiki_activated ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      )}

      {activeSection === 'export' && (
        <div className="settings-section">
          <p className="settings-info">
            Export project data for backup or migration purposes.
          </p>
          <button className="export-button" disabled>
            Export Project (coming soon)
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectSettings;
