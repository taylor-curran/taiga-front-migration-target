import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SearchComponent from '../components/Search';
import { fetchProjectBySlug } from '../services/search.service';
import '../styles/pages/Search.css';

const SearchPage = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const loadProject = async () => {
      try {
        const data = await fetchProjectBySlug(slug);
        setProject(data);
      } catch (err) {
        console.error('Failed to load project:', err);
        setError('Failed to load project');
      }
    };

    loadProject();
  }, [slug]);

  if (error) {
    return (
      <div className="search-page">
        <div className="search-error">{error}</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="search-page">
        <div className="search-loading">Loading project...</div>
      </div>
    );
  }

  return (
    <div className="search-page">
      <SearchComponent projectId={project.id} projectSlug={slug} />
    </div>
  );
};

export default SearchPage;
