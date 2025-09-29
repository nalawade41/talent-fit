import { Calendar, Plus, Users, X } from 'lucide-react';
import React from 'react';
import { Employee } from '../../../data/employees';
import { Avatar, AvatarFallback, AvatarImage } from '../avatar';
import { Button } from '../button';
import { Card, CardContent, CardHeader, CardTitle } from '../card';

interface Allocation { id: number; employee_id: number; allocation_type: string; start_date: string; end_date?: string; }
interface AllocationsTabProps { projectAllocations: Allocation[]; employeesData: Employee[]; onOpenAllocate: () => void; }

export const AllocationsTab: React.FC<AllocationsTabProps> = ({ projectAllocations, employeesData, onOpenAllocate }) => {
  const getAllocationTypeStyles = (type: string) => {
    switch (type.toLowerCase()) {
      case 'full-time': return 'bg-green-50 text-green-700 border-green-200';
      case 'part-time': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'contract': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle>Current Team Allocations</CardTitle></CardHeader>
      <CardContent>
        {projectAllocations.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No team members allocated</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">Allocate employees to build the core delivery team for this project.</p>
            <Button onClick={onOpenAllocate} className="inline-flex items-center"><Plus className="h-4 w-4 mr-2" />Allocate Resources</Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projectAllocations.map(allocation => {
              const employee = employeesData.find(emp => emp.user_id === allocation.employee_id);
              if (!employee) return null;
              return (
                <div
                  key={allocation.id}
                  className="group relative rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 shadow-sm hover:shadow-md transition-all duration-200 focus-within:ring-2 focus-within:ring-indigo-500"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar className="h-11 w-11 ring-2 ring-white dark:ring-gray-900 shadow-sm">
                      <AvatarImage src={employee.avatar} />
                      <AvatarFallback className="text-sm">
                        {employee.user.first_name[0]}{employee.user.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 leading-tight truncate">
                        {employee.user.first_name} {employee.user.last_name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {employee.type}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className={`text-[10px] px-2 py-1 rounded-full border font-medium tracking-wide ${getAllocationTypeStyles(allocation.allocation_type)}`}>
                          {allocation.allocation_type}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      <span>{new Date(allocation.start_date).toLocaleDateString()}</span>
                      <span className="text-gray-300">→</span>
                      <span>{allocation.end_date ? new Date(allocation.end_date).toLocaleDateString() : 'Ongoing'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Add member tile */}
            <button
              onClick={onOpenAllocate}
              className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-800 hover:border-indigo-400 dark:hover:border-indigo-500 bg-gray-50 dark:bg-gray-900/40 p-4 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
                <Plus className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">Add Member</span>
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
