import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import EpicList from '../components/epics/EpicList';
import '../styles/pages/Epics.css';

const Epics = () => {
  const { slug: projectSlug } = useParams();
  const [epics, setEpics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectId, setProjectId] = useState(null);
  const [sortBy, setSortBy] = useState('-created_date');
  const [statusFilter, setStatusFilter] = useState('');
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const response = await api.get('/projects/by_slug', {
          params: { slug: projectSlug },
        });
        setProjectId(response.data.id);
        if (response.data.epic_statuses) {
          setStatuses(response.data.epic_statuses);
        }
      } catch (error) {
        console.error('Failed to load project:', error);
      }
    };
    loadProject();
  }, [projectSlug]);

  const loadEpics = useCallback(async (projId) => {
    if (!projId) return;
    setLoading(true);
    try {
      const params = {
        project: projId,
        order_by: sortBy,
      };
      if (statusFilter) {
        params.status = statusFilter;
      }
      const response = await api.get('/epics', { params });
      setEpics(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to load epics:', error);
      setEpics([]);
    } finally {
      setLoading(false);
    }
  }, [sortBy, statusFilter]);

  useEffect(() => {
    if (projectId) {
      loadEpics(projectId);
    }
  }, [projectId, loadEpics]);

  return (
    <div className="epics-page">
      <header className="epics-header">
        <h1 className="epics-title">Epics</h1>
      </header>

      <div className="epics-controls">
        <select
          className="epics-sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="-created_date">Newest first</option>
          <option value="created_date">Oldest first</option>
          <option value="-modified_date">Recently updated</option>
        </select>

        {statuses.length > 0 && (
          <select
            className="epics-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All statuses</option>
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <EpicList
        epics={epics}
        projectSlug={projectSlug}
        loading={loading}
      />
    </div>
  );
};

export default Epics;
