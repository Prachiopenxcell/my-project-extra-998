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
import { Separator } from "@/components/ui/separator";
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
  ArrowRight
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
    maskedName: 'R***l M***a'
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
    maskedName: 'V****m S***h'
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
    attachments: [{
      name: 'GST_Audit_Checklist_2025.xlsx',
      url: '/documents/gst-audit-2025.xlsx',
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }]
  },
  
  // Human Resources/Trainees
  {
    id: '3',
    title: 'Trainee – Semi Qualified (CS)',
    information: 'Experienced trainee with expertise in compliance filings, ROC matters, and secretarial work. Available for part-time assignments.',
    type: 'trainee',
    location: 'Remote/Hybrid',
    endDate: new Date('2025-12-31'),
    teamMemberIds: ['tm1'],
    owner: { id: 'sp1', name: 'Rahul Mehta', organization: 'Mehta & Co.', email: 'rahul@mehtaco.com' },
    createdAt: new Date('2025-07-05'),
    updatedAt: new Date('2025-07-10'),
    status: 'occupied',
    requestsCount: 3,
    hasNewRequests: true,
    maskedName: 'R***l M***a'
  },
  {
    id: '6',
    title: 'Tax Consultant - GST Specialist',
    information: 'CA with 3 years of experience in GST compliance, returns filing, and advisory services. Available for project-based assignments.',
    type: 'professional',
    location: 'Mumbai/Remote',
    endDate: new Date('2025-09-30'),
    teamMemberIds: ['tm2'],
    owner: { id: 'sp5', name: 'Rajesh Iyer', organization: 'Iyer & Co.', email: 'rajesh@iyerco.in' },
    createdAt: new Date('2025-07-12'),
    updatedAt: new Date('2025-07-18'),
    status: 'available',
    requestsCount: 2,
    hasNewRequests: true,
    maskedName: 'R****h I***r'
  }
];

