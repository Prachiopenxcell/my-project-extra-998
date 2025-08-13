import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
  CheckCircle, 
  AlertCircle,
  CalendarDays,
  DollarSign,
  MessageSquare,
  Star,
  ClipboardList,
  Briefcase,
  Building
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { UserType } from "@/types/auth";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

// Mock data interfaces
interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: Date;
  completedAt?: Date;
  budget: number;
  provider: string;
  category: string;
}

interface WorkOrderItem {
  id: string;
  woNumber: string;
  title: string;
  description: string;
  status: string;
  createdAt: Date;
  completedAt?: Date;
  amount: number;
  client: string;
  category: string;
}

// Mock data for demonstration
const mockOpenServiceRequests: ServiceRequest[] = [
  {
    id: "SR001",
    title: "Legal Consultation for Contract Review",
    description: "Need expert legal advice for reviewing commercial contracts",
    status: "open",
    createdAt: new Date('2024-01-15'),
    budget: 25000,
    provider: "Legal Associates LLP",
    category: "Legal Services"
  },
  {
    id: "SR002",
    title: "Tax Advisory Services",
    description: "Require assistance with GST compliance and filing",
    status: "open",
    createdAt: new Date('2024-01-20'),
    budget: 15000,
    provider: "Tax Consultants Inc",
    category: "Tax Services"
  },
  {
    id: "SR003",
    title: "Financial Audit Planning",
    description: "Planning and preparation for annual financial audit",
    status: "open",
    createdAt: new Date('2024-01-25'),
    budget: 35000,
    provider: "Audit Excellence",
    category: "Audit Services"
  }
];

const mockClosedServiceRequests: ServiceRequest[] = [
  {
    id: "SR004",
    title: "Audit Services Completed",
    description: "Annual audit services for FY 2023-24",
    status: "closed",
    createdAt: new Date('2023-12-10'),
    completedAt: new Date('2024-01-10'),
    budget: 50000,
    provider: "Audit Partners",
    category: "Audit Services"
  },
  {
    id: "SR005",
    title: "Legal Documentation Complete",
    description: "Company incorporation and legal documentation",
    status: "closed",
    createdAt: new Date('2023-11-20'),
    completedAt: new Date('2023-12-15'),
    budget: 20000,
    provider: "Legal Experts",
    category: "Legal Services"
  }
];

const mockOpenWorkOrders: WorkOrderItem[] = [
  {
    id: "WO001",
    woNumber: "WO2024001",
    title: "Corporate Law Advisory",
    description: "Ongoing legal advisory services for corporate matters",
    status: "in_progress",
    createdAt: new Date('2024-01-10'),
    amount: 75000,
    client: "ABC Corporation",
    category: "Legal Advisory"
  },
  {
    id: "WO002",
    woNumber: "WO2024002",
    title: "Financial Audit Services",
    description: "Comprehensive financial audit for Q4 2023",
    status: "payment_pending",
    createdAt: new Date('2024-01-25'),
    amount: 45000,
    client: "XYZ Ltd",
    category: "Audit Services"
  },
  {
    id: "WO003",
    woNumber: "WO2024003",
    title: "Tax Compliance Review",
    description: "Monthly tax compliance and filing services",
    status: "signature_pending",
    createdAt: new Date('2024-02-01'),
    amount: 18000,
    client: "DEF Enterprises",
    category: "Tax Services"
  }
];

const mockClosedWorkOrders: WorkOrderItem[] = [
  {
    id: "WO004",
    woNumber: "WO2023045",
    title: "Tax Compliance Services",
    description: "Complete tax filing and compliance services",
    status: "completed",
    createdAt: new Date('2023-11-15'),
    completedAt: new Date('2023-12-20'),
    amount: 30000,
    client: "DEF Enterprises",
    category: "Tax Services"
  },
  {
    id: "WO005",
    woNumber: "WO2023046",
    title: "Legal Advisory Complete",
    description: "Legal advisory for merger and acquisition",
    status: "completed",
    createdAt: new Date('2023-10-10'),
    completedAt: new Date('2023-11-30'),
    amount: 85000,
    client: "GHI Corporation",
    category: "Legal Services"
  }
];

const WorkOrders = () => {
  return (
    <DashboardLayout userType="service_provider">
      <div className="container mx-auto p-6">
        <WorkOrdersModule />
      </div>
    </DashboardLayout>
  );
};

