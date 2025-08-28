import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { subscriptionService, SubscriptionSettings, UserSubscription } from '@/services/subscriptionService';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Bell, 
  CreditCard, 
  Shield, 
  Clock, 
  Mail, 
  Smartphone, 
  Globe, 
  Save,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Info,
  Calendar,
  DollarSign,
  Package,
  Users,
  Database,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SubscriptionSettingsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SubscriptionSettings | null>(null);
  const [userSubscriptions, setUserSubscriptions] = useState<UserSubscription[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        if (user?.id) {
          const [userSettings, subscriptions] = await Promise.all([
            subscriptionService.getSubscriptionSettings(user.id),
            subscriptionService.getUserSubscriptions(user.id)
          ]);
          setSettings(userSettings);
          setUserSubscriptions(subscriptions);
        }
      } catch (error) {
        console.error('Error loading subscription settings:', error);
        toast.error('Failed to load subscription settings');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  const handleSettingChange = (key: keyof SubscriptionSettings, value: string | boolean | object) => {
    if (!settings) return;
    
    setSettings(prev => ({
      ...prev!,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleModuleSettingChange = (moduleId: string, key: string, value: string | boolean) => {
    if (!settings) return;
    
    setSettings(prev => ({
      ...prev!,
      moduleSpecificSettings: {
        ...prev!.moduleSpecificSettings,
        [moduleId]: {
          ...prev!.moduleSpecificSettings[moduleId],
          [key]: value
        }
      }
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    if (!settings || !user?.id) return;

    setSaving(true);
    try {
      const success = await subscriptionService.updateSubscriptionSettings(user.id, settings);
      if (success) {
        setHasChanges(false);
        toast.success('Settings saved successfully');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const getModuleIcon = (moduleId: string) => {
    switch (moduleId) {
      case 'entity-management': return <Users className="h-4 w-4" />;
      case 'work-orders': return <Package className="h-4 w-4" />;
      case 'service-requests': return <Package className="h-4 w-4" />;
      case 'meetings': return <Calendar className="h-4 w-4" />;
      case 'claims': return <Shield className="h-4 w-4" />;
      case 'notifications': return <Bell className="h-4 w-4" />;
      case 'workspace': return <Database className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getModuleName = (moduleId: string) => {
    switch (moduleId) {
      case 'entity-management': return 'Entity Management';
      case 'work-orders': return 'Work Orders';
      case 'service-requests': return 'Service Requests';
      case 'meetings': return 'Meetings';
      case 'claims': return 'Claims';
      case 'notifications': return 'Notifications';
      case 'workspace': return 'Workspace';
      default: return moduleId;
    }
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

  if (!settings) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-6">
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Settings not found</h3>
            <p className="text-gray-600">Unable to load subscription settings.</p>
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
              onClick={() => navigate('/subscription')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Subscription Settings</h1>
              <p className="text-muted-foreground">
                Manage your subscription preferences and notifications
              </p>
            </div>
          </div>
          {hasChanges && (
            <Button onClick={handleSaveSettings} disabled={saving}>
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          )}
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  General Preferences
                </CardTitle>
                <CardDescription>
                  Configure your global subscription settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Auto-Renewal</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically renew subscriptions before they expire
                    </p>
                  </div>
                  <Switch
                    checked={settings.globalAutoRenewal}
                    onCheckedChange={(checked) => handleSettingChange('globalAutoRenewal', checked)}
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-base font-medium">Default Payment Method</Label>
                  <Select 
                    value={settings.defaultPaymentMethod} 
                    onValueChange={(value) => handleSettingChange('defaultPaymentMethod', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card-4242">Visa •••• 4242</SelectItem>
                      <SelectItem value="paypal">PayPal (user@company.com)</SelectItem>
                      <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-base font-medium">Preferred Currency</Label>
                  <Select 
                    value={settings.preferredCurrency} 
                    onValueChange={(value) => handleSettingChange('preferredCurrency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="GBP">British Pound (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-base font-medium">Billing Cycle Preference</Label>
                  <Select 
                    value={settings.billingCyclePreference} 
                    onValueChange={(value) => handleSettingChange('billingCyclePreference', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select billing cycle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="annual">Annual (Save 20%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Settings */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Billing & Payment Settings
                </CardTitle>
                <CardDescription>
                  Manage your billing preferences and payment options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Automatic Payment</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically charge your default payment method for renewals
                    </p>
                  </div>
                  <Switch
                    checked={settings.automaticPayment}
                    onCheckedChange={(checked) => handleSettingChange('automaticPayment', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Payment Retry</Label>
                    <p className="text-sm text-muted-foreground">
                      Retry failed payments automatically for 3 days
                    </p>
                  </div>
                  <Switch
                    checked={settings.paymentRetry}
                    onCheckedChange={(checked) => handleSettingChange('paymentRetry', checked)}
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-base font-medium">Invoice Delivery</Label>
                  <Select 
                    value={settings.invoiceDelivery} 
                    onValueChange={(value) => handleSettingChange('invoiceDelivery', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select delivery method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email Only</SelectItem>
                      <SelectItem value="portal">Portal Only</SelectItem>
                      <SelectItem value="both">Email + Portal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-base font-medium">Billing Contact Email</Label>
                  <Input
                    type="email"
                    value={settings.billingEmail}
                    onChange={(e) => handleSettingChange('billingEmail', e.target.value)}
                    placeholder="Enter billing email address"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Active Subscriptions */}
            <Card>
              <CardHeader>
                <CardTitle>Active Subscriptions</CardTitle>
                <CardDescription>
                  Manage auto-renewal settings for individual subscriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userSubscriptions.map((subscription) => (
                    <div key={subscription.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Package className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{subscription.plan.name}</p>
                          <p className="text-sm text-gray-600">
                            Next billing: {subscription.nextBillingDate ? 
                              new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }).format(subscription.nextBillingDate) : 
                              'N/A'
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">
                            ₹{subscription.billingCycle === 'annual' ? subscription.plan.pricing.annual / 12 : subscription.plan.pricing.monthly}/month
                          </p>
                          <p className="text-sm text-gray-600 capitalize">{subscription.billingCycle}</p>
                        </div>
                        <Switch
                          checked={subscription.autoRenewal}
                          onCheckedChange={(checked) => {
                            // Update subscription auto-renewal
                            setUserSubscriptions(prev => prev.map(sub => 
                              sub.id === subscription.id ? { ...sub, autoRenewal: checked } : sub
                            ));
                            setHasChanges(true);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Control how and when you receive subscription-related notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive subscription updates via email
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) => handleSettingChange('notifications', { ...settings.notifications, email: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive important alerts via SMS
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.sms}
                      onCheckedChange={(checked) => handleSettingChange('notifications', { ...settings.notifications, sms: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">In-App Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Show notifications within the application
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.inApp}
                      onCheckedChange={(checked) => handleSettingChange('notifications', { ...settings.notifications, inApp: checked })}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Notification Types</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Renewal Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified before subscription renewals
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.renewalReminders}
                      onCheckedChange={(checked) => handleSettingChange('notifications', { ...settings.notifications, renewalReminders: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Payment Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Notifications for successful and failed payments
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.paymentAlerts}
                      onCheckedChange={(checked) => handleSettingChange('notifications', { ...settings.notifications, paymentAlerts: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Feature Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Learn about new features and improvements
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.featureUpdates}
                      onCheckedChange={(checked) => handleSettingChange('notifications', { ...settings.notifications, featureUpdates: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Usage Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Notifications when approaching plan limits
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.usageAlerts}
                      onCheckedChange={(checked) => handleSettingChange('notifications', { ...settings.notifications, usageAlerts: checked })}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-base font-medium">Notification Frequency</Label>
                  <Select 
                    value={settings.notificationFrequency} 
                    onValueChange={(value) => handleSettingChange('notificationFrequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                      <SelectItem value="weekly">Weekly Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Module-Specific Settings */}
          <TabsContent value="modules" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Module-Specific Settings
                </CardTitle>
                <CardDescription>
                  Configure settings for individual modules and features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(settings.moduleSpecificSettings).map(([moduleId, moduleSettings]) => (
                    <div key={moduleId} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-4">
                        {getModuleIcon(moduleId)}
                        <h4 className="font-medium">{getModuleName(moduleId)}</h4>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Auto-Renewal</Label>
                            <p className="text-sm text-muted-foreground">
                              Automatically renew this module
                            </p>
                          </div>
                          <Switch
                            checked={moduleSettings.autoRenewal}
                            onCheckedChange={(checked) => handleModuleSettingChange(moduleId, 'autoRenewal', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Usage Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                              Get notified about usage limits for this module
                            </p>
                          </div>
                          <Switch
                            checked={moduleSettings.usageNotifications}
                            onCheckedChange={(checked) => handleModuleSettingChange(moduleId, 'usageNotifications', checked)}
                          />
                        </div>

                        {moduleSettings.billingCycle && (
                          <div className="space-y-2">
                            <Label>Billing Cycle</Label>
                            <Select 
                              value={moduleSettings.billingCycle} 
                              onValueChange={(value) => handleModuleSettingChange(moduleId, 'billingCycle', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="annual">Annual</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Changes Footer */}
        {hasChanges && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  <p className="text-blue-800 font-medium">You have unsaved changes</p>
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      window.location.reload();
                    }}
                  >
                    Discard Changes
                  </Button>
                  <Button onClick={handleSaveSettings} disabled={saving}>
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionSettingsPage;
