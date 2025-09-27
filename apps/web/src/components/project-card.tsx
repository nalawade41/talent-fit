import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Project } from '@/data/projects';
import { Calendar, Users, MapPin, Building, Star, Clock } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onViewDetails?: (id: number) => void;
  onFindMatches?: (id: number) => void;
  compact?: boolean;
}

export function ProjectCard({ project, onViewDetails, onFindMatches, compact = false }: ProjectCardProps) {
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'warning';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Open':
        return 'success';
      case 'Closed':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const formatPriority = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1) + ' Priority';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilStart = () => {
    const startDate = new Date(project.start_date);
    const today = new Date();
    const diffTime = startDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (compact) {
    return (
      <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-sm font-medium truncate">{project.name}</h3>
            <Badge variant={getPriorityVariant(project.priority)} className="text-xs">
              {project.priority}
            </Badge>
            <Badge variant={getStatusVariant(project.status)} className="text-xs">
              {project.status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {project.client_name} • {project.required_seats} seats • {formatDate(project.start_date)}
          </p>
        </div>
        
        <div className="flex space-x-1 ml-4">
          <Button size="sm" variant="outline" onClick={() => onViewDetails?.(project.id)}>
            View
          </Button>
          <Button size="sm" onClick={() => onFindMatches?.(project.id)}>
            Find Matches
          </Button>
        </div>
      </div>
    );
  }

  const daysUntilStart = getDaysUntilStart();

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <CardTitle className="text-lg truncate">{project.name}</CardTitle>
              <Badge variant={getPriorityVariant(project.priority)}>
                {formatPriority(project.priority)}
              </Badge>
              <Badge variant={getStatusVariant(project.status)}>
                {project.status}
              </Badge>
            </div>
            
            <CardDescription className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <Building className="h-3 w-3" />
                <span>{project.client_name}</span>
              </span>
              <span className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{project.geo_preference}</span>
              </span>
            </CardDescription>
          </div>
          
          {daysUntilStart > 0 && daysUntilStart <= 14 && (
            <div className="flex items-center space-x-1 text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
              <Clock className="h-3 w-3" />
              <span className="text-xs font-medium">{daysUntilStart} days to start</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span className="font-medium">{project.required_seats} seats required</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(project.start_date)} - {formatDate(project.end_date)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4" />
              <span>{project.role_type} focused</span>
            </div>
            <div className="flex items-center space-x-1">
              <Building className="h-4 w-4" />
              <span>{project.industry}</span>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Required Skills</p>
            <div className="flex flex-wrap gap-1">
              {project.required_skills.slice(0, 4).map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {project.required_skills.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{project.required_skills.length - 4} more
                </Badge>
              )}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Team Composition</p>
            <div className="flex flex-wrap gap-1">
              {Object.entries(project.seats_by_type).map(([role, count]) => (
                <Badge key={role} variant="secondary" className="text-xs">
                  {count}x {role}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-sm text-muted-foreground">
              <span>Progress: </span>
              <span className="font-medium">{project.progress}%</span>
              {project.budget && (
                <span className="ml-4">
                  Budget: <span className="font-medium">${project.budget.toLocaleString()}</span>
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => onViewDetails?.(project.id)}>
                View Details
              </Button>
              <Button onClick={() => onFindMatches?.(project.id)}>
                Find Matches
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
