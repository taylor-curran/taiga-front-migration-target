import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import '../styles/pages/UserProfile.css';

const UserProfile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('activity');
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [contacts, setContacts] = useState([]);

  const isCurrentUser = currentUser && profileUser &&
    currentUser.username === profileUser.username;

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/users`, {
          params: { username }
        });
        const users = response.data;
        if (Array.isArray(users) && users.length > 0) {
          setProfileUser(users[0]);
          const userId = users[0].id;
          const [statsRes, projectsRes, contactsRes] = await Promise.all([
            api.get(`/users/${userId}/stats`).catch(() => ({ data: null })),
            api.get(`/projects`, {
              params: { member: userId, page_size: 10 }
            }).catch(() => ({ data: [] })),
            api.get(`/users/${userId}/contacts`).catch(() => ({ data: [] })),
          ]);
          setStats(statsRes.data);
          setProjects(projectsRes.data || []);
          setContacts(contactsRes.data || []);
        }
      } catch (err) {
        console.error('Failed to load user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      loadProfile();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-container">Loading profile...</div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="profile-page">
        <div className="empty-state">
          <h2>User not found</h2>
          <p>The user &quot;{username}&quot; does not exist.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'activity', label: 'Activity', icon: 'timeline' },
    { key: 'projects', label: 'Projects', icon: 'project' },
    { key: 'likes', label: 'Likes', icon: 'like' },
    { key: 'watched', label: 'Watched', icon: 'watch' },
    { key: 'contacts', label: 'Contacts', icon: 'team' },
  ];

  return (
    <div className="profile-page">
      <div className="profile-bar">
        <div className="profile-avatar">
          <img
            src={profileUser.photo || profileUser.big_photo || '/default-avatar.png'}
            alt={profileUser.full_name_display || profileUser.username}
          />
        </div>
        <div className="profile-info">
          <h1 className="profile-name">
            {profileUser.full_name_display || profileUser.username}
          </h1>
          <p className="profile-username">@{profileUser.username}</p>
          {profileUser.bio && (
            <p className="profile-bio">{profileUser.bio}</p>
          )}
        </div>
        {stats && (
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">{stats.total_num_projects || 0}</span>
              <span className="stat-label">Projects</span>
            </div>
            <div className="stat">
              <span className="stat-value">{stats.total_num_contacts || 0}</span>
              <span className="stat-label">Contacts</span>
            </div>
          </div>
        )}
      </div>

      <div className="profile-main">
        <div className="profile-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`profile-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="profile-tab-content">
          {activeTab === 'activity' && (
            <div className="tab-panel">
              <p className="tab-placeholder">Activity timeline for {profileUser.full_name_display || profileUser.username}</p>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="tab-panel">
              {projects.length === 0 ? (
                <p className="tab-empty">No projects to show</p>
              ) : (
                <div className="profile-projects-list">
                  {projects.map((project) => (
                    <div key={project.id} className="profile-project-item">
                      <img
                        src={project.logo_small_url || '/default-project-logo.png'}
                        alt={project.name}
                        className="project-logo"
                      />
                      <div className="project-info">
                        <h3>{project.name}</h3>
                        <p>{project.description?.substring(0, 100)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'likes' && (
            <div className="tab-panel">
              <p className="tab-placeholder">Liked projects will appear here</p>
            </div>
          )}

          {activeTab === 'watched' && (
            <div className="tab-panel">
              <p className="tab-placeholder">Watched items will appear here</p>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="tab-panel">
              {contacts.length === 0 ? (
                <p className="tab-empty">No contacts to show</p>
              ) : (
                <div className="profile-contacts-list">
                  {contacts.map((contact) => (
                    <div key={contact.id} className="contact-item">
                      <img
                        src={contact.photo || '/default-avatar.png'}
                        alt={contact.full_name_display || contact.username}
                        className="contact-avatar"
                      />
                      <div className="contact-info">
                        <span className="contact-name">
                          {contact.full_name_display || contact.username}
                        </span>
                        <span className="contact-username">@{contact.username}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
