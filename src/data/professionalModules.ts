import { 
  Building, 
  Calendar, 
  Vote, 
  FolderOpen, 
  AlertTriangle, 
  Clock, 
  UserCheck, 
  Scale, 
  Users,
  FileText,
  Briefcase
} from "lucide-react";

export interface ProfessionalModule {
  id: string;
  name: string;
  title: string;
  description: string;
  shortDescription: string;
  icon: string;
  iconComponent: React.ComponentType<{ className?: string }>;
  href: string;
  category: 'core' | 'professional' | 'enterprise' | 'addon';
  pricing: {
    monthly: number;
    annual: number;
    oneTime?: number;
  };
  features: string[];
  limitations?: string[];
  benefits: string[];
  targetUsers: string[];
  integrations: string[];
  trialDays: number;
  popular: boolean;
  recommended: boolean;
  status: 'available' | 'coming_soon' | 'beta';
  requirements?: string[];
  maxUsers?: number;
  storage?: string;
  support: string;
}

export const PROFESSIONAL_MODULES: ProfessionalModule[] = [
  {
    id: "entity-management",
    name: "My Entity",
    title: "Entity Management",
    description: "Comprehensive entity management and compliance tracking system for organizations",
    shortDescription: "Manage entities, compliance, and organizational structure",
    icon: "Building",
    iconComponent: Building,
    href: "/entity-management",
    category: "core",
    pricing: {
      monthly: 2999,
      annual: 29990,
    },
    features: [
      "Entity Creation & Management",
      "Compliance Tracking",
      "Document Management",
      "Team Management",
      "Organizational Structure",
      "Audit Trail",
      "Custom Fields",
      "Bulk Operations"
    ],
    benefits: [
      "Streamlined entity management",
      "Automated compliance tracking",
      "Centralized document storage",
      "Team collaboration tools"
    ],
    targetUsers: [
      "Entity Administrators",
      "Compliance Officers",
      "Legal Teams",
      "Corporate Secretaries"
    ],
    integrations: [
      "Document Management",
      "Compliance System",
      "Meeting Management",
      "Audit Trail"
    ],
    trialDays: 30,
    popular: true,
    recommended: true,
    status: "available",
    maxUsers: 50,
    storage: "10GB",
    support: "Priority Email & Chat"
  },
  {
    id: "meeting-management",
    name: "Meetings",
    title: "Meeting Management",
    description: "Advanced meeting scheduling, management, and collaboration platform",
    shortDescription: "Schedule and manage meetings with advanced features",
    icon: "Calendar",
    iconComponent: Calendar,
    href: "/meetings",
    category: "professional",
    pricing: {
      monthly: 1999,
      annual: 19990,
    },
    features: [
      "Meeting Scheduling",
      "Video Conferencing Integration",
      "Minutes Recording",
      "Attendance Tracking",
      "Agenda Management",
      "Action Items",
      "Document Sharing",
      "Meeting Analytics"
    ],
    benefits: [
      "Efficient meeting coordination",
      "Automated minute taking",
      "Better meeting outcomes",
      "Time management"
    ],
    targetUsers: [
      "Meeting Organizers",
      "Board Members",
      "Project Managers",
      "Team Leaders"
    ],
    integrations: [
      "Calendar Systems",
      "Video Conferencing",
      "Document Storage",
      "Email Notifications"
    ],
    trialDays: 14,
    popular: true,
    recommended: false,
    status: "available",
    maxUsers: 100,
    storage: "5GB",
    support: "Email Support"
  },
  {
    id: "claims-management",
    name: "Claims Management",
    title: "Claims Management",
    description: "Comprehensive claims processing, tracking, and dispute resolution system",
    shortDescription: "Handle claims and disputes efficiently",
    icon: "AlertTriangle",
    iconComponent: AlertTriangle,
    href: "/claims",
    category: "professional",
    pricing: {
      monthly: 3499,
      annual: 34990,
    },
    features: [
      "Claim Filing & Processing",
      "Document Upload & Management",
      "Status Tracking",
      "Dispute Resolution",
      "Automated Workflows",
      "Reporting & Analytics",
      "Multi-party Claims",
      "AI-powered Verification"
    ],
    benefits: [
      "Faster claim processing",
      "Reduced manual work",
      "Better dispute resolution",
      "Comprehensive tracking"
    ],
    targetUsers: [
      "Claims Processors",
      "Legal Teams",
      "Dispute Resolvers",
      "Administrators"
    ],
    integrations: [
      "Document Management",
      "Payment Systems",
      "Legal Databases",
      "Notification Systems"
    ],
    trialDays: 30,
    popular: false,
    recommended: true,
    status: "available",
    maxUsers: 25,
    storage: "20GB",
    support: "Priority Support"
  },
  {
    id: "e-voting",
    name: "E-Voting",
    title: "E-Voting System",
    description: "Secure electronic voting platform for organizational decisions and governance",
    shortDescription: "Secure electronic voting for organizational decisions",
    icon: "Vote",
    iconComponent: Vote,
    href: "/voting",
    category: "enterprise",
    pricing: {
      monthly: 4999,
      annual: 49990,
    },
    features: [
      "Secure Voting Platform",
      "Real-time Results",
      "Voter Authentication",
      "Audit Trail",
      "Multiple Voting Methods",
      "Anonymous Voting",
      "Blockchain Security",
      "Compliance Reporting"
    ],
    benefits: [
      "Secure voting process",
      "Transparent results",
      "Reduced costs",
      "Increased participation"
    ],
    targetUsers: [
      "Board Members",
      "Shareholders",
      "Committee Members",
      "Administrators"
    ],
    integrations: [
      "Identity Verification",
      "Blockchain Networks",
      "Audit Systems",
      "Reporting Tools"
    ],
    trialDays: 14,
    popular: false,
    recommended: false,
    status: "available",
    requirements: ["Enhanced Security Package"],
    maxUsers: 1000,
    storage: "50GB",
    support: "24/7 Priority Support"
  },
  {
    id: "virtual-data-room",
    name: "Virtual Data Room",
    title: "Virtual Data Room",
    description: "Secure document storage, sharing, and collaboration platform",
    shortDescription: "Secure document storage and collaboration",
    icon: "FolderOpen",
    iconComponent: FolderOpen,
    href: "/data-room",
    category: "professional",
    pricing: {
      monthly: 2499,
      annual: 24990,
    },
    features: [
      "Secure Document Storage",
      "Access Control",
      "Document Versioning",
      "Watermarking",
      "Download Tracking",
      "Bulk Upload",
      "Advanced Search",
      "Activity Monitoring"
    ],
    benefits: [
      "Enhanced security",
      "Controlled access",
      "Document tracking",
      "Collaboration tools"
    ],
    targetUsers: [
      "Legal Teams",
      "Investment Bankers",
      "Due Diligence Teams",
      "Corporate Development"
    ],
    integrations: [
      "Document Scanners",
      "Email Systems",
      "Audit Tools",
      "Security Systems"
    ],
    trialDays: 21,
    popular: false,
    recommended: false,
    status: "available",
    maxUsers: 50,
    storage: "100GB",
    support: "Priority Email & Chat"
  },
  {
    id: "timeline-management",
    name: "Timeline Management",
    title: "Timeline Management",
    description: "Project timeline tracking and milestone management system",
    shortDescription: "Track project timelines and milestones",
    icon: "Clock",
    iconComponent: Clock,
    href: "/timeline",
    category: "professional",
    pricing: {
      monthly: 1799,
      annual: 17990,
    },
    features: [
      "Timeline Creation",
      "Milestone Tracking",
      "Dependency Management",
      "Progress Monitoring",
      "Resource Allocation",
      "Gantt Charts",
      "Critical Path Analysis",
      "Team Collaboration"
    ],
    benefits: [
      "Better project planning",
      "Improved delivery times",
      "Resource optimization",
      "Risk mitigation"
    ],
    targetUsers: [
      "Project Managers",
      "Team Leaders",
      "Resource Managers",
      "Stakeholders"
    ],
    integrations: [
      "Calendar Systems",
      "Resource Management",
      "Reporting Tools",
      "Communication Platforms"
    ],
    trialDays: 14,
    popular: false,
    recommended: false,
    status: "available",
    maxUsers: 30,
    storage: "5GB",
    support: "Email Support"
  },
  {
    id: "ar-facilitators",
    name: "AR & Facilitators",
    title: "AR & Facilitators",
    description: "Authorized representative and facilitator management system",
    shortDescription: "Manage authorized representatives and facilitators",
    icon: "UserCheck",
    iconComponent: UserCheck,
    href: "/ar-facilitators",
    category: "professional",
    pricing: {
      monthly: 2299,
      annual: 22990,
    },
    features: [
      "AR Selection Process",
      "Facilitator Management",
      "Qualification Tracking",
      "Performance Monitoring",
      "Compliance Verification",
      "Document Management",
      "Communication Tools",
      "Reporting Dashboard"
    ],
    benefits: [
      "Streamlined AR selection",
      "Better compliance",
      "Performance tracking",
      "Efficient communication"
    ],
    targetUsers: [
      "Corporate Administrators",
      "Compliance Teams",
      "Legal Departments",
      "Board Members"
    ],
    integrations: [
      "Identity Verification",
      "Document Systems",
      "Communication Platforms",
      "Compliance Databases"
    ],
    trialDays: 21,
    popular: false,
    recommended: false,
    status: "available",
    maxUsers: 20,
    storage: "10GB",
    support: "Priority Email Support"
  },
  {
    id: "litigation-management",
    name: "Litigation Management",
    title: "Litigation Management",
    description: "Comprehensive litigation case management and tracking system",
    shortDescription: "Manage litigation cases and legal proceedings",
    icon: "Scale",
    iconComponent: Scale,
    href: "/litigation",
    category: "enterprise",
    pricing: {
      monthly: 3999,
      annual: 39990,
    },
    features: [
      "Case Management",
      "Document Discovery",
      "Timeline Tracking",
      "Evidence Management",
      "Court Filing Integration",
      "Legal Research Tools",
      "Billing Integration",
      "Compliance Monitoring"
    ],
    benefits: [
      "Organized case management",
      "Efficient document handling",
      "Better case outcomes",
      "Cost management"
    ],
    targetUsers: [
      "Litigation Lawyers",
      "Paralegals",
      "Legal Assistants",
      "Law Firms"
    ],
    integrations: [
      "Court Systems",
      "Legal Databases",
      "Billing Systems",
      "Document Management"
    ],
    trialDays: 30,
    popular: false,
    recommended: false,
    status: "available",
    requirements: ["Legal Practice License"],
    maxUsers: 15,
    storage: "50GB",
    support: "24/7 Legal Support"
  },
  {
    id: "resolution-system",
    name: "Resolution System",
    title: "Resolution System",
    description: "Dispute resolution and mediation management platform",
    shortDescription: "Handle dispute resolution and mediation processes",
    icon: "UserCheck",
    iconComponent: UserCheck,
    href: "/resolution",
    category: "enterprise",
    pricing: {
      monthly: 3299,
      annual: 32990,
    },
    features: [
      "EOI Management",
      "PRA Evaluation",
      "Plan Analysis",
      "Stakeholder Communication",
      "Document Management",
      "Timeline Tracking",
      "Compliance Monitoring",
      "Reporting Tools"
    ],
    benefits: [
      "Efficient resolution process",
      "Better stakeholder management",
      "Compliance assurance",
      "Transparent communication"
    ],
    targetUsers: [
      "Resolution Professionals",
      "Mediators",
      "Legal Teams",
      "Administrators"
    ],
    integrations: [
      "Legal Databases",
      "Communication Systems",
      "Document Management",
      "Compliance Tools"
    ],
    trialDays: 30,
    popular: false,
    recommended: false,
    status: "available",
    requirements: ["Resolution Professional License"],
    maxUsers: 25,
    storage: "30GB",
    support: "Priority Legal Support"
  },
  {
    id: "regulatory-compliance",
    name: "Regulatory Compliance",
    title: "Regulatory Compliance",
    description: "Comprehensive regulatory compliance management and monitoring system",
    shortDescription: "Manage regulatory compliance and monitoring",
    icon: "Building",
    iconComponent: Building,
    href: "/compliance",
    category: "enterprise",
    pricing: {
      monthly: 2799,
      annual: 27990,
    },
    features: [
      "Compliance Tracking",
      "Regulatory Updates",
      "Risk Assessment",
      "Audit Management",
      "Policy Management",
      "Training Modules",
      "Incident Reporting",
      "Dashboard Analytics"
    ],
    benefits: [
      "Automated compliance",
      "Risk mitigation",
      "Audit readiness",
      "Regulatory updates"
    ],
    targetUsers: [
      "Compliance Officers",
      "Risk Managers",
      "Audit Teams",
      "Legal Departments"
    ],
    integrations: [
      "Regulatory Databases",
      "Audit Systems",
      "Risk Management",
      "Training Platforms"
    ],
    trialDays: 21,
    popular: false,
    recommended: false,
    status: "available",
    maxUsers: 40,
    storage: "25GB",
    support: "Compliance Expert Support"
  },
  {
    id: "work-order-management",
    name: "Work Orders",
    title: "Work Order Management",
    description: "Comprehensive work order creation, tracking, and management system",
    shortDescription: "Create and manage work orders efficiently",
    icon: "Users",
    iconComponent: Users,
    href: "/work-orders",
    category: "core",
    pricing: {
      monthly: 2499,
      annual: 24990,
    },
    features: [
      "Work Order Creation",
      "Progress Tracking",
      "Team Allocation",
      "Payment Management",
      "Document Management",
      "Client Communication",
      "Status Updates",
      "Performance Analytics"
    ],
    benefits: [
      "Streamlined work management",
      "Better client communication",
      "Efficient team allocation",
      "Payment tracking"
    ],
    targetUsers: [
      "Service Providers",
      "Project Managers",
      "Team Leaders",
      "Clients"
    ],
    integrations: [
      "Payment Systems",
      "Communication Tools",
      "Document Management",
      "Analytics Platforms"
    ],
    trialDays: 21,
    popular: true,
    recommended: false,
    status: "available",
    maxUsers: 30,
    storage: "15GB",
    support: "Priority Email & Chat"
  },
  {
    id: "service-requests",
    name: "Service Requests",
    title: "Service Request Management",
    description: "Service request creation, bidding, and opportunity management platform",
    shortDescription: "Manage service requests and opportunities",
    icon: "FileText",
    iconComponent: FileText,
    href: "/service-requests",
    category: "core",
    pricing: {
      monthly: 1999,
      annual: 19990,
    },
    features: [
      "Service Request Creation",
      "Bid Management",
      "Opportunity Tracking",
      "Client Matching",
      "Proposal Tools",
      "Communication Hub",
      "Performance Metrics",
      "Payment Integration"
    ],
    benefits: [
      "Better client matching",
      "Efficient bidding process",
      "Opportunity tracking",
      "Revenue optimization"
    ],
    targetUsers: [
      "Service Seekers",
      "Service Providers",
      "Business Development",
      "Sales Teams"
    ],
    integrations: [
      "CRM Systems",
      "Payment Gateways",
      "Communication Platforms",
      "Analytics Tools"
    ],
    trialDays: 14,
    popular: true,
    recommended: true,
    status: "available",
    maxUsers: 25,
    storage: "10GB",
    support: "Email & Chat Support"
  }
];

