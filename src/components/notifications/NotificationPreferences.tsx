import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Shield, 
  Clock, 
  Activity, 
  AlertTriangle,
  Save,
  Moon,
  Volume2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { notificationService } from "@/services/notificationService";
import { NotificationPreferences } from "@/types/notification";
import { toast } from "@/components/ui/use-toast";

interface NotificationPreferencesProps {
  onClose?: () => void;
}

export const NotificationPreferencesComponent = ({ onClose }: NotificationPreferencesProps) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadPreferences = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const prefs = await notificationService.getPreferences(user.id);
      setPreferences(prefs);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load notification preferences",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  const handleSave = async () => {
    if (!user?.id || !preferences) return;
    
    setSaving(true);
    try {
      await notificationService.updatePreferences(user.id, preferences);
      toast({
        title: "Success",
        description: "Notification preferences updated successfully"
      });
      onClose?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification preferences",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (key: keyof NotificationPreferences, value: boolean | string) => {
    if (!preferences) return;
    setPreferences({ ...preferences, [key]: value });
  };

  const updateQuietHours = (key: string, value: boolean | string) => {
    if (!preferences) return;
    setPreferences({
      ...preferences,
      quietHours: {
        ...preferences.quietHours!,
        [key]: value
      }
    });
  };

  if (loading || !preferences) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
          <p className="text-gray-600 mt-1">
            Customize how and when you receive notifications
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Delivery Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Delivery Channels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-blue-600" />
              <div>
                <Label className="text-sm font-medium">In-App Notifications</Label>
                <p className="text-xs text-gray-600">Show notifications within the platform</p>
              </div>
            </div>
            <Switch
              checked={preferences.inAppEnabled}
              onCheckedChange={(checked) => updatePreference('inAppEnabled', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-green-600" />
              <div>
                <Label className="text-sm font-medium">Email Notifications</Label>
                <p className="text-xs text-gray-600">Require email for important actions and updates</p>
              </div>
            </div>
            <Switch
              checked={!!preferences.emailRequired}
              onCheckedChange={(checked) => updatePreference('emailRequired', checked)}
            />
          </div>
          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-orange-600" />
              <div>
                <Label className="text-sm font-medium">SMS Notifications</Label>
                <p className="text-xs text-gray-600">Receive critical alerts via SMS</p>
              </div>
            </div>
            <Switch
              checked={preferences.smsEnabled}
              onCheckedChange={(checked) => updatePreference('smsEnabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Types
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-blue-600" />
              <div>
                <Label className="text-sm font-medium">System Alerts</Label>
                <p className="text-xs text-gray-600">Platform updates, maintenance, and system messages</p>
              </div>
            </div>
            <Switch
              checked={preferences.systemAlerts}
              onCheckedChange={(checked) => updatePreference('systemAlerts', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <Label className="text-sm font-medium">Reminders</Label>
                <p className="text-xs text-gray-600">Subscription renewals, due dates, and pending actions</p>
              </div>
            </div>
            <Switch
              checked={preferences.reminders}
              onCheckedChange={(checked) => updatePreference('reminders', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-green-600" />
              <div>
                <Label className="text-sm font-medium">Activity Updates</Label>
                <p className="text-xs text-gray-600">Work orders, assignments, and task updates</p>
              </div>
            </div>
            <Switch
              checked={preferences.activityUpdates}
              onCheckedChange={(checked) => updatePreference('activityUpdates', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-red-600" />
              <div>
                <Label className="text-sm font-medium">Security Alerts</Label>
                <p className="text-xs text-gray-600">Login attempts, password changes, and security events</p>
              </div>
            </div>
            <Switch
              checked={preferences.securityAlerts}
              onCheckedChange={(checked) => updatePreference('securityAlerts', checked)}
              disabled={true}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            * Security alerts cannot be disabled for account safety
          </p>
        </CardContent>
      </Card>

      {/* Frequency Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Frequency & Timing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Notification Frequency</Label>
            <Select
              value={preferences.frequency}
              onValueChange={(value) => updatePreference('frequency', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="real_time">Real-time (Immediate)</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Summary</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-600 mt-1">
              How often you want to receive non-urgent notifications
            </p>
          </div>

          <Separator />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-purple-600" />
                <div>
                  <Label className="text-sm font-medium">Quiet Hours</Label>
                  <p className="text-xs text-gray-600">Pause non-urgent notifications during these hours</p>
                </div>
              </div>
              <Switch
                checked={preferences.quietHours?.enabled || false}
                onCheckedChange={(checked) => updateQuietHours('enabled', checked)}
              />
            </div>

            {preferences.quietHours?.enabled && (
              <div className="grid grid-cols-2 gap-4 ml-8">
                <div>
                  <Label className="text-xs text-gray-600">Start Time</Label>
                  <Input
                    type="time"
                    value={preferences.quietHours.startTime}
                    onChange={(e) => updateQuietHours('startTime', e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">End Time</Label>
                  <Input
                    type="time"
                    value={preferences.quietHours.endTime}
                    onChange={(e) => updateQuietHours('endTime', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Role-specific Information */}
      <Card>
        <CardHeader>
          <CardTitle>Your Notification Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-gray-600">User Role</Label>
              <p className="font-medium">{user?.role?.replace(/_/g, ' ')}</p>
            </div>
            <div>
              <Label className="text-gray-600">User Type</Label>
              <p className="font-medium">{user?.userType?.replace(/_/g, ' ')}</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-4">
            Some notification types may be automatically enabled based on your role and responsibilities.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
