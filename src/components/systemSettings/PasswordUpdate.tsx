import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Smartphone,
  Mail,
  Key,
  Clock,
  MapPin,
  Monitor
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { systemSettingsService } from "@/services/systemSettingsService";
import { PasswordUpdateData, SecuritySettings } from "@/types/systemSettings";

const PasswordUpdate = () => {
  const [passwordData, setPasswordData] = useState<PasswordUpdateData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Load security settings on component mount
  useState(() => {
    const loadSecuritySettings = async () => {
      try {
        const settings = await systemSettingsService.getSecuritySettings();
        setSecuritySettings(settings);
      } catch (error) {
        console.error('Failed to load security settings:', error);
        toast({
          title: "Error",
          description: "Failed to load security settings",
          variant: "destructive"
        });
      } finally {
        setLoadingSettings(false);
      }
    };

    loadSecuritySettings();
  });

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    Object.values(requirements).forEach(met => {
      if (met) strength += 20;
    });

    return { strength, requirements };
  };

  const { strength, requirements } = getPasswordStrength(passwordData.newPassword);

  const handlePasswordChange = (field: keyof PasswordUpdateData, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (strength < 80) {
      toast({
        title: "Weak Password",
        description: "Please choose a stronger password that meets all requirements",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await systemSettingsService.updatePassword(passwordData);
      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    
    // Ensure at least one of each required character type
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    password += '0123456789'[Math.floor(Math.random() * 10)];
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)];
    
    // Fill the rest randomly
    for (let i = 4; i < 12; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    
    // Shuffle the password
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    setPasswordData(prev => ({
      ...prev,
      newPassword: password,
      confirmPassword: password
    }));
  };

  const getStatusIcon = (status: 'success' | 'failed' | 'warning') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Change Password Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  placeholder="Enter current password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  placeholder="Enter new password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              
              {/* Password Strength Indicator */}
              {passwordData.newPassword && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Password Strength</span>
                    <span className="text-sm font-medium">
                      {strength < 40 ? 'Weak' : strength < 80 ? 'Medium' : 'Strong'}
                    </span>
                  </div>
                  <Progress 
                    value={strength} 
                    className={`h-2 ${
                      strength < 40 ? 'text-red-600' : 
                      strength < 80 ? 'text-yellow-600' : 'text-green-600'
                    }`}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className={`flex items-center gap-2 ${requirements.length ? 'text-green-600' : 'text-muted-foreground'}`}>
                {requirements.length ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                Minimum 8 characters
              </div>
              <div className={`flex items-center gap-2 ${requirements.numbers ? 'text-green-600' : 'text-muted-foreground'}`}>
                {requirements.numbers ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                At least one number
              </div>
              <div className={`flex items-center gap-2 ${requirements.uppercase && requirements.lowercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                {requirements.uppercase && requirements.lowercase ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                Upper & lowercase letters
              </div>
              <div className={`flex items-center gap-2 ${requirements.special ? 'text-green-600' : 'text-muted-foreground'}`}>
                {requirements.special ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                Special character
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading || strength < 80}>
                {loading ? "Changing Password..." : "Change Password"}
              </Button>
              <Button type="button" variant="outline" onClick={generateStrongPassword}>
                Generate Strong Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      {!loadingSettings && securitySettings && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Two-Factor Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  {securitySettings.twoFactorEnabled ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">Enabled</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-red-600">Disabled</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {securitySettings.twoFactorEnabled && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Primary Method</p>
                    <p className="text-sm text-muted-foreground">
                      SMS to +1-234-***-8900
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Backup Method</p>
                    <p className="text-sm text-muted-foreground">
                      Email to j***@email.com
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline">
                {securitySettings.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
              </Button>
              {securitySettings.twoFactorEnabled && (
                <>
                  <Button variant="outline">Change Methods</Button>
                  <Button variant="outline">Generate Backup Codes</Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Logs */}
      {!loadingSettings && securitySettings && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Security Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Recent Activity:</p>
              
              {securitySettings.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(activity.status)}
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {activity.timestamp.toLocaleString()}
                        {activity.location && (
                          <>
                            <MapPin className="h-3 w-3 ml-2" />
                            {activity.location}
                          </>
                        )}
                        {activity.device && (
                          <>
                            <Monitor className="h-3 w-3 ml-2" />
                            {activity.device}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge variant={activity.status === 'success' ? 'default' : activity.status === 'failed' ? 'destructive' : 'secondary'}>
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>

            <Separator className="my-4" />
            
            <div className="flex gap-3">
              <Button variant="outline">View Full Log</Button>
              <Button variant="outline">Download Security Report</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export { PasswordUpdate };
