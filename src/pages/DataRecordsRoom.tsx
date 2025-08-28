import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Database, 
  FileText, 
  Plus, 
  Eye, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  BarChart3,
  Phone
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DataRecordsRoom = () => {
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState("entity");
  const [selectedSection, setSelectedSection] = useState("basic-info");
  
  const syncSettings = {
    autoSync: true,
    realTimeUpdates: true,
    syncFrequency: "2-hours",
    conflictResolution: "manual"
  };

  const mappedFields = [
    { source: "Company Name", target: "Entity.company_name" },
    { source: "CIN Number", target: "Entity.cin" },
    { source: "Registered Address", target: "Entity.registered_address" },
    { source: "ROC Registration", target: "Entity.roc_details" }
  ];

  const syncHistory = [
    { time: "Today 2:15 PM", action: "4 records updated" },
    { time: "Today 12:30 PM", action: "1 record added" },
    { time: "Yesterday 6:45 PM", action: "2 records modified" }
  ];

  const conflicts = [
    {
      id: 1,
      title: "Board Member Data Mismatch",
      source1: "Meetings Module: John Doe - Executive Director",
      source2: "Data Records: John Doe - Managing Director",
      type: "role_mismatch"
    },
    {
      id: 2,
      title: "Creditor Amount Discrepancy",
      source1: "Claims Module: SBI - ₹25,50,00,000",
      source2: "Data Records: SBI - ₹25,00,00,000",
      type: "amount_mismatch"
    }
  ];

  const errorLogs = [
    {
      id: 1,
      module: "Litigation Module",
      error: "API endpoint not responding - Connection timeout",
      time: "3 days ago",
      severity: "error"
    },
    {
      id: 2,
      module: "E-Voting Module",
      error: "5 member records could not be matched",
      time: "3 days ago",
      severity: "warning"
    }
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Data Records Room & Management</h1>
            <p className="text-muted-foreground">
              Central repository for cross-module data synchronization and AI-powered data mapping
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="h-9">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
            <Button size="sm" className="h-9" onClick={() => navigate('/data-room/create-data-record')}>
              <Plus className="mr-2 h-4 w-4" />
              Create Record
            </Button>
          </div>
        </div>

        {/* Module Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Module & Section Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Selected:</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                🟢 Entity Module → Basic Information
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Module:</label>
                <Select value={selectedModule} onValueChange={setSelectedModule}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entity">Entity Module</SelectItem>
                    <SelectItem value="meetings">Meetings Module</SelectItem>
                    <SelectItem value="claims">Claims Module</SelectItem>
                    <SelectItem value="litigation">Litigation Module</SelectItem>
                    <SelectItem value="evoting">E-Voting Module</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Section:</label>
                <Select value={selectedSection} onValueChange={setSelectedSection}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic-info">Basic Information</SelectItem>
                    <SelectItem value="financial">Financial Data</SelectItem>
                    <SelectItem value="legal">Legal Information</SelectItem>
                    <SelectItem value="operational">Operational Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sync Settings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>SYNC SETTINGS:</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Auto-sync enabled</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Real-time updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Sync Frequency:</span>
                  <Select value={syncSettings.syncFrequency}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2-hours">Every 2 hours</SelectItem>
                      <SelectItem value="4-hours">Every 4 hours</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Conflict Resolution:</span>
                  <Select value={syncSettings.conflictResolution}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual Review</SelectItem>
                      <SelectItem value="auto">Auto Resolve</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">MAPPED FIELDS:</h4>
                <div className="space-y-2 text-sm">
                  {mappedFields.map((field, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span>• {field.source}</span>
                      <span className="text-muted-foreground">↔</span>
                      <span className="font-mono text-xs bg-muted px-1 rounded">{field.target}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">SYNC HISTORY:</h4>
              <div className="space-y-1 text-sm">
                {syncHistory.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span>• {entry.time} - {entry.action}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm">
                <Download className="h-3 w-3 mr-1" />
                Save Settings
              </Button>
              <Button size="sm" variant="outline">
                <RefreshCw className="h-3 w-3 mr-1" />
                Force Sync Now
              </Button>
              <Button size="sm" variant="outline">
                <BarChart3 className="h-3 w-3 mr-1" />
                View Sync Log
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Conflict Resolution Queue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              CONFLICT RESOLUTION QUEUE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="border-orange-200 bg-orange-50 mb-4">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <span className="font-semibold flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  2 CONFLICTS REQUIRE ATTENTION
                </span>
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              {conflicts.map((conflict, index) => (
                <div key={conflict.id} className="border rounded-lg p-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">{index + 1}. {conflict.title}</h4>
                    <div className="space-y-2 text-sm pl-4">
                      <div>Meetings Module: "{conflict.source1.split(': ')[1]}"</div>
                      <div>Data Records: "{conflict.source2.split(': ')[1]}"</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Review
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Accept Source
                      </Button>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Keep Current
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Error Logs & Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle>ERROR LOGS & TROUBLESHOOTING</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {errorLogs.map((log) => (
              <div key={log.id} className={`border rounded-lg p-4 ${
                log.severity === 'error' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'
              }`}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {log.severity === 'error' ? (
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                    ) : (
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    )}
                    <span className="font-medium">{log.module} Sync {log.severity === 'error' ? 'Error' : 'Partial Sync'}</span>
                    <span className="text-sm text-muted-foreground">({log.time})</span>
                  </div>
                  <p className="text-sm">{log.severity === 'error' ? 'Error:' : 'Warning:'} "{log.error}"</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Retry Sync
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="h-3 w-3 mr-1" />
                      Contact Support
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-3 w-3 mr-1" />
                      {log.severity === 'error' ? 'Reconfigure' : 'Configure'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DataRecordsRoom;
