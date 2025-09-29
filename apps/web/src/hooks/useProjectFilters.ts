import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Project } from '../types';

export interface FilterState {
  searchTerm: string;
  statusFilter: string;
  skillFilter: string;
  priorityFilter: string;
  geoFilter: string;
  industryFilter: string;
  resourceFilter: string;
  dateFilter: string;
}

export function useProjectFilters(projects: Project[]) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [geoFilter, setGeoFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [resourceFilter, setResourceFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Initialize filters from URL parameters
  useEffect(() => {
    const searchParam = searchParams.get('search');
    const statusParam = searchParams.get('status');
    const skillParam = searchParams.get('skill');
    const priorityParam = searchParams.get('priority');
    const geoParam = searchParams.get('geo');
    const industryParam = searchParams.get('industry');
    const resourceParam = searchParams.get('resource');
    const dateParam = searchParams.get('date');

    if (searchParam) setSearchTerm(searchParam);
    if (statusParam) setStatusFilter(statusParam);
    if (skillParam) setSkillFilter(skillParam);
    if (priorityParam) setPriorityFilter(priorityParam);
    if (geoParam) setGeoFilter(geoParam);
    if (industryParam) setIndustryFilter(industryParam);
    if (resourceParam) setResourceFilter(resourceParam);
    if (dateParam) setDateFilter(dateParam);
  }, [searchParams]);

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    const skills = new Set<string>();
    const geos = new Set<string>();
    const industries = new Set<string>();
    
    projects.forEach(project => {
      // Handle required_skills safely
      if (project.required_skills && Array.isArray(project.required_skills)) {
        project.required_skills.forEach(skill => skills.add(skill));
      }
      // Handle geo_preference safely
      if (project.geo_preference) {
        geos.add(project.geo_preference);
      }
      // Handle industry safely
      if (project.industry) {
        industries.add(project.industry);
      }
    });

    return {
      skills: Array.from(skills).sort(),
      geos: Array.from(geos).sort(),
      industries: Array.from(industries).sort()
    };
  }, [projects]);

  // Filter projects based on current filter criteria
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        project.name.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        (project.client_name && project.client_name.toLowerCase().includes(searchLower)) ||
        (project.role_title && project.role_title.toLowerCase().includes(searchLower));

      // Status filter
      const matchesStatus = !statusFilter || statusFilter === 'all_status' || project.status === statusFilter;

      // Skill filter
      const matchesSkill = !skillFilter || skillFilter === 'all_skills' ||
        (project.required_skills && Array.isArray(project.required_skills) && 
         project.required_skills.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase())));

      // Priority filter
      const matchesPriority = !priorityFilter || priorityFilter === 'all_priority' || project.priority === priorityFilter;

      // Geography filter
      const matchesGeo = !geoFilter || geoFilter === 'all_geo' || project.geo_preference === geoFilter;

      // Industry filter
      const matchesIndustry = !industryFilter || industryFilter === 'all_industry' || project.industry === industryFilter;

      // Resource availability filter
      const matchesResource = !resourceFilter || resourceFilter === 'all_resource' ||
        (resourceFilter === 'needs_resources' && project.required_seats > 0) ||
        (resourceFilter === 'fully_allocated' && project.required_seats === 0);

      // Date filter
      const projectStartDate = new Date(project.start_date);
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
      
      const matchesDate = !dateFilter || dateFilter === 'all_dates' ||
        (dateFilter === 'starting_soon' && projectStartDate <= thirtyDaysFromNow && projectStartDate >= now) ||
        (dateFilter === 'active' && projectStartDate <= now && new Date(project.end_date) >= now) ||
        (dateFilter === 'future' && projectStartDate > now);

      return matchesSearch && matchesStatus && matchesSkill && matchesPriority && 
             matchesGeo && matchesIndustry && matchesResource && matchesDate;
    });
  }, [projects, searchTerm, statusFilter, skillFilter, priorityFilter, geoFilter, industryFilter, resourceFilter, dateFilter]);

  // Update URL parameters when filters change
  const updateURLParams = (filters: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '' && !value.startsWith('all_')) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    setSearchParams(newParams);
  };

  // Filter change handlers
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    updateURLParams({
      search: value, status: statusFilter, skill: skillFilter, priority: priorityFilter,
      geo: geoFilter, industry: industryFilter, resource: resourceFilter, date: dateFilter
    });
  };

  const handleFilterChange = (filterType: string, value: string) => {
    const filterSetters: Record<string, (value: string) => void> = {
      status: setStatusFilter,
      skill: setSkillFilter,
      priority: setPriorityFilter,
      geo: setGeoFilter,
      industry: setIndustryFilter,
      resource: setResourceFilter,
      date: setDateFilter
    };

    filterSetters[filterType]?.(value);
    
    const currentFilters = {
      search: searchTerm, status: statusFilter, skill: skillFilter, priority: priorityFilter,
      geo: geoFilter, industry: industryFilter, resource: resourceFilter, date: dateFilter,
      [filterType]: value
    };
    
    updateURLParams(currentFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setSkillFilter('');
    setPriorityFilter('');
    setGeoFilter('');
    setIndustryFilter('');
    setResourceFilter('');
    setDateFilter('');
    setSearchParams(new URLSearchParams());
    toast.success('All filters cleared');
  };

  // Check if any filters are active
  const hasActiveFilters = !!(searchTerm || statusFilter || skillFilter || priorityFilter || 
                            geoFilter || industryFilter || resourceFilter || dateFilter);

  const filterState = {
    searchTerm,
    statusFilter,
    skillFilter,
    priorityFilter,
    geoFilter,
    industryFilter,
    resourceFilter,
    dateFilter
  };

  return {
    filterState,
    filteredProjects,
    filterOptions,
    hasActiveFilters,
    handleSearchChange,
    handleFilterChange,
    clearFilters
  };
}
