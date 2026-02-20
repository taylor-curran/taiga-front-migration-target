import { useState, useEffect, useCallback } from 'react';
import {
  fetchProjectBySlug,
  fetchWebhooks,
  createWebhook,
  updateWebhook,
  deleteWebhook,
  testWebhook,
  fetchWebhookLogs,
} from '../../services/admin.service';

const Integrations = ({ slug }) => {
  const [project, setProject] = useState(null);
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedLogs, setExpandedLogs] = useState({});
  const [webhookLogs, setWebhookLogs] = useState({});
  const [formData, setFormData] = useState({ name: '', url: '', key: '' });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const proj = await fetchProjectBySlug(slug);
      setProject(proj);
      const hooks = await fetchWebhooks(proj.id);
      setWebhooks(hooks);
      if (hooks.length === 0) {
        setShowNewForm(true);
      }
    } catch (err) {
      setError('Failed to load integrations.');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const resetForm = () => {
    setFormData({ name: '', url: '', key: '' });
    setShowNewForm(false);
    setEditingId(null);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!project || !formData.name.trim() || !formData.url.trim()) return;
    try {
      setError(null);
      await createWebhook({
        project: project.id,
        name: formData.name,
        url: formData.url,
        key: formData.key,
      });
      setSuccessMsg('Webhook created.');
      setTimeout(() => setSuccessMsg(''), 3000);
      resetForm();
      loadData();
    } catch (err) {
      setError(err.response?.data?._error_message || 'Failed to create webhook.');
    }
  };

  const handleEdit = (webhook) => {
    setEditingId(webhook.id);
    setFormData({ name: webhook.name, url: webhook.url, key: webhook.key || '' });
    setShowNewForm(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      setError(null);
      await updateWebhook(editingId, {
        name: formData.name,
        url: formData.url,
        key: formData.key,
      });
      setSuccessMsg('Webhook updated.');
      setTimeout(() => setSuccessMsg(''), 3000);
      resetForm();
      loadData();
    } catch (err) {
      setError('Failed to update webhook.');
    }
  };

  const handleDelete = async (webhookId, webhookName) => {
    if (!window.confirm(`Delete webhook "${webhookName}"?`)) return;
    try {
      setError(null);
      await deleteWebhook(webhookId);
      setSuccessMsg('Webhook deleted.');
      setTimeout(() => setSuccessMsg(''), 3000);
      loadData();
    } catch (err) {
      setError('Failed to delete webhook.');
    }
  };

  const handleTest = async (webhookId) => {
    try {
      setError(null);
      await testWebhook(webhookId);
      setSuccessMsg('Test payload sent.');
      setTimeout(() => setSuccessMsg(''), 3000);
      await loadLogs(webhookId);
    } catch (err) {
      setError('Failed to test webhook.');
    }
  };

  const loadLogs = async (webhookId) => {
    try {
      const logs = await fetchWebhookLogs(webhookId);
      setWebhookLogs((prev) => ({ ...prev, [webhookId]: logs }));
    } catch (err) {
      setError('Failed to load webhook logs.');
    }
  };

  const toggleLogs = async (webhookId) => {
    const isExpanded = expandedLogs[webhookId];
    setExpandedLogs((prev) => ({ ...prev, [webhookId]: !isExpanded }));
    if (!isExpanded && !webhookLogs[webhookId]) {
      await loadLogs(webhookId);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading integrations...</div>;
  }

  return (
    <div className="admin-section admin-integrations">
      <div className="admin-section-header">
        <h2>Integrations</h2>
      </div>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}
      {successMsg && <div className="admin-alert admin-alert-success">{successMsg}</div>}

      <div className="integrations-subsection">
        <h3>Webhooks</h3>

        {webhooks.length > 0 && (
          <div className="webhooks-list">
            {webhooks.map((webhook) => (
              <div key={webhook.id} className="webhook-item">
                <div className="webhook-header">
                  <div className="webhook-info">
                    <span className="webhook-name">{webhook.name}</span>
                    <span className="webhook-url">{webhook.url}</span>
                  </div>
                  <div className="webhook-actions">
                    <button className="btn-link" onClick={() => handleTest(webhook.id)}>
                      Test
                    </button>
                    <button className="btn-link" onClick={() => handleEdit(webhook)}>
                      Edit
                    </button>
                    <button
                      className="btn-link btn-danger"
                      onClick={() => handleDelete(webhook.id, webhook.name)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn-link"
                      onClick={() => toggleLogs(webhook.id)}
                    >
                      {expandedLogs[webhook.id] ? 'Hide history' : 'Show history'}
                    </button>
                  </div>
                </div>

                {expandedLogs[webhook.id] && (
                  <div className="webhook-logs">
                    {(webhookLogs[webhook.id] || []).length === 0 ? (
                      <p className="no-logs">No logs available.</p>
                    ) : (
                      <table className="admin-table logs-table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Status</th>
                            <th>URL</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(webhookLogs[webhook.id] || []).map((log) => (
                            <tr key={log.id}>
                              <td>{new Date(log.created).toLocaleString()}</td>
                              <td>
                                <span
                                  className={`status-badge ${
                                    log.status >= 200 && log.status < 300 ? 'active' : 'error'
                                  }`}
                                >
                                  {log.status}
                                </span>
                              </td>
                              <td className="log-url">{log.url}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {(showNewForm || editingId) && (
          <form
            className="webhook-form"
            onSubmit={editingId ? handleUpdate : handleCreate}
          >
            <h4>{editingId ? 'Edit Webhook' : 'New Webhook'}</h4>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                required
                placeholder="Webhook name"
              />
            </div>
            <div className="form-group">
              <label>URL</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData((p) => ({ ...p, url: e.target.value }))}
                required
                placeholder="https://..."
              />
            </div>
            <div className="form-group">
              <label>Secret key</label>
              <input
                type="text"
                value={formData.key}
                onChange={(e) => setFormData((p) => ({ ...p, key: e.target.value }))}
                placeholder="Optional secret key"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-small btn-primary">
                {editingId ? 'Update' : 'Create'}
              </button>
              <button type="button" className="btn-small btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {!showNewForm && !editingId && webhooks.length > 0 && (
          <button
            className="btn-small btn-primary"
            onClick={() => setShowNewForm(true)}
          >
            Add Webhook
          </button>
        )}
      </div>
    </div>
  );
};

export default Integrations;
