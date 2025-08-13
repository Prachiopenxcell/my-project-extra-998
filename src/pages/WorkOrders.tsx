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
  CalendarDays,
  DollarSign,
  Briefcase,
  CheckCircle,
  ClipboardList,
  Eye,
  Edit,
  Plus,
  Search
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { UserType } from "@/types/auth";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

// Mock data interfaces matching screenshot structure
interface ServiceRequest {
  id: string;
  raiseDate: Date;
  srn: string;
  status: string;
}

interface WorkOrderItem {
  id: string;
  woDate: Date;
  woNo: string;
  referenceNo: string;
  status: string;
}

interface ClosedWorkOrder {
  id: string;
  woDate: Date;
  woNo: string;
  invoiceDate: Date;
  invoiceNo: string;
  status: string;
  ratingFeedback: string;
}

interface ClosedServiceRequest {
  id: string;
  raiseDate: Date;
  srn: string;
  status: string;
}

// Status options for each section based on screenshots
const openServiceRequestStatuses = [
  "Clarifications Received"
];

const openWorkOrderStatuses = [
  "Next Payment Due",
  "Professional Working On the WO",
  "Information Sought by Professional",
  "Information Pending"
];

const closedWorkOrderStatuses = [
  "Due Payment Not Made",
  "Professional Not Available",
  "Work Assigned to Another Professional",
  "Client Withdrew",
  "Work Order Completed"
];

const closedServiceRequestStatuses = [
  "No Bid Received",
  "No Bidder Accepted",
  "Payment Not Made",
  "Work Order Issued"
];

// Mock data for demonstration matching screenshot structure
const mockOpenServiceRequests: ServiceRequest[] = [
  {
    id: "SR001",
    raiseDate: new Date(2024, 0, 15),
    srn: "A-00112233",
    status: "Clarifications Received"
  },
  {
    id: "SR002",
    raiseDate: new Date(2024, 0, 20),
    srn: "A-00112234",
    status: "Under Review"
  },
  {
    id: "SR003",
    raiseDate: new Date(2024, 0, 25),
    srn: "A-00112235",
    status: "Information Pending"
  },
  {
    id: "SR004",
    raiseDate: new Date(2024, 1, 1),
    srn: "A-00112236",
    status: "Information Sought by Professional"
  }
];

const mockOpenWorkOrders: WorkOrderItem[] = [
  {
    id: "WO001",
    woDate: new Date(2024, 1, 1),
    woNo: "WO/A-00111234",
    referenceNo: "Intellectual Property Registration",
    status: "Next Payment Due"
  },
  {
    id: "WO002",
    woDate: new Date(2024, 1, 5),
    woNo: "WO/A-00111235",
    referenceNo: "Legal Documentation Services",
    status: "In Progress"
  },
  {
    id: "WO003",
    woDate: new Date(2024, 1, 10),
    woNo: "WO/A-00111236",
    referenceNo: "Contract Review Services",
    status: "Awaiting Client Response"
  },
  {
    id: "WO004",
    woDate: new Date(2024, 1, 15),
    woNo: "WO/A-00111237",
    referenceNo: "Compliance Audit Services",
    status: "Information Sought by Professional"
  }
];

const mockClosedWorkOrders: ClosedWorkOrder[] = [
  {
    id: "1",
    woNo: "WO/A-00111123",
    woDate: new Date("2023-10-12"),
    invoiceDate: new Date("2024-01-25"),
    invoiceNo: "Inv24-25/A-00167789",
    status: "Due Payment Not Made",
    ratingFeedback: "Pending/ Provided"
  },
  {
    id: "2",
    woNo: "WO/A-00111124",
    woDate: new Date("2023-11-05"),
    invoiceDate: new Date("2024-02-10"),
    invoiceNo: "Inv24-25/A-00167790",
    status: "Completed",
    ratingFeedback: "Excellent Service - 5 Stars"
  },
  {
    id: "3", 
    woNo: "WO/A-00111125",
    woDate: new Date("2023-11-20"),
    invoiceDate: new Date("2024-02-15"),
    invoiceNo: "Inv24-25/A-00167791",
    status: "Payment Completed",
    ratingFeedback: "Good Service - 4 Stars"
  },
  {
    id: "4",
    woNo: "WO/A-00111126",
    woDate: new Date("2023-12-01"),
    invoiceDate: new Date("2024-02-20"),
    invoiceNo: "Inv24-25/A-00167792", 
    status: "Due Payment Not Made",
    ratingFeedback: "Pending/ Provided"
  }
];

