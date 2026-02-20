import { Link, useParams } from 'react-router-dom';

const Sidebar = () => {
  const { slug } = useParams();

  return (
    <aside className="app-sidebar">
      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/projects">Projects</Link>
        {slug && (
          <>
            <Link to={`/project/${slug}`}>Overview</Link>
            <Link to={`/project/${slug}/backlog`}>Backlog</Link>
            <Link to={`/project/${slug}/kanban`}>Kanban</Link>
            <Link to={`/project/${slug}/issues`}>Issues</Link>
            <Link to={`/project/${slug}/epics`}>Epics</Link>
            <Link to={`/project/${slug}/wiki`}>Wiki</Link>
            <Link to={`/project/${slug}/admin`}>Admin</Link>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
