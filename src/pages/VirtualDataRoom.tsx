import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  CalendarDays,
  AlertTriangle,
  Settings,
  BarChart3,
  Link as LinkIcon,
  CheckCircle,
  Clock,
  ArrowUpRight
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const VirtualDataRoom = () => {
  const navigate = useNavigate();
  const [selectedEntity, setSelectedEntity] = useState("abc-corp");
  
  // Mock data - replace with actual API calls
  const entities = [
    { id: "abc-corp", name: "ABC Corporation Ltd", type: "Corporate Debtor", status: "Active", cin: "L12345MH2020PLC" }
  ];
  
  const currentEntity = entities.find(e => e.id === selectedEntity);
  const hasMinimumEntities = entities.length >= 1; // Adjust based on requirements

  const recentActivity = [
    {
      id: 1,
      action: "Q3 Audit Files - Document room created",
      time: "2 hours ago",
      icon: FolderOpen,
      type: "created"
    },
    {
      id: 2,
      action: "Board Resolution.pdf shared with audit@firm.com (Editor access)",
      time: "4 hours ago",
      icon: Users,
      type: "shared"
    },
    {
      id: 3,
      action: "CIRP Data Records synced from Claims Module",
      time: "1 day ago",
      icon: Database,
      type: "synced"
    },
    {
      id: 4,
      action: "Financial Creditors data updated by Auto-Sync",
      time: "2 days ago",
      icon: CheckCircle,
      type: "updated"
    }
  ];

  return (
    <DashboardLayout userType="service_provider">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Virtual Data Room</h1>
            <p className="text-muted-foreground">
              Secure document sharing and collaboration platform
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="h-9">
              <CalendarDays className="mr-2 h-4 w-4" />
              This Month
            </Button>
            <Button size="sm" className="h-9" onClick={() => navigate('/data-room/create-room')}>
              <Plus className="mr-2 h-4 w-4" />
              Create Room
            </Button>
          </div>
        </div>

        {/* Entity Validation Check */}
        {!hasMinimumEntities && (
          <Alert className="border-orange-200 bg-orange-50 mb-8">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <div className="space-y-2">
                <p className="font-semibold">ENTITY VALIDATION CHECK</p>
                <p>You need at least 1 entity to proceed with VDR module</p>
                <p>Current Entities: {entities.length} | Required: 1</p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" onClick={() => navigate('/entity-management')}>
                    <LinkIcon className="h-3 w-3 mr-1" />
                    Subscribe to Entity Module
                  </Button>
                  <Button size="sm" onClick={() => navigate('/create-entity')}>
                    <Plus className="h-3 w-3 mr-1" />
                    Create New Entity
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Entity Selection */}
        {hasMinimumEntities && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Entity Selection for VDR Access</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Entity:</label>
                  <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an entity" />
                    </SelectTrigger>
                    <SelectContent>
                      {entities.map((entity) => (
                        <SelectItem key={entity.id} value={entity.id}>
                          {entity.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {currentEntity && (
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{currentEntity.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Entity Type: {currentEntity.type} • Status: 
                        <Badge variant="secondary" className="ml-1">{currentEntity.status}</Badge>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        CIN: {currentEntity.cin}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate('/entity-management')}>
                      <Settings className="h-4 w-4 mr-2" />
                      Entity Settings
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* VDR Modules */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Document Storage & Management */}
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FolderOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Document Storage & Management</CardTitle>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Granular Access</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Collaboration</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Version Control</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Audit Trail</span>
                </div>
              </div>
              <div className="mt-6">
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/data-room/document-storage')}
                >
                  Enter Module
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Data Records Room & Management */}
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Database className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Data Records Room & Management</CardTitle>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Central Repository</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Cross-Module Sync</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>AI Data Mapping</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Process-Based Org</span>
                </div>
              </div>
              <div className="mt-6">
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/data-room/data-records')}
                >
                  Enter Module
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent VDR Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'created' ? 'bg-blue-100' :
                      activity.type === 'shared' ? 'bg-purple-100' :
                      activity.type === 'synced' ? 'bg-green-100' :
                      'bg-orange-100'
                    }`}>
                      <Icon className={`h-4 w-4 ${
                        activity.type === 'created' ? 'text-blue-600' :
                        activity.type === 'shared' ? 'text-purple-600' :
                        activity.type === 'synced' ? 'text-green-600' :
                        'text-orange-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-4">
          <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2" onClick={() => navigate('/data-room/create-document-storage-room')}>
            <Plus className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Create Room</div>
              <div className="text-xs text-muted-foreground">New VDR workspace</div>
            </div>
          </Button>
          
          <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2" onClick={() => navigate('/data-room/manage-access')}>
            <Users className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Manage Access</div>
              <div className="text-xs text-muted-foreground">User permissions</div>
            </div>
          </Button>
          
          <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2" onClick={() => navigate('/data-room/analytics')}>
            <BarChart3 className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">View Analytics</div>
              <div className="text-xs text-muted-foreground">Usage reports</div>
            </div>
          </Button>
          
          <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2" onClick={() => navigate('/data-room/settings')}>
            <Settings className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">VDR Settings</div>
              <div className="text-xs text-muted-foreground">Configure options</div>
            </div>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VirtualDataRoom;
