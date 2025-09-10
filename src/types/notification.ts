export enum NotificationType {
  SYSTEM = 'system',
  REMINDER = 'reminder',
  ACTIVITY = 'activity',
  SECURITY = 'security'
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived'
}

export enum DeliveryChannel {
  IN_APP = 'in_app',
  EMAIL = 'email',
  SMS = 'sms'
}

export interface NotificationAction {
  id: string;
  label: string;
  url?: string;
  action?: string;
  primary?: boolean;
}

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  title: string;
  message: string;
  summary?: string;
  userId: string;
  userRole: string;
  entityId?: string;
  moduleId?: string;
  relatedId?: string; // ID of related object (work order, service request, etc.)
  relatedType?: string; // Type of related object
  actions?: NotificationAction[];
  metadata?: Record<string, unknown>;
  deliveryChannels: DeliveryChannel[];
  createdAt: Date;
  readAt?: Date;
  archivedAt?: Date;
  expiresAt?: Date;
}

export interface NotificationPreferences {
  userId: string;
  emailEnabled: boolean;
  emailRequired?: boolean;
  smsEnabled: boolean;
  inAppEnabled: boolean;
  systemAlerts: boolean;
  reminders: boolean;
  activityUpdates: boolean;
  securityAlerts: boolean;
  frequency: 'real_time' | 'daily' | 'weekly';
  quietHours?: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}

export interface NotificationFilters {
  type?: NotificationType[];
  status?: NotificationStatus[];
  priority?: NotificationPriority[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  moduleId?: string;
  searchTerm?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<NotificationPriority, number>;
  todayCount: number;
  weekCount: number;
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  unread: number;
  hasMore: boolean;
  stats: NotificationStats;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: 'createdAt' | 'priority' | 'type';
  sortOrder?: 'asc' | 'desc';
}

// Role-based notification templates
export interface NotificationTemplate {
  id: string;
  type: NotificationType;
  title: string;
  messageTemplate: string;
  applicableRoles: string[];
  defaultChannels: DeliveryChannel[];
  priority: NotificationPriority;
  actionTemplates?: Omit<NotificationAction, 'id'>[];
}

// Notification trigger events
export enum NotificationTrigger {
  // Subscription events
  SUBSCRIPTION_PURCHASED = 'subscription_purchased',
  SUBSCRIPTION_RENEWED = 'subscription_renewed',
  SUBSCRIPTION_EXPIRED = 'subscription_expired',
  SUBSCRIPTION_EXPIRING = 'subscription_expiring',
  
  // Invoice events
  INVOICE_GENERATED = 'invoice_generated',
  PAYMENT_RECEIVED = 'payment_received',
  PAYMENT_FAILED = 'payment_failed',
  
  // Invitation events
  ORGANIZATION_INVITE = 'organization_invite',
  TEAM_INVITE = 'team_invite',
  
  // Security events
  PASSWORD_CHANGED = 'password_changed',
  LOGIN_FAILED = 'login_failed',
  TWO_FA_ENABLED = 'two_fa_enabled',
  ACCOUNT_LOCKED = 'account_locked',
  
  // Work Order events
  WORK_ORDER_CREATED = 'work_order_created',
  WORK_ORDER_UPDATED = 'work_order_updated',
  WORK_ORDER_COMPLETED = 'work_order_completed',
  MILESTONE_REACHED = 'milestone_reached',
  
  // Document events
  DOCUMENT_UPLOADED = 'document_uploaded',
  DOCUMENT_APPROVED = 'document_approved',
  DOCUMENT_REJECTED = 'document_rejected',
  
  // Team events
  ROLE_CHANGED = 'role_changed',
  PERMISSIONS_UPDATED = 'permissions_updated',
  TEAM_MEMBER_ADDED = 'team_member_added',
  TEAM_MEMBER_REMOVED = 'team_member_removed',
  
  // Module-specific events
  MEETING_SCHEDULED = 'meeting_scheduled',
  MEETING_REMINDER = 'meeting_reminder',
  CLAIM_SUBMITTED = 'claim_submitted',
  VOTING_STARTED = 'voting_started',
  RESOLUTION_UPDATED = 'resolution_updated'
}
