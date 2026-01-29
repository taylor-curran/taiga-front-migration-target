import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  fetchProjectBySlug, 
  updateProject, 
  deleteProject,
  updateProjectLogo,
  removeProjectLogo
} from '../services/api';
import '../styles/pages/ProjectSettings.css';

const ProjectSettings = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_private: false,
    is_looking_for_people: false,
    looking_for_people_note: '',
    is_contact_activated: false,
    tags: []
  });

  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        const projectData = await fetchProjectBySlug(slug);
        setProject(projectData);
        setFormData({
          name: projectData.name || '',
          description: projectData.description || '',
          is_private: projectData.is_private || false,
          is_looking_for_people: projectData.is_looking_for_people || false,
          looking_for_people_note: projectData.looking_for_people_note || '',
          is_contact_activated: projectData.is_contact_activated || false,
          tags: projectData.tags || []
        });
      } catch (err) {
        setError('Failed to load project');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [slug]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePrivacyChange = (isPrivate) => {
    setFormData(prev => ({
      ...prev,
      is_private: isPrivate
    }));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      const updatedProject = await updateProjectLogo(project.id, file);
      setProject(updatedProject);
    } catch (err) {
      console.error('Failed to upload logo:', err);
      setError('Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleRemoveLogo = async () => {
    try {
      setUploadingLogo(true);
      const updatedProject = await removeProjectLogo(project.id);
      setProject(updatedProject);
    } catch (err) {
      console.error('Failed to remove logo:', err);
      setError('Failed to remove logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      const updatedProject = await updateProject(project.id, formData);
      setProject(updatedProject);
      
      if (updatedProject.slug !== slug) {
        navigate(`/project/${updatedProject.slug}/settings`, { replace: true });
      }
    } catch (err) {
      console.error('Failed to update project:', err);
      setError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProject(project.id);
      navigate('/projects');
    } catch (err) {
      console.error('Failed to delete project:', err);
      setError('Failed to delete project');
    }
  };

  if (loading) {
    return (
      <div className="project-settings-page">
        <div className="loading">Loading project settings...</div>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="project-settings-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="project-settings-page">
      <div className="settings-nav">
        <Link to={`/project/${slug}/settings`} className="nav-item active">
          Project Details
        </Link>
        <Link to={`/project/${slug}/settings/members`} className="nav-item">
          Members
        </Link>
      </div>

      <section className="main project-details">
        <header>
          <h1>Project Details</h1>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="project-details-image">
            <fieldset className="image-container">
              <img
                src={project?.logo_big_url || '/default-project-logo.png'}
                alt="Project logo"
                className="project-logo"
              />
              {uploadingLogo && (
                <div className="loading-overlay active">
                  <span>Uploading...</span>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </fieldset>

            <button
              type="button"
              className="btn-small change-image"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingLogo}
            >
              Change logo
            </button>

            <button
              type="button"
              className="use-default-image"
              onClick={handleRemoveLogo}
              disabled={uploadingLogo}
            >
              Use default logo
            </button>
          </div>

          <div className="project-details-form-data">
            <fieldset>
              <label htmlFor="project-name">Project name</label>
              <input
                type="text"
                id="project-name"
                name="name"
                placeholder="Project name"
                value={formData.name}
                onChange={handleInputChange}
                required
                maxLength={45}
              />
            </fieldset>

            <fieldset>
              <label htmlFor="project-description">Description</label>
              <textarea
                id="project-description"
                name="description"
                placeholder="Project description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </fieldset>

            <fieldset>
              <label>Tags</label>
              <div className="tags-block">
                <div className="tags-list">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                      <button
                        type="button"
                        className="tag-remove"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        x
                      </button>
                    </span>
                  ))}
                </div>
                <div className="tag-input-wrapper">
                  <input
                    type="text"
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag(e)}
                  />
                  <button
                    type="button"
                    className="btn-add-tag"
                    onClick={handleAddTag}
                  >
                    Add
                  </button>
                </div>
              </div>
            </fieldset>

            <fieldset className="looking-for-people">
              <div className="looking-for-people-selector">
                <span>Looking for people to join</span>
                <div className="check">
                  <input
                    type="checkbox"
                    name="is_looking_for_people"
                    checked={formData.is_looking_for_people}
                    onChange={handleInputChange}
                  />
                  <span className="check-text">
                    {formData.is_looking_for_people ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              {formData.is_looking_for_people && (
                <div className="looking-for-people-reason">
                  <label>What are you looking for?</label>
                  <input
                    type="text"
                    name="looking_for_people_note"
                    maxLength={200}
                    value={formData.looking_for_people_note}
                    onChange={handleInputChange}
                    placeholder="e.g., Frontend developers, designers..."
                  />
                </div>
              )}
            </fieldset>

            <fieldset className="get-feedback">
              <div className="get-feedback-inner">
                <span>Allow feedback from external users</span>
                <div className="check">
                  <input
                    type="checkbox"
                    name="is_contact_activated"
                    checked={formData.is_contact_activated}
                    onChange={handleInputChange}
                  />
                  <span className="check-text">
                    {formData.is_contact_activated ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </fieldset>

            <fieldset>
              <div className="project-privacy-settings">
                <div className="privacy-option">
                  <input
                    type="radio"
                    id="public-project"
                    name="privacy"
                    checked={!formData.is_private}
                    onChange={() => handlePrivacyChange(false)}
                  />
                  <label htmlFor="public-project" className="trans-button">
                    Public project
                  </label>
                </div>

                <div className="privacy-option">
                  <input
                    type="radio"
                    id="private-project"
                    name="privacy"
                    checked={formData.is_private}
                    onChange={() => handlePrivacyChange(true)}
                  />
                  <label htmlFor="private-project" className="trans-button">
                    Private project
                  </label>
                </div>
              </div>

              <a
                href="https://community.taiga.io/t/whats-the-difference-between-public-and-private-projects/139"
                target="_blank"
                rel="noopener noreferrer"
                className="private-or-public"
              >
                <svg viewBox="0 0 24 24" className="icon-question">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                </svg>
                <span>What&apos;s the difference?</span>
              </a>
            </fieldset>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>

            <button
              type="button"
              className="delete-project"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete project
            </button>
          </div>
        </form>
      </section>

      {showDeleteConfirm && (
        <div className="lightbox-overlay">
          <div className="lightbox lightbox-delete-project">
            <h2>Delete project</h2>
            <p>Are you sure you want to delete &quot;{project?.name}&quot;?</p>
            <p className="warning">This action cannot be undone.</p>
            <div className="lightbox-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSettings;
