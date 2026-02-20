import { Link, useParams, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const { slug } = useParams();
  const location = useLocation();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  if (!slug) return null;

  return (
    <aside className="app-sidebar">
      <nav>
        <div className="sidebar-project-header">
          <Link to={`/project/${slug}`}>
            <span className="sidebar-project-logo">
              {slug.charAt(0).toUpperCase()}
            </span>
            <span>{slug}</span>
          </Link>
        </div>

        <div className="sidebar-nav-section">
          <Link
            to={`/project/${slug}/issues`}
            className={isActive(`/project/${slug}/issues`) ? 'active' : ''}
          >
            <span className="sidebar-icon">☰</span>
            Issues
          </Link>
        </div>

        <div className="sidebar-nav-section">
          <Link
            to={`/project/${slug}/wiki`}
            className={isActive(`/project/${slug}/wiki`) ? 'active' : ''}
          >
            <span className="sidebar-icon">✎</span>
            Wiki
          </Link>
          <Link
            to={`/project/${slug}/epics`}
            className={isActive(`/project/${slug}/epics`) ? 'active' : ''}
          >
            <span className="sidebar-icon">★</span>
            Epics
          </Link>
          <Link
            to={`/project/${slug}/backlog`}
            className={isActive(`/project/${slug}/backlog`) ? 'active' : ''}
          >
            <span className="sidebar-icon">☰</span>
            Backlog
          </Link>
          <Link
            to={`/project/${slug}/kanban`}
            className={isActive(`/project/${slug}/kanban`) ? 'active' : ''}
          >
            <span className="sidebar-icon">▦</span>
            Kanban
          </Link>
        </div>

        <div className="sidebar-nav-section">
          <Link
            to={`/project/${slug}/admin`}
            className={isActive(`/project/${slug}/admin`) ? 'active' : ''}
          >
            <span className="sidebar-icon">⚙</span>
            Admin
          </Link>
        </div>

        <button className="sidebar-collapse-btn" type="button">
          ← collapse menu
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
