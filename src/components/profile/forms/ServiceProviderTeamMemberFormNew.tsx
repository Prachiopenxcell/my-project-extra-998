import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { User, FileText, MapPin, Save, Clock, CheckCircle } from 'lucide-react';
import { IdentityDocumentType } from '@/types/profile';
import { ProfileService } from '@/services/profileService';
import { useAuth } from '@/contexts/AuthContext';

interface ServiceProviderTeamMemberFormProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface FormData {
  // Name of the Client
  name: string;
  
  // Identity Document Details
  identityDocument: {
    type: IdentityDocumentType | '';
    number: string;
    uploadedFile: File | null;
  };
  
  // Email
  email: string;
  
  // Contact Number
  contactNumber: string;
  
  // Address (with City and PIN code)
  address: {
    street: string;
    city: string;
    state: string;
    pinCode: string;
  };
}

export const ServiceProviderTeamMemberFormNew: React.FC<ServiceProviderTeamMemberFormProps> = ({
  onComplete,
  onSkip
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
    
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
    }
  });

  const calculateCompletion = () => {
    const mandatoryFields = [
      formData.name,
      formData.identityDocument.type,
      formData.identityDocument.number,
      formData.email,
      formData.contactNumber,
      formData.address.street,
      formData.address.city,
      formData.address.pinCode
    ];
    
    const completedMandatory = mandatoryFields.filter(field => field && field.toString().trim() !== '').length;
    const totalMandatory = mandatoryFields.length;
    
    return Math.round((completedMandatory / totalMandatory) * 100);
  };

  const handleInputChange = (field: string, value: string | File | null) => {
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
        ...formData
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

  const completion = calculateCompletion();

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Team Member Profile</h1>
            <p className="text-muted-foreground">Complete your team member profile</p>
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

      <div className="space-y-6">
        {/* Basic Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Details
            </CardTitle>
            <CardDescription>
              Provide your basic information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name of the Client *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
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
          </CardContent>
        </Card>

        {/* Identity Document Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Identity Document Details
            </CardTitle>
            <CardDescription>
              Upload your identity proof for verification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
                    <SelectItem value={IdentityDocumentType.DRIVING_LICENSE}>Driving License</SelectItem>
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
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Address
            </CardTitle>
            <CardDescription>
              Provide your address details with City and PIN code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="street">Street Address *</Label>
              <Input
                id="street"
                value={formData.address.street}
                onChange={(e) => handleInputChange('address.street', e.target.value)}
                placeholder="Enter street address"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange('address.city', e.target.value)}
                  placeholder="Enter city"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.address.state}
                  onChange={(e) => handleInputChange('address.state', e.target.value)}
                  placeholder="Enter state"
                />
              </div>
              <div>
                <Label htmlFor="pinCode">PIN Code *</Label>
                <Input
                  id="pinCode"
                  value={formData.address.pinCode}
                  onChange={(e) => handleInputChange('address.pinCode', e.target.value)}
                  placeholder="Enter PIN code"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Update Information */}
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            You can update your profile details anytime by navigating to System Settings → Profile Management section.
          </AlertDescription>
        </Alert>
      </div>

      <div className="flex justify-between items-center mt-8">
        <Button variant="outline" onClick={onSkip} disabled={loading}>
          <Clock className="h-4 w-4 mr-2" />
          Skip for Now
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Profile
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
