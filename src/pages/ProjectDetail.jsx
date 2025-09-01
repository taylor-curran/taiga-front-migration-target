import { useParams } from 'react-router-dom';

const ProjectDetail = () => {
  const { id } = useParams();
  
  return (
    <div className="project-detail-page">
      <h1>Project Detail</h1>
      <p>Project ID: {id}</p>
    </div>
  );
};

export default ProjectDetail;
