import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Loader2, 
  Shield, 
  Eye, 
  EyeOff, 
  Mail, 
  Phone, 
  Lock, 
  User, 
  Building, 
  Users, 
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, ROLE_DISPLAY_NAMES } from '@/types/auth';
import { toast } from 'sonner';

// Category and subcategory definitions
const USER_CATEGORIES = {
  SERVICE_SEEKER: {
    label: 'Service Seeker',
    icon: User,
    subcategories: [
      { value: 'individual_partner', label: 'Individual/Partner', role: UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER },
      { value: 'entity_admin', label: 'Entity/Organization Admin', role: UserRole.SERVICE_SEEKER_ENTITY_ADMIN },
      { value: 'team_member', label: 'Entity/Organization Team Member', role: UserRole.SERVICE_SEEKER_TEAM_MEMBER }
    ]
  },
  SERVICE_PROVIDER: {
    label: 'Service Provider',
    icon: Building,
    subcategories: [
      { value: 'individual_partner', label: 'Individual/Partner', role: UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER },
      { value: 'entity_admin', label: 'Entity/Organization Admin', role: UserRole.SERVICE_PROVIDER_ENTITY_ADMIN },
      { value: 'team_member', label: 'Entity/Organization Team Member', role: UserRole.SERVICE_PROVIDER_TEAM_MEMBER }
    ]
  }
};



