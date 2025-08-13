// User Role Types and Authentication System

export enum UserRole {
  // Service Seeker Roles (3)
  SERVICE_SEEKER_INDIVIDUAL_PARTNER = 'service_seeker_individual_partner',
  SERVICE_SEEKER_ENTITY_ADMIN = 'service_seeker_entity_admin',
  SERVICE_SEEKER_TEAM_MEMBER = 'service_seeker_team_member',
  
  // Service Provider Roles (3)
  SERVICE_PROVIDER_INDIVIDUAL_PARTNER = 'service_provider_individual_partner',
  SERVICE_PROVIDER_ENTITY_ADMIN = 'service_provider_entity_admin',
  SERVICE_PROVIDER_TEAM_MEMBER = 'service_provider_team_member'
}

export enum UserType {
  GUEST = 'guest',
  SERVICE_SEEKER = 'service_seeker',
  SERVICE_PROVIDER = 'service_provider',
  INVITED = 'invited'
}

export enum EntityType {
  INDIVIDUAL = 'individual',
  ORGANIZATION = 'organization',
  ENTITY = 'entity'
}

export enum AccessLevel {
  PUBLIC = 'public',
  AUTHENTICATED = 'authenticated',
  ADMIN = 'admin',
  TEAM_MEMBER = 'team_member',
  PARTNER = 'partner'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  userType: UserType;
  entityType?: EntityType;
  organizationId?: string;
  permissions: Permission[];
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  lastLogin?: Date;
  invitedBy?: string;
  invitationToken?: string;
}

export interface Permission {
  module: string;
  actions: string[];
  level: AccessLevel;
}

export interface Organization {
  id: string;
  name: string;
  type: EntityType;
  adminUserId: string;
  members: OrganizationMember[];
  subscriptions: Subscription[];
  isActive: boolean;
  createdAt: Date;
}

export interface OrganizationMember {
  userId: string;
  role: UserRole;
  permissions: Permission[];
  addedBy: string;
  addedAt: Date;
  isActive: boolean;
}

export interface Subscription {
  id: string;
  moduleId: string;
  moduleName: string;
  isActive: boolean;
  startDate: Date;
  endDate?: Date;
  features: string[];
}

export interface AuthState {
  user: User | null;
  organization: Organization | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: Permission[];
}

export interface LoginCredentials {
  email: string;
  password: string;
  userRole: UserRole;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  userType: UserType;
  entityType?: EntityType;
  organizationName?: string;
  mobileNumber: string;
  acceptTerms: boolean;
  invitationToken?: string;
  alternativeEmail?: string;
  alternativeMobile?: string;
}

export interface OTPVerificationData {
  email: string;
  emailOTP: string;
  mobileNumber: string;
  mobileOTP: string;
  registrationId: string;
}

export interface RegistrationStep {
  step: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}

export interface UniqueIDComponents {
  entityType: string; // Individual/Entity
  partnerID: string;
  serviceType: string;
  registrationDate: string;
  subscriptionPlanCode: string;
}

export interface InvitationData {
  email: string;
  role: UserRole;
  permissions: Permission[];
  invitedBy: string;
  organizationId?: string;
  moduleContext?: string;
  expiresAt: Date;
}

