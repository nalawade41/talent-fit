import { useEffect, useMemo, useState } from 'react';
import { projectAllocationsData } from '../data/allocations';
import { employeesData } from '../data/employees';
import { getMatchSuggestions } from '../data/matches';
import { projectsData } from '../data/projects';
import ProjectAllocationService from '../services/projectAllocationService';
import { Project } from '../types';

export interface UseProjectDataResult {
  project: Project | null;
  projectAllocations: any[];
  totalAllocated: number;
  totalRoles: number;
  aiSuggestions: any[];
  availableEmployees: any[];
  getAIMatchScore: (employeeId: number) => number;
  refreshProject: (updated?: Project) => void;
  loadingAllocations: boolean;
}

export function useProjectData(projectId: number): UseProjectDataResult {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const project = useMemo(() => {
    if (currentProject) return currentProject;
    const normalize = (proj: any): Project => ({
      ...proj,
      priority: (['low','medium','high'].includes(proj?.priority) ? proj.priority : undefined) as 'low' | 'medium' | 'high' | undefined,
    });

    let pAny: any = projectsData.find(p => p.id === projectId);
    let p: Project | null = pAny ? normalize(pAny) : null;
    if (!p) {
      const stored = JSON.parse(localStorage.getItem('projects') || '[]');
      const sp: any = stored.find((sp: any) => sp.id === projectId);
      p = sp ? normalize(sp) : null;
    }
    return p || null;
  }, [currentProject, projectId]);

  const [apiAllocations, setApiAllocations] = useState<any[]>([]);
  const [loadingAllocations, setLoadingAllocations] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoadingAllocations(true);
      try {
        const allocs = await ProjectAllocationService.getProjectAllocations(projectId);
        if (isMounted) setApiAllocations(allocs);
      } catch {
        // fall back to static allocations
        if (isMounted) setApiAllocations(projectAllocationsData.filter(a => a.project_id === projectId));
      } finally {
        if (isMounted) setLoadingAllocations(false);
      }
    })();
    return () => { isMounted = false; };
  }, [projectId]);

  const projectAllocations = apiAllocations;
  const totalAllocated = useMemo(() => {
    const now = new Date();
    return projectAllocations.filter(a => {
      const start = new Date(a.start_date);
      const end = a.end_date ? new Date(a.end_date) : null;
      return start <= now && (!end || end >= now);
    }).length;
  }, [projectAllocations]);
  const totalRoles = project?.required_seats || 0;
  const aiSuggestions = useMemo(() => getMatchSuggestions(projectId), [projectId]);

  const getAIMatchScore = (employeeId: number) => {
    const match = aiSuggestions.find(s => s.employee.user_id === employeeId);
    return match ? match.match.score : Math.floor(Math.random() * 40) + 60;
  };

  // For available employees filtering, caller will supply filters (to keep hook generic)
  const availableEmployees = employeesData; // raw list, filtering done outside via another hook or memo

  const refreshProject = (updated?: Project) => {
    if (updated) setCurrentProject(updated); else setCurrentProject(null);
  };

  return { project, projectAllocations, totalAllocated, totalRoles, aiSuggestions, availableEmployees, getAIMatchScore, refreshProject, loadingAllocations };
}
