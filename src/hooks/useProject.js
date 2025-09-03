import { useState, useEffect } from 'react';
import { projectService } from '../services/api';

export const useProject = (slug) => {
  const [project, setProject] = useState(null);
  const [stats, setStats] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProject = async () => {
      if (!slug) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const projectResponse = await projectService.getProjectBySlug(slug);
        const projectData = projectResponse.data;
        setProject(projectData);
        
        const promises = [
          projectService.getProjectStats(projectData.id),
          projectService.getProjectTimeline(projectData.id)
        ];
        
        const results = await Promise.allSettled(promises);
        
        if (results[0].status === 'fulfilled') {
          setStats(results[0].value.data);
        }
        
        if (results[1].status === 'fulfilled') {
          setTimeline(results[1].value.data || []);
        }
        
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Project not found');
        } else if (err.response?.status === 403) {
          setError('This project is private');
        } else {
          setError('Failed to load project');
        }
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [slug]);

  return { project, stats, timeline, loading, error };
};
