import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Edit, 
  CheckCircle, 
  AlertCircle, 
  Phone, 
  Mail, 
  Building, 
  MapPin,
  Calendar,
  Shield,
  FileText,
  CreditCard
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ProfileSection {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completionPercentage: number;
  icon: any;
  fields: ProfileField[];
}

interface ProfileField {
  name: string;
  value: string | null;
  required: boolean;
  completed: boolean;
}

const ProfileManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileSections, setProfileSections] = useState<ProfileSection[]>([]);
  const [overallCompletion, setOverallCompletion] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, [user]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      // Mock profile data based on user role
      const mockSections: ProfileSection[] = [
        {
          id: 'basic-info',
          title: 'Basic Information',
          description: 'Personal details and contact information',
          completed: true,
          completionPercentage: 100,
          icon: User,
          fields: [
            { name: 'Full Name', value: user?.name || 'John Doe', required: true, completed: true },
            { name: 'Email', value: user?.email || 'john@example.com', required: true, completed: true },
            { name: 'Phone', value: '+91 9876543210', required: true, completed: true },
            { name: 'Date of Birth', value: '1990-01-15', required: false, completed: true }
          ]
        },
        {
          id: 'identity-docs',
          title: 'Identity Documents',
          description: 'Government issued identity proofs',
          completed: false,
          completionPercentage: 60,
          icon: Shield,
          fields: [
            { name: 'PAN Card', value: 'ABCDE1234F', required: true, completed: true },
            { name: 'Aadhar Card', value: '1234 5678 9012', required: true, completed: true },
            { name: 'Passport', value: null, required: false, completed: false },
            { name: 'Driving License', value: null, required: false, completed: false }
          ]
        },
        {
          id: 'address',
          title: 'Address Details',
          description: 'Residential and business address information',
          completed: true,
          completionPercentage: 100,
          icon: MapPin,
          fields: [
            { name: 'Street Address', value: '123 Main Street', required: true, completed: true },
            { name: 'City', value: 'Mumbai', required: true, completed: true },
            { name: 'State', value: 'Maharashtra', required: true, completed: true },
            { name: 'PIN Code', value: '400001', required: true, completed: true }
          ]
        },
        {
          id: 'tax-info',
          title: 'Tax Information',
          description: 'Tax registration and compliance details',
          completed: false,
          completionPercentage: 33,
          icon: FileText,
          fields: [
            { name: 'PAN Number', value: 'ABCDE1234F', required: true, completed: true },
            { name: 'GST Number', value: null, required: false, completed: false },
            { name: 'TAN Number', value: null, required: false, completed: false }
          ]
        },
        {
          id: 'banking',
          title: 'Banking Details',
          description: 'Bank account information for transactions',
          completed: false,
          completionPercentage: 50,
          icon: CreditCard,
          fields: [
            { name: 'Bank Name', value: 'HDFC Bank', required: true, completed: true },
            { name: 'Account Number', value: '1234567890', required: true, completed: true },
            { name: 'IFSC Code', value: null, required: true, completed: false },
            { name: 'Branch Name', value: null, required: false, completed: false }
          ]
        }
      ];

      // Add organization-specific sections for admin users
      if (user?.role?.includes('ENTITY_ADMIN')) {
        mockSections.push({
          id: 'organization',
          title: 'Organization Details',
          description: 'Company or entity information',
          completed: false,
          completionPercentage: 70,
          icon: Building,
          fields: [
            { name: 'Organization Name', value: 'ABC Corporation', required: true, completed: true },
            { name: 'Registration Number', value: 'CIN123456789', required: true, completed: true },
            { name: 'Industry Type', value: 'Technology', required: true, completed: true },
            { name: 'Website', value: null, required: false, completed: false }
          ]
        });
      }

      setProfileSections(mockSections);
      
      // Calculate overall completion
      const totalFields = mockSections.reduce((acc, section) => acc + section.fields.filter(f => f.required).length, 0);
      const completedFields = mockSections.reduce((acc, section) => 
        acc + section.fields.filter(f => f.required && f.completed).length, 0);
      const completion = Math.round((completedFields / totalFields) * 100);
      setOverallCompletion(completion);

    } catch (error) {
      console.error('Failed to load profile data:', error);
      toast({
        title: "Error",
        description: "Failed to load profile information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  const handleCompleteProfile = () => {
    navigate('/profile');
  };

  const getStatusBadge = (completed: boolean, percentage: number) => {
    if (completed) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Complete</Badge>;
    } else if (percentage >= 50) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
    } else {
      return <Badge variant="destructive" className="bg-red-100 text-red-800">Incomplete</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Overview Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Profile Overview
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Complete your profile to access all platform features
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{overallCompletion}%</div>
              <p className="text-sm text-muted-foreground">Complete</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">{overallCompletion}%</span>
              </div>
              <Progress value={overallCompletion} className="h-2" />
            </div>
            
            <div className="flex gap-3">
              <Button onClick={handleEditProfile} className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
              {overallCompletion < 100 && (
                <Button variant="outline" onClick={handleCompleteProfile}>
                  Complete Profile
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profileSections.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <section.icon className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </div>
                {getStatusBadge(section.completed, section.completionPercentage)}
              </div>
              <p className="text-sm text-muted-foreground">{section.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Completion</span>
                  <span className="text-sm text-muted-foreground">{section.completionPercentage}%</span>
                </div>
                <Progress value={section.completionPercentage} className="h-1.5" />
                
                <div className="space-y-2 mt-4">
                  {section.fields.map((field, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {field.completed ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                        )}
                        <span className={field.required ? 'font-medium' : 'text-muted-foreground'}>
                          {field.name}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </span>
                      </div>
                      <span className="text-muted-foreground truncate max-w-32">
                        {field.value || 'Not provided'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Profile Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Common profile management tasks
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" onClick={handleEditProfile} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
            <Button variant="outline" onClick={() => navigate('/profile')} className="flex items-center gap-2">
              <User className="h-4 w-4" />
              View Full Profile
            </Button>
            <Button variant="outline" onClick={() => toast({ title: "Feature Coming Soon", description: "Profile export will be available soon" })} className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Export Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileManagement;
