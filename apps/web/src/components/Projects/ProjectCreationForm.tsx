import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { X, Plus, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { Project } from '../../types';

const projectSchema = z.object({
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

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectCreationFormProps {
  onProjectCreated?: (project: Project) => void;
  onCancel?: () => void;
}

const ROLE_TYPES = [
  'Frontend', 'Backend', 'Fullstack', 'AI', 'UI', 'UX', 'Tester', 'Manager'
];

const INDUSTRIES = [
  'Technology', 'Finance', 'Healthcare', 'E-commerce', 'Education', 'Entertainment',
  'Manufacturing', 'Consulting', 'Real Estate', 'Transportation', 'Energy', 'Retail'
];

const PRIORITIES = ['low', 'medium', 'high'] as const;

export function ProjectCreationForm({ onProjectCreated, onCancel }: ProjectCreationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [seatsByType, setSeatsByType] = useState<Record<string, number>>({});
  const [newRoleType, setNewRoleType] = useState('');
  const [newRoleSeats, setNewRoleSeats] = useState<number>(1);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      required_seats: 1,
      priority: 'medium',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
    }
  });

  const watchedRequiredSeats = watch('required_seats');

  const addRoleType = () => {
    if (newRoleType && newRoleSeats > 0) {
      setSeatsByType(prev => ({
        ...prev,
        [newRoleType]: newRoleSeats
      }));
      setNewRoleType('');
      setNewRoleSeats(1);

      // Update total required seats
      const totalSeats = Object.values({ ...seatsByType, [newRoleType]: newRoleSeats }).reduce((sum, seats) => sum + seats, 0);
      setValue('required_seats', totalSeats);
    }
  };

  const removeRoleType = (roleType: string) => {
    const updatedSeats = { ...seatsByType };
    delete updatedSeats[roleType];
    setSeatsByType(updatedSeats);

    // Update total required seats
    const totalSeats = Object.values(updatedSeats).reduce((sum, seats) => sum + seats, 0);
    setValue('required_seats', totalSeats || 1);
  };

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);

    try {
      // Create new project
      const newProject: Project = {
        id: Date.now(), // Simple ID generation
        name: data.name,
        description: data.description,
        required_seats: data.required_seats,
        seats_by_type: seatsByType,
        start_date: new Date(data.start_date).toISOString(),
        end_date: new Date(data.end_date).toISOString(),
        status: 'Open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        client_name: data.client_name || '',
        role_title: data.role_title || '',
        role_type: data.role_type || '',
        industry: data.industry || '',
        geo_preference: data.geo_preference || '',
        priority: data.priority,
        budget: data.budget,
        progress: 0,
        required_skills: [],
        nice_to_have_skills: [],
        duration_weeks: Math.ceil((new Date(data.end_date).getTime() - new Date(data.start_date).getTime()) / (7 * 24 * 60 * 60 * 1000)),
      };

      // Save to localStorage
      const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      const updatedProjects = [...existingProjects, newProject];
      localStorage.setItem('projects', JSON.stringify(updatedProjects));

      toast.success('Project created successfully!', {
        icon: '✅',
      });

      onProjectCreated?.(newProject);
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project. Please try again.', {
        icon: '❌',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create New Project
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Enter project name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <Label htmlFor="client_name">Client Name</Label>
                <Input
                  id="client_name"
                  {...register('client_name')}
                  placeholder="Enter client name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Project Description *</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Describe the project requirements, objectives, and deliverables..."
                rows={4}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
            </div>
          </div>

          {/* Resource Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resource Requirements</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="required_seats">Total Required Seats *</Label>
                <Input
                  id="required_seats"
                  type="number"
                  {...register('required_seats', { valueAsNumber: true })}
                  min="1"
                  className={errors.required_seats ? 'border-red-500' : ''}
                />
                {errors.required_seats && <p className="text-sm text-red-500 mt-1">{errors.required_seats.message}</p>}
              </div>

              <div>
                <Label htmlFor="role_type">Primary Role Type</Label>
                <Select onValueChange={(value) => setValue('role_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Seats by Type */}
            <div>
              <Label>Seats by Role Type</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(seatsByType).map(([role, seats]) => (
                  <Badge key={role} variant="secondary" className="flex items-center gap-1">
                    {role}: {seats}
                    <button
                      type="button"
                      onClick={() => removeRoleType(role)}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2 mt-2">
                <Select value={newRoleType} onValueChange={setNewRoleType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_TYPES.filter(type => !seatsByType[type]).map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min="1"
                  value={newRoleSeats}
                  onChange={(e) => setNewRoleSeats(parseInt(e.target.value) || 1)}
                  className="w-20"
                  placeholder="Seats"
                />
                <Button type="button" onClick={addRoleType} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Timeline</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  type="date"
                  {...register('start_date')}
                  className={errors.start_date ? 'border-red-500' : ''}
                />
                {errors.start_date && <p className="text-sm text-red-500 mt-1">{errors.start_date.message}</p>}
              </div>

              <div>
                <Label htmlFor="end_date">End Date *</Label>
                <Input
                  id="end_date"
                  type="date"
                  {...register('end_date')}
                  className={errors.end_date ? 'border-red-500' : ''}
                />
                {errors.end_date && <p className="text-sm text-red-500 mt-1">{errors.end_date.message}</p>}
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select onValueChange={(value) => setValue('industry', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map(industry => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select onValueChange={(value: 'low' | 'medium' | 'high') => setValue('priority', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map(priority => (
                      <SelectItem key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="geo_preference">Geo Preference</Label>
                <Input
                  id="geo_preference"
                  {...register('geo_preference')}
                  placeholder="e.g., US/Europe, Remote"
                />
              </div>

              <div>
                <Label htmlFor="budget">Budget (USD)</Label>
                <Input
                  id="budget"
                  type="number"
                  {...register('budget', { valueAsNumber: true })}
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Project
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
