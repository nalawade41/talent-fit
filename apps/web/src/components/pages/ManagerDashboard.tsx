import { AlertTriangle, Briefcase, Download, TrendingUp, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { projectAllocationsData } from '../../data/allocations';
import { employeesData } from '../../data/employees';
import { projectsData } from '../../data/projects';
import ManagerService, { ManagerDashboardMetrics } from '../../services/managerService';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function ManagerDashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<ManagerDashboardMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    ManagerService.getDashboardMetrics()
      .then((data) => {
        if (isMounted) {
          setMetrics(data);
          setError(null);
        }
      })
      .catch(() => {
        if (isMounted) setError('Failed to load dashboard metrics');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Calculate metrics
  const availableEngineers = metrics?.availableEngineers ?? 0;
  const rollingOffEngineers = metrics?.rollingOffSoon ?? 0;
  const allocatedEngineers = metrics?.allocatedEngineers ?? 0;
  const benchEngineers = metrics?.benchResources ?? 0;
  const activeProjects = metrics?.activeProjects ?? 0;

  // Chart data - use API metrics (fallback to zeros handled above)
  const utilizationData = [
    { name: 'Available', value: availableEngineers, color: '#00C49F' },
    { name: 'Allocated', value: allocatedEngineers, color: '#0088FE' },
    { name: 'Bench', value: benchEngineers, color: '#FFBB28' },
    { name: 'Rolling Off', value: rollingOffEngineers, color: '#FF8042' },
  ];

  const skillsDistribution = useMemo(() => {
    const skillCount: Record<string, number> = {};
    employeesData.forEach(emp => {
      emp.skills.forEach(skill => {
        skillCount[skill] = (skillCount[skill] || 0) + 1;
      });
    });
    return Object.entries(skillCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }));
  }, []);

  // Attention items data
  const attentionItems = useMemo(() => {

    // Projects requiring additional headcount soon (next 30 days)
    const projectsNeedingHeadcount = projectsData
      .filter(p => {
        const startDate = new Date(p.start_date);
        const daysUntilStart = Math.ceil((startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilStart > 0 && daysUntilStart <= 30 && p.required_seats > allocatedEngineers;
      })
      .map(project => ({
        id: `project-need-${project.id}`,
        type: 'project-need' as const,
        priority: 'high' as const,
        title: `${project.name} needs ${project.required_seats - allocatedEngineers} more engineers`,
        description: `Project starts in ${Math.ceil((new Date(project.start_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`,
        action: 'Allocate Resources',
        icon: '⚠️'
      }));

    // Projects releasing employees soon (next 30 days)
    const projectsReleasingEmployees = projectAllocationsData
      .filter(allocation => {
        if (!allocation.end_date) return false;
        const endDate = new Date(allocation.end_date);
        const daysUntilEnd = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilEnd > 0 && daysUntilEnd <= 30;
      })
      .map(allocation => {
        const project = projectsData.find(p => p.id === allocation.project_id);
        const employee = employeesData.find(e => e.user_id === allocation.employee_id);
        return {
          id: `project-release-${allocation.id}`,
          type: 'project-release' as const,
          priority: 'medium' as const,
          title: `${employee?.user.first_name} ${employee?.user.last_name} releasing from ${project?.name}`,
          description: `Available for reassignment in ${Math.ceil((new Date(allocation.end_date!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`,
          action: 'Plan Reassignment',
          icon: '🔄'
        };
      });

    // Employees on bench for extended period (30+ days)
    const employeesOnBenchLongTerm = employeesData
      .filter(emp => emp.status === 'bench')
      .slice(0, 3) // Show top 3 for brevity
      .map(employee => ({
        id: `bench-long-${employee.user_id}`,
        type: 'bench-long' as const,
        priority: 'medium' as const,
        title: `${employee.user.first_name} ${employee.user.last_name} available for 30+ days`,
        description: `Consider skill development or project assignment`,
        action: 'Assign Project',
        icon: '📚'
      }));

    // Employees with upcoming notice/end dates (next 60 days)
    const employeesWithUpcomingTransitions = employeesData
      .filter(emp => {
        if (!emp.end_date && !emp.notice_date) return false;
        const relevantDate = emp.end_date ? new Date(emp.end_date) : new Date(emp.notice_date!);
        const daysUntilTransition = Math.ceil((relevantDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilTransition > 0 && daysUntilTransition <= 60;
      })
      .slice(0, 3) // Show top 3 for brevity
      .map(employee => {
        const relevantDate = employee.end_date ? new Date(employee.end_date) : new Date(employee.notice_date!);
        const daysUntil = Math.ceil((relevantDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        const isNotice = !employee.end_date;
        return {
          id: `transition-${employee.user_id}`,
          type: 'transition' as const,
          priority: 'high' as const,
          title: `${employee.user.first_name} ${employee.user.last_name} ${isNotice ? 'notice period' : 'contract'} ends soon`,
          description: `${daysUntil} days remaining - plan replacement`,
          action: 'Plan Succession',
          icon: '⏰'
        };
      });

    // Location-specific requirements (mock data for demonstration)
    const locationSpecificNeeds = [
      {
        id: 'location-ny-1',
        type: 'location-need' as const,
        priority: 'medium' as const,
        title: 'NY Office needs 2 React developers',
        description: 'Project Alpha expansion starting next month',
        action: 'Hire/Transfer',
        icon: '📍'
      },
      {
        id: 'location-sf-1',
        type: 'location-need' as const,
        priority: 'low' as const,
        title: 'SF Office needs Python expertise',
        description: 'AI project requirements in 45 days',
        action: 'Plan Hiring',
        icon: '🏢'
      }
    ];

    return [
      ...projectsNeedingHeadcount,
      ...projectsReleasingEmployees,
      ...employeesOnBenchLongTerm,
      ...employeesWithUpcomingTransitions,
      ...locationSpecificNeeds
    ].sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [projectsData, employeesData, projectAllocationsData, allocatedEngineers]);

  // Navigation handlers for metric cards
  const navigateToAvailableEmployees = () => {
    navigate('/employees?status=available');
    toast.success('Showing available engineers');
  };

  const navigateToActiveProjects = () => {
    navigate('/projects');
    toast.success('Showing active projects');
  };

  const navigateToRollingOffEmployees = () => {
    navigate('/employees?status=rolling_off');
    toast.success('Showing employees rolling off soon');
  };

  const navigateToBenchEmployees = () => {
    navigate('/employees?status=bench');
    toast.success('Showing bench resources');
  };

  const handleExport = () => {
    // Mock export functionality
    const data = {
      metrics: {
        availableEngineers,
        activeProjects,
        rollingOffEngineers,
        benchEngineers
      },
      filteredEmployees: employeesData.map(emp => ({
        name: `${emp.user.first_name} ${emp.user.last_name}`,
        skills: emp.skills,
        status: emp.status,
        geo: emp.geo
      })),
      attentionItems
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `talent-fit-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Manager Dashboard</h1>
            {loading && (
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>
          <p className="text-muted-foreground">
            {loading ? 'Loading dashboard metrics...' : 'Manage your team and projects efficiently'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" disabled={loading}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Loading/Error States */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Failed to Load Dashboard Data</p>
          <p className="text-sm text-red-600 mt-1">{error}</p>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {loading ? (
          // Loading skeleton for metrics cards
          <>
            {[...Array(4)].map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                      <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
                    </div>
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          // Actual metrics cards
          <>
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow duration-200 hover:bg-gray-50"
              onClick={navigateToAvailableEmployees}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigateToAvailableEmployees()}
              aria-label="Navigate to available engineers"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Available Engineers</p>
                    <p className="text-3xl font-bold text-green-600">{availableEngineers}</p>
                  </div>
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow duration-200 hover:bg-gray-50"
              onClick={navigateToActiveProjects}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigateToActiveProjects()}
              aria-label="Navigate to active projects"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                    <p className="text-3xl font-bold text-blue-600">{activeProjects}</p>
                  </div>
                  <Briefcase className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow duration-200 hover:bg-gray-50"
              onClick={navigateToRollingOffEmployees}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigateToRollingOffEmployees()}
              aria-label="Navigate to employees rolling off soon"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rolling Off Soon</p>
                    <p className="text-3xl font-bold text-red-600">{rollingOffEngineers}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow duration-200 hover:bg-gray-50"
              onClick={navigateToBenchEmployees}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigateToBenchEmployees()}
              aria-label="Navigate to bench resources"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Bench Resources</p>
                    <p className="text-3xl font-bold text-orange-600">{benchEngineers}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Charts and Attention Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource Utilization Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Resource Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <div className="animate-pulse">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded w-28 mx-auto"></div>
                  </div>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={utilizationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent as number * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {utilizationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Attention Items */}
        <Card>
          <CardHeader>
            <CardTitle>Attention Items</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg animate-pulse">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-16"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {attentionItems.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">No immediate attention items</p>
                )}
                {attentionItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'secondary'}>
                        {item.priority}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.action}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Skills Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top Skills Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-[300px] animate-pulse">
              <div className="flex items-end justify-between h-full space-x-2 px-4">
                {[...Array(8)].map((_, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-200 rounded-t w-full" 
                    style={{ height: `${Math.random() * 80 + 20}%` }}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between mt-2 px-4">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="h-3 bg-gray-200 rounded w-12"></div>
                ))}
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={skillsDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skill" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
