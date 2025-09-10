import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Mail, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Clock, 
  Send, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Settings
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { AutoMailCycle, MailTrigger, MailTemplate, TeamMemberRole } from "@/types/systemSettings";
import { useAuth } from "@/contexts/AuthContext";

export const AutoMailCycleManagement = () => {
  const { user } = useAuth();
  const [cycles, setCycles] = useState<AutoMailCycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [selectedCycle, setSelectedCycle] = useState<AutoMailCycle | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    loadAutoMailCycles();
  }, []);

  const loadAutoMailCycles = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockCycles: AutoMailCycle[] = [
        {
          id: "amc-1",
          name: "Welcome Email Series",
          description: "Automated welcome email sequence for new clients",
          triggers: [
            {
              id: "trigger-1",
              event: "user_registered",
              delay: 0
            },
            {
              id: "trigger-2", 
              event: "profile_completed",
              delay: 24
            }
          ],
          template: {
            id: "template-1",
            subject: "Welcome to 998P Platform - {{user_name}}",
            body: "Dear {{user_name}},\n\nWelcome to the 998P platform! We're excited to have you on board.\n\nBest regards,\nThe 998P Team",
            variables: ["user_name", "company_name", "registration_date"],
            attachments: ["welcome_guide.pdf"]
          },
          isActive: true,
          createdBy: user?.id || "admin",
          createdAt: new Date("2024-01-15"),
          lastModified: new Date("2024-01-20"),
          applicableRoles: [TeamMemberRole.ADMIN, TeamMemberRole.TEAM_LEAD],
          schedule: {
            frequency: 'daily',
            time: '09:00'
          }
        },
        {
          id: "amc-2",
          name: "Payment Reminder Cycle",
          description: "Automated payment reminders for overdue invoices",
          triggers: [
            {
              id: "trigger-3",
              event: "invoice_overdue",
              delay: 0
            },
            {
              id: "trigger-4",
              event: "payment_failed",
              delay: 48
            }
          ],
          template: {
            id: "template-2",
            subject: "Payment Reminder - Invoice {{invoice_number}}",
            body: "Dear {{client_name}},\n\nThis is a friendly reminder that your invoice {{invoice_number}} for {{amount}} is now overdue.\n\nPlease make payment at your earliest convenience.\n\nThank you,\nAccounts Team",
            variables: ["client_name", "invoice_number", "amount", "due_date"],
            attachments: []
          },
          isActive: false,
          createdBy: user?.id || "admin",
          createdAt: new Date("2024-02-01"),
          lastModified: new Date("2024-02-05"),
          applicableRoles: [TeamMemberRole.ADMIN],
          schedule: {
            frequency: 'weekly',
            time: '10:00',
            dayOfWeek: 1
          }
        },
        {
          id: "amc-3",
          name: "Quarterly Compliance Review",
          description: "Quarterly automated emails for compliance document review",
          triggers: [
            {
              id: "trigger-5",
              event: "quarter_end",
              delay: 0
            }
          ],
          template: {
            id: "template-3",
            subject: "Quarterly Compliance Review - {{quarter}} {{year}}",
            body: "Dear Team,\n\nIt's time for our quarterly compliance review for {{quarter}} {{year}}.\n\nPlease review and update all compliance documents by {{deadline}}.\n\nCompliance Team",
            variables: ["quarter", "year", "deadline", "team_name"],
            attachments: ["compliance_checklist.pdf"]
          },
          isActive: true,
          createdBy: user?.id || "admin",
          createdAt: new Date("2024-01-01"),
          lastModified: new Date("2024-01-15"),
          applicableRoles: [TeamMemberRole.ADMIN, TeamMemberRole.TEAM_LEAD],
          schedule: {
            frequency: 'quarterly',
            time: '08:00',
            dayOfMonth: 1
          }
        }
      ];
      setCycles(mockCycles);
    } catch (error) {
      console.error('Failed to load auto-mail cycles:', error);
      toast({
        title: "Error",
        description: "Failed to load auto-mail cycles",
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
        description: `Auto-mail cycle ${cycle?.isActive ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update auto-mail cycle status",
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
        description: "Auto-mail cycle deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete auto-mail cycle",
        variant: "destructive"
      });
    }
  };

  const CreateCycleDialog = () => (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Auto-Mail Cycle
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create New Auto-Mail Cycle</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Basic Information */}
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
            <Textarea id="description" placeholder="Describe the auto-mail cycle purpose and triggers" />
          </div>

          {/* Schedule Settings */}
          <div className="space-y-4">
            <h4 className="font-medium">Schedule Settings</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Frequency</Label>
                <Select defaultValue="daily">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Time</Label>
                <Input type="time" defaultValue="09:00" />
              </div>
              <div>
                <Label>Day of Week (for weekly)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Monday</SelectItem>
                    <SelectItem value="2">Tuesday</SelectItem>
                    <SelectItem value="3">Wednesday</SelectItem>
                    <SelectItem value="4">Thursday</SelectItem>
                    <SelectItem value="5">Friday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Email Template */}
          <div className="space-y-4">
            <h4 className="font-medium">Email Template</h4>
            <div>
              <Label>Subject Line</Label>
              <Input placeholder="Enter email subject with variables like {{user_name}}" />
            </div>
            <div>
              <Label>Email Body</Label>
              <Textarea 
                placeholder="Enter email content with variables like {{user_name}}, {{company_name}}, etc."
                rows={6}
              />
            </div>
            <div>
              <Label>Available Variables</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {["user_name", "company_name", "email", "phone", "registration_date"].map(variable => (
                  <Badge key={variable} variant="outline" className="cursor-pointer">
                    {`{{${variable}}}`}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Applicable Roles */}
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
              toast({ title: "Success", description: "Auto-mail cycle created successfully" });
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
            <h2 className="text-2xl font-bold">Auto-Mail Cycle Management</h2>
            <p className="text-muted-foreground">Configure automated email workflows and schedules</p>
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
            <Mail className="h-6 w-6 text-blue-600" />
            Auto-Mail Cycle Management
          </h2>
          <p className="text-muted-foreground">Configure automated email workflows and schedules</p>
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
              <Mail className="h-8 w-8 text-blue-600" />
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
                <p className="text-sm text-muted-foreground">Scheduled Today</p>
                <p className="text-2xl font-bold text-orange-600">
                  {cycles.filter(c => c.isActive && c.schedule?.frequency === 'daily').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Triggers</p>
                <p className="text-2xl font-bold">{cycles.reduce((acc, c) => acc + c.triggers.length, 0)}</p>
              </div>
              <Send className="h-8 w-8 text-purple-600" />
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
                placeholder="Search auto-mail cycles..."
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

      {/* Auto-Mail Cycles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Auto-Mail Cycles</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Triggers</TableHead>
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
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span className="text-sm">
                        {cycle.schedule?.frequency} at {cycle.schedule?.time}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{cycle.triggers.length} triggers</Badge>
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
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Auto-Mail Cycles Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== "all" 
                  ? "No cycles match your current filters." 
                  : "Get started by creating your first auto-mail cycle."}
              </p>
              {!searchTerm && statusFilter === "all" && <CreateCycleDialog />}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
