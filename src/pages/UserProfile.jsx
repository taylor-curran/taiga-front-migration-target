import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/UserProfile.css';

const UserProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const targetId = userId || (currentUser && currentUser.id);
        if (!targetId) {
          setLoading(false);
          return;
        }
        const [profileResponse, projectsResponse] = await Promise.all([
          api.get(`/users/${targetId}`),
          api.get(`/users/${targetId}/contacts`).catch(() => ({ data: [] })),
        ]);
        setProfile(profileResponse.data);
        setProjects(Array.isArray(projectsResponse.data) ? projectsResponse.data : []);
      } catch (error) {
        console.error('Failed to load user profile:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [userId, currentUser]);

  if (loading) {
    return (
      <div className="user-profile-page">
        <div className="loading-container">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="user-profile-page">
        <div className="empty-state">
          <h2>Profile not found</h2>
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <img
            src={profile.photo || '/default-avatar.png'}
            alt={profile.full_name_display}
            className="avatar-image"
          />
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{profile.full_name_display}</h1>
          <p className="profile-username">@{profile.username}</p>
          {profile.bio && <p className="profile-bio">{profile.bio}</p>}
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-value">{profile.total_fans || 0}</span>
          <span className="stat-label">Fans</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{projects.length}</span>
          <span className="stat-label">Contacts</span>
        </div>
      </div>

      {profile.roles && profile.roles.length > 0 && (
        <div className="profile-roles">
          <h3>Roles</h3>
          <div className="roles-list">
            {profile.roles.map((role) => (
              <span key={role} className="role-tag">{role}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
