import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { subscriptionService, SubscriptionPlan, UserSubscription } from '@/services/subscriptionService';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  TrendingUp, 
  TrendingDown, 
  Check, 
  X, 
  ArrowLeft,
  ArrowRight,
  Star,
  Crown,
  Package,
  Zap,
  Database,
  Users,
  Shield,
  Calendar,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Info,
  Calculator,
  Building
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

interface UpgradeDowngradeOption {
  plan: SubscriptionPlan;
  type: 'upgrade' | 'downgrade';
  priceDifference: number;
  prorationAmount: number;
  effectiveDate: Date;
  benefits: string[];
  limitations?: string[];
}

const SubscriptionUpgradeDowngrade = () => {
  const navigate = useNavigate();
  const { subscriptionId } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [upgradeOptions, setUpgradeOptions] = useState<UpgradeDowngradeOption[]>([]);
  const [downgradeOptions, setDowngradeOptions] = useState<UpgradeDowngradeOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<UpgradeDowngradeOption | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [effectiveTiming, setEffectiveTiming] = useState<'immediate' | 'next_cycle'>('immediate');
  const [upgradeSort, setUpgradeSort] = useState<'recommended' | 'price_asc' | 'price_desc'>('recommended');

  // Add Modules flow
  const [availableModulePlans, setAvailableModulePlans] = useState<SubscriptionPlan[]>([]);
  const [selectedModuleIds, setSelectedModuleIds] = useState<Set<string>>(new Set());

  // Switch to Drive flow
  const [drivePlans, setDrivePlans] = useState<SubscriptionPlan[]>([]);
  // Featured add-ons section
  const [entityAddon, setEntityAddon] = useState<SubscriptionPlan | null>(null);
  const [teamPlan, setTeamPlan] = useState<SubscriptionPlan | null>(null);
  const [storagePlan, setStoragePlan] = useState<SubscriptionPlan | null>(null);

  useEffect(() => {
    const loadSubscriptionData = async () => {
      try {
        setLoading(true);
        if (user?.id && subscriptionId) {
          // Get current subscription
          const subscription = await subscriptionService.getSubscriptionById(subscriptionId);
          setCurrentSubscription(subscription);

          if (subscription) {
            // Get upgrade/downgrade options
            const options = await subscriptionService.getUpgradeDowngradeOptions(subscription.planId);
            
            // Calculate upgrade and downgrade options with pricing
            const currentPlan = subscription.plan;
            const currentPrice = billingCycle === 'annual' ? currentPlan.pricing.annual / 12 : currentPlan.pricing.monthly;
            
            const upgrades: UpgradeDowngradeOption[] = [];
            const downgrades: UpgradeDowngradeOption[] = [];

            options.forEach(plan => {
              const planPrice = billingCycle === 'annual' ? plan.pricing.annual / 12 : plan.pricing.monthly;
              const priceDifference = planPrice - currentPrice;
              const isUpgrade = priceDifference > 0;
              
              const option: UpgradeDowngradeOption = {
                plan,
                type: isUpgrade ? 'upgrade' : 'downgrade',
                priceDifference: Math.abs(priceDifference),
                prorationAmount: calculateProration(priceDifference, subscription.nextBillingDate),
                effectiveDate: new Date(),
                benefits: isUpgrade ? getUpgradeBenefits(currentPlan, plan) : [],
                limitations: !isUpgrade ? getDowngradeLimitations(currentPlan, plan) : undefined
              };

              if (isUpgrade) {
                upgrades.push(option);
              } else {
                downgrades.push(option);
              }
            });

            setUpgradeOptions(upgrades);
            setDowngradeOptions(downgrades);

            // Load available modules not yet purchased
            try {
              const available = await subscriptionService.getAvailablePackages(user.id);
              const modules = available.filter(p => p.category === 'module');
              setAvailableModulePlans(modules);
            } catch (e) {
              console.warn('Failed to load available modules', e);
            }

            // Load drive plans (for switch-to-drive)
            try {
              const allDrive = await subscriptionService.getPackagesByCategory('drive');
              setDrivePlans(allDrive);
            } catch (e) {
              console.warn('Failed to load drive plans', e);
            }
          
            // Load featured add-ons
            try {
              const [addons, teams, storage] = await Promise.all([
                subscriptionService.getPackagesByCategory('addon'),
                subscriptionService.getPackagesByCategory('team'),
                subscriptionService.getPackagesByCategory('storage')
              ]);
              setEntityAddon(addons.find(p => p.id === 'addon-add-entity') || null);
              setTeamPlan(teams.find(p => p.id === 'team-basic') || null);
              setStoragePlan(storage.find(p => p.id === 'storage-professional') || null);
            } catch (e) {
              console.warn('Failed to load featured add-ons', e);
            }
          }
        }
      } catch (error) {
        console.error('Error loading subscription data:', error);
        toast.error('Failed to load subscription options');
      } finally {
        setLoading(false);
      }
    };

    loadSubscriptionData();
  }, [user, subscriptionId, billingCycle]);

  const calculateProration = (priceDifference: number, nextBillingDate?: Date): number => {
    if (!nextBillingDate) return priceDifference;
    
    const now = new Date();
    const daysRemaining = Math.ceil((nextBillingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const daysInMonth = 30; // Simplified calculation
    
    return (priceDifference * daysRemaining) / daysInMonth;
  };

  const getUpgradeBenefits = (currentPlan: SubscriptionPlan, newPlan: SubscriptionPlan): string[] => {
    const benefits: string[] = [];
    
    if (newPlan.maxUsers && currentPlan.maxUsers && newPlan.maxUsers > currentPlan.maxUsers) {
      benefits.push(`Increased user limit: ${currentPlan.maxUsers} → ${newPlan.maxUsers}`);
    }
    
    if (newPlan.storage && currentPlan.storage) {
      benefits.push(`More storage: ${currentPlan.storage} → ${newPlan.storage}`);
    }
    
    // Compare features
    const newFeatures = newPlan.features.filter(feature => !currentPlan.features.includes(feature));
    benefits.push(...newFeatures.map(feature => `New feature: ${feature}`));
    
    return benefits;
  };

  const getDowngradeLimitations = (currentPlan: SubscriptionPlan, newPlan: SubscriptionPlan): string[] => {
    const limitations: string[] = [];
    
    if (newPlan.maxUsers && currentPlan.maxUsers && newPlan.maxUsers < currentPlan.maxUsers) {
      limitations.push(`Reduced user limit: ${currentPlan.maxUsers} → ${newPlan.maxUsers}`);
    }
    
    if (newPlan.storage && currentPlan.storage) {
      limitations.push(`Less storage: ${currentPlan.storage} → ${newPlan.storage}`);
    }
    
    // Compare features
    const lostFeatures = currentPlan.features.filter(feature => !newPlan.features.includes(feature));
    limitations.push(...lostFeatures.map(feature => `Lost feature: ${feature}`));
    
    return limitations;
  };

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleSelectOption = (option: UpgradeDowngradeOption) => {
    setSelectedOption(option);
    setShowConfirmDialog(true);
  };

  const handleConfirmChange = async () => {
    if (!selectedOption || !currentSubscription) return;

    setProcessing(true);
    try {
      // Note: effectiveTiming ('immediate' | 'next_cycle') is respected by platform rules (mocked here).
      // Service signature accepts (subscriptionId, newPlanId)
      const result = selectedOption.type === 'upgrade' 
        ? await subscriptionService.upgradeSubscription(currentSubscription.id, selectedOption.plan.id)
        : await subscriptionService.downgradeSubscription(currentSubscription.id, selectedOption.plan.id);

      if (result.success) {
        toast.success(`Subscription ${selectedOption.type}d successfully`);
        navigate(`/subscription/${currentSubscription.id}/details`);
      } else {
        toast.error(`Failed to ${selectedOption.type} subscription`);
      }
    } catch (error) {
      console.error('Subscription change error:', error);
      toast.error(`Failed to ${selectedOption.type} subscription`);
    } finally {
      setProcessing(false);
      setShowConfirmDialog(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'drive': return <Package className="h-5 w-5" />;
      case 'storage': return <Database className="h-5 w-5" />;
      case 'team': return <Users className="h-5 w-5" />;
      case 'addon': return <Zap className="h-5 w-5" />;
      case 'module': return <Package className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  const renderAddonCard = (
    plan: SubscriptionPlan,
    opts: { subtitle: string; cta: string; badgeText?: string; icon?: 'building' | 'users' | 'database' | 'zap' }
  ) => {
    const price = billingCycle === 'annual' ? plan.pricing.annual / 12 : plan.pricing.monthly;
    const iconEl = (() => {
      switch (opts.icon) {
        case 'building': return <Building className="h-5 w-5" />;
        case 'users': return <Users className="h-5 w-5" />;
        case 'database': return <Database className="h-5 w-5" />;
        case 'zap': return <Zap className="h-5 w-5" />;
        default: return getCategoryIcon(plan.category);
      }
    })();
    return (
      <Card key={plan.id} className="rounded-xl hover:shadow-md transition-all">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-indigo-700">
            {iconEl}
          </div>
          <CardTitle className="text-base">{plan.title}</CardTitle>
          <CardDescription>{opts.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-3xl font-bold">{formatCurrency(price)}</div>
            <div className="text-gray-600 -mt-1">per month</div>
            {opts.badgeText && (
              <Badge className="mt-2 bg-green-100 text-green-800">{opts.badgeText}</Badge>
            )}
          </div>
          <Button
            className="w-full"
            onClick={() => navigate(`/subscription/browse?category=${plan.category}&select=${plan.id}`)}
          >
            + {opts.cta}
          </Button>
        </CardContent>
      </Card>
    );
  };

  const renderPlanCard = (option: UpgradeDowngradeOption) => {
    const { plan, type, priceDifference, prorationAmount } = option;
    const currentPrice = billingCycle === 'annual' ? plan.pricing.annual / 12 : plan.pricing.monthly;
    
    return (
      <Card key={plan.id} className={`relative h-full hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 rounded-xl ${plan.popular ? 'ring-2 ring-indigo-500' : 'border-gray-200'}`}>
        {plan.popular && (
          <div className="absolute -top-3 left-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-indigo-600 text-white shadow-sm">
              <Star className="h-3 w-3" /> Most Popular
            </span>
          </div>
        )}
        
        <CardHeader className="text-center pb-3">
          <div className="flex items-center justify-center mb-2 text-indigo-700">
            {getCategoryIcon(plan.category)}
            <Badge variant="outline" className="ml-2 text-[10px] uppercase tracking-wide">
              {type === 'upgrade' ? 'Upgrade' : 'Downgrade'}
            </Badge>
          </div>
          <CardTitle className="text-lg font-semibold text-gray-900">{plan.name}</CardTitle>
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-bold">
                {formatCurrency(currentPrice)}
              </span>
              <span className="text-gray-600">/month</span>
            </div>
            <div className={`text-sm font-medium flex items-center justify-center gap-2 ${type === 'upgrade' ? 'text-red-600' : 'text-green-600'}`}>
              {type === 'upgrade' ? '+' : '-'}{formatCurrency(priceDifference)} per month
              {prorationAmount !== 0 && (
                <span
                  className="text-xs text-gray-600 bg-gray-100 border border-gray-200 rounded-full px-2 py-0.5"
                  title={`Prorated ${type === 'upgrade' ? 'charge' : 'credit'} applied if change is immediate: ${formatCurrency(Math.abs(prorationAmount))}`}
                >
                  <Info className="h-3 w-3 inline mr-1" /> Proration
                </span>
              )}
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-1">{plan.shortDescription}</p>
        </CardHeader>
        
        <CardContent className="space-y-5 flex flex-col">
          <div className="space-y-2">
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

          {option.benefits && option.benefits.length > 0 && (
            <div className="pt-4 border-t">
              <h4 className="font-medium text-green-600 mb-2">Benefits:</h4>
              <div className="space-y-1">
                {option.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle className="h-3 w-3" />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          )}

          {option.limitations && option.limitations.length > 0 && (
            <div className="pt-4 border-t">
              <h4 className="font-medium text-orange-600 mb-2">Limitations:</h4>
              <div className="space-y-1">
                {option.limitations.map((limitation, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-orange-700">
                    <AlertCircle className="h-3 w-3" />
                    {limitation}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="pt-2 mt-auto">
            <Button 
              onClick={() => handleSelectOption(option)} 
              className="w-full"
              variant={type === 'upgrade' ? 'default' : 'outline'}
            >
              {type === 'upgrade' ? (
                <>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Upgrade to This Plan
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4 mr-2" />
                  Downgrade to This Plan
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
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

  if (!currentSubscription) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-6">
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Subscription not found</h3>
            <p className="text-gray-600">The subscription you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/subscription')} className="mt-4">
              Back to Subscriptions
            </Button>
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
              onClick={() => navigate(`/subscription/${subscriptionId}/details`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Upgrade or Downgrade</h1>
              <p className="text-muted-foreground">
                Change your subscription plan to better fit your needs
              </p>
            </div>
          </div>
        </div>

        {/* Current Plan Info */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
                <p className="text-2xl font-bold text-blue-600 mt-1">{currentSubscription.plan.name}</p>
                <p className="text-gray-600 mt-1">
                  {formatCurrency(billingCycle === 'annual' ? currentSubscription.plan.pricing.annual / 12 : currentSubscription.plan.pricing.monthly)}/month
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Next billing date</p>
                <p className="font-medium">
                  {currentSubscription.nextBillingDate ? 
                    new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }).format(currentSubscription.nextBillingDate) : 
                    'N/A'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

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

        {/* Options Tabs */}
        <Tabs defaultValue="upgrade" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upgrade" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Upgrade Options ({upgradeOptions.length})
            </TabsTrigger>
            <TabsTrigger value="downgrade" className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Downgrade Options ({downgradeOptions.length})
            </TabsTrigger>
          </TabsList>

          {/* Upgrade Options */}
          <TabsContent value="upgrade" className="space-y-6">
            {/* Add Modules, Switch to Drive, Add-ons quick actions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <CardTitle className="text-lg">Upgrade Paths</CardTitle>
                    <CardDescription>Select how you want to enhance your subscription</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Sort</span>
                    <select
                      className="text-sm border rounded-md px-2 py-1 bg-white"
                      value={upgradeSort}
                      onChange={(e) => setUpgradeSort(e.target.value as 'recommended' | 'price_asc' | 'price_desc')}
                    >
                      <option value="recommended">Recommended</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add more modules */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Add more modules</div>
                    <Badge>Modules</Badge>
                  </div>
                  {availableModulePlans.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {availableModulePlans.map(mod => {
                        const checked = selectedModuleIds.has(mod.id);
                        const price = billingCycle === 'annual' ? mod.pricing.annual / 12 : mod.pricing.monthly;
                        return (
                          <label key={mod.id} className="flex items-start gap-3 border rounded-lg p-3 cursor-pointer">
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(v) => {
                                setSelectedModuleIds(prev => {
                                  const next = new Set(prev);
                                  if (v) next.add(mod.id); else next.delete(mod.id);
                                  return next;
                                });
                              }}
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{mod.title}</span>
                                <span className="text-sm text-gray-600">{formatCurrency(price)}/month</span>
                              </div>
                              <div className="text-xs text-gray-500">{mod.shortDescription}</div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">No additional modules available to add.</div>
                  )}
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-sm">
                      Selected modules: <span className="font-medium">{selectedModuleIds.size}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedModuleIds(new Set())}
                        disabled={selectedModuleIds.size === 0}
                      >
                        Clear
                      </Button>
                      <Button
                        onClick={() => navigate('/subscription?tab=individual')}
                        disabled={selectedModuleIds.size === 0}
                      >
                        Continue to Purchase
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Switch to Drive */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-10">
                    <div className="font-medium">Drive (Subject to the Qualification)</div>
                    <Badge>Drive</Badge>
                  </div>
                  {drivePlans.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {drivePlans.map(plan => {
                        const targetPrice = billingCycle === 'annual' ? plan.pricing.annual / 12 : plan.pricing.monthly;
                        const currentPrice = currentSubscription ? (billingCycle === 'annual' ? currentSubscription.plan.pricing.annual / 12 : currentSubscription.plan.pricing.monthly) : 0;
                        const diff = targetPrice - currentPrice;
                        const syntheticOption: UpgradeDowngradeOption = {
                          plan,
                          type: diff > 0 ? 'upgrade' : 'downgrade',
                          priceDifference: Math.abs(diff),
                          prorationAmount: calculateProration(diff, currentSubscription?.nextBillingDate),
                          effectiveDate: new Date(),
                          benefits: currentSubscription ? getUpgradeBenefits(currentSubscription.plan, plan) : [],
                        };
                        return renderPlanCard(syntheticOption);
                      })}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">No Drive plans available.</div>
                  )}
                </div>

                {/* Purchase add-ons */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Purchase additional add-ons</div>
                      <div className="text-sm text-gray-600">Storage capacity, AI, Team members, Add entity</div>
                    </div>
                    <Button variant="secondary" onClick={() => navigate('/subscription/browse?tab=addons')}>
                      Browse Add-ons
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {entityAddon && renderAddonCard(entityAddon, { subtitle: 'Increase active entity capacity', cta: 'Add Entity', icon: 'building' })}
                    {teamPlan && renderAddonCard(teamPlan, { subtitle: 'Essential team and roles management', cta: 'Add Team & Roles', icon: 'users' })}
                    {storagePlan && renderAddonCard(storagePlan, { subtitle: 'Advanced cloud storage expansion', cta: 'Add Storage', badgeText: 'Save 20%', icon: 'database' })}
                  </div>
                </div>
              </CardContent>
            </Card>

          </TabsContent>

          {/* Downgrade Options */}
          <TabsContent value="downgrade" className="space-y-6">
            {/* Remove unneeded modules/features UI */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Remove modules at renewal</CardTitle>
                <CardDescription>
                  Deselect modules or features you no longer need. Changes may apply at the next billing cycle, and must respect usage limits.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentSubscription?.plan.moduleIds && currentSubscription.plan.moduleIds.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentSubscription.plan.moduleIds.map(mid => (
                      <label key={mid} className="flex items-start gap-3 border rounded-lg p-3">
                        <Checkbox />
                        <div className="flex-1">
                          <div className="font-medium">Module: {mid}</div>
                          <div className="text-xs text-gray-500">Unselect to remove at renewal (subject to limits)</div>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">Your current plan does not list individual modules to remove.</div>
                )}
                <div className="flex items-center justify-end">
                  <Button variant="outline" onClick={() => toast.info('Module removals are applied at renewal after validation against usage limits.')}>Apply at Renewal</Button>
                </div>
              </CardContent>
            </Card>

            {downgradeOptions.length > 0 ? (
              <>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <p className="text-yellow-800 font-medium">Important Notice</p>
                  </div>
                  <p className="text-yellow-700 text-sm mt-1">
                    Downgrading may result in loss of features and data. Please review the limitations carefully before proceeding.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {downgradeOptions.map(option => renderPlanCard(option))}
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Package className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900">No downgrade options available</p>
                  <p className="text-gray-500">You're already on the lowest tier plan.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Confirm {selectedOption?.type === 'upgrade' ? 'Upgrade' : 'Downgrade'}
              </DialogTitle>
              <DialogDescription>
                You are about to {selectedOption?.type} your subscription to {selectedOption?.plan.name}
              </DialogDescription>
            </DialogHeader>
            
            {selectedOption && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span>Current Plan:</span>
                    <span className="font-medium">{currentSubscription.plan.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>New Plan:</span>
                    <span className="font-medium">{selectedOption.plan.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price Change:</span>
                    <span className={`font-medium ${selectedOption.type === 'upgrade' ? 'text-red-600' : 'text-green-600'}`}>
                      {selectedOption.type === 'upgrade' ? '+' : '-'}{formatCurrency(selectedOption.priceDifference)}/month
                    </span>
                  </div>
                  {selectedOption.prorationAmount !== 0 && effectiveTiming === 'immediate' && (
                    <div className="flex justify-between">
                      <span>Prorated {selectedOption.type === 'upgrade' ? 'Charge' : 'Credit'}:</span>
                      <span className="font-medium">
                        {formatCurrency(Math.abs(selectedOption.prorationAmount))}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span>Effective:</span>
                    <RadioGroup
                      value={effectiveTiming}
                      onValueChange={(v) => setEffectiveTiming(v as 'immediate' | 'next_cycle')}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id="eff-immediate" value="immediate" />
                        <Label htmlFor="eff-immediate">Immediately</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id="eff-next" value="next_cycle" />
                        <Label htmlFor="eff-next">Next Billing Cycle</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {selectedOption.type === 'downgrade' && selectedOption.limitations && selectedOption.limitations.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 mb-2">Please note the following limitations:</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      {selectedOption.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <AlertCircle className="h-3 w-3" />
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmChange} disabled={processing}>
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    {selectedOption?.type === 'upgrade' ? (
                      <TrendingUp className="h-4 w-4 mr-2" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-2" />
                    )}
                    Confirm {selectedOption?.type === 'upgrade' ? 'Upgrade' : 'Downgrade'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionUpgradeDowngrade;
