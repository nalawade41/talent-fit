import type { Project } from '../types';
import type { ApiResponse, BackendProject } from '../types/api';
import { apiService } from './api/client';

// Request type for project creation
export interface CreateProjectRequest {
  name: string;
  description: string;
  required_seats: number;
  seats_by_type: Record<string, number>;
  start_date: string; // ISO date string
  end_date: string;   // ISO date string
  status?: 'Open' | 'Closed';
  client_name?: string;
  industry?: string;
  geo_preference?: string;
  priority?: string;
  budget?: number;
}

// Convert backend project to frontend type
const convertToProject = (backendProject: BackendProject): Project => {
  // Calculate duration in weeks
  const startDate = new Date(backendProject.start_date);
  const endDate = new Date(backendProject.end_date);
  const durationWeeks = Math.ceil((endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));

  // Ensure priority is one of the allowed values
  const validPriority = ['low', 'medium', 'high'].includes(backendProject.priority) 
    ? backendProject.priority as 'low' | 'medium' | 'high'
    : 'medium';

  return {
    id: backendProject.id,
    name: backendProject.name,
    description: backendProject.description,
    required_seats: backendProject.required_seats,
    seats_by_type: backendProject.seats_by_type,
    start_date: backendProject.start_date,
    end_date: backendProject.end_date,
    status: backendProject.status,
    created_at: backendProject.created_at,
    updated_at: backendProject.updated_at,
    client_name: backendProject.client_name,
    industry: backendProject.industry,
    geo_preference: backendProject.geo_preference,
    priority: validPriority,
    budget: backendProject.budget,
    duration_weeks: durationWeeks,
    
    // Add missing optional fields from Project interface
    summary: backendProject.summary,
    role_title: undefined,
    required_skills: [],
    nice_to_have_skills: [],
    role_type: undefined,
    progress: 0,
    project_manager: undefined
  };
};

class ProjectService {
  async getAllProjects(): Promise<Project[]> {
    const backendProjects = await apiService.get<BackendProject[]>(
      '/api/v1/projects'
    );
    return (backendProjects || []).map(convertToProject);
  }

  async getProjectById(id: number): Promise<Project> {
    const backendProject = await apiService.get<BackendProject>(
      `/api/v1/project/${id}`
    );
    return convertToProject(backendProject);
  }

  async updateProject(id: number, payload: Partial<BackendProject>): Promise<Project> {
    const updated = await apiService.patch<BackendProject>(
      `/api/v1/project/${id}`,
      payload
    );
    return convertToProject(updated);
  }
  /**
   * Create a new project
   */
  async createProject(projectData: CreateProjectRequest): Promise<Project> {
    const response = await apiService.post<ApiResponse<BackendProject>>(
      '/api/v1/projects',
      {
        ...projectData,
      }
    ) as any;

    if (!response) {
      throw new Error(response || 'Failed to create project');
    }

    return convertToProject(response);
  }
}

// Export singleton instance
const projectService = new ProjectService();
export default projectService;
