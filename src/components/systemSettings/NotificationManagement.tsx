import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Monitor, 
  Clock, 
  Volume2,
  VolumeX,
  Moon,
  Settings
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { systemSettingsService } from "@/services/systemSettingsService";
import { NotificationPreferences } from "@/types/systemSettings";
import { useAuth } from "@/contexts/AuthContext";

const NotificationManagement = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadPreferences = useCallback(async () => {
    try {
      // Mock enhanced notification preferences with role-specific options
      const mockPrefs: NotificationPreferences = {
        email: {
          serviceUpdates: true,
          paymentReminders: true,
          teamActivities: true,
          systemAnnouncements: true,
          documentExpiry: true,
          securityAlerts: true,
          marketingUpdates: false,
          workOrderUpdates: true,
          bidNotifications: true,
          complianceReminders: true,
          meetingReminders: true
        },
        sms: {
          urgentAlerts: true,
          twoFactorCodes: true,
          paymentConfirmations: true,
          appointmentReminders: true,
          criticalDeadlines: true,
          securityAlerts: true
        },
        inApp: {
          realTimeUpdates: true,
          desktopNotifications: true,
          soundNotifications: false,
          frequency: 'instant',
          quietHours: {
            enabled: true,
            startTime: '22:00',
            endTime: '08:00'
          }
        },
        roleSpecific: {
          adminNotifications: user?.role?.includes('admin') || false,
          teamMemberUpdates: true,
          clientCommunications: user?.role?.includes('seeker') || false,
          providerOpportunities: user?.role?.includes('provider') || false
        }
      };
      setPreferences(mockPrefs);
    } catch (error) {
      console.error('Failed to load notification preferences:', error);
      toast({
        title: "Error",
        description: "Failed to load notification preferences",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user?.role]);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  const updatePreferences = async (newPreferences: Partial<NotificationPreferences>) => {
    if (!preferences) return;

    setSaving(true);
    try {
      const updatedPreferences = { ...preferences, ...newPreferences };
      await systemSettingsService.updateNotificationPreferences(updatedPreferences);
      setPreferences(updatedPreferences);
      toast({
        title: "Success",
        description: "Notification preferences updated successfully",
      });
    } catch (error) {
      console.error('Failed to update preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update notification preferences",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEmailToggle = (key: keyof NotificationPreferences['email'], value: boolean) => {
    if (!preferences) return;
    updatePreferences({
      email: {
        ...preferences.email,
        [key]: value
      }
    });
  };

  const handleSmsToggle = (key: keyof NotificationPreferences['sms'], value: boolean) => {
    if (!preferences) return;
    updatePreferences({
      sms: {
        ...preferences.sms,
        [key]: value
      }
    });
  };

  const handleInAppToggle = (key: keyof NotificationPreferences['inApp'], value: boolean | string) => {
    if (!preferences) return;
    updatePreferences({
      inApp: {
        ...preferences.inApp,
        [key]: value
      }
    });
  };

  const handleRoleSpecificToggle = (key: keyof NotificationPreferences['roleSpecific'], value: boolean) => {
    if (!preferences) return;
    updatePreferences({
      roleSpecific: {
        ...preferences.roleSpecific,
        [key]: value
      }
    });
  };

  const handleQuietHoursUpdate = (field: 'startTime' | 'endTime', value: string) => {
    if (!preferences) return;
    updatePreferences({
      inApp: {
        ...preferences.inApp,
        quietHours: {
          ...preferences.inApp.quietHours,
          [field]: value
        }
      }
    });
  };

  const handleFrequencyChange = (frequency: 'instant' | 'daily' | 'weekly') => {
    if (!preferences) return;
    updatePreferences({
      inApp: {
        ...preferences.inApp,
        frequency
      }
    });
  };

  const handleQuietHoursToggle = (enabled: boolean) => {
    if (!preferences) return;
    updatePreferences({
      inApp: {
        ...preferences.inApp,
        quietHours: {
          ...preferences.inApp.quietHours,
          enabled
        }
      }
    });
  };

  const handleQuietHoursTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    if (!preferences) return;
    updatePreferences({
      inApp: {
        ...preferences.inApp,
        quietHours: {
          ...preferences.inApp.quietHours,
          [field]: value
        }
      }
    });
  };

  const testNotifications = () => {
    toast({
      title: "Test Notification",
      description: "This is a test notification to verify your settings are working correctly.",
    });
  };

  const resetToDefault = () => {
    const defaultPreferences: NotificationPreferences = {
      email: {
        serviceUpdates: true,
        paymentReminders: true,
        teamActivities: true,
        systemAnnouncements: true,
        documentExpiry: true,
        securityAlerts: true,
        marketingUpdates: false
      },
      sms: {
        urgentAlerts: true,
        twoFactorCodes: true,
        paymentConfirmations: true,
        appointmentReminders: true
      },
      inApp: {
        realTimeUpdates: true,
        desktopNotifications: true,
        soundNotifications: true,
        frequency: 'instant',
        quietHours: {
          enabled: false,
          startTime: '22:00',
          endTime: '08:00'
        }
      }
    };

    updatePreferences(defaultPreferences);
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

  if (!preferences) return null;

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader className="flex items-center justify-between flex-row">
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
            
          </CardTitle>
          <Switch
                checked={preferences.email.serviceUpdates}
                onCheckedChange={(checked) => handleEmailToggle('serviceUpdates', checked)}
                disabled={saving}
              />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Service Updates</Label>
                <p className="text-xs text-muted-foreground">Updates about your services and requests</p>
              </div>
              <Switch
                checked={preferences.email.serviceUpdates}
                onCheckedChange={(checked) => handleEmailToggle('serviceUpdates', checked)}
                disabled={saving}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Work Order Updates</Label>
                <p className="text-xs text-muted-foreground">Notifications about work order status changes</p>
              </div>
              <Switch
                checked={preferences.email.workOrderUpdates}
                onCheckedChange={(checked) => handleEmailToggle('workOrderUpdates', checked)}
                disabled={saving}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Bid Notifications</Label>
                <p className="text-xs text-muted-foreground">New bids and bid status updates</p>
              </div>
              <Switch
                checked={preferences.email.bidNotifications}
                onCheckedChange={(checked) => handleEmailToggle('bidNotifications', checked)}
                disabled={saving}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Compliance Reminders</Label>
                <p className="text-xs text-muted-foreground">Document expiry and compliance deadlines</p>
              </div>
              <Switch
                checked={preferences.email.complianceReminders}
                onCheckedChange={(checked) => handleEmailToggle('complianceReminders', checked)}
                disabled={saving}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Meeting Reminders</Label>
                <p className="text-xs text-muted-foreground">Upcoming meetings and appointments</p>
              </div>
              <Switch
                checked={preferences.email.meetingReminders}
                onCheckedChange={(checked) => handleEmailToggle('meetingReminders', checked)}
                disabled={saving}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Team Activities</Label>
                <p className="text-sm text-muted-foreground">Team member actions and updates</p>
              </div>
              <Switch
                checked={preferences.email.teamActivities}
                onCheckedChange={(checked) => handleEmailToggle('teamActivities', checked)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>System Announcements</Label>
                <p className="text-sm text-muted-foreground">Platform updates & maintenance notices</p>
              </div>
              <Switch
                checked={preferences.email.systemAnnouncements}
                onCheckedChange={(checked) => handleEmailToggle('systemAnnouncements', checked)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Document Expiry</Label>
                <p className="text-sm text-muted-foreground">Document renewal reminders</p>
              </div>
              <Switch
                checked={preferences.email.documentExpiry}
                onCheckedChange={(checked) => handleEmailToggle('documentExpiry', checked)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Security Alerts</Label>
                <p className="text-sm text-muted-foreground">Login attempts & security events</p>
              </div>
              <Switch
                checked={preferences.email.securityAlerts}
                onCheckedChange={(checked) => handleEmailToggle('securityAlerts', checked)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Marketing Updates</Label>
                <p className="text-sm text-muted-foreground">Promotional content</p>
              </div>
              <Switch
                checked={preferences.email.marketingUpdates}
                onCheckedChange={(checked) => handleEmailToggle('marketingUpdates', checked)}
                disabled={saving}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SMS Notifications */}
      <Card>
        <CardHeader className="flex items-center justify-between flex-row">
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            SMS Notifications
          </CardTitle>
          <Switch
                checked={preferences.email.serviceUpdates}
                onCheckedChange={(checked) => handleEmailToggle('serviceUpdates', checked)}
                disabled={saving}
              />
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Urgent Alerts</Label>
                <p className="text-sm text-muted-foreground">Critical system & service alerts</p>
              </div>
              <Switch
                checked={preferences.sms.urgentAlerts}
                onCheckedChange={(checked) => handleSmsToggle('urgentAlerts', checked)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>2FA Codes</Label>
                <p className="text-sm text-muted-foreground">Authentication codes for security</p>
              </div>
              <Switch
                checked={preferences.sms.twoFactorCodes}
                onCheckedChange={(checked) => handleSmsToggle('twoFactorCodes', checked)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Payment Confirmations</Label>
                <p className="text-sm text-muted-foreground">Transaction receipts and confirmations</p>
              </div>
              <Switch
                checked={preferences.sms.paymentConfirmations}
                onCheckedChange={(checked) => handleSmsToggle('paymentConfirmations', checked)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Appointment Reminders</Label>
                <p className="text-xs text-muted-foreground">SMS reminders for upcoming appointments</p>
              </div>
              <Switch
                checked={preferences.sms.appointmentReminders}
                onCheckedChange={(checked) => handleSmsToggle('appointmentReminders', checked)}
                disabled={saving}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Critical Deadlines</Label>
                <p className="text-xs text-muted-foreground">Urgent deadline notifications</p>
              </div>
              <Switch
                checked={preferences.sms.criticalDeadlines}
                onCheckedChange={(checked) => handleSmsToggle('criticalDeadlines', checked)}
                disabled={saving}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Security Alerts</Label>
                <p className="text-xs text-muted-foreground">Account security notifications via SMS</p>
              </div>
              <Switch
                checked={preferences.sms.securityAlerts}
                onCheckedChange={(checked) => handleSmsToggle('securityAlerts', checked)}
                disabled={saving}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* In-App Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            In-App Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Real-time Updates</Label>
                <p className="text-sm text-muted-foreground">Live activity feed</p>
              </div>
              <Switch
                checked={preferences.inApp.realTimeUpdates}
                onCheckedChange={(checked) => handleInAppToggle('realTimeUpdates', checked)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Desktop Notifications</Label>
                <p className="text-sm text-muted-foreground">Browser push alerts</p>
              </div>
              <Switch
                checked={preferences.inApp.desktopNotifications}
                onCheckedChange={(checked) => handleInAppToggle('desktopNotifications', checked)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sound Notifications</Label>
                <p className="text-sm text-muted-foreground">Audio alerts for new messages</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={preferences.inApp.soundNotifications}
                  onCheckedChange={(checked) => handleInAppToggle('soundNotifications', checked)}
                  disabled={saving}
                />
                {preferences.inApp.soundNotifications ? (
                  <Volume2 className="h-4 w-4 text-green-600" />
                ) : (
                  <VolumeX className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Frequency Settings */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Frequency Settings</Label>
            <div className="grid gap-3">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="instant"
                  name="frequency"
                  checked={preferences.inApp.frequency === 'instant'}
                  onChange={() => handleFrequencyChange('instant')}
                  className="w-4 h-4 text-blue-600"
                />
                <Label htmlFor="instant" className="flex-1">
                  <span className="font-medium">Instant</span>
                  <span className="block text-sm text-muted-foreground">Immediate delivery</span>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="daily"
                  name="frequency"
                  checked={preferences.inApp.frequency === 'daily'}
                  onChange={() => handleFrequencyChange('daily')}
                  className="w-4 h-4 text-blue-600"
                />
                <Label htmlFor="daily" className="flex-1">
                  <span className="font-medium">Daily Digest</span>
                  <span className="block text-sm text-muted-foreground">Once per day summary</span>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="weekly"
                  name="frequency"
                  checked={preferences.inApp.frequency === 'weekly'}
                  onChange={() => handleFrequencyChange('weekly')}
                  className="w-4 h-4 text-blue-600"
                />
                <Label htmlFor="weekly" className="flex-1">
                  <span className="font-medium">Weekly Summary</span>
                  <span className="block text-sm text-muted-foreground">Weekly compilation</span>
                </Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Quiet Hours */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                <Label className="text-base font-medium">Quiet Hours</Label>
              </div>
              <Switch
                checked={preferences.inApp.quietHours.enabled}
                onCheckedChange={handleQuietHoursToggle}
                disabled={saving}
              />
            </div>

            {preferences.inApp.quietHours.enabled && (
              <div className="flex items-center gap-4 pl-6">
                <div className="flex items-center gap-2">
                  <Label htmlFor="startTime" className="text-sm">From</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={preferences.inApp.quietHours.startTime}
                    onChange={(e) => handleQuietHoursTimeChange('startTime', e.target.value)}
                    className="w-auto"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="endTime" className="text-sm">To</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={preferences.inApp.quietHours.endTime}
                    onChange={(e) => handleQuietHoursTimeChange('endTime', e.target.value)}
                    className="w-auto"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={() => updatePreferences(preferences)} disabled={saving}>
          Save Preferences
        </Button>
        <Button variant="outline" onClick={resetToDefault} disabled={saving}>
          Reset to Default
        </Button>
        <Button variant="outline" onClick={testNotifications}>
          Test Notifications
        </Button>
      </div>
    </div>
  );
};

export { NotificationManagement };
