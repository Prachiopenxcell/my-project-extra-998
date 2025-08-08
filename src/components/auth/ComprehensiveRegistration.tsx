import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  Shield, 
  Eye, 
  EyeOff, 
  Building2, 
  User, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Mail,
  Phone,
  Lock,
  Info,
  Smartphone,
  Clock,
  Zap,
  Sparkles,
  CheckCircle2,
  Timer,
  RefreshCw
} from 'lucide-react';
import { 
  UserRole, 
  UserType, 
  EntityType, 
  DETAILED_REGISTRATION_OPTIONS,
  REGISTRATION_STEPS,
  PASSWORD_REQUIREMENTS,
  MOBILE_PATTERNS,
  RegisterData,
  OTPVerificationData
} from '@/types/auth';
import { toast } from 'sonner';

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
}

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length: number;
  disabled?: boolean;
  error?: boolean;
}

// Enhanced OTP Input Component
function OTPInput({ value, onChange, length, disabled = false, error = false }: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleChange = (index: number, inputValue: string) => {
    const numericValue = inputValue.replace(/\D/g, '');
    if (numericValue.length <= 1) {
      const newValue = value.split('');
      newValue[index] = numericValue;
      const updatedValue = newValue.join('').slice(0, length);
      onChange(updatedValue);
      
      // Auto-focus next input
      if (numericValue && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pastedData);
    
    // Focus the next empty input or the last input
    const nextIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="flex justify-center space-x-3">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex(null)}
          disabled={disabled}
          className={`
            w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all duration-200
            ${error 
              ? 'border-red-300 bg-red-50 text-red-600' 
              : focusedIndex === index 
                ? 'border-slate-400 bg-white shadow-md ring-2 ring-slate-200' 
                : value[index] 
                  ? 'border-green-300 bg-green-50 text-green-700' 
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}
            focus:outline-none
          `}
        />
      ))}
    </div>
  );
}

