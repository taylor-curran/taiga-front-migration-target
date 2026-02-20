import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import IssueList from '../components/issues/IssueList';
import IssueFilters from '../components/issues/IssueFilters';
import '../styles/pages/Issues.css';

const Issues = () => {
  const { slug: projectSlug } = useParams();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('-created_date');
  const [filters, setFilters] = useState({
    statuses: [],
    types: [],
    priorities: [],
    severities: [],
    selectedStatus: '',
    selectedType: '',
    selectedPriority: '',
    selectedSeverity: '',
  });
  const [projectId, setProjectId] = useState(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const response = await api.get('/projects/by_slug', {
          params: { slug: projectSlug },
        });
        setProjectId(response.data.id);
        return response.data.id;
      } catch (error) {
        console.error('Failed to load project:', error);
        return null;
      }
    };
    loadProject();
  }, [projectSlug]);

  const loadFiltersData = useCallback(async (projId) => {
    try {
      const response = await api.get('/issues/filters_data', {
        params: { project: projId },
      });
      const data = response.data;
      setFilters((prev) => ({
        ...prev,
        statuses: data.statuses || [],
        types: data.types || [],
        priorities: data.priorities || [],
        severities: data.severities || [],
      }));
    } catch (error) {
      console.error('Failed to load filters:', error);
    }
  }, []);

  const loadIssues = useCallback(async (projId, page = 1, query = '', sort = '', filterParams = {}) => {
    if (!projId) return;
    setLoading(true);
    try {
      const params = {
        project: projId,
        page,
        order_by: sort || '-created_date',
        page_size: 25,
        ...filterParams,
      };
      if (query.trim()) {
        params.q = query;
      }
      const response = await api.get('/issues', { params });
      setIssues(Array.isArray(response.data) ? response.data : []);
      setTotalCount(parseInt(response.headers['x-pagination-count'] || '0'));
    } catch (error) {
      console.error('Failed to load issues:', error);
      setIssues([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (projectId) {
      loadFiltersData(projectId);
    }
  }, [projectId, loadFiltersData]);

  useEffect(() => {
    if (projectId) {
      const filterParams = {};
      if (filters.selectedStatus) filterParams.status = filters.selectedStatus;
      if (filters.selectedType) filterParams.type = filters.selectedType;
      if (filters.selectedPriority) filterParams.priority = filters.selectedPriority;
      if (filters.selectedSeverity) filterParams.severity = filters.selectedSeverity;
      loadIssues(projectId, currentPage, searchQuery, sortBy, filterParams);
    }
  }, [projectId, currentPage, searchQuery, sortBy, filters.selectedStatus, filters.selectedType, filters.selectedPriority, filters.selectedSeverity, loadIssues]);

  const handleFilterChange = (filterType, value) => {
    setCurrentPage(1);
    const filterKey = `selected${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`;
    setFilters((prev) => ({ ...prev, [filterKey]: value }));
  };

  const handleSearchChange = (value) => {
    setCurrentPage(1);
    setSearchQuery(value);
  };

  const handleSortChange = (value) => {
    setCurrentPage(1);
    setSortBy(value);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(totalCount / 25);

  return (
    <div className="issues-page">
      <header className="issues-header">
        <h1 className="issues-title">Issues</h1>
        <p className="issues-subtitle">
          {totalCount} {totalCount === 1 ? 'issue' : 'issues'} found
        </p>
      </header>

      <IssueFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        searchQuery={searchQuery}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />

      <IssueList
        issues={issues}
        projectSlug={projectSlug}
        loading={loading}
      />

      {totalPages > 1 && (
        <div className="issues-pagination">
          {currentPage > 1 && (
            <button className="pagination-page" onClick={() => handlePageChange(1)}>1</button>
          )}
          {currentPage > 3 && <span className="pagination-ellipsis">...</span>}
          {currentPage > 2 && (
            <button className="pagination-page" onClick={() => handlePageChange(currentPage - 1)}>
              {currentPage - 1}
            </button>
          )}
          <span className="pagination-page active">{currentPage}</span>
          {currentPage < totalPages - 1 && (
            <button className="pagination-page" onClick={() => handlePageChange(currentPage + 1)}>
              {currentPage + 1}
            </button>
          )}
          {currentPage < totalPages - 2 && <span className="pagination-ellipsis">...</span>}
          {currentPage < totalPages && (
            <button className="pagination-page" onClick={() => handlePageChange(totalPages)}>
              {totalPages}
            </button>
          )}
          {currentPage < totalPages && (
            <button className="pagination-page" onClick={() => handlePageChange(currentPage + 1)}>
              Next ›
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Issues;
