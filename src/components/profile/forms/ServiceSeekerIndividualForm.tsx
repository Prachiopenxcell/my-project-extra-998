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
import { toast } from 'sonner';
import {
  User,
  Upload,
  FileText,
  MapPin,
  CreditCard,
  Building,
  CheckCircle,
  AlertCircle,
  Save,
  Clock
} from 'lucide-react';

import { PersonType, IdentityDocumentType, AccountType } from '@/types/profile';
import { ProfileService } from '@/services/profileService';
import { useAuth } from '@/contexts/AuthContext';

interface ServiceSeekerIndividualFormProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface FormData {
  // Basic Information
  personType: PersonType | '';
  clientLogo: File | null;
  name: string;
  
  // Identity Document (Mandatory for permanent registration)
  identityDocumentType: IdentityDocumentType | '';
  identityNumber: string;
  identityProof: File | null;
  
  // Contact Information (Mandatory)
  email: string;
  contactNumber: string;
  
  // Address (Mandatory)
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
  
  // Banking Details (Mandatory for permanent registration)
  bankingDetails: {
    beneficiaryName: string;
    accountNumber: string;
    confirmAccountNumber: string;
    accountType: AccountType | '';
    ifscCode: string;
  };
}

export const ServiceSeekerIndividualForm: React.FC<ServiceSeekerIndividualFormProps> = ({
  onComplete,
  onSkip
}) => {
  const { user } = useAuth();
  const [currentSection, setCurrentSection] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    personType: '',
    clientLogo: null,
    name: user?.name || '',
    identityDocumentType: '',
    identityNumber: '',
    identityProof: null,
    email: user?.email || '',
    contactNumber: user?.phone || '',
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
      confirmAccountNumber: '',
      accountType: '',
      ifscCode: ''
    }
  });

  const sections = [
    {
      id: 'basic',
      title: 'Basic Information',
      description: 'Personal and business details',
      icon: User,
      required: true
    },
    {
      id: 'identity',
      title: 'Identity Verification',
      description: 'Identity documents and verification',
      icon: FileText,
      required: true
    },
    {
      id: 'address',
      title: 'Address Information',
      description: 'Contact and billing address',
      icon: MapPin,
      required: true
    },
    {
      id: 'tax',
      title: 'Tax Information',
      description: 'PAN, TAN, and GST details',
      icon: Building,
      required: false
    },
    {
      id: 'banking',
      title: 'Banking Details',
      description: 'Bank account information',
      icon: CreditCard,
      required: true
    }
  ];

  // Calculate completion percentage
  const calculateCompletion = () => {
    const mandatoryFields = [
      formData.name,
      formData.identityDocumentType,
      formData.identityNumber,
      formData.email,
      formData.contactNumber,
      formData.address.street,
      formData.address.city,
      formData.address.pinCode,
      formData.bankingDetails.beneficiaryName,
      formData.bankingDetails.accountNumber,
      formData.bankingDetails.ifscCode
    ];
    
    const completedMandatory = mandatoryFields.filter(field => field && field.toString().trim() !== '').length;
    const totalMandatory = mandatoryFields.length;
    
    return Math.round((completedMandatory / totalMandatory) * 100);
  };

  const canGetPermanentNumber = () => {
    return calculateCompletion() === 100 && 
           formData.identityProof && 
           formData.bankingDetails.accountNumber === formData.bankingDetails.confirmAccountNumber;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const keys = field.split('.');
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      } else if (keys.length === 2) {
        return {
          ...prev,
          [keys[0]]: {
            ...prev[keys[0] as keyof FormData],
            [keys[1]]: value
          }
        };
      }
      return prev;
    });
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleSameBillingAddress = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      useSameAddress: checked,
      billingAddress: checked ? prev.address : prev.billingAddress
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Create profile data
      const profileData = {
        userId: user.id,
        personType: formData.personType as PersonType,
        clientLogo: formData.clientLogo,
        name: formData.name,
        identityDocument: {
          type: formData.identityDocumentType as IdentityDocumentType,
          number: formData.identityNumber,
          uploadedFile: formData.identityProof
        },
        email: formData.email,
        contactNumber: formData.contactNumber,
        address: formData.address,
        panNumber: formData.panNumber,
        panCopy: formData.panCopy,
        tanNumber: formData.tanNumber,
        tanCopy: formData.tanCopy,
        gstNumber: formData.gstNumber,
        gstCopy: formData.gstCopy,
        billingAddress: formData.useSameAddress ? formData.address : formData.billingAddress,
        bankingDetails: [formData.bankingDetails],
        completionPercentage: calculateCompletion(),
        isCompleted: canGetPermanentNumber(),
        lastUpdated: new Date()
      };

      await ProfileService.createOrUpdateProfile(profileData, user.role);
      
      toast.success(
        canGetPermanentNumber() 
          ? 'Profile completed successfully! Your permanent registration number will be generated.'
          : 'Profile saved successfully! Complete all mandatory fields to get your permanent registration number.'
      );
      
      onComplete();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderBasicInformation = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="personType">Person Type</Label>
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

        <div className="space-y-2">
          <Label htmlFor="clientLogo">Client Logo</Label>
          <Input
            id="clientLogo"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload('clientLogo', e.target.files?.[0] || null)}
            className="cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name of the Client *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter client name"
          required
        />
      </div>
    </div>
  );

  const renderIdentityVerification = () => (
    <div className="space-y-6">
      <Alert>
        <FileText className="h-4 w-4" />
        <AlertDescription>
          Identity verification is mandatory to get your permanent registration number. 
          Our AI system will automatically verify the authenticity of uploaded documents.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="identityDocumentType">Identity Document Type *</Label>
          <Select 
            value={formData.identityDocumentType} 
            onValueChange={(value) => handleInputChange('identityDocumentType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={IdentityDocumentType.PAN}>PAN Card</SelectItem>
              <SelectItem value={IdentityDocumentType.AADHAR}>Aadhar Card</SelectItem>
              <SelectItem value={IdentityDocumentType.PASSPORT}>Passport</SelectItem>
              <SelectItem value={IdentityDocumentType.VOTER_ID}>Voter ID</SelectItem>
              <SelectItem value={IdentityDocumentType.DRIVING_LICENSE}>Driving License</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="identityNumber">Identity Number *</Label>
          <Input
            id="identityNumber"
            value={formData.identityNumber}
            onChange={(e) => handleInputChange('identityNumber', e.target.value)}
            placeholder="Enter identity number"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="identityProof">Upload Identity Proof *</Label>
        <Input
          id="identityProof"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => handleFileUpload('identityProof', e.target.files?.[0] || null)}
          className="cursor-pointer"
          required
        />
        <p className="text-sm text-muted-foreground">
          Accepted formats: PDF, JPG, PNG (Max 5MB)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter email address"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactNumber">Contact Number *</Label>
          <Input
            id="contactNumber"
            type="tel"
            value={formData.contactNumber}
            onChange={(e) => handleInputChange('contactNumber', e.target.value)}
            placeholder="Enter contact number"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderAddressInformation = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Primary Address *</h3>
        
        <div className="space-y-2">
          <Label htmlFor="street">Street Address *</Label>
          <Textarea
            id="street"
            value={formData.address.street}
            onChange={(e) => handleInputChange('address.street', e.target.value)}
            placeholder="Enter street address"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={formData.address.city}
              onChange={(e) => handleInputChange('address.city', e.target.value)}
              placeholder="Enter city"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              value={formData.address.state}
              onChange={(e) => handleInputChange('address.state', e.target.value)}
              placeholder="Enter state"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pinCode">PIN Code *</Label>
            <Input
              id="pinCode"
              value={formData.address.pinCode}
              onChange={(e) => handleInputChange('address.pinCode', e.target.value)}
              placeholder="Enter PIN code"
              required
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="useSameAddress"
            checked={formData.useSameAddress}
            onCheckedChange={handleSameBillingAddress}
          />
          <Label htmlFor="useSameAddress">Use same address for billing</Label>
        </div>

        {!formData.useSameAddress && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Billing Address</h3>
            
            <div className="space-y-2">
              <Label htmlFor="billingStreet">Street Address</Label>
              <Textarea
                id="billingStreet"
                value={formData.billingAddress.street}
                onChange={(e) => handleInputChange('billingAddress.street', e.target.value)}
                placeholder="Enter billing street address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billingCity">City</Label>
                <Input
                  id="billingCity"
                  value={formData.billingAddress.city}
                  onChange={(e) => handleInputChange('billingAddress.city', e.target.value)}
                  placeholder="Enter city"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="billingState">State</Label>
                <Input
                  id="billingState"
                  value={formData.billingAddress.state}
                  onChange={(e) => handleInputChange('billingAddress.state', e.target.value)}
                  placeholder="Enter state"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="billingPinCode">PIN Code</Label>
                <Input
                  id="billingPinCode"
                  value={formData.billingAddress.pinCode}
                  onChange={(e) => handleInputChange('billingAddress.pinCode', e.target.value)}
                  placeholder="Enter PIN code"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderTaxInformation = () => (
    <div className="space-y-6">
      <Alert>
        <Building className="h-4 w-4" />
        <AlertDescription>
          Tax information is optional but recommended for business operations.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="panNumber">PAN Number</Label>
          <Input
            id="panNumber"
            value={formData.panNumber}
            onChange={(e) => handleInputChange('panNumber', e.target.value)}
            placeholder="Enter PAN number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="panCopy">Upload PAN Copy</Label>
          <Input
            id="panCopy"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileUpload('panCopy', e.target.files?.[0] || null)}
            className="cursor-pointer"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="tanNumber">TAN Number</Label>
          <Input
            id="tanNumber"
            value={formData.tanNumber}
            onChange={(e) => handleInputChange('tanNumber', e.target.value)}
            placeholder="Enter TAN number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tanCopy">Upload TAN Copy</Label>
          <Input
            id="tanCopy"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileUpload('tanCopy', e.target.files?.[0] || null)}
            className="cursor-pointer"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="gstNumber">GST Number</Label>
          <Input
            id="gstNumber"
            value={formData.gstNumber}
            onChange={(e) => handleInputChange('gstNumber', e.target.value)}
            placeholder="Enter GST number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gstCopy">Upload GST Copy</Label>
          <Input
            id="gstCopy"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileUpload('gstCopy', e.target.files?.[0] || null)}
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  );

  const renderBankingDetails = () => (
    <div className="space-y-6">
      <Alert>
        <CreditCard className="h-4 w-4" />
        <AlertDescription>
          Banking details are required to get your permanent registration number.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="beneficiaryName">Name (as per Bank Account) *</Label>
          <Input
            id="beneficiaryName"
            value={formData.bankingDetails.beneficiaryName}
            onChange={(e) => handleInputChange('bankingDetails.beneficiaryName', e.target.value)}
            placeholder="Enter name as per bank account"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number *</Label>
            <Input
              id="accountNumber"
              value={formData.bankingDetails.accountNumber}
              onChange={(e) => handleInputChange('bankingDetails.accountNumber', e.target.value)}
              placeholder="Enter account number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmAccountNumber">Confirm Account Number *</Label>
            <Input
              id="confirmAccountNumber"
              value={formData.bankingDetails.confirmAccountNumber}
              onChange={(e) => handleInputChange('bankingDetails.confirmAccountNumber', e.target.value)}
              placeholder="Re-enter account number"
              required
            />
            {formData.bankingDetails.accountNumber && 
             formData.bankingDetails.confirmAccountNumber && 
             formData.bankingDetails.accountNumber !== formData.bankingDetails.confirmAccountNumber && (
              <p className="text-sm text-red-600">Account numbers do not match</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
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

          <div className="space-y-2">
            <Label htmlFor="ifscCode">IFSC Code *</Label>
            <Input
              id="ifscCode"
              value={formData.bankingDetails.ifscCode}
              onChange={(e) => handleInputChange('bankingDetails.ifscCode', e.target.value)}
              placeholder="Enter IFSC code"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );

  const currentSectionData = sections[currentSection];
  const IconComponent = currentSectionData.icon;
  const completionPercentage = calculateCompletion();

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Service Seeker Profile Setup
              </CardTitle>
              <CardDescription>
                Complete your profile to access all platform features
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{completionPercentage}%</div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>
          <Progress value={completionPercentage} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Section Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {sections.map((section, index) => {
          const SectionIcon = section.icon;
          const isActive = index === currentSection;
          const isCompleted = index < currentSection;
          
          return (
            <Button
              key={section.id}
              variant={isActive ? "default" : isCompleted ? "secondary" : "outline"}
              size="sm"
              onClick={() => setCurrentSection(index)}
              className="flex flex-col h-auto p-3 gap-1"
            >
              <SectionIcon className="h-4 w-4" />
              <span className="text-xs">{section.title}</span>
              {section.required && <Badge variant="secondary" className="text-xs">Required</Badge>}
            </Button>
          );
        })}
      </div>

      {/* Current Section Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconComponent className="h-5 w-5" />
            {currentSectionData.title}
            {currentSectionData.required && <Badge variant="secondary">Required</Badge>}
          </CardTitle>
          <CardDescription>{currentSectionData.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {currentSection === 0 && renderBasicInformation()}
          {currentSection === 1 && renderIdentityVerification()}
          {currentSection === 2 && renderAddressInformation()}
          {currentSection === 3 && renderTaxInformation()}
          {currentSection === 4 && renderBankingDetails()}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-3 flex-1">
          {currentSection > 0 && (
            <Button 
              variant="outline" 
              onClick={() => setCurrentSection(currentSection - 1)}
            >
              Previous
            </Button>
          )}
          
          {currentSection < sections.length - 1 ? (
            <Button 
              onClick={() => setCurrentSection(currentSection + 1)}
              className="flex-1"
            >
              Next Section
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {canGetPermanentNumber() ? 'Complete Profile' : 'Save Progress'}
                </>
              )}
            </Button>
          )}
        </div>
        
        <Button variant="outline" onClick={onSkip}>
          Skip for Now
        </Button>
      </div>

      {/* Status Alert */}
      {canGetPermanentNumber() ? (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Great! You've provided all mandatory information. Complete your profile to get your permanent registration number.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Complete all mandatory fields (marked with *) to get your permanent registration number. 
            You can save your progress and continue later.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
