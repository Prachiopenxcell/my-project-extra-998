import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { 
  ArrowLeft,
  ArrowRight,
  X,
  Bot,
  FileText,
  FolderOpen,
  Users,
  User,
  UserPlus,
  Mail,
  Upload,
  Settings,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  AlertCircle,
  Building,
  Bell,
  Clock,
  Download,
  Share2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateVDRRoomComplete = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [templateType, setTemplateType] = useState("ai");
  const [roomTitle, setRoomTitle] = useState("Q4 Due Diligence Process");
  const [roomDescription, setRoomDescription] = useState("Complete due diligence documentation for potential acquisition including financial, legal, and operational documents");
  const [selectedEntity, setSelectedEntity] = useState("abc-corp");
  const [selectedProcess, setSelectedProcess] = useState("due-diligence");
  
  // Step 2 - Group Management
  const [groupType, setGroupType] = useState("new");
  const [groupName, setGroupName] = useState("Due Diligence Team");
  const [groupDescription, setGroupDescription] = useState("Core team handling Q4 acquisition due diligence");
  const [teamMembers, setTeamMembers] = useState([
    { id: "1", name: "John Doe", email: "john@company.com", role: "Admin", selected: true },
    { id: "2", name: "Sarah Miller", email: "sarah@company.com", role: "Editor", selected: true },
    { id: "3", name: "Mike Johnson", email: "mike@company.com", role: "Viewer", selected: false },
    { id: "4", name: "Emily Davis", email: "emily@company.com", role: "Editor", selected: true }
  ]);
  const [externalUsers, setExternalUsers] = useState([
    { email: "external-advisor@firm.com", phone: "+91-9876543210", role: "Editor" },
    { email: "legal@lawfirm.com", phone: "", role: "Commenter" }
  ]);
  const [newExternalEmail, setNewExternalEmail] = useState("");
  const [newExternalPhone, setNewExternalPhone] = useState("");

  // Step 3 - Folder Structure
  const [folderStructure, setFolderStructure] = useState<FolderNode[]>([
    {
      id: "1",
      name: "01_Financial_Documents",
      children: [
        { id: "1-1", name: "Audited_Financial_Statements" },
        { id: "1-2", name: "Management_Accounts" },
        { id: "1-3", name: "Cash_Flow_Projections" },
        { id: "1-4", name: "Debt_Agreements" }
      ]
    },
    {
      id: "2",
      name: "02_Legal_Documents",
      children: [
        { id: "2-1", name: "Corporate_Documents" },
        { id: "2-2", name: "Material_Contracts" },
        { id: "2-3", name: "Litigation_Files" },
        { id: "2-4", name: "Regulatory_Compliance" }
      ]
    },
    {
      id: "3",
      name: "03_Operational_Documents",
      children: [
        { id: "3-1", name: "HR_Records" },
        { id: "3-2", name: "Insurance_Policies" },
        { id: "3-3", name: "Operational_Reports" }
      ]
    }
  ]);
  const [selectedFolder, setSelectedFolder] = useState("1-1");

  // Step 4 - Document Upload
  const [uploadedDocuments, setUploadedDocuments] = useState([
    { id: "1", name: "Balance_Sheet_2023.pdf", size: "2.1MB", status: "completed", folder: "1-1" },
    { id: "2", name: "P&L_Statement_2023.xlsx", size: "856KB", status: "completed", folder: "1-1" },
    { id: "3", name: "Cash_Flow_Analysis.pdf", size: "1.2MB", status: "uploading", folder: "1-1" },
    { id: "4", name: "Auditor_Report_Draft.docx", size: "945KB", status: "pending", folder: "1-1" }
  ]);

  // Step 5 - Access Management
  const [roomUsers, setRoomUsers] = useState([
    { id: "1", name: "John Doe", type: "Admin", addedDate: "Today" },
    { id: "2", name: "Due Diligence Team", type: "Editor", addedDate: "Today" },
    { id: "3", name: "auditor@firm.com", type: "Editor", addedDate: "Today" },
    { id: "4", name: "legal@lawfirm.com", type: "Commenter", addedDate: "Today" },
    { id: "5", name: "investor@fund.com", type: "Viewer", addedDate: "Just Added" }
  ]);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("Viewer");
  const [notifications, setNotifications] = useState({
    emailInvites: true,
    uploadNotifications: true,
    weeklyDigest: true,
    smsUrgent: false
  });

  // Step 5 - Assign Documents
  type Assignee = { id: string; label: string; email: string; role: "Editor" | "Commenter" | "Suggestion" };
  type DocAssignments = Record<string, Assignee[]>; // key: document id
  const [selectedAssignDoc, setSelectedAssignDoc] = useState<string>("1");
  const [docAssignments, setDocAssignments] = useState<DocAssignments>({});
  const [assignEmail, setAssignEmail] = useState("");
  const [assignRole, setAssignRole] = useState<"Editor" | "Commenter" | "Suggestion">("Editor");
  const partners: { id: string; name: string; email: string }[] = [
    { id: "p1", name: "Alpha Partners", email: "alpha@partners.com" },
    { id: "p2", name: "Beta Associates", email: "beta@associates.com" },
    { id: "p3", name: "Gamma Capital", email: "gamma@capital.com" }
  ];
  const allSelectableUsers = [
    ...teamMembers.map(m => ({ id: `tm-${m.id}`, name: m.name, email: m.email })),
    ...partners.map(p => ({ id: `pt-${p.id}`, name: p.name, email: p.email }))
  ];
  const [selectUserId, setSelectUserId] = useState<string>(allSelectableUsers[0]?.id ?? "");

  const ensureDoc = (docId: string) => {
    if (!docAssignments[docId]) {
      setDocAssignments(prev => ({ ...prev, [docId]: [] }));
    }
  };

  // Step 2 - Send invites from External Users panel
  const sendExternalInvites = () => {
    const count = externalUsers.length;
    if (count === 0) {
      toast({ title: "No external users", description: "Add external users before sending invites.", variant: "destructive" });
      return;
    }
    toast({ title: "Invitations sent", description: `Sent invites to ${count} external user${count > 1 ? 's' : ''}.` });
  };

  const addAssigneeByEmail = () => {
    const email = assignEmail.trim();
    if (!email) return;
    const docId = selectedAssignDoc;
    ensureDoc(docId);
    setDocAssignments(prev => {
      const list = prev[docId] ?? [];
      if (list.some(a => a.email.toLowerCase() === email.toLowerCase())) return prev;
      const newAssignee: Assignee = { id: `em-${Date.now()}`, label: email, email, role: assignRole };
      return { ...prev, [docId]: [...list, newAssignee] };
    });
    setAssignEmail("");
    toast({ title: "Assignee added", description: `${email} added as ${assignRole}.` });
  };

  const addAssigneeFromSelect = () => {
    if (!selectUserId) return;
    const user = allSelectableUsers.find(u => u.id === selectUserId);
    if (!user) return;
    const docId = selectedAssignDoc;
    ensureDoc(docId);
    setDocAssignments(prev => {
      const list = prev[docId] ?? [];
      if (list.some(a => a.email.toLowerCase() === user.email.toLowerCase())) return prev;
      const newAssignee: Assignee = { id: user.id, label: user.name, email: user.email, role: assignRole };
      return { ...prev, [docId]: [...list, newAssignee] };
    });
    toast({ title: "Assignee added", description: `${user.name} added as ${assignRole}.` });
  };

  const updateAssigneeRole = (assigneeId: string, role: Assignee["role"]) => {
    const docId = selectedAssignDoc;
    setDocAssignments(prev => ({
      ...prev,
      [docId]: (prev[docId] ?? []).map(a => a.id === assigneeId ? { ...a, role } : a)
    }));
  };

  const removeAssignee = (assigneeId: string) => {
    const docId = selectedAssignDoc;
    setDocAssignments(prev => ({
      ...prev,
      [docId]: (prev[docId] ?? []).filter(a => a.id !== assigneeId)
    }));
  };

  // Dialog state - Step 2 actions
  const [showInternalDialog, setShowInternalDialog] = useState(false);
  const [showExternalDialog, setShowExternalDialog] = useState(false);
  const [internalSearch, setInternalSearch] = useState("");
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);
  const [inviteEmailInput, setInviteEmailInput] = useState("");
  const [inviteRole, setInviteRole] = useState("Viewer");

  // Step 3 - Folder actions state (GDrive-like)
  type FolderChild = { id: string; name: string };
  type FolderNode = { id: string; name: string; children?: FolderChild[] };
  type ShareEntry = { email: string; role: "Editor" | "Commenter" | "Suggestion" };
  const [folderShares, setFolderShares] = useState<Record<string, ShareEntry[]>>({});
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareFolderId, setShareFolderId] = useState<string>("");
  const [shareEmailInput, setShareEmailInput] = useState("");
  const [shareRole, setShareRole] = useState<"Editor" | "Commenter" | "Suggestion">("Editor");

  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [renameFolderId, setRenameFolderId] = useState<string>("");
  const [renameValue, setRenameValue] = useState("");

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteFolderId, setDeleteFolderId] = useState<string>("");
  const [deleteFolderName, setDeleteFolderName] = useState("");

  // Add Subfolder
  const [showAddSubDialog, setShowAddSubDialog] = useState(false);
  const [addSubParentId, setAddSubParentId] = useState<string>("");
  const [newSubfolderName, setNewSubfolderName] = useState("");

  // Resolve folder name by ID for dialog headers
  const getFolderNameById = (id: string): string => {
    for (const f of folderStructure) {
      if (f.id === id) return f.name;
      if (f.children) {
        const c = f.children.find(ch => ch.id === id);
        if (c) return c.name;
      }
    }
    return "";
  };

  // Simple audit logger (front-end demo) – compatible with AuditTrail page
  type AuditRecord = {
    timestamp: string;
    user: string;
    action: string;
    resource: string;
    location: string;
    module: string;
  };
  const logAudit = (action: string, resource: string, location: string) => {
    try {
      const key = "vdr_audit_log";
      const existing: AuditRecord[] = JSON.parse(localStorage.getItem(key) || "[]");
      const rec: AuditRecord = {
        timestamp: new Date().toISOString(),
        user: "John D.",
        action,
        resource,
        location,
        module: "Document Storage"
      };
      localStorage.setItem(key, JSON.stringify([rec, ...existing].slice(0, 500)));
    } catch (err) {
      // ignore localStorage errors in demo
    }
  };

  const steps = [
    { id: 1, name: "Setup", label: "Template Selection" },
    { id: 2, name: "Group", label: "Create/Assign Group" },
    { id: 3, name: "Folder", label: "Folder Structure" },
    { id: 4, name: "Upload", label: "Upload Documents" },
    { id: 5, name: "Access", label: "Manage Access" }
  ];

  const progressPercentage = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handlers for dialogs
  const openAddInternal = () => {
    setShowInternalDialog(true);
    toast({ title: "Add Internal", description: "Opening internal members selector." });
  };
  const openInviteExternal = () => {
    setShowExternalDialog(true);
    toast({ title: "Invite External", description: "Opening external invite dialog." });
  };

  const addSelectedInternals = () => {
    // In this mock, selections are already applied via checkboxes in dialog
    setShowInternalDialog(false);
    toast({ title: "Members added", description: "Selected internal members have been added to the group." });
  };

  const addInviteEmail = () => {
    const email = inviteEmailInput.trim();
    if (!email) return;
    if (inviteEmails.includes(email)) return;
    setInviteEmails([...inviteEmails, email]);
    setInviteEmailInput("");
  };

  const removeInviteEmail = (email: string) => {
    setInviteEmails(inviteEmails.filter(e => e !== email));
  };

  const sendInvites = () => {
    if (inviteEmails.length === 0) {
      toast({ title: "No recipients", description: "Add at least one external email to invite.", variant: "destructive" });
      return;
    }
    // Append to externalUsers list
    const newUsers = inviteEmails.map(email => ({ email, phone: "", role: inviteRole }));
    setExternalUsers([...externalUsers, ...newUsers]);
    const count = inviteEmails.length;
    setInviteEmails([]);
    setShowExternalDialog(false);
    toast({ title: "Invitations sent", description: `Sent ${count} invite${count > 1 ? 's' : ''} as ${inviteRole}.` });
  };

  // Utilities for Step 3 folder manipulation
  const openShareFolder = (folderId: string) => {
    setShareFolderId(folderId);
    setShowShareDialog(true);
  };

  const addShareRecipient = () => {
    const email = shareEmailInput.trim();
    if (!email) return;
    setFolderShares(prev => {
      const list = prev[shareFolderId] ?? [];
      if (list.some(e => e.email.toLowerCase() === email.toLowerCase())) return prev;
      return { ...prev, [shareFolderId]: [...list, { email, role: shareRole }] };
    });
    setShareEmailInput("");
  };

  const removeShareRecipient = (email: string) => {
    setFolderShares(prev => ({
      ...prev,
      [shareFolderId]: (prev[shareFolderId] ?? []).filter(e => e.email !== email)
    }));
  };

  const confirmShare = () => {
    const count = (folderShares[shareFolderId] ?? []).length;
    setShowShareDialog(false);
    toast({ title: "Sharing updated", description: `${count} recipient${count === 1 ? '' : 's'} for this folder.` });
    const name = getFolderNameById(shareFolderId);
    logAudit("SHARED", name || "Folder", "Folder Structure");
  };

  const openRenameFolder = (folderId: string, currentName: string) => {
    setRenameFolderId(folderId);
    setRenameValue(currentName);
    setShowRenameDialog(true);
  };

  const applyRenameFolder = () => {
    const oldName = getFolderNameById(renameFolderId);
    const rename = (items: FolderNode[]): FolderNode[] => items.map((f): FolderNode => {
      if (f.id === renameFolderId) return { ...f, name: renameValue };
      if (f.children && f.children.length > 0) {
        return { ...f, children: rename(f.children) };
      }
      return f;
    });
    setFolderStructure(prev => rename(prev));
    setShowRenameDialog(false);
    toast({ title: "Renamed", description: `Folder renamed to '${renameValue}'.` });
    logAudit("EDITED", `${oldName} -> ${renameValue}`, "Folder Structure");
  };

  const openDeleteFolder = (folderId: string, name: string) => {
    setDeleteFolderId(folderId);
    setDeleteFolderName(name);
    setShowDeleteDialog(true);
  };

  const applyDeleteFolder = () => {
    const remove = (items: FolderNode[]): FolderNode[] => items
      .filter(f => f.id !== deleteFolderId)
      .map((f): FolderNode => {
        if (f.children && f.children.length > 0) {
          return { ...f, children: remove(f.children) };
        }
        return f;
      });
    setFolderStructure(prev => remove(prev));
    setShowDeleteDialog(false);
    toast({ title: "Deleted", description: `Folder '${deleteFolderName}' removed.` });
    logAudit("DELETE", deleteFolderName, "Folder Structure");
  };

  const openAddSubfolder = (parentId: string) => {
    setAddSubParentId(parentId);
    setShowAddSubDialog(true);
  };

  const applyAddSubfolder = () => {
    const addSubfolder = (items: FolderNode[]): FolderNode[] => items.map((f): FolderNode => {
      if (f.id === addSubParentId) {
        const newSubfolder: FolderChild = { id: String(Date.now()), name: newSubfolderName };
        return { ...f, children: [...(f.children || []), newSubfolder] };
      }
      if (f.children && f.children.length > 0) {
        return { ...f, children: addSubfolder(f.children) };
      }
      return f;
    });
    setFolderStructure(prev => addSubfolder(prev));
    setShowAddSubDialog(false);
    toast({ title: "Added", description: `Subfolder '${newSubfolderName}' added.` });
    logAudit("ADDED", newSubfolderName, "Folder Structure");
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    navigate('/data-room/document-storage');
  };

  const addExternalUser = () => {
    if (newExternalEmail) {
      setExternalUsers([...externalUsers, {
        email: newExternalEmail,
        phone: newExternalPhone,
        role: "Viewer"
      }]);
      setNewExternalEmail("");
      setNewExternalPhone("");
    }
  };

  const addRoomUser = () => {
    if (newUserEmail) {
      setRoomUsers([...roomUsers, {
        id: String(roomUsers.length + 1),
        name: newUserEmail,
        type: newUserRole,
        addedDate: "Just Added"
      }]);
      setNewUserEmail("");
    }
  };

  const toggleTeamMember = (id: string) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === id ? { ...member, selected: !member.selected } : member
    ));
  };

  const updateMemberRole = (id: string, role: string) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === id ? { ...member, role } : member
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'uploading':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Create Document Storage Room</h1>
            <p className="text-muted-foreground">
              Set up a secure document workspace with granular access control
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="h-9" onClick={() => navigate('/data-room/document-storage')}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            {currentStep === steps.length ? (
              <Button size="sm" className="h-9" onClick={handleComplete}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Complete
              </Button>
            ) : (
              <Button size="sm" className="h-9" onClick={handleNext}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">PROGRESS:</span>
                <span className="text-sm text-muted-foreground">{currentStep} of {steps.length}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="flex items-center justify-between text-sm">
                {steps.map((step, index) => (
                  <div key={step.id} className={`flex flex-col items-center ${
                    index + 1 <= currentStep ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      index + 1 < currentStep ? 'bg-primary text-primary-foreground' :
                      index + 1 === currentStep ? 'bg-primary text-primary-foreground' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1 < currentStep ? '✓' : index + 1}
                    </div>
                    <span className="mt-1 text-xs">{step.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Template Selection */}
        {currentStep === 1 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>STEP 1: TEMPLATE SELECTION</CardTitle>
              <p className="text-sm text-muted-foreground">Choose how to set up your document storage room</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Template Toggle Buttons */}
              <div className="flex items-center gap-2 p-1 bg-muted rounded-lg w-fit">
                <Button
                  variant={templateType === 'ai' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTemplateType('ai')}
                  className="flex items-center gap-2"
                >
                  <Bot className="h-4 w-4" />
                  AI-Generated
                </Button>
                <Button
                  variant={templateType === 'custom' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTemplateType('custom')}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Custom-Generated
                </Button>
              </div>

              {/* System Template Card */}
              {templateType === 'ai' && (
                <Card className="border-2 border-blue-500 bg-blue-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Bot className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-blue-900">
                          System Template (AI-Powered)
                        </h3>
                        <Badge variant="secondary" className="mt-1">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Recommended
                        </Badge>
                      </div>
                    </div>
                    <p className="text-blue-800 mb-6">
                      AI will automatically set up the file structure and folders based on your entity details and selected process type.
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block text-blue-900">Select Entity:</label>
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                              <SelectTrigger className="bg-white border-blue-200">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="abc-corp">ABC Corporation Ltd.</SelectItem>
                                <SelectItem value="xyz-inc">XYZ Inc.</SelectItem>
                                <SelectItem value="def-llc">DEF LLC</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => navigate('/create-entity')}>
                            Create Entity
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block text-blue-900">Process Type:</label>
                        <Select value={selectedProcess} onValueChange={setSelectedProcess}>
                          <SelectTrigger className="bg-white border-blue-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="due-diligence">Due Diligence</SelectItem>
                            <SelectItem value="cirp">CIRP Process</SelectItem>
                            <SelectItem value="audit">Audit Review</SelectItem>
                            <SelectItem value="compliance">Compliance Check</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <Bot className="mr-2 h-4 w-4" />
                        Generate AI Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Custom Template Card */}
              {templateType === 'custom' && (
                <Card className="border-2 border-purple-500 bg-purple-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Settings className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-purple-900">
                          Custom Template (Manual Setup)
                        </h3>
                      </div>
                    </div>
                    <p className="text-purple-800 mb-6">
                      Manually create the Document Storage Room by providing specific details and customizing the structure according to your requirements.
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block text-purple-900">Room Title:</label>
                        <Input 
                          placeholder="Enter room title" 
                          value={roomTitle}
                          onChange={(e) => setRoomTitle(e.target.value)}
                          className="bg-white border-purple-200"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block text-purple-900">Description:</label>
                        <Textarea 
                          placeholder="Describe the purpose of this room"
                          value={roomDescription}
                          onChange={(e) => setRoomDescription(e.target.value)}
                          rows={3}
                          className="bg-white border-purple-200"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block text-purple-900">Select Entity:</label>
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                              <SelectTrigger className="bg-white border-purple-200">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="abc-corp">ABC Corporation Ltd.</SelectItem>
                                <SelectItem value="xyz-inc">XYZ Inc.</SelectItem>
                                <SelectItem value="def-llc">DEF LLC</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => navigate('/create-entity')}>
                            Create Entity
                          </Button>
                        </div>
                      </div>
                      
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        <Settings className="mr-2 h-4 w-4" />
                        Configure Manually
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>

            {/* Step 2 Dialogs: Add Internal / Invite External */}
            <Dialog open={showInternalDialog} onOpenChange={setShowInternalDialog}>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add Internal Members</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <Input
                    placeholder="Search team members"
                    value={internalSearch}
                    onChange={(e) => setInternalSearch(e.target.value)}
                  />
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {teamMembers
                      .filter(m => m.name.toLowerCase().includes(internalSearch.toLowerCase()) || m.email.toLowerCase().includes(internalSearch.toLowerCase()))
                      .map(member => (
                        <label key={member.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <Checkbox checked={member.selected} onCheckedChange={() => toggleTeamMember(member.id)} />
                            <div>
                              <p className="text-sm font-medium">{member.name}</p>
                              <p className="text-xs text-muted-foreground">{member.email}</p>
                            </div>
                          </div>
                          <Badge variant="outline">{member.role}</Badge>
                        </label>
                      ))}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowInternalDialog(false)}>Cancel</Button>
                  <Button onClick={addSelectedInternals}>Add Selected</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={showExternalDialog} onOpenChange={setShowExternalDialog}>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Invite External Users</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="sm:col-span-2">
                      <Input
                        placeholder="Enter email and press Add"
                        value={inviteEmailInput}
                        onChange={(e) => setInviteEmailInput(e.target.value)}
                      />
                    </div>
                    <Button onClick={addInviteEmail}>Add</Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Role for Invites</label>
                      <Select value={inviteRole} onValueChange={setInviteRole}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Editor">Editor</SelectItem>
                          <SelectItem value="Viewer">Viewer</SelectItem>
                          <SelectItem value="Commenter">Commenter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {inviteEmails.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Pending Invites ({inviteEmails.length})</p>
                      <div className="flex flex-wrap gap-2">
                        {inviteEmails.map(email => (
                          <Badge key={email} variant="secondary" className="flex items-center gap-2">
                            {email}
                            <button onClick={() => removeInviteEmail(email)} className="ml-1 text-xs">✕</button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowExternalDialog(false)}>Cancel</Button>
                  <Button onClick={sendInvites}>Send Invites</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Card>
        )}

        {/* Step 2: Group Management */}
        {currentStep === 2 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>STEP 2: CREATE/ASSIGN GROUP</CardTitle>
              <p className="text-sm text-muted-foreground">Set up team access and permissions</p>
            </CardHeader>
            <CardContent>
              {/* Create Group - Basic Details */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-1 block">Group Name</label>
                  <Input
                    placeholder="Enter group name (e.g., Due Diligence Team)"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Short Description</label>
                  <Textarea
                    placeholder="Briefly describe the group's purpose (shown to members)"
                    value={groupDescription}
                    onChange={(e) => setGroupDescription(e.target.value)}
                    rows={2}
                    className="resize-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {/* Team Members */}
                <div>
                  <h4 className="font-medium mb-3">TEAM MEMBERS</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            checked={member.selected}
                            onChange={() => toggleTeamMember(member.id)}
                            className="rounded"
                          />
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{member.name}</p>
                              <p className="text-xs text-muted-foreground">{member.email}</p>
                            </div>
                          </div>
                        </div>
                        <Select 
                          value={member.role} 
                          onValueChange={(value) => updateMemberRole(member.id, value)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Editor">Editor</SelectItem>
                            <SelectItem value="Viewer">Viewer</SelectItem>
                            <SelectItem value="Commenter">Comment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium mb-2">SELECTED MEMBERS: {teamMembers.filter(m => m.selected).length}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={openAddInternal}>
                        <UserPlus className="mr-1 h-3 w-3" />
                        Add Internal
                      </Button>
                      <Button size="sm" variant="outline" onClick={openInviteExternal}>
                        <Mail className="mr-1 h-3 w-3" />
                        Invite External
                      </Button>
                    </div>
                  </div>
                </div>

                {/* External Users */}
                <div>
                  <h4 className="font-medium mb-3">EXTERNAL USERS</h4>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Email Address:</label>
                        <Input 
                          placeholder="external@company.com"
                          value={newExternalEmail}
                          onChange={(e) => setNewExternalEmail(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Phone (Optional):</label>
                        <Input 
                          placeholder="+1 (555) 123-4567"
                          value={newExternalPhone}
                          onChange={(e) => setNewExternalPhone(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Select defaultValue="Viewer">
                          <SelectTrigger className="flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Editor">Editor</SelectItem>
                            <SelectItem value="Viewer">Viewer</SelectItem>
                            <SelectItem value="Commenter">Commenter</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button onClick={addExternalUser}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-2">INVITED EXTERNAL USERS:</h5>
                      <div className="space-y-2">
                        {externalUsers.map((user, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <div>
                              <p className="text-sm font-medium">{user.email}</p>
                              <p className="text-xs text-muted-foreground">{user.phone}</p>
                            </div>
                            <Badge variant="outline">{user.role}</Badge>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end mt-3">
                        <Button size="sm" onClick={sendExternalInvites}>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Invites
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 mb-1">GROUP SUMMARY</p>
                      <p className="text-xs text-blue-600">• {teamMembers.filter(m => m.selected).length} Internal Members</p>
                      <p className="text-xs text-blue-600">• {externalUsers.length} External Users</p>
                      <p className="text-xs text-blue-600">• Total Access: {teamMembers.filter(m => m.selected).length + externalUsers.length} Users</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

          </Card>
        )}

        {/* Step 3: Folder Structure */}
        {currentStep === 3 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>STEP 3: FOLDER STRUCTURE</CardTitle>
              <p className="text-sm text-muted-foreground">Organize your documents with a structured folder hierarchy</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                {/* Folder Hierarchy */}
                <div>
                  <h4 className="font-medium mb-3">FOLDER HIERARCHY</h4>
                  <div className="border rounded-lg p-4 space-y-2 max-h-96 overflow-y-auto">
                    {folderStructure.map((folder) => (
                      <div key={folder.id} className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                          <div className="flex items-center gap-2">
                            <FolderOpen className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">{folder.name}</span>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" title="Share" onClick={() => openShareFolder(folder.id)}>
                              <Share2 className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Rename" onClick={() => openRenameFolder(folder.id, folder.name)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Add Subfolder"
                              onClick={() => { setAddSubParentId(folder.id); setNewSubfolderName(""); setShowAddSubDialog(true); }}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Delete" onClick={() => openDeleteFolder(folder.id, folder.name)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        {folder.children && (
                          <div className="ml-6 space-y-1">
                            {folder.children.map((child) => (
                              <div key={child.id} className="flex items-center justify-between p-2 border rounded hover:bg-muted/50">
                                <div className="flex items-center gap-2">
                                  <FolderOpen className="h-3 w-3 text-gray-500" />
                                  <span className="text-sm">{child.name}</span>
                                </div>
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="sm" title="Share" onClick={() => openShareFolder(child.id)}>
                                    <Share2 className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" title="Rename" onClick={() => openRenameFolder(child.id, child.name)}>
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" title="Delete" onClick={() => openDeleteFolder(child.id, child.name)}>
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <Button variant="outline" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Folder
                    </Button>
                    <Button variant="outline" className="w-full">
                      <FolderOpen className="mr-2 h-4 w-4" />
                      Import Template
                    </Button>
                  </div>
                </div>

                {/* Folder Management */}
                <div>
                  <h4 className="font-medium mb-3">FOLDER MANAGEMENT</h4>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">CREATE NEW FOLDER</h5>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Folder Name:</label>
                          <Input placeholder="Enter folder name" />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Parent Folder:</label>
                          <Select defaultValue="01-financial">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="root">Root Directory</SelectItem>
                              <SelectItem value="01-financial">01_Financial_Documents</SelectItem>
                              <SelectItem value="02-legal">02_Legal_Documents</SelectItem>
                              <SelectItem value="03-operational">03_Operational_Documents</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Description:</label>
                          <textarea 
                            className="w-full p-2 border rounded-md text-sm" 
                            rows={2}
                            placeholder="Describe folder purpose"
                          />
                        </div>
                        <Button className="w-full">
                          <Plus className="mr-2 h-4 w-4" />
                          Create Folder
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">FOLDER SHARING</h5>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Selected Folder:</label>
                          <Select defaultValue="audited-statements">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="audited-statements">Audited_Financial_Statements</SelectItem>
                              <SelectItem value="management-accounts">Management_Accounts</SelectItem>
                              <SelectItem value="cash-flow">Cash_Flow_Projections</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm font-medium">SHARING OPTIONS:</p>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm">
                              <input type="checkbox" defaultChecked className="rounded" />
                              <span>Share with Due Diligence Team</span>
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                              <input type="checkbox" className="rounded" />
                              <span>Share with External Auditors</span>
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                              <input type="checkbox" className="rounded" />
                              <span>Share with Legal Team</span>
                            </label>
                          </div>
                        </div>
                        
                        <Button variant="outline" className="w-full">
                          <Users className="mr-2 h-4 w-4" />
                          Apply Sharing Settings
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-800 mb-1">FOLDER SUMMARY</p>
                      <p className="text-xs text-green-600">• 3 Main Categories</p>
                      <p className="text-xs text-green-600">• 8 Sub-folders Created</p>
                      <p className="text-xs text-green-600">• Access Control Applied</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            {/* Step 3 Dialogs: Share / Rename / Delete / Add Subfolder */}
            <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Share Folder {shareFolderId ? `· ${getFolderNameById(shareFolderId)}` : ""}</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="sm:col-span-2">
                      <Input
                        placeholder="Add email address"
                        value={shareEmailInput}
                        onChange={(e) => setShareEmailInput(e.target.value)}
                      />
                    </div>
                    <Button onClick={addShareRecipient}>Add</Button>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Access</label>
                    <Select value={shareRole} onValueChange={(v) => setShareRole(v as "Editor" | "Commenter" | "Suggestion")}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Editor">Editor</SelectItem>
                        <SelectItem value="Commenter">Commenter</SelectItem>
                        <SelectItem value="Suggestion">Suggestion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {(folderShares[shareFolderId] ?? []).length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Shared with</p>
                      <div className="flex flex-wrap gap-2">
                        {(folderShares[shareFolderId] ?? []).map(entry => (
                          <Badge key={entry.email} variant="secondary" className="flex items-center gap-2">
                            {entry.email} · {entry.role}
                            <button onClick={() => removeShareRecipient(entry.email)} className="ml-1 text-xs">✕</button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowShareDialog(false)}>Cancel</Button>
                  <Button onClick={confirmShare}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Rename Folder {renameFolderId ? `· ${getFolderNameById(renameFolderId)}` : ""}</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <Input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowRenameDialog(false)}>Cancel</Button>
                  <Button onClick={applyRenameFolder}>Rename</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Delete Folder {deleteFolderName ? `· ${deleteFolderName}` : ""}</DialogTitle>
                </DialogHeader>
                <p className="text-sm">Are you sure you want to delete "{deleteFolderName}"? This action cannot be undone.</p>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                  <Button variant="destructive" onClick={applyDeleteFolder}>Delete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={showAddSubDialog} onOpenChange={setShowAddSubDialog}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Subfolder {addSubParentId ? `· ${getFolderNameById(addSubParentId)}` : ""}</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <Input
                    placeholder="Subfolder name"
                    value={newSubfolderName}
                    onChange={(e) => setNewSubfolderName(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddSubDialog(false)}>Cancel</Button>
                  <Button
                    onClick={() => {
                      if (!newSubfolderName.trim()) return;
                      setFolderStructure(prev => prev.map(f => {
                        if (f.id === addSubParentId) {
                          const children = f.children ? [...f.children] : [];
                          const newId = `${f.id}-${children.length + 1}`;
                          return { ...f, children: [...children, { id: newId, name: newSubfolderName.trim() }] };
                        }
                        return f;
                      }));
                      setShowAddSubDialog(false);
                      toast({ title: "Subfolder added", description: `Created '${newSubfolderName}'` });
                      const parentName = getFolderNameById(addSubParentId) || "Root";
                      logAudit("UPLOADED", newSubfolderName.trim(), parentName);
                    }}
                  >
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Card>
        )}

        {/* Step 4: Document Upload */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>STEP 4: UPLOAD DOCUMENTS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                {/* Folder Selection */}
                <div>
                  <h4 className="font-medium mb-3">SELECT FOLDER</h4>
                  <div className="border rounded-lg p-4 space-y-2 max-h-64 overflow-y-auto">
                    {folderStructure.map((folder) => (
                      <div key={folder.id}>
                        <div className="flex items-center gap-2 font-medium">
                          <FolderOpen className="h-4 w-4 text-blue-600" />
                          <span>{folder.name}</span>
                        </div>
                        {folder.children && (
                          <div className="ml-6 space-y-1">
                            {folder.children.map((child) => (
                              <label key={child.id} className="flex items-center gap-2 text-sm cursor-pointer p-1 rounded hover:bg-muted/50">
                                <input 
                                  type="radio" 
                                  name="selectedFolder" 
                                  value={child.id}
                                  checked={selectedFolder === child.id}
                                  onChange={() => setSelectedFolder(child.id)}
                                />
                                <span>{child.name}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="mt-4 w-full">
                      <FolderOpen className="h-3 w-3 mr-1" />
                      Select All Folders
                    </Button>
                  </div>
                </div>

                {/* Document Upload & Management */}
                <div>
                  <h4 className="font-medium mb-3">DOCUMENT UPLOAD & MANAGEMENT</h4>
                  <div className="space-y-4">
                    <div className="p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                        Current Folder: 
                        <FolderOpen className="h-4 w-4" />
                        Audited_Financial_Stmt
                      </p>
                      <div className="flex gap-2 justify-center">
                        <Button>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Files
                        </Button>
                        <Button variant="outline">
                          <FolderOpen className="h-4 w-4 mr-2" />
                          Drag & Drop Here
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">UPLOADED DOCUMENTS:</h5>
                      <div className="border rounded-lg">
                        {uploadedDocuments.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                            <div className="flex items-center gap-3">
                              <FileText className="h-4 w-4 text-blue-600" />
                              <div>
                                <p className="font-medium text-sm">{doc.name}</p>
                                <p className="text-xs text-muted-foreground">{doc.size}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(doc.status)}
                              <span className="text-xs capitalize">{doc.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">DOCUMENT ACTIONS:</h5>
                      <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                        Selected: 
                        <FileText className="h-4 w-4" />
                        Balance_Sheet_2023.pdf
                      </p>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Document Name:</label>
                          <Input value="Balance_Sheet_2023.pdf" />
                        </div>

                        <div>
                          <h6 className="text-sm font-medium mb-2">SHARE DOCUMENT:</h6>
                          <div className="flex gap-2 mb-2">
                            <Input placeholder="Add Email" />
                            <Select defaultValue="editor">
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="editor">Editor</SelectItem>
                                <SelectItem value="commenter">Commenter</SelectItem>
                                <SelectItem value="viewer">View</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button size="sm">
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="space-y-1 text-sm">
                            <p className="font-medium">DOCUMENT SHARES:</p>
                            <p>• Due Diligence Team (All Members)</p>
                            <div className="flex items-center justify-between">
                              <span>• cfo@company.com - Editor</span>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3 mr-1" />
                            Rename
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-3 w-3 mr-1" />
                            Properties
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Multiple
                </Button>
                <Button variant="outline">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Move Selected
                </Button>
                <Button variant="outline">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete All
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Access Management */}
        {currentStep === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>STEP 5: MANAGE ALLOCATIONS</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="room" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="room" className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Assign Document Storage Room
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Assign Documents
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="room" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">ASSIGN DOCUMENT STORAGE ROOM ACCESS</CardTitle>
                      <p className="text-sm text-muted-foreground">ROOM: Q4 Due Diligence Process</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-3">ADD NEW USERS:</h4>
                        <div className="flex gap-2 mb-3">
                          <Input 
                            placeholder="investor@fund.com"
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                          />
                          <Select value={newUserRole} onValueChange={setNewUserRole}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Viewer">Viewer</SelectItem>
                              <SelectItem value="Commenter">Commenter</SelectItem>
                              <SelectItem value="Editor">Editor</SelectItem>
                              <SelectItem value="Admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button onClick={addRoomUser}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>

                        <div className="mb-4">
                          <Select defaultValue="partners">
                            <SelectTrigger>
                              <SelectValue placeholder="Partners & Associates" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="partners">Partners & Associates</SelectItem>
                              <SelectItem value="legal">Legal Team</SelectItem>
                              <SelectItem value="audit">Audit Team</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button className="mt-2" variant="outline">Add Selected</Button>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">CURRENT ROOM ACCESS:</h4>
                        <div className="border rounded-lg">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b bg-muted/50">
                                <th className="text-left p-3 text-sm font-medium">User</th>
                                <th className="text-left p-3 text-sm font-medium">Access Level</th>
                                <th className="text-left p-3 text-sm font-medium">Added Date</th>
                                <th className="text-left p-3 text-sm font-medium">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {roomUsers.map((user) => (
                                <tr key={user.id} className="border-b">
                                  <td className="p-3 text-sm">{user.name}</td>
                                  <td className="p-3">
                                    <Badge variant="outline">{user.type}</Badge>
                                  </td>
                                  <td className="p-3 text-sm text-muted-foreground">{user.addedDate}</td>
                                  <td className="p-3">
                                    <div className="flex gap-1">
                                      <Button variant="ghost" size="sm">
                                        <Settings className="h-3 w-3" />
                                      </Button>
                                      <Button variant="ghost" size="sm">
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline">
                          <Mail className="h-4 w-4 mr-2" />
                          Send Invites
                        </Button>
                        <Button variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          Export List
                        </Button>
                        <Button variant="outline">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove Selected
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">ASSIGN DOCUMENTS</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Select Document */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium mb-1 block">Select Document</label>
                          <Select value={selectedAssignDoc} onValueChange={setSelectedAssignDoc}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {uploadedDocuments.map(doc => (
                                <SelectItem key={doc.id} value={doc.id}>{doc.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Default Access</label>
                          <Select value={assignRole} onValueChange={(v) => setAssignRole(v as "Editor" | "Commenter" | "Suggestion")}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Editor">Editor</SelectItem>
                              <SelectItem value="Commenter">Commenter</SelectItem>
                              <SelectItem value="Suggestion">Suggestion</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Add by Email */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Add by Email</label>
                        <div className="flex gap-2">
                          <Input placeholder="user@company.com" value={assignEmail} onChange={(e) => setAssignEmail(e.target.value)} />
                          <Button onClick={addAssigneeByEmail}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>

                      {/* Add from Team/Partners */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium mb-1 block">Select from Team Members & Partners</label>
                          <Select value={selectUserId} onValueChange={setSelectUserId}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose user" />
                            </SelectTrigger>
                            <SelectContent>
                              {allSelectableUsers.map(u => (
                                <SelectItem key={u.id} value={u.id}>{u.name} ({u.email})</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Button className="w-full" onClick={addAssigneeFromSelect}>
                            Assign
                          </Button>
                        </div>
                      </div>

                      {/* Current Assignments */}
                      <div>
                        <h4 className="font-medium mb-2">Current Assignees</h4>
                        <div className="border rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b bg-muted/50">
                                <th className="text-left p-3 text-sm font-medium">Name / Email</th>
                                <th className="text-left p-3 text-sm font-medium">Access</th>
                                <th className="text-left p-3 text-sm font-medium">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(docAssignments[selectedAssignDoc] ?? []).length === 0 ? (
                                <tr>
                                  <td className="p-3 text-sm text-muted-foreground" colSpan={3}>No assignees yet. Add from email or user list above.</td>
                                </tr>
                              ) : (
                                (docAssignments[selectedAssignDoc] ?? []).map(assignee => (
                                  <tr key={assignee.id} className="border-b">
                                    <td className="p-3 text-sm">
                                      <div className="flex flex-col">
                                        <span className="font-medium">{assignee.label}</span>
                                        <span className="text-xs text-muted-foreground">{assignee.email}</span>
                                      </div>
                                    </td>
                                    <td className="p-3">
                                      <Select value={assignee.role} onValueChange={(v) => updateAssigneeRole(assignee.id, v as Assignee["role"])}>
                                        <SelectTrigger className="w-40">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Editor">Editor</SelectItem>
                                          <SelectItem value="Commenter">Commenter</SelectItem>
                                          <SelectItem value="Suggestion">Suggestion</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </td>
                                    <td className="p-3">
                                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeAssignee(assignee.id)}>
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">NOTIFICATION SETTINGS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">Send email invitations to new users</span>
                    </div>
                    <Checkbox 
                      checked={notifications.emailInvites}
                      onCheckedChange={(checked) => setNotifications({...notifications, emailInvites: !!checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <span className="text-sm">Notify on document uploads</span>
                    </div>
                    <Checkbox 
                      checked={notifications.uploadNotifications}
                      onCheckedChange={(checked) => setNotifications({...notifications, uploadNotifications: !!checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">Weekly activity digest</span>
                    </div>
                    <Checkbox 
                      checked={notifications.weeklyDigest}
                      onCheckedChange={(checked) => setNotifications({...notifications, weeklyDigest: !!checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">SMS notifications for urgent updates</span>
                    </div>
                    <Checkbox 
                      checked={notifications.smsUrgent}
                      onCheckedChange={(checked) => setNotifications({...notifications, smsUrgent: !!checked})}
                    />
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button 
            variant="outline" 
            size="sm"
            className="h-9"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <div className="flex items-center gap-3">
            {currentStep === steps.length ? (
              <Button size="sm" className="h-9" onClick={handleComplete}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Complete Room Creation
              </Button>
            ) : (
              <Button size="sm" className="h-9" onClick={handleNext}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateVDRRoomComplete;
