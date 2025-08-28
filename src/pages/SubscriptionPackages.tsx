import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { subscriptionService, SubscriptionPlan, SubscriptionPermissions } from '@/services/subscriptionService';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import SubscriptionCard from '@/components/subscription/SubscriptionCard';
import SubscriptionStats from '@/components/subscription/SubscriptionStats';
import SubscriptionSkeleton from '@/components/subscription/SubscriptionSkeleton';
import { 
  Package, 
  Search, 
  Filter, 
  Star, 
  Check, 
  Zap, 
  Database, 
  Users, 
  Crown, 
  Shield,
  HelpCircle,
  Phone,
  Mail,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Clock,
  CreditCard,
  Plus,
  HardDrive,
  Server,
  UserCheck,
  BarChart,
  Rocket,
  Target,
  Award,
  ArrowRight,
  Headphones,
  Eye,
  Calendar,
  Plug
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Using SubscriptionPlan from service

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  type: 'monthly' | 'one-time';
  category: string;
  icon: React.ReactNode;
  features: string[];
}

const SubscriptionPackages = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [subscriptionTypeFilter, setSubscriptionTypeFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<SubscriptionPlan[]>([]);
  const [userPermissions, setUserPermissions] = useState<SubscriptionPermissions | null>(null);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [userPurchasedPlans, setUserPurchasedPlans] = useState<string[]>([]);

  // Load plans and user permissions on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Get user role-based plans
        const userRole = user?.role || '';
        const allPlans = await subscriptionService.getPackagesByUserRole(userRole);
        const permissions = subscriptionService.getSubscriptionPermissions(userRole);
        const comprehensiveAddOns = subscriptionService.getComprehensiveAddOns();
        
        // Check which plans user has already purchased
        const purchasedPlans: string[] = [];
        if (user?.id) {
          for (const plan of allPlans) {
            const hasPurchased = await subscriptionService.hasUserPurchased(user.id, plan.id);
            if (hasPurchased) {
              purchasedPlans.push(plan.id);
            }
          }
        }
        
        setPlans(allPlans);
        setUserPermissions(permissions);
        setAddOns(comprehensiveAddOns);
        setUserPurchasedPlans(purchasedPlans);
        setFilteredPlans(allPlans);
      } catch (error) {
        console.error('Error loading subscription plans:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Filter plans based on search and filters
  useEffect(() => {
    const filtered = plans.filter(plan => {
      const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           plan.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = categoryFilter === "all" || plan.category === categoryFilter;
      const matchesType = subscriptionTypeFilter === "all" || plan.subscriptionType === subscriptionTypeFilter;
      
      const currentPrice = billingCycle === 'annual' ? plan.pricing.annual / 12 : plan.pricing.monthly;
      const matchesPrice = priceFilter === "all" || 
                          (priceFilter === "under-1000" && currentPrice < 1000) ||
                          (priceFilter === "1000-5000" && currentPrice >= 1000 && currentPrice <= 5000) ||
                          (priceFilter === "over-5000" && currentPrice > 5000);
      
      return matchesSearch && matchesCategory && matchesType && matchesPrice;
    });

    // Sort by popularity and recommendation
    filtered.sort((a, b) => {
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      if (a.recommended && !b.recommended) return -1;
      if (!a.recommended && b.recommended) return 1;
      return 0;
    });

    setFilteredPlans(filtered);
  }, [plans, searchTerm, categoryFilter, subscriptionTypeFilter, priceFilter, billingCycle]);

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getAnnualPrice = (monthlyPrice: number) => {
    return monthlyPrice * 12 * 0.8; // 20% discount for annual
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'drive': return <Rocket className="h-5 w-5" />;
      case 'storage': return <Database className="h-5 w-5" />;
      case 'team': return <Users className="h-5 w-5" />;
      case 'addon': return <Zap className="h-5 w-5" />;
      case 'module': return <Package className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  const getSubscriptionTypeLabel = (type: string) => {
    switch (type) {
      case 'drive': return 'Full ERP Suite';
      case 'module-only': return 'Individual Module';
      case 'data-storage': return 'Cloud Storage';
      case 'team-management': return 'Team Management';
      case 'premium-addon': return 'Premium Add-on';
      default: return type;
    }
  };

  const handlePurchase = async (planId: string) => {
    try {
      // Activate payment cycle for subscription
      const result = await subscriptionService.activatePaymentCycle(planId);
      if (result.success) {
        // Redirect to subscription details page
        navigate(`/subscription-details/${planId}`);
      }
    } catch (error) {
      console.error('Error purchasing plan:', error);
    }
  };

  const handleViewSubscription = (planId: string) => {
    // Redirect to subscription details page for already purchased plans
    navigate(`/subscription-details/${planId}`);
  };

  const handleAddOnPurchase = (addOnId: string) => {
    // Handle add-on purchase
    console.log('Purchasing add-on:', addOnId);
    // In a real app, this would redirect to payment flow
  };

  const handleStartTrial = (planId: string) => {
    navigate(`/subscription/trial/${planId}`);
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Subscription Packages</h1>
            <p className="text-muted-foreground">
              Choose the perfect subscription package for your business needs
            </p>
          </div>
          {userPermissions && !userPermissions.canPurchase && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> You can view available plans, but subscription purchases must be made by your administrator.
              </p>
            </div>
          )}
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'monthly' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'annual' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setBillingCycle('annual')}
            >
              Annual
              <Badge className="ml-2 bg-green-100 text-green-800">Save 20%</Badge>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search plans and features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Select value={subscriptionTypeFilter} onValueChange={setSubscriptionTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Subscription Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="drive">Full ERP Suite</SelectItem>
                <SelectItem value="module-only">Individual Modules</SelectItem>
                <SelectItem value="data-storage">Cloud Storage</SelectItem>
                <SelectItem value="team-management">Team Management</SelectItem>
                <SelectItem value="premium-addon">Premium Add-ons</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="drive">Drive</SelectItem>
                <SelectItem value="module">Modules</SelectItem>
                <SelectItem value="storage">Storage</SelectItem>
                <SelectItem value="team">Team</SelectItem>
                <SelectItem value="addon">Add-ons</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-1000">Under ₹1,000</SelectItem>
                <SelectItem value="1000-5000">₹1,000 - ₹5,000</SelectItem>
                <SelectItem value="over-5000">Over ₹5,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative hover:shadow-lg transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
              } ${plan.recommended ? 'border-green-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              {plan.recommended && (
                <div className="absolute -top-4 right-4">
                  <Badge className="bg-green-500 text-white px-3 py-1">
                    <Award className="h-3 w-3 mr-1" />
                    Recommended
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-3">
                  {getCategoryIcon(plan.category)}
                  <Badge variant="outline" className="ml-2 text-xs">
                    {getSubscriptionTypeLabel(plan.subscriptionType)}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-bold">
                      {formatCurrency(
                        billingCycle === 'annual' ? getAnnualPrice(plan.pricing.monthly) / 12 : plan.pricing.monthly
                      )}
                    </span>
                    <span className="text-gray-600">/{billingCycle === 'annual' ? 'month' : 'month'}</span>
                  </div>
                  {billingCycle === 'annual' && (
                    <div className="text-sm text-gray-600">
                      <span className="line-through">{formatCurrency(plan.pricing.monthly)}</span>
                      <span className="ml-2 text-green-600 font-medium">Save 20%</span>
                    </div>
                  )}
                  {plan.originalPrice && billingCycle === 'monthly' && (
                    <div className="text-sm text-gray-600">
                      <span className="line-through">{formatCurrency(plan.originalPrice)}</span>
                      <span className="ml-2 text-green-600 font-medium">
                        Save {formatCurrency(plan.originalPrice - plan.pricing.monthly)}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-2">{plan.shortDescription}</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.slice(0, 6).map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  {plan.features.length > 6 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{plan.features.length - 6} more features
                    </div>
                  )}
                </div>
                
                <div className="pt-4 border-t space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {plan.maxUsers && (
                      <div>
                        <span className="text-gray-600">Users:</span>
                        <span className="ml-1 font-medium">{plan.maxUsers}</span>
                      </div>
                    )}
                    {plan.storage && (
                      <div>
                        <span className="text-gray-600">Storage:</span>
                        <span className="ml-1 font-medium">{plan.storage}</span>
                      </div>
                    )}
                    <div className="col-span-2">
                      <span className="text-gray-600">Support:</span>
                      <span className="ml-1 font-medium">{plan.support}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 pt-4">
                  {plan.trial && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleStartTrial(plan.id)}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Start {plan.trialDays}-Day Free Trial
                    </Button>
                  )}
                  {userPurchasedPlans.includes(plan.id) ? (
                    <Button 
                      onClick={() => handleViewSubscription(plan.id)} 
                      variant="outline"
                      className="w-full"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Subscription
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handlePurchase(plan.id)} 
                      disabled={!userPermissions?.canPurchase}
                      className="w-full"
                    >
                      {userPermissions?.canPurchase ? 'Choose Plan' : 'Contact Admin'}
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    className="w-full text-sm"
                    onClick={() => navigate(`/subscription/details/${plan.id}`)}
                  >
                    View Details
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPlans.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No plans found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}

        {/* Need Help Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Need Help Choosing?</h3>
            <p className="text-gray-600 mb-6">
              Our team can help you find the perfect plan for your specific needs and role
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate('/contact')}>
                <Headphones className="h-4 w-4 mr-2" />
                Contact Sales
              </Button>
              <Button onClick={() => navigate('/subscription/compare')}>
                <Target className="h-4 w-4 mr-2" />
                Compare Plans
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Plans Grid */}
        <div className="space-y-6">
          {loading ? (
            <SubscriptionSkeleton count={6} variant="card" />
          ) : (
            <>
              {/* Stats Overview */}
              <SubscriptionStats 
                stats={{
                  totalActive: filteredPlans.filter(p => p.recommended).length,
                  totalSpend: filteredPlans.reduce((sum, p) => sum + (p.pricing.monthly || 0), 0),
                  expiringCount: 0,
                  usagePercentage: 65,
                  monthlyGrowth: 12.5,
                  renewalRate: 94
                }}
              />

              {/* Plans Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPlans.map((plan) => (
                  <SubscriptionCard
                    key={plan.id}
                    plan={plan}
                    onPurchase={handlePurchase}
                    onStartTrial={handleStartTrial}
                    canPurchase={userPermissions?.canPurchase || false}
                    isPopular={plan.popular}
                    isRecommended={plan.recommended}
                  />
                ))}
              </div>

              {filteredPlans.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Package className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-900">No plans found</p>
                    <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Comprehensive Add-ons Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Available Add-ons</h2>
                <p className="text-muted-foreground">
                  Enhance your subscription with powerful add-ons
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {addOns.map((addon) => (
                <Card key={addon.id} className="relative">
                  {addon.popular && (
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-orange-500 text-white">Popular</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        {addon.icon === 'HardDrive' && <HardDrive className="w-5 h-5 text-blue-600" />}
                        {addon.icon === 'Database' && <Database className="w-5 h-5 text-blue-600" />}
                        {addon.icon === 'Zap' && <Zap className="w-5 h-5 text-blue-600" />}
                        {addon.icon === 'Calendar' && <Calendar className="w-5 h-5 text-blue-600" />}
                        {addon.icon === 'BarChart' && <BarChart className="w-5 h-5 text-blue-600" />}
                        {addon.icon === 'TrendingUp' && <TrendingUp className="w-5 h-5 text-blue-600" />}
                        {addon.icon === 'Users' && <Users className="w-5 h-5 text-blue-600" />}
                        {addon.icon === 'Crown' && <Crown className="w-5 h-5 text-blue-600" />}
                        {addon.icon === 'Plug' && <Plug className="w-5 h-5 text-blue-600" />}
                        {addon.icon === 'Headphones' && <Headphones className="w-5 h-5 text-blue-600" />}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{addon.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {addon.category.charAt(0).toUpperCase() + addon.category.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription>{addon.description}</CardDescription>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Features:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {addon.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Check className="w-3 h-3 text-green-500" />
                            {feature}
                          </li>
                        ))}
                        {addon.features.length > 3 && (
                          <li className="text-xs text-muted-foreground">
                            +{addon.features.length - 3} more features
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold">
                            {formatCurrency(addon.price, addon.currency)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            /{addon.type}
                          </span>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => handleAddOnPurchase(addon.id)} 
                        disabled={!userPermissions?.canPurchase}
                        className="w-full"
                        variant={addon.popular ? "default" : "outline"}
                      >
                        {userPermissions?.canPurchase ? 'Add to Cart' : 'Contact Admin'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionPackages;
