import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { RoleBasedNavigation } from './RoleBasedNavigation';
import { Building2, Users } from 'lucide-react';
import { NotificationDropdown } from '../ui/notification-dropdown';

export function MainLayout() {
  const { user, logout, refreshingToken } = useAuth();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 shadow-xl">
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-xl text-white">Talent Fit</div>
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <Users className="w-3 h-3" />
                {user?.role === 'manager' ? 'Manager Portal' : 'Employee Portal'}
              </div>
            </div>
          </div>
        </div>
        
        {/* User Info Card */}
        <div className="p-4 mx-4 mt-4 bg-slate-800/50 rounded-lg border border-slate-700/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white text-sm truncate">
                {user?.name}
              </div>
              <div className="text-xs text-slate-400 truncate">
                {user?.department}
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="px-4 pb-6 mt-6">
          <RoleBasedNavigation />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <div className="text-slate-700">
              Welcome back, <span className="font-semibold text-slate-900">{user?.name?.split(' ')[0]}</span>!
            </div>
            {refreshingToken && (
              <span className="text-xs text-slate-500 animate-pulse">
                Refreshing token…
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <NotificationDropdown />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={logout}
              className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            >
              Logout
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
