import React from 'react';
import { 
  FolderOpen, 
  User, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockProjects } from '../../data/mockData';

export function EmployeeDashboard() {
  const { user } = useAuth();
  
  const myProjects = mockProjects.filter(p => p.assignedTo === user?.id);
  const availableProjects = mockProjects.filter(p => p.status === 'open');
  
  const stats = [
    { 
      label: 'Active Projects', 
      value: myProjects.length, 
      icon: FolderOpen, 
      color: 'bg-blue-500' 
    },
    { 
      label: 'Completed', 
      value: myProjects.filter(p => p.status === 'completed').length, 
      icon: CheckCircle, 
      color: 'bg-green-500' 
    },
    { 
      label: 'Available Projects', 
      value: availableProjects.length, 
      icon: Clock, 
      color: 'bg-amber-500' 
    },
    { 
      label: 'Skills', 
      value: user?.skills?.length || 0, 
      icon: TrendingUp, 
      color: 'bg-purple-500' 
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-1">Here's your project overview and recommendations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
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
            <h2 className="text-xl font-semibold text-gray-900">My Active Projects</h2>
          </div>
          <div className="p-6">
            {myProjects.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No active projects assigned</p>
            ) : (
              <div className="space-y-4">
                {myProjects.slice(0, 3).map((project) => (
                  <div key={project.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      project.status === 'completed' ? 'bg-green-500' : 
                      project.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-400'
                    }`} />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{project.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{project.description.substring(0, 100)}...</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          project.priority === 'high' ? 'bg-red-100 text-red-700' :
                          project.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {project.priority} priority
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
            <h2 className="text-xl font-semibold text-gray-900">Recommended Projects</h2>
          </div>
          <div className="p-6">
            {availableProjects.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No projects available</p>
            ) : (
              <div className="space-y-4">
                {availableProjects.slice(0, 3).map((project) => {
                  const skillMatch = user?.skills ? 
                    project.requiredSkills.filter(skill => 
                      user.skills?.some(userSkill => 
                        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
                        skill.toLowerCase().includes(userSkill.toLowerCase())
                      )
                    ).length : 0;
                  const matchPercentage = Math.round((skillMatch / project.requiredSkills.length) * 100);
                  
                  return (
                    <div key={project.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{project.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          matchPercentage >= 70 ? 'bg-green-100 text-green-700' :
                          matchPercentage >= 40 ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {matchPercentage}% match
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{project.description.substring(0, 100)}...</p>
                      <div className="flex flex-wrap gap-2">
                        {project.requiredSkills.slice(0, 3).map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                        {project.requiredSkills.length > 3 && (
                          <span className="text-xs text-gray-500">+{project.requiredSkills.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}