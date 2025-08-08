import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ServiceSeekerIndividualProfile, PersonType, IdentityDocumentType } from '@/types/profile';
import { ProfileService } from '@/services/profileService';
import { useToast } from '@/hooks/use-toast';
import {
  User,
  FileText,
  MapPin,
  CreditCard,
  Building,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Plus
} from 'lucide-react';

interface ServiceSeekerIndividualFormProps {
  profile: ServiceSeekerIndividualProfile;
  onSave: (profile: ServiceSeekerIndividualProfile) => void;
  loading?: boolean;
  activeSection?: string;
}

export const ServiceSeekerIndividualForm: React.FC<ServiceSeekerIndividualFormProps> = ({
  profile,
  onSave,
  loading = false,
  activeSection = ''
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ServiceSeekerIndividualProfile>(profile);
  const [documentVerifying, setDocumentVerifying] = useState(false);
  const [documentVerified, setDocumentVerified] = useState(false);
  const [sameBillingAddress, setSameBillingAddress] = useState(true);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const keys = field.split('.');
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      } else {
        const [parent, child] = keys;
        return {
          ...prev,
          [parent]: {
            ...prev[parent as keyof ServiceSeekerIndividualProfile],
            [child]: value
          }
        };
      }
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
          toast({
            title: "Document Verified",
            description: "Your identity document has been successfully verified.",
          });
        } else {
          toast({
            title: "Document Verification Failed",
            description: verification.errors?.[0] || "Please upload a valid document.",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Verification Error",
          description: "Failed to verify document. Please try again.",
          variant: "destructive"
        });
      } finally {
        setDocumentVerifying(false);
      }
    } else {
      handleInputChange(field, file);
    }
  };

  const addBankingDetail = () => {
    const newBankingDetail = {
      beneficiaryName: '',
      accountType: 'savings' as any,
      accountNumber: '',
      confirmAccountNumber: '',
      ifscCode: '',
      isDefault: formData.bankingDetails.length === 0
    };
    
    setFormData(prev => ({
      ...prev,
      bankingDetails: [...prev.bankingDetails, newBankingDetail]
    }));
  };

  const removeBankingDetail = (index: number) => {
    setFormData(prev => ({
      ...prev,
      bankingDetails: prev.bankingDetails.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    // Copy address to billing address if same
    if (sameBillingAddress) {
      formData.billingAddress = { ...formData.address };
    }
    
    onSave(formData);
  };

  const getActiveTab = () => {
    if (activeSection.includes('Basic') || activeSection.includes('Personal')) return 'basic';
    if (activeSection.includes('Identity') || activeSection.includes('Document')) return 'identity';
    if (activeSection.includes('Address')) return 'address';
    if (activeSection.includes('Tax')) return 'tax';
    if (activeSection.includes('Banking')) return 'banking';
    return 'basic';
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue={getActiveTab()} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Basic Details
          </TabsTrigger>
          <TabsTrigger value="identity" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Identity
          </TabsTrigger>
          <TabsTrigger value="address" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Address
          </TabsTrigger>
          <TabsTrigger value="tax" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Tax Info
          </TabsTrigger>
          <TabsTrigger value="banking" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Banking
          </TabsTrigger>
        </TabsList>

        {/* Basic Details */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Details
                <Badge variant="destructive" className="ml-2">Required</Badge>
              </CardTitle>
              <CardDescription>
                Provide your basic information for profile setup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="personType">Person Type</Label>
                  <Select 
                    value={formData.personType} 
                    onValueChange={(value) => handleInputChange('personType', value)}
                  >
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

              <div className="grid gap-4 md:grid-cols-2">
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
                    value={formData.contactNumber}
                    onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                    placeholder="Enter contact number"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Identity Documents */}
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
                <div className="space-y-2">
                  <Label htmlFor="identityType">Identity Document Type *</Label>
                  <Select 
                    value={formData.identityDocument.type} 
                    onValueChange={(value) => handleInputChange('identityDocument.type', value)}
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
                    value={formData.identityDocument.number}
                    onChange={(e) => handleInputChange('identityDocument.number', e.target.value)}
                    placeholder="Enter document number"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
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
                  {documentVerified && <CheckCircle className="h-4 w-4 text-success" />}
                </div>
                {documentVerifying && (
                  <Alert>
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

        {/* Address Details */}
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

              <div className="grid gap-4 md:grid-cols-3">
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

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sameBilling" 
                  checked={sameBillingAddress}
                  onCheckedChange={setSameBillingAddress}
                />
                <Label htmlFor="sameBilling">Billing address is same as above</Label>
              </div>

              {!sameBillingAddress && (
                <Card className="p-4">
                  <h4 className="font-medium mb-3">Billing Address</h4>
                  <div className="space-y-4">
                    <Textarea
                      value={formData.billingAddress.street}
                      onChange={(e) => handleInputChange('billingAddress.street', e.target.value)}
                      placeholder="Enter billing street address"
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

        {/* Tax Information */}
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
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="panNumber">PAN Number</Label>
                  <Input
                    id="panNumber"
                    value={formData.panNumber || ''}
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
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('panCopy', e.target.files[0])}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tanNumber">TAN Number</Label>
                  <Input
                    id="tanNumber"
                    value={formData.tanNumber || ''}
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
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('tanCopy', e.target.files[0])}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gstNumber">GST Number</Label>
                  <Input
                    id="gstNumber"
                    value={formData.gstNumber || ''}
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
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('gstCopy', e.target.files[0])}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Banking Details */}
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
                <Card key={index} className="p-4">
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
                    <div className="space-y-2">
                      <Label>Beneficiary Name</Label>
                      <Input
                        value={banking.beneficiaryName}
                        onChange={(e) => {
                          const updated = [...formData.bankingDetails];
                          updated[index].beneficiaryName = e.target.value;
                          setFormData(prev => ({ ...prev, bankingDetails: updated }));
                        }}
                        placeholder="As per bank account"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Account Type</Label>
                      <Select 
                        value={banking.accountType}
                        onValueChange={(value) => {
                          const updated = [...formData.bankingDetails];
                          updated[index].accountType = value as any;
                          setFormData(prev => ({ ...prev, bankingDetails: updated }));
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="savings">Savings</SelectItem>
                          <SelectItem value="current">Current</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Account Number</Label>
                      <Input
                        value={banking.accountNumber}
                        onChange={(e) => {
                          const updated = [...formData.bankingDetails];
                          updated[index].accountNumber = e.target.value;
                          setFormData(prev => ({ ...prev, bankingDetails: updated }));
                        }}
                        placeholder="Enter account number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>IFSC Code</Label>
                      <Input
                        value={banking.ifscCode}
                        onChange={(e) => {
                          const updated = [...formData.bankingDetails];
                          updated[index].ifscCode = e.target.value;
                          setFormData(prev => ({ ...prev, bankingDetails: updated }));
                        }}
                        placeholder="Enter IFSC code"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading} className="min-w-32">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Profile'
          )}
        </Button>
      </div>
    </div>
  );
};
