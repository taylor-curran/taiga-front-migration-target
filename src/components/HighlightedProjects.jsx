import { Link } from 'react-router-dom';
import ProjectCard from './common/ProjectCard';
import '../styles/components/HighlightedProjects.css';

const HighlightedProjects = ({ 
  title, 
  icon, 
  projects, 
  loading, 
  emptyMessage, 
  orderBy,
  onOrderByChange 
}) => {
  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (projects.length === 0) {
    return (
      <div className="empty-highlighted-project">
        <span className="icon">{icon}</span>
        <span>{emptyMessage}</span>
      </div>
    );
  }

  return (
    <div className="highlighted-section">
      <div className="header">
        <div className="title-wrapper">
          <span className="icon">{icon}</span>
          <h1 className="title">{title}</h1>
        </div>
      </div>
      
      <div className="highlighted-projects-container">
        {projects.map((project) => (
          <div key={project.id} className="highlighted-project">
            <Link to={`/project/${project.slug}`} className="project-logo">
              <img 
                src={project.logo_small_url || '/default-project-logo.png'} 
                alt={project.name}
              />
            </Link>
            <div className="project-data-container">
              <h2 className="project-title">
                <Link to={`/project/${project.slug}`} title={project.name}>
                  {project.name}
                </Link>
              </h2>
              <p className="project-description">
                {project.description || 'No description available'}
              </p>
            </div>
            <div className="project-statistics">
              <span className={`statistic ${project.is_fan ? 'active' : ''}`}>
                ❤️ <span>{project.total_fans || 0}</span>
              </span>
              <span className={`statistic ${project.is_watcher ? 'active' : ''}`}>
                👁️ <span>{project.total_watchers || 0}</span>
              </span>
              <span className={`statistic ${project.i_am_member ? 'active' : ''}`}>
                👥 <span>{project.members?.length || 0}</span>
              </span>
            </div>
          </div>
        ))}
        
        <Link 
          to={`/discover/search?order_by=${orderBy}`}
          className="view-more-projects"
        >
          View more
        </Link>
      </div>
    </div>
  );
};

export default HighlightedProjects;
