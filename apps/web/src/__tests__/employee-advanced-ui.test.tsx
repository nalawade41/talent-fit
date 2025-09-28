import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '../test/test-utils';
import { userEvent } from '@testing-library/user-event';
import React from 'react';

// Mock Advanced Employee Interface
const MockAdvancedEmployeeInterface = () => {
  const [currentTab, setCurrentTab] = React.useState('overview');
  const [notifications, setNotifications] = React.useState([
    { id: 1, message: 'New project assignment available', type: 'info', read: false },
    { id: 2, message: 'Profile updated successfully', type: 'success', read: true },
  ]);
  const [profileForm, setProfileForm] = React.useState({
    name: 'John Doe',
    email: 'john@example.com',
    location: 'US',
    skills: ['React', 'TypeScript'],
    bio: 'Experienced frontend developer',
    availability: true,
    workPreference: 'remote'
  });
  const [showModal, setShowModal] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filters, setFilters] = React.useState({
    status: 'all',
    skills: '',
    location: ''
  });

  const projects = [
    { id: 'p1', name: 'E-commerce Platform', status: 'active', skills: ['React', 'Node.js'], location: 'Remote' },
    { id: 'p2', name: 'Mobile App', status: 'planning', skills: ['React Native', 'TypeScript'], location: 'US' },
    { id: 'p3', name: 'Data Dashboard', status: 'completed', skills: ['Vue', 'Python'], location: 'UK' },
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filters.status === 'all' || project.status === filters.status;
    const matchesSkills = !filters.skills || project.skills.some(skill => 
      skill.toLowerCase().includes(filters.skills.toLowerCase())
    );
    const matchesLocation = !filters.location || project.location === filters.location;
    
    return matchesSearch && matchesStatus && matchesSkills && matchesLocation;
  });

  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const addSkill = (skill: string) => {
    if (skill && !profileForm.skills.includes(skill)) {
      setProfileForm(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfileForm(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  return (
    <div data-testid="advanced-employee-interface">
      {/* Header with notifications */}
      <header data-testid="header">
        <h1>Employee Dashboard</h1>
        <div data-testid="notifications">
          <button 
            data-testid="notifications-toggle"
            onClick={() => setShowModal(!showModal)}
          >
            Notifications ({notifications.filter(n => !n.read).length})
          </button>
        </div>
      </header>

      {/* Notification Modal */}
      {showModal && (
        <div data-testid="notification-modal" role="dialog" aria-label="Notifications">
          <div>
            <h2>Notifications</h2>
            <button onClick={() => setShowModal(false)}>Close</button>
            {notifications.map(notif => (
              <div 
                key={notif.id} 
                data-testid={`notification-${notif.id}`}
                className={notif.read ? 'read' : 'unread'}
              >
                <p>{notif.message}</p>
                {!notif.read && (
                  <button onClick={() => markNotificationAsRead(notif.id)}>
                    Mark as read
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <nav data-testid="tab-navigation">
        <button 
          onClick={() => setCurrentTab('overview')}
          className={currentTab === 'overview' ? 'active' : ''}
          aria-pressed={currentTab === 'overview'}
        >
          Overview
        </button>
        <button 
          onClick={() => setCurrentTab('profile')}
          className={currentTab === 'profile' ? 'active' : ''}
          aria-pressed={currentTab === 'profile'}
        >
          Profile
        </button>
        <button 
          onClick={() => setCurrentTab('projects')}
          className={currentTab === 'projects' ? 'active' : ''}
          aria-pressed={currentTab === 'projects'}
        >
          Projects
        </button>
      </nav>

      {/* Tab Content */}
      <main data-testid="tab-content">
        {currentTab === 'overview' && (
          <div data-testid="overview-tab">
            <h2>Overview</h2>
            <div data-testid="quick-stats">
              <div>Name: {profileForm.name}</div>
              <div>Status: {profileForm.availability ? 'Available' : 'Busy'}</div>
              <div>Skills: {profileForm.skills.length}</div>
              <div>Work Preference: {profileForm.workPreference}</div>
            </div>
          </div>
        )}

        {currentTab === 'profile' && (
          <div data-testid="profile-tab">
            <h2>Profile Management</h2>
            <form data-testid="profile-form">
              <div>
                <label htmlFor="profile-name">Name</label>
                <input 
                  id="profile-name"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <label htmlFor="profile-bio">Bio</label>
                <textarea 
                  id="profile-bio"
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                />
              </div>

              <div>
                <label htmlFor="work-preference">Work Preference</label>
                <select 
                  id="work-preference"
                  value={profileForm.workPreference}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, workPreference: e.target.value }))}
                >
                  <option value="remote">Remote</option>
                  <option value="onsite">On-site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div data-testid="skills-management">
                <h3>Skills</h3>
                <div data-testid="skills-list">
                  {profileForm.skills.map(skill => (
                    <div key={skill} data-testid={`skill-${skill}`}>
                      {skill}
                      <button 
                        type="button"
                        onClick={() => removeSkill(skill)}
                        aria-label={`Remove ${skill}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div>
                  <input 
                    data-testid="new-skill-input"
                    placeholder="Add new skill"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
              </div>

              <div>
                <label>
                  <input 
                    type="checkbox"
                    checked={profileForm.availability}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, availability: e.target.checked }))}
                  />
                  Available for new projects
                </label>
              </div>
            </form>
          </div>
        )}

        {currentTab === 'projects' && (
          <div data-testid="projects-tab">
            <h2>Project Browser</h2>
            
            {/* Search and Filters */}
            <div data-testid="project-filters">
              <input 
                data-testid="project-search"
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              <select 
                data-testid="status-filter"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="planning">Planning</option>
                <option value="completed">Completed</option>
              </select>

              <input 
                data-testid="skills-filter"
                placeholder="Filter by skills"
                value={filters.skills}
                onChange={(e) => setFilters(prev => ({ ...prev, skills: e.target.value }))}
              />
            </div>

            {/* Projects List */}
            <div data-testid="projects-list">
              {filteredProjects.map(project => (
                <div key={project.id} data-testid={`project-item-${project.id}`}>
                  <h3>{project.name}</h3>
                  <p>Status: {project.status}</p>
                  <p>Skills: {project.skills.join(', ')}</p>
                  <p>Location: {project.location}</p>
                  <button>Apply</button>
                </div>
              ))}
              {filteredProjects.length === 0 && (
                <p data-testid="no-projects">No projects match your criteria</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

describe('Advanced Employee Interface Tests', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    // Reset any mocks or state before each test
  });

  it('renders the advanced interface with all main elements', () => {
    render(<MockAdvancedEmployeeInterface />);

    expect(screen.getByTestId('advanced-employee-interface')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('tab-navigation')).toBeInTheDocument();
    expect(screen.getByTestId('tab-content')).toBeInTheDocument();
  });

  it('shows notification count in header', () => {
    render(<MockAdvancedEmployeeInterface />);

    expect(screen.getByText('Notifications (1)')).toBeInTheDocument();
  });

  it('opens and closes notification modal', async () => {
    render(<MockAdvancedEmployeeInterface />);

    const notificationsButton = screen.getByTestId('notifications-toggle');
    await user.click(notificationsButton);

    expect(screen.getByTestId('notification-modal')).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Notifications' })).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: 'Close' });
    await user.click(closeButton);

    expect(screen.queryByTestId('notification-modal')).not.toBeInTheDocument();
  });

  it('marks notifications as read', async () => {
    render(<MockAdvancedEmployeeInterface />);

    // Open notifications
    await user.click(screen.getByTestId('notifications-toggle'));

    // Mark notification as read
    const markReadButton = screen.getByRole('button', { name: 'Mark as read' });
    await user.click(markReadButton);

    // Close and reopen to check count
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.getByText('Notifications (0)')).toBeInTheDocument();
  });

  it('navigates between tabs correctly', async () => {
    render(<MockAdvancedEmployeeInterface />);

    // Should start on overview
    expect(screen.getByTestId('overview-tab')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Overview' })).toHaveAttribute('aria-pressed', 'true');

    // Navigate to profile
    await user.click(screen.getByRole('button', { name: 'Profile' }));
    expect(screen.getByTestId('profile-tab')).toBeInTheDocument();
    expect(screen.queryByTestId('overview-tab')).not.toBeInTheDocument();

    // Navigate to projects
    await user.click(screen.getByRole('button', { name: 'Projects' }));
    expect(screen.getByTestId('projects-tab')).toBeInTheDocument();
    expect(screen.queryByTestId('profile-tab')).not.toBeInTheDocument();
  });

  it('displays overview information correctly', () => {
    render(<MockAdvancedEmployeeInterface />);

    const overviewSection = screen.getByTestId('quick-stats');
    expect(within(overviewSection).getByText('Name: John Doe')).toBeInTheDocument();
    expect(within(overviewSection).getByText('Status: Available')).toBeInTheDocument();
    expect(within(overviewSection).getByText('Skills: 2')).toBeInTheDocument();
    expect(within(overviewSection).getByText('Work Preference: remote')).toBeInTheDocument();
  });

  it('allows editing profile information', async () => {
    render(<MockAdvancedEmployeeInterface />);

    // Navigate to profile
    await user.click(screen.getByRole('button', { name: 'Profile' }));

    // Edit name
    const nameInput = screen.getByLabelText('Name');
    await user.clear(nameInput);
    await user.type(nameInput, 'Jane Doe');

    // Edit bio
    const bioInput = screen.getByLabelText('Bio');
    await user.clear(bioInput);
    await user.type(bioInput, 'Updated bio text');

    // Change work preference
    const workPrefSelect = screen.getByLabelText('Work Preference');
    await user.selectOptions(workPrefSelect, 'hybrid');

    expect(nameInput).toHaveValue('Jane Doe');
    expect(bioInput).toHaveValue('Updated bio text');
    expect(workPrefSelect).toHaveValue('hybrid');
  });

  it('manages skills correctly', async () => {
    render(<MockAdvancedEmployeeInterface />);

    // Navigate to profile
    await user.click(screen.getByRole('button', { name: 'Profile' }));

    // Check initial skills
    expect(screen.getByTestId('skill-React')).toBeInTheDocument();
    expect(screen.getByTestId('skill-TypeScript')).toBeInTheDocument();

    // Add new skill
    const skillInput = screen.getByTestId('new-skill-input');
    await user.type(skillInput, 'Vue.js{enter}');

    expect(screen.getByTestId('skill-Vue.js')).toBeInTheDocument();

    // Remove a skill
    const removeButton = screen.getByLabelText('Remove React');
    await user.click(removeButton);

    expect(screen.queryByTestId('skill-React')).not.toBeInTheDocument();
  });

  it('filters projects correctly', async () => {
    render(<MockAdvancedEmployeeInterface />);

    // Navigate to projects
    await user.click(screen.getByRole('button', { name: 'Projects' }));

    // Should show all projects initially
    expect(screen.getByTestId('project-item-p1')).toBeInTheDocument();
    expect(screen.getByTestId('project-item-p2')).toBeInTheDocument();
    expect(screen.getByTestId('project-item-p3')).toBeInTheDocument();

    // Filter by status
    const statusFilter = screen.getByTestId('status-filter');
    await user.selectOptions(statusFilter, 'active');

    expect(screen.getByTestId('project-item-p1')).toBeInTheDocument();
    expect(screen.queryByTestId('project-item-p2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('project-item-p3')).not.toBeInTheDocument();
  });

  it('searches projects by name', async () => {
    render(<MockAdvancedEmployeeInterface />);

    // Navigate to projects
    await user.click(screen.getByRole('button', { name: 'Projects' }));

    // Search for specific project
    const searchInput = screen.getByTestId('project-search');
    await user.type(searchInput, 'Mobile');

    expect(screen.queryByTestId('project-item-p1')).not.toBeInTheDocument();
    expect(screen.getByTestId('project-item-p2')).toBeInTheDocument();
    expect(screen.queryByTestId('project-item-p3')).not.toBeInTheDocument();
  });

  it('shows no results message when no projects match', async () => {
    render(<MockAdvancedEmployeeInterface />);

    // Navigate to projects
    await user.click(screen.getByRole('button', { name: 'Projects' }));

    // Search for non-existent project
    const searchInput = screen.getByTestId('project-search');
    await user.type(searchInput, 'NonExistentProject');

    expect(screen.getByTestId('no-projects')).toBeInTheDocument();
    expect(screen.getByText('No projects match your criteria')).toBeInTheDocument();
  });

  it('maintains state consistency across tab navigation', async () => {
    render(<MockAdvancedEmployeeInterface />);

    // Make changes in profile
    await user.click(screen.getByRole('button', { name: 'Profile' }));
    const nameInput = screen.getByLabelText('Name');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Name');

    // Add skill
    const skillInput = screen.getByTestId('new-skill-input');
    await user.type(skillInput, 'Python{enter}');

    // Navigate to overview and check updated info
    await user.click(screen.getByRole('button', { name: 'Overview' }));
    expect(screen.getByText('Name: Updated Name')).toBeInTheDocument();
    expect(screen.getByText('Skills: 3')).toBeInTheDocument(); // React, TypeScript, Python

    // Navigate back to profile and verify changes persist
    await user.click(screen.getByRole('button', { name: 'Profile' }));
    expect(screen.getByDisplayValue('Updated Name')).toBeInTheDocument();
    expect(screen.getByTestId('skill-Python')).toBeInTheDocument();
  });
});
