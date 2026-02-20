import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LanguageSelector from './LanguageSelector';

const Header = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      await login(loginData.username, loginData.password);
      setShowLoginForm(false);
      setLoginData({ username: '', password: '' });
    } catch (err) {
      setLoginError('Invalid username or password');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo">
            <h1>Taiga</h1>
          </Link>
          <nav className="nav-links">
            <Link to="/projects">Projects</Link>
            <Link to="/discover">Discover</Link>
            {isAuthenticated && (
              <Link to="/notifications">Notifications</Link>
            )}
          </nav>
        </div>
        <div className="header-right">
          <LanguageSelector />
          {isAuthenticated ? (
            <div className="user-menu">
              <Link to={`/profile/${user?.username}`} className="user-name">
                {user?.full_name_display || user?.username || 'User'}
              </Link>
              <Link to="/user-settings" className="settings-link" title="Settings">
                Settings
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-section">
              {showLoginForm ? (
                <form className="header-login-form" onSubmit={handleLogin}>
                  <input
                    type="text"
                    placeholder="Username"
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  />
                  <button type="submit" className="login-submit-btn" disabled={loginLoading}>
                    {loginLoading ? '...' : 'Login'}
                  </button>
                  <button type="button" className="login-cancel-btn" onClick={() => setShowLoginForm(false)}>
                    Cancel
                  </button>
                  {loginError && <span className="login-error">{loginError}</span>}
                </form>
              ) : (
                <button className="login-btn" onClick={() => setShowLoginForm(true)}>
                  Login
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
