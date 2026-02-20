import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createIssue,
  updateIssue,
  fetchIssueStatuses,
  fetchIssueTypes,
  fetchIssuePriorities,
  fetchIssueSeverities
} from '../../services/issues.service';
import '../../styles/components/issues/IssueForm.css';

const IssueForm = ({ projectId, projectSlug, issue = null, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const isEditing = Boolean(issue);

  const [formData, setFormData] = useState({
    subject: issue?.subject || '',
    description: issue?.description || '',
    status: issue?.status || '',
    type: issue?.type || '',
    severity: issue?.severity || '',
    priority: issue?.priority || '',
    tags: issue?.tags?.map((t) => t[0]).join(', ') || ''
  });

  const [statuses, setStatuses] = useState([]);
  const [types, setTypes] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [severities, setSeverities] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [optionsLoading, setOptionsLoading] = useState(true);

  useEffect(() => {
    const loadOptions = async () => {
      setOptionsLoading(true);
      try {
        const [statusList, typeList, priorityList, severityList] = await Promise.all([
          fetchIssueStatuses(projectId),
          fetchIssueTypes(projectId),
          fetchIssuePriorities(projectId),
          fetchIssueSeverities(projectId)
        ]);
        setStatuses(statusList);
        setTypes(typeList);
        setPriorities(priorityList);
        setSeverities(severityList);

        if (!isEditing) {
          setFormData((prev) => ({
            ...prev,
            status: statusList[0]?.id || '',
            type: typeList[0]?.id || '',
            severity: severityList[0]?.id || '',
            priority: priorityList[0]?.id || ''
          }));
        }
      } catch (err) {
        console.error('Failed to load issue options:', err);
        setError('Failed to load form options.');
      } finally {
        setOptionsLoading(false);
      }
    };
    loadOptions();
  }, [projectId, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject.trim()) {
      setError('Subject is required.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      project: projectId,
      subject: formData.subject.trim(),
      description: formData.description.trim(),
      status: formData.status || undefined,
      type: formData.type || undefined,
      severity: formData.severity || undefined,
      priority: formData.priority || undefined
    };

    if (formData.tags.trim()) {
      payload.tags = formData.tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    try {
      let result;
      if (isEditing) {
        result = await updateIssue(issue.id, { ...payload, version: issue.version });
      } else {
        result = await createIssue(payload);
      }

      if (onSuccess) {
        onSuccess(result);
      } else {
        navigate(`/project/${projectSlug}/issue/${result.ref}`);
      }
    } catch (err) {
      console.error('Failed to save issue:', err);
      setError(err.response?.data?._error_message || 'Failed to save issue.');
    } finally {
      setSubmitting(false);
    }
  };

  if (optionsLoading) {
    return <div className="issue-form-loading">Loading form...</div>;
  }

  return (
    <form className="issue-form" onSubmit={handleSubmit}>
      <h2 className="issue-form-title">{isEditing ? 'Edit Issue' : 'New Issue'}</h2>

      {error && <div className="issue-form-error">{error}</div>}

      <div className="form-group">
        <label htmlFor="issue-subject">Subject *</label>
        <input
          id="issue-subject"
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Issue subject..."
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="issue-description">Description</label>
        <textarea
          id="issue-description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the issue..."
          rows={6}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="issue-type">Type</label>
          <select id="issue-type" name="type" value={formData.type} onChange={handleChange}>
            {types.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="issue-severity">Severity</label>
          <select id="issue-severity" name="severity" value={formData.severity} onChange={handleChange}>
            {severities.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="issue-priority">Priority</label>
          <select id="issue-priority" name="priority" value={formData.priority} onChange={handleChange}>
            {priorities.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="issue-status">Status</label>
          <select id="issue-status" name="status" value={formData.status} onChange={handleChange}>
            {statuses.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="issue-tags">Tags (comma separated)</label>
        <input
          id="issue-tags"
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="bug, ui, backend..."
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-submit" disabled={submitting}>
          {submitting ? 'Saving...' : (isEditing ? 'Update Issue' : 'Create Issue')}
        </button>
        {onCancel && (
          <button type="button" className="btn-cancel" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default IssueForm;
