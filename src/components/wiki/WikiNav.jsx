import { Link } from 'react-router-dom';

const WikiNav = ({ wikiLinks = [], currentSlug, projectSlug }) => {
  return (
    <aside className="wiki-nav">
      <header>
        <h1 className="title">Wiki</h1>
      </header>

      <ul className="wiki-link-container">
        <li className="wiki-link fixed-link">
          <Link
            to={`/project/${projectSlug}/wiki/home`}
            className="link-title"
          >
            Home
          </Link>
        </li>
      </ul>

      <ul className="wiki-link-container sortable">
        {wikiLinks.map((link) => (
          <li
            key={link.id}
            className={`wiki-link${currentSlug === link.href ? ' active' : ''}`}
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

      {wikiLinks.length > 0 && (
        <ul className="wiki-link-container wiki-all-links">
          <li className="wiki-link fixed-link">
            <Link
              to={`/project/${projectSlug}/wiki`}
              className="link-title secondary"
            >
              All pages
            </Link>
          </li>
        </ul>
      )}
    </aside>
  );
};

export default WikiNav;
