const AdminMembers = ({ members = [] }) => {
  if (members.length === 0) {
    return (
      <div className="admin-members">
        <h2>Members</h2>
        <p className="admin-empty">No members data available.</p>
      </div>
    );
  }

  return (
    <div className="admin-members">
      <h2>Members</h2>
      <div className="members-table">
        <div className="members-header">
          <div className="member-avatar-col" />
          <div className="member-name-col">Name</div>
          <div className="member-role-col">Role</div>
          <div className="member-email-col">Email</div>
        </div>
        {members.map((member) => (
          <div key={member.id || member.user} className="member-row">
            <div className="member-avatar-col">
              <img
                src={member.photo || '/default-avatar.png'}
                alt={member.full_name || member.username || 'Member'}
                className="member-avatar"
              />
            </div>
            <div className="member-name-col">
              <span className="member-name">
                {member.full_name || member.username || 'Unknown'}
              </span>
            </div>
            <div className="member-role-col">
              <span className="member-role">{member.role_name || '-'}</span>
            </div>
            <div className="member-email-col">
              <span className="member-email">{member.email || '-'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMembers;
