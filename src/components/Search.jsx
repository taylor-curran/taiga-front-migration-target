import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, Link, useParams } from 'react-router-dom';
import { searchInProject } from '../services/search.service';

const TABS = [
  { key: 'epics', label: 'Epics', icon: 'icon-epics' },
  { key: 'userstories', label: 'User Stories', icon: 'icon-bulk' },
  { key: 'issues', label: 'Issues', icon: 'icon-issues' },
  { key: 'tasks', label: 'Tasks', icon: 'icon-bulk' },
  { key: 'wikipages', label: 'Wiki', icon: 'icon-wiki' },
];

const SearchInput = ({ value, onChange, loading }) => (
  <section className="search-in">
    <input
      className="search-input"
      type="text"
      placeholder="Search..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoFocus
    />
    <div className="icon-search-wrapper">
      {loading ? (
        <span className="loading-spinner" />
      ) : (
        <span className="icon-search" title="Search">&#128269;</span>
      )}
    </div>
  </section>
);

const FilterTabs = ({ results, activeTab, onTabChange }) => (
  <ul className="search-filter">
    {TABS.map((tab) => {
      const count = results?.[tab.key]?.length || 0;
      return (
        <li key={tab.key} className={tab.key}>
          <a
            href="#"
            className={activeTab === tab.key ? 'active' : ''}
            title={tab.label}
            onClick={(e) => {
              e.preventDefault();
              onTabChange(tab.key);
            }}
          >
            <span className="num">{count}</span>
            <span className="name">{tab.label}</span>
          </a>
        </li>
      );
    })}
  </ul>
);

const EmptyResults = () => (
  <div className="empty-large">
    <p className="title">No results found</p>
    <p>Try searching with different terms</p>
  </div>
);

