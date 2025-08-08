import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Check, 
  ArrowLeft,
  Shield,
  Calendar,
  Package,
  Star,
  Lock,
  AlertCircle,
  CheckCircle,
  Clock,
  Gift,
  Percent
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface PurchaseItem {
  id: string;
  name: string;
  type: 'plan' | 'addon';
  price: number;
  originalPrice?: number;
  currency: string;
  billingCycle: 'monthly' | 'annual';
  description: string;
  features: string[];
  trial?: boolean;
  trialDays?: number;
}

interface PaymentMethod {
  id: string;
  type: string;
  last4?: string;
  brand?: string;
  email?: string;
}

const SubscriptionPurchase = () => {
  const navigate = useNavigate();
  const { type, itemId } = useParams();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  const [item, setItem] = useState<PurchaseItem | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [useNewPaymentMethod, setUseNewPaymentMethod] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: "pm-001",
      type: "Visa",
      last4: "4242",
      brand: "visa"
    },
    {
      id: "pm-002",
      type: "PayPal",
      email: "user@company.com"
    }
  ]);

  const [newPaymentMethod, setNewPaymentMethod] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    saveCard: true
  });

  useEffect(() => {
    // Simulate API call to fetch item details
    const fetchItem = async () => {
      setLoading(true);
      
      // Mock data based on itemId and type
      let mockItem: PurchaseItem;
      
      if (type === 'plan' && itemId === 'professional') {
        mockItem = {
          id: 'professional',
          name: 'Professional Plan',
          type: 'plan',
          price: 99.99,
          originalPrice: 129.99,
          currency: 'USD',
          billingCycle: 'monthly',
          description: 'Most popular choice for growing professional service firms',
          features: [
            'Unlimited entities',
            'Advanced meeting management',
            '100GB storage',
            'Priority support',
            'Custom templates',
            'Advanced reporting',
            'API access',
            'Team collaboration tools'
          ],
          trial: true,
          trialDays: 30
        };
      } else if (type === 'addon' && itemId === 'ai-assistant') {
        mockItem = {
          id: 'ai-assistant',
          name: 'AI Assistant',
          type: 'addon',
          price: 29.99,
          currency: 'USD',
          billingCycle: 'monthly',
          description: 'Intelligent automation and insights powered by advanced AI',
          features: [
            'Smart document analysis',
            'Automated task suggestions',
            'Intelligent meeting summaries',
            'Predictive analytics'
          ]
        };
      } else {
        // Default fallback
        mockItem = {
          id: 'basic',
          name: 'Basic Plan',
          type: 'plan',
          price: 49.99,
          currency: 'USD',
          billingCycle: 'monthly',
          description: 'Perfect for small teams getting started',
          features: [
            'Up to 5 entities',
            'Basic meeting management',
            '10GB storage',
            'Email support'
          ],
          trial: true,
          trialDays: 14
        };
      }

      setTimeout(() => {
        setItem(mockItem);
        setLoading(false);
      }, 1000);
    };

    fetchItem();
  }, [type, itemId]);

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getAnnualPrice = (monthlyPrice: number) => {
    return monthlyPrice * 12 * 0.8; // 20% discount for annual
  };

  const getCurrentPrice = () => {
    if (!item) return 0;
    const basePrice = billingCycle === 'annual' ? getAnnualPrice(item.price) : item.price;
    return basePrice - discount;
  };

  const getAnnualSavings = () => {
    if (!item) return 0;
    return item.price * 12 - getAnnualPrice(item.price);
  };

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'save20') {
      setDiscount(getCurrentPrice() * 0.2);
      setPromoApplied(true);
    } else {
      setDiscount(0);
      setPromoApplied(false);
    }
  };

  const handlePurchase = async () => {
    if (!acceptTerms) {
      alert('Please accept the terms and conditions');
      return;
    }

    if (!selectedPaymentMethod && !useNewPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    setProcessing(true);
    
    // Simulate purchase process
    setTimeout(() => {
      setProcessing(false);
      // Navigate to success page or subscription management
      navigate('/subscription?purchase=success');
    }, 3000);
  };

  const handleStartTrial = () => {
    // Simulate trial start
    navigate('/subscription?trial=started');
  };

  if (loading || !item) {
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

  return (
    <DashboardLayout userType="service_provider">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/subscription/browse')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Plans
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Complete Your Purchase</h1>
            <p className="text-gray-600">Subscribe to {item.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plan Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {item.type === 'plan' ? 'Subscription Plan' : 'Add-on'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {formatCurrency(
                        billingCycle === 'annual' ? getAnnualPrice(item.price) / 12 : item.price
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      per {billingCycle === 'annual' ? 'month (billed annually)' : 'month'}
                    </div>
                  </div>
                </div>

                {/* Billing Cycle Toggle */}
                {item.type === 'plan' && (
                  <div className="space-y-3">
                    <Label>Billing Cycle</Label>
                    <RadioGroup 
                      value={billingCycle} 
                      onValueChange={(value: 'monthly' | 'annual') => setBillingCycle(value)}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <Label htmlFor="monthly" className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">Monthly</p>
                              <p className="text-sm text-gray-600">Pay monthly, cancel anytime</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{formatCurrency(item.price)}/month</p>
                            </div>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="annual" id="annual" />
                        <Label htmlFor="annual" className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium flex items-center gap-2">
                                Annual
                                <Badge className="bg-green-100 text-green-800">Save 20%</Badge>
                              </p>
                              <p className="text-sm text-gray-600">
                                Save {formatCurrency(getAnnualSavings())} per year
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                {formatCurrency(getAnnualPrice(item.price) / 12)}/month
                              </p>
                              <p className="text-sm text-gray-500 line-through">
                                {formatCurrency(item.price)}/month
                              </p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {/* Features */}
                <div>
                  <Label className="text-base">What's included:</Label>
                  <div className="mt-2 space-y-2">
                    {item.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Promo Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Promo Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    onClick={handleApplyPromo}
                    disabled={!promoCode}
                  >
                    Apply
                  </Button>
                </div>
                {promoApplied && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Promo code applied! You save {formatCurrency(discount)}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Existing Payment Methods */}
                {paymentMethods.length > 0 && (
                  <div className="space-y-3">
                    <Label>Select existing payment method:</Label>
                    <RadioGroup 
                      value={selectedPaymentMethod} 
                      onValueChange={setSelectedPaymentMethod}
                    >
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                          <RadioGroupItem value={method.id} id={method.id} />
                          <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <CreditCard className="h-4 w-4" />
                              <span>
                                {method.type} {method.last4 ? `•••• ${method.last4}` : `(${method.email})`}
                              </span>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="new-payment" 
                        checked={useNewPaymentMethod}
                        onCheckedChange={(checked) => setUseNewPaymentMethod(checked as boolean)}
                      />
                      <Label htmlFor="new-payment">Use a new payment method</Label>
                    </div>
                  </div>
                )}

                {/* New Payment Method Form */}
                {(useNewPaymentMethod || paymentMethods.length === 0) && (
                  <div className="space-y-4 pt-4 border-t">
                    <Label>Add new payment method:</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label>Cardholder Name</Label>
                        <Input 
                          placeholder="John Doe"
                          value={newPaymentMethod.cardholderName}
                          onChange={(e) => setNewPaymentMethod({
                            ...newPaymentMethod,
                            cardholderName: e.target.value
                          })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Card Number</Label>
                        <Input 
                          placeholder="1234 5678 9012 3456"
                          value={newPaymentMethod.cardNumber}
                          onChange={(e) => setNewPaymentMethod({
                            ...newPaymentMethod,
                            cardNumber: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <Label>Expiry Month</Label>
                        <Select 
                          value={newPaymentMethod.expiryMonth} 
                          onValueChange={(value) => setNewPaymentMethod({
                            ...newPaymentMethod,
                            expiryMonth: value
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="MM" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                                {(i + 1).toString().padStart(2, '0')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Expiry Year</Label>
                        <Select 
                          value={newPaymentMethod.expiryYear} 
                          onValueChange={(value) => setNewPaymentMethod({
                            ...newPaymentMethod,
                            expiryYear: value
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="YYYY" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => (
                              <SelectItem key={2024 + i} value={(2024 + i).toString()}>
                                {2024 + i}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2">
                        <Label>CVV</Label>
                        <Input 
                          placeholder="123"
                          maxLength={4}
                          value={newPaymentMethod.cvv}
                          onChange={(e) => setNewPaymentMethod({
                            ...newPaymentMethod,
                            cvv: e.target.value
                          })}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="save-card" 
                        checked={newPaymentMethod.saveCard}
                        onCheckedChange={(checked) => setNewPaymentMethod({
                          ...newPaymentMethod,
                          saveCard: checked as boolean
                        })}
                      />
                      <Label htmlFor="save-card">Save this card for future purchases</Label>
                    </div>
                  </div>
                )}
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
                    and{' '}
                    <a href="/privacy" className="text-blue-600 hover:underline" target="_blank">
                      Privacy Policy
                    </a>
                    . I understand that my subscription will automatically renew unless cancelled.
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>{item.name}</span>
                    <span>
                      {formatCurrency(
                        billingCycle === 'annual' ? getAnnualPrice(item.price) : item.price
                      )}
                    </span>
                  </div>
                  
                  {billingCycle === 'annual' && (
                    <div className="flex justify-between text-green-600">
                      <span>Annual discount (20%)</span>
                      <span>-{formatCurrency(getAnnualSavings())}</span>
                    </div>
                  )}
                  
                  {promoApplied && discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Promo discount</span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax</span>
                    <span>{formatCurrency(getCurrentPrice() * 0.1)}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(getCurrentPrice() + (getCurrentPrice() * 0.1))}</span>
                </div>
                
                {billingCycle === 'annual' && (
                  <p className="text-sm text-gray-600">
                    Billed annually. Next billing date: {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </p>
                )}

                <div className="space-y-3 pt-4">
                  {item.trial && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleStartTrial}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Start {item.trialDays}-Day Free Trial
                    </Button>
                  )}
                  
                  <Button 
                    className="w-full" 
                    onClick={handlePurchase}
                    disabled={processing || !acceptTerms}
                  >
                    {processing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Complete Purchase
                      </>
                    )}
                  </Button>
                </div>

                {/* Security Notice */}
                <div className="flex items-center gap-2 text-xs text-gray-600 pt-4 border-t">
                  <Shield className="h-3 w-3" />
                  <span>Secure 256-bit SSL encryption</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionPurchase;
