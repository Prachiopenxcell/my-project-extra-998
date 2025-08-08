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
    opportunities: {
      total: 24,
      open: 8,
      closed: 16
    },
    workOrders: {
      total: 15,
      inProgress: 5,
      completed: 10
    },
    subscriptions: [
      { name: "Claims Management", endDate: "2024-12-31", status: "active" },
      { name: "Meeting Management", endDate: "2024-11-30", status: "active" },
      { name: "Entity Management", endDate: "2025-01-15", status: "active" }
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
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const data = await dashboardService.getDashboardData(userRole);
        setDashboardData(data);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [userRole, toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-info text-info-foreground";
      case "Review":
    }
  };

  // Service Provider Individual/Partner Dashboard
  const renderIndividualDashboard = () => (
    <div className="space-y-6">
      {/* Registration Number */}
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

      {/* Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.subscriptions.map((sub, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{sub.name}</p>
                  <p className="text-sm text-muted-foreground">Ends: {sub.endDate}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                  <Button variant="outline" size="sm">
                    View Packages
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Profile Completion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Completion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Profile Progress</span>
                <span className="text-sm text-muted-foreground">{mockData.profileCompletion}%</span>
              </div>
              <Progress value={mockData.profileCompletion} className="h-2" />
            </div>
            <Button className="w-full">
              {mockData.profileCompletion === 100 ? 'Edit Profile' : 'Complete Profile'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Workspace */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Workspace
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeWorkspaceTab} onValueChange={setActiveWorkspaceTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="modules">Modules</TabsTrigger>
              <TabsTrigger value="entities">Entities</TabsTrigger>
            </TabsList>
            <TabsContent value="modules" className="space-y-3">
              {mockData.recentModules.map((module, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{module.name}</p>
                    <p className="text-sm text-muted-foreground">Last visited: {module.lastVisited}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Open
                  </Button>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Modules
              </Button>
            </TabsContent>
            <TabsContent value="entities" className="space-y-3">
              {mockData.recentEntities.map((entity, index) => (
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
              <Button variant="outline" className="w-full">
                View All Entities
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* New/Recent Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            New/Recent Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.recentOpportunities.map((opp, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{opp.srn}</p>
                  <p className="text-sm text-muted-foreground">Raised: {opp.raisedOn} | Closure: {opp.bidClosureDate}</p>
                  <Badge variant="outline">{opp.status}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Opportunity
                  </Button>
                  <Button variant="outline" size="sm">
                    View Bid
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Opportunities
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Work Orders (In Progress) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Work Orders (In Progress)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.inProgressWorkOrders.map((wo, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{wo.workOrderNo}</p>
                  <p className="text-sm text-muted-foreground">Start: {wo.startDate} | Due: {wo.lastDate}</p>
                  <Badge variant="outline">{wo.status}</Badge>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Work Orders
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Guidance and Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Guidance and Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="w-full">
            <HelpCircle className="h-4 w-4 mr-2" />
            Ask & Refer
          </Button>
        </CardContent>
      </Card>

      {/* Resource Pooling/Sharing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Resource Pooling/Sharing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockData.resourceSharingRequests.map((req, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Request from {req.from}</p>
                  <p className="text-sm text-muted-foreground">{req.type} | {req.requestDate}</p>
                  <Badge variant="outline">{req.status}</Badge>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Global Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Search across all modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Filter by Module
              </Button>
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-1" />
                Filter by User
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="shadow-card">
              <CardHeader className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Service Provider Entity Admin Dashboard
  const renderEntityAdminDashboard = () => (
    <div className="space-y-6">
      {/* Registration Number */}
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

      {/* All Individual Dashboard features */}
      {renderIndividualDashboard()}

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

  // Service Provider Team Member Dashboard
  const renderTeamMemberDashboard = () => (
    <div className="space-y-6">
      {/* Registration Number */}
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

      {/* Assigned Entities - Team Member Specific */}
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

      {/* Profile Completion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Completion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Profile Progress</span>
                <span className="text-sm text-muted-foreground">{mockData.profileCompletion}%</span>
              </div>
              <Progress value={mockData.profileCompletion} className="h-2" />
            </div>
            <Button className="w-full">
              {mockData.profileCompletion === 100 ? 'Edit Profile' : 'Complete Profile'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Global Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Search across all modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Filter by Module
              </Button>
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-1" />
                Filter by User
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Role-based rendering
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-[200px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[200px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              No dashboard data available
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {renderRoleSpecificContent()}
    </div>
  );
};
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-success mt-1">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Profile Completion Alert */}
      {!dashboardData.profileCompletion.isCompleted && (
        <Card className="border-warning bg-warning/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              <CardTitle className="text-warning">Complete Your Profile</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Profile Completion</span>
                <span className="text-sm font-medium">{dashboardData.profileCompletion.percentage}%</span>
              </div>
              <Progress value={dashboardData.profileCompletion.percentage} className="h-2" />
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Missing: {dashboardData.profileCompletion.missingFields.join(", ")}
                </p>
                <Button asChild size="sm">
                  <Link to="/profile/edit">Complete Profile</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="work-orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="work-orders">Work Orders</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
        </TabsList>

        <TabsContent value="work-orders" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Work Orders */}
            <div className="lg:col-span-2">
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Active Work Orders</CardTitle>
                      <CardDescription>
                        Track progress of your ongoing projects
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/work-orders">View All</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dashboardData.workOrders && dashboardData.workOrders.length > 0 ? (
                    dashboardData.workOrders.map((order) => (
                      <div key={order.id} className="p-4 rounded-lg border bg-card">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-foreground">{order.title}</h4>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Client: {order.client}
                            </p>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">{order.progress}%</span>
                              </div>
                              <Progress value={order.progress} className="h-1" />
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                              <span>Start: {new Date(order.startDate).toLocaleDateString()}</span>
                              <span>Due: {new Date(order.dueDate).toLocaleDateString()}</span>
                              {order.teamMembers && (
                                <span>Team: {order.teamMembers.length} members</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-primary">
                              {order.amount}
                            </span>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/work-orders/${order.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No active work orders</p>
                      <Button asChild>
                        <Link to="/work-orders/create">Create First Work Order</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link to="/work-orders/create">
                      <Plus className="h-4 w-4 mr-2" />
                      New Work Order
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link to="/clients">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Clients
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link to="/billing">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Generate Invoice
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link to="/reports">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Reports
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Notifications */}
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Notifications</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/notifications">
                        <Bell className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dashboardData.notifications.slice(0, 3).map((notification) => (
                    <div key={notification.id} className="p-3 rounded-lg border bg-card">
                      <div className="flex items-start gap-2">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === 'success' ? 'bg-success' :
                          notification.type === 'warning' ? 'bg-warning' :
                          notification.type === 'error' ? 'bg-destructive' : 'bg-info'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Opportunities */}
            <div className="lg:col-span-2">
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Business Opportunities</CardTitle>
                      <CardDescription>
                        Explore and bid on new business opportunities
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/opportunities">View All</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dashboardData.opportunities && dashboardData.opportunities.length > 0 ? (
                    dashboardData.opportunities.map((opportunity) => (
                      <div key={opportunity.id} className="p-4 rounded-lg border bg-card">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-foreground">{opportunity.title}</h4>
                              <Badge className={getStatusColor(opportunity.status)}>
                                {opportunity.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              SRN: {opportunity.srn} • Category: {opportunity.category}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Raised: {new Date(opportunity.raisedOn).toLocaleDateString()}</span>
                              <span>Bid Closure: {new Date(opportunity.bidClosureDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-primary">
                              {opportunity.estimatedValue}
                            </span>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/opportunities/${opportunity.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No opportunities available</p>
                      <Button asChild>
                        <Link to="/opportunities">Browse Opportunities</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar for Opportunities */}
            <div className="space-y-6">
              {/* Opportunity Stats */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Opportunity Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Bids</span>
                    <span className="text-sm font-medium">5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Win Rate</span>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg. Bid Value</span>
                    <span className="text-sm font-medium">₹2,50,000</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dashboardData.recentActivity.slice(0, 3).map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
