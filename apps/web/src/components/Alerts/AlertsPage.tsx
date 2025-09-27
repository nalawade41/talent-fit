import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  User,
  FolderOpen,
  Clock,
  MoreVertical,
} from 'lucide-react';
import { mockAlerts } from '../../data/mockData';
import { Alert } from '../../types';

export function AlertsPage() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || alert.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const markAsRead = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, read: true })));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'talent-match':
        return <User className="w-5 h-5 text-green-500" />;
      case 'project-update':
        return <FolderOpen className="w-5 h-5 text-blue-500" />;
      case 'deadline':
        return <Clock className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string, read: boolean) => {
    const alpha = read ? '0.5' : '1';
    switch (priority) {
      case 'high':
        return `rgba(239, 68, 68, ${alpha})`; // red
      case 'medium':
        return `rgba(245, 158, 11, ${alpha})`; // amber
      default:
        return `rgba(34, 197, 94, ${alpha})`; // green
    }
  };

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            Alerts
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-gray-600 mt-1">
            Stay updated with talent matches, project updates, and deadlines
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Mark All Read
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="talent-match">Talent Match</option>
                <option value="project-update">Project Update</option>
                <option value="deadline">Deadline</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No alerts found</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                  !alert.read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
                onClick={() => markAsRead(alert.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getAlertIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold ${alert.read ? 'text-gray-600' : 'text-gray-900'}`}>
                          {alert.title}
                        </h3>
                        <p className={`mt-1 ${alert.read ? 'text-gray-500' : 'text-gray-700'}`}>
                          {alert.message}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3 ml-4">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getPriorityColor(alert.priority, alert.read) }}
                          title={`${alert.priority} priority`}
                        />
                        {!alert.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span className="capitalize">{alert.type.replace('-', ' ')}</span>
                      <span>•</span>
                      <span>{new Date(alert.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}