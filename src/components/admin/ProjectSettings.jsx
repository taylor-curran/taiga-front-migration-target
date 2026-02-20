import { useState, useEffect, useCallback } from 'react';
import {
  fetchProjectBySlug,
  updateProject,
  deleteProject,
  updateProjectLogo,
  removeProjectLogo,
} from '../../services/admin.service';

const ProjectSettings = ({ slug }) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_private: false,
    is_looking_for_people: false,
    looking_for_people_note: '',
    is_contact_activated: false,
    tags: [],
  });
  const [newTag, setNewTag] = useState('');

  const loadProject = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchProjectBySlug(slug);
      setProject(data);
      setFormData({
        name: data.name || '',
        description: data.description || '',
        is_private: data.is_private || false,
        is_looking_for_people: data.is_looking_for_people || false,
        looking_for_people_note: data.looking_for_people_note || '',
        is_contact_activated: data.is_contact_activated || false,
        tags: data.tags || [],
      });
    } catch (err) {
      setError('Failed to load project details.');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePrivacyChange = (isPrivate) => {
    setFormData((prev) => ({ ...prev, is_private: isPrivate }));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !project) return;
    try {
      const updated = await updateProjectLogo(project.id, file);
      setProject(updated);
      setSuccessMsg('Logo updated successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError('Failed to update logo.');
    }
  };

  const handleRemoveLogo = async () => {
    if (!project) return;
    try {
      await removeProjectLogo(project.id);
      setProject((prev) => ({ ...prev, logo_big_url: null }));
      setSuccessMsg('Logo removed.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError('Failed to remove logo.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!project) return;
    try {
      setSaving(true);
      setError(null);
      const updated = await updateProject(project.id, formData);
      setProject(updated);
      setSuccessMsg('Project settings saved successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?._error_message || 'Failed to save project settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!project) return;
    if (!window.confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await deleteProject(project.id);
      window.location.href = '/';
    } catch (err) {
      setError('Failed to delete project.');
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading project settings...</div>;
  }

  return (
    <div className="admin-section project-settings">
      <div className="admin-section-header">
        <h2>Project Details</h2>
      </div>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}
      {successMsg && <div className="admin-alert admin-alert-success">{successMsg}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="project-details-image">
          <div className="image-container">
            {project?.logo_big_url ? (
              <img src={project.logo_big_url} alt="Project logo" className="project-logo-preview" />
            ) : (
              <div className="project-logo-placeholder">
                <span>{formData.name?.charAt(0)?.toUpperCase() || 'P'}</span>
              </div>
            )}
          </div>
          <div className="logo-actions">
            <label className="btn-small btn-secondary" htmlFor="logo-upload">
              Change Logo
            </label>
            <input
              type="file"
              id="logo-upload"
              accept="image/*"
              onChange={handleLogoChange}
              style={{ display: 'none' }}
            />
            {project?.logo_big_url && (
              <button type="button" className="btn-link" onClick={handleRemoveLogo}>
                Use default logo
              </button>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="project-name">Project Name</label>
          <input
            type="text"
            id="project-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            maxLength={45}
            placeholder="Project name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="project-description">Description</label>
          <textarea
            id="project-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Project description"
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>Tags</label>
          <div className="tags-container">
            {formData.tags.map((tag) => (
              <span key={tag} className="tag-item">
                {tag}
                <button type="button" className="tag-remove" onClick={() => handleRemoveTag(tag)}>
                  &times;
                </button>
              </span>
            ))}
          </div>
          <div className="tag-input-group">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag(e);
                }
              }}
            />
            <button type="button" className="btn-small btn-secondary" onClick={handleAddTag}>
              Add
            </button>
          </div>
        </div>

        <div className="form-group">
          <div className="checkbox-group">
            <label className="checkbox-label">
              <span>Looking for people</span>
              <input
                type="checkbox"
                name="is_looking_for_people"
                checked={formData.is_looking_for_people}
                onChange={handleChange}
              />
            </label>
          </div>
          {formData.is_looking_for_people && (
            <div className="sub-field">
              <label htmlFor="recruiting-note">Recruiting message</label>
              <input
                type="text"
                id="recruiting-note"
                name="looking_for_people_note"
                value={formData.looking_for_people_note}
                onChange={handleChange}
                maxLength={200}
                placeholder="What kind of people are you looking for?"
              />
            </div>
          )}
        </div>

        <div className="form-group">
          <div className="checkbox-group">
            <label className="checkbox-label">
              <span>Enable feedback</span>
              <input
                type="checkbox"
                name="is_contact_activated"
                checked={formData.is_contact_activated}
                onChange={handleChange}
              />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Project Privacy</label>
          <div className="privacy-options">
            <label className="privacy-option">
              <input
                type="radio"
                name="privacy"
                checked={!formData.is_private}
                onChange={() => handlePrivacyChange(false)}
              />
              <span>Public project</span>
            </label>
            <label className="privacy-option">
              <input
                type="radio"
                name="privacy"
                checked={formData.is_private}
                onChange={() => handlePrivacyChange(true)}
              />
              <span>Private project</span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-small btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button type="button" className="btn-link btn-danger" onClick={handleDelete}>
            Delete project
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectSettings;
