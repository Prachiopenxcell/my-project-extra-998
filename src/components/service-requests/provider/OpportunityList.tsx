import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
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
  Send
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
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedOpportunities, setSelectedOpportunities] = useState<string[]>([]);

  // Check if user is entity admin for bulk allocation features
  const isEntityAdmin = user?.role === UserRole.SERVICE_PROVIDER_ENTITY_ADMIN;

  useEffect(() => {
    fetchOpportunities();
  }, [activeTab, filters, currentPage, pageSize, sortBy, sortOrder, searchTerm]);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      
      const statusFilter = getStatusFilter(activeTab);
      const searchFilters: OpportunityFilters = {
        ...filters,
        status: statusFilter
      };

      const response = await serviceRequestService.getOpportunities(
        'current-provider',
        searchFilters,
        { page: currentPage, limit: pageSize, sortBy, sortOrder }
      );

      setOpportunities(response.data);
      setTotalPages(response.totalPages);
      setTotalRecords(response.total);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      toast({
        title: "Error",
        description: "Failed to load opportunities. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusFilter = (tab: string): string[] | undefined => {
    switch (tab) {
      case 'open':
        return ['open', 'bid_received'];
      case 'missed':
        return ['closed', 'cancelled', 'expired'];
      default:
        return undefined;
    }
  };

  const getStatusColor = (status: ServiceRequestStatus) => {
    switch (status) {
      case ServiceRequestStatus.OPEN:
        return 'bg-blue-100 text-blue-800';
      case ServiceRequestStatus.BID_RECEIVED:
        return 'bg-green-100 text-green-800';
      case ServiceRequestStatus.UNDER_NEGOTIATION:
        return 'bg-yellow-100 text-yellow-800';
      case ServiceRequestStatus.CLOSED:
        return 'bg-gray-100 text-gray-800';
      case ServiceRequestStatus.WORK_ORDER_ISSUED:
        return 'bg-purple-100 text-purple-800';
      case ServiceRequestStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: ServiceRequestStatus) => {
    switch (status) {
      case ServiceRequestStatus.OPEN:
        return 'Open';
      case ServiceRequestStatus.BID_RECEIVED:
        return 'Bids Received';
      case ServiceRequestStatus.UNDER_NEGOTIATION:
        return 'Under Negotiation';
      case ServiceRequestStatus.CLOSED:
        return 'Closed';
      case ServiceRequestStatus.WORK_ORDER_ISSUED:
        return 'Work Order Issued';
      case ServiceRequestStatus.CANCELLED:
        return 'Cancelled';
      default:
        return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const handleMarkNotInterested = async (opportunityId: string) => {
    try {
      await serviceRequestService.markOpportunityNotInterested(opportunityId, 'current-provider');
      toast({
        title: "Success",
        description: "Opportunity marked as not interested.",
      });
      fetchOpportunities();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark opportunity. Please try again.",
        variant: "destructive"
      });
    }
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

  const handleExport = async () => {
    try {
      const statusFilter = getStatusFilter(activeTab);
      const exportFilters: OpportunityFilters = {
        ...filters,
        status: statusFilter
      };

      // Mock export functionality
      toast({
        title: "Export Started",
        description: "Opportunities are being exported to Excel.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export opportunities. Please try again.",
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
              <Badge className={getStatusColor(opportunity.status)}>
                {getStatusLabel(opportunity.status)}
              </Badge>
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
                {opportunity.status === ServiceRequestStatus.OPEN && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleMarkNotInterested(opportunity.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <UserX className="h-3 w-3" />
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
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
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
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by SRN number or title..."
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
                  <SelectItem value="createdAt">Created Date</SelectItem>
                  <SelectItem value="workRequiredBy">Required Date</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
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
    </div>
  );
};

export default OpportunityList;
