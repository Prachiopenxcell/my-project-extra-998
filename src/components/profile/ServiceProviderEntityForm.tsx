import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ServiceProviderEntityProfile, PersonType, IdentityDocumentType } from '@/types/profile';
import { ProfileService } from '@/services/profileService';
import { useToast } from '@/hooks/use-toast';
import {
  User, FileText, Building, Users, Briefcase,
  Upload, CheckCircle, Loader2, X, Plus
} from 'lucide-react';

interface ServiceProviderEntityFormProps {
  profile: ServiceProviderEntityProfile;
  onSave: (profile: ServiceProviderEntityProfile) => void;
  loading?: boolean;
  activeSection?: string;
}

export const ServiceProviderEntityForm: React.FC<ServiceProviderEntityFormProps> = ({
  profile, onSave, loading = false, activeSection = ''
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ServiceProviderEntityProfile>(profile);
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
          [parent]: { ...prev[parent as keyof ServiceProviderEntityProfile], [child]: value }
        };
      } else {
        const [parent, child, grandchild] = keys;
        return {
          ...prev,
          [parent]: {
            ...prev[parent as keyof ServiceProviderEntityProfile],
            [child]: { ...(prev[parent as keyof ServiceProviderEntityProfile] as any)?.[child], [grandchild]: value }
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

  const addServiceOffering = () => {
    setFormData(prev => ({
      ...prev,
      servicesOffered: [...prev.servicesOffered, {
        category: '', level: 'entrant' as any, sector: 'services' as any,
        industry: 'engineering' as any, services: [], hashtags: []
      }]
    }));
  };

  const getActiveTab = () => {
    if (activeSection.includes('Company')) return 'company';
    if (activeSection.includes('Personal')) return 'personal';
    if (activeSection.includes('Representative')) return 'representative';
    if (activeSection.includes('Service')) return 'services';
    return 'company';
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue={getActiveTab()} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="company"><Building className="h-4 w-4 mr-1" />Company</TabsTrigger>
          <TabsTrigger value="personal"><User className="h-4 w-4 mr-1" />Personal</TabsTrigger>
          <TabsTrigger value="representative"><Users className="h-4 w-4 mr-1" />Representative</TabsTrigger>
          <TabsTrigger value="services"><Briefcase className="h-4 w-4 mr-1" />Services</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />Company Details
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
                  <Label>Date of Incorporation</Label>
                  <Input type="date" value={formData.dateOfIncorporation} onChange={(e) => handleInputChange('dateOfIncorporation', e.target.value)} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Company Name *" />
                <div className="space-y-2">
                  <Label>Company Logo</Label>
                  <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload('companyLogo', e.target.files[0])} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Certificate of Incorporation</Label>
                <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => e.target.files?.[0] && handleFileUpload('incorporationCertificate', e.target.files[0])} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />Personal Details
                <Badge variant="destructive">Required</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Select value={formData.title} onValueChange={(value) => handleInputChange('title', value)}>
                  <SelectTrigger><SelectValue placeholder="Title" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mr.">Mr.</SelectItem>
                    <SelectItem value="Mrs.">Mrs.</SelectItem>
                    <SelectItem value="Ms.">Ms.</SelectItem>
                    <SelectItem value="Dr.">Dr.</SelectItem>
                  </SelectContent>
                </Select>
                <div className="md:col-span-2">
                  <Input value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Full Name *" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="Email *" />
                <Input value={formData.mobile} onChange={(e) => handleInputChange('mobile', e.target.value)} placeholder="Mobile *" />
              </div>

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

              <Textarea value={formData.qualifications} onChange={(e) => handleInputChange('qualifications', e.target.value)} placeholder="Qualifications (B.Com, CA, CMA, etc.)" />
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

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />Services Offered
                  <Badge variant="destructive">Required</Badge>
                </CardTitle>
                <Button onClick={addServiceOffering} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />Add Service
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.servicesOffered.map((service, index) => (
                <Card key={index} className="p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input value={service.category} onChange={(e) => {
                      const updated = [...formData.servicesOffered];
                      updated[index].category = e.target.value;
                      setFormData(prev => ({ ...prev, servicesOffered: updated }));
                    }} placeholder="Service Category" />
                    <Select value={service.level} onValueChange={(value) => {
                      const updated = [...formData.servicesOffered];
                      updated[index].level = value as any;
                      setFormData(prev => ({ ...prev, servicesOffered: updated }));
                    }}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entrant">Entrant</SelectItem>
                        <SelectItem value="experienced">Experienced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
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
