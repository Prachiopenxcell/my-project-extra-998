import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { 
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  FileText,
  Calendar,
  Clock,
  Users,
  Building,
  CheckCircle,
  XCircle,
  RefreshCw,
  MoreHorizontal,
  Upload,
  Download,
  Mail,
  Settings,
  AlertTriangle,
  Info
} from "lucide-react";
import { format } from "date-fns";
import EOIDetailView from './EOIDetailView';
import EOIEditForm from './EOIEditForm';
import COCMemberDetailView from './COCMemberDetailView';

interface EOIInvitation {
  id: string;
  entityName: string;
  issueDate: string;
  lastSubmitDate: string;
  status: 'objection_period' | 'final_approved' | 'plans_due';
  prasApplied?: number;
  prasShortlisted?: number;
  prasApproved?: number;
}

interface EOI {
  id: string;
  title: string;
  status: 'draft' | 'published' | 'closed' | 'evaluation';
  publishDate: string;
  closingDate: string;
  totalApplications: number;
  cocMembers: number;
  completionPercentage: number;
  description: string;
  requirements: string[];
  documents: Array<{
    name: string;
    required: boolean;
    uploaded: boolean;
  }>;
  timeline: Array<{
    date: string;
    event: string;
    completed: boolean;
  }>;
}

interface COCMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface EOIManagementProps {
  showCreateForm?: boolean;
  setShowCreateForm?: (show: boolean) => void;
}

