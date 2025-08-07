import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { 
  Search, 
  Plus, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Building,
  Eye,
  FileText,
  BarChart3,
  Zap,
  Activity,
  Users,
  Filter,
  Edit,
  Trash2,
  MoreHorizontal
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface ComplianceStats {
  active: number;
  overdue: number;
  completed: number;
  upcoming: number;
}

interface EntityCompliance {
  id: string;
  name: string;
  type: string;
  active: number;
  overdue: number;
  status: 'good' | 'warning' | 'critical';
}

interface RecentActivity {
  id: string;
  title: string;
  entity: string;
  time: string;
  type: 'filed' | 'reminder' | 'completed';
}

interface AIInsight {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

const RegulatoryCompliance = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - replace with actual API calls
  const [stats, setStats] = useState<ComplianceStats>({
    active: 24,
    overdue: 3,
    completed: 18,
    upcoming: 7
  });

  const [entities, setEntities] = useState<EntityCompliance[]>([
    {
      id: "1",
      name: "ABC Corp Ltd",
      type: "Pvt",
      active: 12,
      overdue: 2,
      status: "warning"
    },
    {
      id: "2", 
      name: "XYZ Partnership",
      type: "LLP",
      active: 8,
      overdue: 0,
      status: "good"
    },
    {
      id: "3",
      name: "Tech Innovations",
      type: "Pvt",
      active: 15,
      overdue: 1,
      status: "warning"
    },
    {
      id: "4",
      name: "StartUp Ventures",
      type: "OPC",
      active: 6,
      overdue: 0,
      status: "good"
    }
  ]);

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([
    {
      id: "1",
      title: "GST Return filed",
      entity: "ABC Corp",
      time: "2h ago",
      type: "filed"
    },
    {
      id: "2",
      title: "Income Tax due reminder sent",
      entity: "XYZ Partnership",
      time: "4h ago",
      type: "reminder"
    },
    {
      id: "3",
      title: "SEBI filing completed",
      entity: "Tech Innovations",
      time: "1d ago",
      type: "completed"
    }
  ]);

  const [aiInsights, setAiInsights] = useState<AIInsight[]>([
    {
      id: "1",
      title: "3 new regulations detected for your pharma entities",
      description: "New pharmaceutical compliance requirements identified",
      priority: "high"
    },
    {
      id: "2",
      title: "ESI compliance gap identified for ABC Corp",
      description: "Missing ESI registration for new employees",
      priority: "medium"
    },
    {
      id: "3",
      title: "Recommend early filing for upcoming GST deadlines",
      description: "Beat the rush and avoid last-minute issues",
      priority: "low"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  // CRUD Functions
  const handleViewEntity = (entityId: string) => {
    navigate(`/compliance/tracking?entity=${entityId}`);
  };

  const handleEditEntity = (entityId: string) => {
    navigate(`/compliance/setup?edit=${entityId}`);
  };

  const handleDeleteEntity = (entityId: string) => {
    setEntityToDelete(entityId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteEntity = () => {
    if (entityToDelete) {
      setEntities(entities.filter(entity => entity.id !== entityToDelete));
      toast({
        title: "Entity Removed",
        description: "The entity has been successfully removed from compliance tracking.",
      });
      setDeleteDialogOpen(false);
      setEntityToDelete(null);
    }
  };

  return (
    <DashboardLayout userType="service_provider">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Regulatory Compliance</h1>
            <p className="text-muted-foreground">Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="this-quarter">This Quarter</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => navigate('/compliance/setup')} size="sm" className="h-9">
              <Plus className="mr-2 h-4 w-4" />
              Create New Compliance
            </Button>
          </div>
        </div>

        {/* Welcome Message */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-blue-800 font-medium">
              Welcome back! Manage your regulatory obligations with ease
            </p>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <FileText className="mr-2 h-4 w-4 text-primary" />
                Active Compliances
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                +15% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                Overdue Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="mr-1 h-3 w-3 text-red-500" />
                2 new since last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Completed This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                +22% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-primary" />
                Upcoming This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcoming}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1 cursor-pointer hover:underline">
                <BarChart3 className="mr-1 h-3 w-3" />
                View Calendar
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Entity Status Table */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Compliance Status by Entity
              </CardTitle>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Entity Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Active</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Overdue</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {entities.map((entity) => (
                    <tr key={entity.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{entity.name}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{entity.type}</Badge>
                      </td>
                      <td className="py-3 px-4">{entity.active}</td>
                      <td className="py-3 px-4">
                        <span className={entity.overdue > 0 ? 'text-red-600 font-medium' : ''}>
                          {entity.overdue}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusIcon(entity.status)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewEntity(entity.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditEntity(entity.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteEntity(entity.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between mt-4 pt-4 border-t">
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                View All Entities
              </Button>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Generate Entity Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {activity.type === 'filed' && <CheckCircle className="w-5 h-5 text-green-500" />}
                      {activity.type === 'reminder' && <Clock className="w-5 h-5 text-orange-500" />}
                      {activity.type === 'completed' && <CheckCircle className="w-5 h-5 text-blue-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.entity} - {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="link" className="mt-4 p-0">
                View All Activity
              </Button>
            </CardContent>
          </Card>

          {/* AI Compliance Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                AI Compliance Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiInsights.map((insight) => (
                  <div key={insight.id} className="border-l-4 border-blue-500 pl-4">
                    <p className="text-sm font-medium text-gray-900">{insight.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                  </div>
                ))}
              </div>
              <Button variant="link" className="mt-4 p-0">
                View AI Recommendations
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove this entity from compliance tracking? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteEntity}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default RegulatoryCompliance;
