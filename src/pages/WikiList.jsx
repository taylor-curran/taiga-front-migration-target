import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchProjectBySlug, fetchWikiPages, fetchWikiLinks } from '../services/wiki.service';
import WikiNav from '../components/wiki/WikiNav';
import WikiPagesTable from '../components/wiki/WikiPagesTable';
import '../styles/pages/Wiki.css';

const WikiList = () => {
  const { slug: projectSlug } = useParams();
  const { token } = useAuth();
  const [project, setProject] = useState(null);
  const [wikiPages, setWikiPages] = useState([]);
  const [wikiLinks, setWikiLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const projectData = await fetchProjectBySlug(projectSlug);
        setProject(projectData);
      } catch (err) {
        setError('Failed to load project');
        console.error('Failed to load project:', err);
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
        const [pagesData, linksData] = await Promise.all([
          fetchWikiPages(project.id),
          fetchWikiLinks(project.id)
        ]);
        setWikiPages(pagesData);
        setWikiLinks(linksData);
      } catch (err) {
        setError('Failed to load wiki pages');
        console.error('Failed to load wiki data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadWikiData();
  }, [project]);

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
        projectSlug={projectSlug}
      />
      <section className="main wiki-main">
        <header className="wiki-list-header">
          <h1>
            <span>Wiki</span>
            <span className="date">Pages list</span>
          </h1>
        </header>

        {error && (
          <div className="wiki-error">
            <p>{error}</p>
          </div>
        )}

        <WikiPagesTable
          wikiPages={wikiPages}
          projectSlug={projectSlug}
          loading={loading}
        />
      </section>
    </div>
  );
};

export default WikiList;
