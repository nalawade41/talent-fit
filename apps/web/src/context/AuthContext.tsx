import React, { createContext, useContext, useEffect, useState } from 'react';
import apiService from '../services/api/client';

// UI auth user shape for client session
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'manager' | 'employee';
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
  loginWithGoogle: (role?: 'manager' | 'employee') => Promise<boolean>;
  loginWithGoogleCredential: (credential: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<AuthUser>) => void;
  refreshingToken: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock directory keyed by email to simulate lookup post-Google profile fetch
const directory: Record<string, Partial<AuthUser>> = {
  'michael@company.com': { id: '2', name: 'Michael Chen', role: 'manager', department: 'Engineering', experience: 8 },
  'sarah@company.com': { id: '1', name: 'Sarah Johnson', role: 'employee', department: 'Engineering', experience: 5, skills: ['React','TypeScript','Node.js','Python'] },
  'emily@company.com': { id: '3', name: 'Emily Rodriguez', role: 'employee', department: 'Design', experience: 3, skills: ['UX Design','Figma','Research','Prototyping'] },
};



// Simulate Google profile response
interface GoogleProfile {
  email: string;
  name: string;
  picture?: string;
}

function mockGooglePopup(role: 'manager' | 'employee'): Promise<GoogleProfile> {
  return new Promise(resolve => {
    setTimeout(() => {
      // Select user based on role for demo
      const userByRole = role === 'manager' 
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

function createUserSession(email: string): AuthUser | null {
  const base = directory[email];
  if (!base) return null;
  
  return {
    id: base.id!,
    name: base.name!,
    email: email,
    role: base.role as AuthUser['role'],
    department: base.department,
    experience: base.experience,
    skills: base.skills,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(base.name!)}`,
    provider: 'google',
    accessToken: generateToken(),
    tokenExpiry: Date.now() + TOKEN_LIFETIME_MS,
    photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(base.name!)}`,
  };
}

function generateToken() {
  return Math.random().toString(36).slice(2) + '.' + Math.random().toString(36).slice(2);
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

  // Silent token refresh (mock) 2 minutes before expiry
  useEffect(() => {
    if (!user?.tokenExpiry) return;
    const remaining = user.tokenExpiry - Date.now();
    if (remaining <= 0) return;
    const refreshThreshold = remaining - 1000 * 60 * 2; // 2 min early
    const id = setTimeout(async () => {
      setRefreshingToken(true);
      await new Promise(r => setTimeout(r, 400)); // simulate network
      const updated: AuthUser = {
        ...user,
        accessToken: generateToken(),
        tokenExpiry: Date.now() + TOKEN_LIFETIME_MS,
      };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      setRefreshingToken(false);
    }, Math.max(refreshThreshold, 0));
    return () => clearTimeout(id);
  }, [user]);

  const loginWithGoogle = async (role: 'manager' | 'employee' = 'manager'): Promise<boolean> => {
    try {
      const profile = await mockGooglePopup(role);
      const session = createUserSession(profile.email);
      if (!session) return false; // user not allowed in system
      
      setUser(session);
      localStorage.setItem('user', JSON.stringify(session));
      return true;
    } catch {
      return false;
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

      // Persist JWT for API calls
      localStorage.setItem('authToken', token);

      // Create a lightweight session for UI (role may be resolved later server-side)
      const session: AuthUser = {
        id: String(Date.now() % 100000),
        name: name || email,
        email,
        role: 'employee',
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
      loginWithGoogle, 
      loginWithGoogleCredential,
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