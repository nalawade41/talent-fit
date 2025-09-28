import { useState, useMemo } from 'react';
import { Project } from '../types';
import { projectsData } from '../data/projects';
import { projectAllocationsData } from '../data/allocations';
import { employeesData } from '../data/employees';
import { getMatchSuggestions } from '../data/matches';

export interface UseProjectDataResult {
  project: Project | null;
  projectAllocations: any[];
  totalAllocated: number;
  totalRoles: number;
  aiSuggestions: any[];
  availableEmployees: any[];
  getAIMatchScore: (employeeId: number) => number;
  refreshProject: (updated?: Project) => void;
}

export function useProjectData(projectId: number): UseProjectDataResult {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const project = useMemo(() => {
    if (currentProject) return currentProject;
    let p = projectsData.find(p => p.id === projectId);
    if (!p) {
      const stored = JSON.parse(localStorage.getItem('projects') || '[]');
      p = stored.find((sp: Project) => sp.id === projectId);
    }
    return p || null;
  }, [currentProject, projectId]);

  const projectAllocations = useMemo(() => projectAllocationsData.filter(a => a.project_id === projectId), [projectId]);
  const totalAllocated = projectAllocations.length;
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

  return { project, projectAllocations, totalAllocated, totalRoles, aiSuggestions, availableEmployees, getAIMatchScore, refreshProject };
}
