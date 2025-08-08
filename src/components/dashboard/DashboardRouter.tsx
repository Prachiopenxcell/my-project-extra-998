import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";
import { ServiceSeekerDashboard } from "./ServiceSeekerDashboard";
import { ServiceProviderDashboard } from "./ServiceProviderDashboard";
import { EntityAdminDashboard } from "./EntityAdminDashboard";
import { TeamMemberDashboard } from "./TeamMemberDashboard";

export const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Authentication Required
          </h1>
          <p className="text-muted-foreground">
            Please log in to access your dashboard.
          </p>
        </div>
      </div>
    );
  }

  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER:
    case UserRole.SERVICE_SEEKER_ENTITY_ADMIN:
    case UserRole.SERVICE_SEEKER_TEAM_MEMBER:
      return <ServiceSeekerDashboard userRole={user.role} />;

    case UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER:
    case UserRole.SERVICE_PROVIDER_ENTITY_ADMIN:
    case UserRole.SERVICE_PROVIDER_TEAM_MEMBER:
      return <ServiceProviderDashboard userRole={user.role} />;

    default:
      return (
        <div className="container mx-auto p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Access Restricted
            </h1>
            <p className="text-muted-foreground mb-4">
              Your account type does not have access to a dashboard.
            </p>
            <p className="text-sm text-muted-foreground">
              Please contact your administrator or complete your registration.
            </p>
          </div>
        </div>
      );
  }
};
