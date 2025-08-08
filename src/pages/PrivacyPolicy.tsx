import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import StaticPageLayout from '@/components/layouts/StaticPageLayout';
import { 
  Shield, 
  Eye, 
  Lock, 
  Users, 
  Building2,
  Database,
  Globe,
  FileText,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const sections = [
  {
    id: 'information-collection',
    title: '1. Information We Collect',
    icon: Database,
    content: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
      'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
      'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
      'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.'
    ]
  },
  {
    id: 'information-use',
    title: '2. How We Use Your Information',
    icon: Eye,
    content: [
      'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
      'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est.',
      'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.',
      'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
      'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system.',
      'And expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself.',
      'Because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful.'
    ]
  },
  {
    id: 'information-sharing',
    title: '3. Information Sharing and Disclosure',
    icon: Users,
    content: [
      'Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure.',
      'To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure.',
      'That has no annoying consequences, or one who avoids a pain that produces no resultant pleasure? On the other hand, we denounce with righteous indignation and dislike men who are so beguiled.',
      'And demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue.',
      'And equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain.',
      'These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best.'
    ]
  },
  {
    id: 'data-security',
    title: '4. Data Security and Protection',
    icon: Lock,
    content: [
      'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.',
      'Data is encrypted in transit using TLS/SSL protocols and at rest using industry-standard encryption methods.',
      'We maintain secure data centers with physical access controls, environmental safeguards, and 24/7 monitoring.',
      'Regular security assessments and penetration testing are conducted to identify and address vulnerabilities.',
      'Employee access to personal information is restricted on a need-to-know basis and subject to confidentiality agreements.',
      'We maintain incident response procedures to address any potential data breaches promptly and transparently.'
    ]
  },
  {
    id: 'data-retention',
    title: '5. Data Retention and Deletion',
    icon: Calendar,
    content: [
      'We retain personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy.',
      'Account information is retained for the duration of your account plus a reasonable period thereafter for legal and business purposes.',
      'Transaction and billing records are retained in accordance with applicable financial and tax regulations.',
      'Communication and document data may be retained for compliance and dispute resolution purposes.',
      'You may request deletion of your personal information, subject to legal and contractual obligations.',
      'Automated deletion processes remove inactive data according to our established retention schedules.'
    ]
  },
  {
    id: 'user-rights',
    title: '6. Your Privacy Rights',
    icon: Shield,
    content: [
      'Access: You have the right to access and review the personal information we hold about you.',
      'Correction: You may request correction of inaccurate or incomplete personal information.',
      'Deletion: You may request deletion of your personal information, subject to certain exceptions.',
      'Portability: You may request a copy of your personal information in a structured, machine-readable format.',
      'Restriction: You may request restriction of processing of your personal information in certain circumstances.',
      'Objection: You may object to processing of your personal information for marketing purposes or based on legitimate interests.',
      'Withdrawal: You may withdraw consent for processing where we rely on consent as the legal basis.'
    ]
  },
  {
    id: 'international-transfers',
    title: '7. International Data Transfers',
    icon: Globe,
    content: [
      'Our Platform operates globally, and your information may be transferred to and processed in countries other than your country of residence.',
      'We ensure that international transfers comply with applicable data protection laws and regulations.',
      'Appropriate safeguards are implemented, including standard contractual clauses and adequacy decisions.',
      'Data transferred to the United States is subject to Privacy Shield principles and other applicable frameworks.',
      'We maintain data processing agreements with all international service providers and partners.',
      'You consent to the international transfer of your information as necessary to provide our services.'
    ]
  },
  {
    id: 'cookies-tracking',
    title: '8. Cookies and Tracking Technologies',
    icon: Eye,
    content: [
      'We use cookies, web beacons, and similar technologies to enhance your experience and collect usage information.',
      'Essential cookies are necessary for the Platform to function properly and cannot be disabled.',
      'Analytics cookies help us understand how users interact with our Platform and improve our services.',
      'Marketing cookies may be used to deliver personalized content and advertisements.',
      'You can control cookie preferences through your browser settings or our cookie management tools.',
      'Third-party analytics and advertising partners may also use tracking technologies subject to their own privacy policies.'
    ]
  },
  {
    id: 'children-privacy',
    title: '9. Children\'s Privacy',
    icon: Users,
    content: [
      'Our Platform is not intended for use by individuals under the age of 18.',
      'We do not knowingly collect personal information from children under 18 years of age.',
      'If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information.',
      'Parents or guardians who believe their child has provided personal information should contact us immediately.',
      'Professional services provided through our Platform are intended for business and professional use by adults.'
    ]
  },
  {
    id: 'policy-updates',
    title: '10. Privacy Policy Updates',
    icon: FileText,
    content: [
      'We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws.',
      'Material changes will be communicated through email notification or prominent notice on our Platform.',
      'The updated policy will be effective 30 days after notification, unless immediate compliance is required by law.',
      'Your continued use of the Platform after the effective date constitutes acceptance of the updated policy.',
      'We encourage you to review this policy periodically to stay informed about our privacy practices.',
      'Previous versions of this policy are available upon request for your reference.'
    ]
  }
];

