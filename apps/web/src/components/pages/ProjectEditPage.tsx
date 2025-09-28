import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { ProjectEditForm } from '../Projects/ProjectEditForm';
import { useProjectData } from '../../hooks/useProjectData';

export function ProjectEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projectId = parseInt(id || '0');

  const { project, refreshProject } = useProjectData(projectId);

  const handleProjectUpdated = (updatedProject: any) => {
    console.log('Project updated:', updatedProject);
    refreshProject();
    // Navigate back to project details after successful update
    navigate(`/projects/${projectId}`);
  };

  const handleCancel = () => {
    navigate(`/projects/${projectId}`);
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
