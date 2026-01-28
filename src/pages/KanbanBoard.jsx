import { useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './KanbanBoard.css';

// Mock data for the kanban board (since we're in a sandbox environment)
const initialStatuses = [
  { id: 1, name: 'New', color: '#70728F', wip_limit: null, is_archived: false, order: 1 },
  { id: 2, name: 'Ready', color: '#E44057', wip_limit: 5, is_archived: false, order: 2 },
  { id: 3, name: 'In Progress', color: '#E47C40', wip_limit: 3, is_archived: false, order: 3 },
  { id: 4, name: 'Ready for Test', color: '#A9CE37', wip_limit: 4, is_archived: false, order: 4 },
  { id: 5, name: 'Done', color: '#A8E440', wip_limit: null, is_archived: false, order: 5 },
];

const initialSwimlanes = [
  { id: 1, name: 'Epic: User Authentication', order: 1 },
  { id: 2, name: 'Epic: Dashboard Features', order: 2 },
  { id: 3, name: 'Epic: API Integration', order: 3 },
];

const initialUserStories = [
  { id: 1, ref: 101, subject: 'Implement login form', status: 1, swimlane: 1, kanban_order: 1, assigned_to: { id: 1, name: 'John Doe', avatar: null }, tags: [['frontend', '#E44057'], ['urgent', '#A9CE37']], points: 3 },
  { id: 2, ref: 102, subject: 'Add password validation', status: 1, swimlane: 1, kanban_order: 2, assigned_to: { id: 2, name: 'Jane Smith', avatar: null }, tags: [['frontend', '#E44057']], points: 2 },
  { id: 3, ref: 103, subject: 'Create OAuth integration', status: 2, swimlane: 1, kanban_order: 1, assigned_to: { id: 1, name: 'John Doe', avatar: null }, tags: [['backend', '#70728F']], points: 5 },
  { id: 4, ref: 104, subject: 'Design dashboard layout', status: 2, swimlane: 2, kanban_order: 1, assigned_to: null, tags: [['design', '#E47C40']], points: 3 },
  { id: 5, ref: 105, subject: 'Implement chart widgets', status: 3, swimlane: 2, kanban_order: 1, assigned_to: { id: 2, name: 'Jane Smith', avatar: null }, tags: [['frontend', '#E44057']], points: 5 },
  { id: 6, ref: 106, subject: 'Add data export feature', status: 3, swimlane: 2, kanban_order: 2, assigned_to: { id: 1, name: 'John Doe', avatar: null }, tags: [['feature', '#A8E440']], points: 3 },
  { id: 7, ref: 107, subject: 'Setup REST API endpoints', status: 4, swimlane: 3, kanban_order: 1, assigned_to: { id: 3, name: 'Bob Wilson', avatar: null }, tags: [['backend', '#70728F'], ['api', '#A9CE37']], points: 8 },
  { id: 8, ref: 108, subject: 'Write API documentation', status: 5, swimlane: 3, kanban_order: 1, assigned_to: { id: 3, name: 'Bob Wilson', avatar: null }, tags: [['docs', '#70728F']], points: 2 },
  { id: 9, ref: 109, subject: 'Implement rate limiting', status: 2, swimlane: 3, kanban_order: 2, assigned_to: null, tags: [['backend', '#70728F'], ['security', '#E44057']], points: 5 },
  { id: 10, ref: 110, subject: 'Add session management', status: 3, swimlane: 1, kanban_order: 3, assigned_to: { id: 2, name: 'Jane Smith', avatar: null }, tags: [['backend', '#70728F']], points: 5 },
  { id: 11, ref: 111, subject: 'Create notification system', status: 1, swimlane: 2, kanban_order: 1, assigned_to: null, tags: [['feature', '#A8E440']], points: 8 },
  { id: 12, ref: 112, subject: 'Implement WebSocket support', status: 4, swimlane: 3, kanban_order: 2, assigned_to: { id: 1, name: 'John Doe', avatar: null }, tags: [['backend', '#70728F'], ['realtime', '#E47C40']], points: 8 },
];

const KanbanBoard = () => {
  const { slug } = useParams();
  const [userStories, setUserStories] = useState(initialUserStories);
  const [statuses] = useState(initialStatuses);
  const [swimlanes] = useState(initialSwimlanes);
  const [foldedSwimlanes, setFoldedSwimlanes] = useState({});

  // Group user stories by status and swimlane
  const userStoriesByStatusAndSwimlane = useMemo(() => {
    const grouped = {};
    swimlanes.forEach(swimlane => {
      grouped[swimlane.id] = {};
      statuses.forEach(status => {
        grouped[swimlane.id][status.id] = userStories
          .filter(us => us.status === status.id && us.swimlane === swimlane.id)
          .sort((a, b) => a.kanban_order - b.kanban_order);
      });
    });
    return grouped;
  }, [userStories, statuses, swimlanes]);

  // Count user stories per status (for WIP limit checking)
  const countByStatus = useMemo(() => {
    const counts = {};
    statuses.forEach(status => {
      counts[status.id] = userStories.filter(us => us.status === status.id).length;
    });
    return counts;
  }, [userStories, statuses]);

  // Get WIP limit status for a column
  const getWipLimitStatus = useCallback((status) => {
    if (!status.wip_limit) return null;
    const count = countByStatus[status.id];
    if (count > status.wip_limit) return 'exceeded';
    if (count === status.wip_limit) return 'reached';
    if (count === status.wip_limit - 1) return 'one-left';
    return null;
  }, [countByStatus]);

  // Handle drag end
  const onDragEnd = useCallback((result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    // Parse the droppable IDs to get swimlane and status
    const [, destSwimId, destStatusId] = destination.droppableId.split('-');

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const usId = parseInt(draggableId.split('-')[1]);
    const newStatusId = parseInt(destStatusId);
    const newSwimlaneId = parseInt(destSwimId);

    setUserStories(prevStories => {
      const newStories = [...prevStories];
      const storyIndex = newStories.findIndex(us => us.id === usId);
      
      if (storyIndex === -1) return prevStories;

      const story = { ...newStories[storyIndex] };
      story.status = newStatusId;
      story.swimlane = newSwimlaneId;

      // Update kanban_order based on destination index
      const storiesInDestination = newStories
        .filter(us => us.status === newStatusId && us.swimlane === newSwimlaneId && us.id !== usId)
        .sort((a, b) => a.kanban_order - b.kanban_order);

      // Calculate new order
      if (destination.index === 0) {
        story.kanban_order = storiesInDestination.length > 0 
          ? storiesInDestination[0].kanban_order - 1 
          : 1;
      } else if (destination.index >= storiesInDestination.length) {
        story.kanban_order = storiesInDestination.length > 0 
          ? storiesInDestination[storiesInDestination.length - 1].kanban_order + 1 
          : 1;
      } else {
        const prevOrder = storiesInDestination[destination.index - 1].kanban_order;
        const nextOrder = storiesInDestination[destination.index].kanban_order;
        story.kanban_order = (prevOrder + nextOrder) / 2;
      }

      newStories[storyIndex] = story;
      return newStories;
    });
  }, []);

  // Toggle swimlane fold state
  const toggleSwimlane = useCallback((swimlaneId) => {
    setFoldedSwimlanes(prev => ({
      ...prev,
      [swimlaneId]: !prev[swimlaneId]
    }));
  }, []);

  // Get initials from name for avatar placeholder
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="kanban-page">
      <div className="kanban-header">
        <h1>Kanban Board</h1>
        <p className="kanban-subtitle">Project: {slug || 'Demo Project'}</p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {/* Status column headers */}
          <div className="kanban-table-header">
            <div className="kanban-swimlane-header-spacer"></div>
            {statuses.map(status => {
              const wipStatus = getWipLimitStatus(status);
              return (
                <div 
                  key={status.id} 
                  className={`kanban-column-header ${wipStatus ? `wip-${wipStatus}` : ''}`}
                >
                  <div className="status-color-bar" style={{ backgroundColor: status.color }}></div>
                  <div className="status-name">{status.name}</div>
                  <div className="status-count">
                    <span className="count">{countByStatus[status.id]}</span>
                    {status.wip_limit && (
                      <span className="wip-limit">/ {status.wip_limit}</span>
                    )}
                  </div>
                  {wipStatus && (
                    <div className={`wip-indicator ${wipStatus}`}>
                      {wipStatus === 'exceeded' && 'WIP Exceeded'}
                      {wipStatus === 'reached' && 'WIP Reached'}
                      {wipStatus === 'one-left' && '1 Left'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Swimlanes */}
          <div className="kanban-swimlanes">
            {swimlanes.map(swimlane => (
              <div 
                key={swimlane.id} 
                className={`kanban-swimlane ${foldedSwimlanes[swimlane.id] ? 'folded' : ''}`}
              >
                {/* Swimlane header */}
                <div 
                  className="kanban-swimlane-title"
                  onClick={() => toggleSwimlane(swimlane.id)}
                >
                  <span className="fold-icon">{foldedSwimlanes[swimlane.id] ? '>' : 'v'}</span>
                  <span className="swimlane-name">{swimlane.name}</span>
                  <span className="swimlane-count">
                    ({userStories.filter(us => us.swimlane === swimlane.id).length} stories)
                  </span>
                </div>

                {/* Swimlane columns */}
                {!foldedSwimlanes[swimlane.id] && (
                  <div className="kanban-swimlane-row">
                    {statuses.map(status => {
                      const droppableId = `drop-${swimlane.id}-${status.id}`;
                      const stories = userStoriesByStatusAndSwimlane[swimlane.id]?.[status.id] || [];
                      const wipStatus = getWipLimitStatus(status);

                      return (
                        <Droppable key={droppableId} droppableId={droppableId}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`kanban-column ${snapshot.isDraggingOver ? 'dragging-over' : ''} ${wipStatus ? `wip-${wipStatus}` : ''}`}
                            >
                              {stories.map((story, index) => (
                                <Draggable
                                  key={`us-${story.id}`}
                                  draggableId={`us-${story.id}`}
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`kanban-card ${snapshot.isDragging ? 'dragging' : ''}`}
                                    >
                                      <div className="card-header">
                                        <span className="card-ref">#{story.ref}</span>
                                        <span className="card-points">{story.points} pts</span>
                                      </div>
                                      <div className="card-subject">{story.subject}</div>
                                      {story.tags && story.tags.length > 0 && (
                                        <div className="card-tags">
                                          {story.tags.map(([tagName, tagColor], idx) => (
                                            <span 
                                              key={idx} 
                                              className="card-tag"
                                              style={{ backgroundColor: tagColor }}
                                            >
                                              {tagName}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                      <div className="card-footer">
                                        {story.assigned_to ? (
                                          <div className="card-assignee" title={story.assigned_to.name}>
                                            <div className="assignee-avatar">
                                              {getInitials(story.assigned_to.name)}
                                            </div>
                                            <span className="assignee-name">{story.assigned_to.name}</span>
                                          </div>
                                        ) : (
                                          <div className="card-assignee unassigned">
                                            <div className="assignee-avatar">?</div>
                                            <span className="assignee-name">Unassigned</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                              
                              {/* WIP limit indicator line */}
                              {status.wip_limit && stories.length >= status.wip_limit && (
                                <div className={`wip-limit-line ${wipStatus}`}>
                                  <span>WIP Limit</span>
                                </div>
                              )}
                            </div>
                          )}
                        </Droppable>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
