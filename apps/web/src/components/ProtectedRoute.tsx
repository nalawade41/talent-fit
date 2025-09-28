import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole, getRolePermissions } from '../types/roles';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: keyof ReturnType<typeof getRolePermissions>;
  fallbackPath?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredPermission, 
  fallbackPath = '/' 
}: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission) {
    const userRole = user.role === UserRole.MANAGER ? UserRole.MANAGER : UserRole.EMPLOYEE;
    const permissions = getRolePermissions(userRole);
    
    if (!permissions[requiredPermission]) {
      return <Navigate to={fallbackPath} replace />;
    }
  }

  return <>{children}</>;
}

// Unauthorized access component
export function UnauthorizedAccess() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-6xl">🔒</div>
        <h1 className="text-2xl font-semibold text-gray-900">Access Denied</h1>
        <p className="text-gray-600 max-w-md">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
      </div>
    </div>
  );
}
