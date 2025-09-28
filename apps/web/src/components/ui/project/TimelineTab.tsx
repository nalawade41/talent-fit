import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../card';
import { Project, Employee } from '../../../types';

interface Allocation { id: number; employee_id: number; start_date: string; }
interface TimelineTabProps { project: Project; projectAllocations: Allocation[]; employeesData: Employee[]; }

export const TimelineTab: React.FC<TimelineTabProps> = ({ project, projectAllocations, employeesData }) => {
  return (
    <Card>
      <CardHeader><CardTitle>Project Timeline</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <div>
              <p className="font-medium">Project Start</p>
              <p className="text-sm text-gray-600">{new Date(project.start_date).toLocaleDateString()}</p>
            </div>
          </div>
          {projectAllocations.map(allocation => {
            const employee = employeesData.find(emp => emp.user_id === allocation.employee_id);
            if (!employee) return null;
            return (
              <div key={allocation.id} className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <div>
                  <p className="font-medium">{employee.user.first_name} {employee.user.last_name} joins</p>
                  <p className="text-sm text-gray-600">{new Date(allocation.start_date).toLocaleDateString()}</p>
                </div>
              </div>
            );
          })}
          <div className="flex items-center gap-4 p-4 bg-red-50 rounded-lg">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <div>
              <p className="font-medium">Project End</p>
              <p className="text-sm text-gray-600">{new Date(project.end_date).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
