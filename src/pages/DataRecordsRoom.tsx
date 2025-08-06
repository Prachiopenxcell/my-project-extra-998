import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building, 
  Plus, 
  Download, 
  RefreshCw, 
  Database, 
  Users, 
  DollarSign, 
  Scale, 
  CheckCircle, 
  AlertTriangle,
  Bot,
  Eye,
  Edit,
  FileSpreadsheet,
  CalendarDays,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";

const DataRecordsRoom = () => {
  const [activeTab, setActiveTab] = useState("recent");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");

  const entityInfo = {
    name: "ABC Corp Ltd",
    type: "Private Limited Company",
    cin: "U12345AB2020PTC123456"
  };

  const recordCategories = [
    {
      id: 1,
      title: "Basic Information",
      description: "Company details, registration info",
      recordCount: 12,
      status: "updated",
      lastUpdate: "Updated Today",
      icon: Building,
      statusColor: "text-green-600"
    },
    {
      id: 2,
      title: "Board of Directors",
      description: "Directors, KMPs, committee members",
      recordCount: 8,
      status: "pending",
      lastUpdate: "2 days ago",
      icon: Users,
      statusColor: "text-yellow-600"
    },
    {
      id: 3,
      title: "Shareholding Patterns",
      description: "Equity structure, shareholding details",
      recordCount: 15,
      status: "warning",
      lastUpdate: "1 week ago",
      icon: Database,
      statusColor: "text-orange-600"
    },
    {
      id: 4,
      title: "Creditors and Claims",
      description: "Financial creditors, operational creditors",
      recordCount: 24,
      status: "pending",
      lastUpdate: "3 days ago",
      icon: DollarSign,
      statusColor: "text-blue-600"
    },
    {
      id: 5,
      title: "Legal Representatives",
      description: "Advocates, legal advisors, consultants",
      recordCount: 5,
      status: "updated",
      lastUpdate: "1 week ago",
      icon: Scale,
      statusColor: "text-green-600"
    },
    {
      id: 6,
      title: "CIRP/Liquidation Status",
      description: "Process status, timelines, committees",
      recordCount: 18,
      status: "updated",
      lastUpdate: "5 days ago",
      icon: CheckCircle,
      statusColor: "text-green-600"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "updated":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "updated":
        return "Updated";
      case "pending":
        return "Pending";
      case "warning":
        return "Warning";
      default:
        return "Unknown";
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Data Records Room & Management</h1>
            <p className="text-muted-foreground">Centralized entity data & cross-module syncing</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="h-9">
              <CalendarDays className="mr-2 h-4 w-4" />
              This Month
            </Button>
            <Link to="/data-room/data-records/create">
              <Button size="sm" className="h-9">
                <Plus className="mr-2 h-4 w-4" />
                Create Record
              </Button>
            </Link>
          </div>
        </div>

        {/* Data Records Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Database className="mr-2 h-4 w-4 text-primary" />
                Record Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recordCategories.length}</div>
              <p className="text-xs text-muted-foreground">
                Data categories
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                Total Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recordCategories.reduce((sum, cat) => sum + cat.recordCount, 0)}</div>
              <p className="text-xs text-muted-foreground">
                Across all categories
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Bot className="mr-2 h-4 w-4 text-primary" />
                Auto-Sync Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">
                Records synced
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4 text-primary" />
                Conflicts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                Require review
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Entity Selector */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Entity Context</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Current Entity: {entityInfo.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Entity Type: {entityInfo.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">CIN: {entityInfo.cin}</span>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm">
                Change Entity ▼
              </Button>
            </div>
          </CardContent>
        </Card>



        {/* View Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="all">All Records</TabsTrigger>
              <TabsTrigger value="synced">Auto-Synced Data</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">Filter:</span>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="basic">Basic Info</SelectItem>
                    <SelectItem value="directors">Directors</SelectItem>
                    <SelectItem value="shareholding">Shareholding</SelectItem>
                    <SelectItem value="creditors">Creditors</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="cirp">CIRP</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="updated">Updated</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm">Sort:</span>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Latest" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Latest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="alphabetical">A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Import Data
                </Button>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Auto-Sync
                </Button>
              </div>
            </div>
          </div>

          <TabsContent value="recent" className="mt-0">
            <div className="border rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 pl-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Records</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Update</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recordCategories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <tr key={category.id} className="border-b hover:bg-muted/50 transition-colors duration-200">
                        <td className="p-3 pl-4">
                          <div className="flex items-center gap-3">
                            <Icon className="h-4 w-4 text-primary" />
                            <div>
                              <div className="font-medium">{category.title}</div>
                              <div className="text-xs text-muted-foreground">{category.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium py-1">
                            {category.recordCount} records
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            {getStatusIcon(category.status)}
                            <span className="text-sm">{getStatusText(category.status)}</span>
                          </div>
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">{category.lastUpdate}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm">
                              <FileSpreadsheet className="h-4 w-4 mr-1" />
                              Export
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Records</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">All records view - comprehensive list of all data records</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="synced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Auto-Synced Data</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Data automatically synchronized from other modules</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* AI Sync Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Sync Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium">🤖 Auto-Sync: ✅ Enabled</span>
                </div>
                <span className="text-sm text-muted-foreground">Last Sync: 15 mins ago</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-blue-600" />
                  <span>📊 Synced 47 records from 5 modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span>⚠️ 3 conflicts require manual review</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Now
                </Button>
                <Button variant="outline" size="sm">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Review Conflicts
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DataRecordsRoom;
