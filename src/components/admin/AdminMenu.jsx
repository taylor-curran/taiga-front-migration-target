const AdminMenu = ({ activeSection, onSectionChange, projectSlug }) => {
  const menuItems = [
    { key: 'project', label: 'Project Details' },
    { key: 'attributes', label: 'Attributes' },
    { key: 'members', label: 'Members' },
    { key: 'permissions', label: 'Permissions' },
    { key: 'integrations', label: 'Integrations' },
  ];

  return (
    <section className="admin-menu">
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.key}
              className={activeSection === item.key ? 'active' : ''}
            >
              <button onClick={() => onSectionChange(item.key)}>
                <span className="title">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
};

export default AdminMenu;
