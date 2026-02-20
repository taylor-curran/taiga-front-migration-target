import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import EpicDetailSidebar from '../components/epics/EpicDetailSidebar';
import RelatedUserStories from '../components/epics/RelatedUserStories';
import {
  fetchEpicByRef,
  updateEpic,
  updateEpicStatus,
  deleteEpic,
  fetchRelatedUserStories,
  fetchProjectBySlug
} from '../services/epics.service';
import '../styles/pages/EpicDetail.css';

const EpicDetail = () => {
  const { slug, ref } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [epic, setEpic] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDescription, setEditingDescription] = useState(false);
  const [description, setDescription] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const proj = await fetchProjectBySlug(slug);
      setProject(proj);
      const epicData = await fetchEpicByRef(proj.id, ref);
      setEpic(epicData);
      setDescription(epicData.description || '');
      try {
        const relatedStories = await fetchRelatedUserStories(epicData.id);
        setStories(relatedStories);
      } catch {
        setStories([]);
      }
    } catch (err) {
      setError('Failed to load epic details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [slug, ref]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStatusChange = async (statusId) => {
    if (!epic) return;
    try {
      const updated = await updateEpicStatus(epic.id, statusId, epic.version);
      setEpic(updated);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleSaveDescription = async () => {
    if (!epic) return;
    try {
      const updated = await updateEpic(epic.id, {
        description,
        version: epic.version
      });
      setEpic(updated);
      setEditingDescription(false);
    } catch (err) {
      console.error('Failed to save description:', err);
    }
  };

  const handleDelete = async () => {
    if (!epic) return;
    if (!window.confirm('Are you sure you want to delete this epic?')) return;
    try {
      await deleteEpic(epic.id);
      navigate(`/project/${slug}/epics`);
    } catch (err) {
      console.error('Failed to delete epic:', err);
    }
  };

  if (loading) {
    return (
      <div className="epic-detail-page">
        <div className="loading-container">
          <div className="loading-spinner-lg" />
          <p>Loading epic...</p>
        </div>
      </div>
    );
  }

  if (error || !epic) {
    return (
      <div className="epic-detail-page">
        <div className="error-container">
          <p className="error-message">{error || 'Epic not found'}</p>
          <Link to={`/project/${slug}/epics`} className="btn-back">
            Back to epics
          </Link>
        </div>
      </div>
    );
  }

  const totalStories =
    (epic.user_stories_counts?.opened || 0) +
    (epic.user_stories_counts?.closed || 0);
  const closedStories = epic.user_stories_counts?.closed || 0;
  const progressPercent = totalStories > 0
    ? Math.round((closedStories / totalStories) * 100)
    : 0;

  return (
    <div className="epic-detail-page">
      <div className="detail-wrapper">
        <div className="detail-main">
          <div className={`detail-header-container ${epic.is_blocked ? 'blocked' : ''}`}>
            <nav className="detail-nav">
              <Link to={`/project/${slug}/epics`} className="back-link">
                &larr; Back to epics
              </Link>
            </nav>
            <div className="detail-header">
              <div className="epic-header-info">
                <span
                  className="epic-color-indicator"
                  style={{ backgroundColor: epic.color || '#999' }}
                />
                <h1 className="epic-subject">
                  <span className="epic-ref">#{epic.ref}</span>
                  {epic.subject}
                </h1>
              </div>
              <div className="epic-meta">
                {epic.owner_extra_info && (
                  <span className="created-by">
                    Created by {epic.owner_extra_info.full_name_display}
                  </span>
                )}
                {epic.created_date && (
                  <span className="created-date">
                    on {new Date(epic.created_date).toLocaleDateString()}
                  </span>
                )}
              </div>
              {epic.tags && epic.tags.length > 0 && (
                <div className="epic-tags">
                  {epic.tags.map(([name, color]) => (
                    <span
                      key={name}
                      className="tag"
                      style={{ borderLeftColor: color || '#ccc' }}
                    >
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="detail-content">
            <section className="epic-description-section">
              <h2>Description</h2>
              {editingDescription ? (
                <div className="description-editor">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={8}
                  />
                  <div className="editor-actions">
                    <button className="btn-save" onClick={handleSaveDescription}>
                      Save
                    </button>
                    <button
                      className="btn-cancel"
                      onClick={() => {
                        setDescription(epic.description || '');
                        setEditingDescription(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="description-display"
                  onClick={() => setEditingDescription(true)}
                >
                  {epic.description ? (
                    <p>{epic.description}</p>
                  ) : (
                    <p className="no-description">Click to add a description</p>
                  )}
                </div>
              )}
            </section>

            <section className="epic-progress-section">
              <h2>Progress</h2>
              <div className="progress-overview">
                <div className="progress-bar-lg">
                  <div
                    className="progress-fill-lg"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="progress-label">
                  {closedStories} of {totalStories} user stories completed ({progressPercent}%)
                </span>
              </div>
            </section>

            <section className="epic-stories-section">
              <h2>Related User Stories ({stories.length})</h2>
              <RelatedUserStories
                stories={stories}
                projectSlug={slug}
                showClosed={true}
              />
            </section>
          </div>
        </div>

        <EpicDetailSidebar
          epic={epic}
          statuses={project?.epic_statuses || []}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default EpicDetail;
