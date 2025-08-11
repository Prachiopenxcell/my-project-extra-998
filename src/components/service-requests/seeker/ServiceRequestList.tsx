import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  Users,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  RefreshCw
} from "lucide-react";
import { Link } from "react-router-dom";
import { serviceRequestService } from "@/services/serviceRequestService";
import { ServiceRequest, ServiceRequestFilters, ServiceRequestStatus } from "@/types/serviceRequest";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

const ServiceRequestList = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("open");
  const [filters, setFilters] = useState<ServiceRequestFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchRequests();
  }, [activeTab, filters, currentPage, pageSize, sortBy, sortOrder, searchTerm]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      
      const statusFilter = getStatusFilter(activeTab);
      const searchFilters: ServiceRequestFilters = {
        ...filters,
        status: statusFilter,
        srnNumber: searchTerm || undefined
      };

      const response = await serviceRequestService.getServiceRequests(
        searchFilters,
        { page: currentPage, limit: pageSize, sortBy, sortOrder }
      );

      setRequests(response.data);
      setTotalPages(response.totalPages);
      setTotalRecords(response.total);
    } catch (error) {
      console.error('Error fetching service requests:', error);
      toast({
        title: "Error",
        description: "Failed to load service requests. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusFilter = (tab: string): ServiceRequestStatus[] | undefined => {
    switch (tab) {
      case 'open':
        return [ServiceRequestStatus.OPEN, ServiceRequestStatus.BID_RECEIVED, ServiceRequestStatus.UNDER_NEGOTIATION];
      case 'closed':
        return [ServiceRequestStatus.CLOSED, ServiceRequestStatus.WORK_ORDER_ISSUED, ServiceRequestStatus.CANCELLED];
      case 'draft':
        return [ServiceRequestStatus.DRAFT];
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
      case ServiceRequestStatus.DRAFT:
        return 'bg-orange-100 text-orange-800';
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
      case ServiceRequestStatus.DRAFT:
        return 'Draft';
      case ServiceRequestStatus.WORK_ORDER_ISSUED:
        return 'Work Order Issued';
      case ServiceRequestStatus.CANCELLED:
        return 'Cancelled';
      default:
        return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const handleExport = async () => {
    try {
      const statusFilter = getStatusFilter(activeTab);
      const exportFilters: ServiceRequestFilters = {
        ...filters,
        status: statusFilter
      };

      const downloadUrl = await serviceRequestService.exportServiceRequests(exportFilters, 'excel');
      
      // Create download link
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `service-requests-${activeTab}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: "Service requests have been exported to Excel.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export service requests. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service request?')) {
      try {
        await serviceRequestService.deleteServiceRequest(id);
        toast({
          title: "Success",
          description: "Service request deleted successfully.",
        });
        fetchRequests();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete service request. Please try again.",
          variant: "destructive"
        });
      }
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
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              <TableCell><Skeleton className="h-8 w-20" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      );
    }

    if (requests.length === 0) {
      return (
        <TableBody>
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No service requests found
              </h3>
              <p className="text-gray-600 mb-4">
                {activeTab === 'draft' 
                  ? "You don't have any draft requests."
                  : `No ${activeTab} service requests at the moment.`
                }
              </p>
              {activeTab === 'open' && (
                <Link to="/create-service-request">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Service Request
                  </Button>
                </Link>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    return (
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id} className="hover:bg-gray-50">
            <TableCell className="font-medium">
              {format(new Date(request.createdAt), 'dd/MM/yyyy')}
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium text-blue-600">{request.srnNumber}</span>
                <span className="text-sm text-gray-600 truncate max-w-48">
                  {request.title}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {request.serviceTypes.slice(0, 2).map((type) => (
                  <Badge key={type} variant="outline" className="text-xs">
                    {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                ))}
                {request.serviceTypes.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{request.serviceTypes.length - 2}
                  </Badge>
                )}
              </div>
            </TableCell>
            <TableCell>
              {request.workRequiredBy 
                ? format(new Date(request.workRequiredBy), 'dd/MM/yyyy')
                : '-'
              }
            </TableCell>
            <TableCell>
              {format(new Date(request.deadline), 'dd/MM/yyyy')}
            </TableCell>
            <TableCell>
              <Badge className={getStatusColor(request.status)}>
                {getStatusLabel(request.status)}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Link to={`/service-requests/${request.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-3 w-3" />
                  </Button>
                </Link>
                {request.status === ServiceRequestStatus.DRAFT && (
                  <Link to={`/service-requests/${request.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </Link>
                )}
                {[ServiceRequestStatus.DRAFT, ServiceRequestStatus.OPEN].includes(request.status) && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(request.id)}
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
          <h2 className="text-2xl font-bold text-gray-900">My Service Requests</h2>
          <p className="text-gray-600">Manage and track all your service requests</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchRequests}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Link to="/service-requests?tab=create">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Request
            </Button>
          </Link>
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
                  <SelectItem value="updatedAt">Updated Date</SelectItem>
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Service Requests</span>
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
                      <TableHead>Raised Date</TableHead>
                      <TableHead>SRN Number</TableHead>
                      <TableHead>Service Type</TableHead>
                      <TableHead>Required By</TableHead>
                      <TableHead>Deadline</TableHead>
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

export default ServiceRequestList;
