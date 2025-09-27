// Notifications dummy data
export interface Notification {
  id: number;
  type: 'Roll-off Alert' | 'Project Gap' | 'Allocation Suggestion' | 'System Update' | 'New Match';
  message: string;
  user_id: number;
  created_at: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  action_url?: string;
  metadata?: {
    employee_id?: number;
    project_id?: number;
    match_id?: number;
  };
}

export const notificationsData: Notification[] = [
  {
    id: 1,
    type: 'Roll-off Alert',
    message: 'Jane Smith will be rolling off FinanceCorpABC project in 45 days. Consider finding replacement.',
    user_id: 100, // Manager user
    created_at: "2023-11-20T09:00:00Z",
    read: false,
    priority: 'high',
    action_url: '/employees/2',
    metadata: {
      employee_id: 2,
      project_id: 789
    }
  },
  {
    id: 2,
    type: 'New Match',
    message: 'Found a 92% match between John Doe and Talent Matching Platform project.',
    user_id: 100,
    created_at: "2023-11-20T10:00:00Z",
    read: false,
    priority: 'medium',
    action_url: '/matches/1',
    metadata: {
      employee_id: 1,
      project_id: 456,
      match_id: 1
    }
  },
  {
    id: 3,
    type: 'Project Gap',
    message: 'Healthcare AI Analytics project still needs 1 AI engineer. Start date approaching.',
    user_id: 100,
    created_at: "2023-11-21T08:00:00Z",
    read: false,
    priority: 'high',
    action_url: '/projects/1002',
    metadata: {
      project_id: 1002
    }
  },
  {
    id: 4,
    type: 'Allocation Suggestion',
    message: 'Lisa Anderson (Backend Dev) is available and perfect match for Legacy Migration project.',
    user_id: 100,
    created_at: "2023-11-21T14:00:00Z",
    read: true,
    priority: 'medium',
    action_url: '/projects/789/allocate',
    metadata: {
      employee_id: 6,
      project_id: 789
    }
  },
  {
    id: 5,
    type: 'System Update',
    message: 'Employee profiles updated. New matching algorithm deployed.',
    user_id: 100,
    created_at: "2023-11-19T16:00:00Z",
    read: true,
    priority: 'low'
  },
  {
    id: 6,
    type: 'Roll-off Alert',
    message: 'Mike Wilson (UI Designer) ending current project on Dec 31, 2024.',
    user_id: 100,
    created_at: "2023-11-20T11:30:00Z",
    read: false,
    priority: 'medium',
    action_url: '/employees/5',
    metadata: {
      employee_id: 5
    }
  },
  {
    id: 7,
    type: 'New Match',
    message: 'Sarah Chen is a 96% match for Healthcare AI Analytics project.',
    user_id: 100,
    created_at: "2023-11-19T10:00:00Z",
    read: true,
    priority: 'high',
    action_url: '/matches/3',
    metadata: {
      employee_id: 4,
      project_id: 1002,
      match_id: 3
    }
  },
  // Employee-specific notifications
  {
    id: 8,
    type: 'System Update',
    message: 'Please update your skills profile to improve project matching.',
    user_id: 1, // John Doe
    created_at: "2023-11-18T14:00:00Z",
    read: false,
    priority: 'low',
    action_url: '/profile/edit'
  },
  {
    id: 9,
    type: 'Project Gap',
    message: 'Your current project ends in 3 months. We\'re working on finding your next assignment.',
    user_id: 2, // Jane Smith
    created_at: "2023-11-20T09:00:00Z",
    read: false,
    priority: 'medium'
  },
  {
    id: 10,
    type: 'Allocation Suggestion',
    message: 'You\'ve been suggested for a new fintech project starting January 2024.',
    user_id: 1, // John Doe
    created_at: "2023-11-21T16:00:00Z",
    read: false,
    priority: 'high',
    action_url: '/projects/1003'
  }
];

// Helper functions for notifications
export const getUnreadNotifications = (userId?: number) => {
  if (userId) {
    return notificationsData.filter(notif => notif.user_id === userId && !notif.read);
  }
  return notificationsData.filter(notif => !notif.read);
};

export const getNotificationsByUser = (userId: number) =>
  notificationsData.filter(notif => notif.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

export const getNotificationsByPriority = (priority: 'low' | 'medium' | 'high') =>
  notificationsData.filter(notif => notif.priority === priority);

export const getHighPriorityNotifications = (userId?: number) => {
  const highPriorityNotifs = notificationsData.filter(notif => notif.priority === 'high');
  if (userId) {
    return highPriorityNotifs.filter(notif => notif.user_id === userId);
  }
  return highPriorityNotifs;
};

export const getNotificationsByType = (type: Notification['type'], userId?: number) => {
  const typeFiltered = notificationsData.filter(notif => notif.type === type);
  if (userId) {
    return typeFiltered.filter(notif => notif.user_id === userId);
  }
  return typeFiltered;
};

export const markNotificationAsRead = (notificationId: number) => {
  const notification = notificationsData.find(notif => notif.id === notificationId);
  if (notification) {
    notification.read = true;
  }
};

export const markAllNotificationsAsRead = (userId: number) => {
  notificationsData
    .filter(notif => notif.user_id === userId)
    .forEach(notif => notif.read = true);
};
