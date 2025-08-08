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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  User, 
  FileText, 
  MapPin, 
  Award, 
  Users, 
  Briefcase, 
  Save, 
  Clock, 
  Plus, 
  Trash2, 
  CheckCircle,
  Upload,
  Building,
  CreditCard,
  Globe,
  Phone,
  Mail,
  Calendar,
  Shield,
  Languages,
  Settings
} from 'lucide-react';
import { IdentityDocumentType, AccountType, ServiceLevel, ServiceSector, ServiceIndustry, LanguageProficiency } from '@/types/profile';
import { ProfileService } from '@/services/profileService';
import { useAuth } from '@/contexts/AuthContext';

interface ServiceProviderIndividualFormProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface FormData {
  // Personal Details
  title: string;
  name: string;
  companyName: string;
  companyLogo: File | null;
  
  // User Details (Mandatory for permanent reference number)
  email: string;
  mobile: string;
  
  // Alternate Contact Details (for account recovery)
  alternateContacts: Array<{
    email: string;
    mobile: string;
  }>;
  
  // DOB/Date of Incorporation
  dateOfBirth: string;
  dateOfIncorporation: string;
  
  // Identity Document (Mandatory)
  identityDocument: {
    type: IdentityDocumentType | '';
    number: string;
    uploadedFile: File | null;
  };
  
  // Qualifications (Mandatory)
  qualifications: string;
  
  // Membership Details (Mandatory)
  membershipDetails: Array<{
    bodyInstitute: string; // ICAI/IIIPI/ICSI
    membershipNumber: string;
    memberSince: string;
    uploadedCopy: File | null;
    practiceLicenseNumber: string;
    licenseValidity: string;
    licenseCopy: File | null;
  }>;
  
  // Language Known
  languageSkills: Array<{
    language: string;
    speak: LanguageProficiency;
    read: LanguageProficiency;
    write: LanguageProficiency;
  }>;
  
  // Resources and Infrastructure
  resourceInfra: {
    numberOfPartners: number;
    numberOfProfessionalStaff: number;
    numberOfOtherStaff: number;
    numberOfInternsArticledClerks: number;
  };
  
  // Work Location
  workLocations: Array<{
    city: string;
    location: string;
    pinCode: string;
  }>;
  
  // Open to work remotely
  openToRemoteWork: boolean;
  
  // Billing Details
  billingDetails: Array<{
    tradeName: string;
    billingAddress: {
      street: string;
      city: string;
      state: string;
      pinCode: string;
    };
    gstState: string;
    gstRegistrationNumber: string;
    gstCopy: File | null;
    panNumber: string;
    panCopy: File | null;
    tanNumber: string;
    tanCopy: File | null;
    isDefault: boolean;
  }>;
  
  // Banking Details
  bankingDetails: Array<{
    beneficiaryName: string;
    accountType: AccountType | '';
    accountNumber: string;
    confirmAccountNumber: string;
    ifscCode: string;
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
}

export const ServiceProviderIndividualForm: React.FC<ServiceProviderIndividualFormProps> = ({
  onComplete,
  onSkip
}) => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    // Personal Details
    title: 'Mr.',
    name: user?.name || '',
    companyName: '',
    companyLogo: null,
    
    // User Details
    email: user?.email || '',
    mobile: user?.phone || '',
    
    // Alternate Contact Details
    alternateContacts: [{ email: '', mobile: '' }],
    
    // DOB/Date of Incorporation
    dateOfBirth: '',
    dateOfIncorporation: '',
    
    // Identity Document
    identityDocument: {
      type: '',
      number: '',
      uploadedFile: null
    },
    
    // Qualifications
    qualifications: '',
    
    // Membership Details
    membershipDetails: [{
      bodyInstitute: '',
      membershipNumber: '',
      memberSince: '',
      uploadedCopy: null,
      practiceLicenseNumber: '',
      licenseValidity: '',
      licenseCopy: null
    }],
    
    // Language Skills
    languageSkills: [{
      language: '',
      speak: LanguageProficiency.LOW,
      read: LanguageProficiency.LOW,
      write: LanguageProficiency.LOW
    }],
    
    // Resources and Infrastructure
    resourceInfra: {
      numberOfPartners: 0,
      numberOfProfessionalStaff: 0,
      numberOfOtherStaff: 0,
      numberOfInternsArticledClerks: 0
    },
    
