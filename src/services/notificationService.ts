import {
  Notification,
  NotificationType,
  NotificationPriority,
  NotificationStatus,
  DeliveryChannel,
  NotificationFilters,
  NotificationPreferences,
  NotificationStats,
  NotificationAction,
  NotificationTemplate,
  PaginationOptions,
  NotificationResponse
} from '@/types/notification';
import { getRoleSpecificNotifications } from './notificationData';

// Mock notification templates for different user roles
const notificationTemplates: NotificationTemplate[] = [
  {
    id: 'subscription_expiring',
    type: NotificationType.REMINDER,
    title: 'Subscription Expiring Soon',
    messageTemplate: 'Your {moduleName} subscription expires in {days} days. Renew now to continue access.',
    applicableRoles: ['SERVICE_SEEKER_INDIVIDUAL', 'SERVICE_PROVIDER_INDIVIDUAL'],
    defaultChannels: [DeliveryChannel.IN_APP, DeliveryChannel.EMAIL],
    priority: NotificationPriority.HIGH,
    actionTemplates: [
      { label: 'Renew Now', url: '/subscription', primary: true },
      { label: 'View Details', url: '/subscription/details' }
    ]
  },
  {
    id: 'work_order_created',
    type: NotificationType.ACTIVITY,
    title: 'New Work Order Created',
    messageTemplate: 'Work Order #{workOrderId} has been created for {clientName}.',
    applicableRoles: ['SERVICE_PROVIDER_INDIVIDUAL', 'SERVICE_PROVIDER_ENTITY_ADMIN'],
    defaultChannels: [DeliveryChannel.IN_APP, DeliveryChannel.EMAIL],
    priority: NotificationPriority.MEDIUM,
    actionTemplates: [
      { label: 'View Work Order', url: '/work-orders/{workOrderId}', primary: true }
    ]
  },
  {
    id: 'team_member_added',
    type: NotificationType.ACTIVITY,
    title: 'New Team Member Added',
    messageTemplate: '{memberName} has been added to your team with {role} role.',
    applicableRoles: ['SERVICE_SEEKER_ENTITY_ADMIN', 'SERVICE_PROVIDER_ENTITY_ADMIN'],
    defaultChannels: [DeliveryChannel.IN_APP, DeliveryChannel.EMAIL],
    priority: NotificationPriority.MEDIUM
  },
  {
    id: 'security_alert',
    type: NotificationType.SECURITY,
    title: 'Security Alert',
    messageTemplate: 'Failed login attempt detected from {location} at {time}.',
    applicableRoles: ['*'],
    defaultChannels: [DeliveryChannel.IN_APP, DeliveryChannel.EMAIL, DeliveryChannel.SMS],
    priority: NotificationPriority.URGENT
  }
];

// Role-specific realistic notification data
function generateRoleSpecificNotifications(userRole: string): Notification[] {
  return getRoleSpecificNotifications(userRole);
}

// Mock notifications data - Updated to use role-specific data
const generateMockNotifications = (userRole: string, count: number = 50): Notification[] => {
  return generateRoleSpecificNotifications(userRole);
};

class NotificationService {
  private notifications: Map<string, Notification[]> = new Map();
  private preferences: Map<string, NotificationPreferences> = new Map();

  // Helper function to normalize user role for notification data lookup
  private normalizeRole(userRole: string): string {
    return userRole.toUpperCase().replace('_PARTNER', '');
  }

  constructor() {
    // Initialize with mock data for different user roles
    const roles = [
      'SERVICE_SEEKER_INDIVIDUAL',
      'SERVICE_SEEKER_ENTITY_ADMIN',
      'SERVICE_SEEKER_TEAM_MEMBER',
      'SERVICE_PROVIDER_INDIVIDUAL',
      'SERVICE_PROVIDER_ENTITY_ADMIN',
      'SERVICE_PROVIDER_TEAM_MEMBER'
    ];

    roles.forEach(role => {
      this.notifications.set(role, generateMockNotifications(role));
    });
  }

  // Get notifications with filtering and pagination
  async getNotifications(
    userRole: string,
    filters?: NotificationFilters,
    pagination?: PaginationOptions
  ): Promise<NotificationResponse> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

    // Map the user role to the correct format for notification data
    const normalizedRole = this.normalizeRole(userRole);
    let notifications = this.notifications.get(normalizedRole) || [];

