import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SubscriptionGuard } from "@/components/subscription/SubscriptionGuard";
import { EntityModuleStatusBadge } from "@/components/subscription/EntityModuleStatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Eye, Pencil, Trash2, Plus, Search, Filter, Loader2, MoreHorizontal, FileText, Users, Building, Landmark, UserPlus, UserMinus, Package, ShoppingCart, Activity, Calendar, MapPin, Download, Upload, Settings, History } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { EntityFormData, TeamMember, EntityAllocation, ActivityLogEntry } from "@/components/entity";
import { entityService } from "@/services/entityServiceFactory";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const EntityManagement = () => {
  console.log('EntityManagement component is rendering');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [entityType, setEntityType] = useState("");
  const [industry, setIndustry] = useState("");
  const [category, setCategory] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState("");
  const [activeTab, setActiveTab] = useState("entities");

  const [sortBy, setSortBy] = useState("name-asc");
  const [pageSize, setPageSize] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [entities, setEntities] = useState<EntityFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Mock data for different tabs
  const [activityLogData, setActivityLogData] = useState<ActivityLogEntry[]>([]);
  const [allocationData, setAllocationData] = useState<EntityAllocation[]>([]);
  const [teamJourneyData, setTeamJourneyData] = useState<any[]>([]);
  
  // Dialog states for Entity Allocation
  const [showNewAllocationDialog, setShowNewAllocationDialog] = useState(false);
  const [showAllocationDetailsDialog, setShowAllocationDetailsDialog] = useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState<EntityAllocation | null>(null);
  const [newAllocationForm, setNewAllocationForm] = useState({
    entityId: '',
    userId: '',
    userName: '',
    userEmail: '',
    allocationType: 'secondary' as 'primary' | 'secondary' | 'viewer',
    department: '',
    workload: '50'
  });
  
  // Mock data initialization
  useEffect(() => {
    const initializeMockData = () => {
      // Enhanced entity mock data
      const mockEntities: EntityFormData[] = [
        {
          id: "1",
          entityName: "TechCorp Solutions Pvt Ltd",
          cinNumber: "U72200MH2018PTC123456",
          entityType: "Private Limited Company",
          category: "Company Limited by Shares",
          subcategory: "Indian Non-Government Company",
          registrationNo: "123456",
          rocName: "Mumbai",
          lastAgmDate: "2023-09-15",
          balanceSheetDate: "2023-03-31",
          companyStatus: "Active",
          entityStatus: "active" as const,
          indexOfCharges: "No",
          directors: [],
          pan: 'ABCDE1234F',
          gstn: { available: true, number: 'GST123456789' },
          msme: { available: false, number: '' },
          shopEstablishment: { available: true, number: 'SE001' },
          bankAccounts: [],
          registeredOffice: { address: '123 Business Park', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
          sameAddress: true,
          businessLocations: ['Mumbai', 'Pune'],
          registeredEmail: 'contact@abcenterprises.com',
          alternateEmail: 'admin@abcenterprises.com',
          correspondenceEmail: 'correspondence@abcenterprises.com',
          phoneNumber: '+91-9876543210',
          keyPersonnel: [],
          industries: ['Manufacturing', 'Technology'],
          businessActivity: 'Software Development and Manufacturing',
          turnover: '50 Crores',
          employeeCount: 150,
          teamMembers: [
            { id: '1', name: 'John Doe', email: 'john@abc.com', role: 'Manager', permissions: ['read', 'write'], assignedDate: '2024-01-15', status: 'active' as const },
            { id: '2', name: 'Jane Smith', email: 'jane@abc.com', role: 'Analyst', permissions: ['read'], assignedDate: '2024-02-01', status: 'active' as const },
            { id: '3', name: 'Mike Johnson', email: 'mike@abc.com', role: 'Coordinator', permissions: ['read', 'write'], assignedDate: '2024-01-20', status: 'active' as const }
          ]
        },
        {
          id: "3",
          entityName: "Innovative Services LLP",
          cinNumber: "AAI-1234",
          entityType: "Limited Liability Partnership",
          category: "LLP",
          subcategory: "Professional Services",
          registrationNo: "AAI-1234",
          rocName: "Bangalore",
          lastAgmDate: "2023-07-10",
          balanceSheetDate: "2023-03-31",
          companyStatus: "Active",
          entityStatus: "pending" as const,
          indexOfCharges: "No",
          directors: [],
          pan: 'XYZAB5678G',
          gstn: { available: true, number: 'GST987654321' },
          msme: { available: true, number: 'MSME001' },
          shopEstablishment: { available: false, number: '' },
          bankAccounts: [],
          registeredOffice: { address: '456 Tech Hub', city: 'Delhi', state: 'Delhi', pincode: '110001' },
          sameAddress: true,
          businessLocations: ['Delhi', 'Gurgaon'],
          registeredEmail: 'info@xyzsolutions.com',
          alternateEmail: 'support@xyzsolutions.com',
          correspondenceEmail: 'legal@xyzsolutions.com',
          phoneNumber: '+91-9876543211',
          keyPersonnel: [],
          industries: ['Service', 'Consulting'],
          businessActivity: 'IT Consulting and Services',
          turnover: '25 Crores',
          employeeCount: 75,
          teamMembers: [
            { id: '4', name: 'Sarah Wilson', email: 'sarah@xyz.com', role: 'Lead', permissions: ['read', 'write', 'admin'], assignedDate: '2024-01-10', status: 'active' as const },
            { id: '5', name: 'David Brown', email: 'david@xyz.com', role: 'Specialist', permissions: ['read', 'write'], assignedDate: '2024-02-15', status: 'active' as const }
          ]
        },
        {
          id: "2",
          entityName: "Global Manufacturing Ltd",
          cinNumber: "L25200DL2015PLC234567",
          entityType: "Public Limited Company",
          category: "Company Limited by Shares",
          subcategory: "Indian Non-Government Company",
          registrationNo: "234567",
          rocName: "Delhi",
          lastAgmDate: "2023-08-20",
          balanceSheetDate: "2023-03-31",
          companyStatus: "Active",
          entityStatus: "active" as const,
          indexOfCharges: "Yes",
          directors: [],
          pan: 'PQRCD9012H',
          gstn: { available: true, number: 'GST456789123' },
          msme: { available: false, number: '' },
          shopEstablishment: { available: true, number: 'SE003' },
          bankAccounts: [],
          registeredOffice: { address: '789 Industrial Area', city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
          sameAddress: true,
          businessLocations: ['Bangalore', 'Chennai', 'Hyderabad'],
          registeredEmail: 'contact@pqrmanufacturing.com',
          alternateEmail: 'operations@pqrmanufacturing.com',
          correspondenceEmail: 'legal@pqrmanufacturing.com',
          phoneNumber: '+91-9876543212',
          keyPersonnel: [],
          industries: ['Manufacturing', 'Automotive'],
          businessActivity: 'Automotive Parts Manufacturing',
          turnover: '100 Crores',
          employeeCount: 300,
          teamMembers: [
            { id: '6', name: 'Robert Taylor', email: 'robert@pqr.com', role: 'Director', permissions: ['read', 'write', 'admin'], assignedDate: '2023-12-01', status: 'active' as const },
            { id: '7', name: 'Lisa Anderson', email: 'lisa@pqr.com', role: 'Manager', permissions: ['read', 'write'], assignedDate: '2024-01-05', status: 'active' as const },
            { id: '8', name: 'Tom Wilson', email: 'tom@pqr.com', role: 'Supervisor', permissions: ['read'], assignedDate: '2024-02-10', status: 'inactive' as const },
            { id: '9', name: 'Emma Davis', email: 'emma@pqr.com', role: 'Analyst', permissions: ['read'], assignedDate: '2024-03-01', status: 'pending' as const }
          ]
        },
        {
          id: "4",
          entityName: "Retail Chain Enterprises",
          cinNumber: "U52100KA2020PTC345678",
          entityType: "Private Limited Company",
          category: "Company Limited by Shares",
          subcategory: "Indian Non-Government Company",
          registrationNo: "345678",
          rocName: "Karnataka",
          lastAgmDate: "2023-06-25",
          balanceSheetDate: "2023-03-31",
          companyStatus: "Active",
          entityStatus: "suspended" as const,
          indexOfCharges: "No",
          directors: [],
          pan: 'TECHF3456I',
          gstn: { available: true, number: 'GST789123456' },
          msme: { available: true, number: 'MSME004' },
          shopEstablishment: { available: true, number: 'SE004' },
          bankAccounts: [],
          registeredOffice: { address: '321 IT Park', city: 'Chennai', state: 'Tamil Nadu', pincode: '600001' },
          sameAddress: true,
          businessLocations: ['Chennai', 'Coimbatore'],
          registeredEmail: 'hello@techinnovations.com',
          alternateEmail: 'support@techinnovations.com',
          correspondenceEmail: 'admin@techinnovations.com',
          phoneNumber: '+91-9876543213',
          keyPersonnel: [],
          industries: ['Technology', 'Software'],
          businessActivity: 'AI and Machine Learning Solutions',
          turnover: '15 Crores',
          employeeCount: 45,
          teamMembers: [
            { id: '10', name: 'Alex Kumar', email: 'alex@tech.com', role: 'CTO', permissions: ['read', 'write', 'admin'], assignedDate: '2024-01-01', status: 'active' as const },
            { id: '11', name: 'Priya Sharma', email: 'priya@tech.com', role: 'Developer', permissions: ['read', 'write'], assignedDate: '2024-01-15', status: 'active' as const }
          ]
        }
      ];

      // Activity Log Mock Data
      const mockActivityLog = [
        {
          id: '1',
          entityId: '1',
          userId: 'user1',
          userName: 'John Doe',
          action: 'Entity Created',
          description: 'ABC Enterprises Pvt Ltd entity was created successfully',
          timestamp: '2024-01-15T10:30:00Z',
          metadata: { entityName: 'ABC Enterprises Pvt Ltd', status: 'created' }
        },
        {
          id: '2',
          entityId: '1',
          userId: 'user2',
          userName: 'Jane Smith',
          action: 'Team Member Added',
          description: 'Mike Johnson was assigned as Coordinator',
          timestamp: '2024-01-20T14:15:00Z',
          metadata: { memberName: 'Mike Johnson', role: 'Coordinator' }
        },
        {
          id: '3',
          entityId: '2',
          userId: 'user3',
          userName: 'Sarah Wilson',
          action: 'Document Updated',
          description: 'GST registration document was updated',
          timestamp: '2024-02-01T09:45:00Z',
          metadata: { documentType: 'GST Registration', action: 'updated' }
        },
        {
          id: '4',
          entityId: '3',
          userId: 'user4',
          userName: 'Robert Taylor',
          action: 'Subscription Renewed',
          description: 'Entity Management module subscription renewed for 1 year',
          timestamp: '2024-02-15T16:20:00Z',
          metadata: { module: 'Entity Management', duration: '1 year' }
        },
        {
          id: '5',
          entityId: '4',
          userId: 'user5',
          userName: 'Alex Kumar',
          action: 'Compliance Updated',
          description: 'Annual compliance filing completed',
          timestamp: '2024-03-01T11:30:00Z',
          metadata: { complianceType: 'Annual Filing', status: 'completed' }
        },
        {
          id: '6',
          entityId: '1',
          userId: 'user1',
          userName: 'John Doe',
          action: 'Address Modified',
          description: 'Registered office address was updated',
          timestamp: '2024-03-10T13:45:00Z',
          metadata: { addressType: 'Registered Office', city: 'Mumbai' }
        }
      ];

      // Entity Allocation Mock Data
      const mockAllocation = [
        {
          id: '1',
          entityId: '1',
          entityName: 'ABC Enterprises Pvt Ltd',
          userId: 'user1',
          userName: 'John Doe',
          userEmail: 'john@abc.com',
          allocationType: 'primary' as const,
          allocatedDate: '2024-01-15',
          allocatedBy: 'System Admin',
          permissions: ['read', 'write', 'admin'],
          status: 'active' as const,
          department: 'Operations',
          workload: '75%'
        },
        {
          id: '2',
          entityId: '1',
          entityName: 'ABC Enterprises Pvt Ltd',
          userId: 'user2',
          userName: 'Jane Smith',
          userEmail: 'jane@abc.com',
          allocationType: 'secondary' as const,
          allocatedDate: '2024-02-01',
          allocatedBy: 'John Doe',
          permissions: ['read', 'write'],
          status: 'active' as const,
          department: 'Finance',
          workload: '50%'
        },
        {
          id: '3',
          entityId: '2',
          entityName: 'XYZ Solutions LLP',
          userId: 'user3',
          userName: 'Sarah Wilson',
          userEmail: 'sarah@xyz.com',
          allocationType: 'primary' as const,
          allocatedDate: '2024-01-10',
          allocatedBy: 'System Admin',
          permissions: ['read', 'write', 'admin'],
          status: 'active' as const,
          department: 'Technology',
          workload: '90%'
        },
        {
          id: '4',
          entityId: '3',
          entityName: 'PQR Manufacturing Ltd',
          userId: 'user4',
          userName: 'Robert Taylor',
          userEmail: 'robert@pqr.com',
          allocationType: 'primary' as const,
          allocatedDate: '2023-12-01',
          allocatedBy: 'System Admin',
          permissions: ['read', 'write', 'admin'],
          status: 'active' as const,
          department: 'Manufacturing',
          workload: '80%'
        },
        {
          id: '5',
          entityId: '3',
          entityName: 'PQR Manufacturing Ltd',
          userId: 'user7',
          userName: 'Lisa Anderson',
          userEmail: 'lisa@pqr.com',
          allocationType: 'secondary' as const,
          allocatedDate: '2024-01-05',
          allocatedBy: 'Robert Taylor',
          permissions: ['read', 'write'],
          status: 'active' as const,
          department: 'Quality Control',
          workload: '60%'
        },
        {
          id: '6',
          entityId: '4',
          entityName: 'Tech Innovations Pvt Ltd',
          userId: 'user10',
          userName: 'Alex Kumar',
          userEmail: 'alex@tech.com',
          allocationType: 'primary' as const,
          allocatedDate: '2024-01-01',
          allocatedBy: 'System Admin',
          permissions: ['read', 'write', 'admin'],
          status: 'active' as const,
          department: 'Development',
          workload: '85%'
        }
      ];

      // Team Journey Mock Data
      const mockTeamJourney = [
        {
          id: '1',
          entityId: '1',
          entityName: 'ABC Enterprises Pvt Ltd',
          memberId: 'user1',
          memberName: 'John Doe',
          role: 'Manager',
          joinDate: '2024-01-15',
          currentStep: 'Advanced Training',
          progress: 75,
          journey: [
            { id: '1', step: 'Onboarding', description: 'Complete initial setup and documentation', completedDate: '2024-01-16', status: 'completed' as const },
            { id: '2', step: 'Basic Training', description: 'Entity management fundamentals', completedDate: '2024-01-20', status: 'completed' as const },
            { id: '3', step: 'System Access', description: 'Access to all required modules', completedDate: '2024-01-25', status: 'completed' as const },
            { id: '4', step: 'Advanced Training', description: 'Advanced entity management features', status: 'in-progress' as const },
            { id: '5', step: 'Certification', description: 'Complete certification process', status: 'pending' as const }
          ],
          lastActivity: '2024-03-10',
          performanceScore: 88
        },
        {
          id: '2',
          entityId: '1',
          entityName: 'ABC Enterprises Pvt Ltd',
          memberId: 'user2',
          memberName: 'Jane Smith',
          role: 'Analyst',
          joinDate: '2024-02-01',
          currentStep: 'System Access',
          progress: 60,
          journey: [
            { id: '1', step: 'Onboarding', description: 'Complete initial setup and documentation', completedDate: '2024-02-02', status: 'completed' as const },
            { id: '2', step: 'Basic Training', description: 'Entity management fundamentals', completedDate: '2024-02-05', status: 'completed' as const },
            { id: '3', step: 'System Access', description: 'Access to required modules', status: 'in-progress' as const },
            { id: '4', step: 'Advanced Training', description: 'Advanced features training', status: 'pending' as const }
          ],
          lastActivity: '2024-03-08',
          performanceScore: 82
        },
        {
          id: '3',
          entityId: '2',
          entityName: 'XYZ Solutions LLP',
          memberId: 'user3',
          memberName: 'Sarah Wilson',
          role: 'Lead',
          joinDate: '2024-01-10',
          currentStep: 'Certification',
          progress: 90,
          journey: [
            { id: '1', step: 'Onboarding', description: 'Complete initial setup', completedDate: '2024-01-11', status: 'completed' as const },
            { id: '2', step: 'Basic Training', description: 'Fundamentals training', completedDate: '2024-01-15', status: 'completed' as const },
            { id: '3', step: 'System Access', description: 'Full system access', completedDate: '2024-01-18', status: 'completed' as const },
            { id: '4', step: 'Advanced Training', description: 'Advanced features', completedDate: '2024-02-01', status: 'completed' as const },
            { id: '5', step: 'Certification', description: 'Final certification', status: 'in-progress' as const }
          ],
          lastActivity: '2024-03-12',
          performanceScore: 95
        },
        {
          id: '4',
          entityId: '3',
          entityName: 'PQR Manufacturing Ltd',
          memberId: 'user4',
          memberName: 'Robert Taylor',
          role: 'Director',
          joinDate: '2023-12-01',
          currentStep: 'Mentoring',
          progress: 100,
          journey: [
            { id: '1', step: 'Onboarding', description: 'Executive onboarding', completedDate: '2023-12-02', status: 'completed' as const },
            { id: '2', step: 'System Training', description: 'Complete system training', completedDate: '2023-12-10', status: 'completed' as const },
            { id: '3', step: 'Leadership Training', description: 'Leadership and management', completedDate: '2024-01-15', status: 'completed' as const },
            { id: '4', step: 'Certification', description: 'Leadership certification', completedDate: '2024-02-01', status: 'completed' as const },
            { id: '5', step: 'Mentoring', description: 'Mentoring new team members', status: 'completed' as const }
          ],
          lastActivity: '2024-03-11',
          performanceScore: 98
        },
        {
          id: '5',
          entityId: '4',
          entityName: 'Tech Innovations Pvt Ltd',
          memberId: 'user10',
          memberName: 'Alex Kumar',
          role: 'CTO',
          joinDate: '2024-01-01',
          currentStep: 'Advanced Training',
          progress: 80,
          journey: [
            { id: '1', step: 'Technical Onboarding', description: 'Technical setup and access', completedDate: '2024-01-02', status: 'completed' as const },
            { id: '2', step: 'Platform Training', description: 'Platform familiarization', completedDate: '2024-01-08', status: 'completed' as const },
            { id: '3', step: 'Integration Training', description: 'System integration training', completedDate: '2024-01-20', status: 'completed' as const },
            { id: '4', step: 'Advanced Training', description: 'Advanced technical features', status: 'in-progress' as const },
            { id: '5', step: 'Technical Certification', description: 'Technical leadership certification', status: 'pending' as const }
          ],
          lastActivity: '2024-03-09',
          performanceScore: 92
        }
      ];

      setEntities(mockEntities);
      setActivityLogData(mockActivityLog);
      setAllocationData(mockAllocation);
      setTeamJourneyData(mockTeamJourney);
      setLoading(false);
    };
    
    initializeMockData();
  }, [refreshTrigger]);
  
  // Filter entities based on search and filters
  const filteredEntities = entities.filter(entity => {
    const matchesSearch = entity.entityName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         entity.cinNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entity.pan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entity.gstn?.number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !entityType || entityType === "all" || entity.entityType === entityType;
    const matchesIndustry = !industry || industry === "all" || (entity.industries && entity.industries.includes(industry));
    const matchesCategory = !category || category === "all" || entity.category === category;
    const matchesDateRange = !dateRange || dateRange === "all" || checkDateRange(entity.lastAgmDate, dateRange);
    const matchesTeamSize = !teamSize || teamSize === "all" || checkTeamSize(entity, teamSize);
    const matchesSubscription = !subscriptionStatus || subscriptionStatus === "all" || checkSubscriptionStatus(entity, subscriptionStatus);

    return matchesSearch && matchesType && matchesIndustry && matchesCategory && matchesDateRange && matchesTeamSize && matchesSubscription;
  });

  // Helper functions for advanced filtering
  const checkDateRange = (date: string, range: string) => {
    const entityDate = new Date(date);
    const now = new Date();
    const diffMonths = (now.getFullYear() - entityDate.getFullYear()) * 12 + now.getMonth() - entityDate.getMonth();
    
    switch (range) {
      case "last-month": return diffMonths <= 1;
      case "last-3-months": return diffMonths <= 3;
      case "last-6-months": return diffMonths <= 6;
      case "last-year": return diffMonths <= 12;
      default: return true;
    }
  };

  const checkTeamSize = (entity: EntityFormData, size: string) => {
    const teamCount = entity.teamMembers?.length || 0;
    switch (size) {
      case "small": return teamCount <= 5;
      case "medium": return teamCount > 5 && teamCount <= 20;
      case "large": return teamCount > 20;
      default: return true;
    }
  };

  const checkSubscriptionStatus = (entity: EntityFormData, status: string) => {
    // Mock subscription check - replace with actual logic
    switch (status) {
      case "active": return Math.random() > 0.3;
      case "expired": return Math.random() > 0.7;
      case "trial": return Math.random() > 0.8;
      default: return true;
    }
  };

  // Handle team member actions
  const handleAssignTeamMember = (entityId: string) => {
    navigate(`/entity/${entityId}/team/assign`);
  };

  const handleRemoveTeamMember = (entityId: string) => {
    navigate(`/entity/${entityId}/team/manage`);
  };

  const handleViewModules = (entityId: string) => {
    navigate(`/entity/${entityId}/modules`);
  };

  const handleViewPackages = () => {
    navigate('/subscription/browse');
  };

  const handleEntityAllocation = (entityId: string) => {
    navigate(`/entity/${entityId}/allocation`);
  };

  const handleViewActivityLog = (entityId: string) => {
    navigate(`/entity/${entityId}/activity`);
  };

  // Entity Allocation handlers
  const handleNewAllocation = () => {
    setShowNewAllocationDialog(true);
  };

  const handleViewAllocationDetails = (allocation: EntityAllocation) => {
    setSelectedAllocation(allocation);
    setShowAllocationDetailsDialog(true);
  };

  const handleCreateAllocation = () => {
    if (!newAllocationForm.entityId || !newAllocationForm.userName || !newAllocationForm.userEmail || !newAllocationForm.department) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newAllocation: EntityAllocation = {
      id: `alloc-${Date.now()}`,
      entityId: newAllocationForm.entityId,
      entityName: entities.find(e => e.id === newAllocationForm.entityId)?.entityName || 'Unknown Entity',
      userId: `user-${Date.now()}`,
      userName: newAllocationForm.userName,
      userEmail: newAllocationForm.userEmail,
      allocationType: newAllocationForm.allocationType,
      allocatedDate: new Date().toISOString().split('T')[0],
      allocatedBy: 'Current User',
      permissions: newAllocationForm.allocationType === 'primary' ? ['read', 'write', 'admin'] : 
                  newAllocationForm.allocationType === 'secondary' ? ['read', 'write'] : ['read'],
      status: 'active',
      department: newAllocationForm.department,
      workload: `${newAllocationForm.workload}%`
    };

    setAllocationData(prev => [...prev, newAllocation]);
    setShowNewAllocationDialog(false);
    setNewAllocationForm({
      entityId: '',
      userId: '',
      userName: '',
      userEmail: '',
      allocationType: 'secondary',
      department: '',
      workload: '50'
    });

    toast({
      title: "Success",
      description: "New allocation created successfully",
    });
  };

  const handleManageAllocation = (allocation: EntityAllocation) => {
    // Navigate to allocation management page or open edit dialog
    navigate(`/entity/${allocation.entityId}/allocation/${allocation.id}/manage`);
  };
  
  // Sort entities
  const sortedEntities = [...filteredEntities].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.entityName.localeCompare(b.entityName);
      case "name-desc":
        return b.entityName.localeCompare(a.entityName);
      case "latest":
        return new Date(b.lastAgmDate).getTime() - new Date(a.lastAgmDate).getTime();
      case "oldest":
        return new Date(a.lastAgmDate).getTime() - new Date(b.lastAgmDate).getTime();
      default:
        return 0;
    }
  });
  
  // Paginate entities
  const pageCount = Math.ceil(sortedEntities.length / parseInt(pageSize));
  const paginatedEntities = sortedEntities.slice(
    (currentPage - 1) * parseInt(pageSize),
    currentPage * parseInt(pageSize)
  );
  
  // Handle delete entity
  const handleDeleteEntity = async (cinNumber: string) => {
    if (confirm("Are you sure you want to delete this entity?")) {
      try {
        await entityService.deleteEntity(cinNumber);
        toast({
          title: "Success",
          description: "Entity deleted successfully",
        });
        // Refresh entities
        setRefreshTrigger(prev => prev + 1);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete entity",
          variant: "destructive"
        });
      }
    }
  };
  
  // Get document counts for an entity
  const getDocumentCounts = (entity: EntityFormData) => {
    const financialCount = entity.financialRecords?.length || 0;
    const creditorCount = entity.creditors?.length || 0;
    const bankDocCount = entity.bankDocuments?.length || 0;
    
    return { financialCount, creditorCount, bankDocCount };
  };

  // Early return for debugging
  if (loading) {
    return (
      <DashboardLayout>
        <SubscriptionGuard 
          moduleId="entity-management"
          fallbackTitle="Entity Management Module"
          fallbackDescription="Create, manage, and organize your business entities with advanced features"
        >
          <div className="container mx-auto p-6">
            <div className="flex justify-center items-center min-h-[60vh]">
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 animate-spin mb-4" />
                <p className="text-lg">Loading entities...</p>
              </div>
            </div>
          </div>
        </SubscriptionGuard>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <SubscriptionGuard 
        moduleId="entity-management"
        fallbackTitle="Entity Management Module"
        fallbackDescription="Create, manage, and organize your business entities with advanced features"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Entities</h1>
              <p className="text-muted-foreground mt-1">Manage and monitor your entities under Workplace</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleViewPackages} className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                View Packages
              </Button>
              <Button onClick={() => navigate('/create-entity')} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Entity
              </Button>
            </div>
          </div>

          {/* Entity Module Status Banner */}
          <EntityModuleStatusBadge variant="banner" showDetails={true} />

          <div className="bg-card rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4 mb-4">
            <Select value={entityType || ""} onValueChange={setEntityType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Entity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Company">Company</SelectItem>
                <SelectItem value="LLP">LLP</SelectItem>
                <SelectItem value="Partnership">Partnership</SelectItem>
                <SelectItem value="Individual">Individual</SelectItem>
                <SelectItem value="Trust">Trust</SelectItem>
              </SelectContent>
            </Select>

            <Select value={industry || ""} onValueChange={setIndustry}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                <SelectItem value="Service">Service</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Real Estate">Real Estate</SelectItem>
                <SelectItem value="Educational">Educational</SelectItem>
              </SelectContent>
            </Select>

            <Select value={category || ""} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Private">Private</SelectItem>
                <SelectItem value="Public">Public</SelectItem>
                <SelectItem value="Individual">Individual</SelectItem>
                <SelectItem value="Non-Profit">Non-Profit</SelectItem>
              </SelectContent>
            </Select>
            


            <div className="ml-auto flex gap-2">
              <Select value={sortBy || "name-asc"} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name A-Z</SelectItem>
                  <SelectItem value="name-desc">Name Z-A</SelectItem>
                  <SelectItem value="latest">Latest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="entities" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Entities
            </TabsTrigger>
            <TabsTrigger value="activity-log" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Activity Log
            </TabsTrigger>
            <TabsTrigger value="allocation" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Entity Allocation
            </TabsTrigger>
            <TabsTrigger value="team-journey" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Journey
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="entities" className="mt-6">
            <div className="bg-card rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entity Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        <span>Loading entities...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedEntities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <div className="text-center">
                        <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No entities found</h3>
                        <p className="text-muted-foreground mb-4">Create your first entity to get started</p>
                        <Button onClick={() => navigate('/add-entity')}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Entity
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedEntities.map((entity) => {
                    const { financialCount, creditorCount, bankDocCount } = getDocumentCounts(entity);
                    const teamCount = entity.teamMembers?.length || 0;
                    const subscriptionActive = checkSubscriptionStatus(entity, 'active');
                    
                    return (
                      <TableRow key={entity.cinNumber}>
                        <TableCell>
                          <div>
                            <Link 
                              to={`/entity/${entity.id}`} 
                              className="font-medium hover:underline text-primary"
                            >
                              {entity.entityName}
                            </Link>
                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                              <span>{entity.cinNumber}</span>
                              {entity.pan && (
                                <Badge variant="secondary" className="text-xs px-1 py-0">
                                  PAN: {entity.pan.slice(-4)}
                                </Badge>
                              )}
                              {entity.gstn?.number && (
                                <Badge variant="secondary" className="text-xs px-1 py-0">
                                  GST: {entity.gstn.number.slice(-4)}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{entity.entityType}</span>
                            <span className="text-xs text-muted-foreground">{entity.category}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {entity.industries?.slice(0, 2).map((ind, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {ind}
                              </Badge>
                            ))}
                            {entity.industries && entity.industries.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{entity.industries.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">{teamCount}</span>
                            </div>
                            {teamCount > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                Active
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={subscriptionActive ? "default" : "destructive"}
                              className="text-xs"
                            >
                              {subscriptionActive ? "Active" : "Inactive"}
                            </Badge>
                            {subscriptionActive && (
                              <Package className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => {
                                    console.log('View button clicked for entity:', entity.id, entity.entityName);
                                    console.log('Navigating to:', `/entity/${entity.id}`);
                                    navigate(`/entity/${entity.id}`);
                                  }}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View Entity Profile</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => navigate(`/edit-entity/${entity.id}`)}>
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit Entity</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>Entity Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                
                                <DropdownMenuItem onClick={() => handleAssignTeamMember(entity.cinNumber)}>
                                  <UserPlus className="h-4 w-4 mr-2" />
                                  Assign Team Member
                                </DropdownMenuItem>
                                
                                <DropdownMenuItem onClick={() => handleRemoveTeamMember(entity.cinNumber)}>
                                  <UserMinus className="h-4 w-4 mr-2" />
                                  Manage Team Members
                                </DropdownMenuItem>
                                
                                <DropdownMenuSeparator />
                                
                                <DropdownMenuItem onClick={() => handleViewModules(entity.cinNumber)}>
                                  <Package className="h-4 w-4 mr-2" />
                                  View Subscribed Modules
                                </DropdownMenuItem>
                                
                                <DropdownMenuItem onClick={handleViewPackages}>
                                  <ShoppingCart className="h-4 w-4 mr-2" />
                                  View Subscription Packages
                                </DropdownMenuItem>
                                
                                <DropdownMenuSeparator />
                                
                                <DropdownMenuItem onClick={() => handleEntityAllocation(entity.cinNumber)}>
                                  <MapPin className="h-4 w-4 mr-2" />
                                  Entity Allocation
                                </DropdownMenuItem>
                                
                                <DropdownMenuItem onClick={() => handleViewActivityLog(entity.cinNumber)}>
                                  <Activity className="h-4 w-4 mr-2" />
                                  View Activity Log
                                </DropdownMenuItem>
                                
                                <DropdownMenuSeparator />
                                
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteEntity(entity.cinNumber)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Entity
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="py-4 px-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {paginatedEntities.length} of {filteredEntities.length} entities
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
                    // Show first page, last page, and pages around current page
                    let pageNum;
                    if (pageCount <= 5) {
                      // If 5 or fewer pages, show all
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      // If near start, show first 5
                      pageNum = i + 1;
                    } else if (currentPage >= pageCount - 2) {
                      // If near end, show last 5
                      pageNum = pageCount - 4 + i;
                    } else {
                      // Otherwise show current and 2 on each side
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <PaginationItem key={i}>
                        <PaginationLink 
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  {pageCount > 5 && currentPage < pageCount - 2 && (
                    <>
                      <PaginationItem>
                        <PaginationLink className="cursor-default">...</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink 
                          onClick={() => setCurrentPage(pageCount)}
                          className="cursor-pointer"
                        >
                          {pageCount}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(pageCount, prev + 1))}
                      className={currentPage === pageCount ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Show:</span>
                <Select value={pageSize} onValueChange={setPageSize}>
                  <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
            </div>
          </TabsContent>
          
          <TabsContent value="activity-log" className="mt-6">
            <div className="bg-card rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      Activity Log
                    </h3>
                    <p className="text-muted-foreground mt-1">Track all entity-related activities and changes</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Log
                    </Button>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activityLogData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10">
                          <div className="text-center">
                            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Activity Found</h3>
                            <p className="text-muted-foreground">Activity logs will appear here as actions are performed</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      activityLogData.map((activity) => {
                        const entity = entities.find(e => e.id === activity.entityId);
                        const timestamp = new Date(activity.timestamp);
                        
                        return (
                          <TableRow key={activity.id}>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{timestamp.toLocaleDateString()}</span>
                                <span className="text-xs text-muted-foreground">{timestamp.toLocaleTimeString()}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{entity?.entityName || 'Unknown Entity'}</span>
                                <span className="text-xs text-muted-foreground">{entity?.cinNumber}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-medium text-primary">
                                    {activity.userName.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <span className="font-medium">{activity.userName}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-medium">
                                {activity.action}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">{activity.description}</span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                Completed
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="p-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {activityLogData.length} activities
                  </div>
                  <Button variant="outline" size="sm">
                    <History className="h-4 w-4 mr-2" />
                    Load More
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="allocation" className="mt-6">
            <div className="bg-card rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Entity Allocation
                    </h3>
                    <p className="text-muted-foreground mt-1">Manage entity assignments and user allocations</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleNewAllocation}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      New Allocation
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Entity</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Workload</TableHead>
                      <TableHead>Allocated Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allocationData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-10">
                          <div className="text-center">
                            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Allocations Found</h3>
                            <p className="text-muted-foreground mb-4">Create your first entity allocation</p>
                            <Button variant="outline">
                              <UserPlus className="h-4 w-4 mr-2" />
                              Add Allocation
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      allocationData.map((allocation) => {
                        return (
                          <TableRow key={allocation.id}>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{allocation.entityName}</span>
                                <span className="text-xs text-muted-foreground">{allocation.entityId}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-medium text-primary">
                                    {allocation.userName.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-medium">{allocation.userName}</div>
                                  <div className="text-xs text-muted-foreground">{allocation.userEmail}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={allocation.allocationType === 'primary' ? 'default' : 'secondary'}
                                className="capitalize"
                              >
                                {allocation.allocationType}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">{allocation.department}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-primary h-2 rounded-full" 
                                    style={{ width: allocation.workload }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">{allocation.workload}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{new Date(allocation.allocatedDate).toLocaleDateString()}</span>
                                <span className="text-xs text-muted-foreground">by {allocation.allocatedBy}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={allocation.status === 'active' ? 'default' : 'destructive'}
                                className="capitalize"
                              >
                                {allocation.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" onClick={() => handleViewAllocationDetails(allocation)}>
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>View Details</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <Settings className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Manage Allocation</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="p-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {allocationData.length} allocations
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Total Workload:</span>
                    <Badge variant="outline">
                      {allocationData.length > 0 ? 
                        (allocationData.reduce((acc, curr) => acc + parseInt(curr.workload), 0) / allocationData.length).toFixed(2) 
                        : '0.00'}% avg
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="team-journey" className="mt-6">
            <div className="bg-card rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Team Member Journey
                    </h3>
                    <p className="text-muted-foreground mt-1">Track team member progress and milestones across entities</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Timeline View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Current Step</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamJourneyData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-10">
                          <div className="text-center">
                            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Team Journey Data</h3>
                            <p className="text-muted-foreground mb-4">Team member journeys will appear here</p>
                            <Button variant="outline">
                              <UserPlus className="h-4 w-4 mr-2" />
                              Add Team Member
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      teamJourneyData.map((journey) => {
                        const progressColor = journey.progress >= 80 ? 'bg-green-500' : 
                                             journey.progress >= 60 ? 'bg-yellow-500' : 
                                             journey.progress >= 40 ? 'bg-orange-500' : 'bg-red-500';
                        
                        const performanceColor = journey.performanceScore >= 90 ? 'text-green-600' : 
                                                journey.performanceScore >= 80 ? 'text-blue-600' : 
                                                journey.performanceScore >= 70 ? 'text-yellow-600' : 'text-red-600';
                        
                        return (
                          <TableRow key={journey.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-primary">
                                    {journey.memberName.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-medium">{journey.memberName}</div>
                                  <div className="text-xs text-muted-foreground">Joined {new Date(journey.joinDate).toLocaleDateString()}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{journey.entityName}</span>
                                <span className="text-xs text-muted-foreground">{journey.entityId}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-medium">
                                {journey.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{journey.currentStep}</span>
                                <span className="text-xs text-muted-foreground">
                                  Step {journey.journey?.findIndex(j => j.status === 'in-progress') + 1 || journey.journey?.length} of {journey.journey?.length}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${progressColor}`}
                                    style={{ width: `${journey.progress}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">{journey.progress}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <span className={`font-medium ${performanceColor}`}>
                                  {journey.performanceScore}
                                </span>
                                <span className="text-xs text-muted-foreground">/100</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{new Date(journey.lastActivity).toLocaleDateString()}</span>
                                <span className="text-xs text-muted-foreground">
                                  {Math.floor((new Date().getTime() - new Date(journey.lastActivity).getTime()) / (1000 * 60 * 60 * 24))} days ago
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>View Journey Details</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <Calendar className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>View Timeline</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Journey Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                      <Settings className="h-4 w-4 mr-2" />
                                      Update Progress
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Activity className="h-4 w-4 mr-2" />
                                      Add Milestone
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <FileText className="h-4 w-4 mr-2" />
                                      Generate Report
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="p-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {teamJourneyData.length} team member journeys
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Avg Progress:</span>
                      <Badge variant="outline">
                        {teamJourneyData.length > 0 ? Math.round(teamJourneyData.reduce((acc, curr) => acc + curr.progress, 0) / teamJourneyData.length) : 0}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Avg Performance:</span>
                      <Badge variant="outline">
                        {teamJourneyData.length > 0 ? Math.round(teamJourneyData.reduce((acc, curr) => acc + curr.performanceScore, 0) / teamJourneyData.length) : 0}/100
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* New Allocation Dialog */}
        <Dialog open={showNewAllocationDialog} onOpenChange={setShowNewAllocationDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                New Entity Allocation
              </DialogTitle>
              <DialogDescription>
                Assign a user to an entity with specific permissions and workload.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Entity *</label>
                <Select value={newAllocationForm.entityId} onValueChange={(value) => 
                  setNewAllocationForm(prev => ({ ...prev, entityId: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select entity" />
                  </SelectTrigger>
                  <SelectContent>
                    {entities.map(entity => (
                      <SelectItem key={entity.id} value={entity.id}>
                        {entity.entityName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">User Name *</label>
                <Input
                  placeholder="Enter user name"
                  value={newAllocationForm.userName}
                  onChange={(e) => setNewAllocationForm(prev => ({ ...prev, userName: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">User Email *</label>
                <Input
                  type="email"
                  placeholder="Enter user email"
                  value={newAllocationForm.userEmail}
                  onChange={(e) => setNewAllocationForm(prev => ({ ...prev, userEmail: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Allocation Type</label>
                <Select value={newAllocationForm.allocationType} onValueChange={(value: 'primary' | 'secondary' | 'viewer') => 
                  setNewAllocationForm(prev => ({ ...prev, allocationType: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary (Full Access)</SelectItem>
                    <SelectItem value="secondary">Secondary (Read/Write)</SelectItem>
                    <SelectItem value="viewer">Viewer (Read Only)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Department *</label>
                <Select value={newAllocationForm.department} onValueChange={(value) => 
                  setNewAllocationForm(prev => ({ ...prev, department: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Quality Control">Quality Control</SelectItem>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="HR">Human Resources</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Workload (%)</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={newAllocationForm.workload}
                    onChange={(e) => setNewAllocationForm(prev => ({ ...prev, workload: e.target.value }))}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowNewAllocationDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAllocation}>
                Create Allocation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Allocation Details Dialog */}
        <Dialog open={showAllocationDetailsDialog} onOpenChange={setShowAllocationDetailsDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Allocation Details
              </DialogTitle>
              <DialogDescription>
                View detailed information about this entity allocation.
              </DialogDescription>
            </DialogHeader>
            
            {selectedAllocation && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Entity</label>
                    <p className="font-medium">{selectedAllocation.entityName}</p>
                    <p className="text-xs text-muted-foreground">{selectedAllocation.entityId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">User</label>
                    <p className="font-medium">{selectedAllocation.userName}</p>
                    <p className="text-xs text-muted-foreground">{selectedAllocation.userEmail}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Allocation Type</label>
                    <Badge variant={selectedAllocation.allocationType === 'primary' ? 'default' : 'secondary'} className="capitalize">
                      {selectedAllocation.allocationType}
                    </Badge>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
                    <Badge variant={selectedAllocation.status === 'active' ? 'default' : 'destructive'} className="capitalize">
                      {selectedAllocation.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Department</label>
                    <p className="font-medium">{selectedAllocation.department}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Workload</label>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: selectedAllocation.workload }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{selectedAllocation.workload}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Allocated Date</label>
                    <p className="font-medium">{new Date(selectedAllocation.allocatedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Allocated By</label>
                    <p className="font-medium">{selectedAllocation.allocatedBy}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Permissions</label>
                  <div className="flex flex-wrap gap-1">
                    {selectedAllocation.permissions.map((permission, index) => (
                      <Badge key={index} variant="outline" className="text-xs capitalize">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowAllocationDetailsDialog(false)}>
                Close
              </Button>
              <Button onClick={() => {
                if (selectedAllocation) {
                  handleManageAllocation(selectedAllocation);
                  setShowAllocationDetailsDialog(false);
                }
              }}>
                <Settings className="h-4 w-4 mr-2" />
                Manage Allocation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </SubscriptionGuard>
    </DashboardLayout>
  );
};

export default EntityManagement;
