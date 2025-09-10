import { 
  PROFESSIONAL_MODULES, 
  ProfessionalModule, 
  getProfessionalModuleById,
  getProfessionalModulesByCategory,
  getPopularModules,
  getRecommendedModules,
  getAvailableModules
} from '@/data/professionalModules';

// Enhanced subscription types as per business requirements
export type SubscriptionType = 'drive' | 'module-only' | 'data-storage' | 'team-management' | 'premium-addon';
export type SubscriptionStatus = 'active' | 'expired' | 'expiring' | 'cancelled' | 'pending' | 'trial';
export type BillingCycle = 'monthly' | 'annual' | 'one-time';
export type SubscriptionAction = 'purchase' | 'view' | 'upgrade' | 'downgrade' | 'renew' | 'cancel';
export type PaymentType = 'subscription' | 'addon' | 'renewal' | 'upgrade' | 'due_payment';

export interface UserSubscription {
  id: string;
  userId: string;
  entityId?: string;
  planId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  nextBillingDate?: Date;
  billingCycle: BillingCycle;
  price: number;
  currency: string;
  autoRenewal: boolean;
  features: string[];
  addOns: AddOnSubscription[];
  usageStats?: {
    storageUsed: number;
    teamMembers: number;
    entitiesUsed: number;
    apiCalls: number;
  };
  // For detailed display in MySubscriptions
  teamMemberNames?: string[];
  activeEntityNames?: string[];
  paymentMethod?: string;
  trialEndsAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
}

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  type: 'monthly' | 'one-time';
  category: string;
  icon?: string;
  features: string[];
  popular?: boolean;
  compatibility: string[]; // Compatible subscription types
}

export interface AddOnSubscription {
  id: string;
  addOnId: string;
  name: string;
  price: number;
  currency: string;
  status: SubscriptionStatus;
}

interface PaymentCycle {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'failed';
  type: 'subscription' | 'addon' | 'renewal' | 'upgrade';
}

interface BillingAction {
  type: 'pay_due' | 'pay_addon' | 'pay_renewal' | 'upgrade' | 'downgrade';
  subscriptionId: string;
  amount: number;
  description: string;
}

export interface SubscriptionPermissions {
  canPurchase: boolean;
  canManageTeam: boolean;
  canViewBilling: boolean;
  canCancelSubscriptions: boolean;
  canUpgradeDowngrade: boolean;
  canManageAutoRenewal: boolean;
  canViewPurchased: boolean;
  canAccessAddOns: boolean;
}

export interface BillingRecord {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  date: Date;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  invoiceUrl?: string;
  description: string;
  // Extended fields for richer billing history display
  // Name of the module/plan or add-on purchased in this invoice
  moduleName?: string;
  // Storage purchased (in GB) as part of this invoice, if applicable
  storagePurchasedGB?: number;
  // Number of team members added as part of this invoice, if applicable
  teamMembersAdded?: number;
  // Actual date of payment (can differ from invoice date), when status is 'paid'
  paidAt?: Date;
}

export interface BillingHistory {
  id: string;
  subscriptionId: string;
  invoiceNumber: string;
  date: Date;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  description: string;
  downloadUrl?: string;
  transactionId?: string;
}

export interface SubscriptionUsage {
  subscriptionId: string;
  period: string;
  storageUsed: number;
  storageLimit: number;
  teamMembers: number;
  teamMemberLimit: number;
  entitiesUsed: number;
  entityLimit: number;
  apiCalls: number;
  apiCallLimit: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  title: string;
  subscriptionType: SubscriptionType;
  category: 'drive' | 'module' | 'storage' | 'team' | 'addon' | 'bundle';
  type: 'individual' | 'bundle';
  pricing: {
    monthly: number;
    annual: number;
    oneTime?: number;
  };
  originalPrice?: number;
  currency: string;
  popular: boolean;
  recommended: boolean;
  description: string;
  shortDescription: string;
  features: string[];
  benefits: string[];
  limitations?: string[];
  inclusions: string[];
  exclusions?: string[];
  targetUsers: string[];
  integrations: string[];
  maxUsers?: number;
  maxEntities?: number;
  storage?: string;
  storageAmount?: number; // in GB
  support: string;
  trial: boolean;
  trialDays: number;
  status: 'available' | 'coming_soon' | 'beta';
  requirements?: string[];
  moduleIds?: string[]; // For bundle plans
  discount?: number;
  icon: string;
  href?: string;
  validity?: string;
  upgradeOptions?: string[];
  downgradeOptions?: string[];
  cancellationPolicy?: string;
  refundPolicy?: string;
  usageLimits?: {
    [key: string]: string | number;
  };
}

export interface SubscriptionStats {
  totalPlans: number;
  individualModules: number;
  bundlePlans: number;
  popularPlans: number;
  trialPlans: number;
}

export interface SubscriptionFilters {
  category?: string;
  priceRange?: string;
  type?: 'individual' | 'bundle' | 'all';
  popular?: boolean;
  trial?: boolean;
  searchTerm?: string;
  purchased?: boolean;
  available?: boolean;
}

export interface SubscriptionSettings {
  userId: string;
  globalAutoRenewal: boolean;
  moduleSpecificSettings: {
    [moduleId: string]: {
      autoRenewal: boolean;
      notifications: boolean;
      upgradeAlerts: boolean;
    };
  };
  paymentPreferences: {
    defaultPaymentMethod: string;
    autoPayDueBills: boolean;
    renewalReminders: boolean;
  };
  notificationSettings: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    inAppNotifications: boolean;
  };
}

export interface SubscriptionPackageAction {
  type: SubscriptionAction;
  available: boolean;
  label: string;
  description?: string;
  redirectUrl?: string;
}

export interface DueBill {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  dueDate: Date;
  type: PaymentType;
  description: string;
  status: 'pending' | 'overdue' | 'paid';
  paymentUrl?: string;
}

class SubscriptionService {
  // Generate individual module subscription plans
  private generateIndividualPlans(): SubscriptionPlan[] {
    // Only expose the exact modules approved for individual subscriptions
    const allowedTitles = new Set<string>([
      'Entity Management',
      'Meeting Management',
      'E-Voting System',
      'Claims Management',
      'Litigation Management',
      'Virtual Data Room',
      'Regulatory Compliance',
      'AR & Facilitators',
      'Timeline Management'
    ]);

    return PROFESSIONAL_MODULES
      .filter(module => allowedTitles.has(module.title))
      .map(module => ({
        id: module.id,
        name: module.name,
        title: module.title,
        subscriptionType: 'module-only' as SubscriptionType,
        category: 'module' as const,
        type: 'individual' as const,
        pricing: {
          monthly: module.pricing.monthly,
          annual: module.pricing.annual,
          oneTime: module.pricing.oneTime
        },
        currency: 'INR',
        popular: module.popular,
        recommended: module.recommended,
        description: module.description,
        shortDescription: module.shortDescription,
        features: module.features,
        benefits: module.benefits,
        limitations: module.limitations,
        inclusions: module.features,
        exclusions: module.limitations || [],
        targetUsers: module.targetUsers,
        integrations: module.integrations,
        maxUsers: module.maxUsers,
        storage: module.storage,
        support: module.support,
        trial: true,
        trialDays: module.trialDays,
        status: module.status,
        requirements: module.requirements,
        icon: module.icon,
        href: module.href,
        validity: '12 months',
        cancellationPolicy: 'Cancel anytime',
        refundPolicy: 'Prorated refund available'
      }));
  }

  // Generate Drive subscription plans (Full ERP Suite)
  private generateDrivePlans(): SubscriptionPlan[] {
    return [
      {
        id: 'drive-seeker-starter',
        name: 'Service Seeker Drive - Starter',
        title: 'Complete ERP Suite for Service Seekers',
        subscriptionType: 'drive',
        category: 'drive',
        type: 'bundle',
        pricing: {
          monthly: 2999,
          annual: 29990
        },
        currency: 'INR',
        popular: true,
        recommended: true,
        description: 'Complete professional ERP environment for Service Seekers with all modules and regular updates',
        shortDescription: 'Full ERP suite for service seekers',
        features: [
          'All Professional Service Modules',
          'Entity Management System',
          'Service Request Management',
          'Meeting & Collaboration Tools',
          'Claims Management',
          'Work Order Tracking',
          'Virtual Data Room',
          'Timeline Management',
          'Notification System',
          'Resource Sharing & Pooling',
          'Guidance & Reference Forum'
        ],
        benefits: [
          'Complete business solution',
          'All modules included',
          'Regular feature updates',
          'Priority support',
          'Cost-effective bundle pricing'
        ],
        inclusions: [
          'All current modules',
          'Future module releases',
          'Regular updates & patches',
          'Priority customer support',
          'Training materials',
          'API access'
        ],
        exclusions: [
          'Custom development',
          'Third-party integrations setup',
          'Data migration services'
        ],
        targetUsers: ['Service Seeker Individual/Partner', 'Service Seeker Entity Admin'],
        integrations: ['Email', 'Calendar', 'Document Management', 'Payment Systems'],
        maxUsers: 25,
        maxEntities: 10,
        storage: '100GB',
        storageAmount: 100,
        support: 'Priority Email & Chat Support',
        trial: true,
        trialDays: 30,
        status: 'available',
        moduleIds: PROFESSIONAL_MODULES.map(m => m.id),
        discount: 35,
        icon: 'Crown',
        validity: '12 months',
        upgradeOptions: ['drive-seeker-professional', 'drive-seeker-enterprise'],
        cancellationPolicy: 'Cancel anytime with 30-day notice',
        refundPolicy: 'Full refund within 30 days'
      },
      {
        id: 'drive-seeker-professional',
        name: 'Service Seeker Drive - Professional',
        title: 'Advanced ERP Suite for Growing Organizations',
        subscriptionType: 'drive',
        category: 'drive',
        type: 'bundle',
        pricing: {
          monthly: 4999,
          annual: 49990
        },
        currency: 'INR',
        popular: false,
        recommended: true,
        description: 'Advanced professional ERP environment with enhanced features and unlimited access',
        shortDescription: 'Advanced ERP suite with premium features',
        features: [
          'All Starter Drive features',
          'Advanced Analytics & Reporting',
          'Custom Workflow Automation',
          'Advanced Security Features',
          'Multi-entity Management',
          'Team Collaboration Tools',
          'Advanced Integration Options',
          'Custom Branding Options',
          'Advanced Notification System',
          'Priority Feature Requests'
        ],
        benefits: [
          'Enhanced productivity tools',
          'Advanced customization',
          'Unlimited entities',
          'Premium support',
          'Early access to new features'
        ],
        inclusions: [
          'All Starter Drive inclusions',
          'Advanced analytics',
          'Custom workflows',
          'Unlimited entities',
          'Premium support',
          'Early feature access'
        ],
        targetUsers: ['Service Seeker Entity Admin', 'Large Organizations'],
        integrations: ['Advanced CRM', 'ERP Systems', 'Custom APIs', 'Third-party Tools'],
        maxUsers: 100,
        storage: '500GB',
        storageAmount: 500,
        support: '24/7 Priority Support',
        trial: true,
        trialDays: 30,
        status: 'available',
        moduleIds: PROFESSIONAL_MODULES.map(m => m.id),
        discount: 40,
        icon: 'Sparkles',
        validity: '12 months',
        upgradeOptions: ['drive-seeker-enterprise'],
        downgradeOptions: ['drive-seeker-starter'],
        cancellationPolicy: 'Cancel anytime with 30-day notice',
        refundPolicy: 'Prorated refund available'
      },
      {
        id: 'drive-provider-starter',
        name: 'Service Provider Drive - Starter',
        title: 'Complete ERP Suite for Service Providers',
        subscriptionType: 'drive',
        category: 'drive',
        type: 'bundle',
        pricing: {
          monthly: 3499,
          annual: 34990
        },
        currency: 'INR',
        popular: true,
        recommended: true,
        description: 'Complete professional ERP environment for Service Providers with all modules and regular updates',
        shortDescription: 'Full ERP suite for service providers',
        features: [
          'All Professional Service Modules',
          'Entity Management System',
          'Service Request & Opportunity Management',
          'Work Order Management',
          'Meeting & Collaboration Tools',
          'Claims Management',
          'Virtual Data Room',
          'Timeline Management',
          'Resource Sharing & Pooling',
          'Guidance & Reference Forum',
          'Notification System'
        ],
        benefits: [
          'Complete business solution',
          'All modules included',
          'Regular feature updates',
          'Priority support',
          'Cost-effective bundle pricing'
        ],
        inclusions: [
          'All current modules',
          'Future module releases',
          'Regular updates & patches',
          'Priority customer support',
          'Training materials',
          'API access'
        ],
        exclusions: [
          'Custom development',
          'Third-party integrations setup',
          'Data migration services'
        ],
        targetUsers: ['Service Provider Individual/Partner', 'Service Provider Entity Admin'],
        integrations: ['Email', 'Calendar', 'Document Management', 'Payment Systems'],
        maxUsers: 25,
        maxEntities: 10,
        storage: '100GB',
        storageAmount: 100,
        support: 'Priority Email & Chat Support',
        trial: true,
        trialDays: 30,
        status: 'available',
        moduleIds: PROFESSIONAL_MODULES.map(m => m.id),
        discount: 35,
        icon: 'Crown',
        validity: '12 months',
        upgradeOptions: ['drive-provider-professional', 'drive-provider-enterprise'],
        cancellationPolicy: 'Cancel anytime with 30-day notice',
        refundPolicy: 'Full refund within 30 days'
      }
    ];
  }

  // Generate Data Storage subscription plans
  private generateDataStoragePlans(): SubscriptionPlan[] {
    return [
      {
        id: 'storage-basic',
        name: 'Basic Storage',
        title: 'Essential Cloud Storage',
        subscriptionType: 'data-storage',
        category: 'storage',
        type: 'individual',
        pricing: {
          monthly: 299,
          annual: 2990
        },
        currency: 'INR',
        popular: true,
        recommended: false,
        description: 'Secure cloud storage for your professional documents and data',
        shortDescription: 'Essential cloud storage solution',
        features: [
          '50GB secure cloud storage',
          'Document version control',
          'File sharing & collaboration',
          'Basic encryption',
          'Mobile & web access',
          'Automatic backup',
          'File recovery (30 days)'
        ],
        benefits: [
          'Secure document storage',
          'Access from anywhere',
          'Automatic backups',
          'Cost-effective solution'
        ],
        inclusions: [
          '50GB storage space',
          'SSL encryption',
          'File versioning',
          'Basic support',
          'Mobile apps'
        ],
        exclusions: [
          'Advanced security features',
          'Custom integrations',
          'Priority support'
        ],
        targetUsers: ['Individual Professionals', 'Small Teams'],
        integrations: ['Email', 'Mobile Apps', 'Web Browser'],
        storageAmount: 50,
        storage: '50GB',
        support: 'Email Support',
        trial: true,
        trialDays: 14,
        status: 'available',
        discount: 0,
        icon: 'Database',
        validity: '12 months',
        upgradeOptions: ['storage-professional', 'storage-enterprise'],
        cancellationPolicy: 'Cancel anytime',
        refundPolicy: 'Prorated refund available'
      },
      {
        id: 'storage-professional',
        name: 'Professional Storage',
        title: 'Advanced Cloud Storage',
        subscriptionType: 'data-storage',
        category: 'storage',
        type: 'individual',
        pricing: {
          monthly: 799,
          annual: 7990
        },
        currency: 'INR',
        popular: false,
        recommended: true,
        description: 'Advanced cloud storage with enhanced security and collaboration features',
        shortDescription: 'Professional cloud storage solution',
        features: [
          '250GB secure cloud storage',
          'Advanced encryption',
          'Team collaboration tools',
          'Advanced file sharing',
          'Document workflow management',
          'Audit trails & compliance',
          'Extended file recovery (90 days)',
          'API access',
          'Custom folder structures'
        ],
        benefits: [
          'Enhanced security',
          'Advanced collaboration',
          'Compliance ready',
          'Extended recovery options'
        ],
        inclusions: [
          '250GB storage space',
          'Advanced encryption',
          'Team collaboration',
          'Priority support',
          'API access',
          'Compliance features'
        ],
        targetUsers: ['Professional Teams', 'Growing Organizations'],
        integrations: ['CRM Systems', 'Document Management', 'API Integration'],
        storageAmount: 250,
        storage: '250GB',
        support: 'Priority Email & Chat Support',
        trial: true,
        trialDays: 30,
        status: 'available',
        discount: 20,
        icon: 'HardDrive',
        validity: '12 months',
        upgradeOptions: ['storage-enterprise'],
        downgradeOptions: ['storage-basic'],
        cancellationPolicy: 'Cancel anytime with 30-day notice',
        refundPolicy: 'Prorated refund available'
      },
      {
        id: 'storage-enterprise',
        name: 'Enterprise Storage',
        title: 'Enterprise Cloud Storage',
        subscriptionType: 'data-storage',
        category: 'storage',
        type: 'individual',
        pricing: {
          monthly: 1999,
          annual: 19990
        },
        currency: 'INR',
        popular: false,
        recommended: false,
        description: 'Enterprise-grade cloud storage with unlimited capacity and advanced features',
        shortDescription: 'Enterprise cloud storage solution',
        features: [
          '1TB+ secure cloud storage',
          'Military-grade encryption',
          'Advanced compliance tools',
          'Custom retention policies',
          'Advanced workflow automation',
          'Dedicated support team',
          'Unlimited file recovery',
          'Custom integrations',
          'White-label options',
          'SLA guarantee (99.9% uptime)'
        ],
        benefits: [
          'Unlimited scalability',
          'Enterprise security',
          'Dedicated support',
          'Custom solutions'
        ],
        inclusions: [
          '1TB+ storage space',
          'Military-grade encryption',
          'Dedicated support',
          'Custom integrations',
          'SLA guarantee',
          'White-label options'
        ],
        targetUsers: ['Large Enterprises', 'Government Organizations'],
        integrations: ['Enterprise Systems', 'Custom APIs', 'Third-party Tools'],
        storageAmount: 1024,
        storage: '1TB+',
        support: '24/7 Dedicated Support Team',
        trial: true,
        trialDays: 30,
        status: 'available',
        discount: 25,
        icon: 'Server',
        validity: '12 months',
        downgradeOptions: ['storage-professional', 'storage-basic'],
        cancellationPolicy: 'Cancel with 60-day notice',
        refundPolicy: 'Custom refund terms'
      }
    ];
  }

