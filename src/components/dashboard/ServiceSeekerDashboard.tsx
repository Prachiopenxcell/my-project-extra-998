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
import { Link, useNavigate } from "react-router-dom";
import { DashboardData, ServiceRequest } from "@/types/dashboard";
import { dashboardService } from "@/services/dashboardService";
import { UserRole } from "@/types/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { serviceRequestService } from "@/services/serviceRequestService";
import { workOrderService } from "@/services/workOrderService";

interface ServiceSeekerDashboardProps {
  userRole: UserRole;
}

export const ServiceSeekerDashboard = ({ userRole }: ServiceSeekerDashboardProps) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [srStats, setSrStats] = useState<{ total: number; open: number; closed: number; draft: number; bidsReceived: number } | null>(null);
  const [woStats, setWoStats] = useState<{ total: number; open: number; inProgress: number; completed: number; disputed: number; overdue: number; pendingPayment: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showServiceRequestDetails, setShowServiceRequestDetails] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data for demonstration - replace with actual API calls
  const mockProfileCompletion = {
    percentage: 100,
    isCompleted: true
  };

  const mockAssignedEntities = [
    { id: 1, entityName: "ABC Legal Services", moduleActivated: "Claims Management", status: "Active" },
    { id: 2, entityName: "XYZ Consultancy", moduleActivated: "E-Voting", status: "Active" }
  ];

  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);
        const dataPromise = dashboardService.getDashboardData(userRole);
        const userId = user?.id || 'current-user';
        const srPromise = serviceRequestService.getServiceRequestStats(userId);
        const woPromise = workOrderService.getWorkOrderStats(userId, 'seeker');
        const [data, sr, wo] = await Promise.all([dataPromise, srPromise, woPromise]);
        setDashboardData(data);
        setSrStats(sr);
        setWoStats(wo);
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

    loadAll();
  }, [userRole, toast, user]);

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

  // Team Member Dashboard (reusing individual view for now)
  const renderTeamMemberDashboard = () => renderIndividualDashboard();

  // Individual/Partner Dashboard
  const renderIndividualDashboard = () => (
    <div className="space-y-8">
      {/* Top Section - Registration Number and Quick Actions */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Registration Number Card */}
        {mockProfileCompletion.isCompleted && (
        <Card className="shadow-sm border min-h-[280px]">
        
          <CardContent className="p-8 h-full flex items-center justify-center">
            <div className="text-center space-y-3">
              <Shield className="h-12 w-12 text-gray-400 mx-auto" />
              
                <>
                  <div className="text-xl font-semibold text-gray-900">
                    PRN-315782
                  </div>
                  <p className="text-sm text-gray-500">Permanent Registration Number (PRN): 315782</p>
                </>
              
            </div>
          </CardContent>
          
        </Card>
)}
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
              
              <Button 
                onClick={() => navigate('/create-service-request')}
                className="w-full bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Raise Service Request
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
              <div className="text-4xl font-bold text-blue-600 mb-2">{srStats ? srStats.open : 0}</div>
              <p className="text-sm font-medium text-blue-700">Open Service Request(s)</p>
            </div>
            <div className="text-center p-6 bg-orange-50 border border-orange-100 rounded-lg">
              <div className="text-4xl font-bold text-orange-600 mb-2">{woStats ? (woStats.total - woStats.completed) : 0}</div>
              <p className="text-sm font-medium text-orange-700">Open Work Order(s)</p>
            </div>
            <div className="text-center p-6 bg-gray-50 border border-gray-100 rounded-lg">
              <div className="text-4xl font-bold text-gray-600 mb-2">{woStats ? woStats.completed : 0}</div>
              <p className="text-sm font-medium text-gray-700">Closed Work Order(s)</p>
            </div>
            <div className="text-center p-6 bg-green-50 border border-green-100 rounded-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">{srStats ? srStats.closed : 0}</div>
              <p className="text-sm font-medium text-green-700">Closed Service Request(s)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Card */}
      <Card className="shadow-sm border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Package className="h-5 w-5 text-gray-600" />
            Subscriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-8 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {dashboardData?.subscriptions && dashboardData.subscriptions.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.subscriptions.map((subscription) => (
                      <div key={subscription.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{subscription.moduleName}</div>
                              <div className="text-sm text-gray-500">
                                Ends: {new Date(subscription.endDate).toLocaleDateString('en-IN', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </div>
                            </div>
                            <Badge 
                              variant={
                                subscription.status === 'Active' ? 'default' :
                                subscription.status === 'Trial' ? 'secondary' : 'destructive'
                              }
                              className={
                                subscription.status === 'Active' ? 'bg-green-100 text-green-800 border-green-200' :
                                subscription.status === 'Trial' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                'bg-red-100 text-red-800 border-red-200'
                              }
                            >
                              {subscription.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">No Active Subscriptions</p>
                    <p className="text-sm">Subscribe to modules to get started</p>
                  </div>
                )}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    {dashboardData?.subscriptions ? dashboardData.subscriptions.filter(s => s.status === 'Active').length : 0} active subscription(s)
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/subscription">
                      View Packages
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid gap-4 md:grid-cols-2">

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
              {(dashboardData?.notifications ?? []).slice(0, 3).map((n) => (
                <div key={n.id} className={`p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${
                  (n.priority === 'High' || n.type === 'warning') ? 'border-red-200 bg-red-50' : 'border-gray-200'
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{n.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">{n.time}</span>
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
              {(dashboardData?.workspaceModules ?? []).slice(0, 3).map((m) => (
                <div key={m.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium text-sm">{m.name}</p>
                    <p className="text-xs text-muted-foreground">Last visited: {m.lastVisited}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant={m.isSubscribed ? "default" : "secondary"}
                    disabled={!m.isSubscribed}
                  >
                    {m.isSubscribed ? "Open" : "No Access"}
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

      {/* Team Member Dashboard (Individual features - Subscriptions + Assigned Entities) */}
      <div className="space-y-6">
       


     
        {/* Assigned Entities (instead of Subscriptions) */}
        {/* <div className="grid gap-4 md:grid-cols-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                Assigned Entities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(dashboardData?.entities ?? []).map((entity) => (
                  <div key={entity.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{entity.name}</p>
                      <p className="text-sm text-muted-foreground">Modules: {(entity.modulesActivated || []).join(', ')}</p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/entity/${entity.id}`}>
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Details
                      </Link>
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
                {(dashboardData?.workspaceModules ?? []).map((module) => (
                  <div key={module.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{module.name}</p>
                      <p className="text-sm text-muted-foreground">Last visited: {module.lastVisited}</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant={module.isSubscribed ? "default" : "outline"}
                      disabled={!module.isSubscribed}
                      asChild
                    >
                      <Link to="/workspace">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Open
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div> */}

        {/* Search Section */}
        {/* <Card className="shadow-card">
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
        </Card> */}
      </div>
    </div>
  );

  // Entity Admin Dashboard
  const renderEntityAdminDashboard = () => (
    <div className="space-y-6">
      {/* Registration Number & Profile Completion */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Registration Number
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData?.profileCompletion.isCompleted ? (
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
                <span>{dashboardData?.profileCompletion.percentage}%</span>
              </div>
              <Progress value={dashboardData?.profileCompletion.percentage} className="h-2" />
              {dashboardData?.profileCompletion.isCompleted ? (
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
            {(dashboardData?.notifications ?? []).map((n) => (
              <Alert key={n.id} className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                (n.priority === 'High' || n.type === 'warning') ? 'border-destructive bg-destructive/5' : 'border-muted'
              }`}>
                <AlertCircle className={`h-4 w-4 ${
                  (n.priority === 'High' || n.type === 'warning') ? 'text-destructive' : 'text-primary'
                }`} />
                <AlertDescription>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{n.title}</p>
                      <p className="text-sm text-muted-foreground">{n.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{n.time}</span>
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
              <div className="text-2xl font-bold text-blue-600">{srStats ? srStats.open : 0}</div>
              <p className="text-sm text-muted-foreground">Open Service Requests</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{srStats ? srStats.closed : 0}</div>
              <p className="text-sm text-muted-foreground">Closed Service Requests</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{woStats ? (woStats.total - woStats.completed) : 0}</div>
              <p className="text-sm text-muted-foreground">Open Work Orders</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{woStats ? woStats.completed : 0}</div>
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
              {(dashboardData?.subscriptions ?? []).map((subscription) => (
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
              <Link to="/subscription" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Subscription Packages
              </Link>
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
              {(dashboardData?.teamMembers ?? []).map((member) => (
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
              <Link to="/settings?tab=team">
                <Button variant="outline" className="w-full mt-3">
                  <Users className="h-4 w-4 mr-2" />
                  View Team Management
                </Button>
              </Link>
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
              {(dashboardData?.workspaceModules ?? []).map((module) => (
                <div key={module.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{module.name}</p>
                    <p className="text-sm text-muted-foreground">Last visited: {module.lastVisited}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant={module.isSubscribed ? "default" : "outline"}
                    disabled={!module.isSubscribed}
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
        
      </div>

      {/* Role-specific Dashboard Content */}
      {renderRoleSpecificContent()}
    </div>
  );
};
