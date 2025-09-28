import { Card, CardContent, CardHeader, CardTitle } from '../card';
import { Button } from '../button';
import { Badge } from '../badge';
import { Calendar, Users, MapPin } from 'lucide-react';
import { Project } from '../../../types';
import { getStatusColor, getPriorityColor, getPriorityCardClass, getPriorityIcon, isProjectUrgent } from '../../../utils/projectUtils';

interface ProjectCardProps {
  project: Project;
  onClick: (projectId: number) => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const isUrgent = isProjectUrgent(project);
  const priorityCardClass = getPriorityCardClass(project.priority);

  return (
    <Card
      className={`transition-all duration-200 cursor-pointer transform hover:scale-[1.02] ${priorityCardClass}`}
      onClick={() => onClick(project.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg leading-tight">{project.name}</CardTitle>
            {isUrgent && (
              <Badge className="bg-red-600 text-white text-xs animate-pulse">
                URGENT
              </Badge>
            )}
          </div>
          <Badge className={getStatusColor(project.status)}>
            {project.status}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          {project.client_name && (
            <p className="text-sm text-gray-600 font-medium">{project.client_name}</p>
          )}
          {project.priority && (
            <div className="flex items-center gap-1">
              <span className="text-sm">{getPriorityIcon(project.priority)}</span>
              <Badge className={getPriorityColor(project.priority)} variant="outline">
                {project.priority} priority
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-gray-700 mb-4 line-clamp-2 text-sm leading-relaxed">{project.description}</p>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>{project.required_seats} seats</span>
            </div>
            {project.industry && (
              <Badge variant="secondary" className="text-xs">
                {project.industry}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="text-xs">
              {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
            </span>
          </div>

          {project.geo_preference && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-xs">{project.geo_preference}</span>
            </div>
          )}
        </div>

        {Object.keys(project.seats_by_type).length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Required Roles:</p>
            <div className="flex flex-wrap gap-1">
              {Object.entries(project.seats_by_type).slice(0, 3).map(([role, count]) => (
                <Badge key={role} variant="outline" className="text-xs px-2 py-1">
                  {role}: {count}
                </Badge>
              ))}
              {Object.keys(project.seats_by_type).length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-1">
                  +{Object.keys(project.seats_by_type).length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Priority-based action section */}
        {project.priority === 'high' && (
          <div className="mt-4 pt-3 border-t border-red-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-red-700">
                {isUrgent ? '⏰ Immediate Action Required' : '🎯 High Priority Project'}
              </span>
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7 border-red-300 text-red-700 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick(project.id);
                }}
              >
                View Details →
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
