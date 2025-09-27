import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Briefcase, AlertTriangle, Download, Filter, Search, Users, TrendingUp } from 'lucide-react';
import { employeesData, getAvailableEmployees, getRollingOffEmployees, getAllocatedEmployees, getBenchEmployees } from '../../data/employees';
import { projectsData } from '../../data/projects';
import { projectAllocationsData } from '../../data/allocations';

export function ManagerDashboard() {
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [geoFilter, setGeoFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Calculate metrics
  const availableEngineers = getAvailableEmployees().length;
  const rollingOffEngineers = getRollingOffEmployees().length;
  const allocatedEngineers = getAllocatedEmployees().length;
  const benchEngineers = getBenchEmployees().length;
  const activeProjects = projectsData.filter(p => p.status === 'Open').length;

  // Get unique skills and geos for filters
  const allSkills = useMemo(() => {
    const skills = new Set<string>();
    employeesData.forEach(emp => emp.skills.forEach(skill => skills.add(skill)));
    return Array.from(skills).sort();
  }, []);

  const allGeos = useMemo(() => {
    const geos = new Set<string>();
    employeesData.forEach(emp => geos.add(emp.geo));
    return Array.from(geos).sort();
  }, []);

  // Filter employees based on current filters
  const filteredEmployees = useMemo(() => {
    return employeesData.filter(employee => {
      const matchesSkill = skillFilter === 'all' || employee.skills.includes(skillFilter);
      const matchesGeo = geoFilter === 'all' || employee.geo === geoFilter;
      const matchesAvailability = availabilityFilter === 'all' ||
        (availabilityFilter === 'available' && employee.status === 'available') ||
        (availabilityFilter === 'allocated' && employee.status === 'allocated') ||
        (availabilityFilter === 'bench' && employee.status === 'bench') ||
        (availabilityFilter === 'rolling_off' && employee.status === 'rolling_off');
      const matchesSearch = searchTerm === '' ||
        `${employee.user.first_name} ${employee.user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesSkill && matchesGeo && matchesAvailability && matchesSearch;
    });
  }, [skillFilter, geoFilter, availabilityFilter, searchTerm]);

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

  const handleExport = () => {
    // Mock export functionality
    const data = {
      metrics: {
        availableEngineers,
        activeProjects,
        rollingOffEngineers,
        benchEngineers
      },
      filteredEmployees: filteredEmployees.map(emp => ({
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
        <Card>
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

        <Card>
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

        <Card>
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

        <Card>
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

      {/* Quick Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Quick Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Skills</label>
              <Select value={skillFilter} onValueChange={setSkillFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Skills" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skills</SelectItem>
                  {allSkills.map(skill => (
                    <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Select value={geoFilter} onValueChange={setGeoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {allGeos.map(geo => (
                    <SelectItem key={geo} value={geo}>{geo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Availability</label>
              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="allocated">Allocated</SelectItem>
                  <SelectItem value="bench">Bench</SelectItem>
                  <SelectItem value="rolling_off">Rolling Off</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredEmployees.length} of {employeesData.length} employees
          </div>
        </CardContent>
      </Card>

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
