import { AlertTriangle, Filter, Plus, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { projectsData } from '../../data/projects';
import projectService from '../../services/projectService';
import { Project } from '../../types';
import { ProjectCreationForm } from '../Projects/ProjectCreationForm';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { EmptyProjectsState, PriorityOverview, ProjectCard } from '../ui/project';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function ProjectsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  
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
      project.required_skills.forEach(skill => skills.add(skill));
      geos.add(project.geo_preference);
      industries.add(project.industry);
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
        project.client_name.toLowerCase().includes(searchLower) ||
        project.role_title.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus = !statusFilter || statusFilter === 'all_status' || project.status === statusFilter;

      // Skill filter
      const matchesSkill = !skillFilter || skillFilter === 'all_skills' ||
        project.required_skills.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()));

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
  const hasActiveFilters = searchTerm || statusFilter || skillFilter || priorityFilter || 
                          geoFilter || industryFilter || resourceFilter || dateFilter;

  // Load projects from API; fallback to static + localStorage if API fails
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const apiProjects = await projectService.getAllProjects();
        if (!isMounted) return;
        setProjects(sortProjects(apiProjects));
      } catch (err) {
        console.warn('Falling back to static/local projects due to API error:', err);
        const savedProjects = localStorage.getItem('projects');
        let combinedProjects = [...projectsData];
        if (savedProjects) {
          try {
            const parsedProjects = JSON.parse(savedProjects);
            parsedProjects.forEach((savedProject: Project) => {
              const exists = combinedProjects.find(p => p.id === savedProject.id);
              if (!exists) {
                combinedProjects.push(savedProject);
              } else {
                const index = combinedProjects.findIndex(p => p.id === savedProject.id);
                if (index !== -1 && savedProject.updated_at && 
                    (!combinedProjects[index].updated_at || 
                     new Date(savedProject.updated_at) > new Date(combinedProjects[index].updated_at))) {
                  combinedProjects[index] = savedProject;
                }
              }
            });
          } catch (error) {
            console.error('Error loading projects:', error);
          }
        }
        setProjects(sortProjects(combinedProjects));
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const sortProjects = (items: Project[]) => {
    const arr = [...items];
    arr.sort((a, b) => {
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 } as const;
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
      if (aPriority !== bPriority) return bPriority - aPriority;
      const aDate = new Date(a.created_at || a.start_date).getTime();
      const bDate = new Date(b.created_at || b.start_date).getTime();
      return bDate - aDate;
    });
    return arr;
  };

  const handleProjectCreated = (newProject: Project) => {
    let updatedProjects = [...projects, newProject];
    
    // Re-sort projects by priority after adding new project
    updatedProjects.sort((a, b) => {
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
      
      // Sort by priority first, then by creation date (newest first)
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      // Secondary sort by date (newest first)
      const aDate = new Date(a.created_at || a.start_date).getTime();
      const bDate = new Date(b.created_at || b.start_date).getTime();
      return bDate - aDate;
    });
    
    setProjects(updatedProjects);
    
    // Update localStorage with all projects that are not from static data
    const customProjects = updatedProjects.filter(p => 
      !projectsData.find(staticProject => staticProject.id === p.id) || 
      (p.updated_at && projectsData.find(staticProject => 
        staticProject.id === p.id && 
        (!staticProject.updated_at || new Date(p.updated_at) > new Date(staticProject.updated_at))
      ))
    );
    localStorage.setItem('projects', JSON.stringify(customProjects));
    
    setShowCreateForm(false);
  };

  

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-gray-600 mt-1">Manage and track all your projects</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Project
        </Button>
      </div>

      {/* Compact Filter Section */}
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </h3>
            <div className="flex gap-2">
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Single Row Filter Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            {/* Search takes more space */}
            <div className="lg:col-span-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Compact filter dropdowns */}
            <div className="lg:col-span-2">
              <Select value={statusFilter} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_status">All Status</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="lg:col-span-2">
              <Select value={priorityFilter} onValueChange={(value) => handleFilterChange('priority', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_priority">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="lg:col-span-2">
              <Select value={skillFilter} onValueChange={(value) => handleFilterChange('skill', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Skills" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_skills">All Skills</SelectItem>
                  {filterOptions.skills.map(skill => (
                    <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="lg:col-span-2">
              <Select value={dateFilter} onValueChange={(value) => handleFilterChange('date', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_dates">All</SelectItem>
                  <SelectItem value="starting_soon">Starting Soon</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="future">Future</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Collapsible Advanced Filters */}
          {(geoFilter || industryFilter || resourceFilter) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t">
              <div>
                <Select value={geoFilter} onValueChange={(value) => handleFilterChange('geo', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_geo">All Locations</SelectItem>
                    {filterOptions.geos.map(geo => (
                      <SelectItem key={geo} value={geo}>{geo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={industryFilter} onValueChange={(value) => handleFilterChange('industry', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_industry">All Industries</SelectItem>
                    {filterOptions.industries.map(industry => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={resourceFilter} onValueChange={(value) => handleFilterChange('resource', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Resources" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_resource">All</SelectItem>
                    <SelectItem value="needs_resources">Needs Resources</SelectItem>
                    <SelectItem value="fully_allocated">Fully Allocated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Active Filter Tags - Compact */}
          {hasActiveFilters && (
            <div className="flex gap-1 flex-wrap">
              {searchTerm && <Badge variant="secondary" className="text-xs">"{searchTerm}"</Badge>}
              {statusFilter && statusFilter !== 'all_status' && <Badge variant="secondary" className="text-xs">{statusFilter}</Badge>}
              {priorityFilter && priorityFilter !== 'all_priority' && <Badge variant="secondary" className="text-xs">{priorityFilter}</Badge>}
              {skillFilter && skillFilter !== 'all_skills' && <Badge variant="secondary" className="text-xs">{skillFilter}</Badge>}
              {dateFilter && dateFilter !== 'all_dates' && <Badge variant="secondary" className="text-xs">{dateFilter.replace('_', ' ')}</Badge>}
              {geoFilter && geoFilter !== 'all_geo' && <Badge variant="secondary" className="text-xs">{geoFilter}</Badge>}
              {industryFilter && industryFilter !== 'all_industry' && <Badge variant="secondary" className="text-xs">{industryFilter}</Badge>}
              {resourceFilter && resourceFilter !== 'all_resource' && <Badge variant="secondary" className="text-xs">{resourceFilter.replace('_', ' ')}</Badge>}
            </div>
          )}
        </div>
      </Card>

      {/* Results Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">
              {filteredProjects.length} Project{filteredProjects.length !== 1 ? 's' : ''}
            </h3>
            {hasActiveFilters && (
              <Badge variant="outline" className="text-xs">
                Filtered Results
              </Badge>
            )}
          </div>
        </div>

        {/* Priority Overview - show when not heavily filtered */}
        {(!hasActiveFilters || filteredProjects.length > 3) && filteredProjects.length > 0 && (
          <PriorityOverview projects={filteredProjects} />
        )}

        {filteredProjects.length === 0 ? (
          hasActiveFilters ? (
            <Card className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects match your filters</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search criteria or clearing the filters.</p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </Card>
          ) : (
            <EmptyProjectsState onCreateProject={() => setShowCreateForm(true)} />
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={(projectId) => navigate(`/projects/${projectId}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Project Creation Form Modal */}
      {showCreateForm && (
        <ProjectCreationForm
          onProjectCreated={handleProjectCreated}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
}

export default ProjectsPage;
