import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileService } from '@/services/profileService';
import { UserProfile, ProfileCompletionStatus } from '@/types/profile';
import { UserRole } from '@/types/auth';
import {
  User,
  FileText,
  MapPin,
  CreditCard,
  Building,
  Award,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Edit,
  Download,
  Shield
} from 'lucide-react';

const ProfileCompletion: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [completionStatus, setCompletionStatus] = useState<ProfileCompletionStatus | null>(null);
  const [loading, setLoading] = useState(true);

  // Redirect directly to profile edit to bypass unnecessary dashboard
  useEffect(() => {
    if (user && !loading) {
      navigate('/profile/edit');
      return;
    }
    loadProfile();
  }, [user, loading, navigate]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userProfile = await ProfileService.getProfile(user.id);
      
      if (userProfile) {
        setProfile(userProfile);
        const status = ProfileService.calculateCompletionStatus(userProfile, user.role);
        setCompletionStatus(status);
      } else {
        // Create new profile
        const newProfile = createEmptyProfile(user.id, user.role);
        setProfile(newProfile);
        const status = ProfileService.calculateCompletionStatus(newProfile, user.role);
        setCompletionStatus(status);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
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

    // Return appropriate profile type based on role
    switch (role) {
      case UserRole.SERVICE_SEEKER_INDIVIDUAL:
      case UserRole.SERVICE_SEEKER_PARTNER:
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
      
      case UserRole.SERVICE_PROVIDER_INDIVIDUAL:
      case UserRole.SERVICE_PROVIDER_PARTNER:
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

  const handleStartProfile = () => {
    navigate('/profile/edit');
  };

  const handleEditSection = (sectionName: string) => {
    navigate(`/profile/edit?section=${encodeURIComponent(sectionName)}`);
  };

  const getSectionIcon = (sectionName: string) => {
    if (sectionName.includes('Personal') || sectionName.includes('Basic')) return User;
    if (sectionName.includes('Identity') || sectionName.includes('Document')) return FileText;
    if (sectionName.includes('Address') || sectionName.includes('Location')) return MapPin;
    if (sectionName.includes('Banking') || sectionName.includes('Billing')) return CreditCard;
    if (sectionName.includes('Company') || sectionName.includes('Organization')) return Building;
    if (sectionName.includes('Membership') || sectionName.includes('Qualification')) return Award;
    return FileText;
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

  if (!completionStatus) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Unable to load profile information. Please try again.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }



  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile Completion</h1>
            <p className="text-muted-foreground mt-1">
              Complete your profile to get your permanent registration number
            </p>
          </div>
          <Button onClick={handleStartProfile} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            {completionStatus.overallPercentage > 0 ? 'Continue Profile' : 'Start Profile'}
          </Button>
        </div>

        {/* Overall Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Completion Status
            </CardTitle>
            <CardDescription>
              Complete all mandatory sections to get your permanent registration number
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-2xl font-bold text-primary">
                {completionStatus.overallPercentage}%
              </span>
            </div>
            <Progress value={completionStatus.overallPercentage} className="h-3" />
            
            {completionStatus.canGetPermanentNumber ? (
              <Alert className="border-success bg-success/5">
                <CheckCircle className="h-4 w-4 text-success" />
                <AlertDescription className="text-success">
                  Congratulations! Your profile is complete. You can now get your permanent registration number.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-warning bg-warning/5">
                <AlertCircle className="h-4 w-4 text-warning" />
                <AlertDescription className="text-warning">
                  Complete all mandatory sections (marked with *) to get your permanent registration number.
                </AlertDescription>
              </Alert>
            )}

            {profile?.permanentRegistrationNumber && (
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-primary">Permanent Registration Number</p>
                    <p className="text-sm text-muted-foreground">Your unique platform identifier</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-lg px-3 py-1">
                    {profile.permanentRegistrationNumber}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section Progress */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {completionStatus.sections.map((section, index) => {
            const Icon = getSectionIcon(section.name);
            const isCompleted = section.isCompleted;
            const isMandatory = section.name.includes('*');
            
            return (
              <Card key={index} className={`cursor-pointer transition-all hover:shadow-md ${
                isCompleted ? 'border-success bg-success/5' : 
                isMandatory ? 'border-warning bg-warning/5' : 'border-border'
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-5 w-5 ${
                        isCompleted ? 'text-success' : 
                        isMandatory ? 'text-warning' : 'text-muted-foreground'
                      }`} />
                      <CardTitle className="text-base">{section.name}</CardTitle>
                    </div>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-success" />
                    ) : (
                      <AlertCircle className={`h-5 w-5 ${
                        isMandatory ? 'text-warning' : 'text-muted-foreground'
                      }`} />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {section.completedFields.length} of {section.requiredFields.length} fields
                      </span>
                      <Badge variant={isCompleted ? "default" : "secondary"} className="text-xs">
                        {isCompleted ? 'Complete' : 'Incomplete'}
                      </Badge>
                    </div>
                    
                    <Progress 
                      value={(section.completedFields.length / section.requiredFields.length) * 100} 
                      className="h-2"
                    />
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleEditSection(section.name)}
                    >
                      {isCompleted ? 'Edit Section' : 'Complete Section'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common profile management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" onClick={() => navigate('/profile/edit')}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" onClick={() => navigate('/settings/profile')}>
                <User className="h-4 w-4 mr-2" />
                Profile Settings
              </Button>
              {profile?.permanentRegistrationNumber && (
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Certificate
                </Button>
              )}
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                <ArrowRight className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProfileCompletion;
