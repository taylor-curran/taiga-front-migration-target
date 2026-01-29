import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/pages/CreateProject.css';

const CreateProject = () => {
  const [showScrumHelp, setShowScrumHelp] = useState(false);
  const [showKanbanHelp, setShowKanbanHelp] = useState(false);
  const navigate = useNavigate();

  const handleTemplateSelect = (template) => {
    navigate(`/project/new/${template}`);
  };

  return (
    <div className="create-project-page">
      <div className="create-project-wrapper">
        <h1 className="create-project-title">Create a project</h1>
        <h3 className="create-project-description">Choose a template</h3>
        
        <ul className="create-project-selector">
          <li>
            <button
              className="template-option"
              onClick={() => handleTemplateSelect('scrum')}
              title="Scrum"
            >
              <div className="create-project-selector-icon">
                <svg viewBox="0 0 24 24" className="icon-scrum">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className="create-project-selector-template-wrapper">
                <p className="create-project-selector-template">Scrum</p>
                <p className="create-project-selector-description">
                  Backlog, sprints, user stories, tasks, and more
                </p>
                <button
                  className="create-project-selector-question"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowScrumHelp(!showScrumHelp);
                  }}
                  title="Learn more about Scrum"
                >
                  <svg viewBox="0 0 24 24" className="icon-question">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                  </svg>
                </button>
                {showScrumHelp && (
                  <div className="create-project-selector-long-description">
                    <p>
                      Scrum is an agile framework for developing, delivering, and sustaining 
                      complex products. It includes sprints, backlogs, user stories, and tasks 
                      to help teams work together effectively.
                    </p>
                  </div>
                )}
              </div>
            </button>
          </li>
          
          <li>
            <button
              className="template-option"
              onClick={() => handleTemplateSelect('kanban')}
              title="Kanban"
            >
              <div className="create-project-selector-icon">
                <svg viewBox="0 0 24 24" className="icon-kanban">
                  <path d="M4 4h4v16H4V4zm6 0h4v12h-4V4zm6 0h4v8h-4V4z"/>
                </svg>
              </div>
              <div className="create-project-selector-template-wrapper">
                <p className="create-project-selector-template">Kanban</p>
                <p className="create-project-selector-description">
                  Visual workflow management with boards and cards
                </p>
                <button
                  className="create-project-selector-question"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowKanbanHelp(!showKanbanHelp);
                  }}
                  title="Learn more about Kanban"
                >
                  <svg viewBox="0 0 24 24" className="icon-question">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                  </svg>
                </button>
                {showKanbanHelp && (
                  <div className="create-project-selector-long-description">
                    <p>
                      Kanban is a visual system for managing work as it moves through a process. 
                      It uses boards and cards to visualize work, limit work-in-progress, and 
                      maximize efficiency.
                    </p>
                  </div>
                )}
              </div>
            </button>
          </li>
          
          <li>
            <Link
              to="/project/new/duplicate"
              className="template-option"
              title="Duplicate project"
            >
              <div className="create-project-selector-icon">
                <svg viewBox="0 0 24 24" className="icon-duplicate">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
              </div>
              <div className="create-project-selector-template-wrapper">
                <p className="create-project-selector-template">Duplicate project</p>
                <p className="create-project-selector-description">
                  Create a new project based on an existing one
                </p>
              </div>
            </Link>
          </li>
          
          <li>
            <Link
              to="/project/new/import"
              className="template-option"
              title="Import project"
            >
              <div className="create-project-selector-icon">
                <svg viewBox="0 0 24 24" className="icon-upload">
                  <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/>
                </svg>
              </div>
              <div className="create-project-selector-template-wrapper">
                <p className="create-project-selector-template">Import project</p>
                <p className="create-project-selector-description">
                  Import from Trello, Jira, GitHub, Asana, or Taiga
                </p>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CreateProject;
