import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

// Custom render function that includes providers
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {children}
      </AuthProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Test data helpers
export const createMockEmployee = (overrides = {}) => ({
  user_id: '1',
  user: {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
  },
  geo: 'NY',
  skills: ['React', 'TypeScript'],
  status: 'available' as const,
  type: 'Full-time',
  years_of_experience: 5,
  industry: 'Technology',
  date_of_joining: '2023-01-01',
  end_date: null,
  notice_date: null,
  ...overrides,
});

export const createMockProject = (overrides = {}) => ({
  id: '1',
  name: 'Project Alpha',
  description: 'A sample project',
  required_seats: 5,
  start_date: '2024-01-01',
  end_date: '2024-12-31',
  status: 'Open' as const,
  ...overrides,
});

export const createMockAllocation = (overrides = {}) => ({
  id: '1',
  user_id: '1',
  project_id: '1',
  role_type: 'Developer',
  allocation_percentage: 100,
  start_date: '2024-01-01',
  end_date: '2024-12-31',
  ...overrides,
});

// Mock implementations
export const mockAuthContext = {
  user: null,
  role: null,
  login: vi.fn(),
  logout: vi.fn(),
  isLoading: false,
};

export const mockPermissions = {
  canViewOwnProfile: true,
  canManageTeam: false,
  canCreateProjects: false,
  canViewAnalytics: false,
  canViewAllEmployees: false,
};
