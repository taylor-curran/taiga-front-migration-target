import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import AdminNav from '../components/admin/AdminNav';
import MembersList from '../components/admin/MembersList';
import ProjectSettings from '../components/admin/ProjectSettings';
import '../styles/pages/Admin.css';

const Admin = () => {
  const { slug: projectSlug } = useParams();
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('settings');

  useEffect(() => {
    const loadProjectData = async () => {
      setLoading(true);
      try {
        const projectResponse = await api.get('/projects/by_slug', {
          params: { slug: projectSlug },
        });
        const projectData = projectResponse.data;
        setProject(projectData);

        try {
          const membersResponse = await api.get('/memberships', {
            params: { project: projectData.id },
          });
          setMembers(Array.isArray(membersResponse.data) ? membersResponse.data : []);
        } catch (error) {
          console.error('Failed to load members:', error);
          if (projectData.members) {
            setMembers(projectData.members);
          }
        }
      } catch (error) {
        console.error('Failed to load project:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProjectData();
  }, [projectSlug]);

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">Loading admin panel...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="admin-page">
        <div className="empty-state">
          <h2>Project not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1 className="admin-title">Administration: {project.name}</h1>
      </header>

      <div className="admin-layout">
        <AdminNav projectSlug={projectSlug} />

        <div className="admin-content">
          <div className="admin-section-tabs">
            <button
              className={`admin-tab ${activeSection === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveSection('settings')}
            >
              Project Settings
            </button>
            <button
              className={`admin-tab ${activeSection === 'members' ? 'active' : ''}`}
              onClick={() => setActiveSection('members')}
            >
              Members ({members.length})
            </button>
          </div>

          {activeSection === 'settings' && (
            <ProjectSettings project={project} loading={false} />
          )}

          {activeSection === 'members' && (
            <MembersList members={members} loading={false} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
