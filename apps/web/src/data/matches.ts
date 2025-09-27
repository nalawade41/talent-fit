// AI Matching & Suggestions dummy data
export interface Match {
  id: number;
  opportunity_id: number;
  engineer_id: number;
  score: number;
  explanation: string;
  created_at: string;
  source: 'baseline' | 'ai';
  confidence: 'low' | 'medium' | 'high';
  breakdown: {
    skills: number;
    availability: number;
    role_fit: number;
    industry: number;
    geo: number;
  };
}

export interface MatchSuggestion {
  employee: {
    user_id: number;
    name: string;
    type: string;
    skills: string[];
    availability_flag: boolean;
    status: string;
    geo: string;
    avatar?: string;
  };
  match: Match;
}

export const matchesData: Match[] = [
  {
    id: 1,
    opportunity_id: 456, // Talent Matching Platform
    engineer_id: 1, // John Doe - Frontend Dev
    score: 92,
    explanation: "Excellent match: Strong React/TypeScript skills (5/5 required), available immediately, proven frontend experience, and located in optimal timezone.",
    created_at: "2023-11-20T10:00:00Z",
    source: "ai",
    confidence: "high",
    breakdown: {
      skills: 95,
      availability: 100,
      role_fit: 90,
      industry: 85,
      geo: 90
    }
  },
  {
    id: 2,
    opportunity_id: 456, // Talent Matching Platform
    engineer_id: 6, // Lisa Anderson - Backend Dev
    score: 88,
    explanation: "Strong match: Backend expertise in Go/Java with microservices experience, currently on bench and immediately available, previous fintech projects.",
    created_at: "2023-11-20T10:00:00Z",
    source: "ai",
    confidence: "high",
    breakdown: {
      skills: 85,
      availability: 100,
      role_fit: 95,
      industry: 80,
      geo: 85
    }
  },
  {
    id: 3,
    opportunity_id: 1002, // Healthcare AI Analytics
    engineer_id: 4, // Sarah Chen - AI
    score: 96,
    explanation: "Perfect match: Deep ML/AI expertise with TensorFlow & PyTorch, 6+ years experience, currently allocated but could transition, healthcare domain knowledge.",
    created_at: "2023-11-19T10:00:00Z",
    source: "ai",
    confidence: "high",
    breakdown: {
      skills: 100,
      availability: 80,
      role_fit: 100,
      industry: 95,
      geo: 90
    }
  },
  {
    id: 4,
    opportunity_id: 1001, // E-commerce Mobile App
    engineer_id: 1, // John Doe - Frontend Dev
    score: 85,
    explanation: "Good match: Strong React skills transferable to React Native, frontend expertise, available, but lacks mobile-specific experience.",
    created_at: "2023-11-20T11:00:00Z",
    source: "ai",
    confidence: "medium",
    breakdown: {
      skills: 80,
      availability: 100,
      role_fit: 85,
      industry: 75,
      geo: 95
    }
  },
  {
    id: 5,
    opportunity_id: 1003, // Fintech Dashboard Redesign
    engineer_id: 5, // Mike Wilson - UI
    score: 78,
    explanation: "Moderate match: UI design skills with Figma experience, currently rolling off project, but limited fintech industry exposure.",
    created_at: "2023-11-20T12:00:00Z",
    source: "baseline",
    confidence: "medium",
    breakdown: {
      skills: 85,
      availability: 90,
      role_fit: 80,
      industry: 60,
      geo: 75
    }
  },
  {
    id: 6,
    opportunity_id: 789, // Legacy System Migration
    engineer_id: 6, // Lisa Anderson - Backend Dev
    score: 94,
    explanation: "Excellent match: Java/Spring Boot expertise, microservices architecture experience, banking industry background, immediately available.",
    created_at: "2023-11-18T10:00:00Z",
    source: "ai",
    confidence: "high",
    breakdown: {
      skills: 95,
      availability: 100,
      role_fit: 95,
      industry: 90,
      geo: 85
    }
  },
  {
    id: 7,
    opportunity_id: 1004, // IoT Device Management
    engineer_id: 3, // Alex Johnson - Fullstack
    score: 82,
    explanation: "Good match: Full-stack capabilities with React/Python, some backend experience, but limited IoT/manufacturing domain knowledge.",
    created_at: "2023-11-21T10:00:00Z",
    source: "ai",
    confidence: "medium",
    breakdown: {
      skills: 75,
      availability: 70,
      role_fit: 85,
      industry: 65,
      geo: 90
    }
  },
  {
    id: 8,
    opportunity_id: 1005, // Crypto Trading Bot
    engineer_id: 4, // Sarah Chen - AI
    score: 91,
    explanation: "Strong match: Machine learning expertise applicable to algorithmic trading, Python proficiency, but currently allocated to another project.",
    created_at: "2023-11-21T11:00:00Z",
    source: "ai",
    confidence: "high",
    breakdown: {
      skills: 90,
      availability: 70,
      role_fit: 95,
      industry: 85,
      geo: 100
    }
  }
];

