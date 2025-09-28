import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../card';
import { Badge } from '../badge';
import { Button } from '../button';
import { Briefcase, CheckCircle2, Users, AlertTriangle } from 'lucide-react';
import { Project, Employee } from '../../../types';

interface Allocation { id: number; employee_id: number; }
interface RequirementsTabProps { project: Project; projectAllocations: Allocation[]; employeesData: Employee[]; totalAllocated: number; totalRoles: number; onOpenAllocate: () => void; }

export const RequirementsTab: React.FC<RequirementsTabProps> = ({ project, projectAllocations, employeesData, totalAllocated, totalRoles, onOpenAllocate }) => {
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5" />Project Requirements</CardTitle></CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h4 className="font-semibold mb-4 text-gray-900">Required Skills</h4>
            <div className="flex flex-wrap gap-2">
            {project.required_skills.map(skill => (<Badge key={skill} variant="secondary" className="px-3 py-1">{skill}</Badge>))}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Role Requirements</h4>
            <span className="text-sm text-gray-500">{Object.values(project.seats_by_type).reduce((sum, count) => sum + count, 0)} total positions</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(project.seats_by_type).map(([role, count]) => {
              const allocatedCount = projectAllocations.filter(a => {
                const emp = employeesData.find(e => e.user_id === a.employee_id);
                return emp?.type === role;
              }).length;
              const isFulfilled = allocatedCount >= count;
              const remaining = Math.max(0, count - allocatedCount);
              return (
                <Card key={role} className={`p-4 transition-all hover:shadow-md ${isFulfilled ? 'bg-green-50 border-green-200 ring-1 ring-green-200' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                  <div className="text-center space-y-3">
                    <div className="flex items-center justify-center">{isFulfilled ? (<div className="p-2 bg-green-100 rounded-full"><CheckCircle2 className="h-5 w-5 text-green-600" /></div>) : (<div className="p-2 bg-gray-100 rounded-full"><Users className="h-5 w-5 text-gray-600" /></div>)}</div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-1">{role}</h5>
                      <div className="space-y-1">
                        <p className={`text-2xl font-bold ${isFulfilled ? 'text-green-600' : 'text-gray-900'}`}>{allocatedCount}/{count}</p>
                        <p className="text-xs text-gray-500">{isFulfilled ? (<span className="text-green-600 font-medium flex items-center justify-center gap-1"><CheckCircle2 className="h-3 w-3" />Fulfilled</span>) : (<span className="text-amber-600">{remaining} more needed</span>)}</p>
                      </div>
                    </div>
                    <div className="w-full"><div className="w-full bg-gray-200 rounded-full h-2"><div className={`h-2 rounded-full transition-all ${isFulfilled ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(100, (allocatedCount / count) * 100)}%` }}></div></div></div>
                  </div>
                </Card>
              );
            })}
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${Object.entries(project.seats_by_type).every(([role, count]) => { const allocatedCount = projectAllocations.filter(a => { const emp = employeesData.find(e => e.user_id === a.employee_id); return emp?.type === role; }).length; return allocatedCount >= count; }) ? 'bg-green-100' : 'bg-amber-100'}`}>
                  {Object.entries(project.seats_by_type).every(([role, count]) => { const allocatedCount = projectAllocations.filter(a => { const emp = employeesData.find(e => e.user_id === a.employee_id); return emp?.type === role; }).length; return allocatedCount >= count; }) ? (<CheckCircle2 className="h-5 w-5 text-green-600" />) : (<AlertTriangle className="h-5 w-5 text-amber-600" />)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{Object.entries(project.seats_by_type).every(([role, count]) => { const allocatedCount = projectAllocations.filter(a => { const emp = employeesData.find(e => e.user_id === a.employee_id); return emp?.type === role; }).length; return allocatedCount >= count; }) ? 'All roles fulfilled!' : 'Some roles still need allocation'}</p>
                  <p className="text-sm text-gray-600">{totalAllocated} of {totalRoles} total positions filled</p>
                </div>
              </div>
              {totalAllocated < totalRoles && (<Button onClick={onOpenAllocate} size="sm" className="bg-indigo-600 hover:bg-indigo-700"><span>Allocate More</span></Button>)}
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-gray-900">Project Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <div><span className="font-medium text-gray-700">Client:</span><span className="ml-2 text-gray-900">{project.client_name || 'Not specified'}</span></div>
              <div><span className="font-medium text-gray-700">Industry:</span><span className="ml-2 text-gray-900">{project.industry || 'Not specified'}</span></div>
            </div>
            <div className="space-y-3">
              <div><span className="font-medium text-gray-700">Start Date:</span><span className="ml-2 text-gray-900">{new Date(project.start_date).toLocaleDateString()}</span></div>
              <div><span className="font-medium text-gray-700">End Date:</span><span className="ml-2 text-gray-900">{new Date(project.end_date).toLocaleDateString()}</span></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
