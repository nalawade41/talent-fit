import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Briefcase, AlertTriangle, Download, Users, TrendingUp } from 'lucide-react';
import { employeesData, getAvailableEmployees, getRollingOffEmployees, getAllocatedEmployees, getBenchEmployees } from '../../data/employees';
import { projectsData } from '../../data/projects';
import { projectAllocationsData } from '../../data/allocations';

export function ManagerDashboard() {
  const navigate = useNavigate();
  
  // Calculate metrics
  const availableEngineers = getAvailableEmployees().length;
  const rollingOffEngineers = getRollingOffEmployees().length;
  const allocatedEngineers = getAllocatedEmployees().length;
  const benchEngineers = getBenchEmployees().length;
  const activeProjects = projectsData.filter(p => p.status === 'Open').length;

  // Chart data
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
    const items = [];

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
        const employee = employeesData.find(e => e.user_id === allocation.user_id);
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
          <h1 className="text-3xl font-bold">Manager Dashboard</h1>
          <p className="text-muted-foreground">Manage your team and projects efficiently</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
      </div>

      {/* Charts and Attention Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource Utilization Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Resource Utilization</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Attention Items */}
        <Card>
          <CardHeader>
            <CardTitle>Attention Items</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>

      {/* Skills Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top Skills Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillsDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="skill" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
