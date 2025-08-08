import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  Package, 
  Check, 
  X, 
  Calendar, 
  Users, 
  Database, 
  Shield, 
  Headphones,
  Settings,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard,
  Download,
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  Minus,
  Crown,
  Zap
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface SubscriptionDetail {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'expiring' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  nextBillingDate: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'annual';
  autoRenewal: boolean;
  features: FeatureItem[];
  usage: UsageMetric[];
  addOns: AddOnItem[];
  paymentMethod: string;
  invoices: InvoiceItem[];
  cancellationDate?: string;
  cancellationReason?: string;
}

interface FeatureItem {
  name: string;
  included: boolean;
  limit?: string;
  usage?: number;
  maxUsage?: number;
}

interface UsageMetric {
  name: string;
  current: number;
  limit: number;
  unit: string;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

interface AddOnItem {
  id: string;
  name: string;
  price: number;
  status: 'active' | 'inactive';
  addedDate: string;
}

interface InvoiceItem {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
}

const SubscriptionDetails = () => {
  const navigate = useNavigate();
  const { subscriptionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionDetail | null>(null);

  useEffect(() => {
    // Simulate API call to fetch subscription details
    const fetchSubscription = async () => {
      setLoading(true);
      
      // Mock data based on subscriptionId
      const mockSubscription: SubscriptionDetail = {
        id: subscriptionId || "sub-001",
        name: "Professional Plan",
        type: "Core Platform",
        status: "active",
        startDate: "2024-01-15",
        endDate: "2025-01-15",
        nextBillingDate: "2024-02-15",
        price: 299.99,
        currency: "USD",
        billingCycle: "monthly",
        autoRenewal: true,
        paymentMethod: "Visa •••• 4242",
        features: [
          { name: "Unlimited Entities", included: true },
          { name: "Advanced Meetings", included: true },
          { name: "Team Members", included: true, limit: "Up to 15", usage: 8, maxUsage: 15 },
          { name: "Storage", included: true, limit: "100GB", usage: 45, maxUsage: 100 },
          { name: "API Access", included: true, limit: "10,000 calls/month", usage: 2450, maxUsage: 10000 },
          { name: "Priority Support", included: true },
          { name: "Custom Branding", included: false },
          { name: "Advanced Analytics", included: true },
          { name: "Audit Logs", included: true, limit: "6 months retention" },
          { name: "SSO Integration", included: false }
        ],
        usage: [
          { name: "Team Members", current: 8, limit: 15, unit: "users", percentage: 53, trend: "up" },
          { name: "Storage Used", current: 45, limit: 100, unit: "GB", percentage: 45, trend: "up" },
          { name: "API Calls", current: 2450, limit: 10000, unit: "calls", percentage: 25, trend: "stable" },
          { name: "Active Entities", current: 23, limit: -1, unit: "entities", percentage: 0, trend: "up" }
        ],
        addOns: [
          { id: "addon-1", name: "Compliance Plus", price: 79.99, status: "active", addedDate: "2024-01-15" },
          { id: "addon-2", name: "AI Assistant", price: 29.99, status: "active", addedDate: "2024-01-20" },
          { id: "addon-3", name: "Storage Extension", price: 19.99, status: "inactive", addedDate: "2023-12-01" }
        ],
        invoices: [
          { id: "inv-001", date: "2024-01-15", amount: 409.97, status: "paid" },
          { id: "inv-002", date: "2023-12-15", amount: 379.98, status: "paid" },
          { id: "inv-003", date: "2023-11-15", amount: 299.99, status: "paid" }
        ]
      };

      setTimeout(() => {
        setSubscription(mockSubscription);
        setLoading(false);
      }, 1000);
    };

    fetchSubscription();
  }, [subscriptionId]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expiring': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  const handleToggleAutoRenewal = async () => {
    if (!subscription) return;
    
    // Simulate API call
    setSubscription({
      ...subscription,
      autoRenewal: !subscription.autoRenewal
    });
  };

  const handleUpgrade = () => {
    navigate('/subscription/upgrade');
  };

  const handleDowngrade = () => {
    navigate('/subscription/downgrade');
  };

  const handleCancel = () => {
    navigate(`/subscription/${subscriptionId}/cancel`);
  };

  const handleAddAddon = () => {
    navigate('/subscription/browse?tab=addons');
  };

  const handleRemoveAddon = (addonId: string) => {
    if (!subscription) return;
    
    setSubscription({
      ...subscription,
      addOns: subscription.addOns.map(addon => 
        addon.id === addonId ? { ...addon, status: 'inactive' } : addon
      )
    });
  };

  if (loading || !subscription) {
    return (
      <DashboardLayout userType="service_provider">
        <div className="container mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="service_provider">
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
              <h1 className="text-3xl font-bold text-gray-900">{subscription.name}</h1>
              <p className="text-gray-600">{subscription.type}</p>
            </div>
          </div>
          <Badge className={getStatusColor(subscription.status)}>
            {subscription.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
            {subscription.status === 'expiring' && <Clock className="h-3 w-3 mr-1" />}
            {subscription.status === 'expired' && <AlertCircle className="h-3 w-3 mr-1" />}
            {subscription.status === 'cancelled' && <X className="h-3 w-3 mr-1" />}
            {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
          </Badge>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Cost</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(subscription.price)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {subscription.billingCycle === 'annual' ? 'Billed annually' : 'Billed monthly'}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Next Billing</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatDate(subscription.nextBillingDate)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Auto-renewal: {subscription.autoRenewal ? 'On' : 'Off'}
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">Active Add-ons</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {subscription.addOns.filter(addon => addon.status === 'active').length}
                  </p>
                  <p className="text-sm text-gray-600">
                    +{formatCurrency(subscription.addOns
                      .filter(addon => addon.status === 'active')
                      .reduce((sum, addon) => sum + addon.price, 0)
                    )}/month
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="addons">Add-ons</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Start Date:</span>
                      <span className="ml-2 font-medium">{formatDate(subscription.startDate)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">End Date:</span>
                      <span className="ml-2 font-medium">{formatDate(subscription.endDate)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Billing Cycle:</span>
                      <span className="ml-2 font-medium capitalize">{subscription.billingCycle}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="ml-2 font-medium">{subscription.paymentMethod}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {subscription.invoices.slice(0, 3).map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{formatDate(invoice.date)}</p>
                          <p className="text-sm text-gray-600">{formatCurrency(invoice.amount)}</p>
                        </div>
                        <Badge className={invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {invoice.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => navigate('/subscription/billing')}
                  >
                    View All Invoices
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Plan Features</CardTitle>
                <p className="text-sm text-gray-600">Features included in your current plan</p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {subscription.features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-gray-400" />
                        )}
                        <div>
                          <p className={`font-medium ${!feature.included ? 'text-gray-500' : ''}`}>
                            {feature.name}
                          </p>
                          {feature.limit && (
                            <p className="text-sm text-gray-600">{feature.limit}</p>
                          )}
                        </div>
                      </div>
                      {feature.usage !== undefined && feature.maxUsage !== undefined && (
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {feature.usage} / {feature.maxUsage}
                          </p>
                          <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                            <div 
                              className={`h-2 rounded-full ${getUsageColor((feature.usage / feature.maxUsage) * 100)}`}
                              style={{ width: `${Math.min((feature.usage / feature.maxUsage) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Usage Metrics</CardTitle>
                <p className="text-sm text-gray-600">Monitor your current usage against plan limits</p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {subscription.usage.map((metric, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{metric.name}</h4>
                          {getTrendIcon(metric.trend)}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {metric.current.toLocaleString()} {metric.unit}
                            {metric.limit > 0 && (
                              <span className="text-gray-600"> / {metric.limit.toLocaleString()}</span>
                            )}
                          </p>
                          {metric.limit > 0 && (
                            <p className="text-sm text-gray-600">{metric.percentage}% used</p>
                          )}
                        </div>
                      </div>
                      {metric.limit > 0 && (
                        <Progress value={metric.percentage} className="h-2" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add-ons Tab */}
          <TabsContent value="addons" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Add-ons & Extensions</h2>
                <p className="text-gray-600">Enhance your subscription with additional features</p>
              </div>
              <Button onClick={handleAddAddon}>
                <Plus className="h-4 w-4 mr-2" />
                Browse Add-ons
              </Button>
            </div>

            <div className="grid gap-4">
              {subscription.addOns.map((addon) => (
                <Card key={addon.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{addon.name}</h4>
                        <p className="text-sm text-gray-600">
                          Added on {formatDate(addon.addedDate)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(addon.price)}/month</p>
                          <Badge className={addon.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {addon.status}
                          </Badge>
                        </div>
                        {addon.status === 'active' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRemoveAddon(addon.id)}
                          >
                            <Minus className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Auto-renewal</h4>
                    <p className="text-sm text-gray-600">
                      Automatically renew your subscription before it expires
                    </p>
                  </div>
                  <Switch 
                    checked={subscription.autoRenewal}
                    onCheckedChange={handleToggleAutoRenewal}
                  />
                </div>

                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Upgrade Plan</h4>
                      <p className="text-sm text-gray-600">
                        Get more features and higher limits
                      </p>
                    </div>
                    <Button variant="outline" onClick={handleUpgrade}>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Upgrade
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Downgrade Plan</h4>
                      <p className="text-sm text-gray-600">
                        Switch to a lower-tier plan
                      </p>
                    </div>
                    <Button variant="outline" onClick={handleDowngrade}>
                      <TrendingDown className="h-4 w-4 mr-2" />
                      Downgrade
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg border-red-200">
                    <div>
                      <h4 className="font-semibold text-red-600">Cancel Subscription</h4>
                      <p className="text-sm text-gray-600">
                        Cancel your subscription and stop future billing
                      </p>
                    </div>
                    <Button variant="destructive" onClick={handleCancel}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionDetails;
