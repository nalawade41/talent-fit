import { z } from 'zod';
import type { Project } from '.';

export const projectSchema = z.object({
    name: z.string().min(1, 'Project name is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    required_seats: z.number().min(1, 'At least 1 seat is required'),
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().min(1, 'End date is required'),
    client_name: z.string().optional(),
    role_title: z.string().optional(),
    role_type: z.string().optional(),
    industry: z.string().optional(),
    geo_preference: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    budget: z.number().optional(),
  });
  
  export type ProjectFormData = z.infer<typeof projectSchema>;
  
  export interface ProjectCreationFormProps {
    onProjectCreated?: (project: Project) => void;
    onCancel?: () => void;
  }
  
  export const ROLE_TYPES = [
    'Frontend', 'Backend', 'Fullstack', 'AI', 'UI', 'UX', 'Tester', 'Manager'
  ];
  
  export const INDUSTRIES = [
    'Technology', 'Finance', 'Healthcare', 'E-commerce', 'Education', 'Entertainment',
    'Manufacturing', 'Consulting', 'Real Estate', 'Transportation', 'Energy', 'Retail'
  ];
  
  export const PRIORITIES = ['low', 'medium', 'high'] as const;