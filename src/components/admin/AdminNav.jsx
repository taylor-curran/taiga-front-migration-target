import { NavLink, useParams } from 'react-router-dom';

const adminMenuItems = [
  { id: 'project-profile', label: 'Project', path: 'project-profile/details' },
  { id: 'project-values', label: 'Attributes', path: 'project-values/custom-fields' },
  { id: 'memberships', label: 'Members', path: 'memberships' },
  { id: 'roles', label: 'Permissions', path: 'roles' },
  { id: 'integrations', label: 'Integrations', path: 'integrations' },
];

const AdminNav = ({ activeSection }) => {
  const { slug } = useParams();

  return (
    <aside className="admin-sidebar">
      <nav className="admin-menu">
        <ul className="admin-menu-list">
          {adminMenuItems.map((item) => (
            <li
              key={item.id}
              className={`admin-menu-item ${activeSection === item.id ? 'active' : ''}`}
            >
              <NavLink
                to={`/project/${slug}/admin/${item.path}`}
                className={({ isActive }) => isActive ? 'admin-menu-link active' : 'admin-menu-link'}
              >
                <span className="admin-menu-title">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminNav;