  // Generate Team Management subscription plans
  private generateTeamManagementPlans(): SubscriptionPlan[] {
    return [
      {
        id: 'team-basic',
        name: 'Basic Team Management',
        title: 'Essential Team & Role Management',
        subscriptionType: 'team-management',
        category: 'team',
        type: 'individual',
        pricing: {
          monthly: 499,
          annual: 4990
        },
        currency: 'INR',
        popular: true,
        recommended: false,
        description: 'Basic team structure and role management for small organizations',
        shortDescription: 'Essential team management tools',
        features: [
          'Up to 10 team members',
          'Basic role assignments',
          'Team member permissions',
          'Simple organizational structure',
          'Basic team collaboration',
          'Team activity tracking',
          'Email notifications'
        ],
        benefits: [
          'Organized team structure',
          'Clear role definitions',
          'Improved collaboration',
          'Basic access control'
        ],
        inclusions: [
          '10 team member seats',
          'Role-based permissions',
          'Basic team management',
          'Email support',
          'Team activity logs'
        ],
        exclusions: [
          'Advanced role customization',
          'Complex organizational charts',
          'Advanced reporting'
        ],
        targetUsers: ['Small Teams', 'Startups', 'Individual Partners with Teams'],
        integrations: ['Email', 'Basic Calendar', 'User Management'],
        maxUsers: 10,
        support: 'Email Support',
        trial: true,
        trialDays: 14,
        status: 'available',
        discount: 0,
        icon: 'Users',
        validity: '12 months',
        upgradeOptions: ['team-professional', 'team-enterprise'],
        cancellationPolicy: 'Cancel anytime',
        refundPolicy: 'Prorated refund available'
      },
      {
        id: 'team-professional',
        name: 'Professional Team Management',
        title: 'Advanced Team & Role Management',
        subscriptionType: 'team-management',
        category: 'team',
        type: 'individual',
        pricing: {
          monthly: 1299,
          annual: 12990
        },
        currency: 'INR',
        popular: false,
        recommended: true,
        description: 'Advanced team management with custom roles and organizational structures',
        shortDescription: 'Professional team management solution',
        features: [
          'Up to 50 team members',
          'Custom role creation',
          'Advanced permissions matrix',
          'Multi-level organizational structure',
          'Team performance analytics',
          'Advanced collaboration tools',
          'Workflow automation',
          'Custom approval processes',
          'Team resource allocation'
        ],
        benefits: [
          'Scalable team structure',
          'Custom role definitions',
          'Advanced analytics',
          'Workflow automation'
        ],
        inclusions: [
          '50 team member seats',
          'Custom role builder',
          'Advanced permissions',
          'Team analytics',
          'Priority support',
          'Workflow automation'
        ],
        targetUsers: ['Growing Organizations', 'Professional Services', 'Entity Admins'],
        integrations: ['Advanced CRM', 'HR Systems', 'Project Management'],
        maxUsers: 50,
        support: 'Priority Email & Chat Support',
        trial: true,
        trialDays: 30,
        status: 'available',
        discount: 20,
        icon: 'UserCheck',
        validity: '12 months',
        upgradeOptions: ['team-enterprise'],
        downgradeOptions: ['team-basic'],
        cancellationPolicy: 'Cancel anytime with 30-day notice',
        refundPolicy: 'Prorated refund available'
      },
      {
        id: 'team-enterprise',
        name: 'Enterprise Team Management',
        title: 'Enterprise Team & Role Management',
        subscriptionType: 'team-management',
        category: 'team',
        type: 'individual',
        pricing: {
          monthly: 2999,
          annual: 29990
        },
        currency: 'INR',
        popular: false,
        recommended: false,
        description: 'Enterprise-grade team management with unlimited users and advanced features',
        shortDescription: 'Enterprise team management solution',
        features: [
          'Unlimited team members',
          'Advanced role hierarchy',
          'Complex organizational charts',
          'Multi-entity team management',
          'Advanced analytics & reporting',
          'Custom workflow builder',
          'API for team management',
          'Single Sign-On (SSO)',
          'Advanced security controls',
          'Dedicated account manager'
        ],
        benefits: [
          'Unlimited scalability',
          'Enterprise security',
          'Advanced customization',
          'Dedicated support'
        ],
        inclusions: [
          'Unlimited team members',
          'Advanced role builder',
          'Enterprise analytics',
          'Custom workflows',
          'SSO integration',
          'Dedicated support'
        ],
        targetUsers: ['Large Enterprises', 'Government Organizations', 'Multi-national Companies'],
        integrations: ['Enterprise Systems', 'SSO Providers', 'Advanced APIs'],
        support: '24/7 Dedicated Support Team',
        trial: true,
        trialDays: 30,
        status: 'available',
        discount: 25,
        icon: 'Building',
        validity: '12 months',
        downgradeOptions: ['team-professional', 'team-basic'],
        cancellationPolicy: 'Cancel with 60-day notice',
        refundPolicy: 'Custom enterprise terms'
      }
    ];
  }


  // Generate premium add-on subscription plans
  private generatePremiumAddOnPlans(): SubscriptionPlan[] {
    return [
      {
        id: 'addon-add-entity',
        name: 'Add Entity Capacity',
        title: 'Add Entity',
        subscriptionType: 'premium-addon',
        category: 'addon',
        type: 'individual',
        pricing: {
          monthly: 499,
          annual: 4990
        },
        currency: 'INR',
        popular: false,
        recommended: true,
        description: 'Purchase additional entity capacity for your organization to manage more entities within the platform.',
        shortDescription: 'Purchase additional entity capacity',
        features: [
          'Adds +1 active entity capacity',
          'Immediate activation upon purchase',
          'Works across all subscribed modules',
          'Prorated billing when added mid-cycle'
        ],
        benefits: [
          'Scale entity management as you grow',
          'Flexible month-to-month or annual billing',
          'Consistent experience across modules'
        ],
        inclusions: [
          '+1 active entity capacity added to your account'
        ],
        exclusions: [
          'Does not include additional team seats',
          'Does not include storage expansion'
        ],
        targetUsers: ['Entity Admins', 'Growing Organizations'],
        integrations: ['Entity Management', 'Meeting Management', 'Work Order Management', 'Service Requests'],
        maxEntities: 1,
        support: 'Email Support',
        trial: false,
        trialDays: 0,
        status: 'available',
        icon: 'Building',
        validity: 'Per billing cycle',
        cancellationPolicy: 'Cancel anytime',
        refundPolicy: 'Prorated refund available',
        usageLimits: {
          entityIncrement: 1
        }
      },
      {
        id: 'addon-ai-assistant',
        name: 'AI Assistant Premium',
        title: 'Advanced AI-Powered Automation',
        subscriptionType: 'premium-addon',
        category: 'addon',
        type: 'individual',
        pricing: {
          monthly: 999,
          annual: 9990
        },
        currency: 'INR',
        popular: true,
        recommended: true,
        description: 'Advanced AI features including document analysis, smart automation, and predictive insights',
        shortDescription: 'AI-powered automation and insights',
        features: [
          'Smart document analysis & extraction',
          'Automated workflow suggestions',
          'Intelligent meeting summaries',
          'Predictive analytics & insights',
          'Natural language processing',
          'Smart task automation',
          'AI-powered search & recommendations',
          'Custom AI model training'
        ],
        benefits: [
          'Increased productivity',
          'Automated routine tasks',
          'Better decision making',
          'Time savings'
        ],
        inclusions: [
          'AI document processing',
          'Smart automation',
          'Predictive analytics',
          'Custom AI training',
          'API access'
        ],
        exclusions: [
          'Custom AI development',
          'Third-party AI integrations'
        ],
        targetUsers: ['Service Provider - Individual', 'Service Provider - Partnership', 'Service Provider - Company'],
        integrations: ['Third-party APIs', 'Custom integrations'],
        maxUsers: 50,
        storage: '1TB',
        support: '24/7 Priority Support',
        trial: true,
        trialDays: 14,
        status: 'available',
        requirements: ['Advanced technical knowledge'],
        icon: 'Zap',
        href: '/subscription/ai-automation',
        validity: '12 months',
        cancellationPolicy: 'Cancel anytime',
        refundPolicy: 'Prorated refund available'
      },
      {
        id: 'addon-advanced-analytics',
        name: 'Advanced Analytics Suite',
        title: 'Business Intelligence & Reporting',
        subscriptionType: 'premium-addon',
        category: 'addon',
        type: 'individual',
        pricing: {
          monthly: 799,
          annual: 7990
        },
        currency: 'INR',
        popular: false,
        recommended: true,
        description: 'Comprehensive analytics and business intelligence tools with custom dashboards',
        shortDescription: 'Advanced analytics and BI tools',
        features: [
          'Custom dashboard builder',
          'Advanced reporting engine',
          'Real-time analytics',
          'Data visualization tools',
          'Predictive modeling',
          'Performance metrics tracking',
          'Custom KPI monitoring',
          'Automated report generation',
          'Data export capabilities'
        ],
        benefits: [
          'Data-driven decisions',
          'Performance insights',
          'Custom reporting',
          'Business intelligence'
        ],
        inclusions: [
          'Custom dashboards',
          'Advanced reports',
          'Data visualization',
          'Export capabilities',
          'Real-time analytics'
        ],
        targetUsers: ['Entity Admins', 'Business Analysts', 'Management Teams'],
        integrations: ['All Platform Modules', 'External Data Sources'],
        support: 'Analytics Specialist Support',
        trial: true,
        trialDays: 21,
        status: 'available',
        discount: 20,
        icon: 'BarChart',
        validity: '12 months',
        cancellationPolicy: 'Cancel anytime',
        refundPolicy: 'Prorated refund available'
      },
      {
        id: 'addon-compliance-pro',
        name: 'Compliance Pro',
        title: 'Advanced Regulatory Compliance',
        subscriptionType: 'premium-addon',
        category: 'addon',
        type: 'individual',
        pricing: {
          monthly: 1499,
          annual: 14990
        },
        currency: 'INR',
        popular: false,
        recommended: false,
        description: 'Advanced compliance management with regulatory tracking and automated audit trails',
        shortDescription: 'Professional compliance management',
        features: [
          'Multi-jurisdiction compliance tracking',
          'Automated regulatory updates',
          'Custom compliance checklists',
          'Risk assessment tools',
          'Audit trail automation',
          'Compliance reporting',
          'Regulatory change notifications',
          'Document compliance verification'
        ],
        benefits: [
          'Regulatory compliance',
          'Risk mitigation',
          'Automated tracking',
          'Audit readiness'
        ],
        inclusions: [
          'Compliance tracking',
          'Automated updates',
          'Risk assessment',
          'Audit trails',
          'Regulatory reports'
        ],
        targetUsers: ['Legal Professionals', 'Compliance Officers', 'Entity Admins'],
        integrations: ['Legal Modules', 'Document Management', 'Regulatory APIs'],
        support: 'Compliance Specialist Support',
        trial: true,
        trialDays: 30,
        status: 'available',
        discount: 10,
        icon: 'Shield',
        validity: '12 months',
        cancellationPolicy: 'Cancel with 30-day notice',
        refundPolicy: 'Prorated refund available'
      },
      {
        id: 'addon-premium-support',
        name: 'Premium Support Package',
        title: '24/7 Dedicated Support',
        subscriptionType: 'premium-addon',
        category: 'addon',
        type: 'individual',
        pricing: {
          monthly: 599,
          annual: 5990
        },
        currency: 'INR',
        popular: true,
        recommended: false,
        description: 'Dedicated support with priority response times and personalized assistance',
        shortDescription: '24/7 premium support service',
        features: [
          '24/7 priority support',
          'Dedicated support agent',
          'Phone & video call support',
          'Custom training sessions',
          'Priority bug fixes',
          'Feature request priority',
          'System health monitoring',
          'Proactive support'
        ],
        benefits: [
          'Faster issue resolution',
          'Dedicated assistance',
          'Priority treatment',
          'Personalized support'
        ],
        inclusions: [
          '24/7 support access',
          'Dedicated agent',
          'Phone support',
          'Custom training',
          'Priority handling'
        ],
        targetUsers: ['All User Types', 'Mission-Critical Organizations'],
        integrations: ['All Platform Features'],
        support: '24/7 Dedicated Support Team',
        trial: true,
        trialDays: 7,
        status: 'available',
        discount: 0,
        icon: 'Headphones',
        validity: '12 months',
        cancellationPolicy: 'Cancel anytime',
        refundPolicy: 'Prorated refund available'
      }
    ];
  }

