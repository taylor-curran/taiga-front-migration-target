import { useState, useEffect, useCallback } from 'react';
import {
  fetchProjectBySlug,
  fetchRoles,
  createRole,
  updateRole,
  deleteRole,
} from '../../services/admin.service';

const permissionCategories = [
  {
    name: 'Epics',
    permissions: [
      { key: 'view_epics', label: 'View' },
      { key: 'add_epic', label: 'Add' },
      { key: 'modify_epic', label: 'Modify' },
      { key: 'comment_epic', label: 'Comment' },
      { key: 'delete_epic', label: 'Delete' },
    ],
  },
  {
    name: 'Sprints',
    permissions: [
      { key: 'view_milestones', label: 'View' },
      { key: 'add_milestone', label: 'Add' },
      { key: 'modify_milestone', label: 'Modify' },
      { key: 'delete_milestone', label: 'Delete' },
    ],
  },
  {
    name: 'User Stories',
    permissions: [
      { key: 'view_us', label: 'View' },
      { key: 'add_us', label: 'Add' },
      { key: 'modify_us', label: 'Modify' },
      { key: 'comment_us', label: 'Comment' },
      { key: 'delete_us', label: 'Delete' },
    ],
  },
  {
    name: 'Tasks',
    permissions: [
      { key: 'view_tasks', label: 'View' },
      { key: 'add_task', label: 'Add' },
      { key: 'modify_task', label: 'Modify' },
      { key: 'comment_task', label: 'Comment' },
      { key: 'delete_task', label: 'Delete' },
    ],
  },
  {
    name: 'Issues',
    permissions: [
      { key: 'view_issues', label: 'View' },
      { key: 'add_issue', label: 'Add' },
      { key: 'modify_issue', label: 'Modify' },
      { key: 'comment_issue', label: 'Comment' },
      { key: 'delete_issue', label: 'Delete' },
    ],
  },
  {
    name: 'Wiki',
    permissions: [
      { key: 'view_wiki_pages', label: 'View pages' },
      { key: 'add_wiki_page', label: 'Add pages' },
      { key: 'modify_wiki_page', label: 'Modify pages' },
      { key: 'delete_wiki_page', label: 'Delete pages' },
      { key: 'view_wiki_links', label: 'View links' },
      { key: 'add_wiki_link', label: 'Add links' },
      { key: 'delete_wiki_link', label: 'Delete links' },
    ],
  },
];

