import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  UserCheck, 
  Clock, 
  CheckCircle, 
  Plus, 
  Search, 
  Eye,
  Pencil,
  CalendarDays,
  FileText,
  MoreHorizontal
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const ARFacilitators = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("inProgress");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");

  const selectionProcesses = {
    inProgress: [
      {
        id: "1",
        entity: "ABC Manufacturing Ltd",
        type: "CIRP",
        stage: "Call EOI",
        created: "2024-01-15",
        deadline: "2024-02-15"
      },
      {
        id: "2",
        entity: "DEF Industries Ltd",
        type: "Liquidation",
        stage: "Consent Request",
        created: "2024-01-12",
        deadline: "2024-02-12"
      },
      {
        id: "4",
        entity: "GHI Corp Ltd",
        type: "CIRP",
        stage: "Selection Details",
        created: "2024-01-08",
        deadline: "2024-02-08"
      }
    ],
    completed: [
      {
        id: "3",
        entity: "XYZ Services Pvt Ltd",
        type: "Liquidation",
        stage: "AR Selected",
        created: "2024-01-10",
        completed: "2024-01-30"
      }
    ],
    selectedARs: [
      {
        id: "1",
        name: "John Smith",
        entity: "ABC Manufacturing Ltd",
        class: "Financial Creditors-Secured",
        appointed: "2024-01-25"
      }
    ]
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-progress":
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <span className="text-xs font-medium text-amber-700">In Progress</span>
          </div>
        );
      case "completed":
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs font-medium text-green-700">Completed</span>
          </div>
        );
      case "active":
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs font-medium text-green-700">Active</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
            <span className="text-xs font-medium text-gray-700">Unknown</span>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">AR & Facilitators Management</h1>
            <p className="text-muted-foreground">Manage Authorized Representatives and Facilitators</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="h-9">
              <CalendarDays className="mr-2 h-4 w-4" />
              This Month
            </Button>
            <Button size="sm" className="h-9" onClick={() => navigate('/ar-selection-process')}>
              <Plus className="mr-2 h-4 w-4" />
              Initiate Selection Process
            </Button>
          </div>
        </div>

        {/* AR Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="mr-2 h-4 w-4 text-primary" />
                Active Processes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                Next: ABC Manufacturing Ltd
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                Last: XYZ Services Pvt Ltd
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <UserCheck className="mr-2 h-4 w-4 text-blue-600" />
                Selected ARs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                Active appointments
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="mr-2 h-4 w-4 text-purple-600" />
                Facilitators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">
                Across all classes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* My AR Processes Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">SELECTION PROCESS MANAGEMENT</h2>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search processes..." 
                className="pl-8 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList className="grid w-auto grid-cols-3">
                <TabsTrigger value="inProgress" className="text-sm">
                  In Progress (3)
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-sm">
                  Completed (12)
                </TabsTrigger>
                <TabsTrigger value="selectedARs" className="text-sm">
                  Selected ARs (8)
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Filter:</span>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="CIRP">CIRP</SelectItem>
                    <SelectItem value="Liquidation">Liquidation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="inProgress" className="space-y-4">
              {selectionProcesses.inProgress.map((process) => (
                <Card key={process.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{process.entity}</h3>
                          <Badge variant="outline">{process.type}</Badge>
                          {getStatusBadge("in-progress")}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Stage:</span>
                            <p>{process.stage}</p>
                          </div>
                          <div>
                            <span className="font-medium">Created:</span>
                            <p>{new Date(process.created).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => {
                          // Navigate based on current stage
                          if (process.stage === "Call EOI") {
                            navigate('/ar-call-eoi');
                          } else if (process.stage === "Consent Request") {
                            navigate('/ar-consent-request');
                          } else if (process.stage === "Selection Details") {
                            navigate('/ar-selection-details');
                          } else {
                            navigate('/ar-selection-process');
                          }
                        }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/ar-selection-process')}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {selectionProcesses.completed.map((process) => (
                <Card key={process.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{process.entity}</h3>
                          <Badge variant="outline">{process.type}</Badge>
                          {getStatusBadge("completed")}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="selectedARs" className="space-y-4">
              {selectionProcesses.selectedARs.map((ar) => (
                <Card key={ar.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{ar.name}</h3>
                          {getStatusBadge("active")}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Entity:</span>
                            <p>{ar.entity}</p>
                          </div>
                          <div>
                            <span className="font-medium">Class:</span>
                            <p>{ar.class}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Facilitator Appointment */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">FACILITATOR APPOINTMENT</h2>
            <Button variant="outline" size="sm" onClick={() => navigate('/ar-fee-structure')}>
              <FileText className="h-4 w-4 mr-2" />
              Manage Fee Structure
            </Button>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Class Name</span>
                  <span className="text-sm font-medium text-muted-foreground">Eligible Members</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Financial Creditors-Secured</span>
                  <span className="font-medium text-primary">1,487 creditors</span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button variant="outline" size="sm" onClick={() => navigate('/ar-fee-structure')}>
                  <FileText className="h-4 w-4" />
                </Button>
                <Button size="sm">
                  Appoint
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default ARFacilitators;
