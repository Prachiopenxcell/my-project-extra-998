import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  DollarSign,
  Calendar
} from "lucide-react";

const Dashboard = () => {
  // Mock data - would come from API
  const stats = [
    {
      title: "Active Work Orders",
      value: "12",
      change: "+20.1%",
      icon: FileText,
      color: "text-info"
    },
    {
      title: "Completed Projects",
      value: "48",
      change: "+180.1%",
      icon: CheckCircle,
      color: "text-success"
    },
    {
      title: "Total Revenue",
      value: "₹54,680",
      change: "+19%",
      icon: DollarSign,
      color: "text-primary"
    },
    {
      title: "Active Bids",
      value: "8",
      change: "+12%",
      icon: TrendingUp,
      color: "text-warning"
    }
  ];

  const workOrders = [
    {
      id: "WO-2023-1005",
      title: "Financial Analysis Report Q3 2023",
      client: "Acme Corporation",
      status: "In Progress",
      progress: 75,
      dueDate: "15 Jun 2023",
      amount: "₹35,000"
    },
    {
      id: "WO-2023-1006",
      title: "System Integration Project",
      client: "Tech Solutions Inc",
      status: "Review",
      progress: 90,
      dueDate: "20 Jun 2023",
      amount: "₹48,500"
    },
    {
      id: "WO-2023-1007",
      title: "Compliance Audit",
      client: "Healthcare Ltd",
      status: "Planning",
      progress: 25,
      dueDate: "30 Jun 2023",
      amount: "₹22,000"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: "New service request received",
      description: "Digital Marketing Strategy for E-commerce Platform",
      time: "2 hours ago",
      type: "service_request"
    },
    {
      id: 2,
      action: "Work order completed",
      description: "Financial Analysis Report Q2 2023",
      time: "4 hours ago",
      type: "completion"
    },
    {
      id: 3,
      action: "Payment received",
      description: "₹25,000 from Tech Solutions Inc",
      time: "6 hours ago",
      type: "payment"
    },
    {
      id: 4,
      action: "New bid submitted",
      description: "Mobile App Development Project",
      time: "1 day ago",
      type: "bid"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-info text-info-foreground";
      case "Review":
        return "bg-warning text-warning-foreground";
      case "Planning":
        return "bg-secondary text-secondary-foreground";
      case "Completed":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "service_request":
        return <FileText className="h-4 w-4 text-info" />;
      case "completion":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "payment":
        return <DollarSign className="h-4 w-4 text-primary" />;
      case "bid":
        return <TrendingUp className="h-4 w-4 text-warning" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <DashboardLayout userType="service_provider">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your business today.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              This Month
            </Button>
            <Button variant="professional">Create New Project</Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
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
                    {stat.change} from last month
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
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
                  <Button variant="outline" size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {workOrders.map((order) => (
                  <div key={order.id} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">{order.title}</h4>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{order.client}</p>
                        <p className="text-xs text-muted-foreground">ID: {order.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{order.amount}</p>
                        <p className="text-xs text-muted-foreground">Due: {order.dueDate}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-foreground font-medium">{order.progress}%</span>
                      </div>
                      <Progress value={order.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest updates and notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-card hover:shadow-elegant transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground">Browse Requests</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Find new service opportunities
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-card hover:shadow-elegant transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-success mx-auto mb-3" />
              <h3 className="font-semibold text-foreground">Submit Bid</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Propose your services
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-card hover:shadow-elegant transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-info mx-auto mb-3" />
              <h3 className="font-semibold text-foreground">Team Management</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your team members
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-card hover:shadow-elegant transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-warning mx-auto mb-3" />
              <h3 className="font-semibold text-foreground">Schedule Meeting</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Plan project discussions
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;