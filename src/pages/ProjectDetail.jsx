import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProjectBySlug, fetchProjectStats } from '../services/api';
import '../styles/pages/ProjectDetail.css';

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const projectData = await fetchProjectBySlug(slug);
        setProject(projectData);

        try {
          const statsData = await fetchProjectStats(projectData.id);
          setStats(statsData);
        } catch (statsError) {
          console.error('Failed to load project stats:', statsError);
        }
      } catch (err) {
        console.error('Failed to load project:', err);
        setError('Failed to load project. It may not exist or is not accessible.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadProject();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="project-detail-page">
        <div className="project-detail__loading">Loading project...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-detail-page">
        <div className="project-detail__error">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="project-detail-page">
      {/* Project Header */}
      <div className="project-detail__header">
        <img
          className="project-detail__logo"
          src={project.logo_big_url || '/default-project-logo.png'}
          alt={project.name}
        />
        <div className="project-detail__info">
          <h1 className="project-detail__name">{project.name}</h1>
          {project.description && (
            <p className="project-detail__description">{project.description}</p>
          )}
          <span className="project-detail__created">
            Created {formatDate(project.created_date)}
          </span>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="project-detail__stats">
        <div className="project-detail__stat-item">
          <span className="project-detail__stat-value">{project.total_fans || 0}</span>
          <span className="project-detail__stat-label">Fans</span>
        </div>
        <div className="project-detail__stat-item">
          <span className="project-detail__stat-value">{project.total_watchers || 0}</span>
          <span className="project-detail__stat-label">Watchers</span>
        </div>
        <div className="project-detail__stat-item">
          <span className="project-detail__stat-value">{project.total_activity_last_year || 0}</span>
          <span className="project-detail__stat-label">Activity</span>
        </div>
        {stats && (
          <>
            <div className="project-detail__stat-item">
              <span className="project-detail__stat-value">{stats.total_milestones || 0}</span>
              <span className="project-detail__stat-label">Milestones</span>
            </div>
            <div className="project-detail__stat-item">
              <span className="project-detail__stat-value">{stats.total_points || 0}</span>
              <span className="project-detail__stat-label">Points</span>
            </div>
          </>
        )}
      </div>

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="project-detail__tags">
          {project.tags.map((tag) => {
            const tagName = Array.isArray(tag) ? tag[0] : tag;
            const tagColor = Array.isArray(tag) ? tag[1] : null;
            return (
              <span
                key={tagName}
                className="project-detail__tag"
                style={tagColor ? { backgroundColor: tagColor } : undefined}
              >
                {tagName}
              </span>
            );
          })}
        </div>
      )}

      {/* Navigation Links */}
      <nav className="project-detail__nav">
        <Link to={`/project/${slug}/backlog`} className="project-detail__nav-link">
          Backlog
        </Link>
        <Link to={`/project/${slug}/kanban`} className="project-detail__nav-link">
          Kanban
        </Link>
        <Link to={`/project/${slug}/wiki`} className="project-detail__nav-link">
          Wiki
        </Link>
        <Link to={`/project/${slug}/issues`} className="project-detail__nav-link">
          Issues
        </Link>
      </nav>

      {/* Team Members */}
      {project.members && project.members.length > 0 && (
        <div className="project-detail__members">
          <h2 className="project-detail__section-title">
            Team Members ({project.members.length})
          </h2>
          <div className="project-detail__members-grid">
            {project.members.map((member) => (
              <div key={member.id || member.username} className="project-detail__member-card">
                <img
                  className="project-detail__member-photo"
                  src={member.photo || '/default-avatar.png'}
                  alt={member.full_name}
                />
                <div className="project-detail__member-info">
                  <p className="project-detail__member-name">{member.full_name}</p>
                  <p className="project-detail__member-role">{member.role_name}</p>
                  <p className="project-detail__member-username">@{member.username}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Project Metadata */}
      <div className="project-detail__metadata">
        <h2 className="project-detail__section-title">Project Info</h2>
        <div className="project-detail__metadata-item">
          <span className="project-detail__metadata-label">Visibility</span>
          <span className="project-detail__metadata-value">
            <span className={`project-detail__badge ${project.is_private ? 'project-detail__badge--private' : 'project-detail__badge--public'}`}>
              {project.is_private ? 'Private' : 'Public'}
            </span>
          </span>
        </div>
        <div className="project-detail__metadata-item">
          <span className="project-detail__metadata-label">Looking for people</span>
          <span className="project-detail__metadata-value">
            <span className={`project-detail__badge ${project.is_looking_for_people ? 'project-detail__badge--yes' : 'project-detail__badge--no'}`}>
              {project.is_looking_for_people ? 'Yes' : 'No'}
            </span>
          </span>
        </div>
        <div className="project-detail__metadata-item">
          <span className="project-detail__metadata-label">Created</span>
          <span className="project-detail__metadata-value">{formatDate(project.created_date)}</span>
        </div>
        <div className="project-detail__metadata-item">
          <span className="project-detail__metadata-label">Last modified</span>
          <span className="project-detail__metadata-value">{formatDate(project.modified_date)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