const EOIManagement = ({ showCreateForm: externalShowCreateForm, setShowCreateForm: externalSetShowCreateForm }: EOIManagementProps = {}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [internalShowCreateForm, setInternalShowCreateForm] = useState(false);
  const [editingMember, setEditingMember] = useState<COCMember | null>(null);
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showEditMemberDialog, setShowEditMemberDialog] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<COCMember | null>(null);
  const [newMember, setNewMember] = useState({ name: "", email: "", role: "Member" });
  const [cocMembersList, setCocMembersList] = useState<COCMember[]>([]);
  
  // New state for detailed EOI views
  const [showEOIDetailView, setShowEOIDetailView] = useState(false);
  const [showEOIEditForm, setShowEOIEditForm] = useState(false);
  const [selectedEOI, setSelectedEOI] = useState<EOI | null>(null);
  
  // New state for COC member detail view
  const [showCOCMemberDetailView, setShowCOCMemberDetailView] = useState(false);
  const [selectedCOCMember, setSelectedCOCMember] = useState<COCMember | null>(null);

  // Use external state if provided, otherwise use internal state
  const showCreateForm = externalShowCreateForm !== undefined ? externalShowCreateForm : internalShowCreateForm;
  const setShowCreateForm = externalSetShowCreateForm || setInternalShowCreateForm;

  // Mock data
  const eoiInvitations: EOIInvitation[] = [
    {
      id: "1",
      entityName: "ABC Manufacturing Ltd.",
      issueDate: "2025-01-15",
      lastSubmitDate: "2025-01-30",
      status: "objection_period",
      prasApplied: 12
    },
    {
      id: "2",
      entityName: "XYZ Industries Ltd.",
      issueDate: "2025-01-10",
      lastSubmitDate: "2025-01-25",
      status: "final_approved",
      prasApplied: 18,
      prasShortlisted: 5
    },
    {
      id: "3",
      entityName: "PQR Corp Ltd.",
      issueDate: "2025-01-05",
      lastSubmitDate: "2025-01-20",
      status: "plans_due",
      prasApplied: 15,
      prasApproved: 8
    }
  ];

  // Initialize COC members if empty
  if (cocMembersList.length === 0) {
    setCocMembersList([
      { id: "1", name: "Mr. Rajesh Kumar", email: "rajesh.k@email.com", role: "Chairman" },
      { id: "2", name: "Ms. Priya Sharma", email: "priya.s@email.com", role: "Member" },
      { id: "3", name: "Mr. Amit Patel", email: "amit.p@email.com", role: "Member" }
    ]);
  }

  const handleAddMember = () => {
    if (newMember.name && newMember.email) {
      const member: COCMember = {
        id: Date.now().toString(),
        name: newMember.name,
        email: newMember.email,
        role: newMember.role
      };
      setCocMembersList([...cocMembersList, member]);
      setNewMember({ name: "", email: "", role: "Member" });
      setShowAddMemberDialog(false);
      toast({
        title: "Success",
        description: "COC member added successfully."
      });
    }
  };

  const handleEditMember = () => {
    if (editingMember) {
      setCocMembersList(cocMembersList.map(member => 
        member.id === editingMember.id ? editingMember : member
      ));
      setEditingMember(null);
      setShowEditMemberDialog(false);
      toast({
        title: "Success",
        description: "COC member updated successfully."
      });
    }
  };

  const handleDeleteMember = () => {
    if (memberToDelete) {
      setCocMembersList(cocMembersList.filter(member => member.id !== memberToDelete.id));
      setMemberToDelete(null);
      toast({
        title: "Success",
        description: "COC member deleted successfully."
      });
    }
  };

  const handleViewCOCMember = (memberId: string) => {
    const member = cocMembersList.find(m => m.id === memberId);
    if (member) {
      // Enhance member data for detailed view
      const enhancedMember = {
        ...member,
        phone: '+91 98765 43210',
        address: '123 Business District, Mumbai, Maharashtra 400001',
        organization: 'ABC Financial Services Ltd.',
        joinDate: '2024-01-15',
        votingRights: member.role === 'Chairman' ? 35 : 15,
        claimAmount: member.role === 'Chairman' ? 50000000 : 25000000,
        documents: [
          { name: 'Identity Proof', status: 'verified' as const, uploadDate: '2024-01-15', remarks: 'Aadhaar card verified' },
          { name: 'Address Proof', status: 'verified' as const, uploadDate: '2024-01-16', remarks: 'Utility bill verified' },
          { name: 'Financial Statements', status: 'pending' as const, uploadDate: '2024-01-20' },
          { name: 'Authorization Letter', status: 'verified' as const, uploadDate: '2024-01-18', remarks: 'Board resolution attached' }
        ],
        activities: [
          { date: new Date().toISOString(), action: 'Voting Participation', description: 'Participated in resolution plan voting', type: 'vote' as const },
          { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), action: 'Meeting Attendance', description: 'Attended COC meeting #15', type: 'meeting' as const },
          { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), action: 'Document Submission', description: 'Submitted updated financial statements', type: 'document' as const },
          { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), action: 'Communication', description: 'Sent query regarding resolution plan timeline', type: 'communication' as const }
        ]
      };
      setSelectedCOCMember(enhancedMember);
      setShowCOCMemberDetailView(true);
    }
  };

  const handleEditCOCMember = (memberId: string) => {
    const member = cocMembersList.find(m => m.id === memberId);
    if (member) {
      setEditingMember(member);
      setShowEditMemberDialog(true);
    }
  };



  const getStatusBadge = (status: string) => {
    const statusConfig = {
      objection_period: { label: "Objection Period", color: "bg-yellow-100 text-yellow-800" },
      final_approved: { label: "Final List Approved", color: "bg-green-100 text-green-800" },
      plans_due: { label: "Resolution Plans Due", color: "bg-red-100 text-red-800" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const filteredEOIs = eoiInvitations.filter(eoi => {
    const matchesSearch = eoi.entityName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || eoi.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // EOI Action Handlers
  const handleViewEOI = (eoiId: string) => {
    // Create mock detailed EOI data based on the EOI invitation
    const eoiInvitation = eoiInvitations.find(eoi => eoi.id === eoiId);
    if (eoiInvitation) {
      const detailedEOI: EOI = {
        id: eoiInvitation.id,
        title: `EOI for ${eoiInvitation.entityName}`,
        status: eoiInvitation.status === 'objection_period' ? 'published' : 
                eoiInvitation.status === 'final_approved' ? 'evaluation' : 'closed',
        publishDate: eoiInvitation.issueDate,
        closingDate: eoiInvitation.lastSubmitDate,
        totalApplications: eoiInvitation.prasApplied || eoiInvitation.prasShortlisted || eoiInvitation.prasApproved || 0,
        cocMembers: cocMembersList.length,
        completionPercentage: 85,
        description: `Expression of Interest invitation for ${eoiInvitation.entityName} resolution process.`,
        requirements: [
          'Valid registration certificate',
          'Financial statements for last 3 years',
          'Net worth certificate',
          'Experience in similar cases',
          'Team composition details'
        ],
        documents: [
          { name: 'Form G', required: true, uploaded: true },
          { name: 'Information Memorandum', required: true, uploaded: true },
          { name: 'Evaluation Matrix', required: true, uploaded: false },
          { name: 'Timeline Document', required: false, uploaded: true }
        ],
        timeline: [
          { date: eoiInvitation.issueDate, event: 'EOI Published', completed: true },
          { date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), event: 'Application Period Ends', completed: false },
          { date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), event: 'Evaluation Complete', completed: false },
          { date: eoiInvitation.lastSubmitDate, event: 'Final List Published', completed: false }
        ]
      };
      setSelectedEOI(detailedEOI);
      setShowEOIDetailView(true);
    }
  };

  const handleEditEOI = (eoiId: string) => {
    // Create mock detailed EOI data for editing
    const eoiInvitation = eoiInvitations.find(eoi => eoi.id === eoiId);
    if (eoiInvitation) {
      const detailedEOI: EOI = {
        id: eoiInvitation.id,
        title: `EOI for ${eoiInvitation.entityName}`,
        status: eoiInvitation.status === 'objection_period' ? 'published' : 
                eoiInvitation.status === 'final_approved' ? 'evaluation' : 'closed',
        publishDate: eoiInvitation.issueDate,
        closingDate: eoiInvitation.lastSubmitDate,
        totalApplications: eoiInvitation.prasApplied || eoiInvitation.prasShortlisted || eoiInvitation.prasApproved || 0,
        cocMembers: cocMembersList.length,
        completionPercentage: 85,
        description: `Expression of Interest invitation for ${eoiInvitation.entityName} resolution process.`,
        requirements: [
          'Valid registration certificate',
          'Financial statements for last 3 years',
          'Net worth certificate',
          'Experience in similar cases',
          'Team composition details'
        ],
        documents: [
          { name: 'Form G', required: true, uploaded: true },
          { name: 'Information Memorandum', required: true, uploaded: true },
          { name: 'Evaluation Matrix', required: true, uploaded: false },
          { name: 'Timeline Document', required: false, uploaded: true }
        ],
        timeline: [
          { date: eoiInvitation.issueDate, event: 'EOI Published', completed: true },
          { date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), event: 'Application Period Ends', completed: false },
          { date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), event: 'Evaluation Complete', completed: false },
          { date: eoiInvitation.lastSubmitDate, event: 'Final List Published', completed: false }
        ]
      };
      setSelectedEOI(detailedEOI);
      setShowEOIEditForm(true);
    }
  };

  const handleSaveEOI = (updatedEOI: EOI) => {
    toast({
      title: "EOI Updated",
      description: `${updatedEOI.title} has been successfully updated.`
    });
    // Here you would typically update the EOI in your backend/state
  };

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Create EOI Invitation</h3>
            <p className="text-muted-foreground">Set up a new Expression of Interest invitation</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowCreateForm(false)}>
              Cancel
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>

        {/* Progress Indicator */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Step 1: COC Members Setup</span>
              <span className="text-sm text-muted-foreground">Progress: 50%</span>
            </div>
            <Progress value={50} className="w-full" />
          </CardContent>
        </Card>

        {/* COC Members Setup */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                COC Members List
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Upload Bulk COC Members",
                      description: "Bulk upload functionality for COC members would be implemented here..."
                    });
                  }}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Upload Bulk
                </Button>
                <Button 
                  size="sm"
                  onClick={() => setShowAddMemberDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {cocMembersList.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        title="View"
                        onClick={() => handleViewCOCMember(member.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        title="Edit"
                        onClick={() => handleEditCOCMember(member.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete COC Member</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {member.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => {
                                setMemberToDelete(member);
                                handleDeleteMember();
                              }}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            </Table>
            <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add New Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New COC Member</DialogTitle>
                <DialogDescription>
                  Add a new member to the Committee of Creditors.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                    className="col-span-3"
                    placeholder="Enter member name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                    className="col-span-3"
                    placeholder="Enter email address"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select value={newMember.role} onValueChange={(value) => setNewMember({...newMember, role: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Chairman">Chairman</SelectItem>
                      <SelectItem value="Member">Member</SelectItem>
                      <SelectItem value="Secretary">Secretary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddMemberDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMember}>
                  Add Member
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Member Dialog */}
          <Dialog open={showEditMemberDialog} onOpenChange={setShowEditMemberDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit COC Member</DialogTitle>
                <DialogDescription>
                  Update the member information.
                </DialogDescription>
              </DialogHeader>
              {editingMember && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="edit-name"
                      value={editingMember.name}
                      onChange={(e) => setEditingMember({...editingMember, name: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editingMember.email}
                      onChange={(e) => setEditingMember({...editingMember, email: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-role" className="text-right">
                      Role
                    </Label>
                    <Select value={editingMember.role} onValueChange={(value) => setEditingMember({...editingMember, role: value})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Chairman">Chairman</SelectItem>
                        <SelectItem value="Member">Member</SelectItem>
                        <SelectItem value="Secretary">Secretary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEditMemberDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditMember}>
                  Update Member
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          </CardContent>
        </Card>

        {/* Form G Publication Status */}
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Form G Publication Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="form-g-published" />
                <label htmlFor="form-g-published" className="text-sm">Form G is already published</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="publication-outside" />
                <label htmlFor="publication-outside" className="text-sm">Publication done outside platform</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="create-publication" defaultChecked />
                <label htmlFor="create-publication" className="text-sm">Create through Publication Module</label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date of Publication</label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Upload Form G</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <FileText className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Browse Files</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* EOI Details Configuration */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Step 3: EOI Details Configuration</CardTitle>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-1" />
                AI Assist
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Timeline Settings */}
            <div className="space-y-4">
              <h4 className="font-medium">Timeline Settings:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Date for EOI Receipt</label>
                  <div className="flex gap-2">
                    <Input type="date" className="flex-1" />
                    <Input type="time" className="w-24" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Date for Resolution Plans</label>
                  <div className="flex gap-2">
                    <Input type="date" className="flex-1" />
                    <Input type="time" className="w-24" />
                  </div>
                </div>
              </div>
            </div>

            {/* Eligibility Criteria URLs */}
            <div className="space-y-4">
              <h4 className="font-medium">Eligibility Criteria URLs:</h4>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input placeholder="Section 25(2)(h) URL" className="flex-1" />
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-1" />
                    Auto-generate
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Financial Statements URL" className="flex-1" />
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-1" />
                    Auto-generate
                  </Button>
                </div>
              </div>
            </div>

            {/* Document Requirements Checklist */}
            <div className="space-y-4">
              <h4 className="font-medium">Document Requirements Checklist:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  {[
                    "Letter stating EOI signed by PRAs",
                    "Fulfilling Eligibility criteria", 
                    "Annual Reports (3 years)",
                    "Board Resolution docs",
                    "KYC of PRAs",
                    "List of connected persons",
                    "Payment proof (Cheque/DD/NEFT)"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox id={`doc-${index}`} defaultChecked />
                      <label htmlFor={`doc-${index}`} className="text-sm">{item}</label>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {[
                    "29A eligibility undertaking",
                    "Confidential Undertaking",
                    "Net worth certificate",
                    "Incorporation documents",
                    "KYC of Authorised person",
                    "Consortium Agreement",
                    "Company Profile"
                  ].map((item, index) => (
                    <div key={index + 7} className="flex items-center space-x-2">
                      <Checkbox id={`doc-${index + 7}`} defaultChecked />
                      <label htmlFor={`doc-${index + 7}`} className="text-sm">{item}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search EOI invitations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="objection_period">Objection Period</SelectItem>
                <SelectItem value="final_approved">Final Approved</SelectItem>
                <SelectItem value="plans_due">Plans Due</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* EOI List */}
      <Card>
        <CardHeader>
          <CardTitle>EOI Invitations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entity Name</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Last Submit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>PRAs</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEOIs.map((eoi) => (
                <TableRow key={eoi.id}>
                  <TableCell className="font-medium">{eoi.entityName}</TableCell>
                  <TableCell>{format(new Date(eoi.issueDate), "dd MMM yyyy")}</TableCell>
                  <TableCell>{format(new Date(eoi.lastSubmitDate), "dd MMM yyyy")}</TableCell>
                  <TableCell>{getStatusBadge(eoi.status)}</TableCell>
                  <TableCell>
                    {eoi.status === 'objection_period' && eoi.prasApplied}
                    {eoi.status === 'final_approved' && eoi.prasShortlisted}
                    {eoi.status === 'plans_due' && eoi.prasApproved}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        title="View"
                        onClick={() => handleViewEOI(eoi.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        title="Edit"
                        onClick={() => handleEditEOI(eoi.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" title="More">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detailed View Modals */}
      <EOIDetailView
        eoi={selectedEOI}
        isOpen={showEOIDetailView}
        onClose={() => setShowEOIDetailView(false)}
        onEdit={(eoi) => {
          setSelectedEOI(eoi);
          setShowEOIDetailView(false);
          setShowEOIEditForm(true);
        }}
      />

      <EOIEditForm
        eoi={selectedEOI}
        isOpen={showEOIEditForm}
        onClose={() => setShowEOIEditForm(false)}
        onSave={handleSaveEOI}
      />

      {/* COC Member Detail View */}
      <COCMemberDetailView
        member={selectedCOCMember}
        isOpen={showCOCMemberDetailView}
        onClose={() => setShowCOCMemberDetailView(false)}
        onEdit={(member) => {
          setEditingMember(member);
          setShowCOCMemberDetailView(false);
          setShowEditMemberDialog(true);
        }}
      />
    </div>
  );
};

export default EOIManagement;