// Proactive insights and alerts
export interface Alert {
  id: number;
  type: 'roll_off' | 'project_gap' | 'allocation_suggestion' | 'data_quality' | 'skill_shortage';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  employee_id?: number;
  project_id?: number;
  created_at: string;
  read: boolean;
  action_required: boolean;
}

export const alertsData: Alert[] = [
  {
    id: 1,
    type: 'roll_off',
    title: 'Engineer Rolling Off Soon',
    message: 'Jane Smith (Backend Dev) is rolling off FinanceCorpABC project in 45 days. Start planning replacement.',
    severity: 'high',
    employee_id: 2,
    created_at: "2023-11-20T09:00:00Z",
    read: false,
    action_required: true
  },
  {
    id: 2,
    type: 'roll_off',
    title: 'UI Designer Available Soon',
    message: 'Mike Wilson (UI Designer) will be available after current project ends on Dec 31, 2024.',
    severity: 'medium',
    employee_id: 5,
    created_at: "2023-11-20T10:30:00Z",
    read: false,
    action_required: false
  },
  {
    id: 3,
    type: 'project_gap',
    title: 'Unfilled Project Positions',
    message: 'Healthcare AI Analytics project needs 1 more AI engineer. Start date approaching in 10 days.',
    severity: 'critical',
    project_id: 1002,
    created_at: "2023-11-21T08:00:00Z",
    read: false,
    action_required: true
  },
  {
    id: 4,
    type: 'allocation_suggestion',
    title: 'Perfect Match Available',
    message: 'Lisa Anderson (Backend Dev) is a 94% match for Legacy System Migration project and immediately available.',
    severity: 'medium',
    employee_id: 6,
    project_id: 789,
    created_at: "2023-11-21T14:00:00Z",
    read: true,
    action_required: true
  },
  {
    id: 5,
    type: 'skill_shortage',
    title: 'AI/ML Talent Shortage',
    message: 'Multiple projects requiring AI/ML skills but limited available talent. Consider external hiring.',
    severity: 'high',
    created_at: "2023-11-19T16:00:00Z",
    read: false,
    action_required: true
  },
  {
    id: 6,
    type: 'data_quality',
    title: 'Missing Industry Experience Data',
    message: '3 engineers are missing industry experience information. This affects matching accuracy.',
    severity: 'low',
    created_at: "2023-11-18T12:00:00Z",
    read: true,
    action_required: false
  }
];

// Helper functions for matches and suggestions
export const getMatchesForProject = (projectId: number) =>
  matchesData.filter(match => match.opportunity_id === projectId)
    .sort((a, b) => b.score - a.score);

export const getMatchesForEmployee = (employeeId: number) =>
  matchesData.filter(match => match.engineer_id === employeeId)
    .sort((a, b) => b.score - a.score);

export const getHighConfidenceMatches = () =>
  matchesData.filter(match => match.confidence === 'high')
    .sort((a, b) => b.score - a.score);

export const getTopMatches = (limit: number = 5) =>
  matchesData
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

// Alert helper functions
export const getUnreadAlerts = () => alertsData.filter(alert => !alert.read);
export const getCriticalAlerts = () => alertsData.filter(alert => alert.severity === 'critical');
export const getHighPriorityAlerts = () => alertsData.filter(alert => alert.severity === 'high' || alert.severity === 'critical');
export const getActionRequiredAlerts = () => alertsData.filter(alert => alert.action_required);

export const getRollOffAlerts = (withinDays: number = 60) => {
  // In a real implementation, this would filter by actual dates
  // For dummy data, we just return roll_off type alerts
  return alertsData.filter(alert => alert.type === 'roll_off');
};

export const getProjectGapAlerts = () => alertsData.filter(alert => alert.type === 'project_gap');

// Match suggestions combining employee and match data
import { employeesData } from './employees';

export const getMatchSuggestions = (projectId: number): MatchSuggestion[] => {
  const projectMatches = getMatchesForProject(projectId);
  
  return projectMatches.map(match => {
    const employee = employeesData.find(emp => emp.user_id === match.engineer_id);
    return {
      employee: {
        user_id: employee?.user_id || 0,
        name: `${employee?.user.first_name} ${employee?.user.last_name}`,
        type: employee?.type || '',
        skills: employee?.primary_skills || [],
        availability_flag: employee?.availability_flag || false,
        status: employee?.status || 'unknown',
        geo: employee?.geo || '',
        avatar: employee?.avatar
      },
      match
    };
  });
};
