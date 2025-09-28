import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useEmployeeDashboard } from '../../hooks/useEmployeeDashboard';
import { useNavigate } from 'react-router-dom';

export function EmployeeDashboard() {
  const navigate = useNavigate();
  
  const { 
    employee: employeeData, 
    loading, 
    error, 
    currentAllocations, 
    projectHistory, 
    daysUntilEnd, 
    refetch 
  } = useEmployeeDashboard();
  // Show loading state
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={refetch} className="bg-blue-500 hover:bg-blue-600">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Show no data state
  if (!employeeData) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Employee Data Found</h3>
          <p className="text-gray-600 mb-4">Unable to load your employee profile.</p>
          <Button onClick={refetch} className="bg-blue-500 hover:bg-blue-600">
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">

      {/* Quick Availability Toggle */}
      <Card className="p-6 border-b-4 border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-sm overflow-hidden relative">
        <div className="absolute right-0 top-0 w-24 h-24 opacity-10">
          <svg fill="currentColor" className="w-full h-full text-blue-500" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-4 text-blue-800 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Availability Status
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-blue-900">Available for Extra Work</div>
            <div className="text-sm text-blue-700 max-w-sm">Let managers know you're open to contribute additional hours beyond your standard working hours</div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-semibold ${employeeData.availability_flag ? 'text-green-600' : 'text-gray-500'}`}>
              {employeeData.availability_flag ? 'Available' : 'Not Available'}
            </span>
            <div className={`w-14 h-7 rounded-full p-1 transition-colors shadow-inner ${employeeData.availability_flag ? 'bg-green-500' : 'bg-gray-300'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${employeeData.availability_flag ? 'translate-x-7' : 'translate-x-0'}`}></div>
            </div>
          </div>
        </div>
      </Card>

      {/* Assignment Status - Either Current Assignments or Unassigned Notification */}
      {currentAllocations.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          <Card className="p-6 rounded-xl shadow-md overflow-hidden relative">
            <div className="absolute right-0 top-0 w-32 h-32 opacity-5">
              <svg fill="currentColor" className="w-full h-full text-indigo-800" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10zM5 7V5h14v2H5zm2 4h10v2H7zm0 4h7v2H7z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-4 text-indigo-800 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Current Assignments
            </h3>
            <div className="space-y-4">
              {currentAllocations.map((allocation) => (
                <div key={allocation.id} className="flex items-start gap-4 p-5 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-all duration-300">
                  <div className={`w-3 h-12 ${allocation.allocation_type === 'Full-time' ? 'bg-gradient-to-b from-green-400 to-green-600' : 'bg-gradient-to-b from-blue-400 to-blue-600'} rounded-full mt-1`}></div>
                  <div className="flex-1">
                    <div className="font-medium text-indigo-900 text-lg">{allocation.project?.name || 'Project'}</div>
                    <div className="text-sm text-indigo-700 flex items-center gap-2 mt-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(allocation.start_date).toLocaleDateString('en-US', {month: 'short', year: '2-digit'})} - {allocation.end_date ? new Date(allocation.end_date).toLocaleDateString('en-US', {month: 'short', year: '2-digit'}) : 'Ongoing'}
                    </div>
                    <div className="text-sm text-gray-600 mt-3 bg-indigo-50 p-3 rounded-md border-l-2 border-indigo-300">
                      {allocation.project?.description || 'Project description not available'}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Badge variant="outline" className="shadow-sm border-indigo-200 bg-indigo-50 text-indigo-700">{allocation.allocation_type}</Badge>
                      <Badge variant="outline" className="shadow-sm border-purple-200 bg-purple-50 text-purple-700">{employeeData.type}</Badge>
                      <Badge variant="outline" className="shadow-sm border-green-200 bg-green-50 text-green-700">{employeeData.utilization_pct}% Utilized</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        <Card className="p-8 border-b-4 border-orange-500 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl shadow-md overflow-hidden relative">
          <div className="absolute -right-10 -top-10 w-48 h-48 opacity-10">
            <svg fill="currentColor" className="w-full h-full text-orange-600" viewBox="0 0 24 24">
              <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.47-.3 2.98-.93 4.03-1.92.28.64.41 1.36.41 2.06 0 3.37-2.09 6.12-4.03 6.12zm-.74-9.3c-.28-.37-.75-.58-1.22-.58-.47 0-.94.21-1.22.58-.25.31-.36.7-.26 1.13.08.37.32.64.55.81.36.27.78.41 1.24.36.44-.04.79-.26 1.01-.46.27-.27.37-.66.27-1.07-.08-.36-.32-.62-.37-.77z"/>
            </svg>
          </div>
          <div className="text-center space-y-5">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-orange-900">You're Currently Unassigned</h3>
              <p className="text-sm text-orange-700 mt-2 max-w-md mx-auto">
                Your skills and availability have been logged in our system. Let your manager know you're ready to take on new projects!
              </p>
            </div>
            <Button className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-md hover:shadow-lg transition-all duration-300 font-medium px-8 py-6 h-auto">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Notify Manager of Availability
            </Button>
            <div className="text-xs p-2 rounded-md">
              This notification can be sent once per month
            </div>
          </div>
        </Card>
      )}

      {/* Availability Highlights */}
      {currentAllocations.length > 0 && (
        <Card className="p-6 border-b-4 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-md overflow-hidden relative">
          <div className="absolute right-0 top-0 w-32 h-32 opacity-10">
            <svg fill="currentColor" className="w-full h-full text-green-600" viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-800">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            Availability Highlights
          </h3>
          <div className="space-y-4">
            {currentAllocations
              .filter(allocation => allocation.end_date)
              .sort((a, b) => new Date(a.end_date!).getTime() - new Date(b.end_date!).getTime())
              .slice(0, 2)
              .map(allocation => {
                const daysUntilAvailable = daysUntilEnd(allocation.end_date);
                return (
                  <div key={allocation.id} className="p-4 bg-white rounded-lg border border-green-200 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center shadow-inner">
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-green-900">
                          Available {daysUntilAvailable <= 30 ? 'soon' : 'in'} {daysUntilAvailable <= 30 ? `${daysUntilAvailable} days` : 'a few months'}
                        </div>
                        <div className="text-sm text-green-700 mt-1">
                          After completing {allocation.project?.name}
                        </div>
                        <div className={`text-xs px-3 py-1 rounded-full mt-2 inline-block shadow-sm
                          ${daysUntilAvailable <= 30 
                            ? 'bg-green-100 text-green-800 border border-green-300' 
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'}`}>
                          {daysUntilAvailable <= 30 ? 'Start exploring new opportunities!' : 'Consider upskilling for future projects'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            {currentAllocations.every(allocation => !allocation.end_date) && (
              <div className="p-4 bg-white rounded-lg border border-green-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center shadow-inner">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-emerald-900">Long-term Assignment</div>
                    <div className="text-sm text-emerald-700 mt-1">
                      You're committed to ongoing projects
                    </div>
                    <div className="text-xs px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full mt-2 inline-block shadow-sm border border-emerald-300">
                      Focus on current project deliverables
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Bench Status - Learning Suggestions */}
      {employeeData.status === 'bench' && (
        <Card className="p-6 border-b-4 border-purple-500 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl shadow-md overflow-hidden relative">
          <div className="absolute right-0 top-0 w-32 h-32 opacity-10">
            <svg fill="currentColor" className="w-full h-full text-purple-600" viewBox="0 0 24 24">
              <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-800">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 flex items-center justify-center shadow-md">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            Learning Recommendations
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg border border-purple-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex-shrink-0 flex items-center justify-center shadow-inner">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-purple-900">Expand Your Skill Set</div>
                  <div className="text-sm text-purple-700">
                    Consider learning emerging technologies to increase your project opportunities
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200 text-purple-700 shadow-sm px-3 py-0.5">AI/ML</Badge>
                    <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200 text-purple-700 shadow-sm px-3 py-0.5">Cloud Computing</Badge>
                    <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200 text-purple-700 shadow-sm px-3 py-0.5">DevOps</Badge>
                  </div>
                  <Button variant="ghost" className="text-xs text-purple-700 mt-2 hover:bg-purple-100 p-0 h-auto">
                    <span>View Learning Resources</span>
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-purple-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-100 flex-shrink-0 flex items-center justify-center shadow-inner">
                  <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-purple-900">Certifications</div>
                  <div className="text-sm text-purple-700">
                    Professional certifications can boost your profile and project assignments
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="outline" className="text-xs bg-violet-50 border-violet-200 text-violet-700 shadow-sm px-3 py-0.5">AWS Certified</Badge>
                    <Badge variant="outline" className="text-xs bg-violet-50 border-violet-200 text-violet-700 shadow-sm px-3 py-0.5">Google Cloud</Badge>
                    <Badge variant="outline" className="text-xs bg-violet-50 border-violet-200 text-violet-700 shadow-sm px-3 py-0.5">Scrum Master</Badge>
                  </div>
                  <Button variant="ghost" className="text-xs text-purple-700 mt-2 hover:bg-purple-100 p-0 h-auto">
                    <span>Browse Certification Programs</span>
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Skills Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 rounded-xl shadow-md overflow-hidden relative">
          <div className="absolute right-0 top-0 w-32 h-32 opacity-5">
            <svg fill="currentColor" className="w-full h-full text-purple-800" viewBox="0 0 24 24">
              <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-4 text-purple-800 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Your Skills
          </h3>
          <div className="mb-5">
            <div className="text-sm text-purple-700 mb-3 font-medium">Primary Skills</div>
            <div className="flex flex-wrap gap-2 mb-4">
              {employeeData.primary_skills.map((skill, index) => (
                <Badge key={index} className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 transition-colors duration-300 shadow-sm px-3 py-1 h-auto text-xs font-medium">
                  {skill}
                </Badge>
              ))}
            </div>
            
            <div className="text-sm text-purple-700 mb-3 font-medium mt-4">Secondary Skills</div>
            <div className="flex flex-wrap gap-2">
              {employeeData.secondary_skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors duration-300 shadow-sm px-3 py-1 h-auto text-xs font-medium">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-purple-100">
            <div className="text-xs text-purple-600">
              Keep your skills updated to improve project matches
            </div>
            <Button 
              variant="outline" 
              className="border-purple-200 text-purple-700 hover:bg-purple-50 shadow-sm"
              onClick={() => navigate('/profile', { 
                state: { 
                  employeeProfile: employeeData 
                } 
              })}
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Manage Skills
            </Button>
          </div>
        </Card>
      </div>

      {/* Project History */}
      <Card className="p-6 rounded-xl shadow-md overflow-hidden relative">
        <div className="absolute right-0 top-0 w-32 h-32 opacity-5">
          <svg fill="currentColor" className="w-full h-full text-blue-800" viewBox="0 0 24 24">
            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-6 text-blue-800 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Project Timeline
        </h3>
        <div className="relative">
          {projectHistory.length > 0 ? (
            <div className="space-y-6">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-indigo-500"></div>
              
              {projectHistory.map((allocation, index) => (
                <div key={allocation.id} className="relative flex items-start gap-4 transition-all duration-300 hover:translate-x-1">
                  {/* Timeline dot */}
                  <div className="relative z-10 w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md transform transition-transform duration-300 hover:scale-110">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-blue-900">{allocation.project?.name || 'Project'}</div>
                          <div className="text-sm text-blue-700 mt-1">
                            {allocation.allocation_type} • {new Date(allocation.start_date).toLocaleDateString('en-US', {month: 'short', year: '2-digit'})} - {allocation.end_date ? new Date(allocation.end_date).toLocaleDateString('en-US', {month: 'short', year: '2-digit'}) : 'Ongoing'}
                          </div>
                          {allocation.project?.description && (
                            <div className="text-sm text-gray-600 mt-2 bg-blue-50 p-2 rounded-md border-l-2 border-blue-300">
                              {allocation.project.description}
                            </div>
                          )}
                        </div>
                        <Badge variant="secondary" className="ml-4 shadow-sm">Completed</Badge>
                      </div>
                      
                      {/* Skills used (if available) */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="outline" className="text-xs shadow-sm">{employeeData.type}</Badge>
                        {index === 0 && <Badge variant="default" className="text-xs bg-gradient-to-r from-blue-500 to-indigo-500 shadow-sm">Most Recent</Badge>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-blue-50 border border-dashed border-blue-200 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="text-blue-700 font-medium">No project history yet</div>
              <div className="text-sm text-blue-600 mt-1">Your completed projects will appear here</div>
            </div>
          )}
        </div>
      </Card>

      {/* Upcoming Transitions Alert */}
      {currentAllocations.some(allocation => allocation.end_date && daysUntilEnd(allocation.end_date) <= 60) && (
        <Card className="p-6 border-b-4 border-yellow-500 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl shadow-md overflow-hidden relative">
          <div className="absolute right-0 top-0 w-32 h-32 opacity-10">
            <svg fill="currentColor" className="w-full h-full text-yellow-600" viewBox="0 0 24 24">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-yellow-800">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 flex items-center justify-center shadow-md">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            Upcoming Transitions
          </h3>
          <div className="space-y-4">
            {currentAllocations
              .filter(allocation => allocation.end_date && daysUntilEnd(allocation.end_date) <= 60)
              .map(allocation => {
                const daysRemaining = daysUntilEnd(allocation.end_date);
                const urgency = daysRemaining <= 14 ? 'high' : daysRemaining <= 30 ? 'medium' : 'low';
                
                return (
                  <div key={allocation.id} className="p-4 bg-white rounded-lg border border-yellow-200 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center shadow-inner
                        ${urgency === 'high' ? 'bg-red-100' : urgency === 'medium' ? 'bg-amber-100' : 'bg-yellow-100'}`}>
                        <svg className={`w-5 h-5 
                          ${urgency === 'high' ? 'text-red-600' : urgency === 'medium' ? 'text-amber-600' : 'text-yellow-600'}`} 
                          fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{allocation.project?.name}</div>
                        <div className={`text-sm ${urgency === 'high' ? 'text-red-600' : urgency === 'medium' ? 'text-amber-600' : 'text-yellow-600'} font-medium`}>
                          Ends in {daysUntilEnd(allocation.end_date)} days • {allocation.allocation_type}
                        </div>
                        <div className="flex items-center mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className={`h-2.5 rounded-full ${urgency === 'high' ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                              urgency === 'medium' ? 'bg-gradient-to-r from-amber-500 to-amber-600' : 
                              'bg-gradient-to-r from-yellow-400 to-yellow-500'}`}
                              style={{ width: `${100 - Math.min(100, (daysRemaining / 60) * 100)}%` }}></div>
                          </div>
                          <span className="text-xs font-medium text-gray-500 ml-2">{Math.floor((60 - daysRemaining) / 60 * 100)}%</span>
                        </div>
                        <div className={`text-xs px-3 py-1 rounded-full mt-2 inline-block shadow-sm
                          ${urgency === 'high' ? 'bg-red-100 text-red-800 border border-red-200' : 
                           urgency === 'medium' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 
                           'bg-yellow-100 text-yellow-800 border border-yellow-200'}`}>
                          {urgency === 'high' ? 'Urgent: Start preparing for transition now!' : 
                           urgency === 'medium' ? 'Important: Begin transition planning' : 
                           'Start preparing for upcoming transition'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </Card>
      )}
    </div>
  );
}
