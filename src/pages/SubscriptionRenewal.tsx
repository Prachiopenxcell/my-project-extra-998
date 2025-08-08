import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  RefreshCw, 
  ArrowLeft,
  Calendar,
  CreditCard,
  Package,
  CheckCircle,
  AlertTriangle,
  Clock,
  Shield,
  Star,
  Zap
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface SubscriptionRenewal {
  id: string;
  name: string;
  type: string;
  currentEndDate: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'annual';
  features: string[];
  status: 'expiring' | 'expired';
  daysUntilExpiry: number;
  autoRenewal: boolean;
  paymentMethod: {
    type: string;
    last4?: string;
    brand?: string;
  };
}

const SubscriptionRenewal = () => {
  const navigate = useNavigate();
  const { subscriptionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionRenewal | null>(null);
  const [renewalPeriod, setRenewalPeriod] = useState<'1-month' | '3-months' | '6-months' | '1-year'>('1-month');
  const [enableAutoRenewal, setEnableAutoRenewal] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch subscription details
    const fetchSubscription = async () => {
      setLoading(true);
      
      // Mock data based on subscriptionId
      const mockSubscription: SubscriptionRenewal = {
        id: subscriptionId || "sub-003",
        name: "Storage Extension",
        type: "Add-on Service",
        currentEndDate: "2024-12-01",
        price: 49.99,
        currency: "USD",
        billingCycle: "monthly",
        features: [
          "500GB Additional Storage",
          "Advanced File Management",
          "Version Control",
          "Enhanced Security"
        ],
        status: "expiring",
        daysUntilExpiry: 15,
        autoRenewal: false,
        paymentMethod: {
          type: "Visa",
          last4: "4242",
          brand: "visa"
        }
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
      month: 'long',
      day: 'numeric'
    });
  };

  const getRenewalPrice = () => {
    if (!subscription) return 0;
    
    const basePrice = subscription.price;
    switch (renewalPeriod) {
      case '1-month':
        return basePrice;
      case '3-months':
        return basePrice * 3 * 0.95; // 5% discount
      case '6-months':
        return basePrice * 6 * 0.9; // 10% discount
      case '1-year':
        return basePrice * 12 * 0.8; // 20% discount
      default:
        return basePrice;
    }
  };

  const getRenewalDiscount = () => {
    if (!subscription) return 0;
    
    const basePrice = subscription.price;
    const totalWithoutDiscount = (() => {
      switch (renewalPeriod) {
        case '1-month': return basePrice;
        case '3-months': return basePrice * 3;
        case '6-months': return basePrice * 6;
        case '1-year': return basePrice * 12;
        default: return basePrice;
      }
    })();
    
    return totalWithoutDiscount - getRenewalPrice();
  };

  const getNewExpiryDate = () => {
    if (!subscription) return '';
    
    const currentEnd = new Date(subscription.currentEndDate);
    const monthsToAdd = (() => {
      switch (renewalPeriod) {
        case '1-month': return 1;
        case '3-months': return 3;
        case '6-months': return 6;
        case '1-year': return 12;
        default: return 1;
      }
    })();
    
    const newDate = new Date(currentEnd);
    newDate.setMonth(newDate.getMonth() + monthsToAdd);
    return newDate.toISOString().split('T')[0];
  };

  const getPeriodLabel = () => {
    switch (renewalPeriod) {
      case '1-month': return '1 Month';
      case '3-months': return '3 Months';
      case '6-months': return '6 Months';
      case '1-year': return '1 Year';
      default: return '1 Month';
    }
  };

  const getDiscountLabel = () => {
    switch (renewalPeriod) {
      case '3-months': return 'Save 5%';
      case '6-months': return 'Save 10%';
      case '1-year': return 'Save 20%';
      default: return '';
    }
  };

  const handleRenewal = async () => {
    if (!acceptTerms) {
      alert('Please accept the terms and conditions');
      return;
    }

    setProcessing(true);
    
    // Simulate renewal process
    setTimeout(() => {
      setProcessing(false);
      // Navigate back to subscription management with success message
      navigate('/subscription?renewal=success');
    }, 3000);
  };

  if (loading || !subscription) {
    return (
      <DashboardLayout userType="service_provider">
        <div className="container mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const isExpired = subscription.status === 'expired';
  const isExpiringSoon = subscription.daysUntilExpiry <= 7;

  return (
    <DashboardLayout userType="service_provider">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/subscription')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Subscriptions
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Renew Subscription</h1>
            <p className="text-gray-600">{subscription.name}</p>
          </div>
        </div>

        {/* Status Alert */}
        <Card className={`${isExpired ? 'bg-red-50 border-red-200' : isExpiringSoon ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'}`}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${isExpired ? 'bg-red-100' : isExpiringSoon ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                {isExpired ? (
                  <AlertTriangle className={`h-5 w-5 text-red-600`} />
                ) : isExpiringSoon ? (
                  <Clock className={`h-5 w-5 text-yellow-600`} />
                ) : (
                  <RefreshCw className={`h-5 w-5 text-blue-600`} />
                )}
              </div>
              <div>
                <h3 className={`font-semibold ${isExpired ? 'text-red-900' : isExpiringSoon ? 'text-yellow-900' : 'text-blue-900'}`}>
                  {isExpired ? 'Subscription Expired' : isExpiringSoon ? 'Subscription Expiring Soon' : 'Subscription Renewal'}
                </h3>
                <p className={`text-sm ${isExpired ? 'text-red-700' : isExpiringSoon ? 'text-yellow-700' : 'text-blue-700'}`}>
                  {isExpired 
                    ? `Your subscription expired on ${formatDate(subscription.currentEndDate)}. Renew now to restore access.`
                    : `Your subscription expires on ${formatDate(subscription.currentEndDate)} (${subscription.daysUntilExpiry} days remaining).`
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Renewal Options */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Subscription Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Current Subscription
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{subscription.name}</h3>
                    <p className="text-gray-600">{subscription.type}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {formatCurrency(subscription.price)}
                    </div>
                    <div className="text-sm text-gray-600">per month</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-base">Features included:</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {subscription.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Current End Date:</span>
                      <span className="ml-2 font-medium">{formatDate(subscription.currentEndDate)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="ml-2 font-medium">
                        {subscription.paymentMethod.type} •••• {subscription.paymentMethod.last4}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Renewal Period Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Choose Renewal Period</CardTitle>
                <p className="text-sm text-gray-600">Select how long you'd like to renew your subscription</p>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={renewalPeriod} 
                  onValueChange={(value: '1-month' | '3-months' | '6-months' | '1-year') => setRenewalPeriod(value)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="1-month" id="1-month" />
                    <Label htmlFor="1-month" className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">1 Month</p>
                          <p className="text-sm text-gray-600">Standard monthly billing</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(subscription.price)}</p>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="3-months" id="3-months" />
                    <Label htmlFor="3-months" className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium flex items-center gap-2">
                            3 Months
                            <Badge className="bg-green-100 text-green-800">Save 5%</Badge>
                          </p>
                          <p className="text-sm text-gray-600">Quarterly billing with discount</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(subscription.price * 3 * 0.95)}</p>
                          <p className="text-sm text-gray-500 line-through">
                            {formatCurrency(subscription.price * 3)}
                          </p>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="6-months" id="6-months" />
                    <Label htmlFor="6-months" className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium flex items-center gap-2">
                            6 Months
                            <Badge className="bg-green-100 text-green-800">Save 10%</Badge>
                          </p>
                          <p className="text-sm text-gray-600">Semi-annual billing with better discount</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(subscription.price * 6 * 0.9)}</p>
                          <p className="text-sm text-gray-500 line-through">
                            {formatCurrency(subscription.price * 6)}
                          </p>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border rounded-lg border-blue-200 bg-blue-50">
                    <RadioGroupItem value="1-year" id="1-year" />
                    <Label htmlFor="1-year" className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium flex items-center gap-2">
                            1 Year
                            <Badge className="bg-blue-100 text-blue-800">
                              <Star className="h-3 w-3 mr-1" />
                              Best Value - Save 20%
                            </Badge>
                          </p>
                          <p className="text-sm text-gray-600">Annual billing with maximum savings</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(subscription.price * 12 * 0.8)}</p>
                          <p className="text-sm text-gray-500 line-through">
                            {formatCurrency(subscription.price * 12)}
                          </p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Auto-Renewal Setting */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Enable Auto-Renewal</h4>
                    <p className="text-sm text-gray-600">
                      Automatically renew your subscription to avoid service interruption
                    </p>
                  </div>
                  <Checkbox 
                    checked={enableAutoRenewal}
                    onCheckedChange={(checked) => setEnableAutoRenewal(checked as boolean)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed">
                    I agree to the{' '}
                    <a href="/terms" className="text-blue-600 hover:underline" target="_blank">
                      Terms of Service
                    </a>{' '}
                    and understand that my subscription will be renewed for the selected period.
                    {enableAutoRenewal && ' Auto-renewal can be disabled at any time in subscription settings.'}
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Renewal Summary */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Renewal Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>{subscription.name}</span>
                    <span>{formatCurrency(subscription.price)}/month</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Renewal Period:</span>
                    <span className="font-medium">{getPeriodLabel()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(getRenewalPrice() + getRenewalDiscount())}</span>
                  </div>
                  
                  {getRenewalDiscount() > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({getDiscountLabel()}):</span>
                      <span>-{formatCurrency(getRenewalDiscount())}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax (10%):</span>
                    <span>{formatCurrency(getRenewalPrice() * 0.1)}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>{formatCurrency(getRenewalPrice() + (getRenewalPrice() * 0.1))}</span>
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <strong>New expiry date:</strong> {formatDate(getNewExpiryDate())}
                  </p>
                  <p>
                    <strong>Payment method:</strong> {subscription.paymentMethod.type} •••• {subscription.paymentMethod.last4}
                  </p>
                  {enableAutoRenewal && (
                    <p>
                      <strong>Auto-renewal:</strong> Enabled for {getPeriodLabel().toLowerCase()} periods
                    </p>
                  )}
                </div>

                <div className="space-y-3 pt-4">
                  <Button 
                    className="w-full" 
                    onClick={handleRenewal}
                    disabled={processing || !acceptTerms}
                  >
                    {processing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing Renewal...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Renew Subscription
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/subscription')}
                  >
                    Cancel
                  </Button>
                </div>

                {/* Security Notice */}
                <div className="flex items-center gap-2 text-xs text-gray-600 pt-4 border-t">
                  <Shield className="h-3 w-3" />
                  <span>Secure payment processing</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionRenewal;
