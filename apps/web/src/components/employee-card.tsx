import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Employee } from '@/data/employees';
import { Clock, MapPin, Mail, User } from 'lucide-react';

interface EmployeeCardProps {
  employee: Employee;
  onViewProfile?: (id: number) => void;
  onAllocate?: (id: number) => void;
  compact?: boolean;
}

export function EmployeeCard({ employee, onViewProfile, onAllocate, compact = false }: EmployeeCardProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'rolling_off':
        return 'warning';
      case 'allocated':
        return 'info';
      case 'bench':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-3 p-3 rounded-lg border bg-card hover:shadow-md transition-shadow">
        <Avatar className="h-10 w-10">
          <AvatarImage src={employee.avatar} alt={employee.user.first_name} />
          <AvatarFallback>
            {getInitials(employee.user.first_name, employee.user.last_name)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium truncate">
              {employee.user.first_name} {employee.user.last_name}
            </p>
            <Badge variant={getStatusVariant(employee.status)} className="text-xs">
              {formatStatus(employee.status)}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {employee.type} • {employee.geo}
          </p>
        </div>
        
        <div className="flex space-x-1">
          <Button size="sm" variant="outline" onClick={() => onViewProfile?.(employee.user_id)}>
            View
          </Button>
          {employee.status === 'available' && (
            <Button size="sm" onClick={() => onAllocate?.(employee.user_id)}>
              Allocate
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={employee.avatar} alt={employee.user.first_name} />
            <AvatarFallback>
              {getInitials(employee.user.first_name, employee.user.last_name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {employee.user.first_name} {employee.user.last_name}
              </CardTitle>
              <Badge variant={getStatusVariant(employee.status)}>
                {formatStatus(employee.status)}
              </Badge>
            </div>
            
            <CardDescription className="flex items-center space-x-4 mt-1">
              <span className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>{employee.type}</span>
              </span>
              <span className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{employee.geo}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{employee.timezone}</span>
              </span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium mb-2">Primary Skills</p>
            <div className="flex flex-wrap gap-1">
              {employee.primary_skills.slice(0, 4).map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {employee.primary_skills.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{employee.primary_skills.length - 4}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center space-x-1">
              <Mail className="h-3 w-3" />
              <span>{employee.user.email}</span>
            </span>
            <span>{employee.years_of_experience} years exp</span>
          </div>
          
          {employee.current_client && (
            <div className="text-sm">
              <span className="font-medium">Current Client: </span>
              <span className="text-muted-foreground">{employee.current_client}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <div className="text-sm">
              <span className="font-medium">Utilization: </span>
              <span className={employee.utilization_pct > 80 ? 'text-red-600' : 'text-green-600'}>
                {employee.utilization_pct}%
              </span>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => onViewProfile?.(employee.user_id)}>
                View Profile
              </Button>
              {employee.status === 'available' && (
                <Button onClick={() => onAllocate?.(employee.user_id)}>
                  Allocate to Project
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
