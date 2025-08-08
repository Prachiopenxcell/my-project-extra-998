import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import StaticPageLayout from '@/components/layouts/StaticPageLayout';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Send,
  Building2,
  Users,
  MessageSquare,
  Globe,
  Shield,
  Video,
  Vote,
  FileText,
  Scale,
  FolderOpen,
  UserCheck,
  BookOpen,
  Settings
} from 'lucide-react';

const contactInfo = [
  {
    icon: Building2,
    title: 'Head Office',
    details: [
      '998-P Platform Headquarters',
      '123 Business District',
      'Tech City, TC 12345',
      'United States'
    ]
  },
  {
    icon: Phone,
    title: 'Phone Support',
    details: [
      'General Inquiries: +1 (555) 123-4567',
      'Technical Support: +1 (555) 123-4568',
      'Sales: +1 (555) 123-4569',
      'Emergency: +1 (555) 123-4570'
    ]
  },
  {
    icon: Mail,
    title: 'Email Support',
    details: [
      'General: info@998p.com',
      'Support: support@998p.com',
      'Sales: sales@998p.com',
      'Legal: legal@998p.com'
    ]
  },
  {
    icon: Clock,
    title: 'Business Hours',
    details: [
      'Monday - Friday: 9:00 AM - 6:00 PM',
      'Saturday: 10:00 AM - 4:00 PM',
      'Sunday: Closed',
      'Emergency Support: 24/7'
    ]
  }
];

const supportHours = [
  { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM EST' },
  { day: 'Saturday', hours: '10:00 AM - 4:00 PM EST' },
  { day: 'Sunday', hours: 'Emergency Support Only' },
  { day: 'Holidays', hours: 'Limited Support Available' }
];

const platformFeatures = [
  {
    icon: Building2,
    title: 'Entity Management',
    description: 'Comprehensive entity lifecycle management with automated compliance tracking and regulatory oversight.'
  },
  {
    icon: Video,
    title: 'Meeting Management',
    description: 'Streamlined meeting coordination with integrated voting, documentation, and participant management.'
  },
  {
    icon: Vote,
    title: 'E-Voting System',
    description: 'Secure digital voting platform with real-time results and comprehensive audit trails.'
  },
  {
    icon: FileText,
    title: 'Claims Management',
    description: 'End-to-end claims processing with AI-powered verification and automated workflows.'
  },
  {
    icon: UserCheck,
    title: 'Resolution System',
    description: 'Comprehensive resolution planning and execution with stakeholder coordination.'
  },
  {
    icon: Scale,
    title: 'Litigation Support',
    description: 'Complete litigation lifecycle management with document handling and case tracking.'
  },
  {
    icon: FolderOpen,
    title: 'Virtual Data Room',
    description: 'Secure document sharing and collaboration platform with granular access controls.'
  },
  {
    icon: Users,
    title: 'AR & Facilitators',
    description: 'Administrator and facilitator selection with transparent evaluation processes.'
  },
  {
    icon: Clock,
    title: 'Timeline Management',
    description: 'Comprehensive timeline tracking and milestone management for all processes.'
  },
  {
    icon: BookOpen,
    title: 'Regulatory Compliance',
    description: 'Complete regulatory compliance management with automated monitoring and reporting.'
  },
  
];

const userTypes = [
  'Individual/Partner',
  'Entity/Organization Admin',
  'Team Member',
  'Service Provider - Individual',
  'Service Provider - Entity',
  'Prospective User',
  'Other'
];

export default function ContactUs() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    userName: '',
    userType: '',
    contactNumber: '',
    emailId: '',
    message: '',
    captcha: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaQuestion] = useState(() => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return { question: `${num1} + ${num2}`, answer: num1 + num2 };
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate captcha
    if (parseInt(formData.captcha) !== captchaQuestion.answer) {
      toast({
        title: "Captcha Error",
        description: "Please solve the math problem correctly.",
        variant: "destructive"
      });
      return;
    }

    // Validate required fields
    if (!formData.userName || !formData.userType || !formData.contactNumber || !formData.emailId || !formData.message) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call - in real app, this would submit to backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, this would be sent to admin panel
      console.log('Contact form submission:', {
        ...formData,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      });
      
      toast({
        title: "Message Sent Successfully",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });
      
      // Reset form
      setFormData({
        userName: '',
        userType: '',
        contactNumber: '',
        emailId: '',
        message: '',
        captcha: ''
      });
      
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StaticPageLayout 
      showHero={true}
      heroIcon={Mail}
      heroSubtitle="Get In Touch"
      heroTitle="Contact Us"
      heroDescription="Get in touch with our team for support, partnerships, or general inquiries."
      heroGradient="from-slate-600 to-blue-700"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-slate-600" />
                <span>Get in Touch</span>
              </CardTitle>
              <CardDescription>
                We're here to help you with any questions or support you need regarding the 998-P Platform.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Contact Details */}
          {contactInfo.map((info, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-lg">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <info.icon className="h-5 w-5 text-slate-600" />
                  </div>
                  {info.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600">{detail}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Additional Support Options */}
          <Card className="bg-slate-50 border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-slate-600" />
                <span>Additional Support</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Live Chat Support</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Available
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Video Call Support</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  By Appointment
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Screen Sharing</span>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  Enterprise Only
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="h-5 w-5 text-slate-600" />
                <span>Send us a Message</span>
              </CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.userName}
                    onChange={(e) => handleInputChange('userName', e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User Type *
                  </label>
                  <Select value={formData.userType} onValueChange={(value) => handleInputChange('userType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your user type" />
                    </SelectTrigger>
                    <SelectContent>
                      {userTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number *
                  </label>
                  <Input
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email ID *
                  </label>
                  <Input
                    type="email"
                    value={formData.emailId}
                    onChange={(e) => handleInputChange('emailId', e.target.value)}
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Please describe your inquiry or issue in detail..."
                    rows={5}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Captcha: What is {captchaQuestion.question}? *
                  </label>
                  <Input
                    type="number"
                    value={formData.captcha}
                    onChange={(e) => handleInputChange('captcha', e.target.value)}
                    placeholder="Enter the answer"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-slate-700 hover:bg-slate-800"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Privacy Notice</h4>
                  <p className="text-sm text-blue-800">
                    Your information is secure and will only be used to respond to your inquiry. 
                    We do not share your contact details with third parties. 
                    See our <a href="/privacy" className="underline hover:text-blue-900">Privacy Policy</a> for more details.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Platform Features Section */}
      <div className="bg-slate-50 rounded-lg p-8 mt-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Platform Features</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Need help with any of our comprehensive platform features? Our support team is here to assist you.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platformFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow bg-white">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <IconComponent className="h-5 w-5 text-slate-600" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-gray-600 text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            Have questions about any of these features? Contact our support team for detailed assistance.
          </p>
          <Badge variant="secondary" className="bg-slate-200 text-slate-700">
            <MessageSquare className="h-4 w-4 mr-2" />
            All Features Supported 24/7
          </Badge>
        </div>
      </div>
    </StaticPageLayout>
  );
}
