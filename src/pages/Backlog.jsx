import { useParams } from 'react-router-dom';

const Backlog = () => {
  const { id } = useParams();
  
  return (
    <div className="backlog-page">
      <h1>Backlog</h1>
      <p>Project {id} backlog</p>
    </div>
  );
};

export default Backlog;
