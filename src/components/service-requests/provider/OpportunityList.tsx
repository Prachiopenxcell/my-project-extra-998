import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  FileText, 
  Calendar, 
  Clock, 
  DollarSign,
  Users,
  Target,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
  UserCheck,
  UserX,
  Send,
  TrendingUp,
  Award
} from "lucide-react";
import { Link } from "react-router-dom";
import { serviceRequestService } from "@/services/serviceRequestService";
import { ServiceRequest, OpportunityFilters, ServiceRequestStatus } from "@/types/serviceRequest";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";

const OpportunityList = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("open");
  const [filters, setFilters] = useState<OpportunityFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRangeFilter, setDateRangeFilter] = useState<{ from?: string; to?: string }>({});
  const [srnFilter, setSrnFilter] = useState<string>("");
  const [selectedOpportunities, setSelectedOpportunities] = useState<string[]>([]);
  const [bidComparisonModal, setBidComparisonModal] = useState<{ isOpen: boolean; opportunity: ServiceRequest | null }>({ isOpen: false, opportunity: null });

  // Check if user is entity admin for bulk allocation features
  const isEntityAdmin = user?.role === UserRole.SERVICE_PROVIDER_ENTITY_ADMIN;

  const fetchOpportunities = useCallback(async () => {
    try {
      setLoading(true);
      let statusFilters: ServiceRequestStatus[] = [];
      
      if (activeTab === 'open') {
        statusFilters = [ServiceRequestStatus.OPEN, ServiceRequestStatus.IN_PROGRESS];
      } else if (activeTab === 'missed') {
        statusFilters = [
          ServiceRequestStatus.AWARDED_TO_ANOTHER,
          ServiceRequestStatus.SUBMISSION_TIME_PASSED,
          ServiceRequestStatus.WON_BUT_NO_WORK_ORDER,
          ServiceRequestStatus.NOT_INTERESTED
        ];
        // Add additional status filter for missed opportunities
        if (statusFilter && statusFilter !== 'all') {
          statusFilters = statusFilters.filter(status => status === statusFilter);
        }
      }

      const response = await serviceRequestService.getOpportunities({
        ...filters,
        status: statusFilters,
        search: searchTerm,
        srnNumber: srnFilter,
        page: currentPage,
        limit: pageSize,
        sortBy,
        sortOrder,
        dateRange: dateRangeFilter
      });

      setOpportunities(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotalRecords(response.pagination.total);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      toast({
        title: "Error",
        description: "Failed to fetch opportunities. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchTerm, filters, currentPage, pageSize, sortBy, sortOrder, statusFilter, dateRangeFilter, srnFilter]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);


  const handleMarkNotInterested = async (opportunityId: string) => {
    try {
      await serviceRequestService.markNotInterested(opportunityId);
      toast({
        title: "Success",
        description: "Opportunity marked as not interested."
      });
      fetchOpportunities();
    } catch (error) {
      console.error('Error marking not interested:', error);
      toast({
        title: "Error",
        description: "Failed to mark opportunity as not interested.",
        variant: "destructive"
      });
    }
  };

  const handleExportToExcel = async () => {
    try {
      let statusFilters: ServiceRequestStatus[] = [];
      
      if (activeTab === 'open') {
        statusFilters = [ServiceRequestStatus.OPEN, ServiceRequestStatus.IN_PROGRESS];
      } else if (activeTab === 'missed') {
        statusFilters = [
          ServiceRequestStatus.AWARDED_TO_ANOTHER,
          ServiceRequestStatus.SUBMISSION_TIME_PASSED,
          ServiceRequestStatus.WON_BUT_NO_WORK_ORDER,
          ServiceRequestStatus.NOT_INTERESTED
        ];
        if (statusFilter && statusFilter !== 'all') {
          statusFilters = statusFilters.filter(status => status === statusFilter);
        }
      }

      await serviceRequestService.exportOpportunitiesToExcel({
        ...filters,
        status: statusFilters,
        search: searchTerm,
        srnNumber: srnFilter,
        dateRange: dateRangeFilter
      });
      
      toast({
        title: "Success",
        description: "Excel file has been downloaded successfully."
      });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast({
        title: "Error",
        description: "Failed to export data to Excel.",
        variant: "destructive"
      });
    }
  };

  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateRangeFilter({});
    setSrnFilter("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const handleBulkAllocate = async () => {
    if (selectedOpportunities.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select opportunities to allocate.",
        variant: "destructive"
      });
      return;
    }

    // This would open a modal for team member selection
    // For now, we'll show a success message
    toast({
      title: "Allocation Started",
      description: `${selectedOpportunities.length} opportunities selected for allocation.`,
    });
  };

  const renderTableContent = () => {
    if (loading) {
      return (
        <TableBody>
          {[...Array(pageSize)].map((_, i) => (
            <TableRow key={i}>
              {isEntityAdmin && <TableCell><Skeleton className="h-4 w-4" /></TableCell>}
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              <TableCell><Skeleton className="h-8 w-20" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      );
    }

    if (opportunities.length === 0) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={isEntityAdmin ? 7 : 6} className="text-center py-8">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No opportunities found
              </h3>
              <p className="text-gray-600 mb-4">
                {activeTab === 'missed' 
                  ? "No missed opportunities at the moment."
                  : "No open opportunities available right now. Check back later for new opportunities."
                }
              </p>
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    return (
      <TableBody>
        {opportunities.map((opportunity) => (
          <TableRow key={opportunity.id} className="hover:bg-gray-50">
            {isEntityAdmin && (
              <TableCell>
                <Checkbox
                  checked={selectedOpportunities.includes(opportunity.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedOpportunities(prev => [...prev, opportunity.id]);
                    } else {
                      setSelectedOpportunities(prev => prev.filter(id => id !== opportunity.id));
                    }
                  }}
                />
              </TableCell>
            )}
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium text-blue-600">{opportunity.srnNumber}</span>
                <span className="text-sm text-gray-600 truncate max-w-48">
                  {opportunity.title}
                </span>
              </div>
            </TableCell>
            <TableCell>
              {opportunity.workRequiredBy 
                ? format(new Date(opportunity.workRequiredBy), 'dd/MM/yyyy')
                : '-'
              }
            </TableCell>
            <TableCell>
              {format(new Date(opportunity.deadline), 'dd/MM/yyyy')}
            </TableCell>
            <TableCell>
              <span className="text-sm text-gray-600">Team Member 1</span>
            </TableCell>
            <TableCell>
              {activeTab === 'missed' ? (
                <Badge 
                  className={
                    opportunity.status === ServiceRequestStatus.AWARDED_TO_ANOTHER
                      ? "bg-red-100 text-red-800"
                      : opportunity.status === ServiceRequestStatus.SUBMISSION_TIME_PASSED
                      ? "bg-orange-100 text-orange-800"
                      : opportunity.status === ServiceRequestStatus.WON_BUT_NO_WORK_ORDER
                      ? "bg-yellow-100 text-yellow-800"
                      : opportunity.status === ServiceRequestStatus.NOT_INTERESTED
                      ? "bg-purple-100 text-purple-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {opportunity.status === ServiceRequestStatus.AWARDED_TO_ANOTHER
                    ? "Awarded to Another"
                    : opportunity.status === ServiceRequestStatus.SUBMISSION_TIME_PASSED
                    ? "Time Passed"
                    : opportunity.status === ServiceRequestStatus.WON_BUT_NO_WORK_ORDER
                    ? "Won - No WO"
                    : opportunity.status === ServiceRequestStatus.NOT_INTERESTED
                    ? "Not Interested"
                    : opportunity.missedReason || "Missed"
                  }
                </Badge>
              ) : (
                <Badge className="bg-blue-100 text-blue-800">
                  Open
                </Badge>
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Link to={`/service-requests/${opportunity.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-3 w-3" />
                  </Button>
                </Link>
                {isEntityAdmin && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {/* Open allocation modal */}}
                  >
                    <UserCheck className="h-3 w-3" />
                  </Button>
                )}
                {activeTab === 'open' && opportunity.status === ServiceRequestStatus.OPEN && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleMarkNotInterested(opportunity.id)}
                    className="text-red-600 hover:text-red-700"
                    title="Mark as Not Interested"
                  >
                    <UserX className="h-3 w-3" />
                  </Button>
                )}
                {activeTab === 'missed' && opportunity.status === ServiceRequestStatus.AWARDED_TO_ANOTHER && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-blue-600 hover:text-blue-700"
                    title="View Awarded Amount Comparison"
                    onClick={() => setBidComparisonModal({ isOpen: true, opportunity })}
                  >
                    <DollarSign className="h-3 w-3" />
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
          <h2 className="text-2xl font-bold text-gray-900">Opportunities</h2>
          <p className="text-gray-600">Browse and manage available opportunities</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchOpportunities}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExportToExcel}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          {isEntityAdmin && selectedOpportunities.length > 0 && (
            <Button onClick={handleBulkAllocate} className="bg-blue-600 hover:bg-blue-700">
              <Users className="h-4 w-4 mr-2" />
              Allocate ({selectedOpportunities.length})
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by SRN, title, or client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="relative">
                <Input
                  placeholder="Filter by SRN Number"
                  value={srnFilter}
                  onChange={(e) => setSrnFilter(e.target.value)}
                  className="w-48"
                />
              </div>
              
              {activeTab === 'missed' && (
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reasons</SelectItem>
                    <SelectItem value={ServiceRequestStatus.AWARDED_TO_ANOTHER}>Awarded to Another</SelectItem>
                    <SelectItem value={ServiceRequestStatus.SUBMISSION_TIME_PASSED}>Submission Time Passed</SelectItem>
                    <SelectItem value={ServiceRequestStatus.WON_BUT_NO_WORK_ORDER}>Won but No Work Order</SelectItem>
                    <SelectItem value={ServiceRequestStatus.NOT_INTERESTED}>Not Interested</SelectItem>
                  </SelectContent>
                </Select>
              )}
              
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  placeholder="From date"
                  value={dateRangeFilter.from || ''}
                  onChange={(e) => setDateRangeFilter(prev => ({ ...prev, from: e.target.value }))}
                  className="w-36"
                />
                <span className="text-gray-400">to</span>
                <Input
                  type="date"
                  placeholder="To date"
                  value={dateRangeFilter.to || ''}
                  onChange={(e) => setDateRangeFilter(prev => ({ ...prev, to: e.target.value }))}
                  className="w-36"
                />
              </div>
              
              <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                const [field, order] = value.split('-');
                setSortBy(field);
                setSortOrder(order as 'asc' | 'desc');
              }}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">Date Created (Newest)</SelectItem>
                  <SelectItem value="createdAt-asc">Date Created (Oldest)</SelectItem>
                  <SelectItem value="deadline-asc">Deadline (Earliest)</SelectItem>
                  <SelectItem value="deadline-desc">Deadline (Latest)</SelectItem>
                  <SelectItem value="workRequiredBy-asc">Work Required By (Earliest)</SelectItem>
                  <SelectItem value="workRequiredBy-desc">Work Required By (Latest)</SelectItem>
                  <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                  <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                </SelectContent>
              </Select>
              
              {/* <Button variant="outline" size="sm" onClick={clearAllFilters}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleExportToExcel}>
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button> */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="open">Open Opportunities</TabsTrigger>
          <TabsTrigger value="missed">Missed Opportunities</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{activeTab === 'open' ? 'Open' : 'Missed'} Opportunities</span>
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
                      {isEntityAdmin && <TableHead className="w-12">Select</TableHead>}
                      <TableHead>SRN Number</TableHead>
                      <TableHead>Required By</TableHead>
                      <TableHead>Bid By</TableHead>
                      <TableHead>Current Assignee</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  {renderTableContent()}
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Show</span>
                      <Select value={pageSize.toString()} onValueChange={(value) => {
                        setPageSize(parseInt(value));
                        setCurrentPage(1);
                      }}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-sm text-gray-600">entries</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      Showing {totalRecords === 0 ? 0 : ((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords} entries
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1 || totalPages === 0}
                      title="Go to first page"
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1 || totalPages === 0}
                      title="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {totalPages > 0 && Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else {
                          // Show pages around current page
                          const start = Math.max(1, currentPage - 2);
                          const end = Math.min(totalPages, start + 4);
                          pageNum = start + i;
                          if (pageNum > end) return null;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className="w-8 h-8"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      title="Next page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages || totalPages === 0}
                      title="Go to last page"
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

      {/* Bid Comparison Modal */}
      <Dialog open={bidComparisonModal.isOpen} onOpenChange={(open) => setBidComparisonModal({ isOpen: open, opportunity: null })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-600" />
              Bid Comparison Analysis
            </DialogTitle>
          </DialogHeader>
          
          {bidComparisonModal.opportunity && (
            <div className="space-y-6">
              {/* Opportunity Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{bidComparisonModal.opportunity.title}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">SRN Number:</span>
                    <span className="ml-2 font-medium">{bidComparisonModal.opportunity.srnNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Budget Range:</span>
                    <span className="ml-2 font-medium">
                      ₹{bidComparisonModal.opportunity.budgetRange.min.toLocaleString()} - 
                      ₹{bidComparisonModal.opportunity.budgetRange.max.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Awarded Date:</span>
                    <span className="ml-2 font-medium">
                      {bidComparisonModal.opportunity.awardedDate 
                        ? format(new Date(bidComparisonModal.opportunity.awardedDate), 'dd/MM/yyyy')
                        : 'N/A'
                      }
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <Badge className="ml-2 bg-red-100 text-red-800">Awarded to Another</Badge>
                  </div>
                </div>
              </div>

              {/* Your Bid vs Winning Bid Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Your Final Bid */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <h4 className="font-semibold text-blue-800">Your Final Bid</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700">Your Bid Amount:</span>
                      <span className="text-2xl font-bold text-blue-800">
                        ₹{(bidComparisonModal.opportunity.winningBidAmount && bidComparisonModal.opportunity.winningBidAmount + 15000)?.toLocaleString() || '1,00,000'}
                      </span>
                    </div>
                    <div className="text-sm text-blue-600">
                      Your submitted bid for this opportunity.
                    </div>
                  </div>
                </div>

                {/* Winning Bid Information */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <h4 className="font-semibold text-green-800">Winning Bid</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-green-700">Winning Amount:</span>
                      <span className="text-2xl font-bold text-green-800">
                        ₹{bidComparisonModal.opportunity.winningBidAmount?.toLocaleString() || 'N/A'}
                      </span>
                    </div>
                    <div className="text-sm text-green-600">
                      Awarded to another service provider.
                    </div>
                  </div>
                </div>
              </div>

              {/* Bid Difference Analysis */}
              {bidComparisonModal.opportunity.winningBidAmount && (
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-4 w-4 text-orange-600" />
                    <h4 className="font-semibold text-orange-800">Bid Difference Analysis</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-orange-700">Difference:</span>
                      <span className="text-lg font-bold text-orange-800">
                        +₹{((bidComparisonModal.opportunity.winningBidAmount + 15000) - bidComparisonModal.opportunity.winningBidAmount).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-orange-700">Percentage Higher:</span>
                      <span className="font-medium text-orange-800">
                        {(((15000) / bidComparisonModal.opportunity.winningBidAmount) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-sm text-orange-600">
                      Your bid was higher than the winning bid by the above amount.
                    </div>
                  </div>
                </div>
              )}

              {/* Analysis Section */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <h4 className="font-semibold text-blue-800">Benchmarking Analysis</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-blue-700">Budget Range (Min):</span>
                    <span className="font-medium">₹{bidComparisonModal.opportunity.budgetRange.min.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-blue-700">Budget Range (Max):</span>
                    <span className="font-medium">₹{bidComparisonModal.opportunity.budgetRange.max.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-blue-700">Winning Bid Position:</span>
                    <span className="font-medium">
                      {bidComparisonModal.opportunity.winningBidAmount && (
                        bidComparisonModal.opportunity.winningBidAmount <= bidComparisonModal.opportunity.budgetRange.min
                          ? 'Below Budget Range'
                          : bidComparisonModal.opportunity.winningBidAmount >= bidComparisonModal.opportunity.budgetRange.max
                          ? 'At Maximum Budget'
                          : 'Within Budget Range'
                      )}
                    </span>
                  </div>
                  <div className="mt-4 p-3 bg-white rounded border">
                    <h5 className="font-medium text-gray-900 mb-2">Key Insights:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• The winning bid was competitive within the client's budget range</li>
                      <li>• Consider reviewing your pricing strategy for similar opportunities</li>
                      <li>• Analyze value proposition and service differentiation</li>
                      <li>• Review market rates for this type of service</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setBidComparisonModal({ isOpen: false, opportunity: null })}
            >
              Close
            </Button>
            <Link to={`/service-requests/${bidComparisonModal.opportunity?.id}`}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                View Full Details
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OpportunityList;