    // Apply filters
    if (filters) {
      if (filters.type?.length) {
        notifications = notifications.filter(n => filters.type!.includes(n.type));
      }
      if (filters.status?.length) {
        notifications = notifications.filter(n => filters.status!.includes(n.status));
      }
      if (filters.priority?.length) {
        notifications = notifications.filter(n => filters.priority!.includes(n.priority));
      }
      if (filters.dateRange) {
        notifications = notifications.filter(n => 
          n.createdAt >= filters.dateRange!.from && n.createdAt <= filters.dateRange!.to
        );
      }
      if (filters.moduleId) {
        notifications = notifications.filter(n => n.moduleId === filters.moduleId);
      }
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        notifications = notifications.filter(n => 
          n.title.toLowerCase().includes(term) || 
          n.message.toLowerCase().includes(term)
        );
      }
    }

    // Calculate stats
    const stats: NotificationStats = {
      total: notifications.length,
      unread: notifications.filter(n => n.status === NotificationStatus.UNREAD).length,
      byType: {
        [NotificationType.SYSTEM]: notifications.filter(n => n.type === NotificationType.SYSTEM).length,
        [NotificationType.REMINDER]: notifications.filter(n => n.type === NotificationType.REMINDER).length,
        [NotificationType.ACTIVITY]: notifications.filter(n => n.type === NotificationType.ACTIVITY).length,
        [NotificationType.SECURITY]: notifications.filter(n => n.type === NotificationType.SECURITY).length,
      },
      byPriority: {
        [NotificationPriority.LOW]: notifications.filter(n => n.priority === NotificationPriority.LOW).length,
        [NotificationPriority.MEDIUM]: notifications.filter(n => n.priority === NotificationPriority.MEDIUM).length,
        [NotificationPriority.HIGH]: notifications.filter(n => n.priority === NotificationPriority.HIGH).length,
        [NotificationPriority.URGENT]: notifications.filter(n => n.priority === NotificationPriority.URGENT).length,
      },
      todayCount: notifications.filter(n => {
        const today = new Date();
        return n.createdAt.toDateString() === today.toDateString();
      }).length,
      weekCount: notifications.filter(n => {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return n.createdAt >= weekAgo;
      }).length
    };

    // Apply pagination
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedNotifications = notifications.slice(startIndex, endIndex);

    return {
      notifications: paginatedNotifications,
      total: notifications.length,
      unread: stats.unread,
      hasMore: endIndex < notifications.length,
      stats
    };
  }

  // Get notification by ID
  async getNotificationById(notificationId: string, userRole: string): Promise<Notification | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const normalizedRole = this.normalizeRole(userRole);
    const notifications = this.notifications.get(normalizedRole) || [];
    return notifications.find(n => n.id === notificationId) || null;
  }

  // Mark notification as read
  async markAsRead(notificationId: string, userRole: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const normalizedRole = this.normalizeRole(userRole);
    const notifications = this.notifications.get(normalizedRole) || [];
    const notification = notifications.find(n => n.id === notificationId);
    
    if (notification && notification.status === NotificationStatus.UNREAD) {
      notification.status = NotificationStatus.READ;
      notification.readAt = new Date();
      return true;
    }
    return false;
  }

  // Mark notification as unread
  async markAsUnread(notificationId: string, userRole: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const normalizedRole = this.normalizeRole(userRole);
    const notifications = this.notifications.get(normalizedRole) || [];
    const notification = notifications.find(n => n.id === notificationId);
    
    if (notification && notification.status === NotificationStatus.READ) {
      notification.status = NotificationStatus.UNREAD;
      notification.readAt = undefined;
      return true;
    }
    return false;
  }

  // Archive notification
  async archiveNotification(notificationId: string, userRole: string): Promise<boolean> {
    const normalizedRole = this.normalizeRole(userRole);
    const notifications = this.notifications.get(normalizedRole) || [];
    const notification = notifications.find(n => n.id === notificationId);
    
    if (notification) {
      notification.status = NotificationStatus.ARCHIVED;
      notification.archivedAt = new Date();
      return true;
    }
    return false;
  }

  // Delete notification
  async deleteNotification(notificationId: string, userRole: string): Promise<boolean> {
    const normalizedRole = this.normalizeRole(userRole);
    const notifications = this.notifications.get(normalizedRole) || [];
    const index = notifications.findIndex(n => n.id === notificationId);
    
    if (index !== -1) {
      notifications.splice(index, 1);
      return true;
    }
    return false;
  }

  // Mark all as read
  async markAllAsRead(userRole: string): Promise<number> {
    const normalizedRole = this.normalizeRole(userRole);
    const notifications = this.notifications.get(normalizedRole) || [];
    let count = 0;
    
    notifications.forEach(notification => {
      if (notification.status === NotificationStatus.UNREAD) {
        notification.status = NotificationStatus.READ;
        notification.readAt = new Date();
        count++;
      }
    });
    
    return count;
  }

  // Get notification preferences
  async getPreferences(userId: string): Promise<NotificationPreferences> {
    const existing = this.preferences.get(userId);
    if (existing) return existing;

    // Default preferences
    const defaultPreferences: NotificationPreferences = {
      userId,
      emailEnabled: true,
      emailRequired: false,
      smsEnabled: false,
      inAppEnabled: true,
      systemAlerts: true,
      reminders: true,
      activityUpdates: true,
      securityAlerts: true,
      frequency: 'real_time',
      quietHours: {
        enabled: false,
        startTime: '22:00',
        endTime: '08:00'
      }
    };

    this.preferences.set(userId, defaultPreferences);
    return defaultPreferences;
  }

  // Update notification preferences
  async updatePreferences(userId: string, preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    const current = await this.getPreferences(userId);
    const updated = { ...current, ...preferences };
    this.preferences.set(userId, updated);
    return updated;
  }

  // Get unread count for header badge
  async getUnreadCount(userRole: string): Promise<number> {
    const normalizedRole = this.normalizeRole(userRole);
    const notifications = this.notifications.get(normalizedRole) || [];
    return notifications.filter(n => n.status === NotificationStatus.UNREAD).length;
  }

  // Create new notification (for testing/demo)
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: new Date()
    };

    const notifications = this.notifications.get(notification.userRole) || [];
    notifications.unshift(newNotification);
    this.notifications.set(notification.userRole, notifications);

    return newNotification;
  }
}

export const notificationService = new NotificationService();
