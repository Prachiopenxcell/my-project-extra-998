import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StaticPageLayout from '@/components/layouts/StaticPageLayout';
import { 
  Play,
  PlayCircle,
  Users,
  Building2,
  ArrowRight,
  CheckCircle,
  UserPlus,
  Settings,
  FileText,
  Video,
  Vote,
  Scale,
  FolderOpen,
  Shield,
  BarChart3,
  Clock,
  Zap,
  Globe,
  Award
} from 'lucide-react';

const userJourneys = [
  {
    id: 'service-seeker',
    title: 'Service Seeker Journey',
    icon: Users,
    description: 'How individuals and organizations find and engage professional services',
    steps: [
      {
        step: 1,
        title: 'Register & Setup Profile',
        description: 'Create your account, verify your identity, and complete your organization profile with necessary documentation.',
        duration: '5-10 minutes',
        features: ['Identity Verification', 'Document Upload', 'Profile Completion']
      },
      {
        step: 2,
        title: 'Discover Service Providers',
        description: 'Browse our verified network of professional service providers, filter by expertise, location, and ratings.',
        duration: '10-15 minutes',
        features: ['Provider Directory', 'Advanced Filters', 'Reviews & Ratings']
      },
      {
        step: 3,
        title: 'Engage & Collaborate',
        description: 'Send engagement requests, manage projects, and collaborate through integrated tools and workflows.',
        duration: 'Ongoing',
        features: ['Project Management', 'Communication Tools', 'Document Sharing']
      },
      {
        step: 4,
        title: 'Track & Monitor',
        description: 'Monitor progress, track compliance, and access comprehensive reporting and analytics.',
        duration: 'Ongoing',
        features: ['Progress Tracking', 'Compliance Monitoring', 'Analytics Dashboard']
      }
    ]
  },
  {
    id: 'service-provider',
    title: 'Service Provider Journey',
    icon: Building2,
    description: 'How professionals and firms deliver services through our platform',
    steps: [
      {
        step: 1,
        title: 'Professional Onboarding',
        description: 'Complete verification process, upload credentials, and set up your professional profile and service offerings.',
        duration: '15-30 minutes',
        features: ['Credential Verification', 'Service Configuration', 'Rate Setting']
      },
      {
        step: 2,
        title: 'Client Acquisition',
        description: 'Receive engagement requests, respond to RFPs, and build your client portfolio through our marketplace.',
        duration: 'Ongoing',
        features: ['Lead Management', 'Proposal Tools', 'Client Matching']
      },
      {
        step: 3,
        title: 'Service Delivery',
        description: 'Deliver services using integrated tools, manage client relationships, and ensure compliance.',
        duration: 'Project-based',
        features: ['Project Tools', 'Client Portal', 'Compliance Tracking']
      },
      {
        step: 4,
        title: 'Growth & Analytics',
        description: 'Analyze performance, expand services, and grow your practice with data-driven insights.',
        duration: 'Ongoing',
        features: ['Performance Analytics', 'Business Intelligence', 'Growth Tools']
      }
    ]
  }
];

const modules = [
  {
    id: 'entity-management',
    name: 'Entity Management',
    icon: Building2,
    description: 'Comprehensive entity lifecycle management',
    videoId: 'entity-demo',
    features: ['Entity Registration', 'Compliance Tracking', 'Document Management', 'Reporting']
  },
  {
    id: 'meeting-management',
    name: 'Meeting Management',
    icon: Video,
    description: 'Streamlined meeting coordination and documentation',
    videoId: 'meeting-demo',
    features: ['Virtual Meetings', 'Agenda Management', 'Minutes Recording', 'Participant Tracking']
  },
  {
    id: 'e-voting',
    name: 'E-Voting System',
    icon: Vote,
    description: 'Secure digital voting with audit trails',
    videoId: 'voting-demo',
    features: ['Secure Voting', 'Real-time Results', 'Audit Trails', 'Multi-format Support']
  },
  {
    id: 'claims-management',
    name: 'Claims Management',
    icon: FileText,
    description: 'AI-powered claims processing and verification',
    videoId: 'claims-demo',
    features: ['Claims Submission', 'AI Verification', 'Multi-currency', 'Automated Workflows']
  },
  {
    id: 'litigation-management',
    name: 'Litigation Management',
    icon: Scale,
    description: 'Complete litigation lifecycle management',
    videoId: 'litigation-demo',
    features: ['Case Management', 'Document Repository', 'Timeline Tracking', 'Billing']
  },
  {
    id: 'vdr',
    name: 'Virtual Data Room',
    icon: FolderOpen,
    description: 'Secure document sharing and collaboration',
    videoId: 'vdr-demo',
    features: ['Secure Sharing', 'Access Controls', 'Activity Tracking', 'Version Management']
  },
  {
    id: 'timeline-management',
    name: 'Timeline Management',
    icon: Clock,
    description: 'Comprehensive timeline tracking and milestone management',
    videoId: 'timeline-demo',
    features: ['Event Tracking', 'Milestone Management', 'Activity Logging', 'Progress Monitoring']
  },
  {
    id: 'regulatory-compliance',
    name: 'Regulatory Compliance',
    icon: Shield,
    description: 'Complete regulatory compliance management',
    videoId: 'compliance-demo',
    features: ['Compliance Tracking', 'Regulatory Updates', 'Automated Reporting', 'Risk Assessment']
  }
];

