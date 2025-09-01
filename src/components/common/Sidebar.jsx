import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="app-sidebar">
      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/projects">Projects</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
