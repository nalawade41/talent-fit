import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './dialog';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Badge } from './badge';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';
import { Separator } from './separator';
import { Employee } from '../../data/employees';
import { projectsData, Project } from '../../data/projects';
import { projectAllocationsData } from '../../data/allocations';
import { 
  Calendar, 
  Clock, 
  User, 
  Briefcase, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  MapPin,
  Target
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AllocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee;
  onSuccess?: (allocation: any) => void;
}

interface AllocationFormData {
  projectId: string;
  allocationType: 'Full-time' | 'Part-time' | 'Extra';
  roleType: string;
  startDate: string;
  endDate: string;
  allocationPercentage: number;
}

// Mock API service
const mockAllocationAPI = {
  allocateEmployee: async (employeeId: number, allocationData: AllocationFormData) => {
    // Simulate API delay
    const delay = Math.random() * 2000 + 1000; // 1-3 seconds
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Simulate 90% success rate
    const isSuccess = Math.random() > 0.1;
    
    if (!isSuccess) {
      const errors = [
        'Employee is already allocated to this project during the specified period',
        'Project has reached maximum capacity for this role',
        'Invalid date range: start date must be before end date',
        'Server temporarily unavailable. Please try again.',
        'Insufficient permissions to allocate this employee'
      ];
      const randomError = errors[Math.floor(Math.random() * errors.length)];
      throw new Error(randomError);
    }
    
    // Return success response
    return {
      id: Math.random() * 10000,
      employeeId,
      ...allocationData,
      status: 'active',
      createdAt: new Date().toISOString()
    };
  }
};

