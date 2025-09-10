import { useMemo, useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Share2, 
  Upload, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  Send, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Star,
  MessageSquare,
  Calendar,
  User,
  Building,
  Globe,
  Lock,
  Unlock,
  Flag,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Users,
  MapPin,
  Settings,
  Bell,
  ArrowLeft,
  ArrowRight,
  VideoIcon,
  MapPinIcon,
  MonitorSpeaker,
  TrendingUp,
  Award,
  Info,
  HelpCircle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

// Enhanced Types based on Business Requirements
type ResourceType = 'infrastructure' | 'article' | 'trainee';
type ResourceStatus = 'available' | 'occupied' | 'inactive';
type RequestStatus = 'pending' | 'accepted' | 'rejected';
type UrgencyLevel = 'high' | 'medium' | 'low';
type CollaborationMode = 'virtual' | 'in-person' | 'hybrid';
type RequestType = 'module' | 'checklist' | 'task' | 'subtask' | 'custom';

interface TeamMember {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  experience: string;
  isAvailable: boolean;
}

interface Resource {
  id: string;
  title: string;
  information: string; // Detailed content or usage notes
  type: ResourceType;
  subtype?: string; // e.g., Meeting Room, Workspace, Research, Legal Docs, CA, CS
  location?: string; // Physical address if applicable
  endDate?: Date | null; // Optional resource expiry or availability end date
  startDate?: Date | null;
  teamMemberIds?: string[]; // For trainee type - references to team members
  maskedName?: string; // Masked name for resource seekers
  owner: {
    id: string;
    name: string;
    organization: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
  status: ResourceStatus;
  requestsCount: number;
  hasNewRequests: boolean; // Flag for new requests
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  rating?: number; // Average rating out of 5
  reviewCount?: number; // Number of reviews
  isPopular?: boolean; // High-demand resource
  isRecentlyUsed?: boolean; // Recently accessed
}

interface ResourceRequest {
  id: string;
  resourceId: string;
  resource: Resource;
  requester: {
    id: string;
    name: string;
    organization: string;
    email: string;
  };
  requestType: RequestType;
  customRequestType?: string; // When requestType is 'custom'
  purposeOfRequest: string; // Purpose description
  requestedStartDateTime?: Date | null;
  requestedEndDateTime?: Date | null;
  durationOfUse?: string; // Auto-calculated or manual
  preferredModeOfCollaboration?: CollaborationMode;
  supportingDocument?: {
    name: string;
    url: string;
  };
  confidentialityRequired: boolean;
  comments?: string; // Additional information
  urgencyIndicator: UrgencyLevel;
  requestRecurrence?: {
    enabled: boolean;
    frequency?: string; // e.g., 'weekly', 'monthly'
  };
  status: RequestStatus;
  requestedAt: Date;
  respondedAt?: Date;
  responseMessage?: string;
}

// Enhanced Mock Data
const mockTeamMembers: TeamMember[] = [
  {
    id: 'tm1',
    name: 'Priya Sharma',
    designation: 'Semi-Qualified CS',
    qualification: 'CS Executive',
    experience: '2 years',
    isAvailable: true
  },
  {
    id: 'tm2',
    name: 'Amit Kumar',
    designation: 'CA Articleship',
    qualification: 'CA Inter',
    experience: '1.5 years',
    isAvailable: false
  }
];

const mockResources: Resource[] = [
  // Infrastructure Resources
  {
    id: '1',
    title: 'Meeting Room A - 8 Seats',
    information: 'Conference room with display, whiteboard, and video conferencing facility. Suitable for client meetings and team discussions.',
    type: 'infrastructure',
    location: 'BKC, Mumbai',
    endDate: null,
    owner: { id: 'sp1', name: 'Rahul Mehta', organization: 'Mehta & Co.', email: 'rahul@mehtaco.com' },
    createdAt: new Date('2025-07-01'),
    updatedAt: new Date('2025-07-12'),
    status: 'available',
    requestsCount: 2,
    hasNewRequests: true,
    maskedName: 'R***l M***a',
    rating: 4.5,
    reviewCount: 12,
    isPopular: true,
    isRecentlyUsed: false
  },
  {
    id: '4',
    title: 'Co-working Space - 5 Seats',
    information: 'Dedicated workstations in a shared office space with high-speed internet, printing facilities, and pantry access.',
    type: 'infrastructure',
    location: 'Andheri East, Mumbai',
    endDate: new Date('2025-12-31'),
    owner: { id: 'sp3', name: 'Vikram Singh', organization: 'Singh & Associates', email: 'vikram@singhassociates.in' },
    createdAt: new Date('2025-06-20'),
    updatedAt: new Date('2025-07-15'),
    status: 'available',
    requestsCount: 1,
    hasNewRequests: false,
    maskedName: 'V****m S***h',
    rating: 4.2,
    reviewCount: 8,
    isPopular: false,
    isRecentlyUsed: true
  },
  
  // Article/Knowledge Resources
  {
    id: '2',
    title: 'Research Article: Direct Tax Amendments 24-25',
    information: 'Comprehensive analysis of direct tax amendments with case studies, practical implications, and compliance requirements.',
    type: 'article',
    location: 'Digital',
    endDate: null,
    owner: { id: 'sp2', name: 'Anita Verma', organization: 'Verma Advisors', email: 'anita@vermaadvisors.com' },
    createdAt: new Date('2025-06-15'),
    updatedAt: new Date('2025-06-20'),
    status: 'available',
    requestsCount: 0,
    hasNewRequests: false,
    maskedName: 'A***a V***a',
    rating: 4.8,
    reviewCount: 25,
    isPopular: true,
    isRecentlyUsed: false,
    attachments: [{
      name: 'Direct_Tax_Amendments_2024-25.pdf',
      url: '/documents/tax-amendments.pdf',
      type: 'application/pdf'
    }]
  },
  {
    id: '5',
    title: 'GST Audit Checklist & Compliance Guide',
    information: 'Detailed checklist for GST audit requirements, common pitfalls, and best practices for compliance. Includes recent circulars and notifications.',
    type: 'article',
    location: 'Digital',
    endDate: null,
    owner: { id: 'sp4', name: 'Priya Desai', organization: 'Desai Tax Consultants', email: 'priya@desaitax.com' },
    createdAt: new Date('2025-07-10'),
    updatedAt: new Date('2025-07-18'),
    status: 'available',
    requestsCount: 3,
    hasNewRequests: true,
    maskedName: 'P***a D***i',
    rating: 4.6,
    reviewCount: 18,
    isPopular: true,
    isRecentlyUsed: true,
    attachments: [{
      name: 'GST_Audit_Checklist_2025.xlsx',
      url: '/documents/gst-audit-2025.xlsx',
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }]
  },
  
  // Human Resources/Trainees
 
  {
    id: '6',
    title: 'Trainee — GST Specialist (CA Inter)',
    information: 'CA Inter trainee with GST compliance experience; available for project-based assignments.',
    type: 'trainee',
    subtype: 'CA',
    location: 'Mumbai/Remote',
    endDate: new Date('2025-09-30'),
    teamMemberIds: ['tm2'],
    owner: { id: 'sp5', name: 'Rajesh Iyer', organization: 'Iyer & Co.', email: 'rajesh@iyerco.in' },
    createdAt: new Date('2025-07-12'),
    updatedAt: new Date('2025-07-18'),
    status: 'occupied',
    requestsCount: 2,
    hasNewRequests: true,
    maskedName: 'R****h I***r'
  },
  {
    id: '7',
    title: 'Archived Workspace — Bandra (2 Seats)',
    information: 'Small workspace previously available; currently inactive pending reconfiguration.',
    type: 'infrastructure',
    location: 'Bandra West, Mumbai',
    endDate: null,
    owner: { id: 'sp6', name: 'Neha Kapoor', organization: 'Kapoor & Co.', email: 'neha@kapoorco.in' },
    createdAt: new Date('2025-05-10'),
    updatedAt: new Date('2025-06-01'),
    status: 'inactive',
    requestsCount: 0,
    hasNewRequests: false,
    maskedName: 'N**a K****r'
  }
];

const mockRequests: ResourceRequest[] = [
  // Pending Requests
  {
    id: 'r1',
    resourceId: '2',
    resource: mockResources[2],
    requester: {
      id: 'ssk1',
      name: 'Kunal Shah',
      organization: 'Shah & Partners',
      email: 'kunal@shahpartners.com',
    },
    requestType: 'module',
    purposeOfRequest: 'Support for ROC filings and compliance work for multiple clients',
    requestedStartDateTime: new Date('2025-07-20T10:00:00'),
    requestedEndDateTime: new Date('2025-07-22T18:00:00'),
    durationOfUse: '2 Days (16 Hours)',
    preferredModeOfCollaboration: 'hybrid',
    confidentialityRequired: true,
    comments: 'Need experienced person for handling sensitive client data. Flexible with timings.',
    urgencyIndicator: 'high',
    status: 'pending',
    requestedAt: new Date('2025-07-18'),
    supportingDocument: {
      name: 'Client_Requirements.pdf',
      url: '/documents/client-req.pdf'
    }
  },
  {
    id: 'r2',
    resourceId: '1',
    resource: mockResources[0],
    requester: {
      id: 'ssk2',
      name: 'Meera Patel',
      organization: 'Patel Associates',
      email: 'meera@patelassoc.com',
    },
    requestType: 'task',
    purposeOfRequest: 'Client presentation and board meeting',
    requestedStartDateTime: new Date('2025-07-25T14:00:00'),
    requestedEndDateTime: new Date('2025-07-25T17:00:00'),
    durationOfUse: '3 Hours',
    preferredModeOfCollaboration: 'in-person',
    confidentialityRequired: false,
    comments: 'Need projector and whiteboard for presentation',
    urgencyIndicator: 'medium',
    status: 'pending',
    requestedAt: new Date('2025-07-19')
  },
  
  // Approved Requests
  {
    id: 'r3',
    resourceId: '5',
    resource: mockResources[3],
    requester: {
      id: 'ssk3',
      name: 'Ravi Nair',
      organization: 'Nair & Co.',
      email: 'ravi@nairco.in',
    },
    requestType: 'checklist',
    purposeOfRequest: 'Reference for upcoming GST audit of manufacturing client',
    requestedStartDateTime: null,
    requestedEndDateTime: null,
    durationOfUse: '1 Week',
    preferredModeOfCollaboration: 'virtual',
    confidentialityRequired: false,
    comments: 'Need to verify compliance requirements for manufacturing sector',
    urgencyIndicator: 'medium',
    status: 'accepted',
    requestedAt: new Date('2025-07-12'),
    respondedAt: new Date('2025-07-13'),
    responseMessage: 'Access granted. Please ensure to review the document within the specified timeframe.'
  },
  
  // Rejected Requests
  {
    id: 'r4',
    resourceId: '6',
    resource: mockResources[5],
    requester: {
      id: 'ssk4',
      name: 'Anjali Gupta',
      organization: 'Gupta & Sons',
      email: 'anjali@g-sons.com',
    },
    requestType: 'custom',
    customRequestType: 'consultation',
    purposeOfRequest: 'GST advisory for new e-commerce business',
    requestedStartDateTime: new Date('2025-08-01T11:00:00'),
    requestedEndDateTime: new Date('2025-08-01T13:00:00'),
    durationOfUse: '2 Hours',
    preferredModeOfCollaboration: 'virtual',
    confidentialityRequired: true,
    comments: 'Need expert advice on GST registration and compliance for e-commerce',
    urgencyIndicator: 'high',
    status: 'rejected',
    requestedAt: new Date('2025-07-17'),
    respondedAt: new Date('2025-07-17'),
    responseMessage: 'Apologies, but the consultant is fully booked during the requested period. Please consider alternative dates or resources.'
  },
  
  // Completed Requests
  {
    id: 'r5',
    resourceId: '4',
    resource: mockResources[1],
    requester: {
      id: 'ssk5',
      name: 'Arun Joshi',
      organization: 'Joshi Consultants',
      email: 'arun@joshiconsult.com',
    },
    requestType: 'custom',
    customRequestType: 'workspace',
    purposeOfRequest: 'Temporary workspace during office renovation',
    requestedStartDateTime: new Date('2025-07-10T09:00:00'),
    requestedEndDateTime: new Date('2025-07-12T18:00:00'),
    durationOfUse: '3 Days',
    preferredModeOfCollaboration: 'in-person',
    confidentialityRequired: true,
    comments: 'Need secure workspace for team of 3',
    urgencyIndicator: 'medium',
    status: 'accepted',
    requestedAt: new Date('2025-07-05'),
    respondedAt: new Date('2025-07-06'),
    responseMessage: 'Booking confirmed. Access details have been shared via email.'
  }
];

function ResourceSharingPooling() {
  return (
    <DashboardLayout userType="service_provider">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resource Sharing & Pooling</h1>
          <p className="text-gray-600">Collaborate by sharing and accessing professional resources, infrastructure, and expertise within the community.</p>
        </div>

        <ResourceSharingModule />
      </div>
    </DashboardLayout>
  );
}

function ResourceSharingModule() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'provider' | 'seeker'>('provider');
  const [providerView, setProviderView] = useState<'resources' | 'upload'>('resources');
  const [seekerView, setSeekerView] = useState<'browse' | 'requests' | 'create'>('browse');
  
  // Data State
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [requests, setRequests] = useState<ResourceRequest[]>(mockRequests);
  // Initialize with mock requests so the "My Requests" section shows data by default
  const [myRequests, setMyRequests] = useState<ResourceRequest[]>([...mockRequests]);
  const [teamMembers] = useState<TeamMember[]>(mockTeamMembers);
  
  // Ensure mock data shows up even if state persisted empty across HMR
  useEffect(() => {
    if (!myRequests || myRequests.length === 0) {
      setMyRequests([...mockRequests]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Expand mock data to enable pagination demos (non-destructive, runs once)
  useEffect(() => {
    // Only expand if the dataset is small
    if (resources.length >= 24 && requests.length >= 20) return;

    const makeMasked = (name: string) =>
      name && name.length > 2 ? `${name[0]}***${name[name.length - 1]}` : '*****';

    const extraResources: Resource[] = [];
    const now = Date.now();
    const targets = 24; // aim for ~24+ resources
    for (let i = resources.length; i < targets; i++) {
      const base = mockResources[i % mockResources.length];
      const id = `gen_${i + 1}`;
      extraResources.push({
        ...base,
        id,
        title: `${base.title} — ${i + 1}`,
        createdAt: new Date(now - i * 86400000),
        updatedAt: new Date(now - i * 43200000),
        status: i % 5 === 0 ? 'occupied' : 'available',
        hasNewRequests: i % 3 === 0,
        requestsCount: base.requestsCount + (i % 4),
        maskedName: base.maskedName || makeMasked(base.owner.name),
      });
    }

    const extraRequests: ResourceRequest[] = [];
    const reqTargets = 22; // aim for ~22+ requests
    const allResources = [...resources, ...extraResources];
    for (let i = requests.length; i < reqTargets; i++) {
      const res = allResources[i % allResources.length];
      const rid = `gr_${i + 1}`;
      const createdAt = new Date(now - i * 7200000);
      const status: RequestStatus = i % 6 === 0 ? 'accepted' : i % 5 === 0 ? 'rejected' : 'pending';
      extraRequests.push({
        id: rid,
        resourceId: res.id,
        resource: res,
        requester: {
          id: `ssk_gen_${i}`,
          name: `Generated Seeker ${i + 1}`,
          organization: `Gen Org ${((i % 5) + 1)}`,
          email: `seeker${i + 1}@gen.org`
        },
        requestType: (['module','checklist','task','subtask','custom'] as RequestType[])[i % 5],
        customRequestType: (i % 5) === 4 ? `Custom Type ${i + 1}` : undefined,
        purposeOfRequest: `Auto-generated purpose ${i + 1} for testing pagination and views`,
        requestedStartDateTime: new Date(now + (i % 3) * 3600000),
        requestedEndDateTime: new Date(now + ((i % 3) * 3600000) + 7200000),
        durationOfUse: `${2 + (i % 4)} Hours`,
        preferredModeOfCollaboration: (['virtual','in-person','hybrid'] as CollaborationMode[])[i % 3],
        supportingDocument: i % 4 === 0 ? { name: `support_doc_${i + 1}.pdf`, url: '#' } : undefined,
        confidentialityRequired: i % 2 === 0,
        comments: i % 3 === 0 ? 'Auto-generated comment' : undefined,
        urgencyIndicator: (['high','medium','low'] as UrgencyLevel[])[i % 3],
        requestRecurrence: { enabled: i % 4 === 0, frequency: i % 4 === 0 ? 'weekly' : undefined },
        status,
        requestedAt: createdAt,
        respondedAt: status === 'pending' ? undefined : new Date(createdAt.getTime() + 3600000),
        responseMessage: status === 'accepted' ? 'Approved by provider' : status === 'rejected' ? 'Rejected by provider' : undefined
      });
    }

    if (extraResources.length) setResources(prev => [...prev, ...extraResources]);
    if (extraRequests.length) {
      setRequests(prev => [...prev, ...extraRequests]);
      setMyRequests(prev => [...prev, ...extraRequests]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest'>('latest');
  const [pageSize, setPageSize] = useState<10 | 50 | 100>(10);
  const [page, setPage] = useState(1);
  
  // Dialog State
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ResourceRequest | null>(null);
  const [isViewResourceOpen, setIsViewResourceOpen] = useState(false);
  const [isViewRequestOpen, setIsViewRequestOpen] = useState(false);
  const [selectedResourcesForRequest, setSelectedResourcesForRequest] = useState<Resource[]>([]);
  // Provider: bulk selection for requests in Resource Details
  const [selectedRequestIds, setSelectedRequestIds] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState(false);
  // Inline edit for resource Type/Subtype in details
  const [isEditingType, setIsEditingType] = useState(false);
  const [editTypeValue, setEditTypeValue] = useState<string>('');
  
  const { toast } = useToast();
  const { user, organization } = useAuth();

  // Differentiate defaults between Provider and Seeker tabs
  useEffect(() => {
    if (activeTab === 'seeker') {
      // For seekers, default to available resources and latest
      setSelectedStatus('available');
      setSortBy('latest');
    } else {
      // For providers, show all statuses
      setSelectedStatus('all');
    }
  }, [activeTab]);

  // Resource Form State
  const [resourceForm, setResourceForm] = useState({
    title: '',
    information: '',
    type: '' as ResourceType | '',
    location: '',
    endDate: '',
    selectedTeamMembers: [] as string[],
    attachments: [] as File[]
  });
  
  // Request Form State
  const [requestForm, setRequestForm] = useState({
    requestType: '' as RequestType | '',
    customRequestType: '',
    purposeOfRequest: '',
    requestedStartDateTime: '',
    requestedEndDateTime: '',
    durationOfUse: '',
    preferredModeOfCollaboration: '' as CollaborationMode | '',
    confidentialityRequired: false,
    comments: '',
    urgencyIndicator: 'medium' as UrgencyLevel,
    supportingDocument: null as File | null,
    requestRecurrence: {
      enabled: false,
      frequency: ''
    }
  });
  
  // Form validation state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [characterCounts, setCharacterCounts] = useState({
    purposeOfRequest: 0,
    comments: 0
  });
  
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Create Resource Dialog/Form State (legacy fields used below)
  const [isCreateResourceOpen, setIsCreateResourceOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formType, setFormType] = useState<ResourceType | ''>('');
  const [formSubtype, setFormSubtype] = useState<string>('');
  // Status will default to 'available' on creation per spec
  const [formStatus, setFormStatus] = useState<ResourceStatus>('available');
  const [formLocation, setFormLocation] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  // Name (Partner/Team Member) selection
  const [formSelectedMemberId, setFormSelectedMemberId] = useState<string>('');

  const resourceTypes: Array<'all' | ResourceType> = ['all', 'infrastructure', 'article', 'trainee'];
  // Include virtual 'active' for filtering (non-inactive)
  const statusOptions: Array<'all' | 'active' | ResourceStatus> = ['all', 'active', 'available', 'occupied', 'inactive'];
  const requestTypes: RequestType[] = ['module', 'checklist', 'task', 'subtask', 'custom'];
  const requestTypeLabels: Record<RequestType, string> = {
    module: 'Module',
    checklist: 'Checklist', 
    task: 'Task',
    subtask: 'Subtask',
    custom: 'Others'
  };
  const urgencyLevels: UrgencyLevel[] = ['high', 'medium', 'low'];
  const collaborationModes: CollaborationMode[] = ['virtual', 'in-person', 'hybrid'];
  const collaborationModeIcons: Record<CollaborationMode, any> = {
    virtual: VideoIcon,
    'in-person': MapPinIcon,
    hybrid: MonitorSpeaker
  };
  const resourceSubtypes: Record<ResourceType, string[]> = {
    infrastructure: ['Meeting Room', 'Workspace'],
    article: ['Research', 'Legal Docs'],
    trainee: ['CA', 'CS']
  };

  // Seeker Request Dialog State
  const [isCreateRequestOpen, setIsCreateRequestOpen] = useState(false);
  const [requestForResource, setRequestForResource] = useState<Resource | null>(null);
  // Seeker Create Request flow (now shown in a dialog)
  const [isSeekerCreateFlow, setIsSeekerCreateFlow] = useState(false);
  const [isSeekerCreateOpen, setIsSeekerCreateOpen] = useState(false);
  const [seekerStep, setSeekerStep] = useState<1 | 2>(1);
  // Create Request (Step 1) specific filters and pagination
  const [crSearch, setCrSearch] = useState('');
  const [crType, setCrType] = useState<'all' | ResourceType>('all');
  const [crStatus, setCrStatus] = useState<'all' | ResourceStatus>('all');
  const [crSortBy, setCrSortBy] = useState<'latest' | 'oldest'>('latest');
  const [crPageSize, setCrPageSize] = useState<10 | 50 | 100>(10);
  const [crPage, setCrPage] = useState(1);
  // Seeker View Request Details Dialog State (uses existing isViewRequestOpen and selectedRequest state declared above)
  // My Requests filters/sort/pagination
  const [myReqSearch, setMyReqSearch] = useState('');
  const [myReqType, setMyReqType] = useState<'all' | ResourceType>('all');
  const [myReqStatus, setMyReqStatus] = useState<'all' | RequestStatus>('all');
  const [myReqSortBy, setMyReqSortBy] = useState<'latest' | 'oldest'>('latest');
  const [myReqPageSize, setMyReqPageSize] = useState<10 | 50 | 100>(10);
  const [myReqPage, setMyReqPage] = useState(1);
  const [myReqDateFrom, setMyReqDateFrom] = useState<string>('');
  const [myReqDateTo, setMyReqDateTo] = useState<string>('');

  const resetRequestForm = () => {
    setRequestForm({
      requestType: '' as RequestType | '',
      customRequestType: '',
      purposeOfRequest: '',
      requestedStartDateTime: '',
      requestedEndDateTime: '',
      durationOfUse: '',
      preferredModeOfCollaboration: '' as CollaborationMode | '',
      confidentialityRequired: false,
      comments: '',
      urgencyIndicator: 'medium',
      supportingDocument: null,
      requestRecurrence: { enabled: false, frequency: '' }
    });
    setFormErrors({});
    setCharacterCounts({ purposeOfRequest: 0, comments: 0 });
  };
  
  // Form validation function
  const validateRequestForm = () => {
    const errors: Record<string, string> = {};
    
    if (!requestForm.requestType) {
      errors.requestType = 'Please select a request type';
    }
    
    if (requestForm.requestType === 'custom' && !requestForm.customRequestType.trim()) {
      errors.customRequestType = 'Please enter a custom request type';
    }
    
    if (!requestForm.purposeOfRequest.trim()) {
      errors.purposeOfRequest = 'Purpose of request is required';
    } else if (requestForm.purposeOfRequest.length < 10) {
      errors.purposeOfRequest = 'Purpose must be at least 10 characters';
    }
    
    if (requestForm.requestedStartDateTime && requestForm.requestedEndDateTime) {
      const startDate = new Date(requestForm.requestedStartDateTime);
      const endDate = new Date(requestForm.requestedEndDateTime);
      if (endDate <= startDate) {
        errors.requestedEndDateTime = 'End date must be after start date';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Real-time duration calculation
  const calculateDuration = () => {
    if (requestForm.requestedStartDateTime && requestForm.requestedEndDateTime) {
      const start = new Date(requestForm.requestedStartDateTime);
      const end = new Date(requestForm.requestedEndDateTime);
      const diffMs = end.getTime() - start.getTime();
      const diffHours = Math.round(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
      const remainingHours = diffHours % 24;
      
      if (diffDays > 0) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ${remainingHours > 0 ? `${remainingHours} hour${remainingHours > 1 ? 's' : ''}` : ''}`;
      } else {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
      }
    }
    return '';
  };
  
  // Update duration automatically
  useEffect(() => {
    const duration = calculateDuration();
    if (duration && duration !== requestForm.durationOfUse) {
      setRequestForm(prev => ({ ...prev, durationOfUse: duration }));
    }
  }, [requestForm.requestedStartDateTime, requestForm.requestedEndDateTime]);

  const handleOpenRequestDialog = (resource: Resource) => {
    setRequestForResource(resource);
    setIsCreateRequestOpen(true);
  };

  const handleSendRequest = () => {
    if (!requestForResource) return;
    if (!validateRequestForm()) {
      toast({ title: 'Form validation failed', description: 'Please fix the errors and try again.', variant: 'destructive' });
      return;
    }
    const newReq: ResourceRequest = {
      id: `req_${Date.now()}`,
      resourceId: requestForResource.id,
      resource: requestForResource,
      requester: {
        id: user?.id || 'me',
        name: `${user?.firstName || 'User'} ${user?.lastName || ''}`.trim(),
        organization: organization?.name || 'My Organization',
        email: user?.email || 'me@example.com'
      },
      requestType: requestForm.requestType as RequestType,
      customRequestType: requestForm.requestType === 'custom' ? (requestForm.customRequestType || 'Custom') : undefined,
      purposeOfRequest: requestForm.purposeOfRequest.trim(),
      requestedStartDateTime: requestForm.requestedStartDateTime ? new Date(requestForm.requestedStartDateTime) : undefined,
      requestedEndDateTime: requestForm.requestedEndDateTime ? new Date(requestForm.requestedEndDateTime) : undefined,
      durationOfUse: requestForm.durationOfUse || undefined,
      preferredModeOfCollaboration: requestForm.preferredModeOfCollaboration || undefined,
      supportingDocument: requestForm.supportingDocument ? { name: requestForm.supportingDocument.name, url: '#' } : undefined,
      confidentialityRequired: !!requestForm.confidentialityRequired,
      comments: requestForm.comments || undefined,
      urgencyIndicator: requestForm.urgencyIndicator,
      requestRecurrence: requestForm.requestRecurrence?.enabled ? { enabled: true, frequency: requestForm.requestRecurrence.frequency || 'one-time' } : { enabled: false },
      status: 'pending',
      requestedAt: new Date()
    };
    setMyRequests(prev => [newReq, ...prev]);
    // Also surface to provider side request list for demo/mock
    setRequests(prev => [newReq, ...prev]);
    // Increment resource request count
    setResources(prev => prev.map(r => r.id === requestForResource.id ? { ...r, requestsCount: (r.requestsCount || 0) + 1, hasNewRequests: true } : r));

    toast({ title: 'Access request sent successfully!' });
    setIsCreateRequestOpen(false);
    setRequestForResource(null);
    resetRequestForm();
  };

  const resetForm = () => {
    setFormTitle("");
    setFormDescription("");
    setFormType("");
    setFormSubtype("");
    setFormLocation("");
    setFormEndDate("");
    setFormSelectedMemberId("");
    setFormStatus('available');
    setFormSubmitting(false);
  };

  const handleCreateResource = async () => {
    if (!formTitle.trim() || !formDescription.trim() || !formType || !formSelectedMemberId || !formStatus) {
      toast({ title: "Missing required fields", description: "Please fill Type, Title, Description, Name and Status.", variant: "destructive" });
      return;
    }

    try {
      setFormSubmitting(true);
      const now = new Date();
      const ownerName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Owner' : 'Owner';
      const orgName = organization?.name || 'My Organization';
      const selectedMember = teamMembers.find(tm => tm.id === formSelectedMemberId);
      const selectedMemberName = selectedMember?.name || '';
      const masked = selectedMemberName ? `${selectedMemberName.charAt(0)}***${selectedMemberName.charAt(selectedMemberName.length - 1)}` : undefined;
      const newResource: Resource = {
        id: String(Date.now()),
        title: formTitle.trim(),
        information: formDescription.trim(),
        type: formType as ResourceType,
        subtype: formSubtype || undefined,
        location: formLocation.trim() || undefined,
        endDate: formEndDate ? new Date(formEndDate) : null,
        startDate: null,
        teamMemberIds: selectedMember ? [selectedMember.id] : undefined,
        maskedName: masked,
        owner: { id: user?.id || 'me', name: ownerName, organization: orgName, email: user?.email || 'owner@example.com' },
        createdAt: now,
        updatedAt: now,
        status: formStatus,
        requestsCount: 0,
        hasNewRequests: false,
      };
      setResources(prev => [newResource, ...prev]);
      toast({ title: 'Resource added successfully!' });
      setIsCreateResourceOpen(false);
      resetForm();
    } catch (e) {
      toast({ title: 'Failed to add resource', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setFormSubmitting(false);
    }
  };

  const filteredSorted = useMemo(() => {
    const filtered = resources.filter((r) => {
      const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.information.toLowerCase().includes(searchTerm.toLowerCase()) || (r.location || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || r.type === selectedType;
      const matchesStatus =
        selectedStatus === 'all'
          ? true
          : selectedStatus === 'active'
            ? r.status !== 'inactive'
            : r.status === selectedStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
    const sorted = filtered.sort((a, b) => sortBy === 'latest' ? b.createdAt.getTime() - a.createdAt.getTime() : a.createdAt.getTime() - b.createdAt.getTime());
    return sorted;
  }, [resources, searchTerm, selectedType, selectedStatus, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / pageSize));
  const currentPageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredSorted.slice(start, start + pageSize);
  }, [filteredSorted, page, pageSize]);

  const getFileIcon = (type: ResourceType) => {
    switch (type) {
      case 'infrastructure': return Building;
      case 'article': return FileText;
      case 'trainee': return User;
      default: return FileText;
    }
  };

  const formatResourceType = (type: ResourceType) => {
    switch (type) {
      case 'infrastructure':
        return 'Infrastructure';
      case 'article':
        return 'Article';
      case 'trainee':
        return 'Trainees (CA/CS)';
      default:
        return type;
    }
  };

  const getStatusColor = (status: ResourceStatus) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (urgency: UrgencyLevel | string | undefined) => {
    if (!urgency) return 'medium';
    return urgency;
  };

  // Seeker distinct status colors
  const getSeekerStatusColor = (status: RequestStatus) => {
    switch (status) {
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-emerald-100 text-emerald-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper: count pending requests for a resource (provider view)
  const countPendingForResource = (resourceId: string) =>
    requests.filter(r => r.resourceId === resourceId && r.status === 'pending').length;

  // Create Request (Step 1) filtered list
  const crFilteredSorted = useMemo(() => {
    const filtered = resources.filter((r) => {
      const matchesSearch = r.title.toLowerCase().includes(crSearch.toLowerCase()) || r.information.toLowerCase().includes(crSearch.toLowerCase()) || (r.location || '').toLowerCase().includes(crSearch.toLowerCase());
      const matchesType = crType === 'all' || r.type === crType;
      const matchesStatus = crStatus === 'all' ? true : r.status === crStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
    const sorted = filtered.sort((a, b) => crSortBy === 'latest' ? b.createdAt.getTime() - a.createdAt.getTime() : a.createdAt.getTime() - b.createdAt.getTime());
    return sorted;
  }, [resources, crSearch, crType, crStatus, crSortBy]);

  const crTotalPages = Math.max(1, Math.ceil(crFilteredSorted.length / crPageSize));
  const crPageItems = useMemo(() => {
    const start = (crPage - 1) * crPageSize;
    return crFilteredSorted.slice(start, start + crPageSize);
  }, [crFilteredSorted, crPage, crPageSize]);

  useEffect(() => { setCrPage(1); }, [crSearch, crType, crStatus]);

  const crTypeOptions = useMemo(() => {
    const set = new Set<ResourceType>();
    resources.forEach(r => set.add(r.type));
    return ['all', ...Array.from(set)] as ('all' | ResourceType)[];
  }, [resources]);

  const crStatusOptions = useMemo(() => {
    const set = new Set<ResourceStatus>();
    resources.forEach(r => set.add(r.status));
    return ['all', ...Array.from(set)] as ('all' | ResourceStatus)[];
  }, [resources]);

  // Request actions
  const handleApproveRequest = (requestId: string) => {
    setRequests(prev => {
      const next = prev.map(r => r.id === requestId ? {
        ...r,
        status: 'accepted' as RequestStatus,
        respondedAt: new Date(),
        responseMessage: 'Approved by provider'
      } : r);
      const req = prev.find(r => r.id === requestId);
      if (req) {
        const hasPending = next.some(r => r.resourceId === req.resourceId && r.status === 'pending');
        setResources(pr => pr.map(res => res.id === req.resourceId ? { ...res, hasNewRequests: hasPending, status: 'occupied' } : res));
        // Mirror update in seeker "My Requests"
        setMyRequests(mr => mr.map(r => r.id === requestId ? {
          ...r,
          status: 'accepted' as RequestStatus,
          respondedAt: new Date(),
          responseMessage: 'Approved by provider'
        } : r));
      }
      return next;
    });
    toast({ title: 'Request approved' });
  };

  const handleRejectRequest = (requestId: string) => {
    setRequests(prev => {
      const next = prev.map(r => r.id === requestId ? {
        ...r,
        status: 'rejected' as RequestStatus,
        respondedAt: new Date(),
        responseMessage: 'Rejected by provider'
      } : r);
      const req = prev.find(r => r.id === requestId);
      if (req) {
        const hasPending = next.some(r => r.resourceId === req.resourceId && r.status === 'pending');
        setResources(pr => pr.map(res => res.id === req.resourceId ? { ...res, hasNewRequests: hasPending } : res));
        // Mirror update in seeker "My Requests"
        setMyRequests(mr => mr.map(r => r.id === requestId ? {
          ...r,
          status: 'rejected' as RequestStatus,
          respondedAt: new Date(),
          responseMessage: 'Rejected by provider'
        } : r));
      }
      return next;
    });
    toast({ title: 'Request rejected' });
  };

  const handleViewResource = (resource: Resource) => {
    setSelectedResource(resource);
    setIsViewResourceOpen(true);
  };

  const handleDownloadResource = (resource: Resource) => {
    toast({
      title: "Download Started",
      description: `Downloading ${resource.title}...`
    });
  };

  const handleEditResource = (resource: Resource) => {
    toast({
      title: "Edit Resource",
      description: `Opening editor for ${resource.title}`
    });
  };

  const handleDeleteResource = (resource: Resource) => {
    if (confirm(`Are you sure you want to delete "${resource.title}"?`)) {
      setResources(prev => prev.filter(r => r.id !== resource.id));
      toast({
        title: "Resource Deleted",
        description: `${resource.title} has been deleted successfully.`
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">My Resources</p>
                <p className="text-2xl font-bold text-gray-900">{resources.length}</p>
              </div>

          {/* Resource Details Modal */}
          <Dialog open={isViewResourceOpen} onOpenChange={(open) => { setIsViewResourceOpen(open); if (!open) { setSelectedResource(null); setSelectedRequestIds([]); setIsEditingType(false); } }}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Resource Details</DialogTitle>
              </DialogHeader>
              {selectedResource && (
                <div className="space-y-6">
                  {/* Resource Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Title</div>
                      <div className="font-medium flex items-center gap-2"><FileText className="h-4 w-4 text-blue-600" /> {selectedResource.title}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Type</div>
                      {!isEditingType ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{formatResourceType(selectedResource.type)}</Badge>
                          {selectedResource.subtype && <Badge variant="secondary">{selectedResource.subtype}</Badge>}
                          <Button variant="ghost" size="sm" onClick={() => {
                            const v = selectedResource.type === 'trainee' ? (selectedResource.subtype === 'CS' ? 'trainee_cs' : 'trainee_ca') : selectedResource.type;
                            setEditTypeValue(v);
                            setIsEditingType(true);
                          }}>
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Select
                            value={editTypeValue || undefined}
                            onValueChange={(v) => setEditTypeValue(v)}
                          >
                            <SelectTrigger className="w-60">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="infrastructure">Infrastructure (e.g., Meeting Room, Workspace)</SelectItem>
                              <SelectItem value="article">Article (e.g., Research, Legal Docs)</SelectItem>
                              <SelectItem value="trainee_ca">Trainees under CA</SelectItem>
                              <SelectItem value="trainee_cs">Trainees under CS</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            size="sm"
                            onClick={() => {
                              if (!selectedResource) return;
                              const next: Resource = {
                                ...selectedResource,
                                type: editTypeValue === 'trainee_ca' || editTypeValue === 'trainee_cs' ? 'trainee' : (editTypeValue as ResourceType),
                                subtype: editTypeValue === 'trainee_ca' ? 'CA' : editTypeValue === 'trainee_cs' ? 'CS' : (selectedResource.type === 'trainee' ? undefined : selectedResource.subtype)
                              };
                              setResources(prev => prev.map(r => r.id === next.id ? next : r));
                              setSelectedResource(next);
                              setIsEditingType(false);
                              toast({ title: 'Resource type updated' });
                            }}
                          >
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setIsEditingType(false)}>Cancel</Button>
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-sm text-gray-500 mb-1">Information</div>
                      <div className="text-sm text-gray-700">{selectedResource.information || '—'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Location</div>
                      <div className="text-sm text-gray-700 flex items-center gap-2"><MapPin className="h-4 w-4" /> {selectedResource.location || '—'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Owner</div>
                      <div className="text-sm text-gray-700 flex items-center gap-2"><User className="h-4 w-4" /> {selectedResource.owner?.name} <span className="text-gray-500">(Hidden from resource seekers)</span></div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">End Date</div>
                      <div className="text-sm text-gray-700">{selectedResource.endDate ? format(new Date(selectedResource.endDate), 'MMM dd, yyyy') : '—'}</div>
                    </div>
                  </div>

                  {/* Requests for this resource */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold flex items-center gap-2"><Flag className="h-4 w-4 text-red-600" /> Requests</div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={selectedRequestIds.length === 0 || actionLoading}
                          onClick={async () => {
                            if (!confirm(`Accept ${selectedRequestIds.length} request(s)?`)) return;
                            setActionLoading(true);
                            try {
                              selectedRequestIds.forEach(id => handleApproveRequest(id));
                              setSelectedRequestIds([]);
                              toast({ title: 'Requests approved' });
                            } finally {
                              setActionLoading(false);
                            }
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> Accept Selected
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={selectedRequestIds.length === 0 || actionLoading}
                          onClick={async () => {
                            if (!confirm(`Reject ${selectedRequestIds.length} request(s)?`)) return;
                            setActionLoading(true);
                            try {
                              selectedRequestIds.forEach(id => handleRejectRequest(id));
                              setSelectedRequestIds([]);
                              toast({ title: 'Requests rejected' });
                            } finally {
                              setActionLoading(false);
                            }
                          }}
                        >
                          <XCircle className="h-4 w-4 mr-1" /> Reject Selected
                        </Button>
                      </div>
                    </div>

                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="text-left p-3 text-xs uppercase text-muted-foreground tracking-wider">Select</th>
                            <th className="text-left p-3 text-xs uppercase text-muted-foreground tracking-wider">Ref</th>
                            <th className="text-left p-3 text-xs uppercase text-muted-foreground tracking-wider">Requester</th>
                            <th className="text-left p-3 text-xs uppercase text-muted-foreground tracking-wider">Type</th>
                            <th className="text-left p-3 text-xs uppercase text-muted-foreground tracking-wider">Purpose</th>
                            <th className="text-left p-3 text-xs uppercase text-muted-foreground tracking-wider">Duration</th>
                            <th className="text-left p-3 text-xs uppercase text-muted-foreground tracking-wider">Mode</th>
                            <th className="text-left p-3 text-xs uppercase text-muted-foreground tracking-wider">Confidential</th>
                            <th className="text-left p-3 text-xs uppercase text-muted-foreground tracking-wider">Comments</th>
                            <th className="text-left p-3 text-xs uppercase text-muted-foreground tracking-wider">Priority</th>
                            <th className="text-left p-3 text-xs uppercase text-muted-foreground tracking-wider">Status</th>
                            <th className="text-left p-3 text-xs uppercase text-muted-foreground tracking-wider">Dates</th>
                            <th className="text-left p-3 text-xs uppercase text-muted-foreground tracking-wider">Attachments</th>
                            <th className="text-left p-3 text-xs uppercase text-muted-foreground tracking-wider">Recurrence</th>
                            <th className="text-left p-3 text-xs uppercase text-muted-foreground tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {requests.filter(r => r.resourceId === selectedResource.id).map((req) => (
                            <tr key={req.id} className="border-b">
                              <td className="p-3">
                                <input
                                  type="checkbox"
                                  checked={selectedRequestIds.includes(req.id)}
                                  onChange={(e) => {
                                    setSelectedRequestIds(prev => e.target.checked ? [...prev, req.id] : prev.filter(id => id !== req.id));
                                  }}
                                />
                              </td>
                              <td className="p-3 text-sm">{req.id}</td>
                              <td className="p-3 text-sm">
                                <div className="font-medium">{req.requester?.name}</div>
                                <div className="text-xs text-gray-500">{req.requester?.organization}</div>
                              </td>
                              <td className="p-3 text-sm">{req.requestType}{req.customRequestType ? ` (${req.customRequestType})` : ''}</td>
                              <td className="p-3 text-sm max-w-[240px] truncate" title={req.purposeOfRequest}>{req.purposeOfRequest}</td>
                              <td className="p-3 text-sm">{req.durationOfUse || '—'}</td>
                              <td className="p-3 text-sm">{req.preferredModeOfCollaboration || '—'}</td>
                              <td className="p-3 text-sm">{req.confidentialityRequired ? 'Yes' : 'No'}</td>
                              <td className="p-3 text-sm max-w-[220px] truncate" title={req.comments}>{req.comments || '—'}</td>
                              <td className="p-3 text-sm">
                                <span className={`px-2 py-1 rounded ${getUrgencyColor(getPriorityLabel(req.urgencyIndicator))}`}>{getPriorityLabel(req.urgencyIndicator)}</span>
                              </td>
                              <td className="p-3 text-sm">
                                <span className={`px-2 py-1 rounded ${getSeekerStatusColor(req.status as RequestStatus)}`}>{req.status}</span>
                              </td>
                              <td className="p-3 text-sm">
                                {req.requestedStartDateTime ? format(new Date(req.requestedStartDateTime), 'dd MMM, HH:mm') : '-'}
                                {req.requestedEndDateTime ? ` - ${format(new Date(req.requestedEndDateTime), 'dd MMM, HH:mm')}` : ''}
                              </td>
                              <td className="p-3 text-sm">
                                {req.supportingDocument ? (
                                  <Button variant="link" className="p-0 h-auto" onClick={() => handleDownloadResource(selectedResource)}>
                                    <Download className="h-4 w-4 mr-1" /> {req.supportingDocument.name}
                                  </Button>
                                ) : (
                                  <span className="text-gray-500">No documents attached</span>
                                )}
                              </td>
                              <td className="p-3 text-sm">
                                {req.requestRecurrence?.enabled ? (req.requestRecurrence.frequency || 'Custom') : 'One-time'}
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-1">
                                  <Button size="sm" variant="ghost" title="Accept" disabled={req.status !== 'pending' || actionLoading} onClick={() => handleApproveRequest(req.id)}>
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" title="Reject" disabled={req.status !== 'pending' || actionLoading} onClick={() => handleRejectRequest(req.id)}>
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                  {req.status === 'accepted' && (
                                    <Button size="sm" variant="outline" title="Contact Resource Seeker">
                                      <MessageSquare className="h-4 w-4 mr-1" /> Contact
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
              <Share2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">{requests.filter(r => r.status === 'pending').length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">{resources.filter(r => r.status === 'available').length}</p>
              </div>
              <Unlock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">With Requests</p>
                <p className="text-2xl font-bold text-gray-900">{resources.filter(r => r.requestsCount > 0).length}</p>
              </div>
              <Flag className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'provider' | 'seeker')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="provider">Resource Provider</TabsTrigger>
          <TabsTrigger value="seeker">Resource Seeker</TabsTrigger>
        </TabsList>

        <TabsContent value="provider" className="space-y-6">
          {/* Provider Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {resourceTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type === 'all' ? 'All Types' : formatResourceType(type as ResourceType)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(st => {
                    const label = st === 'all'
                      ? 'All Statuses'
                      : st === 'active'
                        ? 'Active (Blue)'
                        : st.charAt(0).toUpperCase() + st.slice(1) + (st === 'available' ? ' (Green)' : st === 'occupied' ? ' (Orange)' : st === 'inactive' ? ' (Gray)' : '');
                    return (
                      <SelectItem key={st} value={st}>
                        {label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'latest' | 'oldest')}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog open={isCreateResourceOpen} onOpenChange={(open) => { setIsCreateResourceOpen(open); if (!open) resetForm(); }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Resource in Pool
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Resource</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input placeholder="Enter resource title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea placeholder="Describe your resource" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Type</label>
                      {/** Present 4 concrete options and map to type/subtype internally */}
                      <Select
                        value={
                          formType === 'trainee'
                            ? (formSubtype === 'CS' ? 'trainee_cs' : 'trainee_ca')
                            : formType || undefined
                        }
                        onValueChange={(v) => {
                          if (v === 'trainee_ca') {
                            setFormType('trainee');
                            setFormSubtype('CA');
                          } else if (v === 'trainee_cs') {
                            setFormType('trainee');
                            setFormSubtype('CS');
                          } else {
                            const newType = v as ResourceType;
                            setFormType(newType);
                            // Reset/auto-pick subtype for non-trainee types
                            const firstSubtype = resourceSubtypes[newType]?.[0] || '';
                            setFormSubtype(firstSubtype);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="infrastructure">Infrastructure (e.g., Meeting Room, Workspace)</SelectItem>
                          <SelectItem value="article">Article (e.g., Research, Legal Docs)</SelectItem>
                          <SelectItem value="trainee_ca">Trainees under CA</SelectItem>
                          <SelectItem value="trainee_cs">Trainees under CS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Subtype</label>
                      <Select value={formSubtype || undefined} onValueChange={(v) => setFormSubtype(v)} disabled={!formType}>
                        <SelectTrigger>
                          <SelectValue placeholder={formType ? 'Select subtype' : 'Select type first'} />
                        </SelectTrigger>
                        <SelectContent>
                          {(formType ? resourceSubtypes[formType as ResourceType] : []).map(st => (
                            <SelectItem key={st} value={st}>{st}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {/* Helper examples per type */}
                      <p className="mt-1 text-xs text-gray-500">
                        {formType === 'infrastructure' && 'Examples: Meeting Room, Workspace'}
                        {formType === 'article' && 'Examples: Research, Legal Docs'}
                        {formType === 'trainee' && 'Options: CA, CS'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Name (Partner/Team Member)</label>
                      <Select value={formSelectedMemberId || undefined} onValueChange={(v) => setFormSelectedMemberId(v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select name" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamMembers.map(tm => (
                            <SelectItem key={tm.id} value={tm.id}>{tm.name} — {tm.designation}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="mt-1 text-xs text-gray-500">*Name will be masked from resource seekers for privacy</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Location</label>
                      <Input placeholder="e.g., BKC, Mumbai or Remote" value={formLocation} onChange={(e) => setFormLocation(e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium">Status</label>
                      <Select value={formStatus} onValueChange={(v) => setFormStatus(v as ResourceStatus)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="occupied">Occupied</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Availability End Date (optional)</label>
                      <Input type="date" value={formEndDate} onChange={(e) => setFormEndDate(e.target.value)} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => { setIsCreateResourceOpen(false); }}>
                      Cancel
                    </Button>
                    <Button disabled={
                      formSubmitting ||
                      !formTitle.trim() ||
                      !formDescription.trim() ||
                      !formType ||
                      !formSubtype ||
                      !formSelectedMemberId ||
                      !formStatus
                    } onClick={handleCreateResource}>
                      Add Resource
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          

          {/* My Resources: Card View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPageItems.map((resource) => {
              const FileIcon = getFileIcon(resource.type);
              const pendingCount = countPendingForResource(resource.id);
              return (
                <Card
                  key={resource.id}
                  className="hover:shadow-lg transition-all cursor-pointer relative"
                  onClick={() => handleViewResource(resource)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <FileIcon className="h-5 w-5 text-blue-600" />
                        <Badge variant="outline">{formatResourceType(resource.type)}</Badge>
                        {resource.subtype && (
                          <Badge variant="secondary">{resource.subtype}</Badge>
                        )}
                        <Badge className={getStatusColor(resource.status)}>{resource.status}</Badge>
                      </div>
                      {pendingCount > 0 && (
                        <div
                          className="relative"
                          title={`${pendingCount} new requests pending - click to view`}
                        >
                          <Flag className="h-4 w-4 text-red-600 animate-pulse" />
                          <span className="absolute -top-2 -right-2 inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full bg-red-600 text-white text-[10px] font-semibold">
                            {pendingCount}
                          </span>
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-lg">
                      <span className="text-left hover:underline">{resource.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {resource.information && (
                      <p className="text-sm text-gray-600 line-clamp-2">{resource.information}</p>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{resource.location || '—'}</span>
                      {resource.endDate && (
                        <span>{format(resource.endDate, 'MMM dd, yyyy')}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={(e) => { e.stopPropagation(); handleViewResource(resource); }}
                      >
                        <Eye className="h-3 w-3 mr-1" /> View
                      </Button>
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleEditResource(resource); }}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleDeleteResource(resource); }}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {currentPageItems.length === 0 && (
              <div className="col-span-full">
                <div className="flex flex-col items-center justify-center border rounded-lg py-12 text-center">
                  <Users className="h-10 w-10 text-blue-500 mb-3" />
                  <p className="text-gray-700 font-medium">No resources yet</p>
                  <p className="text-sm text-gray-500 mb-4">Add your first resource to start sharing with the community.</p>
                  <Button onClick={() => setIsCreateResourceOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" /> Add Resource
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Page {page} of {totalPages} • {filteredSorted.length} items
            </div>
            <div className="flex items-center gap-2">
              <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v) as 10 | 50 | 100); setPage(1); }}>
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Page size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 / page</SelectItem>
                  <SelectItem value="50">50 / page</SelectItem>
                  <SelectItem value="100">100 / page</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" onClick={() => setPage(1)} disabled={page === 1}>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setPage(totalPages)} disabled={page === totalPages}>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Requests Management removed as per spec: manage via Resource Details only */}
        </TabsContent>

        <TabsContent value="seeker" className="space-y-6">
          {/* Seeker tab: simplified header to avoid mirroring provider controls */}
          {/* <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Browse Resources</h3>
            <div className="text-xs text-gray-500">Browsing defaults to available resources</div>
          </div> */}

          {/* Resource Browsing Grid for Seekers */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPageItems.filter(r => r.status === 'available').map((resource) => {
              const FileIcon = getFileIcon(resource.type);
              return (
                <Card
                  key={resource.id}
                  className="hover:shadow-lg transition-all cursor-pointer relative border-l-4 border-l-green-500"
                  onClick={() => handleOpenRequestDialog(resource)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <FileIcon className="h-5 w-5 text-blue-600" />
                        <Badge variant="outline">{formatResourceType(resource.type)}</Badge>
                        {resource.subtype && (
                          <Badge variant="secondary">{resource.subtype}</Badge>
                        )}
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Available" />
                          <span className="text-xs text-green-600 font-medium">Available</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {resource.isPopular && (
                          <Badge className="bg-orange-100 text-orange-800 text-xs">
                            <TrendingUp className="h-3 w-3 mr-1" /> Popular
                          </Badge>
                        )}
                        {resource.isRecentlyUsed && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            <Clock className="h-3 w-3 mr-1" /> Recently Used
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-lg">
                      <span className="text-left hover:underline">{resource.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {resource.information && (
                      <p className="text-sm text-gray-600 line-clamp-2">{resource.information}</p>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{resource.location || '—'}</span>
                      {resource.endDate && (
                        <span>{format(resource.endDate, 'MMM dd, yyyy')}</span>
                      )}
                    </div>
                    
                   
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Provider</div>
                      <div className="text-sm font-medium text-gray-700">****** (Contact details shared upon acceptance)</div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        Contact information will be revealed after request approval
                      </div>
                    </div>

                    
                    {resource.rating && (
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= (resource.rating || 0)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-gray-600">
                          {resource.rating} ({resource.reviewCount || 0} reviews)
                        </span>
                      </div>
                    )}
                    
                    <Button
                      className="w-full"
                      onClick={(e) => { e.stopPropagation(); handleOpenRequestDialog(resource); }}
                    >
                      <Send className="h-4 w-4 mr-2" /> Request Access
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
            {currentPageItems.filter(r => r.status === 'available').length === 0 && (
              <div className="col-span-full">
                <div className="flex flex-col items-center justify-center border rounded-lg py-12 text-center">
                  <Search className="h-10 w-10 text-blue-500 mb-3" />
                  <p className="text-gray-700 font-medium">No available resources found</p>
                  <p className="text-sm text-gray-500">Try adjusting your search criteria or check back later.</p>
                </div>
              </div>
            )}
          </div> */}

          {/* Create Request entry + My Requests list */}
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">My Requests</h3>
            <Button onClick={() => { setIsSeekerCreateOpen(true); setIsSeekerCreateFlow(true); setSeekerStep(1); setSelectedResourcesForRequest([]); }}>
                Create Request
              </Button>
          </div>

          {/* My Requests table */}
          <div className="space-y-3">
            <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input className="pl-10" placeholder="Search my requests..." value={myReqSearch} onChange={(e) => { setMyReqSearch(e.target.value); setMyReqPage(1); }} />
              </div>
              <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                <Select value={myReqType} onValueChange={(v) => { setMyReqType(v as ('all' | ResourceType)); setMyReqPage(1); }}>
                  <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="trainee">Trainees (CA/CS)</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={myReqStatus} onValueChange={(v) => { setMyReqStatus(v as ('all' | RequestStatus)); setMyReqPage(1); }}>
                  <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Action Pending</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <Input type="date" className="w-40" value={myReqDateFrom} onChange={(e) => { setMyReqDateFrom(e.target.value); setMyReqPage(1); }} placeholder="From" />
                  <Input type="date" className="w-40" value={myReqDateTo} onChange={(e) => { setMyReqDateTo(e.target.value); setMyReqPage(1); }} placeholder="To" />
                </div>
                <Select value={myReqSortBy} onValueChange={(v) => { setMyReqSortBy(v as ('latest' | 'oldest')); setMyReqPage(1); }}>
                  <SelectTrigger className="w-40"><SelectValue placeholder="Sort" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Latest request at top</SelectItem>
                    <SelectItem value="oldest">Oldest request at top</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(() => {
              const filtered = myRequests.filter(r => {
                const search = myReqSearch.toLowerCase();
                const title = r.resource?.title?.toLowerCase() ?? '';
                const purpose = (r.purposeOfRequest || '').toLowerCase();
                const matchesSearch = myReqSearch ? (title.includes(search) || purpose.includes(search)) : true;
                const matchesType = myReqType === 'all' ? true : r.resource?.type === myReqType;
                const matchesStatus = myReqStatus === 'all' ? true : r.status === myReqStatus;
                const df = myReqDateFrom ? new Date(myReqDateFrom) : null;
                const dt = myReqDateTo ? new Date(myReqDateTo) : null;
                const reqAt = r.requestedAt ? new Date(r.requestedAt) : null;
                const matchesDate = reqAt ? (
                  (!df || reqAt >= df) && (!dt || reqAt <= new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 23, 59, 59))
                ) : true;
                return matchesSearch && matchesType && matchesStatus && matchesDate;
              }).sort((a,b) => myReqSortBy === 'latest' ? (b.requestedAt.getTime() - a.requestedAt.getTime()) : (a.requestedAt.getTime() - b.requestedAt.getTime()));
              const total = filtered.length;
              const totalPages = Math.max(1, Math.ceil(total / myReqPageSize));
              const page = Math.min(myReqPage, totalPages);
              const start = (page - 1) * myReqPageSize;
              const items = filtered.slice(start, start + myReqPageSize);
              return (
                <>
                  <div className="overflow-x-auto rounded-lg border">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50 text-gray-700">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium">Resource</th>
                          <th className="px-4 py-3 text-left font-medium">Type</th>
                          <th className="px-4 py-3 text-left font-medium">Status</th>
                          <th className="px-4 py-3 text-left font-medium">Urgency</th>
                          <th className="px-4 py-3 text-left font-medium">Requested</th>
                          <th className="px-4 py-3 text-left font-medium">Mode</th>
                          <th className="px-4 py-3 text-left font-medium">Duration</th>
                          <th className="px-4 py-3 text-right font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map(req => (
                          <tr key={req.id} className="border-t">
                            <td className="px-4 py-3">
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-900">{req.resource?.title ?? '—'}</span>
                                <span className="text-xs text-gray-500">
                                  {req.resource ? (
                                    req.status === 'accepted'
                                      ? `Provider: ${req.resource.owner?.name || '—'}${req.resource.owner?.organization ? `, ${req.resource.owner.organization}` : ''}`
                                      : `Provider: ${req.resource.maskedName || '******'} (Contact details shared upon acceptance)`
                                  ) : '—'}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="outline">{req.resource ? formatResourceType(req.resource.type) : '—'}</Badge>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeekerStatusColor(req.status)}`}>
                                {req.status === 'pending' ? 'Action Pending' : req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <Badge className={getUrgencyColor(req.urgencyIndicator)}>{req.urgencyIndicator}</Badge>
                            </td>
                            <td className="px-4 py-3">{format(req.requestedAt, 'MMM dd, yyyy')}</td>
                            <td className="px-4 py-3">{req.preferredModeOfCollaboration ? (req.preferredModeOfCollaboration.charAt(0).toUpperCase() + req.preferredModeOfCollaboration.slice(1)) : '—'}</td>
                            <td className="px-4 py-3">{req.durationOfUse || '—'}</td>
                            <td className="px-4 py-3 text-right">
                              <Button size="sm" variant="outline" onClick={() => { setSelectedRequest(req); setIsViewRequestOpen(true); }}>View details</Button>
                            </td>
                          </tr>
                        ))}
                        {items.length === 0 && (
                          <tr>
                            <td colSpan={8} className="px-4 py-10 text-center">
                              <div className="flex flex-col items-center justify-center text-center">
                                <Inbox className="h-10 w-10 text-emerald-500 mb-3" />
                                <p className="text-gray-700 font-medium">No requests yet</p>
                                <p className="text-sm text-gray-500 mb-4">Create a request to access resources shared by providers.</p>
                                <Button onClick={() => { setIsSeekerCreateOpen(true); setIsSeekerCreateFlow(true); setSeekerStep(1); }}>
                                  <Plus className="h-4 w-4 mr-2" /> Create Request
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-between gap-4 mt-4">
                    <div className="text-sm text-gray-600">Page {page} of {totalPages} • {total} items</div>
                    <div className="flex items-center gap-2">
                      <Select value={String(myReqPageSize)} onValueChange={(v) => { setMyReqPageSize(Number(v) as (10 | 50 | 100)); setMyReqPage(1); }}>
                        <SelectTrigger className="w-28"><SelectValue placeholder="Page size" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10 / page</SelectItem>
                          <SelectItem value="50">50 / page</SelectItem>
                          <SelectItem value="100">100 / page</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" onClick={() => setMyReqPage(1)} disabled={page === 1}><ChevronsLeft className="h-4 w-4" /></Button>
                        <Button variant="outline" size="icon" onClick={() => setMyReqPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="h-4 w-4" /></Button>
                        <Button variant="outline" size="icon" onClick={() => setMyReqPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight className="h-4 w-4" /></Button>
                        <Button variant="outline" size="icon" onClick={() => setMyReqPage(totalPages)} disabled={page === totalPages}><ChevronsRight className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Create Request Flow moved to Dialog */}

          {/* Create Request Dialog (Seeker Multi-Step) */}
          <Dialog open={isSeekerCreateOpen} onOpenChange={(open) => {
            setIsSeekerCreateOpen(open);
            if (!open) { setIsSeekerCreateFlow(false); setSeekerStep(1); resetRequestForm(); setSelectedResourcesForRequest([]); }
          }}>
            <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Request</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="text-sm text-gray-600">{seekerStep === 1 ? 'Step 1: Select Resource(s)' : 'Step 2: Request Details'}</div>
                {seekerStep === 1 ? (
                  <>
                    {/* Filters: search, type, status, sort, page size */}
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                      <div className="flex-1">
                        <label className="text-sm font-medium">Search</label>
                        <Input placeholder="Search title, info, location" value={crSearch} onChange={(e) => setCrSearch(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <label className="text-sm font-medium">Type</label>
                          <Select value={crType} onValueChange={(v) => setCrType(v as any)}>
                            <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                            <SelectContent>
                              {crTypeOptions.map(opt => (
                                <SelectItem key={opt} value={opt as string}>{opt === 'all' ? 'All' : formatResourceType(opt as ResourceType)}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Status</label>
                          <Select value={crStatus} onValueChange={(v) => setCrStatus(v as any)}>
                            <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                            <SelectContent>
                              {crStatusOptions.map(opt => (
                                <SelectItem key={opt} value={opt as string}>{opt === 'all' ? 'All' : (opt as string)[0].toUpperCase() + (opt as string).slice(1)}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Sort</label>
                          <Select value={crSortBy} onValueChange={(v) => setCrSortBy(v as any)}>
                            <SelectTrigger><SelectValue placeholder="Latest" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="latest">Latest</SelectItem>
                              <SelectItem value="oldest">Oldest</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Page Size</label>
                          <Select value={String(crPageSize)} onValueChange={(v) => setCrPageSize(Number(v) as any)}>
                            <SelectTrigger><SelectValue placeholder="10" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="50">50</SelectItem>
                              <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border mt-3">
                      <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 text-gray-700">
                          <tr>
                            <th className="px-4 py-3"><input type="checkbox" aria-label="select all" onChange={(e) => {
                              const checked = e.target.checked;
                              setSelectedResourcesForRequest(checked ? crPageItems : []);
                            }} /></th>
                            <th className="text-left font-medium px-4 py-3">Type</th>
                            <th className="text-left font-medium px-4 py-3">Title</th>
                            <th className="text-left font-medium px-4 py-3">Information</th>
                            <th className="text-left font-medium px-4 py-3">Location</th>
                            <th className="text-left font-medium px-4 py-3">End Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {crPageItems.map(res => (
                            <tr key={res.id} className="border-t">
                              <td className="px-4 py-3">
                                <input type="checkbox" checked={selectedResourcesForRequest.some(r => r.id === res.id)} onChange={(e) => {
                                  const checked = e.target.checked;
                                  setSelectedResourcesForRequest(prev => checked ? [...prev, res] : prev.filter(r => r.id !== res.id));
                                }} />
                              </td>
                              <td className="px-4 py-3">{formatResourceType(res.type)}</td>
                              <td className="px-4 py-3">{res.title}</td>
                              <td className="px-4 py-3">{res.information}</td>
                              <td className="px-4 py-3">{res.location || '—'}</td>
                              <td className="px-4 py-3">{res.endDate ? format(res.endDate, 'MMM dd, yyyy') : '—'}</td>
                            </tr>
                          ))}
                          {crPageItems.length === 0 && (
                            <tr><td className="px-4 py-6 text-center text-gray-600" colSpan={6}>No resources found</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="text-sm text-gray-600">Selected: {selectedResourcesForRequest.length} • Page {crPage} of {crTotalPages} • {crFilteredSorted.length} items</div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setCrPage(p => Math.max(1, p - 1))} disabled={crPage === 1}>Prev</Button>
                        <Button variant="outline" size="sm" onClick={() => setCrPage(p => Math.min(crTotalPages, p + 1))} disabled={crPage === crTotalPages}>Next</Button>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => { setIsSeekerCreateOpen(false); setIsSeekerCreateFlow(false); setSelectedResourcesForRequest([]); }}>Cancel</Button>
                        <Button onClick={() => setSeekerStep(2)} disabled={selectedResourcesForRequest.length === 0}>Next</Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Type of Request</label>
                        <Select value={requestForm.requestType || undefined} onValueChange={(v) => setRequestForm(f => ({ ...f, requestType: v as RequestType }))}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            {requestTypes.map(rt => (<SelectItem key={rt} value={rt}>{rt === 'custom' ? 'Custom' : rt.charAt(0).toUpperCase() + rt.slice(1)}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
                      {requestForm.requestType === 'custom' && (
                        <div>
                          <label className="text-sm font-medium">Custom Type</label>
                          <Input value={requestForm.customRequestType} onChange={(e) => setRequestForm(f => ({ ...f, customRequestType: e.target.value }))} />
                        </div>
                      )}
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium">Purpose of Request</label>
                        <Textarea value={requestForm.purposeOfRequest} onChange={(e) => setRequestForm(f => ({ ...f, purposeOfRequest: e.target.value }))} />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Requested Start Date & Time</label>
                        <Input type="datetime-local" value={requestForm.requestedStartDateTime} onChange={(e) => setRequestForm(f => {
                          const start = e.target.value;
                          const end = f.requestedEndDateTime;
                          let duration = f.durationOfUse;
                          if (start && end) {
                            const sd = new Date(start);
                            const ed = new Date(end);
                            const ms = Math.max(0, ed.getTime() - sd.getTime());
                            const hours = Math.round(ms / 36e5);
                            duration = hours >= 24 ? `${Math.round(hours/24)} Days` : `${hours} Hours`;
                          }
                          return { ...f, requestedStartDateTime: start, durationOfUse: duration };
                        })} />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Requested End Date & Time</label>
                        <Input type="datetime-local" value={requestForm.requestedEndDateTime} onChange={(e) => setRequestForm(f => {
                          const end = e.target.value;
                          const start = f.requestedStartDateTime;
                          let duration = f.durationOfUse;
                          if (start && end) {
                            const sd = new Date(start);
                            const ed = new Date(end);
                            const ms = Math.max(0, ed.getTime() - sd.getTime());
                            const hours = Math.round(ms / 36e5);
                            duration = hours >= 24 ? `${Math.round(hours/24)} Days` : `${hours} Hours`;
                          }
                          return { ...f, requestedEndDateTime: end, durationOfUse: duration };
                        })} />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Duration of Use</label>
                        <Input placeholder="Auto-calculated or manual (e.g., 2 Days)" value={requestForm.durationOfUse} onChange={(e) => setRequestForm(f => ({ ...f, durationOfUse: e.target.value }))} />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Preferred Mode of Collaboration (optional)</label>
                        <Select value={requestForm.preferredModeOfCollaboration || undefined} onValueChange={(v) => setRequestForm(f => ({ ...f, preferredModeOfCollaboration: v as CollaborationMode }))}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            {collaborationModes.map(cm => (<SelectItem key={cm} value={cm}>{cm.charAt(0).toUpperCase() + cm.slice(1)}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium">Attach Supporting Document (optional)</label>
                        <Input type="file" onChange={(e) => setRequestForm(f => ({ ...f, supportingDocument: e.target.files?.[0] || null }))} />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Confidentiality Required</label>
                        <div className="flex items-center gap-2"><Switch checked={requestForm.confidentialityRequired} onCheckedChange={(v) => setRequestForm(f => ({ ...f, confidentialityRequired: !!v }))} /> <span>{requestForm.confidentialityRequired ? 'Yes' : 'No'}</span></div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium">Comments / Additional Information</label>
                        <Textarea value={requestForm.comments} onChange={(e) => setRequestForm(f => ({ ...f, comments: e.target.value }))} />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Urgency Indicator</label>
                        <Select value={requestForm.urgencyIndicator} onValueChange={(v) => setRequestForm(f => ({ ...f, urgencyIndicator: v as UrgencyLevel }))}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            {urgencyLevels.map(u => (<SelectItem key={u} value={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Repeat Request</label>
                        <div className="flex items-center gap-2">
                          <Switch checked={requestForm.requestRecurrence.enabled} onCheckedChange={(v) => setRequestForm(f => ({ ...f, requestRecurrence: { ...f.requestRecurrence, enabled: !!v } }))} />
                          <span>{requestForm.requestRecurrence.enabled ? 'Enabled' : 'Disabled'}</span>
                        </div>
                      </div>
                      {requestForm.requestRecurrence.enabled && (
                        <div>
                          <label className="text-sm font-medium">Recurrence Frequency</label>
                          <Input value={requestForm.requestRecurrence.frequency} onChange={(e) => setRequestForm(f => ({ ...f, requestRecurrence: { ...f.requestRecurrence, frequency: e.target.value } }))} />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">Resources selected: {selectedResourcesForRequest.length}</div>
                      <div className="flex gap-2">
                        <Button variant="secondary" onClick={() => resetRequestForm()}>Reset Form</Button>
                        <Button variant="outline" onClick={() => { setIsSeekerCreateOpen(false); setIsSeekerCreateFlow(false); setSeekerStep(1); resetRequestForm(); setSelectedResourcesForRequest([]); }}>Cancel</Button>
                        <Button onClick={() => {
                          if (!requestForm.requestType || !requestForm.purposeOfRequest.trim() || !requestForm.urgencyIndicator) {
                            toast({ title: 'Missing fields', description: 'Please fill Request Type, Purpose, and Urgency.', variant: 'destructive' });
                            return;
                          }
                          selectedResourcesForRequest.forEach(res => {
                            const newReq: ResourceRequest = {
                              id: `req_${Date.now()}_${res.id}`,
                              resourceId: res.id,
                              resource: res,
                              requester: {
                                id: user?.id || 'me',
                                name: `${user?.firstName || 'User'} ${user?.lastName || ''}`.trim(),
                                organization: organization?.name || 'My Organization',
                                email: user?.email || 'me@example.com'
                              },
                              requestType: requestForm.requestType as RequestType,
                              customRequestType: requestForm.requestType === 'custom' ? (requestForm.customRequestType || 'Custom') : undefined,
                              purposeOfRequest: requestForm.purposeOfRequest.trim(),
                              requestedStartDateTime: requestForm.requestedStartDateTime ? new Date(requestForm.requestedStartDateTime) : undefined,
                              requestedEndDateTime: requestForm.requestedEndDateTime ? new Date(requestForm.requestedEndDateTime) : undefined,
                              durationOfUse: requestForm.durationOfUse || undefined,
                              preferredModeOfCollaboration: requestForm.preferredModeOfCollaboration || undefined,
                              supportingDocument: requestForm.supportingDocument ? { name: requestForm.supportingDocument.name, url: '#' } : undefined,
                              confidentialityRequired: !!requestForm.confidentialityRequired,
                              comments: requestForm.comments || undefined,
                              urgencyIndicator: requestForm.urgencyIndicator,
                              requestRecurrence: requestForm.requestRecurrence?.enabled ? { enabled: true, frequency: requestForm.requestRecurrence.frequency || 'one-time' } : { enabled: false },
                              status: 'pending',
                              requestedAt: new Date()
                            };
                            setMyRequests(prev => [newReq, ...prev]);
                            setRequests(prev => [newReq, ...prev]);
                            setResources(prev => prev.map(r => r.id === res.id ? { ...r, requestsCount: (r.requestsCount || 0) + 1, hasNewRequests: true } : r));
                          });
                          toast({ title: 'Access request(s) sent successfully!' });
                          setIsSeekerCreateOpen(false);
                          setIsSeekerCreateFlow(false);
                          setSeekerStep(1);
                          resetRequestForm();
                          setSelectedResourcesForRequest([]);
                        }}>Submit Request</Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Seeker Request Details Dialog */}
          <Dialog open={isViewRequestOpen} onOpenChange={setIsViewRequestOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Request Details</DialogTitle>
              </DialogHeader>
              {selectedRequest && (
                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-gray-500 mb-1">Resource</div>
                      <div className="font-medium">{selectedRequest.resource?.title || '—'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Status</div>
                      <div><span className={`px-2 py-1 rounded ${getSeekerStatusColor(selectedRequest.status)}`}>{selectedRequest.status}</span></div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Type of Request</div>
                      <div>{selectedRequest.requestType}{selectedRequest.customRequestType ? ` (${selectedRequest.customRequestType})` : ''}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Urgency</div>
                      <div><span className={`px-2 py-1 rounded ${getUrgencyColor(selectedRequest.urgencyIndicator)}`}>{selectedRequest.urgencyIndicator}</span></div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-gray-500 mb-1">Purpose</div>
                      <div className="text-gray-700">{selectedRequest.purposeOfRequest || '—'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Requested Start</div>
                      <div>{selectedRequest.requestedStartDateTime ? format(new Date(selectedRequest.requestedStartDateTime), 'PPpp') : '—'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Requested End</div>
                      <div>{selectedRequest.requestedEndDateTime ? format(new Date(selectedRequest.requestedEndDateTime), 'PPpp') : '—'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Duration</div>
                      <div>{selectedRequest.durationOfUse || '—'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Preferred Mode</div>
                      <div>{selectedRequest.preferredModeOfCollaboration || '—'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Confidential</div>
                      <div>{selectedRequest.confidentialityRequired ? 'Yes' : 'No'}</div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-gray-500 mb-1">Comments</div>
                      <div className="text-gray-700">{selectedRequest.comments || '—'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Attachment</div>
                      <div>
                        {selectedRequest.supportingDocument ? (
                          <Button variant="link" className="p-0 h-auto"><Download className="h-4 w-4 mr-1" /> {selectedRequest.supportingDocument.name}</Button>
                        ) : '—'}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Recurrence</div>
                      <div>{selectedRequest.requestRecurrence?.enabled ? (selectedRequest.requestRecurrence.frequency || 'Custom') : 'One-time'}</div>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>

      {/* Resource Detail Dialog */}
      <Dialog open={isViewResourceOpen} onOpenChange={setIsViewResourceOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedResource && (
                <>
                  {(() => {
                    const FileIcon = getFileIcon(selectedResource.type);
                    return <FileIcon className="h-5 w-5 text-blue-600" />;
                  })()} 
                  {selectedResource.title}
                </>  
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedResource && (
            <div className="space-y-6">
              {/* Resource Information (only required fields) */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{formatResourceType(selectedResource.type)}</Badge>
                </div>
                <p className="text-gray-700 mb-3">{selectedResource.information}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span className="font-medium">Name:</span>
                    {activeTab === 'seeker' ? (selectedResource.maskedName || 'Hidden') : (teamMembers.find(tm => selectedResource.teamMemberIds?.includes(tm.id))?.name || '—')}
                  </span>
                  {selectedResource.location && (
                    <span className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {selectedResource.location}
                    </span>
                  )}
                  {selectedResource.endDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Available till {format(selectedResource.endDate, 'MMM dd, yyyy')}
                    </span>
                  )}
                </div>
              </div>

              {/* Simple Stats removed per spec to avoid extra information */}

              {/* Pool Requests List (for this resource) */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-800">Pool Requests</h3>
                {requests.filter(r => r.resourceId === selectedResource.id).length === 0 ? (
                  <p className="text-sm text-gray-600">No requests for this resource yet.</p>
                ) : (
                  <div className="space-y-3">
                    {requests.filter(r => r.resourceId === selectedResource.id).map((req) => (
                      <div key={req.id} className="border rounded-md p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-sm"><span className="font-medium">Type of Request:</span> {req.requestType}{req.customRequestType ? ` (${req.customRequestType})` : ''}</div>
                            <div className="text-sm"><span className="font-medium">Purpose of Request:</span> {req.purposeOfRequest}</div>
                            {req.requestedStartDateTime && (
                              <div className="text-sm"><span className="font-medium">Requested Start:</span> {new Date(req.requestedStartDateTime).toLocaleString()}</div>
                            )}
                            {req.requestedEndDateTime && (
                              <div className="text-sm"><span className="font-medium">Requested End:</span> {new Date(req.requestedEndDateTime).toLocaleString()}</div>
                            )}
                            {req.durationOfUse && (
                              <div className="text-sm"><span className="font-medium">Duration of Use:</span> {req.durationOfUse}</div>
                            )}
                            {req.preferredModeOfCollaboration && (
                              <div className="text-sm"><span className="font-medium">Preferred Mode of Collaboration:</span> {req.preferredModeOfCollaboration}</div>
                            )}
                            {req.supportingDocument && (
                              <div className="text-sm"><span className="font-medium">Supporting Document:</span> <a href={req.supportingDocument.url} className="text-blue-700 hover:underline">{req.supportingDocument.name}</a></div>
                            )}
                            <div className="text-sm flex items-center gap-2">
                              <span className="font-medium">Confidentiality Required:</span>
                              <Badge variant="outline">{req.confidentialityRequired ? 'Yes' : 'No'}</Badge>
                            </div>
                            {req.comments && (
                              <div className="text-sm"><span className="font-medium">Comments / Additional Information:</span> {req.comments}</div>
                            )}
                            {req.requestRecurrence?.enabled && (
                              <div className="text-sm"><span className="font-medium">Request Recurrence:</span> Enabled{req.requestRecurrence.frequency ? ` (${req.requestRecurrence.frequency})` : ''}</div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className={getUrgencyColor(req.urgencyIndicator)}>{req.urgencyIndicator}</Badge>
                            <Badge variant="outline">{req.status}</Badge>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                          <span>Requested at: {new Date(req.requestedAt).toLocaleString()}</span>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApproveRequest(req.id)} >
                              <CheckCircle className="h-3 w-3 mr-1" /> Accept
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleRejectRequest(req.id)} >
                              <XCircle className="h-3 w-3 mr-1" /> Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                {activeTab === 'provider' ? (
                  <>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        handleEditResource(selectedResource);
                        setIsViewResourceOpen(false);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        handleDeleteResource(selectedResource);
                        setIsViewResourceOpen(false);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </>
                ) : (
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      toast({ title: "Access request sent successfully!" });
                      setIsViewResourceOpen(false);
                    }}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Request Access
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => setIsViewResourceOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Request Dialog (Seeker) - Enhanced */}
      <Dialog open={isCreateRequestOpen} onOpenChange={(open) => { setIsCreateRequestOpen(open); if (!open) { setRequestForResource(null); resetRequestForm(); } }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request Access{requestForResource ? `: ${requestForResource.title}` : ''}</DialogTitle>
          </DialogHeader>
          <TooltipProvider>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label>Request Type *</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Select the type of request that best describes your need</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select 
                    value={requestForm.requestType || undefined} 
                    onValueChange={(v) => {
                      setRequestForm(prev => ({ ...prev, requestType: v as RequestType }));
                      setFormErrors(prev => ({ ...prev, requestType: '' }));
                    }}
                  >
                    <SelectTrigger className={formErrors.requestType ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {requestTypes.map(rt => (
                        <SelectItem key={rt} value={rt}>{requestTypeLabels[rt]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.requestType && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.requestType}</p>
                  )}
                </div>
                
                {requestForm.requestType === 'custom' && (
                  <div>
                    <Label>Custom Request Type *</Label>
                    <Input 
                      value={requestForm.customRequestType} 
                      onChange={(e) => {
                        setRequestForm(prev => ({ ...prev, customRequestType: e.target.value }));
                        setFormErrors(prev => ({ ...prev, customRequestType: '' }));
                      }} 
                      placeholder="Enter custom request type..." 
                      className={formErrors.customRequestType ? 'border-red-500' : ''}
                    />
                    {formErrors.customRequestType && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.customRequestType}</p>
                    )}
                  </div>
                )}
                
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Label>Purpose of Request *</Label>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Provide a detailed description of why you need this resource</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <span className="text-xs text-gray-500">{characterCounts.purposeOfRequest}/500</span>
                  </div>
                  <Textarea 
                    value={requestForm.purposeOfRequest} 
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 500) {
                        setRequestForm(prev => ({ ...prev, purposeOfRequest: value }));
                        setCharacterCounts(prev => ({ ...prev, purposeOfRequest: value.length }));
                        setFormErrors(prev => ({ ...prev, purposeOfRequest: '' }));
                      }
                    }} 
                    placeholder="Describe your need in detail (minimum 10 characters)" 
                    className={formErrors.purposeOfRequest ? 'border-red-500' : ''}
                    rows={3}
                  />
                  {formErrors.purposeOfRequest && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.purposeOfRequest}</p>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label>Start Date/Time</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>When do you need to start using this resource?</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input 
                    type="datetime-local" 
                    value={requestForm.requestedStartDateTime} 
                    onChange={(e) => setRequestForm(prev => ({ ...prev, requestedStartDateTime: e.target.value }))} 
                  />
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label>End Date/Time</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>When will you finish using this resource?</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input 
                    type="datetime-local" 
                    value={requestForm.requestedEndDateTime} 
                    onChange={(e) => {
                      setRequestForm(prev => ({ ...prev, requestedEndDateTime: e.target.value }));
                      setFormErrors(prev => ({ ...prev, requestedEndDateTime: '' }));
                    }}
                    className={formErrors.requestedEndDateTime ? 'border-red-500' : ''}
                  />
                  {formErrors.requestedEndDateTime && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.requestedEndDateTime}</p>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label>Duration of Use</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Auto-calculated from start/end times, or enter manually</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="relative">
                    <Input 
                      placeholder="Auto-calculated or enter manually" 
                      value={requestForm.durationOfUse} 
                      onChange={(e) => setRequestForm(prev => ({ ...prev, durationOfUse: e.target.value }))} 
                    />
                    {calculateDuration() && (
                      <div className="absolute right-2 top-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                        Auto: {calculateDuration()}
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label>Preferred Collaboration Mode</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>How would you prefer to collaborate with the resource provider?</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select value={requestForm.preferredModeOfCollaboration || undefined} onValueChange={(v) => setRequestForm(prev => ({ ...prev, preferredModeOfCollaboration: v as CollaborationMode }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      {collaborationModes.map(m => {
                        const IconComponent = collaborationModeIcons[m];
                        return (
                          <SelectItem key={m} value={m}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4" />
                              {m.charAt(0).toUpperCase() + m.slice(1).replace('-', ' ')}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Urgency Level</Label>
                  <Select value={requestForm.urgencyIndicator} onValueChange={(v) => setRequestForm(prev => ({ ...prev, urgencyIndicator: v as UrgencyLevel }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      {urgencyLevels.map(u => (
                        <SelectItem key={u} value={u}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              u === 'high' ? 'bg-red-500' : 
                              u === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                            }`} />
                            {u.charAt(0).toUpperCase() + u.slice(1)}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Additional Comments</Label>
                    <span className="text-xs text-gray-500">{characterCounts.comments}/300</span>
                  </div>
                  <Textarea 
                    value={requestForm.comments} 
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 300) {
                        setRequestForm(prev => ({ ...prev, comments: value }));
                        setCharacterCounts(prev => ({ ...prev, comments: value.length }));
                      }
                    }} 
                    placeholder="Additional details for the resource owner (optional)" 
                    rows={2}
                  />
                </div>
                
                <div className="flex items-center gap-2 md:col-span-2">
                  <Checkbox 
                    id="confidentiality" 
                    checked={requestForm.confidentialityRequired} 
                    onCheckedChange={(v) => setRequestForm(prev => ({ ...prev, confidentialityRequired: Boolean(v) }))} 
                  />
                  <Label htmlFor="confidentiality" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Confidentiality required (NDA)
                  </Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Check if you need the provider to sign a non-disclosure agreement</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                <div className="md:col-span-2">
                  <Label>Supporting Document (Optional)</Label>
                  <Input 
                    type="file" 
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setRequestForm(prev => ({ ...prev, supportingDocument: file }));
                    }} 
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  />
                  <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX, TXT, JPG, PNG (max 10MB)</p>
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="recurrence" 
                      checked={requestForm.requestRecurrence.enabled} 
                      onCheckedChange={(v) => setRequestForm(prev => ({ ...prev, requestRecurrence: { ...prev.requestRecurrence, enabled: Boolean(v) } }))} 
                    />
                    <Label htmlFor="recurrence">Recurring Request</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Check if you need this resource on a regular basis</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  {requestForm.requestRecurrence.enabled && (
                    <div className="mt-2">
                      <Label>Frequency</Label>
                      <Input 
                        placeholder="e.g., weekly, monthly, quarterly" 
                        value={requestForm.requestRecurrence.frequency} 
                        onChange={(e) => setRequestForm(prev => ({ ...prev, requestRecurrence: { ...prev.requestRecurrence, frequency: e.target.value } }))} 
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => { setIsCreateRequestOpen(false); setRequestForResource(null); resetRequestForm(); }}>
                  Cancel
                </Button>
                <Button onClick={handleSendRequest} disabled={formSubmitting}>
                  {formSubmitting ? 'Sending...' : 'Send Request'}
                </Button>
              </div>
            </div>
          </TooltipProvider>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ResourceSharingPooling;
