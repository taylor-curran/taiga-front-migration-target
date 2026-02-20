const MembersList = ({ members, loading }) => {
  if (loading) {
    return <div className="members-list-loading">Loading members...</div>;
  }

  if (!members || members.length === 0) {
    return (
      <div className="members-list-empty">
        <p>No members found.</p>
      </div>
    );
  }

  return (
    <div className="members-list">
      <h3 className="members-list-title">Project Members</h3>
      <div className="members-table">
        <div className="members-table-header">
          <span className="member-col-name">Name</span>
          <span className="member-col-role">Role</span>
          <span className="member-col-email">Email</span>
        </div>
        {members.map((member) => (
          <div key={member.id || member.user} className="members-table-row">
            <div className="member-col-name">
              <img
                src={member.photo || '/default-avatar.png'}
                alt={member.full_name}
                className="member-avatar"
              />
              <span>{member.full_name || member.username}</span>
            </div>
            <span className="member-col-role">{member.role_name}</span>
            <span className="member-col-email">{member.email || '-'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembersList;