export function AllocationDialog({ open, onOpenChange, employee, onSuccess }: AllocationDialogProps) {
  const [formData, setFormData] = useState<AllocationFormData>({
    projectId: '',
    allocationType: 'Full-time',
    roleType: '',
    startDate: '',
    endDate: '',
    allocationPercentage: 100
  });
  
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [conflicts, setConflicts] = useState<any[]>([]);

  // Available projects (excluding those where employee is already allocated)
  const availableProjects = projectsData.filter(project => {
    const existingAllocation = projectAllocationsData.find(
      allocation => allocation.project_id === project.id && allocation.employee_id === employee.user_id
    );
    return !existingAllocation && project.status === 'Open';
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setFormData({
        projectId: '',
        allocationType: 'Full-time',
        roleType: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        allocationPercentage: 100
      });
      setSelectedProject(null);
      setConflicts([]);
    }
  }, [open]);

  // Update selected project when project ID changes
  useEffect(() => {
    if (formData.projectId) {
      const project = projectsData.find(p => p.id.toString() === formData.projectId);
      setSelectedProject(project || null);
      if (project) {
        // Auto-set end date to project end date
        setFormData(prev => ({
          ...prev,
          endDate: project.end_date.split('T')[0],
          roleType: project.role_type
        }));
      }
    }
  }, [formData.projectId]);

  // Check for allocation conflicts
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const employeeAllocations = projectAllocationsData.filter(
        allocation => allocation.employee_id === employee.user_id
      );
      
      const conflictingAllocations = employeeAllocations.filter(allocation => {
        const allocationStart = new Date(allocation.start_date);
        const allocationEnd = allocation.end_date ? new Date(allocation.end_date) : new Date('2099-12-31');
        const formStart = new Date(formData.startDate);
        const formEnd = new Date(formData.endDate);
        
        return (formStart <= allocationEnd && formEnd >= allocationStart);
      });
      
      setConflicts(conflictingAllocations);
    }
  }, [formData.startDate, formData.endDate, employee.user_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProject) {
      toast.error('Please select a project');
      return;
    }

    if (conflicts.length > 0) {
      toast.error('Cannot allocate due to conflicting assignments');
      return;
    }

    setLoading(true);
    
    try {
      const result = await mockAllocationAPI.allocateEmployee(employee.user_id, formData);
      
      toast.success(
        `Successfully allocated ${employee.user.first_name} ${employee.user.last_name} to ${selectedProject.name}!`
      );
      
      onSuccess?.(result);
      onOpenChange(false);
      
    } catch (error: any) {
      toast.error(`Allocation failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof AllocationFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.projectId && formData.startDate && formData.endDate && formData.roleType;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Briefcase className="h-5 w-5" />
            {employee.status === 'available' ? 'Allocate' : 'Reallocate'} Employee
          </DialogTitle>
          <DialogDescription>
            Assign {employee.user.first_name} {employee.user.last_name} to a project with specific role and timeline.
          </DialogDescription>
        </DialogHeader>

        {/* Employee Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={employee.avatar} />
              <AvatarFallback>{employee.user.first_name[0]}{employee.user.last_name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold">{employee.user.first_name} {employee.user.last_name}</h3>
              <p className="text-sm text-gray-600">{employee.type} • {employee.years_of_experience}y experience</p>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-3 w-3 text-gray-400" />
                <span className="text-sm text-gray-500">{employee.geo}</span>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-500">{employee.utilization_pct}% utilized</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {employee.primary_skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Selection */}
          <div className="space-y-2">
            <Label htmlFor="project">Select Project *</Label>
            <Select value={formData.projectId} onValueChange={(value) => handleInputChange('projectId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a project to allocate employee to..." />
              </SelectTrigger>
              <SelectContent>
                {availableProjects.map(project => (
                  <SelectItem key={project.id} value={project.id.toString()}>
                    <div className="flex items-center justify-between w-full">
                      <span>{project.name}</span>
                      <Badge variant="outline" className="ml-2">
                        {project.role_type}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableProjects.length === 0 && (
              <p className="text-sm text-amber-600">
                <AlertCircle className="h-4 w-4 inline mr-1" />
                No available projects for allocation
              </p>
            )}
          </div>

          {/* Selected Project Details */}
          {selectedProject && (
            <div className="border rounded-lg p-4 bg-blue-50">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Project Details
              </h4>
              <div className="space-y-2 text-sm">
                <div><strong>Client:</strong> {selectedProject.client_name}</div>
                <div><strong>Duration:</strong> {new Date(selectedProject.start_date).toLocaleDateString()} - {new Date(selectedProject.end_date).toLocaleDateString()}</div>
                <div><strong>Required Skills:</strong> {selectedProject.required_skills.join(', ')}</div>
                <div className="flex items-center gap-2">
                  <strong>Status:</strong>
                  <Badge variant={selectedProject.status === 'Open' ? 'default' : 'secondary'}>
                    {selectedProject.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Allocation Details */}
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="allocationType">Allocation Type *</Label>
              <Select 
                value={formData.allocationType} 
                onValueChange={(value: 'Full-time' | 'Part-time' | 'Extra') => handleInputChange('allocationType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Extra">Extra</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roleType">Role/Position *</Label>
              <Input
                id="roleType"
                value={formData.roleType}
                onChange={(e) => handleInputChange('roleType', e.target.value)}
                placeholder="e.g., Senior Frontend Developer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                min={formData.startDate}
              />
            </div>
          </div>

          {formData.allocationType === 'Part-time' && (
            <div className="space-y-2">
              <Label htmlFor="percentage">Allocation Percentage</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="percentage"
                  type="number"
                  min="10"
                  max="90"
                  step="10"
                  value={formData.allocationPercentage}
                  onChange={(e) => handleInputChange('allocationPercentage', parseInt(e.target.value))}
                  className="w-24"
                />
                <span className="text-sm text-gray-600">% of time allocated to this project</span>
              </div>
            </div>
          )}

          {/* Conflicts Warning */}
          {conflicts.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-800 flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4" />
                Allocation Conflicts Detected
              </h4>
              <div className="space-y-2 text-sm text-red-700">
                {conflicts.map((conflict, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>
                      Overlaps with existing allocation from {new Date(conflict.start_date).toLocaleDateString()}
                      {conflict.end_date && ` to ${new Date(conflict.end_date).toLocaleDateString()}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!isFormValid || conflicts.length > 0 || loading || availableProjects.length === 0}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {employee.status === 'available' ? 'Allocate' : 'Reallocate'} Employee
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