const mockRequests: ResourceRequest[] = [
  // Pending Requests
  {
    id: 'r1',
    resourceId: '3',
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
    requestType: 'knowledge',
    purposeOfRequest: 'Reference for upcoming GST audit of manufacturing client',
    requestedStartDateTime: null,
    requestedEndDateTime: null,
    durationOfUse: '1 Week',
    preferredModeOfCollaboration: 'digital',
    confidentialityRequired: false,
    comments: 'Need to verify compliance requirements for manufacturing sector',
    urgencyIndicator: 'medium',
    status: 'approved',
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
    requestType: 'consultation',
    purposeOfRequest: 'GST advisory for new e-commerce business',
    requestedStartDateTime: new Date('2025-08-01T11:00:00'),
    requestedEndDateTime: new Date('2025-08-01T13:00:00'),
    durationOfUse: '2 Hours',
    preferredModeOfCollaboration: 'video',
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
    requestType: 'workspace',
    purposeOfRequest: 'Temporary workspace during office renovation',
    requestedStartDateTime: new Date('2025-07-10T09:00:00'),
    requestedEndDateTime: new Date('2025-07-12T18:00:00'),
    durationOfUse: '3 Days',
    preferredModeOfCollaboration: 'in-person',
    confidentialityRequired: true,
    comments: 'Need secure workspace for team of 3',
    urgencyIndicator: 'medium',
    status: 'completed',
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
  
  const { toast } = useToast();
  const { user, organization } = useAuth();

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
  
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Create Resource Dialog/Form State (legacy fields used below)
  const [isCreateResourceOpen, setIsCreateResourceOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formType, setFormType] = useState<ResourceType | ''>('');
  const [formStatus, setFormStatus] = useState<ResourceStatus | ''>('');
  const [formLocation, setFormLocation] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formMode, setFormMode] = useState<'onsite' | 'remote' | 'hybrid' | ''>('');
  const [formCapacity, setFormCapacity] = useState('');
  const [formConfidential, setFormConfidential] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');

  const resourceTypes: Array<'all' | ResourceType> = ['all', 'infrastructure', 'article', 'trainee'];
  const statusOptions: Array<'all' | ResourceStatus> = ['all', 'available', 'occupied', 'inactive'];
  const requestTypes: RequestType[] = ['module', 'checklist', 'task', 'subtask', 'custom'];
  const urgencyLevels: UrgencyLevel[] = ['high', 'medium', 'low'];
  const collaborationModes: CollaborationMode[] = ['virtual', 'in-person', 'hybrid'];

  // Seeker Request Dialog State
  const [isCreateRequestOpen, setIsCreateRequestOpen] = useState(false);
  const [requestForResource, setRequestForResource] = useState<Resource | null>(null);

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
  };

  const handleOpenRequestDialog = (resource: Resource) => {
    setRequestForResource(resource);
    setIsCreateRequestOpen(true);
  };

  const handleSendRequest = () => {
    if (!requestForResource) return;
    if (!requestForm.purposeOfRequest.trim() || !requestForm.urgencyIndicator || !requestForm.requestType) {
      toast({ title: 'Missing fields', description: 'Please fill Request Type, Purpose, and Urgency.', variant: 'destructive' });
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
    setFormStatus("");
    setFormLocation("");
    setFormEndDate("");
    setFormStartDate("");
    setFormMode("");
    setFormCapacity("");
    setFormConfidential(false);
    setSelectedFile(null);
    setFileError("");
    setFormSubmitting(false);
  };

  const handleCreateResource = async () => {
    if (!formTitle.trim() || !formType || !formStatus) {
      toast({ title: "Missing required fields", description: "Please fill Title, Type and Status.", variant: "destructive" });
      return;
    }
    // Optional file validation for article
    if (formType === 'article' && selectedFile) {
      const maxBytes = 5 * 1024 * 1024; // 5MB
      const allowed = [
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (selectedFile.size > maxBytes) {
        setFileError('File size must be 5MB or less.');
        toast({ title: 'Invalid file', description: 'File size must be 5MB or less.', variant: 'destructive' });
        return;
      }
      if (!allowed.includes(selectedFile.type)) {
        setFileError('Unsupported file type.');
        toast({ title: 'Invalid file', description: 'Only PDF, DOC, DOCX, or TXT allowed.', variant: 'destructive' });
        return;
      }
    }

    try {
      setFormSubmitting(true);
      const now = new Date();
      const ownerName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Owner' : 'Owner';
      const orgName = organization?.name || 'My Organization';
      const newResource: Resource = {
        id: String(Date.now()),
        title: formTitle.trim(),
        information: formDescription.trim(),
        type: formType as ResourceType,
        location: formLocation.trim() || undefined,
        endDate: formEndDate ? new Date(formEndDate) : null,
        startDate: formStartDate ? new Date(formStartDate) : null,
        teamMemberIds: undefined,
        maskedName: ownerName ? `${ownerName.charAt(0)}***${ownerName.charAt(ownerName.length - 1)}` : undefined,
        owner: { id: user?.id || 'me', name: ownerName, organization: orgName, email: user?.email || 'owner@example.com' },
        createdAt: now,
        updatedAt: now,
        status: formStatus as ResourceStatus,
        requestsCount: 0,
        hasNewRequests: false,
        attachments: selectedFile && formType === 'article' ? [{ name: selectedFile.name, url: '#', type: selectedFile.type || 'application/octet-stream' }] : undefined,
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
      const matchesStatus = selectedStatus === 'all' || r.status === selectedStatus;
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

  // Request actions
  const handleApproveRequest = (requestId: string) => {
    setRequests(prev => prev.map(r => r.id === requestId ? {
      ...r,
      status: 'accepted',
      respondedAt: new Date(),
      responseMessage: 'Approved by provider'
    } : r));
    toast({ title: 'Request approved' });
  };

  const handleRejectRequest = (requestId: string) => {
    setRequests(prev => prev.map(r => r.id === requestId ? {
      ...r,
      status: 'rejected',
      respondedAt: new Date(),
      responseMessage: 'Rejected by provider'
    } : r));
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
                      {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(st => (
                    <SelectItem key={st} value={st}>
                      {st === 'all' ? 'All Statuses' : st.charAt(0).toUpperCase() + st.slice(1)}
                    </SelectItem>
                  ))}
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
                  Add Resource
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
                      <Select value={formType || undefined} onValueChange={(v) => setFormType(v as ResourceType)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {resourceTypes.slice(1).map(type => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <Select value={formStatus || undefined} onValueChange={(v) => setFormStatus(v as ResourceStatus)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {(['available','occupied','inactive'] as const).map(st => (
                            <SelectItem key={st} value={st}>
                              {st.charAt(0).toUpperCase() + st.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Availability Start Date (optional)</label>
                      <Input type="date" value={formStartDate} onChange={(e) => setFormStartDate(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Location</label>
                      <Input placeholder="e.g., BKC, Mumbai or Remote" value={formLocation} onChange={(e) => setFormLocation(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Availability End Date (optional)</label>
                      <Input type="date" value={formEndDate} onChange={(e) => setFormEndDate(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Mode</label>
                      <Select value={formMode || undefined} onValueChange={(v) => setFormMode(v as 'onsite' | 'remote' | 'hybrid')}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="onsite">Onsite</SelectItem>
                          <SelectItem value="remote">Remote</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Capacity / Quantity (optional)</label>
                      <Input type="number" min="0" placeholder="e.g., 8" value={formCapacity} onChange={(e) => setFormCapacity(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-2">
                      <input id="confidential" type="checkbox" className="h-4 w-4" checked={formConfidential} onChange={(e) => setFormConfidential(e.target.checked)} />
                      <label htmlFor="confidential" className="text-sm font-medium">Confidential (NDA may be required)</label>
                    </div>
                  </div>
                  {formType === 'article' && (
                    <div>
                      <label className="text-sm font-medium">Attach File (optional)</label>
                      <Input
                        type="file"
                        accept=".pdf,.txt,.doc,.docx,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setSelectedFile(file);
                          setFileError("");
                          if (file) {
                            const maxBytes = 5 * 1024 * 1024;
                            const allowed = [
                              'application/pdf',
                              'text/plain',
                              'application/msword',
                              'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                            ];
                            if (file.size > maxBytes) {
                              setFileError('File size must be 5MB or less.');
                            } else if (!allowed.includes(file.type)) {
                              setFileError('Only PDF, DOC, DOCX, or TXT allowed.');
                            }
                          }
                        }}
                      />
                      {selectedFile && (
                        <p className="text-xs text-gray-600 mt-1">Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)</p>
                      )}
                      {fileError && (
                        <p className="text-xs text-red-600 mt-1">{fileError}</p>
                      )}
                    </div>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => { setIsCreateResourceOpen(false); }}>
                      Cancel
                    </Button>
                    <Button disabled={formSubmitting || !formTitle.trim() || !formType || !formStatus} onClick={handleCreateResource}>
                      Add Resource
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPageItems.map((resource) => {
              const FileIcon = getFileIcon(resource.type);
              return (
                <Card key={resource.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <FileIcon className="h-5 w-5 text-blue-600" />
                        <Badge className={getStatusColor(resource.status)}>
                          {resource.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        {resource.requestsCount > 0 && (
                          <Flag className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 line-clamp-2">{resource.information}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {resource.owner.organization}
                        </span>
                        {resource.location && (
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {resource.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Send className="h-3 w-3" />
                          {resource.requestsCount}
                        </span>
                      </div>
                      <span>{format(resource.createdAt, 'MMM dd, yyyy')}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleViewResource(resource)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditResource(resource)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteResource(resource)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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

          {/* Requests Management */}
          <Card>
            <CardHeader>
              <CardTitle>Resource Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{request.resource.title}</h4>
                        <p className="text-sm text-gray-600">
                          Requested by {request.requester.name} from {request.requester.organization}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getUrgencyColor(request.urgencyIndicator)}>
                          {request.urgencyIndicator}
                        </Badge>
                        <Badge variant="outline">
                          {request.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-1"><span className="font-medium">Purpose:</span> {request.purposeOfRequest}</p>
                    {request.comments && (
                      <p className="text-sm text-gray-700 mb-3"><span className="font-medium">Comments:</span> {request.comments}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {format(request.requestedAt, 'MMM dd, yyyy')}
                      </span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApproveRequest(request.id)} disabled={request.status !== 'pending'}>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleRejectRequest(request.id)} disabled={request.status !== 'pending'}>
                          <XCircle className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seeker" className="space-y-6">
          {/* Seeker Controls */}
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
                      {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(st => (
                    <SelectItem key={st} value={st}>
                      {st === 'all' ? 'All Statuses' : st.charAt(0).toUpperCase() + st.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Available Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPageItems.map((resource) => {
              const FileIcon = getFileIcon(resource.type);
              return (
                <Card key={resource.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <FileIcon className="h-5 w-5 text-blue-600" />
                        <Badge className={getStatusColor(resource.status)}>{resource.status}</Badge>
                      </div>
                      <div className="flex items-center gap-1" />
                    </div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 line-clamp-2">{resource.information}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>By {activeTab === 'seeker' ? (resource.maskedName || resource.owner.name) : resource.owner.name}</span>
                      <span className="flex items-center gap-1">
                        <Send className="h-3 w-3" />
                        {resource.requestsCount}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1" onClick={() => handleOpenRequestDialog(resource)}>
                        <Send className="h-3 w-3 mr-1" />
                        Request Access
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewResource(resource)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination for seeker browse */}
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

          {/* My Requests (Seeker) */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>My Requests</CardTitle>
              <CardDescription>Your submitted resource access requests</CardDescription>
            </CardHeader>
            <CardContent>
              {myRequests.length === 0 ? (
                <p className="text-sm text-gray-600">No requests yet. Use "Request Access" on a resource to create one.</p>
              ) : (
                <div className="space-y-3">
                  {myRequests.map((req) => (
                    <div key={req.id} className="border rounded-md p-3 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <div className="font-medium truncate">{req.resource?.title || 'Resource'}</div>
                          <div className="text-xs text-gray-600 truncate">Purpose: {req.purposeOfRequest}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={getUrgencyColor(req.urgencyIndicator)}>
                            {req.urgencyIndicator}
                          </Badge>
                          <Badge>{req.status}</Badge>
                        </div>
                      </div>
                      <div className="mt-1 text-xs text-gray-500 flex flex-wrap gap-3">
                        <span>Type: {req.requestType}{req.customRequestType ? ` (${req.customRequestType})` : ''}</span>
                        {req.requestedAt && (
                          <span>Requested: {new Date(req.requestedAt).toLocaleString()}</span>
                        )}
                        {req.preferredModeOfCollaboration && (
                          <span>Mode: {req.preferredModeOfCollaboration}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
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
              {/* Resource Header */}
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getStatusColor(selectedResource.status)}>
                      {selectedResource.status}
                    </Badge>
                    <Badge variant="outline">
                      {selectedResource.type.charAt(0).toUpperCase() + selectedResource.type.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-gray-700 mb-3">{selectedResource.information}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {selectedResource.owner.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {selectedResource.owner.organization}
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
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(selectedResource.createdAt, 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {selectedResource.requestsCount > 0 && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Flag className="h-3 w-3" /> {selectedResource.requestsCount}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Simple Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{selectedResource.requestsCount}</div>
                  <p className="text-sm text-purple-700">Requests</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-700">{selectedResource.status}</div>
                  <p className="text-sm text-gray-600">Status</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{format(selectedResource.updatedAt, 'MMM dd, yyyy')}</div>
                  <p className="text-sm text-blue-700">Last Updated</p>
                </div>
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

      {/* Create Request Dialog (Seeker) */}
      <Dialog open={isCreateRequestOpen} onOpenChange={(open) => { setIsCreateRequestOpen(open); if (!open) { setRequestForResource(null); resetRequestForm(); } }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Request Access{requestForResource ? `: ${requestForResource.title}` : ''}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Request Type</Label>
                <Select value={requestForm.requestType || undefined} onValueChange={(v) => setRequestForm(prev => ({ ...prev, requestType: v as RequestType }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {requestTypes.map(rt => (
                      <SelectItem key={rt} value={rt}>{rt.charAt(0).toUpperCase() + rt.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {requestForm.requestType === 'custom' && (
                <div>
                  <Label>Custom Type</Label>
                  <Input value={requestForm.customRequestType} onChange={(e) => setRequestForm(prev => ({ ...prev, customRequestType: e.target.value }))} placeholder="Enter custom request type" />
                </div>
              )}
              <div className="md:col-span-2">
                <Label>Purpose of Request</Label>
                <Textarea value={requestForm.purposeOfRequest} onChange={(e) => setRequestForm(prev => ({ ...prev, purposeOfRequest: e.target.value }))} placeholder="Describe your need" />
              </div>
              <div>
                <Label>Start Date/Time</Label>
                <Input type="datetime-local" value={requestForm.requestedStartDateTime} onChange={(e) => setRequestForm(prev => ({ ...prev, requestedStartDateTime: e.target.value }))} />
              </div>
              <div>
                <Label>End Date/Time</Label>
                <Input type="datetime-local" value={requestForm.requestedEndDateTime} onChange={(e) => setRequestForm(prev => ({ ...prev, requestedEndDateTime: e.target.value }))} />
              </div>
              <div>
                <Label>Duration of Use</Label>
                <Input placeholder="e.g., 3 hours, 2 days" value={requestForm.durationOfUse} onChange={(e) => setRequestForm(prev => ({ ...prev, durationOfUse: e.target.value }))} />
              </div>
              <div>
                <Label>Preferred Collaboration Mode</Label>
                <Select value={requestForm.preferredModeOfCollaboration || undefined} onValueChange={(v) => setRequestForm(prev => ({ ...prev, preferredModeOfCollaboration: v as CollaborationMode }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {collaborationModes.map(m => (
                      <SelectItem key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Urgency</Label>
                <Select value={requestForm.urgencyIndicator} onValueChange={(v) => setRequestForm(prev => ({ ...prev, urgencyIndicator: v as UrgencyLevel }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    {urgencyLevels.map(u => (
                      <SelectItem key={u} value={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label>Comments</Label>
                <Textarea value={requestForm.comments} onChange={(e) => setRequestForm(prev => ({ ...prev, comments: e.target.value }))} placeholder="Additional details for the resource owner" />
              </div>
              <div className="flex items-center gap-2 md:col-span-2">
                <Checkbox id="confidentiality" checked={requestForm.confidentialityRequired} onCheckedChange={(v) => setRequestForm(prev => ({ ...prev, confidentialityRequired: Boolean(v) }))} />
                <Label htmlFor="confidentiality">Confidentiality required (NDA)</Label>
              </div>
              <div className="md:col-span-2">
                <Label>Attach supporting document (optional)</Label>
                <Input type="file" onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setRequestForm(prev => ({ ...prev, supportingDocument: file }));
                }} />
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center gap-2">
                  <Checkbox id="recurrence" checked={requestForm.requestRecurrence.enabled} onCheckedChange={(v) => setRequestForm(prev => ({ ...prev, requestRecurrence: { ...prev.requestRecurrence, enabled: Boolean(v) } }))} />
                  <Label htmlFor="recurrence">Recurring request</Label>
                </div>
                {requestForm.requestRecurrence.enabled && (
                  <div className="mt-2">
                    <Label>Frequency</Label>
                    <Input placeholder="e.g., weekly, monthly" value={requestForm.requestRecurrence.frequency} onChange={(e) => setRequestForm(prev => ({ ...prev, requestRecurrence: { ...prev.requestRecurrence, frequency: e.target.value } }))} />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setIsCreateRequestOpen(false); setRequestForResource(null); resetRequestForm(); }}>Cancel</Button>
              <Button onClick={handleSendRequest}>Send Request</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ResourceSharingPooling;
