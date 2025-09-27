import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Layout/Sidebar';
import { EmployeeDashboard } from './components/Dashboard/EmployeeDashboard';
import { ManagerDashboard } from './components/Dashboard/ManagerDashboard';
import { ProjectsPage } from './components/Projects/ProjectsPage';
import { AlertsPage } from './components/Alerts/AlertsPage';
import { ProfilePage } from './components/Profile/ProfilePage';
import { TeamPage } from './components/Team/TeamPage';

function AppContent() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!user) {
    return <LoginPage />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return user.role === 'manager' ? 
          <ManagerDashboard onPageChange={setCurrentPage} /> : 
          <EmployeeDashboard />;
      case 'projects':
        return <ProjectsPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'team':
        return <TeamPage />;
      default:
        return user.role === 'manager' ? 
          <ManagerDashboard onPageChange={setCurrentPage} /> : 
          <EmployeeDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-auto">
        {renderCurrentPage()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;