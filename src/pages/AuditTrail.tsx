import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Activity, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  FileText, 
  Eye, 
  Edit, 
  Trash2,
  Upload,
  Share,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  CalendarDays,
  Plus,
  MessageSquare,
  RefreshCw,
  Users,
  Globe,
  Smartphone,
  Mail,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useParams } from "react-router-dom";

const AuditTrail = () => {
  const { roomId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");
  const [dateRange, setDateRange] = useState("last30days");

  const auditLogs = [
    {
      id: 1,
      timestamp: "Dec 18, 2023 - 14:32:15",
      user: "Sarah Smith",
      action: "UPLOADED",
      resource: "Investment_Term_Sheet_v3.pdf",
      location: "/Financial Documents/",
      ip: "192.168.1.45",
      device: "Chrome/Mac",
      details: "File uploaded successfully"
    },
    {
      id: 2,
      timestamp: "Dec 18, 2023 - 13:45:22",
      user: "Mike Johnson",
      action: "COMMENTED",
      resource: "Company_Overview_2023.pptx",
      location: "/Business Plans/",
      ip: "203.45.67.89",
      device: "Safari/iPhone",
      details: "Please update slide 15 with latest revenue figures"
    },
    {
      id: 3,
      timestamp: "Dec 18, 2023 - 12:15:33",
      user: "John Doe",
      action: "SHARED",
      resource: "Financial Documents folder",
      location: "/",
      ip: "192.168.1.42",
      device: "Chrome/Windows",
      details: "With: alex.kim@startup.com (Editor access) • Invitation sent via email"
    },
    {
      id: 4,
      timestamp: "Dec 18, 2023 - 11:28:17",
      user: "Sarah Smith",
      action: "EDITED",
      resource: "Investment_Term_Sheet_v2.pdf",
      location: "/Financial Documents/",
      ip: "192.168.1.45",
      device: "Chrome/Mac",
      details: "Version 2.1 → 2.2 (Minor revision)"
    },
    {
      id: 5,
      timestamp: "Dec 17, 2023 - 16:42:08",
      user: "System (Auto-Sync)",
      action: "SYNCED",
      resource: "Director details from Entity Module",
      location: "/Data Records/",
      ip: "System",
      device: "AI-powered data synchronization",
      details: "Updated 3 records in Data Records Room"
    }
  ];

  const getActionIcon = (action: string) => {
    switch (action) {
      case "UPLOADED":
        return <Upload className="h-4 w-4 text-blue-600" />;
      case "COMMENTED":
        return <MessageSquare className="h-4 w-4 text-green-600" />;
      case "SHARED":
        return <Share className="h-4 w-4 text-purple-600" />;
      case "EDITED":
        return <Edit className="h-4 w-4 text-orange-600" />;
      case "SYNCED":
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "UPLOADED":
        return "bg-blue-100 text-blue-800";
      case "COMMENTED":
        return "bg-green-100 text-green-800";
      case "SHARED":
        return "bg-purple-100 text-purple-800";
      case "EDITED":
        return "bg-orange-100 text-orange-800";
      case "SYNCED":
        return "bg-blue-50 text-blue-700";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Audit Trail & Activity Log</h1>
            <p className="text-muted-foreground">Track all activities, changes, and access logs</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="h-9">
              <CalendarDays className="mr-2 h-4 w-4" />
              This Month
            </Button>
            <Button size="sm" className="h-9">
              <Download className="mr-2 h-4 w-4" />
              Export Log
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Activity className="mr-2 h-4 w-4 text-primary" />
                Total Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">
                +89 from yesterday
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <User className="mr-2 h-4 w-4 text-primary" />
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                Currently active
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Shield className="mr-2 h-4 w-4 text-primary" />
                Security Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">
                Require attention
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4 text-primary" />
                Failed Attempts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                Last 24 hours
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filter & Search */}
        <Card>
          <CardHeader>
            <CardTitle>Filter & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="last7days">Last 7 days</SelectItem>
                  <SelectItem value="last30days">Last 30 days</SelectItem>
                  <SelectItem value="last90days">Last 90 days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>

              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger>
                  <Users className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="User" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="john">John Doe</SelectItem>
                  <SelectItem value="sarah">Sarah Smith</SelectItem>
                  <SelectItem value="mike">Mike Johnson</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>

              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <Activity className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="upload">Upload</SelectItem>
                  <SelectItem value="download">Download</SelectItem>
                  <SelectItem value="share">Share</SelectItem>
                  <SelectItem value="edit">Edit</SelectItem>
                  <SelectItem value="comment">Comment</SelectItem>
                  <SelectItem value="sync">Sync</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Activity Log */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {auditLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getActionIcon(log.action)}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">🕐 {log.timestamp}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">👤 {log.user}</span>
                          <Badge className={`text-xs ${getActionColor(log.action)}`}>
                            {log.action}
                          </Badge>
                          <span className="text-sm">{log.resource}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          📍 Location: {log.location}
                        </div>
                        {log.details && (
                          <div className="text-sm text-muted-foreground">
                            💭 {log.details}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        IP: {log.ip}
                      </div>
                      <div className="flex items-center gap-1">
                        <Smartphone className="h-3 w-3" />
                        Device: {log.device}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Export & Compliance */}
        <Card>
          <CardHeader>
            <CardTitle>Export & Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Export to PDF
                </Button>
                <Button variant="outline">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Export to CSV
                  </div>
                </Button>
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Report
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm text-muted-foreground">⚖️ Compliance: Ready for audit review</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  ⏮️
                </Button>
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">Page 1 of 12</span>
                <Button variant="outline" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  ⏭️
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show:</span>
                <select className="border rounded px-2 py-1 text-sm">
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <span className="text-sm text-muted-foreground">per page</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AuditTrail;
