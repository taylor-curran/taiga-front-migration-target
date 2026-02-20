import { Link } from 'react-router-dom';

const WikiNavigation = ({ projectSlug, wikiLinks = [], currentSlug }) => {
  return (
    <aside className="wiki-nav">
      <header>
        <h3 className="wiki-nav-title">Wiki</h3>
      </header>
      <ul className="wiki-link-container">
        <li className={`wiki-link fixed-link ${!currentSlug || currentSlug === 'home' ? 'active' : ''}`}>
          <Link
            to={`/project/${projectSlug}/wiki`}
            className="link-title"
          >
            Home
          </Link>
        </li>
      </ul>
      {wikiLinks.length > 0 && (
        <ul className="wiki-link-container">
          {wikiLinks.map((link) => (
            <li
              key={link.id || link.href}
              className={`wiki-link ${currentSlug === link.href ? 'active' : ''}`}
            >
              <Link
                to={`/project/${projectSlug}/wiki/${link.href}`}
                className="link-title"
                title={link.title}
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <ul className="wiki-link-container wiki-all-links">
        <li className="wiki-link fixed-link">
          <Link
            to={`/project/${projectSlug}/wiki-list`}
            className="link-title secondary"
          >
            All pages
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default WikiNavigation;
