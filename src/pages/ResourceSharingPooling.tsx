import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  Unlock
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

// Types
interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'template' | 'guide' | 'tool' | 'dataset' | 'media';
  category: string;
  tags: string[];
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  author: {
    id: string;
    name: string;
    organization: string;
  };
  createdAt: Date;
  updatedAt: Date;
  downloads: number;
  rating: number;
  reviews: number;
  isPublic: boolean;
  accessLevel: 'public' | 'restricted' | 'private';
  requestsCount: number;
  status: 'active' | 'inactive' | 'pending';
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
  message: string;
  purpose: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestedAt: Date;
  respondedAt?: Date;
  response?: string;
  accessDuration?: number; // in days
  confidentialityLevel: 'public' | 'confidential' | 'restricted';
}

// Mock data
const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Corporate Governance Framework Template',
    description: 'Comprehensive template for establishing corporate governance policies and procedures.',
    type: 'template',
    category: 'Governance',
    tags: ['governance', 'compliance', 'template', 'corporate'],
    fileName: 'governance-framework.docx',
    fileSize: 2048000,
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    author: {
      id: 'u1',
      name: 'Sarah Johnson',
      organization: 'Legal Solutions Inc.'
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    downloads: 45,
    rating: 4.8,
    reviews: 12,
    isPublic: true,
    accessLevel: 'public',
    requestsCount: 8,
    status: 'active'
  },
  {
    id: '2',
    title: 'Financial Audit Checklist',
    description: 'Detailed checklist for conducting comprehensive financial audits.',
    type: 'document',
    category: 'Finance',
    tags: ['audit', 'finance', 'checklist', 'compliance'],
    fileName: 'audit-checklist.pdf',
    fileSize: 1024000,
    fileType: 'application/pdf',
    author: {
      id: 'u2',
      name: 'Michael Chen',
      organization: 'Audit Pro Services'
    },
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-05'),
    downloads: 32,
    rating: 4.6,
    reviews: 8,
    isPublic: false,
    accessLevel: 'restricted',
    requestsCount: 15,
    status: 'active'
  }
];

const mockRequests: ResourceRequest[] = [
  {
    id: 'r1',
    resourceId: '2',
    resource: mockResources[1],
    requester: {
      id: 'u3',
      name: 'Emma Wilson',
      organization: 'Wilson & Associates',
      email: 'emma@wilson-associates.com'
    },
    message: 'We need this checklist for our upcoming client audit. Would appreciate access for our audit team.',
    purpose: 'Client audit preparation',
    urgency: 'high',
    status: 'pending',
    requestedAt: new Date('2024-02-10'),
    confidentialityLevel: 'confidential'
  }
];

function ResourceSharingPooling() {
  return (
    <DashboardLayout>
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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isCreateResourceOpen, setIsCreateResourceOpen] = useState(false);
  const [isCreateRequestOpen, setIsCreateRequestOpen] = useState(false);
  const { toast } = useToast();

  const categories = ['all', 'Governance', 'Finance', 'Legal', 'HR', 'Operations', 'Technology'];
  const resourceTypes = ['all', 'document', 'template', 'guide', 'tool', 'dataset', 'media'];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document': return FileText;
      case 'template': return FileText;
      case 'guide': return FileText;
      case 'media': return Image;
      case 'tool': return Archive;
      case 'dataset': return Archive;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
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

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">My Resources</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <Share2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                <p className="text-2xl font-bold text-gray-900">234</p>
              </div>
              <Download className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">4.7</p>
              </div>
              <Star className="h-8 w-8 text-orange-600" />
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
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            </div>
            <Dialog open={isCreateResourceOpen} onOpenChange={setIsCreateResourceOpen}>
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
                    <Input placeholder="Enter resource title" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea placeholder="Describe your resource" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.slice(1).map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <Select>
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
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tags (comma separated)</label>
                    <Input placeholder="governance, template, compliance" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Access Level</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select access level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="restricted">Restricted</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400">PDF, DOC, XLS, PPT (max 10MB)</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateResourceOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => {
                      toast({ title: "Resource added successfully!" });
                      setIsCreateResourceOpen(false);
                    }}>
                      Add Resource
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => {
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
                        {resource.accessLevel === 'public' ? (
                          <Globe className="h-4 w-4 text-green-600" />
                        ) : resource.accessLevel === 'restricted' ? (
                          <Unlock className="h-4 w-4 text-yellow-600" />
                        ) : (
                          <Lock className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 line-clamp-2">{resource.description}</p>
                    
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {resource.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{resource.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {resource.downloads}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {resource.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Send className="h-3 w-3" />
                          {resource.requestsCount}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Available Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => {
              const FileIcon = getFileIcon(resource.type);
              return (
                <Card key={resource.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <FileIcon className="h-5 w-5 text-blue-600" />
                        <Badge variant="secondary">{resource.category}</Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        {resource.accessLevel === 'public' ? (
                          <Globe className="h-4 w-4 text-green-600" />
                        ) : (
                          <Lock className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 line-clamp-2">{resource.description}</p>
                    
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>By {resource.author.name}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current text-yellow-500" />
                        {resource.rating}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {resource.accessLevel === 'public' ? (
                        <Button size="sm" className="flex-1">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      ) : (
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
                      )}
                      <Button size="sm" variant="outline">
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
    </div>
  );
}

export default ResourceSharingPooling;
