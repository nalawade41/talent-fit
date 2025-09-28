import { Card } from '../card';
import { Project } from '../../../types';
import { getPriorityIcon } from '../../../utils/projectUtils';

interface PriorityOverviewProps {
  projects: Project[];
}

export function PriorityOverview({ projects }: PriorityOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-center gap-3">
          <div className="text-2xl">📁</div>
          <div>
            <p className="text-sm font-medium text-blue-800">Total Projects</p>
            <p className="text-2xl font-bold text-blue-700">{projects.length}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-red-50 border-red-200">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🔥</div>
          <div>
            <p className="text-sm font-medium text-red-800">High Priority</p>
            <p className="text-2xl font-bold text-red-700">
              {projects.filter(p => p.priority === 'high').length}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex items-center gap-3">
          <div className="text-2xl">⚡</div>
          <div>
            <p className="text-sm font-medium text-amber-800">Medium Priority</p>
            <p className="text-2xl font-bold text-amber-700">
              {projects.filter(p => p.priority === 'medium').length}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-green-50 border-green-200">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{getPriorityIcon('low')}</div>
          <div>
            <p className="text-sm font-medium text-green-800">Low Priority</p>
            <p className="text-2xl font-bold text-green-700">
              {projects.filter(p => p.priority === 'low').length}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