  // Generate bundle subscription plans
  private generateBundlePlans(): SubscriptionPlan[] {
    const coreModules = PROFESSIONAL_MODULES.filter(m => m.category === 'core');
    const professionalModules = PROFESSIONAL_MODULES.filter(m => m.category === 'professional');
    const enterpriseModules = PROFESSIONAL_MODULES.filter(m => m.category === 'enterprise');

    return [
      {
        id: 'starter-bundle',
        name: 'Starter Bundle',
        title: 'Starter Business Package',
        subscriptionType: 'module-only' as SubscriptionType,
        category: 'bundle' as const,
        type: 'bundle' as const,
        pricing: {
          monthly: 4999,
          annual: 49990
        },
        currency: 'INR',
        popular: false,
        recommended: true,
        description: 'Perfect starter package for small businesses and individual professionals',
        shortDescription: 'Essential modules for getting started',
        features: [
          'Entity Management',
          'Service Request Management', 
          'Basic Meeting Tools',
          'Up to 10 team members',
          'Email support',
          '10GB storage',
          'Basic reporting'
        ],
        benefits: [
          'Cost-effective entry point',
          'Essential business tools',
          'Easy to get started',
          'Scalable foundation'
        ],
        inclusions: [
          'Entity Management module',
          'Service Request Management',
          'Basic Meeting Tools',
          '10GB cloud storage',
          'Email support',
          'Basic reporting'
        ],
        targetUsers: ['Small Businesses', 'Individual Professionals', 'Startups'],
        integrations: ['Email', 'Calendar', 'Basic CRM'],
        maxUsers: 10,
        storage: '10GB',
        support: 'Email Support',
        trial: true,
        trialDays: 14,
        status: 'available',
        moduleIds: ['entity-management', 'service-requests'],
        discount: 20,
        icon: 'Package'
      },
      {
        id: 'professional-bundle',
        name: 'Professional Suite',
        title: 'Professional Business Suite',
        subscriptionType: 'module-only' as SubscriptionType,
        category: 'bundle' as const,
        type: 'bundle' as const,
        pricing: {
          monthly: 12999,
          annual: 129990
        },
        originalPrice: 15999,
        currency: 'INR',
        popular: true,
        recommended: true,
        description: 'Comprehensive professional services package for growing organizations',
        shortDescription: 'Complete professional toolkit',
        features: [
          'All Starter Bundle features',
          'Advanced Meeting Management',
          'Claims Management',
          'Work Order Management',
          'Virtual Data Room',
          'Timeline Management',
          'Up to 50 team members',
          'Priority support',
          '100GB storage',
          'Advanced reporting & analytics'
        ],
        benefits: [
          'Complete business solution',
          'Advanced collaboration tools',
          'Professional support',
          'Significant cost savings'
        ],
        inclusions: [
          'All Starter Bundle modules',
          'Advanced Meeting Management',
          'Claims Management',
          'Work Order Management',
          'Virtual Data Room',
          'Timeline Management',
          '100GB cloud storage',
          'Priority support',
          'Advanced reporting & analytics'
        ],
        targetUsers: ['Professional Services', 'Growing Companies', 'Legal Firms', 'Consulting Firms'],
        integrations: ['Advanced CRM', 'Document Management', 'Video Conferencing', 'Payment Systems'],
        maxUsers: 50,
        storage: '100GB',
        support: 'Priority Email & Chat Support',
        trial: true,
        trialDays: 30,
        status: 'available',
        moduleIds: ['entity-management', 'service-requests', 'meeting-management', 'claims-management', 'work-order-management', 'virtual-data-room', 'timeline-management'],
        discount: 30,
        icon: 'Crown'
      },
      {
        id: 'enterprise-bundle',
        name: 'Enterprise Complete',
        title: 'Enterprise Complete Solution',
        subscriptionType: 'module-only' as SubscriptionType,
        category: 'bundle' as const,
        type: 'bundle' as const,
        pricing: {
          monthly: 24999,
          annual: 249990
        },
        originalPrice: 35999,
        currency: 'INR',
        popular: false,
        recommended: false,
        description: 'Complete enterprise solution with all modules and premium features',
        shortDescription: 'Full enterprise platform',
        features: [
          'All Professional Suite features',
          'E-Voting System',
          'Litigation Management',
          'Resolution System',
          'Regulatory Compliance',
          'AR & Facilitators',
          'Unlimited team members',
          'Custom integrations',
          '1TB storage',
          '24/7 dedicated support',
          'White-label options',
          'SLA guarantee'
        ],
        benefits: [
          'Complete enterprise platform',
          'Maximum cost savings',
          'Dedicated support team',
          'Custom solutions'
        ],
        inclusions: [
          'All Professional Suite modules',
          'E-Voting System',
          'Litigation Management',
          'Resolution System',
          'Regulatory Compliance',
          'AR & Facilitators',
          '1TB cloud storage',
          '24/7 dedicated support',
          'White-label options',
          'SLA guarantee',
          'Custom integrations'
        ],
        targetUsers: ['Large Enterprises', 'Government Organizations', 'Multi-national Companies'],
        integrations: ['Enterprise Systems', 'Custom APIs', 'Advanced Security', 'Compliance Tools'],
        storage: '1TB',
        support: '24/7 Dedicated Support Team',
        trial: true,
        trialDays: 30,
        status: 'available',
        moduleIds: PROFESSIONAL_MODULES.map(m => m.id),
        discount: 40,
        icon: 'Sparkles'
      },
      {
        id: 'legal-specialist-bundle',
        name: 'Legal Specialist',
        title: 'Legal Practice Bundle',
        subscriptionType: 'module-only' as SubscriptionType,
        category: 'bundle' as const,
        type: 'bundle' as const,
        pricing: {
          monthly: 18999,
          annual: 189990
        },
        currency: 'INR',
        popular: false,
        recommended: true,
        description: 'Specialized bundle for legal practices and law firms',
        shortDescription: 'Legal practice essentials',
        features: [
          'Entity Management',
          'Claims Management',
          'Litigation Management',
          'Resolution System',
          'Virtual Data Room',
          'Regulatory Compliance',
          'Meeting Management',
          'Legal document templates',
          'Court filing integration',
          'Legal research tools'
        ],
        benefits: [
          'Legal practice focused',
          'Compliance ready',
          'Court integration',
          'Specialized support'
        ],
        inclusions: [
          'Entity Management',
          'Claims Management',
          'Litigation Management',
          'Resolution System',
          'Virtual Data Room',
          'Regulatory Compliance',
          'Meeting Management',
          '200GB cloud storage',
          'Legal document templates',
          'Court filing integration',
          'Legal research tools',
          'Legal Specialist Support'
        ],
        targetUsers: ['Law Firms', 'Legal Departments', 'Legal Consultants'],
        integrations: ['Court Systems', 'Legal Databases', 'Document Management'],
        maxUsers: 25,
        storage: '200GB',
        support: 'Legal Specialist Support',
        trial: true,
        trialDays: 21,
        status: 'available',
        moduleIds: ['entity-management', 'claims-management', 'litigation-management', 'resolution-system', 'virtual-data-room', 'regulatory-compliance', 'meeting-management'],
        requirements: ['Legal Practice License'],
        discount: 25,
        icon: 'Scale'
      }
    ];
  }

  // Get all subscription packages
  async getAllPackages(): Promise<SubscriptionPlan[]> {
    await this.simulateDelay();
    const drivePlans = this.generateDrivePlans();
    const individualPlans = this.generateIndividualPlans();
    const dataStoragePlans = this.generateDataStoragePlans();
    const teamManagementPlans = this.generateTeamManagementPlans();
    const premiumAddOnPlans = this.generatePremiumAddOnPlans();
    const bundlePlans = this.generateBundlePlans();
    
    return [
      ...drivePlans,
      ...dataStoragePlans,
      ...teamManagementPlans,
      ...premiumAddOnPlans,
      ...bundlePlans,
      ...individualPlans
    ];
  }

  // Get individual module packages
  async getIndividualPackages(): Promise<SubscriptionPlan[]> {
    await this.simulateDelay();
    return this.generateIndividualPlans();
  }

  // Get bundle packages
  async getBundlePackages(): Promise<SubscriptionPlan[]> {
    await this.simulateDelay();
    return this.generateBundlePlans();
  }

  // Get packages by category
  async getPackagesByCategory(category: string): Promise<SubscriptionPlan[]> {
    await this.simulateDelay();
    const allPackages = await this.getAllPackages();
    if (category === 'all') return allPackages;
    return allPackages.filter(plan => plan.category === category);
  }

  // Get popular packages
  async getPopularPackages(): Promise<SubscriptionPlan[]> {
    await this.simulateDelay();
    const allPackages = await this.getAllPackages();
    return allPackages.filter(plan => plan.popular);
  }

  // Get recommended packages
  async getRecommendedPackages(): Promise<SubscriptionPlan[]> {
    await this.simulateDelay();
    const allPackages = await this.getAllPackages();
    return allPackages.filter(plan => plan.recommended);
  }

  // Search packages
  async searchPackages(filters: SubscriptionFilters): Promise<SubscriptionPlan[]> {
    await this.simulateDelay();
    let plans = await this.getAllPackages();

    if (filters.category && filters.category !== 'all') {
      plans = plans.filter(plan => plan.category === filters.category);
    }

    if (filters.type && filters.type !== 'all') {
      plans = plans.filter(plan => plan.type === filters.type);
    }

    if (filters.popular) {
      plans = plans.filter(plan => plan.popular);
    }

    if (filters.trial) {
      plans = plans.filter(plan => plan.trial);
    }

    if (filters.priceRange && filters.priceRange !== 'all') {
      const [min, max] = this.parsePriceRange(filters.priceRange);
      plans = plans.filter(plan => 
        plan.pricing.monthly >= min && 
        (max === Infinity || plan.pricing.monthly <= max)
      );
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      plans = plans.filter(plan =>
        plan.name.toLowerCase().includes(term) ||
        plan.title.toLowerCase().includes(term) ||
        plan.description.toLowerCase().includes(term) ||
        plan.features.some(feature => feature.toLowerCase().includes(term))
      );
    }

    return plans;
  }

  // Get package by ID
  async getPackageById(planId: string): Promise<SubscriptionPlan | null> {
    await this.simulateDelay();
    const allPackages = await this.getAllPackages();
    return allPackages.find(plan => plan.id === planId) || null;
  }

  // Get subscription statistics
  async getSubscriptionStats(): Promise<SubscriptionStats> {
    await this.simulateDelay();
    const allPackages = await this.getAllPackages();
    const individualPackages = allPackages.filter(plan => plan.type === 'individual');
    const bundlePackages = allPackages.filter(plan => plan.type === 'bundle');

    return {
      totalPlans: allPackages.length,
      individualModules: individualPackages.length,
      bundlePlans: bundlePackages.length,
      popularPlans: allPackages.filter(plan => plan.popular).length,
      trialPlans: allPackages.filter(plan => plan.trial).length
    };
  }

