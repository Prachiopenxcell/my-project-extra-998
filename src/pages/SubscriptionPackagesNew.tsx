import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Package, 
  Check, 
  Star, 
  Users, 
  Building, 
  Zap, 
  Shield, 
  Database,
  Headphones,
  Globe,
  ArrowRight,
  Search,
  Filter,
  Crown,
  Sparkles,
  TrendingUp,
  Clock,
  CreditCard,
  Plus,
  Calendar,
  AlertTriangle,
  Vote,
  FolderOpen,
  UserCheck,
  Scale,
  FileText,
  Briefcase
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";
import { subscriptionService, SubscriptionPlan, SubscriptionStats, SubscriptionFilters } from "@/services/subscriptionService";
import { MODULE_CATEGORIES, PRICE_RANGES } from "@/data/professionalModules";
import { useToast } from "@/components/ui/use-toast";

const SubscriptionPackages = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

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

  // Determine if user is admin (full access)
  const isAdmin = user?.role && [
    UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER,
    UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
    UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER,
    UserRole.SERVICE_PROVIDER_ENTITY_ADMIN
  ].includes(user.role);

  const userType = isServiceSeeker ? "service_seeker" : isServiceProvider ? "service_provider" : "admin";
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<'individual' | 'bundle' | 'all'>('all');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [showPopularOnly, setShowPopularOnly] = useState(false);
  const [showTrialOnly, setShowTrialOnly] = useState(false);

  const [allPlans, setAllPlans] = useState<SubscriptionPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<SubscriptionPlan[]>([]);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [plansData, statsData] = await Promise.all([
        subscriptionService.getAllPlans(),
        subscriptionService.getSubscriptionStats()
      ]);
      
      setAllPlans(plansData);
      setStats(statsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load subscription packages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const filterPlans = useCallback(async () => {
    try {
      let plans = [...allPlans];

      // Filter by tab
      if (activeTab === "individual") {
        plans = plans.filter(plan => plan.type === 'individual');
      } else if (activeTab === "bundles") {
        plans = plans.filter(plan => plan.type === 'bundle');
      } else if (activeTab === "popular") {
        plans = plans.filter(plan => plan.popular);
      }

      // Apply filters
      const filters: SubscriptionFilters = {
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        priceRange: priceFilter !== "all" ? priceFilter : undefined,
        type: typeFilter !== "all" ? typeFilter : undefined,
        popular: showPopularOnly || undefined,
        trial: showTrialOnly || undefined,
        searchTerm: searchTerm || undefined
      };

      if (Object.values(filters).some(v => v !== undefined)) {
        plans = await subscriptionService.searchPlans(filters);
        
        // Re-apply tab filter after search
        if (activeTab === "individual") {
          plans = plans.filter(plan => plan.type === 'individual');
        } else if (activeTab === "bundles") {
          plans = plans.filter(plan => plan.type === 'bundle');
        } else if (activeTab === "popular") {
          plans = plans.filter(plan => plan.popular);
        }
      }

      setFilteredPlans(plans);
    } catch (error) {
      console.error("Failed to filter plans:", error);
    }
  }, [allPlans, searchTerm, categoryFilter, priceFilter, typeFilter, showPopularOnly, showTrialOnly, activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    filterPlans();
  }, [filterPlans]);

  const getModuleIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
      Building,
      Calendar,
      Users,
      AlertTriangle,
      Vote,
      FolderOpen,
      UserCheck,
      Scale,
      FileText,
      Briefcase,
      Package,
      Crown,
      Sparkles,
      Clock
    };
    
    return iconMap[iconName] || Package;
  };

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    try {
      if (plan.trial) {
        await subscriptionService.startTrial(user?.id || "current-user", plan.id);
        toast({
          title: "Trial Started",
          description: `${plan.trialDays}-day trial for ${plan.title} has been activated`
        });
      } else {
        await subscriptionService.subscribeToPlan(user?.id || "current-user", plan.id, billingCycle);
        toast({
          title: "Subscription Activated",
          description: `Successfully subscribed to ${plan.title}`
        });
      }
      
      // Navigate to workspace to see the new module
      navigate('/workspace');
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "Failed to process subscription. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleLearnMore = (plan: SubscriptionPlan) => {
    if (plan.href) {
      navigate(plan.href);
    } else {
      toast({
        title: "Module Details",
        description: `Learn more about ${plan.title} features and capabilities`
      });
    }
  };

  const getPriceDisplay = (plan: SubscriptionPlan) => {
    const price = billingCycle === 'monthly' ? plan.pricing.monthly : plan.pricing.annual;
    const originalPrice = plan.originalPrice;
    const isDiscounted = originalPrice && originalPrice > price;
    
    return (
      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">
            ₹{price.toLocaleString()}
          </span>
          {isDiscounted && (
            <span className="text-lg text-gray-500 line-through">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600">
          per {billingCycle === 'monthly' ? 'month' : 'year'}
        </p>
        {plan.discount && (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Save {plan.discount}%
          </Badge>
        )}
      </div>
    );
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      core: { label: "Core", className: "bg-blue-100 text-blue-800" },
      professional: { label: "Professional", className: "bg-purple-100 text-purple-800" },
      enterprise: { label: "Enterprise", className: "bg-orange-100 text-orange-800" },
      addon: { label: "Add-on", className: "bg-gray-100 text-gray-800" },
      bundle: { label: "Bundle", className: "bg-green-100 text-green-800" }
    };
    
    const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.professional;
    
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <DashboardLayout userType={user?.role?.includes('SERVICE_SEEKER') ? 'service_seeker' : 'service_provider'}>
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-12" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Plans Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType={userType}>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Subscription Packages</h1>
          <p className="text-gray-600 mt-2">
            Choose the perfect plan for your business needs. All professional modules available individually or in cost-effective bundles.
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Plans</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalPlans}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Individual Modules</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.individualModules}</p>
                  </div>
                  <Building className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Bundle Plans</p>
                    <p className="text-2xl font-bold text-green-600">{stats.bundlePlans}</p>
                  </div>
                  <Crown className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Popular Plans</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.popularPlans}</p>
                  </div>
                  <Star className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Billing Cycle Toggle */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Billing Cycle</h3>
                <p className="text-sm text-gray-600">Choose monthly or annual billing for better savings</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant={billingCycle === 'monthly' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setBillingCycle('monthly')}
                  >
                    Monthly
                  </Button>
                  <Button
                    variant={billingCycle === 'annual' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setBillingCycle('annual')}
                  >
                    Annual
                    <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                      Save 20%
                    </Badge>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Packages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search packages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {MODULE_CATEGORIES.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by price" />
                </SelectTrigger>
                <SelectContent>
                  {PRICE_RANGES.map(range => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as 'individual' | 'bundle' | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="individual">Individual Modules</SelectItem>
                  <SelectItem value="bundle">Bundle Plans</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <Button
                variant={showPopularOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowPopularOnly(!showPopularOnly)}
              >
                <Star className="h-4 w-4 mr-2" />
                Popular Only
              </Button>
              <Button
                variant={showTrialOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowTrialOnly(!showTrialOnly)}
              >
                <Clock className="h-4 w-4 mr-2" />
                Trial Available
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Packages</TabsTrigger>
            <TabsTrigger value="bundles">Bundle Plans</TabsTrigger>
            <TabsTrigger value="individual">Individual Modules</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlans.map((plan) => {
                const IconComponent = getModuleIcon(plan.icon);
                
                return (
                  <Card 
                    key={plan.id} 
                    className={`hover:shadow-lg transition-shadow relative ${
                      plan.popular ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-blue-600 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      </div>
                    )}

                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <IconComponent className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{plan.title}</CardTitle>
                            <p className="text-sm text-gray-600 mt-1">{plan.shortDescription}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        {getCategoryBadge(plan.category)}
                        {plan.recommended && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Recommended
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        {/* Pricing */}
                        {getPriceDisplay(plan)}

                        {/* Features */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Key Features:</h4>
                          <ul className="space-y-1">
                            {plan.features.slice(0, 4).map((feature, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                            {plan.features.length > 4 && (
                              <li className="text-sm text-gray-500">
                                +{plan.features.length - 4} more features
                              </li>
                            )}
                          </ul>
                        </div>

                        {/* Support & Storage */}
                        <div className="text-sm text-gray-600 space-y-1">
                          {plan.storage && (
                            <div className="flex items-center gap-2">
                              <Database className="h-4 w-4" />
                              {plan.storage} storage
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Headphones className="h-4 w-4" />
                            {plan.support}
                          </div>
                          {plan.trial && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {plan.trialDays}-day free trial
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 border-t space-y-2">
                          <Button
                            onClick={() => handleSubscribe(plan)}
                            className="w-full"
                            variant={plan.popular ? "default" : "outline"}
                          >
                            {plan.trial ? (
                              <>
                                <Clock className="h-4 w-4 mr-2" />
                                Start {plan.trialDays}-Day Trial
                              </>
                            ) : (
                              <>
                                <CreditCard className="h-4 w-4 mr-2" />
                                Subscribe Now
                              </>
                            )}
                          </Button>
                          
                          {plan.href && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLearnMore(plan)}
                              className="w-full"
                            >
                              Learn More
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredPlans.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Packages Found</h3>
                  <p className="text-gray-600 mb-4">
                    No packages match your current filters. Try adjusting your search criteria.
                  </p>
                  <Button 
                    onClick={() => {
                      setSearchTerm("");
                      setCategoryFilter("all");
                      setPriceFilter("all");
                      setTypeFilter("all");
                      setShowPopularOnly(false);
                      setShowTrialOnly(false);
                    }}
                    variant="outline"
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionPackages;