export default function ComprehensiveRegistration() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, isLoading } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationId, setRegistrationId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOTP, setCanResendOTP] = useState({ email: true, mobile: true });
  
  // Step 1: Basic Information
  const [formData, setFormData] = useState({
    userCategory: (searchParams.get('role') as UserRole) || ('' as UserRole),
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    acceptTerms: false,
    invitationToken: searchParams.get('token') || ''
  });
  
  // Step 2: OTP Verification
  const [otpData, setOtpData] = useState({
    emailOTP: '',
    mobileOTP: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    label: 'Very Weak',
    color: 'bg-red-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700'
  });

  // Initialize form data from URL parameters
  useEffect(() => {
    const roleParam = searchParams.get('role') as UserRole;
    const emailParam = searchParams.get('email');
    const tokenParam = searchParams.get('token');
    
    if (roleParam) {
      setFormData(prev => ({ ...prev, userCategory: roleParam }));
    }
    if (emailParam) {
      setFormData(prev => ({ ...prev, email: emailParam }));
    }
    if (tokenParam) {
      setFormData(prev => ({ ...prev, invitationToken: tokenParam }));
    }
  }, [searchParams]);

  // OTP Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            setCanResendOTP({ email: true, mobile: true });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Password strength calculation
  useEffect(() => {
    const calculatePasswordStrength = (password: string): PasswordStrength => {
      let score = 0;
      if (password.length >= PASSWORD_REQUIREMENTS.minLength) score++;
      if (/[A-Z]/.test(password)) score++;
      if (/[a-z]/.test(password)) score++;
      if (/\d/.test(password)) score++;
      if (/[^A-Za-z0-9]/.test(password)) score++;

      const strengthMap = {
        0: { label: 'Very Weak', color: 'bg-red-500', bgColor: 'bg-red-50', textColor: 'text-red-700' },
        1: { label: 'Weak', color: 'bg-red-400', bgColor: 'bg-red-50', textColor: 'text-red-600' },
        2: { label: 'Fair', color: 'bg-yellow-500', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700' },
        3: { label: 'Good', color: 'bg-blue-500', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
        4: { label: 'Strong', color: 'bg-green-500', bgColor: 'bg-green-50', textColor: 'text-green-700' },
        5: { label: 'Very Strong', color: 'bg-green-600', bgColor: 'bg-green-50', textColor: 'text-green-800' }
      };

      return { score, ...strengthMap[score as keyof typeof strengthMap] };
    };

    setPasswordStrength(calculatePasswordStrength(formData.password));
  }, [formData.password]);

  const getSelectedOption = () => {
    return DETAILED_REGISTRATION_OPTIONS.find(option => option.role === formData.userCategory);
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    const selectedOption = getSelectedOption();

    if (!formData.userCategory) {
      newErrors.userCategory = 'Please select your role';
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!MOBILE_PATTERNS.india.test(formData.mobileNumber.replace(/\D/g, ''))) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (passwordStrength.score < 3) {
      newErrors.password = 'Password must be stronger (minimum: 8 characters with uppercase, lowercase, numbers, and special characters)';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (selectedOption?.requiresOrganization && !formData.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required for this role';
    }
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!otpData.emailOTP || otpData.emailOTP.length !== 6) {
      newErrors.emailOTP = 'Please enter the 6-digit email OTP';
    }
    if (!otpData.mobileOTP || otpData.mobileOTP.length !== 6) {
      newErrors.mobileOTP = 'Please enter the 6-digit mobile OTP';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep1Submit = async () => {
    if (!validateStep1()) return;

    setIsSubmitting(true);
    try {
      // Mock API call to create temporary registration and send OTPs
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate temporary registration ID
      const tempRegId = `REG${Date.now()}`;
      setRegistrationId(tempRegId);
      
      // Start OTP timer
      setOtpTimer(300); // 5 minutes
      setCanResendOTP({ email: false, mobile: false });
      
      toast.success('🎉 Verification codes sent successfully!', {
        description: 'Check your email and SMS for the 6-digit codes'
      });
      setCurrentStep(2);
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStep2Submit = async () => {
    if (!validateStep2()) return;

    setIsSubmitting(true);
    try {
      // Mock OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const selectedOption = getSelectedOption();
      
      // Prepare registration data
      const registrationData: RegisterData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.userCategory,
        userType: selectedOption?.userType || UserType.SERVICE_SEEKER,
        entityType: selectedOption?.requiresOrganization ? EntityType.ORGANIZATION : EntityType.INDIVIDUAL,
        organizationName: formData.organizationName || undefined,
        mobileNumber: formData.mobileNumber,
        acceptTerms: formData.acceptTerms,
        invitationToken: formData.invitationToken || undefined
      };

      await register(registrationData);
      
      setCurrentStep(3);
      toast.success('Registration completed successfully!');
      
      // Redirect to role-based dashboard after a brief delay
      setTimeout(() => {
        navigate('/dashboard', { 
          replace: true 
        });
      }, 2000);
      
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleOTPChange = (field: string, value: string) => {
    // Only allow numeric input and limit to 6 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setOtpData(prev => ({ ...prev, [field]: numericValue }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const resendOTP = async (type: 'email' | 'mobile') => {
    if (!canResendOTP[type]) return;
    
    try {
      setCanResendOTP(prev => ({ ...prev, [type]: false }));
      // Mock resend OTP
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Restart timer
      setOtpTimer(300);
      
      toast.success(`📱 New code sent to your ${type}!`, {
        description: 'Please check and enter the new 6-digit code'
      });
    } catch (error) {
      toast.error(`Failed to resend ${type} OTP`);
      setCanResendOTP(prev => ({ ...prev, [type]: true }));
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Step {currentStep} of {REGISTRATION_STEPS.length}</span>
          <span>{Math.round((currentStep / REGISTRATION_STEPS.length) * 100)}% Complete</span>
        </div>
        <Progress 
          value={(currentStep / REGISTRATION_STEPS.length) * 100} 
          className="h-2 bg-gray-100"
        />
      </div>
      
      {/* Step Indicators */}
      <div className="flex items-center justify-between mb-6">
        {REGISTRATION_STEPS.map((step, index) => (
          <div key={step.step} className="flex items-center">
            <div className={`
              relative w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
              ${currentStep > step.step 
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-110' 
                : currentStep === step.step 
                  ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg scale-110 ring-4 ring-slate-200' 
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }
            `}>
              {currentStep > step.step ? (
                <CheckCircle2 className="h-6 w-6 animate-pulse" />
              ) : currentStep === step.step ? (
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              ) : (
                step.step
              )}
              
              {/* Animated ring for current step */}
              {currentStep === step.step && (
                <div className="absolute inset-0 rounded-full border-2 border-slate-300 animate-ping" />
              )}
            </div>
            
            {index < REGISTRATION_STEPS.length - 1 && (
              <div className="flex-1 mx-4">
                <div className={`
                  h-1 rounded-full transition-all duration-500
                  ${currentStep > step.step 
                    ? 'bg-gradient-to-r from-green-500 to-green-400' 
                    : 'bg-gray-200'
                  }
                `} />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Step Title and Description */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Sparkles className="h-5 w-5 text-slate-600" />
          <h3 className="text-xl font-bold text-gray-900">
            {REGISTRATION_STEPS[currentStep - 1]?.title}
          </h3>
        </div>
        <p className="text-gray-600 max-w-md mx-auto">
          {REGISTRATION_STEPS[currentStep - 1]?.description}
        </p>
      </div>
    </div>
  );

  const renderStep1 = () => {
    const selectedOption = getSelectedOption();
    
    return (
      <div className="space-y-6">
        {/* Role Selection */}
        <div className="space-y-2">
          <Label htmlFor="userCategory">I am/We are *</Label>
          <Select
            value={formData.userCategory}
            onValueChange={(value) => handleInputChange('userCategory', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(
                DETAILED_REGISTRATION_OPTIONS.reduce((acc, option) => {
                  if (!acc[option.category]) acc[option.category] = [];
                  acc[option.category].push(option);
                  return acc;
                }, {} as Record<string, typeof DETAILED_REGISTRATION_OPTIONS>)
              ).map(([category, options]) => (
                <div key={category}>
                  <div className="px-2 py-1.5 text-sm font-medium text-gray-900 bg-gray-50">
                    {category}
                  </div>
                  {options.map((option) => (
                    <SelectItem key={option.role} value={option.role}>
                      {option.label}
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
          {errors.userCategory && (
            <p className="text-sm text-red-600">{errors.userCategory}</p>
          )}
          {selectedOption && (
            <p className="text-sm text-gray-600">{selectedOption.description}</p>
          )}
        </div>

        {/* Organization Name (if required) */}
        {selectedOption?.requiresOrganization && (
          <div className="space-y-2">
            <Label htmlFor="organizationName">Organization/Entity Name *</Label>
            <Input
              id="organizationName"
              type="text"
              value={formData.organizationName}
              onChange={(e) => handleInputChange('organizationName', e.target.value)}
              placeholder="Enter organization name"
              disabled={isSubmitting}
            />
            {errors.organizationName && (
              <p className="text-sm text-red-600">{errors.organizationName}</p>
            )}
          </div>
        )}

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="Enter your first name"
              disabled={isSubmitting}
            />
            {errors.firstName && (
              <p className="text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Enter your last name"
              disabled={isSubmitting}
            />
            {errors.lastName && (
              <p className="text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email address"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobileNumber">Mobile Number *</Label>
            <Input
              id="mobileNumber"
              type="tel"
              value={formData.mobileNumber}
              onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
              placeholder="Enter your 10-digit mobile number"
              disabled={isSubmitting}
            />
            {errors.mobileNumber && (
              <p className="text-sm text-red-600">{errors.mobileNumber}</p>
            )}
          </div>
        </div>

        {/* Password Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Set Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Create a strong password"
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
            
            {/* Enhanced Password Strength Indicator */}
            {formData.password && (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-600">Password Strength</span>
                      <Badge 
                        className={`text-xs px-2 py-1 ${passwordStrength.bgColor} ${passwordStrength.textColor} border-0`}
                      >
                        {passwordStrength.label}
                      </Badge>
                    </div>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                            level <= passwordStrength.score
                              ? passwordStrength.color
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100">
                    {passwordStrength.score >= 4 ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Lock className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
                
                {/* Password Requirements Checklist */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { label: '8+ characters', test: formData.password.length >= 8 },
                    { label: 'Uppercase letter', test: /[A-Z]/.test(formData.password) },
                    { label: 'Lowercase letter', test: /[a-z]/.test(formData.password) },
                    { label: 'Number', test: /\d/.test(formData.password) },
                    { label: 'Special character', test: /[^A-Za-z0-9]/.test(formData.password) }
                  ].map((req, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                        req.test ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {req.test ? (
                          <CheckCircle2 className="h-2 w-2 text-green-600" />
                        ) : (
                          <div className="w-1 h-1 bg-gray-400 rounded-full" />
                        )}
                      </div>
                      <span className={req.test ? 'text-green-700' : 'text-gray-500'}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm your password"
                disabled={isSubmitting}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isSubmitting}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="acceptTerms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) => handleInputChange('acceptTerms', checked as boolean)}
              disabled={isSubmitting}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="acceptTerms"
                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I accept the{' '}
                <Link to="/terms" className="text-slate-600 hover:text-slate-700 underline">
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-slate-600 hover:text-slate-700 underline">
                  Privacy Policy
                </Link>{' '}
                *
              </Label>
              {errors.acceptTerms && (
                <p className="text-sm text-red-600">{errors.acceptTerms}</p>
              )}
            </div>
          </div>
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              By registering, a standard agreement will be generated with your details that you can download for your records.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  };

  const renderStep2 = () => (
    <div className="space-y-8">
      {/* Header with Timer */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Smartphone className="h-8 w-8 text-white" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify Your Identity</h3>
          <p className="text-gray-600 text-sm">
            We've sent 6-digit verification codes to secure your account
          </p>
        </div>
        
        {/* Timer Display */}
        {otpTimer > 0 && (
          <div className="flex items-center justify-center space-x-2 text-sm">
            <Timer className="h-4 w-4 text-blue-600" />
            <span className="font-mono text-blue-600 font-medium">
              Expires in {formatTime(otpTimer)}
            </span>
          </div>
        )}
      </div>

      {/* Email OTP Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <Label className="text-base font-medium text-gray-900">Email Verification</Label>
            <p className="text-sm text-gray-600">Code sent to {formData.email}</p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <OTPInput
            value={otpData.emailOTP}
            onChange={(value) => handleOTPChange('emailOTP', value)}
            length={6}
            disabled={isSubmitting}
            error={!!errors.emailOTP}
          />
          
          {errors.emailOTP && (
            <div className="flex items-center space-x-2 text-red-600 text-sm justify-center">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.emailOTP}</span>
            </div>
          )}
          
          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => resendOTP('email')}
              disabled={isSubmitting || !canResendOTP.email}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              {!canResendOTP.email ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Resending...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resend Email Code
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile OTP Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Smartphone className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <Label className="text-base font-medium text-gray-900">SMS Verification</Label>
            <p className="text-sm text-gray-600">Code sent to +91 {formData.mobileNumber}</p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <OTPInput
            value={otpData.mobileOTP}
            onChange={(value) => handleOTPChange('mobileOTP', value)}
            length={6}
            disabled={isSubmitting}
            error={!!errors.mobileOTP}
          />
          
          {errors.mobileOTP && (
            <div className="flex items-center space-x-2 text-red-600 text-sm justify-center">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.mobileOTP}</span>
            </div>
          )}
          
          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => resendOTP('mobile')}
              disabled={isSubmitting || !canResendOTP.mobile}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              {!canResendOTP.mobile ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Resending...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resend SMS Code
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Having trouble?</strong> Check your spam folder for the email code. 
          SMS codes may take up to 2 minutes to arrive. Both codes expire in 5 minutes.
        </AlertDescription>
      </Alert>
    </div>
  );

  const renderStep3 = () => (
    <div className="text-center space-y-8">
      {/* Success Animation */}
      <div className="relative">
        <div className="mx-auto w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center animate-pulse">
          <CheckCircle2 className="h-12 w-12 text-white" />
        </div>
        <div className="absolute inset-0 mx-auto w-24 h-24 bg-green-400 rounded-full animate-ping opacity-20" />
        <div className="absolute inset-0 mx-auto w-32 h-32 bg-green-300 rounded-full animate-ping opacity-10" style={{ animationDelay: '0.5s' }} />
      </div>
      
      {/* Success Message */}
      <div className="space-y-3">
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="h-6 w-6 text-yellow-500" />
          <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Welcome Aboard!
          </h3>
          <Sparkles className="h-6 w-6 text-yellow-500" />
        </div>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Congratulations {formData.firstName}! Your 998-P Platform account is ready to go.
        </p>
      </div>

      {/* Registration Summary Card */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 border border-gray-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Shield className="h-5 w-5 text-slate-600" />
          <h4 className="font-semibold text-gray-900">Registration Summary</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{formData.firstName} {formData.lastName}</p>
                <p className="text-gray-600">{getSelectedOption()?.label}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Email Verified</p>
                <p className="text-gray-600">{formData.email}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Smartphone className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Mobile Verified</p>
                <p className="text-gray-600">+91 {formData.mobileNumber}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Zap className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Registration ID</p>
                <p className="text-gray-600 font-mono text-xs">{registrationId}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2">
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Account Verified
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              <Clock className="mr-1 h-3 w-3" />
              Ready to Login
            </Badge>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>What's Next?</strong> You'll be redirected to your dashboard shortly. 
          Complete your profile setup to unlock all platform features and get your permanent registration number.
        </AlertDescription>
      </Alert>
      
      {/* Redirect countdown */}
      <div className="text-sm text-gray-500">
        Redirecting to your dashboard in a few seconds...
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-slate-600" />
            <span className="text-2xl font-bold text-gray-900">998-P Platform</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Your Account</h1>
          <p className="text-gray-600 mt-2">Join our professional services platform</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {getSelectedOption()?.requiresOrganization ? (
                <Building2 className="h-5 w-5 text-slate-600" />
              ) : (
                <User className="h-5 w-5 text-slate-600" />
              )}
              <span>Registration</span>
            </CardTitle>
            <CardDescription>
              {getSelectedOption()?.description || 'Complete your registration to get started'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepIndicator()}
            
            <div className="space-y-6">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              
              {/* Navigation Buttons */}
              {currentStep < 3 && (
                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate('/')}
                    disabled={isSubmitting}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {currentStep === 1 ? 'Back to Home' : 'Previous'}
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={currentStep === 1 ? handleStep1Submit : handleStep2Submit}
                    disabled={isSubmitting}
                    className="bg-slate-700 hover:bg-slate-800"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {currentStep === 1 ? 'Sending OTP...' : 'Verifying...'}
                      </>
                    ) : (
                      <>
                        {currentStep === 1 ? 'Send OTP' : 'Complete Registration'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              )}
              
              {/* Login Link */}
              {currentStep < 3 && (
                <div className="text-center pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link
                      to={`/login${formData.userCategory ? `?role=${formData.userCategory}` : ''}`}
                      className="text-slate-600 hover:text-slate-700 font-medium"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
