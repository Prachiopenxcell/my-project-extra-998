import { UserRole, UserType } from '@/types/auth';

/**
 * Utility functions for handling user types and roles
 */

/**
 * Determines the DashboardLayout userType from a UserRole
 */
export const getUserTypeFromRole = (role?: UserRole): "service_seeker" | "service_provider" | "admin" => {
  if (!role) return 'service_seeker';

  const r = String(role).toLowerCase();
  if (r.includes('service_provider')) return 'service_provider';
  if (r.includes('service_seeker')) return 'service_seeker';
  if (r.includes('admin')) return 'admin';

  // Default fallback
  return 'service_seeker';
};

/**
 * Determines the DashboardLayout userType from a UserType enum
 */
export const getUserTypeFromUserType = (userType?: UserType): "service_seeker" | "service_provider" | "admin" => {
  if (!userType) return 'service_seeker';
  
  switch (userType) {
    case UserType.SERVICE_SEEKER:
      return 'service_seeker';
    case UserType.SERVICE_PROVIDER:
      return 'service_provider';
    case UserType.GUEST:
    case UserType.INVITED:
    default:
      return 'service_seeker';
  }
};

/**
 * Determines if a user role is a service seeker role
 */
export const isServiceSeekerRole = (role?: UserRole): boolean => {
  if (!role) return false;
  return String(role).toLowerCase().includes('service_seeker');
};

/**
 * Determines if a user role is a service provider role
 */
export const isServiceProviderRole = (role?: UserRole): boolean => {
  if (!role) return false;
  return String(role).toLowerCase().includes('service_provider');
};

/**
 * Determines if a user role is an admin role (Entity Admin or higher)
 */
export const isAdminRole = (role?: UserRole): boolean => {
  if (!role) return false;
  const r = String(role).toLowerCase();
  // Treat entity_admin variants as admin-level for UI purposes
  return r.includes('entity_admin') || r.includes('admin');
};

/**
 * Determines if a user role is a team member role
 */
export const isTeamMemberRole = (role?: UserRole): boolean => {
  if (!role) return false;
  return String(role).toLowerCase().includes('team_member');
};
