import { Plus } from 'lucide-react';
import { Button } from '../ui/button';

interface ProjectsHeaderProps {
  loading: boolean;
  onCreateProject: () => void;
}

export function ProjectsHeader({ loading, onCreateProject }: ProjectsHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Projects</h1>
          {loading && (
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>
        <p className="text-gray-600 mt-1">
          {loading ? 'Loading projects...' : 'Manage and track all your projects'}
        </p>
      </div>
      <Button 
        onClick={onCreateProject} 
        className="flex items-center gap-2"
        disabled={loading}
      >
        <Plus className="w-4 h-4" />
        Add Project
      </Button>
    </div>
  );
}
