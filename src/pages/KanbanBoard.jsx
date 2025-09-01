import { useParams } from 'react-router-dom';

const KanbanBoard = () => {
  const { id } = useParams();
  
  return (
    <div className="kanban-page">
      <h1>Kanban Board</h1>
      <p>Project {id} kanban board</p>
    </div>
  );
};

export default KanbanBoard;
