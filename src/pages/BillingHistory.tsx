import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { subscriptionService, BillingRecord } from '@/services/subscriptionService';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  CreditCard, 
  FileText, 
  Eye,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface BillingStats {
  totalPaid: number;
  totalPending: number;
  totalFailed: number;
  currentMonthSpend: number;
  lastMonthSpend: number;
  averageMonthlySpend: number;
}

const BillingHistory = () => {
  const { user } = useAuth();
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<BillingRecord[]>([]);
  const [billingStats, setBillingStats] = useState<BillingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<BillingRecord | null>(null);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);

  useEffect(() => {
    const loadBillingData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const records = await subscriptionService.getBillingHistory(user.id);
        setBillingRecords(records);
        setFilteredRecords(records);
        
        // Calculate billing stats
        const stats = calculateBillingStats(records);
        setBillingStats(stats);
      } catch (error) {
        console.error('Failed to load billing history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBillingData();
  }, [user]);

  useEffect(() => {
    // Apply filters
    let filtered = billingRecords;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'last-month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'last-3-months':
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case 'last-6-months':
          filterDate.setMonth(now.getMonth() - 6);
          break;
        case 'last-year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      if (dateFilter !== 'all') {
        filtered = filtered.filter(record => record.date >= filterDate);
      }
    }

    setFilteredRecords(filtered);
  }, [billingRecords, searchTerm, statusFilter, dateFilter]);

  const calculateBillingStats = (records: BillingRecord[]): BillingStats => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const totalPaid = records.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.amount, 0);
    const totalPending = records.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0);
    const totalFailed = records.filter(r => r.status === 'failed').reduce((sum, r) => sum + r.amount, 0);

    const currentMonthRecords = records.filter(r => 
      r.date.getMonth() === currentMonth && 
      r.date.getFullYear() === currentYear &&
      r.status === 'paid'
    );
    const currentMonthSpend = currentMonthRecords.reduce((sum, r) => sum + r.amount, 0);

    const lastMonthRecords = records.filter(r => 
      r.date.getMonth() === lastMonth && 
      r.date.getFullYear() === lastMonthYear &&
      r.status === 'paid'
    );
    const lastMonthSpend = lastMonthRecords.reduce((sum, r) => sum + r.amount, 0);

    const paidRecords = records.filter(r => r.status === 'paid');
    const averageMonthlySpend = paidRecords.length > 0 ? totalPaid / Math.max(1, paidRecords.length) : 0;

    return {
      totalPaid,
      totalPending,
      totalFailed,
      currentMonthSpend,
      lastMonthSpend,
      averageMonthlySpend
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'refunded': return <RefreshCw className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const handleDownloadInvoice = async (record: BillingRecord) => {
    if (record.invoiceUrl) {
      // In a real app, this would download the invoice
      window.open(record.invoiceUrl, '_blank');
    }
  };

  const handleViewInvoice = (record: BillingRecord) => {
    setSelectedRecord(record);
    setInvoiceDialogOpen(true);
  };

  const getSpendTrend = () => {
    if (!billingStats) return null;
    
    const { currentMonthSpend, lastMonthSpend } = billingStats;
    if (lastMonthSpend === 0) return null;
    
    const percentChange = ((currentMonthSpend - lastMonthSpend) / lastMonthSpend) * 100;
    return {
      percentage: Math.abs(percentChange),
      isIncrease: percentChange > 0,
      isDecrease: percentChange < 0
    };
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const spendTrend = getSpendTrend();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Billing History</h1>
            <p className="text-muted-foreground">
              View and manage your billing history and invoices
            </p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>

        {/* Stats Cards */}
        {billingStats && (
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPrice(billingStats.totalPaid, 'USD')}
                </div>
                <p className="text-xs text-muted-foreground">
                  All time payments
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPrice(billingStats.currentMonthSpend, 'USD')}
                </div>
                {spendTrend && (
                  <p className="text-xs text-muted-foreground flex items-center">
                    {spendTrend.isIncrease ? (
                      <TrendingUp className="w-3 h-3 text-red-500 mr-1" />
                    ) : spendTrend.isDecrease ? (
                      <TrendingDown className="w-3 h-3 text-green-500 mr-1" />
                    ) : null}
                    {spendTrend.percentage.toFixed(1)}% vs last month
                  </p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPrice(billingStats.totalPending, 'USD')}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting payment
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Monthly</CardTitle>
                <CreditCard className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPrice(billingStats.averageMonthlySpend, 'USD')}
                </div>
                <p className="text-xs text-muted-foreground">
                  Based on history
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                  <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                  <SelectItem value="last-year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Billing Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice History</CardTitle>
            <CardDescription>
              {filteredRecords.length} of {billingRecords.length} invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredRecords.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900">No invoices found</p>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Date</TableHead>
                      
                      <TableHead>Module</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Storage Purchased</TableHead>
                      <TableHead>Team Members Added</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {record.id}
                        </TableCell>
                        <TableCell>
                          {formatDate(record.date)}
                        </TableCell>
                        
                        <TableCell>
                          {record.moduleName || '-'}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">
                            {record.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          {typeof record.storagePurchasedGB === 'number' ? `${record.storagePurchasedGB} GB` : '-'}
                        </TableCell>
                        <TableCell>
                          {typeof record.teamMembersAdded === 'number' ? record.teamMembersAdded : '-'}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatPrice(record.amount, record.currency)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(record.status)}>
                            {getStatusIcon(record.status)}
                            <span className="ml-1 capitalize">{record.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewInvoice(record)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                            {record.invoiceUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadInvoice(record)}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invoice Detail Dialog */}
        <Dialog open={invoiceDialogOpen} onOpenChange={setInvoiceDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Invoice Details</DialogTitle>
              <DialogDescription>
                {selectedRecord && `Invoice ${selectedRecord.id} - ${formatDate(selectedRecord.date)}`}
              </DialogDescription>
            </DialogHeader>
            {selectedRecord && (
              <div className="space-y-6">
                {/* Invoice Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">Invoice #{selectedRecord.id}</h3>
                    <p className="text-muted-foreground">{formatDate(selectedRecord.date)}</p>
                  </div>
                  <Badge className={getStatusColor(selectedRecord.status)}>
                    {getStatusIcon(selectedRecord.status)}
                    <span className="ml-1 capitalize">{selectedRecord.status}</span>
                  </Badge>
                </div>

                {/* Invoice Details */}
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Description:</span>
                    <span className="font-medium">{selectedRecord.description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium text-lg">
                      {formatPrice(selectedRecord.amount, selectedRecord.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Module:</span>
                    <span className="font-medium">{selectedRecord.moduleName || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Storage Purchased:</span>
                    <span className="font-medium">{typeof selectedRecord.storagePurchasedGB === 'number' ? `${selectedRecord.storagePurchasedGB} GB` : '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Team Members Added:</span>
                    <span className="font-medium">{typeof selectedRecord.teamMembersAdded === 'number' ? selectedRecord.teamMembersAdded : '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Paid On:</span>
                    <span className="font-medium">{selectedRecord.paidAt ? formatDate(selectedRecord.paidAt) : '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subscription:</span>
                    <span className="font-medium">{selectedRecord.subscriptionId}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end">
                  {selectedRecord.invoiceUrl && (
                    <Button
                      variant="outline"
                      onClick={() => handleDownloadInvoice(selectedRecord)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  )}
                  <Button onClick={() => setInvoiceDialogOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default BillingHistory;
