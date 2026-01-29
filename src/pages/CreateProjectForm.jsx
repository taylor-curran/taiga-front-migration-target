import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createProject, PROJECT_TEMPLATES } from '../services/api';
import '../styles/pages/CreateProjectForm.css';

const CreateProjectForm = () => {
  const { template } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_private: false,
    creation_template: template === 'kanban' ? PROJECT_TEMPLATES.KANBAN : PROJECT_TEMPLATES.SCRUM
  });
  
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const templateInfo = {
    scrum: {
      title: 'Scrum',
      description: 'Backlog, sprints, user stories, tasks, and more',
      icon: (
        <svg viewBox="0 0 24 24" className="template-icon">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      )
    },
    kanban: {
      title: 'Kanban',
      description: 'Visual workflow management with boards and cards',
      icon: (
        <svg viewBox="0 0 24 24" className="template-icon">
          <path d="M4 4h4v16H4V4zm6 0h4v12h-4V4zm6 0h4v8h-4V4z"/>
        </svg>
      )
    }
  };

  const currentTemplate = templateInfo[template] || templateInfo.scrum;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors.includes(name)) {
      setErrors(prev => prev.filter(err => err !== name));
    }
  };

  const handlePrivacyChange = (isPrivate) => {
    setFormData(prev => ({
      ...prev,
      is_private: isPrivate
    }));
  };

  const validateForm = () => {
    const newErrors = [];
    if (!formData.name.trim()) {
      newErrors.push('name');
    }
    if (!formData.description.trim()) {
      newErrors.push('description');
    }
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const project = await createProject(formData);
      navigate(`/project/${project.slug}`);
    } catch (error) {
      console.error('Failed to create project:', error);
      if (error.response?.data) {
        const apiErrors = Object.keys(error.response.data);
        setErrors(apiErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/project/new');
  };

  return (
    <div className="create-project-form-page">
      <div className="create-project-title-wrapper">
        {currentTemplate.icon}
        <h1 className="create-project-title">{currentTemplate.title}</h1>
      </div>
      <h3 className="create-project-description">{currentTemplate.description}</h3>

      <form onSubmit={handleSubmit} noValidate>
        <fieldset>
          <label htmlFor="project-name">Project details</label>
          <input
            type="text"
            id="project-name"
            name="name"
            className={errors.includes('name') ? 'error' : ''}
            placeholder="Project title"
            value={formData.name}
            onChange={handleInputChange}
            required
            maxLength={45}
          />
          {errors.includes('name') && (
            <div className="error-text">This field is required</div>
          )}
        </fieldset>

        <fieldset>
          <textarea
            id="project-description"
            name="description"
            className={errors.includes('description') ? 'error' : ''}
            placeholder="Project description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
          {errors.includes('description') && (
            <div className="error-text">This field is required</div>
          )}
        </fieldset>

        <div className="create-project-privacy" role="group">
          <fieldset>
            <input
              type="radio"
              name="privacy"
              id="template-public"
              checked={!formData.is_private}
              onChange={() => handlePrivacyChange(false)}
            />
            <label htmlFor="template-public" className="privacy-label">
              <svg viewBox="0 0 24 24" className="privacy-icon">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              <span>Public project</span>
            </label>
          </fieldset>
          <fieldset>
            <input
              type="radio"
              name="privacy"
              id="template-private"
              checked={formData.is_private}
              onChange={() => handlePrivacyChange(true)}
            />
            <label htmlFor="template-private" className="privacy-label">
              <svg viewBox="0 0 24 24" className="privacy-icon">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
              <span>Private project</span>
            </label>
          </fieldset>
        </div>

        <div className="privacy-info">
          {formData.is_private ? (
            <p>Only project members will be able to see this project.</p>
          ) : (
            <p>Anyone can see this project. Only members can edit.</p>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProjectForm;
