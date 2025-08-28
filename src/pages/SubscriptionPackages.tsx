import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SubscriptionPlan {
  id: string;
  name: string;
  category: 'core' | 'addon' | 'enterprise';
  type: 'monthly' | 'annual' | 'one-time';
  price: number;
  originalPrice?: number;
  currency: string;
  popular: boolean;
  recommended: boolean;
  description: string;
  features: string[];
  limitations?: string[];
  maxUsers?: number;
  maxEntities?: number;
  storage?: string;
  support: string;
  trial?: boolean;
  trialDays?: number;
}

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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const [plans, setPlans] = useState<SubscriptionPlan[]>([
    {
      id: "basic",
      name: "Basic Plan",
      category: "core",
      type: "monthly",
      price: 49.99,
      currency: "USD",
      popular: false,
      recommended: false,
      description: "Perfect for small teams getting started with professional services management",
      features: [
        "Up to 5 entities",
        "Basic meeting management",
        "10GB storage",
        "Email support",
        "Standard templates",
        "Basic reporting"
      ],
      limitations: ["Limited integrations", "Basic analytics"],
      maxUsers: 3,
      maxEntities: 5,
      storage: "10GB",
      support: "Email",
      trial: true,
      trialDays: 14
    },
    {
      id: "professional",
      name: "Professional Plan",
      category: "core",
      type: "monthly",
      price: 99.99,
      originalPrice: 129.99,
      currency: "USD",
      popular: true,
      recommended: true,
      description: "Most popular choice for growing professional service firms",
      features: [
        "Unlimited entities",
        "Advanced meeting management",
        "100GB storage",
        "Priority support",
        "Custom templates",
        "Advanced reporting",
        "API access",
        "Team collaboration tools",
        "Automated workflows"
      ],
      maxUsers: 15,
      storage: "100GB",
      support: "Priority Email & Chat",
      trial: true,
      trialDays: 30
    },
    {
      id: "enterprise",
      name: "Enterprise Plan",
      category: "enterprise",
      type: "monthly",
      price: 299.99,
      currency: "USD",
      popular: false,
      recommended: false,
      description: "Comprehensive solution for large organizations with complex needs",
      features: [
        "Unlimited everything",
        "Advanced compliance tools",
        "1TB storage",
        "24/7 phone support",
        "Custom integrations",
        "White-label options",
        "Dedicated account manager",
        "Advanced security",
        "Custom training",
        "SLA guarantee"
      ],
      storage: "1TB",
      support: "24/7 Phone & Chat",
      trial: true,
      trialDays: 30
    }
  ]);

  const [addOns, setAddOns] = useState<AddOn[]>([
    {
      id: "ai-assistant",
      name: "AI Assistant",
      description: "Intelligent automation and insights powered by advanced AI",
      price: 29.99,
      currency: "USD",
      type: "monthly",
      category: "AI & Automation",
      icon: <Sparkles className="h-6 w-6" />,
      features: [
        "Smart document analysis",
        "Automated task suggestions",
        "Intelligent meeting summaries",
        "Predictive analytics"
      ]
    },
    {
      id: "compliance-plus",
      name: "Compliance Plus",
      description: "Advanced regulatory compliance and audit management",
      price: 79.99,
      currency: "USD",
      type: "monthly",
      category: "Compliance",
      icon: <Shield className="h-6 w-6" />,
      features: [
        "Regulatory compliance tracking",
        "Automated audit trails",
        "Custom compliance checklists",
        "Risk assessment tools"
      ]
    },
    {
      id: "storage-extension",
      name: "Storage Extension",
      description: "Additional secure cloud storage for your documents",
      price: 19.99,
      currency: "USD",
      type: "monthly",
      category: "Storage",
      icon: <Database className="h-6 w-6" />,
      features: [
        "500GB additional storage",
        "Advanced file management",
        "Version control",
        "Enhanced security"
      ]
    },
    {
      id: "premium-support",
      name: "Premium Support",
      description: "Dedicated support with faster response times",
      price: 49.99,
      currency: "USD",
      type: "monthly",
      category: "Support",
      icon: <Headphones className="h-6 w-6" />,
      features: [
        "24/7 priority support",
        "Dedicated support agent",
        "Phone support included",
        "Custom training sessions"
      ]
    },
    {
      id: "api-access",
      name: "Advanced API Access",
      description: "Enhanced API limits and custom integrations",
      price: 39.99,
      currency: "USD",
      type: "monthly",
      category: "Integration",
      icon: <Globe className="h-6 w-6" />,
      features: [
        "Unlimited API calls",
        "Custom webhooks",
        "Advanced integrations",
        "Developer support"
      ]
    },
    {
      id: "team-seats",
      name: "Additional Team Seats",
      description: "Add more team members to your workspace",
      price: 15.99,
      currency: "USD",
      type: "monthly",
      category: "Team",
      icon: <Users className="h-6 w-6" />,
      features: [
        "5 additional user seats",
        "Full feature access",
        "Team collaboration tools",
        "Role-based permissions"
      ]
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

  const getAnnualPrice = (monthlyPrice: number) => {
    return monthlyPrice * 12 * 0.8; // 20% discount for annual
  };

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || plan.category === categoryFilter;
    const matchesPrice = priceFilter === "all" || 
                        (priceFilter === "under-100" && plan.price < 100) ||
                        (priceFilter === "100-200" && plan.price >= 100 && plan.price <= 200) ||
                        (priceFilter === "over-200" && plan.price > 200);
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const filteredAddOns = addOns.filter(addon => 
    addon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    addon.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePurchase = (planId: string, type: 'plan' | 'addon') => {
    navigate(`/subscription/purchase/${type}/${planId}`);
  };

  const handleStartTrial = (planId: string) => {
    navigate(`/subscription/trial/${planId}`);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the perfect subscription plan and add-ons to power your professional services
          </p>
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
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search plans and add-ons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-3">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="core">Core Plans</SelectItem>
                <SelectItem value="addon">Add-ons</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-100">Under $100</SelectItem>
                <SelectItem value="100-200">$100 - $200</SelectItem>
                <SelectItem value="over-200">Over $200</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="plans" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
            <TabsTrigger value="addons">Add-ons & Extensions</TabsTrigger>
          </TabsList>

          {/* Subscription Plans */}
          <TabsContent value="plans" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPlans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`relative hover:shadow-lg transition-shadow ${
                    plan.popular ? 'ring-2 ring-blue-500' : ''
                  }`}
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
                        <Crown className="h-3 w-3 mr-1" />
                        Recommended
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-4xl font-bold">
                          {formatCurrency(
                            billingCycle === 'annual' ? getAnnualPrice(plan.price) / 12 : plan.price
                          )}
                        </span>
                        <span className="text-gray-600">/{billingCycle === 'annual' ? 'month' : 'month'}</span>
                      </div>
                      {billingCycle === 'annual' && (
                        <div className="text-sm text-gray-600">
                          <span className="line-through">{formatCurrency(plan.price)}</span>
                          <span className="ml-2 text-green-600 font-medium">Save 20%</span>
                        </div>
                      )}
                      {plan.originalPrice && billingCycle === 'monthly' && (
                        <div className="text-sm text-gray-600">
                          <span className="line-through">{formatCurrency(plan.originalPrice)}</span>
                          <span className="ml-2 text-green-600 font-medium">
                            Save {formatCurrency(plan.originalPrice - plan.price)}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mt-2">{plan.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                      {plan.limitations && plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-center gap-3 opacity-60">
                          <div className="h-4 w-4 border border-gray-300 rounded-full flex-shrink-0" />
                          <span className="text-sm text-gray-600">{limitation}</span>
                        </div>
                      ))}
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
                      <Button 
                        className="w-full"
                        onClick={() => handlePurchase(plan.id, 'plan')}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Choose Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Add-ons */}
          <TabsContent value="addons" className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Enhance Your Experience</h2>
              <p className="text-gray-600">Add powerful features and capabilities to any plan</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAddOns.map((addon) => (
                <Card key={addon.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {addon.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{addon.name}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {addon.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-2xl font-bold">{formatCurrency(addon.price)}</span>
                      <span className="text-gray-600">/{addon.type === 'monthly' ? 'month' : 'one-time'}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm">{addon.description}</p>
                    
                    <div className="space-y-2">
                      {addon.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className="w-full mt-4"
                      onClick={() => handlePurchase(addon.id, 'addon')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Plan
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Need Help Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Need Help Choosing?</h3>
            <p className="text-gray-600 mb-6">
              Our team can help you find the perfect plan for your specific needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate('/contact')}>
                <Headphones className="h-4 w-4 mr-2" />
                Contact Sales
              </Button>
              <Button onClick={() => navigate('/how-it-works')}>
                <ArrowRight className="h-4 w-4 mr-2" />
                See How It Works
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionPackages;
