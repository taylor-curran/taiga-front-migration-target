import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth.service';
import '../styles/pages/UserSettings.css';

const UserSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || '',
    bio: user?.bio || '',
    lang: user?.lang || 'en',
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const handleProfileChange = (e) => {
    setProfileForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordChange = (e) => {
    setPasswordForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage('');
    try {
      await authService.updateUserProfile(user.id, profileForm);
      setMessage('Profile updated successfully.');
    } catch (error) {
      console.error('Failed to update profile:', error);
      setMessage('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setMessage('Passwords do not match.');
      return;
    }
    setSaving(true);
    setMessage('');
    try {
      await authService.changePassword(
        passwordForm.current_password,
        passwordForm.new_password
      );
      setMessage('Password changed successfully.');
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      console.error('Failed to change password:', error);
      setMessage('Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="user-settings-page">
        <div className="empty-state">
          <h2>Not logged in</h2>
          <p>Please log in to access settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-settings-page">
      <header className="settings-header">
        <h1 className="settings-title">Account Settings</h1>
      </header>

      <div className="settings-tabs">
        <button
          className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Edit Profile
        </button>
        <button
          className={`settings-tab ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          Change Password
        </button>
        <button
          className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          Notification Settings
        </button>
      </div>

      {message && (
        <div className="settings-message">
          {message}
        </div>
      )}

      {activeTab === 'profile' && (
        <form className="settings-form" onSubmit={handleProfileSubmit}>
          <div className="form-field">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="full_name"
              className="form-input"
              value={profileForm.full_name}
              onChange={handleProfileChange}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Bio</label>
            <textarea
              name="bio"
              className="form-textarea"
              value={profileForm.bio}
              onChange={handleProfileChange}
              rows={4}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Language</label>
            <select
              name="lang"
              className="form-select"
              value={profileForm.lang}
              onChange={handleProfileChange}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="ja">Japanese</option>
            </select>
          </div>
          <button type="submit" className="form-submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}

      {activeTab === 'password' && (
        <form className="settings-form" onSubmit={handlePasswordSubmit}>
          <div className="form-field">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              name="current_password"
              className="form-input"
              value={passwordForm.current_password}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="form-field">
            <label className="form-label">New Password</label>
            <input
              type="password"
              name="new_password"
              className="form-input"
              value={passwordForm.new_password}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              name="confirm_password"
              className="form-input"
              value={passwordForm.confirm_password}
              onChange={handlePasswordChange}
            />
          </div>
          <button type="submit" className="form-submit" disabled={saving}>
            {saving ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      )}

      {activeTab === 'notifications' && (
        <div className="settings-section">
          <p className="settings-info">
            Notification preferences will be available in a future update.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserSettings;
