import { useState, useCallback, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FILTER_CATEGORIES, VALID_QUERY_PARAMS, fetchIssueFiltersData } from '../services/issues.service';

const parseFilterParam = (value) => {
  if (!value) return [];
  return value.split(',').map((v) => v.trim()).filter(Boolean);
};

const serializeFilterParam = (values) => {
  if (!values || values.length === 0) return undefined;
  return values.join(',');
};

const useIssueFilters = (projectId) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersData, setFiltersData] = useState(null);
  const [filtersLoading, setFiltersLoading] = useState(false);

  const activeFilters = useMemo(() => {
    const result = {};
    for (const key of FILTER_CATEGORIES) {
      const includeVal = searchParams.get(key);
      if (includeVal) {
        result[key] = parseFilterParam(includeVal);
      }
      const excludeKey = `exclude_${key}`;
      const excludeVal = searchParams.get(excludeKey);
      if (excludeVal) {
        result[excludeKey] = parseFilterParam(excludeVal);
      }
    }
    return result;
  }, [searchParams]);

  const searchQuery = searchParams.get('q') || '';
  const orderBy = searchParams.get('order_by') || 'created_date';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const buildApiParams = useCallback(() => {
    const params = {};
    for (const key of VALID_QUERY_PARAMS) {
      const val = searchParams.get(key);
      if (val) {
        params[key] = val;
      }
    }
    return params;
  }, [searchParams]);

  const selectedFilters = useMemo(() => {
    const selected = [];
    if (!filtersData) return selected;

    const categoryDataMap = {
      status: filtersData.statuses,
      type: filtersData.types,
      severity: filtersData.severities,
      priority: filtersData.priorities,
      tags: filtersData.tags,
      assigned_to: filtersData.assignedTo,
      owner: filtersData.owners,
      role: filtersData.roles,
    };

    for (const key of FILTER_CATEGORIES) {
      const dataList = categoryDataMap[key] || [];
      const includeIds = activeFilters[key] || [];
      for (const id of includeIds) {
        const item = dataList.find((d) => String(d.id) === String(id));
        selected.push({
          id,
          dataType: key,
          name: item ? item.name : id,
          color: item ? item.color : undefined,
          mode: 'include',
        });
      }
      const excludeIds = activeFilters[`exclude_${key}`] || [];
      for (const id of excludeIds) {
        const item = dataList.find((d) => String(d.id) === String(id));
        selected.push({
          id,
          dataType: key,
          name: item ? item.name : id,
          color: item ? item.color : undefined,
          mode: 'exclude',
        });
      }
    }
    return selected;
  }, [activeFilters, filtersData]);

  const loadFiltersData = useCallback(async () => {
    if (!projectId) return;
    setFiltersLoading(true);
    try {
      const currentFilters = {};
      for (const key of FILTER_CATEGORIES) {
        const val = searchParams.get(key);
        if (val) currentFilters[key] = val;
        const exVal = searchParams.get(`exclude_${key}`);
        if (exVal) currentFilters[`exclude_${key}`] = exVal;
      }
      const qVal = searchParams.get('q');
      if (qVal) currentFilters.q = qVal;

      const data = await fetchIssueFiltersData(projectId, currentFilters);
      setFiltersData(data);
    } catch (err) {
      console.error('Failed to load filter data:', err);
    } finally {
      setFiltersLoading(false);
    }
  }, [projectId, searchParams]);

  useEffect(() => {
    loadFiltersData();
  }, [loadFiltersData]);

  const addFilter = useCallback((category, value, mode = 'include') => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      const paramKey = mode === 'exclude' ? `exclude_${category}` : category;
      const existing = parseFilterParam(next.get(paramKey));
      if (!existing.includes(String(value))) {
        existing.push(String(value));
      }
      next.set(paramKey, serializeFilterParam(existing));
      next.delete('page');
      return next;
    });
  }, [setSearchParams]);

  const removeFilter = useCallback((category, value, mode = 'include') => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      const paramKey = mode === 'exclude' ? `exclude_${category}` : category;
      const existing = parseFilterParam(next.get(paramKey));
      const updated = existing.filter((v) => v !== String(value));
      if (updated.length > 0) {
        next.set(paramKey, serializeFilterParam(updated));
      } else {
        next.delete(paramKey);
      }
      next.delete('page');
      return next;
    });
  }, [setSearchParams]);

  const setSearchQuery = useCallback((q) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (q) {
        next.set('q', q);
      } else {
        next.delete('q');
      }
      next.delete('page');
      return next;
    });
  }, [setSearchParams]);

  const setOrderBy = useCallback((order) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (order) {
        next.set('order_by', order);
      } else {
        next.delete('order_by');
      }
      return next;
    });
  }, [setSearchParams]);

  const setPage = useCallback((page) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (page > 1) {
        next.set('page', String(page));
      } else {
        next.delete('page');
      }
      return next;
    });
  }, [setSearchParams]);

  const clearAllFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  const hasActiveFilters = useMemo(() => {
    return selectedFilters.length > 0 || searchQuery.length > 0;
  }, [selectedFilters, searchQuery]);

  const filterCategories = useMemo(() => {
    if (!filtersData) return [];
    return [
      { title: 'Type', dataType: 'type', content: filtersData.types },
      { title: 'Severity', dataType: 'severity', content: filtersData.severities },
      { title: 'Priority', dataType: 'priority', content: filtersData.priorities },
      { title: 'Status', dataType: 'status', content: filtersData.statuses },
      { title: 'Tags', dataType: 'tags', content: filtersData.tags, hideEmpty: true },
      { title: 'Assigned To', dataType: 'assigned_to', content: filtersData.assignedTo },
      { title: 'Role', dataType: 'role', content: filtersData.roles },
      { title: 'Created By', dataType: 'owner', content: filtersData.owners },
    ];
  }, [filtersData]);

  return {
    activeFilters,
    selectedFilters,
    filterCategories,
    filtersData,
    filtersLoading,
    searchQuery,
    orderBy,
    currentPage,
    hasActiveFilters,
    buildApiParams,
    addFilter,
    removeFilter,
    setSearchQuery,
    setOrderBy,
    setPage,
    clearAllFilters,
    loadFiltersData,
  };
};

export default useIssueFilters;
