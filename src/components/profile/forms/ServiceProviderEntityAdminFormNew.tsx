import React, { useState } from 'react';
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
  Building, 
  Users, 
  FileText, 
  UserCheck, 
  Briefcase,
  Save, 
  Clock, 
  Plus, 
  Trash2, 
  CheckCircle,
  Upload,
  CreditCard,
  Shield
} from 'lucide-react';
import { PersonType, IdentityDocumentType, AccountType, ServiceLevel, ServiceSector, ServiceIndustry } from '@/types/profile';
import { ProfileService } from '@/services/profileService';
import { ServiceProviderEntityProfile } from '@/types/profile';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

interface ServiceProviderEntityAdminFormProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface FormData {
  // Person Type
  personType: string;
  otherPersonType: string; // For "Any other" option
  
  // User Details (Mandatory for permanent registration number)
  name: string;
  companyName: string;
  companyLogo: File | null;
  dateOfIncorporation: string;
  incorporationCertificate: File | null;
  
  // Identity Document Details
  identityDocument: {
    type: string;
    number: string;
    uploadedFile: File | null;
  };
  
  // Contact Information
  email: string;
  contactNumber: string;
  
  // Address
  address: {
    street: string;
    city: string;
    state: string;
    pinCode: string;
  };
  
  // Tax Information
  panNumber: string;
  panCopy: File | null;
  tanNumber: string;
  tanCopy: File | null;
  gstNumber: string;
  gstCopy: File | null;
  
  // Billing Address
  useSameAddress: boolean;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    pinCode: string;
  };
  
  // Banking Details
  bankingDetails: Array<{
    id: string;
    beneficiaryName: string;
    accountNumber: string;
    accountType: AccountType | '';
    ifscCode: string;
    bankName: string;
    branchName: string;
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
  
  // AR Details
  authorizedRepresentative: {
    name: string;
    designation: string;
    email: string;
    contactNumber: string;
    address: {
      street: string;
      city: string;
      state: string;
      pinCode: string;
    };
    identityDocument: {
      type: IdentityDocumentType | '';
      number: string;
      uploadedFile: File | null;
    };
  };
  
  // Resource Infrastructure
  resourceInfra: {
    numberOfPartners: number;
    partners: Array<{
      name: string;
      professionalProfileLink: string;
    }>;
    numberOfProfessionalStaff: number;
    numberOfOtherStaff: number;
    numberOfInternsArticledClerks: number;
  };
  
  // Remote Work Preference (optional section used for low-percentage seeding)
  openToRemoteWork: boolean;
}

