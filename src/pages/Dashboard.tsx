import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardRouter } from "@/components/dashboard";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";

const Dashboard = () => {
  const { user } = useAuth();

  // Determine the appropriate user type for DashboardLayout
  const getUserType = () => {
    if (!user) return "service_seeker";
    
    // Map user roles to layout user types
    switch (user.role) {
      case UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER:
      case UserRole.SERVICE_PROVIDER_ENTITY_ADMIN:
      case UserRole.SERVICE_PROVIDER_TEAM_MEMBER:
        return "service_provider";
      case UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER:
      case UserRole.SERVICE_SEEKER_ENTITY_ADMIN:
      case UserRole.SERVICE_SEEKER_TEAM_MEMBER:
      default:
        return "service_seeker";
    }
  };

  return (
    <DashboardLayout userType={getUserType()}>
      <DashboardRouter />
    </DashboardLayout>
  );
};

export default Dashboard;