const mockClosedServiceRequests: ClosedServiceRequest[] = [
  {
    id: "1",
    srn: "A-00112211",
    raiseDate: new Date("2023-11-15"),
    status: "No Bid Received"
  },
  {
    id: "2",
    srn: "A-00112212", 
    raiseDate: new Date("2023-11-20"),
    status: "Completed"
  },
  {
    id: "3",
    srn: "A-00112213",
    raiseDate: new Date("2023-12-01"),
    status: "Cancelled by User"
  },
  {
    id: "4",
    srn: "A-00112214",
    raiseDate: new Date("2023-12-10"),
    status: "Expired"
  }
];

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
    // Role-based navigation for work order creation
    if (isServiceProvider) {
      // Service Providers use their own create route
      navigate('/work-orders/create-provider');
    } else {
      // Service Seekers use the standard create route
      navigate('/work-orders/create');
    }
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
  const ServiceRequestCard = ({ item, type }: { item: ServiceRequest | ClosedServiceRequest; type: 'open' | 'closed' }) => {
    const navigate = useNavigate();

    const handleView = () => {
      navigate(`/service-requests/${item.id}`);
    };

    const handleViewBids = () => {
      navigate(`/service-requests/${item.id}?tab=bids`);
    };

    return (
      <Card className="p-6 border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <button
                onClick={handleView}
                className="text-lg font-semibold text-blue-600 hover:text-blue-800 underline"
              >
                {item.srn}
              </button>
              <Badge 
                variant={item.status === 'Under Review' ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {item.status}
              </Badge>
            </div>
            
            <h3 className="font-medium text-gray-900 mb-3">
              {type === 'open' ? 'Service Request - Legal Consultation' : 'Completed Service Request'}
            </h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <CalendarDays className="h-4 w-4" />
                <span>Created: {format(new Date(item.raiseDate), 'dd/MM/yyyy')}</span>
              </div>
              
              {type === 'closed' && (
                <div className="flex items-center space-x-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>Completed: {format(new Date(item.raiseDate), 'dd/MM/yyyy')}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Budget: ₹50,000</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>{type === 'open' ? 'Bids: 3 received' : 'Provider: Legal Associates'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2 ml-4">
            <Button variant="outline" size="sm" onClick={handleView}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            {user?.userType === UserType.SERVICE_SEEKER && type === 'open' && (
              <Button variant="outline" size="sm" onClick={handleViewBids}>
                <FileText className="h-4 w-4 mr-1" />
                View Bids
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  };

  // Work Order Card Component
  const WorkOrderCard = ({ item, type }: { item: WorkOrderItem | ClosedWorkOrder; type: 'open' | 'closed' }) => {
    const navigate = useNavigate();

    const handleView = () => {
      navigate(`/work-orders/${item.id}`);
    };

    return (
      <Card className="p-6 border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <button
                onClick={handleView}
                className="text-lg font-semibold text-blue-600 hover:text-blue-800 underline"
              >
                {item.woNo}
              </button>
              <Badge 
                variant={item.status === 'Payment Pending' ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {item.status}
              </Badge>
            </div>
            
            <h3 className="font-medium text-gray-900 mb-3">
              {type === 'open' && 'referenceNo' in item ? item.referenceNo : 'Intellectual Property Registration'}
            </h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <CalendarDays className="h-4 w-4" />
                <span>Created: {format(new Date(item.woDate), 'dd/MM/yyyy')}</span>
              </div>
              
              {type === 'closed' && 'invoiceDate' in item && (
                <div className="flex items-center space-x-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>Due: {format(new Date(item.invoiceDate), 'dd/MM/yyyy')}</span>
                </div>
              )}
              
              {type === 'closed' && 'invoiceNo' in item && (
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Amount: ₹197,760</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Provider: IP Law Consultants</span>
              </div>
            </div>
            
            {type === 'closed' && 'ratingFeedback' in item && (
              <div className="mt-3 text-sm text-gray-600">
                <span className="font-medium">Feedback:</span> {item.ratingFeedback}
              </div>
            )}
          </div>
          
          <div className="flex space-x-2 ml-4">
            <Button variant="outline" size="sm" onClick={handleView}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Work Orders</h1>
          <p className="text-gray-600 mt-1">
            Manage your service requests and work orders
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button onClick={handleCreateServiceRequest} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Service Request
          </Button>
          <Button onClick={handleCreateWorkOrder} variant="outline" className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Work Order
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
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
              <div className="p-2 bg-green-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-green-600" />
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
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-purple-600" />
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
              <div className="p-2 bg-orange-100 rounded-lg">
                <ClipboardList className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Closed Service Requests</p>
                <p className="text-2xl font-bold text-gray-900">{mockClosedServiceRequests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by title, number, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="amount_high">Amount: High to Low</SelectItem>
                <SelectItem value="amount_low">Amount: Low to High</SelectItem>
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
              <FileText className="h-5 w-5 text-blue-600" />
              <span className="text-lg font-semibold">Open Service Request(s)</span>
              <Badge variant="secondary">{mockOpenServiceRequests.length}</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            {mockOpenServiceRequests.length > 0 ? (
              <div className="space-y-4">
                {mockOpenServiceRequests.map((item) => (
                  <ServiceRequestCard key={item.id} item={item} type="open" />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No open service requests found</p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Open Work Order(s) */}
        <AccordionItem value="open-work-orders" className="border rounded-lg">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center space-x-3">
              <Briefcase className="h-5 w-5 text-green-600" />
              <span className="text-lg font-semibold">Open Work Order(s)</span>
              <Badge variant="secondary">{mockOpenWorkOrders.length}</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            {mockOpenWorkOrders.length > 0 ? (
              <div className="space-y-4">
                {mockOpenWorkOrders.map((item) => (
                  <WorkOrderCard key={item.id} item={item} type="open" />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No open work orders found</p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Closed Work Order(s) */}
        <AccordionItem value="closed-work-orders" className="border rounded-lg">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <span className="text-lg font-semibold">Closed Work Order(s)</span>
              <Badge variant="secondary">{mockClosedWorkOrders.length}</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            {mockClosedWorkOrders.length > 0 ? (
              <div className="space-y-4">
                {mockClosedWorkOrders.map((item) => (
                  <WorkOrderCard key={item.id} item={item} type="closed" />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No closed work orders found</p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Closed Service Requests */}
        <AccordionItem value="closed-service-requests" className="border rounded-lg">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center space-x-3">
              <ClipboardList className="h-5 w-5 text-orange-600" />
              <span className="text-lg font-semibold">Closed Service Requests</span>
              <Badge variant="secondary">{mockClosedServiceRequests.length}</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            {mockClosedServiceRequests.length > 0 ? (
              <div className="space-y-4">
                {mockClosedServiceRequests.map((item) => (
                  <ServiceRequestCard key={item.id} item={item} type="closed" />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ClipboardList className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No closed service requests found</p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

const WorkOrders = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-8">
        <WorkOrdersModule />
      </div>
    </DashboardLayout>
  );
};

export default WorkOrders;
