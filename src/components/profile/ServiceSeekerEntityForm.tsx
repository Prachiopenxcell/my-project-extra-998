import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ServiceSeekerEntityProfile, PersonType, IdentityDocumentType } from '@/types/profile';
import { ProfileService } from '@/services/profileService';
import { useToast } from '@/hooks/use-toast';
import {
  User, FileText, MapPin, CreditCard, Building, Users,
  Upload, CheckCircle, Loader2, X, Plus
} from 'lucide-react';

interface ServiceSeekerEntityFormProps {
  profile: ServiceSeekerEntityProfile;
  onSave: (profile: ServiceSeekerEntityProfile) => void;
  loading?: boolean;
  activeSection?: string;
}

export const ServiceSeekerEntityForm: React.FC<ServiceSeekerEntityFormProps> = ({
  profile, onSave, loading = false, activeSection = ''
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ServiceSeekerEntityProfile>(profile);
  const [documentVerifying, setDocumentVerifying] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const keys = field.split('.');
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      } else if (keys.length === 2) {
        const [parent, child] = keys;
        return {
          ...prev,
          [parent]: { ...prev[parent as keyof ServiceSeekerEntityProfile], [child]: value }
        };
      } else {
        const [parent, child, grandchild] = keys;
        return {
          ...prev,
          [parent]: {
            ...prev[parent as keyof ServiceSeekerEntityProfile],
            [child]: { ...(prev[parent as keyof ServiceSeekerEntityProfile] as any)?.[child], [grandchild]: value }
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
          handleInputChange(field, file);
          toast({ title: "Document Verified", description: "Identity document verified successfully." });
        } else {
          toast({ title: "Verification Failed", description: "Please upload a valid document.", variant: "destructive" });
        }
      } catch (error) {
        toast({ title: "Error", description: "Failed to verify document.", variant: "destructive" });
      } finally {
        setDocumentVerifying(false);
      }
    } else {
      handleInputChange(field, file);
    }
  };

  const addPartner = () => {
    const currentPartners = formData.resourceInfra?.partners || [];
    setFormData(prev => ({
      ...prev,
      resourceInfra: {
        ...prev.resourceInfra,
        partners: [...currentPartners, { name: '', professionalProfileLink: '' }]
      }
    }));
  };

  const getActiveTab = () => {
    if (activeSection.includes('Basic')) return 'basic';
    if (activeSection.includes('Identity')) return 'identity';
    if (activeSection.includes('Representative')) return 'representative';
    if (activeSection.includes('Resource')) return 'resources';
    return 'basic';
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue={getActiveTab()} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic"><User className="h-4 w-4 mr-1" />Basic</TabsTrigger>
          <TabsTrigger value="identity"><FileText className="h-4 w-4 mr-1" />Identity</TabsTrigger>
          <TabsTrigger value="representative"><Users className="h-4 w-4 mr-1" />Representative</TabsTrigger>
          <TabsTrigger value="resources"><Building className="h-4 w-4 mr-1" />Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />Basic Details
                <Badge variant="destructive">Required</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Person Type</Label>
                  <Select value={formData.personType} onValueChange={(value) => handleInputChange('personType', value)}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PersonType.PUBLIC_LIMITED}>Public Limited</SelectItem>
                      <SelectItem value={PersonType.PRIVATE_LIMITED}>Private Limited</SelectItem>
                      <SelectItem value={PersonType.LIMITED_LIABILITY_PARTNERSHIP}>LLP</SelectItem>
                      <SelectItem value={PersonType.REGISTERED_PARTNERSHIP}>Registered Partnership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Client Logo</Label>
                  <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload('clientLogo', e.target.files[0])} />
                </div>
              </div>

              <Input value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Name of the Client *" />
              
              <div className="grid gap-4 md:grid-cols-2">
                <Input value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="Email *" />
                <Input value={formData.contactNumber} onChange={(e) => handleInputChange('contactNumber', e.target.value)} placeholder="Contact Number *" />
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea value={formData.address.street} onChange={(e) => handleInputChange('address.street', e.target.value)} placeholder="Street Address *" />
                <div className="grid gap-4 md:grid-cols-3">
                  <Input value={formData.address.city} onChange={(e) => handleInputChange('address.city', e.target.value)} placeholder="City *" />
                  <Input value={formData.address.state} onChange={(e) => handleInputChange('address.state', e.target.value)} placeholder="State *" />
                  <Input value={formData.address.pinCode} onChange={(e) => handleInputChange('address.pinCode', e.target.value)} placeholder="PIN Code *" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="identity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />Identity Documents
                <Badge variant="destructive">Required</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Select value={formData.identityDocument.type} onValueChange={(value) => handleInputChange('identityDocument.type', value)}>
                  <SelectTrigger><SelectValue placeholder="Document Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pan">PAN Card</SelectItem>
                    <SelectItem value="aadhar">Aadhar Card</SelectItem>
                    <SelectItem value="passport">Passport</SelectItem>
                  </SelectContent>
                </Select>
                <Input value={formData.identityDocument.number} onChange={(e) => handleInputChange('identityDocument.number', e.target.value)} placeholder="Document Number *" />
              </div>
              <div className="flex items-center gap-2">
                <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => e.target.files?.[0] && handleFileUpload('identityDocument.uploadedFile', e.target.files[0])} disabled={documentVerifying} />
                {documentVerifying && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>PAN Number</Label>
                  <Input value={formData.panNumber || ''} onChange={(e) => handleInputChange('panNumber', e.target.value)} placeholder="PAN Number" />
                </div>
                <div className="space-y-2">
                  <Label>GST Number</Label>
                  <Input value={formData.gstNumber || ''} onChange={(e) => handleInputChange('gstNumber', e.target.value)} placeholder="GST Number" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="representative" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />Authorized Representative
                <Badge variant="destructive">Required</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Input value={formData.authorizedRepresentative?.name || ''} onChange={(e) => handleInputChange('authorizedRepresentative.name', e.target.value)} placeholder="Representative Name *" />
                <Input value={formData.authorizedRepresentative?.designation || ''} onChange={(e) => handleInputChange('authorizedRepresentative.designation', e.target.value)} placeholder="Designation *" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input value={formData.authorizedRepresentative?.email || ''} onChange={(e) => handleInputChange('authorizedRepresentative.email', e.target.value)} placeholder="Email *" />
                <Input value={formData.authorizedRepresentative?.contactNumber || ''} onChange={(e) => handleInputChange('authorizedRepresentative.contactNumber', e.target.value)} placeholder="Contact Number *" />
              </div>
              <Textarea value={formData.authorizedRepresentative?.address?.street || ''} onChange={(e) => handleInputChange('authorizedRepresentative.address.street', e.target.value)} placeholder="Representative Address" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />Resource Infrastructure
                </CardTitle>
                <Button onClick={addPartner} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />Add Partner
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Professional Staff</Label>
                  <Input type="number" value={formData.resourceInfra?.numberOfProfessionalStaff || 0} onChange={(e) => handleInputChange('resourceInfra.numberOfProfessionalStaff', parseInt(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>Other Staff</Label>
                  <Input type="number" value={formData.resourceInfra?.numberOfOtherStaff || 0} onChange={(e) => handleInputChange('resourceInfra.numberOfOtherStaff', parseInt(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>Interns/Clerks</Label>
                  <Input type="number" value={formData.resourceInfra?.numberOfInternsArticledClerks || 0} onChange={(e) => handleInputChange('resourceInfra.numberOfInternsArticledClerks', parseInt(e.target.value))} />
                </div>
              </div>

              {formData.resourceInfra?.partners?.map((partner, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">Partner {index + 1}</h5>
                    <Button variant="ghost" size="sm" onClick={() => {
                      const updated = formData.resourceInfra?.partners?.filter((_, i) => i !== index) || [];
                      setFormData(prev => ({ ...prev, resourceInfra: { ...prev.resourceInfra, partners: updated } }));
                    }}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input value={partner.name} onChange={(e) => {
                      const updated = [...(formData.resourceInfra?.partners || [])];
                      updated[index].name = e.target.value;
                      setFormData(prev => ({ ...prev, resourceInfra: { ...prev.resourceInfra, partners: updated } }));
                    }} placeholder="Partner Name" />
                    <Input value={partner.professionalProfileLink || ''} onChange={(e) => {
                      const updated = [...(formData.resourceInfra?.partners || [])];
                      updated[index].professionalProfileLink = e.target.value;
                      setFormData(prev => ({ ...prev, resourceInfra: { ...prev.resourceInfra, partners: updated } }));
                    }} placeholder="Profile Link" />
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={() => onSave(formData)} disabled={loading} className="min-w-32">
          {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : 'Save Profile'}
        </Button>
      </div>
    </div>
  );
};
