import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProjectData } from '../../hooks/useProjectData';
import projectService from '../../services/projectService';
import { ProjectEditForm } from '../Projects/ProjectEditForm';
import { ProjectsLoadingSkeleton } from '../Projects/ProjectsLoadingSkeleton';
import { Button } from '../ui/button';

export function ProjectEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projectId = parseInt(id || '0');

  const { project, refreshProject } = useProjectData(projectId);
  const [loadingProject, setLoadingProject] = useState<boolean>(false);

  // Fetch project details from API (so edit works on server data too)
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoadingProject(true);
        const p = await projectService.getProjectById(projectId);
        if (!isMounted) return;
        refreshProject(p);
      } catch (e) {
        // Fallback to existing state; keep silent
      } finally {
        if (isMounted) setLoadingProject(false);
      }
    })();
    return () => { isMounted = false; };
  }, [projectId]);

  const handleProjectUpdated = (updatedProject: any) => {
    console.log('Project updated:', updatedProject);
    refreshProject();
    // Navigate back to project details after successful update
    navigate(`/projects/${projectId}`);
  };

  const handleCancel = () => {
    navigate(`/projects/${projectId}`);
  };

  if (!project || loadingProject) {
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
        <Button variant="ghost" onClick={() => navigate(`/projects/${projectId}`)} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Project Details
        </Button>
      </div>

      <ProjectEditForm
        project={project}
        onProjectUpdated={handleProjectUpdated}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default ProjectEditPage;
