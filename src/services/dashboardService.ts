import { 
  DashboardData, 
  DashboardStats, 
  ServiceRequest, 
  WorkOrder, 
  Opportunity, 
  TeamMember, 
  Notification, 
  Subscription, 
  WorkspaceModule, 
  Entity, 
  RecentActivity, 
  ProfileCompletion,
  ResourceSharingRequest,
  DisputeTicket,
  PlatformMetrics
} from '@/types/dashboard';
import { UserRole } from '@/types/auth';
import { 
  FileText, 
  Users, 
  DollarSign, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Building,
  Briefcase,
  Target,
  UserCheck,
  Calendar,
  Settings,
  Shield,
  BarChart3,
  Zap,
  Globe
} from 'lucide-react';

class DashboardService {
  // Mock data generators for different user roles
  
  private generateServiceSeekerStats(): DashboardStats[] {
    return [
      {
        title: "Active Service Requests",
        value: 8,
        change: "+2 from last month",
        icon: FileText,
        color: "text-info",
        trend: 'up'
      },
      {
        title: "Completed Projects",
        value: 24,
        change: "+4 from last month",
        icon: CheckCircle,
        color: "text-success",
        trend: 'up'
      },
      {
        title: "Total Spent",
        value: "₹2,45,000",
        change: "+12% from last month",
        icon: DollarSign,
        color: "text-primary",
        trend: 'up'
      },
      {
        title: "Pending Reviews",
        value: 3,
        change: "-1 from last week",
        icon: Clock,
        color: "text-warning",
        trend: 'down'
      }
    ];
  }

  private generateServiceProviderStats(): DashboardStats[] {
    return [
      {
        title: "Active Work Orders",
        value: 12,
        change: "+3 from last month",
        icon: Briefcase,
        color: "text-info",
        trend: 'up'
      },
      {
        title: "Revenue This Month",
        value: "₹4,85,000",
        change: "+18% from last month",
        icon: DollarSign,
        color: "text-success",
        trend: 'up'
      },
      {
        title: "New Opportunities",
        value: 15,
        change: "+5 from last week",
        icon: Target,
        color: "text-primary",
        trend: 'up'
      },
      {
        title: "Client Satisfaction",
        value: "4.8/5",
        change: "+0.2 from last month",
        icon: Users,
        color: "text-warning",
        trend: 'up'
      }
    ];
  }

  private generateEntityAdminStats(): DashboardStats[] {
    return [
      {
        title: "Team Members",
        value: 25,
        change: "+3 new this month",
        icon: Users,
        color: "text-info",
        trend: 'up'
      },
      {
        title: "Active Projects",
        value: 18,
        change: "+2 from last month",
        icon: Briefcase,
        color: "text-success",
        trend: 'up'
      },
      {
        title: "Monthly Revenue",
        value: "₹12,50,000",
        change: "+25% from last month",
        icon: DollarSign,
        color: "text-primary",
        trend: 'up'
      },
      {
        title: "Resource Utilization",
        value: "85%",
        change: "+5% from last month",
        icon: BarChart3,
        color: "text-warning",
        trend: 'up'
      }
    ];
  }

  private generateTeamMemberStats(): DashboardStats[] {
    return [
      {
        title: "Assigned Tasks",
        value: 6,
        change: "+1 from last week",
        icon: FileText,
        color: "text-info",
        trend: 'up'
      },
      {
        title: "Completed Tasks",
        value: 18,
        change: "+3 from last month",
        icon: CheckCircle,
        color: "text-success",
        trend: 'up'
      },
      {
        title: "Performance Score",
        value: "92%",
        change: "+3% from last month",
        icon: TrendingUp,
        color: "text-primary",
        trend: 'up'
      },
      {
        title: "Pending Reviews",
        value: 2,
        change: "Same as last week",
        icon: Clock,
        color: "text-warning",
        trend: 'neutral'
      }
    ];
  }

  private generateAdminStats(): DashboardStats[] {
    return [
      {
        title: "Total Users",
        value: "2,847",
        change: "+127 this month",
        icon: Users,
        color: "text-info",
        trend: 'up'
      },
      {
        title: "Active Subscriptions",
        value: "1,234",
        change: "+89 this month",
        icon: Zap,
        color: "text-success",
        trend: 'up'
      },
      {
        title: "Platform Revenue",
        value: "₹45,67,000",
        change: "+22% from last month",
        icon: DollarSign,
        color: "text-primary",
        trend: 'up'
      },
      {
        title: "Support Tickets",
        value: 23,
        change: "-8 from last week",
        icon: AlertCircle,
        color: "text-warning",
        trend: 'down'
      }
    ];
  }

  private generateMockServiceRequests(): ServiceRequest[] {
    return [
      {
        id: "SR001",
        title: "Legal Consultation for Contract Review",
        client: "ABC Corporation",
        status: "In Progress",
        priority: "High",
        createdDate: "2024-01-15",
        dueDate: "2024-01-25",
        amount: "₹25,000"
      },
      {
        id: "SR002",
        title: "Financial Audit Services",
        client: "XYZ Ltd",
        status: "Open",
        priority: "Medium",
        createdDate: "2024-01-18",
        dueDate: "2024-02-15",
        amount: "₹45,000"
      },
      {
        id: "SR003",
        title: "IT Infrastructure Setup",
        client: "Tech Solutions",
        status: "Review",
        priority: "Low",
        createdDate: "2024-01-20",
        dueDate: "2024-02-10",
        amount: "₹35,000"
      }
    ];
  }

