import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { EmployeeProfileService } from '../services';
import type { Employee } from '../data/employees';
import type { BackendEmployeeProfile } from '../types/api';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { calculateProfileCompletion } from '../types/profile';
import { 
  EmployeeProfile,
  EMPLOYEE_TYPES,
} from '../types/profile';

interface UseEmployeeProfileReturn {
  profile: Employee | null;
  loading: boolean;
  error: string | null;
  isCreateMode: boolean;
  fetchProfile: () => Promise<void>;
  saveProfile: (profileData: Partial<BackendEmployeeProfile>) => Promise<Employee | null>;
  register: any;
  handleSubmit: any;
  watch: any;
  setValue: any;
  reset: any;
  formState: any;
  isSubmitting: boolean;
  isLoading: boolean; // Add isLoading for form display
  getCompletionColor: any;
  profileCompletion: number;
  totalIndustryYears: number;
  onSubmit: any;
  watchedValues: any;
}

export const useEmployeeProfile = (onSave?: (profile: EmployeeProfile) => void, forceCreateMode = false): UseEmployeeProfileReturn => {
  const location = useLocation();
  const employeeProfile = location.state?.employeeProfile;
  const { user, updateProfile, profileStatus } = useAuth();
  const [profile, setProfile] = useState<Employee | null>(employeeProfile || null);
  const [loading, setLoading] = useState(!employeeProfile); // Only loading if no profile passed
  const [error, setError] = useState<string | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(forceCreateMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProfile = async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    setLoading(true); // Ensure loading is true when fetching
    try {
      setError(null);
      const fetchedProfile = await EmployeeProfileService.getEmployeeProfile();
      setProfile(fetchedProfile); // This will trigger the useEffect to update the form
      setIsCreateMode(false);
    } catch (err: any) {
      
      // Check if it's a 404 error (profile doesn't exist)
      if (err.response?.status === 404) {
        setIsCreateMode(true);
        setError(null); // Clear error for create mode
      } else {
        setError(err.message || 'Failed to fetch employee profile');
        toast.error('Failed to load profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (profileData: Partial<BackendEmployeeProfile>): Promise<Employee | null> => {
    if (!user?.email && !user?.id) {
      toast.error('No user found');
      return null;
    }

    const userId = profile?.user_id || user?.id;
    if (!userId) {
      toast.error('User not found');
      return null;
    }

    try {
      let savedProfile: Employee;

      if (isCreateMode) {
        // Create new profile
        savedProfile = await EmployeeProfileService.createEmployeeProfile(userId, profileData);
        setIsCreateMode(false);
        toast.success('Profile created successfully!');
      } else {
        // Update existing profile
        savedProfile = await EmployeeProfileService.updateEmployeeProfile(userId, profileData);
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
    if (profileStatus === 'needs_creation') {
      setIsCreateMode(true);
      setLoading(false);
      return;
    }
    if (user?.email && !employeeProfile) {
      fetchProfile();
    }
  }, [user?.email, profileStatus, employeeProfile]);

  // Helper function to convert Employee data to EmployeeProfile format
  const convertEmployeeToProfileForm = (employee: Employee): Partial<EmployeeProfile> => {
    return {
      name: `${employee.user.first_name} ${employee.user.last_name}`.trim(),
      email: employee.user.email,
      country: employee.geo || 'United States',
      dateOfJoining: employee.date_of_joining ? new Date(employee.date_of_joining).toISOString().split('T')[0] : '',
      employeeType: (employee.type as typeof EMPLOYEE_TYPES[number]) || 'Full-time',
      department: employee.department || 'Engineering',
      industries: employee.industry && employee.industry.length > 0 
        ? employee.industry.map(ind => ({ 
            industry: ind.industry as any, // Extract industry name from the object
            years: ind.years || 1 // Extract years from the object
          }))
        : [{ industry: 'Technology' as any, years: 1 }],
      experience: employee.years_of_experience || 1,
      experienceLevel: employee.years_of_experience >= 12 ? 'Principal (12+ years)' : 
                       employee.years_of_experience >= 8 ? 'Lead (8-12 years)' :
                       employee.years_of_experience >= 5 ? 'Senior (5-8 years)' : 
                       employee.years_of_experience >= 2 ? 'Mid-level (2-5 years)' : 
                       'Junior (0-2 years)',
      skills: [...(employee.primary_skills || []), ...(employee.secondary_skills || [])],
      endDate: employee.end_date ? new Date(employee.end_date).toISOString().split('T')[0] : '',
      noticeDate: employee.notice_date ? new Date(employee.notice_date).toISOString().split('T')[0] : '',
      availableForAdditionalWork: employee.availability_flag || false
    };
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty }
  } = useForm<EmployeeProfile>({
    mode: 'onChange',
    defaultValues: employeeProfile ? convertEmployeeToProfileForm(employeeProfile) : {
      name: user?.name || '',
      email: user?.email || '',
      country: 'United States',
      dateOfJoining: '',
      employeeType: 'Full-time',
      department: user?.department || 'Engineering',
      industries: [{ industry: 'Technology', years: 1 }],
      experience: 1,
      experienceLevel: 'Mid-level (2-5 years)',
      skills: user?.skills || [],
      endDate: '',
      noticeDate: '',
      availableForAdditionalWork: false
    }
  });

  const watchedValues = watch();
  const profileCompletion = calculateProfileCompletion(watchedValues);

  // Calculate total years from industry experience
  const totalIndustryYears = watchedValues.industries?.reduce((total, industry) => total + industry.years, 0) || 0;

  // Update form when profile data changes (from navigation or API)
  useEffect(() => {
    if (profile) {
      const profileFormData = convertEmployeeToProfileForm(profile);
      // Use reset instead of setValue to update all fields at once
      reset(profileFormData as EmployeeProfile);
      setLoading(false);
    }
  }, [profile, reset]);

  useEffect(() => {
    // If we have employee profile from navigation, use that data immediately
    if (employeeProfile) {
      setProfile(employeeProfile);
    } else {
      // Otherwise, load saved profile from localStorage
      const savedProfile = localStorage.getItem('employeeProfile');
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile);
          Object.keys(parsedProfile).forEach((key) => {
            setValue(key as keyof EmployeeProfile, parsedProfile[key]);
          });
        } catch (error) {
          console.error('Error loading saved profile:', error);
        }
      }
    }
  }, [setValue, employeeProfile]);

  const onSubmit = async (data: EmployeeProfile) => {
    setIsSubmitting(true);

    try {
      // Convert EmployeeProfile to BackendEmployeeProfile format
      const backendProfileData: Partial<BackendEmployeeProfile> = {
        user_id: user?.id, // Add user_id to the request body
        name: data.name,
        geo: data.country,
        date_of_joining: data.dateOfJoining ? new Date(data.dateOfJoining).toISOString() : null,
        end_date: data.endDate ? new Date(data.endDate).toISOString() : null,
        notice_date: data.noticeDate ? new Date(data.noticeDate).toISOString() : null,
        skills: data.skills || [],
        years_of_experience: totalIndustryYears,
        industry: data.industries?.map(ind => `${ind.industry}|${ind.years}`) || ['Technology|1'],
        availability_flag: data.availableForAdditionalWork || false,
        employment_type: data.employeeType || 'Full-time',
        experience_level: data.experienceLevel || 'Mid-level (2-5 years)',
        department: data.department || 'Engineering'
      };

      // Save to backend API
      const savedProfile = await saveProfile(backendProfileData);
      
      if (savedProfile) {
        // Update local profile state
        setProfile(savedProfile);
        
        // Save to localStorage for offline access
        const profileWithCompletion = {
          ...data,
          experience: totalIndustryYears,
          profileCompletionPercentage: calculateProfileCompletion({ ...data, experience: totalIndustryYears })
        };
        localStorage.setItem('employeeProfile', JSON.stringify(profileWithCompletion));
        
        // Update auth context
        updateProfile({
          name: data.name,
          department: data.department,
          experience: totalIndustryYears,
          skills: data.skills
        });

        // Call parent onSave if provided
        onSave?.(profileWithCompletion);

        // Show success toast
        toast.success('Profile saved successfully!', {
          icon: '✅',
        });
        
        // Reset form dirty state to hide "unsaved changes" indicator
        reset(profileWithCompletion as EmployeeProfile, { keepValues: true });
      }
      
    } catch (error) {
      console.error('Error saving profile:', error);
      // Show error toast
      toast.error('Failed to save profile. Please try again.', {
        icon: '❌',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-50';
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return {
    profile,
    loading,
    error,
    isCreateMode,
    formState: { errors, isDirty },
    isSubmitting,
    isLoading: loading, // Alias for form display
    profileCompletion,
    totalIndustryYears,
    watchedValues,

    fetchProfile,
    saveProfile,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    getCompletionColor,
    onSubmit
  };
};

export default useEmployeeProfile;
