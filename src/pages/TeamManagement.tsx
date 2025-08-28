import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TeamManagement as TeamManagementComponent } from "@/components/systemSettings/TeamManagement";

const TeamManagement = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your team members, roles, and permissions
          </p>
        </div>
        <TeamManagementComponent />
      </div>
    </DashboardLayout>
  );
};

export default TeamManagement;
