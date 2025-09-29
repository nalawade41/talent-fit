import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, CheckCircle, Clock, Edit, Plus, Save, Users, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { projectAllocationsData } from '../../data/allocations';
import ProjectService from '../../services/projectService';
import { Project } from '../../types';
import { getStatusColor } from '../../utils/projectUtils';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';

const projectEditSchema = z.object({
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
  status: z.enum(['Open', 'Closed', 'On Hold', 'Planning']).optional(),
});

type ProjectEditFormData = z.infer<typeof projectEditSchema>;

interface ProjectEditFormProps {
  project: Project;
  onProjectUpdated?: (project: Project) => void;
  onCancel?: () => void;
}

const ROLE_TYPES = [
  'Frontend Dev', 'Backend Dev', 'Fullstack Dev', 'AI', 'UI', 'UX', 'Tester', 'Manager', 'Architect', 'Scrum Master'
];

const INDUSTRIES = [
  'Technology', 'Finance', 'Healthcare', 'E-commerce', 'Education', 'Entertainment',
  'Manufacturing', 'Consulting', 'Real Estate', 'Transportation', 'Energy', 'Retail'
];

const PRIORITIES = ['low', 'medium', 'high'] as const;
const PROJECT_STATUSES = ['Open', 'Closed', 'On Hold', 'Planning'] as const;

