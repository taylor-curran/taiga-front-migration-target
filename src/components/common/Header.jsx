import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LanguageSelector from './LanguageSelector';
import Notifications from '../Notifications';
import Search from '../Search';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();

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
          </nav>
        </div>
        <div className="header-right">
          <Search />
          <LanguageSelector />
          {isAuthenticated ? (
            <>
              <Notifications />
              <Link to="/profile" className="user-name">
                {user?.full_name_display || user?.username || 'User'}
              </Link>
              <Link to="/user-settings" className="settings-link">Settings</Link>
              <button className="logout-button" onClick={logout}>Logout</button>
            </>
          ) : (
            <span className="user-name">Guest</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
