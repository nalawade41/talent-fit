import React from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Edit, Plus } from 'lucide-react';
import { Project } from '../../types';

interface ProjectHeaderProps {
  project: Project;
  totalAllocated: number;
  totalRoles: number;
  onBack: () => void;
  onEdit: () => void;
  onOpenAllocate: () => void;
  getStatusColor: (status: string) => string;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  totalAllocated,
  totalRoles,
  onBack,
  onEdit,
  onOpenAllocate,
  getStatusColor
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Button variant="ghost" onClick={onBack} className="text-gray-600 hover:text-gray-900">
          ← Back to Projects
        </Button>
      </div>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <Badge className={`${getStatusColor(project.status)} text-gray-800 bg-white/90`}>
                {project.status}
              </Badge>
            </div>
            <p className="text-blue-100 text-lg max-w-2xl">{project.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div>
                <p className="text-blue-200 font-medium">Timeline</p>
                <p className="font-semibold">
                  {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-blue-200 font-medium">Priority</p>
                <p className="font-semibold capitalize">{project.priority || 'Not Set'}</p>
              </div>
              <div>
                <p className="text-blue-200 font-medium">Manager</p>
                <p className="font-semibold">{project.manager_name}</p>
              </div>
              <div>
                <p className="text-blue-200 font-medium">Team Size</p>
                <p className="font-semibold">{totalAllocated}/{totalRoles} allocated</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 lg:flex-shrink-0">
            <Button onClick={onEdit} variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-white/20 w-full lg:w-auto">
              <Edit className="w-4 h-4 mr-2" />
              Edit Project
            </Button>
            <Button onClick={onOpenAllocate} className="bg-white text-blue-600 hover:bg-gray-100 w-full lg:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Allocate Resources
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
