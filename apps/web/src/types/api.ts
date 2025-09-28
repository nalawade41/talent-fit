// Backend API Response Types
export interface BackendUser {
  id: number;
  name: string;
  email: string;
  role: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface BackendEmployeeProfile {
  id: number;
  user_id: number;
  geo: string;
  date_of_joining: string | null;
  end_date: string | null;
  notice_date: string | null;
  skills: string[];
  years_of_experience: number;
  industry: string;
  availability_flag: boolean;
  created_at: string;
  updated_at: string;
  user: BackendUser;
}

// Backend Project Types
export interface BackendProject {
  id: number;
  name: string;
  description: string;
  summary: string;
  required_seats: number;
  seats_by_type: Record<string, number>;
  start_date: string;
  end_date: string;
  status: 'Open' | 'Closed';
  created_at: string;
  updated_at: string;
}

// Backend Project Allocation Types
export interface BackendProjectAllocation {
  id: number;
  project_id: number;
  employee_id: number;
  allocation_type: 'Full-time' | 'Part-time' | 'Extra';
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  project?: BackendProject;
  employee?: BackendUser;
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
