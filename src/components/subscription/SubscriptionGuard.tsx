import React from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Lock, 
  Package, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  Star,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SubscriptionGuardProps {
  moduleId: string;
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

export const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({
  moduleId,
  children,
  fallbackTitle,
  fallbackDescription
}) => {
  const { hasModuleAccess, getModuleAccess, purchaseModule, loading } = useSubscription();
  const navigate = useNavigate();
  const [purchasing, setPurchasing] = React.useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking subscription status...</p>
        </div>
      </div>
    );
  }

  const hasAccess = hasModuleAccess(moduleId);
  
  if (hasAccess) {
    return <>{children}</>;
  }

  const moduleAccess = getModuleAccess(moduleId);
  const moduleName = moduleAccess?.name || fallbackTitle || 'This Module';
  const moduleDescription = fallbackDescription || 'Access premium features and functionality';

  const handlePurchase = async () => {
    setPurchasing(true);
    try {
      const success = await purchaseModule(moduleId, 'professional');
      if (success) {
        toast.success('Module purchased successfully!');
        // The component will re-render and show the children due to updated subscription state
      } else {
        toast.error('Failed to purchase module. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred during purchase.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleViewPlans = () => {
    navigate('/subscription/browse');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Lock className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Subscription Required
          </h1>
          <p className="text-muted-foreground text-lg">
            Unlock {moduleName} to access premium features
          </p>
        </div>

        {/* Module Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle className="text-xl">{moduleName}</CardTitle>
                  <p className="text-muted-foreground mt-1">{moduleDescription}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-amber-600 border-amber-200">
                <Clock className="h-3 w-3 mr-1" />
                {moduleAccess?.expiryDate ? 'Expired' : 'Not Subscribed'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {moduleAccess?.features && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  Features Included
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {moduleAccess.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Purchase */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Quick Purchase
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">$99.99</div>
                <div className="text-sm text-muted-foreground">per month</div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Full module access
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Priority support
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Regular updates
                </li>
              </ul>
              <Button 
                onClick={handlePurchase} 
                className="w-full" 
                disabled={purchasing}
              >
                {purchasing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Purchase Now
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* View All Plans */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Explore Plans
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Compare different subscription plans and find the perfect fit for your needs.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Multiple pricing tiers
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Bundle discounts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Free trial available
                </li>
              </ul>
              <Button 
                onClick={handleViewPlans} 
                variant="outline" 
                className="w-full"
              >
                <Package className="h-4 w-4 mr-2" />
                View All Plans
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Need help choosing the right plan?{' '}
            <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/contact')}>
              Contact our sales team
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};
