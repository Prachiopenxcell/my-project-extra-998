import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

// Mock data
const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Meeting Room A - 8 Seats',
    description: 'Conference room with display and whiteboard.',
    type: 'infrastructure',
    location: 'BKC, Mumbai',
    endDate: null,
    owner: { id: 'sp1', name: 'Rahul Mehta', organization: 'Mehta & Co.' },
    createdAt: new Date('2025-07-01'),
    updatedAt: new Date('2025-07-12'),
    status: 'available',
    requestsCount: 2,
  },
  {
    id: '2',
    title: 'Research Article: Direct Tax Amendments 24-25',
    description: 'In-depth analysis with case references.',
    type: 'article',
    location: 'Digital',
    endDate: null,
    owner: { id: 'sp2', name: 'Anita Verma', organization: 'Verma Advisors' },
    createdAt: new Date('2025-06-15'),
    updatedAt: new Date('2025-06-20'),
    status: 'available',
    requestsCount: 0,
  },
  {
    id: '3',
    title: 'Trainee – Semi Qualified (CS)',
    description: 'Trained on compliance filings; available part-time.',
    type: 'trainee',
    location: 'Remote',
    endDate: new Date('2025-12-31'),
    owner: { id: 'sp1', name: 'Rahul Mehta', organization: 'Mehta & Co.' },
    createdAt: new Date('2025-07-05'),
    updatedAt: new Date('2025-07-10'),
    status: 'occupied',
    requestsCount: 3,
  },
];

const mockRequests: ResourceRequest[] = [
  {
    id: 'r1',
    resourceId: '3',
    resource: mockResources[2],
    requester: {
      id: 'ssk1',
      name: 'Kunal Shah',
      organization: 'Shah & Partners',
      email: 'kunal@sp.com',
    },
    purpose: 'Support for ROC filings next week',
    message: 'Need 10 hours over two days for filings.',
    urgency: 'high',
    status: 'pending',
    requestedAt: new Date('2025-07-18'),
    requestedStart: new Date('2025-07-20T10:00:00'),
    requestedEnd: new Date('2025-07-20T16:00:00'),
    durationText: '6 Hours',
    mode: 'Hybrid',
    confidentialityRequired: true,
  },
];

function ResourceSharingPooling() {
  return (
    <DashboardLayout userType="service_provider">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resource Sharing & Pooling</h1>
          <p className="text-gray-600">Share and access professional resources, templates, and tools within the community.</p>
        </div>

        <ResourceSharingModule />
      </div>
    </DashboardLayout>
  );
}

function ResourceSharingModule() {
  const [activeTab, setActiveTab] = useState<'provider' | 'seeker'>('provider');
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [requests, setRequests] = useState<ResourceRequest[]>(mockRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest'>('latest');
  const [pageSize, setPageSize] = useState<10 | 50 | 100>(10);
  const [page, setPage] = useState(1);
  const [isCreateResourceOpen, setIsCreateResourceOpen] = useState(false);
  const [isCreateRequestOpen, setIsCreateRequestOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isViewResourceOpen, setIsViewResourceOpen] = useState(false);
  const { toast } = useToast();
  const { user, organization } = useAuth();

  // Upload Resource form state
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formType, setFormType] = useState<ResourceType | "">("");
  const [formStatus, setFormStatus] = useState<ResourceStatus | "">("");
  const [formLocation, setFormLocation] = useState("");
  const [formEndDate, setFormEndDate] = useState<string>("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  // Advanced/conditional fields
  const [formStartDate, setFormStartDate] = useState<string>("");
  const [formMode, setFormMode] = useState<'' | 'onsite' | 'remote' | 'hybrid'>("");
  const [formCapacity, setFormCapacity] = useState<string>("");
  const [formConfidential, setFormConfidential] = useState<boolean>(false);
  // Optional file upload for article-type
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");

  const resourceTypes: Array<'all' | ResourceType> = ['all', 'infrastructure', 'article', 'trainee'];
  const statusOptions: Array<'all' | ResourceStatus> = ['all', 'available', 'occupied', 'inactive'];

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
        description: formDescription.trim(),
        type: formType as ResourceType,
        location: formLocation.trim() || undefined,
        endDate: formEndDate ? new Date(formEndDate) : null,
        startDate: formStartDate ? new Date(formStartDate) : null,
        mode: formMode || undefined,
        capacity: formCapacity ? Number(formCapacity) : undefined,
        confidential: formConfidential || undefined,
        hasAttachment: !!selectedFile || undefined,
        attachmentName: selectedFile?.name,
        owner: { id: user?.id || 'me', name: ownerName, organization: orgName },
        createdAt: now,
        updatedAt: now,
        status: formStatus as ResourceStatus,
        requestsCount: 0,
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
      const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.description.toLowerCase().includes(searchTerm.toLowerCase()) || (r.location || '').toLowerCase().includes(searchTerm.toLowerCase());
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
                    <p className="text-sm text-gray-600 line-clamp-2">{resource.description}</p>
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
                        <Badge className={getUrgencyColor(request.urgency)}>
                          {request.urgency}
                        </Badge>
                        <Badge variant="outline">
                          {request.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">{request.message}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {format(request.requestedAt, 'MMM dd, yyyy')}
                      </span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline">
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
            {filteredSorted.map((resource) => {
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
                    <p className="text-sm text-gray-600 line-clamp-2">{resource.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>By {resource.owner.name}</span>
                      <span className="flex items-center gap-1">
                        <Send className="h-3 w-3" />
                        {resource.requestsCount}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" className="flex-1">
                            <Send className="h-3 w-3 mr-1" />
                            Request Access
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Request Resource Access</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Purpose</label>
                              <Input placeholder="Why do you need this resource?" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Message</label>
                              <Textarea placeholder="Additional details for the resource owner" />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Urgency</label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select urgency" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">Low</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline">Cancel</Button>
                              <Button onClick={() => {
                                toast({ title: "Access request sent successfully!" });
                              }}>
                                Send Request
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
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
                  <p className="text-gray-700 mb-3">{selectedResource.description}</p>
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
    </div>
  );
}

export default ResourceSharingPooling;
