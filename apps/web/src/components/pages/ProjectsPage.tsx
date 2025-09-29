import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useProjects, useProjectFilters } from '../../hooks';
import { ProjectFilters, ProjectsHeader, ProjectsList, ProjectsLoadingSkeleton } from '../Projects';

export function ProjectsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use custom hooks
  const { projects, loading } = useProjects();
  const {
    filterState,
    filteredProjects,
    filterOptions,
    hasActiveFilters,
    handleSearchChange,
    handleFilterChange,
    clearFilters
  } = useProjectFilters(projects);

  // Handle success message from project creation
  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);
      // Clear the state to prevent showing the message again on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, location.pathname, navigate]);

  const handleCreateProject = () => {
    navigate('/projects/create');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <ProjectsHeader 
        loading={loading} 
        onCreateProject={handleCreateProject} 
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
            onCreateProject={handleCreateProject}
            onClearFilters={clearFilters}
          />
        )}
      </div>

    </div>
  );
}

export default ProjectsPage;
