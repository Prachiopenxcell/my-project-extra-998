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
import { toast } from 'sonner';
import { User, FileText, MapPin, Briefcase, Save, Clock, CheckCircle } from 'lucide-react';
import { PersonType, IdentityDocumentType, ServiceLevel } from '@/types/profile';
import { ProfileService } from '@/services/profileService';
import { useAuth } from '@/contexts/AuthContext';

interface ServiceProviderTeamMemberFormProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const ServiceProviderTeamMemberForm: React.FC<ServiceProviderTeamMemberFormProps> = ({
  onComplete,
  onSkip
}) => {
  const { user } = useAuth();
  const [currentSection, setCurrentSection] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic details
    personType: '',
    name: user ? `${user.firstName} ${user.lastName}`.trim() : '',
    email: user?.email || '',
    contactNumber: '',
    
    // Identity verification
    identityDocument: {
      type: '',
      number: '',
      proof: null as File | null
    },
    
    // Address
    address: {
      street: '',
      city: '',
      state: '',
      pinCode: ''
    },
    
    // Basic service info (simplified for team members)
    servicesOffered: {
      serviceLevel: '',
      categories: [] as string[],
      description: ''
    }
  });

  const sections = [
    { id: 'basic', title: 'Basic Details', icon: User, required: true },
    { id: 'identity', title: 'Identity', icon: FileText, required: true },
    { id: 'address', title: 'Address', icon: MapPin, required: true },
    { id: 'services', title: 'Services', icon: Briefcase, required: false }
  ];

  const serviceCategories = ['Legal Consultation', 'Document Drafting', 'Court Representation', 'Corporate Law', 'Family Law', 'Criminal Law', 'Property Law', 'Tax Law'];

  const calculateCompletion = () => {
    const mandatoryFields = [
      formData.name,
      formData.email,
      formData.contactNumber,
      formData.identityDocument.type,
      formData.identityDocument.number,
      formData.address.street,
      formData.address.city,
      formData.address.state,
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
        const parentKey = keys[0] as keyof typeof prev;
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

  const handleFileUpload = (field: string, file: File | null) => {
    handleInputChange(field, file);
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
      const profileData: TeamMemberProfile & { userId: string; completionPercentage: number; isCompleted: boolean; lastUpdated: Date } = {
        userId: user.id,
        name: formData.name,
        identityDocument: {
          type: formData.identityDocument.type as any,
          number: formData.identityDocument.number,
          uploadedFile: formData.identityDocument.proof
        },
        email: formData.email,
        contactNumber: formData.contactNumber,
        address: formData.address,
        completionPercentage: calculateCompletion(),
        isCompleted: calculateCompletion() === 100,
        lastUpdated: new Date()
      };

      await ProfileService.saveProfile(profileData as any);
      
      toast.success('Service provider team member profile saved successfully!');
      onComplete();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0: // Basic Details
        return (
          <div className="space-y-6">
            <Alert>
              <User className="h-4 w-4" />
              <AlertDescription>
                As a service provider team member, complete your profile to assist with service delivery.
              </AlertDescription>
            </Alert>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
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

      case 1: // Identity Verification
        return (
          <div className="space-y-6">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                Identity verification is required for all service provider team members.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="identityDocumentType">Identity Document Type *</Label>
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
                    <SelectItem value={IdentityDocumentType.DRIVING_LICENSE}>Driving License</SelectItem>
                    <SelectItem value={IdentityDocumentType.VOTER_ID}>Voter ID</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="identityNumber">Identity Document Number *</Label>
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
              <Label htmlFor="identityProof">Upload Identity Proof *</Label>
              <Input
                id="identityProof"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload('identityDocument.proof', e.target.files?.[0] || null)}
                className="cursor-pointer"
                required
              />
              <p className="text-sm text-muted-foreground">
                Accepted formats: PDF, JPG, JPEG, PNG (Max 5MB)
              </p>
            </div>

            {formData.identityDocument.proof && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Document uploaded: {formData.identityDocument.proof.name}
                </AlertDescription>
              </Alert>
            )}
          </div>
        );

      case 2: // Address
        return (
          <div className="space-y-6">
            <Alert>
              <MapPin className="h-4 w-4" />
              <AlertDescription>
                Your address information is required for communication and service coordination.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="street">Street Address *</Label>
              <Textarea
                id="street"
                value={formData.address.street}
                onChange={(e) => handleInputChange('address.street', e.target.value)}
                placeholder="Enter your complete street address"
                required
                rows={3}
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
        );

      case 3: // Services (Optional)
        return (
          <div className="space-y-6">
            <Alert>
              <Briefcase className="h-4 w-4" />
              <AlertDescription>
                Optional: Specify your service areas to help with task assignments.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="serviceLevel">Experience Level</Label>
              <Select 
                value={formData.servicesOffered.serviceLevel} 
                onValueChange={(value) => handleInputChange('servicesOffered.serviceLevel', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ServiceLevel.ENTRANT}>Entrant (0-3 years)</SelectItem>
                  <SelectItem value={ServiceLevel.EXPERIENCED}>Experienced (3-15 years)</SelectItem>
                  <SelectItem value={ServiceLevel.EXPERT}>Expert (15+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Areas of Interest</h3>
              <p className="text-sm text-muted-foreground">
                Select the service areas you're interested in or have experience with.
              </p>
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
              <Label htmlFor="serviceDescription">Additional Notes</Label>
              <Textarea
                id="serviceDescription"
                value={formData.servicesOffered.description}
                onChange={(e) => handleInputChange('servicesOffered.description', e.target.value)}
                placeholder="Any additional information about your skills or interests..."
                rows={3}
              />
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
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-600" />
                Service Provider Team Member Profile
              </CardTitle>
              <CardDescription>
                Complete your profile to assist with service delivery
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-600">{completionPercentage}%</div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>
          <Progress value={completionPercentage} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Section Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
        </CardHeader>
        <CardContent>
          {renderCurrentSection()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
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
                  Complete Profile
                </>
              )}
            </Button>
          )}
        </div>
        
        <Button variant="outline" onClick={onSkip}>
          Skip for Now
        </Button>
      </div>

      {/* Completion Status */}
      {calculateCompletion() === 100 ? (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Excellent! Your profile is complete. You can now assist with service delivery and access team features.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <AlertDescription>
            Complete all required sections to unlock full platform access and get your permanent registration number.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
