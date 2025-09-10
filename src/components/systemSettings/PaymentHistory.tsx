import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  Calendar,
  CreditCard,
  DollarSign,
  TrendingUp,
  Eye
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { systemSettingsService } from "@/services/systemSettingsService";
import { PaymentHistory as PaymentHistoryType, PaymentStatus, PaymentMethodType, SystemSettingsFilters } from "@/types/systemSettings";
import { format } from "date-fns";

const PaymentHistory = () => {
  const [payments, setPayments] = useState<PaymentHistoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SystemSettingsFilters>({});
  const [dateRange, setDateRange] = useState("last_12_months");

  const loadPaymentHistory = useCallback(async () => {
    try {
      const response = await systemSettingsService.getPaymentHistory(filters);
      setPayments(response.data);
    } catch (error) {
      console.error('Failed to load payment history:', error);
      toast({
        title: "Error",
        description: "Failed to load payment history",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadPaymentHistory();
  }, [loadPaymentHistory]);

  const handleExportCSV = () => {
    // Mock CSV export
    const csvContent = [
      ['Date', 'Service Title', 'Module', 'Storage Purchased', 'Team Members Added', 'Amount Paid', 'Paid On', 'Status'],
      ...payments.map(payment => [
        format(payment.date, 'yyyy-MM-dd'),
        payment.serviceTitle,
        payment.serviceDetails?.moduleName || '-',
        payment.serviceDetails?.storagePurchasedGB ? `${payment.serviceDetails.storagePurchasedGB} GB` : '-',
        payment.serviceDetails?.teamMembersAdded ?? '-',
        payment.amount.toString(),
        payment.paidDate ? payment.paidDate.toLocaleDateString() : payment.date.toLocaleDateString(),
        payment.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-history-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Payment history exported successfully",
    });
  };

  const downloadInvoice = (payment: PaymentHistoryType) => {
    // Mock invoice download
    toast({
      title: "Download Started",
      description: `Invoice for ${payment.serviceTitle} is being downloaded`,
    });
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.COMPLETED:
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case PaymentStatus.PENDING:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case PaymentStatus.FAILED:
        return <Badge variant="destructive">Failed</Badge>;
      case PaymentStatus.REFUNDED:
        return <Badge variant="secondary">Refunded</Badge>;
    }
  };

  const getPaymentMethodLabel = (method: PaymentMethodType) => {
    switch (method) {
      case PaymentMethodType.CREDIT_CARD:
        return 'Credit Card';
      case PaymentMethodType.BANK_TRANSFER:
        return 'Bank Transfer';
      case PaymentMethodType.UPI:
        return 'UPI';
      case PaymentMethodType.WALLET:
        return 'Wallet';
    }
  };

  const calculateSummary = () => {
    const totalSpent = payments.reduce((sum, payment) => 
      payment.status === PaymentStatus.COMPLETED ? sum + payment.amount : sum, 0
    );
    const paymentCount = payments.filter(p => p.status === PaymentStatus.COMPLETED).length;
    const averageMonthly = paymentCount > 0 ? totalSpent / Math.min(12, paymentCount) : 0;

    return { totalSpent, paymentCount, averageMonthly };
  };

  const { totalSpent, paymentCount, averageMonthly } = calculateSummary();

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={filters.searchTerm || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_12_months">Last 12 Months</SelectItem>
                <SelectItem value="last_6_months">Last 6 Months</SelectItem>
                <SelectItem value="last_3_months">Last 3 Months</SelectItem>
                <SelectItem value="current_year">Current Year</SelectItem>
                <SelectItem value="last_year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Payment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-muted-foreground">Total Spent (Last 12 Months)</span>
              </div>
              <p className="text-2xl font-bold text-green-600">${totalSpent.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-muted-foreground">Average Monthly</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">${averageMonthly.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CreditCard className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-muted-foreground">Total Payments</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{paymentCount}</p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Next Payment Due</p>
            <p className="font-medium">March 15, 2025 ($299.99)</p>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                  </div>
                  <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[220px]">Service Title</TableHead>
                    <TableHead className="min-w-[160px]">Module</TableHead>
                    <TableHead className="hidden md:table-cell min-w-[160px]">Storage Purchased</TableHead>
                    <TableHead className="hidden lg:table-cell min-w-[180px]">Team Members Added</TableHead>
                    <TableHead className="text-right min-w-[140px]">Amount Paid</TableHead>
                    <TableHead className="text-right min-w-[140px]">Paid On</TableHead>
                    <TableHead className="text-center min-w-[120px]">Status</TableHead>
                    <TableHead className="text-right min-w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.serviceTitle}</TableCell>
                      <TableCell>{payment.serviceDetails?.moduleName || '-'}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {payment.serviceDetails?.storagePurchasedGB ? `${payment.serviceDetails.storagePurchasedGB} GB` : '-'}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {payment.serviceDetails?.teamMembersAdded ?? '-'}
                      </TableCell>
                      <TableCell className="font-medium text-right">
                        ${payment.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {payment.paidDate ? payment.paidDate.toLocaleDateString() : payment.date.toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(payment.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => downloadInvoice(payment)}
                            title="Download invoice"
                            aria-label={`Download invoice for ${payment.serviceTitle}`}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {payments.length === 0 && !loading && (
            <div className="text-center py-8">
              <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No payment history found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download All Invoices
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Tax Summary
            </Button>
            <Button variant="outline">
              <CreditCard className="h-4 w-4 mr-2" />
              Contact Billing
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { PaymentHistory };
