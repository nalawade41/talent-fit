import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { AlertTriangle, Info, CheckCircle, Filter, CheckCheck } from 'lucide-react';

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success';
  message: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: Date;
  read: boolean;
}

// Mock notifications data - expanded for the full page
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'warning',
    message: 'Sarah Johnson rolling off Project Alpha in 2 weeks',
    priority: 'high',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false
  },
  {
    id: '2',
    type: 'info',
    message: 'Project Beta needs 2 React developers starting next month',
    priority: 'medium',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false
  },
  {
    id: '3',
    type: 'success',
    message: 'New AI match suggestions available for Project Gamma',
    priority: 'low',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    read: true
  },
  {
    id: '4',
    type: 'warning',
    message: 'Mike Chen\'s contract ends in 3 weeks',
    priority: 'high',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    read: false
  },
  {
    id: '5',
    type: 'info',
    message: 'Project Delta requires Python expertise - 3 seats available',
    priority: 'medium',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    read: false
  },
  {
    id: '6',
    type: 'warning',
    message: 'Lisa Wong has submitted notice - effective in 4 weeks',
    priority: 'high',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    read: false
  },
  {
    id: '7',
    type: 'info',
    message: 'Project Epsilon budget approved - ready for resource allocation',
    priority: 'medium',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18), // 18 hours ago
    read: true
  },
  {
    id: '8',
    type: 'success',
    message: 'Successfully allocated 3 developers to Project Zeta',
    priority: 'low',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true
  },
  {
    id: '9',
    type: 'warning',
    message: 'Project Theta is 80% over budget - review required',
    priority: 'high',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
    read: false
  },
  {
    id: '10',
    type: 'info',
    message: 'New skill assessment results available for 5 team members',
    priority: 'medium',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    read: true
  }
];

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'high' | 'medium' | 'low'>('all');

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'high':
        return notification.priority === 'high';
      case 'medium':
        return notification.priority === 'medium';
      case 'low':
        return notification.priority === 'low';
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) { // 24 hours
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInMinutes / 1440);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with important alerts and updates
            {unreadCount > 0 && (
              <span className="ml-2 text-orange-600 font-medium">
                ({unreadCount} unread)
              </span>
            )}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({notifications.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </Button>
            <Button
              variant={filter === 'high' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('high')}
            >
              High Priority ({notifications.filter(n => n.priority === 'high').length})
            </Button>
            <Button
              variant={filter === 'medium' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('medium')}
            >
              Medium Priority ({notifications.filter(n => n.priority === 'medium').length})
            </Button>
            <Button
              variant={filter === 'low' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('low')}
            >
              Low Priority ({notifications.filter(n => n.priority === 'low').length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <AlertTriangle className="w-12 h-12 mx-auto opacity-50" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-500">
                {filter === 'unread'
                  ? 'All caught up! No unread notifications.'
                  : `No ${filter} priority notifications at this time.`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                !notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-gray-900 leading-relaxed mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>{formatTimeAgo(notification.timestamp)}</span>
                          <Badge
                            variant={
                              notification.priority === 'high' ? 'destructive' :
                              notification.priority === 'medium' ? 'default' :
                              'secondary'
                            }
                          >
                            {notification.priority} priority
                          </Badge>
                          {!notification.read && (
                            <Badge variant="outline" className="text-blue-600 border-blue-600">
                              Unread
                            </Badge>
                          )}
                        </div>
                      </div>

                      {!notification.read && (
                        <div className="flex-shrink-0">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
