import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test/test-utils';
import React from 'react';

// Mock Data Service
const mockDataService = {
  employees: [
    { id: '1', name: 'John Doe', location: 'US', skills: ['React', 'TypeScript'], availability: true },
    { id: '2', name: 'Jane Smith', location: 'UK', skills: ['Vue', 'JavaScript'], availability: false },
  ],
  projects: [
    { id: 'p1', name: 'Project Alpha', status: 'active', requirements: ['React', 'TypeScript'] },
    { id: 'p2', name: 'Project Beta', status: 'planning', requirements: ['Vue', 'JavaScript'] },
  ],
  allocations: [
    { id: 'a1', employeeId: '2', projectId: 'p2', startDate: '2024-01-01', endDate: '2024-06-01' },
  ],
  
  async getEmployee(id: string) {
    return this.employees.find(emp => emp.id === id) || null;
  },
  
  async updateEmployee(id: string, updates: any) {
    const index = this.employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      this.employees[index] = { ...this.employees[index], ...updates };
      return this.employees[index];
    }
    return null;
  },
  
  async getProjects() {
    return this.projects;
  },
  
  async getAllocations(employeeId?: string) {
    return employeeId 
      ? this.allocations.filter(alloc => alloc.employeeId === employeeId)
      : this.allocations;
  },
  
  async createAllocation(allocation: any) {
    const newAllocation = { ...allocation, id: `a${Date.now()}` };
    this.allocations.push(newAllocation);
    return newAllocation;
  }
};

