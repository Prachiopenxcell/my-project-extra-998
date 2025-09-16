import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useToast } from "@/components/ui/use-toast";
import { 
  Search, 
  Plus, 
  Calendar, 
  Eye,
  Edit,
  Copy,
  Filter,
  MoreHorizontal,
  ChevronDown,
  FileText,
  Link as LinkIcon,
  Send,
  Trash2
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

interface ClaimInvitation {
  id: string;
  creationDate: string;
  entityName: string;
  capacity: string;
  authority: string;
  status: 'submission_progress' | 'verification_progress' | 'admission_progress' | 'closed';
  claimsReceived: number;
  cutoffDate: string;
  inviteLink: string;
  orderNumber?: string;
}

// Extended details aligned with CreateClaimInvitation form
interface ClaimInvitationDetails extends ClaimInvitation {
  emailAddress: string;
  postAddress: string;
  weblinkToken: string;
  classesOfCreditors: Array<{ id: string; category: string; className: string; ars: Array<{ id: string; name: string; regn: string }> }>;
  publicationDate?: string; // ISO
  publicationCopyUploaded?: boolean;
  submissionForms: Array<{ id: string; category: string; templateUploaded: boolean; fields: Array<{ id: string; name: string; type: 'nature' | 'amount' }> }>;
  permitModifications: boolean;
  maxModifications?: number;
  modificationCutoffDate?: string;
  admissionProcess: 'single_stage' | 'double_stage' | 'threshold_based';
  thresholdLimit?: string;
  claimsAsOnDate?: string;
  receivingClaimsDate?: string;
  verifyingClaimsDate?: string;
  admittingClaimsDate?: string;
  aiAssistanceOpted: boolean;
  defaultInterestRate?: string;
  interestType?: 'per_annum' | 'per_month' | 'per_day';
  interestComputation?: 'simple' | 'comp_monthly' | 'comp_annually';
  interestMonthBasis?: '30_day' | 'calendar' | 'day' | 'annum';
  forexRateDate?: string;
  forexRate?: number;
  notifyInvite: 'confirm' | 'auto' | 'dont';
  notifyReminder: 'confirm' | 'auto' | 'dont';
  notifyAck: 'confirm' | 'auto' | 'dont';
  notifyDocsMissing: 'confirm' | 'auto' | 'dont';
  notifyShortcomings: 'confirm' | 'auto' | 'dont';
  notifyAdditionalInfo: 'confirm' | 'auto' | 'dont';
  notifyAdmitUpdates: 'confirm' | 'auto' | 'dont';
  notifyRejection: 'confirm' | 'auto' | 'dont';
  signatureName?: string;
  signatureDesignation?: string;
  signatureImageUploaded?: boolean;
}

const ClaimInvitations = () => {
  const { id: invitationId } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [pageSize, setPageSize] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual API calls
  const [invitations, setInvitations] = useState<ClaimInvitation[]>([
    {
      id: "inv-001",
      creationDate: "2024-01-15",
      entityName: "ABC Corporation Ltd",
      capacity: "IRP appointed by NCLT",
      authority: "Admission Order by NCLT",
      status: "verification_progress",
      claimsReceived: 45,
      cutoffDate: "2024-02-15",
      inviteLink: "https://platform.com/claims/submit/inv-001",
      orderNumber: "NCLT/001/2024"
    },
    {
      id: "inv-002", 
      creationDate: "2024-01-10",
      entityName: "XYZ Industries Ltd",
      capacity: "Liquidator appointed by NCLT",
      authority: "Liquidation Order by NCLT",
      status: "submission_progress",
      claimsReceived: 23,
      cutoffDate: "2024-02-10",
      inviteLink: "https://platform.com/claims/submit/inv-002",
      orderNumber: "NCLT/002/2024"
    },
    {
      id: "inv-003",
      creationDate: "2024-01-05",
      entityName: "PQR Services Ltd",
      capacity: "Statutory Auditor",
      authority: "Letter of Appointment as Statutory Auditor",
      status: "closed",
      claimsReceived: 67,
      cutoffDate: "2024-01-25",
      inviteLink: "https://platform.com/claims/submit/inv-003"
    }
  ]);

  // Mock details by ID (in real app, fetch details by ID)
  const invitationDetailsById: Record<string, ClaimInvitationDetails> = {
    'inv-001': {
      ...invitations[0],
      emailAddress: 'claims@abc-corp.com',
      postAddress: '123 Corporate Ave, Mumbai, MH 400001, India',
      weblinkToken: 'inv-001-token',
      classesOfCreditors: [
        { id: 'c1', category: 'financial_secured', className: 'Secured FC', ars: [
          { id: 'ar1', name: 'AR One', regn: 'REG-001' },
          { id: 'ar2', name: 'AR Two', regn: 'REG-002' },
          { id: 'ar3', name: 'AR Three', regn: 'REG-003' }
        ]}
      ],
      publicationDate: '2024-01-18',
      publicationCopyUploaded: true,
      submissionForms: [
        { id: 'sf1', category: 'fc_secured', templateUploaded: true, fields: [
          { id: 'f1', name: 'Loan Account No', type: 'nature' },
          { id: 'f2', name: 'Claim Amount', type: 'amount' }
        ]}
      ],
      permitModifications: true,
      maxModifications: 2,
      modificationCutoffDate: '2024-02-15',
      admissionProcess: 'threshold_based',
      thresholdLimit: '1000000',
      claimsAsOnDate: '2023-12-31',
      receivingClaimsDate: '2024-02-15',
      verifyingClaimsDate: '2024-02-20',
      admittingClaimsDate: '2024-02-28',
      aiAssistanceOpted: true,
      defaultInterestRate: '12',
      interestType: 'per_month',
      interestComputation: 'comp_monthly',
      interestMonthBasis: 'day',
      forexRateDate: '2024-01-15',
      forexRate: 83.25,
      notifyInvite: 'confirm',
      notifyReminder: 'auto',
      notifyAck: 'auto',
      notifyDocsMissing: 'confirm',
      notifyShortcomings: 'confirm',
      notifyAdditionalInfo: 'confirm',
      notifyAdmitUpdates: 'auto',
      notifyRejection: 'confirm',
      signatureName: 'John Admin',
      signatureDesignation: 'IRP',
      signatureImageUploaded: true
    },
    'inv-002': {
      ...invitations[1],
      emailAddress: 'claims@xyz.com',
      postAddress: 'Plot 9, Industrial Estate, Pune, MH 411001',
      weblinkToken: 'inv-002-token',
      classesOfCreditors: [],
      publicationDate: undefined,
      publicationCopyUploaded: false,
      submissionForms: [],
      permitModifications: false,
      admissionProcess: 'double_stage',
      aiAssistanceOpted: false,
      notifyInvite: 'auto',
      notifyReminder: 'auto',
      notifyAck: 'auto',
      notifyDocsMissing: 'dont',
      notifyShortcomings: 'dont',
      notifyAdditionalInfo: 'confirm',
      notifyAdmitUpdates: 'confirm',
      notifyRejection: 'confirm',
      signatureName: 'Jane Liquidator',
      signatureDesignation: 'Liquidator',
      signatureImageUploaded: false
    },
    'inv-003': {
      ...invitations[2],
      emailAddress: 'claims@pqr.com',
      postAddress: '45 Main Street, Delhi, 110001',
      weblinkToken: 'inv-003-token',
      classesOfCreditors: [],
      publicationDate: '2024-01-06',
      publicationCopyUploaded: true,
      submissionForms: [],
      permitModifications: true,
      maxModifications: 1,
      admissionProcess: 'single_stage',
      aiAssistanceOpted: true,
      defaultInterestRate: '10',
      interestType: 'per_annum',
      interestComputation: 'simple',
      interestMonthBasis: 'calendar',
      forexRateDate: '2024-01-05',
      forexRate: 83.4,
      notifyInvite: 'auto',
      notifyReminder: 'confirm',
      notifyAck: 'auto',
      notifyDocsMissing: 'dont',
      notifyShortcomings: 'dont',
      notifyAdditionalInfo: 'dont',
      notifyAdmitUpdates: 'dont',
      notifyRejection: 'confirm',
      signatureName: 'Stat Aud',
      signatureDesignation: 'Statutory Auditor',
      signatureImageUploaded: true
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submission_progress':
        return 'bg-blue-100 text-blue-800';
      case 'verification_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'admission_progress':
        return 'bg-orange-100 text-orange-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'submission_progress':
        return 'Claim Submission in Progress';
      case 'verification_progress':
        return 'Claim Verification in Progress';
      case 'admission_progress':
        return 'Claim Admission in Progress';
      case 'closed':
        return 'Closed';
      default:
        return status;
    }
  };

  const handleCreateInvitation = () => {
    navigate('/claims/create-invitation');
  };

  const handleViewDetails = (id: string) => {
    navigate(`/claims/invitation/${id}`);
  };

  const handleEditInvitation = (id: string) => {
    navigate(`/claims/edit-invitation/${id}`);
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied",
      description: "Claim invitation link has been copied to clipboard.",
    });
  };

  const filteredInvitations = invitations.filter(invitation => {
    const matchesSearch = invitation.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invitation.capacity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || invitation.status === statusFilter;
    const matchesType = typeFilter === "all" || invitation.capacity.toLowerCase().includes(typeFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const sortedInvitations = [...filteredInvitations].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
      case 'oldest':
        return new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime();
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedInvitations.length / parseInt(pageSize));
  const startIndex = (currentPage - 1) * parseInt(pageSize);
  const paginatedInvitations = sortedInvitations.slice(startIndex, startIndex + parseInt(pageSize));

  // Get specific invitation for details view
  const currentInvitation = invitationId ? invitations.find(inv => inv.id === invitationId) : null;
  const currentDetails: ClaimInvitationDetails | null = invitationId ? invitationDetailsById[invitationId] || null : null;

  // ------- UI Formatters -------
  const formatNotify = (val: 'confirm' | 'auto' | 'dont') => (
    val === 'confirm' ? 'Confirm Before' : val === 'auto' ? 'Auto-Send' : "Don't Send"
  );
  const formatInterestType = (val?: ClaimInvitationDetails['interestType']) => (
    val === 'per_annum' ? 'Per Annum' : val === 'per_month' ? 'Per Month' : val === 'per_day' ? 'Per Day' : '—'
  );
  const formatInterestComp = (val?: ClaimInvitationDetails['interestComputation']) => (
    val === 'simple' ? 'Simple' : val === 'comp_monthly' ? 'Compounded Monthly' : val === 'comp_annually' ? 'Compounded Annually' : '—'
  );
  const formatMonthBasis = (val?: ClaimInvitationDetails['interestMonthBasis']) => (
    val === '30_day' ? '30 days' : val === 'calendar' ? 'Calendar month' : val === 'day' ? 'Day' : val === 'annum' ? 'Annum' : '—'
  );
  const formatClassCategory = (val: string) => {
    switch (val) {
      case 'financial_secured': return 'Financial creditors - secured';
      case 'financial_unsecured': return 'Financial creditors - unsecured';
      case 'operational': return 'Operational Creditors';
      default: return val;
    }
  };

  // If invitationId is provided and invitation exists, show details view
  if (invitationId && currentInvitation) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-6">
          {/* Header with Back Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Link 
                  to="/claims/invitations"
                  className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <ChevronDown className="h-4 w-4 rotate-90" />
                  <span>Back to Invitations</span>
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Invitation Details - {currentInvitation.id}</h1>
              <p className="text-gray-600 mt-1">{currentInvitation.entityName}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate(`/claims/edit-invitation/${currentInvitation.id}`)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Invitation
              </Button>
              <Button onClick={() => handleCopyLink(currentInvitation.inviteLink)}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </div>

          {/* Summary row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Entity Name</p>
                  <p className="font-medium">{currentInvitation.entityName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Capacity</p>
                  <p className="font-medium">{currentInvitation.capacity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Authority</p>
                  <p className="font-medium">{currentInvitation.authority}</p>
                </div>
                {currentInvitation.orderNumber && (
                  <div>
                    <p className="text-sm text-gray-500">Order Number</p>
                    <p className="font-medium">{currentInvitation.orderNumber}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status & Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status & Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Current Status</p>
                  <Badge className={getStatusColor(currentInvitation.status)}>
                    {getStatusText(currentInvitation.status)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Creation Date</p>
                  <p className="font-medium">{new Date(currentInvitation.creationDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cutoff Date</p>
                  <p className="font-medium">{new Date(currentInvitation.cutoffDate).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Claims Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Claims Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Claims Received</p>
                  <p className="text-2xl font-bold text-blue-600">{currentInvitation.claimsReceived}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Invitation Link</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-600 truncate flex-1">{currentInvitation.inviteLink}</p>
                    <Button size="sm" variant="outline" onClick={() => handleCopyLink(currentInvitation.inviteLink)}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Address for Receiving Claims */}
          {currentDetails && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Address for Receiving Claims</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium break-all">{currentDetails.emailAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Weblink for Online Submission</p>
                  <p className="font-medium break-all">https://app.998p.com/claims/submit/{currentDetails.weblinkToken}</p>
                </div>
                <div className="md:col-span-3">
                  <p className="text-sm text-gray-500">Post Address</p>
                  <p className="font-medium">{currentDetails.postAddress}</p>
                </div>
              </CardContent>
            </Card>
          )}

          

          {/* Class of Creditors */}
          {currentDetails && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Class of Creditors & ARs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentDetails.classesOfCreditors.length === 0 ? (
                  <p className="text-sm text-gray-500">No classes added.</p>
                ) : (
                  currentDetails.classesOfCreditors.map(cls => (
                    <div key={cls.id} className="border rounded-md p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Category</p>
                          <p className="font-medium">{formatClassCategory(cls.category)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Name of Class</p>
                          <p className="font-medium">{cls.className}</p>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                        {cls.ars.map(ar => (
                          <div key={ar.id} className="bg-gray-50 rounded p-3">
                            <p className="text-sm text-gray-500">AR Name</p>
                            <p className="font-medium">{ar.name}</p>
                            <p className="text-sm text-gray-500 mt-1">Regn. No.</p>
                            <p className="font-medium">{ar.regn}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )}

          {/* Publication Details */}
          {currentDetails && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Publication of Public Notice</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Publication Date</p>
                  <p className="font-medium">{currentDetails.publicationDate ? new Date(currentDetails.publicationDate).toLocaleDateString() : '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Notice Copy Uploaded</p>
                  <p className="font-medium">{currentDetails.publicationCopyUploaded ? 'Yes' : 'No'}</p>
                </div>
                {!currentDetails.publicationDate && (
                  <div className="md:col-span-3 text-sm text-blue-700 bg-blue-50 p-3 rounded">Suggestion: Publish a "Notice inviting claims" via the integrated Publication Module.</div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Format of Claim Submission Forms */}
          {currentDetails && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Format of Claim Submission Forms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentDetails.submissionForms.length === 0 ? (
                  <p className="text-sm text-gray-500">No category templates added.</p>
                ) : (
                  currentDetails.submissionForms.map(sf => (
                    <div key={sf.id} className="border rounded p-3 space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Category</p>
                          <p className="font-medium">{sf.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Template Uploaded</p>
                          <p className="font-medium">{sf.templateUploaded ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                      {sf.fields.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-500">Required Fields for Online Submission</p>
                          <ul className="list-disc pl-5 text-sm">
                            {sf.fields.map(f => (
                              <li key={f.id}><span className="font-medium">{f.name}</span> — {f.type === 'nature' ? 'Nature of Field' : 'Amount Field'}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )}

          {/* Modifications & Admission Process */}
          {currentDetails && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Online Claim Modifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Permit Modifications</p>
                    <p className="font-medium">{currentDetails.permitModifications ? 'Yes' : 'No'}</p>
                  </div>
                  {currentDetails.permitModifications && (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Maximum Iterations</p>
                        <p className="font-medium">{currentDetails.maxModifications ?? '—'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Modification Cutoff Date</p>
                        <p className="font-medium">{currentDetails.modificationCutoffDate ? new Date(currentDetails.modificationCutoffDate).toLocaleDateString() : '—'}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Admission Process</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Process</p>
                    <p className="font-medium">
                      {currentDetails.admissionProcess === 'single_stage' && 'Single Stage (Verification)'}
                      {currentDetails.admissionProcess === 'double_stage' && 'Double Stage (Verification + Admission)'}
                      {currentDetails.admissionProcess === 'threshold_based' && 'Threshold Based'}
                    </p>
                  </div>
                  {currentDetails.admissionProcess === 'threshold_based' && (
                    <div>
                      <p className="text-sm text-gray-500">Threshold Limit (₹)</p>
                      <p className="font-medium">{currentDetails.thresholdLimit}</p>
                      <p className="text-xs text-gray-500 mt-1">Below threshold: Verification only; Equal/above: Verification + Admission.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Cut-off Dates */}
          {currentDetails && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Cut-off Dates</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Claims/Debts as on</p>
                  <p className="font-medium">{currentDetails.claimsAsOnDate ? new Date(currentDetails.claimsAsOnDate).toLocaleDateString() : '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">For Receiving Claims</p>
                  <p className="font-medium">{currentDetails.receivingClaimsDate ? new Date(currentDetails.receivingClaimsDate).toLocaleDateString() : '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">For Verifying Claims</p>
                  <p className="font-medium">{currentDetails.verifyingClaimsDate ? new Date(currentDetails.verifyingClaimsDate).toLocaleDateString() : '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">For Admitting Claims</p>
                  <p className="font-medium">{currentDetails.admittingClaimsDate ? new Date(currentDetails.admittingClaimsDate).toLocaleDateString() : '—'}</p>
                </div>
                {currentDetails.permitModifications && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">For Claim Modification</p>
                    <p className="font-medium">{currentDetails.modificationCutoffDate ? new Date(currentDetails.modificationCutoffDate).toLocaleDateString() : (currentDetails.receivingClaimsDate ? new Date(currentDetails.receivingClaimsDate).toLocaleDateString() : '—')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* AI Assistance & Interest/Forex Settings */}
          {currentDetails && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>AI Assistance & Interest/Forex Settings</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">AI-assistance Opted</p>
                  <p className="font-medium">{currentDetails.aiAssistanceOpted ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Default Interest Rate (%)</p>
                  <p className="font-medium">{currentDetails.defaultInterestRate ?? '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Interest Type</p>
                  <p className="font-medium">{formatInterestType(currentDetails.interestType)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Interest Computation</p>
                  <p className="font-medium">{formatInterestComp(currentDetails.interestComputation)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Month Basis</p>
                  <p className="font-medium">{formatMonthBasis(currentDetails.interestMonthBasis)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Forex Working Date</p>
                  <p className="font-medium">{currentDetails.forexRateDate ? new Date(currentDetails.forexRateDate).toLocaleDateString() : '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Applied Forex Rate (INR per USD)</p>
                  <p className="font-medium">{currentDetails.forexRate ?? '—'}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications & Emails */}
          {currentDetails && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Platform-generated Notifications/Emails</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Inviting Submission of claims</p>
                  <p className="font-medium">{formatNotify(currentDetails.notifyInvite)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reminder for Submission of claims</p>
                  <p className="font-medium">{formatNotify(currentDetails.notifyReminder)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Acknowledgement of receipt of claims</p>
                  <p className="font-medium">{formatNotify(currentDetails.notifyAck)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Documents Not-uploaded</p>
                  <p className="font-medium">{formatNotify(currentDetails.notifyDocsMissing)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Shortcomings in Documents Uploaded</p>
                  <p className="font-medium">{formatNotify(currentDetails.notifyShortcomings)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Request for Additional Information/Supporting Documents</p>
                  <p className="font-medium">{formatNotify(currentDetails.notifyAdditionalInfo)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Updates on Admitted and Not-admitted Claim Amounts</p>
                  <p className="font-medium">{formatNotify(currentDetails.notifyAdmitUpdates)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Claim Rejection</p>
                  <p className="font-medium">{formatNotify(currentDetails.notifyRejection)}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Signature */}
          {currentDetails && (
            <Card className="mb-10">
              <CardHeader>
                <CardTitle>Signature</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{currentDetails.signatureName ?? '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Designation</p>
                  <p className="font-medium">{currentDetails.signatureDesignation ?? '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Signature Image</p>
                  <p className="font-medium">{currentDetails.signatureImageUploaded ? 'Uploaded' : 'Not uploaded'}</p>
                </div>
                <div className="md:col-span-3 text-sm text-yellow-800 bg-yellow-50 border border-yellow-200 rounded p-3">
                  All generated reports will include this digital signature with a disclaimer about digital signing.
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    );
  }

  // Default invitations list view
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Claim Invitations</h1>
            <p className="text-gray-600 mt-1">Manage and track claim invitation requests</p>
          </div>
          <Button onClick={handleCreateInvitation} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Claim Invitation
          </Button>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search invitations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="submission_progress">Submission in Progress</SelectItem>
                  <SelectItem value="verification_progress">Verification in Progress</SelectItem>
                  <SelectItem value="admission_progress">Admission in Progress</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="irp">IRP appointed by NCLT</SelectItem>
                  <SelectItem value="liquidator">Liquidator appointed by NCLT</SelectItem>
                  <SelectItem value="receiver">Receiver appointed by High Court</SelectItem>
                  <SelectItem value="auditor">Statutory Auditor</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>

              <Select value={pageSize} onValueChange={setPageSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Items per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                  <SelectItem value="100">100 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Invitations Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Claim Invitations ({sortedInvitations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Entity Name</TableHead>
                    <TableHead>Creation Date</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Authority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Claims Received</TableHead>
                    <TableHead>Cutoff Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedInvitations.map((invitation) => (
                    <TableRow key={invitation.id}>
                      <TableCell className="font-medium">
                        {invitation.entityName}
                        {invitation.orderNumber && (
                          <div className="text-xs text-gray-500">
                            Order: {invitation.orderNumber}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(invitation.creationDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate" title={invitation.capacity}>
                          {invitation.capacity}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate" title={invitation.authority}>
                          {invitation.authority}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invitation.status)}>
                          {getStatusText(invitation.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-semibold">{invitation.claimsReceived}</span>
                      </TableCell>
                      <TableCell>
                        {new Date(invitation.cutoffDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(invitation.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditInvitation(invitation.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyLink(invitation.inviteLink)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500">
                  Showing {startIndex + 1} to {Math.min(startIndex + parseInt(pageSize), sortedInvitations.length)} of {sortedInvitations.length} results
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ClaimInvitations;
