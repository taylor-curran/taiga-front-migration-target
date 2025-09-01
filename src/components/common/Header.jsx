import { Link } from 'react-router-dom';

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
          </nav>
        </div>
        <div className="header-right">
          <span className="user-name">Demo User</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
