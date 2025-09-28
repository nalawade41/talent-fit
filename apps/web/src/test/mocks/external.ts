import { vi } from 'vitest';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/', search: '', hash: '', state: null }),
    useParams: () => ({}),
  };
});

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  User: () => 'UserIcon',
  Users: () => 'UsersIcon',
  Briefcase: () => 'BriefcaseIcon',
  AlertTriangle: () => 'AlertTriangleIcon',
  Download: () => 'DownloadIcon',
  Filter: () => 'FilterIcon',
  Search: () => 'SearchIcon',
  UsersIcon: () => 'UsersIcon',
  TrendingUp: () => 'TrendingUpIcon',
  LayoutDashboard: () => 'LayoutDashboardIcon',
  FolderOpen: () => 'FolderOpenIcon',
  BarChart3: () => 'BarChart3Icon',
  Building: () => 'BuildingIcon',
  Bell: () => 'BellIcon',
  Pencil: () => 'PencilIcon',
  Calendar: () => 'CalendarIcon',
  MapPin: () => 'MapPinIcon',
  Clock: () => 'ClockIcon',
  CheckCircle: () => 'CheckCircleIcon',
  XCircle: () => 'XCircleIcon',
  Plus: () => 'PlusIcon',
  Trash2: () => 'Trash2Icon',
  Edit: () => 'EditIcon',
  Eye: () => 'EyeIcon',
  Settings: () => 'SettingsIcon',
}));

// Mock recharts
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => children,
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
  Toaster: () => <div data-testid="toaster" />,
}));

// Mock world-countries
vi.mock('world-countries', () => ({
  countries: [
    { cca2: 'US', name: { common: 'United States' } },
    { cca2: 'IN', name: { common: 'India' } },
    { cca2: 'GB', name: { common: 'United Kingdom' } },
  ],
}));
