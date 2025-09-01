import { useState, useEffect } from 'react';
import { fetchFeaturedProjects } from '../services/api';
import ProjectCard from './common/ProjectCard';

const FeaturedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProjects = async () => {
      setLoading(true);
      const data = await fetchFeaturedProjects();
      setProjects(data);
      setLoading(false);
    };
    loadFeaturedProjects();
  }, []);

  if (loading) {
    return <div className="loading-container">Loading featured projects...</div>;
  }

  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="featured-projects">
      <h1 className="title">Featured Projects</h1>
      <div className="featured-projects-inner">
        {projects.map((project) => (
          <div key={project.id} className="featured-project">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProjects;
