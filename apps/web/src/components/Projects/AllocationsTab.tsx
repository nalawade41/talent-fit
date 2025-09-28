import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Users, Plus, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Project } from '../../types';
import { Employee } from '../../types';

interface Allocation { id: number; employee_id: number; allocation_type: string; start_date: string; end_date?: string; }

interface AllocationsTabProps {
  projectAllocations: Allocation[];
  employeesData: Employee[];
  onOpenAllocate: () => void;
}

export const AllocationsTab: React.FC<AllocationsTabProps> = ({ projectAllocations, employeesData, onOpenAllocate }) => {
  return (
    <Card>
      <CardHeader><CardTitle>Current Team Allocations</CardTitle></CardHeader>
      <CardContent>
        {projectAllocations.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No team members allocated yet</h3>
            <p className="text-gray-500 mb-4">Start by allocating employees to this project.</p>
            <Button onClick={onOpenAllocate}><Plus className="h-4 w-4 mr-2" />Allocate Resources</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {projectAllocations.map(allocation => {
              const employee = employeesData.find(emp => emp.user_id === allocation.employee_id);
              if (!employee) return null;
              return (
                <Card key={allocation.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar><AvatarImage src={employee.avatar} /><AvatarFallback>{employee.user.first_name[0]}{employee.user.last_name[0]}</AvatarFallback></Avatar>
                      <div>
                        <h4 className="font-medium">{employee.user.first_name} {employee.user.last_name}</h4>
                        <p className="text-sm text-gray-500">{employee.type}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{allocation.allocation_type}</span>
                          <span className="text-xs text-gray-500">{new Date(allocation.start_date).toLocaleDateString()} - {allocation.end_date ? new Date(allocation.end_date).toLocaleDateString() : 'Ongoing'}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm"><X className="h-4 w-4" /></Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
