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

// Import form components
import { ServiceSeekerIndividualForm } from '@/components/profile/ServiceSeekerIndividualForm';
import { ServiceSeekerEntityForm } from '@/components/profile/ServiceSeekerEntityForm';
import { ServiceProviderIndividualForm } from '@/components/profile/ServiceProviderIndividualForm';
import { ServiceProviderEntityForm } from '@/components/profile/ServiceProviderEntityForm';
import { TeamMemberForm } from '@/components/profile/TeamMemberForm';

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

  const renderProfileForm = () => {
    if (!profile || !user) return null;

    switch (user.role) {
      case UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER:
        return (
          <ServiceSeekerIndividualForm 
            profile={profile as ServiceSeekerIndividualProfile}
            onSave={handleSave}
            loading={saving}
            activeSection={activeSection}
          />
        );
      
      case UserRole.SERVICE_SEEKER_ENTITY_ADMIN:
        return (
          <ServiceSeekerEntityForm 
            profile={profile as ServiceSeekerEntityProfile}
            onSave={handleSave}
            loading={saving}
            activeSection={activeSection}
          />
        );
      
      case UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER:
        return (
          <ServiceProviderIndividualForm 
            profile={profile as ServiceProviderIndividualProfile}
            onSave={handleSave}
            loading={saving}
            activeSection={activeSection}
          />
        );
      
      case UserRole.SERVICE_PROVIDER_ENTITY_ADMIN:
        return (
          <ServiceProviderEntityForm 
            profile={profile as ServiceProviderEntityProfile}
            onSave={handleSave}
            loading={saving}
            activeSection={activeSection}
          />
        );
      
      case UserRole.SERVICE_SEEKER_TEAM_MEMBER:
      case UserRole.SERVICE_PROVIDER_TEAM_MEMBER:
        return (
          <TeamMemberForm 
            profile={profile as TeamMemberProfile}
            onSave={handleSave}
            loading={saving}
            activeSection={activeSection}
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
              onClick={() => navigate('/profile')}
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
          
          {completionStatus && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Completion</p>
                <p className="text-2xl font-bold text-primary">
                  {completionStatus.overallPercentage}%
                </p>
              </div>
              <Progress value={completionStatus.overallPercentage} className="w-24 h-2" />
            </div>
          )}
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
