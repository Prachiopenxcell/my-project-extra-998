import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { subscriptionService, UserSubscription, SubscriptionPermissions } from '@/services/subscriptionService';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  CreditCard, 
  Bell, 
  Shield, 
  RefreshCw,
  Save,
  AlertCircle,
  CheckCircle,
  Mail,
  Smartphone,
  Calendar,
  DollarSign,
  Users,
  Database,
  Zap
} from 'lucide-react';

interface SubscriptionPreferences {
  autoRenewal: boolean;
  renewalReminder: boolean;
  reminderDays: number;
  billingNotifications: boolean;
  usageAlerts: boolean;
  usageThreshold: number;
  marketingEmails: boolean;
  productUpdates: boolean;
  securityAlerts: boolean;
  preferredCurrency: string;
  billingCycle: 'monthly' | 'annual';
  paymentMethod: string;
}

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  inApp: boolean;
}

const SubscriptionSettings = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [permissions, setPermissions] = useState<SubscriptionPermissions | null>(null);
  const [preferences, setPreferences] = useState<SubscriptionPreferences>({
    autoRenewal: true,
    renewalReminder: true,
    reminderDays: 7,
    billingNotifications: true,
    usageAlerts: true,
    usageThreshold: 80,
    marketingEmails: false,
    productUpdates: true,
    securityAlerts: true,
    preferredCurrency: 'USD',
    billingCycle: 'monthly',
    paymentMethod: 'Visa •••• 4242'
  });
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: true,
    sms: false,
    inApp: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const userSubscriptions = await subscriptionService.getUserSubscriptions(user.id);
        const userPermissions = subscriptionService.getSubscriptionPermissions(user.role);
        
        setSubscriptions(userSubscriptions);
        setPermissions(userPermissions);
        
        // In a real app, load user preferences from API
        // For now, using default values
      } catch (error) {
        console.error('Failed to load subscription settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  const handlePreferenceChange = <K extends keyof SubscriptionPreferences>(
    key: K,
    value: SubscriptionPreferences[K]
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value as SubscriptionPreferences[K],
    }));
  };

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // In a real app, save settings to API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleBulkAutoRenewal = async (enabled: boolean) => {
    try {
      for (const subscription of subscriptions.filter(sub => sub.status === 'active')) {
        await subscriptionService.updateAutoRenewal(subscription.id, enabled);
      }
      
      setSubscriptions(prev => prev.map(sub => 
        sub.status === 'active' ? { ...sub, autoRenewal: enabled } : sub
      ));
    } catch (error) {
      console.error('Failed to update auto-renewal settings:', error);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
  const totalMonthlySpend = activeSubscriptions.reduce((total, sub) => 
    total + (sub.billingCycle === 'monthly' ? sub.price : sub.price / 12), 0
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Subscription Settings</h1>
            <p className="text-muted-foreground">
              Manage your subscription preferences and notifications
            </p>
          </div>
          <Button onClick={handleSaveSettings} disabled={saving}>
            {saving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>

        {/* Save Success Alert */}
        {saveSuccess && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Your subscription settings have been saved successfully.
            </AlertDescription>
          </Alert>
        )}

        {/* Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <Zap className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeSubscriptions.length}</div>
              <p className="text-xs text-muted-foreground">
                {activeSubscriptions.filter(sub => sub.autoRenewal).length} with auto-renewal
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPrice(totalMonthlySpend, preferences.preferredCurrency)}
              </div>
              <p className="text-xs text-muted-foreground">
                Estimated monthly cost
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payment Method</CardTitle>
              <CreditCard className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{preferences.paymentMethod}</div>
              <p className="text-xs text-muted-foreground">
                Primary payment method
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Auto-Renewal Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Auto-Renewal Settings
            </CardTitle>
            <CardDescription>
              Manage automatic renewal for your subscriptions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bulk Auto-Renewal */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label className="text-base font-medium">Enable Auto-Renewal for All</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically renew all active subscriptions
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkAutoRenewal(true)}
                  disabled={!permissions?.canUpgradeDowngrade}
                >
                  Enable All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkAutoRenewal(false)}
                  disabled={!permissions?.canUpgradeDowngrade}
                >
                  Disable All
                </Button>
              </div>
            </div>

            {/* Individual Subscription Auto-Renewal */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Individual Subscription Settings</Label>
              {activeSubscriptions.map((subscription) => (
                <div key={subscription.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{subscription.plan.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(subscription.price, subscription.currency)} / {subscription.billingCycle}
                    </p>
                  </div>
                  <Switch
                    checked={subscription.autoRenewal}
                    onCheckedChange={(checked) => 
                      subscriptionService.updateAutoRenewal(subscription.id, checked)
                        .then(() => {
                          setSubscriptions(prev => prev.map(sub => 
                            sub.id === subscription.id ? { ...sub, autoRenewal: checked } : sub
                          ));
                        })
                    }
                    disabled={!permissions?.canUpgradeDowngrade}
                  />
                </div>
              ))}
            </div>

            {/* Renewal Reminders */}
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Renewal Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified before subscriptions renew
                  </p>
                </div>
                <Switch
                  checked={preferences.renewalReminder}
                  onCheckedChange={(checked) => handlePreferenceChange('renewalReminder', checked)}
                />
              </div>
              
              {preferences.renewalReminder && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="reminderDays">Remind me</Label>
                  <Select 
                    value={preferences.reminderDays.toString()} 
                    onValueChange={(value) => handlePreferenceChange('reminderDays', parseInt(value))}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day before</SelectItem>
                      <SelectItem value="3">3 days before</SelectItem>
                      <SelectItem value="7">1 week before</SelectItem>
                      <SelectItem value="14">2 weeks before</SelectItem>
                      <SelectItem value="30">1 month before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Choose how you want to receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Notification Types */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Billing Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Payment confirmations, failed payments, invoices
                  </p>
                </div>
                <Switch
                  checked={preferences.billingNotifications}
                  onCheckedChange={(checked) => handlePreferenceChange('billingNotifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Usage Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications when approaching plan limits
                  </p>
                </div>
                <Switch
                  checked={preferences.usageAlerts}
                  onCheckedChange={(checked) => handlePreferenceChange('usageAlerts', checked)}
                />
              </div>
              
              {preferences.usageAlerts && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="usageThreshold">Alert when usage reaches</Label>
                  <Select 
                    value={preferences.usageThreshold.toString()} 
                    onValueChange={(value) => handlePreferenceChange('usageThreshold', parseInt(value))}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50">50%</SelectItem>
                      <SelectItem value="75">75%</SelectItem>
                      <SelectItem value="80">80%</SelectItem>
                      <SelectItem value="90">90%</SelectItem>
                      <SelectItem value="95">95%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Product Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    New features, improvements, and announcements
                  </p>
                </div>
                <Switch
                  checked={preferences.productUpdates}
                  onCheckedChange={(checked) => handlePreferenceChange('productUpdates', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Security Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Account security and login notifications
                  </p>
                </div>
                <Switch
                  checked={preferences.securityAlerts}
                  onCheckedChange={(checked) => handlePreferenceChange('securityAlerts', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Promotional offers and marketing communications
                  </p>
                </div>
                <Switch
                  checked={preferences.marketingEmails}
                  onCheckedChange={(checked) => handlePreferenceChange('marketingEmails', checked)}
                />
              </div>
            </div>

            <Separator />

            {/* Notification Channels */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Notification Channels</Label>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>Email Notifications</span>
                </div>
                <Switch
                  checked={notificationSettings.email}
                  onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <span>SMS Notifications</span>
                </div>
                <Switch
                  checked={notificationSettings.sms}
                  onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  <span>In-App Notifications</span>
                </div>
                <Switch
                  checked={notificationSettings.inApp}
                  onCheckedChange={(checked) => handleNotificationChange('inApp', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Billing Preferences
            </CardTitle>
            <CardDescription>
              Manage your billing and payment settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="currency">Preferred Currency</Label>
                <Select 
                  value={preferences.preferredCurrency} 
                  onValueChange={(value) => handlePreferenceChange('preferredCurrency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="billingCycle">Default Billing Cycle</Label>
                <Select 
                  value={preferences.billingCycle} 
                  onValueChange={(value: 'monthly' | 'annual') => handlePreferenceChange('billingCycle', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="annual">Annual (Save 20%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span>{preferences.paymentMethod}</span>
                </div>
                <Button variant="outline" size="sm">
                  Update
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Additional security options for your subscriptions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Security alerts are always enabled and cannot be disabled for account protection.
              </AlertDescription>
            </Alert>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Require confirmation for cancellations</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra step when cancelling subscriptions
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Require confirmation for upgrades</Label>
                <p className="text-sm text-muted-foreground">
                  Confirm before upgrading to higher-tier plans
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionSettings;
