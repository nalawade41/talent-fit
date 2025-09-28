import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import type { ProjectAllocation } from '../data/allocations';
import type { Employee } from '../data/employees';
import { EmployeeProfileService, ProjectAllocationService } from '../services';

interface UseEmployeeDashboardReturn {
  employee: Employee | null;
  loading: boolean;
  error: string | null;
  currentAllocations: ProjectAllocation[];
  projectHistory: ProjectAllocation[];
  refetch: () => Promise<void>;
  daysUntilEnd: (endDate: string | null) => number;
}

export const useEmployeeDashboard = (): UseEmployeeDashboardReturn => {
  const { user, logout } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [currentAllocations, setCurrentAllocations] = useState<ProjectAllocation[]>([]);
  const [projectHistory, setProjectHistory] = useState<ProjectAllocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployeeData = async () => {
    if (!user?.id) {
      setError('No user found');
      setLoading(false);
      toast.error('User not found. Please login again.');
      logout();
      return;
    }
    try {
      setLoading(true);
      setError(null);
      
      // Fetch employee profile and allocations in parallel
      const employeeData = await EmployeeProfileService.getEmployeeProfile(user.id);

      if (employeeData) {
        setEmployee(employeeData);

        const allAllocations = await ProjectAllocationService.getEmployeeAllocations(employeeData.employee_id);

        // Lets set current allocations and history allocations
        const currentAllocs = allAllocations.filter((alloc) => !alloc.end_date);
        const historyAllocs = allAllocations.filter((alloc) => alloc.end_date);
        setCurrentAllocations(currentAllocs);
        setProjectHistory(historyAllocs);
      }
      
    } catch (err) {
      console.error('Error fetching employee data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch employee data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when user changes or component mounts
  useEffect(() => {
    fetchEmployeeData();
  }, [user?.id]);

  // Refetch function for manual refresh
  const refetch = async () => {
    await fetchEmployeeData();
  };

  // Utility function to calculate days until end
  const daysUntilEnd = (endDate: string | null): number => {
    if (!endDate) return 999;
    const end = new Date(endDate);
    const now = new Date();
    return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  return {
    employee,
    loading,
    error,
    currentAllocations,
    projectHistory,

    refetch,
    daysUntilEnd,
  };
};

export default useEmployeeDashboard;
