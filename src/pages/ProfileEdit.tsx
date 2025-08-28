import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileService } from '@/services/profileService';
import { 
  UserProfile, 
  ProfileCompletionStatus,
  ServiceSeekerIndividualProfile,
  ServiceSeekerEntityProfile,
  ServiceProviderIndividualProfile,
  ServiceProviderEntityProfile,
  TeamMemberProfile
} from '@/types/profile';
import { UserRole } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

// Import enhanced form components with Save and Next functionality
import { ServiceSeekerIndividualForm } from '@/components/profile/forms/ServiceSeekerIndividualForm';
import { ServiceSeekerEntityAdminForm } from '@/components/profile/forms/ServiceSeekerEntityAdminForm';
import { ServiceSeekerTeamMemberForm } from '@/components/profile/forms/ServiceSeekerTeamMemberForm';
import { ServiceProviderIndividualFormNew } from '@/components/profile/forms/ServiceProviderIndividualFormNew';
import { ServiceProviderEntityAdminFormNew } from '@/components/profile/forms/ServiceProviderEntityAdminFormNew';
import { ServiceProviderTeamMemberFormNew } from '@/components/profile/forms/ServiceProviderTeamMemberFormNew';

import {
  Save,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  User,
  Shield
} from 'lucide-react';

const ProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [completionStatus, setCompletionStatus] = useState<ProfileCompletionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    loadProfile();
    
    // Set active section from URL params
    const section = searchParams.get('section');
    if (section) {
      setActiveSection(section);
    }
  }, [user, searchParams]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      let userProfile = await ProfileService.getProfile(user.id);
      
      if (!userProfile) {
        userProfile = createEmptyProfile(user.id, user.role);

        // Inject mock data to show ~22% completion for Service Seeker Entity Admin
        if (user.role === UserRole.SERVICE_SEEKER_ENTITY_ADMIN) {
          userProfile.name = 'Acme Demo Org';
          userProfile.email = user.email || 'demo@acme.org';
          (userProfile as ServiceSeekerEntityProfile).contactNumber = '9876543210';
          // Leave identity docs, address, AR, resources empty so only Basic Details* is completed
        }

        // Inject mock data to show ~5% completion for Service Provider Entity Admin
        if (user.role === UserRole.SERVICE_PROVIDER_ENTITY_ADMIN) {
          const spe = userProfile as unknown as ServiceProviderEntityProfile;
          // Only complete the optional 7-weight section -> rounds to ~5%
          (spe as any).openToRemoteWork = true;
          // Keep all other sections empty
          (spe as any).personType = undefined;
          (spe as any).dateOfIncorporation = '';
          (spe as any).incorporationCertificate = undefined;
          (spe as any).authorizedRepresentative = {
            name: '', designation: '', email: '', contactNumber: '',
            address: { street: '', city: '', state: '', pinCode: '' },
            identityDocument: { type: undefined, number: '' }
          };
        }

        // Seed minimal data for Service Provider Individual/Partner to reach 5% (Work Locations pinCode)
        if (user.role === UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER) {
          const spInd = userProfile as unknown as ServiceProviderIndividualProfile;
          // Ensure only a single optional section completes (Work Locations at 5%).
          // With updated completion rules, pinCode presence marks it complete.
          spInd.workLocations = [{ city: '', location: '', pinCode: '000000' }];
          // Keep personal details, identity, qualifications, memberships, services, banking empty
        }

        // Persist the seeded mock profile
        await ProfileService.saveProfile(userProfile);
      }

      // Normalize existing Service Provider Individual/Partner profile to target 5%
      if (user.role === UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER) {
        const sp = userProfile as unknown as ServiceProviderIndividualProfile;
        // Clear sections that might be pre-filled
        sp.name = '';
        sp.mobile = '';
        sp.qualifications = '';
        sp.identityDocument = { type: undefined as any, number: '', uploadedFile: undefined as any } as any;
        sp.membershipDetails = [] as any;
        sp.servicesOffered = [] as any;
        sp.languageSkills = [] as any;
        sp.bankingDetails = [] as any;
        // Ensure exactly one work location with a pinCode to yield 5%
        sp.workLocations = [{ city: '', location: '', pinCode: '000000' } as any];

        await ProfileService.saveProfile(sp as unknown as UserProfile);
        userProfile = sp as unknown as UserProfile;
      }

      // Normalize existing Service Seeker Entity Admin profile to target 22%
      if (user.role === UserRole.SERVICE_SEEKER_ENTITY_ADMIN) {
        const sse = userProfile as unknown as ServiceSeekerEntityProfile;
        // Basic Details only
        sse.name = sse.name || 'Acme Demo Org';
        sse.email = sse.email || user.email || 'demo@acme.org';
        sse.contactNumber = sse.contactNumber || '9876543210';
        // Clear other sections to avoid extra completion beyond 22%
        sse.identityDocument = { type: undefined as any, number: '', uploadedFile: undefined as any } as any;
        sse.address = { street: '', city: '', state: '', pinCode: '' } as any;
        sse.billingAddress = { street: '', city: '', state: '', pinCode: '' } as any;
        sse.bankingDetails = [] as any;
        sse.authorizedRepresentative = {
          name: '', designation: '', email: '', contactNumber: '',
          address: { street: '', city: '', state: '', pinCode: '' } as any,
          identityDocument: { type: undefined as any, number: '' } as any
        } as any;
        sse.resourceInfra = {
          numberOfProfessionalStaff: 0,
          numberOfOtherStaff: 0,
          numberOfInternsArticledClerks: 0
        } as any;

        await ProfileService.saveProfile(sse as unknown as UserProfile);
        userProfile = sse as unknown as UserProfile;
      }

      // Normalize existing Service Provider Entity Admin profile to target ~5%
      if (user.role === UserRole.SERVICE_PROVIDER_ENTITY_ADMIN) {
        const spe = userProfile as unknown as ServiceProviderEntityProfile;
        // Only complete Remote Work Preference; clear others
        (spe as any).openToRemoteWork = true;
        (spe as any).personType = undefined;
        (spe as any).dateOfIncorporation = '';
        (spe as any).incorporationCertificate = undefined;
        (spe as any).authorizedRepresentative = {
          name: '', designation: '', email: '', contactNumber: '',
          address: { street: '', city: '', state: '', pinCode: '' },
          identityDocument: { type: undefined, number: '' }
        };

        await ProfileService.saveProfile(spe as unknown as UserProfile);
        userProfile = spe as unknown as UserProfile;
      }
      
      setProfile(userProfile);
      const status = ProfileService.calculateCompletionStatus(userProfile, user.role);
      setCompletionStatus(status);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createEmptyProfile = (userId: string, role: UserRole): UserProfile => {
    const baseProfile = {
      userId,
      completionPercentage: 0,
      isCompleted: false,
      lastUpdated: new Date()
    };

    switch (role) {
      case UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER:
        return {
          ...baseProfile,
          name: '',
          identityDocument: { type: 'pan' as any, number: '' },
          email: user?.email || '',
          contactNumber: '',
          address: { street: '', city: '', state: '', pinCode: '' },
          billingAddress: { street: '', city: '', state: '', pinCode: '' },
          bankingDetails: []
        } as any;
      
      case UserRole.SERVICE_SEEKER_ENTITY_ADMIN:
        return {
          ...baseProfile,
          name: '',
          identityDocument: { type: 'pan' as any, number: '' },
          email: user?.email || '',
          contactNumber: '',
          address: { street: '', city: '', state: '', pinCode: '' },
          billingAddress: { street: '', city: '', state: '', pinCode: '' },
          bankingDetails: [],
          authorizedRepresentative: {
            name: '',
            designation: '',
            email: '',
            contactNumber: '',
            address: { street: '', city: '', state: '', pinCode: '' },
            identityDocument: { type: 'pan' as any, number: '' }
          },
          resourceInfra: {
            numberOfProfessionalStaff: 0,
            numberOfOtherStaff: 0,
            numberOfInternsArticledClerks: 0
          }
        } as any;
      
      case UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER:
        return {
          ...baseProfile,
          title: '',
          name: '',
          email: user?.email || '',
          mobile: '',
          identityDocument: { type: 'pan' as any, number: '' },
          qualifications: '',
          membershipDetails: [],
          languageSkills: [],
          resourceInfra: {
            numberOfProfessionalStaff: 0,
            numberOfOtherStaff: 0,
            numberOfInternsArticledClerks: 0
          },
          workLocations: [],
          openToRemoteWork: false,
          billingDetails: [],
          bankingDetails: [],
          servicesOffered: [],
          alternateContacts: []
        } as any;
      
      case UserRole.SERVICE_PROVIDER_ENTITY_ADMIN:
        return {
          ...baseProfile,
          title: '',
          name: '',
          email: user?.email || '',
          mobile: '',
          identityDocument: { type: 'pan' as any, number: '' },
          qualifications: '',
          membershipDetails: [],
          languageSkills: [],
          resourceInfra: {
            numberOfProfessionalStaff: 0,
            numberOfOtherStaff: 0,
            numberOfInternsArticledClerks: 0
          },
          workLocations: [],
          openToRemoteWork: false,
          billingDetails: [],
          bankingDetails: [],
          servicesOffered: [],
          alternateContacts: [],
          personType: 'private_limited' as any,
          dateOfIncorporation: '',
          authorizedRepresentative: {
            name: '',
            designation: '',
            email: '',
            contactNumber: '',
            address: { street: '', city: '', state: '', pinCode: '' },
            identityDocument: { type: 'pan' as any, number: '' }
          }
        } as any;
      
      default:
        return {
          ...baseProfile,
          name: '',
          identityDocument: { type: 'pan' as any, number: '' },
          email: user?.email || '',
          contactNumber: '',
          address: { street: '', city: '', state: '', pinCode: '' }
        } as any;
    }
  };

  const handleSave = async (updatedProfile: UserProfile) => {
    if (!user) return;
    
    try {
      setSaving(true);
      
      // Calculate completion status
      const status = ProfileService.calculateCompletionStatus(updatedProfile, user.role);
      
      // Generate permanent number if eligible
      if (status.canGetPermanentNumber && !updatedProfile.permanentRegistrationNumber) {
        updatedProfile.permanentRegistrationNumber = ProfileService.generatePermanentNumber(updatedProfile, user.role);
      }
      
      // Update completion percentage
      updatedProfile.completionPercentage = status.overallPercentage;
      updatedProfile.isCompleted = status.canGetPermanentNumber;
      
      await ProfileService.saveProfile(updatedProfile);
      setProfile(updatedProfile);
      setCompletionStatus(status);
      
      toast({
        title: "Success",
        description: updatedProfile.permanentRegistrationNumber 
          ? "Profile saved successfully! Your permanent registration number has been generated."
          : "Profile saved successfully!",
      });
      
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Success",
      description: "Profile completed successfully!",
    });
    navigate('/dashboard');
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  const renderProfileForm = () => {
    if (!profile || !user) return null;

    switch (user.role) {
      case UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER:
        return (
          <ServiceSeekerIndividualForm 
            onComplete={handleComplete}
            onSkip={handleSkip}
          />
        );
      
      case UserRole.SERVICE_SEEKER_ENTITY_ADMIN:
        return (
          <ServiceSeekerEntityAdminForm 
            onComplete={handleComplete}
            onSkip={handleSkip}
          />
        );
      
      case UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER:
        return (
          <ServiceProviderIndividualFormNew 
            onComplete={handleComplete}
            onSkip={handleSkip}
          />
        );
      
      case UserRole.SERVICE_PROVIDER_ENTITY_ADMIN:
        return (
          <ServiceProviderEntityAdminFormNew 
            onComplete={handleComplete}
            onSkip={handleSkip}
          />
        );
      
      case UserRole.SERVICE_SEEKER_TEAM_MEMBER:
        return (
          <ServiceSeekerTeamMemberForm 
            onComplete={handleComplete}
            onSkip={handleSkip}
          />
        );
      
      case UserRole.SERVICE_PROVIDER_TEAM_MEMBER:
        return (
          <ServiceProviderTeamMemberFormNew 
            onComplete={handleComplete}
            onSkip={handleSkip}
          />
        );
      
      default:
        return (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Profile editing is not available for your user role.
            </AlertDescription>
          </Alert>
        );
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Edit Profile</h1>
              <p className="text-muted-foreground mt-1">
                Update your profile information
              </p>
            </div>
          </div>
          
        </div>

        {/* Status Alerts */}
        {completionStatus && (
          <div className="space-y-3">
            {completionStatus.canGetPermanentNumber ? (
              <Alert className="border-success bg-success/5">
                <CheckCircle className="h-4 w-4 text-success" />
                <AlertDescription className="text-success">
                  Your profile is complete! {profile?.permanentRegistrationNumber 
                    ? `Your permanent registration number is: ${profile.permanentRegistrationNumber}`
                    : 'Save your profile to get your permanent registration number.'
                  }
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-warning bg-warning/5">
                <AlertCircle className="h-4 w-4 text-warning" />
                <AlertDescription className="text-warning">
                  Complete all mandatory sections to get your permanent registration number.
                  Missing: {completionStatus.missingMandatoryFields.slice(0, 3).join(', ')}
                  {completionStatus.missingMandatoryFields.length > 3 && ` and ${completionStatus.missingMandatoryFields.length - 3} more`}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Profile Form */}
        {renderProfileForm()}
      </div>
    </DashboardLayout>
  );
};

export default ProfileEdit;
