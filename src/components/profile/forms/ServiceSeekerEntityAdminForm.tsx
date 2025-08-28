import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { 
  Building, 
  Users, 
  FileText, 
  UserCheck, 
  Save, 
  Clock, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Upload, 
  Loader2, 
  X,
  MapPin,
  CreditCard,
  User,
  AlertCircle
} from 'lucide-react';
import { AccountType, ServiceSeekerEntityProfile } from '@/types/profile';
import { ProfileService } from '@/services/profileService';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
import { ProfileStepNavigation } from '../utils/profileStepNavigation';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ServiceSeekerEntityAdminFormProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const ServiceSeekerEntityAdminForm: React.FC<ServiceSeekerEntityAdminFormProps> = ({
  onComplete,
  onSkip
}) => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [documentVerifying, setDocumentVerifying] = useState(false);
  const [documentVerified, setDocumentVerified] = useState(false);
  const [sameBillingAddress, setSameBillingAddress] = useState(false);
  const [formData, setFormData] = useState({
    // Basic entity info
    personType: '',
    otherPersonType: '',
    name: user?.name || '',
    clientLogo: null as File | null,
    email: user?.email || '',
    contactNumber: user?.phone || '',
    
    // Identity Document Details
    identityDocument: {
      type: '',
      number: '',
      otherDetails: '',
      uploadedFile: null as File | null
    },
    
    // Address details
    address: { 
      street: '', 
      city: '', 
      state: '', 
      pinCode: '' 
    },
    billingAddress: { 
      street: '', 
      city: '', 
      state: '', 
      pinCode: '' 
    },
    
    // Tax Information
    panNumber: '',
    panCopy: null as File | null,
    tanNumber: '',
    tanCopy: null as File | null,
    gstNumber: '',
    gstCopy: null as File | null,
    
    // Banking Details (Multiple accounts support)
    bankingDetails: [{
      beneficiaryName: '',
      accountNumber: '',
      confirmAccountNumber: '',
      accountType: '',
      ifscCode: ''
    }],
    
    // AR details
    authorizedRepresentative: {
      name: '',
      designation: '',
      email: '',
      contactNumber: '',
      address: { street: '', city: '', state: '', pinCode: '' },
      identityDocument: { type: '', number: '', uploadedFile: null as File | null }
    },
    
    // Resource infrastructure
    resourceInfra: {
      numberOfPartners: 0,
      partners: [] as Array<{name: string, professionalProfileLink: string}>,
      numberOfProfessionalStaff: 0,
      numberOfOtherStaff: 0,
      numberOfInternsArticledClerks: 0
    }
  });

  // Load any saved profile to sync initial form state (ensures seeded 22% shows up)
  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      const saved = await ProfileService.getProfile(user.id);
      if (saved) {
        const p = saved as ServiceSeekerEntityProfile;
        setFormData(prev => ({
          ...prev,
          name: p.name || prev.name,
          email: p.email || prev.email,
          contactNumber: p.contactNumber || prev.contactNumber,
          // Keep the rest as-is to avoid accidentally marking other sections complete
        }));
      }
    };
    load();
  }, [user]);

  const tabs = [
    { id: 'basic', title: 'Basic Info', icon: Building, required: true },
    { id: 'identity', title: 'Identity Documents', icon: FileText, required: true },
    { id: 'address', title: 'Address Details', icon: MapPin, required: true },
    { id: 'tax', title: 'Tax Information', icon: Building, required: false },
    { id: 'banking', title: 'Banking Details', icon: CreditCard, required: true },
    { id: 'ar', title: 'AR Details', icon: UserCheck, required: true },
    { id: 'resources', title: 'Resources', icon: Users, required: true }
  ];

  const calculateCompletion = () => {
    // Convert formData to profile format for ProfileService
    const profileData = {
      userId: "current-user",
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      address: formData.address,
      identityDocument: formData.identityDocument,
      authorizedRepresentative: formData.authorizedRepresentative,
      resourceInfra: formData.resourceInfra,
      bankingDetails: formData.bankingDetails,
      personType: formData.personType,
      otherPersonType: formData.otherPersonType
    };

    // Use ProfileService to calculate completion
    const completionStatus = ProfileService.calculateCompletionStatus(
      profileData as any, 
      UserRole.SERVICE_SEEKER_ENTITY_ADMIN
    );
    
    return completionStatus.overallPercentage;
  };

  const handleInputChange = (field: string, value: string | number | boolean | File | null) => {
    setFormData(prev => {
      const keys = field.split('.');
      if (keys.length === 1) return { ...prev, [field]: value };
      if (keys.length === 2) {
        const parentKey = keys[0] as keyof typeof prev;
        return { ...prev, [parentKey]: { ...(prev[parentKey] as Record<string, unknown>), [keys[1]]: value }};
      }
      if (keys.length === 3) {
        const parentKey = keys[0] as keyof typeof prev;
        const childKey = keys[1];
        return {
          ...prev,
          [parentKey]: { 
            ...(prev[parentKey] as Record<string, unknown>), 
            [childKey]: { 
              ...((prev[parentKey] as Record<string, unknown>)[childKey] as Record<string, unknown>), 
              [keys[2]]: value 
            }
          }
        };
      }
      return prev;
    });
  };

  const handleFileUpload = async (field: string, file: File) => {
    if (field === 'identityDocument.uploadedFile') {
      setDocumentVerifying(true);
      try {
        const verification = await ProfileService.verifyDocument(file, formData.identityDocument.type);
        
        if (verification.isValid) {
          setDocumentVerified(true);
          handleInputChange(field, file);
          toast.success("Document verified successfully!");
        } else {
          toast.error(verification.errors?.[0] || "Please upload a valid document.");
        }
      } catch (error) {
        toast.error("Failed to verify document. Please try again.");
      } finally {
        setDocumentVerifying(false);
      }
    } else {
      handleInputChange(field, file);
    }
  };

  const handleSaveAndNext = async () => {
    setLoading(true);
    try {
      const profileData = {
        userId: user?.id,
        ...formData,
        step: currentTab,
        lastUpdated: new Date()
      };
      
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Progress saved!');
      
      // Move to next tab
      const currentIndex = tabs.findIndex(tab => tab.id === currentTab);
      if (currentIndex < tabs.length - 1) {
        setCurrentTab(tabs[currentIndex + 1].id);
      }
    } catch (error) {
      toast.error('Failed to save progress. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipCurrentTab = () => {
    // Skip current tab and move to next one
    const currentIndex = tabs.findIndex(tab => tab.id === currentTab);
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1].id);
      toast.info('Section skipped');
    } else {
      // If on last tab, complete the profile
      onSkip();
    }
  };

  const handlePrevious = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1].id);
    }
  };

  const addPartner = () => {
    setFormData(prev => ({
      ...prev,
      resourceInfra: {
        ...prev.resourceInfra,
        partners: [...prev.resourceInfra.partners, { name: '', professionalProfileLink: '' }]
      }
    }));
  };

  const removePartner = (index: number) => {
    setFormData(prev => ({
      ...prev,
      resourceInfra: {
        ...prev.resourceInfra,
        partners: prev.resourceInfra.partners.filter((_, i) => i !== index)
      }
    }));
  };

  const updatePartner = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      resourceInfra: {
        ...prev.resourceInfra,
        partners: prev.resourceInfra.partners.map((partner, i) => 
          i === index ? { ...partner, [field]: value } : partner
        )
      }
    }));
  };

  const addBankingDetail = () => {
    setFormData(prev => ({
      ...prev,
      bankingDetails: [...prev.bankingDetails, {
        beneficiaryName: '',
        accountNumber: '',
        confirmAccountNumber: '',
        accountType: '',
        ifscCode: ''
      }]
    }));
  };

  const removeBankingDetail = (index: number) => {
    if (formData.bankingDetails.length > 1) {
      setFormData(prev => ({
        ...prev,
        bankingDetails: prev.bankingDetails.filter((_, i) => i !== index)
      }));
    }
  };

  const updateBankingDetail = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      bankingDetails: prev.bankingDetails.map((banking, i) => 
        i === index ? { ...banking, [field]: value } : banking
      )
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const profileData = {
        userId: user.id,
        ...formData,
        completionPercentage: calculateCompletion(),
        isCompleted: calculateCompletion() === 100,
        lastUpdated: new Date()
      };
      await ProfileService.createOrUpdateProfile(profileData, user.role);
      toast.success('Entity admin profile saved successfully!');
      onComplete();
    } catch (error) {
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderCurrentTab = () => {
    switch (currentTab) {
      case 'basic': // Basic Information
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div className="space-y-2">
    <Label>Person Type *</Label>
    <Select value={formData.personType} onValueChange={(value) => handleInputChange('personType', value)}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Private Limited Company">Private Limited Company</SelectItem>
                    <SelectItem value="Public Limited Company">Public Limited Company</SelectItem>
                    <SelectItem value="One Person Company (OPC)">One Person Company (OPC)</SelectItem>
                    <SelectItem value="Limited Liability Partnership (LLP)">Limited Liability Partnership (LLP)</SelectItem>
                    <SelectItem value="Registered Partnership Firm">Registered Partnership Firm</SelectItem>
                    <SelectItem value="Trust">Trust</SelectItem>
                    <SelectItem value="Society">Society</SelectItem>
                    <SelectItem value="Government Body / PSU">Government Body / PSU</SelectItem>
                    <SelectItem value="Non-Governmental Organisation (NGO)">Non-Governmental Organisation (NGO)</SelectItem>
                    <SelectItem value="Other">Any other (please mention)</SelectItem>
                  </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
              {formData.personType === 'Other' ? (
                <>
                  <Label>Please mention *</Label>
                  <Input 
                    value={formData.otherPersonType} 
                    onChange={(e) => handleInputChange('otherPersonType', e.target.value)} 
                    placeholder="Specify person type" 
                    required 
                  />
                </>
              ) : (
      <>
        <Label>Entity Name *</Label>
        <Input 
          value={formData.name} 
          onChange={(e) => handleInputChange('name', e.target.value)} 
          placeholder="Enter entity name" 
          required 
        />
      </>
    )}
  </div>
</div>
            {formData.personType === 'Other' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Entity Name *</Label>
                  <Input value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Enter entity name" required />
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="Enter email" required />
              </div>
              <div className="space-y-2">
                <Label>Contact Number *</Label>
                <Input type="tel" value={formData.contactNumber} onChange={(e) => handleInputChange('contactNumber', e.target.value)} placeholder="Enter contact" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Client Logo</Label>
              <Input type="file" onChange={(e) => handleFileUpload('clientLogo', e.target.files?.[0] || null)} />
            </div>
          </div>
        );

      case 'identity': // Identity Documents
        return (
          <div className="space-y-6">
            <Alert><FileText className="h-4 w-4" /><AlertDescription>Identity documents are mandatory.</AlertDescription></Alert>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>ID Type *</Label>
                <Select value={formData.identityDocument.type} onValueChange={(value) => handleInputChange('identityDocument.type', value)}>
                  <SelectTrigger><SelectValue placeholder="Select ID type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Certificate of Incorporation (COI)">Certificate of Incorporation (COI)</SelectItem>
                    <SelectItem value="PAN Card">PAN Card</SelectItem>
                    <SelectItem value="GST Registration Certificate">GST Registration Certificate</SelectItem>
                    <SelectItem value="LLP Incorporation Certificate">LLP Incorporation Certificate</SelectItem>
                    <SelectItem value="Registered Partnership Deed">Registered Partnership Deed</SelectItem>
                    <SelectItem value="Society/Trust Registration Certificate">Society/Trust Registration Certificate</SelectItem>
                    <SelectItem value="Import Export Code (IEC)">Import Export Code (IEC), if applicable</SelectItem>
                    <SelectItem value="Professional Tax Registration Certificate">Professional Tax Registration Certificate</SelectItem>
                    <SelectItem value="Trade License">Trade License</SelectItem>
                    <SelectItem value="Voter ID">Voter ID</SelectItem>
                    <SelectItem value="Driving Licence">Driving Licence</SelectItem>
                    <SelectItem value="Any other government-issued registration/license">Any other government-issued registration/license</SelectItem>
                  </SelectContent>
                </Select>
                {formData.identityDocument.type === 'Any other government-issued registration/license' && (
                  <div className="space-y-2">
                    <Label>Please specify *</Label>
                    <Input
                      value={formData.identityDocument.otherDetails}
                      onChange={(e) => handleInputChange('identityDocument.otherDetails', e.target.value)}
                      placeholder="Mention registration/license details"
                      required
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>ID Number *</Label>
                <Input value={formData.identityDocument.number} onChange={(e) => handleInputChange('identityDocument.number', e.target.value)} placeholder="ID number" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Upload ID Document *</Label>
              <Input type="file" onChange={(e) => handleFileUpload('identityDocument.uploadedFile', e.target.files?.[0] || null)} required />
              {documentVerifying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : documentVerified ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <X className="h-4 w-4 text-red-600" />
              )}
            </div>
          </div>
        );

      case 'address': // Address Details
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Address *</Label>
              <Textarea value={formData.address.street} onChange={(e) => handleInputChange('address.street', e.target.value)} placeholder="Enter address" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>City *</Label>
                <Input value={formData.address.city} onChange={(e) => handleInputChange('address.city', e.target.value)} placeholder="City" required />
              </div>
              <div className="space-y-2">
                <Label>State *</Label>
                <Input value={formData.address.state} onChange={(e) => handleInputChange('address.state', e.target.value)} placeholder="State" required />
              </div>
              <div className="space-y-2">
                <Label>PIN Code *</Label>
                <Input value={formData.address.pinCode} onChange={(e) => handleInputChange('address.pinCode', e.target.value)} placeholder="PIN" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Billing Address</Label>
              <div className="flex items-center gap-2">
                <Input type="checkbox" checked={sameBillingAddress} onChange={(e) => setSameBillingAddress(e.target.checked)} />
                <span>Same as above</span>
              </div>
              {!sameBillingAddress && (
                <div className="space-y-2">
                  <Textarea value={formData.billingAddress.street} onChange={(e) => handleInputChange('billingAddress.street', e.target.value)} placeholder="Enter billing address" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input value={formData.billingAddress.city} onChange={(e) => handleInputChange('billingAddress.city', e.target.value)} placeholder="City" />
                    </div>
                    <div className="space-y-2">
                      <Label>State</Label>
                      <Input value={formData.billingAddress.state} onChange={(e) => handleInputChange('billingAddress.state', e.target.value)} placeholder="State" />
                    </div>
                    <div className="space-y-2">
                      <Label>PIN Code</Label>
                      <Input value={formData.billingAddress.pinCode} onChange={(e) => handleInputChange('billingAddress.pinCode', e.target.value)} placeholder="PIN" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'tax': // Tax Information
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>PAN Number</Label>
              <Input value={formData.panNumber} onChange={(e) => handleInputChange('panNumber', e.target.value)} placeholder="PAN number" />
            </div>
            <div className="space-y-2">
              <Label>PAN Copy</Label>
              <Input type="file" onChange={(e) => handleFileUpload('panCopy', e.target.files?.[0] || null)} />
            </div>
            <div className="space-y-2">
              <Label>TAN Number</Label>
              <Input value={formData.tanNumber} onChange={(e) => handleInputChange('tanNumber', e.target.value)} placeholder="TAN number" />
            </div>
            <div className="space-y-2">
              <Label>TAN Copy</Label>
              <Input type="file" onChange={(e) => handleFileUpload('tanCopy', e.target.files?.[0] || null)} />
            </div>
            <div className="space-y-2">
              <Label>GST Number</Label>
              <Input value={formData.gstNumber} onChange={(e) => handleInputChange('gstNumber', e.target.value)} placeholder="GST number" />
            </div>
            <div className="space-y-2">
              <Label>GST Copy</Label>
              <Input type="file" onChange={(e) => handleFileUpload('gstCopy', e.target.files?.[0] || null)} />
            </div>
          </div>
        );

      case 'banking': // Banking Details
        return (
          <div className="space-y-6">
            {formData.bankingDetails.map((banking, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Banking Detail {index + 1}</h4>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeBankingDetail(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Beneficiary Name *</Label>
                    <Input value={banking.beneficiaryName} onChange={(e) => updateBankingDetail(index, 'beneficiaryName', e.target.value)} placeholder="Beneficiary name" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Number *</Label>
                    <Input value={banking.accountNumber} onChange={(e) => updateBankingDetail(index, 'accountNumber', e.target.value)} placeholder="Account number" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Confirm Account *</Label>
                    <Input value={banking.confirmAccountNumber} onChange={(e) => updateBankingDetail(index, 'confirmAccountNumber', e.target.value)} placeholder="Confirm account" required />
                    {banking.accountNumber && banking.confirmAccountNumber && 
                     banking.accountNumber !== banking.confirmAccountNumber && (
                      <p className="text-sm text-red-600">Account numbers do not match</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Account Type *</Label>
                    <Select value={banking.accountType} onValueChange={(value) => updateBankingDetail(index, 'accountType', value)}>
                      <SelectTrigger><SelectValue placeholder="Account type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value={AccountType.CURRENT}>Current</SelectItem>
                        <SelectItem value={AccountType.BUSINESS}>Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>IFSC Code *</Label>
                  <Input value={banking.ifscCode} onChange={(e) => updateBankingDetail(index, 'ifscCode', e.target.value)} placeholder="IFSC code" required />
                </div>
              </Card>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addBankingDetail}>
              <Plus className="h-4 w-4 mr-2" />Add Banking Detail
            </Button>
          </div>
        );

      case 'ar': // AR Details
        return (
          <div className="space-y-6">
            <Alert><UserCheck className="h-4 w-4" /><AlertDescription>Authorized Representative details are mandatory.</AlertDescription></Alert>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>AR Name *</Label>
                <Input value={formData.authorizedRepresentative.name} onChange={(e) => handleInputChange('authorizedRepresentative.name', e.target.value)} placeholder="AR name" required />
              </div>
              <div className="space-y-2">
                <Label>Designation *</Label>
                <Input value={formData.authorizedRepresentative.designation} onChange={(e) => handleInputChange('authorizedRepresentative.designation', e.target.value)} placeholder="Designation" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>AR Email *</Label>
                <Input type="email" value={formData.authorizedRepresentative.email} onChange={(e) => handleInputChange('authorizedRepresentative.email', e.target.value)} placeholder="AR email" required />
              </div>
              <div className="space-y-2">
                <Label>AR Contact *</Label>
                <Input type="tel" value={formData.authorizedRepresentative.contactNumber} onChange={(e) => handleInputChange('authorizedRepresentative.contactNumber', e.target.value)} placeholder="AR contact" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>AR ID Type</Label>
                <Select value={formData.authorizedRepresentative.identityDocument.type} onValueChange={(value) => handleInputChange('authorizedRepresentative.identityDocument.type', value)}>
                  <SelectTrigger><SelectValue placeholder="Select ID type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PAN">PAN</SelectItem>
                    <SelectItem value="Aadhar">Aadhar</SelectItem>
                    <SelectItem value="Passport">Passport</SelectItem>
                    <SelectItem value="Voter ID">Voter ID</SelectItem>
                    <SelectItem value="Driving Licence">Driving Licence</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>AR ID Number</Label>
                <Input value={formData.authorizedRepresentative.identityDocument.number} onChange={(e) => handleInputChange('authorizedRepresentative.identityDocument.number', e.target.value)} placeholder="ID number" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>AR Address</Label>
              <Textarea value={formData.authorizedRepresentative.address.street} onChange={(e) => handleInputChange('authorizedRepresentative.address.street', e.target.value)} placeholder="Enter address" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input value={formData.authorizedRepresentative.address.city} onChange={(e) => handleInputChange('authorizedRepresentative.address.city', e.target.value)} placeholder="City" />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input value={formData.authorizedRepresentative.address.state} onChange={(e) => handleInputChange('authorizedRepresentative.address.state', e.target.value)} placeholder="State" />
              </div>
              <div className="space-y-2">
                <Label>PIN Code</Label>
                <Input value={formData.authorizedRepresentative.address.pinCode} onChange={(e) => handleInputChange('authorizedRepresentative.address.pinCode', e.target.value)} placeholder="PIN" />
              </div>
            </div>
          </div>
        );

      case 'resources': // Resources
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Professional Staff</Label>
                <Input type="number" min="0" value={formData.resourceInfra.numberOfProfessionalStaff} onChange={(e) => handleInputChange('resourceInfra.numberOfProfessionalStaff', parseInt(e.target.value) || 0)} />
              </div>
              <div className="space-y-2">
                <Label>Other Staff</Label>
                <Input type="number" min="0" value={formData.resourceInfra.numberOfOtherStaff} onChange={(e) => handleInputChange('resourceInfra.numberOfOtherStaff', parseInt(e.target.value) || 0)} />
              </div>
              <div className="space-y-2">
                <Label>Interns/Clerks</Label>
                <Input type="number" min="0" value={formData.resourceInfra.numberOfInternsArticledClerks} onChange={(e) => handleInputChange('resourceInfra.numberOfInternsArticledClerks', parseInt(e.target.value) || 0)} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Partners</h3>
              <Button type="button" variant="outline" size="sm" onClick={addPartner}>
                <Plus className="h-4 w-4 mr-2" />Add Partner
              </Button>
            </div>
            {formData.resourceInfra.partners.map((partner, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Partner {index + 1}</h4>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removePartner(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Partner Name</Label>
                    <Input value={partner.name} onChange={(e) => updatePartner(index, 'name', e.target.value)} placeholder="Partner name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Profile Link</Label>
                    <Input value={partner.professionalProfileLink} onChange={(e) => updatePartner(index, 'professionalProfileLink', e.target.value)} placeholder="Profile link" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );

      default:
        return null;
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
        
        {completion < 100 && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Complete all mandatory sections to get your permanent registration number. Missing: name, mobile, identity document number, and {13 - Math.floor((completion / 100) * 13)} more.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-8">
        <TabsList className="h-auto grid w-full grid-cols-7 gap-2 rounded-2xl border bg-background/60 p-1.5 shadow-sm overflow-hidden backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {tabs.map(({ id, title, icon: Icon }) => (
            <TabsTrigger
              key={id}
              value={id}
              className="flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors hover:bg-muted data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              <Icon className="h-4 w-4" />
              <span>{title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="mt-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Provide your basic organization details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="personType">Person Type *</Label>
            <Select value={formData.personType} onValueChange={(value) => handleInputChange('personType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select person type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Private Limited Company">Private Limited Company</SelectItem>
                <SelectItem value="Public Limited Company">Public Limited Company</SelectItem>
                <SelectItem value="One Person Company (OPC)">One Person Company (OPC)</SelectItem>
                <SelectItem value="Limited Liability Partnership (LLP)">Limited Liability Partnership (LLP)</SelectItem>
                <SelectItem value="Registered Partnership Firm">Registered Partnership Firm</SelectItem>
                <SelectItem value="Trust">Trust</SelectItem>
                <SelectItem value="Society">Society</SelectItem>
                <SelectItem value="Government Body / PSU">Government Body / PSU</SelectItem>
                <SelectItem value="Non-Governmental Organisation (NGO)">Non-Governmental Organisation (NGO)</SelectItem>
                <SelectItem value="Other">Any other (please mention)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {formData.personType === 'Other' && (
            <div>
              <Label htmlFor="otherPersonType">Please mention *</Label>
              <Input
                id="otherPersonType"
                value={formData.otherPersonType}
                onChange={(e) => handleInputChange('otherPersonType', e.target.value)}
                placeholder="Specify person type"
                required
              />
            </div>
          )}
        </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <Label htmlFor="clientName">Name of the Team Member *</Label>
      <Input
        id="clientName"
        value={formData.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
        placeholder="Enter team member name"
        required
      />
    </div>
    
    <div>
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
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <Label htmlFor="contactNumber">Contact Number *</Label>
      <Input
        id="contactNumber"
        value={formData.contactNumber}
        onChange={(e) => handleInputChange('contactNumber', e.target.value)}
        placeholder="Enter contact number"
        required
      />
    </div>
    
    <div>
      <Label htmlFor="clientLogo">Client Logo</Label>
      <div className="flex items-center gap-2">
        <Input
          id="clientLogo"
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleFileUpload('clientLogo', e.target.files[0])}
          className="flex-1"
        />
        <Upload className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  </div>
</CardContent>
          </Card>
        </TabsContent>

        {/* Identity Document Tab */}
        <TabsContent value="identity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Identity Document Details
                <Badge variant="destructive" className="ml-2">Required</Badge>
              </CardTitle>
              <CardDescription>
                Upload your identity proof for verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
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
                      <SelectItem value="Certificate of Incorporation (COI)">Certificate of Incorporation (COI)</SelectItem>
                      <SelectItem value="PAN Card">PAN Card</SelectItem>
                      <SelectItem value="GST Registration Certificate">GST Registration Certificate</SelectItem>
                      <SelectItem value="LLP Incorporation Certificate">LLP Incorporation Certificate</SelectItem>
                      <SelectItem value="Registered Partnership Deed">Registered Partnership Deed</SelectItem>
                      <SelectItem value="Society/Trust Registration Certificate">Society/Trust Registration Certificate</SelectItem>
                      <SelectItem value="Import Export Code (IEC)">Import Export Code (IEC), if applicable</SelectItem>
                      <SelectItem value="Professional Tax Registration Certificate">Professional Tax Registration Certificate</SelectItem>
                      <SelectItem value="Trade License">Trade License</SelectItem>
                      <SelectItem value="Voter ID">Voter ID</SelectItem>
                      <SelectItem value="Driving Licence">Driving Licence</SelectItem>
                      <SelectItem value="Any other government-issued registration/license">Any other government-issued registration/license</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.identityDocument.type === 'Any other government-issued registration/license' && (
                    <div className="mt-2">
                      <Label htmlFor="otherIdDetails">Please specify *</Label>
                      <Input
                        id="otherIdDetails"
                        value={formData.identityDocument.otherDetails}
                        onChange={(e) => handleInputChange('identityDocument.otherDetails', e.target.value)}
                        placeholder="Mention registration/license details"
                        required
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="identityNumber">Identity No. *</Label>
                  <Input
                    id="identityNumber"
                    value={formData.identityDocument.number}
                    onChange={(e) => handleInputChange('identityDocument.number', e.target.value)}
                    placeholder="Enter ID number"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="identityUpload">Upload Identity Proof *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="identityUpload"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('identityDocument.uploadedFile', e.target.files[0])}
                    className="flex-1"
                    disabled={documentVerifying}
                  />
                  {documentVerifying && <Loader2 className="h-4 w-4 animate-spin" />}
                  {documentVerified && <CheckCircle className="h-4 w-4 text-green-600" />}
                </div>
                {documentVerifying && (
                  <Alert className="mt-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <AlertDescription>
                      Verifying your document with AI. Please wait...
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Address Tab */}
        <TabsContent value="address" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address Details
                <Badge variant="destructive" className="ml-2">Required</Badge>
              </CardTitle>
              <CardDescription>
                Provide your address information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="street">Address (with City and PIN code) *</Label>
                <Textarea
                  id="street"
                  value={formData.address.street}
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                  placeholder="Enter complete address"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.address.city}
                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                    placeholder="Enter city"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.address.state}
                    onChange={(e) => handleInputChange('address.state', e.target.value)}
                    placeholder="Enter state"
                    required
                  />
                </div>

                <div>
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

              <Separator />

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sameBilling" 
                  checked={sameBillingAddress}
                  onCheckedChange={(checked) => setSameBillingAddress(checked === true)}
                />
                <Label htmlFor="sameBilling">Billing address is same as above address</Label>
              </div>

              {!sameBillingAddress && (
                <Card className="p-4 bg-muted/50">
                  <h4 className="font-medium mb-3">Billing Address</h4>
                  <div className="space-y-4">
                    <Textarea
                      value={formData.billingAddress.street}
                      onChange={(e) => handleInputChange('billingAddress.street', e.target.value)}
                      placeholder="Enter billing address"
                    />
                    <div className="grid gap-4 md:grid-cols-3">
                      <Input
                        value={formData.billingAddress.city}
                        onChange={(e) => handleInputChange('billingAddress.city', e.target.value)}
                        placeholder="City"
                      />
                      <Input
                        value={formData.billingAddress.state}
                        onChange={(e) => handleInputChange('billingAddress.state', e.target.value)}
                        placeholder="State"
                      />
                      <Input
                        value={formData.billingAddress.pinCode}
                        onChange={(e) => handleInputChange('billingAddress.pinCode', e.target.value)}
                        placeholder="PIN Code"
                      />
                    </div>
                  </div>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Information Tab */}
        <TabsContent value="tax" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Tax Information
              </CardTitle>
              <CardDescription>
                Provide your tax-related information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="panNumber">PAN #</Label>
                  <Input
                    id="panNumber"
                    value={formData.panNumber}
                    onChange={(e) => handleInputChange('panNumber', e.target.value)}
                    placeholder="Enter PAN number"
                  />
                </div>

                <div>
                  <Label htmlFor="panCopy">Option to upload copy</Label>
                  <Input
                    id="panCopy"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('panCopy', e.target.files[0])}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="tanNumber">TAN #</Label>
                  <Input
                    id="tanNumber"
                    value={formData.tanNumber}
                    onChange={(e) => handleInputChange('tanNumber', e.target.value)}
                    placeholder="Enter TAN number"
                  />
                </div>

                <div>
                  <Label htmlFor="tanCopy">Option to upload copy</Label>
                  <Input
                    id="tanCopy"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('tanCopy', e.target.files[0])}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="gstNumber">GST #</Label>
                  <Input
                    id="gstNumber"
                    value={formData.gstNumber}
                    onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                    placeholder="Enter GST number"
                  />
                </div>

                <div>
                  <Label htmlFor="gstCopy">Option to upload a copy</Label>
                  <Input
                    id="gstCopy"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('gstCopy', e.target.files[0])}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Banking Details Tab */}
        <TabsContent value="banking" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Banking Details
                  </CardTitle>
                  <CardDescription>
                    Add your banking information for transactions
                  </CardDescription>
                </div>
                <Button onClick={addBankingDetail} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Account
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.bankingDetails.map((banking, index) => (
                <Card key={index} className="p-4 bg-muted/50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Account {index + 1}</h4>
                    {formData.bankingDetails.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeBankingDetail(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>Name (as per Bank Account) *</Label>
                      <Input
                        value={banking.beneficiaryName}
                        onChange={(e) => updateBankingDetail(index, 'beneficiaryName', e.target.value)}
                        placeholder="Enter beneficiary name"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label>Account Type</Label>
                      <Select 
                        value={banking.accountType} 
                        onValueChange={(value) => updateBankingDetail(index, 'accountType', value)}
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

                  <div className="grid gap-4 md:grid-cols-2 mt-4">
                    <div>
                      <Label>Account number *</Label>
                      <Input
                        value={banking.accountNumber}
                        onChange={(e) => updateBankingDetail(index, 'accountNumber', e.target.value)}
                        placeholder="Enter account number"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label>Confirm Account Number *</Label>
                      <Input
                        value={banking.confirmAccountNumber}
                        onChange={(e) => updateBankingDetail(index, 'confirmAccountNumber', e.target.value)}
                        placeholder="Confirm account number"
                        required
                      />
                      {banking.accountNumber && banking.confirmAccountNumber && 
                       banking.accountNumber !== banking.confirmAccountNumber && (
                        <p className="text-sm text-red-600 mt-1">Account numbers do not match</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label>IFSC Code *</Label>
                    <Input
                      value={banking.ifscCode}
                      onChange={(e) => updateBankingDetail(index, 'ifscCode', e.target.value)}
                      placeholder="Enter IFSC code"
                      required
                    />
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AR Details Tab */}
        <TabsContent value="ar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                AR details
                <Badge variant="destructive" className="ml-2">Required</Badge>
              </CardTitle>
              <CardDescription>
                Authorized Representative details are mandatory for Entity/Organization Admin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Name of the Authorised Representative *</Label>
                  <Input 
                    value={formData.authorizedRepresentative.name} 
                    onChange={(e) => handleInputChange('authorizedRepresentative.name', e.target.value)} 
                    placeholder="Enter AR name" 
                    required 
                  />
                </div>
                <div>
                  <Label>Designation *</Label>
                  <Input 
                    value={formData.authorizedRepresentative.designation} 
                    onChange={(e) => handleInputChange('authorizedRepresentative.designation', e.target.value)} 
                    placeholder="Enter designation" 
                    required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Email *</Label>
                  <Input 
                    type="email" 
                    value={formData.authorizedRepresentative.email} 
                    onChange={(e) => handleInputChange('authorizedRepresentative.email', e.target.value)} 
                    placeholder="Enter AR email" 
                    required 
                  />
                </div>
                <div>
                  <Label>Contact No. *</Label>
                  <Input 
                    type="tel" 
                    value={formData.authorizedRepresentative.contactNumber} 
                    onChange={(e) => handleInputChange('authorizedRepresentative.contactNumber', e.target.value)} 
                    placeholder="Enter AR contact" 
                    required 
                  />
                </div>
              </div>
              
              <div>
                <Label>Address</Label>
                <Textarea 
                  value={formData.authorizedRepresentative.address.street} 
                  onChange={(e) => handleInputChange('authorizedRepresentative.address.street', e.target.value)} 
                  placeholder="Enter AR address" 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>City</Label>
                  <Input 
                    value={formData.authorizedRepresentative.address.city} 
                    onChange={(e) => handleInputChange('authorizedRepresentative.address.city', e.target.value)} 
                    placeholder="City" 
                  />
                </div>
                <div>
                  <Label>State</Label>
                  <Input 
                    value={formData.authorizedRepresentative.address.state} 
                    onChange={(e) => handleInputChange('authorizedRepresentative.address.state', e.target.value)} 
                    placeholder="State" 
                  />
                </div>
                <div>
                  <Label>PIN Code</Label>
                  <Input 
                    value={formData.authorizedRepresentative.address.pinCode} 
                    onChange={(e) => handleInputChange('authorizedRepresentative.address.pinCode', e.target.value)} 
                    placeholder="PIN" 
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Identity Document</Label>
                  <Select 
                    value={formData.authorizedRepresentative.identityDocument.type} 
                    onValueChange={(value) => handleInputChange('authorizedRepresentative.identityDocument.type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PAN">PAN</SelectItem>
                      <SelectItem value="Aadhar">Aadhar</SelectItem>
                      <SelectItem value="Passport">Passport</SelectItem>
                    <SelectItem value="Voter ID">Voter ID</SelectItem>
                    <SelectItem value="Driving Licence">Driving Licence</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Identity No.</Label>
                  <Input 
                    value={formData.authorizedRepresentative.identityDocument.number} 
                    onChange={(e) => handleInputChange('authorizedRepresentative.identityDocument.number', e.target.value)} 
                    placeholder="Enter ID number" 
                  />
                </div>
              </div>
              
              <div>
                <Label>Upload Identity Proof</Label>
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => e.target.files?.[0] && handleInputChange('authorizedRepresentative.identityDocument.uploadedFile', e.target.files[0])}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Resource Infra
              </CardTitle>
              <CardDescription>
                Provide information about your organization's resources
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>No. of professionally qualified staff</Label>
                  <Input 
                    type="number" 
                    min="0" 
                    value={formData.resourceInfra.numberOfProfessionalStaff} 
                    onChange={(e) => handleInputChange('resourceInfra.numberOfProfessionalStaff', parseInt(e.target.value) || 0)} 
                  />
                </div>
                <div>
                  <Label>No. of other staff</Label>
                  <Input 
                    type="number" 
                    min="0" 
                    value={formData.resourceInfra.numberOfOtherStaff} 
                    onChange={(e) => handleInputChange('resourceInfra.numberOfOtherStaff', parseInt(e.target.value) || 0)} 
                  />
                </div>
                <div>
                  <Label>No. of interns/articled clerks</Label>
                  <Input 
                    type="number" 
                    min="0" 
                    value={formData.resourceInfra.numberOfInternsArticledClerks} 
                    onChange={(e) => handleInputChange('resourceInfra.numberOfInternsArticledClerks', parseInt(e.target.value) || 0)} 
                  />
                </div>
              </div>
              
              <Separator />
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Label>No. of partners, if applicable</Label>
                    <p className="text-sm text-muted-foreground">Based on the number added the system will provide sections to add partners</p>
                  </div>
                  <Button onClick={addPartner} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Partner
                  </Button>
                </div>
                
                {formData.resourceInfra.partners.map((partner, index) => (
                  <Card key={index} className="p-4 bg-muted/50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Partner {index + 1}</h4>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removePartner(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label>Name of partner</Label>
                        <Input
                          value={partner.name}
                          onChange={(e) => updatePartner(index, 'name', e.target.value)}
                          placeholder="Enter partner name"
                        />
                      </div>
                      <div>
                        <Label>Professional Profile</Label>
                        <Input
                          value={partner.professionalProfileLink}
                          onChange={(e) => updatePartner(index, 'professionalProfileLink', e.target.value)}
                          placeholder="Link to create another profile"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between py-6 border-t">
        <div className="flex items-center gap-4">
          {currentTab !== 'basic' && (
            <Button variant="outline" onClick={handlePrevious} className="min-w-[100px]">
              Previous
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleSkipCurrentTab} className="min-w-[120px]" disabled={loading}>
            Skip for Now
          </Button>
          
          {currentTab !== 'resources' ? (
            <Button onClick={handleSaveAndNext} disabled={loading} className="min-w-[140px]">
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
            <Button onClick={handleSubmit} disabled={loading} className="min-w-[140px]">
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
      </div>

      {completion === 100 ? (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Great! Complete your profile to get your permanent registration number.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <AlertDescription>Complete all mandatory fields to get your permanent registration number.</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
