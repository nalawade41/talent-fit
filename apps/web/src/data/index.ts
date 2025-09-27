// Central export file for all dummy data
// This makes it easy to import any data from a single location

// Employee data
export * from './employees';
export { employeesData } from './employees';

// Project data  
export * from './projects';
export { projectsData } from './projects';

// Allocation data
export * from './allocations';
export { projectAllocationsData } from './allocations';

// Matching and AI suggestions data
export * from './matches';
export { matchesData, alertsData } from './matches';

// Notifications data
export * from './notifications';
export { notificationsData } from './notifications';

// Metadata and configuration
export * from './metadata';
export { 
  skillsData, 
  industriesData, 
  geoData, 
  roleTypes, 
  employmentTypes, 
  allocationTypes,
  projectStatuses,
  employeeStatuses,
  priorityLevels,
  appConfig 
} from './metadata';

// Sample usage functions and utilities
export const sampleData = {
  // Quick access to commonly used data sets
  employees: () => import('./employees').then(m => m.employeesData),
  projects: () => import('./projects').then(m => m.projectsData),
  allocations: () => import('./allocations').then(m => m.projectAllocationsData),
  matches: () => import('./matches').then(m => m.matchesData),
  notifications: () => import('./notifications').then(m => m.notificationsData),
  
  // Dashboard stats
  dashboardStats: () => ({
    totalEmployees: 8,
    availableEmployees: 3,
    rollingOffSoon: 2,
    activeProjects: 7,
    criticalAlerts: 2,
    pendingMatches: 8
  }),

  // Manager dashboard quick filters
  quickFilters: {
    availableEngineers: () => import('./employees').then(m => m.getAvailableEmployees()),
    rollingOffEngineers: () => import('./employees').then(m => m.getRollingOffEmployees()),
    urgentProjects: () => import('./projects').then(m => m.getUrgentProjects()),
    highPriorityAlerts: () => import('./matches').then(m => m.getHighPriorityAlerts())
  }
};

// Authentication mock data
export const mockAuthUser = {
  id: 100,
  email: "manager@company.com",
  name: "Sarah Johnson",
  role: "Manager",
  avatar: "/avatars/manager.jpg",
  permissions: ["view_all_employees", "manage_projects", "view_analytics"]
};

// API mock responses for development
export const mockApiResponses = {
  // GET /api/v1/employees
  employees: {
    data: () => import('./employees').then(m => m.employeesData),
    meta: { page: 1, pageSize: 20, total: 8 }
  },
  
  // GET /api/v1/projects  
  projects: {
    data: () => import('./projects').then(m => m.projectsData),
    meta: { page: 1, pageSize: 20, total: 7 }
  },
  
  // GET /api/v1/notifications
  notifications: {
    data: () => import('./notifications').then(m => m.notificationsData),
    meta: { page: 1, pageSize: 20, total: 10 }
  }
};
