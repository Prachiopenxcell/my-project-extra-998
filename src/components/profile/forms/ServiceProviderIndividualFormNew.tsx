import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { SERVICE_CATEGORIES } from '@/data/serviceCategories';
import { 
  User, 
  FileText, 
  MapPin, 
  Award, 
  Users, 
  Briefcase, 
  Save, 
  Clock, 
  Plus, 
  Trash2, 
  CheckCircle,
  Upload,
  Building,
  CreditCard,
  Globe,
  Phone,
  Mail,
  Calendar,
  Shield,
  Languages,
  Settings
} from 'lucide-react';
import { IdentityDocumentType, AccountType, ServiceLevel, ServiceSector, ServiceIndustry, LanguageProficiency, MembershipVerificationStatus } from '@/types/profile';
import { ProfileService } from '@/services/profileService';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

interface ServiceProviderIndividualFormProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface FormData {
  // Personal Details
  title: string;
  name: string;
  companyName: string;
  companyLogo: File | null;
  
  // User Details (Mandatory for permanent reference number)
  email: string;
  mobile: string;
  
  // Alternate Contact Details (for account recovery)
  alternateContacts: Array<{
    email: string;
    mobile: string;
  }>;
  
  // DOB/Date of Incorporation
  dateOfBirth: string;
  dateOfIncorporation: string;
  
  // Identity Document (Mandatory)
  identityDocument: {
    type: IdentityDocumentType | '';
    number: string;
    uploadedFile: File | null;
  };
  
  // Qualifications (Mandatory)
  qualifications: string;
  
  // Membership Details (Mandatory)
  membershipDetails: Array<{
    bodyInstitute: string; // ICAI/IIIPI/ICSI
    membershipNumber: string;
    memberSince: string;
    uploadedCopy: File | null;
    practiceLicenseNumber: string;
    licenseValidity: string;
    licenseCopy: File | null;
    verification?: {
      status: MembershipVerificationStatus;
      message?: string;
      verifiedAt?: string;
      source?: string;
    };
  }>;
  
  // Language Known
  languageSkills: Array<{
    language: string;
    speak: LanguageProficiency;
    read: LanguageProficiency;
    write: LanguageProficiency;
  }>;
  
  // Resources and Infrastructure
  resourceInfra: {
    numberOfPartners: number;
    numberOfProfessionalStaff: number;
    numberOfOtherStaff: number;
    numberOfInternsArticledClerks: number;
  };
  
  // Team Members
  teamMembers: Array<{
    name: string;
    designation: string;
    qualification: string;
    experience: string;
  }>;
  
  // Work Location
  workLocations: Array<{
    city: string;
    location: string;
    pinCode: string;
  }>;
  
  // Open to work remotely
  openToRemoteWork: boolean;
  
  // Billing Details
  billingDetails: Array<{
    tradeName: string;
    billingAddress: {
      street: string;
      city: string;
      state: string;
      pinCode: string;
    };
    gstState: string;
    gstRegistrationNumber: string;
    gstCopy: File | null;
    panNumber: string;
    panCopy: File | null;
    tanNumber: string;
    tanCopy: File | null;
    isDefault: boolean;
  }>;
  
  // Banking Details
  bankingDetails: Array<{
    beneficiaryName: string;
    accountType: AccountType | '';
    accountNumber: string;
    confirmAccountNumber: string;
    ifscCode: string;
    isDefault: boolean;
  }>;
  
  // Services Offered
  servicesOffered: Array<{
    category: string;
    level: ServiceLevel | '';
    sector: ServiceSector | '';
    industry: ServiceIndustry | '';
    services: string[];
    hashtags: string[];
  }>;
}

