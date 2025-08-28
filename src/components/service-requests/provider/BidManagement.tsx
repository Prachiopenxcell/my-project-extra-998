import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock, 
  FileText,
  DollarSign,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
  Send,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Handshake
} from "lucide-react";
import { Link } from "react-router-dom";
import { serviceRequestService } from "@/services/serviceRequestService";
import { Bid, BidFilters, BidStatus, PaymentStructure } from "@/types/serviceRequest";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

const BidManagement = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [filters, setFilters] = useState<BidFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortBy, setSortBy] = useState("submittedAt");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Dialog states for negotiate and query
  const [showNegotiateDialog, setShowNegotiateDialog] = useState(false);
  const [showQueryDialog, setShowQueryDialog] = useState(false);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [negotiateMessage, setNegotiateMessage] = useState('');
  const [negotiateType, setNegotiateType] = useState<'price' | 'timeline' | 'scope' | 'terms'>('price');
  const [queryMessage, setQueryMessage] = useState('');
  const [queryType, setQueryType] = useState<'public' | 'private'>('private');

  // Mock data for demonstration
  const mockBids: Bid[] = useMemo(() => [
    {
      id: 'bid-001',
      bidNumber: 'BID2024001',
      serviceRequestId: 'sr-001',
      providerId: 'provider-001',
      providerName: 'Current Provider',
      financials: {
        professionalFee: 75000,
        platformFee: 7500,
        gst: 14850,
        reimbursements: 5000,
        regulatoryPayouts: 2000,
        ope: 3000,
        totalAmount: 107350,
        paymentStructure: PaymentStructure.MILESTONE_BASED
      },
      deliveryDate: new Date('2024-02-10'),
      additionalInputs: 'Comprehensive valuation with market analysis',
      documents: [],
      status: BidStatus.SUBMITTED,
      isInvited: true,
      submittedAt: new Date('2024-01-13'),
      updatedAt: new Date('2024-01-13'),
      lastEditDate: new Date('2024-01-13')
    },
    {
      id: 'bid-002',
      bidNumber: 'BID2024002',
      serviceRequestId: 'sr-002',
      providerId: 'provider-001',
      providerName: 'Current Provider',
      financials: {
        professionalFee: 25000,
        platformFee: 2500,
        gst: 4950,
        reimbursements: 1000,
        regulatoryPayouts: 500,
        ope: 1000,
        totalAmount: 34950,
        paymentStructure: PaymentStructure.LUMP_SUM
      },
      deliveryDate: new Date('2024-01-25'),
      additionalInputs: 'Publication in leading newspapers',
      documents: [],
      status: BidStatus.UNDER_NEGOTIATION,
      isInvited: false,
      submittedAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-16'),
      lastEditDate: new Date('2024-01-15')
    },
    // Completed Bids
    {
      id: 'bid-004',
      bidNumber: 'BID2024004',
      serviceRequestId: 'sr-004',
      providerId: 'provider-001',
      providerName: 'Current Provider',
      financials: {
        professionalFee: 35000,
        platformFee: 3500,
        gst: 6930,
        reimbursements: 2000,
        regulatoryPayouts: 1000,
        ope: 1500,
        totalAmount: 49930,
        paymentStructure: PaymentStructure.LUMP_SUM
      },
      deliveryDate: new Date('2023-12-15'),
      additionalInputs: 'Tax advisory services with GST compliance',
      documents: [],
      status: BidStatus.ACCEPTED,
      isInvited: false,
      submittedAt: new Date('2023-11-20'),
      updatedAt: new Date('2023-12-20'),
      lastEditDate: new Date('2023-11-20')
    },
    {
      id: 'bid-005',
      bidNumber: 'BID2024005',
      serviceRequestId: 'sr-005',
      providerId: 'provider-001',
      providerName: 'Current Provider',
      financials: {
        professionalFee: 65000,
        platformFee: 6500,
        gst: 12870,
        reimbursements: 3000,
        regulatoryPayouts: 2000,
        ope: 2500,
        totalAmount: 91870,
        paymentStructure: PaymentStructure.MILESTONE_BASED
      },
      deliveryDate: new Date('2024-01-10'),
      additionalInputs: 'Complete statutory audit with compliance reporting',
      documents: [],
      status: BidStatus.ACCEPTED,
      isInvited: true,
      submittedAt: new Date('2023-11-15'),
      updatedAt: new Date('2024-01-15'),
      lastEditDate: new Date('2023-11-15')
    },
    {
      id: 'bid-006',
      bidNumber: 'BID2024006',
      serviceRequestId: 'sr-006',
      providerId: 'provider-001',
      providerName: 'Current Provider',
      financials: {
        professionalFee: 28000,
        platformFee: 2800,
        gst: 5544,
        reimbursements: 1500,
        regulatoryPayouts: 800,
        ope: 1200,
        totalAmount: 39844,
        paymentStructure: PaymentStructure.LUMP_SUM
      },
      deliveryDate: new Date('2023-10-25'),
      additionalInputs: 'Contract drafting and legal advisory services',
      documents: [],
      status: BidStatus.ACCEPTED,
      isInvited: false,
      submittedAt: new Date('2023-10-05'),
      updatedAt: new Date('2023-10-30'),
      lastEditDate: new Date('2023-10-05')
    },
    {
      id: 'bid-007',
      bidNumber: 'BID2024007',
      serviceRequestId: 'sr-007',
      providerId: 'provider-001',
      providerName: 'Current Provider',
      financials: {
        professionalFee: 42000,
        platformFee: 4200,
        gst: 8316,
        reimbursements: 2500,
        regulatoryPayouts: 1200,
        ope: 1800,
        totalAmount: 60016,
        paymentStructure: PaymentStructure.MILESTONE_BASED
      },
      deliveryDate: new Date('2023-09-20'),
      additionalInputs: 'Company secretary services with ROC compliance',
      documents: [],
      status: BidStatus.ACCEPTED,
      isInvited: true,
      submittedAt: new Date('2023-08-25'),
      updatedAt: new Date('2023-09-25'),
      lastEditDate: new Date('2023-08-25')
    },
    {
      id: 'bid-008',
      bidNumber: 'BID2024008',
      serviceRequestId: 'sr-008',
      providerId: 'provider-001',
      providerName: 'Current Provider',
      financials: {
        professionalFee: 18000,
        platformFee: 1800,
        gst: 3564,
        reimbursements: 800,
        regulatoryPayouts: 400,
        ope: 600,
        totalAmount: 25164,
        paymentStructure: PaymentStructure.LUMP_SUM
      },
      deliveryDate: new Date('2023-08-15'),
      additionalInputs: 'Legal notice drafting for recovery matters',
      documents: [],
      status: BidStatus.ACCEPTED,
      isInvited: false,
      submittedAt: new Date('2023-07-20'),
      updatedAt: new Date('2023-08-20'),
      lastEditDate: new Date('2023-07-20')
    }
  ], []);

  const fetchBids = useCallback(async () => {
    try {
      setLoading(true);
      
      // Filter mock bids based on active tab
      let filteredBids = [...mockBids];
      
      if (activeTab === 'active') {
        filteredBids = filteredBids.filter(bid => 
          [BidStatus.SUBMITTED, BidStatus.UNDER_REVIEW, BidStatus.UNDER_NEGOTIATION].includes(bid.status)
        );
      } else if (activeTab === 'completed') {
        filteredBids = filteredBids.filter(bid => 
          [BidStatus.ACCEPTED, BidStatus.REJECTED, BidStatus.WITHDRAWN].includes(bid.status)
        );
      }

      // Apply search filter
      if (searchTerm) {
        filteredBids = filteredBids.filter(bid => 
          bid.bidNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bid.serviceRequestId.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setBids(filteredBids);
      setTotalRecords(filteredBids.length);
      setTotalPages(Math.ceil(filteredBids.length / pageSize));
    } catch (error) {
      console.error('Error fetching bids:', error);
      toast({
        title: "Error",
        description: "Failed to load bids. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [activeTab, pageSize, searchTerm, mockBids]);

  useEffect(() => {
    fetchBids();
  }, [fetchBids]);

  const getStatusColor = (status: BidStatus) => {
    switch (status) {
      case BidStatus.SUBMITTED:
        return 'bg-blue-100 text-blue-800';
      case BidStatus.UNDER_REVIEW:
        return 'bg-yellow-100 text-yellow-800';
      case BidStatus.UNDER_NEGOTIATION:
        return 'bg-orange-100 text-orange-800';
      case BidStatus.ACCEPTED:
        return 'bg-green-100 text-green-800';
      case BidStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      case BidStatus.WITHDRAWN:
        return 'bg-gray-100 text-gray-800';
      case BidStatus.DRAFT:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: BidStatus) => {
    switch (status) {
      case BidStatus.SUBMITTED:
        return 'Submitted';
      case BidStatus.UNDER_REVIEW:
        return 'Under Review';
      case BidStatus.UNDER_NEGOTIATION:
        return 'Under Negotiation';
      case BidStatus.ACCEPTED:
        return 'Accepted';
      case BidStatus.REJECTED:
        return 'Rejected';
      case BidStatus.WITHDRAWN:
        return 'Withdrawn';
      case BidStatus.DRAFT:
        return 'Draft';
      default:
        return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const handleWithdrawBid = async (bidId: string) => {
    if (window.confirm('Are you sure you want to withdraw this bid?')) {
      try {
        await serviceRequestService.withdrawBid(bidId);
        toast({
          title: "Success",
          description: "Bid withdrawn successfully.",
        });
        fetchBids();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to withdraw bid. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleExport = async () => {
    try {
      toast({
        title: "Export Started",
        description: "Bids are being exported to Excel.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export bids. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleNegotiate = async () => {
    if (!selectedBid || !negotiateMessage.trim()) return;
    
    try {
      // TODO: Integrate with real API
      // await serviceRequestService.submitNegotiation(selectedBid.id, {
      //   type: negotiateType,
      //   message: negotiateMessage
      // });
      
      toast({
        title: "Negotiation Submitted",
        description: `Your ${negotiateType} negotiation has been sent to the client.`,
      });
      
      setShowNegotiateDialog(false);
      setNegotiateMessage('');
      setSelectedBid(null);
      
      // Refresh bids to show updated status
      fetchBids();
    } catch (error) {
      toast({
        title: "Failed to Submit",
        description: "Failed to submit negotiation. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleQuery = async () => {
    if (!selectedBid || !queryMessage.trim()) return;
    
    try {
      // TODO: Integrate with real API
      // await serviceRequestService.submitQuery(selectedBid.serviceRequestId, {
      //   bidId: selectedBid.id,
      //   type: queryType,
      //   message: queryMessage
      // });
      
      toast({
        title: "Query Submitted",
        description: `Your ${queryType} query has been sent to the client.`,
      });
      
      setShowQueryDialog(false);
      setQueryMessage('');
      setSelectedBid(null);
    } catch (error) {
      toast({
        title: "Failed to Submit",
        description: "Failed to submit query. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderTableContent = () => {
    if (loading) {
      return (
        <TableBody>
          {[...Array(pageSize)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              <TableCell><Skeleton className="h-8 w-20" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      );
    }

    if (bids.length === 0) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No bids found
              </h3>
              <p className="text-gray-600 mb-4">
                {activeTab === 'active' 
                  ? "You don't have any active bids at the moment."
                  : "No completed bids found."
                }
              </p>
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    return (
      <TableBody>
        {bids.map((bid) => (
          <TableRow key={bid.id} className="hover:bg-gray-50">
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium text-blue-600">{bid.bidNumber}</span>
                <span className="text-sm text-gray-600">
                  SRN: {bid.serviceRequestId.toUpperCase()}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <span className="font-medium">₹{bid.financials.totalAmount.toLocaleString()}</span>
            </TableCell>
            <TableCell>
              {format(new Date(bid.deliveryDate), 'dd/MM/yyyy')}
            </TableCell>
            <TableCell>
              {format(new Date(bid.lastEditDate), 'dd/MM/yyyy')}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(bid.status)}>
                  {getStatusLabel(bid.status)}
                </Badge>
                {bid.isInvited && (
                  <Badge variant="outline" className="text-xs">
                    Invited
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Link to={`/bids/${bid.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-3 w-3" />
                  </Button>
                </Link>
                {[BidStatus.SUBMITTED, BidStatus.UNDER_REVIEW].includes(bid.status) && (
                  <Link to={`/bids/${bid.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </Link>
                )}
                {/* Negotiate button for submitted/under review bids */}
                {[BidStatus.SUBMITTED, BidStatus.UNDER_REVIEW].includes(bid.status) && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedBid(bid);
                      setShowNegotiateDialog(true);
                    }}
                    title="Negotiate Terms"
                  >
                    <Handshake className="h-3 w-3" />
                  </Button>
                )}
                {/* Query button for all active bids */}
                {[BidStatus.SUBMITTED, BidStatus.UNDER_REVIEW, BidStatus.UNDER_NEGOTIATION].includes(bid.status) && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedBid(bid);
                      setShowQueryDialog(true);
                    }}
                    title="Ask Question"
                  >
                    <HelpCircle className="h-3 w-3" />
                  </Button>
                )}
                {/* Chat button for negotiation status */}
                {bid.status === BidStatus.UNDER_NEGOTIATION && (
                  <Button variant="outline" size="sm" title="Open Chat">
                    <MessageSquare className="h-3 w-3" />
                  </Button>
                )}
                {[BidStatus.SUBMITTED, BidStatus.UNDER_REVIEW, BidStatus.UNDER_NEGOTIATION].includes(bid.status) && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleWithdrawBid(bid.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Bids</h2>
          <p className="text-gray-600">Track and manage your submitted bids</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchBids}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Bids
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{mockBids.length}</div>
            <p className="text-xs text-gray-600 mt-1">
              All submitted bids
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Bids
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {mockBids.filter(b => [BidStatus.SUBMITTED, BidStatus.UNDER_REVIEW, BidStatus.UNDER_NEGOTIATION].includes(b.status)).length}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Awaiting response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Won Bids
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {mockBids.filter(b => b.status === BidStatus.ACCEPTED).length}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Successful proposals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Success Rate
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {mockBids.length > 0 ? Math.round((mockBids.filter(b => b.status === BidStatus.ACCEPTED).length / mockBids.length) * 100) : 0}%
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Bid success rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by bid number or SRN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="submittedAt">Submitted Date</SelectItem>
                  <SelectItem value="lastEditDate">Last Updated</SelectItem>
                  <SelectItem value="deliveryDate">Delivery Date</SelectItem>
                  <SelectItem value="totalAmount">Bid Amount</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest First</SelectItem>
                  <SelectItem value="asc">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Bids</TabsTrigger>
          <TabsTrigger value="completed">Completed Bids</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{activeTab === 'active' ? 'Active' : 'Completed'} Bids</span>
                <span className="text-sm font-normal text-gray-600">
                  {totalRecords} total records
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bid Number</TableHead>
                      <TableHead>Bid Amount</TableHead>
                      <TableHead>Delivery Date</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  {renderTableContent()}
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Show</span>
                    <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-gray-600">entries</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <span className="text-sm text-gray-600 px-3">
                      Page {currentPage} of {totalPages}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Negotiate Dialog */}
    <Dialog open={showNegotiateDialog} onOpenChange={setShowNegotiateDialog}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Negotiate Bid Terms</DialogTitle>
          <DialogDescription>
            Propose changes to your bid for {selectedBid?.bidNumber}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="negotiateType">Negotiation Type</Label>
            <Select value={negotiateType} onValueChange={(value: 'price' | 'timeline' | 'scope' | 'terms') => setNegotiateType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price Adjustment</SelectItem>
                <SelectItem value="timeline">Timeline Extension</SelectItem>
                <SelectItem value="scope">Scope Modification</SelectItem>
                <SelectItem value="terms">Terms & Conditions</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="negotiateMessage">Negotiation Details</Label>
            <Textarea 
              id="negotiateMessage"
              value={negotiateMessage}
              onChange={(e) => setNegotiateMessage(e.target.value)}
              placeholder="Explain your proposed changes and reasoning..."
              rows={5}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNegotiateDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleNegotiate} disabled={!negotiateMessage.trim()}>
            Submit Negotiation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Query Dialog */}
    <Dialog open={showQueryDialog} onOpenChange={setShowQueryDialog}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ask Question</DialogTitle>
          <DialogDescription>
            Send a query about service request for {selectedBid?.bidNumber}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="queryType">Query Type</Label>
            <Select value={queryType} onValueChange={(value: 'public' | 'private') => setQueryType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private (Only to Client)</SelectItem>
                <SelectItem value="public">Public (Visible to All Bidders)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="queryMessage">Your Question</Label>
            <Textarea 
              id="queryMessage"
              value={queryMessage}
              onChange={(e) => setQueryMessage(e.target.value)}
              placeholder="Ask your question about the service request..."
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowQueryDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleQuery} disabled={!queryMessage.trim()}>
            Send Query
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>
  );
};

export default BidManagement;
