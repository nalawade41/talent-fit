import './index.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useState } from 'react';
import { MainLayout } from './components/Layout/MainLayout';
import { ProtectedRoute, UnauthorizedAccess } from './components/ProtectedRoute';
import { ManagerDashboard } from './components/pages/ManagerDashboard';
import { EmployeeDashboard } from './components/pages/EmployeeDashboard';
import { ProfilePage } from './components/pages/ProfilePage';
import { TeamManagementPage } from './components/pages/TeamManagementPage';
import { ProjectsPage } from './components/pages/ProjectsPage';
import { AnalyticsPage } from './components/pages/AnalyticsPage';
import { AllEmployeesPage } from './components/pages/AllEmployeesPage';
import { NotificationsPage } from './components/pages/NotificationsPage';
import { useIsRole } from './hooks/useRolePermissions';
import { UserRole } from './types/roles';

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function LoginPage() {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<'manager' | 'employee'>('manager');

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    const ok = await loginWithGoogle(selectedRole);
    if (!ok) setError('Authentication failed. Please try again.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm space-y-6 bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Sign in</h1>
          <p className="text-sm text-muted-foreground mt-1">Use your company Google account to continue.</p>
        </div>

        {/* Demo Role Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Demo Role (Development Only)</label>
          <div className="flex space-x-3">
            <label className="flex items-center">
              <input
                type="radio"
                value="manager"
                checked={selectedRole === 'manager'}
                onChange={(e) => setSelectedRole(e.target.value as 'manager' | 'employee')}
                className="mr-2"
              />
              <span className="text-sm">Manager</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="employee"
                checked={selectedRole === 'employee'}
                onChange={(e) => setSelectedRole(e.target.value as 'manager' | 'employee')}
                className="mr-2"
              />
              <span className="text-sm">Employee</span>
            </label>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <GoogleIcon />
          {loading ? 'Signing in...' : `Sign in as ${selectedRole === 'manager' ? 'Manager' : 'Employee'}`}
        </button>

        {error && <p className="text-xs text-red-600">{error}</p>}
        
        <div className="space-y-1 text-[11px] leading-snug text-muted-foreground">
          <p>This is a mock Google OAuth flow for local development.</p>
          <p>In production: role will be determined automatically after authentication.</p>
        </div>
      </div>
    </div>
  );
}

function DashboardRoute() {
  const isManager = useIsRole(UserRole.MANAGER);
  return isManager ? <ManagerDashboard /> : <EmployeeDashboard />;
}

function AuthShell() {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/" element={<MainLayout />}>
        <Route index element={<DashboardRoute />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute requiredPermission="canViewOwnProfile">
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="team"
          element={
            <ProtectedRoute requiredPermission="canManageTeam" fallbackPath="/">
              <TeamManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="projects"
          element={
            <ProtectedRoute requiredPermission="canCreateProjects" fallbackPath="/">
              <ProjectsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="analytics"
          element={
            <ProtectedRoute requiredPermission="canViewAnalytics" fallbackPath="/">
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="employees"
          element={
            <ProtectedRoute requiredPermission="canViewAllEmployees" fallbackPath="/">
              <AllEmployeesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="notifications"
          element={
            <ProtectedRoute requiredPermission="canManageTeam" fallbackPath="/">
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route path="unauthorized" element={<UnauthorizedAccess />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthShell />
      </Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          success: {
            style: {
              background: '#10B981',
              color: 'white',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#EF4444',
              color: 'white',
            },
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;
