export interface User {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'manager';
  avatar?: string;
  skills?: string[];
  department?: string;
  experience?: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  status: 'open' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdBy: string;
  assignedTo?: string;
  deadline: string;
  createdAt: string;
}

export interface Alert {
  id: string;
  type: 'talent-match' | 'project-update' | 'deadline';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  createdAt: string;
  projectId?: string;
  userId?: string;
}