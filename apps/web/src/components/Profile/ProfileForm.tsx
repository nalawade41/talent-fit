import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { LoadingOverlay } from '../ui/LoadingOverlay';
import { SkillsSelector } from './SkillsSelector';
import { CountrySelector } from './CountrySelector';
import { IndustrySelector } from './IndustrySelector';
import { AvailabilityToggle } from './AvailabilityToggle';
import { useAuth } from '../../context/AuthContext';
import { 
  employeeProfileSchema, 
  EmployeeProfile, 
  EMPLOYEE_TYPES, 
  EXPERIENCE_LEVELS,
  calculateProfileCompletion 
} from '../../types/profile';
import { Save, User, Briefcase, CheckCircle2, Eye } from 'lucide-react';

interface ProfileFormProps {
  onSave?: (profile: EmployeeProfile) => void;
}

export function ProfileForm({ onSave }: ProfileFormProps) {
  const { user, updateProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty }
  } = useForm<EmployeeProfile>({
    // resolver: zodResolver(employeeProfileSchema),
    mode: 'onChange',
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      country: 'United States', // Default country
      dateOfJoining: '2022-01-01', // Default date
      employeeType: 'Full-time',
      department: user?.department || 'Engineering',
      industries: [{ industry: 'Technology', years: 1 }], // Default industries array with years
      experience: 1, // Will be auto-calculated from industries
      experienceLevel: 'Mid-level (2-5 years)',
      skills: user?.skills || [],
      endDate: '',
      noticeDate: '',
      availableForAdditionalWork: false // Default availability
    }
  });

  const watchedValues = watch();
  const profileCompletion = calculateProfileCompletion(watchedValues);

  // Calculate total years from industry experience
  const totalIndustryYears = watchedValues.industries?.reduce((total, industry) => total + industry.years, 0) || 0;

  useEffect(() => {
    // Load saved profile from localStorage
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
  }, [setValue]);

  const onSubmit = async (data: EmployeeProfile) => {
    setIsSubmitting(true);

    try {
      // Add a minimum loading time for better UX (500ms)
      const savePromise = new Promise(resolve => {
        // Automatically calculate experience from industry years
        const calculatedExperience = totalIndustryYears;
        
        // Add profile completion percentage and calculated experience
        const profileWithCompletion = {
          ...data,
          experience: calculatedExperience,
          profileCompletionPercentage: calculateProfileCompletion({ ...data, experience: calculatedExperience })
        };

        // Save to localStorage
        localStorage.setItem('employeeProfile', JSON.stringify(profileWithCompletion));
        
        // Update auth context
        updateProfile({
          name: data.name,
          department: data.department,
          experience: data.experience,
          skills: data.skills
        });

        // Call parent onSave if provided
        onSave?.(profileWithCompletion);

        resolve(profileWithCompletion);
      });

      const minLoadingTime = new Promise(resolve => setTimeout(resolve, 800));
      const [profileWithCompletion] = await Promise.all([savePromise, minLoadingTime]);

      // Show success toast
      toast.success('Profile saved successfully!', {
        icon: '✅',
      });
      
      // Reset form dirty state to hide "unsaved changes" indicator
      reset(profileWithCompletion as EmployeeProfile, { keepValues: true });
      
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Loading Overlay */}
      <LoadingOverlay isVisible={isSubmitting} message="Saving Profile" />
      
      {/* Profile Completion Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${getCompletionColor(profileCompletion)}`}>
              <span className="text-xl font-bold">{profileCompletion}%</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Profile Completion</h2>
              <p className="text-gray-600">
                {profileCompletion >= 100 ? 'Your profile is complete!' : 
                 profileCompletion >= 80 ? 'Almost there! Just a few more details.' :
                 'Complete your profile to get better project matches.'}
              </p>
            </div>
          </div>
          {profileCompletion >= 100 && <CheckCircle2 className="w-8 h-8 text-green-500" />}
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
        </div>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Form Content Container - Disabled during submission */}
        <div className={`space-y-6 ${isSubmitting ? 'pointer-events-none opacity-75' : ''}`}>
        {/* Personal Details */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Personal Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input
                {...register('name')}
                type="text"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email Address *</label>
              <input
                {...register('email')}
                type="email"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your.email@company.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location *</label>
              <CountrySelector
                value={watchedValues.country || ''}
                onChange={(country) => setValue('country', country, { shouldDirty: true })}
                error={errors.country?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <Eye className="w-4 h-4 text-gray-400" />
                Date of Joining
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={watchedValues.dateOfJoining || ''}
                  className="w-full p-3 border rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                  disabled
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">This field is managed by HR and cannot be edited</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <Eye className="w-4 h-4 text-gray-400" />
                End Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={watchedValues.endDate || ''}
                  className="w-full p-3 border rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                  disabled
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">This field is managed by HR and cannot be edited</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <Eye className="w-4 h-4 text-gray-400" />
                Notice Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={watchedValues.noticeDate || ''}
                  className="w-full p-3 border rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                  disabled
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">This field is managed by HR and cannot be edited</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Professional Details */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Professional Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Employee Type *</label>
              <select
                {...register('employeeType')}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {EMPLOYEE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.employeeType && <p className="text-red-500 text-sm mt-1">{errors.employeeType.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Department *</label>
              <input
                {...register('department')}
                type="text"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Engineering, Design, Product"
              />
              {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>}
            </div>

            <div className="md:col-span-2">
              <IndustrySelector
                selectedIndustries={watchedValues.industries || []}
                onIndustriesChange={(industries) => setValue('industries', industries, { shouldDirty: true })}
              />
              {errors.industries && <p className="text-red-500 text-sm mt-1">{errors.industries.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <Eye className="w-4 h-4 text-gray-400" />
                Total Years of Experience
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={`${totalIndustryYears} years`}
                  className="w-full p-3 border rounded-md bg-gray-50 text-gray-600 cursor-not-allowed font-medium"
                  disabled
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">Automatically calculated from industry experience</p>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Experience Level *</label>
              <select
                {...register('experienceLevel')}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {EXPERIENCE_LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              {errors.experienceLevel && <p className="text-red-500 text-sm mt-1">{errors.experienceLevel.message}</p>}
            </div>
          </div>

          {/* Skills Selector */}
          <SkillsSelector
            selectedSkills={watchedValues.skills || []}
            onSkillsChange={(skills) => setValue('skills', skills, { shouldDirty: true })}
          />
          {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills.message}</p>}
        </Card>

        {/* Availability Status */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Briefcase className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold">Availability Status</h3>
          </div>
          
          <AvailabilityToggle
            isAvailable={watchedValues.availableForAdditionalWork || false}
            onAvailabilityChange={(available) => setValue('availableForAdditionalWork', available, { shouldDirty: true })}
          />
        </Card>
        </div>
        
        {/* Save Button and Status */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            {/* Toast notifications handle success/error messages */}
          </div>
          
          <div className="flex items-center gap-3">
            {isDirty && (
              <span className="text-sm text-yellow-600 flex items-center gap-1">
                <span className="w-4 h-4 text-yellow-500">⚠️</span>
                Unsaved changes
              </span>
            )}
            <Button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
