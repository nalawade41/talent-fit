// Project Allocation dummy data
export interface ProjectAllocation {
  id: number;
  project_id: number;
  employee_id: number;
  allocation_type: 'Full-time' | 'Part-time' | 'Extra';
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  project?: {
    id: number;
    name: string;
    description: string;
    required_seats: number;
    seats_by_type: Record<string, number>;
    start_date: string;
    end_date: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
  employee?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  };
}

export const projectAllocationsData: ProjectAllocation[] = [
  {
    id: 1,
    project_id: 456,
    employee_id: 3,
    allocation_type: "Full-time",
    start_date: "2023-10-01T00:00:00Z",
    end_date: "2024-03-31T00:00:00Z",
    created_at: "2023-09-25T10:00:00Z",
    updated_at: "2023-09-25T10:00:00Z",
    project: {
      id: 456,
      name: "Talent Matching Platform",
      description: "AI-powered talent matching system",
      required_seats: 5,
      seats_by_type: {
        "Frontend Dev": 2,
        "Backend Dev": 2,
        "UI": 1
      },
      start_date: "2023-10-01T00:00:00Z",
      end_date: "2024-06-30T00:00:00Z",
      status: "Open",
      created_at: "2023-09-20T10:00:00Z",
      updated_at: "2023-09-20T10:00:00Z"
    },
    employee: {
      id: 3,
      first_name: "Alex",
      last_name: "Johnson",
      email: "alex.johnson@company.com",
      role: "Employee"
    }
  },
  {
    id: 2,
    project_id: 789,
    employee_id: 2,
    allocation_type: "Full-time",
    start_date: "2023-08-01T00:00:00Z",
    end_date: "2024-03-31T00:00:00Z",
    created_at: "2023-07-25T10:00:00Z",
    updated_at: "2023-07-25T10:00:00Z",
    project: {
      id: 789,
      name: "Legacy System Migration",
      description: "Migrate legacy systems to modern architecture",
      required_seats: 3,
      seats_by_type: {
        "Backend Dev": 2,
        "Frontend Dev": 1
      },
      start_date: "2023-08-01T00:00:00Z",
      end_date: "2023-12-31T00:00:00Z",
      status: "Open",
      created_at: "2023-07-20T10:00:00Z",
      updated_at: "2023-07-20T10:00:00Z"
    },
    employee: {
      id: 2,
      first_name: "Jane",
      last_name: "Smith",
      email: "jane.smith@company.com",
      role: "Employee"
    }
  },
  {
    id: 3,
    project_id: 1002,
    employee_id: 4,
    allocation_type: "Full-time",
    start_date: "2023-11-01T00:00:00Z",
    end_date: "2024-07-30T00:00:00Z",
    created_at: "2023-10-20T10:00:00Z",
    updated_at: "2023-10-20T10:00:00Z",
    project: {
      id: 1002,
      name: "Healthcare AI Analytics",
      description: "Machine learning platform for medical data analysis",
      required_seats: 3,
      seats_by_type: {
        "AI": 2,
        "Backend Dev": 1
      },
      start_date: "2023-11-01T00:00:00Z",
      end_date: "2024-07-30T00:00:00Z",
      status: "Open",
      created_at: "2023-10-15T10:00:00Z",
      updated_at: "2023-10-15T10:00:00Z"
    },
    employee: {
      id: 4,
      first_name: "Sarah",
      last_name: "Chen",
      email: "sarah.chen@company.com",
      role: "Employee"
    }
  },
  {
    id: 4,
    project_id: 1002,
    employee_id: 7,
    allocation_type: "Part-time",
    start_date: "2023-11-01T00:00:00Z",
    end_date: "2024-02-28T00:00:00Z",
    created_at: "2023-10-25T10:00:00Z",
    updated_at: "2023-10-25T10:00:00Z",
    project: {
      id: 1002,
      name: "Healthcare AI Analytics",
      description: "Machine learning platform for medical data analysis",
      required_seats: 3,
      seats_by_type: {
        "AI": 2,
        "Backend Dev": 1
      },
      start_date: "2023-11-01T00:00:00Z",
      end_date: "2024-07-30T00:00:00Z",
      status: "Open",
      created_at: "2023-10-15T10:00:00Z",
      updated_at: "2023-10-15T10:00:00Z"
    },
    employee: {
      id: 7,
      first_name: "David",
      last_name: "Brown",
      email: "david.brown@company.com",
      role: "Employee"
    }
  },
  {
    id: 5,
    project_id: 1001,
    employee_id: 5,
    allocation_type: "Full-time",
    start_date: "2023-12-01T00:00:00Z",
    end_date: "2024-08-31T00:00:00Z",
    created_at: "2023-11-15T10:00:00Z",
    updated_at: "2023-11-15T10:00:00Z",
    project: {
      id: 1001,
      name: "E-commerce Mobile App",
      description: "Cross-platform mobile application development",
      required_seats: 4,
      seats_by_type: {
        "Frontend Dev": 2,
        "Backend Dev": 1,
        "UI": 1
      },
      start_date: "2024-01-15T00:00:00Z",
      end_date: "2024-08-31T00:00:00Z",
      status: "Open",
      created_at: "2023-11-20T10:00:00Z",
      updated_at: "2023-11-20T10:00:00Z"
    },
    employee: {
      id: 5,
      first_name: "Mike",
      last_name: "Wilson",
      email: "mike.wilson@company.com",
      role: "Employee"
    }
  }
];

// Helper functions for allocation data
export const getAllocationsByProject = (projectId: number) =>
  projectAllocationsData.filter(allocation => allocation.project_id === projectId);

export const getAllocationsByEmployee = (employeeId: number) =>
  projectAllocationsData.filter(allocation => allocation.employee_id === employeeId);

export const getActiveAllocations = () => {
  const now = new Date();
  return projectAllocationsData.filter(allocation => {
    const startDate = new Date(allocation.start_date);
    const endDate = allocation.end_date ? new Date(allocation.end_date) : null;
    return startDate <= now && (!endDate || endDate >= now);
  });
};

export const getEndingSoonAllocations = (daysFromNow: number = 30) => {
  const now = new Date();
  const futureDate = new Date(now.getTime() + (daysFromNow * 24 * 60 * 60 * 1000));
  
  return projectAllocationsData.filter(allocation => {
    if (!allocation.end_date) return false;
    const endDate = new Date(allocation.end_date);
    return endDate >= now && endDate <= futureDate;
  });
};
