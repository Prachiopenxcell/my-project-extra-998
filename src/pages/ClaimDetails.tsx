import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
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
import { useNavigate, useParams } from "react-router-dom";

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
}

const ClaimDetails = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("invitation");
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

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
    ]
  });

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
    navigate(`/claims/verify/${id}`);
  };

  const handleAdmitClaim = () => {
    navigate(`/claims/admit/${id}`);
  };

  const handleAllocateClaim = () => {
    navigate(`/claims/allocate/${id}`);
  };

  const handleDownloadDocument = (docId: string) => {
    toast({
      title: "Download Started",
      description: "Document download has been initiated.",
    });
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="invitation">Claim Invite</TabsTrigger>
            <TabsTrigger value="submission">Submission Details</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="admission">Admission</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="invitation">
            <Card>
              <CardHeader>
                <CardTitle>Claim Invitation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Capacity</label>
                    <p className="mt-1 text-sm text-gray-900">IRP appointed by NCLT</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Authority</label>
                    <p className="mt-1 text-sm text-gray-900">Admission Order by NCLT</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Order Number</label>
                    <p className="mt-1 text-sm text-gray-900">NCLT/001/2024</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Order Date</label>
                    <p className="mt-1 text-sm text-gray-900">January 10, 2024</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Receiving Address</label>
                  <p className="mt-1 text-sm text-gray-900">claims@abccorp.com</p>
                  <p className="mt-1 text-sm text-gray-900">123 Business District, Mumbai - 400001</p>
                </div>
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
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Assigned for Verification</label>
                    <p className="mt-1 text-sm text-gray-900">{claimData.assignedTo || 'Not Allocated'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Assigned for Admission</label>
                    <p className="mt-1 text-sm text-gray-900">{claimData.admittedBy || 'Not Allocated'}</p>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Allocation can be modified based on workload and expertise requirements.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification">
            <Card>
              <CardHeader>
                <CardTitle>Claim Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {claimData.status === 'verification_pending' ? (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Verification Pending</h3>
                    <p className="text-gray-600 mb-4">This claim is awaiting verification by the assigned team member.</p>
                    <Button onClick={handleVerifyClaim} className="bg-blue-600 hover:bg-blue-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Start Verification Process
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600">Verification details will appear here once the process begins.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admission">
            <Card>
              <CardHeader>
                <CardTitle>Claim Admission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {claimData.status === 'admission_pending' ? (
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
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Audit Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 border-l-4 border-blue-500 bg-blue-50">
                    <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Claim Submitted</p>
                      <p className="text-sm text-gray-600">Claim was submitted by {claimData.claimantName}</p>
                      <p className="text-xs text-gray-500">{new Date(claimData.submissionDate).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 border-l-4 border-purple-500 bg-purple-50">
                    <Users className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Claim Allocated</p>
                      <p className="text-sm text-gray-600">Assigned to {claimData.assignedTo} for verification</p>
                      <p className="text-xs text-gray-500">January 20, 2024, 2:30 PM</p>
                    </div>
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

export default ClaimDetails;