const WorkOrdersModule = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [loading, setLoading] = useState(false);

  const isServiceProvider = user?.userType === UserType.SERVICE_PROVIDER;

  // Action handlers
  const handleViewItem = (id: string, type: 'service-request' | 'work-order') => {
    if (type === 'service-request') {
      navigate(`/service-requests/${id}`);
    } else {
      navigate(`/work-orders/${id}`);
    }
  };

  const handleEditItem = (id: string, type: 'service-request' | 'work-order') => {
    if (type === 'service-request') {
      navigate(`/service-requests/${id}/edit`);
    } else {
      navigate(`/work-orders/${id}/edit`);
    }
  };

  const handleCreateServiceRequest = () => {
    navigate('/service-requests/create');
  };

  const handleCreateWorkOrder = () => {
    navigate('/work-orders/create');
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
        case 'open':
          return 'bg-blue-100 text-blue-800';
        case 'in_progress':
          return 'bg-yellow-100 text-yellow-800';
        case 'completed':
        case 'closed':
          return 'bg-green-100 text-green-800';
        case 'payment_pending':
          return 'bg-orange-100 text-orange-800';
        case 'signature_pending':
          return 'bg-purple-100 text-purple-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <Badge className={getStatusColor(status)}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  // Service Request Card Component
  const ServiceRequestCard = ({ item, type }: { item: ServiceRequest; type: 'open' | 'closed' }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              <StatusBadge status={item.status} />
            </div>
            
            <p className="text-gray-600 mb-3">{item.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-2" />
                Created: {format(item.createdAt, 'dd/MM/yyyy')}
              </div>
              
              {item.completedAt && (
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Completed: {format(item.completedAt, 'dd/MM/yyyy')}
                </div>
              )}
              
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Budget: ₹{item.budget.toLocaleString()}
              </div>
            </div>

            <div className="mt-3 text-sm text-gray-500">
              <span className="font-medium">Provider: </span>
              {item.provider}
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewItem(item.id, 'service-request')}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            {type === 'open' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditItem(item.id, 'service-request')}
              >
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Work Order Card Component
  const WorkOrderCard = ({ item, type }: { item: WorkOrderItem; type: 'open' | 'closed' }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{item.woNumber}</h3>
              <StatusBadge status={item.status} />
            </div>
            
            <p className="text-gray-600 mb-3">{item.title}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-2" />
                Created: {format(item.createdAt, 'dd/MM/yyyy')}
              </div>
              
              {item.completedAt && (
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Completed: {format(item.completedAt, 'dd/MM/yyyy')}
                </div>
              )}
              
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Amount: ₹{item.amount.toLocaleString()}
              </div>
            </div>

            <div className="mt-3 text-sm text-gray-500">
              <span className="font-medium">Client: </span>
              {item.client}
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewItem(item.id, 'work-order')}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            {type === 'open' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditItem(item.id, 'work-order')}
              >
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Stats cards component
  const StatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ClipboardList className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Open Service Requests</p>
              <p className="text-2xl font-bold text-gray-900">{mockOpenServiceRequests.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Briefcase className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Open Work Orders</p>
              <p className="text-2xl font-bold text-gray-900">{mockOpenWorkOrders.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Closed Work Orders</p>
              <p className="text-2xl font-bold text-gray-900">{mockClosedWorkOrders.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Closed Service Requests</p>
              <p className="text-2xl font-bold text-gray-900">{mockClosedServiceRequests.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Work Orders</h1>
          <p className="text-gray-600">
            Manage and track your work orders and service requests
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button onClick={handleCreateServiceRequest}>
            <Plus className="h-4 w-4 mr-2" />
            Create Service Request
          </Button>
          <Button onClick={handleCreateWorkOrder}>
            <Plus className="h-4 w-4 mr-2" />
            Create Work Order
          </Button>
        </div>
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
                  placeholder="Search by title, number, or reference..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Accordion Layout */}
      <Accordion type="multiple" className="space-y-4">
        {/* Open Service Request(s) */}
        <AccordionItem value="open-service-requests" className="border rounded-lg">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ClipboardList className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold">Open Service Request(s)</h3>
                <p className="text-sm text-gray-500">{mockOpenServiceRequests.length} active requests</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-4">
              {mockOpenServiceRequests.length === 0 ? (
                <div className="text-center py-8">
                  <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Open Service Requests</h3>
                  <p className="text-gray-500 mb-4">You don't have any open service requests at the moment.</p>
                  <Button onClick={handleCreateServiceRequest}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Service Request
                  </Button>
                </div>
              ) : (
                mockOpenServiceRequests.map((item) => (
                  <ServiceRequestCard key={item.id} item={item} type="open" />
                ))
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Open Work Order(s) */}
        <AccordionItem value="open-work-orders" className="border rounded-lg">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Briefcase className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold">Open Work Order(s)</h3>
                <p className="text-sm text-gray-500">{mockOpenWorkOrders.length} active work orders</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-4">
              {mockOpenWorkOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Open Work Orders</h3>
                  <p className="text-gray-500 mb-4">You don't have any open work orders at the moment.</p>
                  <Button onClick={handleCreateWorkOrder}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Work Order
                  </Button>
                </div>
              ) : (
                mockOpenWorkOrders.map((item) => (
                  <WorkOrderCard key={item.id} item={item} type="open" />
                ))
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Closed Work Order(s) */}
        <AccordionItem value="closed-work-orders" className="border rounded-lg">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold">Closed Work Order(s)</h3>
                <p className="text-sm text-gray-500">{mockClosedWorkOrders.length} completed work orders</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-4">
              {mockClosedWorkOrders.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Closed Work Orders</h3>
                  <p className="text-gray-500">No completed work orders found.</p>
                </div>
              ) : (
                mockClosedWorkOrders.map((item) => (
                  <WorkOrderCard key={item.id} item={item} type="closed" />
                ))
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Closed Service Requests */}
        <AccordionItem value="closed-service-requests" className="border rounded-lg">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold">Closed Service Requests</h3>
                <p className="text-sm text-gray-500">{mockClosedServiceRequests.length} completed requests</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-4">
              {mockClosedServiceRequests.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Closed Service Requests</h3>
                  <p className="text-gray-500">No completed service requests found.</p>
                </div>
              ) : (
                mockClosedServiceRequests.map((item) => (
                  <ServiceRequestCard key={item.id} item={item} type="closed" />
                ))
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default WorkOrders;