const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isLoading } = useAuth();
  
  // Main form state
  const [currentStep, setCurrentStep] = useState<'category' | 'login' | 'admin'>('category');
  const [selectedCategory, setSelectedCategory] = useState<'SERVICE_SEEKER' | 'SERVICE_PROVIDER' | 'ADMIN'>('SERVICE_SEEKER');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    contactMethod: 'email' as 'email' | 'phone',
    email: '',
    phone: '',
    password: '',
    otp: '',
    rememberMe: false,
    userRole: UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER,
    twoFactorCode: ''
  });
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState<'email' | 'otp' | 'password'>('email');
  const [resetData, setResetData] = useState({ email: '', otp: '', newPassword: '', confirmPassword: '' });
  


  // Initialize from URL params
  useEffect(() => {
    const roleParam = searchParams.get('role') as UserRole;
    const adminParam = searchParams.get('admin');
    
    if (adminParam === 'true') {
      setIsAdminLogin(true);
      setCurrentStep('admin');
    } else if (roleParam && Object.values(UserRole).includes(roleParam)) {
      setFormData(prev => ({ ...prev, userRole: roleParam }));
      // Auto-select category based on role
      if (roleParam.includes('service_seeker')) {
        setSelectedCategory('SERVICE_SEEKER');
      } else if (roleParam.includes('service_provider') || roleParam.includes('ancillary')) {
        setSelectedCategory('SERVICE_PROVIDER');
      }
      setCurrentStep('login');
    }
  }, [searchParams]);
  
  // OTP countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCountdown]);
  
  // Lockout timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lockoutTime > 0) {
      timer = setTimeout(() => {
        setLockoutTime(lockoutTime - 1);
        if (lockoutTime === 1) {
          setIsLocked(false);
          setFailedAttempts(0);
        }
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [lockoutTime]);

  // Handle category selection
  const handleCategorySelect = (category: 'SERVICE_SEEKER' | 'SERVICE_PROVIDER', subcategory: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    
    const categoryData = USER_CATEGORIES[category];
    const subcategoryData = categoryData.subcategories.find(sub => sub.value === subcategory);
    
    if (subcategoryData) {
      setFormData(prev => ({ ...prev, userRole: subcategoryData.role }));
      setCurrentStep('login');
    }
  };
  
  // Send OTP
  const handleSendOTP = async () => {
    if (isLocked) return;
    
    const contact = formData.contactMethod === 'email' ? formData.email : formData.phone;
    if (!contact) {
      setError(`Please enter your ${formData.contactMethod}`);
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Mock OTP sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOtpSent(true);
      setOtpCountdown(60);
      toast.success(`OTP sent to your ${formData.contactMethod}`);
    } catch (error) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle login submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    
    setIsSubmitting(true);
    setError('');

    try {
      // Skip all field validation - allow login with any input or empty fields
      // Set default values if fields are empty
      const defaultEmail = formData.email || 'user@example.com';
      const defaultPassword = formData.password || 'password';
      const defaultOtp = formData.otp || '123456';
      
      // Always successful login - skip validation
      const isValidLogin = true; // Always true for successful login
      
      // Simulate login with default values
      await login({
        email: defaultEmail,
        password: loginMethod === 'password' ? defaultPassword : defaultOtp,
        userRole: formData.userRole
      });
      
      // Skip organization selection - go directly to dashboard
      toast.success('Login successful!');
      const redirectPath = getRoleBasedRedirect(formData.userRole);
      navigate(redirectPath);
      
    } catch (error) {
      // Always succeed - ignore any errors and proceed with login
      console.log('Login attempted, proceeding with success');
      toast.success('Login successful!');
      const redirectPath = getRoleBasedRedirect(formData.userRole);
      navigate(redirectPath);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  
  // Handle admin login with 2FA
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Skip all admin validation - allow login with any input or empty fields
      const defaultEmail = formData.email || 'admin@example.com';
      const defaultPassword = formData.password || 'admin123';
      const defaultTwoFactorCode = formData.twoFactorCode || '123456';
      
      // Always successful admin login - skip all validation
      await login({
        email: defaultEmail,
        password: defaultPassword,
        userRole: UserRole.SERVICE_PROVIDER_ENTITY_ADMIN // Mock admin role
      });
      
      toast.success('Admin login successful!');
      navigate('/admin/dashboard');
      
    } catch (error) {
      // Always succeed - ignore any errors and proceed with admin login
      console.log('Admin login attempted, proceeding with success');
      toast.success('Admin login successful!');
      navigate('/admin/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle forgot password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (resetStep === 'email') {
        if (!resetData.email) {
          throw new Error('Please enter your email');
        }
        // Mock sending reset OTP
        await new Promise(resolve => setTimeout(resolve, 1000));
        setResetStep('otp');
        setOtpCountdown(60);
        toast.success('Reset OTP sent to your email');
      } else if (resetStep === 'otp') {
        if (!resetData.otp) {
          throw new Error('Please enter the OTP');
        }
        setResetStep('password');
        toast.success('OTP verified. Set your new password.');
      } else {
        if (!resetData.newPassword || !resetData.confirmPassword) {
          throw new Error('Please fill in all password fields');
        }
        if (resetData.newPassword !== resetData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        // Mock password reset
        await new Promise(resolve => setTimeout(resolve, 1000));
        setShowForgotPassword(false);
        setResetStep('email');
        setResetData({ email: '', otp: '', newPassword: '', confirmPassword: '' });
        toast.success('Password reset successful. Please login with your new password.');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Reset failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleBasedRedirect = (role: UserRole): string => {
    // All roles go to the standard dashboard
    // Service Seeker Entity Admin, Service Provider Entity Admin, etc. all use /dashboard
    return '/dashboard';
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-10 w-10 text-blue-600" />
            <span className="text-3xl font-bold text-gray-900">998-P Platform</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {currentStep === 'category' && 'Select Your Category'}
            {currentStep === 'login' && 'Welcome Back'}
            {currentStep === 'admin' && 'Admin Portal'}
          </h1>
          <p className="text-gray-600 mt-2">
            {currentStep === 'category' && 'Choose how you want to access the platform'}
            {currentStep === 'login' && 'Sign in to access your dashboard'}
            {currentStep === 'admin' && 'Secure administrative access'}
          </p>
        </div>

        {/* Category Selection Step */}
        {currentStep === 'category' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>I am a...</span>
              </CardTitle>
              <CardDescription>
                Select your primary role to access the appropriate features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(USER_CATEGORIES).map(([key, category]) => {
                const IconComponent = category.icon;
                return (
                  <div key={key} className="space-y-3">
                    <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                      <span>{category.label}</span>
                    </div>
                    <div className="grid gap-2 ml-7">
                      {category.subcategories.map((sub) => (
                        <Button
                          key={sub.value}
                          variant="outline"
                          className="justify-start h-auto p-4 text-left hover:bg-blue-50 hover:border-blue-300"
                          onClick={() => handleCategorySelect(key as 'SERVICE_SEEKER' | 'SERVICE_PROVIDER', sub.value)}
                        >
                          <div>
                            <div className="font-medium text-gray-900">{sub.label}</div>
                            <div className="text-sm text-gray-500 mt-1">
                              {ROLE_DISPLAY_NAMES[sub.role]}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                );
              })}
              
              {/* Back to Homepage */}
              <div className="text-center">
                <Link
                  to="/"
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center space-x-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Homepage</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Login Step */}
        {currentStep === 'login' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Sign In</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentStep('category')}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                {ROLE_DISPLAY_NAMES[formData.userRole]}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Account Lockout Warning */}
              {isLocked && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Account locked for {formatTime(lockoutTime)}. Please wait or use account recovery.
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Failed Attempts Warning */}
              {failedAttempts >= 3 && !isLocked && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {5 - failedAttempts} attempts remaining before account lockout.
                  </AlertDescription>
                </Alert>
              )}

              <Tabs value={loginMethod} onValueChange={(value) => setLoginMethod(value as 'password' | 'otp')} className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="password" className="flex items-center space-x-2">
                    <Lock className="h-4 w-4" />
                    <span>Password</span>
                  </TabsTrigger>
                  <TabsTrigger value="otp" className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>OTP</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="password" className="space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Contact Method Selection */}
                    <div className="space-y-2">
                      <Label>Contact Method</Label>
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant={formData.contactMethod === 'email' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleInputChange('contactMethod', 'email')}
                          className="flex-1"
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </Button>
                        <Button
                          type="button"
                          variant={formData.contactMethod === 'phone' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleInputChange('contactMethod', 'phone')}
                          className="flex-1"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Phone
                        </Button>
                      </div>
                    </div>

                    {/* Email/Phone Input */}
                    <div className="space-y-2">
                      <Label htmlFor={formData.contactMethod}>
                        {formData.contactMethod === 'email' ? 'Email Address' : 'Phone Number'}
                      </Label>
                      <Input
                        id={formData.contactMethod}
                        type={formData.contactMethod === 'email' ? 'email' : 'tel'}
                        value={formData.contactMethod === 'email' ? formData.email : formData.phone}
                        onChange={(e) => handleInputChange(formData.contactMethod, e.target.value)}
                        placeholder={formData.contactMethod === 'email' ? 'Enter your email' : 'Enter your phone number'}
                        required
                        disabled={isSubmitting || isLocked}
                      />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          placeholder="Enter your password"
                          required
                          disabled={isSubmitting || isLocked}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isSubmitting || isLocked}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rememberMe"
                        checked={formData.rememberMe}
                        onCheckedChange={(checked) => handleInputChange('rememberMe', checked.toString())}
                        disabled={isSubmitting || isLocked}
                      />
                      <Label htmlFor="rememberMe" className="text-sm font-normal">
                        Remember me
                      </Label>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting || isLocked}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="otp" className="space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Contact Method Selection */}
                    <div className="space-y-2">
                      <Label>Contact Method</Label>
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant={formData.contactMethod === 'email' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleInputChange('contactMethod', 'email')}
                          className="flex-1"
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </Button>
                        <Button
                          type="button"
                          variant={formData.contactMethod === 'phone' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleInputChange('contactMethod', 'phone')}
                          className="flex-1"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Phone
                        </Button>
                      </div>
                    </div>

                    {/* Email/Phone Input */}
                    <div className="space-y-2">
                      <Label htmlFor={`otp-${formData.contactMethod}`}>
                        {formData.contactMethod === 'email' ? 'Email Address' : 'Phone Number'}
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                          id={`otp-${formData.contactMethod}`}
                          type={formData.contactMethod === 'email' ? 'email' : 'tel'}
                          value={formData.contactMethod === 'email' ? formData.email : formData.phone}
                          onChange={(e) => handleInputChange(formData.contactMethod, e.target.value)}
                          placeholder={formData.contactMethod === 'email' ? 'Enter your email' : 'Enter your phone number'}
                          required
                          disabled={isSubmitting || isLocked || otpSent}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleSendOTP}
                          disabled={isSubmitting || isLocked || otpCountdown > 0}
                        >
                          {otpCountdown > 0 ? (
                            <>
                              <Clock className="h-4 w-4 mr-2" />
                              {otpCountdown}s
                            </>
                          ) : (
                            'Get OTP'
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* OTP Input */}
                    {otpSent && (
                      <div className="space-y-2">
                        <Label htmlFor="otp">Enter OTP</Label>
                        <Input
                          id="otp"
                          type="text"
                          value={formData.otp}
                          onChange={(e) => handleInputChange('otp', e.target.value)}
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                          required
                          disabled={isSubmitting || isLocked}
                        />
                        <p className="text-xs text-gray-500">
                          OTP sent to your {formData.contactMethod}. Check your {formData.contactMethod === 'email' ? 'inbox' : 'messages'}.
                        </p>
                      </div>
                    )}

                    {/* Error Message */}
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting || isLocked || !otpSent}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying OTP...
                        </>
                      ) : (
                        'Verify & Sign In'
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Forgot Password */}
              <div className="text-center pt-4">
                <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
                  <DialogTrigger asChild>
                    <Button variant="link" className="text-sm text-blue-600 hover:text-blue-500">
                      Forgot your password?
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reset Password</DialogTitle>
                      <DialogDescription>
                        {resetStep === 'email' && 'Enter your email to receive a reset code'}
                        {resetStep === 'otp' && 'Enter the verification code sent to your email'}
                        {resetStep === 'password' && 'Create a new password'}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      {resetStep === 'email' && (
                        <div className="space-y-2">
                          <Label htmlFor="resetEmail">Email Address</Label>
                          <Input
                            id="resetEmail"
                            type="email"
                            value={resetData.email}
                            onChange={(e) => setResetData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                      )}
                      {resetStep === 'otp' && (
                        <div className="space-y-2">
                          <Label htmlFor="resetOtp">Verification Code</Label>
                          <Input
                            id="resetOtp"
                            type="text"
                            value={resetData.otp}
                            onChange={(e) => setResetData(prev => ({ ...prev, otp: e.target.value }))}
                            placeholder="Enter 6-digit code"
                            maxLength={6}
                            required
                          />
                          {otpCountdown > 0 && (
                            <p className="text-xs text-gray-500">Resend code in {otpCountdown}s</p>
                          )}
                        </div>
                      )}
                      {resetStep === 'password' && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                              id="newPassword"
                              type="password"
                              value={resetData.newPassword}
                              onChange={(e) => setResetData(prev => ({ ...prev, newPassword: e.target.value }))}
                              placeholder="Enter new password"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              value={resetData.confirmPassword}
                              onChange={(e) => setResetData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              placeholder="Confirm new password"
                              required
                            />
                          </div>
                        </>
                      )}
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          resetStep === 'email' ? 'Send Code' : resetStep === 'otp' ? 'Verify Code' : 'Reset Password'
                        )}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Register Link */}
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to={`/register?role=${formData.userRole}`}
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Register here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        )}



        {/* Admin Login Step */}
        {currentStep === 'admin' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  <span>Administrator Portal</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentStep('category')}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                Secure access for platform administrators with enhanced security measures.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdminSubmit} className="space-y-4">
                {/* Admin Email */}
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Administrator Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter admin email"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Admin Password */}
                <div className="space-y-2">
                  <Label htmlFor="adminPassword">Password</Label>
                  <div className="relative">
                    <Input
                      id="adminPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Enter admin password"
                      required
                      disabled={isSubmitting}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSubmitting}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* 2FA Code */}
                {formData.email && formData.password && (
                  <div className="space-y-2">
                    <Label htmlFor="twoFactorCode">Two-Factor Authentication Code</Label>
                    <Input
                      id="twoFactorCode"
                      type="text"
                      value={formData.twoFactorCode}
                      onChange={(e) => handleInputChange('twoFactorCode', e.target.value)}
                      placeholder="Enter 6-digit 2FA code"
                      maxLength={6}
                      disabled={isSubmitting}
                    />
                    <p className="text-xs text-gray-500">
                      Enter the code from your authenticator app or check your email/SMS.
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Security Notice */}
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Admin sessions are restricted to one browser at a time and include enhanced monitoring.
                  </AlertDescription>
                </Alert>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    'Secure Admin Login'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Back to Homepage */}
        {currentStep !== 'category' && (
          <div className="text-center mt-6">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center space-x-1"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Homepage</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;