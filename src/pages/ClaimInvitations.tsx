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
import { Link, useNavigate } from "react-router-dom";

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

const ClaimInvitations = () => {
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

  return (
    <DashboardLayout userType="service_provider">
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
