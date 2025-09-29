export { default as EmployeeProfileService } from './employeeProfileService';
export { default as ProjectAllocationService } from './projectAllocationService';
export { default as ProjectService } from './projectService';
// Export API client
export { apiService } from './api/client';

// Re-export types for convenience
export type { ProjectAllocation } from '../data/allocations';
export type { Employee } from '../data/employees';
export type {
    ApiResponse, BackendEmployeeProfile, BackendProject,
    BackendProjectAllocation, BackendUser
} from '../types/api';

