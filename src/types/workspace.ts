export interface WorkspaceModule {
  id: string;
  title: string;
  description: string;
  status: ModuleStatus;
  subscriptionEndDate: Date | null;
  subscriptionStartDate: Date | null;
  isActive: boolean;
  features: string[];
  category: ModuleCategory;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  icon: string;
  entityId?: string; // If subscribed under an entity
}

export enum ModuleStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  TRIAL = 'trial',
  PENDING_ACTIVATION = 'pending_activation',
  INACTIVE = 'inactive'
}

export enum ModuleCategory {
  CORE = 'core',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
  ADDON = 'addon'
}

export interface WorkspaceEntity {
  id: string;
  name: string;
  type: EntityType;
  industry: string;
  size: EntitySize;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  status: EntityStatus;
  modules: WorkspaceModule[];
  teamMembers: EntityTeamMember[];
  profileCompletion: number;
  registrationNumber?: string;
  address: EntityAddress;
  contactInfo: EntityContactInfo;
}

export enum EntityType {
  INDIVIDUAL = 'individual',
  PARTNERSHIP = 'partnership',
  PRIVATE_LIMITED = 'private_limited',
  PUBLIC_LIMITED = 'public_limited',
  LLP = 'llp',
  BRANCH = 'branch',
  DEPARTMENT = 'department'
}

export enum EntitySize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  ENTERPRISE = 'enterprise'
}

export enum EntityStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended'
}

export interface EntityTeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamMemberRole;
  permissions: ModulePermission[];
  joinedAt: Date;
  lastActive: Date;
  status: TeamMemberStatus;
  avatar?: string;
  assignedModules: string[];
}

export enum TeamMemberRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  MEMBER = 'member',
  VIEWER = 'viewer'
}

export enum TeamMemberStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended'
}

export interface ModulePermission {
  moduleId: string;
  permissions: Permission[];
}

export enum Permission {
  VIEW = 'view',
  EDIT = 'edit',
  DELETE = 'delete',
  MANAGE = 'manage',
  ADMIN = 'admin'
}

export interface EntityAddress {
  street: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
}

export interface EntityContactInfo {
  primaryEmail: string;
  primaryPhone: string;
  secondaryEmail?: string;
  secondaryPhone?: string;
  website?: string;
}

export interface WorkspaceStats {
  totalModules: number;
  activeModules: number;
  expiredModules: number;
  trialModules: number;
  pendingModules: number;
  inactiveModules: number;
  totalEntities: number;
  activeEntities: number;
  totalTeamMembers: number;
  activeTeamMembers: number;
}

export interface ModuleSubscriptionPackage {
  id: string;
  name: string;
  description: string;
  features: string[];
  price: number;
  billingCycle: 'monthly' | 'yearly';
  category: ModuleCategory;
  isPopular: boolean;
  trialDays: number;
}

export interface WorkspaceFilters {
  moduleStatus?: ModuleStatus;
  moduleCategory?: ModuleCategory;
  entityType?: EntityType;
  entityStatus?: EntityStatus;
  teamMemberStatus?: TeamMemberStatus;
  searchTerm?: string;
}

export interface WorkspaceResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
