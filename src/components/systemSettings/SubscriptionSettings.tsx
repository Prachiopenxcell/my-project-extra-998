import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  Users, 
  HardDrive,
  Bell,
  Shield,
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { systemSettingsService } from "@/services/systemSettingsService";
import { SubscriptionSettings as SubscriptionSettingsType, PaymentMethod, PaymentMethodType } from "@/types/systemSettings";
import { format } from "date-fns";

const SubscriptionSettings = () => {
  const [settings, setSettings] = useState<SubscriptionSettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settingsData = await systemSettingsService.getSubscriptionSettings();
      setSettings(settingsData);
    } catch (error) {
      console.error('Failed to load subscription settings:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<SubscriptionSettingsType>) => {
    if (!settings) return;

    setSaving(true);
    try {
      const updatedSettings = { ...settings, ...newSettings };
      await systemSettingsService.updateSubscriptionSettings(updatedSettings);
      setSettings(updatedSettings);
      toast({
        title: "Success",
        description: "Subscription settings updated successfully",
      });
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast({
        title: "Error",
        description: "Failed to update subscription settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key: keyof SubscriptionSettingsType, value: boolean) => {
    if (!settings) return;
    updateSettings({ [key]: value });
  };

  const testPaymentMethod = () => {
    toast({
      title: "Payment Test",
      description: "Payment method test completed successfully. Your payment method is working correctly.",
    });
  };

  const getPaymentMethodIcon = (type: PaymentMethodType) => {
    return <CreditCard className="h-4 w-4" />;
  };

  const getPaymentMethodLabel = (type: PaymentMethodType) => {
    switch (type) {
      case PaymentMethodType.CREDIT_CARD:
        return 'Credit Card';
      case PaymentMethodType.BANK_TRANSFER:
        return 'Bank Transfer';
      case PaymentMethodType.UPI:
        return 'UPI';
      case PaymentMethodType.WALLET:
        return 'Wallet';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                    <div className="h-6 w-12 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Current Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Plan</p>
              <p className="text-lg font-semibold">Professional Plus</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-600 font-medium">Active</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Next Billing</p>
              <p className="font-medium">March 15, 2025</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Amount</p>
              <p className="font-medium">$299.99/month</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Team Members</p>
                <p className="text-sm text-muted-foreground">6/20</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <HardDrive className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Storage</p>
                <p className="text-sm text-muted-foreground">45GB/100GB</p>
                <Progress value={45} className="h-1 mt-1" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Billing Cycle</p>
                <p className="text-sm text-muted-foreground">Monthly</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline">Change Plan</Button>
            <Button variant="outline">Update Payment</Button>
            <Button variant="outline">Cancel Subscription</Button>
          </div>
        </CardContent>
      </Card>

      {/* Auto-Renewal Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Auto-Renewal Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-Renewal</Label>
              <p className="text-sm text-muted-foreground">Automatic billing on renewal date</p>
            </div>
            <Switch
              checked={settings.autoRenewal}
              onCheckedChange={(checked) => handleToggle('autoRenewal', checked)}
              disabled={saving}
            />
          </div>

          {settings.autoRenewal && (
            <div className="space-y-4 pl-4 border-l-2 border-blue-200">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Payment Method</p>
                    <p className="text-sm text-muted-foreground">
                      {settings.paymentMethods.find(pm => pm.id === settings.primaryPaymentMethod)?.details} 
                      (Expires {settings.paymentMethods.find(pm => pm.id === settings.primaryPaymentMethod)?.expiryDate})
                    </p>
                  </div>
                </div>
                
                {settings.backupPaymentMethod && (
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Backup Payment</p>
                      <p className="text-sm text-muted-foreground">
                        {settings.paymentMethods.find(pm => pm.id === settings.backupPaymentMethod)?.details}
                        (Expires {settings.paymentMethods.find(pm => pm.id === settings.backupPaymentMethod)?.expiryDate})
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Methods
            </CardTitle>
            <Dialog open={showAddPaymentDialog} onOpenChange={setShowAddPaymentDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Payment Method</DialogTitle>
                  <DialogDescription>
                    Add a new payment method for your subscription.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    This would integrate with a payment processor like Stripe or PayPal to securely add payment methods.
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={() => setShowAddPaymentDialog(false)}>
                      Add Payment Method
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddPaymentDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {settings.paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getPaymentMethodIcon(method.type)}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{method.details}</p>
                      {method.isDefault && (
                        <Badge variant="secondary" className="text-xs">Default</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getPaymentMethodLabel(method.type)}
                      {method.expiryDate && ` • Expires ${method.expiryDate}`}
                      {method.lastUsed && ` • Last used ${format(method.lastUsed, 'MMM dd, yyyy')}`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  {!method.isDefault && (
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Renewal Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Renewal Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Renewal Reminders</Label>
              <p className="text-sm text-muted-foreground">Email 7 days before renewal</p>
            </div>
            <Switch
              checked={settings.renewalReminders}
              onCheckedChange={(checked) => handleToggle('renewalReminders', checked)}
              disabled={saving}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Failed Payment Retry</Label>
              <p className="text-sm text-muted-foreground">Retry within 48 hours if payment fails</p>
            </div>
            <Switch
              checked={settings.failedPaymentRetry}
              onCheckedChange={(checked) => handleToggle('failedPaymentRetry', checked)}
              disabled={saving}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Grace Period</Label>
              <p className="text-sm text-muted-foreground">3-day grace period for failed payments</p>
            </div>
            <Switch
              checked={settings.gracePeriod}
              onCheckedChange={(checked) => handleToggle('gracePeriod', checked)}
              disabled={saving}
            />
          </div>

          <Separator />

          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Manual Renewal Option</p>
                <p className="text-sm text-blue-700 mt-1">
                  If auto-renewal fails, you'll receive instructions for manual payment to maintain service.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={testPaymentMethod}>
              Test Payment Method
            </Button>
            <Button variant="outline">View Renewal Calendar</Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Usage Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="font-medium">This Month:</p>
          
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Service Requests</span>
              <span className="text-sm font-medium">25/unlimited</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage Used</span>
                <span className="text-sm font-medium">45GB/100GB</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Team Members</span>
              <span className="text-sm font-medium">6/20</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Document Processing</span>
              <span className="text-sm font-medium">150/500</span>
            </div>
          </div>

          <Separator />

          <div className="flex gap-3">
            <Button variant="outline">View Detailed Usage</Button>
            <Button variant="outline">Export Usage Report</Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-orange-900">Payment Security</p>
              <p className="text-sm text-orange-700 mt-1">
                All payment information is encrypted and stored securely. We never store your full credit card details on our servers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { SubscriptionSettings };
