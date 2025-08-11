import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, AccessLevel } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
  requiredPermission?: {
    module: string;
    action: string;
  };
  accessLevel?: AccessLevel;
  fallbackPath?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  requiredPermission,
  accessLevel = AccessLevel.AUTHENTICATED,
  fallbackPath = '/login'
}: ProtectedRouteProps) {
  const { user, isAuthenticated, hasPermission, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while auth is being determined
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check if user is authenticated for protected routes
  if (accessLevel !== AccessLevel.PUBLIC && !isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role requirements
  if (requiredRole && user) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    // Debug: Log role checking
    console.log('🔒 PROTECTED ROUTE DEBUG:', {
      userRole: user.role,
      requiredRoles: roles,
      hasAccess: roles.includes(user.role),
      currentPath: location.pathname
    });
    
    if (!roles.includes(user.role)) {
      console.log('❌ ACCESS DENIED - Redirecting to unauthorized');
      return <Navigate to="/unauthorized" replace />;
    } else {
      console.log('✅ ACCESS GRANTED');
    }
  }

  // Check permission requirements
  if (requiredPermission && user) {
    if (!hasPermission(requiredPermission.module, requiredPermission.action)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
}

// Higher-order component for role-based access
export function withRoleAccess<T extends Record<string, unknown>>(
  Component: React.ComponentType<T>,
  requiredRole: UserRole | UserRole[],
  fallbackPath = '/unauthorized'
) {
  return function ProtectedComponent(props: T) {
    return (
      <ProtectedRoute requiredRole={requiredRole} fallbackPath={fallbackPath}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

// Component for checking permissions within components
export function PermissionGate({
  children,
  module,
  action,
  fallback = null
}: {
  children: React.ReactNode;
  module: string;
  action: string;
  fallback?: React.ReactNode;
}) {
  const { hasPermission } = useAuth();

  if (!hasPermission(module, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
