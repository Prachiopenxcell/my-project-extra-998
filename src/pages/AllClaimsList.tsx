import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useToast } from "@/components/ui/use-toast";
import { 
  Search, 
  Plus, 
  Calendar, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  Building,
  Eye,
  FileText,
  BarChart3,
  Zap,
  Activity,
  Users,
  Filter,
  Edit,
  Trash2,
  MoreHorizontal,
  DollarSign,
  UserCheck,
  ClipboardList,
  Settings,
  Download,
  Upload,
  CheckCircle
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

interface Claim {
  id: string;
  claimantName: string;
  claimantCategory: string;
  claimedAmount: number;
  status: 'open' | 'allocation_pending' | 'verification_pending' | 'admission_pending' | 'accepted' | 'rejected';
  source: 'claimant_submitted' | 'team_uploaded';
  submissionDate: string;
  uploadedBy?: string;
  assignedTo?: string;
  verifiedBy?: string;
  admittedBy?: string;
  entityName: string;
}

const AllClaimsList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'all';
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [pageSize, setPageSize] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual API calls
  const [claims, setClaims] = useState<Claim[]>([
    {
      id: "INV001",
      claimantName: "State Bank of India",
      claimantCategory: "Financial Creditor - Secured",
      claimedAmount: 5000000,
      status: "verification_pending",
      source: "claimant_submitted",
      submissionDate: "2024-01-20",
      assignedTo: "John Doe",
      entityName: "ABC Corporation Ltd"
    },
    {
      id: "INV002",
      claimantName: "HDFC Bank Ltd",
      claimantCategory: "Financial Creditor - Unsecured",
      claimedAmount: 2500000,
      status: "accepted",
      source: "claimant_submitted",
      submissionDate: "2024-01-18",
      assignedTo: "Jane Smith",
      verifiedBy: "John Doe",
      admittedBy: "Jane Smith",
      entityName: "ABC Corporation Ltd"
    },
    {
      id: "INV003",
      claimantName: "ABC Suppliers Ltd",
      claimantCategory: "Operational Creditor",
      claimedAmount: 750000,
      status: "allocation_pending",
      source: "team_uploaded",
      submissionDate: "2024-01-19",
      uploadedBy: "Admin User",
      entityName: "ABC Corporation Ltd"
    },
    {
      id: "INV004",
      claimantName: "Employee Union",
      claimantCategory: "Workmen/Staff/Employees",
      claimedAmount: 1200000,
      status: "admission_pending",
      source: "claimant_submitted",
      submissionDate: "2024-01-17",
      assignedTo: "Mike Johnson",
      verifiedBy: "John Doe",
      entityName: "ABC Corporation Ltd"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'allocation_pending':
        return 'bg-red-100 text-red-800';
      case 'verification_pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'admission_pending':
        return 'bg-orange-100 text-orange-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Open';
      case 'allocation_pending':
        return 'Allocation Pending';
      case 'verification_pending':
        return 'Verification Pending';
      case 'admission_pending':
        return 'Admission Pending';
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
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

  const handleViewDetails = (id: string) => {
    navigate(`/claims/claim/${id}`);
  };

  const handleAllocateClaim = (id: string) => {
    navigate(`/claims/allocate/${id}`);
  };

  const handleUploadClaim = () => {
    navigate('/claims/upload-claim');
  };

  const handleViewAuditLog = (id: string) => {
    navigate(`/claims/audit-log/${id}`);
  };

  const handleEditClaim = (id: string) => {
    navigate(`/claims/edit/${id}`);
    toast({
      title: "Edit Claim",
      description: "Opening claim for editing...",
    });
  };

  const handleDeleteClaim = (id: string) => {
    // Show confirmation dialog
    if (window.confirm('Are you sure you want to delete this claim? This action cannot be undone.')) {
      setClaims(prev => prev.filter(claim => claim.id !== id));
      toast({
        title: "Claim Deleted",
        description: "The claim has been successfully deleted.",
        variant: "destructive"
      });
    }
  };

  const handleVerifyClaim = (id: string) => {
    navigate(`/claims/verify/${id}`);
  };

  const handleAdmitClaim = (id: string) => {
    navigate(`/claims/admit/${id}`);
  };

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = claim.claimantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.claimantCategory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || claim.status === statusFilter;
    const matchesSource = sourceFilter === "all" || claim.source === sourceFilter;
    
    // Tab-specific filtering
    if (activeTab === 'verification') {
      return claim.status === 'verification_pending' && matchesSearch && matchesSource;
    } else if (activeTab === 'admission') {
      return claim.status === 'admission_pending' && matchesSearch && matchesSource;
    } else if (activeTab === 'allocation') {
      return claim.status === 'allocation_pending' && matchesSearch && matchesSource;
    } else if (activeTab === 'team_uploaded') {
      return claim.source === 'team_uploaded' && matchesSearch && matchesStatus;
    }
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const sortedClaims = [...filteredClaims].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime();
      case 'oldest':
        return new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime();
      case 'amount_high':
        return b.claimedAmount - a.claimedAmount;
      case 'amount_low':
        return a.claimedAmount - b.claimedAmount;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedClaims.length / parseInt(pageSize));
  const startIndex = (currentPage - 1) * parseInt(pageSize);
  const paginatedClaims = sortedClaims.slice(startIndex, startIndex + parseInt(pageSize));

  return (
    <DashboardLayout userType="service_provider">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Claims</h1>
            <p className="text-gray-600 mt-1">Manage and track all claim submissions</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/claims/allocation-settings')}>
              <Settings className="w-4 h-4 mr-2" />
              Allocation Settings
            </Button>
            <Button onClick={handleUploadClaim} className="bg-blue-600 hover:bg-blue-700">
              <Upload className="w-4 h-4 mr-2" />
              Upload Claim
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search claims..."
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
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="allocation_pending">Allocation Pending</SelectItem>
                  <SelectItem value="verification_pending">Verification Pending</SelectItem>
                  <SelectItem value="admission_pending">Admission Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="claimant_submitted">Claimant Submitted</SelectItem>
                  <SelectItem value="team_uploaded">Team Uploaded</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="amount_high">Amount (High to Low)</SelectItem>
                  <SelectItem value="amount_low">Amount (Low to High)</SelectItem>
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

        {/* Claims Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Claims</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="admission">Admission</TabsTrigger>
            <TabsTrigger value="team_uploaded">Team Uploaded</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <ClaimsTable 
              claims={paginatedClaims}
              onViewDetails={handleViewDetails}
              onAllocate={handleAllocateClaim}
              onViewAuditLog={handleViewAuditLog}
              showAllActions={true}
            />
          </TabsContent>

          <TabsContent value="allocation">
            <ClaimsTable 
              claims={paginatedClaims}
              onViewDetails={handleViewDetails}
              onAllocate={handleAllocateClaim}
              onViewAuditLog={handleViewAuditLog}
              onEdit={handleEditClaim}
              onDelete={handleDeleteClaim}
              onVerify={handleVerifyClaim}
              onAdmit={handleAdmitClaim}
              showAllActions={false}
              primaryAction="allocate"
            />
          </TabsContent>

          <TabsContent value="verification">
            <ClaimsTable 
              claims={paginatedClaims}
              onViewDetails={handleViewDetails}
              onAllocate={handleAllocateClaim}
              onViewAuditLog={handleViewAuditLog}
              onEdit={handleEditClaim}
              onDelete={handleDeleteClaim}
              onVerify={handleVerifyClaim}
              onAdmit={handleAdmitClaim}
              showAllActions={false}
              primaryAction="verify"
            />
          </TabsContent>

          <TabsContent value="admission">
            <ClaimsTable 
              claims={paginatedClaims}
              onViewDetails={handleViewDetails}
              onAllocate={handleAllocateClaim}
              onViewAuditLog={handleViewAuditLog}
              onEdit={handleEditClaim}
              onDelete={handleDeleteClaim}
              onVerify={handleVerifyClaim}
              onAdmit={handleAdmitClaim}
              showAllActions={false}
              primaryAction="admit"
            />
          </TabsContent>

          <TabsContent value="team_uploaded">
            <ClaimsTable 
              claims={paginatedClaims}
              onViewDetails={handleViewDetails}
              onAllocate={handleAllocateClaim}
              onViewAuditLog={handleViewAuditLog}
              onEdit={handleEditClaim}
              onDelete={handleDeleteClaim}
              onVerify={handleVerifyClaim}
              onAdmit={handleAdmitClaim}
              showAllActions={true}
              showEditDelete={true}
            />
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(startIndex + parseInt(pageSize), sortedClaims.length)} of {sortedClaims.length} results
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
      </div>
    </DashboardLayout>
  );
};

interface ClaimsTableProps {
  claims: Claim[];
  onViewDetails: (id: string) => void;
  onAllocate: (id: string) => void;
  onViewAuditLog: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onVerify?: (id: string) => void;
  onAdmit?: (id: string) => void;
  showAllActions?: boolean;
  showEditDelete?: boolean;
  primaryAction?: 'allocate' | 'verify' | 'admit';
}

const ClaimsTable = ({ 
  claims, 
  onViewDetails, 
  onAllocate, 
  onViewAuditLog,
  onEdit,
  onDelete,
  onVerify,
  onAdmit,
  showAllActions = true,
  showEditDelete = false,
  primaryAction
}: ClaimsTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'allocation_pending':
        return 'bg-red-100 text-red-800';
      case 'verification_pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'admission_pending':
        return 'bg-orange-100 text-orange-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Open';
      case 'allocation_pending':
        return 'Allocation Pending';
      case 'verification_pending':
        return 'Verification Pending';
      case 'admission_pending':
        return 'Admission Pending';
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Claims ({claims.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim ID</TableHead>
                <TableHead>Claimant</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Submission Date</TableHead>
                {showEditDelete && <TableHead>Uploaded By</TableHead>}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {claims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-mono font-semibold text-blue-600">
                    {claim.id}
                  </TableCell>
                  <TableCell className="font-medium">
                    {claim.claimantName}
                    {claim.assignedTo && (
                      <div className="text-xs text-gray-500">
                        Assigned to: {claim.assignedTo}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[150px] truncate" title={claim.claimantCategory}>
                      {claim.claimantCategory}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(claim.claimedAmount)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(claim.status)}>
                      {getStatusText(claim.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {claim.source === 'claimant_submitted' ? 'Claimant' : 'Team'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(claim.submissionDate).toLocaleDateString()}
                  </TableCell>
                  {showEditDelete && (
                    <TableCell>
                      {claim.uploadedBy || '-'}
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(claim.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      {primaryAction === 'allocate' && claim.status === 'allocation_pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onAllocate(claim.id)}
                          title="Allocate Claim"
                        >
                          <Users className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {primaryAction === 'verify' && claim.status === 'verification_pending' && onVerify && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onVerify(claim.id)}
                          title="Verify Claim"
                          className="text-yellow-600 hover:text-yellow-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {primaryAction === 'admit' && claim.status === 'admission_pending' && onAdmit && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onAdmit(claim.id)}
                          title="Admit Claim"
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {showEditDelete && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onEdit && onEdit(claim.id)}
                            title="Edit Claim"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onDelete && onDelete(claim.id)}
                            title="Delete Claim"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewAuditLog(claim.id)}
                      >
                        <Activity className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AllClaimsList;
