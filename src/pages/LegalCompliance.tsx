import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StaticPageLayout from '@/components/layouts/StaticPageLayout';
import { 
  Scale, 
  Shield, 
  Globe, 
  FileText,
  Building2,
  Users,
  CheckCircle,
  Award,
  AlertTriangle,
  Calendar,
  Mail,
  Phone,
  Download,
  ExternalLink
} from 'lucide-react';

const complianceFrameworks = [
  {
    id: 'legal-sector',
    name: 'Legal Sector Compliance',
    icon: Scale,
    description: 'Regulatory requirements for legal professionals and law firms',
    frameworks: [
      {
        name: 'Bar Association Rules',
        description: 'Professional conduct rules and ethical guidelines for legal practitioners',
        coverage: 'All jurisdictions where we operate',
        status: 'Compliant'
      },
      {
        name: 'Client Confidentiality',
        description: 'Attorney-client privilege and confidentiality requirements',
        coverage: 'Global',
        status: 'Compliant'
      },
      {
        name: 'Legal Practice Management',
        description: 'Standards for legal practice management and client service',
        coverage: 'Jurisdiction-specific',
        status: 'Compliant'
      },
      {
        name: 'Trust Account Management',
        description: 'Requirements for handling client funds and trust accounts',
        coverage: 'Applicable jurisdictions',
        status: 'Compliant'
      }
    ]
  },
  {
    id: 'financial-sector',
    name: 'Financial Sector Compliance',
    icon: Building2,
    description: 'Regulatory requirements for financial services and institutions',
    frameworks: [
      {
        name: 'Anti-Money Laundering (AML)',
        description: 'Prevention of money laundering and terrorist financing',
        coverage: 'Global',
        status: 'Compliant'
      },
      {
        name: 'Know Your Customer (KYC)',
        description: 'Customer identification and due diligence requirements',
        coverage: 'Global',
        status: 'Compliant'
      },
      {
        name: 'Financial Data Protection',
        description: 'Protection of financial information and transaction data',
        coverage: 'Global',
        status: 'Compliant'
      },
      {
        name: 'Audit and Reporting',
        description: 'Financial audit trails and regulatory reporting requirements',
        coverage: 'Jurisdiction-specific',
        status: 'Compliant'
      }
    ]
  },
  {
    id: 'insolvency-sector',
    name: 'Insolvency Sector Compliance',
    icon: FileText,
    description: 'Regulatory requirements for insolvency and restructuring professionals',
    frameworks: [
      {
        name: 'Insolvency Practitioner Regulations',
        description: 'Licensing and conduct requirements for insolvency practitioners',
        coverage: 'Jurisdiction-specific',
        status: 'Compliant'
      },
      {
        name: 'Creditor Rights Protection',
        description: 'Safeguarding creditor interests and fair distribution of assets',
        coverage: 'Global',
        status: 'Compliant'
      },
      {
        name: 'Asset Recovery Standards',
        description: 'Standards for asset identification, recovery, and realization',
        coverage: 'Global',
        status: 'Compliant'
      },
      {
        name: 'Stakeholder Communication',
        description: 'Requirements for transparent communication with stakeholders',
        coverage: 'Global',
        status: 'Compliant'
      }
    ]
  }
];

const certifications = [
  {
    name: 'SOC 2 Type II',
    description: 'Security, Availability, and Confidentiality Controls',
    issuer: 'AICPA',
    validUntil: '2024-12-31',
    scope: 'Platform Security and Data Protection'
  },
  {
    name: 'ISO 27001:2013',
    description: 'Information Security Management System',
    issuer: 'ISO',
    validUntil: '2025-06-30',
    scope: 'Information Security Management'
  },
  {
    name: 'GDPR Compliance',
    description: 'General Data Protection Regulation',
    issuer: 'EU Commission',
    validUntil: 'Ongoing',
    scope: 'Data Protection and Privacy'
  },
  {
    name: 'CCPA Compliance',
    description: 'California Consumer Privacy Act',
    issuer: 'State of California',
    validUntil: 'Ongoing',
    scope: 'Consumer Privacy Rights'
  }
];

const auditReports = [
  {
    title: 'Annual Security Audit Report 2024',
    type: 'Security Audit',
    date: '2024-01-15',
    status: 'Published',
    summary: 'Comprehensive security assessment covering all platform components and data handling processes.'
  },
  {
    title: 'GDPR Compliance Assessment 2024',
    type: 'Privacy Audit',
    date: '2024-02-01',
    status: 'Published',
    summary: 'Assessment of data protection practices and GDPR compliance across all platform operations.'
  },
  {
    title: 'Financial Controls Review 2024',
    type: 'Financial Audit',
    date: '2024-03-01',
    status: 'Published',
    summary: 'Review of financial controls, billing processes, and payment security measures.'
  },
  {
    title: 'Third-Party Risk Assessment 2024',
    type: 'Vendor Audit',
    date: '2024-04-01',
    status: 'In Progress',
    summary: 'Assessment of third-party vendors and service providers for compliance and security.'
  }
];

