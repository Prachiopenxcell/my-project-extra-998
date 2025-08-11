import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";

// Service Seeker Components
import ServiceRequestDashboard from "@/components/service-requests/seeker/ServiceRequestDashboard";
import ServiceRequestList from "@/components/service-requests/seeker/ServiceRequestList";

// Service Provider Components
import OpportunityDashboard from "@/components/service-requests/provider/OpportunityDashboard";
import OpportunityList from "@/components/service-requests/provider/OpportunityList";
import BidManagement from "@/components/service-requests/provider/BidManagement";

const ServiceRequests = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Handle URL parameters for tab switching
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['dashboard', 'requests', 'create'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Determine user type based on role
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

  // Service Seeker View
  if (isServiceSeeker) {
    return (
      <DashboardLayout userType="service_seeker">
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Service Requests</h1>
            <p className="text-gray-600 mt-2">
              Manage your service requests, track bids, and create work orders
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="requests">My Requests</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-6">
              <ServiceRequestDashboard />
            </TabsContent>

            <TabsContent value="requests" className="mt-6">
              <ServiceRequestList />
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    );
  }

  // Service Provider View
  if (isServiceProvider) {
    return (
      <DashboardLayout userType="service_provider">
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Opportunities</h1>
            <p className="text-gray-600 mt-2">
              View available opportunities, submit bids, and manage your proposals
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
              <TabsTrigger value="bids">My Bids</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-6">
              <OpportunityDashboard />
            </TabsContent>

            <TabsContent value="opportunities" className="mt-6">
              <OpportunityList />
            </TabsContent>

            <TabsContent value="bids" className="mt-6">
              <BidManagement />
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    );
  }

  // Default view for unauthorized users
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">
            You don't have permission to access this module. Please contact your administrator.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ServiceRequests;
