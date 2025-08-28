import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { subscriptionService, DueBill } from '@/services/subscriptionService';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Receipt,
  FileText,
  ArrowLeft,
  Eye,
  Download,
  Wallet,
  Building,
  Package,
  Zap,
  RefreshCw,
  Plus,
  Minus,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SubscriptionDueBills = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dueBills, setDueBills] = useState<DueBill[]>([]);
  const [filteredBills, setFilteredBills] = useState<DueBill[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedBills, setSelectedBills] = useState<string[]>([]);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    const loadDueBills = async () => {
      try {
        setLoading(true);
        if (user?.id) {
          const bills = await subscriptionService.getDueBills(user.id);
          setDueBills(bills);
          setFilteredBills(bills);
        }
      } catch (error) {
        console.error('Error loading due bills:', error);
        toast.error('Failed to load due bills');
      } finally {
        setLoading(false);
      }
    };

    loadDueBills();
  }, [user]);

  useEffect(() => {
    const filtered = dueBills.filter(bill => {
      const matchesSearch = bill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bill.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || bill.status === statusFilter;
      const matchesType = typeFilter === "all" || bill.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });

    setFilteredBills(filtered);
  }, [dueBills, searchTerm, statusFilter, typeFilter]);

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'subscription': return <Package className="h-4 w-4" />;
      case 'addon': return <Zap className="h-4 w-4" />;
      case 'renewal': return <RefreshCw className="h-4 w-4" />;
      case 'upgrade': return <TrendingUp className="h-4 w-4" />;
      default: return <Receipt className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'subscription': return 'Subscription';
      case 'addon': return 'Add-on';
      case 'renewal': return 'Renewal';
      case 'upgrade': return 'Upgrade';
      default: return type;
    }
  };

  const handleSelectBill = (billId: string) => {
    setSelectedBills(prev => 
      prev.includes(billId) 
        ? prev.filter(id => id !== billId)
        : [...prev, billId]
    );
  };

  const handleSelectAll = () => {
    const pendingBills = filteredBills.filter(bill => bill.status === 'pending' || bill.status === 'overdue');
    if (selectedBills.length === pendingBills.length) {
      setSelectedBills([]);
    } else {
      setSelectedBills(pendingBills.map(bill => bill.id));
    }
  };

  const handlePaySelected = async () => {
    if (selectedBills.length === 0) {
      toast.error('Please select bills to pay');
      return;
    }

    setPaymentProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update bill statuses
      setDueBills(prev => prev.map(bill => 
        selectedBills.includes(bill.id) 
          ? { ...bill, status: 'paid' as const }
          : bill
      ));
      
      setSelectedBills([]);
      setShowPaymentDialog(false);
      toast.success(`Successfully paid ${selectedBills.length} bill(s)`);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handlePaySingle = async (billId: string) => {
    setPaymentProcessing(true);
    try {
      const result = await subscriptionService.payDueBill(billId);
      if (result.success) {
        setDueBills(prev => prev.map(bill => 
          bill.id === billId 
            ? { ...bill, status: 'paid' as const }
            : bill
        ));
        toast.success('Payment successful');
      } else {
        toast.error('Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const selectedBillsData = dueBills.filter(bill => selectedBills.includes(bill.id));
  const totalSelectedAmount = selectedBillsData.reduce((sum, bill) => sum + bill.amount, 0);

  const stats = {
    totalDue: dueBills.filter(bill => bill.status === 'pending' || bill.status === 'overdue').reduce((sum, bill) => sum + bill.amount, 0),
    overdueBills: dueBills.filter(bill => bill.status === 'overdue').length,
    pendingBills: dueBills.filter(bill => bill.status === 'pending').length,
    paidThisMonth: dueBills.filter(bill => bill.status === 'paid' && new Date(bill.dueDate).getMonth() === new Date().getMonth()).reduce((sum, bill) => sum + bill.amount, 0)
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
              onClick={() => navigate('/subscription')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Due Bills & Payments</h1>
              <p className="text-muted-foreground">
                Manage your outstanding bills and payment history
              </p>
            </div>
          </div>
          {selectedBills.length > 0 && (
            <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Pay Selected ({selectedBills.length})
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Payment</DialogTitle>
                  <DialogDescription>
                    You are about to pay {selectedBills.length} bill(s) totaling {formatCurrency(totalSelectedAmount)}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Selected Bills:</h4>
                    <div className="space-y-2">
                      {selectedBillsData.map(bill => (
                        <div key={bill.id} className="flex justify-between text-sm">
                          <span>{bill.description}</span>
                          <span className="font-medium">{formatCurrency(bill.amount)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>{formatCurrency(totalSelectedAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handlePaySelected} disabled={paymentProcessing}>
                    {paymentProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pay Now
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Due</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalDue)}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue Bills</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.overdueBills}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Bills</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendingBills}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Receipt className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Paid This Month</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.paidThisMonth)}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search bills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="subscription">Subscription</SelectItem>
                <SelectItem value="addon">Add-on</SelectItem>
                <SelectItem value="renewal">Renewal</SelectItem>
                <SelectItem value="upgrade">Upgrade</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bills Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Bills & Payments
              </CardTitle>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedBills.length === filteredBills.filter(bill => bill.status === 'pending' || bill.status === 'overdue').length && filteredBills.filter(bill => bill.status === 'pending' || bill.status === 'overdue').length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-gray-600">Select All Payable</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Select</TableHead>
                    <TableHead>Bill ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBills.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell>
                        {(bill.status === 'pending' || bill.status === 'overdue') && (
                          <Checkbox
                            checked={selectedBills.includes(bill.id)}
                            onCheckedChange={() => handleSelectBill(bill.id)}
                          />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{bill.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(bill.type)}
                          <span className="capitalize">{getTypeLabel(bill.type)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{bill.description}</p>
                          {bill.subscriptionId && (
                            <p className="text-sm text-gray-600">Subscription: {bill.subscriptionId}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(bill.amount, bill.currency)}
                      </TableCell>
                      <TableCell>
                        <div className={`${new Date(bill.dueDate) < new Date() && bill.status !== 'paid' ? 'text-red-600' : ''}`}>
                          {formatDate(bill.dueDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(bill.status)}>
                          {getStatusIcon(bill.status)}
                          <span className="ml-1 capitalize">{bill.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {bill.paymentUrl && (bill.status === 'pending' || bill.status === 'overdue') && (
                            <Button
                              size="sm"
                              onClick={() => handlePaySingle(bill.id)}
                              disabled={paymentProcessing}
                            >
                              <CreditCard className="h-4 w-4 mr-1" />
                              Pay
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/subscription/invoice/${bill.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredBills.length === 0 && (
              <div className="text-center py-12">
                <Receipt className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bills found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Need Help with Payments?</h3>
            <p className="text-gray-600 mb-6">
              Contact our billing support team for assistance with payment issues or questions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate('/subscription/payment-methods')}>
                <Wallet className="h-4 w-4 mr-2" />
                Manage Payment Methods
              </Button>
              <Button onClick={() => navigate('/subscription/billing')}>
                <FileText className="h-4 w-4 mr-2" />
                View Billing History
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionDueBills;
