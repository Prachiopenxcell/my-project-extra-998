import React from 'react';
import { SubscriptionPlan } from '@/services/subscriptionService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  X, 
  Star, 
  Zap, 
  Crown, 
  Shield, 
  Users, 
  Database, 
  Headphones,
  TrendingUp,
  Sparkles
} from 'lucide-react';

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  onPurchase: (planId: string) => void;
  onStartTrial?: (planId: string) => void;
  canPurchase: boolean;
  isPopular?: boolean;
  isRecommended?: boolean;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  plan,
  onPurchase,
  onStartTrial,
  canPurchase,
  isPopular = false,
  isRecommended = false
}) => {
  const getSubscriptionIcon = (type: string) => {
    switch (type) {
      case 'drive': return <Zap className="w-5 h-5" />;
      case 'data-storage': return <Database className="w-5 h-5" />;
      case 'team-management': return <Users className="w-5 h-5" />;
      case 'premium-addon': return <Crown className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'drive': return 'text-blue-600 bg-blue-50';
      case 'data-storage': return 'text-green-600 bg-green-50';
      case 'team-management': return 'text-purple-600 bg-purple-50';
      case 'premium-addon': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  const getDiscountPercentage = () => {
    if (plan.pricing.annual && plan.pricing.monthly) {
      const monthlyYearly = plan.pricing.monthly * 12;
      const discount = ((monthlyYearly - plan.pricing.annual) / monthlyYearly) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  const discountPercent = getDiscountPercentage();

  return (
    <Card className={`relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
      isPopular ? 'ring-2 ring-blue-500 shadow-lg' : ''
    } ${isRecommended ? 'ring-2 ring-purple-500 shadow-lg' : ''}`}>
      {/* Popular/Recommended Badge */}
      {(isPopular || isRecommended) && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <Badge className={`px-3 py-1 text-xs font-semibold ${
            isPopular ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'
          }`}>
            {isPopular && (
              <>
                <Star className="w-3 h-3 mr-1" />
                Most Popular
              </>
            )}
            {isRecommended && (
              <>
                <Sparkles className="w-3 h-3 mr-1" />
                Recommended
              </>
            )}
          </Badge>
        </div>
      )}

      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg ${getTypeColor(plan.subscriptionType)}`}>
            {getSubscriptionIcon(plan.subscriptionType)}
          </div>
          {plan.trial && (
            <Badge variant="outline" className="text-green-600 border-green-200">
              Free Trial
            </Badge>
          )}
        </div>
        
        <div className="space-y-2">
          <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
          <CardDescription className="text-sm text-gray-600 line-clamp-2">
            {plan.description}
          </CardDescription>
        </div>

        {/* Pricing */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              {formatPrice(plan.pricing.monthly || plan.pricing.annual || 0, plan.currency)}
            </span>
            <span className="text-sm text-gray-500">
              /{plan.pricing.monthly ? 'month' : 'year'}
            </span>
          </div>
          
          {discountPercent > 0 && plan.pricing.annual && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(plan.pricing.monthly! * 12, plan.currency)}/year
              </span>
              <Badge variant="secondary" className="text-green-600 bg-green-50">
                Save {discountPercent}%
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Key Features */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-gray-900 uppercase tracking-wide">
            What's Included
          </h4>
          <ul className="space-y-2">
            {plan.features.slice(0, 5).map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
            {plan.features.length > 5 && (
              <li className="text-sm text-gray-500 pl-6">
                +{plan.features.length - 5} more features
              </li>
            )}
          </ul>
        </div>

        {/* Limitations (if any) */}
        {plan.limitations && plan.limitations.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-gray-900 uppercase tracking-wide">
              Limitations
            </h4>
            <ul className="space-y-2">
              {plan.limitations.slice(0, 3).map((limitation, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <X className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">{limitation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Usage Limits */}
        {plan.usageLimits && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-gray-900 uppercase tracking-wide">
              Usage Limits
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {Object.entries(plan.usageLimits).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-medium text-gray-900">
                    {value === -1 ? 'Unlimited' : value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          {plan.trial && onStartTrial && (
            <Button
              onClick={() => onStartTrial(plan.id)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2.5 transition-all duration-200"
              disabled={!canPurchase}
            >
              <Zap className="w-4 h-4 mr-2" />
              Start Free Trial
            </Button>
          )}
          
          <Button
            onClick={() => onPurchase(plan.id)}
            variant={plan.trial ? "outline" : "default"}
            className={`w-full font-semibold py-2.5 transition-all duration-200 ${
              !plan.trial ? 'bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white' : ''
            }`}
            disabled={!canPurchase}
          >
            {plan.trial ? 'Choose Plan' : 'Get Started'}
            {!canPurchase && (
              <span className="ml-2 text-xs">(Contact Admin)</span>
            )}
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-1">
              <Headphones className="w-3 h-3" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