  private generateMockWorkOrders(): WorkOrder[] {
    return [
      {
        id: "WO001",
        title: "Mobile App Development",
        client: "StartupCo",
        status: "In Progress",
        progress: 65,
        startDate: "2024-01-10",
        dueDate: "2024-02-28",
        amount: "₹2,50,000",
        teamMembers: ["John Doe", "Jane Smith", "Mike Johnson"]
      },
      {
        id: "WO002",
        title: "Website Redesign",
        client: "Fashion Brand",
        status: "Review",
        progress: 90,
        startDate: "2024-01-05",
        dueDate: "2024-01-30",
        amount: "₹1,80,000",
        teamMembers: ["Sarah Wilson", "Tom Brown"]
      },
      {
        id: "WO003",
        title: "ERP Implementation",
        client: "Manufacturing Co",
        status: "Open",
        progress: 25,
        startDate: "2024-01-22",
        dueDate: "2024-04-15",
        amount: "₹5,00,000",
        teamMembers: ["Alex Davis", "Lisa Chen", "Robert Taylor"]
      }
    ];
  }

  private generateMockOpportunities(): Opportunity[] {
    return [
      {
        id: "OPP001",
        srn: "SRN-2024-001",
        title: "Government Portal Development",
        raisedOn: "2024-01-20",
        bidClosureDate: "2024-02-05",
        status: "Open",
        estimatedValue: "₹15,00,000",
        category: "Software Development"
      },
      {
        id: "OPP002",
        srn: "SRN-2024-002",
        title: "Banking System Integration",
        raisedOn: "2024-01-18",
        bidClosureDate: "2024-02-10",
        status: "Bidding",
        estimatedValue: "₹25,00,000",
        category: "System Integration"
      },
      {
        id: "OPP003",
        srn: "SRN-2024-003",
        title: "Healthcare Management System",
        raisedOn: "2024-01-15",
        bidClosureDate: "2024-02-01",
        status: "Closed",
        estimatedValue: "₹18,00,000",
        category: "Healthcare IT"
      }
    ];
  }

  private generateMockNotifications(): Notification[] {
    return [
      {
        id: "N001",
        title: "New Service Request",
        description: "You have received a new service request for legal consultation",
        type: "info",
        time: "2 hours ago",
        isRead: false,
        priority: "High",
        module: "Service Requests"
      },
      {
        id: "N002",
        title: "Payment Received",
        description: "Payment of ₹25,000 has been received from ABC Corporation",
        type: "success",
        time: "4 hours ago",
        isRead: false,
        priority: "Medium",
        module: "Billing"
      },
      {
        id: "N003",
        title: "Profile Completion",
        description: "Complete your profile to unlock all features",
        type: "warning",
        time: "1 day ago",
        isRead: true,
        priority: "Medium",
        module: "Profile"
      }
    ];
  }

  private generateMockSubscriptions(): Subscription[] {
    return [
      {
        id: "SUB001",
        moduleName: "Claims Management",
        status: "Active",
        endDate: "2024-12-31",
        features: ["Unlimited Claims", "AI Verification", "Advanced Analytics"]
      },
      {
        id: "SUB002",
        moduleName: "Meeting Management",
        status: "Active",
        endDate: "2024-11-30",
        features: ["Video Conferencing", "Recording", "Scheduling"]
      },
      {
        id: "SUB003",
        moduleName: "Resolution System",
        status: "Trial",
        endDate: "2024-02-15",
        features: ["Basic Resolution", "Document Management"]
      }
    ];
  }

  private generateMockWorkspaceModules(): WorkspaceModule[] {
    return [
      {
        id: "MOD001",
        name: "Claims Management",
        lastVisited: "2024-01-22",
        icon: FileText,
        isSubscribed: true,
        url: "/claims"
      },
      {
        id: "MOD002",
        name: "Meetings",
        lastVisited: "2024-01-21",
        icon: Calendar,
        isSubscribed: true,
        url: "/meetings"
      },
      {
        id: "MOD003",
        name: "Entity Management",
        lastVisited: "2024-01-20",
        icon: Building,
        isSubscribed: true,
        url: "/entity-management"
      },
      {
        id: "MOD004",
        name: "Resolution System",
        lastVisited: "2024-01-19",
        icon: Shield,
        isSubscribed: false,
        url: "/resolution"
      }
    ];
  }

  private generateMockRecentActivity(): RecentActivity[] {
    return [
      {
        id: "ACT001",
        action: "Service Request Created",
        description: "New legal consultation request from ABC Corporation",
        time: "2 hours ago",
        type: "service_request",
        user: "John Doe",
        module: "Service Requests"
      },
      {
        id: "ACT002",
        action: "Work Order Completed",
        description: "Mobile app development project completed successfully",
        time: "5 hours ago",
        type: "completion",
        user: "Jane Smith",
        module: "Work Orders"
      },
      {
        id: "ACT003",
        action: "Payment Received",
        description: "₹25,000 payment received from XYZ Ltd",
        time: "1 day ago",
        type: "payment",
        user: "System",
        module: "Billing"
      }
    ];
  }

