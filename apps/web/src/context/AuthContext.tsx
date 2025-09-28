import React, { createContext, useContext, useEffect, useState } from 'react';
import apiService from '../services/api/client';
import { UserRole } from '../types/roles';

// UI auth user shape for client session
export interface AuthUser {
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
  loginWithGoogleCredential: (credential: string) => Promise<boolean>;
  loginWithCredentials: (email: string, password: string) => Promise<boolean>; // Added for dummy credentials
  logout: () => void;
  updateProfile: (updates: Partial<AuthUser>) => void;
  refreshingToken: boolean;
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
  const [refreshingToken, setRefreshingToken] = useState(false);

  // Load persisted session
  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      const parsed: AuthUser = JSON.parse(saved);
      // Expire if token past expiry
      if (parsed.tokenExpiry && parsed.tokenExpiry < Date.now()) {
        localStorage.removeItem('user');
      } else {
        setUser(parsed);
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
      const resp = await apiService.post<{ token: string; name: string; email: string }>(
        '/auth/google/login',
        { credential }
      );

      const token = resp.token;
      const email = resp.email;
      const name = resp.name;

      // Decode JWT to extract role
      const decodedToken = decodeJWT(token);
      const role = decodedToken?.role || UserRole.EMPLOYEE; // fallback to employee

      // Persist JWT for API calls
      localStorage.setItem('authToken', token);

      // Create a lightweight session for UI with role from JWT
      const session: AuthUser = {
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
      return true;
    } catch (e) {
      return false;
    }
  };

  // Dummy credentials login for demo accounts
  const loginWithCredentials = async (email: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // simulate delay
    let role: UserRole;
    let name: string;
    if (email === 'sarah@company.com' && password === 'demo123') {
      role = UserRole.EMPLOYEE;
      name = 'Sarah Johnson';
    } else if (email === 'michael@company.com' && password === 'demo123') {
      role = UserRole.MANAGER;
      name = 'Michael Chen';
    } else {
      return false;
    }
    const session: AuthUser = {
      name,
      email,
      role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
      provider: 'credentials',
      accessToken: undefined,
      tokenExpiry: Date.now() + TOKEN_LIFETIME_MS,
      photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
    };
    setUser(session);
    localStorage.setItem('user', JSON.stringify(session));
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

  return (
    <AuthContext.Provider value={{
      user,
      loginWithGoogleCredential,
      loginWithCredentials, // include dummy login in context
      logout,
      updateProfile,
      refreshingToken
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
