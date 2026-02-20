import { useState, useEffect, useCallback } from 'react';
import {
  fetchProjectBySlug,
  fetchCustomAttributes,
  createCustomAttribute,
  updateCustomAttribute,
  deleteCustomAttribute,
} from '../../services/admin.service';

const entityTypes = [
  { key: 'epic', label: 'Epics' },
  { key: 'userstory', label: 'User Stories' },
  { key: 'task', label: 'Tasks' },
  { key: 'issue', label: 'Issues' },
];

const fieldTypes = [
  { value: 'text', label: 'Text' },
  { value: 'multiline', label: 'Multi-line text' },
  { value: 'richtext', label: 'Rich text' },
  { value: 'date', label: 'Date' },
  { value: 'url', label: 'URL' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'number', label: 'Number' },
];

const CustomFields = ({ slug }) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState('epic');
  const [attributes, setAttributes] = useState([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'text',
    extra: '',
  });

  const loadProject = useCallback(async () => {
    try {
      const data = await fetchProjectBySlug(slug);
      setProject(data);
      return data;
    } catch (err) {
      setError('Failed to load project.');
      return null;
    }
  }, [slug]);

  const loadAttributes = useCallback(async (projectId) => {
    try {
      setLoading(true);
      const data = await fetchCustomAttributes(activeTab, projectId);
      setAttributes(data);
    } catch (err) {
      setAttributes([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    const init = async () => {
      const proj = await loadProject();
      if (proj) {
        await loadAttributes(proj.id);
      }
    };
    init();
  }, [loadProject, loadAttributes]);

  const resetForm = () => {
    setFormData({ name: '', description: '', type: 'text', extra: '' });
    setShowNewForm(false);
    setEditingId(null);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!project || !formData.name.trim()) return;
    try {
      setError(null);
      await createCustomAttribute(activeTab, {
        project: project.id,
        name: formData.name,
        description: formData.description,
        type: formData.type,
        extra: formData.extra || null,
        order: attributes.length + 1,
      });
      setSuccessMsg('Custom field created.');
      setTimeout(() => setSuccessMsg(''), 3000);
      resetForm();
      loadAttributes(project.id);
    } catch (err) {
      setError(err.response?.data?._error_message || 'Failed to create custom field.');
    }
  };

  const handleEdit = (attr) => {
    setEditingId(attr.id);
    setFormData({
      name: attr.name,
      description: attr.description || '',
      type: attr.type || 'text',
      extra: attr.extra || '',
    });
    setShowNewForm(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingId || !formData.name.trim()) return;
    try {
      setError(null);
      await updateCustomAttribute(activeTab, editingId, {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        extra: formData.extra || null,
      });
      setSuccessMsg('Custom field updated.');
      setTimeout(() => setSuccessMsg(''), 3000);
      resetForm();
      loadAttributes(project.id);
    } catch (err) {
      setError('Failed to update custom field.');
    }
  };

  const handleDelete = async (attrId, attrName) => {
    if (!window.confirm(`Delete custom field "${attrName}"?`)) return;
    try {
      setError(null);
      await deleteCustomAttribute(activeTab, attrId);
      setSuccessMsg('Custom field deleted.');
      setTimeout(() => setSuccessMsg(''), 3000);
      loadAttributes(project.id);
    } catch (err) {
      setError('Failed to delete custom field.');
    }
  };

  return (
    <div className="admin-section admin-custom-fields">
      <div className="admin-section-header">
        <h2>Custom Fields</h2>
      </div>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}
      {successMsg && <div className="admin-alert admin-alert-success">{successMsg}</div>}

      <div className="tabs">
        {entityTypes.map((type) => (
          <button
            key={type.key}
            className={`tab-button ${activeTab === type.key ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(type.key);
              resetForm();
            }}
          >
            {type.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="admin-loading">Loading custom fields...</div>
      ) : (
        <>
          <div className="custom-fields-list">
            {attributes.length === 0 ? (
              <div className="empty-state">
                <p>No custom fields defined for {entityTypes.find((t) => t.key === activeTab)?.label}.</p>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attributes.map((attr) => (
                    <tr key={attr.id}>
                      <td>{attr.name}</td>
                      <td>
                        <span className="field-type-badge">{attr.type || 'text'}</span>
                      </td>
                      <td>{attr.description || '-'}</td>
                      <td className="actions-cell">
                        <button className="btn-link" onClick={() => handleEdit(attr)}>
                          Edit
                        </button>
                        <button
                          className="btn-link btn-danger"
                          onClick={() => handleDelete(attr.id, attr.name)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {(showNewForm || editingId) && (
            <form
              className="custom-field-form"
              onSubmit={editingId ? handleUpdate : handleCreate}
            >
              <h3>{editingId ? 'Edit Custom Field' : 'New Custom Field'}</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    required
                    placeholder="Field name"
                  />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}
                  >
                    {fieldTypes.map((ft) => (
                      <option key={ft.value} value={ft.value}>
                        {ft.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Field description (optional)"
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

          {!showNewForm && !editingId && (
            <button
              className="btn-small btn-primary add-field-btn"
              onClick={() => setShowNewForm(true)}
            >
              Add Custom Field
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default CustomFields;
