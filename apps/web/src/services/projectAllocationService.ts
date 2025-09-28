import { apiService } from './api/client';
import type { BackendProjectAllocation, ApiResponse } from '../types/api';
import type { ProjectAllocation } from '../data/allocations';

// Convert backend project allocation to frontend type
const convertToProjectAllocation = (backendAllocation: BackendProjectAllocation): ProjectAllocation => {
  return {
    id: backendAllocation.id,
    project_id: backendAllocation.project_id,
    employee_id: backendAllocation.employee_id,
    allocation_type: backendAllocation.allocation_type,
    start_date: backendAllocation.start_date,
    end_date: backendAllocation.end_date,
    created_at: backendAllocation.created_at,
    updated_at: backendAllocation.updated_at,
    // Convert nested project if available
    project: backendAllocation.project ? {
      id: backendAllocation.project.id,
      name: backendAllocation.project.name,
      description: backendAllocation.project.description,
      summary: backendAllocation.project.summary, 
      required_seats: backendAllocation.project.required_seats,
      seats_by_type: backendAllocation.project.seats_by_type,
      start_date: backendAllocation.project.start_date,
      end_date: backendAllocation.project.end_date,
      status: backendAllocation.project.status,
      created_at: backendAllocation.project.created_at,
      updated_at: backendAllocation.project.updated_at,
    } : undefined,
    // Convert nested employee if available
    employee: backendAllocation.employee ? {
      id: backendAllocation.employee.id,
      first_name: backendAllocation.employee.first_name.split(' ')[0] || '',
      last_name: backendAllocation.employee.first_name.split(' ').slice(1).join(' ') || '',
      email: backendAllocation.employee.email,
      role: backendAllocation.employee.role as 'Employee' | 'Manager',
      created_at: backendAllocation.employee.created_at,
      updated_at: backendAllocation.employee.updated_at,
      name: backendAllocation.employee.first_name,
    } : undefined,
  };
};

export class ProjectAllocationService {
  // Get project allocations for a specific employee
  static async getEmployeeAllocations(employeeId: number): Promise<ProjectAllocation[]> {
    try {
      const response = await apiService.get<ApiResponse<BackendProjectAllocation[]>>(
        `/api/v1/employee/${employeeId}/projects`
      ) as any;
      
      return response?.map(convertToProjectAllocation) || [];
    } catch (error) {
      console.error('Error fetching employee allocations:', error);
      throw error;
    }
  }
}

export default ProjectAllocationService;
