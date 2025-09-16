import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ModuleAccess {
  id: string;
  name: string;
  isActive: boolean;
  subscriptionId?: string;
  expiryDate?: string;
  features: string[];
}

export interface UserSubscription {
  id: string;
  name: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  startDate: string;
  endDate: string;
  modules: string[];
  features: string[];
  autoRenewal: boolean;
}

interface SubscriptionContextType {
  subscriptions: UserSubscription[];
  moduleAccess: ModuleAccess[];
  loading: boolean;
  hasModuleAccess: (moduleId: string) => boolean;
  getModuleAccess: (moduleId: string) => ModuleAccess | null;
  refreshSubscriptions: () => Promise<void>;
  purchaseModule: (moduleId: string, planId: string) => Promise<boolean>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: React.ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [moduleAccess, setModuleAccess] = useState<ModuleAccess[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for development - replace with actual API calls
  const mockSubscriptions: UserSubscription[] = [
    {
      id: 'sub-001',
      name: 'Professional Plan',
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2025-01-15',
      modules: ['meetings', 'vdr', 'compliance'],
      features: ['Unlimited Meetings', 'Document Management', 'Compliance Tracking'],
      autoRenewal: true
    },
    {
      id: 'sub-002',
      name: 'Entity Management Module',
      status: 'expired',
      startDate: '2023-12-01',
      endDate: '2024-12-01',
      modules: ['entity-management'],
      features: ['Entity Creation', 'Entity Management', 'Document Storage'],
      autoRenewal: false
    }
  ];

  const mockModuleAccess: ModuleAccess[] = [
    {
      id: 'entity-management',
      name: 'Entity Management',
      isActive: false, // Set to false to demonstrate subscription gating
      subscriptionId: 'sub-002',
      expiryDate: '2024-12-01',
      features: ['Create Entities', 'Manage Entity Details', 'Document Management', 'Compliance Tracking']
    },
    {
      id: 'meetings',
      name: 'Meeting Management',
      isActive: true,
      subscriptionId: 'sub-001',
      expiryDate: '2025-01-15',
      features: ['Schedule Meetings', 'Video Conferencing', 'Meeting Minutes', 'Action Items']
    },
    {
      id: 'vdr',
      name: 'Virtual Data Room',
      isActive: true,
      subscriptionId: 'sub-001',
      expiryDate: '2025-01-15',
      features: ['Secure Document Sharing', 'Access Control', 'Audit Trails', 'Version Control']
    },
    {
      id: 'compliance',
      name: 'Regulatory Compliance',
      isActive: true,
      subscriptionId: 'sub-001',
      expiryDate: '2025-01-15',
      features: ['Compliance Checklists', 'Regulatory Updates', 'Audit Management', 'Reporting']
    }
    ,
    {
      id: 'ai',
      name: 'AI Assistance',
      isActive: true,
      subscriptionId: 'sub-001',
      expiryDate: '2025-01-15',
      features: ['Document Authentication', 'Quality Check', 'Draft Assistance']
    }
  ];

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubscriptions(mockSubscriptions);
      setModuleAccess(mockModuleAccess);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasModuleAccess = (moduleId: string): boolean => {
    const module = moduleAccess.find(m => m.id === moduleId);
    return module?.isActive || false;
  };

  const getModuleAccess = (moduleId: string): ModuleAccess | null => {
    return moduleAccess.find(m => m.id === moduleId) || null;
  };

  const refreshSubscriptions = async (): Promise<void> => {
    await loadSubscriptions();
  };

  const purchaseModule = async (moduleId: string, planId: string): Promise<boolean> => {
    try {
      // Simulate purchase API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update module access after successful purchase
      setModuleAccess(prev => prev.map(module => 
        module.id === moduleId 
          ? { ...module, isActive: true, expiryDate: '2025-12-31' }
          : module
      ));
      
      // Add new subscription
      const newSubscription: UserSubscription = {
        id: `sub-${Date.now()}`,
        name: `${moduleId} Module`,
        status: 'active',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '2025-12-31',
        modules: [moduleId],
        features: [],
        autoRenewal: true
      };
      
      setSubscriptions(prev => [...prev, newSubscription]);
      
      return true;
    } catch (error) {
      console.error('Error purchasing module:', error);
      return false;
    }
  };

  useEffect(() => {
    loadSubscriptions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: SubscriptionContextType = {
    subscriptions,
    moduleAccess,
    loading,
    hasModuleAccess,
    getModuleAccess,
    refreshSubscriptions,
    purchaseModule
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
