import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import StaticPageLayout from '@/components/layouts/StaticPageLayout';
import { 
  Cookie, 
  Settings, 
  Eye, 
  BarChart3,
  Target,
  Shield,
  Globe,
  Calendar,
  CheckCircle,
  X,
  Info,
  AlertTriangle
} from 'lucide-react';

const cookieCategories = [
  {
    id: 'essential',
    name: 'Essential Cookies',
    icon: Shield,
    description: 'These cookies are necessary for the website to function and cannot be switched off.',
    required: true,
    cookies: [
      {
        name: 'session_id',
        purpose: 'Maintains your login session and security',
        duration: 'Session',
        provider: '998-P Platform'
      },
      {
        name: 'csrf_token',
        purpose: 'Protects against cross-site request forgery attacks',
        duration: 'Session',
        provider: '998-P Platform'
      },
      {
        name: 'auth_token',
        purpose: 'Authenticates your identity and access permissions',
        duration: '30 days',
        provider: '998-P Platform'
      },
      {
        name: 'cookie_consent',
        purpose: 'Remembers your cookie preferences',
        duration: '1 year',
        provider: '998-P Platform'
      }
    ]
  },
  {
    id: 'functional',
    name: 'Functional Cookies',
    icon: Settings,
    description: 'These cookies enable enhanced functionality and personalization.',
    required: false,
    cookies: [
      {
        name: 'user_preferences',
        purpose: 'Stores your dashboard layout and display preferences',
        duration: '1 year',
        provider: '998-P Platform'
      },
      {
        name: 'language_setting',
        purpose: 'Remembers your preferred language selection',
        duration: '1 year',
        provider: '998-P Platform'
      },
      {
        name: 'timezone_setting',
        purpose: 'Stores your timezone for accurate time display',
        duration: '1 year',
        provider: '998-P Platform'
      },
      {
        name: 'notification_prefs',
        purpose: 'Manages your notification preferences',
        duration: '6 months',
        provider: '998-P Platform'
      }
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics Cookies',
    icon: BarChart3,
    description: 'These cookies help us understand how visitors interact with our website.',
    required: false,
    cookies: [
      {
        name: '_ga',
        purpose: 'Distinguishes unique users for Google Analytics',
        duration: '2 years',
        provider: 'Google Analytics'
      },
      {
        name: '_ga_*',
        purpose: 'Contains campaign related information for Google Analytics',
        duration: '2 years',
        provider: 'Google Analytics'
      },
      {
        name: 'platform_analytics',
        purpose: 'Tracks feature usage and user interactions',
        duration: '1 year',
        provider: '998-P Platform'
      },
      {
        name: 'performance_metrics',
        purpose: 'Monitors platform performance and load times',
        duration: '30 days',
        provider: '998-P Platform'
      }
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing Cookies',
    icon: Target,
    description: 'These cookies track visitors across websites to display relevant advertisements.',
    required: false,
    cookies: [
      {
        name: '_fbp',
        purpose: 'Facebook Pixel for conversion tracking',
        duration: '3 months',
        provider: 'Facebook'
      },
      {
        name: 'linkedin_insight',
        purpose: 'LinkedIn conversion tracking and analytics',
        duration: '2 years',
        provider: 'LinkedIn'
      },
      {
        name: 'marketing_campaigns',
        purpose: 'Tracks effectiveness of marketing campaigns',
        duration: '6 months',
        provider: '998-P Platform'
      },
      {
        name: 'referral_source',
        purpose: 'Identifies how users found our platform',
        duration: '30 days',
        provider: '998-P Platform'
      }
    ]
  }
];

export default function CookiesPolicy() {
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    functional: true,
    analytics: false,
    marketing: false
  });

  const handlePreferenceChange = (category: string, enabled: boolean) => {
    if (category === 'essential') return; // Essential cookies cannot be disabled
    
    setCookiePreferences(prev => ({
      ...prev,
      [category]: enabled
    }));
  };

  const savePreferences = () => {
    // In a real implementation, this would save to cookies and update consent
    console.log('Saving cookie preferences:', cookiePreferences);
    alert('Cookie preferences saved successfully!');
  };

  const acceptAllCookies = () => {
    setCookiePreferences({
      essential: true,
      functional: true,
      analytics: true,
      marketing: true
    });
  };

  const rejectAllCookies = () => {
    setCookiePreferences({
      essential: true,
      functional: false,
      analytics: false,
      marketing: false
    });
  };

  return (
    <StaticPageLayout 
      showHero={true}
      heroIcon={Cookie}
      heroSubtitle="Cookie Management"
      heroTitle="Cookies Policy"
      heroDescription="Learn about how we use cookies and similar technologies on the 998-P Platform."
      heroGradient="from-slate-600 to-gray-700"
    >
      <div className="space-y-8">
        {/* Header Information */}
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Cookie className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">About Cookies</h3>
                <p className="text-gray-600 mb-4">
                  Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
                  They help us provide you with a better experience by remembering your preferences and understanding how you use our platform.
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Last Updated: January 1, 2024</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Globe className="h-4 w-4" />
                    <span>Applies to all 998-P Platform domains</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookie Preference Manager */}
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-slate-600" />
              <span>Manage Your Cookie Preferences</span>
            </CardTitle>
            <CardDescription>
              Choose which types of cookies you want to allow. Essential cookies cannot be disabled as they are required for the platform to function.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {cookieCategories.map(category => (
                <div key={category.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <category.icon className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{category.name}</h4>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {category.required && (
                        <Badge variant="secondary" className="bg-red-100 text-red-700">
                          Required
                        </Badge>
                      )}
                      <Switch
                        checked={cookiePreferences[category.id as keyof typeof cookiePreferences]}
                        onCheckedChange={(checked) => handlePreferenceChange(category.id, checked)}
                        disabled={category.required}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {category.cookies.map((cookie, index) => (
                      <div key={index} className="bg-gray-50 rounded p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-sm text-gray-900">{cookie.name}</h5>
                            <p className="text-xs text-gray-600 mt-1">{cookie.purpose}</p>
                          </div>
                          <div className="text-right text-xs text-gray-500 ml-4">
                            <div>Duration: {cookie.duration}</div>
                            <div>Provider: {cookie.provider}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button onClick={acceptAllCookies} className="bg-slate-700 hover:bg-slate-800">
                Accept All Cookies
              </Button>
              <Button onClick={rejectAllCookies} variant="outline">
                Reject Non-Essential
              </Button>
              <Button onClick={savePreferences} variant="outline">
                Save My Preferences
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* What Are Cookies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5 text-slate-600" />
              <span>What Are Cookies?</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                Cookies are small text files that websites place on your device to store information about your visit. 
                They are widely used to make websites work more efficiently and provide information to website owners.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">First-Party Cookies</h4>
                  <p className="text-sm text-gray-600">
                    Set directly by our website and can only be read by our website. 
                    These are used for essential functionality and to improve your experience.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Third-Party Cookies</h4>
                  <p className="text-sm text-gray-600">
                    Set by external services we use, such as analytics providers or advertising networks. 
                    These help us understand user behavior and deliver relevant content.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Cookies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-slate-600" />
              <span>How We Use Cookies</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Platform Functionality</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>Maintain your login session</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>Remember your preferences</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>Provide security features</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>Enable platform features</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Analytics & Improvement</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>Understand user behavior</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>Improve platform performance</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>Identify popular features</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>Optimize user experience</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Managing Cookies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-slate-600" />
              <span>Managing Your Cookies</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Browser Settings</h4>
                <p className="text-gray-600 mb-4">
                  You can control cookies through your browser settings. Most browsers allow you to:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>View cookies stored on your device</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>Delete existing cookies</span>
                    </li>
                  </ul>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>Block cookies from specific sites</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>Block all cookies (not recommended)</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Platform Cookie Manager</h4>
                <p className="text-gray-600 mb-4">
                  Use our cookie preference manager above to control which types of cookies we use. 
                  Your preferences will be saved and respected across all your visits to our platform.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Third-Party Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-slate-600" />
              <span>Third-Party Services</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                We use several third-party services that may set their own cookies. These services have their own privacy policies and cookie policies:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Google Analytics</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Helps us understand how users interact with our platform.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Google's Policy
                  </Button>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Facebook Pixel</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Tracks conversions and helps optimize our advertising.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Facebook's Policy
                  </Button>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">LinkedIn Insight</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Provides analytics and conversion tracking for LinkedIn campaigns.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    View LinkedIn's Policy
                  </Button>
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
                  Disabling certain cookies may impact your experience on the 998-P Platform. 
                  Essential cookies are required for the platform to function properly and cannot be disabled.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={savePreferences} className="bg-slate-700 hover:bg-slate-800">
                    Save My Preferences
                  </Button>
                  <Button variant="outline">
                    Contact Support
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