// Helper functions
export const getProfessionalModuleById = (id: string): ProfessionalModule | undefined => {
  return PROFESSIONAL_MODULES.find(module => module.id === id);
};

export const getProfessionalModulesByCategory = (category: string): ProfessionalModule[] => {
  if (category === 'all') return PROFESSIONAL_MODULES;
  return PROFESSIONAL_MODULES.filter(module => module.category === category);
};

export const getPopularModules = (): ProfessionalModule[] => {
  return PROFESSIONAL_MODULES.filter(module => module.popular);
};

export const getRecommendedModules = (): ProfessionalModule[] => {
  return PROFESSIONAL_MODULES.filter(module => module.recommended);
};

export const getAvailableModules = (): ProfessionalModule[] => {
  return PROFESSIONAL_MODULES.filter(module => module.status === 'available');
};

export const getModulesByPriceRange = (minPrice: number, maxPrice: number): ProfessionalModule[] => {
  return PROFESSIONAL_MODULES.filter(module => 
    module.pricing.monthly >= minPrice && module.pricing.monthly <= maxPrice
  );
};

// Module categories for filtering
export const MODULE_CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'core', label: 'Core Modules' },
  { value: 'professional', label: 'Professional Modules' },
  { value: 'enterprise', label: 'Enterprise Modules' },
  { value: 'addon', label: 'Add-on Modules' }
];

// Price ranges for filtering
export const PRICE_RANGES = [
  { value: 'all', label: 'All Prices' },
  { value: '0-2000', label: 'Under ₹2,000' },
  { value: '2000-3000', label: '₹2,000 - ₹3,000' },
  { value: '3000-4000', label: '₹3,000 - ₹4,000' },
  { value: '4000+', label: 'Above ₹4,000' }
];
