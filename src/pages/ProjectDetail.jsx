import { useParams } from 'react-router-dom';
import { useProject } from '../hooks/useProject';
import ProjectHeader from '../components/projects/ProjectHeader/ProjectHeader';
import ProjectStats from '../components/projects/ProjectStats/ProjectStats';
import ProjectTeam from '../components/projects/ProjectTeam/ProjectTeam';
import ProjectTimeline from '../components/projects/ProjectTimeline/ProjectTimeline';
import '../styles/pages/ProjectDetail.css';

const ProjectDetail = () => {
  const { slug } = useParams();
  const { project, stats, timeline, loading, error } = useProject(slug);
  
  if (loading) {
    return (
      <div className="project-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading project...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-detail-page">
        <div className="error-container">
          <h1>Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-detail-page">
        <div className="error-container">
          <h1>Project not found</h1>
          <p>The project you're looking for doesn't exist or is private.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail-page">
      <div className="project-detail-container">
        <div className="main-content">
          <ProjectHeader project={project} />
          <ProjectTimeline timeline={timeline} />
        </div>
        <div className="sidebar-content">
          <ProjectStats project={project} stats={stats} />
          <ProjectTeam project={project} />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
