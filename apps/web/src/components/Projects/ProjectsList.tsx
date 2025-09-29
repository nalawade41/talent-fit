import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../../types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { EmptyProjectsState, PriorityOverview, ProjectCard } from '../ui/project';

interface ProjectsListProps {
  projects: Project[];
  hasActiveFilters: boolean;
  onCreateProject: () => void;
  onClearFilters: () => void;
}

export function ProjectsList({ 
  projects, 
  hasActiveFilters, 
  onCreateProject, 
  onClearFilters 
}: ProjectsListProps) {
  const navigate = useNavigate();

  if (projects.length === 0) {
    if (hasActiveFilters) {
      return (
        <Card className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects match your filters</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search criteria or clearing the filters.</p>
          <Button variant="outline" onClick={onClearFilters}>
            Clear Filters
          </Button>
        </Card>
      );
    }
    
    return <EmptyProjectsState onCreateProject={onCreateProject} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">
            {projects.length} Project{projects.length !== 1 ? 's' : ''}
          </h3>
          {hasActiveFilters && (
            <Badge variant="outline" className="text-xs">
              Filtered Results
            </Badge>
          )}
        </div>
      </div>

      {/* Priority Overview - show when not heavily filtered */}
      {(!hasActiveFilters || projects.length > 3) && projects.length > 0 && (
        <PriorityOverview projects={projects} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={(projectId) => navigate(`/projects/${projectId}`)}
          />
        ))}
      </div>
    </div>
  );
}
