import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import EpicsTable from '../components/epics/EpicsTable';
import CreateEpicModal from '../components/epics/CreateEpicModal';
import {
  fetchEpics,
  createEpic,
  updateEpicStatus,
  fetchProjectBySlug
} from '../services/epics.service';
import '../styles/pages/Epics.css';

const Epics = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [epics, setEpics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const loadProject = useCallback(async () => {
    try {
      const data = await fetchProjectBySlug(slug);
      setProject(data);
      return data;
    } catch (err) {
      setError('Failed to load project');
      console.error(err);
      return null;
    }
  }, [slug]);

  const loadEpics = useCallback(async (projectId, pageNum = 1, append = false) => {
    try {
      const result = await fetchEpics(projectId, pageNum);
      if (append) {
        setEpics((prev) => [...prev, ...result.epics]);
      } else {
        setEpics(result.epics);
      }
      setHasMore(result.hasNext);
    } catch (err) {
      if (!append) setError('Failed to load epics');
      console.error(err);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      setLoading(true);
      setError(null);
      const proj = await loadProject();
      if (proj && !cancelled) {
        await loadEpics(proj.id);
      }
      if (!cancelled) setLoading(false);
    };
    init();
    return () => { cancelled = true; };
  }, [loadProject, loadEpics]);

  const handleLoadMore = async () => {
    if (!project) return;
    const nextPage = page + 1;
    setPage(nextPage);
    await loadEpics(project.id, nextPage, true);
  };

  const handleStatusChange = async (epic, statusId) => {
    try {
      const updated = await updateEpicStatus(epic.id, statusId, epic.version);
      setEpics((prev) =>
        prev.map((e) => (e.id === updated.id ? updated : e))
      );
    } catch (err) {
      console.error('Failed to update epic status:', err);
    }
  };

  const handleCreateEpic = async (epicData) => {
    if (!project) return;
    const created = await createEpic({ ...epicData, project: project.id });
    setEpics((prev) => [created, ...prev]);
  };

  if (loading) {
    return (
      <div className="epics-page">
        <div className="loading-container">
          <div className="loading-spinner-lg" />
          <p>Loading epics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="epics-page">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <Link to={`/project/${slug}`} className="btn-back">
            Back to project
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="epics-page">
      <section className="main epics" role="main">
        <header className="header-with-actions">
          <h1 className="section-title">
            <Link to={`/project/${slug}`} className="project-name">
              {project?.name}
            </Link>
            <span className="separator">/</span>
            <span>Epics</span>
          </h1>
          {epics.length > 0 && (
            <div className="action-buttons">
              <button
                className="btn-big"
                onClick={() => setShowCreate(true)}
              >
                Add epic
              </button>
            </div>
          )}
        </header>

        {epics.length > 0 ? (
          <EpicsTable
            epics={epics}
            projectSlug={slug}
            statuses={project?.epic_statuses || []}
            onStatusChange={handleStatusChange}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
          />
        ) : (
          <section className="empty-epics empty-large">
            <h1 className="empty-title">There are no epics</h1>
            <p className="empty-explanation">
              Epics allow you to track large features that span multiple user stories.
            </p>
            <a
              href="https://tree.taiga.io/support/epics/what-is-an-epic/"
              target="_blank"
              rel="noopener noreferrer"
              className="empty-help-link"
            >
              Learn more about epics
            </a>
            <button
              className="btn-big create-epic"
              onClick={() => setShowCreate(true)}
            >
              Add epic
            </button>
          </section>
        )}
      </section>

      {showCreate && project && (
        <CreateEpicModal
          statuses={project.epic_statuses || []}
          onClose={() => setShowCreate(false)}
          onSubmit={handleCreateEpic}
        />
      )}
    </div>
  );
};

export default Epics;
