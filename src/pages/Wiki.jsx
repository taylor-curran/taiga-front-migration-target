import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchProjectBySlug, fetchWikiPageBySlug, fetchWikiLinks } from '../services/wiki.service';
import WikiNav from '../components/wiki/WikiNav';
import WikiContent from '../components/wiki/WikiContent';
import WikiSummary from '../components/wiki/WikiSummary';
import '../styles/pages/Wiki.css';

const Wiki = () => {
  const { slug: projectSlug, wikiSlug = 'home' } = useParams();
  const { token } = useAuth();
  const [project, setProject] = useState(null);
  const [wikiPage, setWikiPage] = useState(null);
  const [wikiLinks, setWikiLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const projectData = await fetchProjectBySlug(projectSlug);
        setProject(projectData);
        return projectData;
      } catch (err) {
        setError('Failed to load project');
        console.error('Failed to load project:', err);
        return null;
      }
    };

    loadProject();
  }, [projectSlug]);

  useEffect(() => {
    if (!project) return;

    const loadWikiData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [pageData, linksData] = await Promise.all([
          fetchWikiPageBySlug(project.id, wikiSlug),
          fetchWikiLinks(project.id)
        ]);
        setWikiPage(pageData);
        setWikiLinks(linksData);
      } catch (err) {
        setError('Failed to load wiki page');
        console.error('Failed to load wiki data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadWikiData();
  }, [project, wikiSlug]);

  if (error && !project) {
    return (
      <div className="wiki-page">
        <div className="wiki-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wiki-page wrapper">
      <WikiNav
        wikiLinks={wikiLinks}
        currentSlug={wikiSlug}
        projectSlug={projectSlug}
      />
      <section className="main wiki wiki-main">
        <header>
          <h1>Wiki</h1>
        </header>

        {error && (
          <div className="wiki-error">
            <p>{error}</p>
          </div>
        )}

        <WikiContent wikiPage={wikiPage} loading={loading} />

        <WikiSummary wikiPage={wikiPage} />
      </section>
    </div>
  );
};

export default Wiki;
