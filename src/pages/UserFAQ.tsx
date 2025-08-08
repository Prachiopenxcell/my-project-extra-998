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
  FileText,
  Settings,
  Shield,
  UserCheck,
  Briefcase
} from 'lucide-react';

// Mock user context - in real app, this would come from auth context
const mockUser = {
  role: 'Service Seeker',
  userType: 'Individual/Partner',
  subscribedModules: ['Entity Management', 'Meeting Management', 'E-Voting', 'Claims Management']
};

const getUserSpecificFAQs = (userRole: string, userType: string, modules: string[]) => {
  const baseFAQs = [
    {
      id: 'dashboard',
      title: 'Dashboard & Navigation',
      icon: Settings,
      color: 'bg-blue-100 text-blue-700',
      faqs: [
        {
          question: 'How do I navigate my dashboard?',
          answer: `As a ${userRole} (${userType}), your dashboard provides quick access to your subscribed modules: ${modules.join(', ')}. Use the left sidebar to navigate between different sections.`
        },
        {
          question: 'Can I customize my dashboard?',
          answer: 'Yes, you can customize widget layouts, set preferences, and configure notifications from the Settings menu in your dashboard.'
        },
        {
          question: 'How do I update my profile information?',
          answer: 'Go to Profile Settings from the user menu in the top-right corner. You can update personal information, contact details, and verification documents.'
        }
      ]
    }
  ];

  // Add role-specific FAQs
  if (userRole === 'Service Seeker') {
    baseFAQs.push({
      id: 'service-seeker',
      title: 'Service Seeker Features',
      icon: Users,
      color: 'bg-green-100 text-green-700',
      faqs: [
        {
          question: 'How do I find and engage service providers?',
          answer: 'Use the Service Provider Directory to search by expertise, location, and ratings. You can send engagement requests and manage ongoing services from your dashboard.'
        },
        {
          question: 'How do I manage my entities?',
          answer: 'Access Entity Management from your dashboard to create, update, and monitor your organizations. You can track compliance status and manage team members.'
        },
        {
          question: 'Can I invite team members to collaborate?',
          answer: 'Yes, go to Team Management to invite members, assign roles, and set permissions. Team members will receive email invitations to join your organization.'
        }
      ]
    });
  }

  if (userRole === 'Service Provider') {
    baseFAQs.push({
      id: 'service-provider',
      title: 'Service Provider Features',
      icon: Briefcase,
      color: 'bg-purple-100 text-purple-700',
      faqs: [
        {
          question: 'How do I manage client engagements?',
          answer: 'Use the Client Management module to track active engagements, manage deliverables, and communicate with clients through the integrated messaging system.'
        },
        {
          question: 'How do I set my service offerings and rates?',
          answer: 'Go to Service Configuration to define your expertise areas, set hourly rates, and configure service packages. This information is visible to potential clients.'
        },
        {
          question: 'Can I collaborate with other service providers?',
          answer: 'Yes, you can form partnerships and collaborate on complex engagements. Use the Professional Network feature to connect with other providers.'
        }
      ]
    });
  }

  // Add module-specific FAQs based on subscriptions
  if (modules.includes('Entity Management')) {
    baseFAQs.push({
      id: 'entity-management',
      title: 'Entity Management',
      icon: Building2,
      color: 'bg-orange-100 text-orange-700',
      faqs: [
        {
          question: 'How do I create a new entity?',
          answer: 'Navigate to Entity Management > Create Entity. Fill in the required information including entity type, jurisdiction, and key personnel details.'
        },
        {
          question: 'How do I track compliance requirements?',
          answer: 'The Compliance Dashboard shows all regulatory requirements, deadlines, and status updates. Set up automated reminders for important filings.'
        },
        {
          question: 'Can I manage multiple entities?',
          answer: 'Yes, you can create and manage multiple entities under your account. Switch between entities using the entity selector in the top navigation.'
        }
      ]
    });
  }

  if (modules.includes('Meeting Management')) {
    baseFAQs.push({
      id: 'meetings',
      title: 'Meeting Management',
      icon: UserCheck,
      color: 'bg-teal-100 text-teal-700',
      faqs: [
        {
          question: 'How do I schedule a meeting?',
          answer: 'Go to Meetings > Create Meeting. Set the date, time, agenda, and invite participants. The system will send automated invitations and reminders.'
        },
        {
          question: 'Can I conduct virtual meetings?',
          answer: 'Yes, the platform includes integrated video conferencing. Participants can join directly from their dashboard without external software.'
        },
        {
          question: 'How are meeting minutes recorded?',
          answer: 'Meeting minutes can be recorded manually or auto-generated using AI transcription. All recordings and documents are stored securely in the meeting archive.'
        }
      ]
    });
  }

  if (modules.includes('Claims Management')) {
    baseFAQs.push({
      id: 'claims',
      title: 'Claims Management',
      icon: FileText,
      color: 'bg-red-100 text-red-700',
      faqs: [
        {
          question: 'How do I submit a claim?',
          answer: 'Access Claims Management > Submit Claim. Upload supporting documents, specify claim amount, and provide detailed descriptions. The system guides you through the process.'
        },
        {
          question: 'How can I track my claim status?',
          answer: 'View all your claims in the Claims Dashboard. Each claim shows current status, processing stage, and any required actions from your side.'
        },
        {
          question: 'What documents do I need for claim submission?',
          answer: 'Required documents vary by claim type but typically include proof of loss, supporting invoices, correspondence, and any relevant contracts or agreements.'
        }
      ]
    });
  }

  return baseFAQs;
};

export default function UserFAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const faqCategories = getUserSpecificFAQs(mockUser.role, mockUser.userType, mockUser.subscribedModules);

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
    <StaticPageLayout>
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
            <p className="text-lg text-gray-600 mt-2">
              Personalized help for {mockUser.role} ({mockUser.userType})
            </p>
          </div>
          <Badge variant="secondary" className="bg-slate-100 text-slate-700">
            {mockUser.subscribedModules.length} Active Modules
          </Badge>
        </div>

        {/* Search and Filter Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search your personalized FAQs..."
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
                  className="bg-slate-700 hover:bg-slate-800"
                >
                  All Categories
                </Button>
                {faqCategories.map(category => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="bg-slate-700 hover:bg-slate-800"
                  >
                    <category.icon className="h-4 w-4 mr-1" />
                    {category.title}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Subscribed Modules */}
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-slate-600" />
              <span>Your Active Modules</span>
            </CardTitle>
            <CardDescription>
              Get help with the modules you're currently subscribed to
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {mockUser.subscribedModules.map(module => (
                <Badge key={module} variant="secondary" className="bg-slate-200 text-slate-700">
                  {module}
                </Badge>
              ))}
            </div>
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
                      {category.faqs.length} question{category.faqs.length !== 1 ? 's' : ''} specific to your role and modules
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
              Need more help?
            </h3>
            <p className="text-gray-600 mb-4">
              Can't find what you're looking for? Our support team understands your specific setup and can provide personalized assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-slate-700 hover:bg-slate-800">
                Contact Support
              </Button>
              <Button variant="outline">
                Schedule a Call
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </StaticPageLayout>
  );
}
