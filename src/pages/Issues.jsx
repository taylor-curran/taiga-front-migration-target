import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import IssueList from '../components/issues/IssueList';
import IssueFilters from '../components/issues/IssueFilters';
import api from '../services/api';
import '../styles/pages/Issues.css';

const Issues = () => {
  const { slug: projectSlug } = useParams();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTags, setShowTags] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [projectData, setProjectData] = useState(null);

  const loadProjectData = useCallback(async () => {
    try {
      const response = await api.get(`/projects/by_slug`, {
        params: { slug: projectSlug }
      });
      setProjectData(response.data);
    } catch (err) {
      console.error('Failed to load project data:', err);
    }
  }, [projectSlug]);

  const loadIssues = useCallback(async (page = 1, query = '', filterParams = {}) => {
    if (!projectSlug) return;
    setLoading(true);
    try {
      const params = {
        project__slug: projectSlug,
        page: page,
        page_size: 25,
      };

      if (query.trim()) {
        params.q = query;
      }

      Object.entries(filterParams).forEach(([key, value]) => {
        if (value) params[key] = value;
      });

      const response = await api.get('/issues', { params });
      setIssues(response.data || []);
      setTotalCount(parseInt(response.headers['x-pagination-count'] || '0'));
    } catch (error) {
      console.error('Failed to load issues:', error);
      setIssues([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [projectSlug]);

  useEffect(() => {
    loadProjectData();
  }, [loadProjectData]);

  useEffect(() => {
    loadIssues(1, '', {});
  }, [loadIssues]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1);
    loadIssues(1, query, filters);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    loadIssues(1, searchQuery, newFilters);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    loadIssues(newPage, searchQuery, filters);
  };

  const totalPages = Math.ceil(totalCount / 25);

  return (
    <div className="issues-page">
      <div className="issue-top">
        <header className="issue-header">
          <h1 className="issues-title">
            {projectData?.name || projectSlug}
            <span className="section-name"> / Issues</span>
          </h1>
          <div className="issue-actions">
            <button
              className={`btn-filter ${filtersOpen ? 'active' : ''}`}
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <span className="filter-icon">&#9776;</span>
              <span className="text">
                {filtersOpen ? 'Hide Filters' : 'Filters'}
              </span>
            </button>
            <div className="issue-search">
              <input
                type="text"
                className="search-input"
                placeholder="Search issues..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <label className="display-tags-button">
              <input
                type="checkbox"
                checked={showTags}
                onChange={() => setShowTags(!showTags)}
              />
              Show tags
            </label>
          </div>
        </header>
      </div>

      <div className="issue-container">
        {filtersOpen && (
          <aside className="filters-bar">
            <IssueFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              statuses={projectData?.issue_statuses || []}
              priorities={projectData?.priorities || []}
              severities={projectData?.severities || []}
              types={projectData?.issue_types || []}
            />
          </aside>
        )}

        <section className={`issues-section ${filtersOpen ? 'with-filter' : ''}`}>
          <div className="issues-info">
            <span>{totalCount} issue{totalCount !== 1 ? 's' : ''}</span>
          </div>

          <IssueList
            issues={issues}
            projectSlug={projectSlug}
            loading={loading}
            showTags={showTags}
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
        </section>
      </div>
    </div>
  );
};

export default Issues;
