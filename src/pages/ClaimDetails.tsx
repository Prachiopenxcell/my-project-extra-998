import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { 
  ArrowLeft,
  Edit,
  Save,
  FileText,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  Calendar,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Download,
  Upload,
  Activity,
  Eye,
  Send
} from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

interface ClaimData {
  id: string;
  claimantName: string;
  claimantCategory: string;
  claimedAmount: number;
  principalAmount: number;
  interestAmount: number;
  status: string;
  submissionDate: string;
  entityName: string;
  assignedTo?: string;
  verifiedBy?: string;
  admittedBy?: string;
  claimantDetails: {
    email: string;
    phone: string;
    address: string;
    pan: string;
    registrationNumber: string;
  };
  claimDetails: {
    natureOfDebt: string;
    referenceDocumentType: string;
    referenceDocumentNo: string;
    currency: string;
    debtIncurredDate: string;
    dueDateForPayment: string;
    interestRate: number;
    interestType: string;
  };
  documents: Array<{
    id: string;
    name: string;
    type: string;
    uploadDate: string;
    size: string;
  }>;
  invitation: {
    capacity: string;
    authority: string;
    orderNumber?: string;
    orderDate?: string;
    emailAddress: string;
    postAddress: string;
    isTwoStageInvite: boolean;
    aiAssistanceOpted?: boolean;
    claimReceiptCutoffDate?: string;
    claimVerifiedCutoffDate?: string;
  };
  assignmentAdmission?: {
    assignedByClaimant: boolean;
    assigneeName?: string;
    assignmentDate?: string;
  };
}

