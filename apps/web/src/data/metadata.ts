// Metadata and utility data for dropdowns, filters, and app configuration
export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface IndustryData {
  name: string;
  subcategories?: string[];
}

export interface GeoLocation {
  region: string;
  countries: string[];
  timezones: string[];
}

// Skills data organized by categories
export const skillsData: SkillCategory[] = [
  {
    category: "Frontend",
    skills: [
      "React", "Vue.js", "Angular", "JavaScript", "TypeScript", 
      "HTML5", "CSS3", "Sass/SCSS", "Tailwind CSS", "Bootstrap",
      "Next.js", "Nuxt.js", "Webpack", "Vite", "Styled Components"
    ]
  },
  {
    category: "Backend",
    skills: [
      "Node.js", "Go", "Python", "Java", "C#", "Ruby", "PHP",
      "Express.js", "FastAPI", "Spring Boot", "Django", "Rails",
      ".NET", "Microservices", "REST APIs", "GraphQL", "gRPC"
    ]
  },
  {
    category: "Databases",
    skills: [
      "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch",
      "Cassandra", "DynamoDB", "Firebase", "Supabase", "PlanetScale",
      "InfluxDB", "Neo4j", "SQLite"
    ]
  },
  {
    category: "Cloud & DevOps",
    skills: [
      "AWS", "Google Cloud", "Azure", "Docker", "Kubernetes",
      "Terraform", "Jenkins", "GitHub Actions", "GitLab CI",
      "Vercel", "Netlify", "Render", "Heroku"
    ]
  },
  {
    category: "Mobile",
    skills: [
      "React Native", "Flutter", "Swift", "Kotlin", "Xamarin",
      "Ionic", "Cordova", "iOS Development", "Android Development"
    ]
  },
  {
    category: "AI/ML",
    skills: [
      "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch",
      "Scikit-learn", "OpenAI API", "Anthropic", "Hugging Face",
      "Computer Vision", "NLP", "Data Science", "MLOps"
    ]
  },
  {
    category: "Design",
    skills: [
      "Figma", "Adobe XD", "Sketch", "UI Design", "UX Design",
      "User Research", "Prototyping", "Wireframing", "Design Systems",
      "Adobe Creative Suite", "Framer", "InVision"
    ]
  },
  {
    category: "Testing",
    skills: [
      "Jest", "Cypress", "Selenium", "Playwright", "TestNG",
      "JUnit", "API Testing", "Performance Testing", "Load Testing",
      "Test Automation", "Manual Testing"
    ]
  },
  {
    category: "Other",
    skills: [
      "Project Management", "Scrum", "Agile", "Leadership",
      "Architecture Design", "System Design", "Technical Writing",
      "Code Review", "Mentoring"
    ]
  }
];

// Industry data
export const industriesData: IndustryData[] = [
  {
    name: "Technology",
    subcategories: ["Software", "Hardware", "SaaS", "AI/ML", "Blockchain"]
  },
  {
    name: "Fintech",
    subcategories: ["Banking", "Payments", "Trading", "Insurance", "Crypto"]
  },
  {
    name: "Healthcare",
    subcategories: ["MedTech", "Pharmaceuticals", "Digital Health", "Biotech"]
  },
  {
    name: "E-commerce",
    subcategories: ["Retail", "Marketplace", "B2B", "B2C", "Fashion"]
  },
  {
    name: "Manufacturing",
    subcategories: ["Automotive", "Aerospace", "Industrial", "IoT"]
  },
  {
    name: "Media & Entertainment",
    subcategories: ["Gaming", "Streaming", "Social Media", "Publishing"]
  },
  {
    name: "Education",
    subcategories: ["EdTech", "Online Learning", "K-12", "Higher Education"]
  },
  {
    name: "Real Estate",
    subcategories: ["PropTech", "Commercial", "Residential"]
  }
];

