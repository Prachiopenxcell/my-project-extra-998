import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  User,
  Building,
  Users,
  CheckCircle,
  AlertCircle,
  ArrowRight,

  FileText,
  Shield,
  Clock,
  Star
} from 'lucide-react';

// Import profile form components
import { ServiceSeekerIndividualForm } from './forms/ServiceSeekerIndividualForm';
import { ServiceSeekerEntityAdminForm } from './forms/ServiceSeekerEntityAdminForm';
import { ServiceSeekerTeamMemberForm } from './forms/ServiceSeekerTeamMemberForm';
import { ServiceProviderIndividualForm } from './forms/ServiceProviderIndividualForm';
import { ServiceProviderEntityAdminForm } from './forms/ServiceProviderEntityAdminForm';
import { ServiceProviderTeamMemberForm } from './forms/ServiceProviderTeamMemberForm';

interface ProfileCreationFlowProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

const ProfileCreationFlow: React.FC<ProfileCreationFlowProps> = ({ onComplete, onSkip }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<'welcome' | 'form' | 'complete'>('welcome');
  const [showSkipConfirmation, setShowSkipConfirmation] = useState(false);

  // Check if user came from registration
  const fromRegistration = searchParams.get('from') === 'registration';

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  if (!user) return null;

  const getRoleInfo = () => {
    switch (user.role) {
      case UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER:
        return {
          title: 'Service Seeker - Individual/Partner',
          description: 'Complete your profile to access professional services',
          icon: User,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        };
      case UserRole.SERVICE_SEEKER_ENTITY_ADMIN:
        return {
          title: 'Service Seeker - Entity/Organization Admin',
          description: 'Set up your organization profile and manage team access',
          icon: Building,
          color: 'text-green-600',
          bgColor: 'bg-green-50'
        };
      case UserRole.SERVICE_SEEKER_TEAM_MEMBER:
        return {
          title: 'Service Seeker - Team Member',
          description: 'Complete your team member profile',
          icon: Users,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50'
        };
      case UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER:
        return {
          title: 'Service Provider - Individual/Partner',
          description: 'Set up your professional services profile',
          icon: User,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50'
        };
      case UserRole.SERVICE_PROVIDER_ENTITY_ADMIN:
        return {
          title: 'Service Provider - Entity/Organization Admin',
          description: 'Configure your organization and service offerings',
          icon: Building,
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-50'
        };
      case UserRole.SERVICE_PROVIDER_TEAM_MEMBER:
        return {
          title: 'Service Provider - Team Member',
          description: 'Complete your team member profile',
          icon: Users,
          color: 'text-teal-600',
          bgColor: 'bg-teal-50'
        };
      default:
        return {
          title: 'Profile Setup',
          description: 'Complete your profile',
          icon: User,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50'
        };
    }
  };

  const roleInfo = getRoleInfo();
  const IconComponent = roleInfo.icon;

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      navigate('/dashboard');
    }
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    } else {
      navigate('/dashboard');
    }
  };

  const renderProfileForm = () => {
    const commonProps = {
      onComplete: handleComplete,
      onSkip: handleSkip
    };

    switch (user.role) {
      case UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER:
        return <ServiceSeekerIndividualForm {...commonProps} />;
      case UserRole.SERVICE_SEEKER_ENTITY_ADMIN:
        return <ServiceSeekerEntityAdminForm {...commonProps} />;
      case UserRole.SERVICE_SEEKER_TEAM_MEMBER:
        return <ServiceSeekerTeamMemberForm {...commonProps} />;
      case UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER:
        return <ServiceProviderIndividualForm {...commonProps} />;
      case UserRole.SERVICE_PROVIDER_ENTITY_ADMIN:
        return <ServiceProviderEntityAdminForm {...commonProps} />;
      case UserRole.SERVICE_PROVIDER_TEAM_MEMBER:
        return <ServiceProviderTeamMemberForm {...commonProps} />;
      default:
        return (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-muted-foreground">Unsupported user role</p>
          </div>
        );
    }
  };

  if (currentStep === 'welcome') {
    return (
      <DashboardLayout userType={user.role.includes('seeker') ? 'service_seeker' : 'service_provider'}>
        <div className="container mx-auto p-6 max-w-4xl">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${roleInfo.bgColor} mb-4`}>
              <IconComponent className={`h-8 w-8 ${roleInfo.color}`} />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome to 998-P Platform!
            </h1>
            <p className="text-lg text-muted-foreground">
              {fromRegistration ? 'Registration successful!' : 'Complete your profile to get started'}
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <IconComponent className={`h-5 w-5 ${roleInfo.color}`} />
                {roleInfo.title}
              </CardTitle>
              <CardDescription>
                {roleInfo.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {fromRegistration && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Your account has been created successfully! Complete your profile to access all platform features.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="font-medium">Complete Profile Information</h3>
                    <p className="text-sm text-muted-foreground">
                      Provide required details to get your permanent registration number
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="font-medium">AI Document Verification</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload identity documents for automatic verification
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <Star className="h-5 w-5 text-yellow-600" />
                  <div>
                    <h3 className="font-medium">Access Platform Features</h3>
                    <p className="text-sm text-muted-foreground">
                      Unlock all features based on your role and profile completion
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => setCurrentStep('form')}
                  className="flex-1"
                  size="lg"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Complete Profile Now
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowSkipConfirmation(true)}
                  className="flex-1"
                  size="lg"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Skip for Now
                </Button>
              </div>

              {showSkipConfirmation && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    <div className="space-y-2">
                      <p className="font-medium">Are you sure you want to skip?</p>
                      <p className="text-sm">
                        You can complete your profile later from Settings → Profile Management, 
                        but some features may be limited until completion.
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setShowSkipConfirmation(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={handleSkip}
                          className="bg-yellow-600 hover:bg-yellow-700"
                        >
                          Skip to Dashboard
                        </Button>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (currentStep === 'form') {
    return (
      <DashboardLayout userType={user.role.includes('seeker') ? 'service_seeker' : 'service_provider'}>
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <IconComponent className={`h-5 w-5 ${roleInfo.color}`} />
              <h1 className="text-2xl font-bold text-foreground">Profile Setup</h1>
            </div>
            <p className="text-muted-foreground">{roleInfo.description}</p>
          </div>
          
          {renderProfileForm()}
        </div>
      </DashboardLayout>
    );
  }

  return null;
};

export default ProfileCreationFlow;
