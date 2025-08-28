import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  FileText, 
  Users, 
  CalendarDays,
  DollarSign,
  Briefcase,
  CheckCircle,
  ClipboardList,
  Eye,
  Edit,
  Plus,
  Search,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  FileDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { UserType } from "@/types/auth";
import { getUserTypeFromRole } from "@/utils/userTypeUtils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";

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
  // New fields to support spec 1.2.3.1.1.2.x and 1.2.3.1.1.3-4
  isProforma?: boolean; // if true, show temporary number with @TEMP prefix
  author: 'seeker' | 'provider'; // Created by Service Seeker / Created by Service Provider
  clientReferenceNo?: string; // client-provided reference no (optional)
  // In-Progress specific details
  expectedCompletionDate?: Date;
  nextPaymentDueDate?: Date;
  progressTag?: 'In progress' | 'On hold' | 'Disputed';
  status: string;
}

interface ClosedWorkOrder {
  id: string;
  woDate: Date;
  woNo: string;
  referenceNo: string;
  clientReferenceNo?: string;
  author?: 'seeker' | 'provider';
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

// NEW Work Orders created by Service Provider (Proforma)
const mockNewWorkOrders: WorkOrderItem[] = [
  {
    id: "wo-new-001",
    woDate: new Date(2024, 7, 25),
    woNo: "@TEMP-WO2024003",
    referenceNo: "Digital Marketing Strategy 2024",
    isProforma: true,
    author: 'provider',
    clientReferenceNo: 'DMS-2024-Q3',
    status: "Awaiting Client Signature"
  },
  {
    id: "wo-new-002", 
    woDate: new Date(2024, 7, 24),
    woNo: "@TEMP-WO2024004",
    referenceNo: "IT Infrastructure Audit",
    clientReferenceNo: 'DMS-2024-Q3',
    isProforma: true,
    author: 'provider',
    status: "Awaiting Payment"
  }
];

const mockOpenWorkOrders: WorkOrderItem[] = [
  // Matches workOrderService mock: wo-001 (IN_PROGRESS), WO number WO2024001, title "Annual Financial Audit 2024"
  {
    id: "wo-001",
    woDate: new Date(2024, 0, 15),
    woNo: "WO2024001",
    referenceNo: "Annual Financial Audit 2024",
    isProforma: false, // paid → permanent number
    author: 'provider',
    clientReferenceNo: 'CLIENT-REF-2024-01',
    expectedCompletionDate: new Date(2024, 2, 15),
    nextPaymentDueDate: new Date(2024, 1, 28),
    progressTag: 'In progress',
    status: "In Progress"
  },
  // Matches workOrderService mock: wo-002 (DISPUTED), WO number WO2024002, title "Contract Review and Legal Advisory"
  {
    id: "wo-002",
    woDate: new Date(2024, 1, 1),
    woNo: "WO2024002",
    referenceNo: "Contract Review and Legal Advisory",
    isProforma: false,
    author: 'provider',
    clientReferenceNo: 'DMS-2024-Q3',
    expectedCompletionDate: new Date(2024, 3, 1),
    progressTag: 'On hold',
    status: "Information Sought by Professional"
  },
  // Matches workOrderService mock: wo-003 (PAYMENT_PENDING), WO number WO2024003, title "Intellectual Property Registration"
  {
    id: "wo-003",
    woDate: new Date(2024, 2, 1),
    woNo: "WO2024003",
    referenceNo: "Intellectual Property Registration",
    isProforma: false, // initial payment already made, next payment due → permanent number
    author: 'provider',
    clientReferenceNo: 'DMS-2024-Q3',
    expectedCompletionDate: new Date(2024, 4, 5),
    nextPaymentDueDate: new Date(2024, 2, 20),
    progressTag: 'In progress',
    status: "Next Payment Due"
  },
  // New work order entry
  {
    id: "wo-004",
    woDate: new Date(2024, 3, 10),
    woNo: "WO2024004",
    referenceNo: "Compliance Advisory Setup",
    isProforma: true, // unpaid → temporary number with @
    author: 'seeker',
    clientReferenceNo: 'REF-COMP-APR',
    expectedCompletionDate: new Date(2024, 5, 30),
    progressTag: 'In progress',
    status: "New"
  }
];

// Note: We display both "New" and "In Progress" items together under Open Work Orders.

const mockClosedWorkOrders: ClosedWorkOrder[] = [
  {
    id: "1",
    woNo: "WO/A-00111123",
    woDate: new Date("2023-10-12"),
    referenceNo: "Final Tax Filing FY23",
    clientReferenceNo: 'DMS-2024-Q3',
    author: 'provider',
    invoiceDate: new Date("2024-01-25"),
    invoiceNo: "Inv24-25/A-00167789",
    status: "Due Payment Not Made",
    ratingFeedback: "Pending/ Provided"
  },
  {
    id: "2",
    woNo: "WO/A-00111124",
    woDate: new Date("2023-11-05"),
    referenceNo: "ROC Annual Filing 2023",
    clientReferenceNo: 'DMS-2024-Q3',
    author: 'provider',
    invoiceDate: new Date("2024-02-10"),
    invoiceNo: "Inv24-25/A-00167790",
    status: "Completed",
    ratingFeedback: "Excellent Service - 5 Stars"
  },
  {
    id: "3", 
    woNo: "WO/A-00111125",
    woDate: new Date("2023-11-20"),
    referenceNo: "GST Advisory Q4",
    clientReferenceNo: 'DMS-2024-Q3',
    author: 'provider',
    invoiceDate: new Date("2024-02-15"),
    invoiceNo: "Inv24-25/A-00167791",
    status: "Payment Completed",
    ratingFeedback: "Good Service - 4 Stars"
  },
  {
    id: "4",
    woNo: "WO/A-00111126",
    woDate: new Date("2023-12-01"),
    referenceNo: "Compliance Advisory Setup",
    clientReferenceNo: 'DMS-2024-Q3',
    author: 'provider',
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
  const userType = getUserTypeFromRole(user?.role);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [loading, setLoading] = useState(false);

  // Advanced filters
  const [filterWONumber, setFilterWONumber] = useState("");
  const [filterReference, setFilterReference] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterFromDate, setFilterFromDate] = useState<string>("");
  const [filterToDate, setFilterToDate] = useState<string>("");

  // Pagination per accordion
  const [openPage, setOpenPage] = useState(1);
  const [openPageSize, setOpenPageSize] = useState(5);
  // In-progress pagination removed; merged into Open section
  const [closedPage, setClosedPage] = useState(1);
  const [closedPageSize, setClosedPageSize] = useState(5);

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

  // Derive status options dynamically from open work orders
  const statusOptions = Array.from(new Set(mockOpenWorkOrders.map(w => w.status)));

  // For service seekers, show proforma work orders from providers as pending work orders
  // For service providers, show their created NEW work orders
  const allOpenWorkOrders = userType === 'service_provider' 
    ? [...mockNewWorkOrders, ...mockOpenWorkOrders]
    : [...mockNewWorkOrders.map(wo => ({
        ...wo,
        // Convert provider-created proforma to seeker-pending status
        status: wo.status === "Awaiting Client Signature" ? "Signature Pending" : 
                wo.status === "Awaiting Payment" ? "Payment Pending" : wo.status
      })), ...mockOpenWorkOrders];

  // Apply filters to open work orders
  const filteredOpenWorkOrders = allOpenWorkOrders.filter((wo) => {
    const matchNo = filterWONumber ? wo.woNo.toLowerCase().includes(filterWONumber.toLowerCase()) : true;
    const matchRef = filterReference ? wo.referenceNo.toLowerCase().includes(filterReference.toLowerCase()) : true;
    const matchStatus = filterStatus ? wo.status === filterStatus : true;
    const fromOk = filterFromDate ? wo.woDate >= new Date(filterFromDate) : true;
    const toOk = filterToDate ? wo.woDate <= new Date(filterToDate) : true;
    return matchNo && matchRef && matchStatus && fromOk && toOk;
  });

  // In-progress section removed; these items appear in Open Work Orders

  // Optional: apply filters to closed as well where applicable (woNo, status, date range on invoiceDate)
  const filteredClosedWorkOrders = mockClosedWorkOrders.filter((wo) => {
    const matchNo = filterWONumber ? wo.woNo.toLowerCase().includes(filterWONumber.toLowerCase()) : true;
    const matchStatus = filterStatus ? wo.status === filterStatus : true;
    const fromOk = filterFromDate ? wo.woDate >= new Date(filterFromDate) : true;
    const toOk = filterToDate ? wo.woDate <= new Date(filterToDate) : true;
    return matchNo && matchStatus && fromOk && toOk;
  });

  // Pagination helpers
  const paginate = <T,>(arr: T[], page: number, size: number) => {
    const start = (page - 1) * size;
    return arr.slice(start, start + size);
  };

  const openTotal = filteredOpenWorkOrders.length;
  const openTotalPages = Math.max(1, Math.ceil(openTotal / openPageSize));
  const openPageData = paginate(filteredOpenWorkOrders, Math.min(openPage, openTotalPages), openPageSize);

  // In-progress pagination removed

  const closedTotal = filteredClosedWorkOrders.length;
  const closedTotalPages = Math.max(1, Math.ceil(closedTotal / closedPageSize));
  const closedPageData = paginate(filteredClosedWorkOrders, Math.min(closedPage, closedTotalPages), closedPageSize);

  const resetFilters = () => {
    setFilterWONumber("");
    setFilterReference("");
    setFilterStatus("");
    setFilterFromDate("");
    setFilterToDate("");
    setOpenPage(1);
    setClosedPage(1);
  };

  // Export filtered data to CSV (Excel-friendly)
  const exportToCSV = () => {
    // Build unified rows with a consistent header
    type Row = { Section: string; WODate: string; WONumber: string; ReferenceOrInvoice: string; Status: string };
    const rows: Row[] = [];

    filteredOpenWorkOrders.forEach(wo => {
      rows.push({
        Section: 'Open',
        WODate: format(wo.woDate, 'yyyy-MM-dd'),
        WONumber: wo.woNo,
        ReferenceOrInvoice: wo.referenceNo,
        Status: wo.status,
      });
    });

    // In Progress rows merged into Open; no separate section

    filteredClosedWorkOrders.forEach(wo => {
      rows.push({
        Section: 'Closed',
        WODate: format(wo.woDate, 'yyyy-MM-dd'),
        WONumber: wo.woNo,
        ReferenceOrInvoice: wo.invoiceNo,
        Status: wo.status,
      });
    });

    const header = ['Section','WO Date','WO Number','Reference/Invoice','Status'];
    const escape = (val: string) => `"${(val ?? '').replace(/"/g, '""')}"`;
    const csv = [header.join(',')]
      .concat(rows.map(r => [r.Section, r.WODate, r.WONumber, r.ReferenceOrInvoice, r.Status].map(escape).join(',')))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const ts = format(new Date(), 'yyyyMMdd_HHmm');
    a.download = `work_orders_${ts}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
            {'isProforma' in item && item.isProforma && userType === 'service_provider' && (
              <>
                <Button variant="outline" size="sm" onClick={() => {
                  toast({ title: "Edit WO", description: "Opening work order for editing..." });
                  navigate(`/work-orders/${item.id}?edit=true`);
                }}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="default" size="sm" onClick={() => {
                  toast({ title: "Share Proforma", description: "Sharing proforma work order with client..." });
                }}>
                  <FileText className="h-4 w-4 mr-1" />
                  Share Proforma
                </Button>
              </>
            )}
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
  const WorkOrderCard = ({ item, type }: { item: WorkOrderItem | ClosedWorkOrder; type: 'open' | 'closed' | 'new' }) => {
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
              {(type === 'open' || type === 'new') && 'isProforma' in item && (
                <Badge variant={item.isProforma ? 'destructive' : 'secondary'} className="text-xs">
                  {item.isProforma ? 'Proforma' : 'Paid'}
                </Badge>
              )}
            </div>

            <h3 className="font-medium text-gray-900 mb-3">
              {(type === 'open' || type === 'new') && 'referenceNo' in item
                ? item.referenceNo
                : type === 'closed' && 'referenceNo' in item
                ? (item as ClosedWorkOrder).referenceNo
                : 'Intellectual Property Registration'}
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <CalendarDays className="h-4 w-4" />
                <span>Created: {format(new Date(item.woDate), 'dd/MM/yyyy')}</span>
              </div>

              {'expectedCompletionDate' in item && item.expectedCompletionDate && (
                <div className="flex items-center space-x-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>Expected Date of Completion: {format(new Date(item.expectedCompletionDate), 'dd/MM/yyyy')}</span>
                </div>
              )}

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

              {type === 'closed' && 'referenceNo' in item && (
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Reference: {(item as ClosedWorkOrder).referenceNo}</span>
                </div>
              )}

              {'nextPaymentDueDate' in item && item.nextPaymentDueDate && (
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Next Payment Due: {format(new Date(item.nextPaymentDueDate), 'dd/MM/yyyy')}</span>
                </div>
              )}

              {'author' in item && (
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>
                    Author: {item.author === 'seeker' ? 'Created by Service Seeker' : 'Created by Service Provider'}
                  </span>
                </div>
              )}

              {'clientReferenceNo' in item && item.clientReferenceNo && (
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Reference No: {item.clientReferenceNo}</span>
                </div>
              )}

              {'progressTag' in item && item.progressTag && (
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">{item.progressTag}</Badge>
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
          {!isServiceProvider && (
            <Button onClick={handleCreateServiceRequest} className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              New Service Request
            </Button>
          )}
          {isServiceProvider && (
          <Button onClick={handleCreateWorkOrder} variant="outline" className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Work Order
          </Button>
          )}
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
                <p className="text-2xl font-bold text-gray-900">{filteredOpenWorkOrders.length}</p>
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
                <p className="text-2xl font-bold text-gray-900">{filteredClosedWorkOrders.length}</p>
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
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-50 rounded-md border">
                <SlidersHorizontal className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Advanced Filters</p>
                <h3 className="text-base font-semibold text-gray-900">Refine Work Orders</h3>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="default" size="sm" onClick={exportToCSV}>
                <FileDown className="h-4 w-4 mr-1" />
                Download Excel
              </Button>
              <Button variant="outline" size="sm" onClick={resetFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="col-span-1">
              <Label className="text-xs text-gray-500">WO Number</Label>
              <Input placeholder="e.g. WO2024001" value={filterWONumber} onChange={(e) => { setFilterWONumber(e.target.value); setOpenPage(1); setClosedPage(1); }} />
            </div>
            <div className="col-span-1">
              <Label className="text-xs text-gray-500">Reference No</Label>
              <Input placeholder="e.g. Annual Financial Audit" value={filterReference} onChange={(e) => { setFilterReference(e.target.value); setOpenPage(1); setClosedPage(1); }} />
            </div>
            <div className="col-span-1">
              <Label className="text-xs text-gray-500">Status</Label>
              <Select value={filterStatus || 'all'} onValueChange={(v) => { const next = v === 'all' ? '' : v; setFilterStatus(next); setOpenPage(1); setClosedPage(1); }}>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-1">
              <Label className="text-xs text-gray-500">Date From</Label>
              <Input type="date" value={filterFromDate} onChange={(e) => { setFilterFromDate(e.target.value); setOpenPage(1); setClosedPage(1); }} />
            </div>
            <div className="col-span-1">
              <Label className="text-xs text-gray-500">Date To</Label>
              <Input type="date" value={filterToDate} onChange={(e) => { setFilterToDate(e.target.value); setOpenPage(1); setClosedPage(1); }} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accordion Layout */}
      <Accordion type="multiple" className="space-y-4">

        {/* Open Work Order(s) */}
        <AccordionItem value="open-work-orders" className="border rounded-lg">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center space-x-3">
              <Briefcase className="h-5 w-5 text-green-600" />
              <span className="text-lg font-semibold">Open Work Order(s)</span>
              <Badge variant="secondary">{filteredOpenWorkOrders.length}</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            {filteredOpenWorkOrders.length > 0 ? (
              <div className="space-y-4">
                {openPageData.map((item) => (
                  <WorkOrderCard 
                    key={item.id} 
                    item={item} 
                    type={'isProforma' in item && item.isProforma ? 'new' : 'open'} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No open work orders found</p>
              </div>
            )}
            {/* Pagination controls */}
            {filteredOpenWorkOrders.length > 0 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                  Showing {(Math.min((openPage - 1) * openPageSize + 1, openTotal)).toString()}-
                  {Math.min(openPage * openPageSize, openTotal)} of {openTotal}
                </div>
                <div className="flex items-center space-x-3">
                  <Select value={String(openPageSize)} onValueChange={(v) => { setOpenPageSize(Number(v)); setOpenPage(1); }}>
                    <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center space-x-1">
                    <Button variant="outline" size="icon" disabled={openPage <= 1} onClick={() => setOpenPage(p => Math.max(1, p - 1))}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-700">{openPage} / {openTotalPages}</span>
                    <Button variant="outline" size="icon" disabled={openPage >= openTotalPages} onClick={() => setOpenPage(p => Math.min(openTotalPages, p + 1))}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* In Progress Work Order(s) removed — included within Open Work Orders */}

        {/* Closed Work Order(s) */}
        <AccordionItem value="closed-work-orders" className="border rounded-lg">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <span className="text-lg font-semibold">Closed Work Order(s)</span>
              <Badge variant="secondary">{filteredClosedWorkOrders.length}</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            {filteredClosedWorkOrders.length > 0 ? (
              <div className="space-y-4">
                {closedPageData.map((item) => (
                  <WorkOrderCard key={item.id} item={item} type="closed" />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No closed work orders found</p>
              </div>
            )}
            {/* Pagination controls */}
            {filteredClosedWorkOrders.length > 0 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                  Showing {(Math.min((closedPage - 1) * closedPageSize + 1, closedTotal)).toString()}-
                  {Math.min(closedPage * closedPageSize, closedTotal)} of {closedTotal}
                </div>
                <div className="flex items-center space-x-3">
                  <Select value={String(closedPageSize)} onValueChange={(v) => { setClosedPageSize(Number(v)); setClosedPage(1); }}>
                    <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center space-x-1">
                    <Button variant="outline" size="icon" disabled={closedPage <= 1} onClick={() => setClosedPage(p => Math.max(1, p - 1))}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-700">{closedPage} / {closedTotalPages}</span>
                    <Button variant="outline" size="icon" disabled={closedPage >= closedTotalPages} onClick={() => setClosedPage(p => Math.min(closedTotalPages, p + 1))}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Closed Service Requests */}
        {/* <AccordionItem value="closed-service-requests" className="border rounded-lg">
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
        </AccordionItem> */}
      </Accordion>
    </div>
  );
};

const WorkOrders = () => {
  const { user } = useAuth();
  const layoutUserType = getUserTypeFromRole(user?.role);

  return (
    <DashboardLayout userType={layoutUserType}>
      <div className="container mx-auto px-6 py-8">
        <WorkOrdersModule />
      </div>
    </DashboardLayout>
  );
};

export default WorkOrders;
