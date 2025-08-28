// System Settings Types and Interfaces

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamMemberRole;
  status: TeamMemberStatus;
  lastActive: Date;
  permissions: Permission[];
  avatar?: string;
  joinedAt: Date;
  createdAt?: Date;
  department?: string;
  phone?: string;
  location?: string;
  archived?: boolean;
}

export enum TeamMemberRole {
  ADMIN = 'admin',
  TEAM_LEAD = 'team_lead',
  TEAM_MEMBER = 'team_member'
}

export enum TeamMemberStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending'
}

export interface Permission {
  module: string;
  actions: string[];
  level: 'read' | 'write' | 'admin';
}

export interface ProcessTemplate {
  id: string;
  name: string;
  category: ProcessCategory;
  description: string;
  steps: ProcessStep[];
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  lastModified: Date;
  usageCount: number;
}

export enum ProcessCategory {
  ONBOARDING = 'onboarding',
  COMPLIANCE = 'compliance',
  WORKFLOW = 'workflow',
  APPROVAL = 'approval',
  DOCUMENTATION = 'documentation',
  COMMUNICATION = 'communication'
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  order: number;
  assignedRole?: TeamMemberRole;
  estimatedDuration?: number;
  dependencies?: string[];
}

export interface PaymentHistory {
  id: string;
  date: Date;
  serviceTitle: string;
  details: string;
  amount: number;
  status: PaymentStatus;
  invoiceUrl?: string;
  paymentMethod: PaymentMethodType;
  transactionId: string;
}

export enum PaymentStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum PaymentMethodType {
  CREDIT_CARD = 'credit_card',
  BANK_TRANSFER = 'bank_transfer',
  UPI = 'upi',
  WALLET = 'wallet'
}

export interface SubscriptionSettings {
  autoRenewal: boolean;
  renewalReminders: boolean;
  failedPaymentRetry: boolean;
  gracePeriod: boolean;
  paymentMethods: PaymentMethod[];
  primaryPaymentMethod: string;
  backupPaymentMethod?: string;
}

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  details: string;
  isDefault: boolean;
  expiryDate?: string;
  lastUsed?: Date;
}

export interface NotificationPreferences {
  email: {
    serviceUpdates: boolean;
    paymentReminders: boolean;
    teamActivities: boolean;
    systemAnnouncements: boolean;
    documentExpiry: boolean;
    securityAlerts: boolean;
    marketingUpdates: boolean;
  };
  sms: {
    urgentAlerts: boolean;
    twoFactorCodes: boolean;
    paymentConfirmations: boolean;
    appointmentReminders: boolean;
  };
  inApp: {
    realTimeUpdates: boolean;
    desktopNotifications: boolean;
    soundNotifications: boolean;
    frequency: 'instant' | 'daily' | 'weekly';
    quietHours: {
      enabled: boolean;
      startTime: string;
      endTime: string;
    };
  };
}

export interface ProfileData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth?: string;
    gender?: string;
    avatar?: string;
  };
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  verification: {
    emailVerified: boolean;
    phoneVerified: boolean;
    identityDocuments: 'verified' | 'pending' | 'not_submitted';
    addressVerification: 'verified' | 'pending' | 'not_submitted';
  };
  preferences: {
    categories: string[];
    locationPreference: string[];
    communicationMethods: string[];
    language: string;
    timezone: string;
  };
}

export interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  primaryMethod: 'sms' | 'email';
  backupMethod?: 'sms' | 'email';
  backupCodes: string[];
  recentActivity: SecurityActivity[];
}

export interface SecurityActivity {
  id: string;
  action: string;
  timestamp: Date;
  location?: string;
  device?: string;
  status: 'success' | 'failed' | 'warning';
}

export interface SystemSettingsStats {
  profileCompletion: number;
  teamMembers: {
    total: number;
    active: number;
  };
  processTemplates: {
    total: number;
    active: number;
  };
  serviceRequests: number;
  notifications: {
    total: number;
    unread: number;
  };
}

export interface SystemSettingsFilters {
  searchTerm?: string;
  role?: TeamMemberRole;
  status?: TeamMemberStatus;
  category?: ProcessCategory;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface SystemSettingsResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
