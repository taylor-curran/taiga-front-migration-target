import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchProjectBySlug, fetchProjectStats } from '../services/api';
import '../styles/pages/ProjectDetail.css';

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProjectData = async () => {
      setLoading(true);
      setError(null);
      try {
        const projectData = await fetchProjectBySlug(slug);
        setProject(projectData);
        
        const statsData = await fetchProjectStats(projectData.id);
        setStats(statsData);
      } catch (err) {
        console.error('Failed to load project:', err);
        setError('Failed to load project details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadProjectData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="project-detail-page">
        <div className="loading-container">Loading project details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-detail-page">
        <div className="error-container">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-detail-page">
        <div className="error-container">
          <h3>Project not found</h3>
          <p>The project you're looking for doesn't exist or is not public.</p>
        </div>
      </div>
    );
  }

  const activeMembers = project.members?.filter(member => member.is_active) || [];

  return (
    <div className="project-detail-page">
      <div className="project-detail-container">
        <section className="project-intro">
          <div className="project-header">
            <div className="project-logo">
              <img
                src={project.logo_small_url || '/default-project-logo.png'}
                alt={project.name}
              />
            </div>
            <div className="project-title-section">
              <h1 className="project-name">
                {project.name}
                {project.is_private && (
                  <span className="private-badge" title="Private Project">🔒</span>
                )}
              </h1>
              <div className="project-stats">
                <span className="stat" title={`${project.total_fans || 0} fans`}>
                  ❤️ <span>{project.total_fans || 0}</span>
                </span>
                <span className="stat" title={`${project.total_watchers || 0} watchers`}>
                  👁️ <span>{project.total_watchers || 0}</span>
                </span>
                <span className="stat" title={`${activeMembers.length} members`}>
                  👥 <span>{activeMembers.length}</span>
                </span>
              </div>
            </div>
          </div>
          
          {project.description && (
            <p className="project-description">{project.description}</p>
          )}
        </section>

        {project.tags && project.tags.length > 0 && (
          <div className="project-tags">
            {project.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        )}

        {project.is_looking_for_people && (
          <div className="looking-for-people">
            <div className="looking-for-people-icon">👥</div>
            <div className="looking-for-people-content">
              <h3>Looking for People</h3>
              {project.looking_for_people_note && (
                <p>{project.looking_for_people_note}</p>
              )}
            </div>
          </div>
        )}

        <section className="team-section">
          <h2>Team</h2>
          <div className="team-members">
            {activeMembers.map((member) => (
              <div key={member.id} className="team-member">
                <img
                  src={member.photo || '/default-avatar.png'}
                  alt={member.full_name}
                  className="member-avatar"
                />
                <span className="member-name">{member.full_name}</span>
                {member.id === project.owner?.id && (
                  <span className="owner-badge" title="Owner">⭐</span>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProjectDetail;
