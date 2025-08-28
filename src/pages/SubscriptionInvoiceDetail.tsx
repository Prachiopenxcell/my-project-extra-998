import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  Mail, 
  Printer, 
  ArrowLeft,
  Receipt,
  Calendar,
  CreditCard,
  Building,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Share,
  Copy
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface InvoiceDetail {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  paidDate?: string;
  amount: number;
  subtotal: number;
  tax: number;
  discount?: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue' | 'failed' | 'cancelled';
  description: string;
  
  // Billing details
  billTo: {
    name: string;
    company: string;
    email: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  
  // Payment details
  paymentMethod?: {
    type: string;
    last4?: string;
    brand?: string;
  };
  
  // Line items
  items: InvoiceLineItem[];
  
  // Notes and terms
  notes?: string;
  terms?: string;
  
  // Metadata
  createdBy: string;
  downloadUrl?: string;
}

interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  period?: string;
  taxRate?: number;
  discount?: number;
}

const SubscriptionInvoiceDetail = () => {
  const navigate = useNavigate();
  const { invoiceId } = useParams();
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);

  useEffect(() => {
    // Simulate API call to fetch invoice details
    const fetchInvoice = async () => {
      setLoading(true);
      
      // Mock data based on invoiceId
      const mockInvoice: InvoiceDetail = {
        id: invoiceId || "inv-001",
        invoiceNumber: "INV-2024-001",
        date: "2024-01-15",
        dueDate: "2024-01-30",
        paidDate: "2024-01-16",
        amount: 449.97,
        subtotal: 409.97,
        tax: 40.00,
        discount: 0,
        currency: "USD",
        status: "paid",
        description: "Monthly subscription - January 2024",
        
        billTo: {
          name: "John Doe",
          company: "Acme Corporation",
          email: "john.doe@acme.com",
          address: {
            street: "123 Business Street, Suite 100",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            country: "United States"
          }
        },
        
        paymentMethod: {
          type: "Visa",
          last4: "4242",
          brand: "visa"
        },
        
        items: [
          {
            id: "item-1",
            description: "Professional Plan",
            quantity: 1,
            unitPrice: 299.99,
            total: 299.99,
            period: "Jan 15 - Feb 15, 2024",
            taxRate: 0.10
          },
          {
            id: "item-2",
            description: "Compliance Plus Add-on",
            quantity: 1,
            unitPrice: 79.99,
            total: 79.99,
            period: "Jan 15 - Feb 15, 2024",
            taxRate: 0.10
          },
          {
            id: "item-3",
            description: "AI Assistant Add-on",
            quantity: 1,
            unitPrice: 29.99,
            total: 29.99,
            period: "Jan 15 - Feb 15, 2024",
            taxRate: 0.10
          }
        ],
        
        notes: "Thank you for your business! This invoice covers your subscription services for the billing period specified above.",
        terms: "Payment is due within 15 days of invoice date. Late payments may incur additional fees.",
        createdBy: "Billing System",
        downloadUrl: "/api/invoices/inv-001/download"
      };

      setTimeout(() => {
        setInvoice(mockInvoice);
        setLoading(false);
      }, 1000);
    };

    fetchInvoice();
  }, [invoiceId]);

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleDownload = () => {
    // Simulate download
    console.log(`Downloading invoice ${invoiceId}`);
    // In real implementation, this would trigger a download
  };

  const handleEmail = () => {
    // Simulate email
    console.log(`Emailing invoice ${invoiceId}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could show a toast notification here
  };

  if (loading || !invoice) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/subscription/billing')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Billing
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Invoice {invoice.invoiceNumber}</h1>
              <p className="text-gray-600">{invoice.description}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={handleEmail}>
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopyLink}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Invoice Card */}
        <Card className="print:shadow-none">
          <CardContent className="p-8">
            {/* Invoice Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">INVOICE</h2>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Invoice #:</span>
                    <span>{invoice.invoiceNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Date:</span>
                    <span>{formatDate(invoice.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Due Date:</span>
                    <span>{formatDate(invoice.dueDate)}</span>
                  </div>
                  {invoice.paidDate && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Paid Date:</span>
                      <span>{formatDate(invoice.paidDate)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <Badge className={`${getStatusColor(invoice.status)} mb-4`}>
                  {getStatusIcon(invoice.status)}
                  <span className="ml-1 capitalize">{invoice.status}</span>
                </Badge>
                <div className="text-3xl font-bold text-gray-900">
                  {formatCurrency(invoice.amount, invoice.currency)}
                </div>
                <p className="text-sm text-gray-600 mt-1">Total Amount</p>
              </div>
            </div>

            {/* Bill To Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Bill To
                </h3>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{invoice.billTo.name}</p>
                  <p>{invoice.billTo.company}</p>
                  <p className="text-gray-600">{invoice.billTo.email}</p>
                  <div className="mt-2">
                    <p>{invoice.billTo.address.street}</p>
                    <p>
                      {invoice.billTo.address.city}, {invoice.billTo.address.state} {invoice.billTo.address.zipCode}
                    </p>
                    <p>{invoice.billTo.address.country}</p>
                  </div>
                </div>
              </div>
              
              {invoice.paymentMethod && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Payment Method
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">
                      {invoice.paymentMethod.type} •••• {invoice.paymentMethod.last4}
                    </p>
                    {invoice.paidDate && (
                      <p className="text-green-600">
                        Paid on {formatDate(invoice.paidDate)}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Separator className="my-8" />

            {/* Line Items */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Invoice Items</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">{item.period || 'N/A'}</span>
                        </TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.unitPrice, invoice.currency)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.total, invoice.currency)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-full max-w-sm space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(invoice.subtotal, invoice.currency)}</span>
                </div>
                {invoice.discount && invoice.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount:</span>
                    <span>-{formatCurrency(invoice.discount, invoice.currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span>{formatCurrency(invoice.tax, invoice.currency)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>{formatCurrency(invoice.amount, invoice.currency)}</span>
                </div>
              </div>
            </div>

            {/* Notes and Terms */}
            {(invoice.notes || invoice.terms) && (
              <>
                <Separator className="my-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {invoice.notes && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                      <p className="text-sm text-gray-600">{invoice.notes}</p>
                    </div>
                  )}
                  {invoice.terms && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Terms & Conditions</h3>
                      <p className="text-sm text-gray-600">{invoice.terms}</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Footer */}
            <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
              <p>Generated by {invoice.createdBy} • {formatDate(invoice.date)}</p>
              <p className="mt-1">
                For questions about this invoice, please contact our billing department.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-center gap-4 print:hidden">
          <Button variant="outline" onClick={() => navigate('/subscription/billing')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Billing History
          </Button>
          <Button variant="outline" onClick={handleEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Email Invoice
          </Button>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionInvoiceDetail;
