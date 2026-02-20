import { Link, useLocation } from 'react-router-dom';

const AdminNav = ({ projectSlug }) => {
  const location = useLocation();
  const basePath = `/project/${projectSlug}/admin`;

  const navItems = [
    { path: '', label: 'Project Details' },
    { path: '/members', label: 'Members' },
    { path: '/roles', label: 'Roles & Permissions' },
  ];

  return (
    <nav className="admin-nav">
      <h3 className="admin-nav-title">Administration</h3>
      <ul className="admin-nav-list">
        {navItems.map((item) => {
          const fullPath = `${basePath}${item.path}`;
          const isActive = location.pathname === fullPath;
          return (
            <li key={item.path} className={`admin-nav-item ${isActive ? 'active' : ''}`}>
              <Link to={fullPath}>{item.label}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default AdminNav;
