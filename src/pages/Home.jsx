import { useEffect, useState } from 'react';
import { healthCheck, fetchMostLikedProjects, fetchMostActiveProjects, fetchDiscoverStats } from '../services/api';
import FeaturedProjects from '../components/FeaturedProjects';
import HighlightedProjects from '../components/HighlightedProjects';

const Home = () => {
  const [apiStatus, setApiStatus] = useState('checking');
  const [mostLiked, setMostLiked] = useState([]);
  const [mostActive, setMostActive] = useState([]);
  const [stats, setStats] = useState({ projects: { total: 0 } });
  const [loading, setLoading] = useState({
    mostLiked: true,
    mostActive: true
  });

  useEffect(() => {
    const checkAPI = async () => {
      const result = await healthCheck();
      setApiStatus(result.status);
    };
    
    const loadMostLiked = async () => {
      setLoading(prev => ({ ...prev, mostLiked: true }));
      const data = await fetchMostLikedProjects();
      setMostLiked(data);
      setLoading(prev => ({ ...prev, mostLiked: false }));
    };
    
    const loadMostActive = async () => {
      setLoading(prev => ({ ...prev, mostActive: true }));
      const data = await fetchMostActiveProjects();
      setMostActive(data);
      setLoading(prev => ({ ...prev, mostActive: false }));
    };
    
    const loadStats = async () => {
      const data = await fetchDiscoverStats();
      setStats(data);
    };

    checkAPI();
    loadMostLiked();
    loadMostActive();
    loadStats();
  }, []);

  return (
    <div className="home-page">
      <section className="discover">
        <header>
          <div className="discover-header">
            <h1 className="discover-title">Discover projects</h1>
            <p className="discover-subtitle">
              {stats.projects.total === 1 
                ? "One public project to discover" 
                : `${stats.projects.total} public projects to discover`}
            </p>
          </div>
        </header>

        <FeaturedProjects />

        <section className="highlighted">
          <HighlightedProjects
            title="Most liked"
            icon="❤️"
            projects={mostLiked}
            loading={loading.mostLiked}
            emptyMessage="There are no LIKED projects yet"
            orderBy="total_fans"
          />
          
          <HighlightedProjects
            title="Most active"
            icon="⚡"
            projects={mostActive}
            loading={loading.mostActive}
            emptyMessage="There are no ACTIVE projects yet"
            orderBy="total_activity"
          />
        </section>

        <div className="api-status">
          <h3>API Health Check:</h3>
          <p>Status: <span className={`status-${apiStatus}`}>{apiStatus}</span></p>
        </div>
      </section>
    </div>
  );
};

export default Home;
