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
import { IdentityDocumentType, AccountType, ServiceLevel, ServiceSector, ServiceIndustry, LanguageProficiency } from '@/types/profile';
import { ProfileService } from '@/services/profileService';
import { useAuth } from '@/contexts/AuthContext';

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
    
    // Membership Details
    membershipDetails: [{
      bodyInstitute: '',
      membershipNumber: '',
      memberSince: '',
      uploadedCopy: null,
      practiceLicenseNumber: '',
      licenseValidity: '',
      licenseCopy: null
    }],
    
    // Language Skills
    languageSkills: [{
      language: '',
      speak: LanguageProficiency.LOW,
      read: LanguageProficiency.LOW,
      write: LanguageProficiency.LOW
    }],
    
    // Resources and Infrastructure
    resourceInfra: {
      numberOfPartners: 0,
      numberOfProfessionalStaff: 0,
      numberOfOtherStaff: 0,
      numberOfInternsArticledClerks: 0
    },
    
    // Work Locations
    workLocations: [{ city: '', location: '', pinCode: '' }],
    
    // Open to remote work
    openToRemoteWork: false,
    
    // Billing Details
    billingDetails: [{
      tradeName: '',
      billingAddress: { street: '', city: '', state: '', pinCode: '' },
      gstState: '',
      gstRegistrationNumber: '',
      gstCopy: null,
      panNumber: '',
      panCopy: null,
      tanNumber: '',
      tanCopy: null,
      isDefault: true
    }],
    
    // Banking Details
    bankingDetails: [{
      beneficiaryName: '',
      accountType: '',
      accountNumber: '',
      confirmAccountNumber: '',
      ifscCode: '',
      isDefault: true
    }],
    
    // Services Offered
    servicesOffered: [{
      category: '',
      level: '',
      sector: '',
      industry: '',
      services: [],
      hashtags: []
    }]
  });

  const calculateCompletion = () => {
    const mandatoryFields = [
      formData.name,
      formData.email,
      formData.mobile,
      formData.identityDocument.type,
      formData.identityDocument.number,
      formData.qualifications,
      formData.membershipDetails[0]?.membershipNumber,
      formData.billingDetails[0]?.panNumber,
      formData.bankingDetails[0]?.beneficiaryName,
      formData.bankingDetails[0]?.accountNumber,
      formData.bankingDetails[0]?.ifscCode
    ];
    
    const completedMandatory = mandatoryFields.filter(field => field && field.toString().trim() !== '').length;
    const totalMandatory = mandatoryFields.length;
    
    return Math.round((completedMandatory / totalMandatory) * 100);
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
    <div className="container mx-auto p-6 max-w-6xl">
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
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <Label htmlFor="companyLogo">Company Logo</Label>
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
                      <Input
                        value={service.category}
                        onChange={(e) => handleArrayItemChange('servicesOffered', index, 'category', e.target.value)}
                        placeholder="Enter service category"
                      />
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
                          <SelectItem value={ServiceSector.MANUFACTURING}>Manufacturing</SelectItem>
                          <SelectItem value={ServiceSector.MSME}>MSME</SelectItem>
                          <SelectItem value={ServiceSector.INDUSTRIAL}>Industrial</SelectItem>
                          <SelectItem value={ServiceSector.SERVICES}>Services</SelectItem>
                          <SelectItem value={ServiceSector.IT}>IT</SelectItem>
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
                          <SelectItem value={ServiceIndustry.CHEMICALS}>Chemicals</SelectItem>
                          <SelectItem value={ServiceIndustry.ENGINEERING}>Engineering</SelectItem>
                          <SelectItem value={ServiceIndustry.PHARMA}>Pharma</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Services (comma-separated)</Label>
                    <Textarea
                      value={service.services.join(', ')}
                      onChange={(e) => {
                        const updatedServices = [...formData.servicesOffered];
                        updatedServices[index].services = e.target.value.split(',').map(s => s.trim());
                        setFormData(prev => ({ ...prev, servicesOffered: updatedServices }));
                      }}
                      placeholder="Enter services separated by commas"
                      rows={3}
                    />
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
        
        <Button variant="outline" onClick={onSkip} disabled={loading}>
          <Clock className="h-4 w-4 mr-2" />
          Skip for Now
        </Button>
      </div>
    </div>
  );
};