const EpicsTable = ({ items, projectSlug }) => {
  if (!items?.length) return <EmptyResults />;
  return (
    <div className="search-result-table-container">
      <div className="search-result-table-header">
        <div className="row title">
          <div className="subject-col">Epics</div>
          <div className="status">Status</div>
        </div>
      </div>
      <div className="search-result-table-body">
        {items.map((epic) => (
          <div key={epic.id} className="row table-main">
            <div className="subject-col">
              <div className="item-name">
                <Link to={`/project/${projectSlug}/epic/${epic.ref}`}>
                  <span className="ref">#{epic.ref}</span>
                  <span>{epic.subject}</span>
                </Link>
              </div>
            </div>
            <div className="status">
              <span className="status-badge">{epic.status_extra_info?.name || '-'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const UserStoriesTable = ({ items, projectSlug }) => {
  if (!items?.length) return <EmptyResults />;
  return (
    <div className="search-result-table-container">
      <div className="search-result-table-header">
        <div className="row title">
          <div className="subject-col">User Stories</div>
          <div className="sprint">Sprint</div>
          <div className="status">Status</div>
          <div className="points">Points</div>
        </div>
      </div>
      <div className="search-result-table-body">
        {items.map((us) => (
          <div key={us.id} className="row table-main">
            <div className="subject-col">
              <div className="item-name">
                <Link to={`/project/${projectSlug}/us/${us.ref}`}>
                  <span className="ref">#{us.ref}</span>
                  <span>{us.subject}</span>
                </Link>
              </div>
            </div>
            <div className="sprint">
              {us.milestone_name ? (
                <Link to={`/project/${projectSlug}/taskboard/${us.milestone_slug}`}>
                  {us.milestone_name}
                </Link>
              ) : '-'}
            </div>
            <div className="status">
              <span className="status-badge">{us.status_extra_info?.name || '-'}</span>
            </div>
            <div className="points">{us.total_points ?? '-'}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const IssuesTable = ({ items, projectSlug }) => {
  if (!items?.length) return <EmptyResults />;
  return (
    <div className="search-result-table-container">
      <div className="search-result-table-header">
        <div className="row title">
          <div className="subject-col">Issues</div>
          <div className="status">Status</div>
          <div className="assigned-to">Assigned To</div>
        </div>
      </div>
      <div className="search-result-table-body">
        {items.map((issue) => (
          <div key={issue.id} className="row table-main">
            <div className="subject-col">
              <div className="item-name">
                <Link to={`/project/${projectSlug}/issue/${issue.ref}`}>
                  <span className="ref">#{issue.ref}</span>
                  <span>{issue.subject}</span>
                </Link>
              </div>
            </div>
            <div className="status">
              <span className="status-badge">{issue.status_extra_info?.name || '-'}</span>
            </div>
            <div className="assigned-to">
              {issue.assigned_to_extra_info ? (
                <div className="avatar">
                  <img
                    src={issue.assigned_to_extra_info.photo}
                    alt={issue.assigned_to_extra_info.full_name_display}
                  />
                  <span className="avatar-caption">
                    {issue.assigned_to_extra_info.full_name_display}
                  </span>
                </div>
              ) : (
                '-'
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TasksTable = ({ items, projectSlug }) => {
  if (!items?.length) return <EmptyResults />;
  return (
    <div className="search-result-table-container">
      <div className="search-result-table-header">
        <div className="row title">
          <div className="subject-col">Tasks</div>
          <div className="status">Status</div>
          <div className="assigned-to">Assigned To</div>
        </div>
      </div>
      <div className="search-result-table-body">
        {items.map((task) => (
          <div key={task.id} className="row table-main">
            <div className="subject-col">
              <div className="item-name">
                <Link to={`/project/${projectSlug}/task/${task.ref}`}>
                  <span className="ref">#{task.ref}</span>
                  <span>{task.subject}</span>
                </Link>
              </div>
            </div>
            <div className="status">
              <span className="status-badge">{task.status_extra_info?.name || '-'}</span>
            </div>
            <div className="assigned-to">
              {task.assigned_to_extra_info ? (
                <div className="avatar">
                  <img
                    src={task.assigned_to_extra_info.photo}
                    alt={task.assigned_to_extra_info.full_name_display}
                  />
                  <span className="avatar-caption">
                    {task.assigned_to_extra_info.full_name_display}
                  </span>
                </div>
              ) : (
                '-'
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const WikiTable = ({ items, projectSlug }) => {
  if (!items?.length) return <EmptyResults />;
  return (
    <div className="search-result-table-container">
      <div className="search-result-table-header">
        <div className="row title">
          <div className="subject-col">Wiki Pages</div>
        </div>
      </div>
      <div className="search-result-table-body">
        {items.map((page) => (
          <div key={page.id} className="row table-main">
            <div className="subject-col">
              <div className="item-name">
                <Link to={`/project/${projectSlug}/wiki/${page.slug}`}>
                  {page.slug}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TABLE_COMPONENTS = {
  epics: EpicsTable,
  userstories: UserStoriesTable,
  issues: IssuesTable,
  tasks: TasksTable,
  wikipages: WikiTable,
};

const Search = ({ projectId, projectSlug }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('text') || '');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('userstories');
  const debounceRef = useRef(null);

  const performSearch = useCallback(
    async (term) => {
      if (!projectId || !term) {
        setResults(null);
        return;
      }

      setLoading(true);
      try {
        const data = await searchInProject(projectId, term);
        setResults(data);

        let bestTab = 'userstories';
        let maxCount = 0;
        for (const tab of TABS) {
          const count = data[tab.key]?.length || 0;
          if (count > maxCount) {
            maxCount = count;
            bestTab = tab.key;
          }
        }
        if (maxCount > 0) {
          setActiveTab(bestTab);
        }
      } catch (err) {
        if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
          console.error('Search failed:', err);
        }
      } finally {
        setLoading(false);
      }
    },
    [projectId]
  );

  const handleSearchChange = useCallback(
    (term) => {
      setSearchTerm(term);
      setSearchParams(term ? { text: term } : {}, { replace: true });

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        performSearch(term);
      }, 300);
    },
    [performSearch, setSearchParams]
  );

  useEffect(() => {
    const initialText = searchParams.get('text');
    if (initialText && projectId) {
      performSearch(initialText);
    }
  }, [projectId]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const ActiveTable = TABLE_COMPONENTS[activeTab];
  const activeItems = results?.[activeTab] || [];

  return (
    <div className="search-wrapper">
      <aside className="search-sidebar">
        <SearchInput value={searchTerm} onChange={handleSearchChange} loading={loading} />
      </aside>
      <section className="search-main">
        <h2 className="main-title">Search</h2>
        <FilterTabs results={results} activeTab={activeTab} onTabChange={setActiveTab} />
        <section className="search-result-table">
          {results ? (
            <ActiveTable items={activeItems} projectSlug={projectSlug} />
          ) : (
            <div className="search-placeholder">
              <p>Enter a search term to find items in this project</p>
            </div>
          )}
        </section>
      </section>
    </div>
  );
};

export default Search;
