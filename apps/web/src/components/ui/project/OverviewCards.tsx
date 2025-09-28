import React, { useState } from 'react';
import { Card } from '../card';
import { Users, Calendar, Clock, Building, DollarSign, MapPin } from 'lucide-react';
import { Project } from '../../../types';
import { Badge as UIBadge } from '../badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select';
import toast from 'react-hot-toast';

interface OverviewCardsProps {
  project: Project;
  totalAllocated: number;
  totalRoles: number;
  onStatusChange?: (status: string) => void; // new
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({ project, totalAllocated, totalRoles, onStatusChange }) => {
  const durationWeeks = Math.ceil((new Date(project.end_date).getTime() - new Date(project.start_date).getTime()) / (1000 * 60 * 60 * 24 * 7));
  const durationDays = Math.ceil((new Date(project.end_date).getTime() - new Date(project.start_date).getTime()) / (1000 * 60 * 60 * 24));
  const statuses = ['Open', 'Planning', 'On Hold', 'Closed'];
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const currentStatus = pendingStatus ?? project.status;

  const handleStatusLocalChange = async (next: string) => {
    if (!onStatusChange) return;
    const prev = project.status;
    setPendingStatus(next); // optimistic UI
    try {
      // Simulate API latency; replace with real call
      await new Promise(res => setTimeout(res, 800));
      onStatusChange(next);
      setPendingStatus(null);
      toast.success(`Status updated to ${next}`);
    } catch (e) {
      setPendingStatus(null);
      toast.error('Failed to update status');
      onStatusChange(prev); // revert via parent (or simply ignore since parent still has old value)
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Open': 
        return {
          dot: 'bg-emerald-500',
          bg: 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/10',
          text: 'text-emerald-700 dark:text-emerald-300',
          icon: 'bg-emerald-100 dark:bg-emerald-900/30'
        };
      case 'Planning': 
        return {
          dot: 'bg-blue-500',
          bg: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/10',
          text: 'text-blue-700 dark:text-blue-300',
          icon: 'bg-blue-100 dark:bg-blue-900/30'
        };
      case 'On Hold': 
        return {
          dot: 'bg-amber-500',
          bg: 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10',
          text: 'text-amber-700 dark:text-amber-300',
          icon: 'bg-amber-100 dark:bg-amber-900/30'
        };
      case 'Closed': 
        return {
          dot: 'bg-gray-400',
          bg: 'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/10',
          text: 'text-gray-600 dark:text-gray-400',
          icon: 'bg-gray-100 dark:bg-gray-900/30'
        };
      default: 
        return {
          dot: 'bg-gray-400',
          bg: 'bg-gradient-to-br from-gray-50 to-slate-50',
          text: 'text-gray-600',
          icon: 'bg-gray-100'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Overview Cards */}
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
                <p className="text-2xl font-bold text-gray-900">{durationWeeks}W</p>
                <p className="text-xs text-gray-500 mt-1">{durationDays} days total</p>
              </div>
          </div>
        </Card>
        
        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-xl"><Clock className="h-6 w-6 text-amber-600" /></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <div className="mt-2 relative">
                {onStatusChange ? (
                  <>
                    <div className="relative inline-block">
                      <select
                        disabled={!!pendingStatus}
                        value={currentStatus}
                        onChange={(e) => handleStatusLocalChange(e.target.value)}
                        className={`appearance-none ${getStatusStyles(currentStatus).bg} ${getStatusStyles(currentStatus).text} text-sm font-medium px-3 py-1.5 pr-7 rounded-full border border-gray-200 dark:border-gray-700 cursor-pointer transition-all hover:shadow-sm disabled:opacity-60 disabled:cursor-not-allowed`}
                      >
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    {pendingStatus && (
                      <div className="absolute -top-1 -left-1 -right-1 -bottom-1 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-3.5 h-3.5 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Updating...</span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <UIBadge variant={project.status === 'Open' ? 'default' : 'secondary'} className="text-sm">{project.status}</UIBadge>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">Current project state</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {project.client_name && (
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl"><Building className="h-6 w-6 text-blue-600" /></div>
              <div>
                <p className="text-sm font-medium text-gray-500">Client</p>
                <p className="text-lg font-semibold text-gray-900">{project.client_name}</p>
                <p className="text-xs text-gray-500 mt-1">Project client</p>
              </div>
            </div>
          </Card>
        )}
        
        {project.industry && (
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-xl"><Building className="h-6 w-6 text-orange-600" /></div>
              <div>
                <p className="text-sm font-medium text-gray-500">Industry</p>
                <p className="text-lg font-semibold text-gray-900">{project.industry}</p>
                <p className="text-xs text-gray-500 mt-1">Business sector</p>
              </div>
            </div>
          </Card>
        )}

        {project.project_manager && (
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-xl"><Users className="h-6 w-6 text-indigo-600" /></div>
              <div>
                <p className="text-sm font-medium text-gray-500">Project Manager</p>
                <p className="text-lg font-semibold text-gray-900">{project.project_manager}</p>
                <p className="text-xs text-gray-500 mt-1">Team lead</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