// Mock Employee Data Management Component
const MockEmployeeDataManager = ({ employeeId }: { employeeId: string }) => {
  const [employee, setEmployee] = React.useState(null);
  const [projects, setProjects] = React.useState([]);
  const [allocations, setAllocations] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    loadData();
  }, [employeeId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [empData, projData, allocData] = await Promise.all([
        mockDataService.getEmployee(employeeId),
        mockDataService.getProjects(),
        mockDataService.getAllocations(employeeId)
      ]);

      setEmployee(empData);
      setProjects(projData);
      setAllocations(allocData);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async (updates: any) => {
    try {
      const updatedEmployee = await mockDataService.updateEmployee(employeeId, updates);
      setEmployee(updatedEmployee);
      return updatedEmployee;
    } catch (err) {
      setError('Failed to update employee');
      throw err;
    }
  };

  const createAllocation = async (projectId: string) => {
    try {
      const allocation = await mockDataService.createAllocation({
        employeeId,
        projectId,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
      setAllocations(prev => [...prev, allocation]);
      return allocation;
    } catch (err) {
      setError('Failed to create allocation');
      throw err;
    }
  };

  if (loading) return <div data-testid="loading">Loading...</div>;
  if (error) return <div data-testid="error">{error}</div>;
  if (!employee) return <div data-testid="not-found">Employee not found</div>;

  return (
    <div data-testid="employee-data-manager">
      <div data-testid="employee-info">
        <h2>{employee.name}</h2>
        <p>Location: {employee.location}</p>
        <p>Skills: {employee.skills.join(', ')}</p>
        <p>Available: {employee.availability ? 'Yes' : 'No'}</p>
      </div>

      <div data-testid="employee-actions">
        <button onClick={() => updateEmployee({ availability: !employee.availability })}>
          Toggle Availability
        </button>
        <button onClick={() => updateEmployee({ skills: [...employee.skills, 'New Skill'] })}>
          Add Skill
        </button>
      </div>

      <div data-testid="projects-section">
        <h3>Available Projects</h3>
        {projects.map(project => (
          <div key={project.id} data-testid={`project-${project.id}`}>
            <span>{project.name} ({project.status})</span>
            <button onClick={() => createAllocation(project.id)}>
              Request Assignment
            </button>
          </div>
        ))}
      </div>

      <div data-testid="allocations-section">
        <h3>Current Allocations</h3>
        {allocations.length === 0 ? (
          <p>No current allocations</p>
        ) : (
          allocations.map(allocation => (
            <div key={allocation.id} data-testid={`allocation-${allocation.id}`}>
              Project: {projects.find(p => p.id === allocation.projectId)?.name || 'Unknown'}
              <span> ({allocation.startDate} to {allocation.endDate})</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

describe('Employee Data Integration Tests', () => {
  beforeEach(() => {
    // Reset mock data before each test
    mockDataService.employees = [
      { id: '1', name: 'John Doe', location: 'US', skills: ['React', 'TypeScript'], availability: true },
      { id: '2', name: 'Jane Smith', location: 'UK', skills: ['Vue', 'JavaScript'], availability: false },
    ];
    mockDataService.allocations = [
      { id: 'a1', employeeId: '2', projectId: 'p2', startDate: '2024-01-01', endDate: '2024-06-01' },
    ];
  });

  it('loads employee data on component mount', async () => {
    render(<MockEmployeeDataManager employeeId="1" />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('employee-data-manager')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Location: US')).toBeInTheDocument();
      expect(screen.getByText('Skills: React, TypeScript')).toBeInTheDocument();
      expect(screen.getByText('Available: Yes')).toBeInTheDocument();
    });
  });

  it('displays projects and allocations correctly', async () => {
    render(<MockEmployeeDataManager employeeId="1" />);

    await waitFor(() => {
      expect(screen.getByTestId('projects-section')).toBeInTheDocument();
      expect(screen.getByTestId('project-p1')).toBeInTheDocument();
      expect(screen.getByTestId('project-p2')).toBeInTheDocument();
      expect(screen.getByText('Project Alpha (active)')).toBeInTheDocument();
      expect(screen.getByText('Project Beta (planning)')).toBeInTheDocument();
    });

    // Employee 1 has no allocations
    expect(screen.getByText('No current allocations')).toBeInTheDocument();
  });

  it('shows existing allocations for allocated employee', async () => {
    render(<MockEmployeeDataManager employeeId="2" />);

    await waitFor(() => {
      expect(screen.getByTestId('allocations-section')).toBeInTheDocument();
      expect(screen.getByTestId('allocation-a1')).toBeInTheDocument();
      // Check the allocation details within the specific allocation div
      const allocationElement = screen.getByTestId('allocation-a1');
      expect(allocationElement).toHaveTextContent('Project: Project Beta');
      expect(allocationElement).toHaveTextContent('2024-01-01');
      expect(allocationElement).toHaveTextContent('2024-06-01');
    });
  });

  it('updates employee availability when toggled', async () => {
    render(<MockEmployeeDataManager employeeId="1" />);

    await waitFor(() => {
      expect(screen.getByText('Available: Yes')).toBeInTheDocument();
    });

    const toggleButton = screen.getByRole('button', { name: 'Toggle Availability' });
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText('Available: No')).toBeInTheDocument();
    });
  });

  it('adds skills to employee profile', async () => {
    render(<MockEmployeeDataManager employeeId="1" />);

    await waitFor(() => {
      expect(screen.getByText('Skills: React, TypeScript')).toBeInTheDocument();
    });

    const addSkillButton = screen.getByRole('button', { name: 'Add Skill' });
    fireEvent.click(addSkillButton);

    await waitFor(() => {
      expect(screen.getByText('Skills: React, TypeScript, New Skill')).toBeInTheDocument();
    });
  });

  it('creates new allocation when requested', async () => {
    render(<MockEmployeeDataManager employeeId="1" />);

    await waitFor(() => {
      expect(screen.getByText('No current allocations')).toBeInTheDocument();
    });

    const requestButtons = screen.getAllByRole('button', { name: 'Request Assignment' });
    fireEvent.click(requestButtons[0]); // Request assignment to Project Alpha

    await waitFor(() => {
      expect(screen.queryByText('No current allocations')).not.toBeInTheDocument();
      expect(screen.getByText(/Project: Project Alpha/)).toBeInTheDocument();
    });
  });

  it('handles non-existent employee gracefully', async () => {
    render(<MockEmployeeDataManager employeeId="999" />);

    await waitFor(() => {
      expect(screen.getByTestId('not-found')).toBeInTheDocument();
      expect(screen.getByText('Employee not found')).toBeInTheDocument();
    });
  });

  it('maintains data consistency across operations', async () => {
    render(<MockEmployeeDataManager employeeId="1" />);

    await waitFor(() => {
      expect(screen.getByText('Available: Yes')).toBeInTheDocument();
    });

    // Toggle availability
    const toggleButton = screen.getByRole('button', { name: 'Toggle Availability' });
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText('Available: No')).toBeInTheDocument();
    });

    // Add skill
    const addSkillButton = screen.getByRole('button', { name: 'Add Skill' });
    fireEvent.click(addSkillButton);

    await waitFor(() => {
      expect(screen.getByText('Skills: React, TypeScript, New Skill')).toBeInTheDocument();
      expect(screen.getByText('Available: No')).toBeInTheDocument(); // Should still be No
    });

    // Request assignment
    const requestButtons = screen.getAllByRole('button', { name: 'Request Assignment' });
    fireEvent.click(requestButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Project: Project Alpha/)).toBeInTheDocument();
      expect(screen.getByText('Skills: React, TypeScript, New Skill')).toBeInTheDocument();
      expect(screen.getByText('Available: No')).toBeInTheDocument();
    });
  });
});
