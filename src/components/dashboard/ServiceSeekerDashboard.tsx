import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
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
  Users,
  Building,
  Package,
  ExternalLink,
  Edit,
  Archive,
  UserMinus,
  ChevronRight,
  Shield,
  Activity,
  Briefcase
} from "lucide-react";
import { Link } from "react-router-dom";
import { DashboardData, ServiceRequest } from "@/types/dashboard";
import { dashboardService } from "@/services/dashboardService";
import { UserRole } from "@/types/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface ServiceSeekerDashboardProps {
  userRole: UserRole;
}

export const ServiceSeekerDashboard = ({ userRole }: ServiceSeekerDashboardProps) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  // Mock data for demonstration - replace with actual API calls
  const mockProfileCompletion = {
    percentage: 75,
    isCompleted: false,
    missingFields: ['Tax Information', 'Banking Details']
  };

  const mockNotifications = [
    { id: 1, title: "Service Request Update", message: "Your request #SR001 has been assigned", type: "info", time: "2 hours ago", urgent: false },
    { id: 2, title: "Deadline Approaching", message: "Work Order #WO123 due tomorrow", type: "warning", time: "4 hours ago", urgent: true },
    { id: 3, title: "Profile Incomplete", message: "Complete your profile to get permanent registration", type: "alert", time: "1 day ago", urgent: false }
  ];

  // Updated service request numbers to match mock data
  const mockServiceRequests = {
    openServiceRequests: 3,
    closedServiceRequests: 2,
    openWorkOrders: 1,
    closedWorkOrders: 1
  };

  const mockSubscriptions = [
    { id: 1, moduleName: "Claims Management", endDate: "2024-12-31", status: "Active" },
    { id: 2, moduleName: "E-Voting", endDate: "2024-11-30", status: "Active" },
    { id: 3, moduleName: "Virtual Data Room", endDate: "2024-10-15", status: "Expiring Soon" }
  ];

  const mockWorkspace = [
    { id: 1, moduleName: "Claims Management", lastVisited: "2 hours ago", hasAccess: true },
    { id: 2, moduleName: "Meetings", lastVisited: "1 day ago", hasAccess: true },
    { id: 3, moduleName: "E-Voting", lastVisited: "3 days ago", hasAccess: false }
  ];

  const mockTeamMembers = [
    { id: 1, name: "Alice Johnson", lastLogin: "2024-01-08 09:30 AM", status: "Active", role: "Associate" },
    { id: 2, name: "Bob Smith", lastLogin: "2024-01-07 02:15 PM", status: "Active", role: "Senior Associate" },
    { id: 3, name: "Carol Davis", lastLogin: "2024-01-05 11:45 AM", status: "Inactive", role: "Junior Associate" }
  ];

  const mockAssignedEntities = [
    { id: 1, entityName: "ABC Legal Services", moduleActivated: "Claims Management", status: "Active" },
    { id: 2, entityName: "XYZ Consultancy", moduleActivated: "E-Voting", status: "Active" }
  ];

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
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
        return "bg-warning text-warning-foreground";
      case "Open":
        return "bg-secondary text-secondary-foreground";
      case "Closed":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-destructive";
      case "Medium":
        return "text-warning";
      case "Low":
        return "text-success";
      default:
        return "text-muted-foreground";
    }
  };

  // Helper function to render role-specific content
  const renderRoleSpecificContent = () => {
    switch (userRole) {
      case UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER:
        return renderIndividualDashboard();
      case UserRole.SERVICE_SEEKER_ENTITY_ADMIN:
        return renderEntityAdminDashboard();
      case UserRole.SERVICE_SEEKER_TEAM_MEMBER:
        return renderTeamMemberDashboard();
      default:
        return renderIndividualDashboard();
    }
  };

  // Individual/Partner Dashboard
  const renderIndividualDashboard = () => (
    <div className="space-y-8">
      {/* Top Section - Registration Number and Quick Actions */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Registration Number Card */}
        <Card className="shadow-sm border min-h-[280px]">
          <CardContent className="p-8 h-full flex items-center justify-center">
            <div className="text-center space-y-3">
              <Shield className="h-12 w-12 text-gray-400 mx-auto" />
              {mockProfileCompletion.isCompleted ? (
                <>
                  <div className="text-xl font-semibold text-gray-900">REG-{user?.id || '561002'}</div>
                  <p className="text-sm text-gray-500">Permanent Registration</p>
                </>
              ) : (
                <>
                  <div className="text-lg font-medium text-gray-700">Complete Profile</div>
                  <p className="text-sm text-gray-500">to get permanent registration</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Completion Card */}
        <Card className="shadow-sm border min-h-[280px]">
          <CardContent className="p-8 h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <User className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <div className="text-sm font-medium text-gray-600">Profile Completion</div>
                <div className="text-3xl font-bold text-primary mt-1">{mockProfileCompletion.percentage}%</div>
              </div>
              <Progress value={mockProfileCompletion.percentage} className="h-2 bg-gray-200" />
              <Button asChild size="sm" className="w-full bg-primary hover:bg-primary/90">
                <Link to="/profile/edit">
                  {mockProfileCompletion.isCompleted ? (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete Profile
                    </>
                  )}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Raise A Service Request */}
        <Card className="shadow-sm border">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center">
                <Plus className="h-12 w-12 text-primary mx-auto mb-3" />
                <div className="font-semibold text-primary text-lg">Raise A Service Request</div>
              </div>
              
              <div className="text-xs text-gray-600 leading-relaxed">
                If you know, please choose the Professional and Service(s) from the dropdown list below. Else, please write the Service you are looking for in the text box, and confirm if the scope of work suggested below matches your requirements.
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">I am looking for</label>
                <Textarea 
                  placeholder="(text box for typing 'service')"
                  className="min-h-[70px] resize-none text-sm border-gray-300 focus:border-primary"
                  rows={3}
                />
              </div>
              
              <Button asChild className="w-full bg-primary hover:bg-primary/90">
                <Link to="/create-service-request">
                  <Plus className="h-4 w-4 mr-2" />
                  Raise Service Request
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>



      {/* Service Requests Overview */}
      <Card className="shadow-sm border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <FileText className="h-5 w-5 text-gray-600" />
            Service Requests Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-6 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">{mockServiceRequests.openServiceRequests}</div>
              <p className="text-sm font-medium text-blue-700">Open Service Request(s)</p>
            </div>
            <div className="text-center p-6 bg-orange-50 border border-orange-100 rounded-lg">
              <div className="text-4xl font-bold text-orange-600 mb-2">{mockServiceRequests.openWorkOrders}</div>
              <p className="text-sm font-medium text-orange-700">Open Work Order(s)</p>
            </div>
            <div className="text-center p-6 bg-gray-50 border border-gray-100 rounded-lg">
              <div className="text-4xl font-bold text-gray-600 mb-2">{mockServiceRequests.closedWorkOrders}</div>
              <p className="text-sm font-medium text-gray-700">Closed Work Order(s)</p>
            </div>
            <div className="text-center p-6 bg-green-50 border border-green-100 rounded-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">{mockServiceRequests.closedServiceRequests}</div>
              <p className="text-sm font-medium text-green-700">Closed Service Request(s)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <Link to="/subscriptions" className="block text-center space-y-3">
              <Package className="h-8 w-8 text-blue-600 mx-auto" />
              <div>
                <div className="font-semibold text-gray-900">Module Subscription</div>
                <p className="text-sm text-muted-foreground">Manage your subscriptions</p>
              </div>
              <Button variant="outline" size="sm">
                View Subscriptions
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <Link to="/payments" className="block text-center space-y-3">
              <CreditCard className="h-8 w-8 text-green-600 mx-auto" />
              <div>
                <div className="font-semibold text-gray-900">Payment Link</div>
                <p className="text-sm text-muted-foreground">Manage payments & billing</p>
              </div>
              <Button variant="outline" size="sm">
                View Payments
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <Link to="/analytics" className="block text-center space-y-3">
              <BarChart3 className="h-8 w-8 text-purple-600 mx-auto" />
              <div>
                <div className="font-semibold text-gray-900">Analytics & Reports</div>
                <p className="text-sm text-muted-foreground">View detailed insights</p>
              </div>
              <Button variant="outline" size="sm">
                View Analytics
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Notifications */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Notifications */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockNotifications.slice(0, 3).map((notification) => (
                <div key={notification.id} className={`p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${
                  notification.urgent ? 'border-red-200 bg-red-50' : 'border-gray-200'
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">{notification.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4">
              View All Notifications
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Workspace Modules */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Recent Workspace
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockWorkspace.slice(0, 3).map((module) => (
                <div key={module.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium text-sm">{module.moduleName}</p>
                    <p className="text-xs text-muted-foreground">Last visited: {module.lastVisited}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant={module.hasAccess ? "default" : "secondary"}
                    disabled={!module.hasAccess}
                  >
                    {module.hasAccess ? "Open" : "No Access"}
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4">
              View All Modules
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );



  // Team Member Dashboard (Individual features - Subscriptions + Assigned Entities)
  const renderTeamMemberDashboard = () => (
    <div className="space-y-6">
      {/* Registration Number & Profile Completion */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Registration Number
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mockProfileCompletion.isCompleted ? (
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">REG-{user?.id || '561002'}</div>
                <p className="text-sm text-muted-foreground">Permanent Registration</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-lg text-muted-foreground">Complete Profile</div>
                <p className="text-sm text-muted-foreground">to get permanent registration</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Profile Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{mockProfileCompletion.percentage}%</span>
              </div>
              <Progress value={mockProfileCompletion.percentage} className="h-2" />
              {mockProfileCompletion.isCompleted ? (
                <Button asChild className="w-full" variant="outline">
                  <Link to="/profile/edit">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              ) : (
                <Button asChild className="w-full">
                  <Link to="/profile/edit">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Profile
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Notifications */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Alerts & Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockNotifications.map((notification) => (
              <Alert key={notification.id} className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                notification.urgent ? 'border-destructive bg-destructive/5' : 'border-muted'
              }`}>
                <AlertCircle className={`h-4 w-4 ${
                  notification.urgent ? 'text-destructive' : 'text-primary'
                }`} />
                <AlertDescription>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Service Requests Card View */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Service Requests Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{mockServiceRequests.openServiceRequests}</div>
              <p className="text-sm text-muted-foreground">Open Service Requests</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{mockServiceRequests.closedServiceRequests}</div>
              <p className="text-sm text-muted-foreground">Closed Service Requests</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{mockServiceRequests.openWorkOrders}</div>
              <p className="text-sm text-muted-foreground">Open Work Orders</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{mockServiceRequests.closedWorkOrders}</div>
              <p className="text-sm text-muted-foreground">Closed Work Orders</p>
            </div>
          </div>
          <div className="mt-4">
            <Button asChild className="w-full">
              <Link to="/service-requests/create">
                <Plus className="h-4 w-4 mr-2" />
                Raise a Service Request
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assigned Entities (instead of Subscriptions) */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Assigned Entities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAssignedEntities.map((entity) => (
                <div key={entity.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{entity.entityName}</p>
                    <p className="text-sm text-muted-foreground">Module: {entity.moduleActivated}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Workspace
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockWorkspace.map((module) => (
                <div key={module.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{module.moduleName}</p>
                    <p className="text-sm text-muted-foreground">Last visited: {module.lastVisited}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant={module.hasAccess ? "default" : "outline"}
                    disabled={!module.hasAccess}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Open
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Section */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Global Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input 
              placeholder="Search across all modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button>
              <Search className="h-4 w-4" />
            </Button>
          </div>
          {searchQuery && (
            <div className="mt-3 p-3 border rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Search results for "{searchQuery}" will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // Entity Admin Dashboard
  const renderEntityAdminDashboard = () => (
    <div className="space-y-6">
      {/* Registration Number & Profile Completion */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Registration Number
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mockProfileCompletion.isCompleted ? (
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">REG-{user?.id || '561002'}</div>
                <p className="text-sm text-muted-foreground">Permanent Registration</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-lg text-muted-foreground">Complete Profile</div>
                <p className="text-sm text-muted-foreground">to get permanent registration</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Profile Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{mockProfileCompletion.percentage}%</span>
              </div>
              <Progress value={mockProfileCompletion.percentage} className="h-2" />
              {mockProfileCompletion.isCompleted ? (
                <Button asChild className="w-full" variant="outline">
                  <Link to="/profile/edit">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              ) : (
                <Button asChild className="w-full">
                  <Link to="/profile/edit">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Profile
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Notifications */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Alerts & Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockNotifications.map((notification) => (
              <Alert key={notification.id} className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                notification.urgent ? 'border-destructive bg-destructive/5' : 'border-muted'
              }`}>
                <AlertCircle className={`h-4 w-4 ${
                  notification.urgent ? 'text-destructive' : 'text-primary'
                }`} />
                <AlertDescription>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Service Requests Card View */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Service Requests Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{mockServiceRequests.openServiceRequests}</div>
              <p className="text-sm text-muted-foreground">Open Service Requests</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{mockServiceRequests.closedServiceRequests}</div>
              <p className="text-sm text-muted-foreground">Closed Service Requests</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{mockServiceRequests.openWorkOrders}</div>
              <p className="text-sm text-muted-foreground">Open Work Orders</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{mockServiceRequests.closedWorkOrders}</div>
              <p className="text-sm text-muted-foreground">Closed Work Orders</p>
            </div>
          </div>
          <div className="mt-4">
            <Button asChild className="w-full">
              <Link to="/service-requests/create">
                <Plus className="h-4 w-4 mr-2" />
                Raise a Service Request
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions and Team Members */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockSubscriptions.map((subscription) => (
                <div key={subscription.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{subscription.moduleName}</p>
                    <p className="text-sm text-muted-foreground">Ends: {subscription.endDate}</p>
                  </div>
                  <Badge variant={subscription.status === 'Active' ? 'default' : 'destructive'}>
                    {subscription.status}
                  </Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Subscription Packages
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Active Team Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockTeamMembers.map((member) => (
                <div key={member.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">Last login: {member.lastLogin}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={member.status === 'Active' ? 'default' : 'secondary'}>
                      {member.status}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Users className="h-4 w-4 mr-2" />
                View Team Management
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workspace and Search */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Workspace
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockWorkspace.map((module) => (
                <div key={module.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{module.moduleName}</p>
                    <p className="text-sm text-muted-foreground">Last visited: {module.lastVisited}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant={module.hasAccess ? "default" : "outline"}
                    disabled={!module.hasAccess}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Open
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Global Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input 
                placeholder="Search across all modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button>
                <Search className="h-4 w-4" />
              </Button>
            </div>
            {searchQuery && (
              <div className="mt-3 p-3 border rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Search results for "{searchQuery}" will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {userRole === UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER && "Service Seeker Dashboard"}
            {userRole === UserRole.SERVICE_SEEKER_ENTITY_ADMIN && "Entity Admin Dashboard"}
            {userRole === UserRole.SERVICE_SEEKER_TEAM_MEMBER && "Team Member Dashboard"}
          </h1>
          <p className="text-muted-foreground">
            {userRole === UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER && "Manage your service requests and track project progress"}
            {userRole === UserRole.SERVICE_SEEKER_ENTITY_ADMIN && "Manage your organization, team members, and service requests"}
            {userRole === UserRole.SERVICE_SEEKER_TEAM_MEMBER && "Access assigned entities and manage your service requests"}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button variant="outline">
            <User className="h-4 w-4 mr-2" />
            My Profile
          </Button>
        </div>
      </div>

      {/* Role-specific Dashboard Content */}
      {renderRoleSpecificContent()}
    </div>
  );
};