const benefits = [
  {
    icon: Zap,
    title: 'Increased Efficiency',
    description: 'Automate routine tasks and streamline workflows to save up to 40% of administrative time.',
    stats: '40% Time Saved'
  },
  {
    icon: Shield,
    title: 'Enhanced Security',
    description: 'Enterprise-grade security with end-to-end encryption and comprehensive audit trails.',
    stats: '99.9% Uptime'
  },
  {
    icon: Globe,
    title: 'Global Compliance',
    description: 'Stay compliant across multiple jurisdictions with automated monitoring and updates.',
    stats: '25+ Countries'
  },
  {
    icon: Award,
    title: 'Proven Results',
    description: 'Join 500+ organizations that have transformed their operations with our platform.',
    stats: '500+ Clients'
  }
];

export default function HowItWorks() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [activeUserType, setActiveUserType] = useState('service-seeker');

  const playVideo = (videoId: string) => {
    // In a real implementation, this would open a video modal or navigate to video
    console.log(`Playing video: ${videoId}`);
    alert(`Playing demo video for ${videoId}. In a real implementation, this would open the video player.`);
  };

  return (
    <StaticPageLayout 
      showHero={true}
      heroIcon={PlayCircle}
      heroSubtitle="Platform Guide"
      heroTitle="How It Works"
      heroDescription="Discover how the 998-P Platform streamlines professional services for organizations of all sizes."
      heroGradient="from-slate-600 to-gray-700"
    >
      <div className="space-y-12">
        {/* Platform Overview */}
        <section className="text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4 bg-slate-100 text-slate-700">
              <Globe className="h-4 w-4 mr-2" />
              Comprehensive Professional Services Platform
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Streamlining Professional Services for the Digital Age
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              The 998-P Platform connects service seekers with professional service providers through 
              an integrated suite of tools designed for efficiency, compliance, and collaboration.
            </p>
            <Button size="lg" className="bg-slate-700 hover:bg-slate-800" onClick={() => playVideo('platform-overview')}>
              <Play className="h-5 w-5 mr-2" />
              Watch Platform Overview
            </Button>
          </div>
        </section>

        {/* User Journey Tabs */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">User Journeys</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Understand how different user types navigate and benefit from our platform.
            </p>
          </div>

          <Tabs value={activeUserType} onValueChange={setActiveUserType} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              {userJourneys.map(journey => (
                <TabsTrigger key={journey.id} value={journey.id} className="flex items-center space-x-2">
                  <journey.icon className="h-4 w-4" />
                  <span>{journey.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {userJourneys.map(journey => (
              <TabsContent key={journey.id} value={journey.id}>
                <Card className="mb-6">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-slate-100 rounded-full w-fit">
                      <journey.icon className="h-8 w-8 text-slate-600" />
                    </div>
                    <CardTitle className="text-2xl">{journey.title}</CardTitle>
                    <CardDescription className="text-lg">{journey.description}</CardDescription>
                  </CardHeader>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {journey.steps.map((step, index) => (
                    <Card key={step.step} className="relative">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-8 h-8 bg-slate-700 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {step.step}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {step.duration}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                        <CardDescription>{step.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm text-gray-900">Key Features:</h4>
                          <ul className="space-y-1">
                            {step.features.map(feature => (
                              <li key={feature} className="flex items-center space-x-2 text-sm text-gray-600">
                                <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                      {index < journey.steps.length - 1 && (
                        <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2">
                          <ArrowRight className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        {/* Module Demonstrations */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Modules in Action</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our comprehensive suite of modules with interactive demonstrations and video tutorials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map(module => (
              <Card key={module.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <module.icon className="h-6 w-6 text-slate-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{module.name}</CardTitle>
                      <CardDescription>{module.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {module.features.map(feature => (
                      <li key={feature} className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full bg-slate-700 hover:bg-slate-800"
                    onClick={() => playVideo(module.videoId)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Watch Demo
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-slate-50 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Organizations Choose Our Platform</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Measurable benefits that transform how professional services organizations operate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-white rounded-full w-fit">
                    <benefit.icon className="h-8 w-8 text-slate-600" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  <div className="text-2xl font-bold text-slate-700 mt-2">{benefit.stats}</div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Implementation Process */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Implementation Process</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our proven implementation methodology ensures smooth onboarding and rapid value realization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  1
                </div>
                <CardTitle>Discovery & Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Requirements Assessment</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Solution Design</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Implementation Roadmap</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Timeline & Milestones</span>
                  </li>
                </ul>
                <div className="mt-4 text-center">
                  <Badge variant="outline">1-2 Weeks</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  2
                </div>
                <CardTitle>Configuration & Setup</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Platform Configuration</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Data Migration</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Integration Setup</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Testing & Validation</span>
                  </li>
                </ul>
                <div className="mt-4 text-center">
                  <Badge variant="outline">2-4 Weeks</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  3
                </div>
                <CardTitle>Training & Go-Live</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>User Training Sessions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Documentation & Resources</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Phased Rollout</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Ongoing Support</span>
                  </li>
                </ul>
                <div className="mt-4 text-center">
                  <Badge variant="outline">1-2 Weeks</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-slate-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Organization?
          </h3>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Join hundreds of organizations who have streamlined their operations and improved compliance with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-slate-700 hover:bg-slate-800">
              <Play className="h-5 w-5 mr-2" />
              Watch Full Demo
            </Button>
            <Button size="lg" variant="outline">
              Schedule Consultation
            </Button>
            <Button size="lg" variant="outline">
              Start Free Trial
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            14-day free trial • No credit card required • Full feature access
          </p>
        </section>
      </div>
    </StaticPageLayout>
  );
}
