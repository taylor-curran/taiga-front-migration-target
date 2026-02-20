import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import useIssueFilters from '../hooks/useIssueFilters';
import IssueFilters from '../components/issues/IssueFilters';
import { fetchIssues } from '../services/issues.service';
import '../styles/pages/Issues.css';

const SORTABLE_COLUMNS = [
  { key: 'type', label: 'Type', className: 'issue-col-type' },
  { key: 'severity', label: 'Severity', className: 'issue-col-severity' },
  { key: 'priority', label: 'Priority', className: 'issue-col-priority' },
  { key: 'ref', label: 'Issue', className: 'issue-col-subject' },
  { key: 'status', label: 'Status', className: 'issue-col-status' },
  { key: 'modified_date', label: 'Modified', className: 'issue-col-modified' },
  { key: 'assigned_to', label: 'Assigned To', className: 'issue-col-assignee' },
];

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const Issues = () => {
  const { slug } = useParams();
  const [projectId, setProjectId] = useState(null);
  const [issues, setIssues] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [paginatedBy, setPaginatedBy] = useState(20);
  const [loading, setLoading] = useState(true);
  const [showTags, setShowTags] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);

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

  const handleSort = (columnKey) => {
    if (orderBy === columnKey) {
      setOrderBy(`-${columnKey}`);
    } else if (orderBy === `-${columnKey}`) {
      setOrderBy(columnKey);
    } else {
      setOrderBy(columnKey);
    }
  };

  const getSortIndicator = (columnKey) => {
    if (orderBy === columnKey) return ' \u25B2';
    if (orderBy === `-${columnKey}`) return ' \u25BC';
    return '';
  };

  return (
    <div className="issues-page">
      <div className="issues-layout">
        {filtersVisible && (
          <aside className="issues-sidebar">
            <IssueFilters
              filterCategories={filterCategories}
              selectedFilters={selectedFilters}
              searchQuery={searchQuery}
              hasActiveFilters={hasActiveFilters}
              filtersLoading={filtersLoading}
              onAddFilter={addFilter}
              onRemoveFilter={removeFilter}
              onSearchChange={setSearchQuery}
              onClearAll={clearAllFilters}
            />
          </aside>
        )}

        <main className="issues-main">
          <header className="issues-header">
            <h1 className="issues-title">Issues</h1>
            <div className="issues-header-actions">
              <button
                className={`filter-toggle-btn ${filtersVisible ? 'active' : ''}`}
                onClick={() => setFiltersVisible(!filtersVisible)}
              >
                Filters
                {selectedFilters.length > 0 && (
                  <span className="filter-badge">{selectedFilters.length}</span>
                )}
              </button>

              <label className="show-tags-toggle">
                <input
                  type="checkbox"
                  checked={showTags}
                  onChange={(e) => setShowTags(e.target.checked)}
                />
                Show tags
              </label>
            </div>
          </header>

          {loading ? (
            <div className="issues-loading">Loading issues...</div>
          ) : issues.length === 0 ? (
            <div className="issues-empty">
              <h3>No issues found</h3>
              <p>Try adjusting your search criteria or filters.</p>
            </div>
          ) : (
            <>
              <div className="issues-table">
                <div className="issues-table-header">
                  {SORTABLE_COLUMNS.map((col) => (
                    <div
                      key={col.key}
                      className={`${col.className} sortable-header`}
                      onClick={() => handleSort(col.key)}
                    >
                      {col.label}{getSortIndicator(col.key)}
                    </div>
                  ))}
                </div>
                {issues.map((issue) => (
                  <div key={issue.id} className="issues-table-row">
                    <div className="issue-col-type">
                      <span
                        className="issue-type-indicator"
                        style={{ borderColor: issue.type_extra_info?.color }}
                      >
                        {issue.type_extra_info?.name || '-'}
                      </span>
                    </div>
                    <div className="issue-col-severity">
                      <span
                        className="issue-severity-indicator"
                        style={{ borderColor: issue.severity_extra_info?.color }}
                      >
                        {issue.severity_extra_info?.name || '-'}
                      </span>
                    </div>
                    <div className="issue-col-priority">
                      <span
                        className="issue-priority-indicator"
                        style={{ borderColor: issue.priority_extra_info?.color }}
                      >
                        {issue.priority_extra_info?.name || '-'}
                      </span>
                    </div>
                    <div className="issue-col-subject">
                      <span className="issue-ref">#{issue.ref}</span>
                      <span className="issue-subject-text">{issue.subject}</span>
                      {issue.is_blocked && <span className="issue-blocked-icon" title="Blocked">&#128274;</span>}
                      {showTags && issue.tags && issue.tags.length > 0 && (
                        <div className="issue-tags">
                          {issue.tags.map((tag) => (
                            <span
                              key={Array.isArray(tag) ? tag[0] : tag}
                              className="issue-tag"
                              style={{ backgroundColor: Array.isArray(tag) ? tag[1] : undefined }}
                            >
                              {Array.isArray(tag) ? tag[0] : tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="issue-col-status">
                      <span
                        className="issue-status-badge"
                        style={{ color: issue.status_extra_info?.color }}
                      >
                        {issue.status_extra_info?.name || '-'}
                      </span>
                    </div>
                    <div className="issue-col-modified">
                      {formatDate(issue.modified_date)}
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
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          className={`issues-pagination-btn ${pageNum === currentPage ? 'active' : ''}`}
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                      return <span key={pageNum} className="issues-pagination-ellipsis">&hellip;</span>;
                    }
                    return null;
                  })}
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
        </main>
      </div>
    </div>
  );
};

export default Issues;
