export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: 'Employee' | 'Manager';
  created_at: string;
  updated_at: string;
  name?: string; // Computed full name
  avatar?: string;
  skills?: string[];
  department?: string;
  experience?: number;
  provider?: 'google' | 'credentials';
  accessToken?: string;
  tokenExpiry?: number; // epoch ms
  photoUrl?: string;
}

export interface EmployeeProfile {
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
  type: string;
  user: User;
  // Additional UI fields
  status: 'available' | 'rolling_off' | 'allocated' | 'bench';
  current_client?: string;
  utilization_pct: number;
  target_rate?: number;
  timezone: string;
  employment_type: 'Full-time' | 'Contract';
  primary_skills: string[];
  secondary_skills: string[];
  industry_experience: string[];
  avatar?: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  summary?: string;
  required_seats: number;
  seats_by_type: Record<string, number>;
  start_date: string;
  end_date: string;
  status: 'Open' | 'Closed';
  created_at: string;
  updated_at: string;
  // Additional UI fields
  client_name?: string;
  role_title?: string;
  required_skills?: string[];
  nice_to_have_skills?: string[];
  role_type?: string;
  industry?: string;
  geo_preference?: string;
  duration_weeks?: number;
  priority?: 'low' | 'medium' | 'high';
  progress?: number;
  budget?: number;
  project_manager?: string;
}

export interface ProjectAllocation {
  id: number;
  project_id: number;
  employee_id: number;
  allocation_type: 'Full-time' | 'Part-time' | 'Extra';
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  project?: Project;
  employee?: User;
}