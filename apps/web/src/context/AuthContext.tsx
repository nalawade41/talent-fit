import React, { createContext, useContext, useEffect, useState } from 'react';
import apiService from '../services/api/client';
import { UserRole } from '../types/roles';
import { LoginResponse, BackendEmployeeProfile } from '../types/api';
import type { Employee } from '../data/employees';

// UI auth user shape for client session
export interface AuthUser {
  id?: number;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  experience?: number;
  skills?: string[];
  avatar?: string;
  accessToken?: string;
  tokenExpiry?: number;
  photoUrl?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  profileStatus: 'loading' | 'exists' | 'needs_creation' | 'error';
  loginWithGoogleCredential: (credential: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<AuthUser>) => void;
  refreshingToken: boolean;
  checkProfileStatus: (user : AuthUser | null) => Promise<void>;
  updateProfileAfterCreation: (savedProfile: Employee) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_LIFETIME_MS = 1000 * 60 * 30; // 30 minutes

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profileStatus, setProfileStatus] = useState<'loading' | 'exists' | 'needs_creation' | 'error'>('loading');
  const [refreshingToken] = useState(false);

    // Load persisted session
  useEffect(() => {
    const saved = localStorage.getItem('user');
    console.log('Restoring session from localStorage:', saved);
    if (saved) {
      const parsed: AuthUser = JSON.parse(saved);
      // Expire if token past expiry
      if (parsed.tokenExpiry && parsed.tokenExpiry < Date.now()) {
        // if token is expired, then refresh it
      } else {
        setUser(parsed);
        // Check profile status for existing user
        checkProfileStatus(parsed);
      }
    }
  }, []);

  // Real Google login using backend exchange. Expects Google ID token (credential).
  const loginWithGoogleCredential = async (credential: string): Promise<boolean> => {
    try {
      console.log('Starting Google login with credential...');
      const resp = await apiService.post<LoginResponse>(
        '/auth/google/login',
        { credential }
      );

      const { token, email, name, userId } = resp;

      // Persist JWT for API calls
      localStorage.setItem('authToken', token);

      // Create a lightweight session for UI using response data directly
      // Role will be determined from /me API later
      const session: AuthUser = {
        id: userId, // Use userId from response instead of parsing JWT
        name: name || email,
        email,
        role: UserRole.EMPLOYEE, // Temporary role, will be updated from /me API
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email)}`,
        accessToken: token,
        tokenExpiry: Date.now() + TOKEN_LIFETIME_MS,
        photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email)}`,
      };

      setUser(session);
      localStorage.setItem('user', JSON.stringify(session));
      
      // Check profile status after successful login
      await checkProfileStatus(session);
      return true;
    } catch (error: any) {
      console.error('Google login failed:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('employeeProfile');
    // Navigate to home page
    window.location.href = '/';
  };

  const updateProfile = (updates: Partial<AuthUser>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  // Check if the user profile exists or needs creation
  const checkProfileStatus = async (user: AuthUser | null): Promise<void> => {
    console.log("Checking profile status...", user);
    if (!user) {
      setProfileStatus('error');
      return;
    }

    try {
      setProfileStatus('loading');
      console.log('Checking profile status for user:', user.email);
      
      // Call /me API to get role and profile status
      const response = await apiService.get<BackendEmployeeProfile>('/api/v1/employee/me');
      console.log('Profile exists:', response);
      
      // Extract role from the /me API response and update user session
      if (response && response.user && response.user.role) {
        // Handle case-insensitive role comparison
        const apiRoleString = response.user.role.toLowerCase();
        const apiRole = apiRoleString === 'manager' ? UserRole.MANAGER : UserRole.EMPLOYEE;
        
        if (apiRole !== user.role) {
          const updatedUser = { ...user, role: apiRole };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }
      
      setProfileStatus('exists');
    } catch (error: any) {
      console.error('Profile status check error:');
      const errorStatus = error?.status || error?.response?.status;
      const errorMessage = error?.message || error?.response?.data?.message || '';
      if (errorStatus === 404 || (errorStatus === 500 && errorMessage?.includes('Record not found'))) {
        console.log('Profile not found - needs creation');
        setProfileStatus('needs_creation');
      } else {
        console.error('Error checking profile status:', error);
        setProfileStatus('error');
      }
    }
  };

  // Update profile status after successful creation
  const updateProfileAfterCreation = (savedProfile: Employee) => {
    updateProfile({
      name: `${savedProfile.user.first_name} ${savedProfile.user.last_name}`,
      experience: savedProfile.years_of_experience,
      skills: savedProfile.skills
    });
    
    // Update profile status to 'exists' after successful creation
    setProfileStatus('exists');
  };

  return (
    <AuthContext.Provider value={{
      user,
      profileStatus,
      loginWithGoogleCredential,
      logout,
      updateProfile,
      refreshingToken,
      checkProfileStatus,
      updateProfileAfterCreation
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
