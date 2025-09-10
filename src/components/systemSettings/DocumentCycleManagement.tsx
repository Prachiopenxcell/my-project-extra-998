import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Clock, 
  Users, 
  CheckCircle,
  AlertCircle,
  Search,
  Filter
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { DocumentCycle, DocumentStage, TeamMemberRole } from "@/types/systemSettings";
import { useAuth } from "@/contexts/AuthContext";

export const DocumentCycleManagement = () => {
  const { user } = useAuth();
  const [cycles, setCycles] = useState<DocumentCycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [selectedCycle, setSelectedCycle] = useState<DocumentCycle | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    loadDocumentCycles();
  }, []);

  const loadDocumentCycles = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockCycles: DocumentCycle[] = [
        {
          id: "dc-1",
          name: "Client Onboarding Process",
          description: "Standard document collection and verification process for new clients",
          stages: [
            {
              id: "stage-1",
              name: "Initial Documentation",
              description: "Collect basic client documents",
              order: 1,
              requiredDocuments: ["ID Proof", "Address Proof", "Business Registration"],
              approvalRequired: true,
              assignedRole: TeamMemberRole.TEAM_LEAD,
              timeLimit: 3,
              notifications: { reminder: 1, escalation: 1 }
            },
            {
              id: "stage-2",
              name: "Verification",
              description: "Verify submitted documents",
              order: 2,
              requiredDocuments: ["Verification Report"],
              approvalRequired: true,
              assignedRole: TeamMemberRole.ADMIN,
              timeLimit: 2,
              notifications: { reminder: 1, escalation: 1 }
            }
          ],
          isActive: true,
          createdBy: user?.id || "admin",
          createdAt: new Date("2024-01-15"),
          lastModified: new Date("2024-01-20"),
          applicableRoles: [TeamMemberRole.ADMIN, TeamMemberRole.TEAM_LEAD]
        },
        {
          id: "dc-2",
          name: "Compliance Review Cycle",
          description: "Quarterly compliance document review and update process",
          stages: [
            {
              id: "stage-3",
              name: "Document Collection",
              description: "Gather all compliance-related documents",
              order: 1,
              requiredDocuments: ["Compliance Certificates", "Audit Reports", "Policy Documents"],
              approvalRequired: false,
              timeLimit: 5,
              notifications: { reminder: 2, escalation: 2 }
            }
          ],
          isActive: false,
          createdBy: user?.id || "admin",
          createdAt: new Date("2024-02-01"),
          lastModified: new Date("2024-02-05"),
          applicableRoles: [TeamMemberRole.ADMIN]
        }
      ];
      setCycles(mockCycles);
    } catch (error) {
      console.error('Failed to load document cycles:', error);
      toast({
        title: "Error",
        description: "Failed to load document cycles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCycles = cycles.filter(cycle => {
    const matchesSearch = cycle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cycle.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && cycle.isActive) ||
                         (statusFilter === "inactive" && !cycle.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = async (cycleId: string) => {
    try {
      const updatedCycles = cycles.map(cycle => 
        cycle.id === cycleId ? { ...cycle, isActive: !cycle.isActive } : cycle
      );
      setCycles(updatedCycles);
      
      const cycle = updatedCycles.find(c => c.id === cycleId);
      toast({
        title: "Success",
        description: `Document cycle ${cycle?.isActive ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update document cycle status",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCycle = async (cycleId: string) => {
    try {
      const updatedCycles = cycles.filter(cycle => cycle.id !== cycleId);
      setCycles(updatedCycles);
      toast({
        title: "Success",
        description: "Document cycle deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete document cycle",
        variant: "destructive"
      });
    }
  };

  const CreateCycleDialog = () => (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Document Cycle
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Document Cycle</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Cycle Name</Label>
              <Input id="name" placeholder="Enter cycle name" />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select defaultValue="active">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Describe the document cycle purpose and workflow" />
          </div>
          <div>
            <Label>Applicable Roles</Label>
            <div className="flex gap-2 mt-2">
              {Object.values(TeamMemberRole).map(role => (
                <Badge key={role} variant="outline" className="cursor-pointer">
                  {role.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setIsCreateDialogOpen(false);
              toast({ title: "Success", description: "Document cycle created successfully" });
            }}>
              Create Cycle
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Document Cycle Management</h2>
            <p className="text-muted-foreground">Configure automated document workflows and approval processes</p>
          </div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Document Cycle Management
          </h2>
          <p className="text-muted-foreground">Configure automated document workflows and approval processes</p>
        </div>
        <CreateCycleDialog />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Cycles</p>
                <p className="text-2xl font-bold">{cycles.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Cycles</p>
                <p className="text-2xl font-bold text-green-600">{cycles.filter(c => c.isActive).length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Stages</p>
                <p className="text-2xl font-bold">{cycles.reduce((acc, c) => acc + c.stages.length, 0)}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Stages</p>
                <p className="text-2xl font-bold">
                  {cycles.length > 0 ? Math.round(cycles.reduce((acc, c) => acc + c.stages.length, 0) / cycles.length) : 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search document cycles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Document Cycles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Document Cycles</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Stages</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCycles.map((cycle) => (
                <TableRow key={cycle.id}>
                  <TableCell>
                    <div className="font-medium">{cycle.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Created by {cycle.createdBy}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">{cycle.description}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{cycle.stages.length} stages</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cycle.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {cycle.isActive ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {cycle.lastModified.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(cycle.id)}
                      >
                        {cycle.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedCycle(cycle);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCycle(cycle.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredCycles.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Document Cycles Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== "all" 
                  ? "No cycles match your current filters." 
                  : "Get started by creating your first document cycle."}
              </p>
              {!searchTerm && statusFilter === "all" && <CreateCycleDialog />}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
