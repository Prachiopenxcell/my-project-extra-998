import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import StaticPageLayout from '@/components/layouts/StaticPageLayout';
import { 
  FileText, 
  Shield, 
  Users, 
  Building2,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Mail,
  Phone
} from 'lucide-react';

const sections = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    icon: CheckCircle,
    content: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
      'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.'
    ]
  },
  {
    id: 'definitions',
    title: '2. Definitions',
    icon: FileText,
    content: [
      'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
      'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
      'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est.',
      'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.',
      'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.'
    ]
  },
  {
    id: 'user-accounts',
    title: '3. User Accounts and Registration',
    icon: Users,
    content: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.',
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.',
      'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi.',
      'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est.'
    ]
  },
  {
    id: 'service-usage',
    title: '4. Platform Services and Usage',
    icon: Building2,
    content: [
      'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
      'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.',
      'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.',
      'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system.',
      'And expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself.'
    ]
  },
  {
    id: 'prohibited-uses',
    title: '5. Prohibited Uses',
    icon: AlertTriangle,
    content: [
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt.',
      'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
      'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt.',
      'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores.',
      'Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit.',
      'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.'
    ]
  },
  {
    id: 'intellectual-property',
    title: '6. Intellectual Property Rights',
    icon: Shield,
    content: [
      'The Platform and its original content, features, and functionality are owned by 998-P Platform Inc. and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.',
      'Users retain ownership of content they create and upload to the Platform, but grant us a license to use, store, and process such content as necessary to provide the Platform services.',
      'Users may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Platform without prior written consent.',
      'All trademarks, service marks, and logos used on the Platform are trademarks or registered trademarks of their respective owners.'
    ]
  },
  {
    id: 'data-privacy',
    title: '7. Data Privacy and Security',
    icon: Shield,
    content: [
      'We are committed to protecting your privacy and personal information in accordance with our Privacy Policy, which is incorporated into these Terms by reference.',
      'We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction.',
      'Users are responsible for maintaining the confidentiality of their own data and for complying with applicable data protection laws.',
      'We may process personal data as necessary to provide the Platform services, comply with legal obligations, and pursue legitimate business interests.',
      'Data retention periods and deletion procedures are outlined in our Privacy Policy and may vary based on the type of data and applicable legal requirements.'
    ]
  },
  {
    id: 'payment-terms',
    title: '8. Payment Terms and Billing',
    icon: Building2,
    content: [
      'Subscription fees are charged in advance on a monthly or annual basis depending on your selected plan.',
      'All fees are non-refundable except as expressly stated in these Terms or required by applicable law.',
      'We reserve the right to change our pricing with 30 days\' notice to existing subscribers.',
      'Failure to pay fees may result in suspension or termination of your account and access to the Platform.',
      'You are responsible for all taxes associated with your use of the Platform.',
      'Enterprise customers may have separate billing arrangements as specified in their service agreements.'
    ]
  },
  {
    id: 'limitation-liability',
    title: '9. Limitation of Liability',
    icon: AlertTriangle,
    content: [
      'The Platform is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied.',
      'We do not warrant that the Platform will be uninterrupted, error-free, or completely secure.',
      'In no event shall 998-P Platform Inc. be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the Platform.',
      'Our total liability for any claims arising out of or relating to these Terms or the Platform shall not exceed the amount paid by you for the Platform services in the 12 months preceding the claim.',
      'Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability, so these limitations may not apply to you.'
    ]
  },
  {
    id: 'termination',
    title: '10. Termination',
    icon: AlertTriangle,
    content: [
      'You may terminate your account at any time by following the cancellation procedures in your account settings.',
      'We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users or the Platform.',
      'Upon termination, your right to use the Platform will cease immediately, and we may delete your account and all associated data.',
      'Provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.',
      'Data export options may be available for a limited time following account termination, subject to our data retention policies.'
    ]
  },
  {
    id: 'governing-law',
    title: '11. Governing Law and Dispute Resolution',
    icon: Building2,
    content: [
      'These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to conflict of law principles.',
      'Any disputes arising out of or relating to these Terms or the Platform shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.',
      'The arbitration shall take place in San Francisco, California, and shall be conducted in English.',
      'You agree to waive any right to a jury trial or to participate in a class action lawsuit.',
      'Notwithstanding the foregoing, we may seek injunctive relief in any court of competent jurisdiction to protect our intellectual property rights.'
    ]
  },
  {
    id: 'modifications',
    title: '12. Modifications to Terms',
    icon: FileText,
    content: [
      'We reserve the right to modify these Terms at any time by posting the revised Terms on the Platform.',
      'Your continued use of the Platform after any such changes constitutes your acceptance of the new Terms.',
      'Material changes to these Terms will be communicated to users via email or prominent notice on the Platform at least 30 days before the changes take effect.',
      'If you do not agree to the modified Terms, you must stop using the Platform and may terminate your account.',
      'We recommend that you review these Terms periodically to stay informed of any updates.'
    ]
  }
];

export default function TermsConditions() {
  return (
    <StaticPageLayout 
      showHero={true}
      heroIcon={Shield}
      heroSubtitle="Legal Documentation"
      heroTitle="Terms and Conditions"
      heroDescription="Please read these terms and conditions carefully before using the 998-P Platform services."
      heroGradient="from-slate-600 to-gray-800"
    >
      <div className="space-y-8">
        {/* Header Information */}
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-slate-100 rounded-lg">
                <FileText className="h-6 w-6 text-slate-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Important Legal Information</h3>
                <p className="text-gray-600 mb-4">
                  These Terms and Conditions govern your use of the 998-P Platform and constitute a legally binding agreement between
                  <span className="font-medium"> Service Seeker/Service Provider Name: ____________________ and 998-P Platform Inc.</span>
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

        {/* User Type Applicability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-slate-600" />
              <span>Applicability</span>
            </CardTitle>
            <CardDescription>
              These terms apply to all user types and roles on the 998-P Platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Service Seekers</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Individual/Partner users</li>
                  <li>• Entity/Organization User Admins</li>
                  <li>• Entity/Organization Team Members</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Service Providers</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Individual/Partner professionals</li>
                  <li>• Entity/Organization User Admins</li>
                  <li>• Individual User Team Members</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms Sections */}
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

        {/* Contact Information */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-blue-600" />
              <span>Questions About These Terms?</span>
            </CardTitle>
            <CardDescription>
              If you have any questions about these Terms and Conditions, please contact us.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Legal Department</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>legal@998p.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Mailing Address</h4>
                <div className="text-sm text-gray-600">
                  <p>998-P Platform Inc.</p>
                  <p>Legal Department</p>
                  <p>123 Tech Street, Suite 100</p>
                  <p>San Francisco, CA 94105</p>
                  <p>United States</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acknowledgment */}
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Acknowledgment</h3>
            </div>
            <p className="text-gray-600 mb-4">
              By using the 998-P Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-slate-700 hover:bg-slate-800">
                I Accept These Terms
              </Button>
              <Button variant="outline">
                Download PDF Copy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </StaticPageLayout>
  );
}
