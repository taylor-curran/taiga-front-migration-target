import { Link } from 'react-router-dom';
import '../../styles/components/ProjectCard.css';

const ProjectCard = ({ project, showDescription = true, maxDescriptionLength = 100 }) => {
  const truncateDescription = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="project-card">
      <div className="tags-container">
        {project.colorized_tags?.map((tag) => (
          <div
            key={tag.name}
            className="project-tag"
            style={{ background: tag.color }}
            title={tag.name}
          />
        ))}
      </div>
      
      <div className="project-card-inner">
        <div className="project-card-header">
          <Link
            to={`/project/${project.slug}`}
            className="project-card-logo"
            title={project.name}
          >
            <img
              src={project.logo_small_url || '/default-project-logo.png'}
              alt={project.name}
            />
          </Link>
          
          <h2 className="project-card-name">
            <Link to={`/project/${project.slug}`} title={project.name}>
              {project.name}
            </Link>
            {project.is_looking_for_people && (
              <span className="look-for-people" title={project.looking_for_people_note}>
                👥
              </span>
            )}
          </h2>
        </div>
        
        {showDescription && (
          <p className="project-card-description">
            {truncateDescription(project.description, maxDescriptionLength)}
          </p>
        )}
        
        <div className="project-card-statistics">
          <span className={`statistic ${project.is_fan ? 'active' : ''}`} title={`${project.total_fans || 0} fans`}>
            ❤️ <span>{project.total_fans || 0}</span>
          </span>
          <span className={`statistic ${project.is_watcher ? 'active' : ''}`} title={`${project.total_watchers || 0} watchers`}>
            👁️ <span>{project.total_watchers || 0}</span>
          </span>
          <span className={`statistic ${project.i_am_member ? 'active' : ''}`} title={`${project.members?.length || 0} members`}>
            👥 <span>{project.members?.length || 0}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
