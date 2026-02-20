import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import useIssueFilters from '../hooks/useIssueFilters';
import IssueFilters from '../components/issues/IssueFilters';
import { fetchIssues } from '../services/issues.service';
import '../styles/pages/Issues.css';

const Issues = () => {
  const { slug } = useParams();
  const [projectId, setProjectId] = useState(null);
  const [issues, setIssues] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [paginatedBy, setPaginatedBy] = useState(20);
  const [loading, setLoading] = useState(true);

  const {
    filterCategories,
    selectedFilters,
    searchQuery,
    orderBy,
    currentPage,
    hasActiveFilters,
    filtersLoading,
    buildApiParams,
    addFilter,
    removeFilter,
    setSearchQuery,
    setOrderBy,
    setPage,
    clearAllFilters,
  } = useIssueFilters(projectId);

  useEffect(() => {
    if (slug) {
      setProjectId(slug);
    }
  }, [slug]);

  const loadIssues = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const params = buildApiParams();
      const result = await fetchIssues(projectId, params);
      setIssues(result.issues);
      setTotalCount(result.totalCount);
      setPaginatedBy(result.paginatedBy);
    } catch (err) {
      console.error('Failed to load issues:', err);
      setIssues([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [projectId, buildApiParams]);

  useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  const totalPages = Math.ceil(totalCount / paginatedBy);

  return (
    <div className="issues-page">
      <header className="issues-header">
        <h1 className="issues-title">Issues</h1>
        <p className="issues-subtitle">
          {totalCount === 1
            ? '1 issue found'
            : `${totalCount} issues found`}
        </p>
      </header>

      <IssueFilters
        filterCategories={filterCategories}
        selectedFilters={selectedFilters}
        searchQuery={searchQuery}
        orderBy={orderBy}
        hasActiveFilters={hasActiveFilters}
        filtersLoading={filtersLoading}
        onAddFilter={addFilter}
        onRemoveFilter={removeFilter}
        onSearchChange={setSearchQuery}
        onOrderChange={setOrderBy}
        onClearAll={clearAllFilters}
      />

      {loading ? (
        <div className="issues-loading">Loading issues...</div>
      ) : issues.length === 0 ? (
        <div className="issues-empty">
          <h3>No issues found</h3>
          <p>Try adjusting your search criteria or filters.</p>
        </div>
      ) : (
        <>
          <div className="issues-results-info">
            <span>
              Showing {((currentPage - 1) * paginatedBy) + 1}-{Math.min(currentPage * paginatedBy, totalCount)} of {totalCount} issues
            </span>
            <span>Page {currentPage} of {totalPages}</span>
          </div>

          <div className="issues-table">
            <div className="issues-table-header">
              <div className="issue-col-ref">#</div>
              <div className="issue-col-subject">Subject</div>
              <div className="issue-col-status">Status</div>
              <div className="issue-col-type">Type</div>
              <div className="issue-col-severity">Severity</div>
              <div className="issue-col-priority">Priority</div>
              <div className="issue-col-assignee">Assignee</div>
            </div>
            {issues.map((issue) => (
              <div key={issue.id} className="issues-table-row">
                <div className="issue-col-ref">#{issue.ref}</div>
                <div className="issue-col-subject">{issue.subject}</div>
                <div className="issue-col-status">
                  <span
                    className="issue-status-badge"
                    style={{ color: issue.status_extra_info?.color }}
                  >
                    {issue.status_extra_info?.name || '-'}
                  </span>
                </div>
                <div className="issue-col-type">
                  {issue.type_extra_info?.name || '-'}
                </div>
                <div className="issue-col-severity">
                  {issue.severity_extra_info?.name || '-'}
                </div>
                <div className="issue-col-priority">
                  {issue.priority_extra_info?.name || '-'}
                </div>
                <div className="issue-col-assignee">
                  {issue.assigned_to_extra_info?.full_name_display || 'Unassigned'}
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="issues-pagination">
              <button
                className="issues-pagination-btn"
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                Previous
              </button>
              <span className="issues-pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="issues-pagination-btn"
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
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