  // Subscribe to package with payment cycle activation
  async subscribeToPackage(userId: string, planId: string, billingCycle: 'monthly' | 'annual', entityId?: string): Promise<{ success: boolean; paymentCycleActivated: boolean; subscriptionId?: string }> {
    await this.simulateDelay();
    
    // Simulate subscription creation
    const subscriptionId = `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Activate payment cycle automatically on purchase
    const paymentCycleResult = await this.activatePaymentCycle(subscriptionId);
    
    console.log(`Subscribing user ${userId} to package ${planId} with ${billingCycle} billing${entityId ? ` under entity ${entityId}` : ''}`);
    console.log(`Payment cycle activated: ${paymentCycleResult.success}`);
    
    return {
      success: true,
      paymentCycleActivated: paymentCycleResult.success,
      subscriptionId
    };
  }

  // Start trial
  async startTrial(userId: string, planId: string, entityId?: string): Promise<boolean> {
    await this.simulateDelay();
    console.log(`Starting trial for user ${userId} on plan ${planId}${entityId ? ` under entity ${entityId}` : ''}`);
    return true;
  }

  // Get packages by user role (6 roles: 3 Service Seeker + 3 Service Provider)
  async getPackagesByUserRole(userRole: string): Promise<SubscriptionPlan[]> {
    await this.simulateDelay();
    const allPackages = await this.getAllPackages();
    
    // Role-based filtering logic
    const roleBasedPackages = allPackages.filter(plan => {
      // Always include individual module plans for discoverability
      if (plan.type === 'individual' || plan.category === 'module') {
        return true;
      }

      const targetUsers = plan.targetUsers.map(user => user.toLowerCase());
      const role = userRole.toLowerCase();

      switch (role) {
        case 'service_seeker_individual_partner':
          return targetUsers.some(user => 
            user.includes('service seeker') || 
            user.includes('individual') || 
            user.includes('partner') ||
            user.includes('small') ||
            user.includes('startup')
          );
          
        case 'service_seeker_entity_admin':
          return targetUsers.some(user => 
            user.includes('service seeker') || 
            user.includes('entity admin') || 
            user.includes('organization') ||
            user.includes('growing') ||
            user.includes('professional')
          );
          
        case 'service_seeker_team_member':
          return targetUsers.some(user => 
            user.includes('team') || 
            user.includes('member') ||
            user.includes('small') ||
            user.includes('individual')
          );
          
        case 'service_provider_individual_partner':
          return targetUsers.some(user => 
            user.includes('service provider') || 
            user.includes('individual') || 
            user.includes('partner') ||
            user.includes('professional') ||
            user.includes('consultant')
          );
          
        case 'service_provider_entity_admin':
          return targetUsers.some(user => 
            user.includes('service provider') || 
            user.includes('entity admin') || 
            user.includes('organization') ||
            user.includes('business') ||
            user.includes('management')
          );
          
        case 'service_provider_team_member':
          return targetUsers.some(user => 
            user.includes('team') || 
            user.includes('member') ||
            user.includes('professional') ||
            user.includes('individual')
          );
          
        default:
          return true; // Show all plans for unknown roles
      }
    });
    
    return roleBasedPackages;
  }

  // Get recommended packages for user role
  async getRecommendedPackagesByRole(userRole: string): Promise<SubscriptionPlan[]> {
    await this.simulateDelay();
    const rolePackages = await this.getPackagesByUserRole(userRole);
    return rolePackages.filter(plan => plan.recommended);
  }

  // Get subscription permissions for a user role
  getSubscriptionPermissions(userRole: string): SubscriptionPermissions {
    const normalizedRole = userRole.toLowerCase();
    
    // Admin roles have full permissions
    if (normalizedRole.includes('admin')) {
      return {
        canPurchase: true,
        canManageTeam: true,
        canViewBilling: true,
        canCancelSubscriptions: true,
        canUpgradeDowngrade: true,
        canManageAutoRenewal: true,
        canViewPurchased: true,
        canAccessAddOns: true
      };
    }
    
    // Individual/Partner roles have most permissions except team management
    if (normalizedRole.includes('individual') || normalizedRole.includes('partner')) {
      return {
        canPurchase: true,
        canManageTeam: false,
        canViewBilling: true,
        canCancelSubscriptions: true,
        canUpgradeDowngrade: true,
        canManageAutoRenewal: true,
        canViewPurchased: true,
        canAccessAddOns: true
      };
    }
    
    // Team member roles have limited permissions
    return {
      canPurchase: false,
      canManageTeam: false,
      canViewBilling: false,
      canCancelSubscriptions: false,
      canUpgradeDowngrade: false,
      canManageAutoRenewal: false,
      canViewPurchased: true,
      canAccessAddOns: false
    };
  }

  // Get user's active subscriptions
  async getUserSubscriptions(userId: string): Promise<UserSubscription[]> {
    // Mock data for demonstration - in real app, this would fetch from API
    const drivePlan = await this.getPackageById('drive-seeker-starter');
    const storagePlan = await this.getPackageById('storage-basic');
    const aiPlan = await this.getPackageById('addon-ai-assistant');
    const entityPlan = await this.getPackageById('entity-management');
    const meetingPlan = await this.getPackageById('meeting-management');
    
    return [
      {
        id: 'sub-001',
        planId: 'drive-seeker-starter',
        userId: userId,
        status: 'active',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-12-15'),
        nextBillingDate: new Date('2024-09-15'),
        billingCycle: 'monthly',
        price: 49.99,
        currency: 'USD',
        autoRenewal: true,
        features: drivePlan?.features || [],
        addOns: [],
        teamMemberNames: ['Alice Johnson', 'Ravi Sharma', 'Priya Patel', 'Liam Brown', 'Noah Wilson'],
        activeEntityNames: ['Acme Ventures Pvt Ltd', 'BlueSky Industries LLP'],
        plan: drivePlan!
      },
      {
        id: 'sub-002',
        planId: 'storage-basic',
        userId: userId,
        status: 'active',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2025-02-01'),
        nextBillingDate: new Date('2025-02-01'),
        billingCycle: 'annual',
        price: 119.99,
        currency: 'USD',
        autoRenewal: false,
        features: storagePlan?.features || [],
        addOns: [],
        teamMemberNames: ['Alice Johnson', 'Ravi Sharma'],
        activeEntityNames: ['Acme Ventures Pvt Ltd'],
        plan: storagePlan!
      },
      {
        id: 'sub-003',
        planId: 'addon-ai-assistant',
        userId: userId,
        status: 'cancelled',
        startDate: new Date('2023-12-01'),
        endDate: new Date('2024-03-01'),
        nextBillingDate: null,
        billingCycle: 'monthly',
        price: 19.99,
        currency: 'USD',
        autoRenewal: false,
        features: aiPlan?.features || [],
        addOns: [],
        teamMemberNames: ['AI Service Account'],
        activeEntityNames: [],
        plan: aiPlan!
      }
      ,
      // Trial ended module requiring purchase: Entity Management
      {
        id: 'sub-004',
        planId: 'entity-management',
        userId: userId,
        status: 'expired',
        startDate: new Date('2025-08-01'),
        endDate: new Date('2025-08-15'), // trial ended
        nextBillingDate: null,
        billingCycle: 'monthly',
        price: 29.99,
        currency: 'USD',
        autoRenewal: false,
        features: entityPlan?.features || [],
        addOns: [],
        trialEndsAt: new Date('2025-08-15'),
        teamMemberNames: ['Alice Johnson', 'Ravi Sharma', 'Maya Iyer'],
        activeEntityNames: ['Acme Ventures Pvt Ltd', 'BlueSky Industries LLP', 'Nimbus Tech Pvt Ltd'],
        plan: entityPlan!
      },
      // Trial ended module requiring purchase: Meeting Management
      {
        id: 'sub-005',
        planId: 'meeting-management',
        userId: userId,
        status: 'expired',
        startDate: new Date('2025-07-20'),
        endDate: new Date('2025-08-03'), // trial ended
        nextBillingDate: null,
        billingCycle: 'monthly',
        price: 19.99,
        currency: 'USD',
        autoRenewal: false,
        features: meetingPlan?.features || [],
        addOns: [],
        trialEndsAt: new Date('2025-08-03'),
        teamMemberNames: ['Alice Johnson', 'Priya Patel'],
        activeEntityNames: ['Acme Ventures Pvt Ltd'],
        plan: meetingPlan!
      }
    ];
  }

  // Get subscription by ID
  async getSubscriptionById(subscriptionId: string): Promise<UserSubscription | null> {
    const userSubscriptions = await this.getUserSubscriptions('current-user'); // In real app, get actual user ID
    return userSubscriptions.find(sub => sub.id === subscriptionId) || null;
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string, reason?: string): Promise<boolean> {
    // Mock implementation - in real app, this would call API
    console.log(`Cancelling subscription ${subscriptionId}`, reason ? `Reason: ${reason}` : '');
    return true;
  }

  // Renew subscription
  async renewSubscription(subscriptionId: string): Promise<boolean> {
    // Mock implementation - in real app, this would call API
    console.log(`Renewing subscription ${subscriptionId}`);
    return true;
  }

  // Update auto-renewal setting
  async updateAutoRenewal(subscriptionId: string, autoRenewal: boolean): Promise<boolean> {
    // Mock implementation - in real app, this would call API
    console.log(`Updating auto-renewal for subscription ${subscriptionId} to ${autoRenewal}`);
    return true;
  }

  // Get billing history
  async getBillingHistory(userId: string): Promise<BillingRecord[]> {
    // Mock data for demonstration
    return [
      {
        id: 'bill-001',
        subscriptionId: 'sub-001',
        amount: 49.99,
        currency: 'USD',
        date: new Date('2024-08-15'),
        status: 'paid',
        invoiceUrl: '/invoices/bill-001.pdf',
        description: 'Service Seeker Drive - Starter (Monthly)',
        moduleName: 'Service Seeker Drive - Starter',
        storagePurchasedGB: 0,
        teamMembersAdded: 3,
        paidAt: new Date('2024-08-15')
      },
      {
        id: 'bill-002',
        subscriptionId: 'sub-002',
        amount: 119.99,
        currency: 'USD',
        date: new Date('2024-02-01'),
        status: 'paid',
        invoiceUrl: '/invoices/bill-002.pdf',
        description: 'Basic Storage (Annual)',
        moduleName: 'Basic Storage',
        storagePurchasedGB: 250,
        teamMembersAdded: 0,
        paidAt: new Date('2024-02-01')
      },
      {
        id: 'bill-003',
        subscriptionId: 'sub-003',
        amount: 19.99,
        currency: 'USD',
        date: new Date('2024-02-01'),
        status: 'paid',
        invoiceUrl: '/invoices/bill-003.pdf',
        description: 'AI Assistant Premium (Monthly)',
        moduleName: 'AI Assistant Premium',
        storagePurchasedGB: 0,
        teamMembersAdded: 1,
        paidAt: new Date('2024-02-01')
      }
    ];
  }

  // Helper methods
  private parsePriceRange(range: string): [number, number] {
    switch (range) {
      case '0-2000': return [0, 2000];
      case '2000-5000': return [2000, 5000];
      case '5000-10000': return [5000, 10000];
      case '10000-20000': return [10000, 20000];
      case '20000+': return [20000, Infinity];
      default: return [0, Infinity];
    }
  }

  private async simulateDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
  }

  // Get payment cycles for subscriptions
  getPaymentCycles(userId: string): PaymentCycle[] {
    return [
      {
        id: 'cycle-1',
        subscriptionId: 'sub-1',
        amount: 2999,
        currency: 'INR',
        dueDate: '2024-02-15',
        status: 'pending',
        type: 'subscription'
      },
      {
        id: 'cycle-2',
        subscriptionId: 'sub-2',
        amount: 599,
        currency: 'INR',
        dueDate: '2024-02-20',
        status: 'overdue',
        type: 'addon'
      },
      {
        id: 'cycle-3',
        subscriptionId: 'sub-1',
        amount: 2999,
        currency: 'INR',
        dueDate: '2024-03-15',
        status: 'pending',
        type: 'renewal'
      }
    ];
  }

  // Process billing actions
  async processBillingAction(action: BillingAction): Promise<{ success: boolean; message: string }> {
    await this.simulateDelay();
    
    // Simulate payment processing
    const success = Math.random() > 0.1; // 90% success rate
    
    if (success) {
      return {
        success: true,
        message: `Payment of ${action.amount} processed successfully for ${action.description}`
      };
    } else {
      return {
        success: false,
        message: 'Payment failed. Please check your payment method and try again.'
      };
    }
  }

  // Check if user has purchased a subscription
  async hasUserPurchased(userId: string, planId: string): Promise<boolean> {
    const userSubscriptions = await this.getUserSubscriptions(userId);
    return userSubscriptions.some(sub => sub.plan.id === planId && sub.status === 'active');
  }

  // Get subscription upgrade/downgrade options
  async getUpgradeDowngradeOptions(currentPlanId: string): Promise<SubscriptionPlan[]> {
    await this.simulateDelay();
    const currentPlan = await this.getPackageById(currentPlanId);
    if (!currentPlan) return [];
    
    const allPackages = await this.getAllPackages();
    const options: SubscriptionPlan[] = [];
    
    // Add upgrade options
    if (currentPlan.upgradeOptions) {
      for (const upgradeId of currentPlan.upgradeOptions) {
        const upgradePlan = allPackages.find(p => p.id === upgradeId);
        if (upgradePlan) options.push(upgradePlan);
      }
    }
    
    // Add downgrade options
    if (currentPlan.downgradeOptions) {
      for (const downgradeId of currentPlan.downgradeOptions) {
        const downgradePlan = allPackages.find(p => p.id === downgradeId);
        if (downgradePlan) options.push(downgradePlan);
      }
    }
    
    return options;
  }

  // Activate payment cycle for subscription
  async activatePaymentCycle(subscriptionId: string): Promise<{ success: boolean; message: string }> {
    await this.simulateDelay();
    
    return {
      success: true,
      message: 'Payment cycle activated successfully'
    };
  }

  // Get comprehensive add-ons with enhanced features (storage, automation, analytics)
  getComprehensiveAddOns(): AddOn[] {
    return [
      // Storage Add-ons
      {
        id: 'extra-storage-100gb',
        name: 'Extra Storage - 100GB',
        description: 'Additional 100GB cloud storage for documents and files',
        price: 299,
        currency: 'INR',
        type: 'monthly',
        category: 'storage',
        icon: 'HardDrive',
        features: [
          '100GB additional cloud storage',
          'Automatic backup',
          'File versioning',
          'Secure encryption'
        ],
        popular: true,
        compatibility: ['professional', 'drive', 'addon']
      },
      {
        id: 'extra-storage-500gb',
        name: 'Extra Storage - 500GB',
        description: 'Additional 500GB cloud storage for large enterprises',
        price: 999,
        currency: 'INR',
        type: 'monthly',
        category: 'storage',
        icon: 'Database',
        features: [
          '500GB additional cloud storage',
          'Priority backup',
          'Advanced file management',
          'Team collaboration features',
          'Secure encryption'
        ],
        compatibility: ['professional', 'drive', 'addon']
      },
      
      // Automation Add-ons
      {
        id: 'workflow-automation',
        name: 'Workflow Automation',
        description: 'Advanced workflow automation and business process triggers',
        price: 799,
        currency: 'INR',
        type: 'monthly',
        category: 'automation',
        icon: 'Zap',
        features: [
          'Custom workflow builder',
          'Automated task assignments',
          'Email notifications',
          'Integration triggers',
          'Conditional logic',
          'Performance tracking'
        ],
        popular: true,
        compatibility: ['professional', 'drive']
      },
      {
        id: 'smart-scheduling',
        name: 'Smart Scheduling',
        description: 'AI-powered scheduling and resource optimization',
        price: 599,
        currency: 'INR',
        type: 'monthly',
        category: 'automation',
        icon: 'Calendar',
        features: [
          'AI-powered scheduling',
          'Resource optimization',
          'Conflict resolution',
          'Calendar integration',
          'Automated reminders'
        ],
        compatibility: ['professional', 'drive']
      },
      
      // Analytics Add-ons
      {
        id: 'advanced-analytics',
        name: 'Advanced Analytics',
        description: 'Comprehensive business intelligence and detailed reporting',
        price: 899,
        currency: 'INR',
        type: 'monthly',
        category: 'analytics',
        icon: 'BarChart',
        features: [
          'Custom dashboard builder',
          'Advanced reporting tools',
          'Data visualization',
          'Performance metrics',
          'Trend analysis',
          'Export capabilities'
        ],
        popular: true,
        compatibility: ['professional', 'drive']
      },
      {
        id: 'predictive-analytics',
        name: 'Predictive Analytics',
        description: 'AI-powered predictive insights and forecasting',
        price: 1299,
        currency: 'INR',
        type: 'monthly',
        category: 'analytics',
        icon: 'TrendingUp',
        features: [
          'Predictive modeling',
          'Forecasting tools',
          'Risk analysis',
          'Market insights',
          'AI recommendations',
          'Custom algorithms'
        ],
        compatibility: ['professional', 'drive']
      },
      
      // Team Access Add-ons (optional during setup)
      {
        id: 'team-access-5',
        name: 'Team Access - 5 Users',
        description: 'Add 5 additional team members to your subscription (optional during setup)',
        price: 499,
        currency: 'INR',
        type: 'monthly',
        category: 'team',
        icon: 'Users',
        features: [
          '5 additional user seats',
          'Role-based permissions',
          'Team collaboration tools',
          'Shared workspaces',
          'Activity tracking',
          'Optional during initial setup'
        ],
        compatibility: ['professional', 'drive']
      },
      {
        id: 'team-access-unlimited',
        name: 'Unlimited Team Access',
        description: 'Unlimited team members with advanced collaboration features (optional during setup)',
        price: 1999,
        currency: 'INR',
        type: 'monthly',
        category: 'team',
        icon: 'Crown',
        features: [
          'Unlimited user seats',
          'Advanced role management',
          'Team analytics',
          'Custom permissions',
          'Enterprise collaboration',
          'Priority support',
          'Optional during initial setup'
        ],
        compatibility: ['drive']
      },
      
      // Integration Add-ons
      {
        id: 'api-integration',
        name: 'API Integration Suite',
        description: 'Advanced API integrations and custom connectors',
        price: 1199,
        currency: 'INR',
        type: 'monthly',
        category: 'integration',
        icon: 'Plug',
        features: [
          'Custom API integrations',
          'Third-party connectors',
          'Data synchronization',
          'Webhook support',
          'Real-time updates',
          'Developer tools'
        ],
        compatibility: ['professional', 'drive']
      },
      
      // Support Add-ons
      {
        id: 'priority-support',
        name: 'Priority Support',
        description: '24/7 priority support with dedicated account manager',
        price: 699,
        currency: 'INR',
        type: 'monthly',
        category: 'support',
        icon: 'Headphones',
        features: [
          '24/7 priority support',
          'Dedicated account manager',
          'Phone support',
          'Video consultations',
          'Custom training sessions',
          'SLA guarantee'
        ],
        compatibility: ['professional', 'drive']
      }
    ];
  }

  // Get subscription package actions (purchase/view options)
  getPackageActions(packageId: string, userId: string, userRole: string): SubscriptionPackageAction[] {
    const permissions = this.getSubscriptionPermissions(userRole);
    const actions: SubscriptionPackageAction[] = [];
    
    // Check if user already purchased this package
    const isPurchased = false; // This would be checked against user's subscriptions
    
    if (isPurchased && permissions.canViewPurchased) {
      actions.push({
        type: 'view',
        available: true,
        label: 'View Package',
        description: 'View details of your purchased package',
        redirectUrl: `/subscription/packages/${packageId}/details`
      });
    }
    
    if (!isPurchased && permissions.canPurchase) {
      actions.push({
        type: 'purchase',
        available: true,
        label: 'Purchase Package',
        description: 'Subscribe to this package - payment cycle will be activated',
        redirectUrl: `/subscription/packages/${packageId}/purchase`
      });
    }
    
    if (isPurchased && permissions.canUpgradeDowngrade) {
      actions.push({
        type: 'upgrade',
        available: true,
        label: 'Upgrade Package',
        description: 'Upgrade to a higher tier package'
      });
      
      actions.push({
        type: 'downgrade',
        available: true,
        label: 'Downgrade Package',
        description: 'Downgrade to a lower tier package'
      });
    }
    
    if (isPurchased && permissions.canCancelSubscriptions) {
      actions.push({
        type: 'renew',
        available: true,
        label: 'Renew Package',
        description: 'Renew your subscription'
      });
    }
    
    return actions;
  }
  
  // Get due bills for payment
  async getDueBills(userId: string): Promise<DueBill[]> {
    await this.simulateDelay();
    
    return [
      {
        id: 'bill-001',
        subscriptionId: 'sub-001',
        amount: 2999,
        currency: 'INR',
        dueDate: new Date('2024-09-15'),
        type: 'subscription',
        description: 'Service Seeker Drive - Monthly Subscription',
        status: 'pending',
        paymentUrl: '/payment/bill-001'
      },
      {
        id: 'bill-002',
        subscriptionId: 'sub-002',
        amount: 799,
        currency: 'INR',
        dueDate: new Date('2024-09-20'),
        type: 'addon',
        description: 'Advanced Analytics Add-on',
        status: 'overdue',
        paymentUrl: '/payment/bill-002'
      },
      {
        id: 'bill-003',
        subscriptionId: 'sub-001',
        amount: 2999,
        currency: 'INR',
        dueDate: new Date('2024-10-15'),
        type: 'renewal',
        description: 'Service Seeker Drive - Renewal',
        status: 'pending',
        paymentUrl: '/payment/bill-003'
      }
    ];
  }
  
  // Pay due bill
  async payDueBill(billId: string): Promise<{ success: boolean; message: string }> {
    await this.simulateDelay();
    
    const success = Math.random() > 0.1; // 90% success rate
    
    if (success) {
      return {
        success: true,
        message: `Bill ${billId} paid successfully`
      };
    } else {
      return {
        success: false,
        message: 'Payment failed. Please check your payment method and try again.'
      };
    }
  }
  
  // Get subscription settings
  async getSubscriptionSettings(userId: string): Promise<SubscriptionSettings> {
    await this.simulateDelay();
    
    return {
      userId,
      globalAutoRenewal: true,
      moduleSpecificSettings: {
        'entity-management': {
          autoRenewal: true,
          notifications: true,
          upgradeAlerts: true
        },
        'service-requests': {
          autoRenewal: false,
          notifications: true,
          upgradeAlerts: false
        },
        'meeting-management': {
          autoRenewal: true,
          notifications: false,
          upgradeAlerts: true
        }
      },
      paymentPreferences: {
        defaultPaymentMethod: 'credit_card',
        autoPayDueBills: true,
        renewalReminders: true
      },
      notificationSettings: {
        emailNotifications: true,
        smsNotifications: false,
        inAppNotifications: true
      }
    };
  }
  
  // Update subscription settings
  async updateSubscriptionSettings(userId: string, settings: Partial<SubscriptionSettings>): Promise<boolean> {
    await this.simulateDelay();
    console.log(`Updating subscription settings for user ${userId}:`, settings);
    return true;
  }
  
  // Update global auto-renewal setting
  async updateGlobalAutoRenewal(userId: string, enabled: boolean): Promise<boolean> {
    await this.simulateDelay();
    console.log(`Updating global auto-renewal for user ${userId} to ${enabled}`);
    return true;
  }
  
  // Update module-specific auto-renewal
  async updateModuleAutoRenewal(userId: string, moduleId: string, enabled: boolean): Promise<boolean> {
    await this.simulateDelay();
    console.log(`Updating auto-renewal for module ${moduleId} for user ${userId} to ${enabled}`);
    return true;
  }
  
  // Get purchased packages for user
  async getPurchasedPackages(userId: string): Promise<SubscriptionPlan[]> {
    await this.simulateDelay();
    const userSubscriptions = await this.getUserSubscriptions(userId);
    return userSubscriptions.filter(sub => sub.status === 'active').map(sub => sub.plan);
  }
  
  // Get available packages (not purchased)
  async getAvailablePackages(userId: string): Promise<SubscriptionPlan[]> {
    await this.simulateDelay();
    const allPackages = await this.getAllPackages();
    const purchasedPackages = await this.getPurchasedPackages(userId);
    const purchasedIds = purchasedPackages.map(p => p.id);
    
    return allPackages.filter(pkg => !purchasedIds.includes(pkg.id));
  }
  
  // Upgrade subscription
  async upgradeSubscription(subscriptionId: string, newPlanId: string): Promise<{ success: boolean; message: string }> {
    await this.simulateDelay();
    
    const success = Math.random() > 0.05; // 95% success rate
    
    if (success) {
      return {
        success: true,
        message: `Subscription ${subscriptionId} upgraded to ${newPlanId} successfully`
      };
    } else {
      return {
        success: false,
        message: 'Upgrade failed. Please try again later.'
      };
    }
  }
  
  // Downgrade subscription
  async downgradeSubscription(subscriptionId: string, newPlanId: string): Promise<{ success: boolean; message: string }> {
    await this.simulateDelay();
    
    const success = Math.random() > 0.05; // 95% success rate
    
    if (success) {
      return {
        success: true,
        message: `Subscription ${subscriptionId} downgraded to ${newPlanId} successfully`
      };
    } else {
      return {
        success: false,
        message: 'Downgrade failed. Please try again later.'
      };
    }
  }
}

export const subscriptionService = new SubscriptionService();
