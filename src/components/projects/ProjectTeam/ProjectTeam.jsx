import './ProjectTeam.css';

const ProjectTeam = ({ project }) => {
  if (!project?.members || project.members.length === 0) {
    return (
      <section className="project-team">
        <h2 className="team-title">Team</h2>
        <p className="no-members">No team members found.</p>
      </section>
    );
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section className="project-team">
      <h2 className="team-title">Team</h2>
      <div className="team-grid">
        {project.members.map((member) => (
          <div key={member.id} className="team-member">
            <div className="member-avatar">
              {member.photo ? (
                <img src={member.photo} alt={member.full_name_display} />
              ) : (
                <div className="avatar-initials">
                  {getInitials(member.full_name_display)}
                </div>
              )}
              {member.id === project.owner?.id && (
                <span className="owner-badge" title="Owner">👑</span>
              )}
            </div>
            <span className="member-name">{member.full_name_display}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectTeam;
