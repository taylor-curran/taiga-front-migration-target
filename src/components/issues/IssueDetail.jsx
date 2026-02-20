import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import moment from 'moment';
import {
  fetchIssueByRef,
  fetchProjectBySlug,
  deleteIssue
} from '../../services/issues.service';
import IssueForm from './IssueForm';
import '../../styles/components/issues/IssueDetail.css';

const IssueDetail = () => {
  const { slug, ref } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const proj = await fetchProjectBySlug(slug);
        setProject(proj);
        const issueData = await fetchIssueByRef(proj.id, ref);
        setIssue(issueData);
      } catch (err) {
        console.error('Failed to load issue:', err);
        setError('Failed to load issue. It may not exist or you may not have access.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [slug, ref]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this issue?')) return;
    try {
      await deleteIssue(issue.id);
      navigate(`/project/${slug}/issues`);
    } catch (err) {
      console.error('Failed to delete issue:', err);
      setError('Failed to delete issue.');
    }
  };

  const handleEditSuccess = (updatedIssue) => {
    setIssue(updatedIssue);
    setEditing(false);
  };

  if (loading) {
    return <div className="issue-detail-loading">Loading issue...</div>;
  }

  if (error) {
    return (
      <div className="issue-detail-error">
        <p>{error}</p>
        <Link to={`/project/${slug}/issues`} className="back-link">Back to issues</Link>
      </div>
    );
  }

  if (!issue) return null;

  if (editing) {
    return (
      <div className="issue-detail-page">
        <div className="issue-detail-breadcrumb">
          <Link to={`/project/${slug}/issues`}>Issues</Link>
          <span className="breadcrumb-separator">/</span>
          <span>#{issue.ref} - Edit</span>
        </div>
        <IssueForm
          projectId={project.id}
          projectSlug={slug}
          issue={issue}
          onSuccess={handleEditSuccess}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="issue-detail-page">
      <div className="issue-detail-breadcrumb">
        <Link to={`/project/${slug}/issues`}>Issues</Link>
        <span className="breadcrumb-separator">/</span>
        <span>#{issue.ref}</span>
      </div>

      <div className="issue-detail-layout">
        <div className="issue-detail-main">
          <div className="issue-detail-header">
            <h1 className="issue-detail-title">
              <span className="issue-detail-ref">#{issue.ref}</span>
              {issue.subject}
            </h1>
            {issue.is_blocked && (
              <span className="issue-blocked-indicator">Blocked</span>
            )}
          </div>

          <div className="issue-detail-meta">
            <span className="meta-item">
              Created {moment(issue.created_date).format('DD MMM YYYY')}
            </span>
            {issue.owner_extra_info && (
              <span className="meta-item">
                by {issue.owner_extra_info.full_name_display}
              </span>
            )}
            <span className="meta-item">
              Modified {moment(issue.modified_date).fromNow()}
            </span>
          </div>

          <div className="issue-detail-description">
            <h3>Description</h3>
            {issue.description ? (
              <div className="description-content">{issue.description}</div>
            ) : (
              <p className="no-description">No description provided.</p>
            )}
          </div>

          {issue.tags && issue.tags.length > 0 && (
            <div className="issue-detail-tags">
              <h3>Tags</h3>
              <div className="tags-list">
                {issue.tags.map((tag) => (
                  <span
                    key={tag[0]}
                    className="issue-tag"
                    style={{ backgroundColor: tag[1] || '#e0e0e0' }}
                  >
                    {tag[0]}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="issue-detail-sidebar">
          <div className="sidebar-actions">
            <button className="btn-edit" onClick={() => setEditing(true)}>
              Edit
            </button>
            <button className="btn-delete" onClick={handleDelete}>
              Delete
            </button>
          </div>

          <div className="sidebar-section">
            <h4>Status</h4>
            <span
              className="sidebar-status-badge"
              style={{ backgroundColor: issue.status_extra_info?.color || '#999' }}
            >
              {issue.status_extra_info?.name || 'Unknown'}
            </span>
          </div>

          <div className="sidebar-section">
            <h4>Type</h4>
            <span className="sidebar-attribute">
              <span className="attr-dot" style={{ backgroundColor: issue.type_extra_info?.color || '#999' }} />
              {issue.type_extra_info?.name || 'Unknown'}
            </span>
          </div>

          <div className="sidebar-section">
            <h4>Severity</h4>
            <span className="sidebar-attribute">
              <span className="attr-dot" style={{ backgroundColor: issue.severity_extra_info?.color || '#999' }} />
              {issue.severity_extra_info?.name || 'Unknown'}
            </span>
          </div>

          <div className="sidebar-section">
            <h4>Priority</h4>
            <span className="sidebar-attribute">
              <span className="attr-dot" style={{ backgroundColor: issue.priority_extra_info?.color || '#999' }} />
              {issue.priority_extra_info?.name || 'Unknown'}
            </span>
          </div>

          {issue.assigned_to_extra_info && (
            <div className="sidebar-section">
              <h4>Assigned to</h4>
              <span className="sidebar-assignee">
                {issue.assigned_to_extra_info.full_name_display}
              </span>
            </div>
          )}

          {issue.due_date && (
            <div className="sidebar-section">
              <h4>Due date</h4>
              <span className={`sidebar-due-date ${issue.is_closed ? '' : moment(issue.due_date).isBefore(moment()) ? 'overdue' : ''}`}>
                {moment(issue.due_date).format('DD MMM YYYY')}
              </span>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default IssueDetail;
