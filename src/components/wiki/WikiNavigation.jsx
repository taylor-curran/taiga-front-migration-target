import { Link } from 'react-router-dom';

const WikiNavigation = ({ links, projectSlug, currentSlug }) => {
  if (!links || links.length === 0) {
    return null;
  }

  return (
    <nav className="wiki-navigation">
      <h3 className="wiki-nav-title">Wiki Pages</h3>
      <ul className="wiki-nav-list">
        {links.map((link) => (
          <li
            key={link.id}
            className={`wiki-nav-item ${link.href === currentSlug ? 'active' : ''}`}
          >
            <Link to={`/project/${projectSlug}/wiki/${link.href}`}>
              {link.title || link.href}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default WikiNavigation;
