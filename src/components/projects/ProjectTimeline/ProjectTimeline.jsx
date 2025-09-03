import './ProjectTimeline.css';

const ProjectTimeline = ({ timeline }) => {
  if (!timeline || timeline.length === 0) {
    return (
      <section className="project-timeline">
        <h2 className="timeline-title">Recent Activity</h2>
        <p className="no-activity">No recent activity found.</p>
      </section>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString();
  };

  const getActivityIcon = (eventType) => {
    if (eventType.includes('issue')) return '🐛';
    if (eventType.includes('userstory')) return '📋';
    if (eventType.includes('task')) return '✅';
    if (eventType.includes('wiki')) return '📖';
    return '📝';
  };

  return (
    <section className="project-timeline">
      <h2 className="timeline-title">Recent Activity</h2>
      <div className="timeline-list">
        {timeline.slice(0, 10).map((item) => (
          <div key={item.id} className="timeline-item">
            <span className="activity-icon">{getActivityIcon(item.event_type)}</span>
            <div className="activity-content">
              <div className="activity-user">{item.data.user.name}</div>
              <div className="activity-description">
                {item.event_type.includes('create') ? 'created' : 'updated'} {item.data.issue?.subject || item.data.userstory?.subject || 'an item'}
              </div>
              <div className="activity-date">{formatDate(item.created)}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectTimeline;
