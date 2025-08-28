import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { 
  Search, 
  Filter,
  ArrowLeft,
  ArrowRight,
  Building,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  BarChart3,
  FileText,
  Zap,
  Activity,
  Users,
  Calendar,
  Eye,
  Download,
  Upload,
  RefreshCw,
  Edit,
  Trash2,
  MoreHorizontal,
  Phone,
  Paperclip,
  MessageSquare,
  Archive,
  Mail
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ComplianceItem {
  id: string;
  title: string;
  authority: string;
  status: 'overdue' | 'due-soon' | 'in-progress' | 'completed' | 'assigned';
  priority: 'high' | 'medium' | 'low';
  assignedTo: string;
  dueDate: string;
  daysOverdue?: number;
  daysLeft?: number;
  completedDate?: string;
  progress?: number;
  lastUpdate?: string;
  documentsUploaded?: number;
  totalDocuments?: number;
  submissionId?: string;
  impact?: string;
  aiSuggestion?: string;
  assignmentDate?: string;
  assigneeRole?: string;
  department?: string;
  experience?: string;
  lastActivity?: string;
  assigneeNotes?: string;
}

const ComplianceTrackingMonitoring = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [lawFilter, setLawFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [memberFilter, setMemberFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Mock data - replace with actual API calls
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([
    {
      id: "1",
      title: "GST Annual Return (GSTR-9)",
      authority: "GST Department",
      dueDate: "31 Dec 2023",
      daysOverdue: 15,
      assignedTo: "Rahul S.",
      status: "overdue",
      priority: "high",
      submissionId: 'SUB-2024-001',
      impact: 'High penalty risk if not filed immediately',
      aiSuggestion: 'Contact tax consultant for immediate filing assistance',
      assignmentDate: 'Jan 10, 2024',
      assigneeRole: 'Senior Tax Consultant',
      department: 'Finance & Taxation',
      experience: '5+ years',
      lastActivity: '1 hour ago',
      assigneeNotes: 'Working on gathering required financial documents. Expected completion by tomorrow.'
    },
    {
      id: "2",
      title: "PF Monthly Return (ECR)",
      authority: "EPFO",
      dueDate: "15 Jan 2024",
      daysLeft: 3,
      assignedTo: "Priya P.",
      status: "due-soon",
      priority: "high",
      progress: 75,
      lastUpdate: "2 hours ago",
      documentsUploaded: 3,
      totalDocuments: 4,
      assignmentDate: 'Jan 8, 2024',
      assigneeRole: 'Compliance Officer',
      department: 'HR & Payroll',
      experience: '3+ years',
      lastActivity: '2 hours ago',
      assigneeNotes: 'Almost ready for submission. Final review pending.'
    },
    {
      id: "3",
      title: "Income Tax TDS Return (24Q)",
      authority: "Income Tax Department",
      dueDate: "31 Dec 2023",
      completedDate: "28 Dec 2023",
      assignedTo: "Amit K.",
      status: "completed",
      priority: "medium",
      submissionId: "TDS240Q789456",
      aiSuggestion: "Documents authentic, No discrepancies",
      assignmentDate: 'Dec 15, 2023',
      assigneeRole: 'Tax Specialist',
      department: 'Finance & Taxation',
      experience: '4+ years',
      lastActivity: '3 days ago',
      assigneeNotes: 'Successfully completed and submitted on time.'
    },
    {
      id: "4",
      title: "ESI Monthly Return",
      authority: "ESIC",
      dueDate: "21 Jan 2024",
      daysLeft: 9,
      assignedTo: "Priya P.",
      status: "in-progress",
      priority: "medium",
      progress: 45,
      lastUpdate: "1 day ago",
      documentsUploaded: 2,
      totalDocuments: 3,
      assignmentDate: 'Jan 5, 2024',
      assigneeRole: 'Compliance Officer',
      department: 'HR & Payroll',
      experience: '3+ years',
      lastActivity: '1 day ago',
      assigneeNotes: 'Waiting for employee contribution data from HR.'
    },
    {
      id: "5",
      title: "Professional Tax Return - Maharashtra",
      authority: "Maharashtra Labour Department",
      dueDate: "30 Jan 2024",
      daysLeft: 18,
      assignedTo: "Neha M.",
      status: "assigned",
      priority: "low",
      assignmentDate: 'Jan 12, 2024',
      assigneeRole: 'Junior Compliance Executive',
      department: 'Legal & Compliance',
      experience: '1+ years',
      lastActivity: '4 hours ago',
      assigneeNotes: 'Just assigned. Will start working on this tomorrow.'
    },
    {
      id: "6",
      title: "Labour License Renewal",
      authority: "State Labour Commissioner",
      dueDate: "28 Feb 2024",
      daysLeft: 46,
      assignedTo: "Vikram T.",
      status: "assigned",
      priority: "medium",
      assignmentDate: 'Jan 11, 2024',
      assigneeRole: 'Legal Advisor',
      department: 'Legal & Compliance',
      experience: '6+ years',
      lastActivity: '6 hours ago',
      assigneeNotes: 'Reviewing current license terms and renewal requirements.'
    },
    {
      id: "7",
      title: "Shops & Establishment License Renewal",
      authority: "Municipal Corporation",
      dueDate: "15 Mar 2024",
      daysLeft: 61,
      assignedTo: "Ravi K.",
      status: "assigned",
      priority: "low",
      assignmentDate: 'Jan 9, 2024',
      assigneeRole: 'Administrative Officer',
      department: 'Administration',
      experience: '2+ years',
      lastActivity: '1 day ago',
      assigneeNotes: 'Collecting required documents and application forms.'
    },
    {
      id: "8",
      title: "Corporate Income Tax Return (ITR-6)",
      authority: "Income Tax Department",
      dueDate: "30 Sep 2024",
      daysLeft: 245,
      assignedTo: "Suresh P.",
      status: "assigned",
      priority: "high",
      assignmentDate: 'Jan 15, 2024',
      assigneeRole: 'Chief Financial Officer',
      department: 'Finance & Taxation',
      experience: '10+ years',
      lastActivity: '30 minutes ago',
      assigneeNotes: 'Starting preliminary financial data compilation for annual return.'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'due-soon': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'assigned': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'overdue': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'due-soon': return <Clock className="w-4 h-4 text-orange-600" />;
      case 'in-progress': return <Activity className="w-4 h-4 text-blue-600" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'assigned': return <Users className="w-4 h-4 text-purple-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
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

  // CRUD Functions
  const handleViewItem = (itemId: string) => {
    toast({
      title: "View Details",
      description: "Item details view would open here.",
    });
  };

  const handleEditItem = (itemId: string) => {
    setEditingItem(itemId);
    toast({
      title: "Edit Mode",
      description: "Item edit functionality would open here.",
    });
  };

  const handleDeleteItem = (itemId: string) => {
    setItemToDelete(itemId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteItem = () => {
    if (itemToDelete) {
      setComplianceItems(complianceItems.filter(item => item.id !== itemToDelete));
      toast({
        title: "Item Deleted",
        description: "The compliance item has been successfully removed.",
      });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const filteredItems = complianceItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLaw = lawFilter === "all" || item.authority.toLowerCase().includes(lawFilter.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesMember = memberFilter === "all" || item.assignedTo.toLowerCase().includes(memberFilter.toLowerCase());
    const matchesTab = activeTab === "all" || item.status === activeTab || (activeTab === "assigned" && item.status === "assigned");
    
    return matchesSearch && matchesLaw && matchesStatus && matchesMember && matchesTab;
  });

  const stats = {
    all: complianceItems.length,
    overdue: complianceItems.filter(item => item.status === 'overdue').length,
    dueSoon: complianceItems.filter(item => item.status === 'due-soon').length,
    completed: complianceItems.filter(item => item.status === 'completed').length,
    assigned: complianceItems.filter(item => item.status === 'assigned').length
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Compliance</h1>
            <p className="text-muted-foreground">ABC Corp → Compliance Tracking</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="h-9">
              <Calendar className="mr-2 h-4 w-4" />
              Calendar View
            </Button>
          </div>
        </div>

        {/* Status Header */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <BarChart3 className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h3 className="font-semibold text-blue-900">COMPLIANCE STATUS - ABC CORPORATION LTD</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>All ({stats.all})</span>
            </TabsTrigger>
            <TabsTrigger value="overdue" className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Overdue ({stats.overdue})</span>
            </TabsTrigger>
            <TabsTrigger value="due-soon" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Due This Week ({stats.dueSoon})</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Done This Month ({stats.completed})</span>
            </TabsTrigger>
            <TabsTrigger value="assigned" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Assigned ({stats.assigned})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col space-y-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Select value={lawFilter} onValueChange={setLawFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Law Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Laws</SelectItem>
                        <SelectItem value="gst">GST</SelectItem>
                        <SelectItem value="income">Income Tax</SelectItem>
                        <SelectItem value="labour">Labour Laws</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                        <SelectItem value="due-soon">Due Soon</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={memberFilter} onValueChange={setMemberFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Member" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Members</SelectItem>
                        <SelectItem value="rahul">Rahul S.</SelectItem>
                        <SelectItem value="priya">Priya P.</SelectItem>
                        <SelectItem value="amit">Amit K.</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="outline">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Sort
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Compliance List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  DETAILED COMPLIANCE LIST
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredItems.map((item) => (
                    <Card key={item.id} className={`border-l-4 ${getStatusColor(item.status)}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3">
                            {getStatusIcon(item.status)}
                            <div>
                              <h3 className="font-semibold text-lg">
                                {item.status.toUpperCase()}: {item.title}
                              </h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                {item.daysOverdue && (
                                  <span>Due: {item.dueDate} | Days Overdue: <span className="text-red-600 font-medium">{item.daysOverdue}</span></span>
                                )}
                                {item.daysLeft && (
                                  <span>Due: {item.dueDate} | Days Left: <span className="font-medium">{item.daysLeft}</span></span>
                                )}
                                {item.completedDate && (
                                  <span>Completed: {item.completedDate}</span>
                                )}
                                <span className="flex items-center">| {item.assignedTo} <Users className="ml-1 h-3 w-3" /></span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getPriorityIcon(item.priority)}
                            <Badge variant="outline">{item.priority}</Badge>
                          </div>
                        </div>

                        {/* Status-specific content */}
                        {item.status === 'overdue' && (
                          <div className="bg-red-50 p-3 rounded-lg mb-3">
                            <p className="text-red-800 text-sm mb-2">
                              <strong>Impact:</strong> {item.impact}
                            </p>
                            <p className="text-red-700 text-sm">
                              <strong>AI Suggestion:</strong> {item.aiSuggestion}
                            </p>
                          </div>
                        )}

                        {item.status === 'due-soon' && item.progress && (
                          <div className="bg-orange-50 p-3 rounded-lg mb-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-orange-800">Status: In Progress</span>
                              <span className="text-sm text-orange-600">Last Update: {item.lastUpdate}</span>
                            </div>
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm text-orange-800">Documents:</span>
                              <span className="text-sm">{item.documentsUploaded}/{item.totalDocuments} uploaded</span>
                              <span className="text-sm">Ready for submission: {item.progress}%</span>
                            </div>
                            <Progress value={item.progress} className="h-2" />
                          </div>
                        )}

                        {item.status === 'in-progress' && item.progress && (
                          <div className="bg-blue-50 p-3 rounded-lg mb-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-blue-800">Progress: {item.progress}%</span>
                              <span className="text-sm text-blue-600">Last Update: {item.lastUpdate}</span>
                            </div>
                            <Progress value={item.progress} className="h-2" />
                            <div className="mt-2 text-sm text-blue-700">
                              Documents: {item.documentsUploaded}/{item.totalDocuments} uploaded
                            </div>
                          </div>
                        )}

                        {item.status === 'completed' && (
                          <div className="bg-green-50 p-3 rounded-lg mb-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-green-800">Submitted by: {item.assignedTo}</span>
                              <span className="text-sm text-green-600 flex items-center">Status: Processed <CheckCircle className="ml-1 h-3 w-3" /></span>
                            </div>
                            <p className="text-sm text-green-700 mb-1">
                              Submission ID: {item.submissionId}
                            </p>
                            <p className="text-sm text-green-700">
                              AI Verification: {item.aiSuggestion}
                            </p>
                          </div>
                        )}

                        {activeTab === 'assigned' && (
                          <div className="bg-blue-50 p-3 rounded-lg mb-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-blue-800">Assigned to: {item.assignedTo}</span>
                              <span className="text-sm text-blue-600">Assignment Date: {item.assignmentDate || 'Jan 15, 2024'}</span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-blue-700 mb-2">
                              <span>Role: {item.assigneeRole || 'Compliance Officer'}</span>
                              <span>Department: {item.department || 'Legal & Compliance'}</span>
                              <span>Experience: {item.experience || '3+ years'}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <span className="text-blue-800">Status:</span>
                              <Badge variant={item.status === 'completed' ? 'default' : item.status === 'overdue' ? 'destructive' : 'secondary'}>
                                {item.status === 'completed' ? 'Completed' : 
                                 item.status === 'overdue' ? 'Overdue' : 
                                 item.status === 'due-soon' ? 'Due Soon' : 'In Progress'}
                              </Badge>
                              <span className="text-blue-700">• Last Activity: {item.lastActivity || '2 hours ago'}</span>
                            </div>
                            {item.assigneeNotes && (
                              <div className="mt-2 p-2 bg-white rounded border-l-2 border-blue-300">
                                <span className="text-xs text-blue-600 font-medium">Assignee Notes:</span>
                                <p className="text-sm text-blue-800 mt-1">{item.assigneeNotes}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            {item.status === 'overdue' && (
                              <>
                                <Button size="sm" variant="destructive">
                                  <Zap className="w-4 h-4 mr-1" />
                                  Mark Urgent
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Phone className="w-4 h-4 mr-1" />
                                  Contact
                                </Button>
                                <Button size="sm" variant="outline">
                                  <FileText className="w-4 h-4 mr-1" />
                                  View Form
                                </Button>
                              </>
                            )}

                            {item.status === 'due-soon' && (
                              <>
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4 mr-1" />
                                  View Progress
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Paperclip className="w-4 h-4 mr-1" />
                                  Upload Docs
                                </Button>
                                <Button size="sm" variant="outline">
                                  <MessageSquare className="w-4 h-4 mr-1" />
                                  Comments ({item.comments})
                                </Button>
                              </>
                            )}

                            {item.status === 'in-progress' && (
                              <>
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4 mr-1" />
                                  View Progress
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Paperclip className="w-4 h-4 mr-1" />
                                  Upload Docs
                                </Button>
                              </>
                            )}

                            {item.status === 'completed' && (
                              <>
                                <Button size="sm" variant="outline">
                                  <FileText className="w-4 h-4 mr-1" />
                                  View Receipt
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4 mr-1" />
                                  View Details
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Archive className="w-4 h-4 mr-1" />
                                  Archive
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t">
                  <Button variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Show All {complianceItems.length} Items
                  </Button>
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                    <Button variant="outline">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Updates
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ComplianceTrackingMonitoring;
