import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import WikiNavigation from '../components/wiki/WikiNavigation';
import WikiPageViewer from '../components/wiki/WikiPageViewer';
import api from '../services/api';
import '../styles/pages/Wiki.css';

const Wiki = () => {
  const { slug: projectSlug, wikiSlug } = useParams();
  const { isAuthenticated } = useAuth();
  const [wiki, setWiki] = useState(null);
  const [wikiLinks, setWikiLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadWikiData = async () => {
      setLoading(true);
      setError(null);
      try {
        const pageSlug = wikiSlug || 'home';
        const [wikiResponse, linksResponse] = await Promise.all([
          api.get(`/wiki`, {
            params: { project__slug: projectSlug, slug: pageSlug }
          }).catch(() => ({ data: [] })),
          api.get(`/wiki-links`, {
            params: { project__slug: projectSlug }
          }).catch(() => ({ data: [] })),
        ]);

        const wikiPages = wikiResponse.data;
        if (Array.isArray(wikiPages) && wikiPages.length > 0) {
          setWiki(wikiPages[0]);
        } else {
          setWiki(null);
        }
        setWikiLinks(Array.isArray(linksResponse.data) ? linksResponse.data : []);
      } catch (err) {
        console.error('Failed to load wiki data:', err);
        setError('Failed to load wiki page.');
      } finally {
        setLoading(false);
      }
    };

    if (projectSlug) {
      loadWikiData();
    }
  }, [projectSlug, wikiSlug]);

  return (
    <div className="wiki-page">
      <div className="wiki-layout">
        <WikiNavigation
          projectSlug={projectSlug}
          wikiLinks={wikiLinks}
          currentSlug={wikiSlug || 'home'}
        />
        <section className="wiki-main">
          <header className="wiki-header">
            <h1>Wiki</h1>
            {!isAuthenticated && (
              <span className="wiki-readonly-badge">Read-only</span>
            )}
          </header>
          {error ? (
            <div className="wiki-error">
              <p>{error}</p>
            </div>
          ) : (
            <WikiPageViewer wiki={wiki} loading={loading} />
          )}
        </section>
      </div>
    </div>
  );
};

export default Wiki;
