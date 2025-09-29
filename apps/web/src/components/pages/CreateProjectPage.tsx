import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../../types';
import { ProjectCreationForm } from '../Projects/ProjectCreationForm';

export function CreateProjectPage() {
  const navigate = useNavigate();

  const handleProjectCreated = (newProject: Project) => {
    // Navigate back to projects list after successful creation
    navigate('/projects', { 
      state: { 
        message: `Project "${newProject.name}" created successfully!` 
      } 
    });
  };

  const handleCancel = () => {
    // Navigate back to projects list
    navigate('/projects');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
          <p className="text-gray-600 mt-2">
            Fill in the details below to create a new project and start matching talent.
          </p>
        </div>

        {/* Project Creation Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <ProjectCreationForm
            onProjectCreated={handleProjectCreated}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}

export default CreateProjectPage;
