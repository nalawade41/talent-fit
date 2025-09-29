import React, { createContext, useContext, useEffect, useState } from 'react';
import apiService from '../services/api/client';
import { UserRole } from '../types/roles';
import { LoginResponse } from '../types/api';
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
  provider?: 'google' | 'credentials';
  accessToken?: string;
  tokenExpiry?: number;
  photoUrl?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  profileStatus: 'loading' | 'exists' | 'needs_creation' | 'error';
  loginWithGoogleCredential: (credential: string) => Promise<boolean>;
  loginWithCredentials: (email: string, password: string) => Promise<boolean>; // Added for dummy credentials
  logout: () => void;
  updateProfile: (updates: Partial<AuthUser>) => void;
  refreshingToken: boolean;
  checkProfileStatus: (user : AuthUser | null) => Promise<void>;
  updateProfileAfterCreation: (savedProfile: Employee) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


// Simulate Google profile response
interface GoogleProfile {
  email: string;
  name: string;
  picture?: string;
}

function mockGooglePopup(role: UserRole): Promise<GoogleProfile> {
  return new Promise(resolve => {
    setTimeout(() => {
      // Select user based on role for demo
      const userByRole = role === UserRole.MANAGER
        ? { email: 'michael@company.com', name: 'Michael Chen' }
        : { email: 'sarah@company.com', name: 'Sarah Johnson' };

      resolve({
        email: userByRole.email,
        name: userByRole.name,
        picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(userByRole.name)}`
      });
    }, 600); // simulate network + popup latency
  });
}


const TOKEN_LIFETIME_MS = 1000 * 60 * 30; // 30 minutes

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profileStatus, setProfileStatus] = useState<'loading' | 'exists' | 'needs_creation' | 'error'>('loading');
  const [refreshingToken, setRefreshingToken] = useState(false);

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

  // Helper function to decode JWT and extract claims
  const decodeJWT = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  };

  // Real Google login using backend exchange. Expects Google ID token (credential).
  const loginWithGoogleCredential = async (credential: string): Promise<boolean> => {
    try {
      console.log('Starting Google login with credential...');
      const resp = await apiService.post<LoginResponse>(
        '/auth/google/login',
        { credential }
      );

      console.log('Google login response:', resp);
      const { token, email, name, userId } = resp;

      // Decode JWT to extract role (role is not included in API response, only in JWT)
      const decodedToken = decodeJWT(token);
      console.log('Decoded JWT token:', decodedToken);
      const role = decodedToken?.role || UserRole.EMPLOYEE; // fallback to employee

      // Persist JWT for API calls
      localStorage.setItem('authToken', token);

      // Create a lightweight session for UI using response data directly
      const session: AuthUser = {
        id: userId, // Use userId from response instead of parsing JWT
        name: name || email,
        email,
        role: role as UserRole,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email)}`,
        provider: 'google',
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

  // Dummy credentials login for demo accounts
  const loginWithCredentials = async (email: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // simulate delay
    let role: UserRole;
    let name: string;
    let userId: number;
    if (email === 'sarah@company.com' && password === 'demo123') {
      role = UserRole.EMPLOYEE;
      name = 'Sarah Johnson';
      userId = 2;
    } else if (email === 'michael@company.com' && password === 'demo123') {
      role = UserRole.MANAGER;
      name = 'Michael Chen';
      userId = 1;
    } else {
      return false;
    }

    // Create a mock JWT token for demo accounts
    const mockToken = `demo.${btoa(JSON.stringify({ user_id: userId, role, email, name }))}.signature`;
    
    // Store the mock token for API calls
    localStorage.setItem('authToken', mockToken);

    const session: AuthUser = {
      id: userId,
      name,
      email,
      role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
      provider: 'credentials',
      accessToken: mockToken,
      tokenExpiry: Date.now() + TOKEN_LIFETIME_MS,
      photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
    };
    setUser(session);
    localStorage.setItem('user', JSON.stringify(session));
    
    // Check profile status after successful login
    await checkProfileStatus(session);
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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
      
      // For credentials login (demo accounts), skip API call and assume profile needs creation
      if (user.provider === 'credentials') {
        console.log('Demo credentials login - assuming profile needs creation');
        setProfileStatus('needs_creation');
        return;
      }
      
      // For Google OAuth login, check with real API
      const response = await apiService.get('/api/v1/employee/me');
      console.log('Profile exists:', response);
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
      loginWithCredentials, // include dummy login in context
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
