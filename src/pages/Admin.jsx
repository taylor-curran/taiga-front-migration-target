import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import AdminMenu from '../components/admin/AdminMenu';
import AdminProjectProfile from '../components/admin/AdminProjectProfile';
import AdminMembers from '../components/admin/AdminMembers';
import api from '../services/api';
import '../styles/pages/Admin.css';

const Admin = () => {
  const { slug: projectSlug } = useParams();
  const [activeSection, setActiveSection] = useState('project');
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProjectData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/projects/by_slug`, {
        params: { slug: projectSlug }
      });
      setProject(response.data);

      if (response.data?.id) {
        const membersRes = await api.get('/memberships', {
          params: { project: response.data.id }
        }).catch(() => ({ data: [] }));
        setMembers(membersRes.data || []);
      }
    } catch (err) {
      console.error('Failed to load project admin data:', err);
    } finally {
      setLoading(false);
    }
  }, [projectSlug]);

  useEffect(() => {
    loadProjectData();
  }, [loadProjectData]);

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1 className="admin-title">
          {project?.name || projectSlug}
          <span className="section-name"> / Admin</span>
        </h1>
      </header>

      <div className="admin-layout">
        <AdminMenu
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          projectSlug={projectSlug}
        />

        <main className="admin-content">
          {loading ? (
            <div className="loading-container">Loading admin panel...</div>
          ) : (
            <>
              {activeSection === 'project' && (
                <AdminProjectProfile project={project} />
              )}

              {activeSection === 'members' && (
                <AdminMembers members={members} />
              )}

              {activeSection === 'attributes' && (
                <section className="admin-section">
                  <h2>Attributes</h2>
                  <div className="admin-attributes">
                    {project?.issue_statuses && (
                      <div className="attribute-group">
                        <h3>Issue Statuses</h3>
                        <ul className="attribute-list">
                          {project.issue_statuses.map((status) => (
                            <li key={status.id}>
                              <span className="status-color" style={{ backgroundColor: status.color }} />
                              {status.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {project?.priorities && (
                      <div className="attribute-group">
                        <h3>Priorities</h3>
                        <ul className="attribute-list">
                          {project.priorities.map((priority) => (
                            <li key={priority.id}>
                              <span className="priority-color" style={{ backgroundColor: priority.color }} />
                              {priority.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {project?.severities && (
                      <div className="attribute-group">
                        <h3>Severities</h3>
                        <ul className="attribute-list">
                          {project.severities.map((severity) => (
                            <li key={severity.id}>
                              <span className="severity-color" style={{ backgroundColor: severity.color }} />
                              {severity.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {activeSection === 'permissions' && (
                <section className="admin-section">
                  <h2>Permissions</h2>
                  <p className="admin-placeholder">
                    Role and permission management for this project.
                  </p>
                  {project?.roles && (
                    <div className="roles-list">
                      {project.roles.map((role) => (
                        <div key={role.id} className="role-item">
                          <h3>{role.name}</h3>
                          <span className="role-members">{role.members_count || 0} members</span>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {activeSection === 'integrations' && (
                <section className="admin-section">
                  <h2>Integrations</h2>
                  <p className="admin-placeholder">
                    Manage webhooks and third-party integrations for this project.
                  </p>
                </section>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;
