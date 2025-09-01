import { Link } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';

const Header = () => {
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
          <span className="user-name">Demo User</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
