import { 
  WorkspaceModule, 
  WorkspaceEntity, 
  WorkspaceStats, 
  ModuleSubscriptionPackage,
  WorkspaceFilters,
  WorkspaceResponse,
  ModuleStatus,
  ModuleCategory,
  EntityType,
  EntitySize,
  EntityStatus,
  TeamMemberRole,
  TeamMemberStatus,
  Permission
} from '@/types/workspace';
import { PROFESSIONAL_MODULES, getProfessionalModuleById } from '@/data/professionalModules';

class WorkspaceService {
  // Generate mock modules from professional modules data
  private generateMockModules(): WorkspaceModule[] {
    const mockStatuses = [ModuleStatus.ACTIVE, ModuleStatus.TRIAL, ModuleStatus.EXPIRED, ModuleStatus.PENDING_ACTIVATION];
    
    return PROFESSIONAL_MODULES.map((module, index) => {
      const status = mockStatuses[index % mockStatuses.length];
      const isActive = status === ModuleStatus.ACTIVE || status === ModuleStatus.TRIAL;
      
      let subscriptionEndDate: Date | null = null;
      let subscriptionStartDate: Date | null = null;
      
      if (status === ModuleStatus.ACTIVE) {
        subscriptionStartDate = new Date('2024-01-01');
        subscriptionEndDate = new Date('2024-12-31');
      } else if (status === ModuleStatus.TRIAL) {
        subscriptionStartDate = new Date('2024-08-01');
        subscriptionEndDate = new Date('2024-09-15');
      } else if (status === ModuleStatus.EXPIRED) {
        subscriptionStartDate = new Date('2024-01-01');
        subscriptionEndDate = new Date('2024-07-31');
      }
      
      return {
        id: module.id,
        title: module.title,
        description: module.description,
        status,
        subscriptionEndDate,
        subscriptionStartDate,
        isActive,
        features: module.features,
        category: this.mapCategoryToModuleCategory(module.category),
        price: module.pricing.monthly,
        billingCycle: 'monthly' as const,
        icon: module.icon
      };
    });
  }
  
  private mapCategoryToModuleCategory(category: string): ModuleCategory {
    switch (category) {
      case 'core': return ModuleCategory.CORE;
      case 'professional': return ModuleCategory.PROFESSIONAL;
      case 'enterprise': return ModuleCategory.ENTERPRISE;
      case 'addon': return ModuleCategory.ADDON;
      default: return ModuleCategory.PROFESSIONAL;
    }
  }
  
  private mockModules: WorkspaceModule[] = this.generateMockModules();

