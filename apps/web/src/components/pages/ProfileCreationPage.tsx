import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ProfileForm } from '../Profile/ProfileForm';
import { EmployeeProfile } from '../../types/profile';
import { useAuth } from '../../context/AuthContext';
import { EmployeeProfileService } from '../../services';
import { User, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export function ProfileCreationPage() {
  const navigate = useNavigate();
  const { user, updateProfileAfterCreation } = useAuth();

  const handleProfileSave = async (profile: EmployeeProfile) => {
    console.log('Profile creation started:', profile);
    
    try {
      // Convert EmployeeProfile to backend format
      const backendProfileData = {
        user_id: 53, //user?.id, // Add user_id to the request body
        geo: profile.country,
        date_of_joining: profile.dateOfJoining || null,
        end_date: profile.endDate || null,
        notice_date: profile.noticeDate || null,
        type: profile.employeeType,
        skills: profile.skills,
        years_of_experience: profile.industries.reduce((sum, ind) => sum + ind.years, 0),
        industry: profile.industries.map(ind => ind.industry),
        availability_flag: profile.availableForAdditionalWork || false,
        department: profile.department
      };

      // Get user ID from auth context (now provided directly in login response)
      const userId = user?.id;
      
      if (!userId) {
        throw new Error('User ID not found. Please log in again.');
      }

      // Call the real API to create the profile
      const savedProfile = await EmployeeProfileService.createEmployeeProfile(userId, backendProfileData);
      
      console.log('Profile created successfully:', savedProfile);
      
      // Update auth context with the new profile
      updateProfileAfterCreation(savedProfile);
      
      // Show success message
      toast.success('Profile created successfully! Welcome to Talent Fit!');
      
      // Navigate to dashboard
      navigate('/', { replace: true });
      
    } catch (error: any) {
      console.error('Profile creation failed:', error);
      
      // Show specific error message
      if (error.message?.includes('User ID not found')) {
        toast.error('Session expired. Please log in again.');
        navigate('/login', { replace: true });
      } else if (error.response?.status === 409) {
        toast.error('Profile already exists. Redirecting to dashboard...');
        navigate('/', { replace: true });
      } else if (error.response?.status === 400) {
        toast.error('Invalid profile data. Please check your information and try again.');
      } else {
        toast.error('Failed to create profile. Please try again or contact support.');
      }
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (!user) {
    return null; // This shouldn't happen if routing is correct
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="text-gray-600 mt-2">
            Welcome {user.name}! To get started, please complete your employee profile with your professional information.
          </p>
        </div>

        {/* Profile Creation Form */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
            <p className="text-sm text-gray-600">
              This information helps us match you with the right projects and opportunities.
            </p>
          </CardHeader>
          <CardContent>
            <ProfileForm onSave={handleProfileSave} isCreateMode={true} />
          </CardContent>
        </Card>

        {/* Back to Login Option */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={handleBackToLogin}
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
}