// Role-based access control helpers
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  // Service Seeker Individual/Partner
  [UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER]: [
    { module: 'dashboard', actions: ['view'], level: AccessLevel.AUTHENTICATED },
    { module: 'services', actions: ['view', 'request'], level: AccessLevel.AUTHENTICATED },
    { module: 'meetings', actions: ['view', 'create', 'join'], level: AccessLevel.AUTHENTICATED },
    { module: 'claims', actions: ['view', 'create', 'submit'], level: AccessLevel.AUTHENTICATED },
    { module: 'voting', actions: ['view', 'participate'], level: AccessLevel.AUTHENTICATED },
    { module: 'billing', actions: ['view'], level: AccessLevel.AUTHENTICATED }
  ],
  
  // Service Seeker Entity/Organization Admin
  [UserRole.SERVICE_SEEKER_ENTITY_ADMIN]: [
    { module: 'dashboard', actions: ['view', 'manage'], level: AccessLevel.ADMIN },
    { module: 'organization', actions: ['view', 'create', 'edit', 'delete'], level: AccessLevel.ADMIN },
    { module: 'users', actions: ['view', 'create', 'edit', 'delete', 'invite'], level: AccessLevel.ADMIN },
    { module: 'services', actions: ['view', 'request', 'manage'], level: AccessLevel.ADMIN },
    { module: 'meetings', actions: ['view', 'create', 'edit', 'delete', 'join'], level: AccessLevel.ADMIN },
    { module: 'claims', actions: ['view', 'create', 'edit', 'delete', 'submit'], level: AccessLevel.ADMIN },
    { module: 'voting', actions: ['view', 'create', 'edit', 'delete', 'participate'], level: AccessLevel.ADMIN },
    { module: 'reports', actions: ['view', 'generate'], level: AccessLevel.ADMIN },
    { module: 'billing', actions: ['view', 'manage'], level: AccessLevel.ADMIN }
  ],
  
  // Service Seeker Team Member
  [UserRole.SERVICE_SEEKER_TEAM_MEMBER]: [
    { module: 'dashboard', actions: ['view'], level: AccessLevel.TEAM_MEMBER },
    { module: 'services', actions: ['view'], level: AccessLevel.TEAM_MEMBER },
    { module: 'meetings', actions: ['view', 'join'], level: AccessLevel.TEAM_MEMBER },
    { module: 'claims', actions: ['view'], level: AccessLevel.TEAM_MEMBER },
    { module: 'tasks', actions: ['view', 'update'], level: AccessLevel.TEAM_MEMBER }
  ],
  
  // Service Provider Individual/Partner
  [UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER]: [
    { module: 'dashboard', actions: ['view'], level: AccessLevel.AUTHENTICATED },
    { module: 'services', actions: ['view', 'offer', 'manage'], level: AccessLevel.AUTHENTICATED },
    { module: 'meetings', actions: ['view', 'create', 'join'], level: AccessLevel.AUTHENTICATED },
    { module: 'clients', actions: ['view', 'manage'], level: AccessLevel.AUTHENTICATED },
    { module: 'billing', actions: ['view', 'create'], level: AccessLevel.AUTHENTICATED },
    { module: 'opportunities', actions: ['view', 'bid'], level: AccessLevel.AUTHENTICATED }
  ],
  
  // Service Provider Entity/Organization Admin
  [UserRole.SERVICE_PROVIDER_ENTITY_ADMIN]: [
    { module: 'dashboard', actions: ['view', 'manage'], level: AccessLevel.ADMIN },
    { module: 'organization', actions: ['view', 'create', 'edit', 'delete'], level: AccessLevel.ADMIN },
    { module: 'users', actions: ['view', 'create', 'edit', 'delete', 'invite'], level: AccessLevel.ADMIN },
    { module: 'services', actions: ['view', 'offer', 'manage'], level: AccessLevel.ADMIN },
    { module: 'meetings', actions: ['view', 'create', 'edit', 'delete', 'join'], level: AccessLevel.ADMIN },
    { module: 'clients', actions: ['view', 'create', 'edit', 'delete', 'manage'], level: AccessLevel.ADMIN },
    { module: 'billing', actions: ['view', 'create', 'edit', 'manage'], level: AccessLevel.ADMIN },
    { module: 'reports', actions: ['view', 'generate'], level: AccessLevel.ADMIN },
    { module: 'opportunities', actions: ['view', 'bid', 'manage'], level: AccessLevel.ADMIN }
  ],
  
  // Service Provider Team Member
  [UserRole.SERVICE_PROVIDER_TEAM_MEMBER]: [
    { module: 'dashboard', actions: ['view'], level: AccessLevel.TEAM_MEMBER },
    { module: 'services', actions: ['view'], level: AccessLevel.TEAM_MEMBER },
    { module: 'meetings', actions: ['view', 'join'], level: AccessLevel.TEAM_MEMBER },
    { module: 'clients', actions: ['view'], level: AccessLevel.TEAM_MEMBER },
    { module: 'tasks', actions: ['view', 'update'], level: AccessLevel.TEAM_MEMBER }
  ]
};

// Role display names for UI
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  [UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER]: 'Service Seeker - Individual/Partner',
  [UserRole.SERVICE_SEEKER_ENTITY_ADMIN]: 'Service Seeker - Entity/Organization Admin',
  [UserRole.SERVICE_SEEKER_TEAM_MEMBER]: 'Service Seeker - Team Member',
  [UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER]: 'Service Provider - Individual/Partner',
  [UserRole.SERVICE_PROVIDER_ENTITY_ADMIN]: 'Service Provider - Entity/Organization Admin',
  [UserRole.SERVICE_PROVIDER_TEAM_MEMBER]: 'Service Provider - Team Member'
};

