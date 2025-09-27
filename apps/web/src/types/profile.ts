import { z } from 'zod';
import countries from 'world-countries';

// Country data from world-countries library
export const COUNTRIES = countries
  .map(country => ({
    code: country.cca2,
    name: country.name.common,
    flag: country.flag
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

// Location options without Remote
export const LOCATION_OPTIONS = COUNTRIES;

// Skills taxonomy - organized by category
export const SKILL_CATEGORIES = {
  'Frontend': [
    'React', 'Angular', 'Vue.js', 'HTML', 'CSS', 'JavaScript', 'TypeScript',
    'Svelte', 'Next.js', 'Nuxt.js', 'Tailwind CSS', 'Bootstrap', 'SCSS', 'Webpack', 'Vite'
  ],
  'Backend': [
    'Node.js', 'Python', 'Java', 'C#', 'Go', 'Ruby', 'PHP', 'Rust',
    'Express.js', 'Django', 'Flask', 'Spring Boot', 'ASP.NET', 'Ruby on Rails'
  ],
  'Database': [
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle',
    'Elasticsearch', 'DynamoDB', 'Cassandra', 'Neo4j'
  ],
  'Cloud & DevOps': [
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins',
    'GitHub Actions', 'Terraform', 'Ansible', 'Nginx', 'Apache'
  ],
  'Mobile': [
    'React Native', 'Flutter', 'Swift', 'Kotlin', 'Ionic', 'Xamarin'
  ],
  'Design': [
    'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InVision',
    'UX Research', 'UI Design', 'Prototyping', 'Wireframing', 'User Testing'
  ],
  'Data Science': [
    'Python', 'R', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn',
    'Jupyter', 'Tableau', 'Power BI', 'SQL', 'Machine Learning', 'Deep Learning'
  ],
  'Project Management': [
    'Agile', 'Scrum', 'Kanban', 'JIRA', 'Confluence', 'Trello', 'Asana',
    'Project Planning', 'Risk Management', 'Stakeholder Management'
  ]
} as const;

export const ALL_SKILLS = Object.values(SKILL_CATEGORIES).flat() as string[];

export const INDUSTRIES = [
  'Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing',
  'Consulting', 'Media & Entertainment', 'Real Estate', 'Transportation',
  'Energy', 'Government', 'Non-Profit', 'E-commerce', 'Fintech', 'Gaming',
  'Telecommunications', 'Insurance', 'Automotive', 'Aerospace', 'Biotechnology',
  'Pharmaceuticals', 'Food & Beverage', 'Hospitality', 'Travel & Tourism', 'Other'
] as const;

// Industry experience with years
export interface IndustryExperience {
  industry: typeof INDUSTRIES[number];
  years: number;
}

export const EMPLOYEE_TYPES = [
  'Full-time', 'Part-time', 'Contract', 'Consultant', 'Intern'
] as const;

export const EXPERIENCE_LEVELS = [
  'Junior (0-2 years)', 'Mid-level (2-5 years)', 'Senior (5-8 years)', 
  'Lead (8-12 years)', 'Principal (12+ years)'
] as const;

// Zod validation schema
export const employeeProfileSchema = z.object({
  // Personal Details
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  country: z.string().min(2, 'Country selection is required'),
  dateOfJoining: z.string().min(1, 'Date of joining is required'),
  endDate: z.string().optional(),
  noticeDate: z.string().optional(),
  
  // Professional Details  
  employeeType: z.enum(EMPLOYEE_TYPES),
  department: z.string().min(2, 'Department is required'),
  industries: z.array(z.object({
    industry: z.enum(INDUSTRIES),
    years: z.number().min(0.5, 'Minimum 0.5 years required').max(50, 'Maximum 50 years allowed')
  })).min(1, 'At least one industry is required'),
  experience: z.number().min(0).max(50).optional(), // Auto-calculated from industries
  experienceLevel: z.enum(EXPERIENCE_LEVELS),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  
  // Availability
  availableForAdditionalWork: z.boolean().default(false),
  
  // Profile completion tracking
  profileCompletionPercentage: z.number().optional()
});

export type EmployeeProfile = z.infer<typeof employeeProfileSchema>;

// Helper function to calculate profile completion
export const calculateProfileCompletion = (profile: Partial<EmployeeProfile>): number => {
  const requiredFields = [
    'name', 'email', 'country', 'dateOfJoining', 'employeeType', 
    'department', 'industries', 'experienceLevel', 'skills'
  ];
  
  // Optional but beneficial fields (adds bonus points)
  const optionalFields = ['availableForAdditionalWork'];
  
  const completedRequiredFields = requiredFields.filter(field => {
    const value = profile[field as keyof EmployeeProfile];
    if (field === 'skills') {
      return Array.isArray(value) && value.length > 0;
    }
    if (field === 'industries') {
      return Array.isArray(value) && value.length > 0 && 
             value.every((item: any) => item.industry && typeof item.years === 'number' && item.years > 0);
    }
    return value !== undefined && value !== null && value !== '';
  });
  
  const completedOptionalFields = optionalFields.filter(field => {
    const value = profile[field as keyof EmployeeProfile];
    return value !== undefined && value !== null;
  });
  
  // Base completion from required fields (90% max)
  const baseCompletion = (completedRequiredFields.length / requiredFields.length) * 90;
  
  // Bonus from optional fields (10% max)
  const bonusCompletion = (completedOptionalFields.length / optionalFields.length) * 10;
  
  return Math.round(baseCompletion + bonusCompletion);
};
