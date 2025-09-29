import { Filter, Search, X } from 'lucide-react';
import { FilterState } from '../../hooks/useProjectFilters';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface ProjectFiltersProps {
  filterState: FilterState;
  filterOptions: {
    skills: string[];
    geos: string[];
    industries: string[];
  };
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onFilterChange: (filterType: string, value: string) => void;
  onClearFilters: () => void;
}

export function ProjectFilters({
  filterState,
  filterOptions,
  hasActiveFilters,
  onSearchChange,
  onFilterChange,
  onClearFilters
}: ProjectFiltersProps) {
  const {
    searchTerm,
    statusFilter,
    priorityFilter,
    skillFilter,
    dateFilter,
    geoFilter,
    industryFilter,
    resourceFilter
  } = filterState;

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </h3>
          <div className="flex gap-2">
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={onClearFilters}>
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
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Compact filter dropdowns */}
          <div className="lg:col-span-2">
            <Select value={statusFilter} onValueChange={(value) => onFilterChange('status', value)}>
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
            <Select value={priorityFilter} onValueChange={(value) => onFilterChange('priority', value)}>
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
            <Select value={skillFilter} onValueChange={(value) => onFilterChange('skill', value)}>
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
            <Select value={dateFilter} onValueChange={(value) => onFilterChange('date', value)}>
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
              <Select value={geoFilter} onValueChange={(value) => onFilterChange('geo', value)}>
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
              <Select value={industryFilter} onValueChange={(value) => onFilterChange('industry', value)}>
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
              <Select value={resourceFilter} onValueChange={(value) => onFilterChange('resource', value)}>
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
  );
}
