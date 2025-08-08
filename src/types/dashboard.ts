// Dashboard Types for Role-Based Dashboards

export interface DashboardStats {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ComponentType<any>;
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
  icon: React.ComponentType<any>;
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

export interface DashboardData {
  stats: DashboardStats[];
  serviceRequests?: ServiceRequest[];
  workOrders?: WorkOrder[];
  opportunities?: Opportunity[];
  teamMembers?: TeamMember[];
  notifications: Notification[];
  subscriptions: Subscription[];
  workspaceModules: WorkspaceModule[];
  entities?: Entity[];
  recentActivity: RecentActivity[];
  profileCompletion: ProfileCompletion;
  resourceSharingRequests?: ResourceSharingRequest[];
  disputeTickets?: DisputeTicket[];
  platformMetrics?: PlatformMetrics;
}
