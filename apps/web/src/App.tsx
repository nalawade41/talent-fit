import { Toaster } from 'react-hot-toast';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { MainLayout } from './components/Layout/MainLayout';
import { LoginPage } from './components/LoginPage';
import { ProfileCreationPage } from './components/pages/ProfileCreationPage';
import { ProtectedRoute, UnauthorizedAccess } from './components/ProtectedRoute';
import { ManagerDashboard } from './components/pages/ManagerDashboard';
import { EmployeeDashboard } from './components/pages/EmployeeDashboard';
import { ProfilePage } from './components/pages/ProfilePage';
import { TeamManagementPage } from './components/pages/TeamManagementPage';
import { NotificationsPage } from './components/pages/NotificationsPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useIsRole } from './hooks/useRolePermissions';
import './index.css';
import { UserRole } from './types/roles';
import { AppErrorBoundary } from './components/system/AppErrorBoundary';

// Lazy load heavy pages for better performance
const ProjectsPage = lazy(() => import('./components/pages/ProjectsPage'));
const CreateProjectPage = lazy(() => import('./components/pages/CreateProjectPage'));
const ProjectDetailsPage = lazy(() => import('./components/pages/ProjectDetailsPage'));  
const ProjectEditPage = lazy(() => import('./components/pages/ProjectEditPage'));
const AllEmployeesPage = lazy(() => import('./components/pages/AllEmployeesPage'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

// Removed unused GoogleIcon

// Removed inline mock LoginPage; using components/LoginPage instead

function DashboardRoute() {
  const { isRole } = useIsRole();
  const isManager = isRole(UserRole.MANAGER);
  return isManager ? <ManagerDashboard /> : <EmployeeDashboard />;
}

function AuthShell() {
  const { user, profileStatus } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  // Show profile creation page if user needs to create profile
  if (profileStatus === 'needs_creation') {
    return <ProfileCreationPage />;
  }

  // Show loading while checking profile status
  if (profileStatus === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show error if profile check failed
  if (profileStatus === 'error') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-red-600">Error loading profile</h1>
          <p className="text-gray-600 mt-2">Please try refreshing the page or contact support.</p>
        </div>
      </div>
    );
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
              <Suspense fallback={<PageLoader />}>
                <ProjectsPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="projects/create"
          element={
            <ProtectedRoute requiredPermission="canCreateProjects" fallbackPath="/">
              <Suspense fallback={<PageLoader />}>
                <CreateProjectPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="projects/:id"
          element={
            <ProtectedRoute requiredPermission="canCreateProjects" fallbackPath="/">
              <Suspense fallback={<PageLoader />}>
                <ProjectDetailsPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="projects/:id/edit"
          element={
            <ProtectedRoute requiredPermission="canCreateProjects" fallbackPath="/">
              <Suspense fallback={<PageLoader />}>
                <ProjectEditPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="analytics"
          element={
            <ProtectedRoute requiredPermission="canViewAnalytics" fallbackPath="/">
              <AnalyticsPage />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="employees"
          element={
            <ProtectedRoute requiredPermission="canViewAllEmployees" fallbackPath="/">
              <Suspense fallback={<PageLoader />}>
                <AllEmployeesPage />
              </Suspense>
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
      <AppErrorBoundary>
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
      </AppErrorBoundary>
    </AuthProvider>
  );
}

export default App;
