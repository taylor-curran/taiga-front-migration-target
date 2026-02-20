import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LanguageSelector from './LanguageSelector';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
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
          </nav>
        </div>
        <div className="header-right">
          <LanguageSelector />
          {isAuthenticated ? (
            <>
              <span className="user-name">{user?.full_name || user?.username}</span>
              <button className="header-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="header-btn">Login</Link>
              <Link to="/register" className="header-btn header-btn-primary">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
