import { useState } from 'react';
import { useProjects, useProjectFilters } from '../../hooks';
import { Project } from '../../types';
import { ProjectCreationForm } from '../Projects/ProjectCreationForm';
import { ProjectFilters, ProjectsHeader, ProjectsList, ProjectsLoadingSkeleton } from '../Projects';

export function ProjectsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Use custom hooks
  const { projects, loading, addProject } = useProjects();
  const {
    filterState,
    filteredProjects,
    filterOptions,
    hasActiveFilters,
    handleSearchChange,
    handleFilterChange,
    clearFilters
  } = useProjectFilters(projects);

  const handleProjectCreated = (newProject: Project) => {
    addProject(newProject);
    setShowCreateForm(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <ProjectsHeader 
        loading={loading} 
        onCreateProject={() => setShowCreateForm(true)} 
      />

      {/* Filter Section */}
      <ProjectFilters
        filterState={filterState}
        filterOptions={filterOptions}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />

      {/* Results Section */}
      <div className="space-y-4">
        {loading ? (
          <ProjectsLoadingSkeleton />
        ) : (
          <ProjectsList
            projects={filteredProjects}
            hasActiveFilters={hasActiveFilters}
            onCreateProject={() => setShowCreateForm(true)}
            onClearFilters={clearFilters}
          />
        )}
      </div>

      {/* Project Creation Form Modal */}
      {showCreateForm && (
        <ProjectCreationForm
          onProjectCreated={handleProjectCreated}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
}

export default ProjectsPage;
