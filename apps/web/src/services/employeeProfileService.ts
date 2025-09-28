import type { Employee } from '../data/employees';
import type { ApiResponse, BackendEmployeeProfile } from '../types/api';
import { apiService } from './api/client';

// Convert backend response to frontend Employee type
const convertToEmployee = (backendProfile: BackendEmployeeProfile): Employee => {
  // Split name from backend user.name field
  const nameParts = backendProfile.user.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

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
    type: backendProfile.user.type,
    skills: backendProfile.skills,
    years_of_experience: backendProfile.years_of_experience,
    industry: backendProfile.industry,
    availability_flag: backendProfile.availability_flag,
    created_at: backendProfile.created_at,
    updated_at: backendProfile.updated_at,
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
    industry_experience: [backendProfile.industry], // Convert single industry to array
    avatar: undefined, // Could be enhanced later
  };
};

export class EmployeeProfileService {
  // Get employee profile by user ID
  static async getEmployeeProfile(userId: number): Promise<Employee> {
    try {
      const response = await apiService.get<ApiResponse<BackendEmployeeProfile>>(
        `/api/v1/employee/${userId}`
      );
      
      return convertToEmployee(response.data);
    } catch (error) {
      console.error('Error fetching employee profile:', error);
      throw error;
    }
  }
}

export default EmployeeProfileService;
