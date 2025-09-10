import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import StaticPageLayout from '@/components/layouts/StaticPageLayout';
import { 
  ChevronDown, 
  ChevronRight, 
  Search, 
  HelpCircle,
  Users,
  Building2,
  CreditCard,
  Settings,
  Shield
} from 'lucide-react';

const faqCategories = [
  {
    id: 'general',
    title: 'General Platform',
    icon: HelpCircle,
    color: 'bg-blue-100 text-blue-700',
    faqs: [
      {
        question: 'What is the 998-P Platform?',
        answer: 'The 998-P Platform is a comprehensive professional services platform designed for modern organizations. It provides tools for entity management, compliance tracking, meeting coordination, e-voting, claims management, and more.'
      },
      {
        question: 'Who can use the 998-P Platform?',
        answer: 'The platform serves both Service Seekers (individuals, partners, entities) and Service Providers (professionals, organizations) across various industries including legal, financial, insolvency, and compliance sectors.'
      },
      {
        question: 'Is the platform secure?',
        answer: 'Yes, we implement enterprise-grade security measures including end-to-end encryption, secure authentication, audit trails, and compliance with international data protection standards.'
      },
      {
        question: 'How do I get started?',
        answer: 'Simply register for an account, complete your profile, select your subscription plan, and start using the platform features. Our onboarding process guides you through each step.'
      }
    ]
  },
  {
    id: 'registration',
    title: 'Registration & Setup',
    icon: Users,
    color: 'bg-green-100 text-green-700',
    faqs: [
      {
        question: 'How do I create an account?',
        answer: 'Click the "Register" button on the homepage, choose your user type (Individual/Partner or Entity/Organization), fill in the required information, and verify your email address.'
      },
      {
        question: 'What information do I need to provide during registration?',
        answer: 'Basic information includes name, email, phone number, and organization details (if applicable). Additional verification documents may be required based on your user type and selected modules.'
      },
      {
        question: 'Can I change my user type after registration?',
        answer: 'User type changes require admin approval and may involve additional verification. Contact our support team for assistance with user type modifications.'
      },
      {
        question: 'How do I invite team members?',
        answer: 'From your dashboard, go to Team Management, click "Invite Members," enter their email addresses, assign roles and permissions, and send invitations.'
      }
    ]
  },
  {
    id: 'subscription',
    title: 'Subscription & Billing',
    icon: CreditCard,
    color: 'bg-purple-100 text-purple-700',
    faqs: [
      {
        question: 'What subscription plans are available?',
        answer: 'We offer Basic, Professional, and Enterprise plans with different feature sets and user limits. Each plan includes core modules with optional add-ons available.'
      },
      {
        question: 'Can I upgrade or downgrade my plan?',
        answer: 'Yes, you can change your subscription plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.'
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept major credit cards, bank transfers, and digital payment methods. Enterprise customers can also set up invoicing arrangements.'
      },
      {
        question: 'Is there a free trial available?',
        answer: 'Yes, we offer a 14-day free trial for all new users to explore the platform features before committing to a subscription.'
      }
    ]
  },
  {
    id: 'features',
    title: 'Platform Features',
    icon: Settings,
    color: 'bg-orange-100 text-orange-700',
    faqs: [
      {
        question: 'What modules are included in the platform?',
        answer: 'Core modules include Entity Management, Meeting Management, E-Voting, Claims Management, Document Management, Compliance Tracking, and Reporting & Analytics.'
      },
      {
        question: 'Can I customize the platform for my organization?',
        answer: 'Yes, the platform offers customization options including branding, workflow configurations, custom fields, and integration capabilities.'
      },
      {
        question: 'Does the platform support multiple currencies?',
        answer: 'Yes, the platform supports multiple currencies with real-time forex calculations for international transactions and claims processing.'
      },
      {
        question: 'Is there mobile access available?',
        answer: 'The platform is fully responsive and accessible via mobile browsers. Native mobile apps are planned for future releases.'
      }
    ]
  },
  {
    id: 'support',
    title: 'Support & Security',
    icon: Shield,
    color: 'bg-red-100 text-red-700',
    faqs: [
      {
        question: 'How can I get technical support?',
        answer: 'Technical support is available via email, live chat, and phone during business hours. Enterprise customers receive priority support with dedicated account managers.'
      },
      {
        question: 'What data backup and recovery options are available?',
        answer: 'We perform automated daily backups with point-in-time recovery options. Enterprise plans include additional backup frequency and retention options.'
      },
      {
        question: 'How is my data protected?',
        answer: 'Data is encrypted in transit and at rest, stored in secure data centers, with regular security audits and compliance certifications including ISO 27001 and SOC 2.'
      },
      {
        question: 'Can I export my data?',
        answer: 'Yes, you can export your data in various formats including CSV, PDF, and JSON. Enterprise customers have additional export options and API access.'
      }
    ]
  }
];

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => 
    selectedCategory === 'all' || category.id === selectedCategory
  );

  return (
    <StaticPageLayout 
      showHero={true}
      heroIcon={HelpCircle}
      heroSubtitle="Help Center"
      heroTitle="Frequently Asked Questions"
      heroDescription="Find answers to common questions about the 998-P Platform and our services."
      heroGradient="from-slate-700 to-gray-800"
    >
      <div className="space-y-8">
        {/* Search and Filter Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                  className={selectedCategory === 'all' ? 'bg-slate-700 hover:bg-slate-800' : 'bg-transparent hover:bg-slate-100'}
                >
                  All Categories
                </Button>
                {faqCategories.map(category => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={selectedCategory === category.id ? 'bg-slate-700 hover:bg-slate-800' : 'bg-transparent hover:bg-slate-100'}
                  >
                    <category.icon className="h-4 w-4 mr-1" />
                    {category.title}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personalized FAQ Prompt */}
        <Card className="border-slate-200 bg-slate-50">
          <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Looking for personalized answers?</h3>
              <p className="text-gray-600">View FAQs tailored to your role, user type, and subscribed modules.</p>
            </div>
            <Button asChild className="bg-slate-700 hover:bg-slate-800">
              <a href="/user-faq">Go to Your User FAQ</a>
            </Button>
          </CardContent>
        </Card>

        {/* FAQ Categories */}
        {filteredFAQs.map(category => (
          category.faqs.length > 0 && (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    <category.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                    <CardDescription>
                      {category.faqs.length} question{category.faqs.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.faqs.map((faq, index) => {
                  const itemId = `${category.id}-${index}`;
                  const isExpanded = expandedItems.includes(itemId);
                  
                  return (
                    <div key={index} className="border rounded-lg">
                      <button
                        onClick={() => toggleExpanded(itemId)}
                        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-3 text-gray-600 border-t bg-gray-50">
                          <p className="pt-3">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )
        ))}

        {/* No Results */}
        {filteredFAQs.every(category => category.faqs.length === 0) && (
          <Card>
            <CardContent className="p-12 text-center">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs Found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any FAQs matching your search criteria.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Contact Support */}
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-4">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-slate-700 hover:bg-slate-800">
                <a href="/contact">Contact Support</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="mailto:support@998p.com">Email Us</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </StaticPageLayout>
  );
}
