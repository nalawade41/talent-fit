import React from 'react';
import { 
  FolderOpen, 
  Users, 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  PlusCircle,
} from 'lucide-react';
import { mockProjects, mockAlerts } from '../../data/mockData';

interface ManagerDashboardProps {
  onPageChange: (page: string) => void;
}

export function ManagerDashboard({ onPageChange }: ManagerDashboardProps) {
  const unreadAlerts = mockAlerts.filter(a => !a.read);
  const activeProjects = mockProjects.filter(p => p.status !== 'completed');
  const completedProjects = mockProjects.filter(p => p.status === 'completed');
  
  const stats = [
    { 
      label: 'Total Projects', 
      value: mockProjects.length, 
      icon: FolderOpen, 
      color: 'bg-blue-500',
      onClick: () => onPageChange('projects')
    },
    { 
      label: 'Active Projects', 
      value: activeProjects.length, 
      icon: Clock, 
      color: 'bg-amber-500',
      onClick: () => onPageChange('projects')
    },
    { 
      label: 'Completed', 
      value: completedProjects.length, 
      icon: CheckCircle, 
      color: 'bg-green-500',
      onClick: () => onPageChange('projects')
    },
    { 
      label: 'Unread Alerts', 
      value: unreadAlerts.length, 
      icon: Bell, 
      color: 'bg-red-500',
      onClick: () => onPageChange('alerts')
    },
  ];

  const priorityProjects = mockProjects
    .filter(p => p.priority === 'high' && p.status !== 'completed')
    .slice(0, 4);

  const recentAlerts = mockAlerts.slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of projects, team, and talent matching</p>
        </div>
        <button
          onClick={() => onPageChange('projects')}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={stat.onClick}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">High Priority Projects</h2>
              <button 
                onClick={() => onPageChange('projects')}
                className="text-blue-500 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            {priorityProjects.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No high priority projects</p>
            ) : (
              <div className="space-y-4">
                {priorityProjects.map((project) => (
                  <div key={project.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-3 h-3 bg-red-500 rounded-full mt-2" />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{project.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{project.description.substring(0, 80)}...</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          project.status === 'open' ? 'bg-green-100 text-green-700' :
                          project.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {project.status.replace('-', ' ')}
                        </span>
                        <span className="text-xs text-gray-500">Due: {new Date(project.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Recent Alerts</h2>
              <button 
                onClick={() => onPageChange('alerts')}
                className="text-blue-500 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            {recentAlerts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent alerts</p>
            ) : (
              <div className="space-y-4">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      alert.priority === 'high' ? 'bg-red-500' :
                      alert.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900 text-sm truncate">{alert.title}</h3>
                        {!alert.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(alert.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}