// Comprehensive registration options
export const DETAILED_REGISTRATION_OPTIONS = [
  // Service Seeker Options
  {
    id: 'service-seeker-individual-partner',
    label: 'Individual/Partner seeking services',
    role: UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER,
    userType: UserType.SERVICE_SEEKER,
    category: 'Service Seeker',
    description: 'Register as an individual or partner seeking professional services',
    requiresOrganization: false
  },
  {
    id: 'service-seeker-entity-admin',
    label: 'Entity/Organization Admin seeking services',
    role: UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
    userType: UserType.SERVICE_SEEKER,
    category: 'Service Seeker',
    description: 'Register as an organization/entity admin seeking professional services',
    requiresOrganization: true
  },
  {
    id: 'service-seeker-team-member',
    label: 'Team Member seeking services',
    role: UserRole.SERVICE_SEEKER_TEAM_MEMBER,
    userType: UserType.SERVICE_SEEKER,
    category: 'Service Seeker',
    description: 'Join as a team member of a service seeking organization',
    requiresOrganization: false
  },
  
  // Service Provider Options
  {
    id: 'service-provider-individual-partner',
    label: 'Individual/Partner providing services',
    role: UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER,
    userType: UserType.SERVICE_PROVIDER,
    category: 'Service Provider',
    description: 'Register as an individual or partner providing professional services',
    requiresOrganization: false
  },
  {
    id: 'service-provider-entity-admin',
    label: 'Entity/Organization Admin providing services',
    role: UserRole.SERVICE_PROVIDER_ENTITY_ADMIN,
    userType: UserType.SERVICE_PROVIDER,
    category: 'Service Provider',
    description: 'Register as an organization/entity admin providing professional services',
    requiresOrganization: true
  },
  {
    id: 'service-provider-team-member',
    label: 'Team Member providing services',
    role: UserRole.SERVICE_PROVIDER_TEAM_MEMBER,
    userType: UserType.SERVICE_PROVIDER,
    category: 'Service Provider',
    description: 'Join as a team member of a service providing organization',
    requiresOrganization: false
  },
  {
    id: 'ancillary-service-provider',
    label: 'ancillary service providers.',
    role: 'ANCILLARY_SERVICE_PROVIDER',
    userType: 'ANCILLARY_SERVICE_PROVIDER',
    category: 'Service Provider',
    description: 'Join as a team member of a service providing organization',
    requiresOrganization: false
  }
];

// Simplified registration options for homepage (backward compatibility)
export const REGISTRATION_OPTIONS = [
  {
    id: 'service-seeker-individual-partner',
    label: 'I am a Service Seeker Individual/Partner',
    role: UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER,
    userType: UserType.SERVICE_SEEKER,
    description: 'Register as an individual or partner seeking professional services'
  },
  {
    id: 'service-seeker-entity-admin',
    label: 'I am a Service Seeker Entity/Organization Admin',
    role: UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
    userType: UserType.SERVICE_SEEKER,
    description: 'Register as an organization/entity admin seeking professional services'
  },
  {
    id: 'service-seeker-team-member',
    label: 'I am a Service Seeker Team Member',
    role: UserRole.SERVICE_SEEKER_TEAM_MEMBER,
    userType: UserType.SERVICE_SEEKER,
    description: 'Join as a team member of a service seeking organization'
  },
  {
    id: 'service-provider-individual-partner',
    label: 'I am a Service Provider Individual/Partner',
    role: UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER,
    userType: UserType.SERVICE_PROVIDER,
    description: 'Register as an individual or partner providing professional services'
  },
  {
    id: 'service-provider-entity-admin',
    label: 'I am a Service Provider Entity/Organization Admin',
    role: UserRole.SERVICE_PROVIDER_ENTITY_ADMIN,
    userType: UserType.SERVICE_PROVIDER,
    description: 'Register as an organization/entity admin providing professional services'
  },
  {
    id: 'service-provider-team-member',
    label: 'I am a Service Provider Team Member',
    role: UserRole.SERVICE_PROVIDER_TEAM_MEMBER,
    userType: UserType.SERVICE_PROVIDER,
    description: 'Join as a team member of a service providing organization'
  }
];

// Registration steps configuration
export const REGISTRATION_STEPS: RegistrationStep[] = [
  {
    step: 1,
    title: 'Basic Information',
    description: 'Provide your personal and contact details',
    isCompleted: false,
    isActive: true
  },
  {
    step: 2,
    title: 'Verification',
    description: 'Verify your email and mobile number',
    isCompleted: false,
    isActive: false
  },
  {
    step: 3,
    title: 'Complete',
    description: 'Registration completed successfully',
    isCompleted: false,
    isActive: false
  }
];

// Password strength validation
export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requiresUppercase: true,
  requiresLowercase: true,
  requiresNumbers: true,
  requiresSpecialChars: true
};

// Mobile number validation patterns
export const MOBILE_PATTERNS = {
  india: /^[6-9]\d{9}$/,
  international: /^\+?[1-9]\d{1,14}$/
};

// Login options for homepage
export const LOGIN_OPTIONS = REGISTRATION_OPTIONS;
