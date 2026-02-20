import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import WikiPageViewer from '../components/wiki/WikiPageViewer';
import WikiNavigation from '../components/wiki/WikiNavigation';
import '../styles/pages/Wiki.css';

const Wiki = () => {
  const { slug: projectSlug, wikiSlug = 'home' } = useParams();
  const { isAuthenticated } = useAuth();
  const [wiki, setWiki] = useState(null);
  const [wikiLinks, setWikiLinks] = useState([]);
  const [projectId, setProjectId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const response = await api.get(`/projects/by_slug`, {
          params: { slug: projectSlug },
        });
        setProjectId(response.data.id);
        return response.data.id;
      } catch (error) {
        console.error('Failed to load project:', error);
        return null;
      }
    };

    const loadWikiData = async (projId) => {
      if (!projId) return;
      setLoading(true);
      try {
        const [wikiResponse, linksResponse] = await Promise.all([
          api.get('/wiki', {
            params: { project: projId },
          }).catch(() => ({ data: [] })),
          api.get('/wiki-links', {
            params: { project: projId },
          }).catch(() => ({ data: [] })),
        ]);

        const pages = Array.isArray(wikiResponse.data) ? wikiResponse.data : [];
        const currentPage = pages.find((p) => p.slug === wikiSlug) || pages[0] || null;
        setWiki(currentPage);
        setWikiLinks(Array.isArray(linksResponse.data) ? linksResponse.data : []);
      } catch (error) {
        console.error('Failed to load wiki data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProject().then((projId) => {
      if (projId) {
        loadWikiData(projId);
      } else {
        setLoading(false);
      }
    });
  }, [projectSlug, wikiSlug]);

  return (
    <div className="wiki-page">
      <header className="wiki-header">
        <h1 className="wiki-title">Wiki</h1>
        {isAuthenticated && (
          <span className="wiki-auth-indicator">Authenticated</span>
        )}
      </header>

      <div className="wiki-layout">
        <WikiNavigation
          links={wikiLinks}
          projectSlug={projectSlug}
          currentSlug={wikiSlug}
        />
        <div className="wiki-main">
          <WikiPageViewer wiki={wiki} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Wiki;
