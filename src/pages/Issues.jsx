import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchIssues,
  fetchProjectBySlug
} from '../services/issues.service';
import IssueListItem from '../components/issues/IssueListItem';
import IssueForm from '../components/issues/IssueForm';
import '../styles/pages/Issues.css';

const PAGE_SIZE = 20;

const Issues = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('-created_date');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState(null);

  const loadIssues = useCallback(async (projectId, page = 1, query = '', sort = '') => {
    setLoading(true);
    setError(null);
    try {
      const params = { page };
      if (sort) {
        params.order_by = sort;
      }
      if (query.trim()) {
        params.q = query.trim();
      }
      const result = await fetchIssues(projectId, params);
      setIssues(result.issues);
      setTotalCount(result.totalCount);
    } catch (err) {
      console.error('Failed to load issues:', err);
      setError('Failed to load issues.');
      setIssues([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const proj = await fetchProjectBySlug(slug);
        setProject(proj);
        loadIssues(proj.id, 1, '', sortBy);
      } catch (err) {
        console.error('Failed to load project:', err);
        setError('Failed to load project. It may not exist or you may not have access.');
        setLoading(false);
      }
    };
    loadProject();
  }, [slug, loadIssues, sortBy]);

  const debouncedSearch = useCallback((query) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (project) {
        setCurrentPage(1);
        loadIssues(project.id, 1, query, sortBy);
      }
    }, 300);

    setSearchTimeout(timeout);
  }, [searchTimeout, loadIssues, project, sortBy]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortBy(newSort);
    if (project) {
      setCurrentPage(1);
      loadIssues(project.id, 1, searchQuery, newSort);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (project) {
      loadIssues(project.id, newPage, searchQuery, sortBy);
    }
  };

  const handleCreateSuccess = (newIssue) => {
    setShowCreateForm(false);
    navigate(`/project/${slug}/issue/${newIssue.ref}`);
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  if (showCreateForm && project) {
    return (
      <div className="issues-page">
        <div className="issues-breadcrumb">
          <button className="breadcrumb-link" onClick={() => setShowCreateForm(false)}>
            Issues
          </button>
          <span className="breadcrumb-separator">/</span>
          <span>New Issue</span>
        </div>
        <IssueForm
          projectId={project.id}
          projectSlug={slug}
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="issues-page">
      <header className="issues-header">
        <div className="issues-header-top">
          <div>
            <h1 className="issues-title">Issues</h1>
            <p className="issues-subtitle">
              {totalCount === 1
                ? '1 issue found'
                : `${totalCount} issues found`}
            </p>
          </div>
          <button className="btn-new-issue" onClick={() => setShowCreateForm(true)}>
            New Issue
          </button>
        </div>
      </header>

      <div className="issues-controls">
        <div className="search-section">
          <input
            type="text"
            className="search-input"
            placeholder="Search issues..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className="filters-section">
          <select
            className="sort-select"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="-created_date">Newest first</option>
            <option value="created_date">Oldest first</option>
            <option value="-modified_date">Recently modified</option>
            <option value="status">Status</option>
            <option value="severity">Severity</option>
            <option value="priority">Priority</option>
            <option value="type">Type</option>
            <option value="ref">Reference</option>
          </select>
        </div>
      </div>

      {error && <div className="issues-error">{error}</div>}

      {loading ? (
        <div className="loading-container">Loading issues...</div>
      ) : issues.length === 0 ? (
        <div className="empty-state">
          <h3>No issues found</h3>
          <p>
            {searchQuery
              ? 'Try adjusting your search criteria.'
              : 'Create the first issue for this project.'}
          </p>
        </div>
      ) : (
        <>
          <div className="results-info">
            <span>
              Showing {((currentPage - 1) * PAGE_SIZE) + 1}-{Math.min(currentPage * PAGE_SIZE, totalCount)} of {totalCount} issues
            </span>
            <span>Page {currentPage} of {totalPages}</span>
          </div>

          <div className="issues-table">
            <div className="issues-table-header">
              <div className="col-type">Type</div>
              <div className="col-severity">Sev</div>
              <div className="col-priority">Pri</div>
              <div className="col-subject">Issue</div>
              <div className="col-status">Status</div>
              <div className="col-modified">Modified</div>
              <div className="col-assigned">Assigned</div>
            </div>
            {issues.map((issue) => (
              <IssueListItem key={issue.id} issue={issue} projectSlug={slug} />
            ))}
          </div>

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
