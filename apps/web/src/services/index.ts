// Export API client
export { apiService } from './api/client';

// Export services
export { default as EmployeeProfileService } from './employeeProfileService';
export { default as ProjectAllocationService } from './projectAllocationService';

// Re-export types for convenience
export type { 
  BackendEmployeeProfile, 
  BackendUser, 
  BackendProject,
  BackendProjectAllocation,
  ApiResponse 
} from '../types/api';
export type { Employee } from '../data/employees';
export type { ProjectAllocation } from '../data/allocations';