// Geographic data
export const geoData: GeoLocation[] = [
  {
    region: "North America",
    countries: ["United States", "Canada", "Mexico"],
    timezones: ["UTC-8", "UTC-7", "UTC-6", "UTC-5", "UTC-4"]
  },
  {
    region: "Europe",
    countries: ["United Kingdom", "Germany", "France", "Spain", "Netherlands", "Poland", "Ukraine"],
    timezones: ["UTC+0", "UTC+1", "UTC+2", "UTC+3"]
  },
  {
    region: "Asia-Pacific",
    countries: ["India", "China", "Japan", "Australia", "Singapore", "South Korea", "Philippines"],
    timezones: ["UTC+5:30", "UTC+8", "UTC+9", "UTC+10", "UTC+11"]
  },
  {
    region: "Latin America",
    countries: ["Brazil", "Argentina", "Chile", "Colombia", "Peru"],
    timezones: ["UTC-3", "UTC-4", "UTC-5"]
  }
];

// Role types
export const roleTypes = [
  "Frontend Dev",
  "Backend Dev", 
  "Fullstack Dev",
  "AI",
  "UI",
  "UX", 
  "Tester",
  "Manager",
  "Architect",
  "Scrum Master"
] as const;

// Employment types
export const employmentTypes = ["Full-time", "Contract", "Part-time"] as const;

// Allocation types
export const allocationTypes = ["Full-time", "Part-time", "Extra"] as const;

// Project statuses
export const projectStatuses = ["Open", "Closed", "On Hold", "Planning"] as const;

// Employee statuses
export const employeeStatuses = ["available", "rolling_off", "allocated", "bench"] as const;

// Priority levels
export const priorityLevels = ["low", "medium", "high", "critical"] as const;

// App configuration
export const appConfig = {
  name: "Talent Fit",
  version: "1.0.0",
  rollOffWindowDays: 21,
  scoringWeights: {
    skills: 0.5,
    availability: 0.2,
    role: 0.1,
    industry: 0.1,
    geo: 0.1
  },
  matchScoreThresholds: {
    excellent: 90,
    good: 75,
    moderate: 60,
    poor: 40
  },
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100
  }
};

// Helper functions for metadata
export const getAllSkills = (): string[] => {
  return skillsData.flatMap(category => category.skills);
};

export const getSkillsByCategory = (category: string): string[] => {
  const found = skillsData.find(cat => cat.category.toLowerCase() === category.toLowerCase());
  return found ? found.skills : [];
};

export const getAllIndustries = (): string[] => {
  return industriesData.map(industry => industry.name);
};

export const getAllCountries = (): string[] => {
  return geoData.flatMap(geo => geo.countries);
};

export const getAllTimezones = (): string[] => {
  return geoData.flatMap(geo => geo.timezones);
};

export const getCountriesByRegion = (region: string): string[] => {
  const found = geoData.find(geo => geo.region.toLowerCase() === region.toLowerCase());
  return found ? found.countries : [];
};

export const getTimezonesByRegion = (region: string): string[] => {
  const found = geoData.find(geo => geo.region.toLowerCase() === region.toLowerCase());
  return found ? found.timezones : [];
};

// Utility functions for UI
export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    available: 'green',
    rolling_off: 'yellow',
    allocated: 'blue',
    bench: 'gray',
    Open: 'green',
    Closed: 'gray',
    high: 'red',
    medium: 'orange',
    low: 'blue'
  };
  return colors[status] || 'gray';
};

export const formatMatchScore = (score: number): string => {
  if (score >= appConfig.matchScoreThresholds.excellent) return 'Excellent';
  if (score >= appConfig.matchScoreThresholds.good) return 'Good';
  if (score >= appConfig.matchScoreThresholds.moderate) return 'Moderate';
  return 'Poor';
};

export const getMatchScoreColor = (score: number): string => {
  if (score >= appConfig.matchScoreThresholds.excellent) return 'green';
  if (score >= appConfig.matchScoreThresholds.good) return 'blue';
  if (score >= appConfig.matchScoreThresholds.moderate) return 'orange';
  return 'red';
};
