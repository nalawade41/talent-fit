import { apiService } from './api/client';
import type { Employee } from '../data/employees';
import type { BackendEmployeeProfile } from '../types/api';

export type ManagerDashboardMetrics = {
  availableEngineers: number;
  activeProjects: number;
  rollingOffSoon: number;
  benchResources: number;
  allocatedEngineers: number;
};

// Convert backend response to frontend Employee type
const convertToEmployee = (backendProfile: BackendEmployeeProfile): Employee => {
  const firstName = backendProfile.user.first_name || '';
  const lastName = backendProfile.user.last_name || '';
  
  // Determine status based on availability and dates
  let status: Employee['status'] = 'available';
  if (backendProfile.notice_date) {
    status = 'rolling_off';
  } else if (!backendProfile.availability_flag) {
    status = 'allocated';
  } else if (backendProfile.availability_flag && !backendProfile.end_date) {
    status = 'bench';
  }

  // Split skills into primary and secondary (first 3 as primary, rest as secondary)
  const primarySkills = backendProfile.skills.slice(0, 3);
  const secondarySkills = backendProfile.skills.slice(3);

  return {
    employee_id: backendProfile.id,
    user_id: backendProfile.user_id,
    geo: backendProfile.geo,
    date_of_joining: backendProfile.date_of_joining,
    end_date: backendProfile.end_date,
    notice_date: backendProfile.notice_date,
    type: backendProfile.department || (backendProfile as any).type || 'Employee',
    skills: backendProfile.skills,
    years_of_experience: backendProfile.years_of_experience,
    industry: backendProfile.industry.map(industryStr => {
      // Handle both old format (string) and new format (string with years)
      if (industryStr.includes('|')) {
        const [industryName, years] = industryStr.split('|');
        return {
          industry: industryName,
          years: Number(years) || 1
        };
      } else {
        // Fallback for simple string format
        return {
          industry: industryStr,
          years: 1
        };
      }
    }),
    availability_flag: backendProfile.availability_flag,
    created_at: backendProfile.created_at,
    updated_at: backendProfile.updated_at,
    department: backendProfile.department,
    user: {
      id: backendProfile.user.id,
      first_name: firstName,
      last_name: lastName,
      email: backendProfile.user.email,
      role: backendProfile.user.role,
      created_at: backendProfile.user.created_at,
      updated_at: backendProfile.user.updated_at,
    },
    // UI-specific fields with defaults
    status,
    current_client: undefined, // This would need to come from project allocations
    utilization_pct: backendProfile.availability_flag ? 0 : 100, // Default assumption
    target_rate: undefined,
    timezone: 'UTC', // Default, could be enhanced later
    employment_type: 'Full-time', // Default, could be enhanced later
    primary_skills: primarySkills,
    secondary_skills: secondarySkills,
    industry_experience: backendProfile.industry,
    avatar: undefined, // Could be enhanced later
  };
};

export interface EmployeeFilterParams {
  skills?: string[];
  geo?: string[];
  available?: boolean;
}

export class ManagerService {
  static async getDashboardMetrics(): Promise<ManagerDashboardMetrics> {
    return await apiService.get<ManagerDashboardMetrics>(`/api/v1/manager/dashboard/metrics`);
  }

  static async getAllEmployees(params?: EmployeeFilterParams): Promise<Employee[]> {
    const query = new URLSearchParams();
    if (params?.skills?.length) query.set('skills', params.skills.join(','));
    if (params?.geo?.length) query.set('geo', params.geo.join(','));
    if (typeof params?.available === 'boolean') query.set('available', String(params.available));
    
    const url = `/api/v1/employees${query.toString() ? `?${query.toString()}` : ''}`;
    const response = await apiService.get<BackendEmployeeProfile[] | any>(url);
    const list = Array.isArray(response?.data) ? response.data : response; // support wrapped or raw arrays
    return (list || []).map(convertToEmployee);
  }
}

export default ManagerService;


