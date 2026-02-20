import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { searchService } from '../services/search.service';

const Search = ({ projectId, projectSlug }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const performSearch = useCallback(async (searchText) => {
    if (!searchText.trim()) {
      setResults(null);
      return;
    }

    setLoading(true);
    try {
      let data;
      if (projectId) {
        data = await searchService.search(projectId, searchText);
      } else {
        data = await searchService.searchAcrossProjects(searchText);
      }
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      performSearch(value);
    }, 300);
    setSearchTimeout(timeout);
  };

  const renderResultSection = (title, items, type) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="search-result-section">
        <h4 className="search-section-title">
          {title} ({items.length})
        </h4>
        <ul className="search-result-list">
          {items.map((item) => {
            let linkTo = '#';
            const slug = projectSlug || item.project_extra_info?.slug;
            if (slug) {
              switch (type) {
                case 'userstories':
                  linkTo = `/project/${slug}/backlog`;
                  break;
                case 'issues':
                  linkTo = `/project/${slug}/issues`;
                  break;
                case 'tasks':
                  linkTo = `/project/${slug}/backlog`;
                  break;
                case 'epics':
                  linkTo = `/project/${slug}/epics`;
                  break;
                case 'wikipages':
                  linkTo = `/project/${slug}/wiki/${item.slug || 'home'}`;
                  break;
                default:
                  linkTo = `/project/${slug}`;
              }
            }

            return (
              <li key={item.id} className="search-result-item">
                <Link to={linkTo} className="search-result-link">
                  {item.ref && <span className="search-result-ref">#{item.ref}</span>}
                  <span className="search-result-subject">
                    {item.subject || item.slug || item.name}
                  </span>
                </Link>
                {item.status_extra_info && (
                  <span
                    className="search-result-status"
                    style={{ color: item.status_extra_info.color }}
                  >
                    {item.status_extra_info.name}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const totalResults = results
    ? (results.userstories?.length || 0) +
      (results.issues?.length || 0) +
      (results.tasks?.length || 0) +
      (results.epics?.length || 0) +
      (results.wikipages?.length || 0)
    : 0;

  return (
    <div className="search-panel">
      <div className="search-input-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search across all entities..."
          value={query}
          onChange={handleSearchChange}
        />
      </div>

      {loading && <div className="search-loading">Searching...</div>}

      {results && !loading && (
        <div className="search-results">
          <div className="search-results-summary">
            {totalResults} {totalResults === 1 ? 'result' : 'results'} found
          </div>
          {renderResultSection('User Stories', results.userstories, 'userstories')}
          {renderResultSection('Issues', results.issues, 'issues')}
          {renderResultSection('Tasks', results.tasks, 'tasks')}
          {renderResultSection('Epics', results.epics, 'epics')}
          {renderResultSection('Wiki Pages', results.wikipages, 'wikipages')}
          {totalResults === 0 && (
            <div className="search-no-results">
              <p>No results found for "{query}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
