import { Toaster } from 'react-hot-toast';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { MainLayout } from './components/Layout/MainLayout';
import { LoginPage } from './components/LoginPage';
import { ProtectedRoute, UnauthorizedAccess } from './components/ProtectedRoute';
import { ManagerDashboard } from './components/pages/ManagerDashboard';
import { EmployeeDashboard } from './components/pages/EmployeeDashboard';
import { ProfilePage } from './components/pages/ProfilePage';
import { TeamManagementPage } from './components/pages/TeamManagementPage';
import { ProjectsPage } from './components/pages/ProjectsPage';
import { ProjectDetailsPage } from './components/pages/ProjectDetailsPage';
import { ProjectEditPage } from './components/pages/ProjectEditPage';
// import { AnalyticsPage } from './components/pages/AnalyticsPage';
import { AllEmployeesPage } from './components/pages/AllEmployeesPage';
import { NotificationsPage } from './components/pages/NotificationsPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useIsRole } from './hooks/useRolePermissions';
import './index.css';
import { UserRole } from './types/roles';

// Removed unused GoogleIcon

// Removed inline mock LoginPage; using components/LoginPage instead

function DashboardRoute() {
  const { isRole } = useIsRole();
  const isManager = isRole(UserRole.MANAGER);
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
          path="projects/:id"
          element={
            <ProtectedRoute requiredPermission="canCreateProjects" fallbackPath="/">
              <ProjectDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="projects/:id/edit"
          element={
            <ProtectedRoute requiredPermission="canCreateProjects" fallbackPath="/">
              <ProjectEditPage />
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
