import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  getCurrentUser,
  updateUserProfile,
  changePassword,
  changeAvatar,
  removeAvatar,
  getNotifyPolicies,
  updateNotifyPolicy
} from '../services/user.service';
import { fetchLocales } from '../services/api';
import '../styles/pages/UserSettings.css';

const SETTINGS_SECTIONS = [
  { id: 'profile', label: 'Edit Profile' },
  { id: 'change-password', label: 'Change Password' },
  { id: 'notifications', label: 'Email Notifications' }
];

const AVAILABLE_THEMES = ['taiga', 'material-design', 'high-contrast'];

const UserSettings = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [locales, setLocales] = useState([]);

  const [profileForm, setProfileForm] = useState({
    username: '',
    email: '',
    full_name: '',
    bio: '',
    lang: '',
    theme: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifyPolicies, setNotifyPolicies] = useState([]);

  const loadUserData = useCallback(async () => {
    setLoading(true);
    const userData = await getCurrentUser();
    if (userData) {
      setUser(userData);
      setProfileForm({
        username: userData.username || '',
        email: userData.email || '',
        full_name: userData.full_name || '',
        bio: userData.bio || '',
        lang: userData.lang || '',
        theme: userData.theme || ''
      });
    }

    const localesData = await fetchLocales();
    setLocales(localesData);

    const policies = await getNotifyPolicies();
    setNotifyPolicies(policies);

    setLoading(false);
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleProfileChange = (field, value) => {
    setProfileForm(prev => ({ ...prev, [field]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const updated = await updateUserProfile(user.id, profileForm);
      setUser(updated);
      showMessage('success', 'Profile updated successfully.');
    } catch (error) {
      const errorMsg = error.response?.data?._error_message || 'Failed to update profile.';
      showMessage('error', errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage('error', 'New passwords do not match.');
      return;
    }
    if (!passwordForm.newPassword) {
      showMessage('error', 'Please enter a new password.');
      return;
    }

    setSaving(true);
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showMessage('success', 'Password changed successfully.');
    } catch (error) {
      const errorMsg = error.response?.data?._error_message || 'Failed to change password.';
      showMessage('error', errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving(true);
    try {
      await changeAvatar(file);
      await loadUserData();
      showMessage('success', 'Avatar updated successfully.');
    } catch (error) {
      showMessage('error', 'Failed to update avatar.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setSaving(true);
    try {
      await removeAvatar();
      await loadUserData();
      showMessage('success', 'Avatar removed.');
    } catch (error) {
      showMessage('error', 'Failed to remove avatar.');
    } finally {
      setSaving(false);
    }
  };

  const handleNotifyPolicyChange = async (policyId, field, value) => {
    const policy = notifyPolicies.find(p => p.id === policyId);
    if (!policy) return;

    try {
      const updated = await updateNotifyPolicy(policyId, { ...policy, [field]: value });
      setNotifyPolicies(prev =>
        prev.map(p => (p.id === policyId ? updated : p))
      );
    } catch (error) {
      showMessage('error', 'Failed to update notification settings.');
    }
  };

  const handleExportProfile = async () => {
    if (!user) return;
    const dataStr = JSON.stringify(user, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${user.username}-profile.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="user-settings-page">
        <div className="settings-loading">Loading settings...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-settings-page">
        <div className="settings-not-found">
          <h2>Unable to load settings</h2>
          <p>Please log in to access your settings.</p>
          <Link to="/">Go back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="user-settings-page">
      <div className="settings-container">
        <aside className="settings-nav">
          <nav className="admin-menu">
            <ul>
              {SETTINGS_SECTIONS.map(section => (
                <li key={section.id}>
                  <a
                    className={activeSection === section.id ? 'active' : ''}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <span className="title">{section.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <section className="settings-main">
          {message.text && (
            <div className={`settings-message ${message.type}`}>
              {message.text}
            </div>
          )}

          {activeSection === 'profile' && (
            <div className="settings-section user-profile-settings">
              <header>
                <h1>Edit Profile</h1>
              </header>

              <form onSubmit={handleProfileSubmit}>
                <div className="profile-details-image">
                  <fieldset className="image-container">
                    <img
                      className="avatar-image"
                      src={user.big_photo || user.photo || '/default-avatar.png'}
                      alt="avatar"
                    />
                    <input
                      type="file"
                      id="avatar-field"
                      className="hidden-input"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </fieldset>

                  <button
                    type="button"
                    className="btn-small btn-change-avatar"
                    onClick={() => document.getElementById('avatar-field').click()}
                  >
                    Change Photo
                  </button>

                  <a
                    className="use-default-image"
                    onClick={handleRemoveAvatar}
                  >
                    Use Gravatar
                  </a>
                </div>

                <div className="profile-details-form">
                  <fieldset>
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      id="username"
                      autoCorrect="off"
                      autoCapitalize="none"
                      value={profileForm.username}
                      onChange={(e) => handleProfileChange('username', e.target.value)}
                      placeholder="Username"
                      maxLength={255}
                    />
                  </fieldset>

                  <fieldset>
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={profileForm.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      placeholder="Email"
                      maxLength={255}
                    />
                  </fieldset>

                  <fieldset>
                    <label htmlFor="full-name">Full Name</label>
                    <input
                      type="text"
                      id="full-name"
                      value={profileForm.full_name}
                      onChange={(e) => handleProfileChange('full_name', e.target.value)}
                      placeholder="Full name"
                      maxLength={256}
                    />
                  </fieldset>

                  <fieldset>
                    <label htmlFor="lang">Language</label>
                    <select
                      id="lang"
                      value={profileForm.lang}
                      onChange={(e) => handleProfileChange('lang', e.target.value)}
                    >
                      <option value="">Default</option>
                      {locales.map(locale => (
                        <option key={locale.code} value={locale.code}>
                          {locale.name}
                        </option>
                      ))}
                    </select>
                  </fieldset>

                  <fieldset>
                    <label htmlFor="theme">Theme</label>
                    <select
                      id="theme"
                      value={profileForm.theme}
                      onChange={(e) => handleProfileChange('theme', e.target.value)}
                    >
                      <option value="">Default</option>
                      {AVAILABLE_THEMES.map(theme => (
                        <option key={theme} value={theme}>
                          {theme}
                        </option>
                      ))}
                    </select>
                  </fieldset>

                  <fieldset>
                    <label htmlFor="bio">Bio</label>
                    <textarea
                      id="bio"
                      value={profileForm.bio}
                      onChange={(e) => handleProfileChange('bio', e.target.value)}
                      placeholder="Tell us about yourself..."
                      maxLength={210}
                    />
                  </fieldset>

                  <fieldset className="submit-fieldset">
                    <button
                      type="submit"
                      className="btn-small btn-save"
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  </fieldset>

                  <div className="profile-actions">
                    <a className="download-profile" onClick={handleExportProfile}>
                      Download profile data
                    </a>
                    <a className="delete-account">
                      Delete account
                    </a>
                  </div>
                </div>
              </form>
            </div>
          )}

          {activeSection === 'change-password' && (
            <div className="settings-section change-password-settings">
              <header>
                <h1>Change Password</h1>
              </header>

              <form onSubmit={handlePasswordSubmit}>
                <fieldset>
                  <label htmlFor="current-password">Current Password</label>
                  <input
                    type="password"
                    id="current-password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Current password"
                  />
                </fieldset>

                <fieldset>
                  <label htmlFor="new-password">New Password</label>
                  <input
                    type="password"
                    id="new-password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="New password"
                    required
                  />
                </fieldset>

                <fieldset>
                  <label htmlFor="retype-password">Retype New Password</label>
                  <input
                    type="password"
                    id="retype-password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Retype new password"
                    required
                  />
                </fieldset>

                <fieldset>
                  <button
                    type="submit"
                    className="btn-small btn-save"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </fieldset>
              </form>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="settings-section notification-settings">
              <header>
                <h1>Email Notifications</h1>
              </header>

              <p className="notifications-description">
                Manage your email notification preferences for each project.
              </p>

              {notifyPolicies.length === 0 ? (
                <div className="empty-notifications">
                  <p>No notification policies found. Join a project to manage notifications.</p>
                </div>
              ) : (
                <div className="notifications-table">
                  <div className="notifications-header">
                    <span className="notify-project-name">Project</span>
                    <span className="notify-option">Notifications</span>
                  </div>
                  {notifyPolicies.map(policy => (
                    <div key={policy.id} className="notifications-row">
                      <span className="notify-project-name">
                        {policy.project_name || `Project ${policy.project}`}
                      </span>
                      <span className="notify-option">
                        <select
                          value={policy.notify_level || 0}
                          onChange={(e) =>
                            handleNotifyPolicyChange(policy.id, 'notify_level', parseInt(e.target.value))
                          }
                        >
                          <option value={0}>Involved</option>
                          <option value={1}>All</option>
                          <option value={2}>None</option>
                        </select>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default UserSettings;
