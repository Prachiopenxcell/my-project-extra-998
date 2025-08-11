import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Clock, 
  Users, 
  Pencil, 
  Eye, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Building, 
  CheckCircle, 
  Clock3, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Bell,
  CalendarDays,
  DollarSign,
  Download,
  Upload,
  MessageSquare,
  Star,
  AlertTriangle,
  TrendingUp,
  Activity
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { workOrderService } from "@/services/workOrderService";
import { useAuth } from "@/contexts/AuthContext";
import { UserType } from "@/types/auth";
import { 
  WorkOrder, 
  WorkOrderStats, 
  WorkOrderStatus, 
  WorkOrderFilters, 
  PaginationOptions,
  WorkOrderType 
} from "@/types/workOrder";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";

const WorkOrders = () => {
  const { user } = useAuth();
  
  return (
    <DashboardLayout userType={user?.userType === UserType.SERVICE_PROVIDER ? "service_provider" : "service_seeker"}>
      <div className="container mx-auto p-6">
        <WorkOrdersModule />
      </div>
    </DashboardLayout>
  );
};

interface WorkOrderAction {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: (workOrder: WorkOrder) => void;
  variant?: 'default' | 'secondary' | 'destructive';
  show?: (workOrder: WorkOrder) => boolean;
}

const WorkOrdersModule = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("open");
  
  // Debug: Log current user info
  console.log('🔍 DEBUG - Current User:', {
    user: user,
    role: user?.role,
    userType: user?.userType,
    isServiceProvider: user?.userType === UserType.SERVICE_PROVIDER
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [stats, setStats] = useState<WorkOrderStats>({
    total: 0,
    open: 0,
    inProgress: 0,
    completed: 0,
    disputed: 0,
    overdue: 0,
    pendingPayment: 0
  });
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const isServiceProvider = user?.userType === UserType.SERVICE_PROVIDER;

  // Fetch work orders
  const fetchWorkOrders = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      const filters: WorkOrderFilters = {};
      
      // Apply tab-based status filtering
      if (activeTab === "open") {
        filters.status = [
          WorkOrderStatus.PROFORMA,
          WorkOrderStatus.PAYMENT_PENDING,
          WorkOrderStatus.SIGNATURE_PENDING,
          WorkOrderStatus.INFORMATION_SOUGHT,
          WorkOrderStatus.INFORMATION_PENDING,
          WorkOrderStatus.PROFORMA_ACCEPTANCE_PENDING
        ];
      } else if (activeTab === "inProgress") {
        filters.status = [
          WorkOrderStatus.IN_PROGRESS,
          WorkOrderStatus.ON_HOLD,
          WorkOrderStatus.DISPUTED
        ];
      } else if (activeTab === "closed") {
        filters.status = [
          WorkOrderStatus.COMPLETED,
          WorkOrderStatus.PAYMENT_PENDING_COMPLETION,
          WorkOrderStatus.REJECTED,
          WorkOrderStatus.CANCELLED
        ];
      }

      // Apply additional filters
      if (statusFilter && statusFilter !== "all") {
        filters.status = [statusFilter as WorkOrderStatus];
      }
      
      if (searchTerm) {
        filters.woNumber = searchTerm;
      }

      const pagination: PaginationOptions = {
        page: currentPage,
        limit: pageSize,
        sortBy: sortBy === "latest" ? "createdAt" : "woNumber",
        sortOrder: sortBy === "latest" ? "desc" : "asc"
      };

      const response = isServiceProvider 
        ? await workOrderService.getWorkOrdersForProvider(user.id, filters, pagination)
        : await workOrderService.getWorkOrdersForSeeker(user.id, filters, pagination);
      
      setWorkOrders(response.data);
      setTotalPages(response.totalPages);

      // Fetch stats
      const userTypeParam = isServiceProvider ? 'provider' : 'seeker';
      const statsData = await workOrderService.getWorkOrderStats(user.id, userTypeParam);
      setStats(statsData);

    } catch (error) {
      console.error('Error fetching work orders:', error);
      toast({
        title: "Error",
        description: "Failed to load work orders. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, activeTab, searchTerm, statusFilter, sortBy, currentPage, pageSize, isServiceProvider]);

  useEffect(() => {
    fetchWorkOrders();
  }, [fetchWorkOrders]);

  // Action handlers
  const handleViewWorkOrder = (workOrder: WorkOrder) => {
    navigate(`/work-orders/${workOrder.id}`);
  };

  const handleEditWorkOrder = (workOrder: WorkOrder) => {
    navigate(`/work-orders/${workOrder.id}/edit`);
  };

  const handleCreateWorkOrder = () => {
    // Role-based navigation for work order creation
    if (isServiceProvider) {
      // Service Providers use their own create route
      navigate('/work-orders/create-provider');
    } else {
      // Service Seekers use the standard create route
      navigate('/work-orders/create');
    }
  };

  const handleMarkComplete = async (workOrder: WorkOrder) => {
    try {
      const userTypeParam = isServiceProvider ? 'provider' : 'seeker';
      await workOrderService.markWorkOrderComplete(workOrder.id, userTypeParam);
      toast({
        title: "Success",
        description: "Work order marked as complete successfully.",
      });
      fetchWorkOrders();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark work order as complete.",
        variant: "destructive"
      });
    }
  };

  const handleRaiseDispute = (workOrder: WorkOrder) => {
    navigate(`/work-orders/${workOrder.id}/dispute`);
  };

  const handleProvideFeedback = (workOrder: WorkOrder) => {
    navigate(`/work-orders/${workOrder.id}/feedback`);
  };

  // Define actions based on user type and work order status
  const getWorkOrderActions = (workOrder: WorkOrder): WorkOrderAction[] => {
    const baseActions: WorkOrderAction[] = [
      {
        label: "View",
        icon: Eye,
        onClick: handleViewWorkOrder
      }
    ];

    if (isServiceProvider) {
      // Service Provider actions
      if (workOrder.status === WorkOrderStatus.PROFORMA_ACCEPTANCE_PENDING) {
        baseActions.push({
          label: "Edit",
          icon: Pencil,
          onClick: handleEditWorkOrder,
          variant: "secondary"
        });
      }

      if (workOrder.status === WorkOrderStatus.IN_PROGRESS) {
        baseActions.push(
          {
            label: "Mark Complete",
            icon: CheckCircle,
            onClick: handleMarkComplete,
            variant: "default"
          },
          {
            label: "Raise Dispute",
            icon: AlertTriangle,
            onClick: handleRaiseDispute,
            variant: "destructive"
          }
        );
      }
    } else {
      // Service Seeker actions
      if (workOrder.status === WorkOrderStatus.PAYMENT_PENDING_COMPLETION) {
        baseActions.push({
          label: "Mark Complete",
          icon: CheckCircle,
          onClick: handleMarkComplete,
          variant: "default"
        });
      }

      if ([WorkOrderStatus.IN_PROGRESS, WorkOrderStatus.PAYMENT_PENDING_COMPLETION].includes(workOrder.status)) {
        baseActions.push({
          label: "Raise Dispute",
          icon: AlertTriangle,
          onClick: handleRaiseDispute,
          variant: "destructive"
        });
      }
    }

    // Common actions
    if ([WorkOrderStatus.IN_PROGRESS, WorkOrderStatus.COMPLETED].includes(workOrder.status)) {
      baseActions.push({
        label: "Feedback",
        icon: Star,
        onClick: handleProvideFeedback,
        variant: "secondary"
      });
    }

    return baseActions;
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: WorkOrderStatus }) => {
    const getStatusColor = (status: WorkOrderStatus) => {
      switch (status) {
        case WorkOrderStatus.COMPLETED:
          return "bg-green-100 text-green-800 border-green-200";
        case WorkOrderStatus.IN_PROGRESS:
          return "bg-blue-100 text-blue-800 border-blue-200";
        case WorkOrderStatus.DISPUTED:
          return "bg-red-100 text-red-800 border-red-200";
        case WorkOrderStatus.ON_HOLD:
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case WorkOrderStatus.PAYMENT_PENDING:
        case WorkOrderStatus.PAYMENT_PENDING_COMPLETION:
          return "bg-orange-100 text-orange-800 border-orange-200";
        case WorkOrderStatus.SIGNATURE_PENDING:
          return "bg-purple-100 text-purple-800 border-purple-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };

    const getStatusLabel = (status: WorkOrderStatus) => {
      return status.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
    };

    return (
      <Badge className={`${getStatusColor(status)} border`}>
        {getStatusLabel(status)}
      </Badge>
    );
  };

  // Stats cards component
  const StatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Work Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <Activity className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Disputed</p>
              <p className="text-2xl font-bold text-red-600">{stats.disputed}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Work order table component
  const WorkOrderTable = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (workOrders.length === 0) {
      return (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Work Orders Found</h3>
            <p className="text-gray-500 mb-4">
              {activeTab === "open" 
                ? "You don't have any open work orders at the moment."
                : activeTab === "inProgress"
                ? "No work orders are currently in progress."
                : "No closed work orders found."
              }
            </p>
            {!isServiceProvider && (
              <Button onClick={handleCreateWorkOrder}>
                <Plus className="h-4 w-4 mr-2" />
                Create Work Order
              </Button>
            )}
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {workOrders.map((workOrder) => (
          <Card key={workOrder.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {workOrder.woNumber}
                    </h3>
                    <StatusBadge status={workOrder.status} />
                    {workOrder.referenceNumber && (
                      <Badge variant="outline">
                        Ref: {workOrder.referenceNumber}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-2">{workOrder.title}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2" />
                      Created: {format(workOrder.createdAt, 'dd/MM/yyyy')}
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Due: {format(workOrder.timeline.expectedCompletionDate, 'dd/MM/yyyy')}
                    </div>
                    
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Amount: ₹{workOrder.financials.totalAmount.toLocaleString()}
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-gray-500">
                    <span className="font-medium">
                      {isServiceProvider ? 'Client: ' : 'Provider: '}
                    </span>
                    {isServiceProvider ? workOrder.serviceSeeker.name : workOrder.serviceProvider.name}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {getWorkOrderActions(workOrder).map((action, index) => (
                    <Button
                      key={index}
                      variant={action.variant || "outline"}
                      size="sm"
                      onClick={() => action.onClick(workOrder)}
                      className="flex items-center"
                    >
                      <action.icon className="h-4 w-4 mr-1" />
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Pagination component
  const Pagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, stats.total)} of {stats.total} results
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
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
          
          <span className="text-sm text-gray-700">
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
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Work Orders</h1>
          <p className="text-gray-600">
            Manage and track your work orders
          </p>
        </div>
        
        {!isServiceProvider && (
          <Button onClick={handleCreateWorkOrder}>
            <Plus className="h-4 w-4 mr-2" />
            Create Work Order
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by WO number or reference..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value={WorkOrderStatus.IN_PROGRESS}>In Progress</SelectItem>
                <SelectItem value={WorkOrderStatus.COMPLETED}>Completed</SelectItem>
                <SelectItem value={WorkOrderStatus.DISPUTED}>Disputed</SelectItem>
                <SelectItem value={WorkOrderStatus.ON_HOLD}>On Hold</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="woNumber">WO Number</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Work Orders Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="open" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Open ({stats.open})
          </TabsTrigger>
          <TabsTrigger value="inProgress" className="flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            In Progress ({stats.inProgress})
          </TabsTrigger>
          <TabsTrigger value="closed" className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Closed ({stats.completed})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="mt-6">
          <WorkOrderTable />
        </TabsContent>

        <TabsContent value="inProgress" className="mt-6">
          <WorkOrderTable />
        </TabsContent>

        <TabsContent value="closed" className="mt-6">
          <WorkOrderTable />
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      <Pagination />
    </div>
  );
};

export default WorkOrders;
