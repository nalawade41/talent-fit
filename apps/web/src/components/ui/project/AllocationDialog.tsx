import { CheckCircle2, MapPin, Search, Star } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Employee } from '../../../data/employees';
import EmployeeProfileService from '../../../services/employeeProfileService';
import { Project } from '../../../types';
import { Avatar, AvatarFallback, AvatarImage } from '../avatar';
import { Badge } from '../badge';
import { Button } from '../button';
import { Card } from '../card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../dialog';
import { Input } from '../input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../tabs';

interface AllocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allocationMode: 'manual' | 'ai';
  onAllocationModeChange: (mode: 'manual' | 'ai') => void;
  project: Project;
  availableEmployees: Employee[];
  selectedEmployees: number[];
  setSelectedEmployees: React.Dispatch<React.SetStateAction<number[]>>;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  skillsFilter: string;
  setSkillsFilter: (v: string) => void;
  locationFilter: string;
  setLocationFilter: (v: string) => void;
  availabilityFilter: string;
  setAvailabilityFilter: (v: string) => void;
  aiSuggestions: any[];
  getAIMatchScore: (id: number) => number;
  getUtilizationColor: (n: number) => string;
  onAllocate: (dates: Record<number, { start: string; end?: string; openEnded: boolean }>) => void;
}