    // Work Locations
    workLocations: [{ city: '', location: '', pinCode: '' }],
    
    // Open to remote work
    openToRemoteWork: false,
    
    // Billing Details
    billingDetails: [{
      tradeName: '',
      billingAddress: { street: '', city: '', state: '', pinCode: '' },
      gstState: '',
      gstRegistrationNumber: '',
      gstCopy: null,
      panNumber: '',
      panCopy: null,
      tanNumber: '',
      tanCopy: null,
      isDefault: true
    }],
    
    // Banking Details
    bankingDetails: [{
      beneficiaryName: '',
      accountType: '',
      accountNumber: '',
      confirmAccountNumber: '',
      ifscCode: '',
      isDefault: true
    }],
    
    // Services Offered
    servicesOffered: [{
      category: '',
      level: '',
      sector: '',
      industry: '',
      services: [],
      hashtags: []
    }]
  });

  const sections = [
    { id: 'basic', title: 'Basic Info', icon: User, required: true },
    { id: 'identity', title: 'Identity', icon: FileText, required: true },
    { id: 'address', title: 'Address', icon: MapPin, required: true },
    { id: 'qualifications', title: 'Qualifications', icon: Award, required: false },
    { id: 'memberships', title: 'Memberships', icon: Users, required: false },
    { id: 'services', title: 'Services', icon: Briefcase, required: true }
  ];

  const languages = ['English', 'Hindi', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi'];
  const serviceCategories = ['Legal Consultation', 'Document Drafting', 'Court Representation', 'Corporate Law', 'Family Law', 'Criminal Law', 'Property Law', 'Tax Law'];
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'];

  const calculateCompletion = () => {
    const mandatoryFields = [
      formData.name,
      formData.email,
      formData.contactNumber,
      formData.identityDocument.type,
      formData.identityDocument.number,
      formData.address.street,
      formData.address.city,
      formData.address.pinCode,
      formData.servicesOffered.serviceLevel,
      formData.servicesOffered.categories.length > 0 ? 'yes' : '',
      formData.bankingDetails.beneficiaryName,
      formData.bankingDetails.accountNumber,
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
      return prev;
    });
  };

  const addQualification = () => {
    setFormData(prev => ({
      ...prev,
      qualifications: [...prev.qualifications, { degree: '', institution: '', year: '', certificate: null }]
    }));
  };

  const removeQualification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index)
    }));
  };

  const updateQualification = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.map((qual, i) => 
        i === index ? { ...qual, [field]: value } : qual
      )
    }));
  };

  const addMembership = () => {
    setFormData(prev => ({
      ...prev,
      memberships: [...prev.memberships, { organization: '', membershipNumber: '', validTill: '', certificate: null }]
    }));
  };

  const removeMembership = (index: number) => {
    setFormData(prev => ({
      ...prev,
      memberships: prev.memberships.filter((_, i) => i !== index)
    }));
  };

  const updateMembership = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      memberships: prev.memberships.map((mem, i) => 
        i === index ? { ...mem, [field]: value } : mem
      )
    }));
  };

  const toggleLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languageSkills: prev.languageSkills.includes(language)
        ? prev.languageSkills.filter(l => l !== language)
        : [...prev.languageSkills, language]
    }));
  };

  const toggleWorkLocation = (location: string) => {
    setFormData(prev => ({
      ...prev,
      workLocations: prev.workLocations.includes(location)
        ? prev.workLocations.filter(l => l !== location)
        : [...prev.workLocations, location]
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
      toast.success('Service provider profile saved successfully!');
      onComplete();
    } catch (error) {
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0: // Basic Info
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Enter your full name" required />
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
          </div>
        );

      case 1: // Identity
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>ID Type *</Label>
                <Select value={formData.identityDocument.type} onValueChange={(value) => handleInputChange('identityDocument.type', value)}>
                  <SelectTrigger><SelectValue placeholder="Select ID type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={IdentityDocumentType.PAN}>PAN</SelectItem>
                    <SelectItem value={IdentityDocumentType.AADHAR}>Aadhar</SelectItem>
                    <SelectItem value={IdentityDocumentType.PASSPORT}>Passport</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>ID Number *</Label>
                <Input value={formData.identityDocument.number} onChange={(e) => handleInputChange('identityDocument.number', e.target.value)} placeholder="Enter ID number" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Upload ID Proof *</Label>
              <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleInputChange('identityDocument.proof', e.target.files?.[0] || null)} className="cursor-pointer" required />
            </div>
          </div>
        );

      case 2: // Address
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Street Address *</Label>
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

      case 3: // Qualifications
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Educational Qualifications</h3>
              <Button type="button" variant="outline" size="sm" onClick={addQualification}>
                <Plus className="h-4 w-4 mr-2" />Add Qualification
              </Button>
            </div>
            {formData.qualifications.map((qual, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Qualification {index + 1}</h4>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeQualification(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Degree/Course</Label>
                    <Input value={qual.degree} onChange={(e) => updateQualification(index, 'degree', e.target.value)} placeholder="e.g., LLB" />
                  </div>
                  <div className="space-y-2">
                    <Label>Institution</Label>
                    <Input value={qual.institution} onChange={(e) => updateQualification(index, 'institution', e.target.value)} placeholder="Institution name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Input value={qual.year} onChange={(e) => updateQualification(index, 'year', e.target.value)} placeholder="2020" />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Label>Certificate</Label>
                  <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => updateQualification(index, 'certificate', e.target.files?.[0] || null)} className="cursor-pointer" />
                </div>
              </Card>
            ))}
          </div>
        );

      case 4: // Memberships
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Professional Memberships</h3>
              <Button type="button" variant="outline" size="sm" onClick={addMembership}>
                <Plus className="h-4 w-4 mr-2" />Add Membership
              </Button>
            </div>
            {formData.memberships.map((mem, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Membership {index + 1}</h4>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeMembership(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Organization</Label>
                    <Input value={mem.organization} onChange={(e) => updateMembership(index, 'organization', e.target.value)} placeholder="e.g., Bar Council" />
                  </div>
                  <div className="space-y-2">
                    <Label>Membership Number</Label>
                    <Input value={mem.membershipNumber} onChange={(e) => updateMembership(index, 'membershipNumber', e.target.value)} placeholder="Member ID" />
                  </div>
                  <div className="space-y-2">
                    <Label>Valid Till</Label>
                    <Input type="date" value={mem.validTill} onChange={(e) => updateMembership(index, 'validTill', e.target.value)} />
                  </div>
                </div>
              </Card>
            ))}

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Language Skills</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {languages.map((language) => (
                  <div key={language} className="flex items-center space-x-2">
                    <Checkbox
                      id={`lang-${language}`}
                      checked={formData.languageSkills.includes(language)}
                      onCheckedChange={() => toggleLanguage(language)}
                    />
                    <Label htmlFor={`lang-${language}`} className="text-sm">{language}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Work Locations</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {cities.map((city) => (
                  <div key={city} className="flex items-center space-x-2">
                    <Checkbox
                      id={`city-${city}`}
                      checked={formData.workLocations.includes(city)}
                      onCheckedChange={() => toggleWorkLocation(city)}
                    />
                    <Label htmlFor={`city-${city}`} className="text-sm">{city}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 5: // Services
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
                placeholder="Describe your services and expertise..."
                rows={4}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Banking Details</h3>
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
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Account Type *</Label>
                  <Select value={formData.bankingDetails.accountType} onValueChange={(value) => handleInputChange('bankingDetails.accountType', value)}>
                    <SelectTrigger><SelectValue placeholder="Account type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value={AccountType.SAVINGS}>Savings</SelectItem>
                      <SelectItem value={AccountType.CURRENT}>Current</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>IFSC Code *</Label>
                  <Input value={formData.bankingDetails.ifscCode} onChange={(e) => handleInputChange('bankingDetails.ifscCode', e.target.value)} placeholder="IFSC code" required />
                </div>
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
                <User className="h-5 w-5 text-purple-600" />
                Service Provider Individual Profile
              </CardTitle>
              <CardDescription>Complete your professional profile to start offering services</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">{completionPercentage}%</div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>
          <Progress value={completionPercentage} className="mt-4" />
        </CardHeader>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
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
            Excellent! Complete your profile to get your permanent registration number and start receiving service requests.
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
