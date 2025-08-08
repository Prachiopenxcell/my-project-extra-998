import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TeamMemberProfile, IdentityDocumentType } from '@/types/profile';
import { ProfileService } from '@/services/profileService';
import { useToast } from '@/hooks/use-toast';
import {
  User,
  FileText,
  MapPin,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface TeamMemberFormProps {
  profile: TeamMemberProfile;
  onSave: (profile: TeamMemberProfile) => void;
  loading?: boolean;
  activeSection?: string;
}

export const TeamMemberForm: React.FC<TeamMemberFormProps> = ({
  profile,
  onSave,
  loading = false,
  activeSection = ''
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<TeamMemberProfile>(profile);
  const [documentVerifying, setDocumentVerifying] = useState(false);
  const [documentVerified, setDocumentVerified] = useState(false);

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
            ...(prev[parent as keyof TeamMemberProfile] as Record<string, any>),
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

  const handleSave = () => {
    onSave(formData);
  };

  const getActiveTab = () => {
    if (activeSection.includes('Basic') || activeSection.includes('Personal')) return 'basic';
    if (activeSection.includes('Identity') || activeSection.includes('Document')) return 'identity';
    if (activeSection.includes('Address')) return 'address';
    return 'basic';
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue={getActiveTab()} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
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
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
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
