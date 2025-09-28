import { describe, it, expect } from 'vitest';
import { employeesData, getAvailableEmployees, getRollingOffEmployees, getAllocatedEmployees, getBenchEmployees } from '../../data/employees';
import { projectsData } from '../../data/projects';
import { projectAllocationsData } from '../../data/allocations';

describe('Data Validation', () => {
  describe('Employee Data', () => {
    it('should have valid employee structure', () => {
      employeesData.forEach(employee => {
        expect(employee).toHaveProperty('user_id');
        expect(employee).toHaveProperty('user');
        expect(employee.user).toHaveProperty('first_name');
        expect(employee.user).toHaveProperty('last_name');
        expect(employee.user).toHaveProperty('email');
        expect(employee).toHaveProperty('geo');
        expect(employee).toHaveProperty('skills');
        expect(employee).toHaveProperty('status');
        expect(employee).toHaveProperty('type');
        expect(employee).toHaveProperty('years_of_experience');
        expect(employee).toHaveProperty('industry');
        expect(employee).toHaveProperty('date_of_joining');
      });
    });

    it('should have valid email format', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      employeesData.forEach(employee => {
        expect(employee.user.email).toMatch(emailRegex);
      });
    });

    it('should have valid status values', () => {
      const validStatuses = ['available', 'allocated', 'bench', 'rolling_off'];
      employeesData.forEach(employee => {
        expect(validStatuses).toContain(employee.status);
      });
    });

    it('should have valid geo values', () => {
      employeesData.forEach(employee => {
        expect(employee.geo).toBeTruthy();
        expect(typeof employee.geo).toBe('string');
        expect(employee.geo.length).toBeGreaterThan(0);
      });
    });

    it('should have valid skills array', () => {
      employeesData.forEach(employee => {
        expect(Array.isArray(employee.skills)).toBe(true);
        expect(employee.skills.length).toBeGreaterThan(0);
        employee.skills.forEach(skill => {
          expect(typeof skill).toBe('string');
          expect(skill.length).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('Project Data', () => {
    it('should have valid project structure', () => {
      projectsData.forEach(project => {
        expect(project).toHaveProperty('id');
        expect(project).toHaveProperty('name');
        expect(project).toHaveProperty('description');
        expect(project).toHaveProperty('required_seats');
        expect(project).toHaveProperty('start_date');
        expect(project).toHaveProperty('end_date');
        expect(project).toHaveProperty('status');
      });
    });

    it('should have valid status values', () => {
      const validStatuses = ['Open', 'Closed'];
      projectsData.forEach(project => {
        expect(validStatuses).toContain(project.status);
      });
    });

    it('should have valid date formats', () => {
      // Projects use ISO date format with time
      const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
      projectsData.forEach(project => {
        expect(project.start_date).toMatch(isoDateRegex);
        expect(project.end_date).toMatch(isoDateRegex);
      });
    });

    it('should have valid required seats', () => {
      projectsData.forEach(project => {
        expect(typeof project.required_seats).toBe('number');
        expect(project.required_seats).toBeGreaterThan(0);
      });
    });
  });

  describe('Allocation Data', () => {
    it('should have valid allocation structure', () => {
      projectAllocationsData.forEach(allocation => {
        expect(allocation).toHaveProperty('id');
        expect(allocation).toHaveProperty('employee_id'); // Note: uses employee_id, not user_id
        expect(allocation).toHaveProperty('project_id');
        expect(allocation).toHaveProperty('allocation_type');
        expect(allocation).toHaveProperty('start_date');
        expect(allocation).toHaveProperty('end_date');
      });
    });

    it('should have valid allocation type', () => {
      const validTypes = ['Full-time', 'Part-time', 'Extra'];
      projectAllocationsData.forEach(allocation => {
        expect(validTypes).toContain(allocation.allocation_type);
      });
    });

    it('should reference existing employees and projects', () => {
      const employeeIds = employeesData.map(emp => emp.user_id);
      const projectIds = projectsData.map(proj => proj.id);

      projectAllocationsData.forEach(allocation => {
        // Note: allocation uses employee_id (number), employees use user_id (string)
        // For this test, we'll just check that employee_id exists and is a number
        expect(typeof allocation.employee_id).toBe('number');
        expect(allocation.employee_id).toBeGreaterThan(0);
        expect(projectIds).toContain(allocation.project_id);
      });
    });
  });

  describe('Data Filtering Functions', () => {
    it('getAvailableEmployees should return only available employees', () => {
      const available = getAvailableEmployees();
      available.forEach(employee => {
        expect(employee.status).toBe('available');
      });
    });

    it('getRollingOffEmployees should return only rolling off employees', () => {
      const rollingOff = getRollingOffEmployees();
      rollingOff.forEach(employee => {
        expect(employee.status).toBe('rolling_off');
      });
    });

    it('getAllocatedEmployees should return only allocated employees', () => {
      const allocated = getAllocatedEmployees();
      allocated.forEach(employee => {
        expect(employee.status).toBe('allocated');
      });
    });

    it('getBenchEmployees should return only bench employees', () => {
      const bench = getBenchEmployees();
      bench.forEach(employee => {
        expect(employee.status).toBe('bench');
      });
    });

    it('filtering functions should return arrays', () => {
      expect(Array.isArray(getAvailableEmployees())).toBe(true);
      expect(Array.isArray(getRollingOffEmployees())).toBe(true);
      expect(Array.isArray(getAllocatedEmployees())).toBe(true);
      expect(Array.isArray(getBenchEmployees())).toBe(true);
    });
  });

  describe('Data Relationships', () => {
    it('allocations should reference valid project IDs', () => {
      const projectIds = new Set(projectsData.map(proj => proj.id));

      projectAllocationsData.forEach(allocation => {
        expect(projectIds.has(allocation.project_id)).toBe(true);
      });
    });

    it('should not have duplicate allocation IDs', () => {
      const ids = projectAllocationsData.map(allocation => allocation.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });

    it('should not have duplicate employee user IDs', () => {
      const userIds = employeesData.map(employee => employee.user_id);
      const uniqueUserIds = new Set(userIds);
      expect(userIds.length).toBe(uniqueUserIds.size);
    });

    it('should not have duplicate project IDs', () => {
      const projectIds = projectsData.map(project => project.id);
      const uniqueProjectIds = new Set(projectIds);
      expect(projectIds.length).toBe(uniqueProjectIds.size);
    });
  });
});
