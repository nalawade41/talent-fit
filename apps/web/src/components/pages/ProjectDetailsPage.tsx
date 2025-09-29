import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEmployeeFilters } from '../../hooks/useEmployeeFilters';
import { useProjectData } from '../../hooks/useProjectData';
import EmployeeProfileService from '../../services/employeeProfileService';
import MatchService from '../../services/matchService';
import ProjectAllocationService from '../../services/projectAllocationService';
import projectService from '../../services/projectService';
import { ProjectsLoadingSkeleton } from '../Projects/ProjectsLoadingSkeleton';
import { Button } from '../ui/button';
import { AllocationDialog, AllocationsTab, OverviewCards, ProjectHeader, RequirementsTab, TimelineTab } from '../ui/project';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

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
  const [, setAiRecs] = useState<any[]>([]);
  const [apiEmployees, setApiEmployees] = useState<any[]>([]);
  const [, setLoadingAllocData] = useState(false);

  const { project, projectAllocations, totalAllocated, totalRoles, aiSuggestions, availableEmployees: allEmployees, getAIMatchScore, refreshProject, loadingAllocations } = useProjectData(projectId);
  const [loadingProject, setLoadingProject] = useState<boolean>(false);

  // Fetch project details from API and load into view
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoadingProject(true);
        const p = await projectService.getProjectById(projectId);
        if (!isMounted) return;
        // Use existing mechanism to update selected project
        refreshProject(p);
      } catch (e) {
        // Keep existing fallback behavior (static/local) if API fails
        console.warn('Failed to fetch project from API; using fallback. Error:', e);
      } finally { if (isMounted) setLoadingProject(false); }
    })();
    return () => { isMounted = false; };
  }, [projectId]);

  // Prefer API employees for allocations/requirements/timeline tabs; fallback to availableEmployees
  const employeesData = (apiEmployees.length ? apiEmployees : allEmployees) as any;

  const availableEmployees = useEmployeeFilters({
    employees: allEmployees as any,
    allocations: projectAllocations as any,
    searchQuery,
    skillsFilter,
    locationFilter,
    availabilityFilter
  });

  const handleAllocateEmployees = (dates?: Record<number, { start: string; end?: string; openEnded: boolean }>) => {
    (async () => {
      const payload = selectedEmployees.map((id) => ({
        employee_id: id,
        start_date: dates?.[id]?.start || new Date().toISOString().slice(0,10),
        end_date: dates?.[id]?.openEnded ? undefined : dates?.[id]?.end,
        allocation_type: 'Full-time' as const,
      }));
      try {
        await ProjectAllocationService.createAllocationsForProject(projectId, payload);
        setSelectedEmployees([]);
        setShowAllocationDialog(false);
        alert(`Successfully allocated ${payload.length} employees to ${project?.name}`);
      } catch (e) {
        console.error('Allocation failed', e);
        alert('Failed to allocate employees');
      }
    })();
  };
  // Load AI suggestions when dialog is opened (employees fetched inside dialog)
  useEffect(() => {
    if (!showAllocationDialog || !projectId) return;
    let isMounted = true;
    setLoadingAllocData(true);
    Promise.all([
      MatchService.getProjectSuggestions(projectId)
    ])
      .then(([suggestions]) => {
        if (!isMounted) return;
        setAiRecs(suggestions as any);
      })
      .catch((e) => {
        console.warn('Failed to load allocation dialog data', e);
      })
      .finally(() => { if (isMounted) setLoadingAllocData(false); });
    return () => { isMounted = false; };
  }, [showAllocationDialog, projectId]);

  // Load employees list for tabs (once per project view)
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const emps = await EmployeeProfileService.getAllEmployees();
        if (isMounted) setApiEmployees(emps as any);
      } catch (e) {
        // keep fallback to allEmployees
      }
    })();
    return () => { isMounted = false; };
  }, [projectId]);

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-600 bg-red-50';
    if (utilization >= 75) return 'text-amber-600 bg-amber-50';
    return 'text-green-600 bg-green-50';
  };

  if (!project || loadingProject || loadingAllocations) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/projects')} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Button>
        </div>
        <ProjectsLoadingSkeleton />
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
          projectAllocations={projectAllocations as any}
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
