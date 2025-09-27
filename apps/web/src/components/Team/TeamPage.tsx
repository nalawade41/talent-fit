import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  MapPin, 
  Calendar, 
  Star,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { generateRandomAvatar, getInitials } from '../../utils/avatarUtils';

// Mock team data
const mockTeamMembers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    role: 'employee',
    department: 'Engineering',
    skills: ['React', 'TypeScript', 'Node.js', 'Python'],
    experience: 5,
    avatar: generateRandomAvatar('sarah'),
    status: 'available',
    currentProject: null,
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily@company.com',
    role: 'employee',
    department: 'Design',
    skills: ['UX Design', 'Figma', 'Research', 'Prototyping'],
    experience: 3,
    avatar: generateRandomAvatar('emily'),
    status: 'busy',
    currentProject: 'Mobile App Design',
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david@company.com',
    role: 'employee',
    department: 'Engineering',
    skills: ['Python', 'Machine Learning', 'Data Science', 'SQL'],
    experience: 6,
    avatar: generateRandomAvatar('david'),
    status: 'available',
    currentProject: null,
  },
  {
    id: '5',
    name: 'Lisa Chen',
    email: 'lisa@company.com',
    role: 'employee',
    department: 'Marketing',
    skills: ['Digital Marketing', 'Analytics', 'Content Strategy', 'SEO'],
    experience: 4,
    avatar: generateRandomAvatar('lisa'),
    status: 'busy',
    currentProject: 'Brand Campaign',
  },
  {
    id: '6',
    name: 'James Wilson',
    email: 'james@company.com',
    role: 'employee',
    department: 'Engineering',
    skills: ['DevOps', 'AWS', 'Docker', 'Kubernetes'],
    experience: 7,
    avatar: generateRandomAvatar('james'),
    status: 'available',
    currentProject: null,
  },
];

export function TeamPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredMembers = mockTeamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDepartment = departmentFilter === 'all' || member.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const departments = [...new Set(mockTeamMembers.map(m => m.department))];

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-600 mt-1">
            Manage your team and track availability for project assignments
          </p>
        </div>
        
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No team members found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <div key={member.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {member.name}
                      </h3>
                      <p className="text-sm text-gray-600">{member.department}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-2 h-2 rounded-full ${
                          member.status === 'available' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <span className="text-xs text-gray-500 capitalize">{member.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{member.experience} years experience</span>
                    </div>

                    {member.currentProject && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">Working on: {member.currentProject}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {member.skills.slice(0, 4).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                      {member.skills.length > 4 && (
                        <span className="text-xs text-gray-500">+{member.skills.length - 4} more</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                    <button className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm">
                      <UserCheck className="w-3 h-3" />
                      View Profile
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1 text-gray-600 hover:bg-gray-50 rounded text-sm">
                      <Mail className="w-3 h-3" />
                      Message
                    </button>
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