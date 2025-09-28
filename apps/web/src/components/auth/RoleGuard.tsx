import { useRolePermissions, useIsRole } from '../../hooks/useRolePermissions';
import { UserRole } from '../../types/roles';

interface RoleGuardProps {
  children: React.ReactNode;
  permission?: keyof ReturnType<typeof useRolePermissions>;
  role?: UserRole;
  fallback?: React.ReactNode;
}

export function RoleGuard({ children, permission, role, fallback = null }: RoleGuardProps) {
  const permissions = useRolePermissions();
  const { isRole } = useIsRole();
  const hasRole = isRole(role!);

  // If checking for specific role
  if (role && !hasRole) {
    return <>{fallback}</>;
  }

  // If checking for specific permission
  if (permission && !permissions[permission]) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Convenience components for common role checks
export function ManagerOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard role={UserRole.MANAGER} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function EmployeeOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard role={UserRole.EMPLOYEE} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}