export const ServiceProviderEntityAdminFormNew: React.FC<ServiceProviderEntityAdminFormProps> = ({
  onComplete,
  onSkip
}) => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    personType: '',
    otherPersonType: '',
    name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
    companyName: '',
    companyLogo: null,
    dateOfIncorporation: '',
    incorporationCertificate: null,
    
    identityDocument: {
      type: '',
      number: '',
      uploadedFile: null
    },
    
    email: user?.email || '',
    contactNumber: '',
    
    address: {
      street: '',
      city: '',
      state: '',
      pinCode: ''
    },
    
    panNumber: '',
    panCopy: null,
    tanNumber: '',
    tanCopy: null,
    gstNumber: '',
    gstCopy: null,
    
    useSameAddress: true,
    billingAddress: {
      street: '',
      city: '',
      state: '',
      pinCode: ''
    },
    
    bankingDetails: [{
      id: '1',
      beneficiaryName: '',
      accountNumber: '',
      accountType: '',
      ifscCode: '',
      bankName: '',
      branchName: '',
      isDefault: true,
    }],
    
    servicesOffered: [{
      category: '',
      level: '',
      sector: '',
      industry: '',
      services: [],
      hashtags: []
    }],
    
    authorizedRepresentative: {
      name: '',
      designation: '',
      email: '',
      contactNumber: '',
      address: {
        street: '',
        city: '',
        state: '',
        pinCode: ''
      },
      identityDocument: {
        type: '',
        number: '',
        uploadedFile: null
      }
    },
    
    resourceInfra: {
      numberOfPartners: 0,
      partners: [],
      numberOfProfessionalStaff: 0,
      numberOfOtherStaff: 0,
      numberOfInternsArticledClerks: 0
    },
    
    // Default to true so the form's progress reflects the seeded ~5%
    openToRemoteWork: true
  });

  const calculateCompletion = () => {
    // Convert formData to profile format for ProfileService
    const profileData = {
      userId: "current-user",
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      mobile: formData.contactNumber,
      title: "Mr.", // Default value
      personType: formData.personType,
      companyName: formData.companyName,
      dateOfIncorporation: formData.dateOfIncorporation,
      incorporationCertificate: formData.incorporationCertificate,
      address: formData.address,
      identityDocument: formData.identityDocument,
      panNumber: formData.panNumber,
      panCopy: formData.panCopy,
      tanNumber: formData.tanNumber,
      tanCopy: formData.tanCopy,
      gstNumber: formData.gstNumber,
      gstCopy: formData.gstCopy,
      bankingDetails: formData.bankingDetails,
      authorizedRepresentative: formData.authorizedRepresentative,
      resourceInfra: formData.resourceInfra,
      servicesOffered: formData.servicesOffered,
      qualifications: "", // Default empty
      membershipDetails: [], // Default empty
      workLocations: [], // Default empty
      openToRemoteWork: formData.openToRemoteWork
    };

    // Use ProfileService to calculate completion
    const completionStatus = ProfileService.calculateCompletionStatus(
      profileData as unknown as ServiceProviderEntityProfile,
      UserRole.SERVICE_PROVIDER_ENTITY_ADMIN
    );
    
    return completionStatus.overallPercentage;
  };

  const handleInputChange = (field: string, value: any) => {
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

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    
    try {
      const profileData = {
        userId: user.id,
        ...formData,
        lastUpdated: new Date()
      };
      
      // Mock API call - replace with actual ProfileService method
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Profile saved successfully!');
      onComplete();
    } catch (error) {
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndNext = async () => {
    if (!user) return;
    setLoading(true);
    
    try {
      const profileData = {
        userId: user.id,
        ...formData,
        step: currentTab === 'basic' ? 1 : currentTab === 'tax' ? 2 : currentTab === 'ar' ? 3 : currentTab === 'resources' ? 4 : currentTab === 'services' ? 5 : 6,
        lastUpdated: new Date()
      };
      
      // Mock API call - replace with actual ProfileService method
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Progress saved!');
      
      // Move to next tab
      const tabs = ['basic', 'tax', 'ar', 'resources', 'services', 'banking'];
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
    const tabs = ['basic', 'tax', 'ar', 'resources', 'services', 'banking'];
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1]);
      toast.info('Section skipped');
    } else {
      // If on last tab, complete the profile
      onSkip();
    }
  };

  const handlePrevious = () => {
    const tabs = ['basic', 'tax', 'ar', 'resources', 'services', 'banking'];
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1]);
    }
  };

  const completion = calculateCompletion();

  return (
    <div className="">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Entity/Organization Admin Profile</h1>
            <p className="text-muted-foreground">Complete your organization profile</p>
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
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="tax">Tax Details</TabsTrigger>
          <TabsTrigger value="ar">AR Details</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="banking">Banking</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="personType">Person Type *</Label>
                  <Select value={formData.personType} onValueChange={(value) => handleInputChange('personType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select person type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRIVATE_LIMITED_COMPANY">Private Limited Company</SelectItem>
                      <SelectItem value="PUBLIC_LIMITED_COMPANY">Public Limited Company</SelectItem>
                      <SelectItem value="ONE_PERSON_COMPANY">One Person Company (OPC)</SelectItem>
                      <SelectItem value="LIMITED_LIABILITY_PARTNERSHIP">Limited Liability Partnership (LLP)</SelectItem>
                      <SelectItem value="REGISTERED_PARTNERSHIP_FIRM">Registered Partnership Firm</SelectItem>
                      <SelectItem value="TRUST">Trust</SelectItem>
                      <SelectItem value="SOCIETY">Society</SelectItem>
                      <SelectItem value="GOVERNMENT_BODY_PSU">Government Body / PSU</SelectItem>
                      <SelectItem value="NGO">Non-Governmental Organisation (NGO)</SelectItem>
                      <SelectItem value="ANY_OTHER">Any other (please mention)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Conditional text box for "Any other" option */}
                {formData.personType === 'ANY_OTHER' && (
                  <div className="md:col-span-2">
                    <Label htmlFor="otherPersonType">Please specify the entity type *</Label>
                    <Input
                      id="otherPersonType"
                      value={formData.otherPersonType}
                      onChange={(e) => handleInputChange('otherPersonType', e.target.value)}
                      placeholder="Enter entity type"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name of AR/Admin for Entity *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter client name"
                  />
                </div>
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Enter company name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateOfIncorporation">Date of Incorporation *</Label>
                  <Input
                    id="dateOfIncorporation"
                    type="date"
                    value={formData.dateOfIncorporation}
                    onChange={(e) => handleInputChange('dateOfIncorporation', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="incorporationCertificate">Upload Certificate of Incorporation *</Label>
                  <Input
                    id="incorporationCertificate"
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => handleInputChange('incorporationCertificate', e.target.files?.[0] || null)}
                  />
                </div>
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

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="identityType">Identity Document *</Label>
                  <Select 
                    value={formData.identityDocument.type} 
                    onValueChange={(value) => handleInputChange('identityDocument.type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CERTIFICATE_OF_INCORPORATION">Certificate of Incorporation (COI)</SelectItem>
                      <SelectItem value="PAN_CARD">PAN Card</SelectItem>
                      <SelectItem value="GST_REGISTRATION_CERTIFICATE">GST Registration Certificate</SelectItem>
                      <SelectItem value="LLP_INCORPORATION_CERTIFICATE">LLP Incorporation Certificate</SelectItem>
                      <SelectItem value="REGISTERED_PARTNERSHIP_DEED">Registered Partnership Deed</SelectItem>
                      <SelectItem value="SOCIETY_TRUST_REGISTRATION_CERTIFICATE">Society/Trust Registration Certificate</SelectItem>
                      <SelectItem value="IMPORT_EXPORT_CODE">Import Export Code (IEC)</SelectItem>
                      <SelectItem value="PROFESSIONAL_TAX_REGISTRATION">Professional Tax Registration Certificate</SelectItem>
                      <SelectItem value="TRADE_LICENSE">Trade License</SelectItem>
                      <SelectItem value="OTHER_GOVERNMENT_REGISTRATION">Any other government-issued registration/license</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="identityNumber">Identity Number *</Label>
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
                  <Label htmlFor="contactNumber">Contact Number *</Label>
                  <Input
                    id="contactNumber"
                    value={formData.contactNumber}
                    onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                    placeholder="Enter contact number"
                  />
                </div>
              </div>

              <div>
                <Label>Address *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="md:col-span-2">
                    <Input
                      value={formData.address.street}
                      onChange={(e) => handleInputChange('address.street', e.target.value)}
                      placeholder="Street address"
                    />
                  </div>
                  <div>
                    <Input
                      value={formData.address.city}
                      onChange={(e) => handleInputChange('address.city', e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Input
                      value={formData.address.state}
                      onChange={(e) => handleInputChange('address.state', e.target.value)}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <Input
                      value={formData.address.pinCode}
                      onChange={(e) => handleInputChange('address.pinCode', e.target.value)}
                      placeholder="PIN Code"
                    />
                  </div>
                </div>
              </div>

              {/* Remote Work Preference (Optional) */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="openToRemoteWork"
                  checked={formData.openToRemoteWork}
                  onCheckedChange={(checked) => handleInputChange('openToRemoteWork', !!checked)}
                />
                <Label htmlFor="openToRemoteWork">Open to remote work</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Details Tab */}
        <TabsContent value="tax" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Tax Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="panNumber">PAN Number *</Label>
                  <Input
                    id="panNumber"
                    value={formData.panNumber}
                    onChange={(e) => handleInputChange('panNumber', e.target.value)}
                    placeholder="Enter PAN number"
                  />
                </div>
                <div>
                  <Label htmlFor="panCopy">Upload PAN Copy *</Label>
                  <Input
                    id="panCopy"
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => handleInputChange('panCopy', e.target.files?.[0] || null)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tanNumber">TAN Number</Label>
                  <Input
                    id="tanNumber"
                    value={formData.tanNumber}
                    onChange={(e) => handleInputChange('tanNumber', e.target.value)}
                    placeholder="Enter TAN number"
                  />
                </div>
                <div>
                  <Label htmlFor="tanCopy">Upload TAN Copy</Label>
                  <Input
                    id="tanCopy"
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => handleInputChange('tanCopy', e.target.files?.[0] || null)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gstNumber">GST Number</Label>
                  <Input
                    id="gstNumber"
                    value={formData.gstNumber}
                    onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                    placeholder="Enter GST number"
                  />
                </div>
                <div>
                  <Label htmlFor="gstCopy">Upload GST Copy</Label>
                  <Input
                    id="gstCopy"
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => handleInputChange('gstCopy', e.target.files?.[0] || null)}
                  />
                </div>
              </div>

              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Billing Details</h3>
                
                {/* Trade Name */}
                <div className="mb-4">
                  <Label htmlFor="tradeName">Trade Name</Label>
                  <Input
                    id="tradeName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Enter trade name"
                  />
                </div>
                
                <h4 className="font-medium mb-4">Billing Address</h4>
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox
                    id="useSameAddress"
                    checked={formData.useSameAddress}
                    onCheckedChange={(checked) => {
                      handleInputChange('useSameAddress', checked);
                      if (checked) {
                        // Pre-fill billing address with registered address
                        handleInputChange('billingAddress.street', formData.address.street);
                        handleInputChange('billingAddress.city', formData.address.city);
                        handleInputChange('billingAddress.state', formData.address.state);
                        handleInputChange('billingAddress.pinCode', formData.address.pinCode);
                      }
                    }}
                  />
                  <Label htmlFor="useSameAddress">Same as registered address</Label>
                </div>
                
                {!formData.useSameAddress && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="billingStreet">Street Address</Label>
                      <Input
                        id="billingStreet"
                        value={formData.billingAddress.street}
                        onChange={(e) => handleInputChange('billingAddress.street', e.target.value)}
                        placeholder="Enter street address"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="billingCity">City</Label>
                        <Input
                          id="billingCity"
                          value={formData.billingAddress.city}
                          onChange={(e) => handleInputChange('billingAddress.city', e.target.value)}
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <Label htmlFor="billingState">State</Label>
                        <Input
                          id="billingState"
                          value={formData.billingAddress.state}
                          onChange={(e) => handleInputChange('billingAddress.state', e.target.value)}
                          placeholder="State"
                        />
                      </div>
                      <div>
                        <Label htmlFor="billingPinCode">PIN Code</Label>
                        <Input
                          id="billingPinCode"
                          value={formData.billingAddress.pinCode}
                          onChange={(e) => handleInputChange('billingAddress.pinCode', e.target.value)}
                          placeholder="PIN Code"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* GST Details */}
                <div className="mt-6">
                  <h4 className="font-medium mb-4">GST Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gstState">GST State</Label>
                      <Input
                        id="gstState"
                        value={formData.address.state}
                        onChange={(e) => handleInputChange('address.state', e.target.value)}
                        placeholder="Enter GST state"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gstRegistrationNumber">GST Registration Number</Label>
                      <Input
                        id="gstRegistrationNumber"
                        value={formData.gstNumber}
                        onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                        placeholder="Enter GST registration number"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="gstCopyBilling">Upload GST Copy</Label>
                    <Input
                      id="gstCopyBilling"
                      type="file"
                      accept=".pdf,image/*"
                      onChange={(e) => handleInputChange('gstCopy', e.target.files?.[0] || null)}
                    />
                  </div>
                </div>
                
                {/* PAN and TAN Details */}
                <div className="mt-6">
                  <h4 className="font-medium mb-4">Tax Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="panNumberBilling">PAN Number *</Label>
                      <Input
                        id="panNumberBilling"
                        value={formData.panNumber}
                        onChange={(e) => handleInputChange('panNumber', e.target.value)}
                        placeholder="Enter PAN number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="panCopyBilling">Upload PAN Copy *</Label>
                      <Input
                        id="panCopyBilling"
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => handleInputChange('panCopy', e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="tanNumberBilling">TAN Number</Label>
                      <Input
                        id="tanNumberBilling"
                        value={formData.tanNumber}
                        onChange={(e) => handleInputChange('tanNumber', e.target.value)}
                        placeholder="Enter TAN number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tanCopyBilling">Upload TAN Copy</Label>
                      <Input
                        id="tanCopyBilling"
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => handleInputChange('tanCopy', e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Authorized Representative Details Tab */}
        <TabsContent value="ar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Authorized Representative Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="arName">Name *</Label>
                  <Input
                    id="arName"
                    value={formData.authorizedRepresentative.name}
                    onChange={(e) => handleInputChange('authorizedRepresentative.name', e.target.value)}
                    placeholder="Enter AR name"
                  />
                </div>
                <div>
                  <Label htmlFor="arDesignation">Designation *</Label>
                  <Input
                    id="arDesignation"
                    value={formData.authorizedRepresentative.designation}
                    onChange={(e) => handleInputChange('authorizedRepresentative.designation', e.target.value)}
                    placeholder="Enter designation"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="arEmail">Email *</Label>
                  <Input
                    id="arEmail"
                    type="email"
                    value={formData.authorizedRepresentative.email}
                    onChange={(e) => handleInputChange('authorizedRepresentative.email', e.target.value)}
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <Label htmlFor="arContact">Contact Number *</Label>
                  <Input
                    id="arContact"
                    value={formData.authorizedRepresentative.contactNumber}
                    onChange={(e) => handleInputChange('authorizedRepresentative.contactNumber', e.target.value)}
                    placeholder="Enter contact number"
                  />
                </div>
              </div>

              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-4">AR Address</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="arStreet">Street Address</Label>
                    <Input
                      id="arStreet"
                      value={formData.authorizedRepresentative.address.street}
                      onChange={(e) => handleInputChange('authorizedRepresentative.address.street', e.target.value)}
                      placeholder="Enter street address"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="arCity">City</Label>
                      <Input
                        id="arCity"
                        value={formData.authorizedRepresentative.address.city}
                        onChange={(e) => handleInputChange('authorizedRepresentative.address.city', e.target.value)}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Label htmlFor="arState">State</Label>
                      <Input
                        id="arState"
                        value={formData.authorizedRepresentative.address.state}
                        onChange={(e) => handleInputChange('authorizedRepresentative.address.state', e.target.value)}
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <Label htmlFor="arPinCode">PIN Code</Label>
                      <Input
                        id="arPinCode"
                        value={formData.authorizedRepresentative.address.pinCode}
                        onChange={(e) => handleInputChange('authorizedRepresentative.address.pinCode', e.target.value)}
                        placeholder="PIN Code"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-4">AR Identity Document</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="arIdType">Document Type *</Label>
                    <Select 
                      value={formData.authorizedRepresentative.identityDocument.type} 
                      onValueChange={(value) => handleInputChange('authorizedRepresentative.identityDocument.type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={IdentityDocumentType.AADHAR}>Aadhaar Card</SelectItem>
                        <SelectItem value={IdentityDocumentType.PAN}>PAN Card</SelectItem>
                        <SelectItem value={IdentityDocumentType.PASSPORT}>Passport</SelectItem>
                        <SelectItem value={IdentityDocumentType.DRIVING_LICENSE}>Driving License</SelectItem>
                        <SelectItem value={IdentityDocumentType.VOTER_ID}>Voter ID</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="arIdNumber">Document Number *</Label>
                    <Input
                      id="arIdNumber"
                      value={formData.authorizedRepresentative.identityDocument.number}
                      onChange={(e) => handleInputChange('authorizedRepresentative.identityDocument.number', e.target.value)}
                      placeholder="Enter document number"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="arIdUpload">Upload Document *</Label>
                  <Input
                    id="arIdUpload"
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => handleInputChange('authorizedRepresentative.identityDocument.uploadedFile', e.target.files?.[0] || null)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources & Infrastructure Tab */}
        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Resources & Infrastructure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="numberOfPartners">Number of Partners</Label>
                  <Input
                    id="numberOfPartners"
                    type="number"
                    min="0"
                    value={formData.resourceInfra.numberOfPartners}
                    onChange={(e) => handleInputChange('resourceInfra.numberOfPartners', parseInt(e.target.value) || 0)}
                    placeholder="Enter number of partners"
                  />
                </div>
                <div>
                  <Label htmlFor="numberOfProfessionalStaff">Number of Professional Staff</Label>
                  <Input
                    id="numberOfProfessionalStaff"
                    type="number"
                    min="0"
                    value={formData.resourceInfra.numberOfProfessionalStaff}
                    onChange={(e) => handleInputChange('resourceInfra.numberOfProfessionalStaff', parseInt(e.target.value) || 0)}
                    placeholder="Enter number of professional staff"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="numberOfOtherStaff">Number of Other Staff</Label>
                  <Input
                    id="numberOfOtherStaff"
                    type="number"
                    min="0"
                    value={formData.resourceInfra.numberOfOtherStaff}
                    onChange={(e) => handleInputChange('resourceInfra.numberOfOtherStaff', parseInt(e.target.value) || 0)}
                    placeholder="Enter number of other staff"
                  />
                </div>
                <div>
                  <Label htmlFor="numberOfInternsArticledClerks">Number of Interns/Articled Clerks</Label>
                  <Input
                    id="numberOfInternsArticledClerks"
                    type="number"
                    min="0"
                    value={formData.resourceInfra.numberOfInternsArticledClerks}
                    onChange={(e) => handleInputChange('resourceInfra.numberOfInternsArticledClerks', parseInt(e.target.value) || 0)}
                    placeholder="Enter number of interns/articled clerks"
                  />
                </div>
              </div>

              <Separator />
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Partners Details</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newPartners = [...formData.resourceInfra.partners, { name: '', professionalProfileLink: '' }];
                      handleInputChange('resourceInfra.partners', newPartners);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Partner
                  </Button>
                </div>
                
                {formData.resourceInfra.partners.map((partner, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Partner {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newPartners = formData.resourceInfra.partners.filter((_, i) => i !== index);
                          handleInputChange('resourceInfra.partners', newPartners);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`partnerName${index}`}>Partner Name</Label>
                        <Input
                          id={`partnerName${index}`}
                          value={partner.name}
                          onChange={(e) => {
                            const newPartners = [...formData.resourceInfra.partners];
                            newPartners[index].name = e.target.value;
                            handleInputChange('resourceInfra.partners', newPartners);
                          }}
                          placeholder="Enter partner name"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`partnerLink${index}`}>Professional Profile Link</Label>
                        <Input
                          id={`partnerLink${index}`}
                          value={partner.professionalProfileLink}
                          onChange={(e) => {
                            const newPartners = [...formData.resourceInfra.partners];
                            newPartners[index].professionalProfileLink = e.target.value;
                            handleInputChange('resourceInfra.partners', newPartners);
                          }}
                          placeholder="Enter profile link"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Offered Tab */}
        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Services Offered
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Service Categories</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newServices = [...formData.servicesOffered, {
                      category: '',
                      subCategory: '',
                      level: '',
                      sector: '',
                      industry: '',
                      services: [],
                      hashtags: []
                    }];
                    handleInputChange('servicesOffered', newServices);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service Category
                </Button>
              </div>
              
              {formData.servicesOffered.map((service, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Service Category {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newServices = formData.servicesOffered.filter((_, i) => i !== index);
                        handleInputChange('servicesOffered', newServices);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`serviceCategory${index}`}>Category *</Label>
                      <Select 
                        value={service.category}
                        onValueChange={(value) => {
                          const newServices = [...formData.servicesOffered];
                          newServices[index].category = value;
                          // Reset subcategories when category changes
                          newServices[index].subCategory = '';
                          newServices[index].services = [];
                          handleInputChange('servicesOffered', newServices);
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
                          const newServices = [...formData.servicesOffered];
                          newServices[index].subCategory = value;
                          // Reset services when sub-category changes
                          newServices[index].services = [];
                          handleInputChange('servicesOffered', newServices);
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 max-h-64 overflow-y-auto border rounded-lg p-3">
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
                                  const newServices = [...formData.servicesOffered];
                                  if (checked) {
                                    newServices[index].services = [...newServices[index].services, label];
                                  } else {
                                    newServices[index].services = newServices[index].services.filter(s => s !== label);
                                  }
                                  handleInputChange('servicesOffered', newServices);
                                }}
                              />
                              <Label 
                                htmlFor={`service-${index}-${key}`}
                                className="text-sm font-normal cursor-pointer"
                              >
                                {label}
                              </Label>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground mt-2">Select category and sub-category to view services</div>
                    )}
                    <div className="mt-3">
                      <Label htmlFor={`customService${index}`}>Other Services (comma-separated)</Label>
                      <Input
                        id={`customService${index}`}
                        placeholder="Enter any additional services not listed above"
                        onChange={(e) => {
                          const customServices = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                          const newServices = [...formData.servicesOffered];
                          // Append custom services while keeping selected subcategories
                          const selectedSubs = newServices[index].services.filter(Boolean);
                          newServices[index].services = Array.from(new Set([...selectedSubs, ...customServices]));
                          handleInputChange('servicesOffered', newServices);
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`serviceLevel${index}`}>Service Level</Label>
                    <Select 
                      value={service.level} 
                      onValueChange={(value) => {
                        const newServices = [...formData.servicesOffered];
                        newServices[index].level = value as ServiceLevel;
                        handleInputChange('servicesOffered', newServices);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select service level" />
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
                      <Label htmlFor={`serviceSector${index}`}>Sector</Label>
                      <Select 
                        value={service.sector} 
                        onValueChange={(value) => {
                          const newServices = [...formData.servicesOffered];
                          newServices[index].sector = value as ServiceSector;
                          handleInputChange('servicesOffered', newServices);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select sector" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ServiceSector.MANUFACTURING}>Manufacturing</SelectItem>
                          <SelectItem value={ServiceSector.MSME}>MSME</SelectItem>
                          <SelectItem value={ServiceSector.INDUSTRIAL}>Industrial</SelectItem>
                          <SelectItem value={ServiceSector.MINING}>Mining</SelectItem>
                          <SelectItem value={ServiceSector.LOGISTICS}>Logistics</SelectItem>
                          <SelectItem value={ServiceSector.SERVICES}>Services</SelectItem>
                          <SelectItem value={ServiceSector.REALTY}>Realty</SelectItem>
                          <SelectItem value={ServiceSector.IT}>IT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`serviceIndustry${index}`}>Industry</Label>
                      <Select 
                        value={service.industry} 
                        onValueChange={(value) => {
                          const newServices = [...formData.servicesOffered];
                          newServices[index].industry = value as ServiceIndustry;
                          handleInputChange('servicesOffered', newServices);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ServiceIndustry.CHEMICALS}>Chemicals</SelectItem>
                          <SelectItem value={ServiceIndustry.ENGINEERING}>Engineering</SelectItem>
                          <SelectItem value={ServiceIndustry.PHARMA}>Pharma</SelectItem>
                          <SelectItem value={ServiceIndustry.STEEL}>Steel</SelectItem>
                          <SelectItem value={ServiceIndustry.CEMENT}>Cement</SelectItem>
                          <SelectItem value={ServiceIndustry.TEXTILES}>Textiles</SelectItem>
                          <SelectItem value={ServiceIndustry.AUTOMOTIVE}>Automotive</SelectItem>
                          <SelectItem value={ServiceIndustry.BANKING}>Banking</SelectItem>
                          <SelectItem value={ServiceIndustry.INSURANCE}>Insurance</SelectItem>
                          <SelectItem value={ServiceIndustry.HEALTHCARE}>Healthcare</SelectItem>
                          <SelectItem value={ServiceIndustry.EDUCATION}>Education</SelectItem>
                          <SelectItem value={ServiceIndustry.RETAIL}>Retail</SelectItem>
                          <SelectItem value={ServiceIndustry.HOSPITALITY}>Hospitality</SelectItem>
                          <SelectItem value={ServiceIndustry.AGRICULTURE}>Agriculture</SelectItem>
                          <SelectItem value={ServiceIndustry.ENERGY}>Energy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  
                  
                  <div>
                    <Label htmlFor={`serviceHashtags${index}`}>Hashtags (comma-separated)</Label>
                    <Input
                      id={`serviceHashtags${index}`}
                      value={service.hashtags.join(', ')}
                      onChange={(e) => {
                        const newServices = [...formData.servicesOffered];
                        newServices[index].hashtags = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                        handleInputChange('servicesOffered', newServices);
                      }}
                      placeholder="Enter hashtags separated by commas"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Banking Details Tab */}
        <TabsContent value="banking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Banking Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Bank Accounts</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newAccounts = [...formData.bankingDetails, {
                      id: Date.now().toString(),
                      beneficiaryName: '',
                      accountNumber: '',
                      accountType: '',
                      ifscCode: '',
                      bankName: '',
                      branchName: '',
                      isDefault: false,
                    }];
                    handleInputChange('bankingDetails', newAccounts);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Bank Account
                </Button>
              </div>
              
              {formData.bankingDetails.map((account, index) => (
                <div key={account.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Bank Account {index + 1}</h4>
                      {account.isDefault && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!account.isDefault && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newAccounts = formData.bankingDetails.map((acc, i) => ({
                              ...acc,
                              isDefault: i === index
                            }));
                            handleInputChange('bankingDetails', newAccounts);
                          }}
                        >
                          Set as Default
                        </Button>
                      )}
                      {formData.bankingDetails.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newAccounts = formData.bankingDetails.filter((_, i) => i !== index);
                            // If we're removing the default account, make the first remaining account default
                            if (account.isDefault && newAccounts.length > 0) {
                              newAccounts[0].isDefault = true;
                            }
                            handleInputChange('bankingDetails', newAccounts);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`beneficiaryName${index}`}>Beneficiary Name *</Label>
                      <Input
                        id={`beneficiaryName${index}`}
                        value={account.beneficiaryName}
                        onChange={(e) => {
                          const newAccounts = [...formData.bankingDetails];
                          newAccounts[index].beneficiaryName = e.target.value;
                          handleInputChange('bankingDetails', newAccounts);
                        }}
                        placeholder="Enter beneficiary name"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`accountNumber${index}`}>Account Number *</Label>
                      <Input
                        id={`accountNumber${index}`}
                        value={account.accountNumber}
                        onChange={(e) => {
                          const newAccounts = [...formData.bankingDetails];
                          newAccounts[index].accountNumber = e.target.value;
                          handleInputChange('bankingDetails', newAccounts);
                        }}
                        placeholder="Enter account number"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`bankName${index}`}>Bank Name *</Label>
                      <Input
                        id={`bankName${index}`}
                        value={account.bankName}
                        onChange={(e) => {
                          const newAccounts = [...formData.bankingDetails];
                          newAccounts[index].bankName = e.target.value;
                          handleInputChange('bankingDetails', newAccounts);
                        }}
                        placeholder="Enter bank name"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`branchName${index}`}>Branch Name</Label>
                      <Input
                        id={`branchName${index}`}
                        value={account.branchName}
                        onChange={(e) => {
                          const newAccounts = [...formData.bankingDetails];
                          newAccounts[index].branchName = e.target.value;
                          handleInputChange('bankingDetails', newAccounts);
                        }}
                        placeholder="Enter branch name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`accountType${index}`}>Account Type *</Label>
                      <Select 
                        value={account.accountType} 
                        onValueChange={(value) => {
                          const newAccounts = [...formData.bankingDetails];
                          newAccounts[index].accountType = value as AccountType;
                          handleInputChange('bankingDetails', newAccounts);
                        }}
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
                    <div>
                      <Label htmlFor={`ifscCode${index}`}>IFSC Code *</Label>
                      <Input
                        id={`ifscCode${index}`}
                        value={account.ifscCode}
                        onChange={(e) => {
                          const newAccounts = [...formData.bankingDetails];
                          newAccounts[index].ifscCode = e.target.value;
                          handleInputChange('bankingDetails', newAccounts);
                        }}
                        placeholder="Enter IFSC code"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between items-center mt-8">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSkipCurrentTab} disabled={loading}>
            <Clock className="h-4 w-4 mr-2" />
            Skip for Now
          </Button>
          {currentTab !== 'basic' && (
            <Button variant="outline" onClick={handlePrevious} disabled={loading}>
              Previous
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          {currentTab !== 'banking' ? (
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
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Profile
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
