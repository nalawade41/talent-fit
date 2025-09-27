import React, { useState } from 'react';
import { Plus, Search, Filter, Calendar, User, Clock, CheckCircle, AlertCircle, CreditCard as Edit, Trash2, Eye } from 'lucide-react';
import { mockProjects } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { Project } from '../../types';

export function ProjectsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    if (user?.role === 'employee') {
      return matchesSearch && matchesStatus && (project.status === 'open' || project.assignedTo === user.id);
    }
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === 'manager' ? 'Manage Projects' : 'Available Projects'}
          </h1>
          <p className="text-gray-600 mt-1">
            {user?.role === 'manager' 
              ? 'Create, edit, and manage all projects' 
              : 'View and apply to available projects'
            }
          </p>
        </div>
        
        {user?.role === 'manager' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Project
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No projects found matching your criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProjects.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(project.status)}
                      <span className="text-sm text-gray-600 capitalize">{project.status.replace('-', ' ')}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                    </div>
                    
                    {project.assignedTo && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>Assigned</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(project.priority)}`}>
                        {project.priority} priority
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.requiredSkills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                      {project.requiredSkills.length > 3 && (
                        <span className="text-xs text-gray-500">+{project.requiredSkills.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                    <button className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm">
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                    
                    {user?.role === 'manager' && (
                      <>
                        <button className="flex items-center gap-1 px-3 py-1 text-gray-600 hover:bg-gray-50 rounded text-sm">
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                        <button className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm">
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </>
                    )}
                    
                    {user?.role === 'employee' && project.status === 'open' && !project.assignedTo && (
                      <button className="ml-auto bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors">
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}