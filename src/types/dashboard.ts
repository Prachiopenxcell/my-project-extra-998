// Dashboard Types for Role-Based Dashboards

export interface DashboardStats {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface ServiceRequest {
  id: string;
  title: string;
  client: string;
  status: 'Open' | 'In Progress' | 'Closed' | 'Review';
  priority: 'High' | 'Medium' | 'Low';
  createdDate: string;
  dueDate: string;
  amount?: string;
}

export interface WorkOrder {
  id: string;
  title: string;
  client: string;
  status: 'Open' | 'In Progress' | 'Closed' | 'Review';
  progress: number;
  startDate: string;
  dueDate: string;
  amount: string;
  teamMembers?: string[];
}

export interface Opportunity {
  id: string;
  srn: string;
  title: string;
  raisedOn: string;
  bidClosureDate: string;
  status: 'Open' | 'Bidding' | 'Closed' | 'Awarded';
  estimatedValue: string;
  category: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  lastLogin: string;
  status: 'Active' | 'Inactive';
  avatar?: string;
  email: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'success' | 'error';
  time: string;
  isRead: boolean;
  priority: 'High' | 'Medium' | 'Low';
  module?: string;
}

export interface Subscription {
  id: string;
  moduleName: string;
  status: 'Active' | 'Expired' | 'Trial';
  endDate: string;
  features: string[];
}

export interface WorkspaceModule {
  id: string;
  name: string;
  lastVisited: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isSubscribed: boolean;
  url: string;
}

export interface Entity {
  id: string;
  name: string;
  type: string;
  modulesActivated: string[];
  status: 'Active' | 'Inactive';
  lastAccessed: string;
}

export interface RecentActivity {
  id: string;
  action: string;
  description: string;
  time: string;
  type: 'service_request' | 'work_order' | 'payment' | 'completion' | 'bid' | 'meeting' | 'claim';
  user?: string;
  module?: string;
}

export interface ProfileCompletion {
  percentage: number;
  missingFields: string[];
  permanentNumber?: string;
  isCompleted: boolean;
}

export interface ResourceSharingRequest {
  id: string;
  requesterName: string;
  requesterType: string;
  resourceType: string;
  description: string;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  urgency: 'High' | 'Medium' | 'Low';
}

export interface DisputeTicket {
  id: string;
  title: string;
  category: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'High' | 'Medium' | 'Low';
  createdDate: string;
  assignedTo?: string;
  estimatedResolution?: string;
}

export interface PlatformMetrics {
  totalUsers: number;
  activeUsers: number;
  userBreakdown: {
    serviceSeekerIndividual: number;
    serviceSeekerEntity: number;
    serviceProviderIndividual: number;
    serviceProviderEntity: number;
    teamMembers: number;
  };
  activeSubscriptions: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

export interface OrganizationPerformance {
  revenue: {
    current: number;
    previous: number;
    trend: number;
    currency: string;
    period: string;
  };
  workOrderCompletion: {
    onTime: number;
    delayed: number;
    total: number;
    trend: number;
  };
  teamUtilization: {
    utilized: number;
    available: number;
    trend: number;
  };
  clientSatisfaction: {
    current: number;
    previous: number;
    trend: number;
    total: number;
  };
  bidSuccessRate: {
    won: number;
    lost: number;
    trend: number;
  };
}

export interface TeamStats {
  total: number;
  active: number;
  inactive: number;
  utilization: number;
  averageRating: number;
  byDepartment: {
    name: string;
    count: number;
    utilization: number;
  }[];
  recentHires: number;
  pendingTrainings: number;
  // Additional properties for team management statistics
  totalMembers: number;
  activeMembers: number;
  capacityUtilization: number;
  composition: {
    managers: number;
    specialists: number;
    associates: number;
  };
  performance: {
    workOrderCompletion: number;
    clientSatisfaction: number;
    responseTime: number;
    improvement: number;
  };
  allocation: {
    project: string;
    percentage: number;
  }[];
}

export interface FinancialMetrics {
  monthlyRevenue: {
    month: string;
    amount: number;
  }[];
  outstandingInvoices: number;
  totalOutstanding: number;
  averageProjectValue: number;
  profitMargin: number;
}

export interface EntityManagement {
  totalEntities: number;
  activeEntities: number;
  inactiveEntities: number;
  entitiesByType: {
    type: string;
    count: number;
  }[];
  moduleDistribution: {
    module: string;
    count: number;
  }[];
  recentActivity: {
    entity: string;
    action: string;
    date: string;
    module: string;
  }[];
}

export interface DashboardData {
  stats?: DashboardStats[];
  serviceRequests?: ServiceRequest[];
  workOrders?: WorkOrder[];
  opportunities?: Opportunity[];
  teamMembers?: TeamMember[];
  notifications?: Notification[];
  subscriptions?: Subscription[];
  workspaceModules?: WorkspaceModule[];
  entities?: Entity[];
  recentActivity?: RecentActivity[];
  profileCompletion?: ProfileCompletion;
  resourceSharingRequests?: ResourceSharingRequest[];
  disputeTickets?: DisputeTicket[];
  platformMetrics?: PlatformMetrics;
  organizationPerformance?: OrganizationPerformance;
  teamStats?: TeamStats;
  financialMetrics?: FinancialMetrics;
  entityManagement?: EntityManagement;
  registrationNumber?: string;
  alerts?: {
    id: number;
    message: string;
    type: string;
    deadline: string;
  }[];
  recentModules?: {
    name: string;
    lastVisited: string;
    status: string;
  }[];
  recentEntities?: {
    name: string;
    moduleActivated: string;
    status: string;
  }[];
  recentOpportunities?: {
    srn: string;
    raisedOn: string;
    bidClosureDate: string;
    status: string;
    title: string;
    location: string;
  }[];
  inProgressWorkOrders?: {
    workOrderNo: string;
    startDate: string;
    lastDate: string;
    status: string;
    teamMembers: string[];
    title: string;
    client: string;
    progress: number;
  }[];
  assignedEntities?: {
    name: string;
    moduleActivated: string;
  }[];
}
