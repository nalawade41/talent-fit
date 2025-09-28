import React from 'react';
import { Card } from '../ui/card';
import { Users, Calendar, Clock, Badge } from 'lucide-react';
import { Project } from '../../types';
import { Badge as UIBadge } from '../ui/badge';

interface OverviewCardsProps {
  project: Project;
  totalAllocated: number;
  totalRoles: number;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({ project, totalAllocated, totalRoles }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-100 rounded-xl"><Users className="h-6 w-6 text-indigo-600" /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Team Size</p>
            <p className="text-2xl font-bold text-gray-900">{totalAllocated}/{totalRoles}</p>
            <p className="text-xs text-gray-500 mt-1">{totalRoles - totalAllocated} more needed</p>
          </div>
        </div>
      </Card>
      <Card className="p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-xl"><Calendar className="h-6 w-6 text-green-600" /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Duration</p>
            <p className="text-2xl font-bold text-gray-900">{Math.ceil((new Date(project.end_date).getTime() - new Date(project.start_date).getTime()) / (1000 * 60 * 60 * 24 * 7))}W</p>
            <p className="text-xs text-gray-500 mt-1">{Math.ceil((new Date(project.end_date).getTime() - new Date(project.start_date).getTime()) / (1000 * 60 * 60 * 24))} days total</p>
          </div>
        </div>
      </Card>
      <Card className="p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-100 rounded-xl"><Clock className="h-6 w-6 text-amber-600" /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <div className="mt-1"><UIBadge variant={project.status === 'Open' ? 'default' : 'secondary'} className="text-sm">{project.status}</UIBadge></div>
            <p className="text-xs text-gray-500 mt-2">Current project state</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
