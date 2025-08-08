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
  CheckCircle 
} from 'lucide-react';
import { PersonType, IdentityDocumentType, AccountType, ServiceLevel } from '@/types/profile';
import { ProfileService } from '@/services/profileService';
import { useAuth } from '@/contexts/AuthContext';

interface ServiceProviderEntityAdminFormProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const ServiceProviderEntityAdminForm: React.FC<ServiceProviderEntityAdminFormProps> = ({
  onComplete,
  onSkip
}) => {
  const { user } = useAuth();
  const [currentSection, setCurrentSection] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic entity info
    personType: '',
    name: user?.name || '',
    email: user?.email || '',
    contactNumber: user?.phone || '',
    address: { street: '', city: '', state: '', pinCode: '' },
    
    // AR details
    authorizedRepresentative: {
      name: '',
      designation: '',
      email: '',
      contactNumber: '',
      identityDocument: { type: '', number: '', proof: null }
    },
    
    // Resource infrastructure
    resourceInfra: {
      numberOfPartners: 0,
      partners: [] as Array<{name: string, professionalProfileLink: string}>,
      numberOfProfessionalStaff: 0,
      numberOfOtherStaff: 0,
      numberOfInternsArticledClerks: 0
    },
    
    // Services offered
    servicesOffered: {
      serviceLevel: '',
      categories: [] as string[],
      description: ''
    },
    
    // Banking
    bankingDetails: {
      beneficiaryName: '',
      accountNumber: '',
      confirmAccountNumber: '',
      accountType: '',
      ifscCode: ''
    }
  });

  const sections = [
    { id: 'basic', title: 'Entity Info', icon: Building, required: true },
    { id: 'ar', title: 'AR Details', icon: UserCheck, required: true },
    { id: 'resource', title: 'Resources', icon: Users, required: true },
    { id: 'services', title: 'Services', icon: Briefcase, required: true },
    { id: 'banking', title: 'Banking', icon: FileText, required: true }
  ];

  const serviceCategories = ['Legal Consultation', 'Document Drafting', 'Court Representation', 'Corporate Law', 'Family Law', 'Criminal Law', 'Property Law', 'Tax Law'];

  const calculateCompletion = () => {
    const mandatoryFields = [
      formData.name, formData.email, formData.contactNumber,
      formData.address.street, formData.address.city, formData.address.pinCode,
      formData.authorizedRepresentative.name, formData.authorizedRepresentative.designation,
      formData.authorizedRepresentative.email, formData.authorizedRepresentative.contactNumber,
      formData.servicesOffered.serviceLevel,
      formData.servicesOffered.categories.length > 0 ? 'yes' : '',
      formData.bankingDetails.beneficiaryName, formData.bankingDetails.accountNumber,
      formData.bankingDetails.ifscCode
    ];
    const completed = mandatoryFields.filter(field => field && field.toString().trim() !== '').length;
    return Math.round((completed / mandatoryFields.length) * 100);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const keys = field.split('.');
      if (keys.length === 1) return { ...prev, [field]: value };
      if (keys.length === 2) return { ...prev, [keys[0]]: { ...prev[keys[0] as keyof typeof prev], [keys[1]]: value }};
      if (keys.length === 3) return {
        ...prev,
        [keys[0]]: { ...prev[keys[0] as keyof typeof prev], [keys[1]]: { ...(prev[keys[0] as keyof typeof prev] as any)[keys[1]], [keys[2]]: value }}
      };
      return prev;
    });
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

  const toggleServiceCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      servicesOffered: {
        ...prev.servicesOffered,
        categories: prev.servicesOffered.categories.includes(category)
          ? prev.servicesOffered.categories.filter(c => c !== category)
          : [...prev.servicesOffered.categories, category]
      }
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
      toast.success('Service provider entity admin profile saved successfully!');
      onComplete();
    } catch (error) {
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0: // Entity Info
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Entity Type *</Label>
                <Select value={formData.personType} onValueChange={(value) => handleInputChange('personType', value)}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PersonType.PUBLIC_LIMITED}>Public Limited</SelectItem>
                    <SelectItem value={PersonType.PRIVATE_LIMITED}>Private Limited</SelectItem>
                    <SelectItem value={PersonType.LIMITED_LIABILITY_PARTNERSHIP}>LLP</SelectItem>
                    <SelectItem value={PersonType.REGISTERED_PARTNERSHIP}>Partnership</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Entity Name *</Label>
                <Input value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Enter entity name" required />
              </div>
            </div>
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
          </div>
        );

      case 1: // AR Details
        return (
          <div className="space-y-6">
            <Alert><UserCheck className="h-4 w-4" /><AlertDescription>Authorized Representative details are mandatory for entity administration.</AlertDescription></Alert>
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
                    <SelectItem value={IdentityDocumentType.PAN}>PAN</SelectItem>
                    <SelectItem value={IdentityDocumentType.AADHAR}>Aadhar</SelectItem>
                    <SelectItem value={IdentityDocumentType.PASSPORT}>Passport</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>AR ID Number</Label>
                <Input value={formData.authorizedRepresentative.identityDocument.number} onChange={(e) => handleInputChange('authorizedRepresentative.identityDocument.number', e.target.value)} placeholder="ID number" />
              </div>
            </div>
          </div>
        );

      case 2: // Resources
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

      case 3: // Services
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Service Level *</Label>
              <Select value={formData.servicesOffered.serviceLevel} onValueChange={(value) => handleInputChange('servicesOffered.serviceLevel', value)}>
                <SelectTrigger><SelectValue placeholder="Select service level" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ServiceLevel.JUNIOR}>Junior (0-3 years)</SelectItem>
                  <SelectItem value={ServiceLevel.MID_LEVEL}>Mid-Level (3-7 years)</SelectItem>
                  <SelectItem value={ServiceLevel.SENIOR}>Senior (7-15 years)</SelectItem>
                  <SelectItem value={ServiceLevel.EXPERT}>Expert (15+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Service Categories *</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {serviceCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`service-${category}`}
                      checked={formData.servicesOffered.categories.includes(category)}
                      onCheckedChange={() => toggleServiceCategory(category)}
                    />
                    <Label htmlFor={`service-${category}`} className="text-sm">{category}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Service Description</Label>
              <Textarea
                value={formData.servicesOffered.description}
                onChange={(e) => handleInputChange('servicesOffered.description', e.target.value)}
                placeholder="Describe your entity's services and expertise..."
                rows={4}
              />
            </div>
          </div>
        );

      case 4: // Banking
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Beneficiary Name *</Label>
              <Input value={formData.bankingDetails.beneficiaryName} onChange={(e) => handleInputChange('bankingDetails.beneficiaryName', e.target.value)} placeholder="Name as per bank" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Account Number *</Label>
                <Input value={formData.bankingDetails.accountNumber} onChange={(e) => handleInputChange('bankingDetails.accountNumber', e.target.value)} placeholder="Account number" required />
              </div>
              <div className="space-y-2">
                <Label>Confirm Account *</Label>
                <Input value={formData.bankingDetails.confirmAccountNumber} onChange={(e) => handleInputChange('bankingDetails.confirmAccountNumber', e.target.value)} placeholder="Confirm account" required />
                {formData.bankingDetails.accountNumber && formData.bankingDetails.confirmAccountNumber && 
                 formData.bankingDetails.accountNumber !== formData.bankingDetails.confirmAccountNumber && (
                  <p className="text-sm text-red-600">Account numbers do not match</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Account Type *</Label>
                <Select value={formData.bankingDetails.accountType} onValueChange={(value) => handleInputChange('bankingDetails.accountType', value)}>
                  <SelectTrigger><SelectValue placeholder="Account type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={AccountType.CURRENT}>Current</SelectItem>
                    <SelectItem value={AccountType.BUSINESS}>Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>IFSC Code *</Label>
                <Input value={formData.bankingDetails.ifscCode} onChange={(e) => handleInputChange('bankingDetails.ifscCode', e.target.value)} placeholder="IFSC code" required />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const completionPercentage = calculateCompletion();
  const currentSectionData = sections[currentSection];
  const IconComponent = currentSectionData.icon;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-orange-600" />
                Service Provider Entity Admin Profile
              </CardTitle>
              <CardDescription>Complete your organization profile to offer services</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">{completionPercentage}%</div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>
          <Progress value={completionPercentage} className="mt-4" />
        </CardHeader>
      </Card>

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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconComponent className="h-5 w-5" />
            {currentSectionData.title}
            {currentSectionData.required && <Badge variant="secondary">Required</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>{renderCurrentSection()}</CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-3 flex-1">
          {currentSection > 0 && (
            <Button variant="outline" onClick={() => setCurrentSection(currentSection - 1)}>Previous</Button>
          )}
          {currentSection < sections.length - 1 ? (
            <Button onClick={() => setCurrentSection(currentSection + 1)} className="flex-1">Next Section</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading} className="flex-1">
              {loading ? <><Clock className="h-4 w-4 mr-2 animate-spin" />Saving...</> : <><Save className="h-4 w-4 mr-2" />Complete Profile</>}
            </Button>
          )}
        </div>
        <Button variant="outline" onClick={onSkip}>Skip for Now</Button>
      </div>

      {calculateCompletion() === 100 ? (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Excellent! Complete your profile to get your permanent registration number and start offering services.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <AlertDescription>Complete all mandatory sections to unlock full platform access and get your permanent registration number.</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
