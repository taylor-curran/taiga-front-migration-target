import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import useKanbanStore from '../stores/kanbanStore';

const KanbanBoard = () => {
  const { id } = useParams();
  const { 
    usByStatus, 
    usMap, 
    usByStatusSwimlanes, 
    swimlanesList,
    reset,
    init 
  } = useKanbanStore();
  
  useEffect(() => {
    reset();
    
    console.log('Kanban Store initialized:', {
      usByStatus: usByStatus.size,
      usMap: usMap.size,
      usByStatusSwimlanes: usByStatusSwimlanes.size,
      swimlanesList: swimlanesList.length
    });
  }, [id, reset]);
  
  return (
    <div className="kanban-page">
      <h1>Kanban Board</h1>
      <p>Project {id} kanban board</p>
      <p>Store initialized with {usByStatus.size} status columns</p>
    </div>
  );
};

export default KanbanBoard;
