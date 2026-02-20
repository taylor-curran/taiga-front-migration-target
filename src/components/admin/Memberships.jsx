import { useState, useEffect, useCallback } from 'react';
import {
  fetchProjectBySlug,
  fetchMemberships,
  bulkCreateMemberships,
  updateMembership,
  deleteMembership,
  resendInvitation,
  fetchRoles,
} from '../../services/admin.service';

const Memberships = ({ slug }) => {
  const [project, setProject] = useState(null);
  const [memberships, setMemberships] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [paginatedBy, setPaginatedBy] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const proj = await fetchProjectBySlug(slug);
      setProject(proj);

      const [membData, rolesData] = await Promise.all([
        fetchMemberships(proj.id, { page }),
        fetchRoles(proj.id),
      ]);

      const activeMembers = membData.memberships.filter(
        (m) => m.user === null || m.is_user_active
      );
      setMemberships(activeMembers);
      setTotalCount(membData.count);
      setPaginatedBy(membData.paginatedBy);
      setRoles(rolesData);

      if (rolesData.length > 0 && !newMemberRole) {
        setNewMemberRole(rolesData[0].id);
      }
    } catch (err) {
      setError('Failed to load memberships.');
    } finally {
      setLoading(false);
    }
  }, [slug, page, newMemberRole]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberEmail.trim() || !newMemberRole || !project) return;

    try {
      setError(null);
      await bulkCreateMemberships(project.id, [
        { role_id: newMemberRole, username: newMemberEmail.trim() },
      ]);
      setSuccessMsg('Member added successfully.');
      setNewMemberEmail('');
      setShowAddForm(false);
      setTimeout(() => setSuccessMsg(''), 3000);
      loadData();
    } catch (err) {
      setError(err.response?.data?._error_message || 'Failed to add member.');
    }
  };

  const handleRoleChange = async (membershipId, newRoleId) => {
    try {
      setError(null);
      await updateMembership(membershipId, { role: parseInt(newRoleId, 10) });
      setSuccessMsg('Role updated.');
      setTimeout(() => setSuccessMsg(''), 3000);
      loadData();
    } catch (err) {
      setError('Failed to update role.');
    }
  };

  const handleAdminToggle = async (membershipId, isAdmin) => {
    try {
      setError(null);
      await updateMembership(membershipId, { is_admin: isAdmin });
      setSuccessMsg('Admin status updated.');
      setTimeout(() => setSuccessMsg(''), 3000);
      loadData();
    } catch (err) {
      setError(err.response?.data?.is_admin?.[0] || 'Failed to update admin status.');
    }
  };

  const handleDeleteMember = async (membership) => {
    const name = membership.full_name || membership.email;
    if (!window.confirm(`Remove ${name} from this project?`)) return;

    try {
      setError(null);
      await deleteMembership(membership.id);
      setSuccessMsg(`${name} removed from project.`);
      setTimeout(() => setSuccessMsg(''), 3000);
      loadData();
    } catch (err) {
      setError('Failed to remove member.');
    }
  };

  const handleResendInvite = async (membershipId, email) => {
    try {
      setError(null);
      await resendInvitation(membershipId);
      setSuccessMsg(`Invitation resent to ${email}.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError('Failed to resend invitation.');
    }
  };

  const totalPages = paginatedBy > 0 ? Math.ceil(totalCount / paginatedBy) : 1;

  if (loading) {
    return <div className="admin-loading">Loading members...</div>;
  }

  return (
    <div className="admin-section admin-memberships">
      <div className="admin-section-header">
        <h2>Members</h2>
        <div className="header-actions">
          <button
            className="btn-small btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : 'Add Member'}
          </button>
        </div>
      </div>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}
      {successMsg && <div className="admin-alert admin-alert-success">{successMsg}</div>}

      {showAddForm && (
        <form className="add-member-form" onSubmit={handleAddMember}>
          <div className="form-row">
            <input
              type="text"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              placeholder="Email or username"
              required
            />
            <select
              value={newMemberRole}
              onChange={(e) => setNewMemberRole(e.target.value)}
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            <button type="submit" className="btn-small btn-primary">
              Add
            </button>
          </div>
        </form>
      )}

      <div className="memberships-table">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Role</th>
              <th>Admin</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {memberships.map((member) => (
              <tr key={member.id}>
                <td className="member-info">
                  <div className="member-avatar">
                    {member.photo ? (
                      <img src={member.photo} alt={member.full_name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {(member.full_name || member.email || '?').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="member-details">
                    <span className="member-name">{member.full_name || 'Pending'}</span>
                    <span className="member-email">{member.user_email || member.email}</span>
                  </div>
                </td>
                <td>
                  {member.is_owner ? (
                    <span className="role-badge owner">Owner</span>
                  ) : (
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value)}
                    >
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
                <td>
                  {!member.is_owner && (
                    <input
                      type="checkbox"
                      checked={member.is_admin || false}
                      onChange={(e) => handleAdminToggle(member.id, e.target.checked)}
                    />
                  )}
                  {member.is_owner && <span className="badge">Owner</span>}
                </td>
                <td>
                  {member.is_user_active ? (
                    <span className="status-badge active">Active</span>
                  ) : (
                    <span className="status-badge pending">Pending</span>
                  )}
                </td>
                <td className="member-actions">
                  {!member.is_user_active && member.user === null && (
                    <button
                      className="btn-link"
                      onClick={() => handleResendInvite(member.id, member.email)}
                    >
                      Resend
                    </button>
                  )}
                  {!member.is_owner && (
                    <button
                      className="btn-link btn-danger"
                      onClick={() => handleDeleteMember(member)}
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {memberships.length === 0 && (
              <tr>
                <td colSpan={5} className="empty-row">
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="admin-pagination">
          <button
            className="pagination-button"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {page} of {totalPages}
          </span>
          <button
            className="pagination-button"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Memberships;
