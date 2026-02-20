import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/UserSettings.css';

const UserSettings = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');

  if (!isAuthenticated) {
    return (
      <div className="settings-page">
        <div className="settings-login-required">
          <h2>Login Required</h2>
          <p>You need to be logged in to access your settings.</p>
        </div>
      </div>
    );
  }

  const sections = [
    { key: 'profile', label: 'Edit Profile' },
    { key: 'account', label: 'Account Settings' },
    { key: 'notifications', label: 'Email Notifications' },
    { key: 'password', label: 'Change Password' },
  ];

  return (
    <div className="settings-page">
      <div className="settings-layout">
        <aside className="settings-nav">
          <h2 className="settings-nav-title">Settings</h2>
          <ul className="settings-menu">
            {sections.map((section) => (
              <li key={section.key}>
                <button
                  className={`settings-menu-item ${activeSection === section.key ? 'active' : ''}`}
                  onClick={() => setActiveSection(section.key)}
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="settings-content">
          {activeSection === 'profile' && (
            <section className="settings-section">
              <h2>Edit Profile</h2>
              <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <label htmlFor="fullname">Full name</label>
                  <input
                    id="fullname"
                    type="text"
                    defaultValue={user?.full_name || ''}
                    placeholder="Your full name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    defaultValue={user?.bio || ''}
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    defaultValue={user?.email || ''}
                    placeholder="your@email.com"
                  />
                </div>
                <button type="submit" className="btn-primary">Save changes</button>
              </form>
            </section>
          )}

          {activeSection === 'account' && (
            <section className="settings-section">
              <h2>Account Settings</h2>
              <div className="form-group">
                <label>Username</label>
                <p className="settings-value">{user?.username || '-'}</p>
              </div>
              <div className="form-group">
                <label>Language</label>
                <select defaultValue={user?.lang || 'en'}>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              <div className="danger-zone">
                <h3>Danger Zone</h3>
                <p>Permanently delete your account and all associated data.</p>
                <button className="btn-danger" disabled>Delete Account</button>
              </div>
            </section>
          )}

          {activeSection === 'notifications' && (
            <section className="settings-section">
              <h2>Email Notifications</h2>
              <div className="notification-settings">
                <label className="notification-toggle">
                  <input type="checkbox" defaultChecked />
                  <span>Notify me when I am assigned to an item</span>
                </label>
                <label className="notification-toggle">
                  <input type="checkbox" defaultChecked />
                  <span>Notify me when I am mentioned</span>
                </label>
                <label className="notification-toggle">
                  <input type="checkbox" defaultChecked />
                  <span>Notify me when someone comments on my items</span>
                </label>
                <label className="notification-toggle">
                  <input type="checkbox" />
                  <span>Notify me about all project activity</span>
                </label>
              </div>
            </section>
          )}

          {activeSection === 'password' && (
            <section className="settings-section">
              <h2>Change Password</h2>
              <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <label htmlFor="current-password">Current Password</label>
                  <input id="current-password" type="password" placeholder="Current password" />
                </div>
                <div className="form-group">
                  <label htmlFor="new-password">New Password</label>
                  <input id="new-password" type="password" placeholder="New password" />
                </div>
                <div className="form-group">
                  <label htmlFor="confirm-password">Confirm New Password</label>
                  <input id="confirm-password" type="password" placeholder="Confirm new password" />
                </div>
                <button type="submit" className="btn-primary">Update Password</button>
              </form>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserSettings;
