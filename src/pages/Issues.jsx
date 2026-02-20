import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { fetchIssues, fetchIssueFiltersData } from '../services/issues.service';
import IssueTable from '../components/issues/IssueTable';
import IssueFilters from '../components/issues/IssueFilters';
import '../styles/pages/Issues.css';

const Issues = () => {
  const { slug } = useParams();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('-modified_date');
  const [activeFilters, setActiveFilters] = useState({});
  const [filtersData, setFiltersData] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [projectId, setProjectId] = useState(null);

  const pageSize = 25;

  const loadIssues = useCallback(async (projId, page = 1, query = '', sort = '', filters = {}) => {
    if (!projId) return;
    setLoading(true);
    try {
      const params = {
        page: page,
        page_size: pageSize
      };

      if (sort) {
        params.order_by = sort;
      }

      if (query.trim()) {
        params.q = query;
      }

      Object.entries(filters).forEach(([key, values]) => {
        if (values && values.length > 0) {
          params[key] = values.join(',');
        }
      });

      const result = await fetchIssues(projId, params);
      setIssues(result.issues);
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error('Failed to load issues:', error);
      setIssues([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFiltersData = useCallback(async (projId) => {
    if (!projId) return;
    try {
      const data = await fetchIssueFiltersData(projId);
      setFiltersData(data);
    } catch (error) {
      console.error('Failed to load issue filters:', error);
    }
  }, []);

  useEffect(() => {
    const resolveProject = async () => {
      if (!slug) return;
      try {
        const { default: api } = await import('../services/api');
        const response = await api.get('/resolver', {
          params: { project: slug }
        });
        const resolvedId = response.data.project;
        setProjectId(resolvedId);
      } catch (error) {
        console.error('Failed to resolve project:', error);
      }
    };
    resolveProject();
  }, [slug]);

  useEffect(() => {
    if (projectId) {
      loadIssues(projectId, 1, '', sortBy, {});
      loadFiltersData(projectId);
    }
  }, [projectId, loadIssues, loadFiltersData, sortBy]);

  const debouncedSearch = useCallback((query, sort, filters) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      setCurrentPage(1);
      loadIssues(projectId, 1, query, sort, filters);
    }, 300);

    setSearchTimeout(timeout);
  }, [searchTimeout, loadIssues, projectId]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    debouncedSearch(query, sortBy, activeFilters);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
    loadIssues(projectId, 1, searchQuery, sort, activeFilters);
  };

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    setCurrentPage(1);
    loadIssues(projectId, 1, searchQuery, sortBy, filters);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    loadIssues(projectId, newPage, searchQuery, sortBy, activeFilters);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).reduce((count, arr) => count + (arr ? arr.length : 0), 0);
  };

  return (
    <div className="issues-page">
      <header className="issues-header">
        <div className="issues-header-top">
          <h1 className="issues-title">Issues</h1>
          <div className="issues-header-actions">
            <button
              className={`toggle-filters-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
              {getActiveFilterCount() > 0 && (
                <span className="active-filter-badge">{getActiveFilterCount()}</span>
              )}
            </button>
          </div>
        </div>
        <p className="issues-subtitle">
          {totalCount === 1
            ? '1 issue found'
            : `${totalCount} issues found`}
        </p>
      </header>

      {showFilters && (
        <IssueFilters
          filtersData={filtersData}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />
      )}

      {!showFilters && (
        <div className="issues-controls-compact">
          <input
            type="text"
            className="search-input"
            placeholder="Search issues..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="">Sort by...</option>
            <option value="-modified_date">Recently modified</option>
            <option value="-created_date">Recently created</option>
            <option value="ref">Reference</option>
            <option value="severity">Severity</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
            <option value="type">Type</option>
            <option value="assigned_to">Assignee</option>
          </select>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          Loading issues...
        </div>
      ) : (
        <>
          {issues.length > 0 && (
            <div className="results-info">
              <span>
                Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCount)} of {totalCount} issues
              </span>
              <span>Page {currentPage} of {totalPages}</span>
            </div>
          )}

          <IssueTable
            issues={issues}
            projectSlug={slug}
            sortBy={sortBy}
            onSortChange={handleSortChange}
          />

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>

              <button
                className="pagination-button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Issues;
