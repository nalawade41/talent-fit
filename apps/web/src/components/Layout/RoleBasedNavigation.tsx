import { NavLink } from 'react-router-dom';
import { useRolePermissions } from '../../hooks/useRolePermissions';
import { cn } from '../../lib/utils';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Building
} from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  permission?: keyof ReturnType<typeof useRolePermissions>;
  icon: React.ElementType;
}

const navigationItems: NavItem[] = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/projects', label: 'Projects', permission: 'canCreateProjects', icon: FolderOpen },
  { path: '/employees', label: 'Employees', permission: 'canViewAllEmployees', icon: Building },
];

export function RoleBasedNavigation() {
  const permissions = useRolePermissions();

  const allowedItems = navigationItems.filter(item => {
    if (!item.permission) return true;
    return permissions[item.permission];
  });

  return (
    <div>
      <div className="mb-3">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-3">
          Navigation
        </div>
      </div>
      <nav className="space-y-1">
        {allowedItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group',
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                )
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
