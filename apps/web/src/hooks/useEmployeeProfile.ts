import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api/client';
import type { BackendEmployeeProfile } from '../types/api';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { calculateProfileCompletion } from '../types/profile';
import { 
  EmployeeProfile,
  EMPLOYEE_TYPES,
  EXPERIENCE_LEVELS,
  INDUSTRIES
} from '../types/profile';

interface UseEmployeeProfileReturn {
  profile: BackendEmployeeProfile | null;
  loading: boolean;
  error: string | null;
  isCreateMode: boolean;
  fetchProfile: () => Promise<void>;
  saveProfile: (profileData: Partial<BackendEmployeeProfile>) => Promise<BackendEmployeeProfile | null>;
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
  const [profile, setProfile] = useState<BackendEmployeeProfile | null>(employeeProfile || null);
  const [loading, setLoading] = useState(!employeeProfile); // Only loading if no profile passed
  const [error, setError] = useState<string | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(forceCreateMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchProfile = async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Use the API client directly to get BackendEmployeeProfile
      const fetchedProfile = await apiService.get<BackendEmployeeProfile>('/api/v1/employee/me');
      setProfile(fetchedProfile); // This will trigger the useEffect to update the form
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to fetch profile data');
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (profileData: Partial<BackendEmployeeProfile>): Promise<BackendEmployeeProfile | null> => {
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
      let savedProfile: BackendEmployeeProfile;

      if (isCreateMode) {
        // Create new profile using API directly
        savedProfile = await apiService.post<BackendEmployeeProfile>(`/api/v1/employee/${userId}`, profileData);
        setIsCreateMode(false);
        toast.success('Profile created successfully!');
      } else {
        // Update existing profile using API directly  
        savedProfile = await apiService.patch<BackendEmployeeProfile>(`/api/v1/employee/${userId}`, profileData);
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
  const convertBackendToProfileForm = (backendProfile: BackendEmployeeProfile): Partial<EmployeeProfile> => {
    // Parse industry data from backend format and coerce to allowed INDUSTRIES union
    const parseIndustries = (industryArray: any[]): { industry: typeof INDUSTRIES[number]; years: number }[] => {
      if (!Array.isArray(industryArray)) return [{ industry: 'Technology', years: 1 }];
      return industryArray
        .map((entry) => {
          // Already structured
            if (entry && typeof entry === 'object' && 'industry' in entry && 'years' in entry) {
              const rawInd = String((entry as any).industry);
              const normalized = (INDUSTRIES as readonly string[]).includes(rawInd) ? rawInd as typeof INDUSTRIES[number] : 'Technology';
              const yearsNum = typeof entry.years === 'number' ? entry.years : parseFloat(String(entry.years)) || 1;
              return { industry: normalized, years: yearsNum };
            }
            if (typeof entry === 'string') {
              const parts = entry.split('|');
              const rawInd = parts[0] ? parts[0].trim() : 'Technology';
              const normalized = (INDUSTRIES as readonly string[]).includes(rawInd) ? rawInd as typeof INDUSTRIES[number] : 'Technology';
              const years = parts[1] ? parseFloat(parts[1]) || 1 : 1;
              return { industry: normalized, years: years <= 0 ? 1 : years };
            }
            return null;
        })
        .filter((v): v is { industry: typeof INDUSTRIES[number]; years: number } => !!v);
    };

    return {
      name: backendProfile.name || `${backendProfile.user.first_name} ${backendProfile.user.last_name}`.trim(),
      email: backendProfile.user.email,
      country: backendProfile.geo || 'United States',
      dateOfJoining: backendProfile.date_of_joining ? new Date(backendProfile.date_of_joining).toISOString().split('T')[0] : '',
      endDate: backendProfile.end_date ? new Date(backendProfile.end_date).toISOString().split('T')[0] : '',
      noticeDate: backendProfile.notice_date ? new Date(backendProfile.notice_date).toISOString().split('T')[0] : '',
      employeeType: (backendProfile.employment_type || backendProfile.type || 'Full-time') as typeof EMPLOYEE_TYPES[number],
      department: backendProfile.department || 'Engineering',
      industries: backendProfile.industry && backendProfile.industry.length > 0 
        ? parseIndustries(backendProfile.industry as any[])
        : [{ industry: 'Technology', years: 1 }],
      experience: backendProfile.years_of_experience || 1,
      experienceLevel: (backendProfile.experience_level as typeof EXPERIENCE_LEVELS[number]) || (
        backendProfile.years_of_experience >= 12 ? 'Principal (12+ years)' : 
        backendProfile.years_of_experience >= 8 ? 'Lead (8-12 years)' :
        backendProfile.years_of_experience >= 5 ? 'Senior (5-8 years)' : 
        backendProfile.years_of_experience >= 2 ? 'Mid-level (2-5 years)' : 
        'Junior (0-2 years)'
      ),
      skills: backendProfile.skills || [],
      availableForAdditionalWork: backendProfile.availability_flag || false
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
    defaultValues: employeeProfile ? convertBackendToProfileForm(employeeProfile) : {
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
      const profileFormData = convertBackendToProfileForm(profile);
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