  // Mock data for entities
  private mockEntities: WorkspaceEntity[] = [
    {
      id: '1',
      name: 'Tech Solutions Pvt Ltd',
      type: EntityType.PRIVATE_LIMITED,
      industry: 'Information Technology',
      size: EntitySize.MEDIUM,
      description: 'Leading software development company',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-08-10'),
      status: EntityStatus.ACTIVE,
      modules: this.mockModules.filter(m => ['1', '2', '3'].includes(m.id)),
      teamMembers: [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@techsolutions.com',
          role: TeamMemberRole.ADMIN,
          permissions: [
            { moduleId: '1', permissions: [Permission.VIEW, Permission.EDIT, Permission.MANAGE] },
            { moduleId: '2', permissions: [Permission.VIEW, Permission.EDIT] }
          ],
          joinedAt: new Date('2024-01-15'),
          lastActive: new Date('2024-08-12'),
          status: TeamMemberStatus.ACTIVE,
          assignedModules: ['1', '2', '3']
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@techsolutions.com',
          role: TeamMemberRole.MANAGER,
          permissions: [
            { moduleId: '1', permissions: [Permission.VIEW, Permission.EDIT] },
            { moduleId: '2', permissions: [Permission.VIEW] }
          ],
          joinedAt: new Date('2024-02-01'),
          lastActive: new Date('2024-08-11'),
          status: TeamMemberStatus.ACTIVE,
          assignedModules: ['1', '2']
        }
      ],
      profileCompletion: 85,
      registrationNumber: 'REG-TS-2024-001',
      address: {
        street: '123 Tech Park, Sector 5',
        city: 'Bangalore',
        state: 'Karnataka',
        pinCode: '560001',
        country: 'India'
      },
      contactInfo: {
        primaryEmail: 'info@techsolutions.com',
        primaryPhone: '+91-80-12345678',
        website: 'www.techsolutions.com'
      }
    },
    {
      id: '2',
      name: 'Marketing Branch Delhi',
      type: EntityType.BRANCH,
      industry: 'Marketing & Advertising',
      size: EntitySize.SMALL,
      description: 'Delhi branch for marketing operations',
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-08-05'),
      status: EntityStatus.ACTIVE,
      modules: this.mockModules.filter(m => ['1', '2'].includes(m.id)),
      teamMembers: [
        {
          id: '3',
          name: 'Raj Kumar',
          email: 'raj.kumar@company.com',
          role: TeamMemberRole.MEMBER,
          permissions: [
            { moduleId: '1', permissions: [Permission.VIEW] },
            { moduleId: '2', permissions: [Permission.VIEW, Permission.EDIT] }
          ],
          joinedAt: new Date('2024-03-15'),
          lastActive: new Date('2024-08-10'),
          status: TeamMemberStatus.ACTIVE,
          assignedModules: ['1', '2']
        }
      ],
      profileCompletion: 70,
      registrationNumber: 'REG-MB-2024-002',
      address: {
        street: '456 Business District',
        city: 'New Delhi',
        state: 'Delhi',
        pinCode: '110001',
        country: 'India'
      },
      contactInfo: {
        primaryEmail: 'delhi@company.com',
        primaryPhone: '+91-11-87654321'
      }
    }
  ];

  // Generate subscription packages from professional modules
  private generateSubscriptionPackages(): ModuleSubscriptionPackage[] {
    const individualModules = PROFESSIONAL_MODULES.map(module => ({
      id: module.id,
      name: module.title,
      description: module.description,
      features: module.features,
      price: module.pricing.monthly,
      billingCycle: 'monthly' as const,
      category: this.mapCategoryToModuleCategory(module.category),
      isPopular: module.popular,
      trialDays: module.trialDays
    }));
    
    // Add bundle packages
    const bundlePackages: ModuleSubscriptionPackage[] = [
      {
        id: 'core-bundle',
        name: 'Core Business Bundle',
        description: 'Essential modules for business operations',
        features: ['Entity Management', 'Work Order Management', 'Service Requests', 'Basic Support'],
        price: 6999,
        billingCycle: 'monthly',
        category: ModuleCategory.CORE,
        isPopular: true,
        trialDays: 30
      },
      {
        id: 'professional-bundle',
        name: 'Professional Suite',
        description: 'Complete professional services package',
        features: ['All Core Modules', 'Meeting Management', 'Claims Management', 'Virtual Data Room', 'Priority Support'],
        price: 12999,
        billingCycle: 'monthly',
        category: ModuleCategory.PROFESSIONAL,
        isPopular: true,
        trialDays: 30
      },
      {
        id: 'enterprise-bundle',
        name: 'Enterprise Complete',
        description: 'Full enterprise solution with all modules',
        features: ['All Professional Modules', 'E-Voting', 'Litigation Management', 'Resolution System', 'Regulatory Compliance', '24/7 Support'],
        price: 24999,
        billingCycle: 'monthly',
        category: ModuleCategory.ENTERPRISE,
        isPopular: false,
        trialDays: 30
      }
    ];
    
    return [...individualModules, ...bundlePackages];
  }
  
  private mockPackages: ModuleSubscriptionPackage[] = this.generateSubscriptionPackages();

  // Get user's subscribed modules
  async getMyModules(userId: string, filters?: WorkspaceFilters): Promise<WorkspaceResponse<WorkspaceModule>> {
    await this.simulateDelay();
    
    let filteredModules = [...this.mockModules];

    if (filters) {
      if (filters.moduleStatus) {
        filteredModules = filteredModules.filter(m => m.status === filters.moduleStatus);
      }
      if (filters.moduleCategory) {
        filteredModules = filteredModules.filter(m => m.category === filters.moduleCategory);
      }
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        filteredModules = filteredModules.filter(m => 
          m.title.toLowerCase().includes(term) || 
          m.description.toLowerCase().includes(term)
        );
      }
    }

    return {
      data: filteredModules,
      total: filteredModules.length,
      page: 1,
      pageSize: 10,
      totalPages: Math.ceil(filteredModules.length / 10)
    };
  }

  // Get user's entities
  async getMyEntities(userId: string, filters?: WorkspaceFilters): Promise<WorkspaceResponse<WorkspaceEntity>> {
    await this.simulateDelay();
    
    let filteredEntities = [...this.mockEntities];

    if (filters) {
      if (filters.entityType) {
        filteredEntities = filteredEntities.filter(e => e.type === filters.entityType);
      }
      if (filters.entityStatus) {
        filteredEntities = filteredEntities.filter(e => e.status === filters.entityStatus);
      }
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        filteredEntities = filteredEntities.filter(e => 
          e.name.toLowerCase().includes(term) || 
          e.description.toLowerCase().includes(term)
        );
      }
    }

    return {
      data: filteredEntities,
      total: filteredEntities.length,
      page: 1,
      pageSize: 10,
      totalPages: Math.ceil(filteredEntities.length / 10)
    };
  }

  // Get workspace statistics
  async getWorkspaceStats(userId: string): Promise<WorkspaceStats> {
    await this.simulateDelay();
    
    const modules = this.mockModules;
    const entities = this.mockEntities;
    const allTeamMembers = entities.flatMap(e => e.teamMembers);

    return {
      totalModules: modules.length,
      activeModules: modules.filter(m => m.status === ModuleStatus.ACTIVE).length,
      expiredModules: modules.filter(m => m.status === ModuleStatus.EXPIRED).length,
      trialModules: modules.filter(m => m.status === ModuleStatus.TRIAL).length,
      totalEntities: entities.length,
      activeEntities: entities.filter(e => e.status === EntityStatus.ACTIVE).length,
      totalTeamMembers: allTeamMembers.length,
      activeTeamMembers: allTeamMembers.filter(tm => tm.status === TeamMemberStatus.ACTIVE).length
    };
  }

  // Get available subscription packages
  async getSubscriptionPackages(): Promise<ModuleSubscriptionPackage[]> {
    await this.simulateDelay();
    return this.mockPackages;
  }
  
  // Get individual professional modules for subscription
  async getProfessionalModulesForSubscription(): Promise<ModuleSubscriptionPackage[]> {
    await this.simulateDelay();
    return PROFESSIONAL_MODULES.map(module => ({
      id: module.id,
      name: module.title,
      description: module.description,
      features: module.features,
      price: module.pricing.monthly,
      billingCycle: 'monthly' as const,
      category: this.mapCategoryToModuleCategory(module.category),
      isPopular: module.popular,
      trialDays: module.trialDays
    }));
  }
  
  // Get module details for subscription
  async getModuleForSubscription(moduleId: string): Promise<ModuleSubscriptionPackage | null> {
    await this.simulateDelay();
    const professionalModule = getProfessionalModuleById(moduleId);
    if (!professionalModule) return null;
    
    return {
      id: professionalModule.id,
      name: professionalModule.title,
      description: professionalModule.description,
      features: professionalModule.features,
      price: professionalModule.pricing.monthly,
      billingCycle: 'monthly',
      category: this.mapCategoryToModuleCategory(professionalModule.category),
      isPopular: professionalModule.popular,
      trialDays: professionalModule.trialDays
    };
  }

  // Subscribe to a module
  async subscribeToModule(userId: string, moduleId: string, packageId: string, entityId?: string): Promise<boolean> {
    await this.simulateDelay();
    // Mock subscription logic
    console.log(`Subscribing user ${userId} to module ${moduleId} with package ${packageId}${entityId ? ` under entity ${entityId}` : ''}`);
    return true;
  }

  // Get entity details
  async getEntityDetails(entityId: string): Promise<WorkspaceEntity | null> {
    await this.simulateDelay();
    return this.mockEntities.find(e => e.id === entityId) || null;
  }

  // Create new entity
  async createEntity(userId: string, entityData: Partial<WorkspaceEntity>): Promise<WorkspaceEntity> {
    await this.simulateDelay();
    const newEntity: WorkspaceEntity = {
      id: Date.now().toString(),
      name: entityData.name || 'New Entity',
      type: entityData.type || EntityType.PRIVATE_LIMITED,
      industry: entityData.industry || 'General',
      size: entityData.size || EntitySize.SMALL,
      description: entityData.description || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: EntityStatus.ACTIVE,
      modules: [],
      teamMembers: [],
      profileCompletion: 30,
      address: entityData.address || {
        street: '',
        city: '',
        state: '',
        pinCode: '',
        country: 'India'
      },
      contactInfo: entityData.contactInfo || {
        primaryEmail: '',
        primaryPhone: ''
      }
    };
    
    this.mockEntities.push(newEntity);
    return newEntity;
  }

  // Update entity
  async updateEntity(entityId: string, entityData: Partial<WorkspaceEntity>): Promise<WorkspaceEntity | null> {
    await this.simulateDelay();
    const entityIndex = this.mockEntities.findIndex(e => e.id === entityId);
    if (entityIndex === -1) return null;

    this.mockEntities[entityIndex] = {
      ...this.mockEntities[entityIndex],
      ...entityData,
      updatedAt: new Date()
    };

    return this.mockEntities[entityIndex];
  }

  // Delete entity
  async deleteEntity(entityId: string): Promise<boolean> {
    await this.simulateDelay();
    const entityIndex = this.mockEntities.findIndex(e => e.id === entityId);
    if (entityIndex === -1) return false;

    this.mockEntities.splice(entityIndex, 1);
    return true;
  }

  private async simulateDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  }
}

export const workspaceService = new WorkspaceService();
