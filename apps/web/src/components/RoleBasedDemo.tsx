import { useAuth } from '../context/AuthContext';
import { useRolePermissions, useIsRole } from '../hooks/useRolePermissions';
import { UserRole } from '../types/roles';
import { RoleGuard, ManagerOnly, EmployeeOnly } from './auth/RoleGuard';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

export function RoleBasedDemo() {
  const { user } = useAuth();
  const permissions = useRolePermissions();
  const isManager = useIsRole(UserRole.MANAGER);
  const isEmployee = useIsRole(UserRole.EMPLOYEE);

  return (
    <div className="p-6 space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Current User & Role</h3>
        <div className="space-y-2">
          <div><strong>Name:</strong> {user?.name}</div>
          <div><strong>Role:</strong> <Badge>{user?.role}</Badge></div>
          <div><strong>Department:</strong> {user?.department}</div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Role Detection</h3>
        <div className="space-y-2">
          <div>Is Manager: <Badge variant={isManager ? "default" : "secondary"}>{isManager ? "Yes" : "No"}</Badge></div>
          <div>Is Employee: <Badge variant={isEmployee ? "default" : "secondary"}>{isEmployee ? "Yes" : "No"}</Badge></div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Current Permissions</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>View All Employees: <Badge variant={permissions.canViewAllEmployees ? "default" : "secondary"}>{permissions.canViewAllEmployees ? "Yes" : "No"}</Badge></div>
          <div>Create Projects: <Badge variant={permissions.canCreateProjects ? "default" : "secondary"}>{permissions.canCreateProjects ? "Yes" : "No"}</Badge></div>
          <div>Allocate Resources: <Badge variant={permissions.canAllocateResources ? "default" : "secondary"}>{permissions.canAllocateResources ? "Yes" : "No"}</Badge></div>
          <div>View Analytics: <Badge variant={permissions.canViewAnalytics ? "default" : "secondary"}>{permissions.canViewAnalytics ? "Yes" : "No"}</Badge></div>
          <div>Manage Team: <Badge variant={permissions.canManageTeam ? "default" : "secondary"}>{permissions.canManageTeam ? "Yes" : "No"}</Badge></div>
          <div>View Own Profile: <Badge variant={permissions.canViewOwnProfile ? "default" : "secondary"}>{permissions.canViewOwnProfile ? "Yes" : "No"}</Badge></div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Manager Only Content</h3>
          <ManagerOnly fallback={<div className="text-muted-foreground">You need Manager role to see this content.</div>}>
            <div className="space-y-2">
              <div className="text-green-600">🎉 You can see this because you're a Manager!</div>
              <div>• Create and manage projects</div>
              <div>• Allocate team members</div>
              <div>• View team analytics</div>
            </div>
          </ManagerOnly>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Employee Only Content</h3>
          <EmployeeOnly fallback={<div className="text-muted-foreground">You need Employee role to see this content.</div>}>
            <div className="space-y-2">
              <div className="text-blue-600">👋 Welcome Employee!</div>
              <div>• Manage your profile</div>
              <div>• View your assignments</div>
              <div>• Update availability status</div>
            </div>
          </EmployeeOnly>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Permission-Based Content</h3>
        <div className="space-y-4">
          <RoleGuard permission="canCreateProjects" fallback={<div className="text-muted-foreground">You don't have permission to create projects.</div>}>
            <div className="p-3 bg-green-50 rounded">
              <div className="text-green-700">✅ You have permission to create projects!</div>
            </div>
          </RoleGuard>
          
          <RoleGuard permission="canViewAllEmployees" fallback={<div className="text-muted-foreground">You don't have permission to view all employees.</div>}>
            <div className="p-3 bg-blue-50 rounded">
              <div className="text-blue-700">👥 You can view the full employee directory!</div>
            </div>
          </RoleGuard>
          
          <RoleGuard permission="canViewAnalytics" fallback={<div className="text-muted-foreground">You don't have permission to view analytics.</div>}>
            <div className="p-3 bg-purple-50 rounded">
              <div className="text-purple-700">📊 You have access to analytics dashboard!</div>
            </div>
          </RoleGuard>
        </div>
      </Card>
    </div>
  );
}
