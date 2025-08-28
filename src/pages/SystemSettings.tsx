import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";
import { SystemSettingsStats } from "@/types/systemSettings";
import { systemSettingsService } from "@/services/systemSettingsService";
import { 
  User, 
  Lock, 
  Bell, 
  Users, 
  FileText, 
  CreditCard, 
  History,
  Settings,
  UserCheck,
  Workflow,
  Mail
} from "lucide-react";

// Import individual setting components
import ProfileManagement from "@/components/systemSettings/ProfileManagement";
import { PasswordUpdate } from "@/components/systemSettings/PasswordUpdate";
import { NotificationManagement } from "@/components/systemSettings/NotificationManagement";
import { TeamManagement } from "@/components/systemSettings/TeamManagement";
import { ProcessManagement } from "@/components/systemSettings/ProcessManagement";
import { SubscriptionSettings } from "@/components/systemSettings/SubscriptionSettings";
import { PaymentHistory } from "@/components/systemSettings/PaymentHistory";

const SystemSettings = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<SystemSettingsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await systemSettingsService.getSystemSettingsStats();
        setStats(statsData);
      } catch (error) {
        console.error('Failed to load system settings stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  // Determine which tabs to show based on user role
  const getAvailableTabs = () => {
    const baseTabs = [
      { id: "profile", label: "Profile", icon: User },
      { id: "password", label: "Password", icon: Lock },
      { id: "notifications", label: "Notifications", icon: Bell }
    ];

    // Admin-only tabs for Entity/Organization Admins
    if (user?.role === UserRole.SERVICE_SEEKER_ENTITY_ADMIN || 
        user?.role === UserRole.SERVICE_PROVIDER_ENTITY_ADMIN) {
      return [
        ...baseTabs,
        { id: "team", label: "Team", icon: Users },
        { id: "process", label: "Process", icon: Workflow },
        { id: "subscription", label: "Subscription", icon: CreditCard },
        { id: "payment", label: "Payment", icon: History }
      ];
    }

    return baseTabs;
  };

  const availableTabs = getAvailableTabs();

  const renderStatsCards = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (!stats) return null;

    const isAdmin = user?.role === UserRole.SERVICE_SEEKER_ENTITY_ADMIN || 
                   user?.role === UserRole.SERVICE_PROVIDER_ENTITY_ADMIN;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Profile Completion</p>
                <p className="text-2xl font-bold">{stats.profileCompletion}%</p>
                <p className="text-xs text-muted-foreground">Profile completed</p>
              </div>
              <UserCheck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        {isAdmin && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Team Members</p>
                  <p className="text-2xl font-bold">{stats.teamMembers.active}/{stats.teamMembers.total}</p>
                  <p className="text-xs text-muted-foreground">Active members</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        )}

        {isAdmin && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Process Templates</p>
                  <p className="text-2xl font-bold">{stats.processTemplates.active}</p>
                  <p className="text-xs text-muted-foreground">Active templates</p>
                </div>
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isAdmin ? 'Service Requests' : 'Notifications'}
                </p>
                <p className="text-2xl font-bold">
                  {isAdmin ? stats.serviceRequests : stats.notifications.unread}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isAdmin ? 'This month' : 'Unread alerts'}
                </p>
              </div>
              {isAdmin ? (
                <Mail className="h-8 w-8 text-orange-600" />
              ) : (
                <Bell className="h-8 w-8 text-red-600" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileManagement />;
      case "password":
        return <PasswordUpdate />;
      case "notifications":
        return <NotificationManagement />;
      case "team":
        return <TeamManagement />;
      case "process":
        return <ProcessManagement />;
      case "subscription":
        return <SubscriptionSettings />;
      case "payment":
        return <PaymentHistory />;
      default:
        return <ProfileManagement />;
    }
  };

  const getUserTypeLabel = () => {
    switch (user?.role) {
      case UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER:
        return "Service Seeker Individual/Partner";
      case UserRole.SERVICE_SEEKER_ENTITY_ADMIN:
        return "Service Seeker Entity Admin";
      case UserRole.SERVICE_SEEKER_TEAM_MEMBER:
        return "Service Seeker Team Member";
      case UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER:
        return "Service Provider Individual/Partner";
      case UserRole.SERVICE_PROVIDER_ENTITY_ADMIN:
        return "Service Provider Entity Admin";
      case UserRole.SERVICE_PROVIDER_TEAM_MEMBER:
        return "Service Provider Team Member";
      default:
        return "User";
    }
  };

  return (
    <DashboardLayout userType={user?.role?.includes('service_provider') ? 'service_provider' : 'service_seeker'}>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your account settings, team members, and system preferences
          </p>
          <div className="mt-2">
            <Badge variant="outline" className="text-sm">
              {getUserTypeLabel()}
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        {renderStatsCards()}

        {/* Settings Tabs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 mb-6">
                {availableTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger 
                      key={tab.id} 
                      value={tab.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {availableTabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="mt-6">
                  {renderTabContent()}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SystemSettings;
