import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test/test-utils';

// Mock Employee Workflow Components
const MockEmployeeWorkflow = () => {
  const [currentView, setCurrentView] = React.useState('dashboard');
  const [profileData, setProfileData] = React.useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    skills: ['React', 'TypeScript'],
    location: 'US',
    availability: true
  });

  return (
    <div data-testid="employee-workflow">
      <nav>
        <button onClick={() => setCurrentView('dashboard')}>Dashboard</button>
        <button onClick={() => setCurrentView('profile')}>Profile</button>
      </nav>
      
      {currentView === 'dashboard' && (
        <div data-testid="dashboard-view">
          <h1>My Dashboard</h1>
          <div data-testid="profile-summary">
            <h2>Profile Summary</h2>
            <div>{profileData.name}</div>
            <div>{profileData.location}</div>
            <div>Skills: {profileData.skills.join(', ')}</div>
            <div>Status: {profileData.availability ? 'Available' : 'Not Available'}</div>
          </div>
          
          <div data-testid="assignments">
            <h2>Current Assignments</h2>
            <p>You are currently unassigned</p>
          </div>
        </div>
      )}
      
      {currentView === 'profile' && (
        <div data-testid="profile-view">
          <h1>My Profile</h1>
          <form data-testid="profile-form">
            <div>
              <label htmlFor="name">Name</label>
              <input 
                id="name" 
                value={profileData.name} 
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              />
            </div>
            
            <div>
              <label htmlFor="email">Email</label>
              <input 
                id="email" 
                value={profileData.email} 
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              />
            </div>
            
            <div>
              <label>
                <input 
                  type="checkbox" 
                  checked={profileData.availability}
                  onChange={(e) => setProfileData({...profileData, availability: e.target.checked})}
                />
                Available for work
              </label>
            </div>
            
            <div>Skills: {profileData.skills.join(', ')}</div>
            
            <button type="button" onClick={() => setCurrentView('dashboard')}>
              Save & Return
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

// Import React for useState
import React from 'react';

describe('Employee Workflow Integration Tests', () => {
  it('renders the employee workflow interface', () => {
    render(<MockEmployeeWorkflow />);

    expect(screen.getByTestId('employee-workflow')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Profile' })).toBeInTheDocument();
  });

  it('starts with dashboard view by default', () => {
    render(<MockEmployeeWorkflow />);

    expect(screen.getByTestId('dashboard-view')).toBeInTheDocument();
    expect(screen.getByText('My Dashboard')).toBeInTheDocument();
    expect(screen.queryByTestId('profile-view')).not.toBeInTheDocument();
  });

  it('displays employee profile information on dashboard', () => {
    render(<MockEmployeeWorkflow />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('US')).toBeInTheDocument();
    expect(screen.getByText('Skills: React, TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Status: Available')).toBeInTheDocument();
  });

  it('shows current assignment status', () => {
    render(<MockEmployeeWorkflow />);

    expect(screen.getByTestId('assignments')).toBeInTheDocument();
    expect(screen.getByText('Current Assignments')).toBeInTheDocument();
    expect(screen.getByText('You are currently unassigned')).toBeInTheDocument();
  });

  it('navigates to profile view when profile button is clicked', async () => {
    render(<MockEmployeeWorkflow />);

    const profileButton = screen.getByRole('button', { name: 'Profile' });
    fireEvent.click(profileButton);

    await waitFor(() => {
      expect(screen.getByTestId('profile-view')).toBeInTheDocument();
      expect(screen.getByText('My Profile')).toBeInTheDocument();
      expect(screen.queryByTestId('dashboard-view')).not.toBeInTheDocument();
    });
  });

  it('allows editing profile information', async () => {
    render(<MockEmployeeWorkflow />);

    // Navigate to profile
    const profileButton = screen.getByRole('button', { name: 'Profile' });
    fireEvent.click(profileButton);

    await waitFor(() => {
      expect(screen.getByTestId('profile-form')).toBeInTheDocument();
    });

    // Edit name
    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });

    expect(nameInput).toHaveValue('Jane Doe');
  });

  it('allows toggling availability status', async () => {
    render(<MockEmployeeWorkflow />);

    // Navigate to profile
    const profileButton = screen.getByRole('button', { name: 'Profile' });
    fireEvent.click(profileButton);

    await waitFor(() => {
      const availabilityCheckbox = screen.getByLabelText('Available for work');
      expect(availabilityCheckbox).toBeChecked();
      
      // Toggle availability
      fireEvent.click(availabilityCheckbox);
      expect(availabilityCheckbox).not.toBeChecked();
    });
  });

  it('returns to dashboard when save button is clicked', async () => {
    render(<MockEmployeeWorkflow />);

    // Navigate to profile
    const profileButton = screen.getByRole('button', { name: 'Profile' });
    fireEvent.click(profileButton);

    await waitFor(() => {
      expect(screen.getByTestId('profile-view')).toBeInTheDocument();
    });

    // Click save and return
    const saveButton = screen.getByRole('button', { name: 'Save & Return' });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-view')).toBeInTheDocument();
      expect(screen.queryByTestId('profile-view')).not.toBeInTheDocument();
    });
  });

  it('maintains data consistency across views', async () => {
    render(<MockEmployeeWorkflow />);

    // Verify initial data on dashboard
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Status: Available')).toBeInTheDocument();

    // Navigate to profile and change data
    const profileButton = screen.getByRole('button', { name: 'Profile' });
    fireEvent.click(profileButton);

    await waitFor(() => {
      const nameInput = screen.getByLabelText('Name');
      fireEvent.change(nameInput, { target: { value: 'Jane Smith' } });

      const availabilityCheckbox = screen.getByLabelText('Available for work');
      fireEvent.click(availabilityCheckbox);
    });

    // Return to dashboard
    const saveButton = screen.getByRole('button', { name: 'Save & Return' });
    fireEvent.click(saveButton);

    // Verify data updated on dashboard
    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Status: Not Available')).toBeInTheDocument();
    });
  });
});
