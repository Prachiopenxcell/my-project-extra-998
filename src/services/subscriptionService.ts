import { 
  PROFESSIONAL_MODULES, 
  ProfessionalModule, 
  getProfessionalModuleById,
  getProfessionalModulesByCategory,
  getPopularModules,
  getRecommendedModules,
  getAvailableModules
} from '@/data/professionalModules';

export interface SubscriptionPlan {
  id: string;
  name: string;
  title: string;
  category: 'core' | 'professional' | 'enterprise' | 'addon' | 'bundle';
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
  targetUsers: string[];
  integrations: string[];
  maxUsers?: number;
  maxEntities?: number;
  storage?: string;
  support: string;
  trial: boolean;
  trialDays: number;
  status: 'available' | 'coming_soon' | 'beta';
  requirements?: string[];
  moduleIds?: string[]; // For bundle plans
  discount?: number;
  icon: string;
  href?: string;
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
}

class SubscriptionService {
  // Generate individual module subscription plans
  private generateIndividualPlans(): SubscriptionPlan[] {
    return PROFESSIONAL_MODULES.map(module => ({
      id: module.id,
      name: module.name,
      title: module.title,
      category: module.category as 'core' | 'professional' | 'enterprise' | 'addon',
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
      href: module.href
    }));
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

  // Get all subscription plans
  async getAllPlans(): Promise<SubscriptionPlan[]> {
    await this.simulateDelay();
    const individualPlans = this.generateIndividualPlans();
    const bundlePlans = this.generateBundlePlans();
    return [...bundlePlans, ...individualPlans];
  }

  // Get individual module plans
  async getIndividualPlans(): Promise<SubscriptionPlan[]> {
    await this.simulateDelay();
    return this.generateIndividualPlans();
  }

  // Get bundle plans
  async getBundlePlans(): Promise<SubscriptionPlan[]> {
    await this.simulateDelay();
    return this.generateBundlePlans();
  }

  // Get plans by category
  async getPlansByCategory(category: string): Promise<SubscriptionPlan[]> {
    await this.simulateDelay();
    const allPlans = await this.getAllPlans();
    if (category === 'all') return allPlans;
    return allPlans.filter(plan => plan.category === category);
  }

  // Get popular plans
  async getPopularPlans(): Promise<SubscriptionPlan[]> {
    await this.simulateDelay();
    const allPlans = await this.getAllPlans();
    return allPlans.filter(plan => plan.popular);
  }

  // Get recommended plans
  async getRecommendedPlans(): Promise<SubscriptionPlan[]> {
    await this.simulateDelay();
    const allPlans = await this.getAllPlans();
    return allPlans.filter(plan => plan.recommended);
  }

  // Search plans
  async searchPlans(filters: SubscriptionFilters): Promise<SubscriptionPlan[]> {
    await this.simulateDelay();
    let plans = await this.getAllPlans();

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

  // Get plan by ID
  async getPlanById(planId: string): Promise<SubscriptionPlan | null> {
    await this.simulateDelay();
    const allPlans = await this.getAllPlans();
    return allPlans.find(plan => plan.id === planId) || null;
  }

  // Get subscription statistics
  async getSubscriptionStats(): Promise<SubscriptionStats> {
    await this.simulateDelay();
    const allPlans = await this.getAllPlans();
    const individualPlans = allPlans.filter(plan => plan.type === 'individual');
    const bundlePlans = allPlans.filter(plan => plan.type === 'bundle');

    return {
      totalPlans: allPlans.length,
      individualModules: individualPlans.length,
      bundlePlans: bundlePlans.length,
      popularPlans: allPlans.filter(plan => plan.popular).length,
      trialPlans: allPlans.filter(plan => plan.trial).length
    };
  }

  // Subscribe to plan
  async subscribeToPlan(userId: string, planId: string, billingCycle: 'monthly' | 'annual', entityId?: string): Promise<boolean> {
    await this.simulateDelay();
    console.log(`Subscribing user ${userId} to plan ${planId} with ${billingCycle} billing${entityId ? ` under entity ${entityId}` : ''}`);
    return true;
  }

  // Start trial
  async startTrial(userId: string, planId: string, entityId?: string): Promise<boolean> {
    await this.simulateDelay();
    console.log(`Starting trial for user ${userId} on plan ${planId}${entityId ? ` under entity ${entityId}` : ''}`);
    return true;
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
}

export const subscriptionService = new SubscriptionService();
