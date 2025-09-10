import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Smartphone,
  Mail,
  Clock,
  Key,
  Calendar,
  Users,
  AlertCircle,
  MapPin,
  Monitor
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { systemSettingsService } from "@/services/systemSettingsService";
import { PasswordUpdateData, SecuritySettings } from "@/types/systemSettings";
import { useAuth } from "@/contexts/AuthContext";

const PasswordUpdate = () => {
  const [passwordData, setPasswordData] = useState<PasswordUpdateData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [otpMethod, setOtpMethod] = useState<'email' | 'sms'>('email');
  const [mandatoryChange, setMandatoryChange] = useState(false);

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
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSecuritySettings();
  }, []);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }

    setUpdating(true);
    try {
      // First step: validate current password and initiate 2FA
      if (!otpStep) {
        // Simulate password validation and 2FA trigger
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOtpStep(true);
        setOtpMethod(securitySettings?.primaryMethod || 'email');
        
        toast({
          title: "Verification Required",
          description: `OTP sent to your ${otpMethod === 'email' ? 'email' : 'phone'}. Please enter the code to continue.`,
        });
        return;
      }
      
      // Second step: verify OTP and update password
      if (otpCode.length !== 6) {
        toast({
          title: "Invalid OTP",
          description: "Please enter a valid 6-digit OTP code.",
          variant: "destructive"
        });
        return;
      }
      
      // Simulate OTP verification
      if (otpCode !== '123456') { // Mock OTP for demo
        setOtpAttempts(prev => prev + 1);
        
        if (otpAttempts >= 2) {
          // Lock account for 24 hours after 3 failed attempts
          toast({
            title: "Account Locked",
            description: "Too many failed OTP attempts. Your account is locked for 24 hours.",
            variant: "destructive"
          });
          setOtpStep(false);
          setOtpCode('');
          setOtpAttempts(0);
          return;
        }
        
        toast({
          title: "Invalid OTP",
          description: `Invalid OTP code. ${2 - otpAttempts} attempts remaining.`,
          variant: "destructive"
        });
        return;
      }
      
      // Update password
      await systemSettingsService.updatePassword(passwordData);
      
      // Reset form and state
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setOtpStep(false);
      setOtpCode('');
      setOtpAttempts(0);
      setMandatoryChange(false);
      
      toast({
        title: "Success",
        description: "Password updated successfully. All other active sessions have been terminated.",
      });
      
      // Reload security settings
      loadSecuritySettings();
    } catch (error) {
      console.error('Failed to update password:', error);
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
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

  const validatePassword = (): boolean => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Validation Error",
        description: "All fields are required.",
        variant: "destructive"
      });
      return false;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Validation Error",
        description: "New password and confirmation do not match.",
        variant: "destructive"
      });
      return false;
    }
    
    // Enhanced password validation rules
    const passwordRules = [
      { test: newPassword.length >= 8, message: "At least 8 characters" },
      { test: /[A-Z]/.test(newPassword), message: "At least one uppercase letter" },
      { test: /[a-z]/.test(newPassword), message: "At least one lowercase letter" },
      { test: /\d/.test(newPassword), message: "At least one number" },
      { test: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword), message: "At least one special character" }
    ];
    
    const failedRules = passwordRules.filter(rule => !rule.test);
    if (failedRules.length > 0) {
      toast({
        title: "Password Requirements",
        description: `Password must have: ${failedRules.map(r => r.message).join(', ')}`,
        variant: "destructive"
      });
      return false;
    }
    
    // Check against previous passwords (mock check)
    const previousPasswords = securitySettings?.passwordPolicy?.previousPasswords ?? [];
    if (previousPasswords.includes(newPassword)) {
      toast({
        title: "Validation Error",
        description: "Cannot reuse any of your last 3 passwords.",
        variant: "destructive"
      });
      return false;
    }
    
    if (passwordStrength < 80) {
      toast({
        title: "Validation Error",
        description: "Password is too weak. Please choose a stronger password.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Lock className="h-6 w-6 text-blue-600" />
          Password & Security
        </h2>
        <p className="text-muted-foreground">Update your password and manage security settings</p>
      </div>
      
      {/* Mandatory Password Change Alert */}
      {mandatoryChange && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Mandatory Password Change Required:</strong> Your password must be updated as part of our quarterly security policy. 
            Please update your password to continue using the platform.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Password Policy Reminder */}
      {securitySettings?.passwordPolicy?.mustChangeBy && (
        <Alert className="border-blue-200 bg-blue-50">
          <Calendar className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Next Mandatory Change:</strong> {securitySettings.passwordPolicy?.mustChangeBy?.toLocaleDateString()}
            <br />Last changed: {securitySettings.passwordPolicy?.lastChanged?.toLocaleDateString()}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Change Password Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                  onClick={() => setShowCurrentPassword(prev => !prev)}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                  onClick={() => setShowNewPassword(prev => !prev)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              
              {/* Password Strength Indicator */}
              {passwordData.newPassword && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Password Strength</span>
                    <span className="text-sm font-medium">
                      {passwordStrength < 40 ? 'Weak' : passwordStrength < 80 ? 'Medium' : 'Strong'}
                    </span>
                  </div>
                  <Progress 
                    value={passwordStrength} 
                    className={`h-2 ${
                      passwordStrength < 40 ? 'text-red-600' : 
                      passwordStrength < 80 ? 'text-yellow-600' : 'text-green-600'
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
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className={`flex items-center gap-2 ${passwordData.newPassword.length >= 8 ? 'text-green-600' : 'text-muted-foreground'}`}>
                {passwordData.newPassword.length >= 8 ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                Minimum 8 characters
              </div>
              <div className={`flex items-center gap-2 ${/\d/.test(passwordData.newPassword) ? 'text-green-600' : 'text-muted-foreground'}`}>
                {/\d/.test(passwordData.newPassword) ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                At least one number
              </div>
              <div className={`flex items-center gap-2 ${(/[A-Z]/.test(passwordData.newPassword) && /[a-z]/.test(passwordData.newPassword)) ? 'text-green-600' : 'text-muted-foreground'}`}>
                {(/[A-Z]/.test(passwordData.newPassword) && /[a-z]/.test(passwordData.newPassword)) ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                Upper & lowercase letters
              </div>
              <div className={`flex items-center gap-2 ${/[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-muted-foreground'}`}>
                {/[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword) ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                Special character
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={updating || passwordStrength < 80}>
                {updating ? "Changing Password..." : "Change Password"}
              </Button>
              <Button type="button" variant="outline" onClick={generateStrongPassword}>
                Generate Strong Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* 2FA OTP Dialog */}
      <Dialog open={otpStep} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Two-Factor Authentication
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <Smartphone className="h-4 w-4" />
              <AlertDescription>
                We've sent a 6-digit verification code to your {otpMethod === 'email' ? 'email address' : 'phone number'}.
                Enter the code below to complete your password update.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>
            
            {otpAttempts > 0 && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  Invalid code. {2 - otpAttempts} attempts remaining before account lockout.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setOtpStep(false);
                  setOtpCode('');
                  setOtpAttempts(0);
                  setUpdating(false);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePasswordUpdate}
                disabled={otpCode.length !== 6 || updating}
                className="flex-1"
              >
                {updating ? (
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Verify & Update
              </Button>
            </div>
            
            <div className="text-center">
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  setOtpMethod(otpMethod === 'email' ? 'sms' : 'email');
                  toast({
                    title: "Code Resent",
                    description: `Verification code sent to your ${otpMethod === 'email' ? 'phone' : 'email'}.`
                  });
                }}
              >
                Send code via {otpMethod === 'email' ? 'SMS' : 'Email'} instead
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Two-Factor Authentication */}
      {!loading && securitySettings && (
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
      {!loading && securitySettings && (
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
                    {activity.status === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : activity.status === 'failed' ? (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {activity.timestamp.toLocaleString()}
                        {activity.location && (
                          <>
                            <span className="ml-2">📍</span>
                            {activity.location}
                          </>
                        )}
                        {activity.device && (
                          <>
                            <span className="ml-2">💻</span>
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
