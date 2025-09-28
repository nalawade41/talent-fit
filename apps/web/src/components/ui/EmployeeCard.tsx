import React from 'react';
import { Card } from './card';
import { Badge } from './badge';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';
import { Button } from './button';
import { Employee } from '../../types';
import { projectAllocationsData } from '../../data/allocations';
import { projectsData } from '../../data/projects';
import { 
  MapPin, 
  Clock, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  User,
  Briefcase,
  TrendingUp,
  Mail,
  Phone
} from 'lucide-react';

interface EmployeeCardProps {
  employee: Employee;
  onAllocate?: (employeeId: number) => void;
  compact?: boolean;
}

export function EmployeeCard({ employee, onAllocate, compact = false }: EmployeeCardProps) {
  // Get current project allocations for this employee
  const currentAllocations = projectAllocationsData.filter(allocation =>
    allocation.employee_id === employee.user_id &&
    (!allocation.end_date || new Date(allocation.end_date) > new Date())
  );

  // Get project names for current allocations
  const currentProjectNames = currentAllocations.map(allocation => {
    const project = projectsData.find(p => p.id === allocation.project_id);
    return project?.name || 'Unknown Project';
  });

  // Calculate status indicators and notices
  const getStatusInfo = () => {
    const today = new Date();
    
    if (employee.notice_date) {
      const noticeDate = new Date(employee.notice_date);
      const daysUntilNotice = Math.ceil((noticeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilNotice <= 28) { // 4 weeks
        return {
          status: 'urgent',
          message: `Notice in ${daysUntilNotice} days`,
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: AlertTriangle
        };
      } else if (daysUntilNotice <= 60) { // ~2 months
        return {
          status: 'warning',
          message: `Notice in ${Math.ceil(daysUntilNotice / 7)} weeks`,
          color: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: Calendar
        };
      }
    }

    if (employee.end_date) {
      const endDate = new Date(employee.end_date);
      const daysUntilEnd = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilEnd <= 28 && daysUntilEnd > 0) {
        return {
          status: 'rolling_off',
          message: `Rolling off in ${daysUntilEnd} days`,
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: Clock
        };
      } else if (daysUntilEnd <= 60 && daysUntilEnd > 0) {
        return {
          status: 'rolling_off_soon',
          message: `Ends in ${Math.ceil(daysUntilEnd / 7)} weeks`,
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Calendar
        };
      }
    }

    switch (employee.status) {
      case 'available':
        return {
          status: 'available',
          message: 'Available',
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle
        };
      case 'bench':
        return {
          status: 'bench',
          message: 'On Bench',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: User
        };
      case 'allocated':
        return {
          status: 'allocated',
          message: `${employee.utilization_pct}% Utilized`,
          color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          icon: TrendingUp
        };
      default:
        return {
          status: 'unknown',
          message: 'Status Unknown',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: User
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  // Get utilization color
  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-600 bg-red-50';
    if (utilization >= 70) return 'text-amber-600 bg-amber-50';
    if (utilization >= 40) return 'text-blue-600 bg-blue-50';
    return 'text-green-600 bg-green-50';
  };

  if (compact) {
    return (
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={employee.avatar} />
            <AvatarFallback>{employee.user.first_name[0]}{employee.user.last_name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate">{employee.user.first_name} {employee.user.last_name}</h4>
            <p className="text-sm text-gray-500 truncate">{employee.type} • {employee.geo}</p>
            <div className="flex items-center gap-1 mt-1">
              {employee.industry_experience.slice(0, 2).map((industry, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  {industry}
                </Badge>
              ))}
              {employee.industry_experience.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{employee.industry_experience.length - 2}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Badge variant="outline" className={statusInfo.color}>
              {statusInfo.message}
            </Badge>
            <Button 
              size="sm" 
              onClick={() => onAllocate?.(employee.user_id)}
              variant={employee.status === 'available' ? 'default' : 'outline'}
              className="text-xs"
            >
              <Briefcase className="h-3 w-3 mr-1" />
              {employee.status === 'available' ? 'Allocate' : 'Reallocate'}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="space-y-4">
        {/* Header with Avatar and Basic Info */}
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={employee.avatar} />
            <AvatarFallback className="text-lg">{employee.user.first_name[0]}{employee.user.last_name[0]}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {employee.user.first_name} {employee.user.last_name}
                </h3>
                <p className="text-gray-600 font-medium">{employee.type}</p>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{employee.geo}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-gray-500">{employee.years_of_experience}y exp</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Badge variant="outline" className={statusInfo.color}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusInfo.message}
                </Badge>
                {employee.availability_flag && (
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    Available for extra hours
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Skills and Industry */}
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Primary Skills</h4>
            <div className="flex flex-wrap gap-1">
              {employee.primary_skills.slice(0, 4).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {employee.primary_skills.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{employee.primary_skills.length - 4} more
                </Badge>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Industry Experience</h4>
            <div className="flex flex-wrap gap-1">
              {employee.industry_experience.slice(0, 3).map((industry, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  {industry}
                </Badge>
              ))}
              {employee.industry_experience.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{employee.industry_experience.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Utilization and Projects */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Utilization</span>
            </div>
            <div className={`text-lg font-semibold px-2 py-1 rounded-md ${getUtilizationColor(employee.utilization_pct)}`}>
              {employee.utilization_pct}%
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Projects</span>
            </div>
            <div className="space-y-1">
              {currentProjectNames.length > 0 ? (
                currentProjectNames.slice(0, 2).map((projectName, index) => (
                  <Badge key={index} variant="outline" className="block w-fit text-xs">
                    {projectName}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-500">No active projects</span>
              )}
              {currentProjectNames.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{currentProjectNames.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Notice Date Information */}
        {employee.notice_date && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">
                Notice Date: {new Date(employee.notice_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t">
          <Button 
            size="sm" 
            onClick={() => onAllocate?.(employee.user_id)}
            className="w-full"
            variant={employee.status === 'available' ? 'default' : 'outline'}
          >
            <Briefcase className="h-4 w-4 mr-2" />
            {employee.status === 'available' ? 'Allocate' : 'Reallocate'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
