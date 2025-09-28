import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { EmployeeCard } from '../ui/EmployeeCard';
import { AllocationDialog } from '../ui/AllocationDialog';
import { employeesData, getAvailableEmployees, getRollingOffEmployees, getAllocatedEmployees, getBenchEmployees } from '../../data/employees';
import { 
  Users, 
  Search, 
  Filter, 
  Download,
  UserCheck,
  AlertTriangle,
  TrendingUp,
  User,
  MoreHorizontal
} from 'lucide-react';
import toast from 'react-hot-toast';

export function AllEmployeesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [geoFilter, setGeoFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'compact'>('cards');
  const [allocationDialog, setAllocationDialog] = useState<{
    open: boolean;
    employee: any;
  }>({
    open: false,
    employee: null
  });

  // Initialize filters from URL parameters
  useEffect(() => {
    const statusParam = searchParams.get('status');
    const skillParam = searchParams.get('skill');
    const geoParam = searchParams.get('geo');
    const industryParam = searchParams.get('industry');
    const searchParam = searchParams.get('search');
    const availabilityParam = searchParams.get('availability');

    if (statusParam) setStatusFilter(statusParam);
    if (skillParam) setSkillFilter(skillParam);
    if (geoParam) setGeoFilter(geoParam);
    if (industryParam) setIndustryFilter(industryParam);
    if (searchParam) setSearchTerm(searchParam);
    if (availabilityParam) setAvailabilityFilter(availabilityParam);
  }, [searchParams]);

  // Get all unique values for filters
  const allSkills = useMemo(() => {
    const skills = new Set<string>();
    employeesData.forEach(emp => {
      emp.primary_skills.forEach(skill => skills.add(skill));
      emp.secondary_skills.forEach(skill => skills.add(skill));
    });
    return Array.from(skills).sort();
  }, []);

  const allGeos = useMemo(() => {
    const geos = new Set(employeesData.map(emp => emp.geo));
    return Array.from(geos).sort();
  }, []);

  const allIndustries = useMemo(() => {
    const industries = new Set<string>();
    employeesData.forEach(emp => {
      emp.industry_experience.forEach(industry => industries.add(industry));
    });
    return Array.from(industries).sort();
  }, []);

  const allStatuses = ['available', 'allocated', 'rolling_off', 'bench'];

  // Filter employees based on search and filters
  const filteredEmployees = useMemo(() => {
    return employeesData.filter(employee => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        `${employee.user.first_name} ${employee.user.last_name}`.toLowerCase().includes(searchLower) ||
        employee.user.email.toLowerCase().includes(searchLower) ||
        employee.type.toLowerCase().includes(searchLower);

      // Skill filter
      const matchesSkill = !skillFilter || skillFilter === 'all_skills' ||
        employee.primary_skills.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase())) ||
        employee.secondary_skills.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()));

      // Status filter
      const matchesStatus = !statusFilter || statusFilter === 'all_status' || employee.status === statusFilter;

      // Geography filter
      const matchesGeo = !geoFilter || geoFilter === 'all_locations' || employee.geo === geoFilter;

      // Industry filter
      const matchesIndustry = !industryFilter || industryFilter === 'all_industries' ||
        employee.industry_experience.some(industry => industry.toLowerCase().includes(industryFilter.toLowerCase()));

      // Availability filter
      const matchesAvailability = !availabilityFilter || availabilityFilter === 'all_availability' ||
        (availabilityFilter === 'available_extra' && employee.availability_flag) ||
        (availabilityFilter === 'not_available_extra' && !employee.availability_flag);

      return matchesSearch && matchesSkill && matchesStatus && matchesGeo && matchesIndustry && matchesAvailability;
    });
  }, [searchTerm, skillFilter, statusFilter, geoFilter, industryFilter, availabilityFilter]);

  // Get summary statistics
  const stats = useMemo(() => {
    const available = getAvailableEmployees();
    const allocated = getAllocatedEmployees();
    const rollingOff = getRollingOffEmployees();
    const bench = getBenchEmployees();

    return {
      total: employeesData.length,
      available: available.length,
      allocated: allocated.length,
      rollingOff: rollingOff.length,
      bench: bench.length,
      averageUtilization: Math.round(employeesData.reduce((sum, emp) => sum + emp.utilization_pct, 0) / employeesData.length)
    };
  }, []);

  const handleAllocate = (employeeId: number) => {
    const employee = employeesData.find(emp => emp.user_id === employeeId);
    if (employee) {
      setAllocationDialog({
        open: true,
        employee: employee
      });
    } else {
      toast.error('Employee not found');
    }
  };

  const handleAllocationSuccess = (allocationResult: any) => {
    // In a real app, this would update the employee status and refresh data
    const employeeName = allocationDialog.employee 
      ? `${allocationDialog.employee.user.first_name} ${allocationDialog.employee.user.last_name}`
      : 'Employee';
    
    toast.success(
      `${employeeName} has been successfully allocated! Status updated.`,
      { duration: 4000 }
    );
    
    // Simulate data refresh with a small delay
    setTimeout(() => {
      toast.success('Employee data refreshed', { duration: 2000 });
    }, 1000);
    
    // You could trigger a data refresh here
    // For now, we just show success messages as the mock API doesn't actually update data
  };

  const handleExport = () => {
    toast.success('Exporting employee data...');
    // TODO: Implement export functionality
  };

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

  const clearFilters = () => {
    setSearchTerm('');
    setSkillFilter('');
    setStatusFilter('');
    setGeoFilter('');
    setIndustryFilter('');
    setAvailabilityFilter('');
    setSearchParams(new URLSearchParams());
  };

  // Filter change handlers that update both state and URL
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    updateURLParams({ 
      search: value, 
      skill: skillFilter, 
      status: statusFilter, 
      geo: geoFilter, 
      industry: industryFilter, 
      availability: availabilityFilter 
    });
  };

  const handleSkillFilterChange = (value: string) => {
    setSkillFilter(value);
    updateURLParams({ 
      search: searchTerm, 
      skill: value, 
      status: statusFilter, 
      geo: geoFilter, 
      industry: industryFilter, 
      availability: availabilityFilter 
    });
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    updateURLParams({ 
      search: searchTerm, 
      skill: skillFilter, 
      status: value, 
      geo: geoFilter, 
      industry: industryFilter, 
      availability: availabilityFilter 
    });
  };

  const handleGeoFilterChange = (value: string) => {
    setGeoFilter(value);
    updateURLParams({ 
      search: searchTerm, 
      skill: skillFilter, 
      status: statusFilter, 
      geo: value, 
      industry: industryFilter, 
      availability: availabilityFilter 
    });
  };

  const handleIndustryFilterChange = (value: string) => {
    setIndustryFilter(value);
    updateURLParams({ 
      search: searchTerm, 
      skill: skillFilter, 
      status: statusFilter, 
      geo: geoFilter, 
      industry: value, 
      availability: availabilityFilter 
    });
  };

  const handleAvailabilityFilterChange = (value: string) => {
    setAvailabilityFilter(value);
    updateURLParams({ 
      search: searchTerm, 
      skill: skillFilter, 
      status: statusFilter, 
      geo: geoFilter, 
      industry: industryFilter, 
      availability: value 
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Employees</h1>
          <p className="text-gray-600 mt-1">Manage and view all employees in your organization</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Available</p>
              <p className="text-2xl font-bold text-green-600">{stats.available}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Allocated</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.allocated}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Rolling Off</p>
              <p className="text-2xl font-bold text-amber-600">{stats.rollingOff}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Utilization</p>
              <p className="text-2xl font-bold text-purple-600">{stats.averageUtilization}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFilters}
                className="text-xs"
              >
                Clear All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'cards' ? 'compact' : 'cards')}
                className="text-xs"
              >
                <MoreHorizontal className="h-4 w-4 mr-1" />
                {viewMode === 'cards' ? 'Compact' : 'Cards'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="md:col-span-2 lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Select value={skillFilter} onValueChange={handleSkillFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Skills" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_skills">All Skills</SelectItem>
                  {allSkills.map(skill => (
                    <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_status">All Status</SelectItem>
                  {allStatuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={geoFilter} onValueChange={handleGeoFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_locations">All Locations</SelectItem>
                  {allGeos.map(geo => (
                    <SelectItem key={geo} value={geo}>{geo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={industryFilter} onValueChange={handleIndustryFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_industries">All Industries</SelectItem>
                  {allIndustries.map(industry => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-6 gap-4">
            <div className="lg:col-start-6">
              <Select value={availabilityFilter} onValueChange={handleAvailabilityFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Extra Hours" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_availability">All</SelectItem>
                  <SelectItem value="available_extra">Available for extra</SelectItem>
                  <SelectItem value="not_available_extra">Not available for extra</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {filteredEmployees.length} Employee{filteredEmployees.length !== 1 ? 's' : ''} Found
          </h3>
          {(searchTerm || (skillFilter && skillFilter !== 'all_skills') || (statusFilter && statusFilter !== 'all_status') || (geoFilter && geoFilter !== 'all_locations') || (industryFilter && industryFilter !== 'all_industries') || (availabilityFilter && availabilityFilter !== 'all_availability')) && (
            <div className="flex gap-2 flex-wrap">
              {searchTerm && <Badge variant="secondary">Search: "{searchTerm}"</Badge>}
              {skillFilter && skillFilter !== 'all_skills' && <Badge variant="secondary">Skill: {skillFilter}</Badge>}
              {statusFilter && statusFilter !== 'all_status' && <Badge variant="secondary">Status: {statusFilter}</Badge>}
              {geoFilter && geoFilter !== 'all_locations' && <Badge variant="secondary">Location: {geoFilter}</Badge>}
              {industryFilter && industryFilter !== 'all_industries' && <Badge variant="secondary">Industry: {industryFilter}</Badge>}
              {availabilityFilter && availabilityFilter !== 'all_availability' && <Badge variant="secondary">Extra Hours: {availabilityFilter.replace('_', ' ')}</Badge>}
            </div>
          )}
        </div>

        {filteredEmployees.length === 0 ? (
          <Card className="p-12 text-center">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search criteria or clearing the filters.</p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </Card>
        ) : (
          <div className={viewMode === 'cards' 
            ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" 
            : "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4"
          }>
            {filteredEmployees.map(employee => (
              <EmployeeCard
                key={employee.user_id}
                employee={employee}
                onAllocate={handleAllocate}
                compact={viewMode === 'compact'}
              />
            ))}
          </div>
        )}
      </div>

      {/* Allocation Dialog */}
      {allocationDialog.employee && (
        <AllocationDialog
          open={allocationDialog.open}
          onOpenChange={(open) => setAllocationDialog({ open, employee: open ? allocationDialog.employee : null })}
          employee={allocationDialog.employee}
          onSuccess={handleAllocationSuccess}
        />
      )}
    </div>
  );
}

export default AllEmployeesPage;
