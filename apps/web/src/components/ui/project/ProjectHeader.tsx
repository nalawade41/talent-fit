import React from 'react';
import { Badge } from '../badge';
import { Button } from '../button';
import { Edit, Plus } from 'lucide-react';
import { Project } from '../../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../dialog';

interface ProjectHeaderProps {
  project: Project;
  onEdit: () => void;
  onOpenAllocate: () => void;
  onBack?: () => void;
  onStatusChange?: (status: string) => void; // now optional
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  onEdit,
  onOpenAllocate,
  onBack
}) => {
  const isLongDescription = (project.description || '').length > 180;
  const budgetDisplay = (project as any).budget ? `$${(project as any).budget.toLocaleString()}` : 'Not Set';
  const geoPreference = (project as any).geo_preference || (project as any).geoPreference || 'Global';
  return (
    <div className="space-y-4">
      {onBack && (
        <div className="flex items-center">
          <Button variant="ghost" onClick={onBack} className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            ← Back to Projects
          </Button>
        </div>
      )}
      <div className="relative rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-gradient-to-r from-indigo-500 via-sky-500 to-teal-500" />
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-xl">
          <div className="absolute -top-20 -right-24 h-56 w-56 rounded-full bg-gradient-to-br from-indigo-200/40 via-sky-200/30 to-teal-200/20 blur-2xl dark:from-indigo-700/20 dark:via-sky-600/10 dark:to-teal-600/10" />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          <div className="space-y-5 flex-1 min-w-0">
            <div className="flex items-start flex-wrap gap-4">
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-50 min-w-[200px]">
                {project.name}
              </h1>
            </div>
            {project.description && (
              <div className="space-y-2">
                <p
                  className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl text-base relative"
                  style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                  title={project.description}
                >
                  {project.description}
                </p>
                {isLongDescription && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium">
                        Show more
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{project.name} – Full Description</DialogTitle>
                        <DialogDescription asChild>
                          <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                            {project.description}
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div className="space-y-1">
                <p className="text-gray-500 dark:text-gray-400 font-medium">Timeline</p>
                <p className="font-semibold text-gray-900 dark:text-gray-200">
                  {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 dark:text-gray-400 font-medium">Priority</p>
                <p className="font-semibold capitalize text-gray-900 dark:text-gray-200">{project.priority || 'Not Set'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 dark:text-gray-400 font-medium">Budget</p>
                <p className="font-semibold text-gray-900 dark:text-gray-200">{budgetDisplay}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 dark:text-gray-400 font-medium">Geo Preference</p>
                <p className="font-semibold text-gray-900 dark:text-gray-200">{geoPreference}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full lg:w-auto lg:flex-shrink-0">
            <Button
              onClick={onEdit}
              variant="secondary"
              className="justify-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Project
            </Button>
            <Button
              onClick={onOpenAllocate}
              className="justify-center bg-gradient-to-r from-indigo-600 via-sky-600 to-teal-600 hover:from-indigo-500 hover:via-sky-500 hover:to-teal-500 text-white shadow-md"
            >
              <Plus className="h-4 w-4 mr-2" />
              Allocate Resources
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
