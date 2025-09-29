import { useMemo } from 'react';

interface EmployeeLike {
  user_id: number;
  user: { first_name: string; last_name: string };
  primary_skills: string[];
  secondary_skills: string[];
  geo: string;
  availability_flag: boolean;
  status: string;
}

interface UseEmployeeFiltersParams {
  employees: EmployeeLike[];
  allocations: { employee_id: number }[];
  searchQuery: string;
  skillsFilter: string;
  locationFilter: string;
  availabilityFilter: string;
}

export function useEmployeeFilters({ employees, allocations, searchQuery, skillsFilter, locationFilter, availabilityFilter }: UseEmployeeFiltersParams) {
  return useMemo(() => {
    return employees.filter(emp => {
      // Skip employees already allocated to the project
      const isAllocated = allocations.some(alloc => alloc.employee_id === emp.user_id);
      if (isAllocated) return false;
      
      // Search filter: name or skills
      const matchesSearch = !searchQuery || 
        `${emp.user.first_name} ${emp.user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.primary_skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        emp.secondary_skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Skills filter: check both primary and secondary skills
      const matchesSkills = !skillsFilter || 
        emp.primary_skills.some(skill => skill.toLowerCase().includes(skillsFilter.toLowerCase())) ||
        emp.secondary_skills.some(skill => skill.toLowerCase().includes(skillsFilter.toLowerCase()));
      
      // Location filter: check geo field
      const matchesLocation = !locationFilter || 
        emp.geo.toLowerCase().includes(locationFilter.toLowerCase());
      
      // Availability filter: comprehensive status and availability checking
      const matchesAvailability = availabilityFilter === 'all' || 
        (availabilityFilter === 'available' && (emp.availability_flag === true || emp.status === 'available')) ||
        (availabilityFilter === 'bench' && emp.status === 'bench');
      
      return matchesSearch && matchesSkills && matchesLocation && matchesAvailability;
    });
  }, [employees, allocations, searchQuery, skillsFilter, locationFilter, availabilityFilter]);
}
