export enum UserRole {
  EMPLOYEE = 'employee',
  MANAGER = 'manager'
}

export type RolePermissions = {
  canViewAllEmployees: boolean;
  canCreateProjects: boolean;
  canAllocateResources: boolean;
  canViewAnalytics: boolean;
  canManageTeam: boolean;
  canViewOwnProfile: boolean;
  canEditOwnProfile: boolean;
}

export const getRolePermissions = (role: UserRole): RolePermissions => {
  switch (role) {
    case UserRole.MANAGER:
      return {
        canViewAllEmployees: true,
        canCreateProjects: true,
        canAllocateResources: true,
        canViewAnalytics: true,
        canManageTeam: true,
        canViewOwnProfile: true,
        canEditOwnProfile: true,
      };
    case UserRole.EMPLOYEE:
      return {
        canViewAllEmployees: false,
        canCreateProjects: false,
        canAllocateResources: false,
        canViewAnalytics: false,
        canManageTeam: false,
        canViewOwnProfile: true,
        canEditOwnProfile: true,
      };
    default:
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
};
