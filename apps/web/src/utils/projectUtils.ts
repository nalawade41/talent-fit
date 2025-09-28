import { Project } from '../types';

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Open': return 'bg-green-100 text-green-800';
    case 'Closed': return 'bg-gray-100 text-gray-800';
    case 'On Hold': return 'bg-yellow-100 text-yellow-800';
    case 'Planning': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getPriorityColor = (priority?: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800 border-red-300';
    case 'medium': return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'low': return 'bg-green-100 text-green-800 border-green-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

export const getPriorityCardClass = (priority?: string) => {
  switch (priority) {
    case 'high':
      return 'border-l-4 border-l-red-500 bg-red-50/30 hover:bg-red-50/50 hover:shadow-xl hover:shadow-red-100 ring-1 ring-red-100';
    case 'medium':
      return 'border-l-4 border-l-amber-500 bg-amber-50/30 hover:bg-amber-50/50 hover:shadow-lg hover:shadow-amber-100 ring-1 ring-amber-100';
    case 'low':
      return 'border-l-4 border-l-green-500 bg-green-50/20 hover:bg-green-50/40 hover:shadow-lg hover:shadow-green-100';
    default:
      return 'hover:shadow-lg border-l-4 border-l-gray-300 bg-white hover:bg-gray-50/50';
  }
};

export const getPriorityIcon = (priority?: string) => {
  switch (priority) {
    case 'high': return '🔥';
    case 'medium': return '⚡';
    case 'low': return '📝';
    default: return '';
  }
};

export const isProjectUrgent = (project: Project) => {
  const today = new Date();
  const startDate = new Date(project.start_date);
  const daysUntilStart = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // Project is urgent if it's high priority and starts within 7 days, or already started
  return project.priority === 'high' && (daysUntilStart <= 7 || daysUntilStart < 0);
};
