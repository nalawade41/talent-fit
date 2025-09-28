import { vi } from 'vitest';

// Mock useRolePermissions hook
vi.mock('../../hooks/useRolePermissions', () => ({
  useRolePermissions: () => ({
    canViewOwnProfile: true,
    canManageTeam: false,
    canCreateProjects: false,
    canViewAnalytics: false,
    canViewAllEmployees: false,
  }),
}));

// Mock AuthContext
vi.mock('../../context/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAuth: () => ({
    user: {
      id: '1',
      email: 'test@example.com',
      role: 'employee',
    },
    role: 'employee',
    login: vi.fn(),
    logout: vi.fn(),
    isLoading: false,
  }),
}));
