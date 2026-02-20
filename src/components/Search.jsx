import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { searchService } from '../services/search.service';
import '../styles/components/Search.css';

const ENTITY_TYPES = [
  { key: 'epics', label: 'Epics', icon: 'E' },
  { key: 'userstories', label: 'User Stories', icon: 'US' },
  { key: 'issues', label: 'Issues', icon: 'I' },
  { key: 'tasks', label: 'Tasks', icon: 'T' },
  { key: 'wikipages', label: 'Wiki', icon: 'W' },
];

const Search = () => {
  const { slug: projectSlug } = useParams();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('userstories');
  const [error, setError] = useState(null);

  const handleSearch = useCallback(async (e) => {
    e.preventDefault();
    if (!query.trim() || !projectSlug) return;

    setLoading(true);
    setError(null);
    try {
      const data = await searchService.searchInProject(projectSlug, query);
      setResults(data);
    } catch (err) {
      console.error('Search failed:', err);
      setError('Search failed. Please try again.');
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, [query, projectSlug]);

  const getResultCount = (type) => {
    if (!results) return 0;
    const items = results[type];
    return Array.isArray(items) ? items.length : 0;
  };

  const activeResults = results ? results[activeFilter] || [] : [];

  const renderResultItem = (item) => {
    const ref = item.ref ? `#${item.ref}` : '';
    const subject = item.subject || item.slug || item.name || 'Untitled';
    const status = item.status_extra_info?.name || '';

    return (
      <div key={item.id} className="search-result-item">
        <span className="result-ref">{ref}</span>
        <Link
          to={`/project/${projectSlug}`}
          className="result-subject"
        >
          {subject}
        </Link>
        {status && (
          <span
            className="result-status"
            style={{ color: item.status_extra_info?.color || '#999' }}
          >
            {status}
          </span>
        )}
        {item.assigned_to_extra_info && (
          <span className="result-assignee">
            {item.assigned_to_extra_info.full_name_display || item.assigned_to_extra_info.username}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="search-page">
      <header className="search-header">
        <h1>Search</h1>
      </header>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          className="search-input"
          placeholder="Type something to search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="search-submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div className="search-error">{error}</div>}

      {results && (
        <div className="search-results">
          <ul className="search-filter-list">
            {ENTITY_TYPES.map((type) => (
              <li
                key={type.key}
                className={`search-filter-item ${activeFilter === type.key ? 'active' : ''}`}
              >
                <button onClick={() => setActiveFilter(type.key)}>
                  <span className="filter-icon">{type.icon}</span>
                  <span className="filter-count">{getResultCount(type.key)}</span>
                  <span className="filter-name">{type.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="search-results-content">
            {activeResults.length === 0 ? (
              <div className="search-empty">
                <p>No results found for &quot;{query}&quot; in {ENTITY_TYPES.find(t => t.key === activeFilter)?.label || activeFilter}</p>
              </div>
            ) : (
              <div className="search-results-list">
                {activeResults.map(renderResultItem)}
              </div>
            )}
          </div>
        </div>
      )}

      {!results && !loading && (
        <div className="search-placeholder">
          <p>Enter a search term and press Enter to search across this project.</p>
        </div>
      )}
    </div>
  );
};

export default Search;
