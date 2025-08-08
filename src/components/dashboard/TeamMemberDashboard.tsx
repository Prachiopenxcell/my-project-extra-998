import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Plus, 
  Eye, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Calendar,
  Bell,
  User,
  BarChart3,
  Target,
  Award
} from "lucide-react";
import { Link } from "react-router-dom";
import { DashboardData, ServiceRequest } from "@/types/dashboard";
import { dashboardService } from "@/services/dashboardService";
import { UserRole } from "@/types/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

interface TeamMemberDashboardProps {
  userRole: UserRole;
}

export const TeamMemberDashboard = ({ userRole }: TeamMemberDashboardProps) => {
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

  const isServiceSeeker = userRole === UserRole.SERVICE_SEEKER_TEAM_MEMBER;
  const dashboardTitle = isServiceSeeker ? "Team Member Dashboard" : "Team Member Dashboard";
  const dashboardDescription = "Track your assigned tasks and contribute to team projects";

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
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            This Week
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

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Assigned Tasks */}
        <div className="lg:col-span-2">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Assigned Tasks</CardTitle>
                  <CardDescription>
                    Tasks assigned to you by your team lead or organization
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/tasks">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardData.serviceRequests && dashboardData.serviceRequests.length > 0 ? (
                dashboardData.serviceRequests.map((request) => (
                  <div key={request.id} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-foreground">{request.title}</h4>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Assigned by: {request.client}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Assigned: {new Date(request.createdDate).toLocaleDateString()}</span>
                          <span>Due: {new Date(request.dueDate).toLocaleDateString()}</span>
                          <span className={getPriorityColor(request.priority)}>
                            {request.priority} Priority
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/tasks/${request.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No tasks assigned yet</p>
                  <p className="text-sm text-muted-foreground">
                    Your team lead will assign tasks to you as projects come in
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Overview */}
          <Card className="shadow-card mt-6">
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>
                Your performance metrics and achievements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 rounded-lg border bg-card text-center">
                  <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">92%</div>
                  <p className="text-sm text-muted-foreground">Task Completion Rate</p>
                </div>
                <div className="p-4 rounded-lg border bg-card text-center">
                  <Clock className="h-8 w-8 text-info mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">4.2</div>
                  <p className="text-sm text-muted-foreground">Avg. Days per Task</p>
                </div>
                <div className="p-4 rounded-lg border bg-card text-center">
                  <Award className="h-8 w-8 text-warning mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">15</div>
                  <p className="text-sm text-muted-foreground">Tasks Completed</p>
                </div>
              </div>
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
                <Link to="/tasks">
                  <FileText className="h-4 w-4 mr-2" />
                  View All Tasks
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/meetings">
                  <Calendar className="h-4 w-4 mr-2" />
                  My Meetings
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/timesheet">
                  <Clock className="h-4 w-4 mr-2" />
                  Submit Timesheet
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/profile">
                  <User className="h-4 w-4 mr-2" />
                  Update Profile
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Team Information */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Team Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Organization</span>
                </div>
                <p className="text-sm text-muted-foreground">Tech Solutions Pvt Ltd</p>
              </div>
              <div className="p-3 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Department</span>
                </div>
                <p className="text-sm text-muted-foreground">Development Team</p>
              </div>
              <div className="p-3 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Team Lead</span>
                </div>
                <p className="text-sm text-muted-foreground">Jane Smith</p>
              </div>
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
    </div>
  );
};
