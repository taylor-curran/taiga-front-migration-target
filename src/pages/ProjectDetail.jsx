import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
        console.error('Error loading project:', err);
        setError('Failed to load project. Please try again later.');
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
        <div className="loading-container">Loading project...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="project-detail-page">
        <div className="error-container">
          <h2>Project Not Found</h2>
          <p>{error || 'The project you are looking for does not exist or is not public.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail-page">
      <div className="wrapper">
        <div className="single-project centered">
          <section className="single-project-intro">
            <div className="project-logo">
              <img
                src={project.logo_big_url || project.logo_small_url || '/default-project-logo.png'}
                alt={project.name}
              />
            </div>
            
            <div className="single-project-title-wrapper">
              <div className="intro-options">
                <div className="intro-title">
                  <h1 className="project-name">{project.name}</h1>
                  {project.is_private && (
                    <span className="private-icon" title="Private Project">🔒</span>
                  )}
                </div>

                <div className="track-container">
                  <div className="list-itemtype-track">
                    <span className="list-itemtype-track-likers" title={`${project.total_fans || 0} fans`}>
                      ❤️ <span>{project.total_fans || 0}</span>
                    </span>
                    <span className="list-itemtype-track-watchers" title={`${project.total_watchers || 0} watchers`}>
                      👁️ <span>{project.total_watchers || 0}</span>
                    </span>
                  </div>
                </div>
              </div>

              <p className="description">{project.description}</p>
            </div>
          </section>

          {project.colorized_tags && project.colorized_tags.length > 0 && (
            <div className="single-project-tags tags-container">
              {project.colorized_tags.map((tag, index) => (
                <span key={index} className="tag">
                  <span className="tag-name">{tag.name}</span>
                </span>
              ))}
            </div>
          )}

          <div className="project-data">
            {stats && (
              <section className="project-stats">
                <h2 className="title">Statistics</h2>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Total Points</span>
                    <span className="stat-value">{stats.total_points || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Closed Points</span>
                    <span className="stat-value">{stats.closed_points || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Defined Points</span>
                    <span className="stat-value">{stats.defined_points || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Assigned Points</span>
                    <span className="stat-value">{stats.assigned_points || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Speed</span>
                    <span className="stat-value">{stats.speed || 0}</span>
                  </div>
                </div>
              </section>
            )}

            <section className="involved-data">
              {project.is_looking_for_people && (
                <div className="looking-for-people">
                  <img
                    src="/images/looking-for-people.png"
                    alt="Looking for people"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="looking-for-people-content">
                    <h3>Looking for People</h3>
                    {project.looking_for_people_note && (
                      <p>{project.looking_for_people_note}</p>
                    )}
                  </div>
                </div>
              )}

              <h2 className="title">Team</h2>
              <ul className="involved-team">
                {project.members && project.members.map((member) => (
                  <li key={member.id}>
                    <div className="member-avatar" title={member.full_name_display}>
                      <img
                        src={member.photo || `https://www.gravatar.com/avatar/${member.gravatar_id}?s=80&d=identicon`}
                        alt={member.full_name_display}
                      />
                      {member.id === project.owner.id && (
                        <span className="owner-badge" title="Owner">👑</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              
              {project.members && project.members.length === 0 && (
                <p className="empty-team">No team members yet.</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
