import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { 
  CreditCard, 
  Download, 
  Search, 
  Filter, 
  Calendar,
  Receipt,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Mail,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";

interface BillingStats {
  totalSpent: number;
  thisMonth: number;
  lastMonth: number;
  avgMonthly: number;
  nextPayment: {
    amount: number;
    date: string;
    description: string;
  };
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue' | 'failed';
  description: string;
  items: InvoiceItem[];
  paymentMethod?: string;
  downloadUrl?: string;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  period?: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'paypal';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  email?: string;
}

const SubscriptionBilling = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Determine user type for proper role context
  const isServiceSeeker = user?.role && [
    UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER,
    UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
    UserRole.SERVICE_SEEKER_TEAM_MEMBER
  ].includes(user.role);

  const isServiceProvider = user?.role && [
    UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER,
    UserRole.SERVICE_PROVIDER_ENTITY_ADMIN,
    UserRole.SERVICE_PROVIDER_TEAM_MEMBER
  ].includes(user.role);

  const userType = isServiceSeeker ? "service_seeker" : isServiceProvider ? "service_provider" : "admin";
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [stats, setStats] = useState<BillingStats>({
    totalSpent: 3247.85,
    thisMonth: 449.97,
    lastMonth: 399.97,
    avgMonthly: 425.50,
    nextPayment: {
      amount: 449.97,
      date: "2024-02-15",
      description: "Professional Plan + 3 Add-ons"
    }
  });

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "inv-001",
      invoiceNumber: "INV-2024-001",
      date: "2024-01-15",
      dueDate: "2024-01-30",
      amount: 449.97,
      currency: "USD",
      status: "paid",
      description: "Monthly subscription - January 2024",
      paymentMethod: "•••• 4242",
      items: [
        {
          id: "item-1",
          description: "Professional Plan",
          quantity: 1,
          unitPrice: 299.99,
          total: 299.99,
          period: "Jan 15 - Feb 15, 2024"
        },
        {
          id: "item-2",
          description: "Compliance Plus Add-on",
          quantity: 1,
          unitPrice: 79.99,
          total: 79.99,
          period: "Jan 15 - Feb 15, 2024"
        },
        {
          id: "item-3",
          description: "AI Assistant Add-on",
          quantity: 1,
          unitPrice: 29.99,
          total: 29.99,
          period: "Jan 15 - Feb 15, 2024"
        },
        {
          id: "item-4",
          description: "Storage Extension (50 GB)",
          quantity: 1,
          unitPrice: 39.99,
          total: 39.99,
          period: "Jan 15 - Feb 15, 2024"
        }
      ]
    },
    {
      id: "inv-002",
      invoiceNumber: "INV-2023-012",
      date: "2023-12-15",
      dueDate: "2023-12-30",
      amount: 399.97,
      currency: "USD",
      status: "paid",
      description: "Monthly subscription - December 2023",
      paymentMethod: "•••• 4242",
      items: [
        {
          id: "item-5",
          description: "Professional Plan",
          quantity: 1,
          unitPrice: 299.99,
          total: 299.99,
          period: "Dec 15, 2023 - Jan 15, 2024"
        },
        {
          id: "item-6",
          description: "Compliance Plus Add-on",
          quantity: 1,
          unitPrice: 79.99,
          total: 79.99,
          period: "Dec 15, 2023 - Jan 15, 2024"
        },
        {
          id: "item-7",
          description: "Additional Team Seats (5)",
          quantity: 1,
          unitPrice: 19.99,
          total: 19.99,
          period: "Dec 15, 2023 - Jan 15, 2024"
        }
      ]
    },
    {
      id: "inv-003",
      invoiceNumber: "INV-2023-011",
      date: "2023-11-15",
      dueDate: "2023-11-30",
      amount: 329.98,
      currency: "USD",
      status: "paid",
      description: "Monthly subscription - November 2023",
      paymentMethod: "•••• 4242",
      items: [
        {
          id: "item-8",
          description: "Professional Plan",
          quantity: 1,
          unitPrice: 299.99,
          total: 299.99,
          period: "Nov 15 - Dec 15, 2023"
        },
        {
          id: "item-9",
          description: "AI Assistant Add-on",
          quantity: 1,
          unitPrice: 29.99,
          total: 29.99,
          period: "Nov 15 - Dec 15, 2023"
        }
      ]
    },
    {
      id: "inv-004",
      invoiceNumber: "INV-2024-002",
      date: "2024-01-20",
      dueDate: "2024-02-05",
      amount: 199.99,
      currency: "USD",
      status: "pending",
      description: "One-time purchase - Premium Support Setup",
      items: [
        {
          id: "item-10",
          description: "Premium Support Setup Fee",
          quantity: 1,
          unitPrice: 199.99,
          total: 199.99
        }
      ]
    }
  ]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "pm-001",
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiryMonth: 12,
      expiryYear: 2027,
      isDefault: true
    },
    {
      id: "pm-002",
      type: "paypal",
      email: "user@company.com",
      isDefault: false
    }
  ]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Derivation helpers to align with Transaction History fields
  const deriveModule = (invoice: Invoice): string => {
    const descs = invoice.items.map(i => i.description.toLowerCase());
    if (descs.some(d => d.includes('team seat'))) return 'Team Management';
    if (descs.some(d => d.includes('storage'))) return 'Document Cycle';
    return 'Subscription';
  };

  const deriveStoragePurchasedGB = (invoice: Invoice): number | null => {
    // Look for patterns like "(50 GB)" or "50GB" in item descriptions
    let total = 0;
    invoice.items.forEach(i => {
      const match = i.description.match(/(\d+)\s*GB/i);
      if (match) total += parseInt(match[1], 10);
    });
    return total > 0 ? total : null;
  };

  const deriveTeamMembersAdded = (invoice: Invoice): number | null => {
    let total = 0;
    invoice.items.forEach(i => {
      const match = i.description.match(/Additional Team Seats\s*\((\d+)\)/i);
      if (match) total += parseInt(match[1], 10);
    });
    return total > 0 ? total : null;
  };

  const derivePaidOn = (invoice: Invoice): string | null => {
    if (invoice.status === 'paid') return invoice.date;
    return null;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    
    let matchesDate = true;
    if (dateRange !== "all") {
      const invoiceDate = new Date(invoice.date);
      const now = new Date();
      
      switch (dateRange) {
        case "last-30":
          matchesDate = invoiceDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "last-90":
          matchesDate = invoiceDate >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case "this-year":
          matchesDate = invoiceDate.getFullYear() === now.getFullYear();
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filteredInvoices.length / pageSize);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const monthlyChange = ((stats.thisMonth - stats.lastMonth) / stats.lastMonth) * 100;

  const handleDownloadInvoice = (invoiceId: string) => {
    // Simulate download
    console.log(`Downloading invoice ${invoiceId}`);
  };

  const handleViewInvoice = (invoiceId: string) => {
    navigate(`/subscription/invoice/${invoiceId}`);
  };

  const handleEmailInvoice = (invoiceId: string) => {
    // Simulate email sending
    console.log(`Emailing invoice ${invoiceId}`);
  };

  return (
    <DashboardLayout userType={userType}>
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Billing & Invoices</h1>
            <p className="text-gray-600 mt-1">Manage your billing history and payment methods</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/subscription/payment-methods')}
              className="flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              Payment Methods
            </Button>
            <Button 
              onClick={() => navigate('/subscription')}
              className="flex items-center gap-2"
            >
              <ArrowUpRight className="h-4 w-4" />
              Back to Subscriptions
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSpent)}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.thisMonth)}</p>
                  <div className="flex items-center mt-1">
                    {monthlyChange >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${monthlyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(monthlyChange).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Monthly</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.avgMonthly)}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Next Payment</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.nextPayment.amount)}</p>
                  <p className="text-sm text-gray-600 mt-1">{formatDate(stats.nextPayment.date)}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="last-30">Last 30 Days</SelectItem>
                    <SelectItem value="last-90">Last 90 Days</SelectItem>
                    <SelectItem value="this-year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Invoice History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    
                    <TableHead>Module</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Storage Purchased</TableHead>
                    <TableHead>Team Members Added</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {invoice.invoiceNumber}
                      </TableCell>
                      <TableCell>{formatDate(invoice.date)}</TableCell>
                      
                      <TableCell>{deriveModule(invoice)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{invoice.description}</p>
                          <p className="text-sm text-gray-600">
                            {invoice.items.length} item{invoice.items.length > 1 ? 's' : ''}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const gb = deriveStoragePurchasedGB(invoice);
                          return gb ? `${gb} GB` : '—';
                        })()}
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const seats = deriveTeamMembersAdded(invoice);
                          return typeof seats === 'number' ? seats : '—';
                        })()}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(invoice.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invoice.status)}>
                          {getStatusIcon(invoice.status)}
                          <span className="ml-1 capitalize">{invoice.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {invoice.paymentMethod || 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewInvoice(invoice.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadInvoice(invoice.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEmailInvoice(invoice.id)}
                          >
                            <Mail className="h-4 w-4" />
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
              <div className="flex justify-center mt-6">
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

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Methods
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/subscription/payment-methods')}
              >
                Manage
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      {method.type === 'card' ? (
                        <p className="font-medium">
                          {method.brand} •••• {method.last4}
                        </p>
                      ) : (
                        <p className="font-medium">PayPal ({method.email})</p>
                      )}
                      {method.expiryMonth && method.expiryYear && (
                        <p className="text-sm text-gray-600">
                          Expires {method.expiryMonth}/{method.expiryYear}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {method.isDefault && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionBilling;
