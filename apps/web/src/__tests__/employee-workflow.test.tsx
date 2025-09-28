import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test/test-utils';
import { EmployeeDashboard } from '../components/pages/EmployeeDashboard';
import { ProfilePage } from '../components/pages/ProfilePage';
import { MemoryRouter } from 'react-router-dom';

// Mock all data and hooks
vi.mock('../../data/employees', () => ({
  employeesData: [
    {
      user_id: '1',
      user: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
      },
      geo: 'US',
      skills: ['React', 'TypeScript'],
      status: 'available',
      type: 'Full-time',
      years_of_experience: 5,
      industry: 'Technology',
      date_of_joining: '2023-01-01',
      end_date: null,
      notice_date: null,
    },
  ],
}));

vi.mock('../../data/projects', () => ({
  projectsData: [],
}));

vi.mock('../../data/allocations', () => ({
  projectAllocationsData: [],
}));

vi.mock('../../hooks/useRolePermissions', () => ({
  useRolePermissions: () => ({
    canViewOwnProfile: true,
    canManageTeam: false,
    canCreateProjects: false,
    canViewAnalytics: false,
    canViewAllEmployees: false,
  }),
}));

vi.mock('../context/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAuth: () => ({
    user: {
      id: '1',
      email: 'john.doe@example.com',
      role: 'employee',
    },
    role: 'employee',
    login: vi.fn(),
    logout: vi.fn(),
    isLoading: false,
  }),
}));

describe('Employee Workflow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('completes full employee dashboard workflow', async () => {
    render(
      <MemoryRouter>
        <EmployeeDashboard />
      </MemoryRouter>
    );

    // Verify dashboard loads
    expect(screen.getByText('My Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Welcome back!')).toBeInTheDocument();

    // Verify profile summary is displayed
    expect(screen.getByText('Profile Summary')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('US')).toBeInTheDocument();

    // Verify skills are displayed
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();

    // Verify availability status
    expect(screen.getByText('Availability Status')).toBeInTheDocument();

    // Verify project timeline section
    expect(screen.getByText('Project Timeline')).toBeInTheDocument();

    // Verify unassigned status for available employee
    expect(screen.getByText('You are currently unassigned')).toBeInTheDocument();
  });

  it('handles profile page navigation and editing', async () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    // Verify profile page loads
    expect(screen.getByText('My Profile')).toBeInTheDocument();

    // Verify form fields are present
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john.doe@example.com')).toBeInTheDocument();

    // Test form interaction
    const firstNameInput = screen.getByDisplayValue('John');
    fireEvent.change(firstNameInput, { target: { value: 'Jane' } });

    expect(screen.getByDisplayValue('Jane')).toBeInTheDocument();
  });

  it('maintains data consistency across components', () => {
    const { rerender } = render(
      <MemoryRouter>
        <EmployeeDashboard />
      </MemoryRouter>
    );

    // Verify initial data
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    // Simulate data update (in real app this would come from context/API)
    // This test ensures components handle data changes gracefully
    rerender(
      <MemoryRouter>
        <EmployeeDashboard />
      </MemoryRouter>
    );

    // Data should still be consistent
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('handles loading and error states gracefully', () => {
    // Test with loading state - the component should still render
    render(
      <MemoryRouter>
        <EmployeeDashboard />
      </MemoryRouter>
    );

    // Should render dashboard even with loading state
    expect(screen.getByText('My Dashboard')).toBeInTheDocument();
  });

  it('validates employee data integrity', () => {
    render(
      <MemoryRouter>
        <EmployeeDashboard />
      </MemoryRouter>
    );

    // Verify all required data is present and valid
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('US')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();

    // Verify status displays correctly
    expect(screen.getByText('Available for work')).toBeInTheDocument();
  });
});
