import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { 
  Users, 
  Building2, 
  FileText, 
  Video, 
  Vote, 
  Scale, 
  FolderOpen, 
  UserCheck,
  ArrowRight,
  CheckCircle,
  Star,
  Shield,
  Globe,
  LogIn,
  UserPlus,

  Menu,
  X
} from 'lucide-react';

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
  }
];

const stats = [
  { label: 'Active Users', value: '10,000+' },
  { label: 'Organizations', value: '500+' },
  { label: 'Successful Cases', value: '1,200+' },
  { label: 'Compliance Rate', value: '99.8%' }
];

export default function Homepage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-slate-600" />
              <span className="text-2xl font-bold text-gray-900">998-P Platform</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-slate-700 font-medium">Home</a>
              <a href="#about" className="text-gray-700 hover:text-slate-700 font-medium">About Us</a>
              <a href="#services" className="text-gray-700 hover:text-slate-700 font-medium">Services</a>
              <a href="#plans" className="text-gray-700 hover:text-slate-700 font-medium">Purchase Subscriptions</a>
              <a href="#contact" className="text-gray-700 hover:text-slate-700 font-medium">Contact Us</a>
              <a href="#articles" className="text-gray-700 hover:text-slate-700 font-medium">Articles</a>
              
              {/* Direct Login Button */}
              <Button variant="outline" asChild className="flex items-center space-x-2">
                <Link to="/login">
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              </Button>
              
              {/* Register Button */}
              <Button asChild className="bg-slate-700 hover:bg-slate-800">
                <Link to="/register" className="flex items-center space-x-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Register</span>
                </Link>
              </Button>
            </nav>
            
            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col space-y-4">
                <a href="#home" className="text-gray-700 hover:text-slate-700 font-medium px-4 py-2">Home</a>
                <a href="#about" className="text-gray-700 hover:text-slate-700 font-medium px-4 py-2">About Us</a>
                <a href="#services" className="text-gray-700 hover:text-slate-700 font-medium px-4 py-2">Services</a>
                <a href="#plans" className="text-gray-700 hover:text-slate-700 font-medium px-4 py-2">Purchase Subscriptions</a>
                <a href="#contact" className="text-gray-700 hover:text-slate-700 font-medium px-4 py-2">Contact Us</a>
                <a href="#articles" className="text-gray-700 hover:text-slate-700 font-medium px-4 py-2">Articles</a>
                
                <div className="border-t border-gray-200 pt-4">
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:text-slate-700 hover:bg-gray-50 font-medium"
                  >
                    <LogIn className="inline h-4 w-4 mr-2" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 text-sm text-slate-600 hover:text-slate-700 font-medium"
                  >
                    <UserPlus className="inline h-4 w-4 mr-2" />
                    Register
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 bg-slate-100 text-slate-700">
              <Globe className="h-4 w-4 mr-2" />
              Trusted by 500+ Organizations Worldwide
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Professional Services Platform for
              <span className="text-slate-700 block">Modern Organizations</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline your organization's operations with our comprehensive suite of professional services, 
              compliance management, and collaboration tools designed for the digital age.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-slate-700">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button size="lg" className="bg-slate-700 hover:bg-slate-800" asChild>
                <Link to="/register" className="flex items-center">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50" asChild>
                <Link to="/login" className="flex items-center">
                  <LogIn className="mr-2 h-5 w-5" />
                  Already have an account? Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Platform Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your organization's professional services and compliance requirements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {platformFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <IconComponent className="h-6 w-6 text-slate-600" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {feature.description}
                    </CardDescription>
                    <ul className="space-y-2">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-slate-500 mr-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

 

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Have Questions?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Our team is here to help you get started and make the most of our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-slate-700 hover:bg-gray-100">
              Contact Sales
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-slate-700">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-8 w-8 text-slate-400" />
                <span className="text-2xl font-bold">998-P Platform</span>
              </div>
              <p className="text-gray-400 mb-4">
                Professional services platform designed for modern organizations seeking 
                comprehensive compliance and collaboration solutions.
              </p>
              <div className="flex space-x-4">
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="text-gray-400 ml-2">Trusted by 500+ organizations</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white">About Us</a></li>
                <li><a href="#services" className="hover:text-white">Services</a></li>
                <li><a href="#plans" className="hover:text-white">Pricing</a></li>
                <li><a href="#articles" className="hover:text-white">Resources</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/terms" className="hover:text-white">Terms & Conditions</a></li>
                <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="/security" className="hover:text-white">Security</a></li>
                <li><a href="/compliance" className="hover:text-white">Compliance</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 998-P Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