const dataTypes = [
  {
    category: 'Account Information',
    description: 'Basic account details and authentication data',
    examples: ['Name', 'Email', 'Password', 'Phone Number'],
    retention: '7 years after account closure'
  },
  {
    category: 'Professional Data',
    description: 'Credentials and professional information',
    examples: ['Certifications', 'Work History', 'Credentials', 'Affiliations'],
    retention: '10 years for compliance purposes'
  },
  {
    category: 'Usage Analytics',
    description: 'Platform interaction and usage patterns',
    examples: ['Page Views', 'Feature Usage', 'Session Data', 'Performance Metrics'],
    retention: '2 years for analytics purposes'
  },
  {
    category: 'Communication Data',
    description: 'Messages and documents shared on the platform',
    examples: ['Messages', 'Documents', 'Meeting Records', 'Support Tickets'],
    retention: '5 years for legal compliance'
  }
];

export default function PrivacyPolicy() {
  return (
    <StaticPageLayout 
      showHero={true}
      heroIcon={Shield}
      heroSubtitle="Data Protection & Privacy"
      heroTitle="Privacy Policy"
      heroDescription="Learn how we collect, use, and protect your personal information on the 998-P Platform."
      heroGradient="from-slate-600 to-gray-700"
    >
      <div className="space-y-8">
        {/* Header Information */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Privacy Matters</h3>
                <p className="text-gray-600 mb-4">
                  At 998-P Platform, we are committed to protecting your privacy and personal information. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                  when you use our professional services platform.
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Last Updated: January 1, 2024</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Effective Date: January 1, 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Types Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-slate-600" />
              <span>Types of Data We Process</span>
            </CardTitle>
            <CardDescription>
              Overview of the different categories of personal information we collect and process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dataTypes.map((type, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{type.category}</h4>
                  <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium text-gray-500">Examples:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {type.examples.map(example => (
                          <Badge key={example} variant="secondary" className="text-xs">
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Retention:</span> {type.retention}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Privacy Policy Sections */}
        {sections.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <section.icon className="h-5 w-5 text-slate-600" />
                </div>
                <span>{section.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {section.content.map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Compliance Certifications */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Compliance & Certifications</span>
            </CardTitle>
            <CardDescription>
              We maintain compliance with international privacy and security standards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">GDPR Compliant</h4>
                <p className="text-sm text-gray-600">European Union General Data Protection Regulation</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">SOC 2 Type II</h4>
                <p className="text-sm text-gray-600">Security, Availability, and Confidentiality</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Globe className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">ISO 27001</h4>
                <p className="text-sm text-gray-600">Information Security Management</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Rights */}
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-slate-600" />
              <span>Exercise Your Privacy Rights</span>
            </CardTitle>
            <CardDescription>
              You have several rights regarding your personal information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Data Subject Rights</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Right to Access your personal data</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Right to Rectification of inaccurate data</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Right to Erasure ("Right to be Forgotten")</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Right to Data Portability</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Right to Restrict Processing</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Right to Object to Processing</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">How to Exercise Rights</h4>
                <div className="space-y-3">
                  <Button className="w-full bg-slate-700 hover:bg-slate-800">
                    Access My Data
                  </Button>
                  <Button variant="outline" className="w-full">
                    Update My Information
                  </Button>
                  <Button variant="outline" className="w-full">
                    Delete My Account
                  </Button>
                  <Button variant="outline" className="w-full">
                    Export My Data
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-blue-600" />
              <span>Privacy Questions & Contact</span>
            </CardTitle>
            <CardDescription>
              Contact our Data Protection Officer for privacy-related inquiries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Data Protection Officer</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>privacy@998p.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>+1 (555) 123-4567 ext. 101</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Mailing Address</h4>
                <div className="text-sm text-gray-600">
                  <p>998-P Platform Inc.</p>
                  <p>Privacy Department</p>
                  <p>123 Tech Street, Suite 100</p>
                  <p>San Francisco, CA 94105</p>
                  <p>United States</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Important Notice</h4>
                <p className="text-gray-600 mb-4">
                  This Privacy Policy applies to all users of the 998-P Platform, including Service Seekers and Service Providers. 
                  By using our Platform, you consent to the collection and use of your information as described in this policy.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="bg-slate-700 hover:bg-slate-800">
                    I Understand
                  </Button>
                  <Button variant="outline">
                    Download PDF Copy
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </StaticPageLayout>
  );
}
