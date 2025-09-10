import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { subscriptionService, UserSubscription, SubscriptionPermissions } from '@/services/subscriptionService';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Calendar, 
  CreditCard, 
  Download, 
  Settings, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Trash2,
  ArrowUpCircle,
  ArrowDownCircle,
  Eye
} from 'lucide-react';

const MySubscriptions = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [permissions, setPermissions] = useState<SubscriptionPermissions | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentCycles, setPaymentCycles] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('active');
  const [selectedSubscription, setSelectedSubscription] = useState<UserSubscription | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    const loadSubscriptions = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const userSubscriptions = await subscriptionService.getUserSubscriptions(user.id);
        const userPermissions = subscriptionService.getSubscriptionPermissions(user.role);
        const cycles = subscriptionService.getPaymentCycles(user.id);
        
        setSubscriptions(userSubscriptions);
        setPermissions(userPermissions);
        setPaymentCycles(cycles);
      } catch (error) {
        console.error('Failed to load subscriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSubscriptions();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expiring': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'trial': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'expiring': return <AlertCircle className="w-4 h-4" />;
      case 'expired': return <XCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'trial': return <Calendar className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
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

  const getDaysUntilExpiry = (endDate: Date) => {
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCancelSubscription = async () => {
    if (!selectedSubscription) return;
    
    try {
      await subscriptionService.cancelSubscription(selectedSubscription.id, cancelReason);
      
      // Update local state
      setSubscriptions(prev => prev.map(sub => 
        sub.id === selectedSubscription.id 
          ? { ...sub, status: 'cancelled' as const, autoRenewal: false }
          : sub
      ));
      
      setCancelDialogOpen(false);
      setCancelReason('');
      setSelectedSubscription(null);
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
    }
  };

  // Confirm action from cancel dialog
  const handleCancelConfirm = () => {
    handleCancelSubscription();
  };

  const handleDownloadInvoice = (subscriptionId: string, invoiceId: string) => {
    // Handle invoice download
    console.log('Downloading invoice:', invoiceId, 'for subscription:', subscriptionId);
    // In a real app, this would trigger a download
  };

  const handlePayDueBill = async (subscriptionId: string, amount: number) => {
    try {
      const result = await subscriptionService.processBillingAction({
        type: 'pay_due',
        subscriptionId,
        amount,
        description: 'Due bill payment'
      });
      
      if (result.success) {
        // Refresh payment cycles after successful payment
        const cycles = subscriptionService.getPaymentCycles(user?.id || '');
        setPaymentCycles(cycles);
      }
    } catch (error) {
      console.error('Failed to pay due bill:', error);
    }
  };

  const handlePayRenewal = async (subscriptionId: string, amount: number) => {
    try {
      const result = await subscriptionService.processBillingAction({
        type: 'pay_renewal',
        subscriptionId,
        amount,
        description: 'Renewal payment'
      });
      
      if (result.success) {
        // Refresh subscriptions and payment cycles
        const userSubscriptions = await subscriptionService.getUserSubscriptions(user?.id || '');
        const cycles = subscriptionService.getPaymentCycles(user?.id || '');
        setSubscriptions(userSubscriptions);
        setPaymentCycles(cycles);
      }
    } catch (error) {
      console.error('Failed to pay renewal:', error);
    }
  };

  const handleRenewSubscription = async (subscriptionId: string) => {
    try {
      await subscriptionService.renewSubscription(subscriptionId);
      
      // Update local state
      setSubscriptions(prev => prev.map(sub => 
        sub.id === subscriptionId 
          ? { ...sub, status: 'active' as const, autoRenewal: true }
          : sub
      ));
    } catch (error) {
      console.error('Failed to renew subscription:', error);
    }
  };

  const handleToggleAutoRenewal = async (subscriptionId: string, autoRenewal: boolean) => {
    try {
      await subscriptionService.updateAutoRenewal(subscriptionId, autoRenewal);
      
      // Update local state
      setSubscriptions(prev => prev.map(sub => 
        sub.id === subscriptionId 
          ? { ...sub, autoRenewal }
          : sub
      ));
    } catch (error) {
      console.error('Failed to update auto-renewal:', error);
    }
  };

  const filterSubscriptions = (status: string) => {
    switch (status) {
      case 'active':
        return subscriptions.filter(sub => sub.status === 'active' || sub.status === 'trial');
      case 'expiring':
        return subscriptions.filter(sub => {
          if (sub.status !== 'active') return false;
          const daysUntilExpiry = getDaysUntilExpiry(sub.endDate);
          return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
        });
      case 'inactive':
        return subscriptions.filter(sub => sub.status === 'expired' || sub.status === 'cancelled');
      default:
        return subscriptions;
    }
  };

  const getSubscriptionTypeLabel = (type: string) => {
    switch (type) {
      case 'drive': return 'Full ERP Suite';
      case 'module-only': return 'Module Only';
      case 'data-storage': return 'Data Storage';
      case 'team-management': return 'Team Management';
      case 'premium-addon': return 'Premium Add-on';
      default: return type;
    }
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Subscriptions</h1>
            <p className="text-muted-foreground">
              Manage your active subscriptions and billing
            </p>
          </div>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {subscriptions.filter(sub => sub.status === 'active' || sub.status === 'trial').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
              <CreditCard className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPrice(
                  subscriptions
                    .filter(sub => sub.status === 'active' && sub.billingCycle === 'monthly')
                    .reduce((total, sub) => total + sub.price, 0),
                  'USD'
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filterSubscriptions('expiring').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Auto-Renewal</CardTitle>
              <RefreshCw className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {subscriptions.filter(sub => sub.autoRenewal).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscriptions List */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active">Active ({filterSubscriptions('active').length})</TabsTrigger>
            <TabsTrigger value="expiring">Expiring ({filterSubscriptions('expiring').length})</TabsTrigger>
            <TabsTrigger value="inactive">Inactive ({filterSubscriptions('inactive').length})</TabsTrigger>
            <TabsTrigger value="all">All ({subscriptions.length})</TabsTrigger>
          </TabsList>
          
          {['active', 'expiring', 'inactive', 'all'].map(tabValue => (
            <TabsContent key={tabValue} value={tabValue} className="space-y-4">
              {filterSubscriptions(tabValue).length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <XCircle className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-900">No subscriptions found</p>
                    <p className="text-gray-500">You don't have any {tabValue} subscriptions.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                {filterSubscriptions(tabValue).map((subscription) => {
                  const daysUntilExpiry = getDaysUntilExpiry(subscription.endDate);
                  
                  return (
                    <Card key={subscription.id} className="relative">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-xl">{subscription.plan.name}</CardTitle>
                              <Badge variant="outline" className={getStatusColor(subscription.status)}>
                                {getStatusIcon(subscription.status)}
                                <span className="ml-1 capitalize">{subscription.status}</span>
                              </Badge>
                              <Badge variant="secondary">
                                {getSubscriptionTypeLabel(subscription.plan.subscriptionType)}
                              </Badge>
                            </div>
                            <CardDescription>
                              {subscription.plan.description}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">
                              {formatPrice(subscription.price, subscription.currency)}
                            </div>
                            <div className="text-sm text-muted-foreground capitalize">
                              per {subscription.billingCycle.replace('ly', '')}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <Tabs defaultValue="overview" className="w-full">
                          <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-grid">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="usage">Usage</TabsTrigger>
                          </TabsList>

                          <TabsContent value="overview" className="space-y-4">
                            {/* Subscription Details */}
                            <div className="grid gap-4 md:grid-cols-3">
                              <div>
                                <Label className="text-sm font-medium">Start Date</Label>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(subscription.startDate)}
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">End Date</Label>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(subscription.endDate)}
                                  {subscription.status === 'active' && daysUntilExpiry <= 30 && (
                                    <span className="ml-2 text-yellow-600 font-medium">
                                      ({daysUntilExpiry} days left)
                                    </span>
                                  )}
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Next Billing</Label>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(subscription.nextBillingDate)}
                                </p>
                              </div>
                            </div>

                            {/* Auto-Renewal Toggle */}
                            {subscription.status === 'active' && permissions?.canUpgradeDowngrade && (
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <Label className="text-sm font-medium">Auto-Renewal</Label>
                                  <p className="text-sm text-muted-foreground">
                                    Automatically renew this subscription
                                  </p>
                                </div>
                                <Switch
                                  checked={subscription.autoRenewal}
                                  onCheckedChange={(checked) => 
                                    handleToggleAutoRenewal(subscription.id, checked)
                                  }
                                />
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2 flex-wrap">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                              
                              {subscription.status === 'active' && permissions?.canUpgradeDowngrade && (
                                <>
                                  <Button variant="outline" size="sm">
                                    <ArrowUpCircle className="w-4 h-4 mr-2" />
                                    Upgrade
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <ArrowDownCircle className="w-4 h-4 mr-2" />
                                    Downgrade
                                  </Button>
                                </>
                              )}
                              
                              {(subscription.status === 'expired' || subscription.status === 'cancelled') && 
                              permissions?.canPurchase && (
                                <Button variant="default" size="sm" onClick={() => handleRenewSubscription(subscription.id)}>
                                  <RefreshCw className="w-4 h-4 mr-2" />
                                  Renew
                                </Button>
                              )}
                            </div>
                          </TabsContent>

                          <TabsContent value="usage" className="space-y-4">
                            <div>
                              <h4 className="text-sm font-semibold">Usage Metrics</h4>
                              <p className="text-sm text-muted-foreground">Monitor your current usage against plan limits</p>
                            </div>

                            {(subscription.teamMemberNames?.length || subscription.activeEntityNames?.length) ? (
                              <div className="grid gap-6 md:grid-cols-2">
                                {subscription.teamMemberNames?.length ? (
                                  <div>
                                    <div className="flex items-center justify-between">
                                      <Label className="text-sm font-medium">Team Members</Label>
                                      <span className="text-xs text-muted-foreground">{subscription.teamMemberNames.length} users</span>
                                    </div>
                                    <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground space-y-1">
                                      {subscription.teamMemberNames.map((name, idx) => (
                                        <li key={idx}>{name}</li>
                                      ))}
                                    </ul>
                                  </div>
                                ) : null}

                                {subscription.activeEntityNames?.length ? (
                                  <div>
                                    <div className="flex items-center justify-between">
                                      <Label className="text-sm font-medium">Active Entities</Label>
                                      <span className="text-xs text-muted-foreground">{subscription.activeEntityNames.length} entities</span>
                                    </div>
                                    <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground space-y-1">
                                      {subscription.activeEntityNames.map((name, idx) => (
                                        <li key={idx}>{name}</li>
                                      ))}
                                    </ul>
                                  </div>
                                ) : null}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">No usage details available.</p>
                            )}
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  );
                })}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Cancel Subscription Dialog */}
        <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Subscription</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel your subscription to {selectedSubscription?.plan.name}?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="reason">Reason for cancellation (optional)</Label>
                <Textarea
                  id="reason"
                  placeholder="Please let us know why you're cancelling..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                Keep Subscription
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleCancelConfirm}
                disabled={!selectedSubscription}
              >
                Cancel Subscription
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default MySubscriptions;
