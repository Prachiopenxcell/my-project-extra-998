import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StaticPageLayout from '@/components/layouts/StaticPageLayout';
import { 
  Check, 
  X, 
  Star,
  Building2,
  Users,
  Video,
  Vote,
  FileText,
  Scale,
  FolderOpen,
  UserCheck,
  Shield,
  BarChart3,
  Zap,
  Crown,
  ArrowRight,
  Clock,
  Settings
} from 'lucide-react';

const modules = [
  {
    id: 'entity-management',
    name: 'Entity Management',
    icon: Building2,
    description: 'Comprehensive entity lifecycle management with automated compliance tracking.',
    features: [
      'Entity Registration & Setup',
      'Compliance Monitoring',
      'Document Management',
      'Regulatory Reporting',
      'Multi-jurisdiction Support',
      'Automated Reminders'
    ],
    basicIncluded: true,
    proIncluded: true,
    enterpriseIncluded: true
  },
  {
    id: 'meeting-management',
    name: 'Meeting Management',
    icon: Video,
    description: 'Streamlined meeting coordination with integrated voting and documentation.',
    features: [
      'Virtual Meeting Platform',
      'Agenda Management',
      'Recording & Minutes',
      'Participant Tracking',
      'Integration with E-Voting',
      'Meeting Analytics'
    ],
    basicIncluded: true,
    proIncluded: true,
    enterpriseIncluded: true
  },
  {
    id: 'e-voting',
    name: 'E-Voting System',
    icon: Vote,
    description: 'Secure digital voting platform with real-time results and audit trails.',
    features: [
      'Secure Digital Voting',
      'Real-time Results',
      'Comprehensive Audit Trails',
      'Multi-format Support',
      'Anonymous Voting Options',
      'Blockchain Verification'
    ],
    basicIncluded: false,
    proIncluded: true,
    enterpriseIncluded: true
  },
  {
    id: 'claims-management',
    name: 'Claims Management',
    icon: FileText,
    description: 'End-to-end claims processing with AI-powered verification.',
    features: [
      'Claims Submission Portal',
      'AI-powered Verification',
      'Multi-currency Support',
      'Automated Workflows',
      'Interest Calculations',
      'Comprehensive Reporting'
    ],
    basicIncluded: false,
    proIncluded: true,
    enterpriseIncluded: true
  },
  {
    id: 'litigation-management',
    name: 'Litigation Management',
    icon: Scale,
    description: 'Complete litigation lifecycle management and case tracking.',
    features: [
      'Case Management',
      'Document Repository',
      'Timeline Tracking',
      'Court Calendar Integration',
      'Billing & Time Tracking',
      'Client Communication'
    ],
    basicIncluded: false,
    proIncluded: false,
    enterpriseIncluded: true
  },
  {
    id: 'vdr',
    name: 'Virtual Data Room',
    icon: FolderOpen,
    description: 'Secure document sharing and collaboration platform.',
    features: [
      'Secure File Sharing',
      'Access Controls',
      'Activity Tracking',
      'Version Management',
      'Watermarking',
      'Advanced Analytics'
    ],
    basicIncluded: false,
    proIncluded: false,
    enterpriseIncluded: true
  },
  {
    id: 'compliance',
    name: 'Regulatory Compliance',
    icon: Shield,
    description: 'Automated compliance monitoring and regulatory reporting.',
    features: [
      'Compliance Dashboard',
      'Automated Monitoring',
      'Regulatory Updates',
      'Risk Assessment',
      'Audit Trail',
      'Custom Workflows'
    ],
    basicIncluded: false,
    proIncluded: true,
    enterpriseIncluded: true
  },
  {
    id: 'ar-facilitators',
    name: 'AR & Facilitators',
    icon: UserCheck,
    description: 'Administrator and facilitator selection with transparent evaluation processes.',
    features: [
      'Selection Process',
      'Evaluation Criteria',
      'Consent Management',
      'Fee Structure',
      'Performance Tracking',
      'Transparent Evaluation'
    ],
    basicIncluded: false,
    proIncluded: true,
    enterpriseIncluded: true
  },
  {
    id: 'timeline-management',
    name: 'Timeline Management',
    icon: Clock,
    description: 'Comprehensive timeline tracking and milestone management for all processes.',
    features: [
      'Event Tracking',
      'Milestone Management',
      'Activity Logging',
      'Progress Monitoring',
      'Deadline Alerts',
      'Visual Timeline'
    ],
    basicIncluded: false,
    proIncluded: true,
    enterpriseIncluded: true
  },
  
  {
    id: 'analytics',
    name: 'Advanced Analytics',
    icon: BarChart3,
    description: 'Comprehensive reporting and business intelligence tools.',
    features: [
      'Custom Dashboards',
      'Advanced Reporting',
      'Data Visualization',
      'Predictive Analytics',
      'Export Capabilities',
      'API Access'
    ],
    basicIncluded: false,
    proIncluded: false,
    enterpriseIncluded: true
  }
];

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    icon: Users,
    price: '$49',
    period: '/month',
    description: 'Perfect for small organizations getting started',
    features: [
      'Up to 10 users',
      'Core modules included',
      'Email support',
      '5GB storage',
      'Basic reporting',
      'Standard security'
    ],
    popular: false,
    color: 'border-gray-200'
  },
  {
    id: 'professional',
    name: 'Professional',
    icon: Zap,
    price: '$149',
    period: '/month',
    description: 'Ideal for growing organizations with advanced needs',
    features: [
      'Up to 50 users',
      'All core + premium modules',
      'Priority support',
      '50GB storage',
      'Advanced reporting',
      'Enhanced security',
      'API access',
      'Custom workflows'
    ],
    popular: true,
    color: 'border-slate-300 ring-2 ring-slate-200'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: Crown,
    price: 'Custom',
    period: '',
    description: 'For large organizations requiring full customization',
    features: [
      'Unlimited users',
      'All modules included',
      'Dedicated support',
      'Unlimited storage',
      'Custom analytics',
      'Enterprise security',
      'White-label options',
      'Custom integrations',
      'SLA guarantees'
    ],
    popular: false,
    color: 'border-gray-200'
  }
];

