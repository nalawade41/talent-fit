import { Card } from '../card';
import { Button } from '../button';
import { Briefcase, Plus } from 'lucide-react';

interface EmptyProjectsStateProps {
  onCreateProject: () => void;
}

export function EmptyProjectsState({ onCreateProject }: EmptyProjectsStateProps) {
  return (
    <Card className="p-6">
      <div className="text-center py-12">
        <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
        <p className="text-gray-600 mb-4">Get started by creating your first project.</p>
        <Button onClick={onCreateProject} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Your First Project
        </Button>
      </div>
    </Card>
  );
}
