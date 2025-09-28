import toast from "react-hot-toast";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectFormData, projectSchema } from "../types/project";
import type { Project } from "../types";
import ProjectService, { CreateProjectRequest } from "../services/projectService";

const useProjectCreationForm = (onProjectCreated?: (project: Project) => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [seatsByType, setSeatsByType] = useState<Record<string, number>>({});
  const [newRoleType, setNewRoleType] = useState('');
  const [newRoleSeats, setNewRoleSeats] = useState<number>(1);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      required_seats: 1,
      priority: 'medium',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
    }
  });
  
  const watchedRequiredSeats = watch('required_seats');

  const addRoleType = () => {
    if (newRoleType && newRoleSeats > 0) {
      setSeatsByType(prev => ({
        ...prev,
        [newRoleType]: newRoleSeats
      }));
      setNewRoleType('');
      setNewRoleSeats(1);

      // Update total required seats
      const totalSeats = Object.values({ ...seatsByType, [newRoleType]: newRoleSeats }).reduce((sum, seats) => sum + seats, 0);
      setValue('required_seats', totalSeats);
    }
  };

  const removeRoleType = (roleType: string) => {
    const updatedSeats = { ...seatsByType };
    delete updatedSeats[roleType];
    setSeatsByType(updatedSeats);

    // Update total required seats
    const totalSeats = Object.values(updatedSeats).reduce((sum, seats) => sum + seats, 0);
    setValue('required_seats', totalSeats || 1);
  };

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);

    try {
      // Prepare project data for API
      const projectData: CreateProjectRequest = {
        name: data.name,
        description: data.description,
        required_seats: data.required_seats,
        seats_by_type: seatsByType,
        start_date: new Date(data.start_date + 'T00:00:00.000Z').toISOString(), // Convert to start of day ISO datetime
        end_date: new Date(data.end_date + 'T23:59:59.999Z').toISOString(),     // Convert to end of day ISO datetime
        status: 'Open',
        client_name: data.client_name,
        industry: data.industry,
        geo_preference: data.geo_preference,
        priority: data.priority,
        budget: data.budget,
      };

      // Call the API to create project
      const createdProject = await ProjectService.createProject(projectData);

      toast.success('Project created successfully!', {
        icon: '✅',
      });

      // Call the callback with the created project
      if (onProjectCreated && createdProject) {
        onProjectCreated(createdProject);
      }
    } catch (error: any) {
      console.error('Error creating project:', error);
      const errorMessage = error.message || 'Failed to create project. Please try again.';
      toast.error(errorMessage, {
        icon: '❌',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    register,
    handleSubmit,
    setValue,
    watch,
    addRoleType,
    removeRoleType,
    onSubmit,

    errors,
    isSubmitting,
    seatsByType,
    newRoleType,
    newRoleSeats,
    setNewRoleType,
    setNewRoleSeats,
  };
}

export default useProjectCreationForm