import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { Project } from '../../types';
import { useProjectData } from '../../hooks/useProjectData';
import { useEmployeeFilters } from '../../hooks/useEmployeeFilters';
import { ProjectHeader, AllocationDialog, OverviewCards, AllocationsTab, RequirementsTab, TimelineTab } from '../ui/project';

export function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projectId = parseInt(id || '0');

  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [skillsFilter, setSkillsFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [showAllocationDialog, setShowAllocationDialog] = useState(false);
  const [allocationMode, setAllocationMode] = useState<'manual' | 'ai'>('manual');

  const { project, projectAllocations, totalAllocated, totalRoles, aiSuggestions, availableEmployees: allEmployees, getAIMatchScore, refreshProject } = useProjectData(projectId);

  // Expose full employees list for child components (was previously imported directly)
  const employeesData = allEmployees;

  const availableEmployees = useEmployeeFilters({
    employees: allEmployees as any,
    allocations: projectAllocations as any,
    searchQuery,
    skillsFilter,
    locationFilter,
    availabilityFilter
  });

  const handleAllocateEmployees = (dates?: Record<number, { start: string; end?: string; openEnded: boolean }>) => {
    console.log('Allocating employees with dates:', selectedEmployees.map(id => ({ id, ...dates?.[id] })), 'to project:', projectId);
    setSelectedEmployees([]);
    setShowAllocationDialog(false);
    alert(`Successfully allocated ${selectedEmployees.length} employees to ${project?.name}`);
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-600 bg-red-50';
    if (utilization >= 75) return 'text-amber-600 bg-amber-50';
    return 'text-green-600 bg-green-50';
  };

  if (!project) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/projects')} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Button>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-600">Project not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate('/projects')} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Button>
      </div>

      <ProjectHeader
        project={project}
        onEdit={() => navigate(`/projects/${projectId}/edit`)}
        onOpenAllocate={() => setShowAllocationDialog(true)}
      />

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="allocations">Allocations</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewCards
            project={project}
            totalAllocated={totalAllocated}
            totalRoles={totalRoles}
            onStatusChange={(status) => {
              console.log('Status changed to:', status);
              refreshProject();
            }}
          />
        </TabsContent>

        <TabsContent value="allocations" className="mt-6">
          <AllocationsTab
            projectAllocations={projectAllocations as any}
            employeesData={employeesData as any}
            onOpenAllocate={() => setShowAllocationDialog(true)}
          />
        </TabsContent>

        <TabsContent value="requirements" className="mt-6">
          <RequirementsTab 
            project={project}
            projectAllocations={projectAllocations as any}
            employeesData={employeesData as any}
            totalAllocated={totalAllocated}
            totalRoles={totalRoles}
            onOpenAllocate={() => setShowAllocationDialog(true)}
          />
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <TimelineTab 
            project={project}
            projectAllocations={projectAllocations as any}
            employeesData={employeesData as any}
          />
        </TabsContent>
      </Tabs>

      {showAllocationDialog && (
        <AllocationDialog
          open={showAllocationDialog}
          onOpenChange={setShowAllocationDialog}
          allocationMode={allocationMode}
          onAllocationModeChange={setAllocationMode}
          project={project}
          availableEmployees={availableEmployees as any}
          selectedEmployees={selectedEmployees}
          setSelectedEmployees={setSelectedEmployees}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          skillsFilter={skillsFilter}
          setSkillsFilter={setSkillsFilter}
          locationFilter={locationFilter}
          setLocationFilter={setLocationFilter}
          availabilityFilter={availabilityFilter}
          setAvailabilityFilter={setAvailabilityFilter}
          aiSuggestions={aiSuggestions as any}
          getAIMatchScore={getAIMatchScore}
          getUtilizationColor={getUtilizationColor}
          onAllocate={handleAllocateEmployees}
        />
      )}
    </div>
  );
}

export default ProjectDetailsPage;
