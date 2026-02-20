import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getUserByUsername,
  getUserStats,
  getUserTimeline,
  getUserProjects,
  getUserLikedProjects,
  getUserWatchedProjects,
  getUserContacts
} from '../services/user.service';
import ProjectCard from '../components/common/ProjectCard';
import '../styles/pages/UserProfile.css';

const TABS = [
  { id: 'activity', label: 'Activity', icon: '📋' },
  { id: 'projects', label: 'Projects', icon: '📁' },
  { id: 'likes', label: 'Likes', icon: '❤️' },
  { id: 'watched', label: 'Watched', icon: '👁️' },
  { id: 'contacts', label: 'Contacts', icon: '👥' }
];

const UserProfile = () => {
  const { slug } = useParams();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('activity');
  const [loading, setLoading] = useState(true);
  const [tabData, setTabData] = useState({
    activity: { items: [], loading: false, loaded: false },
    projects: { items: [], loading: false, loaded: false },
    likes: { items: [], loading: false, loaded: false },
    watched: { items: [], loading: false, loaded: false },
    contacts: { items: [], loading: false, loaded: false }
  });

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      const userData = await getUserByUsername(slug);
      if (userData) {
        setUser(userData);
        const userStats = await getUserStats(userData.id);
        setStats(userStats);
      }
      setLoading(false);
    };
    if (slug) {
      loadUser();
    }
  }, [slug]);

  const loadTabData = useCallback(async (tabId) => {
    if (!user || tabData[tabId].loaded) return;

    setTabData(prev => ({
      ...prev,
      [tabId]: { ...prev[tabId], loading: true }
    }));

    let items = [];
    switch (tabId) {
      case 'activity': {
        const timeline = await getUserTimeline(user.id);
        items = timeline.items;
        break;
      }
      case 'projects':
        items = await getUserProjects(user.id);
        break;
      case 'likes':
        items = await getUserLikedProjects(user.id);
        break;
      case 'watched':
        items = await getUserWatchedProjects(user.id);
        break;
      case 'contacts':
        items = await getUserContacts(user.id);
        break;
    }

    setTabData(prev => ({
      ...prev,
      [tabId]: { items, loading: false, loaded: true }
    }));
  }, [user, tabData]);

  useEffect(() => {
    if (user) {
      loadTabData(activeTab);
    }
  }, [activeTab, user, loadTabData]);

  const formatTimelineEvent = (event) => {
    const data = event.data || {};
    const created = new Date(event.created).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    return {
      id: event.id,
      description: data.values_diff
        ? `Updated ${data.values_diff.length || 1} field(s)`
        : event.event_type?.replace(/\./g, ' ') || 'Activity',
      project: data.project?.name || '',
      date: created
    };
  };

  if (loading) {
    return (
      <div className="user-profile-page">
        <div className="profile-loading">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-profile-page">
        <div className="profile-not-found">
          <h2>User not found</h2>
          <p>The user &quot;{slug}&quot; could not be found.</p>
          <Link to="/">Go back to home</Link>
        </div>
      </div>
    );
  }

  const currentTabData = tabData[activeTab];

  return (
    <div className="user-profile-page">
      <div className="profile-container">
        <aside className="profile-bar">
          <div className="profile-image-wrapper">
            <img
              className="profile-img"
              src={user.big_photo || user.photo || '/default-avatar.png'}
              alt={user.full_name_display}
            />
          </div>

          <div className="profile-data">
            <h1 className={!user.full_name ? 'not-full-name' : ''}>
              {user.full_name_display}
            </h1>
            <div className="username">@{user.username}</div>
            {stats?.roles && stats.roles.length > 0 && (
              <h2>{stats.roles.join(', ')}</h2>
            )}
          </div>

          {stats && (
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-number">{stats.total_num_projects || 0}</span>
                <span className="stat-name">Projects</span>
              </div>
              <div className="stat">
                <span className="stat-number">{stats.total_num_closed_userstories || 0}</span>
                <span className="stat-name">Closed US</span>
              </div>
              <div className="stat">
                <span className="stat-number">{stats.total_num_contacts || 0}</span>
                <span className="stat-name">Contacts</span>
              </div>
            </div>
          )}

          {user.bio && (
            <div className="profile-quote">
              <span>{user.bio.length > 210 ? user.bio.substring(0, 210) + '...' : user.bio}</span>
            </div>
          )}
        </aside>

        <div className="profile-main">
          <nav className="profile-content-tabs">
            {TABS.map(tab => (
              <a
                key={tab.id}
                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                title={tab.label}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span>{tab.label}</span>
              </a>
            ))}
          </nav>

          <div className="tab-content">
            {currentTabData.loading ? (
              <div className="tab-loading">Loading...</div>
            ) : activeTab === 'activity' ? (
              <div className="profile-activity">
                {currentTabData.items.length === 0 ? (
                  <div className="empty-tab">
                    <p>No recent activity to show.</p>
                  </div>
                ) : (
                  <div className="timeline">
                    {currentTabData.items.map(event => {
                      const formatted = formatTimelineEvent(event);
                      return (
                        <div key={formatted.id} className="timeline-entry">
                          <div className="timeline-date">{formatted.date}</div>
                          <div className="timeline-body">
                            <p className="timeline-description">{formatted.description}</p>
                            {formatted.project && (
                              <span className="timeline-project">{formatted.project}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : activeTab === 'projects' ? (
              <div className="profile-projects">
                {currentTabData.items.length === 0 ? (
                  <div className="empty-tab">
                    <p>No projects to show for {user.full_name_display}.</p>
                  </div>
                ) : (
                  <div className="projects-list">
                    {currentTabData.items.map(project => (
                      <div key={project.id} className="profile-project-item">
                        <ProjectCard project={project} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : activeTab === 'likes' ? (
              <div className="profile-likes">
                {currentTabData.items.length === 0 ? (
                  <div className="empty-tab">
                    <p>No liked projects yet.</p>
                  </div>
                ) : (
                  <div className="projects-list">
                    {currentTabData.items.map(project => (
                      <div key={project.id} className="profile-project-item">
                        <ProjectCard project={project} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : activeTab === 'watched' ? (
              <div className="profile-watched">
                {currentTabData.items.length === 0 ? (
                  <div className="empty-tab">
                    <p>No watched projects yet.</p>
                  </div>
                ) : (
                  <div className="projects-list">
                    {currentTabData.items.map(project => (
                      <div key={project.id} className="profile-project-item">
                        <ProjectCard project={project} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : activeTab === 'contacts' ? (
              <div className="profile-contacts">
                {currentTabData.items.length === 0 ? (
                  <div className="empty-tab">
                    <p>No contacts to show for {user.full_name_display}.</p>
                  </div>
                ) : (
                  <div className="contacts-list">
                    {currentTabData.items.map(contact => (
                      <div key={contact.id} className="contact-item">
                        <Link
                          to={`/profile/${contact.username}`}
                          className="contact-avatar"
                          title={contact.full_name_display}
                        >
                          <img
                            src={contact.photo || '/default-avatar.png'}
                            alt={contact.full_name_display}
                          />
                        </Link>
                        <div className="contact-data">
                          <h3>
                            <Link to={`/profile/${contact.username}`}>
                              {contact.full_name_display}
                            </Link>
                          </h3>
                          {contact.roles && <p className="contact-roles">{contact.roles.join(', ')}</p>}
                          {contact.bio && <p className="contact-bio">{contact.bio}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        <aside className="profile-sidebar">
          <div className="sidebar-content">
            <h4>Profile Information</h4>
            <p>View activity, projects, and contacts for this user.</p>
            <Link to="/user-settings" className="btn-edit-profile">
              Edit Profile
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default UserProfile;
