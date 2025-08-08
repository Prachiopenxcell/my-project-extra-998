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
import { useAuth } from '@/contexts/AuthContext';

interface ServiceProviderEntityAdminFormProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface FormData {
  // Person Type
  personType: PersonType | '';
  
  // User Details (Mandatory for permanent registration number)
  name: string;
  companyName: string;
  companyLogo: File | null;
  dateOfIncorporation: string;
  incorporationCertificate: File | null;
  
  // Identity Document Details
  identityDocument: {
    type: IdentityDocumentType | '';
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
  bankingDetails: {
    beneficiaryName: string;
    accountNumber: string;
    accountType: AccountType | '';
    ifscCode: string;
  };
  
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
    
    bankingDetails: {
      beneficiaryName: '',
      accountNumber: '',
      accountType: '',
      ifscCode: ''
    },
    
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
    }
  });

  const calculateCompletion = () => {
    const mandatoryFields = [
      formData.name,
      formData.companyName,
      formData.email,
      formData.contactNumber,
      formData.address.street,
      formData.address.city,
      formData.address.pinCode,
      formData.panNumber,
      formData.authorizedRepresentative.name,
      formData.authorizedRepresentative.designation,
      formData.authorizedRepresentative.email,
      formData.bankingDetails.beneficiaryName,
      formData.bankingDetails.accountNumber,
      formData.bankingDetails.ifscCode
    ];
    
    const completedMandatory = mandatoryFields.filter(field => field && field.toString().trim() !== '').length;
    const totalMandatory = mandatoryFields.length;
    
    return Math.round((completedMandatory / totalMandatory) * 100);
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

  const handlePrevious = () => {
    const tabs = ['basic', 'tax', 'ar', 'resources', 'services', 'banking'];
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1]);
    }
  };

  const completion = calculateCompletion();

  return (
    <div className="container mx-auto p-6 max-w-6xl">
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
              <div>
                <Label htmlFor="personType">Person Type *</Label>
                <Select value={formData.personType} onValueChange={(value) => handleInputChange('personType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select person type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PersonType.PUBLIC_LIMITED}>Public Limited</SelectItem>
                    <SelectItem value={PersonType.PRIVATE_LIMITED}>Private Limited</SelectItem>
                    <SelectItem value={PersonType.LIMITED_LIABILITY_PARTNERSHIP}>Limited Liability Partnership</SelectItem>
                    <SelectItem value={PersonType.REGISTERED_PARTNERSHIP}>Registered Partnership</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name of the Client *</Label>
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
                      <SelectItem value={IdentityDocumentType.PAN}>PAN</SelectItem>
                      <SelectItem value={IdentityDocumentType.AADHAR}>Aadhar</SelectItem>
                      <SelectItem value={IdentityDocumentType.PASSPORT}>Passport</SelectItem>
                      <SelectItem value={IdentityDocumentType.VOTER_ID}>Voter ID</SelectItem>
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
                <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox
                    id="useSameAddress"
                    checked={formData.useSameAddress}
                    onCheckedChange={(checked) => handleInputChange('useSameAddress', checked)}
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
                      <Label htmlFor={`serviceCategory${index}`}>Category</Label>
                      <Input
                        id={`serviceCategory${index}`}
                        value={service.category}
                        onChange={(e) => {
                          const newServices = [...formData.servicesOffered];
                          newServices[index].category = e.target.value;
                          handleInputChange('servicesOffered', newServices);
                        }}
                        placeholder="Enter service category"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`serviceLevel${index}`}>Service Level</Label>
                      <Select 
                        value={service.level} 
                        onValueChange={(value) => {
                          const newServices = [...formData.servicesOffered];
                          newServices[index].level = value;
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
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`serviceSector${index}`}>Sector</Label>
                      <Select 
                        value={service.sector} 
                        onValueChange={(value) => {
                          const newServices = [...formData.servicesOffered];
                          newServices[index].sector = value;
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
                          <SelectItem value={ServiceSector.SERVICES}>Services</SelectItem>
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
                          newServices[index].industry = value;
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
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor={`serviceList${index}`}>Specific Services (comma-separated)</Label>
                    <Textarea
                      id={`serviceList${index}`}
                      value={service.services.join(', ')}
                      onChange={(e) => {
                        const newServices = [...formData.servicesOffered];
                        newServices[index].services = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                        handleInputChange('servicesOffered', newServices);
                      }}
                      placeholder="Enter specific services separated by commas"
                      rows={3}
                    />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="beneficiaryName">Beneficiary Name *</Label>
                  <Input
                    id="beneficiaryName"
                    value={formData.bankingDetails.beneficiaryName}
                    onChange={(e) => handleInputChange('bankingDetails.beneficiaryName', e.target.value)}
                    placeholder="Enter beneficiary name"
                  />
                </div>
                <div>
                  <Label htmlFor="accountNumber">Account Number *</Label>
                  <Input
                    id="accountNumber"
                    value={formData.bankingDetails.accountNumber}
                    onChange={(e) => handleInputChange('bankingDetails.accountNumber', e.target.value)}
                    placeholder="Enter account number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accountType">Account Type *</Label>
                  <Select 
                    value={formData.bankingDetails.accountType} 
                    onValueChange={(value) => handleInputChange('bankingDetails.accountType', value)}
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
                  <Label htmlFor="ifscCode">IFSC Code *</Label>
                  <Input
                    id="ifscCode"
                    value={formData.bankingDetails.ifscCode}
                    onChange={(e) => handleInputChange('bankingDetails.ifscCode', e.target.value)}
                    placeholder="Enter IFSC code"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between items-center mt-8">
        <div className="flex gap-2">
          <Button variant="outline" onClick={onSkip} disabled={loading}>
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
