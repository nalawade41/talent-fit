import { ProfileForm } from '../Profile/ProfileForm';
import { EmployeeProfile } from '../../types/profile';

export function ProfilePage() {
  const handleProfileSave = (profile: EmployeeProfile) => {
    console.log('Profile saved:', profile);
    // Additional save logic can be added here if needed
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal and professional information</p>
      </div>
      
      <ProfileForm onSave={handleProfileSave} />
    </div>
  );
}
