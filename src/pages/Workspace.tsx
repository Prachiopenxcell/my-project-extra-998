import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";

// Components
import MyModules from "@/components/workspace/MyModules";
import MyEntity from "@/components/workspace/MyEntity";

const Workspace = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("modules");

  // Determine user type for layout
  const isServiceSeeker = user?.role && [
    UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER,
    UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
    UserRole.SERVICE_SEEKER_TEAM_MEMBER
  ].includes(user.role);

  const isServiceProvider = user?.role && [
    UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER,
    UserRole.SERVICE_PROVIDER_ENTITY_ADMIN,
    UserRole.SERVICE_PROVIDER_TEAM_MEMBER
  ].includes(user.role);

  // Determine if user is team member (limited access)
  const isTeamMember = user?.role && [
    UserRole.SERVICE_SEEKER_TEAM_MEMBER,
    UserRole.SERVICE_PROVIDER_TEAM_MEMBER
  ].includes(user.role);

  // Determine if user is admin (full access)
  const isAdmin = user?.role && [
    UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER,
    UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
    UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER,
    UserRole.SERVICE_PROVIDER_ENTITY_ADMIN
  ].includes(user.role);

  const userType = isServiceSeeker ? "service_seeker" : isServiceProvider ? "service_provider" : "admin";

  return (
    <DashboardLayout userType={userType}>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Workspace</h1>
          <p className="text-gray-600 mt-2">
            Manage your modules and entities from one centralized location
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="modules" className="flex items-center gap-2">
              My Modules
            </TabsTrigger>
            <TabsTrigger value="entities" className="flex items-center gap-2">
              My Entity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="modules" className="space-y-6">
            <MyModules 
              isTeamMember={isTeamMember} 
              isAdmin={isAdmin}
              userRole={user?.role}
            />
          </TabsContent>

          <TabsContent value="entities" className="space-y-6">
            <MyEntity 
              isTeamMember={isTeamMember} 
              isAdmin={isAdmin}
              userRole={user?.role}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Workspace;