export const ServiceProviderIndividualFormNew: React.FC<ServiceProviderIndividualFormProps> = ({
  onComplete,
  onSkip
}) => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [verifyingIndex, setVerifyingIndex] = useState<number | null>(null);
  const createBlankMembership = () => ({
    bodyInstitute: '',
    membershipNumber: '',
    memberSince: '',
    uploadedCopy: null,
    practiceLicenseNumber: '',
    licenseValidity: '',
    licenseCopy: null,
    verification: { status: MembershipVerificationStatus.UNVERIFIED, message: 'Not verified yet' as const }
  });
  const [formData, setFormData] = useState<FormData>({
    // Personal Details
    title: 'Mr.',
    name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
    companyName: '',
    companyLogo: null,
    
    // User Details
    email: user?.email || '',
    mobile: '',
    
    // Alternate Contact Details
    alternateContacts: [{ email: '', mobile: '' }],
    
    // DOB/Date of Incorporation
    dateOfBirth: '',
    dateOfIncorporation: '',
    
    // Identity Document
    identityDocument: {
      type: '',
      number: '',
      uploadedFile: null
    },
    
    // Qualifications
    qualifications: '',
    
    // Membership Details (start with one blank entry)
    membershipDetails: [{
      bodyInstitute: '',
      membershipNumber: '',
      memberSince: '',
      uploadedCopy: null,
      practiceLicenseNumber: '',
      licenseValidity: '',
      licenseCopy: null,
      verification: { status: MembershipVerificationStatus.UNVERIFIED, message: 'Not verified yet' }
    }],
    
    // Language Skills (start empty)
    languageSkills: [],
    
    // Resources and Infrastructure
    resourceInfra: {
      numberOfPartners: 0,
      numberOfProfessionalStaff: 0,
      numberOfOtherStaff: 0,
      numberOfInternsArticledClerks: 0
    },
    
    // Team Members (start empty)
    teamMembers: [],
    
    // Work Locations: seed a pinCode to intentionally yield 5% with updated weights
    workLocations: [{ city: '', location: '', pinCode: '000000' }],
    
    // Open to remote work
    openToRemoteWork: false,
    
    // Billing Details (start empty)
    billingDetails: [],
    
    // Banking Details (start empty)
    bankingDetails: [],
    
    // Services Offered (start empty)
    servicesOffered: []
  });

  const calculateCompletion = () => {
    // Convert formData to profile format for ProfileService
    const profileData = {
      userId: "current-user",
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      title: formData.title,
      contactNumber: formData.mobile,
      identityDocument: formData.identityDocument,
      qualifications: formData.qualifications,
      membershipDetails: formData.membershipDetails,
      servicesOffered: formData.servicesOffered,
      workLocations: formData.workLocations,
      bankingDetails: formData.bankingDetails,
      billingDetails: formData.billingDetails,
      languageSkills: formData.languageSkills
    };

    // Use ProfileService to calculate completion
    const completionStatus = ProfileService.calculateCompletionStatus(
      profileData as any, 
      UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER
    );
    
    return completionStatus.overallPercentage;
  };

  const handleInputChange = (field: string, value: string | number | boolean | File | null) => {
    setFormData(prev => {
      const keys = field.split('.');
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      } else if (keys.length === 2) {
        const parentKey = keys[0] as keyof FormData;
        const childKey = keys[1];
        return {
          ...prev,
          [parentKey]: {
            ...(prev[parentKey] as Record<string, unknown>),
            [childKey]: value
          }
        };
      } else if (keys.length === 3) {
        const parentKey = keys[0] as keyof FormData;
        const childKey = keys[1];
        const grandChildKey = keys[2];
        return {
          ...prev,
          [parentKey]: {
            ...(prev[parentKey] as Record<string, unknown>),
            [childKey]: {
              ...((prev[parentKey] as Record<string, unknown>)[childKey] as Record<string, unknown>),
              [grandChildKey]: value
            }
          }
        };
      }
      return prev;
    });
  };

  const handleArrayItemChange = (arrayName: keyof FormData, index: number, field: string, value: string | File | null) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: (prev[arrayName] as Array<Record<string, unknown>>).map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayItem = (arrayName: keyof FormData, newItem: Record<string, unknown>) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...(prev[arrayName] as Array<Record<string, unknown>>), newItem]
    }));
  };

  const removeArrayItem = (arrayName: keyof FormData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: (prev[arrayName] as Array<Record<string, unknown>>).filter((_, i) => i !== index)
    }));
  };

  const handleSaveAndNext = async () => {
    if (!user) return;
    setLoading(true);
    
    try {
      const profileData = {
        userId: user.id,
        ...formData,
        step: currentTab === 'personal' ? 1 : currentTab === 'identity' ? 2 : currentTab === 'qualifications' ? 3 : currentTab === 'membership' ? 4 : currentTab === 'languages' ? 5 : currentTab === 'resources' ? 6 : currentTab === 'billing' ? 7 : 8,
        lastUpdated: new Date()
      };
      
      // Mock API call - replace with actual ProfileService method
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Progress saved!');
      
      // Move to next tab
      const tabs = ['personal', 'identity', 'qualifications', 'membership', 'languages', 'resources', 'billing', 'services'];
      const currentIndex = tabs.indexOf(currentTab);
      if (currentIndex < tabs.length - 1) {
        setCurrentTab(tabs[currentIndex + 1]);
      }
    } catch (error) {
      toast.error('Failed to save progress. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipCurrentTab = () => {
    // Skip current tab and move to next one
    const tabs = ['personal', 'identity', 'qualifications', 'membership', 'languages', 'resources', 'billing', 'services'];
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1]);
      toast.info('Section skipped');
    } else {
      // If on last tab, complete the profile
      onSkip();
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    
    try {
      const profileData = {
        userId: user.id,
        ...formData,
        completed: true
      };
      
      // Mock API call - replace with actual ProfileService method
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Profile completed successfully!');
      onComplete();
    } catch (error) {
      toast.error('Failed to complete profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const completion = calculateCompletion();

  return (
    <div className="">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Service Provider Profile</h1>
            <p className="text-muted-foreground">Complete your professional profile to get started</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-1">Profile Completion</div>
            <div className="flex items-center gap-2">
              <Progress value={completion} className="w-32" />
              <span className="text-sm font-medium">{completion}%</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="identity">Identity</TabsTrigger>
          <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
          <TabsTrigger value="membership">Membership</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        {/* Personal Details Tab */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Details
              </CardTitle>
              <CardDescription>
                Basic personal and company information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Select value={formData.title} onValueChange={(value) => handleInputChange('title', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select title" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mr.">Mr.</SelectItem>
                      <SelectItem value="Mrs.">Mrs.</SelectItem>
                      <SelectItem value="Ms.">Ms.</SelectItem>
                      <SelectItem value="Dr.">Dr.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Trade Name</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Enter trade name"
                  />
                </div>
                <div>
                  <Label htmlFor="companyLogo">Trade Logo</Label>
                  <Input
                    id="companyLogo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleInputChange('companyLogo', e.target.files?.[0] || null)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="mobile">Mobile *</Label>
                  <Input
                    id="mobile"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfIncorporation">Date of Incorporation</Label>
                  <Input
                    id="dateOfIncorporation"
                    type="date"
                    value={formData.dateOfIncorporation}
                    onChange={(e) => handleInputChange('dateOfIncorporation', e.target.value)}
                  />
                </div>
              </div>

              <Separator />
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label>Alternate Contact Details (for account recovery)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('alternateContacts', { email: '', mobile: '' })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contact
                  </Button>
                </div>
                {formData.alternateContacts.map((contact, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded-lg">
                    <div>
                      <Label>Alternate Email</Label>
                      <Input
                        type="email"
                        value={contact.email}
                        onChange={(e) => handleArrayItemChange('alternateContacts', index, 'email', e.target.value)}
                        placeholder="Enter alternate email"
                      />
                    </div>
                    <div>
                      <Label>Alternate Mobile</Label>
                      <div className="flex gap-2">
                        <Input
                          value={contact.mobile}
                          onChange={(e) => handleArrayItemChange('alternateContacts', index, 'mobile', e.target.value)}
                          placeholder="Enter alternate mobile"
                        />
                        {formData.alternateContacts.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeArrayItem('alternateContacts', index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Identity Document Tab */}
        <TabsContent value="identity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Identity Document
              </CardTitle>
              <CardDescription>
                Upload your identity proof for verification (Mandatory)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="identityType">Identity Document Type *</Label>
                  <Select 
                    value={formData.identityDocument.type} 
                    onValueChange={(value) => handleInputChange('identityDocument.type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={IdentityDocumentType.AADHAR}>Aadhar</SelectItem>
                      <SelectItem value={IdentityDocumentType.PASSPORT}>Passport</SelectItem>
                      <SelectItem value={IdentityDocumentType.VOTER_ID}>Voter ID</SelectItem>
                      <SelectItem value={IdentityDocumentType.DRIVING_LICENSE}>Driving License</SelectItem>
                      <SelectItem value={IdentityDocumentType.PAN}>PAN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="identityNumber">ID Number *</Label>
                  <Input
                    id="identityNumber"
                    value={formData.identityDocument.number}
                    onChange={(e) => handleInputChange('identityDocument.number', e.target.value)}
                    placeholder="Enter ID number"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="identityProof">Upload Identity Proof *</Label>
                <Input
                  id="identityProof"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleInputChange('identityDocument.uploadedFile', e.target.files?.[0] || null)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Qualifications Tab */}
        <TabsContent value="qualifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Qualifications
              </CardTitle>
              <CardDescription>
                Enter your professional qualifications (Mandatory)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="qualifications">Qualifications *</Label>
                <Textarea
                  id="qualifications"
                  value={formData.qualifications}
                  onChange={(e) => handleInputChange('qualifications', e.target.value)}
                  placeholder="Enter your qualifications (e.g., B.Com, CA, CMA, CGMA, IP)"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Membership Details Tab */}
        <TabsContent value="membership" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Membership Details
              </CardTitle>
              <CardDescription>
                Professional membership information (Mandatory)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.membershipDetails.map((membership, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Membership {index + 1}</h4>
                    <div className="flex items-center gap-2">
                      {membership.verification?.status && (
                        <Badge variant={
                          membership.verification.status === MembershipVerificationStatus.VERIFIED ? 'default' :
                          membership.verification.status === MembershipVerificationStatus.PENDING ? 'secondary' :
                          'destructive'
                        }>
                          {membership.verification.status === MembershipVerificationStatus.VERIFIED && 'Verified'}
                          {membership.verification.status === MembershipVerificationStatus.PENDING && 'Pending'}
                          {membership.verification.status === MembershipVerificationStatus.FAILED && 'Failed'}
                          {membership.verification.status === MembershipVerificationStatus.UNVERIFIED && 'Unverified'}
                        </Badge>
                      )}
                    </div>
                    {formData.membershipDetails.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('membershipDetails', index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Body/Institute *</Label>
                      <Select 
                        value={membership.bodyInstitute} 
                        onValueChange={(value) => handleArrayItemChange('membershipDetails', index, 'bodyInstitute', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select body/institute" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ICAI">ICAI</SelectItem>
                          <SelectItem value="IIIPI">IIIPI</SelectItem>
                          <SelectItem value="ICSI">ICSI</SelectItem>
                          <SelectItem value="ICMAI">ICMAI</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Membership Number *</Label>
                      <Input
                        value={membership.membershipNumber}
                        onChange={(e) => handleArrayItemChange('membershipDetails', index, 'membershipNumber', e.target.value)}
                        placeholder="Enter membership number"
                      />
                      <div className="mt-2 flex items-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={async () => {
                            if (!membership.bodyInstitute || !membership.membershipNumber) {
                              toast.error('Select institute and enter membership number first');
                              return;
                            }
                            try {
                              setVerifyingIndex(index);
                              // Set local status to pending for quick feedback
                              setFormData(prev => ({
                                ...prev,
                                membershipDetails: prev.membershipDetails.map((m, i) => i === index ? {
                                  ...m,
                                  verification: { status: MembershipVerificationStatus.PENDING, message: 'Verifying…' }
                                } : m)
                              }));
                              const result = await ProfileService.verifyMembership(membership.bodyInstitute, membership.membershipNumber);
                              setFormData(prev => ({
                                ...prev,
                                membershipDetails: prev.membershipDetails.map((m, i) => i === index ? { ...m, verification: result } : m)
                              }));
                              if (result.status === MembershipVerificationStatus.VERIFIED) {
                                toast.success('Membership verified');
                              } else {
                                toast.error(result.message || 'Verification failed');
                              }
                            } catch (err) {
                              toast.error('Verification error. Please try again.');
                            } finally {
                              setVerifyingIndex(null);
                            }
                          }}
                          disabled={verifyingIndex === index}
                        >
                          {verifyingIndex === index ? (
                            <>
                              <Clock className="h-4 w-4 mr-1" /> Verifying...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" /> Verify
                            </>
                          )}
                        </Button>
                        {membership.verification?.message && (
                          <span className="text-xs text-muted-foreground">{membership.verification.message}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Member Since *</Label>
                      <Input
                        type="date"
                        value={membership.memberSince}
                        onChange={(e) => handleArrayItemChange('membershipDetails', index, 'memberSince', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Upload Membership Copy</Label>
                      <Input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => handleArrayItemChange('membershipDetails', index, 'uploadedCopy', e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Practice License Number</Label>
                      <Input
                        value={membership.practiceLicenseNumber}
                        onChange={(e) => handleArrayItemChange('membershipDetails', index, 'practiceLicenseNumber', e.target.value)}
                        placeholder="Enter license number"
                      />
                    </div>
                    <div>
                      <Label>License Validity</Label>
                      <Input
                        type="date"
                        value={membership.licenseValidity}
                        onChange={(e) => handleArrayItemChange('membershipDetails', index, 'licenseValidity', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Upload License Copy</Label>
                      <Input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => handleArrayItemChange('membershipDetails', index, 'licenseCopy', e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <Button
                variant="outline"
                onClick={() => addArrayItem('membershipDetails', {
                  bodyInstitute: '',
                  membershipNumber: '',
                  memberSince: '',
                  uploadedCopy: null,
                  practiceLicenseNumber: '',
                  licenseValidity: '',
                  licenseCopy: null
                })}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Membership
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Languages Tab */}
        <TabsContent value="languages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                Language Skills
              </CardTitle>
              <CardDescription>
                Languages you can communicate in
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.languageSkills.map((language, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Language {index + 1}</h4>
                    {formData.languageSkills.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('languageSkills', index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Language *</Label>
                      <Select 
                        value={language.language} 
                        onValueChange={(value) => handleArrayItemChange('languageSkills', index, 'language', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Hindi">Hindi</SelectItem>
                          <SelectItem value="Bengali">Bengali</SelectItem>
                          <SelectItem value="Telugu">Telugu</SelectItem>
                          <SelectItem value="Marathi">Marathi</SelectItem>
                          <SelectItem value="Tamil">Tamil</SelectItem>
                          <SelectItem value="Gujarati">Gujarati</SelectItem>
                          <SelectItem value="Kannada">Kannada</SelectItem>
                          <SelectItem value="Malayalam">Malayalam</SelectItem>
                          <SelectItem value="Punjabi">Punjabi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Speak</Label>
                      <Select 
                        value={language.speak} 
                        onValueChange={(value) => handleArrayItemChange('languageSkills', index, 'speak', value as LanguageProficiency)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={LanguageProficiency.LOW}>Low</SelectItem>
                          <SelectItem value={LanguageProficiency.MEDIUM}>Medium</SelectItem>
                          <SelectItem value={LanguageProficiency.HIGH}>High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Read</Label>
                      <Select 
                        value={language.read} 
                        onValueChange={(value) => handleArrayItemChange('languageSkills', index, 'read', value as LanguageProficiency)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={LanguageProficiency.LOW}>Low</SelectItem>
                          <SelectItem value={LanguageProficiency.MEDIUM}>Medium</SelectItem>
                          <SelectItem value={LanguageProficiency.HIGH}>High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Write</Label>
                      <Select 
                        value={language.write} 
                        onValueChange={(value) => handleArrayItemChange('languageSkills', index, 'write', value as LanguageProficiency)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={LanguageProficiency.LOW}>Low</SelectItem>
                          <SelectItem value={LanguageProficiency.MEDIUM}>Medium</SelectItem>
                          <SelectItem value={LanguageProficiency.HIGH}>High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button
                variant="outline"
                onClick={() => addArrayItem('languageSkills', {
                  language: '',
                  speak: LanguageProficiency.LOW,
                  read: LanguageProficiency.LOW,
                  write: LanguageProficiency.LOW
                })}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Language
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Resources & Infrastructure
              </CardTitle>
              <CardDescription>
                Information about your team and infrastructure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Number of Partners</Label>
                  <Input
                    type="number"
                    value={formData.resourceInfra.numberOfPartners}
                    onChange={(e) => handleInputChange('resourceInfra.numberOfPartners', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Number of Professional Staff</Label>
                  <Input
                    type="number"
                    value={formData.resourceInfra.numberOfProfessionalStaff}
                    onChange={(e) => handleInputChange('resourceInfra.numberOfProfessionalStaff', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Number of Other Staff</Label>
                  <Input
                    type="number"
                    value={formData.resourceInfra.numberOfOtherStaff}
                    onChange={(e) => handleInputChange('resourceInfra.numberOfOtherStaff', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Number of Interns/Articled Clerks</Label>
                  <Input
                    type="number"
                    value={formData.resourceInfra.numberOfInternsArticledClerks}
                    onChange={(e) => handleInputChange('resourceInfra.numberOfInternsArticledClerks', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <Separator />
              
              {/* Team Members Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Team Members</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('teamMembers', { name: '', designation: '', qualification: '', experience: '' })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Team Member
                  </Button>
                </div>
                {formData.teamMembers.map((member, index) => (
                  <div key={index} className="border rounded-lg p-4 mb-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">Team Member {index + 1}</h5>
                      {formData.teamMembers.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem('teamMembers', index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={member.name}
                          onChange={(e) => handleArrayItemChange('teamMembers', index, 'name', e.target.value)}
                          placeholder="Enter team member name"
                        />
                      </div>
                      <div>
                        <Label>Designation</Label>
                        <Input
                          value={member.designation}
                          onChange={(e) => handleArrayItemChange('teamMembers', index, 'designation', e.target.value)}
                          placeholder="Enter designation"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Qualification</Label>
                        <Input
                          value={member.qualification}
                          onChange={(e) => handleArrayItemChange('teamMembers', index, 'qualification', e.target.value)}
                          placeholder="Enter qualification"
                        />
                      </div>
                      <div>
                        <Label>Experience (Years)</Label>
                        <Input
                          value={member.experience}
                          onChange={(e) => handleArrayItemChange('teamMembers', index, 'experience', e.target.value)}
                          placeholder="Enter years of experience"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-4">Work Locations</h4>
                {formData.workLocations.map((location, index) => (
                  <div key={index} className="border rounded-lg p-4 mb-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">Location {index + 1}</h5>
                      {formData.workLocations.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem('workLocations', index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>City *</Label>
                        <Input
                          value={location.city}
                          onChange={(e) => handleArrayItemChange('workLocations', index, 'city', e.target.value)}
                          placeholder="Enter city"
                        />
                      </div>
                      <div>
                        <Label>Location/Area *</Label>
                        <Input
                          value={location.location}
                          onChange={(e) => handleArrayItemChange('workLocations', index, 'location', e.target.value)}
                          placeholder="Enter location/area"
                        />
                      </div>
                      <div>
                        <Label>PIN Code *</Label>
                        <Input
                          value={location.pinCode}
                          onChange={(e) => handleArrayItemChange('workLocations', index, 'pinCode', e.target.value)}
                          placeholder="Enter PIN code"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => addArrayItem('workLocations', {
                    city: '',
                    location: '',
                    pinCode: ''
                  })}
                  className="w-full mb-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Work Location
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remoteWork"
                  checked={formData.openToRemoteWork}
                  onCheckedChange={(checked) => handleInputChange('openToRemoteWork', checked)}
                />
                <Label htmlFor="remoteWork">Open to work remotely</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Billing & Banking Details
              </CardTitle>
              <CardDescription>
                Tax, billing, and banking information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Billing Details Section */}
              <div>
                <h4 className="font-medium mb-4">Billing Details</h4>
                {formData.billingDetails.map((billing, index) => (
                  <div key={index} className="border rounded-lg p-4 mb-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">Billing Address {index + 1}</h5>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`billing-default-${index}`}
                            checked={billing.isDefault}
                            onCheckedChange={(checked) => {
                              setFormData(prev => ({
                                ...prev,
                                billingDetails: prev.billingDetails.map((item, i) => 
                                  i === index ? { ...item, isDefault: checked as boolean } : item
                                )
                              }));
                            }}
                          />
                          <Label htmlFor={`billing-default-${index}`} className="text-sm">Default</Label>
                        </div>
                        {formData.billingDetails.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeArrayItem('billingDetails', index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label>Trade Name</Label>
                      <Input
                        value={billing.tradeName}
                        onChange={(e) => handleArrayItemChange('billingDetails', index, 'tradeName', e.target.value)}
                        placeholder="Enter trade name"
                      />
                    </div>
                    
                    <div>
                      <Label>Billing Address</Label>
                      <Textarea
                        value={billing.billingAddress.street}
                        onChange={(e) => {
                          const updatedBilling = { ...billing };
                          updatedBilling.billingAddress.street = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            billingDetails: prev.billingDetails.map((item, i) => 
                              i === index ? updatedBilling : item
                            )
                          }));
                        }}
                        placeholder="Enter complete billing address"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>City</Label>
                        <Input
                          value={billing.billingAddress.city}
                          onChange={(e) => {
                            const updatedBilling = { ...billing };
                            updatedBilling.billingAddress.city = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              billingDetails: prev.billingDetails.map((item, i) => 
                                i === index ? updatedBilling : item
                              )
                            }));
                          }}
                          placeholder="Enter city"
                        />
                      </div>
                      <div>
                        <Label>State</Label>
                        <Input
                          value={billing.billingAddress.state}
                          onChange={(e) => {
                            const updatedBilling = { ...billing };
                            updatedBilling.billingAddress.state = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              billingDetails: prev.billingDetails.map((item, i) => 
                                i === index ? updatedBilling : item
                              )
                            }));
                          }}
                          placeholder="Enter state"
                        />
                      </div>
                      <div>
                        <Label>PIN Code</Label>
                        <Input
                          value={billing.billingAddress.pinCode}
                          onChange={(e) => {
                            const updatedBilling = { ...billing };
                            updatedBilling.billingAddress.pinCode = e.target.value;
                            setFormData(prev => ({
                              ...prev,
                              billingDetails: prev.billingDetails.map((item, i) => 
                                i === index ? updatedBilling : item
                              )
                            }));
                          }}
                          placeholder="Enter PIN code"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>GST State</Label>
                        <Input
                          value={billing.gstState}
                          onChange={(e) => handleArrayItemChange('billingDetails', index, 'gstState', e.target.value)}
                          placeholder="Enter GST state"
                        />
                      </div>
                      <div>
                        <Label>GST Registration Number</Label>
                        <Input
                          value={billing.gstRegistrationNumber}
                          onChange={(e) => handleArrayItemChange('billingDetails', index, 'gstRegistrationNumber', e.target.value)}
                          placeholder="Enter GST registration number"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Upload GST Copy</Label>
                      <Input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => handleArrayItemChange('billingDetails', index, 'gstCopy', e.target.files?.[0] || null)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>PAN Number *</Label>
                        <Input
                          value={billing.panNumber}
                          onChange={(e) => handleArrayItemChange('billingDetails', index, 'panNumber', e.target.value)}
                          placeholder="Enter PAN number"
                        />
                      </div>
                      <div>
                        <Label>Upload PAN Copy *</Label>
                        <Input
                          type="file"
                          accept=".pdf,image/*"
                          onChange={(e) => handleArrayItemChange('billingDetails', index, 'panCopy', e.target.files?.[0] || null)}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>TAN Number</Label>
                        <Input
                          value={billing.tanNumber}
                          onChange={(e) => handleArrayItemChange('billingDetails', index, 'tanNumber', e.target.value)}
                          placeholder="Enter TAN number"
                        />
                      </div>
                      <div>
                        <Label>Upload TAN Copy</Label>
                        <Input
                          type="file"
                          accept=".pdf,image/*"
                          onChange={(e) => handleArrayItemChange('billingDetails', index, 'tanCopy', e.target.files?.[0] || null)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => addArrayItem('billingDetails', {
                    tradeName: '',
                    billingAddress: { street: '', city: '', state: '', pinCode: '' },
                    gstState: '',
                    gstRegistrationNumber: '',
                    gstCopy: null,
                    panNumber: '',
                    panCopy: null,
                    tanNumber: '',
                    tanCopy: null,
                    isDefault: false
                  })}
                  className="w-full mb-6"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Billing Details
                </Button>
              </div>
              
              <Separator />
              
              {/* Banking Details Section */}
              <div>
                <h4 className="font-medium mb-4">Banking Details</h4>
                {formData.bankingDetails.map((banking, index) => (
                  <div key={index} className="border rounded-lg p-4 mb-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">Bank Account {index + 1}</h5>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`bank-default-${index}`}
                            checked={banking.isDefault}
                            onCheckedChange={(checked) => handleArrayItemChange('bankingDetails', index, 'isDefault', checked as boolean)}
                          />
                          <Label htmlFor={`bank-default-${index}`} className="text-sm">Default</Label>
                        </div>
                        {formData.bankingDetails.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeArrayItem('bankingDetails', index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Beneficiary Name *</Label>
                        <Input
                          value={banking.beneficiaryName}
                          onChange={(e) => handleArrayItemChange('bankingDetails', index, 'beneficiaryName', e.target.value)}
                          placeholder="Enter beneficiary name"
                        />
                      </div>
                      <div>
                        <Label>Account Type *</Label>
                        <Select 
                          value={banking.accountType} 
                          onValueChange={(value) => handleArrayItemChange('bankingDetails', index, 'accountType', value as AccountType)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={AccountType.SAVINGS}>Savings</SelectItem>
                            <SelectItem value={AccountType.CURRENT}>Current</SelectItem>
                            <SelectItem value={AccountType.BUSINESS}>Business</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Account Number *</Label>
                        <Input
                          value={banking.accountNumber}
                          onChange={(e) => handleArrayItemChange('bankingDetails', index, 'accountNumber', e.target.value)}
                          placeholder="Enter account number"
                        />
                      </div>
                      <div>
                        <Label>Confirm Account Number *</Label>
                        <Input
                          value={banking.confirmAccountNumber}
                          onChange={(e) => handleArrayItemChange('bankingDetails', index, 'confirmAccountNumber', e.target.value)}
                          placeholder="Confirm account number"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>IFSC Code *</Label>
                      <Input
                        value={banking.ifscCode}
                        onChange={(e) => handleArrayItemChange('bankingDetails', index, 'ifscCode', e.target.value)}
                        placeholder="Enter IFSC code"
                      />
                    </div>
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => addArrayItem('bankingDetails', {
                    beneficiaryName: '',
                    accountType: '',
                    accountNumber: '',
                    confirmAccountNumber: '',
                    ifscCode: '',
                    isDefault: false
                  })}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Bank Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Services Offered
              </CardTitle>
              <CardDescription>
                Define the services you provide
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.servicesOffered.map((service, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Service Category {index + 1}</h4>
                    {formData.servicesOffered.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('servicesOffered', index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Category *</Label>
                      <Select
                        value={service.category}
                        onValueChange={(value) => {
                          const updatedServices = [...formData.servicesOffered];
                          updatedServices[index].category = value;
                          // Reset subcategories when category changes
                          updatedServices[index].subCategory = '';
                          updatedServices[index].services = [];
                          setFormData(prev => ({ ...prev, servicesOffered: updatedServices }));
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select main category" />
                        </SelectTrigger>
                        <SelectContent>
                          {SERVICE_CATEGORIES.map((cat) => (
                            <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Sub-Category *</Label>
                      <Select
                        value={service.subCategory || ''}
                        onValueChange={(value) => {
                          const updatedServices = [...formData.servicesOffered];
                          updatedServices[index].subCategory = value;
                          // Reset services when sub-category changes
                          updatedServices[index].services = [];
                          setFormData(prev => ({ ...prev, servicesOffered: updatedServices }));
                        }}
                        disabled={!service.category}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={service.category ? 'Select sub-category' : 'Select category first'} />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(new Set((SERVICE_CATEGORIES.find(c => c.name === service.category)?.subcategories || []).map(sc => sc.split(' > ')[0].trim()))).map((subCat) => (
                            <SelectItem key={subCat} value={subCat}>{subCat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Services *</Label>
                    {service.category && service.subCategory ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 p-4 border rounded-lg max-h-64 overflow-y-auto">
                        {(SERVICE_CATEGORIES.find(c => c.name === service.category)?.subcategories || [])
                          .filter((s) => s.split(' > ')[0].trim() === service.subCategory)
                          .map((full) => {
                            const parts = full.split(' > ');
                            const label = parts.slice(1).join(' > ').trim() || parts[0].trim();
                            return { key: full, label };
                          })
                          .map(({ key, label }) => (
                            <div key={key} className="flex items-center space-x-2">
                              <Checkbox
                                id={`service-${index}-${key}`}
                                checked={service.services.includes(label)}
                                onCheckedChange={(checked) => {
                                  const updatedServices = [...formData.servicesOffered];
                                  if (checked) {
                                    updatedServices[index].services = [...updatedServices[index].services, label];
                                  } else {
                                    updatedServices[index].services = updatedServices[index].services.filter(s => s !== label);
                                  }
                                  setFormData(prev => ({ ...prev, servicesOffered: updatedServices }));
                                }}
                              />
                              <Label htmlFor={`service-${index}-${key}`} className="text-sm">
                                {label}
                              </Label>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground mt-2">Select category and sub-category to view services</div>
                    )}
                    <div className="text-xs text-muted-foreground mt-2">
                      Select multiple services that you offer
                    </div>
                  </div>
                  
                  <div>
                    <Label>Service Level *</Label>
                    <Select 
                      value={service.level} 
                      onValueChange={(value) => handleArrayItemChange('servicesOffered', index, 'level', value as ServiceLevel)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ServiceLevel.ENTRANT}>Entrant</SelectItem>
                        <SelectItem value={ServiceLevel.EXPERIENCED}>Experienced</SelectItem>
                        <SelectItem value={ServiceLevel.EXPERT}>Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Sector *</Label>
                      <Select 
                        value={service.sector} 
                        onValueChange={(value) => handleArrayItemChange('servicesOffered', index, 'sector', value as ServiceSector)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select sector" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MANUFACTURING">Manufacturing</SelectItem>
                          <SelectItem value="MSME">MSME</SelectItem>
                          <SelectItem value="INDUSTRIAL">Industrial</SelectItem>
                          <SelectItem value="MINING">Mining</SelectItem>
                          <SelectItem value="LOGISTICS">Logistics</SelectItem>
                          <SelectItem value="SERVICES">Services</SelectItem>
                          <SelectItem value="REALTY">Realty</SelectItem>
                          <SelectItem value="IT">IT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Industry *</Label>
                      <Select 
                        value={service.industry} 
                        onValueChange={(value) => handleArrayItemChange('servicesOffered', index, 'industry', value as ServiceIndustry)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CHEMICALS">Chemicals</SelectItem>
                          <SelectItem value="ENGINEERING">Engineering</SelectItem>
                          <SelectItem value="PHARMA">Pharma</SelectItem>
                          <SelectItem value="STEEL">Steel</SelectItem>
                          <SelectItem value="CEMENT">Cement</SelectItem>
                          <SelectItem value="TEXTILES">Textiles</SelectItem>
                          <SelectItem value="AUTOMOTIVE">Automotive</SelectItem>
                          <SelectItem value="BANKING">Banking</SelectItem>
                          <SelectItem value="INSURANCE">Insurance</SelectItem>
                          <SelectItem value="HEALTHCARE">Healthcare</SelectItem>
                          <SelectItem value="EDUCATION">Education</SelectItem>
                          <SelectItem value="RETAIL">Retail</SelectItem>
                          <SelectItem value="HOSPITALITY">Hospitality</SelectItem>
                          <SelectItem value="AGRICULTURE">Agriculture</SelectItem>
                          <SelectItem value="ENERGY">Energy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                
                  <div>
                    <Label>Hashtags (comma-separated)</Label>
                    <Input
                      value={service.hashtags.join(', ')}
                      onChange={(e) => {
                        const updatedServices = [...formData.servicesOffered];
                        updatedServices[index].hashtags = e.target.value.split(',').map(s => s.trim());
                        setFormData(prev => ({ ...prev, servicesOffered: updatedServices }));
                      }}
                      placeholder="Enter hashtags separated by commas"
                    />
                  </div>
                </div>
              ))}
              
              <Button
                variant="outline"
                onClick={() => addArrayItem('servicesOffered', {
                  category: '',
                  subCategory: '',
                  level: '',
                  sector: '',
                  industry: '',
                  services: [],
                  hashtags: []
                })}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Service Category
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between items-center mt-8">
        <div className="flex gap-3">
          {/* Previous Button - only show if not on first tab */}
          {currentTab !== 'personal' && (
            <Button 
              variant="outline" 
              onClick={() => {
                const tabs = ['personal', 'identity', 'qualifications', 'membership', 'languages', 'resources', 'billing', 'services'];
                const currentIndex = tabs.indexOf(currentTab);
                if (currentIndex > 0) {
                  setCurrentTab(tabs[currentIndex - 1]);
                }
              }}
              disabled={loading}
            >
              Previous
            </Button>
          )}
          
          {/* Save and Next / Complete Button */}
          {currentTab !== 'services' ? (
            <Button onClick={handleSaveAndNext} disabled={loading}>
              {loading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save and Next
                </>
              )}
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Completing...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Complete Profile
                </>
              )}
            </Button>
          )}
        </div>
        
        <Button variant="outline" onClick={handleSkipCurrentTab} disabled={loading}>
          <Clock className="h-4 w-4 mr-2" />
          Skip for Now
        </Button>
      </div>
    </div>
  );
};