const Permissions = ({ slug }) => {
  const [project, setProject] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [showNewRole, setShowNewRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [editName, setEditName] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const proj = await fetchProjectBySlug(slug);
      setProject(proj);
      const rolesData = await fetchRoles(proj.id);
      setRoles(rolesData);
      if (rolesData.length > 0 && !selectedRole) {
        setSelectedRole(rolesData[0]);
      }
    } catch (err) {
      setError('Failed to load roles.');
    } finally {
      setLoading(false);
    }
  }, [slug, selectedRole]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setEditingName(false);
    setExpandedCategories({});
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!project || !newRoleName.trim()) return;
    try {
      setError(null);
      const maxOrder = roles.length > 0 ? Math.max(...roles.map((r) => r.order || 0)) : 0;
      const newRole = await createRole({
        project: project.id,
        name: newRoleName.trim(),
        permissions: ['view_project', 'view_milestones', 'view_us', 'view_tasks', 'view_issues'],
        order: maxOrder + 1,
        computable: false,
      });
      setRoles((prev) => [...prev, newRole]);
      setSelectedRole(newRole);
      setNewRoleName('');
      setShowNewRole(false);
      setSuccessMsg('Role created.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError('Failed to create role.');
    }
  };

  const handleRenameRole = async () => {
    if (!selectedRole || !editName.trim()) return;
    try {
      setError(null);
      const updated = await updateRole(selectedRole.id, { name: editName.trim() });
      setRoles((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      setSelectedRole(updated);
      setEditingName(false);
      setSuccessMsg('Role renamed.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError('Failed to rename role.');
    }
  };

  const handleDeleteRole = async () => {
    if (!selectedRole) return;
    const otherRoles = roles.filter((r) => r.id !== selectedRole.id);
    if (otherRoles.length === 0) {
      setError('Cannot delete the only role.');
      return;
    }
    if (!window.confirm(`Delete role "${selectedRole.name}"? Members will be moved to another role.`)) {
      return;
    }
    try {
      setError(null);
      await deleteRole(selectedRole.id, otherRoles[0].id);
      setRoles(otherRoles);
      setSelectedRole(otherRoles[0]);
      setSuccessMsg('Role deleted.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError('Failed to delete role.');
    }
  };

  const handleToggleComputable = async () => {
    if (!selectedRole) return;
    try {
      setError(null);
      const updated = await updateRole(selectedRole.id, {
        computable: !selectedRole.computable,
      });
      setRoles((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      setSelectedRole(updated);
      setSuccessMsg('Computable setting updated.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError('Failed to update computable setting.');
    }
  };

  const handleTogglePermission = async (permKey) => {
    if (!selectedRole) return;
    const currentPerms = selectedRole.permissions || [];
    let newPerms;
    if (currentPerms.includes(permKey)) {
      newPerms = currentPerms.filter((p) => p !== permKey);
    } else {
      newPerms = [...currentPerms, permKey];
      if (!newPerms.includes('view_project')) {
        newPerms.push('view_project');
      }
    }
    try {
      setError(null);
      const updated = await updateRole(selectedRole.id, { permissions: newPerms });
      setRoles((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      setSelectedRole(updated);
    } catch (err) {
      setError('Failed to update permission.');
    }
  };

  const toggleCategory = (categoryName) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  if (loading) {
    return <div className="admin-loading">Loading permissions...</div>;
  }

  return (
    <div className="admin-section admin-permissions">
      <div className="admin-section-header">
        <h2>Permissions</h2>
        {selectedRole && !selectedRole.external_user && (
          <div className="header-actions">
            <button className="btn-small btn-danger" onClick={handleDeleteRole}>
              Delete Role
            </button>
          </div>
        )}
      </div>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}
      {successMsg && <div className="admin-alert admin-alert-success">{successMsg}</div>}

      <div className="permissions-layout">
        <div className="roles-sidebar">
          <ul className="roles-list">
            {roles.map((role) => (
              <li
                key={role.id}
                className={`role-item ${selectedRole?.id === role.id ? 'active' : ''}`}
                onClick={() => handleSelectRole(role)}
              >
                <span className="role-name">{role.name}</span>
                <span className="role-members">{role.members_count || 0}</span>
              </li>
            ))}
          </ul>

          {showNewRole ? (
            <form className="new-role-form" onSubmit={handleCreateRole}>
              <input
                type="text"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="New role name"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setShowNewRole(false);
                    setNewRoleName('');
                  }
                }}
              />
              <button type="submit" className="btn-small btn-primary">Add</button>
            </form>
          ) : (
            <button
              className="btn-small btn-secondary add-role-btn"
              onClick={() => setShowNewRole(true)}
            >
              Add Role
            </button>
          )}
        </div>

        <div className="permissions-content">
          {selectedRole && (
            <>
              <div className="role-header">
                {editingName ? (
                  <div className="edit-role-name">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRenameRole();
                        if (e.key === 'Escape') setEditingName(false);
                      }}
                      autoFocus
                    />
                    <button className="btn-link" onClick={handleRenameRole}>Save</button>
                    <button className="btn-link" onClick={() => setEditingName(false)}>Cancel</button>
                  </div>
                ) : (
                  <div className="role-title">
                    <h3>{selectedRole.name}</h3>
                    {!selectedRole.external_user && (
                      <button
                        className="btn-link"
                        onClick={() => {
                          setEditingName(true);
                          setEditName(selectedRole.name);
                        }}
                      >
                        Rename
                      </button>
                    )}
                  </div>
                )}
              </div>

              {!selectedRole.external_user && (
                <div className="computable-setting">
                  <span>Role is estimable (computable)</span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={selectedRole.computable || false}
                      onChange={handleToggleComputable}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              )}

              {selectedRole.external_user && (
                <div className="external-user-note">
                  These permissions apply to users who are not members of the project
                  (external users viewing a public project).
                </div>
              )}

              <div className="permission-categories">
                {permissionCategories.map((category) => {
                  const rolePerms = selectedRole.permissions || [];
                  const activeCount = category.permissions.filter((p) =>
                    rolePerms.includes(p.key)
                  ).length;

                  return (
                    <div key={category.name} className="permission-category">
                      <div
                        className={`category-resume ${expandedCategories[category.name] ? 'open-drawer' : ''}`}
                        onClick={() => toggleCategory(category.name)}
                      >
                        <span className="category-name">{category.name}</span>
                        <div className="category-summary">
                          <span className="perm-count">
                            {activeCount}/{category.permissions.length}
                          </span>
                          <div className="perm-dots">
                            {category.permissions.map((p) => (
                              <span
                                key={p.key}
                                className={`perm-dot ${rolePerms.includes(p.key) ? 'active' : ''}`}
                                title={p.label}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="expand-icon">{expandedCategories[category.name] ? '\u25B2' : '\u25BC'}</span>
                      </div>

                      {expandedCategories[category.name] && (
                        <div className="category-items">
                          {category.permissions.map((perm) => (
                            <div key={perm.key} className="permission-item">
                              <span>{perm.label}</span>
                              <label className="toggle-switch small">
                                <input
                                  type="checkbox"
                                  checked={rolePerms.includes(perm.key)}
                                  onChange={() => handleTogglePermission(perm.key)}
                                />
                                <span className="toggle-slider"></span>
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Permissions;
