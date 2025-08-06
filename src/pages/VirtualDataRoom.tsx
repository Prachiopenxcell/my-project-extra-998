import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FolderOpen, 
  Database, 
  Users, 
  FileText, 
  Shield,
  Activity,
  Plus,
  ChevronRight,
  Building,
  CalendarDays
} from "lucide-react";
import { Link } from "react-router-dom";

const VirtualDataRoom = () => {
  const vdrStats = {
    activeRooms: 3,
    totalDocuments: 247,
    sharedUsers: 12,
    accessRequests: 2
  };

  const recentActivity = [
    {
      id: 1,
      action: "Financial_Report_Q3.pdf",
      type: "Modified",
      time: "2 hrs ago",
      icon: FileText
    },
    {
      id: 2,
      action: "Due Diligence Room",
      type: "Accessed",
      time: "4 hrs ago",
      icon: FolderOpen
    },
    {
      id: 3,
      action: "Board_Resolution_Dec23.docx",
      type: "Shared",
      time: "1 day ago",
      icon: Users
    },
    {
      id: 4,
      action: "CIRP Documentation",
      type: "Created",
      time: "2 days ago",
      icon: Plus
    }
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Virtual Data Room</h1>
            <p className="text-muted-foreground">Secure document collaboration and entity data management</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="h-9">
              <CalendarDays className="mr-2 h-4 w-4" />
              This Month
            </Button>
          </div>
        </div>

        {/* VDR Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <FolderOpen className="mr-2 h-4 w-4 text-primary" />
                Active Rooms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vdrStats.activeRooms}</div>
              <p className="text-xs text-muted-foreground">
                Document storage rooms
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <FileText className="mr-2 h-4 w-4 text-primary" />
                Total Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vdrStats.totalDocuments}</div>
              <p className="text-xs text-muted-foreground">
                Across all rooms
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="mr-2 h-4 w-4 text-primary" />
                Shared Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vdrStats.sharedUsers}</div>
              <p className="text-xs text-muted-foreground">
                With access permissions
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Shield className="mr-2 h-4 w-4 text-primary" />
                Access Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vdrStats.accessRequests}</div>
              <p className="text-xs text-muted-foreground">
                Pending approvals
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Module Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link to="/data-room/document-storage">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                    <FolderOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg mb-2">Document Storage & Management</CardTitle>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Secure document collaboration with granular access control and version management
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <FolderOpen className="h-4 w-4" />
                    <span>3 Active Rooms</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4" />
                    <span>247 Documents</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/data-room/data-records">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg mb-2">Data Records Room & Management</CardTitle>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Centralized entity data management with cross-module synchronization and AI-powered insights
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Database className="h-4 w-4" />
                    <span>6 Categories</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Activity className="h-4 w-4" />
                    <span>Auto-Sync Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 pl-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Activity</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <tr key={activity.id} className="border-b hover:bg-muted/50 transition-colors duration-200">
                        <td className="p-3 pl-4">
                          <div className="flex items-center gap-3">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <div className="font-medium">{activity.action}</div>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium py-1">
                            {activity.type}
                          </Badge>
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">{activity.time}</td>
                        <td className="p-3">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                View All Recent Activity
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Entity Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Entity Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Current Entity: ABC Corp Ltd</span>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  Change Entity ▼
                </Button>
                <Link to="/data-room/document-storage/create-room">
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Room
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default VirtualDataRoom;