export default function ModulesSubscription() {
  const [selectedPlan, setSelectedPlan] = useState('professional');

  return (
    <StaticPageLayout 
      showHero={true}
      heroIcon={Building2}
      heroSubtitle="Professional Services"
      heroTitle="Modules & Subscription Plans"
      heroDescription="Choose the perfect plan for your organization's professional services needs."
      heroGradient="from-slate-600 to-gray-700"
    >
      <div className="space-y-12">
        {/* Subscription Plans */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Select the subscription plan that best fits your organization's needs. 
              All plans include our core modules with varying levels of access and features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {plans.map(plan => (
              <Card key={plan.id} className={`relative ${plan.color} ${plan.popular ? 'transform scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-slate-700 text-white px-4 py-1">
                      <Star className="h-4 w-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-slate-100 rounded-full w-fit">
                    <plan.icon className="h-8 w-8 text-slate-600" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-slate-700">
                    {plan.price}
                    <span className="text-lg font-normal text-gray-600">{plan.period}</span>
                  </div>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full mt-6 ${plan.popular ? 'bg-slate-700 hover:bg-slate-800' : 'bg-gray-600 hover:bg-gray-700'}`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {plan.id === 'enterprise' ? 'Contact Sales' : 'Get Started'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Modules Overview */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Modules</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our comprehensive suite of professional services modules designed to streamline 
              your organization's operations and ensure compliance across all areas.
            </p>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Module Overview</TabsTrigger>
              <TabsTrigger value="comparison">Plan Comparison</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {modules.map(module => (
                  <Card key={module.id}>
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-slate-100 rounded-lg">
                          <module.icon className="h-6 w-6 text-slate-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{module.name}</CardTitle>
                          <CardDescription>{module.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {module.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                            <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="comparison">
              <Card>
                <CardHeader>
                  <CardTitle>Module Availability by Plan</CardTitle>
                  <CardDescription>
                    Compare which modules are included in each subscription plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold">Module</th>
                          <th className="text-center py-3 px-4 font-semibold">Basic</th>
                          <th className="text-center py-3 px-4 font-semibold">Professional</th>
                          <th className="text-center py-3 px-4 font-semibold">Enterprise</th>
                        </tr>
                      </thead>
                      <tbody>
                        {modules.map(module => (
                          <tr key={module.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-3">
                                <module.icon className="h-5 w-5 text-slate-600" />
                                <span className="font-medium">{module.name}</span>
                              </div>
                            </td>
                            <td className="text-center py-3 px-4">
                              {module.basicIncluded ? (
                                <Check className="h-5 w-5 text-green-600 mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-red-500 mx-auto" />
                              )}
                            </td>
                            <td className="text-center py-3 px-4">
                              {module.proIncluded ? (
                                <Check className="h-5 w-5 text-green-600 mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-red-500 mx-auto" />
                              )}
                            </td>
                            <td className="text-center py-3 px-4">
                              {module.enterpriseIncluded ? (
                                <Check className="h-5 w-5 text-green-600 mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-red-500 mx-auto" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Call to Action */}
        <section className="bg-slate-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Join over 500+ organizations worldwide who trust the 998-P Platform 
            for their professional services and compliance needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-slate-700 hover:bg-slate-800">
              Start Free Trial
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline">
              Schedule Demo
            </Button>
            <Button size="lg" variant="outline">
              Contact Sales
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </section>
      </div>
    </StaticPageLayout>
  );
}
