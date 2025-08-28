import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
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
  Building,
  Briefcase,
  UserPlus,
  Shield,
  FileText,
  DollarSign
} from "lucide-react";
import { Link } from "react-router-dom";
import { DashboardData, TeamMember, Entity, WorkOrder } from "@/types/dashboard";
import { dashboardService } from "@/services/dashboardService";
import { UserRole } from "@/types/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

interface EntityAdminDashboardProps {
  userRole: UserRole;
}

export const EntityAdminDashboard = ({ userRole }: EntityAdminDashboardProps) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
      case "Active":
        return "bg-success text-success-foreground";
      case "Inactive":
        return "bg-muted text-muted-foreground";
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

  if (!dashboardData) return null;

  const isServiceSeeker = userRole === UserRole.SERVICE_SEEKER_ENTITY_ADMIN;
  const dashboardTitle = isServiceSeeker ? "Service Seeker Entity Dashboard" : "Service Provider Entity Dashboard";
  const dashboardDescription = isServiceSeeker 
    ? "Manage your organization's service requests and team members"
    : "Manage your organization's projects, team, and client relationships";

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{dashboardTitle}</h1>
          <p className="text-muted-foreground">
            {dashboardDescription}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link to="/reports?period=month">
              <Calendar className="h-4 w-4 mr-2" />
              This Month
            </Link>
          </Button>
          <Button asChild>
            <Link to="/team/invite">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Team Member
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardData.stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
              <CardTitle className="text-warning">Complete Your Organization Profile</CardTitle>
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
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team Management</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="entities">Entities</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>
                        Latest activities across your organization
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/activity">View All</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dashboardData.recentActivity.map((activity) => (
                    <div key={activity.id} className="p-4 rounded-lg border bg-card">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-foreground">{activity.action}</h4>
                            <span className="text-xs text-muted-foreground">{activity.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {activity.description}
                          </p>
                          {activity.user && (
                            <p className="text-xs text-muted-foreground">
                              By: {activity.user} • Module: {activity.module}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
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
                    <Link to="/team/invite">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Invite Team Member
                    </Link>
                  </Button>
                  {/* <Button className="w-full justify-start" variant="outline" asChild>
                    <Link to={isServiceSeeker ? "/service-requests/create" : "/work-orders/create"}>
                      <Plus className="h-4 w-4 mr-2" />
                      {isServiceSeeker ? "New Service Request" : "New Work Order"}
                    </Link>
                  </Button> */}
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link to="/entity-management">
                      <Building className="h-4 w-4 mr-2" />
                      Manage Entities
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

              {/* Notifications */}
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Notifications</CardTitle>
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

        <TabsContent value="team" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    Manage your organization's team members and their access
                  </CardDescription>
                </div>
                <Button asChild>
                  <Link to="/team/invite">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Member
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {dashboardData.teamMembers && dashboardData.teamMembers.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.teamMembers.map((member) => (
                    <div key={member.id} className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{member.name}</h4>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <Badge className={getStatusColor(member.status)}>
                              {member.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              Last login: {new Date(member.lastLogin).toLocaleDateString()}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/team/${member.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No team members yet</p>
                  <Button asChild>
                    <Link to="/team/invite">Invite First Member</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{isServiceSeeker ? "Service Requests" : "Active Projects"}</CardTitle>
                  <CardDescription>
                    {isServiceSeeker ? "Track your organization's service requests" : "Monitor ongoing projects and deliverables"}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to={isServiceSeeker ? "/service-requests" : "/work-orders"}>View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {dashboardData.workOrders && dashboardData.workOrders.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.workOrders.map((order) => (
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
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    {isServiceSeeker ? "No service requests yet" : "No active projects"}
                  </p>
                  <Button asChild>
                    <Link to={isServiceSeeker ? "/service-requests/create" : "/work-orders/create"}>
                      {isServiceSeeker ? "Create First Request" : "Create First Project"}
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entities" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Managed Entities</CardTitle>
                  <CardDescription>
                    Organizations and entities under your management
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/entity-management">Manage All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {dashboardData.entities && dashboardData.entities.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.entities.map((entity) => (
                    <div key={entity.id} className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Building className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{entity.name}</h4>
                            <p className="text-sm text-muted-foreground">{entity.type}</p>
                            <p className="text-xs text-muted-foreground">
                              Modules: {entity.modulesActivated.join(", ")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <Badge className={getStatusColor(entity.status)}>
                              {entity.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              Last accessed: {new Date(entity.lastAccessed).toLocaleDateString()}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/entity-management/${entity.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No entities managed</p>
                  <Button asChild>
                    <Link to="/entity-management/create">Create First Entity</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
