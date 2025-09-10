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
  subModule?: string; // optional sub-module under a module
  entityId?: string; // optional entity scope for this permission
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
  serviceDetails: {
    moduleName?: string;
    storagePurchasedGB?: number;
    teamMembersAdded?: number;
  };
  amount: number;
  status: PaymentStatus;
  invoiceUrl?: string;
  paymentMethod: PaymentMethodType;
  transactionId: string;
  paidDate?: Date;
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
  renewalAttempts: {
    firstAttempt: number; // days before expiration
    secondAttempt: number; // hours after first failure
    finalNotice: number; // days before manual renewal required
  };
  billingCycle: 'monthly' | 'quarterly' | 'annual';
  nextRenewalDate?: Date;
  lastRenewalDate?: Date;
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
    workOrderUpdates: boolean;
    bidNotifications: boolean;
    complianceReminders: boolean;
    meetingReminders: boolean;
  };
  sms: {
    urgentAlerts: boolean;
    twoFactorCodes: boolean;
    paymentConfirmations: boolean;
    appointmentReminders: boolean;
    criticalDeadlines: boolean;
    securityAlerts: boolean;
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
  // Role-specific notification preferences
  roleSpecific: {
    adminNotifications?: boolean;
    teamMemberUpdates?: boolean;
    clientCommunications?: boolean;
    providerOpportunities?: boolean;
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
  passwordPolicy: {
    lastChanged: Date;
    mustChangeBy?: Date;
    changeReason?: 'user_initiated' | 'mandatory_quarterly' | 'security_breach' | 'account_recovery' | 'contact_updated';
    failedAttempts: number;
    lockedUntil?: Date;
    previousPasswords: string[]; // hashed
  };
  sessionManagement: {
    maxActiveSessions: number;
    currentSessions: number;
    terminateOtherSessions: boolean;
  };
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
    limit: number; // based on subscription
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
  documentCycles: {
    active: number;
    total: number;
  };
  autoMailCycles: {
    active: number;
    scheduled: number;
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

// Document Cycle Management
export interface DocumentCycle {
  id: string;
  name: string;
  description: string;
  stages: DocumentStage[];
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  lastModified: Date;
  applicableRoles: TeamMemberRole[];
}

export interface DocumentStage {
  id: string;
  name: string;
  description: string;
  order: number;
  requiredDocuments: string[];
  approvalRequired: boolean;
  assignedRole?: TeamMemberRole;
  timeLimit?: number; // in days
  notifications: {
    reminder: number; // days before deadline
    escalation: number; // days after deadline
  };
}

// Auto-Mail Cycle Management
export interface AutoMailCycle {
  id: string;
  name: string;
  description: string;
  triggers: MailTrigger[];
  template: MailTemplate;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  lastModified: Date;
  applicableRoles: TeamMemberRole[];
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    time: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
  };
}

export interface MailTrigger {
  id: string;
  event: string;
  condition?: string;
  delay?: number; // in hours
}

export interface MailTemplate {
  id: string;
  subject: string;
  body: string;
  variables: string[];
  attachments?: string[];
}

// Role-based access control
export interface RolePermissions {
  role: string;
  permissions: {
    teamManagement: boolean;
    processManagement: boolean;
    documentCycle: boolean;
    autoMailCycle: boolean;
    subscriptionSettings: boolean;
    paymentHistory: boolean;
    profileManagement: boolean;
    passwordUpdate: boolean;
    notificationManagement: boolean;
  };
}

// Team member limits based on subscription
export interface SubscriptionLimits {
  teamMemberLimit: number;
  storageLimit: number; // in GB
  processTemplateLimit: number;
  documentCycleLimit: number;
  autoMailCycleLimit: number;
}

// Access control configuration exposed to UI for building permissions
export interface ModuleDefinition {
  id: string; // e.g., 'claims'
  name: string; // e.g., 'Claims'
  subModules?: string[]; // e.g., ['Create', 'Review']
  actions: string[]; // allowed actions e.g., ['read','write','admin']
}

export interface EntitySummary {
  id: string;
  name: string;
  subscribedModules: string[]; // module ids
}

export interface AvailableAccessOptions {
  modules: ModuleDefinition[];
  entities: EntitySummary[];
  subscription: {
    currentActiveMembers: number;
    memberLimit: number;
    upgradeLink?: string;
  };
}

export interface CreateTeamMemberInput {
  name: string;
  email: string;
  mobile: string;
  role: TeamMemberRole;
  permissions: Permission[];
  inviteExisting?: boolean; // if true, treat as invite to existing user
}
