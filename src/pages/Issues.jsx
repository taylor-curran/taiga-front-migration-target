import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  fetchProjectBySlug,
  fetchIssues,
  fetchIssueFiltersData,
  fetchIssueTypes,
  fetchSeverities,
  fetchPriorities,
  fetchIssueStatuses,
} from '../services/issues.service';
import IssueList from '../components/issues/IssueList';
import IssueFilters from '../components/issues/IssueFilters';
import '../styles/pages/Issues.css';

const Issues = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [issues, setIssues] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderBy, setOrderBy] = useState('-modified_date');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filtersData, setFiltersData] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [issueTypes, setIssueTypes] = useState([]);
  const [severities, setSeverities] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const proj = await fetchProjectBySlug(slug);
        setProject(proj);
      } catch (err) {
        setError('Failed to load project');
        console.error(err);
      }
    };
    loadProject();
  }, [slug]);

  useEffect(() => {
    if (!project) return;
    const loadMetadata = async () => {
      try {
        const [types, sevs, pris, stats, filters] = await Promise.all([
          fetchIssueTypes(project.id),
          fetchSeverities(project.id),
          fetchPriorities(project.id),
          fetchIssueStatuses(project.id),
          fetchIssueFiltersData(project.id),
        ]);
        setIssueTypes(types);
        setSeverities(sevs);
        setPriorities(pris);
        setStatuses(stats);
        setFiltersData(filters);
      } catch (err) {
        console.error('Failed to load issue metadata:', err);
      }
    };
    loadMetadata();
  }, [project]);

  const loadIssues = useCallback(async () => {
    if (!project) return;
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        page_size: pageSize,
        order_by: orderBy,
      };

      if (searchQuery) {
        params.q = searchQuery;
      }

      if (selectedFilters.type && selectedFilters.type.length > 0) {
        params.type = selectedFilters.type.join(',');
      }
      if (selectedFilters.severity && selectedFilters.severity.length > 0) {
        params.severity = selectedFilters.severity.join(',');
      }
      if (selectedFilters.priority && selectedFilters.priority.length > 0) {
        params.priority = selectedFilters.priority.join(',');
      }
      if (selectedFilters.status && selectedFilters.status.length > 0) {
        params.status = selectedFilters.status.join(',');
      }
      if (selectedFilters.assigned_to && selectedFilters.assigned_to.length > 0) {
        params.assigned_to = selectedFilters.assigned_to.join(',');
      }

      const result = await fetchIssues(project.id, params);
      setIssues(result.issues);
      setTotalCount(result.totalCount);
    } catch (err) {
      setError('Failed to load issues');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [project, currentPage, pageSize, orderBy, searchQuery, selectedFilters]);

  useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  const handleSort = (newOrderBy) => {
    setOrderBy(newOrderBy);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterType, values) => {
    setSelectedFilters((prev) => ({ ...prev, [filterType]: values }));
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const activeFilterCount = Object.values(selectedFilters).reduce(
    (sum, arr) => sum + (arr ? arr.length : 0),
    0
  );

  if (error && !project) {
    return (
      <div className="issues-page">
        <div className="issues-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="issues-page">
      <section className="issues-main">
        <div className="issues-top">
          <header className="issues-header">
            <h1 className="issues-title">
              {project ? project.name : 'Loading...'} - Issues
            </h1>
            <div className="issues-actions">
              <div className="issues-options-start">
                <button
                  className={`btn-filter ${filtersOpen ? 'active' : ''}`}
                  onClick={() => setFiltersOpen(!filtersOpen)}
                >
                  <span className="filter-icon">&#9776;</span>
                  <span className="filter-text">
                    {filtersOpen ? 'Hide Filters' : 'Filters'}
                  </span>
                  {activeFilterCount > 0 && (
                    <span className="selected-filters-count">{activeFilterCount}</span>
                  )}
                </button>

                <form className="issues-search" onSubmit={handleSearch}>
                  <input
                    type="text"
                    placeholder="Search issues..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="issues-search-input"
                  />
                </form>
              </div>
            </div>
          </header>
        </div>

        <div className="issues-container">
          {filtersOpen && (
            <IssueFilters
              filtersData={filtersData}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            />
          )}

          <section className={`issues-content ${filtersOpen ? 'with-filters' : ''}`}>
            {loading ? (
              <div className="issues-loading">Loading issues...</div>
            ) : (
              <IssueList
                issues={issues}
                projectSlug={slug}
                orderBy={orderBy}
                onSort={handleSort}
                issueTypes={issueTypes}
                severities={severities}
                priorities={priorities}
                statuses={statuses}
              />
            )}

            {!loading && totalPages > 1 && (
              <div className="issues-paginator">
                <button
                  className="paginator-btn"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Previous
                </button>
                <span className="paginator-info">
                  Page {currentPage} of {totalPages} ({totalCount} issues)
                </span>
                <button
                  className="paginator-btn"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </section>
        </div>
      </section>
    </div>
  );
};

export default Issues;
