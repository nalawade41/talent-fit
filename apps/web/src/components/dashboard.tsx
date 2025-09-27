import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmployeeCard } from './employee-card';
import { ProjectCard } from './project-card';
import { 
  employeesData, 
  getAvailableEmployees, 
  getRollingOffEmployees,
  projectsData,
  getUrgentProjects,
  getCriticalAlerts,
  getHighPriorityAlerts
} from '@/data';
import { 
  Users, 
  Briefcase, 
  AlertTriangle, 
  Clock,
  UserCheck,
  Building
} from 'lucide-react';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'projects' | 'alerts'>('overview');
  
  // Dashboard statistics
  const availableEmployees = getAvailableEmployees();
  const rollingOffEmployees = getRollingOffEmployees();
  const urgentProjects = getUrgentProjects();
  const criticalAlerts = getCriticalAlerts();
  const highPriorityAlerts = getHighPriorityAlerts();

  const stats = [
    {
      title: 'Total Employees',
      value: employeesData.length,
      description: 'Active team members',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Available Now',
      value: availableEmployees.length,
      description: 'Ready for new projects',
      icon: UserCheck,
      color: 'text-green-600',
    },
    {
      title: 'Rolling Off Soon',
      value: rollingOffEmployees.length,
      description: 'Need replacement planning',
      icon: Clock,
      color: 'text-orange-600',
    },
    {
      title: 'Active Projects',
      value: projectsData.filter(p => p.status === 'Open').length,
      description: 'Currently running',
      icon: Building,
      color: 'text-purple-600',
    },
    {
      title: 'Urgent Projects',
      value: urgentProjects.length,
      description: 'Starting within 2 weeks',
      icon: Briefcase,
      color: 'text-red-600',
    },
    {
      title: 'Critical Alerts',
      value: criticalAlerts.length,
      description: 'Require immediate action',
      icon: AlertTriangle,
      color: 'text-red-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Talent Fit Dashboard</h1>
            <p className="text-muted-foreground">
              AI-powered talent matching and resource management
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">Export Report</Button>
            <Button>Create Project</Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
          {(['overview', 'employees', 'projects', 'alerts'] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab)}
              className="capitalize"
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Available Engineers */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Available Engineers</CardTitle>
                  <CardDescription>
                    Ready for immediate allocation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {availableEmployees.slice(0, 3).map((employee) => (
                    <EmployeeCard
                      key={employee.user_id}
                      employee={employee}
                      compact
                      onViewProfile={(id) => console.log('View profile:', id)}
                      onAllocate={(id) => console.log('Allocate employee:', id)}
                    />
                  ))}
                  {availableEmployees.length > 3 && (
                    <Button variant="outline" className="w-full" size="sm">
                      View All Available ({availableEmployees.length})
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Urgent Projects */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Urgent Projects</CardTitle>
                  <CardDescription>
                    Starting within 2 weeks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {urgentProjects.slice(0, 3).map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      compact
                      onViewDetails={(id) => console.log('View project:', id)}
                      onFindMatches={(id) => console.log('Find matches for:', id)}
                    />
                  ))}
                  {urgentProjects.length > 3 && (
                    <Button variant="outline" className="w-full" size="sm">
                      View All Urgent ({urgentProjects.length})
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* High Priority Alerts */}
            {highPriorityAlerts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <span>High Priority Alerts</span>
                  </CardTitle>
                  <CardDescription>
                    Requires immediate attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {highPriorityAlerts.slice(0, 5).map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-start space-x-3 p-3 rounded-lg border bg-card"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-medium">{alert.title}</h4>
                            <Badge
                              variant={alert.severity === 'critical' ? 'destructive' : 'warning'}
                              className="text-xs"
                            >
                              {alert.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {alert.message}
                          </p>
                        </div>
                        {alert.action_required && (
                          <Button size="sm" variant="outline">
                            Take Action
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Employees Tab */}
        {activeTab === 'employees' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">All Employees</h2>
              <div className="flex space-x-2">
                <Button variant="outline">Filter</Button>
                <Button variant="outline">Export</Button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {employeesData.map((employee) => (
                <EmployeeCard
                  key={employee.user_id}
                  employee={employee}
                  onViewProfile={(id) => console.log('View profile:', id)}
                  onAllocate={(id) => console.log('Allocate employee:', id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">All Projects</h2>
              <div className="flex space-x-2">
                <Button variant="outline">Filter</Button>
                <Button>Create Project</Button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projectsData.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onViewDetails={(id) => console.log('View project:', id)}
                  onFindMatches={(id) => console.log('Find matches for:', id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">All Alerts</h2>
              <Button variant="outline">Mark All Read</Button>
            </div>
            <div className="space-y-4">
              {highPriorityAlerts.map((alert) => (
                <Card key={alert.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-base">{alert.title}</CardTitle>
                        <Badge
                          variant={alert.severity === 'critical' ? 'destructive' : 'warning'}
                        >
                          {alert.severity}
                        </Badge>
                        {alert.type && (
                          <Badge variant="outline" className="capitalize">
                            {alert.type.replace('_', ' ')}
                          </Badge>
                        )}
                      </div>
                      {alert.action_required && (
                        <Button size="sm">Take Action</Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {alert.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Created: {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
