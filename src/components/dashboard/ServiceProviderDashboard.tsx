import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Briefcase, 
  Plus, 
  Eye, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Calendar,
  Search,
  Filter,
  Bell,
  Settings,
  User,
  CreditCard,
  BarChart3,
  Target,
  Users,
  DollarSign,
  FileText,
  Building,
  Share2,
  HelpCircle,
  ExternalLink,
  Archive,
  UserMinus,
  MoreHorizontal,
  Globe
} from "lucide-react";
import { Link } from "react-router-dom";
import { DashboardData, WorkOrder, Opportunity } from "@/types/dashboard";
import { dashboardService } from "@/services/dashboardService";
import { UserRole } from "@/types/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

interface ServiceProviderDashboardProps {
  userRole: UserRole;
}

export const ServiceProviderDashboard = ({ userRole }: ServiceProviderDashboardProps) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState("modules");
  const { toast } = useToast();

  // Mock data for Service Provider dashboards
  const mockData = {
    registrationNumber: "SP-2024-001234",
    profileCompletion: 85,
    alerts: [
      { id: 1, message: "Bid deadline approaching for SRN-2024-001", type: "urgent", deadline: "2024-08-10" },
      { id: 2, message: "New opportunity available in your area", type: "info", deadline: "2024-08-15" },
      { id: 3, message: "Profile verification pending", type: "warning", deadline: "2024-08-12" }
    ],
    opportunities: { total: 24, open: 8, closed: 16 },
    workOrders: { total: 15, inProgress: 5, completed: 10 },
    subscriptions: [
      { name: "Claims Management", endDate: "2024-12-31", status: "active" },
      { name: "Meeting Management", endDate: "2024-11-30", status: "active" }
    ],
    recentModules: [
      { name: "Claims Management", lastVisited: "2024-08-07", status: "active" },
      { name: "Meeting Management", lastVisited: "2024-08-06", status: "active" }
    ],
    recentEntities: [
      { name: "ABC Corporation", moduleActivated: "Claims Management", status: "active" },
      { name: "XYZ Ltd", moduleActivated: "Meeting Management", status: "active" }
    ],
    recentOpportunities: [
      { srn: "SRN-2024-001", raisedOn: "2024-08-05", bidClosureDate: "2024-08-10", status: "open" },
      { srn: "SRN-2024-002", raisedOn: "2024-08-04", bidClosureDate: "2024-08-09", status: "open" }
    ],
    inProgressWorkOrders: [
      { workOrderNo: "WO-2024-001", startDate: "2024-08-01", lastDate: "2024-08-15", status: "in-progress", teamMembers: ["John Doe", "Jane Smith"] },
      { workOrderNo: "WO-2024-002", startDate: "2024-08-03", lastDate: "2024-08-20", status: "in-progress", teamMembers: ["Mike Johnson"] }
    ],
    resourceSharingRequests: [
      { from: "Professional A", type: "Equipment", requestDate: "2024-08-06", status: "pending" },
      { from: "Professional B", type: "Expertise", requestDate: "2024-08-05", status: "pending" }
    ],
    teamMembers: [
      { name: "John Doe", lastLogin: "2024-08-07 10:30", status: "active" },
      { name: "Jane Smith", lastLogin: "2024-08-06 15:45", status: "active" },
      { name: "Mike Johnson", lastLogin: "2024-08-05 09:20", status: "inactive" }
    ],
    assignedEntities: [
      { name: "ABC Corporation", moduleActivated: "Claims Management" },
      { name: "XYZ Ltd", moduleActivated: "Meeting Management" }
    ]
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const data = await dashboardService.getDashboardData(userRole);
        setDashboardData(data);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [userRole, toast]);

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'destructive';
      case 'warning': return 'default';
      default: return 'default';
    }
  };

  const renderRoleSpecificContent = () => {
    switch (userRole) {
      case UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER:
        return renderIndividualDashboard();
      case UserRole.SERVICE_PROVIDER_ENTITY_ADMIN:
        return renderEntityAdminDashboard();
      case UserRole.SERVICE_PROVIDER_TEAM_MEMBER:
        return renderTeamMemberDashboard();
      default:
        return renderIndividualDashboard();
    }
  };

  // Individual dashboard content without title (for reuse)
  const renderIndividualDashboardContent = () => (
    <>
      {/* Alerts and Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alerts and Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.alerts.map((alert) => (
              <Alert key={alert.id} variant={getAlertColor(alert.type)}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {alert.message}
                  <span className="ml-2 text-xs">Deadline: {alert.deadline}</span>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bids and Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.opportunities.open}</div>
            <p className="text-sm text-muted-foreground">Open Opportunities</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Open Work Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.workOrders.inProgress}</div>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Closed Work Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.workOrders.completed}</div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderIndividualDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Service Provider Dashboard</h1>
          <p className="text-muted-foreground">Individual/Partner</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Registration Number</p>
          <p className="text-lg font-semibold text-primary">{mockData.registrationNumber}</p>
        </div>
      </div>

      {renderIndividualDashboardContent()}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alerts and Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.alerts.map((alert) => (
              <Alert key={alert.id} variant={getAlertColor(alert.type)}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {alert.message}
                  <span className="ml-2 text-xs">Deadline: {alert.deadline}</span>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.opportunities.open}</div>
            <p className="text-sm text-muted-foreground">Open Opportunities</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Open Work Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.workOrders.inProgress}</div>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Closed Work Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.workOrders.completed}</div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderEntityAdminDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Service Provider Dashboard</h1>
          <p className="text-muted-foreground">Entity/Organization Admin</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Registration Number</p>
          <p className="text-lg font-semibold text-primary">{mockData.registrationNumber}</p>
        </div>
      </div>

      {/* All Individual Dashboard content without duplicate title */}
      {renderIndividualDashboardContent()}

      {/* Additional Entity Admin Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.teamMembers.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">Last login: {member.lastLogin}</p>
                  <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                    {member.status}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Archive className="h-4 w-4 mr-1" />
                    Archive
                  </Button>
                  <Button variant="outline" size="sm">
                    <UserMinus className="h-4 w-4 mr-1" />
                    Deactivate
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View Team Management
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTeamMemberDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Service Provider Dashboard</h1>
          <p className="text-muted-foreground">Team Member</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Registration Number</p>
          <p className="text-lg font-semibold text-primary">{mockData.registrationNumber}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Assigned Entities
          </CardTitle>
          <CardDescription>
            Select an entity to access subscribed modules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.assignedEntities.map((entity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{entity.name}</p>
                  <p className="text-sm text-muted-foreground">Module: {entity.moduleActivated}</p>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[100px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {renderRoleSpecificContent()}
    </div>
  );
};
