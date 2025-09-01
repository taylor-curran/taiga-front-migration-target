import { useState, useEffect, useCallback } from 'react';
import { fetchPublicProjects, searchProjects } from '../services/api';
import ProjectCard from '../components/common/ProjectCard';
import '../styles/pages/Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [filters, setFilters] = useState({
    is_looking_for_people: false,
    is_featured: false
  });
  const [searchTimeout, setSearchTimeout] = useState(null);

  const loadProjects = useCallback(async (page = 1, query = '', sort = '', filterParams = {}) => {
    setLoading(true);
    try {
      let result;
      const params = {
        page: page,
        ...filterParams
      };
      
      if (sort) {
        params.order_by = sort;
      }
      
      if (query.trim()) {
        result = await searchProjects(query, params);
      } else {
        result = await fetchPublicProjects(params);
      }
      
      setProjects(result.projects);
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error('Failed to load projects:', error);
      setProjects([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback((query, sort, filterParams) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeout = setTimeout(() => {
      setCurrentPage(1);
      loadProjects(1, query, sort, filterParams);
    }, 300);
    
    setSearchTimeout(timeout);
  }, [searchTimeout, loadProjects]);

  useEffect(() => {
    loadProjects(1, '', '', {});
  }, [loadProjects]);

  useEffect(() => {
    const activeFilters = {};
    if (filters.is_looking_for_people) {
      activeFilters.is_looking_for_people = true;
    }
    if (filters.is_featured) {
      activeFilters.is_featured = true;
    }
    
    debouncedSearch(searchQuery, sortBy, activeFilters);
  }, [searchQuery, sortBy, filters, debouncedSearch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleFilterToggle = (filterKey) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const activeFilters = {};
    if (filters.is_looking_for_people) {
      activeFilters.is_looking_for_people = true;
    }
    if (filters.is_featured) {
      activeFilters.is_featured = true;
    }
    loadProjects(newPage, searchQuery, sortBy, activeFilters);
  };

  const totalPages = Math.ceil(totalCount / 20);

  return (
    <div className="projects-page">
      <header className="projects-header">
        <h1 className="projects-title">Public Projects</h1>
        <p className="projects-subtitle">
          {totalCount === 1 
            ? "1 public project found" 
            : `${totalCount} public projects found`}
        </p>
      </header>

      <div className="projects-controls">
        <div className="search-section">
          <input
            type="text"
            className="search-input"
            placeholder="Search projects by name or description..."
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
            <option value="">Sort by...</option>
            <option value="-total_fans">Most liked</option>
            <option value="-total_activity">Most active</option>
            <option value="-created_date">Recently created</option>
            <option value="name">Alphabetical</option>
          </select>

          <label 
            className={`filter-toggle ${filters.is_looking_for_people ? 'active' : ''}`}
            onClick={() => handleFilterToggle('is_looking_for_people')}
          >
            <input
              type="checkbox"
              className="filter-checkbox"
              checked={filters.is_looking_for_people}
              onChange={() => {}}
              style={{ display: 'none' }}
            />
            👥 Looking for contributors
          </label>

          <label 
            className={`filter-toggle ${filters.is_featured ? 'active' : ''}`}
            onClick={() => handleFilterToggle('is_featured')}
          >
            <input
              type="checkbox"
              className="filter-checkbox"
              checked={filters.is_featured}
              onChange={() => {}}
              style={{ display: 'none' }}
            />
            ⭐ Featured projects
          </label>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          Loading projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <h3>No projects found</h3>
          <p>Try adjusting your search criteria or filters.</p>
        </div>
      ) : (
        <>
          <div className="results-info">
            <span>
              Showing {((currentPage - 1) * 20) + 1}-{Math.min(currentPage * 20, totalCount)} of {totalCount} projects
            </span>
            <span>Page {currentPage} of {totalPages}</span>
          </div>

          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project.id} className="project-item">
                <ProjectCard project={project} />
              </div>
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

export default Projects;