const ClaimDetails = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'invitation';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [editModeInvite, setEditModeInvite] = useState(false);
  const mockTeam = [
    { id: 'tm-001', name: 'John Verifier' },
    { id: 'tm-002', name: 'Sarah Admitter' },
    { id: 'tm-003', name: 'Mike Analyst' },
    { id: 'tm-004', name: 'Lisa Manager' }
  ];

  // Mock data - replace with actual API call
  const [claimData, setClaimData] = useState<ClaimData>({
    id: "claim-001",
    claimantName: "State Bank of India",
    claimantCategory: "Financial Creditor - Secured",
    claimedAmount: 5000000,
    principalAmount: 4500000,
    interestAmount: 500000,
    status: "verification_pending",
    submissionDate: "2024-01-20",
    entityName: "ABC Corporation Ltd",
    assignedTo: "John Doe",
    claimantDetails: {
      email: "claims@sbi.co.in",
      phone: "+91-11-22334455",
      address: "State Bank Bhavan, Nariman Point, Mumbai - 400021",
      pan: "AAACS1234F",
      registrationNumber: "L65191MH1955PLC008331"
    },
    claimDetails: {
      natureOfDebt: "Loan - Principal",
      referenceDocumentType: "Loan Agreement",
      referenceDocumentNo: "LA/2023/001234",
      currency: "INR",
      debtIncurredDate: "2023-03-15",
      dueDateForPayment: "2023-12-15",
      interestRate: 12.5,
      interestType: "Per Annum"
    },
    documents: [
      {
        id: "doc-001",
        name: "Loan Agreement.pdf",
        type: "PDF",
        uploadDate: "2024-01-20",
        size: "2.5 MB"
      },
      {
        id: "doc-002",
        name: "Bank Statements.pdf",
        type: "PDF",
        uploadDate: "2024-01-20",
        size: "1.8 MB"
      },
      {
        id: "doc-003",
        name: "Demand Notice.pdf",
        type: "PDF",
        uploadDate: "2024-01-20",
        size: "0.9 MB"
      }
    ],
    invitation: {
      capacity: "IRP appointed by NCLT",
      authority: "Admission Order by NCLT",
      orderNumber: "NCLT/001/2024",
      orderDate: "2024-01-10",
      emailAddress: "claims@abccorp.com",
      postAddress: "123 Business District, Mumbai - 400001",
      isTwoStageInvite: true,
      aiAssistanceOpted: true,
      claimReceiptCutoffDate: "2024-01-31",
      claimVerifiedCutoffDate: "2024-02-05"
    },
    assignmentAdmission: {
      assignedByClaimant: false,
    }
  });

  // Admission state and helpers (inside component)
  type AdmissionStatus = 'pending' | 'ongoing' | 'completed';
  const [admissionRow, setAdmissionRow] = useState({
    category: 'Financial Creditor - Secured',
    claimant: claimData.claimantName,
    securityTypeSubmitter: 'Secured' as 'Secured' | 'Unsecured',
    relationshipStatusSubmitter: 'Not Related',
    claimedAmount: claimData.claimedAmount,
    amountAsPerPlatform: undefined as number | undefined,
    amountAsPerVerifier: undefined as number | undefined,
    amountAsPerAdmittor: undefined as number | undefined,
    remarksByPlatform: [] as string[],
    remarksByVerifier: '' as string,
    remarksByAdmittor: '' as string,
    actionByAdmittor: '' as '' | 'accept_verifier' | 'recheck',
    status: 'pending' as AdmissionStatus
  });

  const [showAdmissionDialog, setShowAdmissionDialog] = useState(false);

  const handleAdmittorAction = (v: 'accept_verifier' | 'recheck') => {
    if (v === 'accept_verifier') {
      const base = verificationRow.amountAsPerVerifier ?? verificationRow.amountAsPerPlatform;
      if (base == null) {
        toast({ title: 'No Verifier Amount', description: 'Verifier amount not available. Please ensure verification is completed.' });
        return;
      }
      setAdmissionRow(prev => ({ ...prev, actionByAdmittor: 'accept_verifier', amountAsPerAdmittor: base, status: 'completed' }));
      setAuditLog(prev => ([...prev, { id: crypto.randomUUID?.() || Math.random().toString(36).slice(2), action: 'Claim admission', actioner: 'Admittor', timestamp: new Date().toISOString(), comment: 'Admittor accepted Verifier figure. Admission completed.', icon: 'admit' }]));
      toast({ title: 'Admission Completed', description: 'Admittor accepted Verifier figure.' });
      return;
    }
    setAdmissionRow(prev => ({ ...prev, actionByAdmittor: 'recheck', status: 'ongoing' }));
    setShowAdmissionDialog(true);
  };

  // Verification state and helpers (inside component)
  type VerificationStatus = 'pending' | 'ongoing' | 'completed' | 'modification_by_submitter';
  const platformRemarksOptions = [
    'Information/ Documents pending from Submitter',
    'Supporting Documents provided are not legible',
    'Supporting Documents provided are not relevant',
    'Additional Information/ Documents sought pending from Submitter',
    'Claim Form not signed by Claimant/ AR',
    'Claim Form not verified by Claimant/ AR',
    'Wrong Form Type used for claim submission',
    'Mismatch between Principal Amount claimed and figures derived from supporting documents',
    'Mismatch between Interest Amount claimed and figures derived from supporting documents',
    'Mismatch between Security Charges claimed and supporting documents provided'
  ];

  const [verificationUploads, setVerificationUploads] = useState<{ outstandingBalancesFile?: File; ledgers: File[] }>({
    outstandingBalancesFile: undefined,
    ledgers: []
  });

  const [verificationRow, setVerificationRow] = useState({
    category: 'Financial Creditor - Secured',
    claimant: claimData.claimantName,
    securityType: 'Secured' as 'Secured' | 'Unsecured',
    relationshipStatus: 'Not Related',
    claimedAmount: claimData.claimedAmount,
    platformRemarks: [] as string[],
    amountAsPerPlatform: undefined as number | undefined,
    amountAsPerVerifier: undefined as number | undefined,
    actionByVerifier: '' as '' | 'verify' | 'accept_platform',
    status: 'pending' as VerificationStatus
  });

  const runAIMatch = () => {
    if (!claimData.invitation.aiAssistanceOpted) {
      toast({ title: 'AI Assistance not opted', description: 'Enable AI assistance to auto-suggest platform figures.' });
      return;
    }
    if (verificationUploads.outstandingBalancesFile || verificationUploads.ledgers.length > 0) {
      const suggested = Math.floor(verificationRow.claimedAmount * 0.9);
      setVerificationRow(prev => ({ ...prev, amountAsPerPlatform: suggested, platformRemarks: ['As per matched ledgers, certain entries differ.'] }));
      setAuditLog(prev => ([...prev, { id: crypto.randomUUID?.() || Math.random().toString(36).slice(2), action: 'Claim verification', actioner: 'Platform AI', timestamp: new Date().toISOString(), comment: 'Platform suggested admissible amount based on uploads.', icon: 'verify' }]));
      toast({ title: 'AI Match Complete', description: 'Platform figures and remarks updated.' });
    } else {
      toast({ title: 'Upload required', description: 'Upload Outstanding Balances or Ledger files to run AI match.' });
    }
  };

  const handleVerifierAction = (v: 'verify' | 'accept_platform') => {
    if (v === 'accept_platform') {
      if (!claimData.invitation.aiAssistanceOpted) {
        toast({ title: 'AI required', description: 'Accepting Platform Figure is available only if AI assistance is opted.' });
        return;
      }
      if (verificationRow.amountAsPerPlatform == null) {
        toast({ title: 'No Platform Figure', description: 'Run AI match to get platform figure first.' });
        return;
      }
      setVerificationRow(prev => ({ ...prev, actionByVerifier: 'accept_platform', amountAsPerVerifier: prev.amountAsPerPlatform, status: 'completed' }));
      setAuditLog(prev => ([...prev, { id: crypto.randomUUID?.() || Math.random().toString(36).slice(2), action: 'Claim verification', actioner: 'Verifier', timestamp: new Date().toISOString(), comment: 'Verifier accepted Platform figure. Verification completed.', icon: 'verify' }]));
      toast({ title: 'Verification Completed', description: 'Verifier accepted Platform figure.' });
      return;
    }
    setVerificationRow(prev => ({ ...prev, actionByVerifier: 'verify', status: 'ongoing' }));
    setShowVerifyDialog(true);
  };

  const [showVerifyDialog, setShowVerifyDialog] = useState(false);

  type AuditEntry = { id: string; action: string; actioner: string; timestamp: string; comment: string; icon: 'create'|'update'|'allocate'|'edit'|'view'|'verify'|'admit'|'reject' };
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([
    { id: 'log-001', action: 'Creation of Invite', actioner: 'Admin User', timestamp: '2024-01-10T10:00:00', comment: 'Claim invitation created.', icon: 'create' },
    { id: 'log-002', action: 'Claim Submitted', actioner: 'Claimant', timestamp: '2024-01-20T10:30:00', comment: `Claim was submitted by ${"State Bank of India"}`, icon: 'view' },
    { id: 'log-003', action: 'Allocation edit in allocation', actioner: 'Coordinator', timestamp: '2024-01-20T14:30:00', comment: `Assigned to ${"John Doe"} for verification`, icon: 'allocate' },
  ]);

  // Assignment Admission state
  type PersonType = 'Individual' | 'Company' | 'LLP' | 'Any Other Entity';
  type AccountType = 'Current A/C' | 'Saving A/C' | 'Cash Credit' | 'Overdraft';
  type QueryThread = { id: string; title: string; message: string; attachments: string[]; responses: Array<{ id: string; title: string; message: string; attachments: string[]; by: 'admin'|'assignor' }>; };
  const [assignmentRows, setAssignmentRows] = useState<Array<{ id: string; assignor: string; assignee: string; date: string; details: string }>>([
    { id: 'as-1', assignor: claimData.claimantName, assignee: claimData.assignmentAdmission?.assigneeName || '', date: claimData.assignmentAdmission?.assignmentDate || '', details: '' }
  ]);
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false);
  const [currentAssignmentId, setCurrentAssignmentId] = useState<string | null>(null);
  const [assigneeForm, setAssigneeForm] = useState({
    name: '',
    person: 'Individual' as PersonType,
    pan: '',
    panDocOk: true,
    idNumber: '', // Aadhar/CIN/LLPIN
    idDocOk: true,
    address: '',
    email: '',
    mobile: '',
    securityType: 'Unsecured' as 'Secured'|'Unsecured',
    relationshipStatus: 'Not Related',
    relDocOk: true,
    bankIfsc: '',
    bankType: 'Current A/C' as AccountType,
    bankAccNo: '',
    bankAccNoConfirm: '',
    bankChequeOk: true,
    bankAccName: '',
    accNameChangedReason: '',
    accNameSupportOk: true,
    beneficiaries: [] as Array<{ id: string; name: string; address: string; share: string }>,
  });
  const [assignmentDetails, setAssignmentDetails] = useState({ date: '', docOk: true });
  const [assignmentQueries, setAssignmentQueries] = useState<QueryThread[]>([]);
  const [assignmentDecision, setAssignmentDecision] = useState<{ accepted: boolean | null; reason: string }>({ accepted: null, reason: '' });
  const [savedReports, setSavedReports] = useState<Array<{ id: string; name: string; createdAt: string }>>([]);

  const aiValidate = (label: string) => {
    if (!claimData.invitation.aiAssistanceOpted) return true;
    // Simulate a 90% pass
    const ok = Math.random() > 0.1;
    if (!ok) toast({ title: 'AI Validation', description: `The uploaded document is incorrect for ${label}. You may update the document or proceed.` });
    return ok;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verification_pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'admission_pending':
        return 'bg-orange-100 text-orange-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleVerifyClaim = () => {
    setActiveTab('verification');
    setAuditLog(prev => [
      ...prev,
      { id: crypto.randomUUID?.() || Math.random().toString(36).slice(2), action: 'Claim verification', actioner: 'Verifier', timestamp: new Date().toISOString(), comment: 'Verification process started from in-page tab.', icon: 'verify' }
    ]);
  };

  const handleAdmitClaim = () => {
    navigate(`/claims/admit/${id}`);
    setAuditLog(prev => [
      ...prev,
      { id: crypto.randomUUID?.() || Math.random().toString(36).slice(2), action: 'Claim admission', actioner: 'Admitter', timestamp: new Date().toISOString(), comment: 'Admission process initiated.', icon: 'admit' }
    ]);
  };

  const handleAllocateClaim = () => {
    navigate(`/claims/allocate/${id}`);
    setAuditLog(prev => [
      ...prev,
      { id: crypto.randomUUID?.() || Math.random().toString(36).slice(2), action: 'Allocation edit in allocation', actioner: 'Coordinator', timestamp: new Date().toISOString(), comment: 'Allocation settings updated.', icon: 'allocate' }
    ]);
  };

  const handleDownloadDocument = (docId: string) => {
    toast({
      title: "Download Started",
      description: "Document download has been initiated.",
    });
  };

  const handleAssign = (field: 'verification' | 'admission', memberId: string) => {
    const clear = memberId === '__none__';
    const memberName = clear ? undefined : (mockTeam.find(m => m.id === memberId)?.name || undefined);
    if (field === 'verification') {
      setClaimData(prev => ({ ...prev, assignedTo: memberName }));
    } else {
      setClaimData(prev => ({ ...prev, admittedBy: memberName }));
    }
    setAuditLog(prev => ([
      ...prev,
      { id: crypto.randomUUID?.() || Math.random().toString(36).slice(2), action: 'Allocation edit in allocation', actioner: 'Coordinator', timestamp: new Date().toISOString(), comment: `${field === 'verification' ? 'Verification' : 'Admission'} assignee ${memberName ? `set to ${memberName}` : 'cleared to Not Allocated'}.`, icon: 'allocate' }
    ]));
  };

  // Log viewing of the claim on mount
  useEffect(() => {
    setAuditLog(prev => [
      ...prev,
      { id: crypto.randomUUID?.() || Math.random().toString(36).slice(2), action: 'Viewing of the claims', actioner: 'Current User', timestamp: new Date().toISOString(), comment: 'Claim details viewed.', icon: 'view' }
    ]);
  }, []);

  const handleSaveInvite = () => {
    setEditModeInvite(false);
    setAuditLog(prev => [
      ...prev,
      { id: crypto.randomUUID?.() || Math.random().toString(36).slice(2), action: 'Updates in Invite', actioner: 'Current User', timestamp: new Date().toISOString(), comment: 'Invitation details updated and saved.', icon: 'update' }
    ]);
    toast({ title: 'Invitation Updated', description: 'Claim invitation details saved successfully.' });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate('/claims/all-claims')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Claims
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Claim Details</h1>
            <p className="text-gray-600 mt-1">Claim ID: {claimData.id}</p>
          </div>
          <div className="flex gap-3">
            {claimData.status === 'verification_pending' && (
              <Button onClick={handleVerifyClaim} className="bg-blue-600 hover:bg-blue-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Verify Claim
              </Button>
            )}
            {claimData.status === 'admission_pending' && (
              <Button onClick={handleAdmitClaim} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Admit Claim
              </Button>
            )}
            {claimData.status === 'allocation_pending' && (
              <Button onClick={handleAllocateClaim} className="bg-purple-600 hover:bg-purple-700">
                <Users className="w-4 h-4 mr-2" />
                Allocate Claim
              </Button>
            )}
          </div>
        </div>

        {/* Status Overview */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-100">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Claimant</p>
                  <p className="font-semibold">{claimData.claimantName}</p>
                  <p className="text-xs text-gray-500">{claimData.claimantCategory}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-100">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Claimed Amount</p>
                  <p className="font-semibold text-lg">{formatCurrency(claimData.claimedAmount)}</p>
                  <p className="text-xs text-gray-500">
                    Principal: {formatCurrency(claimData.principalAmount)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-yellow-100">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className={getStatusColor(claimData.status)}>
                    {claimData.status.replace('_', ' ')}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    Submitted: {new Date(claimData.submissionDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-purple-100">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Assignment</p>
                  <p className="font-semibold">{claimData.assignedTo || 'Unassigned'}</p>
                  <p className="text-xs text-gray-500">
                    Entity: {claimData.entityName}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="invitation">Claim Invite</TabsTrigger>
            <TabsTrigger value="submission">Submission Details</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            {claimData.invitation.isTwoStageInvite && (
              <TabsTrigger value="admission">Admission</TabsTrigger>
            )}
            <TabsTrigger value="assignment">Claim Assignment Admission</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="invitation">
            <Card>
              <CardHeader>
                <CardTitle>Claim Invitation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-end">
                  {!editModeInvite ? (
                    <Button variant="outline" size="sm" onClick={() => setEditModeInvite(true)}>
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditModeInvite(false)}>Cancel</Button>
                      <Button size="sm" onClick={handleSaveInvite}><Save className="w-4 h-4 mr-2"/> Save</Button>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Capacity</label>
                    {editModeInvite ? (
                      <Input className="mt-1" value={claimData.invitation.capacity} onChange={(e) => setClaimData(prev => ({...prev, invitation: { ...prev.invitation, capacity: e.target.value }}))} />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{claimData.invitation.capacity}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Authority</label>
                    {editModeInvite ? (
                      <Input className="mt-1" value={claimData.invitation.authority} onChange={(e) => setClaimData(prev => ({...prev, invitation: { ...prev.invitation, authority: e.target.value }}))} />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{claimData.invitation.authority}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Order Number</label>
                    {editModeInvite ? (
                      <Input className="mt-1" value={claimData.invitation.orderNumber || ''} onChange={(e) => setClaimData(prev => ({...prev, invitation: { ...prev.invitation, orderNumber: e.target.value }}))} />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{claimData.invitation.orderNumber}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Order Date</label>
                    {editModeInvite ? (
                      <Input className="mt-1" type="date" value={claimData.invitation.orderDate || ''} onChange={(e) => setClaimData(prev => ({...prev, invitation: { ...prev.invitation, orderDate: e.target.value }}))} />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{claimData.invitation.orderDate ? new Date(claimData.invitation.orderDate).toLocaleDateString() : '-'}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Receiving Address</label>
                  {editModeInvite ? (
                    <>
                      <Input className="mt-1" value={claimData.invitation.emailAddress} onChange={(e) => setClaimData(prev => ({...prev, invitation: { ...prev.invitation, emailAddress: e.target.value }}))} />
                      <Textarea className="mt-2" value={claimData.invitation.postAddress} onChange={(e) => setClaimData(prev => ({...prev, invitation: { ...prev.invitation, postAddress: e.target.value }}))} />
                    </>
                  ) : (
                    <>
                      <p className="mt-1 text-sm text-gray-900">{claimData.invitation.emailAddress}</p>
                      <p className="mt-1 text-sm text-gray-900">{claimData.invitation.postAddress}</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignment">
            <Card>
              <CardHeader>
                <CardTitle>Claim Assignment Admission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">If the claimant has assigned the debt, add details below. Admin with proper rights can fill on claimant’s behalf.</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={()=>{
                      const id = crypto.randomUUID?.() || Math.random().toString(36).slice(2);
                      setAssignmentRows(prev=>[...prev,{ id, assignor: claimData.claimantName, assignee:'', date:'', details:'' }]);
                      setAuditLog(prev=>[...prev,{ id: crypto.randomUUID?.() || Math.random().toString(36).slice(2), action:'Allocation edit in allocation', actioner:'Coordinator', timestamp:new Date().toISOString(), comment:'New assignment row added.', icon:'allocate'}]);
                    }}>Add Row</Button>
                  </div>
                </div>
                <div className="overflow-x-auto border rounded-lg">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr className="text-left">
                        <th className="p-3">Assignor</th>
                        <th className="p-3">Assignee</th>
                        <th className="p-3">Date of Assignment</th>
                        <th className="p-3">Details</th>
                        <th className="p-3">View</th>
                        <th className="p-3">Upload</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignmentRows.map(r=> (
                        <tr key={r.id} className="border-t">
                          <td className="p-3">{r.assignor}</td>
                          <td className="p-3">{r.assignee || '-'}</td>
                          <td className="p-3">{r.date || '-'}</td>
                          <td className="p-3">{r.details || '-'}</td>
                          <td className="p-3"><Button variant="outline" size="sm" onClick={()=>{ setCurrentAssignmentId(r.id); setShowAssignmentDialog(true); }}>View</Button></td>
                          <td className="p-3"><Button size="sm" onClick={()=>{ setCurrentAssignmentId(r.id); setShowAssignmentDialog(true); }}>Upload</Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Dialog open={showAssignmentDialog} onOpenChange={setShowAssignmentDialog}>
                  <DialogContent className="max-w-5xl overflow-y-auto max-h-[85vh]">
                    <DialogHeader>
                      <DialogTitle>Details of Assignment</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                      {/* Section 1: Assignee Details */}
                      <Card>
                        <CardHeader><CardTitle>Assignee Details</CardTitle></CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-4">
                          <Input placeholder="Assignee Name" value={assigneeForm.name} onChange={(e)=> setAssigneeForm(prev=>({ ...prev, name: e.target.value }))}/>
                          <Select value={assigneeForm.person} onValueChange={(v: PersonType)=> setAssigneeForm(prev=>({ ...prev, person: v }))}>
                            <SelectTrigger><SelectValue placeholder="Person"/></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Individual">Individual</SelectItem>
                              <SelectItem value="Company">Company</SelectItem>
                              <SelectItem value="LLP">LLP</SelectItem>
                              <SelectItem value="Any Other Entity">Any Other Entity</SelectItem>
                            </SelectContent>
                          </Select>
                          <div>
                            <Input placeholder="PAN" value={assigneeForm.pan} onChange={(e)=> setAssigneeForm(prev=>({ ...prev, pan: e.target.value }))}/>
                            <Input type="file" className="mt-2" onChange={()=> setAssigneeForm(prev=>({ ...prev, panDocOk: aiValidate('PAN') }))} />
                          </div>
                          <div>
                            <Input placeholder="Aadhar/CIN/LLPIN" value={assigneeForm.idNumber} onChange={(e)=> setAssigneeForm(prev=>({ ...prev, idNumber: e.target.value }))}/>
                            <Input type="file" className="mt-2" onChange={()=> setAssigneeForm(prev=>({ ...prev, idDocOk: aiValidate('Aadhar/CIN/LLPIN') }))} />
                          </div>
                          <Textarea className="md:col-span-2" placeholder="Address" value={assigneeForm.address} onChange={(e)=> setAssigneeForm(prev=>({ ...prev, address: e.target.value }))} />
                          <Input placeholder="Email" value={assigneeForm.email} onChange={(e)=> setAssigneeForm(prev=>({ ...prev, email: e.target.value }))}/>
                          <Input placeholder="Mobile" value={assigneeForm.mobile} onChange={(e)=> setAssigneeForm(prev=>({ ...prev, mobile: e.target.value }))}/>
                          <Select value={assigneeForm.securityType} onValueChange={(v: 'Secured'|'Unsecured')=> setAssigneeForm(prev=>({ ...prev, securityType: v }))}>
                            <SelectTrigger><SelectValue placeholder="Security Type"/></SelectTrigger>
                            <SelectContent><SelectItem value="Secured">Secured</SelectItem><SelectItem value="Unsecured">Unsecured</SelectItem></SelectContent>
                          </Select>
                          <Input placeholder="Relationship Status" value={assigneeForm.relationshipStatus} onChange={(e)=> setAssigneeForm(prev=>({ ...prev, relationshipStatus: e.target.value }))}/>
                          <div className="md:col-span-2">
                            <label className="text-sm text-gray-700">Relationship Supporting Document</label>
                            <Input type="file" className="mt-1" onChange={()=> setAssigneeForm(prev=>({ ...prev, relDocOk: aiValidate('Relationship Proof') }))} />
                          </div>
                          <Input placeholder="Bank IFSC" value={assigneeForm.bankIfsc} onChange={(e)=> setAssigneeForm(prev=>({ ...prev, bankIfsc: e.target.value }))}/>
                          <Select value={assigneeForm.bankType} onValueChange={(v: AccountType)=> setAssigneeForm(prev=>({ ...prev, bankType: v }))}>
                            <SelectTrigger><SelectValue placeholder="A/c Type"/></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Current A/C">Current A/C</SelectItem>
                              <SelectItem value="Saving A/C">Saving A/C</SelectItem>
                              <SelectItem value="Cash Credit">Cash Credit</SelectItem>
                              <SelectItem value="Overdraft">Overdraft</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input placeholder="A/c No." value={assigneeForm.bankAccNo} onChange={(e)=> setAssigneeForm(prev=>({ ...prev, bankAccNo: e.target.value }))}/>
                          <Input placeholder="Confirm A/c No." value={assigneeForm.bankAccNoConfirm} onChange={(e)=> setAssigneeForm(prev=>({ ...prev, bankAccNoConfirm: e.target.value }))}/>
                          <div className="md:col-span-2">
                            <label className="text-sm text-gray-700">Upload Cancelled Cheque</label>
                            <Input type="file" className="mt-1" onChange={()=> setAssigneeForm(prev=>({ ...prev, bankChequeOk: aiValidate('Cancelled Cheque') }))} />
                          </div>
                          <Input placeholder="A/c Name" value={assigneeForm.bankAccName} onChange={(e)=> setAssigneeForm(prev=>({ ...prev, bankAccName: e.target.value }))}/>
                          <Textarea placeholder="Explanation for Changed Name" value={assigneeForm.accNameChangedReason} onChange={(e)=> setAssigneeForm(prev=>({ ...prev, accNameChangedReason: e.target.value }))}/>
                          <div className="md:col-span-2">
                            <label className="text-sm text-gray-700">Upload Supporting Document (name change)</label>
                            <Input type="file" className="mt-1" onChange={()=> setAssigneeForm(prev=>({ ...prev, accNameSupportOk: aiValidate('Name Change Support') }))} />
                          </div>
                          {/* Beneficiaries */}
                          <div className="md:col-span-2">
                            <div className="flex justify-between items-center mb-2">
                              <p className="font-medium">Beneficiaries</p>
                              <Button variant="outline" size="sm" onClick={()=> setAssigneeForm(prev=>({ ...prev, beneficiaries: [...prev.beneficiaries, { id: crypto.randomUUID?.() || Math.random().toString(36).slice(2), name:'', address:'', share:'' }] }))}>Add Beneficiary</Button>
                            </div>
                            <div className="space-y-3">
                              {assigneeForm.beneficiaries.map((b, idx)=> (
                                <div key={b.id} className="grid md:grid-cols-3 gap-2">
                                  <Input placeholder="Beneficiary's Name" value={b.name} onChange={(e)=>{
                                    const list = [...assigneeForm.beneficiaries]; list[idx] = { ...list[idx], name: e.target.value }; setAssigneeForm(prev=>({ ...prev, beneficiaries: list }));
                                  }}/>
                                  <Input placeholder="Address" value={b.address} onChange={(e)=>{
                                    const list = [...assigneeForm.beneficiaries]; list[idx] = { ...list[idx], address: e.target.value }; setAssigneeForm(prev=>({ ...prev, beneficiaries: list }));
                                  }}/>
                                  <Input placeholder="Share" value={b.share} onChange={(e)=>{
                                    const list = [...assigneeForm.beneficiaries]; list[idx] = { ...list[idx], share: e.target.value }; setAssigneeForm(prev=>({ ...prev, beneficiaries: list }));
                                  }}/>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Section 2: Assignment Details */}
                      <Card>
                        <CardHeader><CardTitle>Assignment Details</CardTitle></CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-3">
                          <Input type="date" placeholder="Date of Assignment" value={assignmentDetails.date} onChange={(e)=> setAssignmentDetails(prev=>({ ...prev, date: e.target.value }))}/>
                          <div>
                            <label className="text-sm text-gray-700">Supporting Document</label>
                            <Input type="file" className="mt-1" onChange={()=> setAssignmentDetails(prev=>({ ...prev, docOk: aiValidate('Assignment Document') }))} />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Section 3: Observation/Queries */}
                      <Card>
                        <CardHeader><CardTitle>Observations / Queries</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-end pt-1">
                            <Button variant="outline" size="sm" onClick={()=> setAssignmentQueries(prev=>[...prev,{ id: crypto.randomUUID?.() || Math.random().toString(36).slice(2), title:'New Query', message:'', attachments:[], responses:[] }])}>Add Query</Button>
                          </div>
                          {assignmentQueries.map((q,i)=> (
                            <div key={q.id} className="border rounded-md p-4 space-y-3 bg-gray-50">
                              <Input placeholder="Query Title" value={q.title} onChange={(e)=>{ const list=[...assignmentQueries]; list[i]={...list[i], title:e.target.value}; setAssignmentQueries(list); }}/>
                              <Textarea placeholder="Query" value={q.message} onChange={(e)=>{ const list=[...assignmentQueries]; list[i]={...list[i], message:e.target.value}; setAssignmentQueries(list); }}/>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={()=>{
                                  const rid = crypto.randomUUID?.() || Math.random().toString(36).slice(2);
                                  const list=[...assignmentQueries];
                                  list[i] = { ...list[i], responses: [...list[i].responses, { id: rid, title: 'Response', message: '', attachments: [], by: 'admin' }] };
                                  setAssignmentQueries(list);
                                }}>Respond</Button>
                                <Button size="sm" onClick={()=> toast({ title: 'Upload Attachment', description: 'Use the upload control inside the response.' })}>Attach</Button>
                              </div>
                              <div className="space-y-3">
                                {q.responses.map((r,ri)=> (
                                  <div key={r.id} className="border rounded-md p-3 bg-white space-y-2">
                                    <Input placeholder="Response Title" value={r.title} onChange={(e)=>{ const list=[...assignmentQueries]; const res=[...list[i].responses]; res[ri] = { ...res[ri], title: e.target.value }; list[i] = { ...list[i], responses: res }; setAssignmentQueries(list); }}/>
                                    <Textarea placeholder="Message" value={r.message} onChange={(e)=>{ const list=[...assignmentQueries]; const res=[...list[i].responses]; res[ri] = { ...res[ri], message: e.target.value }; list[i] = { ...list[i], responses: res }; setAssignmentQueries(list); }}/>
                                    <Input type="file" onChange={()=> toast({ title: 'Attachment Uploaded', description: 'Saved to this response.' })}/>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      {/* Section 4: Admission */}
                      <Card>
                        <CardHeader><CardTitle>Admission</CardTitle></CardHeader>
                        <CardContent className="space-y-8">
                          <div className="grid md:grid-cols-2 gap-6">
                            <Select value={assignmentDecision.accepted===null? '': (assignmentDecision.accepted? 'yes':'no')} onValueChange={(v)=> setAssignmentDecision(prev=>({ ...prev, accepted: v==='yes' ? true : (v==='no' ? false : null) }))}>
                              <SelectTrigger><SelectValue placeholder="Admit Assignment? (Yes/No)"/></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                            <Textarea placeholder="Reason (acceptance / rejection)" value={assignmentDecision.reason} onChange={(e)=> setAssignmentDecision(prev=>({ ...prev, reason: e.target.value }))}/>
                          </div>
                          <p className="text-xs text-gray-500">If admitted, reports and claim ownership reflect assignee; history retains original claimant.</p>
                        </CardContent>
                      </Card>
                    </div>

                    <DialogFooter className="gap-2">
                      <Button variant="outline" onClick={()=> setShowAssignmentDialog(false)}>Close</Button>
                      <Button onClick={()=>{
                        // Basic validation: A/c no match
                        if (assigneeForm.bankAccNo && assigneeForm.bankAccNoConfirm && assigneeForm.bankAccNo !== assigneeForm.bankAccNoConfirm) {
                          toast({ title: 'Account Mismatch', description: 'Account number and confirm account number must match.' });
                          return;
                        }
                        // Save current assignment
                        if (currentAssignmentId) {
                          setAssignmentRows(rows=> rows.map(r=> r.id===currentAssignmentId ? { ...r, assignee: assigneeForm.name, date: assignmentDetails.date, details: assignmentDecision.accepted===true ? 'Admitted' : (assignmentDecision.accepted===false ? 'Rejected' : 'Pending') } : r));
                        }
                        // If admitted, update claim ownership display and log history
                        if (assignmentDecision.accepted === true && assigneeForm.name) {
                          const previous = claimData.claimantName;
                          setClaimData(prev=> ({ ...prev, claimantName: assigneeForm.name, assignmentAdmission: { assignedByClaimant: true, assigneeName: assigneeForm.name, assignmentDate: assignmentDetails.date || new Date().toISOString().slice(0,10) } }));
                          setAuditLog(prev=>[
                            ...prev,
                            { id: crypto.randomUUID?.() || Math.random().toString(36).slice(2), action:'Updates in Invite', actioner:'Current User', timestamp:new Date().toISOString(), comment:`Claim assignment admitted. Owner changed from ${previous} to ${assigneeForm.name}.`, icon:'update' }
                          ]);
                        } else {
                          setAuditLog(prev=>[...prev,{ id: crypto.randomUUID?.() || Math.random().toString(36).slice(2), action:'Allocation edit in allocation', actioner:'Coordinator', timestamp:new Date().toISOString(), comment:'Assignment details saved.', icon:'allocate'}]);
                        }
                        toast({ title: 'Assignment Saved', description: 'Assignment details saved.' });
                        setShowAssignmentDialog(false);
                      }}>Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader><CardTitle>Reports</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <Card>
                  <CardHeader><CardTitle>Generate Report</CardTitle></CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-3">
                    <Select onValueChange={(v:string)=> void 0}>
                      <SelectTrigger><SelectValue placeholder="Choose Report Type"/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AR Voting Summary">AR Voting Summary</SelectItem>
                        <SelectItem value="Customized">Customized</SelectItem>
                        <SelectItem value="IBC CIRP Summary List">IBC CIRP Summary List</SelectItem>
                        <SelectItem value="IBC CIRP Schedules">IBC CIRP Schedules</SelectItem>
                        <SelectItem value="Claims Received after Cut off date">Claims Received after Cut off date</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select onValueChange={(v:string)=> void 0}>
                      <SelectTrigger><SelectValue placeholder="Choose Cutoff Date"/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Claims Received Till">Claims Received Till</SelectItem>
                        <SelectItem value="Claims Verified Till">Claims Verified Till</SelectItem>
                        <SelectItem value="Claims Admitted Till">Claims Admitted Till</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select onValueChange={(v:string)=> void 0}>
                      <SelectTrigger><SelectValue placeholder="Category (for Customized)"/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Consolidated">Consolidated</SelectItem>
                        <SelectItem value="Financial Creditor - Secured">Financial Creditor - Secured</SelectItem>
                        <SelectItem value="FC - Unsecured">FC - Unsecured</SelectItem>
                        <SelectItem value="FC in a class - Deposit Holder">FC in a class - Deposit Holder</SelectItem>
                        <SelectItem value="FC in a class - Home Buyers">FC in a class - Home Buyers</SelectItem>
                        <SelectItem value="Operational Creditor">Operational Creditor</SelectItem>
                        <SelectItem value="Workmen/Staff/Employees">Workmen/Staff/Employees</SelectItem>
                        <SelectItem value="Statutory Authorities">Statutory Authorities</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea placeholder="Required Fields (for Customized). Example: Claimant's Name, Total Amount Claimed, Total Amount Admitted, Remarks" className="md:col-span-2"/>
                    <div className="flex gap-2">
                      <Button onClick={()=>{
                        const id = crypto.randomUUID?.() || Math.random().toString(36).slice(2);
                        const name = `Report_${new Date().toISOString()}`;
                        setSavedReports(prev=>[...prev,{ id, name, createdAt: new Date().toISOString() }]);
                        toast({ title: 'Report Generated', description: 'The table has been generated and saved.' });
                        setAuditLog(prev=>[...prev,{ id: crypto.randomUUID?.() || Math.random().toString(36).slice(2), action:'Updates in Invite', actioner:'Current User', timestamp:new Date().toISOString(), comment:'Report generated.', icon:'update'}]);
                      }}>Generate Report</Button>
                      <Button variant="secondary" onClick={()=> toast({ title: 'Digitally Sign', description: 'DSC/e-sign simulated.' })}>Digitally Sign PDF</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Saved Reports</CardTitle></CardHeader>
                  <CardContent>
                    {savedReports.length === 0 ? (
                      <p className="text-sm text-gray-600">No saved reports yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {savedReports.map(r=> (
                          <div key={r.id} className="flex items-center justify-between border rounded p-2">
                            <div>
                              <p className="font-medium">{r.name}</p>
                              <p className="text-xs text-gray-500">Saved {new Date(r.createdAt).toLocaleString()}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={()=> toast({ title:'Download', description:'Excel/PDF downloaded.' })}>Download</Button>
                              <Button variant="outline" size="sm" onClick={()=> toast({ title:'Upload PDF', description:'Saved additional PDF.' })}>Upload PDF</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submission">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Claimant Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Name</label>
                      <p className="mt-1 text-sm text-gray-900">{claimData.claimantName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Category</label>
                      <p className="mt-1 text-sm text-gray-900">{claimData.claimantCategory}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">PAN</label>
                      <p className="mt-1 text-sm text-gray-900">{claimData.claimantDetails.pan}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Registration Number</label>
                      <p className="mt-1 text-sm text-gray-900">{claimData.claimantDetails.registrationNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{claimData.claimantDetails.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <p className="mt-1 text-sm text-gray-900">{claimData.claimantDetails.phone}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Address</label>
                    <p className="mt-1 text-sm text-gray-900">{claimData.claimantDetails.address}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Claim Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Principal Amount</label>
                      <p className="mt-1 text-lg font-semibold text-gray-900">{formatCurrency(claimData.principalAmount)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Interest Amount</label>
                      <p className="mt-1 text-lg font-semibold text-gray-900">{formatCurrency(claimData.interestAmount)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Total Claim</label>
                      <p className="mt-1 text-xl font-bold text-blue-600">{formatCurrency(claimData.claimedAmount)}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nature of Debt</label>
                      <p className="mt-1 text-sm text-gray-900">{claimData.claimDetails.natureOfDebt}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Reference Document</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {claimData.claimDetails.referenceDocumentType} - {claimData.claimDetails.referenceDocumentNo}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Debt Incurred Date</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(claimData.claimDetails.debtIncurredDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Due Date</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(claimData.claimDetails.dueDateForPayment).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Interest Rate</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {claimData.claimDetails.interestRate}% {claimData.claimDetails.interestType}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Currency</label>
                      <p className="mt-1 text-sm text-gray-900">{claimData.claimDetails.currency}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Supporting Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {claimData.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-gray-500">
                              {doc.type} • {doc.size} • Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownloadDocument(doc.id)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="allocation">
            <Card>
              <CardHeader>
                <CardTitle>Claim Allocation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Date of Receipt of Claim</label>
                    <p className="mt-1 text-sm text-gray-900">{new Date(claimData.submissionDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <p className="mt-1 text-sm text-gray-900">{claimData.claimantCategory}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Claimant’s Name</label>
                    <p className="mt-1 text-sm text-gray-900">{claimData.claimantName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Claimed Amount</label>
                    <p className="mt-1 text-sm text-gray-900">{formatCurrency(claimData.claimedAmount)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">For Verification</label>
                    <Select value={claimData.assignedTo ? (mockTeam.find(m=>m.name===claimData.assignedTo)?.id || '__none__') : '__none__'} onValueChange={(v)=>handleAssign('verification', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Not Allocated" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">Not Allocated</SelectItem>
                        {mockTeam.map(m => (
                          <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">For Admission</label>
                    <Select value={claimData.admittedBy ? (mockTeam.find(m=>m.name===claimData.admittedBy)?.id || '__none__') : '__none__'} onValueChange={(v)=>handleAssign('admission', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Not Allocated" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">Not Allocated</SelectItem>
                        {mockTeam.map(m => (
                          <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Allocation can be modified by User/Platform. Sorting is available in Allocation Settings table for Receipt Date and Claimed Amount.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admission">
            <Card>
              <CardHeader>
                <CardTitle>Claim Admission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!claimData.invitation.isTwoStageInvite && (
                  <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded">
                    Admission is available only when Two-Stage Invite is enabled.
                  </div>
                )}

                {/* Cut-off Dates */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Claim Receipt Cut-off Date</label>
                    <Input
                      className="mt-1"
                      type="date"
                      value={claimData.invitation.claimReceiptCutoffDate || ''}
                      onChange={(e)=> setClaimData(prev => ({ ...prev, invitation: { ...prev.invitation, claimReceiptCutoffDate: e.target.value }}))}
                    />
                    <p className="text-xs text-gray-500 mt-1">Picked from Invitation Setup. Users with access can modify.</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Claim Verified Cut-off Date</label>
                    <Input
                      className="mt-1"
                      type="date"
                      value={claimData.invitation.claimVerifiedCutoffDate || ''}
                      onChange={(e)=> setClaimData(prev => ({ ...prev, invitation: { ...prev.invitation, claimVerifiedCutoffDate: e.target.value }}))}
                    />
                    <p className="text-xs text-gray-500 mt-1">Picked from Invitation Setup. Users with access can modify.</p>
                  </div>
                </div>

                {/* Admission Table */}
                <div className="overflow-x-auto border rounded-lg">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr className="text-left">
                        <th className="p-3">Category</th>
                        <th className="p-3">Claimant</th>
                        <th className="p-3">Security Type</th>
                        <th className="p-3">Relationship Status</th>
                        <th className="p-3">Claimed Amount</th>
                        <th className="p-3">Remarks by Platform</th>
                        <th className="p-3">Amount as per Platform</th>
                        <th className="p-3">Amount as per Verifier</th>
                        <th className="p-3">Amount as per Admittor</th>
                        <th className="p-3">Remarks by Verifier</th>
                        <th className="p-3">Remarks by Admittor</th>
                        <th className="p-3">Admission Status</th>
                        <th className="p-3">Action by Admittor</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="p-3">{admissionRow.category}</td>
                        <td className="p-3">{admissionRow.claimant}</td>
                        <td className="p-3">{admissionRow.securityTypeSubmitter}</td>
                        <td className="p-3">{admissionRow.relationshipStatusSubmitter}</td>
                        <td className="p-3">{formatCurrency(admissionRow.claimedAmount)}</td>
                        <td className="p-3">
                          <Select value="__noop__" onValueChange={(v: string)=>void 0}>
                            <SelectTrigger><SelectValue placeholder="Select remarks"/></SelectTrigger>
                            <SelectContent>
                              {platformRemarksOptions.map(opt => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-3">{admissionRow.amountAsPerPlatform != null ? formatCurrency(admissionRow.amountAsPerPlatform) : '-'}</td>
                        <td className="p-3">{(verificationRow.amountAsPerVerifier ?? verificationRow.amountAsPerPlatform) != null ? formatCurrency((verificationRow.amountAsPerVerifier ?? verificationRow.amountAsPerPlatform) as number) : '-'}</td>
                        <td className="p-3">{admissionRow.amountAsPerAdmittor != null ? formatCurrency(admissionRow.amountAsPerAdmittor) : '-'}</td>
                        <td className="p-3">
                          <Textarea value={admissionRow.remarksByVerifier} onChange={(e)=> setAdmissionRow(prev=>({ ...prev, remarksByVerifier: e.target.value }))} placeholder="Remarks by Verifier"/>
                        </td>
                        <td className="p-3">
                          <Textarea value={admissionRow.remarksByAdmittor} onChange={(e)=> setAdmissionRow(prev=>({ ...prev, remarksByAdmittor: e.target.value }))} placeholder="Remarks by Admittor"/>
                        </td>
                        <td className="p-3">
                          <Badge className={admissionRow.status==='completed' ? 'bg-green-100 text-green-800' : admissionRow.status==='ongoing' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}>
                            {admissionRow.status}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Select value={admissionRow.actionByAdmittor} onValueChange={(v: 'accept_verifier' | 'recheck')=> handleAdmittorAction(v)}>
                            <SelectTrigger><SelectValue placeholder="Select Action"/></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="accept_verifier">Accept Verifier's Figure</SelectItem>
                              <SelectItem value="recheck">Recheck</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Admission Dialog trigger when ongoing */}
                {admissionRow.status === 'ongoing' && (
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={()=>setShowAdmissionDialog(true)}>Open Admission Review</Button>
                  </div>
                )}

                <Dialog open={showAdmissionDialog} onOpenChange={setShowAdmissionDialog}>
                  <DialogContent className="max-w-5xl overflow-y-auto max-h-[85vh]">
                    <DialogHeader>
                      <DialogTitle>Admission Review</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                      {/* Claimant Summary */}
                      <Card>
                        <CardHeader><CardTitle>Claimant Details</CardTitle></CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-4">
                          <Input value={claimData.claimantName} readOnly />
                          <Input value={claimData.claimantCategory} readOnly />
                          <Input value={admissionRow.relationshipStatusSubmitter} readOnly />
                          <Input value={admissionRow.securityTypeSubmitter} readOnly />
                          <Textarea placeholder="How and when the Claim/Debt/Outstanding Amount arose" />
                        </CardContent>
                      </Card>

                      {/* Details of Security Held */}
                      <Card>
                        <CardHeader><CardTitle>Details of Security Held</CardTitle></CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-3">
                          <Input placeholder="Nature of Charge/Security (as provided by Submitter)" readOnly />
                          <Input placeholder="Assets Held/Under Charge (as provided by Submitter)" readOnly />
                          <Input placeholder="Value of the Security (as provided by Submitter)" readOnly />
                          <Input type="date" placeholder="Date Security Provided (as provided by Submitter)" readOnly />
                          <div className="md:col-span-2">
                            <label className="text-sm text-gray-700">Supporting Doc(s) (as provided by Submitter)</label>
                            <Input type="file" multiple className="mt-1" />
                          </div>
                          <Textarea placeholder="Queries/Comments (Platform)" />
                          <Textarea placeholder="Queries/Comments (Verifier)" />
                          <Textarea placeholder="Queries/Comments (Admittor)" />
                          <Textarea placeholder="Response to Queries (Submitter)" />
                          <Select onValueChange={(v:'Secured' | 'Unsecured')=> void 0}>
                            <SelectTrigger><SelectValue placeholder="Security Type as per Verifier"/></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Secured">Secured</SelectItem>
                              <SelectItem value="Unsecured">Unsecured</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input placeholder="Value of the Security (as per Verifier)" type="number" />
                          <Select onValueChange={(v:'Secured' | 'Unsecured')=> setAdmissionRow(prev=>({ ...prev, securityTypeSubmitter: v }))}>
                            <SelectTrigger><SelectValue placeholder="Security Type as per Admittor"/></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Secured">Secured</SelectItem>
                              <SelectItem value="Unsecured">Unsecured</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input placeholder="Value of the Security (as per Admittor)" type="number" />
                        </CardContent>
                      </Card>

                      {/* Principal Working */}
                      <Card>
                        <CardHeader><CardTitle>Principal Working</CardTitle></CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-3">
                          <Input placeholder="Nature of Debt (as provided by Submitter)" readOnly />
                          <Input placeholder="Reference Document Type (as provided by Submitter)" readOnly />
                          <Input placeholder="Reference Document No. (as provided by Submitter)" readOnly />
                          <Input placeholder="Currency (as provided by Submitter)" readOnly />
                          <Input placeholder="Principal Amount that became/will become due" type="number" />
                          <Input placeholder="Date when the debt incurred" type="date" />
                          <Input placeholder="Date when the Debt became/will become due" type="date" />
                          <div className="md:col-span-2">
                            <label className="text-sm text-gray-700">Supporting Document(s): Uploaded Documents</label>
                            <Input type="file" multiple className="mt-1" />
                          </div>
                          <Input placeholder="Forex Rate (as per Verifier)" type="number" />
                          <Textarea placeholder="Queries/Comments by Verifier" />
                          <Textarea placeholder="Additional Document required by Verifier" />
                          <Input placeholder="Forex Rate (as per Admittor)" type="number" />
                          <Textarea placeholder="Queries/Comments by Admittor" />
                          <Textarea placeholder="Additional Document required by Admittor" />
                          <Textarea placeholder="Response to Queries (Submitter)" />
                          <Input placeholder="Amount Admissible as per Admittor" type="number" />
                        </CardContent>
                      </Card>

                      {/* Applicable Interest Terms */}
                      <Card>
                        <CardHeader><CardTitle>Applicable Interest Terms</CardTitle></CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-3">
                          <Input placeholder="Rate - As provided by Submitter" readOnly />
                          <Input placeholder="Rate - As per Platform (auto if AI)" readOnly />
                          <Input placeholder="Rate - As per Verifier" />
                          <Input placeholder="Rate - As per Admittor" />
                          <Input placeholder="Percentage Type - As provided by Submitter" readOnly />
                          <Input placeholder="Percentage Type - As per Platform (auto if AI)" readOnly />
                          <Input placeholder="Percentage Type - As per Verifier" />
                          <Input placeholder="Percentage Type - As per Admittor" />
                          <Input placeholder="Interest Type - As provided by Submitter" readOnly />
                          <Input placeholder="Interest Type - As per Platform (auto if AI)" readOnly />
                          <Input placeholder="Interest Type - As per Verifier" />
                          <Input placeholder="Interest Type - As per Admittor" />
                          <Input placeholder="Interest Duration - As provided by Submitter" readOnly />
                          <Input placeholder="Interest Duration - As per Platform (auto if AI)" readOnly />
                          <Input placeholder="Interest Duration - As per Verifier" />
                          <Input placeholder="Interest Duration - As per Admittor" />
                          <div className="md:col-span-2">
                            <label className="text-sm text-gray-700">Supporting Document(s)</label>
                            <Input type="file" multiple className="mt-1" />
                          </div>
                          <Textarea placeholder="Queries/Comments (Platform)" />
                          <Textarea placeholder="Queries/Comments (Verifier)" />
                          <Textarea placeholder="Queries/Comments (Admittor)" />
                          <Textarea placeholder="Additional Documents (Platform)" />
                          <Textarea placeholder="Additional Documents (Verifier)" />
                          <Textarea placeholder="Additional Documents (Admittor)" />
                          <Textarea placeholder="Response to Queries (Submitter)" />
                        </CardContent>
                      </Card>

                      {/* Interest Working */}
                      <Card>
                        <CardHeader><CardTitle>Interest Working</CardTitle></CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-3">
                          <Input placeholder="Principal Amount (as provided by Submitter)" readOnly />
                          <div className="grid md:grid-cols-2 gap-2">
                            <Input placeholder="From" type="date" />
                            <Input placeholder="To" type="date" />
                          </div>
                          <Input placeholder="Days" type="number" />
                          <Input placeholder="Interest Amount Claimed (as provided by Submitter)" readOnly />
                          <Input placeholder="As per Platform (auto if AI)" readOnly />
                          <Input placeholder="Int Amt Admissible (Platform)" readOnly />
                          <Textarea placeholder="Comments (Platform)" />
                          <Textarea placeholder="Comments/Queries (Verifier)" />
                          <Textarea placeholder="Comments/Queries (Admittor)" />
                          <Textarea placeholder="Response to Queries (Submitter)" />
                          <Input placeholder="Int. Amt. Admissible (Verifier)" type="number" />
                          <Input placeholder="Int. Amt. Admissible (Admittor)" type="number" />
                        </CardContent>
                      </Card>

                      {/* Applicable Penal Interest Terms */}
                      <Card>
                        <CardHeader><CardTitle>Applicable Penal Interest Terms</CardTitle></CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-3">
                          <Input placeholder="Rate % - As provided by Submitter" readOnly />
                          <Input placeholder="Rate % - As per Platform (auto if AI)" readOnly />
                          <Input placeholder="Rate % - As per Verifier" />
                          <Input placeholder="Rate % - As per Admittor" />
                          <Input placeholder="Interest Duration - As provided by Submitter" readOnly />
                          <Input placeholder="Interest Duration - As per Platform (auto if AI)" readOnly />
                          <Input placeholder="Interest Duration - As per Verifier" />
                          <Input placeholder="Interest Duration - As per Admittor" />
                          <Input placeholder="Interest Type - As provided by Submitter" readOnly />
                          <Input placeholder="Interest Type - As per Platform (auto if AI)" readOnly />
                          <Input placeholder="Interest Type - As per Verifier" />
                          <Input placeholder="Interest Type - As per Admittor" />
                          <Input placeholder="Calendar Month - As provided by Submitter" readOnly />
                          <Input placeholder="Calendar Month - As per Platform (auto if AI)" readOnly />
                          <Input placeholder="Calendar Month - As per Verifier" />
                          <Input placeholder="Calendar Month - As per Admittor" />
                          <div className="md:col-span-2">
                            <label className="text-sm text-gray-700">Supporting Document(s)</label>
                            <Input type="file" multiple className="mt-1" />
                          </div>
                          <Textarea placeholder="Queries/Comments (Platform)" />
                          <Textarea placeholder="Queries/Comments (Verifier)" />
                          <Textarea placeholder="Queries/Comments (Admittor)" />
                          <Textarea placeholder="Additional Documents (Platform)" />
                          <Textarea placeholder="Additional Documents (Verifier)" />
                          <Textarea placeholder="Additional Documents (Admittor)" />
                          <Textarea placeholder="Response to Queries (Submitter)" />
                        </CardContent>
                      </Card>

                      {/* Penal Interest Working */}
                      <Card>
                        <CardHeader><CardTitle>Penal Interest Working</CardTitle></CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-3">
                          <Input placeholder="Principal Amount (as provided by Submitter)" readOnly />
                          <div className="grid md:grid-cols-2 gap-2">
                            <Input placeholder="From" type="date" />
                            <Input placeholder="To" type="date" />
                          </div>
                          <Input placeholder="Days" type="number" />
                          <Input placeholder="Penal Interest Amount Claimed (as provided by Submitter)" readOnly />
                          <Input placeholder="As per Platform (auto if AI)" readOnly />
                          <Textarea placeholder="Comments/Queries (Platform)" />
                          <Textarea placeholder="Response to queries (Submitter)" />
                          <Input placeholder="Penal Interest Amount Admissible (Verifier)" type="number" />
                          <Input placeholder="Penal Interest Amount Admissible (Admittor)" type="number" />
                        </CardContent>
                      </Card>

                      {/* Disputes */}
                      <Card>
                        <CardHeader><CardTitle>Ongoing Disputes / Litigations / Orders</CardTitle></CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-3">
                          <Textarea placeholder="Details (as provided by Submitter)" readOnly />
                          <div className="md:col-span-2">
                            <label className="text-sm text-gray-700">Supporting Document(s)</label>
                            <Input type="file" multiple className="mt-1" />
                          </div>
                          <Textarea placeholder="Queries/Comments (Platform)" />
                          <Textarea placeholder="Queries/Comments (Verifier)" />
                          <Textarea placeholder="Queries/Comments (Admittor)" />
                          <Textarea placeholder="Response to Queries (Submitter)" />
                          <Select onValueChange={(v:string)=>void 0}>
                            <SelectTrigger><SelectValue placeholder="Any Impact on Claim Admission Amount"/></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </CardContent>
                      </Card>

                      {/* Set-off */}
                      <Card>
                        <CardHeader><CardTitle>Set-off Details</CardTitle></CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-3">
                          <Input placeholder="Nature of Transaction (as provided by Submitter)" readOnly />
                          <Input placeholder="Date Incurred (as provided by Submitter)" type="date" readOnly />
                          <Input placeholder="Amount (as provided by Submitter)" readOnly />
                          <div className="md:col-span-2">
                            <label className="text-sm text-gray-700">Supporting Document(s)</label>
                            <Input type="file" multiple className="mt-1" />
                          </div>
                          <Textarea placeholder="Queries/Comments (Verifier)" />
                          <Textarea placeholder="Queries/Comments (Admittor)" />
                          <Textarea placeholder="Response to Queries (Submitter)" />
                          <Select onValueChange={(v:string)=>void 0}>
                            <SelectTrigger><SelectValue placeholder="Any Impact on Claim Admission Amount"/></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </CardContent>
                      </Card>

                      {/* Summary */}
                      <Card>
                        <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
                        <CardContent>
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="p-2 text-left"></th>
                                  <th className="p-2 text-left">As per Submitter</th>
                                  <th className="p-2 text-left">As per Platform</th>
                                  <th className="p-2 text-left">As per Verifier</th>
                                  <th className="p-2 text-left">As per Admittor</th>
                                  <th className="p-2 text-left">Remarks/Comments</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr><td className="p-2 font-medium">Principal</td><td className="p-2"/><td className="p-2"/><td className="p-2"/><td className="p-2"/><td className="p-2"/></tr>
                                <tr><td className="p-2 pl-6 text-gray-600">Impact of any Award/Order</td><td className="p-2"/><td className="p-2"/><td className="p-2"/><td className="p-2"/><td className="p-2"/></tr>
                                <tr><td className="p-2 pl-6 text-gray-600">Impact of any Set Off Available</td><td className="p-2"/><td className="p-2"/><td className="p-2"/><td className="p-2"/><td className="p-2"/></tr>
                                <tr className="bg-gray-50"><td className="p-2 font-semibold">Total Principal Amount</td><td className="p-2"/><td className="p-2"/><td className="p-2"/><td className="p-2"/><td className="p-2"/></tr>
                                <tr><td className="p-2 font-medium">Interest</td><td className="p-2"/><td className="p-2"/><td className="p-2"/><td className="p-2"/><td className="p-2"/></tr>
                                <tr><td className="p-2 font-medium">Penal Interest</td><td className="p-2"/><td className="p-2"/><td className="p-2"/><td className="p-2"/><td className="p-2"/></tr>
                                <tr className="bg-gray-50"><td className="p-2 font-semibold">Total Interest Amount</td><td className="p-2"/><td className="p-2"/><td className="p-2"/><td className="p-2"/><td className="p-2"/></tr>
                                <tr className="bg-blue-50"><td className="p-2 font-bold">Total Claim Amount</td><td className="p-2"/><td className="p-2"/><td className="p-2"/><td className="p-2"/><td className="p-2"/></tr>
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <DialogFooter className="gap-2">
                      <Button variant="outline" onClick={()=> setShowAdmissionDialog(false)}>Cancel</Button>
                      <Button variant="secondary" onClick={()=>{ setAdmissionRow(prev=>({ ...prev, status: 'ongoing' })); setAuditLog(prev=>[...prev,{ id: crypto.randomUUID?.() || Math.random().toString(36).slice(2), action:'Claim admission', actioner:'Admittor', timestamp:new Date().toISOString(), comment:'Admission details saved (in-progress).', icon:'admit'}]); toast({ title:'Admission Saved', description:'Progress saved.'}); }}>Save Progress</Button>
                      <Button onClick={()=>{ setAdmissionRow(prev=>({ ...prev, status: 'completed' })); setShowAdmissionDialog(false); setAuditLog(prev=>[...prev,{ id: crypto.randomUUID?.() || Math.random().toString(36).slice(2), action:'Claim admission', actioner:'Admittor', timestamp:new Date().toISOString(), comment:'Admission completed from dialog.', icon:'admit'}]); toast({ title:'Admission Completed', description:'Admission marked as completed.'}); }}>
                        Complete Admission
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification">
            <Card>
              <CardHeader>
                <CardTitle>Claim Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Claim Receipt Cut off Date */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Claim Receipt Cut-off Date</label>
                    <Input
                      className="mt-1"
                      type="date"
                      value={claimData.invitation.claimReceiptCutoffDate || ''}
                      onChange={(e)=> setClaimData(prev => ({ ...prev, invitation: { ...prev.invitation, claimReceiptCutoffDate: e.target.value }}))}
                    />
                    <p className="text-xs text-gray-500 mt-1">Picked from Claim Invitation Setup. Users with access can modify.</p>
                  </div>
                </div>

                {/* Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Upload List of Outstanding Balances of Creditors (Excel)</label>
                    <Input type="file" accept=".xls,.xlsx" className="mt-1" onChange={(e)=> setVerificationUploads(prev => ({ ...prev, outstandingBalancesFile: e.target.files?.[0] }))} />
                    {verificationUploads.outstandingBalancesFile && <p className="text-xs text-gray-600 mt-1">{verificationUploads.outstandingBalancesFile.name}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Upload Ledger Details (Excel/PDF)</label>
                    <Input type="file" accept=".xls,.xlsx,.pdf" multiple className="mt-1" onChange={(e)=> setVerificationUploads(prev => ({ ...prev, ledgers: e.target.files ? Array.from(e.target.files) : [] }))} />
                    {verificationUploads.ledgers.length > 0 && <p className="text-xs text-gray-600 mt-1">{verificationUploads.ledgers.length} file(s) selected</p>}
                  </div>
                </div>
                {claimData.invitation.aiAssistanceOpted ? (
                  <div>
                    <Button variant="outline" onClick={runAIMatch}>Run AI Match</Button>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">AI is not opted. <a className="text-blue-600 underline" href="#">Purchase AI</a></div>
                )}

                {/* Main table */}
                <div className="overflow-auto border rounded-lg">
                  <table className="min-w-[900px] w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr className="text-left">
                        <th className="p-3">Category</th>
                        <th className="p-3">Claimant</th>
                        <th className="p-3">Security Type</th>
                        <th className="p-3">Relationship Status</th>
                        <th className="p-3">Claimed Amount</th>
                        <th className="p-3">Remarks by Platform</th>
                        <th className="p-3">Amount admissible as per Platform</th>
                        <th className="p-3">Amount admissible as per Verifier</th>
                        <th className="p-3">Action by Verifier</th>
                        <th className="p-3">Verification Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-3">
                          <Select value={verificationRow.category} onValueChange={(v)=> setVerificationRow(prev=>({ ...prev, category: v }))}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Financial Creditor - Secured">Financial Creditor - Secured</SelectItem>
                              <SelectItem value="Financial Creditor - Unsecured">Financial Creditor - Unsecured</SelectItem>
                              <SelectItem value="FC in a class - Deposit Holder">FC in a class - Deposit Holder</SelectItem>
                              <SelectItem value="FC in a class - Home Buyers">FC in a class - Home Buyers</SelectItem>
                              <SelectItem value="Operational Creditor">Operational Creditor</SelectItem>
                              <SelectItem value="Workmen/Staff/Employees">Workmen/Staff/Employees</SelectItem>
                              <SelectItem value="Statutory Authorities">Statutory Authorities</SelectItem>
                              <SelectItem value="Others">Others</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-3">{verificationRow.claimant}</td>
                        <td className="p-3">
                          <Select value={verificationRow.securityType} onValueChange={(v: 'Secured' | 'Unsecured')=> setVerificationRow(prev=>({ ...prev, securityType: v }))}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Secured">Secured</SelectItem>
                              <SelectItem value="Unsecured">Unsecured</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-3">
                          <Select value={verificationRow.relationshipStatus} onValueChange={(v: string)=> setVerificationRow(prev=>({ ...prev, relationshipStatus: v }))}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Not Related">Not Related</SelectItem>
                              <SelectItem value="Relation A">Relation A</SelectItem>
                              <SelectItem value="Relation B">Relation B</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-3">{formatCurrency(verificationRow.claimedAmount)}</td>
                        <td className="p-3">
                          {claimData.invitation.aiAssistanceOpted ? (
                            <Select value={verificationRow.platformRemarks[0] || ''} onValueChange={(v)=> setVerificationRow(prev=>({ ...prev, platformRemarks: v ? [v] : [] }))}>
                              <SelectTrigger><SelectValue placeholder="Select remark"/></SelectTrigger>
                              <SelectContent>
                                {platformRemarksOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="text-xs text-gray-600">AI not opted. <a className="text-blue-600 underline" href="#">Purchase AI</a></div>
                          )}
                        </td>
                        <td className="p-3">{verificationRow.amountAsPerPlatform ? formatCurrency(verificationRow.amountAsPerPlatform) : '-'}</td>
                        <td className="p-3">{verificationRow.amountAsPerVerifier ? formatCurrency(verificationRow.amountAsPerVerifier) : '-'}</td>
                        <td className="p-3">
                          {verificationRow.status === 'pending' ? (
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleVerifierAction('verify')}>Verify</Button>
                              {claimData.invitation.aiAssistanceOpted && (
                                <Button size="sm" variant="outline" onClick={() => handleVerifierAction('accept_platform')}>Accept Platform</Button>
                              )}
                            </div>
                          ) : (
                            <Badge className="bg-green-100 text-green-800">{verificationRow.status}</Badge>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="text-xs text-gray-500">Verification Status is managed automatically based on actions and saves.</div>

                {/* Verify Dialog */}
                <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
                  <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Verification Details</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                      {/* Claimant Details summary */}
                      <Card>
                        <CardHeader><CardTitle className="text-base">Claimant Details</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div><span className="text-gray-600">Claimant's Name</span><p>{claimData.claimantName}</p></div>
                          <div><span className="text-gray-600">Category</span><p>{claimData.claimantCategory}</p></div>
                          <div><span className="text-gray-600">Relationship Status</span><p>{verificationRow.relationshipStatus}</p></div>
                          <div><span className="text-gray-600">Security Type</span><p>{verificationRow.securityType}</p></div>
                        </CardContent>
                      </Card>

                      {/* Details of Security Held */}
                      <Card>
                        <CardHeader><CardTitle className="text-base">Details of Security Held</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <Input placeholder="Nature of Charge/Security" />
                          <Input placeholder="Assets Held/Under Charge" />
                          <Input placeholder="Value of the Security" type="number" />
                          <Input placeholder="Date Security Provided" type="date" />
                          <div className="md:col-span-2">
                            <label className="text-sm text-gray-700">Supporting Doc(s)</label>
                            <Input type="file" multiple className="mt-1" />
                          </div>
                          <Textarea placeholder="Queries/Comments (Platform)" className="md:col-span-2" />
                          <Textarea placeholder="Queries/Comments (Verifier)" className="md:col-span-2" />
                          <Textarea placeholder="Response to Queries (Submitter)" className="md:col-span-2" />
                          <Select onValueChange={(v: 'Secured' | 'Unsecured')=> void 0}>
                            <SelectTrigger><SelectValue placeholder="Security Type as per Verifier"/></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Secured">Secured</SelectItem>
                              <SelectItem value="Unsecured">Unsecured</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input placeholder="Value of the Security (as per Verifier)" type="number" />
                        </CardContent>
                      </Card>

                      {/* Principal Working */}
                      <Card>
                        <CardHeader><CardTitle className="text-base">Principal Working</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <Input placeholder="Nature of Debt" />
                          <Input placeholder="Reference Document Type" />
                          <Input placeholder="Reference Document No." />
                          <Input placeholder="Currency" />
                          <Input placeholder="Principal Amount due" type="number" />
                          <Input placeholder="Date when debt incurred" type="date" />
                          <Input placeholder="Date when debt became due" type="date" />
                          <div className="md:col-span-2">
                            <label className="text-sm text-gray-700">Supporting Document(s)</label>
                            <Input type="file" multiple className="mt-1" />
                          </div>
                          <Input placeholder="Forex Rate (if applicable)" type="number" />
                          <Textarea placeholder="Queries/Comments by Verifier" className="md:col-span-2" />
                          <Textarea placeholder="Additional Document required by Verifier" className="md:col-span-2" />
                          <Textarea placeholder="Response to Queries (Submitter)" className="md:col-span-2" />
                          <Input placeholder="Amount Admissible as per Verifier" type="number" />
                        </CardContent>
                      </Card>

                      {/* Applicable Interest Terms */}
                      <Card>
                        <CardHeader><CardTitle className="text-base">Applicable Interest Terms</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <Input placeholder="Rate % (as provided by submitter)" />
                          <Input placeholder="Percentage Type" />
                          <Input placeholder="Interest Type" />
                          <Input placeholder="Interest duration" />
                          <div className="md:col-span-3">
                            <label className="text-sm text-gray-700">Supporting Document(s)</label>
                            <Input type="file" multiple className="mt-1" />
                          </div>
                          <Textarea placeholder="Queries/Comments (Platform)" className="md:col-span-3" />
                          <Textarea placeholder="Additional Document Required (Platform)" className="md:col-span-3" />
                          <Textarea placeholder="As per Verifier - Queries/Comments" className="md:col-span-3" />
                          <Textarea placeholder="Response to Queries (Submitter)" className="md:col-span-3" />
                        </CardContent>
                      </Card>

                      {/* Interest Working */}
                      <Card>
                        <CardHeader><CardTitle className="text-base">Interest Working</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <Input placeholder="Principal Amount (by submitter)" type="number" />
                          <div className="grid grid-cols-3 gap-2 md:col-span-2">
                            <Input placeholder="From" type="date" />
                            <Input placeholder="To" type="date" />
                            <Input placeholder="Days" type="number" />
                          </div>
                          <Input placeholder="Interest Amount Claimed" type="number" />
                          <Textarea placeholder="Comments (Platform)" className="md:col-span-3" />
                          <Input placeholder="Int Amt Admissible (Platform)" type="number" />
                          <Textarea placeholder="Comments/Queries (Verifier)" className="md:col-span-3" />
                          <Textarea placeholder="Response to Queries (Submitter)" className="md:col-span-3" />
                          <Input placeholder="Int. Amt. Admissible (Verifier)" type="number" />
                        </CardContent>
                      </Card>

                      {/* Penal Interest Terms & Working */}
                      <Card>
                        <CardHeader><CardTitle className="text-base">Applicable Penal Interest Terms</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <Input placeholder="Rate %" />
                          <Input placeholder="Interest Duration" />
                          <Input placeholder="Interest Type" />
                          <Input placeholder="Calendar Month" />
                          <div className="md:col-span-3">
                            <label className="text-sm text-gray-700">Supporting Document(s)</label>
                            <Input type="file" multiple className="mt-1" />
                          </div>
                          <Textarea placeholder="Queries/Comments (Platform)" className="md:col-span-3" />
                          <Textarea placeholder="Additional Document Required (Platform)" className="md:col-span-3" />
                          <Textarea placeholder="As per Verifier - Queries/Comments" className="md:col-span-3" />
                          <Textarea placeholder="Response to Queries (Submitter)" className="md:col-span-3" />
                        </CardContent>
                      </Card>

                      {/* Disputes and Set-off sections */}
                      <Card>
                        <CardHeader><CardTitle className="text-base">Ongoing Disputes / Litigations / Orders</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <Textarea placeholder="Details (as provided by submitter)" className="md:col-span-3" />
                          <div className="md:col-span-3"><label className="text-sm text-gray-700">Supporting Documents (if any)</label><Input type="file" multiple className="mt-1" /></div>
                          <Textarea placeholder="Queries/Comments (Platform)" className="md:col-span-3" />
                          <Textarea placeholder="Queries/Comments (Verifier)" className="md:col-span-3" />
                          <Textarea placeholder="Response to Queries (Submitter)" className="md:col-span-3" />
                          <Select>
                            <SelectTrigger><SelectValue placeholder="Any Impact on Claim Admission Amount"/></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Yes">Yes</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader><CardTitle className="text-base">Set-off Details</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <Input placeholder="Nature of Transaction" />
                          <Input placeholder="Date Incurred" type="date" />
                          <Input placeholder="Amount" type="number" />
                          <div className="md:col-span-3"><label className="text-sm text-gray-700">Supporting Document(s)</label><Input type="file" multiple className="mt-1" /></div>
                          <Textarea placeholder="Queries/Comments (Submitter)" className="md:col-span-3" />
                          <Textarea placeholder="Queries/Comments (Verifier)" className="md:col-span-3" />
                          <Textarea placeholder="Response to Queries (Submitter)" className="md:col-span-3" />
                          <Select>
                            <SelectTrigger><SelectValue placeholder="Any Impact on Claim Admission Amount"/></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Yes">Yes</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </CardContent>
                      </Card>

                      {/* Summary */}
                      <Card>
                        <CardHeader><CardTitle className="text-base">Summary</CardTitle></CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <Input placeholder="Total Principal (Verifier)" type="number" />
                            <Input placeholder="Total Interest (Verifier)" type="number" />
                            <Input placeholder="Total Penal Interest (Verifier)" type="number" />
                            <Input placeholder="Total Claim Amount (Verifier)" type="number" />
                            <Textarea placeholder="Remarks / Comments" className="md:col-span-4" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={()=> setShowVerifyDialog(false)}>Cancel</Button>
                      <Button onClick={()=> { setVerificationRow(prev => ({ ...prev, status: 'ongoing' })); toast({ title: 'Saved', description: 'Verification details saved.' }); }}>Save</Button>
                      <Button className="bg-green-600 hover:bg-green-700" onClick={()=> { setVerificationRow(prev => ({ ...prev, status: 'completed', amountAsPerVerifier: prev.amountAsPerVerifier ?? prev.amountAsPerPlatform ?? prev.claimedAmount })); setShowVerifyDialog(false); toast({ title: 'Verification Completed' }); }}>Mark Completed</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admission">
            <Card>
              <CardHeader>
                <CardTitle>Claim Admission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {claimData.invitation.isTwoStageInvite ? (
                  claimData.status === 'admission_pending' ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Admission Pending</h3>
                    <p className="text-gray-600 mb-4">This claim is awaiting admission decision.</p>
                    <Button onClick={handleAdmitClaim} className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Start Admission Process
                    </Button>
                  </div>
                  ) : (
                  <div>
                    <p className="text-sm text-gray-600">Admission details will appear here once the verification is complete.</p>
                  </div>
                  )
                ) : (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Single Stage Invite</h3>
                    <p className="text-gray-600">This claim was invited under single-stage verification. Admission tab is not applicable.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Claim Assignment Admission */}
          <TabsContent value="assignment">
            <Card>
              <CardHeader>
                <CardTitle>Claim Assignment Admission</CardTitle>
              </CardHeader>
              <CardContent>
                {claimData.assignmentAdmission?.assignedByClaimant ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">The claimant has assigned this claim.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Assignee</label>
                        <p className="mt-1 text-sm text-gray-900">{claimData.assignmentAdmission?.assigneeName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Assignment Date</label>
                        <p className="mt-1 text-sm text-gray-900">{claimData.assignmentAdmission?.assignmentDate ? new Date(claimData.assignmentAdmission?.assignmentDate).toLocaleDateString() : '-'}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-semibold mb-2">No Assignment Available</h3>
                    <p className="text-gray-600">This tab will show data only if a claimant has assigned their claim to another user.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="font-medium">Acknowledgement of Receipt</p>
                    <p className="text-xs text-gray-600 mb-3">Download acknowledgement issued to claimant.</p>
                    <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2"/> Download</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="font-medium">Verification Report</p>
                    <p className="text-xs text-gray-600 mb-3">Summary of verification outcome.</p>
                    <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2"/> Download</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="font-medium">Admission Order</p>
                    <p className="text-xs text-gray-600 mb-3">Admitted/Not-admitted amounts and reasons.</p>
                    <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2"/> Download</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Audit Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditLog.map((log) => (
                    <div key={log.id} className={`flex items-start gap-4 p-4 border-l-4 rounded ${
                      log.icon === 'create' ? 'border-blue-500 bg-blue-50' :
                      log.icon === 'update' ? 'border-green-500 bg-green-50' :
                      log.icon === 'allocate' ? 'border-purple-500 bg-purple-50' :
                      log.icon === 'edit' ? 'border-yellow-500 bg-yellow-50' :
                      log.icon === 'verify' ? 'border-yellow-500 bg-yellow-50' :
                      log.icon === 'admit' ? 'border-orange-500 bg-orange-50' :
                      log.icon === 'reject' ? 'border-red-500 bg-red-50' :
                      'border-gray-400 bg-gray-50'
                    }`}>
                      <Activity className="w-5 h-5 text-gray-700 mt-0.5" />
                      <div>
                        <p className="font-medium">{log.action}</p>
                        <p className="text-sm text-gray-600">{log.comment}</p>
                        <p className="text-xs text-gray-500">{log.actioner} • {new Date(log.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ClaimDetails;
