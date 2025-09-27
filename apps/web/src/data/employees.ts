// Employee Profile dummy data
export interface Employee {
  user_id: number;
  geo: string;
  date_of_joining: string | null;
  end_date: string | null;
  notice_date: string | null;
  type: string;
  skills: string[];
  years_of_experience: number;
  industry: string;
  availability_flag: boolean;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    created_at: string;
    updated_at: string;
  };
  // Additional fields for UI
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

export const employeesData: Employee[] = [
  {
    user_id: 1,
    geo: "US-West",
    date_of_joining: "2022-03-15T00:00:00Z",
    end_date: "2025-03-15T00:00:00Z",
    notice_date: null,
    type: "Frontend Dev",
    skills: ["React", "TypeScript", "Node.js", "CSS", "Tailwind"],
    years_of_experience: 5,
    industry: "Technology",
    availability_flag: true,
    created_at: "2022-03-10T10:00:00Z",
    updated_at: "2023-11-15T14:30:00Z",
    status: "available",
    current_client: undefined,
    utilization_pct: 0,
    timezone: "UTC-8",
    employment_type: "Full-time",
    primary_skills: ["React", "TypeScript", "JavaScript"],
    secondary_skills: ["Node.js", "CSS", "Tailwind"],
    industry_experience: ["Technology", "E-commerce"],
    avatar: "/avatars/john-doe.jpg",
    user: {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@company.com",
      role: "Employee",
      created_at: "2022-03-10T10:00:00Z",
      updated_at: "2022-03-10T10:00:00Z"
    }
  },
  {
    user_id: 2,
    geo: "US-East",
    date_of_joining: "2021-08-20T00:00:00Z",
    end_date: "2024-08-20T00:00:00Z",
    notice_date: "2024-06-20T00:00:00Z",
    type: "Backend Dev",
    skills: ["Go", "PostgreSQL", "Docker", "Kubernetes", "AWS"],
    years_of_experience: 7,
    industry: "Fintech",
    availability_flag: false,
    created_at: "2021-08-15T10:00:00Z",
    updated_at: "2023-11-20T09:45:00Z",
    status: "rolling_off",
    current_client: "FinanceCorpABC",
    utilization_pct: 100,
    timezone: "UTC-5",
    employment_type: "Full-time",
    primary_skills: ["Go", "PostgreSQL", "Microservices"],
    secondary_skills: ["Docker", "Kubernetes", "AWS"],
    industry_experience: ["Fintech", "Banking"],
    avatar: "/avatars/jane-smith.jpg",
    user: {
      id: 2,
      first_name: "Jane",
      last_name: "Smith",
      email: "jane.smith@company.com",
      role: "Employee",
      created_at: "2021-08-15T10:00:00Z",
      updated_at: "2021-08-15T10:00:00Z"
    }
  },
  {
    user_id: 3,
    geo: "Europe",
    date_of_joining: "2023-01-10T00:00:00Z",
    end_date: null,
    notice_date: null,
    type: "Fullstack Dev",
    skills: ["React", "Next.js", "Python", "Django", "PostgreSQL"],
    years_of_experience: 4,
    industry: "Healthcare",
    availability_flag: true,
    created_at: "2023-01-05T10:00:00Z",
    updated_at: "2023-11-18T16:20:00Z",
    status: "allocated",
    current_client: "HealthTech Solutions",
    utilization_pct: 75,
    timezone: "UTC+1",
    employment_type: "Contract",
    primary_skills: ["React", "Python", "Django"],
    secondary_skills: ["Next.js", "PostgreSQL", "REST APIs"],
    industry_experience: ["Healthcare", "Technology"],
    avatar: "/avatars/alex-johnson.jpg",
    user: {
      id: 3,
      first_name: "Alex",
      last_name: "Johnson",
      email: "alex.johnson@company.com",
      role: "Employee",
      created_at: "2023-01-05T10:00:00Z",
      updated_at: "2023-01-05T10:00:00Z"
    }
  },
  {
    user_id: 4,
    geo: "Asia-Pacific",
    date_of_joining: "2020-06-01T00:00:00Z",
    end_date: null,
    notice_date: null,
    type: "AI",
    skills: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Data Science"],
    years_of_experience: 6,
    industry: "Technology",
    availability_flag: false,
    created_at: "2020-05-25T10:00:00Z",
    updated_at: "2023-11-19T11:15:00Z",
    status: "allocated",
    current_client: "AI Startup Inc",
    utilization_pct: 100,
    timezone: "UTC+8",
    employment_type: "Full-time",
    primary_skills: ["Python", "Machine Learning", "Deep Learning"],
    secondary_skills: ["TensorFlow", "PyTorch", "Data Science"],
    industry_experience: ["Technology", "AI/ML"],
    avatar: "/avatars/sarah-chen.jpg",
    user: {
      id: 4,
      first_name: "Sarah",
      last_name: "Chen",
      email: "sarah.chen@company.com",
      role: "Employee",
      created_at: "2020-05-25T10:00:00Z",
      updated_at: "2020-05-25T10:00:00Z"
    }
  },
  {
    user_id: 5,
    geo: "US-Central",
    date_of_joining: "2023-09-01T00:00:00Z",
    end_date: "2024-12-31T00:00:00Z",
    notice_date: "2024-10-31T00:00:00Z",
    type: "UI",
    skills: ["Figma", "Adobe XD", "CSS", "JavaScript", "Design Systems"],
    years_of_experience: 3,
    industry: "E-commerce",
    availability_flag: true,
    created_at: "2023-08-25T10:00:00Z",
    updated_at: "2023-11-20T08:30:00Z",
    status: "rolling_off",
    current_client: "E-commerce Giant",
    utilization_pct: 80,
    timezone: "UTC-6",
    employment_type: "Contract",
    primary_skills: ["UI Design", "Figma", "Design Systems"],
    secondary_skills: ["CSS", "JavaScript", "Prototyping"],
    industry_experience: ["E-commerce", "Retail"],
    avatar: "/avatars/mike-wilson.jpg",
    user: {
      id: 5,
      first_name: "Mike",
      last_name: "Wilson",
      email: "mike.wilson@company.com",
      role: "Employee",
      created_at: "2023-08-25T10:00:00Z",
      updated_at: "2023-08-25T10:00:00Z"
    }
  },
  {
    user_id: 6,
    geo: "US-West",
    date_of_joining: "2022-11-15T00:00:00Z",
    end_date: null,
    notice_date: null,
    type: "Backend Dev",
    skills: ["Java", "Spring Boot", "MongoDB", "Redis", "Apache Kafka"],
    years_of_experience: 8,
    industry: "Banking",
    availability_flag: true,
    created_at: "2022-11-10T10:00:00Z",
    updated_at: "2023-11-21T13:45:00Z",
    status: "bench",
    current_client: undefined,
    utilization_pct: 0,
    timezone: "UTC-8",
    employment_type: "Full-time",
    primary_skills: ["Java", "Spring Boot", "Microservices"],
    secondary_skills: ["MongoDB", "Redis", "Apache Kafka"],
    industry_experience: ["Banking", "Fintech"],
    avatar: "/avatars/lisa-anderson.jpg",
    user: {
      id: 6,
      first_name: "Lisa",
      last_name: "Anderson",
      email: "lisa.anderson@company.com",
      role: "Employee",
      created_at: "2022-11-10T10:00:00Z",
      updated_at: "2022-11-10T10:00:00Z"
    }
  },
  {
    user_id: 7,
    geo: "Canada",
    date_of_joining: "2021-02-10T00:00:00Z",
    end_date: null,
    notice_date: null,
    type: "UX",
    skills: ["User Research", "Wireframing", "Prototyping", "Figma", "Analytics"],
    years_of_experience: 5,
    industry: "Healthcare",
    availability_flag: false,
    created_at: "2021-02-05T10:00:00Z",
    updated_at: "2023-11-19T10:20:00Z",
    status: "allocated",
    current_client: "MedTech Solutions",
    utilization_pct: 90,
    timezone: "UTC-5",
    employment_type: "Full-time",
    primary_skills: ["UX Design", "User Research", "Prototyping"],
    secondary_skills: ["Figma", "Analytics", "Wireframing"],
    industry_experience: ["Healthcare", "Technology"],
    avatar: "/avatars/david-brown.jpg",
    user: {
      id: 7,
      first_name: "David",
      last_name: "Brown",
      email: "david.brown@company.com",
      role: "Employee",
      created_at: "2021-02-05T10:00:00Z",
      updated_at: "2021-02-05T10:00:00Z"
    }
  },
  {
    user_id: 8,
    geo: "Europe",
    date_of_joining: "2023-05-20T00:00:00Z",
    end_date: "2025-05-20T00:00:00Z",
    notice_date: null,
    type: "Tester",
    skills: ["Selenium", "Jest", "Cypress", "API Testing", "Performance Testing"],
    years_of_experience: 4,
    industry: "Technology",
    availability_flag: true,
    created_at: "2023-05-15T10:00:00Z",
    updated_at: "2023-11-20T14:10:00Z",
    status: "available",
    current_client: undefined,
    utilization_pct: 20,
    timezone: "UTC+2",
    employment_type: "Contract",
    primary_skills: ["Test Automation", "Selenium", "API Testing"],
    secondary_skills: ["Jest", "Cypress", "Performance Testing"],
    industry_experience: ["Technology", "E-commerce"],
    avatar: "/avatars/emma-garcia.jpg",
    user: {
      id: 8,
      first_name: "Emma",
      last_name: "Garcia",
      email: "emma.garcia@company.com",
      role: "Employee",
      created_at: "2023-05-15T10:00:00Z",
      updated_at: "2023-05-15T10:00:00Z"
    }
  }
];

// Helper functions for filtering employees
export const getAvailableEmployees = () => employeesData.filter(emp => emp.status === 'available');
export const getRollingOffEmployees = () => employeesData.filter(emp => emp.status === 'rolling_off');
export const getAllocatedEmployees = () => employeesData.filter(emp => emp.status === 'allocated');
export const getBenchEmployees = () => employeesData.filter(emp => emp.status === 'bench');

export const getEmployeesBySkills = (skills: string[]) => 
  employeesData.filter(emp => 
    skills.some(skill => 
      emp.primary_skills.some(s => s.toLowerCase().includes(skill.toLowerCase())) ||
      emp.secondary_skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
    )
  );

export const getEmployeesByGeo = (geo: string) => 
  employeesData.filter(emp => emp.geo.toLowerCase().includes(geo.toLowerCase()));

export const getEmployeesByType = (type: string) => 
  employeesData.filter(emp => emp.type === type);
