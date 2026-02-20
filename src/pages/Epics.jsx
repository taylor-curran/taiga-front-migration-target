import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import EpicsTable from '../components/epics/EpicsTable';
import api from '../services/api';
import '../styles/pages/Epics.css';

const Epics = () => {
  const { slug: projectSlug } = useParams();
  const [epics, setEpics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState(null);

  const loadProjectData = useCallback(async () => {
    try {
      const response = await api.get(`/projects/by_slug`, {
        params: { slug: projectSlug }
      });
      setProjectData(response.data);
      return response.data;
    } catch (err) {
      console.error('Failed to load project data:', err);
      return null;
    }
  }, [projectSlug]);

  const loadEpics = useCallback(async (projectId) => {
    if (!projectId) return;
    setLoading(true);
    try {
      const response = await api.get('/epics', {
        params: { project: projectId }
      });
      setEpics(response.data || []);
    } catch (error) {
      console.error('Failed to load epics:', error);
      setEpics([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const project = await loadProjectData();
      if (project) {
        await loadEpics(project.id);
      } else {
        setLoading(false);
      }
    };
    init();
  }, [loadProjectData, loadEpics]);

  const handleToggleExpand = async (epic, isExpanding) => {
    if (isExpanding && !epic.relatedUserStories) {
      try {
        const response = await api.get(`/userstories`, {
          params: { epic: epic.id }
        });
        setEpics((prev) =>
          prev.map((e) =>
            e.id === epic.id
              ? { ...e, relatedUserStories: response.data || [] }
              : e
          )
        );
      } catch (err) {
        console.error('Failed to load related user stories:', err);
      }
    }
  };

  return (
    <div className="epics-page">
      <header className="epics-header">
        <h1 className="epics-title">
          {projectData?.name || projectSlug}
          <span className="section-name"> / Epics</span>
        </h1>
      </header>

      {!loading && epics.length > 0 && (
        <EpicsTable
          epics={epics}
          loading={loading}
          onToggleExpand={handleToggleExpand}
        />
      )}

      {!loading && epics.length === 0 && (
        <section className="empty-epics empty-large">
          <h2>There are no epics yet</h2>
          <p>
            Epics are large user stories that can be broken down into smaller
            stories. They help you organize your work in a hierarchical way.
          </p>
          <a
            href="https://tree.taiga.io/support/epics/what-is-an-epic/"
            target="_blank"
            rel="noopener noreferrer"
            className="help-link"
          >
            Learn more about epics
          </a>
        </section>
      )}

      {loading && (
        <div className="loading-container">
          Loading epics...
        </div>
      )}
    </div>
  );
};

export default Epics;
