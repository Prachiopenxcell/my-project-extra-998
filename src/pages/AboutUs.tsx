import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ImageWithPlaceholder } from '@/components/ui/image-placeholder';
import StaticPageLayout from '@/components/layouts/StaticPageLayout';
import { 
  Shield, 
  Users, 
  Target, 
  Award,
  Globe,
  TrendingUp,
  Heart,
  Lightbulb,
  CheckCircle,
  Building2,
  Calendar,
  MapPin,
  FileText,
  Video,
  Vote,
  Scale,
  FolderOpen,
  UserCheck,
  Clock,
  BookOpen,
  Settings
} from 'lucide-react';

const founders = [
  {
    name: 'Dr. Sarah Mitchell',
    role: 'CEO & Co-Founder',
    background: 'Former Partner at Global Legal Solutions with 15+ years in corporate law and compliance',
    image: 'https://via.placeholder.com/150x150/3b82f6/ffffff?text=SM',
    expertise: ['Corporate Law', 'Regulatory Compliance', 'Digital Transformation']
  },
  {
    name: 'Michael Chen',
    role: 'CTO & Co-Founder',
    background: 'Ex-Google Senior Engineer with expertise in AI, blockchain, and enterprise software',
    image: 'https://via.placeholder.com/150x150/3b82f6/ffffff?text=SM',
    expertise: ['AI/ML', 'Blockchain Technology', 'Enterprise Architecture']
  },
  {
    name: 'David Rodriguez',
    role: 'COO & Co-Founder',
    background: 'Former McKinsey Principal specializing in professional services and operational excellence',
    image: 'https://via.placeholder.com/150x150/3b82f6/ffffff?text=SM',
    expertise: ['Operations Strategy', 'Process Optimization', 'Business Development']
  }
];

const milestones = [
  {
    year: '2019',
    title: 'Company Founded',
    description: 'Three industry veterans came together with a vision to revolutionize professional services through technology.'
  },
  {
    year: '2020',
    title: 'MVP Launch',
    description: 'Released our first minimum viable product focusing on entity management and compliance tracking.'
  },
  {
    year: '2021',
    title: 'Series A Funding',
    description: 'Raised $15M in Series A funding to expand our platform capabilities and team.'
  },
  {
    year: '2022',
    title: 'AI Integration',
    description: 'Launched AI-powered features for claims processing and compliance monitoring.'
  },
  {
    year: '2023',
    title: 'Global Expansion',
    description: 'Expanded to serve clients across 25+ countries with multi-jurisdiction support.'
  },
  {
    year: '2024',
    title: '500+ Organizations',
    description: 'Reached milestone of serving over 500 organizations worldwide with 99.9% uptime.'
  }
];

const values = [
  {
    icon: Shield,
    title: 'Trust & Security',
    description: 'We prioritize the security and confidentiality of our clients\' data above all else, implementing enterprise-grade security measures.'
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We continuously innovate to stay ahead of industry needs, leveraging cutting-edge technology to solve complex challenges.'
  },
  {
    icon: Users,
    title: 'Client-Centric',
    description: 'Our clients\' success is our success. We build features and solutions based on real user needs and feedback.'
  },
  {
    icon: Heart,
    title: 'Integrity',
    description: 'We operate with the highest ethical standards, transparency, and accountability in everything we do.'
  }
];

const stats = [
  { value: '500+', label: 'Organizations Served' },
  { value: '25+', label: 'Countries' },
  { value: '99.9%', label: 'Uptime' },
  { value: '50+', label: 'Team Members' }
];

const platformFeatures = [
  {
    icon: Building2,
    title: 'Entity Management',
    description: 'Comprehensive entity lifecycle management with automated compliance tracking and regulatory oversight.',
    features: ['Entity Registration', 'Compliance Monitoring', 'Document Management', 'Reporting']
  },
  {
    icon: Video,
    title: 'Meeting Management',
    description: 'Streamlined meeting coordination with integrated voting, documentation, and participant management.',
    features: ['Virtual Meetings', 'Agenda Management', 'Recording & Minutes', 'Participant Tracking']
  },
  {
    icon: Vote,
    title: 'E-Voting System',
    description: 'Secure digital voting platform with real-time results and comprehensive audit trails.',
    features: ['Secure Voting', 'Real-time Results', 'Audit Trails', 'Multi-format Support']
  },
  {
    icon: FileText,
    title: 'Claims Management',
    description: 'End-to-end claims processing with AI-powered verification and automated workflows.',
    features: ['Claim Submission', 'AI Verification', 'Workflow Automation', 'Status Tracking']
  },
  {
    icon: UserCheck,
    title: 'Resolution System',
    description: 'Comprehensive resolution planning and execution with stakeholder coordination.',
    features: ['EOI Management', 'PRA Evaluation', 'Plan Analysis', 'Stakeholder Coordination']
  },
  {
    icon: Scale,
    title: 'Litigation Support',
    description: 'Complete litigation lifecycle management with document handling and case tracking.',
    features: ['Case Management', 'Document Filing', 'Timeline Tracking', 'Compliance Monitoring']
  },
  {
    icon: FolderOpen,
    title: 'Virtual Data Room',
    description: 'Secure document sharing and collaboration platform with granular access controls.',
    features: ['Secure Storage', 'Access Controls', 'Collaboration Tools', 'Audit Logging']
  },
  {
    icon: Users,
    title: 'AR & Facilitators',
    description: 'Administrator and facilitator selection with transparent evaluation processes.',
    features: ['Selection Process', 'Evaluation Criteria', 'Consent Management', 'Fee Structure']
  },
  {
    icon: Clock,
    title: 'Timeline Management',
    description: 'Comprehensive timeline tracking and milestone management for all processes.',
    features: ['Event Tracking', 'Milestone Management', 'Activity Logging', 'Progress Monitoring']
  },
  {
    icon: BookOpen,
    title: 'Regulatory Compliance',
    description: 'Complete regulatory compliance management with automated monitoring and reporting.',
    features: ['Compliance Tracking', 'Regulatory Updates', 'Automated Reporting', 'Risk Assessment']
  },
  
];

