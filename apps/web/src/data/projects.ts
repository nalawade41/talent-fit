// Project dummy data
export interface Project {
  id: number;
  name: string;
  description: string;
  required_seats: number;
  seats_by_type: Record<string, number>;
  start_date: string;
  end_date: string;
  status: 'Open' | 'Closed';
  created_at: string;
  updated_at: string;
  // Additional UI fields
  client_name: string;
  role_title: string;
  required_skills: string[];
  nice_to_have_skills: string[];
  role_type: 'Frontend' | 'Backend' | 'Fullstack' | 'AI' | 'UI' | 'UX' | 'Tester' | 'Manager';
  industry: string;
  geo_preference: string;
  duration_weeks: number;
  priority: 'low' | 'medium' | 'high';
  progress: number;
  budget?: number;
  project_manager?: string;
}

export const projectsData: Project[] = [
  {
    id: 456,
    name: "Talent Matching Platform",
    description: "AI-powered talent matching system to automate engineer-project allocation",
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
    updated_at: "2023-09-20T10:00:00Z",
    client_name: "Internal - HR Tech Division",
    role_title: "Full Stack Development Team",
    required_skills: ["React", "TypeScript", "Go", "PostgreSQL", "AI/ML"],
    nice_to_have_skills: ["Docker", "Kubernetes", "AWS"],
    role_type: "Fullstack",
    industry: "Technology",
    geo_preference: "US/Europe",
    duration_weeks: 39,
    priority: "high",
    progress: 35,
    budget: 500000,
    project_manager: "Sarah Johnson"
  },
  {
    id: 789,
    name: "Legacy System Migration",
    description: "Migrate legacy banking systems to modern cloud-native architecture",
    required_seats: 6,
    seats_by_type: {
      "Backend Dev": 3,
      "Frontend Dev": 2,
      "Tester": 1
    },
    start_date: "2023-08-01T00:00:00Z",
    end_date: "2024-03-31T00:00:00Z",
    status: "Open",
    created_at: "2023-07-20T10:00:00Z",
    updated_at: "2023-11-20T10:00:00Z",
    client_name: "MegaBank Corp",
    role_title: "Senior Backend Migration Team",
    required_skills: ["Java", "Spring Boot", "Microservices", "Docker", "PostgreSQL"],
    nice_to_have_skills: ["Kubernetes", "AWS", "MongoDB"],
    role_type: "Backend",
    industry: "Banking",
    geo_preference: "US-East",
    duration_weeks: 35,
    priority: "high",
    progress: 65,
    budget: 750000,
    project_manager: "David Chen"
  },
  {
    id: 1001,
    name: "E-commerce Mobile App",
    description: "Cross-platform mobile application for luxury fashion e-commerce",
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
    updated_at: "2023-11-20T10:00:00Z",
    client_name: "LuxFashion Inc",
    role_title: "Mobile App Development Team",
    required_skills: ["React Native", "Node.js", "MongoDB", "UI Design"],
    nice_to_have_skills: ["GraphQL", "Redis", "Push Notifications"],
    role_type: "Frontend",
    industry: "E-commerce",
    geo_preference: "Global",
    duration_weeks: 33,
    priority: "medium",
    progress: 0,
    budget: 400000,
    project_manager: "Emily Rodriguez"
  },
  {
    id: 1002,
    name: "Healthcare AI Analytics",
    description: "Machine learning platform for medical data analysis and predictive insights",
    required_seats: 3,
    seats_by_type: {
      "AI": 2,
      "Backend Dev": 1
    },
    start_date: "2023-11-01T00:00:00Z",
    end_date: "2024-07-30T00:00:00Z",
    status: "Open",
    created_at: "2023-10-15T10:00:00Z",
    updated_at: "2023-10-15T10:00:00Z",
    client_name: "HealthTech Solutions",
    role_title: "AI/ML Engineering Team",
    required_skills: ["Python", "TensorFlow", "PyTorch", "Data Science", "FastAPI"],
    nice_to_have_skills: ["MLOps", "Docker", "AWS SageMaker"],
    role_type: "AI",
    industry: "Healthcare",
    geo_preference: "US/Canada",
    duration_weeks: 39,
    priority: "high",
    progress: 20,
    budget: 650000,
    project_manager: "Dr. Michael Kim"
  },
  {
    id: 1003,
    name: "Fintech Dashboard Redesign",
    description: "Complete UX/UI redesign of trading dashboard with modern design system",
    required_seats: 3,
    seats_by_type: {
      "UI": 1,
      "UX": 1,
      "Frontend Dev": 1
    },
    start_date: "2024-02-01T00:00:00Z",
    end_date: "2024-05-31T00:00:00Z",
    status: "Open",
    created_at: "2023-11-25T10:00:00Z",
    updated_at: "2023-11-25T10:00:00Z",
    client_name: "TradeMax Financial",
    role_title: "Design & Frontend Team",
    required_skills: ["Figma", "Design Systems", "React", "D3.js", "User Research"],
    nice_to_have_skills: ["Framer Motion", "WebGL", "Data Visualization"],
    role_type: "UI",
    industry: "Fintech",
    geo_preference: "US-East/Europe",
    duration_weeks: 17,
    priority: "medium",
    progress: 0,
    budget: 220000,
    project_manager: "Lisa Wang"
  },
  {
    id: 1004,
    name: "IoT Device Management",
    description: "Cloud platform for managing and monitoring IoT devices across manufacturing",
    required_seats: 5,
    seats_by_type: {
      "Backend Dev": 2,
      "Frontend Dev": 2,
      "Tester": 1
    },
    start_date: "2023-12-01T00:00:00Z",
    end_date: "2024-09-30T00:00:00Z",
    status: "Open",
    created_at: "2023-11-10T10:00:00Z",
    updated_at: "2023-11-10T10:00:00Z",
    client_name: "Industrial Systems Corp",
    role_title: "IoT Platform Development",
    required_skills: ["Go", "React", "MQTT", "Time Series DB", "Docker"],
    nice_to_have_skills: ["Kubernetes", "Edge Computing", "InfluxDB"],
    role_type: "Fullstack",
    industry: "Manufacturing",
    geo_preference: "US/Asia-Pacific",
    duration_weeks: 43,
    priority: "medium",
    progress: 10,
    budget: 580000,
    project_manager: "Robert Taylor"
  },
  {
    id: 1005,
    name: "Crypto Trading Bot",
    description: "Algorithmic trading system for cryptocurrency markets with risk management",
    required_seats: 2,
    seats_by_type: {
      "Backend Dev": 1,
      "AI": 1
    },
    start_date: "2024-01-01T00:00:00Z",
    end_date: "2024-04-30T00:00:00Z",
    status: "Open",
    created_at: "2023-11-28T10:00:00Z",
    updated_at: "2023-11-28T10:00:00Z",
    client_name: "CryptoVentures Ltd",
    role_title: "Algorithmic Trading Team",
    required_skills: ["Python", "Machine Learning", "Financial APIs", "Risk Management"],
    nice_to_have_skills: ["Quantitative Analysis", "WebSocket", "Redis"],
    role_type: "AI",
    industry: "Fintech",
    geo_preference: "Global",
    duration_weeks: 17,
    priority: "low",
    progress: 0,
    budget: 180000,
    project_manager: "Alex Kumar"
  }
];

// Helper functions for filtering projects
export const getOpenProjects = () => projectsData.filter(project => project.status === 'Open');
export const getClosedProjects = () => projectsData.filter(project => project.status === 'Closed');

export const getProjectsByPriority = (priority: 'low' | 'medium' | 'high') => 
  projectsData.filter(project => project.priority === priority);

export const getProjectsByIndustry = (industry: string) => 
  projectsData.filter(project => project.industry.toLowerCase().includes(industry.toLowerCase()));

export const getProjectsBySkills = (skills: string[]) =>
  projectsData.filter(project =>
    skills.some(skill =>
      project.required_skills.some(s => s.toLowerCase().includes(skill.toLowerCase())) ||
      project.nice_to_have_skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
    )
  );

export const getUrgentProjects = () => {
  const now = new Date();
  const twoWeeksFromNow = new Date(now.getTime() + (14 * 24 * 60 * 60 * 1000));
  
  return projectsData.filter(project => {
    const startDate = new Date(project.start_date);
    return startDate <= twoWeeksFromNow && project.status === 'Open';
  });
};