export const AllocationDialog: React.FC<AllocationDialogProps> = (props) => {
  const { open, onOpenChange, allocationMode, onAllocationModeChange, project, availableEmployees, selectedEmployees, setSelectedEmployees, searchQuery, setSearchQuery, skillsFilter, setSkillsFilter, locationFilter, setLocationFilter, availabilityFilter, setAvailabilityFilter, aiSuggestions, getAIMatchScore, getUtilizationColor, onAllocate } = props;

  // New state: allocation period per selected employee
  const [allocationDates, setAllocationDates] = useState<Record<number, { start: string; end?: string; openEnded: boolean }>>({});
  const [apiEmployees, setApiEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  useEffect(() => {
    if (!open) return;
    let isMounted = true;
    setLoadingEmployees(true);
    EmployeeProfileService.getAllEmployees()
      .then((emps) => { if (isMounted) setApiEmployees(emps); })
      .catch(() => { /* fallback to provided availableEmployees */ })
      .finally(() => { if (isMounted) setLoadingEmployees(false); });
    return () => { isMounted = false; };
  }, [open]);

  const manualList = apiEmployees.length ? apiEmployees : availableEmployees;

  const ensureDateEntry = (employeeId: number) => {
    setAllocationDates(prev => prev[employeeId] ? prev : ({
      ...prev,
      [employeeId]: {
        start: project.start_date?.slice(0,10) || new Date().toISOString().slice(0,10),
        openEnded: true
      }
    }));
  };

  const toggleSelect = (employeeId: number) => {
    if (selectedEmployees.includes(employeeId)) {
      setSelectedEmployees(prev => prev.filter(id => id !== employeeId));
      setAllocationDates(prev => { const copy = { ...prev }; delete copy[employeeId]; return copy; });
    } else {
      setSelectedEmployees(prev => [...prev, employeeId]);
      ensureDateEntry(employeeId);
    }
  };

  const updateDate = (employeeId: number, field: 'start' | 'end' | 'openEnded', value: string | boolean) => {
    setAllocationDates(prev => ({
      ...prev,
      [employeeId]: {
        start: prev[employeeId]?.start || project.start_date?.slice(0,10) || new Date().toISOString().slice(0,10),
        end: prev[employeeId]?.end,
        openEnded: prev[employeeId]?.openEnded ?? true,
        ...(field === 'start' ? { start: value as string } : {}),
        ...(field === 'end' ? { end: value as string } : {}),
        ...(field === 'openEnded' ? { openEnded: value as boolean, ...(value ? { end: undefined } : {}) } : {})
      }
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Allocate Resources to {project.name}</DialogTitle>
          <DialogDescription>Select employees to assign to this project. You can choose manual selection or view AI suggestions.</DialogDescription>
        </DialogHeader>
        <Tabs value={allocationMode} onValueChange={(v) => onAllocationModeChange(v as 'manual' | 'ai')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Selection</TabsTrigger>
            <TabsTrigger value="ai">AI Suggestions</TabsTrigger>
          </TabsList>
          <TabsContent value="manual" className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Search employees..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <Input placeholder="Skills filter..." value={skillsFilter} onChange={(e) => setSkillsFilter(e.target.value)} />
              <Input placeholder="Location filter..." value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} />
              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Availability</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="bench">On Bench</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
              {manualList.map(employee => {
                const isSelected = selectedEmployees.includes(employee.user_id);
                const matchScore = getAIMatchScore(employee.user_id);
                return (
                  <div key={employee.user_id} className={`space-y-2 rounded-md border ${isSelected ? 'border-indigo-400 bg-indigo-50/60' : 'border-transparent'} hover:border-gray-200 transition-colors p-0`}>                    
                    <Card className={`p-4 cursor-pointer shadow-none border-0 m-0 ${isSelected ? 'bg-transparent' : ''}`} onClick={() => toggleSelect(employee.user_id)}>
                      <div className="flex items-center gap-4">
                        <Avatar><AvatarImage src={employee.avatar} /><AvatarFallback>{employee.user.first_name[0]}{employee.user.last_name[0]}</AvatarFallback></Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{employee.user.first_name} {employee.user.last_name}</h4>
                            <Badge variant="outline" className="text-xs">{employee.type}</Badge>
                            {employee.availability_flag && (<Badge variant="default" className="text-xs bg-green-100 text-green-800">Available</Badge>)}
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{employee.geo}</span>
                            <span className="flex items-center gap-1"><Star className="h-3 w-3" />{matchScore}% match</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${getUtilizationColor(employee.utilization_pct)}`}>{employee.utilization_pct}% utilized</span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {employee.primary_skills.slice(0, 3).map((skill: string) => (<Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>))}
                            {employee.primary_skills.length > 3 && (<Badge variant="secondary" className="text-xs">+{employee.primary_skills.length - 3}</Badge>)}
                          </div>
                        </div>
                        {isSelected && (<CheckCircle2 className="h-5 w-5 text-indigo-600" />)}
                      </div>
                    </Card>
                    {isSelected && (
                      <div className="px-4 pb-4 -mt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-medium text-gray-600">Start Date<span className="text-red-500">*</span></label>
                            <input
                              type="date"
                              value={allocationDates[employee.user_id]?.start || project.start_date?.slice(0,10) || ''}
                              min={project.start_date?.slice(0,10)}
                              onChange={(e) => updateDate(employee.user_id, 'start', e.target.value)}
                              className="h-9 rounded-md border border-gray-300 bg-white px-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              required
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-medium text-gray-600 flex items-center gap-2">
                              End Date
                              <span className="text-gray-400 font-normal">(optional)</span>
                            </label>
                            <input
                              type="date"
                              value={allocationDates[employee.user_id]?.end || ''}
                              min={allocationDates[employee.user_id]?.start || project.start_date?.slice(0,10)}
                              onChange={(e) => updateDate(employee.user_id, 'end', e.target.value)}
                              disabled={allocationDates[employee.user_id]?.openEnded}
                              className="h-9 rounded-md border border-gray-300 bg-white px-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-40"
                            />
                          </div>
                          <div className="flex items-center gap-2 pt-5 sm:pt-0">
                            <input
                              id={`openEnded-${employee.user_id}`}
                              type="checkbox"
                              checked={allocationDates[employee.user_id]?.openEnded ?? true}
                              onChange={(e) => updateDate(employee.user_id, 'openEnded', e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor={`openEnded-${employee.user_id}`} className="text-xs text-gray-600 select-none">
                              Open-ended
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {manualList.length === 0 && (<div className="text-center py-8 text-gray-500"><p>{loadingEmployees ? 'Loading employees...' : 'No available employees match your criteria.'}</p></div>)}
          </TabsContent>
          <TabsContent value="ai" className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">AI-Powered Recommendations</h4>
              <p className="text-sm text-blue-700">Based on project requirements, skills matching, and availability analysis.</p>
            </div>
            <div className="space-y-3">
              {aiSuggestions.slice(0, 5).map((suggestion, index) => {
                const employee = manualList.find(emp => emp.user_id === (suggestion.employee?.user_id ?? suggestion.profile?.user_id));
                if (!employee) return null;
                const isSelected = selectedEmployees.includes(employee.user_id);
                return (
                  <Card key={employee.user_id} className={`p-4 cursor-pointer transition-colors ${isSelected ? 'ring-2 ring-indigo-500 bg-indigo-50' : 'hover:bg-gray-50'}`} onClick={() => {
                    if (isSelected) setSelectedEmployees(prev => prev.filter(id => id !== employee.user_id)); else setSelectedEmployees(prev => [...prev, employee.user_id]);
                  }}>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2"><span className="text-sm font-medium text-indigo-600">#{index + 1}</span><Avatar><AvatarImage src={employee.avatar} /><AvatarFallback>{employee.user.first_name[0]}{employee.user.last_name[0]}</AvatarFallback></Avatar></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2"><h4 className="font-medium">{employee.user.first_name} {employee.user.last_name}</h4><Badge variant="outline" className="text-xs">{employee.type}</Badge><Badge className="text-xs bg-green-100 text-green-800">{suggestion.match.score}% match</Badge></div>
                        <p className="text-sm text-gray-600 mt-1">{suggestion.match.explanation}</p>
                        <div className="mt-2 flex flex-wrap gap-1">{employee.primary_skills.slice(0, 4).map((skill: string) => (<Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>))}</div>
                      </div>
                      {isSelected && (<CheckCircle2 className="h-5 w-5 text-indigo-600" />)}
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={() => { onOpenChange(false); setSelectedEmployees([]); setAllocationDates({}); }}>Cancel</Button>
          <Button onClick={() => onAllocate(allocationDates)} disabled={selectedEmployees.length === 0} className="bg-indigo-600 hover:bg-indigo-700">Allocate {selectedEmployees.length} Employee{selectedEmployees.length !== 1 ? 's' : ''}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