export default function AboutUs() {
  return (
    <StaticPageLayout 
      showHero={true}
      heroIcon={Building2}
      heroSubtitle="Our Story"
      heroTitle="About 998-P Platform"
      heroDescription="Learn about our mission, vision, and the team behind the leading professional services platform."
      heroGradient="from-slate-700 to-slate-800"
    >
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4 bg-slate-100 text-slate-700">
              <Globe className="h-4 w-4 mr-2" />
              Trusted by 500+ Organizations Worldwide
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Empowering Professional Services Through Technology
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Founded in 2019, the 998-P Platform was born from a vision to transform how professional 
              services organizations manage their operations, ensure compliance, and serve their clients 
              in the digital age.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-slate-700">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <span>Our Mission</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                To democratize access to professional services technology by providing comprehensive, 
                secure, and user-friendly solutions that enable organizations of all sizes to operate 
                efficiently, maintain compliance, and focus on what they do best – serving their clients.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <span>Our Vision</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                To become the global standard for professional services technology, creating a world 
                where organizations can seamlessly manage their operations, collaborate effectively, 
                and maintain the highest standards of compliance and transparency.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Our Values */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              These values guide every decision we make and every feature we build.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-slate-100 rounded-full w-fit">
                    <value.icon className="h-8 w-8 text-slate-600" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Founders */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Founders</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our leadership team brings together decades of experience in law, technology, and business operations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {founders.map((founder, index) => (
              <Card key={index}>
                <CardHeader className="text-center">
                  <ImageWithPlaceholder 
                    src={founder.image} 
                    alt={founder.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                    fallbackSrc={`https://via.placeholder.com/96x96/3b82f6/ffffff?text=${founder.name.split(' ').map(n => n[0]).join('')}`}
                  />
                  <CardTitle className="text-xl">{founder.name}</CardTitle>
                  <CardDescription className="text-slate-600 font-medium">
                    {founder.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{founder.background}</p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Expertise:</h4>
                    <div className="flex flex-wrap gap-2">
                      {founder.expertise.map(skill => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Platform Features */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Platform Features</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive suite of professional services tools designed to streamline operations and ensure compliance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {platformFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <IconComponent className="h-6 w-6 text-slate-600" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 text-sm">Key Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {feature.features.map(feat => (
                          <Badge key={feat} variant="secondary" className="text-xs">
                            {feat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Company Journey */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From a small startup to serving 500+ organizations worldwide, here's how we've grown.
            </p>
          </div>
          
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-slate-700 text-white rounded-full flex items-center justify-center font-bold">
                        {milestone.year.slice(-2)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{milestone.title}</h3>
                        <Badge variant="outline" className="text-slate-600">
                          <Calendar className="h-3 w-3 mr-1" />
                          {milestone.year}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-slate-50 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Organizations Choose Us</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're more than just a software provider – we're your trusted partner in digital transformation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Industry Expertise</h4>
                <p className="text-gray-600">Deep understanding of professional services challenges and regulatory requirements.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Proven Track Record</h4>
                <p className="text-gray-600">500+ successful implementations with 99.9% uptime and high client satisfaction.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Continuous Innovation</h4>
                <p className="text-gray-600">Regular updates and new features based on emerging technologies and user feedback.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Global Reach</h4>
                <p className="text-gray-600">Multi-jurisdiction support serving clients across 25+ countries worldwide.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Dedicated Support</h4>
                <p className="text-gray-600">24/7 support with dedicated account managers for enterprise clients.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Security First</h4>
                <p className="text-gray-600">Enterprise-grade security with SOC 2 compliance and regular security audits.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Building2 className="h-6 w-6 text-slate-600" />
                <span>Get in Touch</span>
              </CardTitle>
              <CardDescription>
                Ready to transform your organization? We'd love to hear from you.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Headquarters</h4>
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <MapPin className="h-4 w-4" />
                    <span>San Francisco, CA</span>
                  </div>
                  <p>123 Tech Street, Suite 100<br />San Francisco, CA 94105</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Contact</h4>
                  <p>Phone: +1 (555) 123-4567<br />Email: info@998p.com</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Business Hours</h4>
                  <p>Monday - Friday: 9:00 AM - 6:00 PM PST<br />Emergency Support: 24/7</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button className="bg-slate-700 hover:bg-slate-800">
                  Schedule a Demo
                </Button>
                <Button variant="outline">
                  Contact Sales
                </Button>
                <Button variant="outline">
                  Join Our Team
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </StaticPageLayout>
  );
}
