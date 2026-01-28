import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import moment from 'moment';
import _ from 'lodash';
import {
  fetchProjectBySlug,
  fetchProjectStats,
  fetchSprints,
  fetchBacklogUserStories,
  fetchUserStoryStatuses,
  createSprint,
  updateSprint,
  createUserStory,
  updateUserStory,
  moveUserStoriesToSprint,
  bulkUpdateUserStoriesOrder
} from '../services/api';
import '../styles/pages/Backlog.css';

const Backlog = () => {
  const { slug } = useParams();
  
  const [project, setProject] = useState(null);
  const [stats, setStats] = useState(null);
  const [sprints, setSprints] = useState([]);
  const [closedSprints, setClosedSprints] = useState([]);
  const [userStories, setUserStories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalUserStories, setTotalUserStories] = useState(0);
  
  const [showFilters, setShowFilters] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [showClosedSprints, setShowClosedSprints] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserStories, setSelectedUserStories] = useState([]);
  const [collapsedSprints, setCollapsedSprints] = useState({});
  
  const [filters, setFilters] = useState({
    status: [],
    tags: [],
    assignedUsers: []
  });
  
  const [showSprintModal, setShowSprintModal] = useState(false);
  const [showUserStoryModal, setShowUserStoryModal] = useState(false);
  const [editingSprint, setEditingSprint] = useState(null);
  const [sprintForm, setSprintForm] = useState({
    name: '',
    estimated_start: '',
    estimated_finish: ''
  });
  const [userStoryForm, setUserStoryForm] = useState({
    subject: '',
    description: ''
  });
  
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  const loadUserStories = useCallback(async (projectId, filterParams = {}) => {
    const params = { ...filterParams };
    if (searchQuery) {
      params.q = searchQuery;
    }
    if (filters.status.length > 0) {
      params.status = filters.status.join(',');
    }
    
    const result = await fetchBacklogUserStories(projectId, params);
    const sortedStories = _.sortBy(result.userStories, 'backlog_order');
    setUserStories(sortedStories);
    setTotalUserStories(result.totalCount);
  }, [searchQuery, filters.status]);

  const loadProjectData = useCallback(async () => {
    if (!slug) return;
    
    setLoading(true);
    try {
      const projectData = await fetchProjectBySlug(slug);
      if (!projectData) {
        setLoading(false);
        return;
      }
      
      setProject(projectData);
      
      const [statsData, openSprintsData, closedSprintsData, statusesData] = await Promise.all([
        fetchProjectStats(projectData.id),
        fetchSprints(projectData.id, { closed: false }),
        fetchSprints(projectData.id, { closed: true }),
        fetchUserStoryStatuses(projectData.id)
      ]);
      
      setStats(statsData);
      setSprints(openSprintsData);
      setClosedSprints(closedSprintsData);
      setStatuses(statusesData);
      
      await loadUserStories(projectData.id);
    } catch (error) {
      console.error('Failed to load project data:', error);
    } finally {
      setLoading(false);
    }
  }, [slug, loadUserStories]);

  useEffect(() => {
    loadProjectData();
  }, [loadProjectData]);

  useEffect(() => {
    if (project) {
      const debounceSearch = setTimeout(() => {
        loadUserStories(project.id);
      }, 300);
      return () => clearTimeout(debounceSearch);
    }
  }, [searchQuery, filters, project, loadUserStories]);

  const handleSelectUserStory = (usId) => {
    setSelectedUserStories(prev => {
      if (prev.includes(usId)) {
        return prev.filter(id => id !== usId);
      }
      return [...prev, usId];
    });
  };

  const handleSelectAll = () => {
    if (selectedUserStories.length === userStories.length) {
      setSelectedUserStories([]);
    } else {
      setSelectedUserStories(userStories.map(us => us.id));
    }
  };

  const handleMoveToSprint = async (sprintId) => {
    if (selectedUserStories.length === 0 || !project) return;
    
    try {
      await moveUserStoriesToSprint(project.id, sprintId, selectedUserStories);
      setSelectedUserStories([]);
      await loadProjectData();
    } catch (error) {
      console.error('Failed to move user stories:', error);
    }
  };

  const handleDragStart = (e, us, sourceType, sourceId = null) => {
    setDraggedItem({ us, sourceType, sourceId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, targetUs = null, targetType = 'backlog', targetId = null) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverItem({ targetUs, targetType, targetId });
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDrop = async (e, targetUs = null, targetType = 'backlog', targetId = null) => {
    e.preventDefault();
    
    if (!draggedItem || !project) return;
    
    const { us: draggedUs, sourceType, sourceId } = draggedItem;
    
    if (sourceType === targetType && sourceId === targetId) {
      if (targetUs && draggedUs.id !== targetUs.id) {
        const items = sourceType === 'backlog' ? [...userStories] : 
          [...(sprints.find(s => s.id === sourceId)?.user_stories || [])];
        
        const draggedIndex = items.findIndex(item => item.id === draggedUs.id);
        const targetIndex = items.findIndex(item => item.id === targetUs.id);
        
        if (draggedIndex !== -1 && targetIndex !== -1) {
          items.splice(draggedIndex, 1);
          items.splice(targetIndex, 0, draggedUs);
          
          if (sourceType === 'backlog') {
            setUserStories(items);
            const bulkData = items.map((item, index) => ({
              us_id: item.id,
              order: index
            }));
            try {
              await bulkUpdateUserStoriesOrder(project.id, bulkData);
            } catch (error) {
              console.error('Failed to update order:', error);
              loadUserStories(project.id);
            }
          }
        }
      }
    } else if (sourceType === 'backlog' && targetType === 'sprint') {
      try {
        await moveUserStoriesToSprint(project.id, targetId, [draggedUs.id]);
        await loadProjectData();
      } catch (error) {
        console.error('Failed to move to sprint:', error);
      }
    } else if (sourceType === 'sprint' && targetType === 'backlog') {
      try {
        await updateUserStory(draggedUs.id, { milestone: null });
        await loadProjectData();
      } catch (error) {
        console.error('Failed to move to backlog:', error);
      }
    }
    
    handleDragEnd();
  };

  const toggleSprintCollapse = (sprintId) => {
    setCollapsedSprints(prev => ({
      ...prev,
      [sprintId]: !prev[sprintId]
    }));
  };

  const openSprintModal = (sprint = null) => {
    if (sprint) {
      setEditingSprint(sprint);
      setSprintForm({
        name: sprint.name,
        estimated_start: sprint.estimated_start,
        estimated_finish: sprint.estimated_finish
      });
    } else {
      setEditingSprint(null);
      const today = moment().format('YYYY-MM-DD');
      const twoWeeksLater = moment().add(2, 'weeks').format('YYYY-MM-DD');
      setSprintForm({
        name: '',
        estimated_start: today,
        estimated_finish: twoWeeksLater
      });
    }
    setShowSprintModal(true);
  };

  const handleSprintSubmit = async (e) => {
    e.preventDefault();
    if (!project) return;
    
    try {
      if (editingSprint) {
        await updateSprint(editingSprint.id, sprintForm);
      } else {
        await createSprint({
          ...sprintForm,
          project: project.id
        });
      }
      setShowSprintModal(false);
      await loadProjectData();
    } catch (error) {
      console.error('Failed to save sprint:', error);
    }
  };

  const openUserStoryModal = () => {
    setUserStoryForm({ subject: '', description: '' });
    setShowUserStoryModal(true);
  };

  const handleUserStorySubmit = async (e) => {
    e.preventDefault();
    if (!project) return;
    
    try {
      await createUserStory({
        ...userStoryForm,
        project: project.id
      });
      setShowUserStoryModal(false);
      await loadUserStories(project.id);
    } catch (error) {
      console.error('Failed to create user story:', error);
    }
  };

  const toggleFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(v => v !== value)
        : [...prev[filterType], value]
    }));
  };

  const getStatusById = (statusId) => {
    return statuses.find(s => s.id === statusId) || { name: 'Unknown', color: '#999' };
  };

  const getCurrentSprint = () => {
    const now = moment();
    return sprints.find(sprint => {
      const start = moment(sprint.estimated_start);
      const end = moment(sprint.estimated_finish);
      return now.isBetween(start, end, 'day', '[]');
    });
  };

  const getSprintProgress = (sprint) => {
    if (!sprint.total_points || sprint.total_points === 0) return 0;
    return Math.round((sprint.closed_points || 0) / sprint.total_points * 100);
  };

  const formatDateRange = (start, end) => {
    return `${moment(start).format('MMM D')} - ${moment(end).format('MMM D, YYYY')}`;
  };

  const allSprints = showClosedSprints ? [...sprints, ...closedSprints] : sprints;
  const currentSprint = getCurrentSprint();

  // stats is used for potential future features like velocity forecasting
  void stats;

  if (loading) {
    return (
      <div className="backlog-page">
        <div className="loading-container">Loading backlog...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="backlog-page">
        <div className="loading-container">Project not found</div>
      </div>
    );
  }

  return (
    <div className="backlog-page">
      <div className="backlog-main">
        <div className="backlog-header">
          <div className="backlog-title-section">
            <h1 className="backlog-title">Backlog</h1>
            <span className="backlog-count">
              {totalUserStories} {totalUserStories === 1 ? 'story' : 'stories'}
            </span>
          </div>
          <div className="backlog-actions">
            <button className="btn-primary" onClick={openUserStoryModal}>
              + New User Story
            </button>
          </div>
        </div>

        <div className="backlog-controls">
          <div className="backlog-controls-left">
            <button 
              className={`btn-secondary ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters {filters.status.length > 0 && `(${filters.status.length})`}
            </button>
            <input
              type="text"
              className="search-input"
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {userStories.length > 0 && (
              <label className={`filter-toggle ${showTags ? 'active' : ''}`}>
                <input
                  type="checkbox"
                  checked={showTags}
                  onChange={() => setShowTags(!showTags)}
                  style={{ display: 'none' }}
                />
                Show Tags
              </label>
            )}
          </div>
          <div className="backlog-controls-right">
            {selectedUserStories.length > 0 && sprints.length > 0 && (
              <button 
                className="move-to-sprint-btn visible"
                onClick={() => handleMoveToSprint(currentSprint?.id || sprints[0].id)}
              >
                Move to {currentSprint ? 'Current' : 'Latest'} Sprint
              </button>
            )}
          </div>
        </div>

        <div className="backlog-content">
          {showFilters && (
            <div className="backlog-filters-panel">
              <h3 className="filters-title">Filters</h3>
              
              <div className="filter-section">
                <h4 className="filter-section-title">Status</h4>
                <div className="filter-options">
                  {statuses.map(status => (
                    <div
                      key={status.id}
                      className={`filter-option ${filters.status.includes(status.id) ? 'selected' : ''}`}
                      onClick={() => toggleFilter('status', status.id)}
                    >
                      <span 
                        className="filter-color" 
                        style={{ background: status.color }}
                      />
                      {status.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="backlog-table-container">
            <div className="backlog-table">
              <div className="backlog-table-header">
                <div></div>
                <div>
                  <input
                    type="checkbox"
                    checked={selectedUserStories.length === userStories.length && userStories.length > 0}
                    onChange={handleSelectAll}
                  />
                </div>
                <div>User Story</div>
                <div>Status</div>
                <div>Points</div>
                <div></div>
              </div>
              
              <div 
                className="backlog-table-body"
                onDragOver={(e) => handleDragOver(e, null, 'backlog')}
                onDrop={(e) => handleDrop(e, null, 'backlog')}
              >
                {userStories.length === 0 ? (
                  <div className="empty-backlog">
                    <p className="empty-backlog-title">
                      {searchQuery ? 'No stories match your search' : 'Your backlog is empty'}
                    </p>
                    <p className="empty-backlog-text">
                      {searchQuery ? 'Try adjusting your search criteria' : 'Create your first user story to get started'}
                    </p>
                    {!searchQuery && (
                      <button className="btn-primary" onClick={openUserStoryModal}>
                        + Create User Story
                      </button>
                    )}
                  </div>
                ) : (
                  userStories.map((us) => {
                    const status = getStatusById(us.status);
                    const isSelected = selectedUserStories.includes(us.id);
                    const isDragging = draggedItem?.us.id === us.id;
                    const isDragOver = dragOverItem?.targetUs?.id === us.id;
                    
                    return (
                      <div
                        key={us.id}
                        className={`us-row ${isSelected ? 'selected' : ''} ${us.is_blocked ? 'blocked' : ''} ${us.is_closed ? 'closed' : ''} ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, us, 'backlog')}
                        onDragOver={(e) => handleDragOver(e, us, 'backlog')}
                        onDrop={(e) => handleDrop(e, us, 'backlog')}
                        onDragEnd={handleDragEnd}
                      >
                        <div className="us-drag-handle">
                          &#x2630;
                        </div>
                        <div className="us-checkbox">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectUserStory(us.id)}
                          />
                        </div>
                        <div className="us-info">
                          <div className="us-title-row">
                            <span className="us-ref">#{us.ref}</span>
                            <Link 
                              to={`/project/${slug}/us/${us.ref}`}
                              className="us-subject"
                              title={us.subject}
                            >
                              {us.subject}
                            </Link>
                          </div>
                          {showTags && us.tags && us.tags.length > 0 && (
                            <div className="us-tags">
                              {us.tags.map((tag, idx) => (
                                <span 
                                  key={idx}
                                  className="us-tag"
                                  style={{ background: tag[1] || '#999' }}
                                  title={tag[0]}
                                >
                                  {tag[0]}
                                </span>
                              ))}
                            </div>
                          )}
                          {us.epics && us.epics.length > 0 && (
                            <div className="us-tags">
                              {us.epics.map(epic => (
                                <span 
                                  key={epic.id}
                                  className="us-epic-badge"
                                  style={{ background: epic.color || '#999' }}
                                  title={`#${epic.ref} ${epic.subject}`}
                                >
                                  #{epic.ref}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="us-status">
                          <span 
                            className="us-status-badge"
                            style={{ background: status.color }}
                          >
                            {status.name}
                          </span>
                        </div>
                        <div className="us-points">
                          {us.total_points || '-'}
                        </div>
                        <div className="us-options">
                          <button className="us-options-btn" title="More options">
                            &#x22EE;
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sprints-sidebar">
        <div className="sprints-header">
          <h2 className="sprints-title">
            <span className="sprints-count">{sprints.length + closedSprints.length}</span>
            Sprints
          </h2>
          <button className="add-sprint-btn" onClick={() => openSprintModal()}>
            + Add
          </button>
        </div>

        {allSprints.length === 0 ? (
          <div className="empty-sprints">
            <p className="empty-sprints-title">No sprints yet</p>
            <button className="btn-primary" onClick={() => openSprintModal()}>
              + Create Sprint
            </button>
          </div>
        ) : (
          <>
            <div className="sprints-list">
              {allSprints.map(sprint => {
                const isCollapsed = collapsedSprints[sprint.id];
                const progress = getSprintProgress(sprint);
                const isCurrent = currentSprint?.id === sprint.id;
                
                return (
                  <div 
                    key={sprint.id} 
                    className={`sprint-card ${sprint.closed ? 'closed' : ''}`}
                    onDragOver={(e) => handleDragOver(e, null, 'sprint', sprint.id)}
                    onDrop={(e) => handleDrop(e, null, 'sprint', sprint.id)}
                  >
                    <div className="sprint-card-header">
                      <div className="sprint-card-title-row">
                        <div className="sprint-card-title">
                          <button 
                            className={`sprint-toggle-btn ${isCollapsed ? 'collapsed' : ''}`}
                            onClick={() => toggleSprintCollapse(sprint.id)}
                          >
                            &#x25BC;
                          </button>
                          <Link to={`/project/${slug}/taskboard/${sprint.slug}`}>
                            {sprint.name}
                          </Link>
                          {isCurrent && <span className="sprint-current-badge">Current</span>}
                        </div>
                        <div className="sprint-card-actions">
                          <button 
                            className="sprint-edit-btn"
                            onClick={() => openSprintModal(sprint)}
                            title="Edit sprint"
                          >
                            &#x270E;
                          </button>
                        </div>
                      </div>
                      <div className="sprint-card-dates">
                        {formatDateRange(sprint.estimated_start, sprint.estimated_finish)}
                      </div>
                      <div className="sprint-card-stats">
                        <span className="sprint-stat">
                          <span className="sprint-stat-value">{sprint.closed_points || 0}</span>
                          <span className="sprint-stat-label"> closed</span>
                        </span>
                        <span className="sprint-stat">
                          <span className="sprint-stat-value">{sprint.total_points || 0}</span>
                          <span className="sprint-stat-label"> total</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="sprint-progress">
                      <div 
                        className="sprint-progress-bar" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    
                    <div className={`sprint-card-body ${isCollapsed ? 'collapsed' : ''}`}>
                      {sprint.user_stories && sprint.user_stories.length > 0 ? (
                        <div className="sprint-us-list">
                          {sprint.user_stories.map(us => (
                            <div 
                              key={us.id} 
                              className="sprint-us-item"
                              draggable
                              onDragStart={(e) => handleDragStart(e, us, 'sprint', sprint.id)}
                            >
                              <span className="sprint-us-ref">#{us.ref}</span>
                              <span className="sprint-us-subject" title={us.subject}>
                                {us.subject}
                              </span>
                              <span className="sprint-us-points">
                                {us.total_points || '-'}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="sprint-empty">
                          Drop user stories here
                        </div>
                      )}
                    </div>
                    
                    <div className="sprint-card-footer">
                      <Link 
                        to={`/project/${slug}/taskboard/${sprint.slug}`}
                        className="sprint-taskboard-link"
                      >
                        Go to Taskboard &rarr;
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {closedSprints.length > 0 && (
              <div className="closed-sprints-toggle">
                <button 
                  className="closed-sprints-btn"
                  onClick={() => setShowClosedSprints(!showClosedSprints)}
                >
                  {showClosedSprints ? 'Hide' : 'Show'} {closedSprints.length} closed sprint{closedSprints.length !== 1 ? 's' : ''}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showSprintModal && (
        <div className="modal-overlay" onClick={() => setShowSprintModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingSprint ? 'Edit Sprint' : 'Create Sprint'}
              </h2>
              <button className="modal-close" onClick={() => setShowSprintModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSprintSubmit}>
              <div className="form-group">
                <label className="form-label">Sprint Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={sprintForm.name}
                  onChange={(e) => setSprintForm({ ...sprintForm, name: e.target.value })}
                  placeholder="e.g., Sprint 1"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={sprintForm.estimated_start}
                    onChange={(e) => setSprintForm({ ...sprintForm, estimated_start: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={sprintForm.estimated_finish}
                    onChange={(e) => setSprintForm({ ...sprintForm, estimated_finish: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowSprintModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingSprint ? 'Save Changes' : 'Create Sprint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUserStoryModal && (
        <div className="modal-overlay" onClick={() => setShowUserStoryModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create User Story</h2>
              <button className="modal-close" onClick={() => setShowUserStoryModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleUserStorySubmit}>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-input"
                  value={userStoryForm.subject}
                  onChange={(e) => setUserStoryForm({ ...userStoryForm, subject: e.target.value })}
                  placeholder="As a user, I want to..."
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description (optional)</label>
                <textarea
                  className="form-textarea"
                  value={userStoryForm.description}
                  onChange={(e) => setUserStoryForm({ ...userStoryForm, description: e.target.value })}
                  placeholder="Add more details about this user story..."
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowUserStoryModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Create User Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Backlog;
