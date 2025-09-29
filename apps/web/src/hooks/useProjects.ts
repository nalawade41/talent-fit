import { useEffect, useState } from 'react';
import { projectsData } from '../data/projects';
import projectService from '../services/projectService';
import { Project } from '../types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const sortProjects = (items: Project[]) => {
    const arr = [...items];
    arr.sort((a, b) => {
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 } as const;
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
      if (aPriority !== bPriority) return bPriority - aPriority;
      const aDate = new Date(a.created_at || a.start_date).getTime();
      const bDate = new Date(b.created_at || b.start_date).getTime();
      return bDate - aDate;
    });
    return arr;
  };

  const addProject = (newProject: Project) => {
    let updatedProjects = [...projects, newProject];
    
    // Re-sort projects by priority after adding new project
    updatedProjects.sort((a, b) => {
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
      
      // Sort by priority first, then by creation date (newest first)
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      // Secondary sort by date (newest first)
      const aDate = new Date(a.created_at || a.start_date).getTime();
      const bDate = new Date(b.created_at || b.start_date).getTime();
      return bDate - aDate;
    });
    
    setProjects(updatedProjects);
    
    // Update localStorage with all projects that are not from static data
    const customProjects = updatedProjects.filter(p => 
      !projectsData.find(staticProject => staticProject.id === p.id) || 
      (p.updated_at && projectsData.find(staticProject => 
        staticProject.id === p.id && 
        (!staticProject.updated_at || new Date(p.updated_at) > new Date(staticProject.updated_at))
      ))
    );
    localStorage.setItem('projects', JSON.stringify(customProjects));
  };

  // Load projects from API; fallback to static + localStorage if API fails
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    (async () => {
      try {
        const apiProjects = await projectService.getAllProjects();
        if (!isMounted) return;
        setProjects(sortProjects(apiProjects));
        setLoading(false);
      } catch (err) {
        console.warn('Falling back to static/local projects due to API error:', err);
        const savedProjects = localStorage.getItem('projects');
        let combinedProjects: Project[] = [...projectsData as Project[]];
        if (savedProjects) {
          try {
            const parsedProjects: Project[] = JSON.parse(savedProjects);
            parsedProjects.forEach((savedProject) => {
              const exists = combinedProjects.find(p => p.id === savedProject.id);
              if (!exists) {
                combinedProjects.push(savedProject);
              } else {
                const index = combinedProjects.findIndex(p => p.id === savedProject.id);
                if (index !== -1 && savedProject.updated_at && 
                    (!combinedProjects[index].updated_at || 
                     new Date(savedProject.updated_at) > new Date(combinedProjects[index].updated_at))) {
                  combinedProjects[index] = savedProject;
                }
              }
            });
          } catch (error) {
            console.error('Error loading projects:', error);
          }
        }
        if (isMounted) {
          setProjects(sortProjects(combinedProjects));
          setLoading(false);
        }
      }
    })();
    return () => { isMounted = false; };
  }, []);

  return {
    projects,
    loading,
    addProject
  };
}
