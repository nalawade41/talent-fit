import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { EmployeeProfileService } from '../services';
import type { Employee } from '../data/employees';
import type { BackendEmployeeProfile } from '../types/api';

interface UseEmployeeProfileReturn {
  profile: Employee | null;
  loading: boolean;
  error: string | null;
  isCreateMode: boolean;
  fetchProfile: () => Promise<void>;
  saveProfile: (profileData: Partial<BackendEmployeeProfile>) => Promise<Employee | null>;
}

export const useEmployeeProfile = (): UseEmployeeProfileReturn => {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);

  const fetchProfile = async () => {
    if (!user?.email) {
      setError('No user found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const employeeProfile = await EmployeeProfileService.getEmployeeProfile();
      setProfile(employeeProfile);
      setIsCreateMode(false);
    } catch (err: any) {
      console.error('Error fetching employee profile:', err);
      
      // Check if it's a 404 error (profile doesn't exist)
      if (err.response?.status === 404) {
        setIsCreateMode(true);
        setProfile(null);
        setError(null);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch employee profile');
        setIsCreateMode(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (profileData: Partial<BackendEmployeeProfile>): Promise<Employee | null> => {
    if (!user?.email) {
      toast.error('No user found');
      return null;
    }

    try {
      let savedProfile: Employee;

      if (isCreateMode) {
        // Create new profile
        savedProfile = await EmployeeProfileService.createEmployeeProfile(profile?.user_id!, profileData);
        setIsCreateMode(false);
        toast.success('Profile created successfully!');
      } else {
        // Update existing profile
        savedProfile = await EmployeeProfileService.updateEmployeeProfile(profile?.user_id!, profileData);
        toast.success('Profile updated successfully!');
      }

      setProfile(savedProfile);
      setError(null);
      updateProfile({
        name: savedProfile.user.first_name,
        experience: savedProfile.years_of_experience,
        skills: savedProfile.skills
      });
      return savedProfile;
    } catch (err) {
      console.error('Error saving employee profile:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save profile';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    }
  };

  // Fetch profile when user changes or component mounts
  useEffect(() => {
    fetchProfile();
  }, [user?.email]);

  return {
    profile,
    loading,
    error,
    isCreateMode,
    fetchProfile,
    saveProfile,
  };
};

export default useEmployeeProfile;