  private generateMockProfileCompletion(): ProfileCompletion {
    return {
      percentage: 85,
      missingFields: ["Tax Information", "Banking Details"],
      permanentNumber: "REG-2024-001234",
      isCompleted: false
    };
  }

  // Main method to get dashboard data based on user role
  async getDashboardData(userRole: UserRole): Promise<DashboardData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let stats: DashboardStats[] = [];
    let serviceRequests: ServiceRequest[] = [];
    let workOrders: WorkOrder[] = [];
    let opportunities: Opportunity[] = [];
    let teamMembers: TeamMember[] = [];
    let entities: Entity[] = [];
    const resourceSharingRequests: ResourceSharingRequest[] = [];
    const disputeTickets: DisputeTicket[] = [];
    const platformMetrics: PlatformMetrics | undefined = undefined;

    // Generate role-specific data
    switch (userRole) {
      case UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER:
        stats = this.generateServiceSeekerStats();
        serviceRequests = this.generateMockServiceRequests();
        break;

      case UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER:
        stats = this.generateServiceProviderStats();
        workOrders = this.generateMockWorkOrders();
        opportunities = this.generateMockOpportunities();
        break;

      case UserRole.SERVICE_SEEKER_ENTITY_ADMIN:
      case UserRole.SERVICE_PROVIDER_ENTITY_ADMIN:
        stats = this.generateEntityAdminStats();
        workOrders = this.generateMockWorkOrders();
        teamMembers = this.generateMockTeamMembers();
        entities = this.generateMockEntities();
        break;

      case UserRole.SERVICE_SEEKER_TEAM_MEMBER:
      case UserRole.SERVICE_PROVIDER_TEAM_MEMBER:
        stats = this.generateTeamMemberStats();
        serviceRequests = this.generateMockServiceRequests().slice(0, 2);
        break;

      default:
        stats = this.generateServiceSeekerStats();
        break;
    }

    return {
      stats,
      serviceRequests,
      workOrders,
      opportunities,
      teamMembers,
      notifications: this.generateMockNotifications(),
      subscriptions: this.generateMockSubscriptions(),
      workspaceModules: this.generateMockWorkspaceModules(),
      entities,
      recentActivity: this.generateMockRecentActivity(),
      profileCompletion: this.generateMockProfileCompletion(),
      resourceSharingRequests,
      disputeTickets,
      platformMetrics
    };
  }

  private generateMockTeamMembers(): TeamMember[] {
    return [
      {
        id: "TM001",
        name: "John Doe",
        role: "Senior Developer",
        lastLogin: "2024-01-22",
        status: "Active",
        email: "john.doe@company.com"
      },
      {
        id: "TM002",
        name: "Jane Smith",
        role: "Project Manager",
        lastLogin: "2024-01-21",
        status: "Active",
        email: "jane.smith@company.com"
      },
      {
        id: "TM003",
        name: "Mike Johnson",
        role: "Designer",
        lastLogin: "2024-01-20",
        status: "Inactive",
        email: "mike.johnson@company.com"
      }
    ];
  }

  private generateMockEntities(): Entity[] {
    return [
      {
        id: "ENT001",
        name: "Tech Solutions Pvt Ltd",
        type: "Private Limited Company",
        modulesActivated: ["Claims", "Meetings", "Resolution"],
        status: "Active",
        lastAccessed: "2024-01-22"
      },
      {
        id: "ENT002",
        name: "Consulting Services LLP",
        type: "Limited Liability Partnership",
        modulesActivated: ["Claims", "Entity Management"],
        status: "Active",
        lastAccessed: "2024-01-21"
      }
    ];
  }

  private generateMockDisputeTickets(): DisputeTicket[] {
    return [
      {
        id: "DT001",
        title: "Payment Dispute - Invoice #INV001",
        category: "Billing",
        status: "Open",
        priority: "High",
        createdDate: "2024-01-20",
        assignedTo: "Support Team A",
        estimatedResolution: "2024-01-25"
      },
      {
        id: "DT002",
        title: "Service Quality Complaint",
        category: "Service",
        status: "In Progress",
        priority: "Medium",
        createdDate: "2024-01-18",
        assignedTo: "Support Team B",
        estimatedResolution: "2024-01-24"
      }
    ];
  }

  private generateMockPlatformMetrics(): PlatformMetrics {
    return {
      totalUsers: 2847,
      activeUsers: 1923,
      userBreakdown: {
        serviceSeekerIndividual: 1245,
        serviceSeekerEntity: 234,
        serviceProviderIndividual: 987,
        serviceProviderEntity: 156,
        teamMembers: 225
      },
      activeSubscriptions: 1234,
      totalRevenue: 4567000,
      monthlyGrowth: 22
    };
  }
}

export const dashboardService = new DashboardService();
