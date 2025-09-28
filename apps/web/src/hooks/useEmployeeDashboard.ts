import { useEffect, useState, useRef } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);

  const fetchEmployeeData = async () => {
    setLoading(true);
    if (!user?.email) {
      setError('No user found');
      setLoading(false);
      toast.error('User not found. Please login again.');
      logout();
      return;
    }
    try {
      setError(null);
      
      const employeeData = await EmployeeProfileService.getEmployeeProfile();
      if (employeeData) {
        setEmployee(employeeData);

        const allAllocations = await ProjectAllocationService.getEmployeeAllocations(employeeData.user_id);
        const currentAllocs = allAllocations.filter((alloc) => !alloc.end_date);
        const historyAllocs = allAllocations.filter((alloc) => alloc.end_date);
        setCurrentAllocations(currentAllocs);
        setProjectHistory(historyAllocs);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employee data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when user changes or component mounts
  useEffect(() => {
    console.log('🎯 useEffect triggered:', {
      userEmail: user?.email,
      hasEmployee: !!employee,
      hasFetched: hasFetchedRef.current,
      willFetch: !!user?.email && !hasFetchedRef.current,
      timestamp: new Date().toISOString()
    });
    
    if (user?.email && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchEmployeeData();
    }
  }, [user?.email]);

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
