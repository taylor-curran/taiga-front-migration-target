import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  fetchProjectBySlug,
  fetchProjectMembers,
  fetchProjectRoles,
  inviteMember,
  updateMembership,
  removeMembership,
  resendInvitation
} from '../services/api';
import '../styles/pages/ProjectMembers.css';

const ProjectMembers = () => {
  const { slug } = useParams();
  
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role_id: '',
  });
  const [inviting, setInviting] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const projectData = await fetchProjectBySlug(slug);
        setProject(projectData);
        
        const [membersData, rolesData] = await Promise.all([
          fetchProjectMembers(projectData.id),
          fetchProjectRoles(projectData.id)
        ]);
        
        setMembers(membersData);
        setRoles(rolesData);
        
        if (rolesData.length > 0) {
          setInviteForm(prev => ({ ...prev, role_id: rolesData[0].id }));
        }
      } catch (err) {
        setError('Failed to load project members');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  const handleInviteChange = (e) => {
    const { name, value } = e.target;
    setInviteForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    
    if (!inviteForm.email.trim() || !inviteForm.role_id) {
      return;
    }

    try {
      setInviting(true);
      await inviteMember(project.id, {
        email: inviteForm.email,
        role: inviteForm.role_id
      });
      
      const updatedMembers = await fetchProjectMembers(project.id);
      setMembers(updatedMembers);
      
      setInviteForm({ email: '', role_id: roles[0]?.id || '' });
      setShowAddMemberModal(false);
      showMessage('Invitation sent successfully');
    } catch (err) {
      console.error('Failed to invite member:', err);
      showMessage('Failed to send invitation', true);
    } finally {
      setInviting(false);
    }
  };

  const handleRoleChange = async (membershipId, newRoleId) => {
    try {
      await updateMembership(membershipId, { role: newRoleId });
      
      setMembers(prev => prev.map(member => 
        member.id === membershipId 
          ? { ...member, role: newRoleId }
          : member
      ));
      
      showMessage('Role updated successfully');
    } catch (err) {
      console.error('Failed to update role:', err);
      showMessage('Failed to update role', true);
    }
  };

  const handleAdminToggle = async (membershipId, isAdmin) => {
    try {
      await updateMembership(membershipId, { is_admin: isAdmin });
      
      setMembers(prev => prev.map(member => 
        member.id === membershipId 
          ? { ...member, is_admin: isAdmin }
          : member
      ));
      
      showMessage('Admin status updated');
    } catch (err) {
      console.error('Failed to update admin status:', err);
      showMessage('Failed to update admin status', true);
    }
  };

  const handleRemoveMember = async (membershipId, memberName) => {
    if (!window.confirm(`Are you sure you want to remove ${memberName} from the project?`)) {
      return;
    }

    try {
      await removeMembership(membershipId);
      setMembers(prev => prev.filter(member => member.id !== membershipId));
      showMessage('Member removed successfully');
    } catch (err) {
      console.error('Failed to remove member:', err);
      showMessage('Failed to remove member', true);
    }
  };

  const handleResendInvitation = async (membershipId, email) => {
    try {
      await resendInvitation(membershipId);
      showMessage(`Invitation resent to ${email}`);
    } catch (err) {
      console.error('Failed to resend invitation:', err);
      showMessage('Failed to resend invitation', true);
    }
  };

  const showMessage = (message, isError = false) => {
    setActionMessage({ text: message, isError });
    setTimeout(() => setActionMessage(null), 3000);
  };

  const getAvatarUrl = (member) => {
    if (member.user?.photo) {
      return member.user.photo;
    }
    return '/default-avatar.png';
  };

  const getMemberName = (member) => {
    if (member.full_name) {
      return member.full_name;
    }
    if (member.user?.full_name) {
      return member.user.full_name;
    }
    return member.email || 'Unknown';
  };

  if (loading) {
    return (
      <div className="project-members-page">
        <div className="loading">Loading members...</div>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="project-members-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  const activeMembers = members.filter(m => m.user !== null || m.is_user_active);
  const pendingMembers = members.filter(m => m.user === null && !m.is_user_active);

  return (
    <div className="project-members-page">
      <div className="settings-nav">
        <Link to={`/project/${slug}/settings`} className="nav-item">
          Project Details
        </Link>
        <Link to={`/project/${slug}/settings/members`} className="nav-item active">
          Members
        </Link>
      </div>

      <section className="main admin-membership">
        <div className="header-with-actions">
          <header>
            <h1>Members</h1>
            <p className="member-count">
              {members.length} {members.length === 1 ? 'member' : 'members'}
            </p>
          </header>

          <div className="action-buttons">
            <button
              className="btn-primary"
              onClick={() => setShowAddMemberModal(true)}
            >
              Add members
            </button>
          </div>
        </div>

        {actionMessage && (
          <div className={`action-message ${actionMessage.isError ? 'error' : 'success'}`}>
            {actionMessage.text}
          </div>
        )}

        <div className="members-table">
          <div className="table-header">
            <div className="col-avatar">Member</div>
            <div className="col-email">Email</div>
            <div className="col-role">Role</div>
            <div className="col-admin">Admin</div>
            <div className="col-actions">Actions</div>
          </div>

          {activeMembers.map(member => (
            <div key={member.id} className="member-row">
              <div className="col-avatar">
                <img 
                  src={getAvatarUrl(member)} 
                  alt={getMemberName(member)}
                  className="member-avatar"
                />
                <div className="member-info">
                  <span className="member-name">{getMemberName(member)}</span>
                  {member.is_owner && <span className="owner-badge">Owner</span>}
                </div>
              </div>
              
              <div className="col-email">
                {member.user_email || member.email}
              </div>
              
              <div className="col-role">
                <select
                  value={member.role}
                  onChange={(e) => handleRoleChange(member.id, parseInt(e.target.value))}
                  disabled={member.is_owner}
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="col-admin">
                {!member.is_owner && (
                  <input
                    type="checkbox"
                    checked={member.is_admin}
                    onChange={(e) => handleAdminToggle(member.id, e.target.checked)}
                  />
                )}
              </div>
              
              <div className="col-actions">
                {!member.is_owner && (
                  <button
                    className="btn-delete"
                    onClick={() => handleRemoveMember(member.id, getMemberName(member))}
                    title="Remove member"
                  >
                    <svg viewBox="0 0 24 24" className="icon-trash">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}

          {pendingMembers.length > 0 && (
            <>
              <div className="pending-header">
                <h3>Pending Invitations</h3>
              </div>
              {pendingMembers.map(member => (
                <div key={member.id} className="member-row pending">
                  <div className="col-avatar">
                    <div className="member-avatar pending-avatar">
                      <svg viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                      </svg>
                    </div>
                    <div className="member-info">
                      <span className="member-name pending-text">Pending</span>
                    </div>
                  </div>
                  
                  <div className="col-email">
                    {member.email}
                  </div>
                  
                  <div className="col-role">
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, parseInt(e.target.value))}
                    >
                      {roles.map(role => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-admin">
                    <input
                      type="checkbox"
                      checked={member.is_admin}
                      onChange={(e) => handleAdminToggle(member.id, e.target.checked)}
                    />
                  </div>
                  
                  <div className="col-actions">
                    <button
                      className="btn-resend"
                      onClick={() => handleResendInvitation(member.id, member.email)}
                      title="Resend invitation"
                    >
                      Resend
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleRemoveMember(member.id, member.email)}
                      title="Cancel invitation"
                    >
                      <svg viewBox="0 0 24 24" className="icon-trash">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </section>

      {showAddMemberModal && (
        <div className="lightbox-overlay">
          <div className="lightbox lightbox-add-member">
            <h2>Add members</h2>
            <form onSubmit={handleInviteSubmit}>
              <fieldset>
                <label htmlFor="invite-email">Email address</label>
                <input
                  type="email"
                  id="invite-email"
                  name="email"
                  placeholder="Enter email address"
                  value={inviteForm.email}
                  onChange={handleInviteChange}
                  required
                />
              </fieldset>

              <fieldset>
                <label htmlFor="invite-role">Role</label>
                <select
                  id="invite-role"
                  name="role_id"
                  value={inviteForm.role_id}
                  onChange={handleInviteChange}
                  required
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </fieldset>

              <div className="lightbox-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowAddMemberModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={inviting}
                >
                  {inviting ? 'Sending...' : 'Send invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectMembers;
