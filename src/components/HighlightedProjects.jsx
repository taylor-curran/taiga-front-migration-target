import { Link } from 'react-router-dom';
import ProjectCard from './common/ProjectCard';

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
            <ProjectCard 
              project={project} 
              showDescription={true}
              maxDescriptionLength={150}
            />
          </div>
        ))}
        
        <Link 
          to={`/discover/search?order_by=${orderBy}`}
          className="view-more-projects btn-small"
        >
          View more
        </Link>
      </div>
    </div>
  );
};

export default HighlightedProjects;