export function ProjectEditForm({ project, onProjectUpdated, onCancel }: ProjectEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [seatsByType, setSeatsByType] = useState<Record<string, number>>(project.seats_by_type || {});
  const [newRoleType, setNewRoleType] = useState('');
  const [newRoleSeats, setNewRoleSeats] = useState<number>(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [changesSummary, setChangesSummary] = useState<string[]>([]);

  // Get current allocations for this project
  const currentAllocations = projectAllocationsData.filter(a => a.project_id === project.id);
  const currentlyAllocatedSeats = currentAllocations.length;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty }
  } = useForm<ProjectEditFormData>({
    resolver: zodResolver(projectEditSchema),
    defaultValues: {
      name: project.name,
      description: project.description,
      required_seats: project.required_seats,
      start_date: new Date(project.start_date).toISOString().split('T')[0],
      end_date: new Date(project.end_date).toISOString().split('T')[0],
      client_name: project.client_name || '',
      role_title: project.role_title || '',
      role_type: project.role_type || '',
      industry: project.industry || '',
      geo_preference: project.geo_preference || '',
      priority: project.priority || 'medium',
      budget: project.budget || undefined,
      status: project.status || 'Open',
    }
  });

  const watchedData = watch();

  const addRoleType = () => {
    if (newRoleType && newRoleSeats > 0 && !seatsByType[newRoleType]) {
      const updatedSeats = { ...seatsByType, [newRoleType]: newRoleSeats };
      setSeatsByType(updatedSeats);
      setNewRoleType('');
      setNewRoleSeats(1);

      // Update total required seats
      const totalSeats = Object.values(updatedSeats).reduce((sum, seats) => sum + seats, 0);
      setValue('required_seats', totalSeats, { shouldDirty: true });
    }
  };

  const removeRoleType = (roleType: string) => {
    const updatedSeats = { ...seatsByType };
    delete updatedSeats[roleType];
    setSeatsByType(updatedSeats);

    // Update total required seats
    const totalSeats = Object.values(updatedSeats).reduce((sum, seats) => sum + seats, 0);
    setValue('required_seats', totalSeats || 1, { shouldDirty: true });
  };

  const updateRoleSeats = (roleType: string, seats: number) => {
    if (seats > 0) {
      const updatedSeats = { ...seatsByType, [roleType]: seats };
      setSeatsByType(updatedSeats);

      // Update total required seats
      const totalSeats = Object.values(updatedSeats).reduce((sum, seatCount) => sum + seatCount, 0);
      setValue('required_seats', totalSeats, { shouldDirty: true });
    }
  };

  const generateChangesSummary = (data: ProjectEditFormData): string[] => {
    const changes: string[] = [];
    
    if (data.name !== project.name) {
      changes.push(`Project name: "${project.name}" → "${data.name}"`);
    }
    if (data.description !== project.description) {
      changes.push(`Description updated`);
    }
    if (data.required_seats !== project.required_seats) {
      changes.push(`Required seats: ${project.required_seats} → ${data.required_seats}`);
    }
    if (data.status !== project.status) {
      changes.push(`Status: "${project.status}" → "${data.status}"`);
    }
    if (data.start_date !== new Date(project.start_date).toISOString().split('T')[0]) {
      changes.push(`Start date: ${new Date(project.start_date).toLocaleDateString()} → ${new Date(data.start_date).toLocaleDateString()}`);
    }
    if (data.end_date !== new Date(project.end_date).toISOString().split('T')[0]) {
      changes.push(`End date: ${new Date(project.end_date).toLocaleDateString()} → ${new Date(data.end_date).toLocaleDateString()}`);
    }
    if (data.client_name !== (project.client_name || '')) {
      changes.push(`Client name updated`);
    }
    if (data.role_title !== (project.role_title || '')) {
      changes.push(`Role title updated`);
    }
    if (data.role_type !== (project.role_type || '')) {
      changes.push(`Role type updated`);
    }
    if (data.industry !== (project.industry || '')) {
      changes.push(`Industry updated`);
    }
    if (data.geo_preference !== (project.geo_preference || '')) {
      changes.push(`Geography preference updated`);
    }
    if (data.priority !== project.priority) {
      changes.push(`Priority: ${project.priority || 'Not Set'} → ${data.priority}`);
    }
    if (data.budget !== project.budget) {
      changes.push(`Budget updated`);
    }
    if (JSON.stringify(seatsByType) !== JSON.stringify(project.seats_by_type)) {
      changes.push(`Role requirements updated`);
    }

    return changes;
  };

  const onSubmit = async (data: ProjectEditFormData) => {
    const changes = generateChangesSummary(data);
    
    if (changes.length === 0) {
      toast.error('No changes detected');
      return;
    }

    // Check for potential conflicts
    if (data.required_seats < currentlyAllocatedSeats) {
      setChangesSummary([
        ...changes,
        `⚠️ Warning: Reducing seats from ${project.required_seats} to ${data.required_seats}, but ${currentlyAllocatedSeats} employees are currently allocated`
      ]);
      setShowConfirmDialog(true);
      return;
    }

    if (data.status === 'Closed' && currentlyAllocatedSeats > 0) {
      setChangesSummary([
        ...changes,
        `⚠️ Warning: Closing project with ${currentlyAllocatedSeats} active allocations`
      ]);
      setShowConfirmDialog(true);
      return;
    }

    setChangesSummary(changes);
    setShowConfirmDialog(true);
  };

  const confirmUpdate = async () => {
    setIsSubmitting(true);
    setShowConfirmDialog(false);

    try {
      // Create updated project
      const updatedProject: Project = {
        ...project,
        name: watchedData.name,
        description: watchedData.description,
        required_seats: watchedData.required_seats,
        seats_by_type: seatsByType,
        start_date: new Date(watchedData.start_date).toISOString(),
        end_date: new Date(watchedData.end_date).toISOString(),
        status: watchedData.status || 'Open',
        client_name: watchedData.client_name || '',
        role_title: watchedData.role_title || '',
        role_type: watchedData.role_type || '',
        industry: watchedData.industry || '',
        geo_preference: watchedData.geo_preference || '',
        priority: watchedData.priority,
        budget: watchedData.budget,
        updated_at: new Date().toISOString(),
        duration_weeks: Math.ceil((new Date(watchedData.end_date).getTime() - new Date(watchedData.start_date).getTime()) / (7 * 24 * 60 * 60 * 1000)),
      };

      // Call backend update API
      const apiUpdated = await ProjectService.updateProject(project.id, {
        name: updatedProject.name,
        description: updatedProject.description,
        required_seats: updatedProject.required_seats,
        seats_by_type: updatedProject.seats_by_type,
        start_date: updatedProject.start_date,
        end_date: updatedProject.end_date,
        status: updatedProject.status,
        client_name: updatedProject.client_name,
        industry: updatedProject.industry,
        geo_preference: updatedProject.geo_preference,
        priority: updatedProject.priority,
        budget: updatedProject.budget,
        summary: updatedProject.summary,
      } as any);

      // Log change history (for audit trail)
      const changeHistory = JSON.parse(localStorage.getItem('project_change_history') || '[]');
      changeHistory.push({
        project_id: project.id,
        changes: changesSummary,
        timestamp: new Date().toISOString(),
        user: 'Manager' // In real app, this would come from auth context
      });
      localStorage.setItem('project_change_history', JSON.stringify(changeHistory));

      toast.success('Project updated successfully!', {
        icon: '✅',
      });

      onProjectUpdated?.(apiUpdated);
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project. Please try again.', {
        icon: '❌',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open': return <CheckCircle className="w-4 h-4" />;
      case 'Closed': return <X className="w-4 h-4" />;
      case 'On Hold': return <Clock className="w-4 h-4" />;
      case 'Planning': return <Edit className="w-4 h-4" />;
      default: return <Edit className="w-4 h-4" />;
    }
  };

  return (
    <>
      <Card className="w-full max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Edit Project: {project.name}
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(project.status)}>
                {getStatusIcon(project.status)}
                {project.status}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit(onSubmit)}>
              <TabsContent value="basic" className="space-y-4">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Project Status</Label>
                    <Select 
                      value={watchedData.status} 
                      onValueChange={(value) => setValue('status', value as any, { shouldDirty: true })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PROJECT_STATUSES.map(status => (
                          <SelectItem key={status} value={status}>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(status)}
                              {status}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select 
                      value={watchedData.priority} 
                      onValueChange={(value: 'low' | 'medium' | 'high') => setValue('priority', value, { shouldDirty: true })}
                    >
                      <SelectTrigger>
                        <SelectValue />
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
                </div>
              </TabsContent>

              <TabsContent value="resources" className="space-y-4">
                {/* Current Allocation Status */}
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-blue-900">Current Allocation Status</h4>
                      <p className="text-sm text-blue-700">
                        {currentlyAllocatedSeats} of {project.required_seats} seats currently allocated
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="text-2xl font-bold text-blue-900">
                        {currentlyAllocatedSeats}/{project.required_seats}
                      </span>
                    </div>
                  </div>
                </Card>

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
                    {watchedData.required_seats < currentlyAllocatedSeats && (
                      <p className="text-sm text-amber-600 mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Warning: Fewer seats than current allocations
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="role_type">Primary Role Type</Label>
                    <Select 
                      value={watchedData.role_type} 
                      onValueChange={(value) => setValue('role_type', value, { shouldDirty: true })}
                    >
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

                {/* Seats by Type Management */}
                <div>
                  <Label>Seats by Role Type</Label>
                  <div className="space-y-3 mt-2">
                    {Object.entries(seatsByType).map(([role, seats]) => (
                      <div key={role} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Badge variant="outline" className="min-w-[120px]">{role}</Badge>
                        <Input
                          type="number"
                          min="1"
                          value={seats}
                          onChange={(e) => updateRoleSeats(role, parseInt(e.target.value) || 1)}
                          className="w-20"
                        />
                        <span className="text-sm text-gray-500">seats</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRoleType(role)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Select value={newRoleType} onValueChange={setNewRoleType}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Add new role" />
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
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4">
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

                {/* Project Duration Calculator */}
                {watchedData.start_date && watchedData.end_date && (
                  <Card className="p-4 bg-gray-50">
                    <h4 className="font-medium mb-2">Project Duration</h4>
                    <p className="text-sm text-gray-600">
                      {Math.ceil((new Date(watchedData.end_date).getTime() - new Date(watchedData.start_date).getTime()) / (7 * 24 * 60 * 60 * 1000))} weeks
                      ({Math.ceil((new Date(watchedData.end_date).getTime() - new Date(watchedData.start_date).getTime()) / (24 * 60 * 60 * 1000))} days)
                    </p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Select 
                      value={watchedData.industry} 
                      onValueChange={(value) => setValue('industry', value, { shouldDirty: true })}
                    >
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

                  <div>
                    <Label htmlFor="role_title">Role Title</Label>
                    <Input
                      id="role_title"
                      {...register('role_title')}
                      placeholder="e.g., Full Stack Development Team"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t mt-6">
                {onCancel && (
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                )}
                <Button 
                  type="submit" 
                  disabled={!isDirty || isSubmitting} 
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Update Project
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Tabs>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Project Changes</DialogTitle>
            <DialogDescription>
              Please review the changes you're about to make:
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2">
            {changesSummary.map((change, index) => (
              <div key={index} className={`text-sm p-2 rounded ${
                change.includes('⚠️') 
                  ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                  : 'bg-gray-50 text-gray-700'
              }`}>
                {change}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmUpdate} disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Confirm Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
