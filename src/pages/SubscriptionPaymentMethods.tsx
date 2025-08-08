import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  CreditCard, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X,
  ArrowLeft,
  Shield,
  AlertCircle,
  CheckCircle,
  Calendar,
  Building,
  Globe,
  Lock,
  Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'paypal' | 'crypto';
  isDefault: boolean;
  isActive: boolean;
  // Card specific
  cardNumber?: string;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  cardholderName?: string;
  // Bank specific
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  // PayPal specific
  email?: string;
  // Crypto specific
  walletAddress?: string;
  currency?: string;
  // Common
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  addedDate: string;
  lastUsed?: string;
}

const SubscriptionPaymentMethods = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState<string | null>(null);
  const [newMethodType, setNewMethodType] = useState<'card' | 'bank' | 'paypal' | 'crypto'>('card');

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "pm-001",
      type: "card",
      isDefault: true,
      isActive: true,
      cardNumber: "**** **** **** 4242",
      last4: "4242",
      brand: "Visa",
      expiryMonth: 12,
      expiryYear: 2027,
      cardholderName: "John Doe",
      billingAddress: {
        street: "123 Business St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "United States"
      },
      addedDate: "2024-01-15",
      lastUsed: "2024-01-15"
    },
    {
      id: "pm-002",
      type: "paypal",
      isDefault: false,
      isActive: true,
      email: "john.doe@company.com",
      addedDate: "2023-11-20",
      lastUsed: "2023-12-15"
    },
    {
      id: "pm-003",
      type: "bank",
      isDefault: false,
      isActive: false,
      bankName: "Chase Bank",
      accountNumber: "****1234",
      routingNumber: "021000021",
      addedDate: "2023-10-05"
    }
  ]);

  const [newMethod, setNewMethod] = useState<Partial<PaymentMethod>>({
    type: 'card',
    isDefault: false,
    isActive: true
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'card': return <CreditCard className="h-5 w-5" />;
      case 'bank': return <Building className="h-5 w-5" />;
      case 'paypal': return <Globe className="h-5 w-5" />;
      case 'crypto': return <Shield className="h-5 w-5" />;
      default: return <CreditCard className="h-5 w-5" />;
    }
  };

  const getMethodTitle = (method: PaymentMethod) => {
    switch (method.type) {
      case 'card':
        return `${method.brand} •••• ${method.last4}`;
      case 'bank':
        return `${method.bankName} •••• ${method.accountNumber?.slice(-4)}`;
      case 'paypal':
        return `PayPal (${method.email})`;
      case 'crypto':
        return `${method.currency} Wallet`;
      default:
        return 'Payment Method';
    }
  };

  const getMethodSubtitle = (method: PaymentMethod) => {
    switch (method.type) {
      case 'card':
        return `Expires ${method.expiryMonth}/${method.expiryYear}`;
      case 'bank':
        return `Routing: ${method.routingNumber}`;
      case 'paypal':
        return 'PayPal Account';
      case 'crypto':
        return method.walletAddress?.slice(0, 20) + '...';
      default:
        return '';
    }
  };

  const handleSetDefault = (methodId: string) => {
    setPaymentMethods(methods => 
      methods.map(method => ({
        ...method,
        isDefault: method.id === methodId
      }))
    );
  };

  const handleToggleActive = (methodId: string) => {
    setPaymentMethods(methods => 
      methods.map(method => 
        method.id === methodId 
          ? { ...method, isActive: !method.isActive }
          : method
      )
    );
  };

  const handleDeleteMethod = (methodId: string) => {
    if (confirm("Are you sure you want to delete this payment method?")) {
      setPaymentMethods(methods => 
        methods.filter(method => method.id !== methodId)
      );
    }
  };

  const handleAddMethod = () => {
    const newId = `pm-${Date.now()}`;
    const methodToAdd: PaymentMethod = {
      ...newMethod as PaymentMethod,
      id: newId,
      addedDate: new Date().toISOString().split('T')[0]
    };
    
    setPaymentMethods(methods => [...methods, methodToAdd]);
    setNewMethod({ type: 'card', isDefault: false, isActive: true });
    setShowAddForm(false);
  };

  const renderAddMethodForm = () => {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Add New Payment Method</CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowAddForm(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Method Type Selection */}
          <div className="space-y-2">
            <Label>Payment Method Type</Label>
            <Select 
              value={newMethodType} 
              onValueChange={(value: 'card' | 'bank' | 'paypal' | 'crypto') => {
                setNewMethodType(value);
                setNewMethod({ ...newMethod, type: value });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Credit/Debit Card</SelectItem>
                <SelectItem value="bank">Bank Account</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="crypto">Cryptocurrency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Card Form */}
          {newMethodType === 'card' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label>Cardholder Name</Label>
                <Input 
                  placeholder="John Doe"
                  value={newMethod.cardholderName || ''}
                  onChange={(e) => setNewMethod({ ...newMethod, cardholderName: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label>Card Number</Label>
                <Input 
                  placeholder="1234 5678 9012 3456"
                  value={newMethod.cardNumber || ''}
                  onChange={(e) => setNewMethod({ ...newMethod, cardNumber: e.target.value })}
                />
              </div>
              <div>
                <Label>Expiry Month</Label>
                <Select 
                  value={newMethod.expiryMonth?.toString() || ''} 
                  onValueChange={(value) => setNewMethod({ ...newMethod, expiryMonth: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {(i + 1).toString().padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Expiry Year</Label>
                <Select 
                  value={newMethod.expiryYear?.toString() || ''} 
                  onValueChange={(value) => setNewMethod({ ...newMethod, expiryYear: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Year" />
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
            </div>
          )}

          {/* PayPal Form */}
          {newMethodType === 'paypal' && (
            <div>
              <Label>PayPal Email</Label>
              <Input 
                type="email"
                placeholder="your.email@example.com"
                value={newMethod.email || ''}
                onChange={(e) => setNewMethod({ ...newMethod, email: e.target.value })}
              />
            </div>
          )}

          {/* Bank Form */}
          {newMethodType === 'bank' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label>Bank Name</Label>
                <Input 
                  placeholder="Chase Bank"
                  value={newMethod.bankName || ''}
                  onChange={(e) => setNewMethod({ ...newMethod, bankName: e.target.value })}
                />
              </div>
              <div>
                <Label>Account Number</Label>
                <Input 
                  placeholder="1234567890"
                  value={newMethod.accountNumber || ''}
                  onChange={(e) => setNewMethod({ ...newMethod, accountNumber: e.target.value })}
                />
              </div>
              <div>
                <Label>Routing Number</Label>
                <Input 
                  placeholder="021000021"
                  value={newMethod.routingNumber || ''}
                  onChange={(e) => setNewMethod({ ...newMethod, routingNumber: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Crypto Form */}
          {newMethodType === 'crypto' && (
            <div className="space-y-4">
              <div>
                <Label>Cryptocurrency</Label>
                <Select 
                  value={newMethod.currency || ''} 
                  onValueChange={(value) => setNewMethod({ ...newMethod, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select cryptocurrency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                    <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                    <SelectItem value="USDC">USD Coin (USDC)</SelectItem>
                    <SelectItem value="USDT">Tether (USDT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Wallet Address</Label>
                <Input 
                  placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                  value={newMethod.walletAddress || ''}
                  onChange={(e) => setNewMethod({ ...newMethod, walletAddress: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Default Setting */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label>Set as Default Payment Method</Label>
              <p className="text-sm text-gray-600">Use this method for future payments</p>
            </div>
            <Switch 
              checked={newMethod.isDefault || false}
              onCheckedChange={(checked) => setNewMethod({ ...newMethod, isDefault: checked })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleAddMethod} className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowAddForm(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout userType="service_provider">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/subscription/billing')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Billing
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment Methods</h1>
              <p className="text-gray-600">Manage your payment methods and billing preferences</p>
            </div>
          </div>
          {!showAddForm && (
            <Button 
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Payment Method
            </Button>
          )}
        </div>

        {/* Security Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Lock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Secure Payment Processing</h3>
                <p className="text-blue-700 text-sm">
                  All payment information is encrypted and processed securely. We never store your full card details.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Method Form */}
        {showAddForm && renderAddMethodForm()}

        {/* Payment Methods List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Payment Methods</h2>
          
          {paymentMethods.map((method) => (
            <Card key={method.id} className={`${method.isDefault ? 'ring-2 ring-blue-500' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${
                      method.isActive ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {getMethodIcon(method.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{getMethodTitle(method)}</h3>
                        {method.isDefault && (
                          <Badge className="bg-blue-100 text-blue-800">
                            <Star className="h-3 w-3 mr-1" />
                            Default
                          </Badge>
                        )}
                        <Badge className={method.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {method.isActive ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{getMethodSubtitle(method)}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span>Added: {formatDate(method.addedDate)}</span>
                        {method.lastUsed && (
                          <span>Last used: {formatDate(method.lastUsed)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSetDefault(method.id)}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleToggleActive(method.id)}
                    >
                      {method.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setEditingMethod(method.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteMethod(method.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Billing Address */}
                {method.billingAddress && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Billing Address</h4>
                    <p className="text-sm text-gray-600">
                      {method.billingAddress.street}, {method.billingAddress.city}, {method.billingAddress.state} {method.billingAddress.zipCode}, {method.billingAddress.country}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {paymentMethods.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Payment Methods</h3>
                <p className="text-gray-600 mb-4">Add a payment method to start managing your subscriptions</p>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Payment Method
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionPaymentMethods;