const policies = [
  {
    title: 'Data Protection Policy',
    description: 'Comprehensive data protection and privacy policy covering all aspects of personal data handling.',
    lastUpdated: '2024-01-01',
    applicableTo: 'All Users'
  },
  {
    title: 'Information Security Policy',
    description: 'Security policies and procedures for protecting platform and user data.',
    lastUpdated: '2024-01-01',
    applicableTo: 'All Users and Employees'
  },
  {
    title: 'Professional Services Code of Conduct',
    description: 'Ethical guidelines and professional standards for service providers on the platform.',
    lastUpdated: '2024-01-01',
    applicableTo: 'Service Providers'
  },
  {
    title: 'Anti-Money Laundering Policy',
    description: 'AML procedures and compliance requirements for financial transactions.',
    lastUpdated: '2024-01-01',
    applicableTo: 'All Users'
  }
];

export default function LegalCompliance() {
  return (
    <StaticPageLayout 
      showHero={true}
      heroIcon={Scale}
      heroSubtitle="Regulatory Framework"
      heroTitle="Legal and Compliance"
      heroDescription="Comprehensive information about our regulatory compliance, certifications, and legal frameworks."
      heroGradient="from-slate-600 to-gray-700"
    >
      <div className="space-y-8">
        {/* Header Information */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Scale className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Comprehensive Compliance Framework</h3>
                <p className="text-gray-600 mb-4">
                  The 998-P Platform is built with compliance at its core, adhering to regulatory requirements 
                  across legal, financial, and insolvency sectors. We maintain the highest standards of 
                  professional conduct and data protection.
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Globe className="h-4 w-4" />
                    <span>25+ Jurisdictions</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="h-4 w-4" />
                    <span>Multiple Certifications</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Continuous Monitoring</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Tabs */}
        <Tabs defaultValue="frameworks" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="frameworks">Compliance Frameworks</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="audits">Audit Reports</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
          </TabsList>
          
          <TabsContent value="frameworks" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Sector-Specific Compliance</h2>
              <p className="text-gray-600">
                We maintain compliance with regulatory frameworks across all professional sectors we serve.
              </p>
            </div>
            
            {complianceFrameworks.map(sector => (
              <Card key={sector.id}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <sector.icon className="h-6 w-6 text-slate-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{sector.name}</CardTitle>
                      <CardDescription>{sector.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sector.frameworks.map((framework, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{framework.name}</h4>
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {framework.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{framework.description}</p>
                        <div className="text-xs text-gray-500">
                          <span className="font-medium">Coverage:</span> {framework.coverage}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="certifications" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Industry Certifications</h2>
              <p className="text-gray-600">
                Our platform maintains industry-leading certifications for security, privacy, and compliance.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certifications.map((cert, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Award className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{cert.name}</CardTitle>
                          <CardDescription>{cert.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Issuing Authority:</span>
                        <span className="font-medium">{cert.issuer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Valid Until:</span>
                        <span className="font-medium">{cert.validUntil}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Scope:</span>
                        <span className="font-medium">{cert.scope}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      <Download className="h-4 w-4 mr-2" />
                      Download Certificate
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="audits" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Audit Reports & Assessments</h2>
              <p className="text-gray-600">
                Regular independent audits ensure our continued compliance and security posture.
              </p>
            </div>
            
            <div className="space-y-4">
              {auditReports.map((report, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{report.title}</h4>
                          <Badge variant="outline">{report.type}</Badge>
                          <Badge 
                            variant="secondary" 
                            className={report.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                          >
                            {report.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{report.summary}</p>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>{report.date}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        {report.status === 'Published' && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="policies" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Compliance Policies</h2>
              <p className="text-gray-600">
                Comprehensive policies governing platform operations, user conduct, and data protection.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {policies.map((policy, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <FileText className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{policy.title}</CardTitle>
                        <CardDescription>{policy.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="font-medium">{policy.lastUpdated}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Applicable To:</span>
                        <span className="font-medium">{policy.applicableTo}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Policy
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Regulatory Commitments */}
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-slate-600" />
              <span>Our Regulatory Commitments</span>
            </CardTitle>
            <CardDescription>
              We are committed to maintaining the highest standards of compliance and professional conduct
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Continuous Monitoring</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Real-time compliance monitoring</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Automated regulatory updates</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Regular compliance assessments</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Professional Standards</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Ethical guidelines enforcement</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Professional conduct monitoring</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Continuing education support</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Data Protection</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Privacy by design principles</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>End-to-end encryption</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>Comprehensive audit trails</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-blue-600" />
              <span>Compliance & Legal Contact</span>
            </CardTitle>
            <CardDescription>
              For compliance questions, legal inquiries, or regulatory matters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Compliance Team</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>compliance@998p.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>+1 (555) 123-4567 ext. 201</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Legal Department</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>legal@998p.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>+1 (555) 123-4567 ext. 301</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button className="bg-slate-700 hover:bg-slate-800">
                Contact Compliance Team
              </Button>
              <Button variant="outline">
                Report Compliance Issue
              </Button>
              <Button variant="outline">
                Request Audit Information
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Legal Disclaimer</h4>
                <p className="text-gray-600 text-sm">
                  This page provides general information about our compliance commitments and regulatory framework. 
                  It does not constitute legal advice and should not be relied upon as such. Users should consult 
                  with qualified legal professionals for specific compliance requirements in their jurisdiction. 
                  Compliance requirements may vary by location, sector, and individual circumstances.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </StaticPageLayout>
  );
}
