import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  Package, 
  Calendar, 
  TrendingUp, 
  Users, 
  Zap, 
  Shield, 
  Clock,
  ArrowRight,
  Plus,
  Settings,
  History,
  Star,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";

interface SubscriptionStats {
  activeSubscriptions: number;
  totalSpent: number;
  nextRenewal: string;
  addOnsActive: number;
}

interface CurrentSubscription {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'expiring' | 'expired';
  startDate: string;
  endDate: string;
  price: number;
  currency: string;
  features: string[];
  autoRenewal: boolean;
}

interface RecentActivity {
  id: string;
  type: 'purchase' | 'renewal' | 'upgrade' | 'cancellation' | 'addon';
  description: string;
  date: string;
  amount?: number;
  status: 'completed' | 'pending' | 'failed';
}

const SubscriptionManagement = () => {
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
  const [stats, setStats] = useState<SubscriptionStats>({
    activeSubscriptions: 3,
    totalSpent: 2450.00,
    nextRenewal: "2024-02-15",
    addOnsActive: 5
  });

  const [currentSubscriptions, setCurrentSubscriptions] = useState<CurrentSubscription[]>([
    {
      id: "sub-001",
      name: "Professional Plan",
      type: "Core Platform",
      status: "active",
      startDate: "2024-01-15",
      endDate: "2025-01-15",
      price: 299.99,
      currency: "USD",
      features: ["Unlimited Entities", "Advanced Meetings", "Priority Support", "API Access"],
      autoRenewal: true
    },
    {
      id: "sub-002",
      name: "Compliance Plus",
      type: "Add-on Module",
      status: "active",
      startDate: "2024-01-15",
      endDate: "2025-01-15",
      price: 149.99,
      currency: "USD",
      features: ["Regulatory Compliance", "Auto-generated Checklists", "Audit Trails"],
      autoRenewal: true
    },
    {
      id: "sub-003",
      name: "Storage Extension",
      type: "Add-on Service",
      status: "expiring",
      startDate: "2023-12-01",
      endDate: "2024-12-01",
      price: 49.99,
      currency: "USD",
      features: ["500GB Additional Storage", "Advanced File Management"],
      autoRenewal: false
    }
  ]);

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([
    {
      id: "act-001",
      type: "renewal",
      description: "Professional Plan renewed for 12 months",
      date: "2024-01-15",
      amount: 299.99,
      status: "completed"
    },
    {
      id: "act-002",
      type: "addon",
      description: "AI Assistant add-on purchased",
      date: "2024-01-10",
      amount: 79.99,
      status: "completed"
    },
    {
      id: "act-003",
      type: "upgrade",
      description: "Upgraded from Basic to Professional Plan",
      date: "2024-01-05",
      amount: 150.00,
      status: "completed"
    }
  ]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expiring': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'purchase': return <Package className="h-4 w-4" />;
      case 'renewal': return <RefreshCw className="h-4 w-4" />;
      case 'upgrade': return <TrendingUp className="h-4 w-4" />;
      case 'cancellation': return <AlertCircle className="h-4 w-4" />;
      case 'addon': return <Plus className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

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

  return (
    <DashboardLayout userType={userType}>
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
            <p className="text-gray-600 mt-1">Manage your subscriptions, add-ons, and billing</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/subscription/browse')}
              className="flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              Subscription Packages
            </Button>
            <Button 
              onClick={() => navigate('/subscription/billing')}
              className="flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              Billing History
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSpent)}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Next Renewal</p>
                  <p className="text-2xl font-bold text-gray-900">{formatDate(stats.nextRenewal)}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Add-ons</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.addOnsActive}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="subscriptions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="subscriptions">My Subscriptions</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Current Subscriptions Tab */}
          <TabsContent value="subscriptions" className="space-y-6">
            <div className="grid gap-6">
              {currentSubscriptions.map((subscription) => (
                <Card key={subscription.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{subscription.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{subscription.type}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(subscription.status)}>
                          {subscription.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {subscription.status === 'expiring' && <Clock className="h-3 w-3 mr-1" />}
                          {subscription.status === 'expired' && <AlertCircle className="h-3 w-3 mr-1" />}
                          {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                        </Badge>
                        <span className="text-2xl font-bold text-gray-900">
                          {formatCurrency(subscription.price)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Subscription Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Start Date:</span>
                            <span>{formatDate(subscription.startDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">End Date:</span>
                            <span>{formatDate(subscription.endDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Auto Renewal:</span>
                            <span className={subscription.autoRenewal ? "text-green-600" : "text-red-600"}>
                              {subscription.autoRenewal ? "Enabled" : "Disabled"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Features Included</h4>
                        <div className="space-y-2">
                          {subscription.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/subscription/${subscription.id}/details`)}
                      >
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/subscription/${subscription.id}/manage`)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Manage
                      </Button>
                      {subscription.status === 'expiring' && (
                        <Button 
                          size="sm"
                          onClick={() => navigate(`/subscription/${subscription.id}/renew`)}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Renew Now
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Recent Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <p className="text-sm text-gray-600">Your subscription and billing activity</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-100 rounded-full">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{activity.description}</p>
                          <p className="text-sm text-gray-600">{formatDate(activity.date)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {activity.amount && (
                          <p className="font-semibold text-gray-900">{formatCurrency(activity.amount)}</p>
                        )}
                        <Badge className={activity.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {activity.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/subscription/billing')}
                    className="flex items-center gap-2"
                  >
                    <History className="h-4 w-4" />
                    View Full History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Settings</CardTitle>
                <p className="text-sm text-gray-600">Manage your subscription preferences</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900">Auto-renewal Notifications</h4>
                      <p className="text-sm text-gray-600">Get notified before subscriptions renew</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900">Payment Method</h4>
                      <p className="text-sm text-gray-600">Manage your default payment method</p>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900">Billing Address</h4>
                      <p className="text-sm text-gray-600">Update your billing information</p>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
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

export default SubscriptionManagement;
