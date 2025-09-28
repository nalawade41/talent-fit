import { CheckCircle2, MapPin, Search, Star } from 'lucide-react';
import React from 'react';
import { Employee } from '../../data/employees';
import { Project } from '../../types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

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
  onAllocate: () => void;
}

export const AllocationDialog: React.FC<AllocationDialogProps> = ({
  open,
  onOpenChange,
  allocationMode,
  onAllocationModeChange,
  project,
  availableEmployees,
  selectedEmployees,
  setSelectedEmployees,
  searchQuery,
  setSearchQuery,
  skillsFilter,
  setSkillsFilter,
  locationFilter,
  setLocationFilter,
  availabilityFilter,
  setAvailabilityFilter,
  aiSuggestions,
  getAIMatchScore,
  getUtilizationColor,
  onAllocate
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Allocate Resources to {project.name}</DialogTitle>
          <DialogDescription>
            Select employees to assign to this project. You can choose manual selection or view AI suggestions.
          </DialogDescription>
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
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Availability</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="bench">On Bench</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
              {availableEmployees.map(employee => {
                const isSelected = selectedEmployees.includes(employee.user_id);
                const matchScore = getAIMatchScore(employee.user_id);
                return (
                  <Card key={employee.user_id} className={`p-4 cursor-pointer transition-colors ${isSelected ? 'ring-2 ring-indigo-500 bg-indigo-50' : 'hover:bg-gray-50'}`} onClick={() => {
                    if (isSelected) setSelectedEmployees(prev => prev.filter(id => id !== employee.user_id)); else setSelectedEmployees(prev => [...prev, employee.user_id]);
                  }}>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={employee.avatar} />
                        <AvatarFallback>{employee.user.first_name[0]}{employee.user.last_name[0]}</AvatarFallback>
                      </Avatar>
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
                          {employee.primary_skills.slice(0, 3).map(skill => (<Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>))}
                          {employee.primary_skills.length > 3 && (<Badge variant="secondary" className="text-xs">+{employee.primary_skills.length - 3}</Badge>)}
                        </div>
                      </div>
                      {isSelected && (<CheckCircle2 className="h-5 w-5 text-indigo-600" />)}
                    </div>
                  </Card>
                );
              })}
            </div>
            {availableEmployees.length === 0 && (<div className="text-center py-8 text-gray-500"><p>No available employees match your criteria.</p></div>)}
          </TabsContent>
          <TabsContent value="ai" className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">AI-Powered Recommendations</h4>
              <p className="text-sm text-blue-700">Based on project requirements, skills matching, and availability analysis.</p>
            </div>
            <div className="space-y-3">
              {aiSuggestions.slice(0, 5).map((suggestion, index) => {
                const employee = availableEmployees.find(emp => emp.user_id === suggestion.employee.user_id);
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
                        <div className="mt-2 flex flex-wrap gap-1">{employee.primary_skills.slice(0, 4).map(skill => (<Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>))}</div>
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
          <Button variant="outline" onClick={() => { onOpenChange(false); setSelectedEmployees([]); }}>Cancel</Button>
          <Button onClick={onAllocate} disabled={selectedEmployees.length === 0} className="bg-indigo-600 hover:bg-indigo-700">Allocate {selectedEmployees.length} Employee{selectedEmployees.length !== 1 ? 's' : ''}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
