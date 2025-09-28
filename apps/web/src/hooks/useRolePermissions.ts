import { useAuth } from '../context/AuthContext';
import { UserRole, getRolePermissions } from '../types/roles';

export function useRolePermissions() {
  const { user } = useAuth();

  if (!user) {
    return {
      canViewAllEmployees: false,
      canCreateProjects: false,
      canAllocateResources: false,
      canViewAnalytics: false,
      canManageTeam: false,
      canViewOwnProfile: false,
      canEditOwnProfile: false,
    };
  }

  const userRole = user.role === UserRole.MANAGER ? UserRole.MANAGER : UserRole.EMPLOYEE;
  return getRolePermissions(userRole);
}

export function useIsRole(role: UserRole) {
  const { user } = useAuth();
  if (!user) return false;
  
  const userRole = user.role === UserRole.MANAGER ? UserRole.MANAGER : UserRole.EMPLOYEE;
  return userRole === role;
}
