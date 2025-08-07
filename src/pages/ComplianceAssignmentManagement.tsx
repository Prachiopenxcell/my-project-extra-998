import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { 
  Search, 
  Filter,
  Users,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Clock,
  Phone,
  RotateCcw,
  Eye,
  Paperclip,
  Zap,
  Mail,
  FileText,
  BarChart3
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface ComplianceItem {
  id: string;
  title: string;
  authority: string;
  frequency: string;
  dueDate: string;
  nextDue: string;
  assignedTo: string | null;
  assignedToName: string | null;
  status: 'unassigned' | 'assigned' | 'overdue' | 'completed';
  priority: 'high' | 'medium' | 'low';
  description: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  itemCount: number;
}

const ComplianceAssignmentManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const selectedRequirements = location.state?.selectedRequirements || [];
  const selectedEntities = location.state?.selectedEntities || [];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<string | null>(null);

  // Mock data - replace with actual API calls
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([
    {
      id: "1",
      title: "GST Monthly Return (GSTR-3B)",
      authority: "GST Department",
      frequency: "Monthly",
      dueDate: "20th of each month",
      nextDue: "20 Jan 2024",
      assignedTo: null,
      assignedToName: null,
      status: "unassigned",
      priority: "high",
      description: "Monthly GST return filing for all registered entities"
    },
    {
      id: "2",
      title: "Income Tax TDS Return (Form 24Q)",
      authority: "Income Tax Dept",
      frequency: "Quarterly",
      dueDate: "31st of month following quarter",
      nextDue: "31 Jan '24",
      assignedTo: "1",
      assignedToName: "Rahul Sharma",
      status: "assigned",
      priority: "medium",
      description: "Quarterly TDS return filing for salary payments"
    },
    {
      id: "3",
      title: "PF Monthly Return (ECR Filing)",
      authority: "EPFO",
      frequency: "Monthly",
      dueDate: "15th of each month",
      nextDue: "15 Jan 2024",
      assignedTo: null,
      assignedToName: null,
      status: "overdue",
      priority: "high",
      description: "Monthly provident fund return filing"
    },
    {
      id: "4",
      title: "ESI Monthly Return",
      authority: "ESIC",
      frequency: "Monthly",
      dueDate: "21st of each month",
      nextDue: "21 Jan 2024",
      assignedTo: "2",
      assignedToName: "Priya Patel",
      status: "assigned",
      priority: "medium",
      description: "Monthly ESI return and contribution filing"
    },
    {
      id: "5",
      title: "Companies Act Annual Filing",
      authority: "MCA",
      frequency: "Annual",
      dueDate: "30th September",
      nextDue: "30 Sep 2024",
      assignedTo: "3",
      assignedToName: "Amit Kumar",
      status: "assigned",
      priority: "low",
      description: "Annual return and financial statement filing"
    }
  ]);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Rahul Sharma",
      role: "CA",
      itemCount: 8
    },
    {
      id: "2", 
      name: "Priya Patel",
      role: "CS",
      itemCount: 6
    },
    {
      id: "3",
      name: "Amit Kumar",
      role: "Legal",
      itemCount: 4
    }
  ]);

  const handleAssignment = (itemId: string, memberId: string) => {
    const member = teamMembers.find(m => m.id === memberId);
    setComplianceItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              assignedTo: memberId, 
              assignedToName: member?.name || null,
              status: 'assigned' as const
            }
          : item
      )
    );
  };

  const handleReassign = (itemId: string) => {
    setComplianceItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              assignedTo: null, 
              assignedToName: null,
              status: 'unassigned' as const
            }
          : item
      )
    );
  };

  const filteredItems = complianceItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === 'all' || item.assignedTo === assigneeFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesPriority && matchesAssignee && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-green-100 text-green-800';
      case 'unassigned': return 'bg-gray-100 text-gray-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const assignedCount = complianceItems.filter(item => item.status === 'assigned').length;
  const unassignedCount = complianceItems.filter(item => item.status === 'unassigned').length;
  const overdueCount = complianceItems.filter(item => item.status === 'overdue').length;
  const highPriorityCount = complianceItems.filter(item => item.priority === 'high').length;

  const handleCompleteAssignment = () => {
    navigate('/compliance/tracking', {
      state: {
        selectedEntities,
        selectedRequirements,
        assignedItems: complianceItems
      }
    });
  };

  return (
    <DashboardLayout userType="service_provider">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Compliance</h1>
            <p className="text-muted-foreground">ABC Corp → Assignment Management</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h3 className="font-semibold text-blue-900">ASSIGN COMPLIANCE RESPONSIBILITIES</h3>
                <p className="text-blue-700 text-sm mt-1">Step 3 of 3: Assign compliance items to team members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Filter:</span>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Laws" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Laws</SelectItem>
                    <SelectItem value="gst">GST</SelectItem>
                    <SelectItem value="income">Income Tax</SelectItem>
                    <SelectItem value="labour">Labour Laws</SelectItem>
                    <SelectItem value="corporate">Corporate Laws</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Members" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Members</SelectItem>
                    {teamMembers.map(member => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search compliance items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Button variant="outline" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Items */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              COMPLIANCE ITEMS ({filteredItems.length} items)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <Card key={item.id} className="border hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {item.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            {getPriorityIcon(item.priority)}
                            <Badge className={getStatusColor(item.status)}>
                              {item.status === 'assigned' && <CheckCircle className="w-3 h-3 mr-1" />}
                              {item.status === 'overdue' && <AlertTriangle className="w-3 h-3 mr-1" />}
                              {item.status === 'unassigned' && <Clock className="w-3 h-3 mr-1" />}
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <span className="text-gray-500">Authority:</span>
                            <p className="font-medium">{item.authority}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Frequency:</span>
                            <p className="font-medium">{item.frequency}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Due:</span>
                            <p className="font-medium">{item.dueDate}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Next Due:</span>
                            <p className="font-medium">{item.nextDue}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div>
                              <span className="text-gray-500 text-sm">Assigned to:</span>
                              {item.assignedToName ? (
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">{item.assignedToName}</span>
                                  <Badge variant="outline">
                                    {teamMembers.find(m => m.id === item.assignedTo)?.role}
                                  </Badge>
                                </div>
                              ) : (
                                <Select onValueChange={(value) => handleAssignment(item.id, value)}>
                                  <SelectTrigger className="w-48 mt-1">
                                    <SelectValue placeholder="Select Member" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {teamMembers.map(member => (
                                      <SelectItem key={member.id} value={member.id}>
                                        {member.name} ({member.role})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <span className="text-sm">Priority:</span>
                              <span className={`font-medium ${getPriorityColor(item.priority)}`}>
                                {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                              </span>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              View Guidelines
                            </Button>
                            <Button variant="outline" size="sm">
                              <Paperclip className="w-4 h-4 mr-1" />
                              Attachments
                            </Button>
                            {item.assignedToName && (
                              <>
                                <Button variant="outline" size="sm">
                                  <Phone className="w-4 h-4 mr-1" />
                                  Contact
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleReassign(item.id)}>
                                  <RotateCcw className="w-4 h-4 mr-1" />
                                  Reassign
                                </Button>
                              </>
                            )}
                            {item.status === 'overdue' && (
                              <Button variant="destructive" size="sm">
                                <Zap className="w-4 h-4 mr-1" />
                                Urgent Action Required
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <Button variant="outline">
                Show All {complianceItems.length} Items
              </Button>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Bulk Assignment
                </Button>
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Export List
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                TEAM MEMBERS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-600">({member.role}) - {member.itemCount} items</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Assignment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                ASSIGNMENT SUMMARY
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>• Assigned:</span>
                  <span className="font-medium">{assignedCount} items</span>
                </div>
                <div className="flex justify-between">
                  <span>• Unassigned:</span>
                  <span className="font-medium">{unassignedCount} items</span>
                </div>
                <div className="flex justify-between">
                  <span>• Overdue:</span>
                  <span className="font-medium text-red-600">{overdueCount} items</span>
                </div>
                <div className="flex justify-between">
                  <span>• High Priority:</span>
                  <span className="font-medium">{highPriorityCount} items</span>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 mt-6">
                <Button onClick={handleCompleteAssignment} className="w-full bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Assignment
                </Button>
                <Button variant="outline" className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Notifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate('/compliance/checklist')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Checklist Generation
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ComplianceAssignmentManagement;
