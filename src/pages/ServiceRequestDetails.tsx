import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import ServiceRequestChat from "@/components/chat/ServiceRequestChat";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  User, 
  FileText, 
  DollarSign, 
  Clock, 
  Star, 
  MessageSquare, 
  Download, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Eye, 
  Edit, 
  MoreHorizontal,
  Filter,
  Search,
  ChevronDown,
  Users,
  UserPlus,
  Building,
  Phone,
  Mail,
  Globe,
  Award,
  TrendingUp,
  Target,
  Briefcase,
  Plus,
  Trash2,
  Upload,
  RefreshCw
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { serviceRequestService } from "@/services/serviceRequestService";
import { ServiceRequest, Bid, ServiceRequestStatus, BidStatus, PaymentStructure, QueryClarification } from "@/types/serviceRequest";
import { format as formatDate } from "date-fns";
import { ChatParticipantRole } from "@/types/chat";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";

// Types for negotiation and query management
interface QueryThread {
  id: string;
  bidId: string;
  bidderName: string;
  question: string;
  timestamp: Date;
  isPublic: boolean;
  responses: QueryResponse[];
}

interface QueryResponse {
  id: string;
  responderName: string;
  responderType: 'Service Seeker' | 'Service Provider';
  message: string;
  timestamp: Date;
}

interface NegotiationChatData {
  bidId: string;
  serviceRequestId: string;
  seekerName: string;
}

interface StructuredNegotiationInputs {
  timeline: { proposedDate: string; reason: string };
  information: { clarification: string; documents: string[] };
  documents: { type: string; purpose: string };
  pricing: { suggestedFee: string; justification: string };
  payment: { model: string; terms: string; reason: string };
}

interface UpdatedBidData {
  totalFee?: number;
  platformFee?: number;
  gst?: number;
  finalAmount?: number;
  deliveryDate?: string;
  methodology?: string;
  approach?: string;
}

// Safely format dates coming from mock services (may be string/undefined)
const safeFormatDate = (value: unknown, fmt: string) => {
  if (!value) return "-";
  const d = typeof value === "string" || typeof value === "number" ? new Date(value) : (value as Date);
  if (!(d instanceof Date) || isNaN(d.getTime())) return "-";
  return format(d, fmt);
};

type InvitedPro =
  | string
  | {
      name?: string;
      fullName?: string;
      rating?: number;
      location?: string;
      specialization?: string[];
    };

const ServiceRequestDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [selectedBidForChat, setSelectedBidForChat] = useState<string>('');
  const [initialChatMessage, setInitialChatMessage] = useState<string>('');
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedBids, setSelectedBids] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const [replyData, setReplyData] = useState<{
    responseId: string;
    parentQueryId: string;
    originalResponse: string;
    bidderName: string;
    bidId: string;
  } | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyType, setReplyType] = useState<'public' | 'private'>('public');
  const [showNegotiationDialog, setShowNegotiationDialog] = useState(false);
  const [negotiationType, setNegotiationType] = useState<'price' | 'timeline' | 'scope' | 'terms'>('price');
  const [negotiationMessage, setNegotiationMessage] = useState('');
  const [openChatAfterNegotiation, setOpenChatAfterNegotiation] = useState(false);
  const [selectedBidForNegotiation, setSelectedBidForNegotiation] = useState<string | null>(null);
  const [negotiationReasonDetail, setNegotiationReasonDetail] = useState<string>('');  
  const [showQueriesDialog, setShowQueriesDialog] = useState(false);
  const [queryMessage, setQueryMessage] = useState('');
  const [queryType, setQueryType] = useState<'public' | 'private'>('private');
  const [queryTargetBid, setQueryTargetBid] = useState<string>('');
  const [querySortOrder, setQuerySortOrder] = useState<'latest' | 'oldest'>('latest');
  const [showQueryListView, setShowQueryListView] = useState(false);
  const [selectedQueryThread, setSelectedQueryThread] = useState<string | null>(null);
  const [queryThreads, setQueryThreads] = useState<QueryThread[]>([]);
  const [showNegotiationChat, setShowNegotiationChat] = useState(false);
  const [negotiationChatData, setNegotiationChatData] = useState<NegotiationChatData | null>(null);
  const [aiModerationWarnings, setAiModerationWarnings] = useState<string[]>([]);
  const [violationCount, setViolationCount] = useState(0);
  const [isBannedFromNegotiation, setIsBannedFromNegotiation] = useState(false);
  const [structuredNegotiationInputs, setStructuredNegotiationInputs] = useState<StructuredNegotiationInputs>({
    timeline: { proposedDate: '', reason: '' },
    information: { clarification: '', documents: [] },
    documents: { type: '', purpose: '' },
    pricing: { suggestedFee: '', justification: '' },
    payment: { model: '', terms: '', reason: '' }
  });
  const [showBidUpdateDialog, setShowBidUpdateDialog] = useState(false);
  const [updatedBidData, setUpdatedBidData] = useState<UpdatedBidData>({});

  // Load query threads for a specific bid
  const loadQueryThreads = useCallback(async (bidId: string) => {
    try {
      // Mock query threads data
      const mockThreads = [
        {
          id: 'thread-1',
          bidId: bidId,
          bidderName: 'Bidder 1',
          question: 'Can you provide more details about the valuation methodology you plan to use?',
          timestamp: new Date('2024-01-16T10:30:00'),
          isPublic: false,
          responses: [
            {
              id: 'resp-1',
              responderName: 'Service Seeker',
              responderType: 'Service Seeker',
              message: 'We need DCF analysis with peer comparison. Please include sensitivity analysis.',
              timestamp: new Date('2024-01-16T11:00:00')
            },
            {
              id: 'resp-2',
              responderName: 'Bidder 1',
              responderType: 'Service Provider',
              message: 'Understood. I will include comprehensive DCF with 3 scenarios and detailed peer analysis.',
              timestamp: new Date('2024-01-16T11:15:00')
            }
          ]
        },
        {
          id: 'thread-2',
          bidId: bidId,
          bidderName: 'Service Seeker',
          question: 'What is your experience with similar merger valuations in the technology sector?',
          timestamp: new Date('2024-01-16T14:20:00'),
          isPublic: true,
          responses: [
            {
              id: 'resp-3',
              responderName: 'Bidder 1',
              responderType: 'Service Provider',
              message: 'I have completed 15+ tech merger valuations in the last 2 years, including 3 similar scale projects.',
              timestamp: new Date('2024-01-16T15:00:00')
            }
          ]
        }
      ];
      setQueryThreads(mockThreads);
    } catch (error) {
      console.error('Error loading query threads:', error);
      toast({
        title: "Error",
        description: "Failed to load query threads.",
        variant: "destructive"
      });
    }
  }, []);
  const [showStructuredNegotiation, setShowStructuredNegotiation] = useState(false);
  const [negotiationReason, setNegotiationReason] = useState<'timeline' | 'information' | 'documents' | 'pricing' | 'payment'>('timeline');
  const [negotiationData, setNegotiationData] = useState({
    timeline: { proposedDate: '', reason: '' },
    information: { clarification: '', documents: [] },
    documents: { type: '', purpose: '' },
    pricing: { suggestedFee: '', justification: '' },
    payment: { model: '', terms: '', reason: '' }
  });
  const [showBidActions, setShowBidActions] = useState<string>('');
  const [bidFormData, setBidFormData] = useState({
    professionalFee: '',
    deliveryTimeline: '',
    reimbursements: '',
    paymentStructure: 'milestone_based',
    methodology: '',
    deliverables: '',
    additionalInputs: '',
    teamComposition: '',
    milestones: [{ stage: 'Stage 1', amount: '', description: '' }, { stage: 'Stage 2', amount: '', description: '' }],
    platformFee: 0,
    gst: 0,
    totalAmount: 0
  });
  const [queriesByBid, setQueriesByBid] = useState<Record<string, QueryClarification[]>>({});
  const [chatBidId, setChatBidId] = useState<string>("");
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  
  // Mark Not Interested functionality
  const [showNotInterestedDialog, setShowNotInterestedDialog] = useState(false);
  const [notInterestedReason, setNotInterestedReason] = useState('');
  const [isMarkedNotInterested, setIsMarkedNotInterested] = useState(false);
  
  // Allocation update functionality
  const [showAllocationDialog, setShowAllocationDialog] = useState(false);
  const [allocationData, setAllocationData] = useState({
    currentAssignee: '',
    newAssignee: '',
    reason: ''
  });
  
  // Expired service request handling state
  const [showExpiredDialog, setShowExpiredDialog] = useState(false);
  const [expiredAction, setExpiredAction] = useState<'close' | 'extend' | 'rebid' | null>(null);
  const [extensionDays, setExtensionDays] = useState(7);
  const [extensionReason, setExtensionReason] = useState('');
  
  // Negotiation history state for expired requests
  const [showNegotiationHistory, setShowNegotiationHistory] = useState(false);
  const [selectedBidForHistory, setSelectedBidForHistory] = useState<Bid | null>(null);

    const fetchData = useCallback(async () => {
      try {
        setLoading(true);
        const [srData, bidsData] = await Promise.all([
          serviceRequestService.getServiceRequestById(id!),
          serviceRequestService.getBidsForServiceRequest(id!)
        ]);
        setServiceRequest(srData);
        setBids(bidsData);
        // Fetch queries per bid
        if (srData && bidsData.length) {
          const entries = await Promise.all(
            bidsData.map(async (b) => {
              const qs = await serviceRequestService.getQueriesForBid(srData.id, b.id);
              return [b.id, qs] as const;
            })
          );
          const map: Record<string, QueryClarification[]> = {};
          entries.forEach(([bidId, qs]) => { map[bidId] = qs; });
          setQueriesByBid(map);
        } else {
          setQueriesByBid({});
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load bid details.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }, [id]);
    useEffect(() => {
        if (id) {
          fetchData();
        }
      }, [id, fetchData]);
  // Check if user is a Service Seeker (can edit service requests)
  const isServiceSeeker = user?.role && [
    UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER,
    UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
    UserRole.SERVICE_SEEKER_TEAM_MEMBER
  ].includes(user.role);

  // Check if user is a Service Provider (can submit bids)
  const isServiceProvider = user?.role && [
    UserRole.SERVICE_PROVIDER_INDIVIDUAL_PARTNER,
    UserRole.SERVICE_PROVIDER_ENTITY_ADMIN,
    UserRole.SERVICE_PROVIDER_TEAM_MEMBER
  ].includes(user.role);

  // Check if user can update allocations (organization/entity admin only)
  const canUpdateAllocation = user?.role && [
    UserRole.SERVICE_PROVIDER_ENTITY_ADMIN,
    UserRole.SERVICE_SEEKER_ENTITY_ADMIN
  ].includes(user.role);

  // Check if user has already submitted a bid
  const userBid = bids.find(bid => bid.providerId === user?.id);
  const hasSubmittedBid = !!userBid;







 

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !replyData || !serviceRequest) return;

    try {
      await serviceRequestService.postReply(
        serviceRequest.id,
        replyData.parentQueryId,
        replyMessage.trim(),
        replyType === 'public'
      );
      const updated = await serviceRequestService.getQueriesForBid(serviceRequest.id, replyData.bidId);
      setQueriesByBid(prev => ({ ...prev, [replyData.bidId]: updated }));
      toast({
        title: "Reply Sent",
        description: `Your ${replyType} reply has been sent successfully.`,
      });
      setShowReplyDialog(false);
      setReplyMessage('');
      setReplyData(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reply.",
        variant: "destructive"
      });
    }
  };

  const getBidStatusColor = (status: BidStatus) => {
    switch (status) {
      case BidStatus.ACCEPTED:
        return "bg-green-100 text-green-800 border-green-200";
      case BidStatus.REJECTED:
        return "bg-red-100 text-red-800 border-red-200";
      case BidStatus.UNDER_REVIEW:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case BidStatus.SUBMITTED:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case BidStatus.DRAFT:
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getBidStatusIcon = (status: BidStatus) => {
    switch (status) {
      case BidStatus.ACCEPTED:
        return <CheckCircle className="h-3 w-3" />;
      case BidStatus.REJECTED:
        return <XCircle className="h-3 w-3" />;
      case BidStatus.UNDER_REVIEW:
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <AlertCircle className="h-3 w-3" />;
    }
  };

  const handleSelectBid = (bidId: string, checked: boolean) => {
    const newSelectedBids = new Set(selectedBids);
    if (checked) {
      newSelectedBids.add(bidId);
    } else {
      newSelectedBids.delete(bidId);
    }
    setSelectedBids(newSelectedBids);
    setShowBulkActions(newSelectedBids.size > 0);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allBidIds = new Set(bids.map(bid => bid.id));
      setSelectedBids(allBidIds);
      setShowBulkActions(true);
    } else {
      setSelectedBids(new Set());
      setShowBulkActions(false);
    }
  };

  const handleBulkAccept = async () => {
    try {
      const selectedBidIds = Array.from(selectedBids);
      await Promise.all(selectedBidIds.map(bidId => serviceRequestService.acceptBid(bidId)));
      toast({
        title: "Bids Accepted",
        description: `${selectedBidIds.length} bid(s) have been accepted successfully.`,
      });
      setSelectedBids(new Set());
      setShowBulkActions(false);
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept selected bids.",
        variant: "destructive"
      });
    }
  };

  const handleBulkReject = async () => {
    try {
      const selectedBidIds = Array.from(selectedBids);
      await Promise.all(selectedBidIds.map(bidId => serviceRequestService.rejectBid(bidId)));
      toast({
        title: "Bids Rejected",
        description: `${selectedBidIds.length} bid(s) have been rejected.`,
      });
      setSelectedBids(new Set());
      setShowBulkActions(false);
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject selected bids.",
        variant: "destructive"
      });
    }
  };

  const handleBulkRenegotiate = () => {
    if (selectedBids.size === 0) return;
    
    // For bulk negotiation, we'll use the first selected bid as the target
    // and apply the negotiation to all selected bids
    const firstBidId = Array.from(selectedBids)[0];
    setSelectedBidForNegotiation(firstBidId);
    setShowNegotiationDialog(true);
  };

  const handleSendNegotiation = async () => {
    if (!negotiationMessage.trim() || !selectedBidForNegotiation) return;

    try {
      // If we have selected bids (bulk operation), apply to all selected
      const bidsToNegotiate = selectedBids.size > 0 ? Array.from(selectedBids) : [selectedBidForNegotiation];
      
      await Promise.all(bidsToNegotiate.map(bidId => 
        serviceRequestService.updateBidStatus(bidId, BidStatus.UNDER_REVIEW)
      ));
      
      const count = bidsToNegotiate.length;
      toast({
        title: "Negotiation Request Sent",
        description: `Negotiation request sent to ${count} bid${count > 1 ? 's' : ''} successfully.`,
      });
      
      setShowNegotiationDialog(false);
      setNegotiationMessage('');
      setSelectedBidForNegotiation(null);
      
      // Clear bulk selection if it was a bulk operation
      if (selectedBids.size > 0) {
        setSelectedBids(new Set());
        setShowBulkActions(false);
      }
      
      if (openChatAfterNegotiation) {
        setSelectedBidForChat(selectedBidForNegotiation);
        setInitialChatMessage(
          `Hi, we have initiated negotiation on your bid regarding ${negotiationType}. ${negotiationMessage}`
        );
        setShowChat(true);
      }
      
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send negotiation request.",
        variant: "destructive"
      });
    }
  };

  const handleAcceptBidWithWorkOrder = async (bidId: string) => {
    try {
      toast({
        title: "Redirecting",
        description: "Taking you to bid summary & payment...",
      });
      navigate(`/service-requests/${id}/bid-summary?bidId=${bidId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to navigate to bid summary.",
        variant: "destructive"
      });
    }
  };

  const handleRejectBid = async (bidId: string) => {
    try {
      await serviceRequestService.rejectBid(bidId);
      toast({
        title: "Bid Rejected",
        description: "The bid has been rejected.",
      });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject bid.",
        variant: "destructive"
      });
    }
  };

  const handleNegotiateBid = (bidId: string) => {
    setSelectedBidForNegotiation(bidId);
    setShowNegotiationDialog(true);
  };

  // Handle expired service request actions
  const handleExpiredAction = async () => {
    if (!expiredAction || !serviceRequest) return;

    try {
      switch (expiredAction) {
        case 'close':
          await serviceRequestService.acceptAndCloseExpiredRequest(serviceRequest.id);
          toast({
            title: "Request Closed",
            description: "The expired service request has been closed successfully.",
          });
          break;
        case 'extend':
          if (!extensionReason.trim()) {
            toast({
              title: "Error",
              description: "Please provide a reason for the extension.",
              variant: "destructive"
            });
            return;
          }
          await serviceRequestService.requestExtension(serviceRequest.id, extensionDays, extensionReason);
          toast({
            title: "Extension Requested",
            description: `Service request deadline extended by ${extensionDays} days.`,
          });
          break;
        case 'rebid':
          await serviceRequestService.initiateBiddingRound(serviceRequest.id);
          toast({
            title: "New Bidding Round Started",
            description: "A new bidding round has been initiated for this service request.",
          });
          break;
      }
      
      setShowExpiredDialog(false);
      setExpiredAction(null);
      setExtensionReason('');
      fetchData(); // Refresh the data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process the request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const openExpiredDialog = (action: 'close' | 'extend' | 'rebid') => {
    setExpiredAction(action);
    setShowExpiredDialog(true);
  };

  // removed obsolete Ask Dialog handler; queries are posted via the Queries Dialog

  const handleReplyToResponse = (responseId: string, originalResponse: string, bidderName: string = "Bidder") => {
    setReplyData({
      responseId,
      parentQueryId: '', // This would be set based on the actual query structure
      originalResponse,
      bidderName,
      bidId: '' // This would be set based on the actual bid structure
    });
    setReplyMessage('');
    setReplyType('public');
    setShowReplyDialog(true);
  };

  // Handle Mark Not Interested functionality
  const handleMarkNotInterested = async () => {
    if (!notInterestedReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for marking as not interested.",
        variant: "destructive"
      });
      return;
    }

    try {
      await serviceRequestService.markNotInterested(serviceRequest!.id, notInterestedReason);
      setIsMarkedNotInterested(true);
      toast({
        title: "Marked as Not Interested",
        description: "You can reverse this decision anytime from the opportunities list.",
      });
      setShowNotInterestedDialog(false);
      setNotInterestedReason('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark as not interested.",
        variant: "destructive"
      });
    }
  };

  // Handle allocation update
  const handleUpdateAllocation = async () => {
    if (!allocationData.newAssignee.trim() || !allocationData.reason.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      await serviceRequestService.updateAllocation(serviceRequest!.id, allocationData);
      toast({
        title: "Allocation Updated",
        description: "The assignee has been updated successfully.",
      });
      setShowAllocationDialog(false);
      setAllocationData({ currentAssignee: '', newAssignee: '', reason: '' });
      fetchData(); // Refresh data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update allocation.",
        variant: "destructive"
      });
    }
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-green-100 text-green-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-purple-100 text-purple-800';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Check if service request is expired
  const isExpired = serviceRequest?.status === ServiceRequestStatus.EXPIRED;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-6 space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!serviceRequest) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Service Request Not Found
            </h3>
            <p className="text-gray-600 mb-4">
              The service request you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/service-requests">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Service Requests
              </Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/service-requests">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{serviceRequest.title}</h1>
              <p className="text-gray-600">{serviceRequest.srnNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(serviceRequest.status)}>
              {serviceRequest.status}
            </Badge>
            {isServiceSeeker && (
              <>
                <Link to={`/service-requests/${id}/invite-professionals`}>
                  <Button variant="default">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Professionals
                  </Button>
                </Link>
                <Link to={`/service-requests/${id}/edit`}>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
              </>
            )}
            {isServiceProvider && (
              <div className="flex items-center gap-3">
                {hasSubmittedBid ? (
                  <Link to={`/bids/${userBid.id}`}>
                    <Button variant="default">
                      <Eye className="h-4 w-4 mr-2" />
                      View Bid
                    </Button>
                  </Link>
                ) : (
                  !isMarkedNotInterested && (
                    <Button 
                      onClick={() => setActiveTab('bids')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Submit Bid
                    </Button>
                  )
                )}
                {!hasSubmittedBid && (
                  <Button 
                    variant="outline"
                    onClick={() => setShowNotInterestedDialog(true)}
                    className={isMarkedNotInterested ? "border-green-500 text-green-700" : "border-red-300 text-red-700"}
                  >
                    {isMarkedNotInterested ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marked Not Interested
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 mr-2" />
                        Mark Not Interested
                      </>
                    )}
                  </Button>
                )}
                {canUpdateAllocation && serviceRequest?.currentAssignee && (
                  <Button 
                    variant="outline"
                    onClick={() => setShowAllocationDialog(true)}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Update Allocation
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className={`grid w-full ${isServiceProvider ? 'grid-cols-4' : 'grid-cols-5'}`}>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                {!isServiceProvider && <TabsTrigger value="invitations">Invitations</TabsTrigger>}
                <TabsTrigger value="bids">{isServiceProvider ? 'Submit Bid' : `Bids (${bids.length})`}</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Service Request Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-600">{serviceRequest.description}</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Work Required By</h4>
                        <p className="text-gray-600">{serviceRequest.workRequiredBy ? safeFormatDate(serviceRequest.workRequiredBy, 'PPP') : 'Not specified'}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Professional Type</h4>
                        <p className="text-gray-600">{serviceRequest.serviceCategory.join(', ')}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Budget Range</h4>
                        <p className="text-gray-600">
                          {serviceRequest.budgetRange ? (
                            `₹${serviceRequest.budgetRange.min.toLocaleString()} - ₹${serviceRequest.budgetRange.max.toLocaleString()}`
                          ) : (
                            serviceRequest.budgetNotClear ? 'Budget not clear' : 'Not specified'
                          )}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Preferred Locations</h4>
                        <div className="flex flex-wrap gap-2">
                          {serviceRequest.preferredLocations && serviceRequest.preferredLocations.length > 0 ? (
                            serviceRequest.preferredLocations.map((loc, index) => (
                              <Badge key={index} variant="outline">{loc}</Badge>
                            ))
                          ) : (
                            <span className="text-gray-500">No location preference</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Service Provider specific fields */}
                    {isServiceProvider && (
                      <>
                        <Separator />
                        
                        {/* About Buyer Section */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">About Buyer</h4>
                          <div className="bg-blue-50 p-4 rounded border border-blue-200">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-gray-700">Organization:</p>
                                <p className="text-gray-900">{serviceRequest.clientProfile?.organizationName || 'Individual Client'}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">Industry:</p>
                                <p className="text-gray-900">{serviceRequest.clientProfile?.industry || 'Not specified'}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">Location:</p>
                                <p className="text-gray-900">{serviceRequest.clientProfile?.location || 'Not specified'}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">Company Size:</p>
                                <p className="text-gray-900">{serviceRequest.clientProfile?.companySize || 'Not specified'}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Current Assignee and Allocation */}
                        {serviceRequest.currentAssignee && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-gray-900">Current Assignee Details</h4>
                                {canUpdateAllocation && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setShowAllocationDialog(true)}
                                  >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Update
                                  </Button>
                                )}
                              </div>
                              <div className="bg-gray-50 p-3 rounded">
                                <p className="font-medium text-gray-900">{serviceRequest.currentAssignee.name}</p>
                                <p className="text-sm text-gray-600">{serviceRequest.currentAssignee.role}</p>
                                <p className="text-xs text-gray-500 mt-1">Assigned: {safeFormatDate(serviceRequest.currentAssignee.assignedAt, 'PPP')}</p>
                              </div>
                            </div>
                            {serviceRequest.lastEditedBy && (
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Last Edited By Service Seeker</h4>
                                <div className="bg-gray-50 p-3 rounded">
                                  <p className="font-medium text-gray-900">{serviceRequest.lastEditedBy.userName}</p>
                                  <p className="text-sm text-gray-600">{safeFormatDate(serviceRequest.lastEditedBy.timestamp, 'PPpp')}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Preferred Location */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Preferred Location <span className="text-sm text-gray-500 font-normal">(Not mandatory)</span></h4>
                          <div className="bg-gray-50 p-3 rounded">
                            {serviceRequest.preferredLocations && serviceRequest.preferredLocations.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {serviceRequest.preferredLocations.map((loc, index) => (
                                  <Badge key={index} variant="outline" className="bg-blue-50">{loc}</Badge>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-600 italic">No specific location preference</p>
                            )}
                          </div>
                        </div>

                        {/* Additional Information from Client */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Additional Information from Client</h4>
                          <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                            <p className="text-gray-700">
                              {serviceRequest.additionalInformation || 'No additional information provided by the client.'}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="requirements" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Requirements & Qualifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Scope of Work</h4>
                        <p className="text-gray-600">{serviceRequest.scopeOfWork}</p>
                      </div>
                      
                      {serviceRequest.questionnaire && serviceRequest.questionnaire.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
                          <ul className="space-y-2">
                            {serviceRequest.questionnaire.map((q, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                                <div>
                                  <p className="font-medium text-gray-800">{q.question}</p>
                                  {q.answer && <p className="text-gray-600 mt-1">{q.answer}</p>}
                                </div>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}

                    {/* Additional Information for Service Providers */}
                    {isServiceProvider && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Additional Information</h4>
                        <div className="bg-blue-50 p-3 rounded border border-blue-200">
                          <p className="text-sm text-blue-800">
                            Any additional information shared by the client will be displayed here. This may include specific requirements, preferences, or clarifications that are important for understanding the project scope.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Stage Details - Non-mandatory */}
                    {isServiceProvider && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Stage Details <span className="text-sm text-gray-500 font-normal">(Non-mandatory)</span></h4>
                        <div className="bg-blue-50 p-4 rounded border border-blue-200">
                          <p className="text-sm text-blue-800 mb-3">
                            These are suggested project stages. You can customize them based on your methodology and approach.
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                              { name: 'Requirement Gathering', description: 'Initial consultation and requirement analysis' },
                              { name: 'Case Analysis', description: 'Detailed case study and research' },
                              { name: 'First Draft', description: 'Preliminary documentation and review' },
                              { name: 'Final Draft', description: 'Final deliverable preparation' }
                            ].map((stage, index) => (
                              <div key={index} className="bg-white p-3 rounded border border-blue-200 text-center">
                                <p className="text-sm font-medium text-gray-900">{stage.name}</p>
                                <p className="text-xs text-gray-500 mt-1">Stage {index + 1}</p>
                                <p className="text-xs text-gray-600 mt-2">{stage.description}</p>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 text-xs text-blue-700">
                            <strong>Note:</strong> You can propose your own stage breakdown in your bid submission.
                          </div>
                        </div>
                      </div>
                    )}

                    {serviceRequest.questionnaire && serviceRequest.questionnaire.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Service Questionnaire</h4>
                        <div className="space-y-4">
                          {serviceRequest.questionnaire.map((item, index) => (
                            <div key={item.id || index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                              <div className="flex items-start space-x-2">
                                <span className="flex-shrink-0 bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium">
                                  Q{index + 1}
                                </span>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900 mb-2">
                                    {item.question}
                                    {item.isRequired && <span className="text-red-500 ml-1">*</span>}
                                  </p>
                                  {item.isSkipped ? (
                                    <p className="text-gray-500 italic">Question was skipped</p>
                                  ) : item.answer ? (
                                    <div className="bg-white border border-gray-200 rounded p-3">
                                      <p className="text-gray-800">{item.answer}</p>
                                    </div>
                                  ) : (
                                    <p className="text-gray-500 italic">No answer provided</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="invitations" className="mt-6">
                {(() => {
                  const invitation = (serviceRequest as unknown as {
                    professionalInvitation?: {
                      customInvitationMessage?: string;
                      chosenProfessionalEmails?: string[];
                      chosenProfessionalPhones?: string[];
                    };
                    invitationMessage?: string;
                    invitedProfessionals?: InvitedPro[];
                  });
                  const chosenEmails = invitation.professionalInvitation?.chosenProfessionalEmails ?? [];
                  const chosenPhones = invitation.professionalInvitation?.chosenProfessionalPhones ?? [];
                  const customMsg = invitation.professionalInvitation?.customInvitationMessage || invitation.invitationMessage;
                  const invitedList: InvitedPro[] = invitation.invitedProfessionals ?? (serviceRequest.invitedProfessionals as unknown as InvitedPro[]);
                  return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Invitations</h2>
                    {isServiceSeeker && (
                      <Link to={`/service-requests/${id}/invite-professionals`}>
                        <Button size="sm">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Invite / Manage
                        </Button>
                      </Link>
                    )}
                  </div>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Final Invitation List</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {invitedList && invitedList.length > 0 ? (
                        <div className="space-y-2">
                          {invitedList.map((pro: InvitedPro, idx: number) => (
                            <div key={idx} className="flex items-start justify-between p-3 bg-gray-50 rounded-md">
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium">{typeof pro === 'string' ? pro : (pro.name || pro.fullName || `Professional ${idx+1}`)}</p>
                                  {typeof pro !== 'string' && pro.rating !== undefined && (
                                    <div className="flex items-center space-x-1 text-yellow-500">
                                      <Star className="h-3 w-3 fill-current" />
                                      <span className="text-xs text-gray-700">{pro.rating}</span>
                                    </div>
                                  )}
                                </div>
                                {typeof pro !== 'string' && (
                                  <>
                                    {pro.location && <p className="text-xs text-gray-500">{pro.location}</p>}
                                    {Array.isArray(pro.specialization) && pro.specialization.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {pro.specialization.slice(0,2).map((s: string, i: number) => (
                                          <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                                        ))}
                                        {pro.specialization.length > 2 && (
                                          <Badge variant="outline" className="text-xs">+{pro.specialization.length - 2} more</Badge>
                                        )}
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 italic">No professionals invited yet</span>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Custom Invitation Message</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {customMsg ? (
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{customMsg}</p>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 italic">No custom message</span>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Chosen Contacts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Emails</Label>
                          {chosenEmails.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mt-1">
                              {chosenEmails.map((email: string, i: number) => (
                                <Badge key={i} variant="outline" className="bg-blue-50">{email}</Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500 italic">None</span>
                          )}
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Phones</Label>
                          {chosenPhones.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mt-1">
                              {chosenPhones.map((phone: string, i: number) => (
                                <Badge key={i} variant="outline" className="bg-green-50">{phone}</Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500 italic">None</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                  );
                })()}
              </TabsContent>

              

              <TabsContent value="bids" className="mt-6">
                {/* Missed Opportunity Banner for Service Providers */}
                {isServiceProvider && serviceRequest.missedReason && (
                  <Card className="mb-6 border-orange-200 bg-orange-50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-medium text-orange-900 mb-1">
                            Missed Opportunity
                          </h3>
                          <p className="text-orange-800 text-sm mb-3">
                            {serviceRequest.missedReason === 'awarded_to_another' && 'This opportunity was awarded to another bidder.'}
                            {serviceRequest.missedReason === 'submission_time_passed' && 'The bid submission deadline has passed.'}
                            {serviceRequest.missedReason === 'marked_not_interested' && 'You marked this opportunity as not interested.'}
                            {serviceRequest.missedReason === 'won_but_no_work_order' && 'You won this bid but the client failed to create a work order.'}
                          </p>
                          {serviceRequest.missedReason === 'awarded_to_another' && serviceRequest.winningBidAmount && (
                            <div className="bg-white p-3 rounded border border-orange-200">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">Winning Bid Amount:</span>
                                <span className="text-sm font-bold text-green-600">₹{(serviceRequest.winningBidAmount ?? 0).toLocaleString()}</span>
                              </div>
                              {serviceRequest.awardedDate && (
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium text-gray-700">Awarded Date:</span>
                                  <span className="text-sm text-gray-600">{safeFormatDate(serviceRequest.awardedDate, 'PPP')}</span>
                                </div>
                              )}
                              {/* Show bid comparison if user submitted a bid */}
                              {bids.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-orange-100">
                                  <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-gray-700">Your Bid Amount:</span>
                                    <span className="text-2xl font-bold text-gray-900">₹{((bids[0]?.financials?.totalBidAmount) ?? 0).toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between items-center text-sm mt-1">
                                    <span className="font-medium text-gray-700">Difference:</span>
                                    <span className={`font-bold ${
                                      bids[0].financials.totalBidAmount > serviceRequest.winningBidAmount 
                                        ? 'text-red-600' 
                                        : 'text-green-600'
                                    }`}>
                                      {bids[0].financials.totalBidAmount > serviceRequest.winningBidAmount ? '+' : '-'}
                                      ₹{Math.abs((bids[0].financials.totalBidAmount ?? 0) - (serviceRequest.winningBidAmount ?? 0)).toLocaleString()}
                                    </span>
                                  </div>
                                  {bids[0].financials.totalBidAmount > serviceRequest.winningBidAmount && (
                                    <p className="text-xs text-red-600 mt-2">
                                      Your bid was ₹{((bids[0].financials.totalBidAmount ?? 0) - (serviceRequest.winningBidAmount ?? 0)).toLocaleString()} higher than the winning bid.
                                    </p>
                                  )}
                                  {bids[0].financials.totalBidAmount < serviceRequest.winningBidAmount && (
                                    <p className="text-xs text-green-600 mt-2">
                                      Your bid was ₹{((serviceRequest.winningBidAmount ?? 0) - (bids[0].financials.totalBidAmount ?? 0)).toLocaleString()} lower than the winning bid.
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Expired Service Request Banner */}
                {isExpired && isServiceSeeker && (
                  <Card className="mb-6 border-red-200 bg-red-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <AlertCircle className="h-5 w-5 text-red-600" />
                          <div>
                            <h3 className="font-semibold text-red-900">Service Request Expired</h3>
                            <p className="text-sm text-red-700">
                              This service request has expired. Choose an action to proceed.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openExpiredDialog('close')}
                            className="border-red-300 text-red-700 hover:bg-red-100"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Accept & Close
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openExpiredDialog('extend')}
                            className="border-orange-300 text-orange-700 hover:bg-orange-100"
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            Request Extension
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => openExpiredDialog('rebid')}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            New Bidding Round
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {isServiceProvider ? (
                  /* Service Provider Bid Submission Form */
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900">Submit Your Bid</h2>
                      <Badge className="bg-blue-100 text-blue-800">
                        Opportunity Available
                      </Badge>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Bid Submission Form</CardTitle>
                        <p className="text-sm text-gray-600">
                          Please provide your detailed bid for this service request. All fields marked with * are required.
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Financial Bids: Fixed Price */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900">Financial Bids: Fixed Price</h3>
                          
                          {/* Professional Fee */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="professionalFee">Professional Fee (₹) *</Label>
                              <Input id="professionalFee" type="number" placeholder="Enter your professional fee" />
                            </div>
                            <div>
                              <Label htmlFor="deliveryTimeline">Delivery Timeline (days) *</Label>
                              <Input id="deliveryTimeline" type="number" placeholder="Number of days" />
                            </div>
                          </div>

                          {/* Platform Fee & GST */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="platformFee">Platform Fee (₹)</Label>
                              <Input id="platformFee" type="number" placeholder="Platform fee (auto-calculated)" readOnly className="bg-gray-50" />
                            </div>
                            <div>
                              <Label htmlFor="gst">GST (₹)</Label>
                              <Input id="gst" type="number" placeholder="GST amount (auto-calculated)" readOnly className="bg-gray-50" />
                            </div>
                          </div>

                          {/* Reimbursements */}
                          <div className="space-y-3">
                            <h4 className="text-md font-medium text-gray-800">Reimbursements</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="regulatoryPayouts">Regulatory/Statutory Payouts (₹)</Label>
                                <Input id="regulatoryPayouts" type="number" placeholder="Enter regulatory payouts" />
                              </div>
                              <div>
                                <Label htmlFor="opeProfessionalTeam">OPE of the Professional/Team (₹)</Label>
                                <Input id="opeProfessionalTeam" type="number" placeholder="Enter OPE amount" />
                              </div>
                            </div>
                          </div>

                          {/* Total Bid Amount */}
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-semibold text-blue-900">Total Bid Amount</span>
                              <span className="text-2xl font-bold text-blue-900">₹0</span>
                            </div>
                          </div>

                          {/* Payment Structure */}
                          <div>
                            <Label htmlFor="paymentStructure">Payment Structure *</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select payment structure" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="milestone_based">Milestone Based</SelectItem>
                                <SelectItem value="lump_sum">Lump Sum</SelectItem>
                                <SelectItem value="monthly_retainer">Monthly Retainer</SelectItem>
                                <SelectItem value="usage_based">Usage Based</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <Separator />

                        {/* Bids Divided based on Milestone */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Bids Divided based on Milestone</h3>
                            <Button type="button" variant="outline" size="sm">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Milestone
                            </Button>
                          </div>
                          
                          {/* Milestone 1 - Default */}
                          <Card className="border border-gray-200">
                            <CardContent className="p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-800">Milestone 1</h4>
                                <Button type="button" variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="milestone1Label">Stage Label *</Label>
                                  <Input id="milestone1Label" placeholder="e.g., Initial Documentation" />
                                </div>
                                <div>
                                  <Label htmlFor="milestone1Amount">Payment Amount (₹) *</Label>
                                  <Input id="milestone1Amount" type="number" placeholder="Enter payment amount" />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="milestone1Description">Description</Label>
                                <Textarea id="milestone1Description" rows={2} placeholder="Describe what will be delivered in this milestone..." />
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <Separator />

                        {/* Approach & Methodology */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900">Approach & Methodology</h3>
                          <div>
                            <Label htmlFor="methodology">Detailed Methodology *</Label>
                            <Textarea 
                              id="methodology" 
                              rows={4}
                              placeholder="Describe your approach, methodology, and how you plan to execute this project..."
                            />
                          </div>
                          <div>
                            <Label htmlFor="deliverables">Key Deliverables *</Label>
                            <Textarea 
                              id="deliverables" 
                              rows={3}
                              placeholder="List the key deliverables you will provide..."
                            />
                          </div>
                        </div>

                        <Separator />

                        {/* Additional inputs required from client */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Additional inputs required from client</h3>
                            <Button type="button" variant="outline" size="sm">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Input Requirement
                            </Button>
                          </div>
                          
                          {/* Default Additional Input */}
                          <Card className="border border-gray-200">
                            <CardContent className="p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-800">Client Input Requirement 1</h4>
                                <Button type="button" variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              {/* Text box description */}
                              <div>
                                <Label htmlFor="clientInput1Description">Description *</Label>
                                <Textarea 
                                  id="clientInput1Description" 
                                  rows={3}
                                  placeholder="Describe what additional information or documents you need from the client..."
                                />
                              </div>
                              
                              {/* Document upload option */}
                              <div className="space-y-2">
                                <Label htmlFor="clientInput1DocLabel">Document Label</Label>
                                <Input 
                                  id="clientInput1DocLabel" 
                                  placeholder="e.g., Financial Statements, Board Resolutions, etc."
                                />
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <Upload className="h-4 w-4" />
                                  <span>Client will be able to upload documents for this requirement</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <Separator />

                        {/* Additional Information */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                          <div>
                            <Label htmlFor="additionalInputs">Additional Inputs</Label>
                            <Textarea 
                              id="additionalInputs" 
                              rows={3}
                              placeholder="Any additional information, special considerations, or value-adds you want to highlight..."
                            />
                          </div>
                          <div>
                            <Label htmlFor="teamComposition">Team Composition</Label>
                            <Textarea 
                              id="teamComposition" 
                              rows={2}
                              placeholder="Describe your team members who will work on this project..."
                            />
                          </div>
                        </div>

                        <Separator />

                        {/* Terms & Conditions */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900">Terms & Conditions</h3>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="terms1" />
                              <Label htmlFor="terms1" className="text-sm">
                                I confirm that I have the necessary expertise and resources to complete this project
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="terms2" />
                              <Label htmlFor="terms2" className="text-sm">
                                I agree to the platform's terms and conditions for service providers
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="terms3" />
                              <Label htmlFor="terms3" className="text-sm">
                                I understand that this bid is binding and I commit to the proposed timeline and deliverables
                              </Label>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-4">
                          <Button variant="outline">
                            Save as Draft
                          </Button>
                          <div className="flex space-x-3">
                            <Button variant="outline">
                              Preview Bid
                            </Button>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                              Submit Bid
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  /* Service Seeker Bid Management View */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900">Received Bids ({bids.length})</h2>
                      <div className="text-sm text-gray-600">
                        {bids.filter(bid => bid.status === BidStatus.SUBMITTED || bid.status === BidStatus.UNDER_REVIEW).length} Active Bids
                      </div>
                    </div>

                  {/* Bulk Action UI */}
                  {showBulkActions && (
                    <Card className="border-blue-200 bg-blue-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                            <span className="font-medium text-blue-900">
                              {selectedBids.size} bid(s) selected
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={handleBulkAccept}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Accept Selected
                            </Button>
                            <Button
                              onClick={handleBulkReject}
                              size="sm"
                              variant="destructive"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject Selected
                            </Button>
                            <Button
                              onClick={handleBulkRenegotiate}
                              size="sm"
                              variant="outline"
                              className="border-orange-300 text-orange-700 hover:bg-orange-50"
                            >
                              <AlertCircle className="h-4 w-4 mr-2" />
                              Renegotiate Selected
                            </Button>
                            <Button
                              onClick={() => {
                                setSelectedBids(new Set());
                                setShowBulkActions(false);
                              }}
                              size="sm"
                              variant="ghost"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {bids.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No bids received yet for this service request.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="border-gray-200 shadow-sm">
                      <CardContent className="p-0">
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            {/* Header with Bidder Information */}
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left p-4 font-medium text-gray-900 min-w-[200px] bg-gray-50 border-r border-gray-200">
                                  <div className="bg-green-500 text-white text-center py-2 px-3 rounded font-semibold text-sm">
                                    No Bids Received/Bids Received
                                  </div>
                                </th>
                                <th className="text-center p-4 min-w-[80px] bg-gray-50 border-r border-gray-200">
                                  <div className="space-y-2">
                                    <div className="font-semibold text-gray-900 text-sm">Select</div>
                                    <Checkbox
                                      checked={selectedBids.size === bids.length && bids.length > 0}
                                      onCheckedChange={handleSelectAll}
                                      className="mx-auto"
                                    />
                                    <div className="text-xs text-gray-600">All</div>
                                  </div>
                                </th>
                                {bids.map((bid, index) => (
                                  <th key={bid.id} className="text-center p-4 min-w-[180px] bg-gray-50 border-r border-gray-200 last:border-r-0">
                                    <div className="space-y-2">
                                      <div className="font-semibold text-gray-900 text-sm">Bidder {index + 1}</div>
                                      <div className="font-medium text-gray-800">
                                        {bid.isInvited && <Star className="h-3 w-3 text-yellow-500 fill-current inline mr-1" />}
                                        Bid #{bid.bidNumber.slice(-3)}
                                      </div>
                                      <div className="flex items-center justify-center space-x-1 text-xs text-gray-600">
                                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                        <span>{bid.providerProfile.rating}</span>
                                        <span className="text-gray-400">|</span>
                                        <span>{bid.providerProfile.completedProjects} projects</span>
                                      </div>
                                      <div className="text-xs text-gray-600 flex items-center justify-center">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        {bid.providerProfile.location}
                                      </div>
                                      <Badge className={`${getBidStatusColor(bid.status)} text-xs px-2 py-1 border`}>
                                        {getBidStatusIcon(bid.status)}
                                        <span className="ml-1">
                                          {bid.status === BidStatus.UNDER_REVIEW ? 'UNDER REVIEW' : bid.status.replace('_', ' ').toUpperCase()}
                                        </span>
                                      </Badge>
                                      <div className="text-xs text-gray-500 mt-1">
                                        {bid.status === BidStatus.UNDER_REVIEW && "Bid being evaluated"}
                                      </div>
                                      <Checkbox
                                        checked={selectedBids.has(bid.id)}
                                        onCheckedChange={(checked) => handleSelectBid(bid.id, checked as boolean)}
                                        className="mx-auto mt-2"
                                      />
                                    </div>
                                  </th>
                                ))}
                              </tr>
                            </thead>

                            <tbody>
                              {/* Financial Bids Header */}
                              <tr className="bg-green-500">
                                <td colSpan={bids.length + 2} className="p-3 text-center font-semibold text-white">
                                  Financial Bids
                                </td>
                              </tr>
                              
                              {/* Professional Fee */}
                              <tr className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-3 font-medium text-gray-900 bg-gray-50 border-r border-gray-200">Professional Fee</td>
                                <td className="p-3 bg-gray-50 border-r border-gray-200"></td>
                                {bids.map((bid, index) => (
                                  <td key={`professional-fee-${bid.id}-${index}`} className="p-3 text-center font-semibold text-gray-900 border-r border-gray-200 last:border-r-0">
                                    ₹{(bid.financials.professionalFee ?? 0).toLocaleString()}
                                  </td>
                                ))}
                              </tr>

                              {/* Platform Fee */}
                              <tr className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-3 font-medium text-gray-900 bg-gray-50 border-r border-gray-200">Platform's Fee</td>
                                <td className="p-3 bg-gray-50 border-r border-gray-200"></td>
                                {bids.map((bid, index) => (
                                  <td key={`platform-fee-${bid.id}-${index}`} className="p-3 text-center text-gray-900 border-r border-gray-200 last:border-r-0">
                                    ₹{(bid.financials.platformFee ?? 0).toLocaleString()}
                                  </td>
                                ))}
                              </tr>

                              {/* GST */}
                              <tr className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-3 font-medium text-gray-900 bg-gray-50 border-r border-gray-200">GST on above</td>
                                <td className="p-3 bg-gray-50 border-r border-gray-200"></td>
                                {bids.map((bid, index) => (
                                  <td key={`gst-${bid.id}-${index}`} className="p-3 text-center text-gray-900 border-r border-gray-200 last:border-r-0">
                                    ₹{(bid.financials.gst ?? 0).toLocaleString()}
                                  </td>
                                ))}
                              </tr>

                              {/* Reimbursements (sum of components) */}
                              <tr className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-3 font-medium text-gray-900 bg-gray-50 border-r border-gray-200">Reimbursements</td>
                                <td className="p-3 bg-gray-50 border-r border-gray-200"></td>
                                {bids.map((bid, index) => (
                                  <td key={`reimbursements-${bid.id}-${index}`} className="p-3 text-center text-gray-900 border-r border-gray-200 last:border-r-0">
                                    ₹{(((bid.financials.reimbursements?.regulatoryStatutoryPayouts ?? 0) + (bid.financials.reimbursements?.opeProfessionalTeam ?? 0)) as number).toLocaleString()}
                                  </td>
                                ))}
                              </tr>

                              {/* Regulatory/Statutory Payouts */}
                              <tr className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-3 font-medium text-gray-900 bg-gray-50 border-r border-gray-200">- Regulatory/Statutory Payouts</td>
                                <td className="p-3 bg-gray-50 border-r border-gray-200"></td>
                                {bids.map((bid, index) => (
                                  <td key={`regulatory-payouts-${bid.id}-${index}`} className="p-3 text-center text-gray-900 border-r border-gray-200 last:border-r-0">
                                    ₹{(bid.financials.reimbursements?.regulatoryStatutoryPayouts ?? 0).toLocaleString()}
                                  </td>
                                ))}
                              </tr>

                              {/* OPE */}
                              <tr className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-3 font-medium text-gray-900 bg-gray-50 border-r border-gray-200">- OPE of the Professional Team</td>
                                <td className="p-3 bg-gray-50 border-r border-gray-200"></td>
                                {bids.map((bid, index) => (
                                  <td key={`ope-${bid.id}-${index}`} className="p-3 text-center text-gray-900 border-r border-gray-200 last:border-r-0">
                                    ₹{(bid.financials.reimbursements?.opeProfessionalTeam ?? 0).toLocaleString()}
                                  </td>
                                ))}
                              </tr>

                              {/* Total Bid Amount */}
                              <tr className="border-b border-gray-200 bg-yellow-100 font-semibold">
                                <td className="p-3 font-bold text-gray-900 bg-yellow-200 border-r border-gray-200">TOTAL BID AMOUNT</td>
                                <td className="p-3 bg-yellow-200 border-r border-gray-200"></td>
                                {bids.map((bid, index) => (
                                  <td key={`total-${bid.id}-${index}`} className="p-3 text-center font-bold text-green-700 border-r border-gray-200 last:border-r-0 bg-yellow-100">
                                    ₹{(bid.financials.totalBidAmount ?? 0).toLocaleString()}
                                  </td>
                                ))}
                              </tr>

                              {/* Payment Structure */}
                              <tr className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-3 font-medium text-gray-900 bg-gray-50 border-r border-gray-200">Payment %/ Amount</td>
                                <td className="p-3 bg-gray-50 border-r border-gray-200"></td>
                                {bids.map((bid, index) => (
                                  <td key={`additional-inputs-${bid.id}-${index}`} className="p-3 text-center text-gray-900 border-r border-gray-200 last:border-r-0">
                                    <div className="text-sm">
                                      {bid.additionalInputs || 'N/A'}
                                    </div>
                                  </td>
                                ))}
                              </tr>

                              {/* Stage 1 */}
                              <tr className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-3 font-medium text-gray-900 bg-gray-50 border-r border-gray-200">Stage 1</td>
                                <td className="p-3 bg-gray-50 border-r border-gray-200"></td>
                                {bids.map((bid, index) => (
                                  <td key={`stage1-${bid.id}-${index}`} className="p-3 text-center text-gray-900 border-r border-gray-200 last:border-r-0">
                                    {bid.financials.milestones && bid.financials.milestones[0] &&
                                     typeof bid.financials.milestones[0].paymentAmount === 'number' ? (
                                      `₹${(bid.financials.milestones[0].paymentAmount ?? 0).toLocaleString()}`
                                    ) : (
                                      '-'
                                    )}
                                  </td>
                                ))}
                              </tr>

                              {/* Stage 2 */}
                              <tr className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-3 font-medium text-gray-900 bg-gray-50 border-r border-gray-200">Stage 2</td>
                                <td className="p-3 bg-gray-50 border-r border-gray-200"></td>
                                {bids.map((bid, index) => (
                                  <td key={`stage2-${bid.id}-${index}`} className="p-3 text-center text-gray-900 border-r border-gray-200 last:border-r-0">
                                    {bid.financials.milestones && bid.financials.milestones[1] &&
                                     typeof bid.financials.milestones[1].paymentAmount === 'number' ? (
                                      `₹${(bid.financials.milestones[1].paymentAmount ?? 0).toLocaleString()}`
                                    ) : (
                                      '-'
                                    )}
                                  </td>
                                ))}
                              </tr>

                              {/* Delivery Date */}
                              <tr className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-3 font-medium text-gray-900 bg-gray-50 border-r border-gray-200">Delivery of Work By</td>
                                <td className="p-3 bg-gray-50 border-r border-gray-200"></td>
                                {bids.map((bid, index) => (
                                  <td key={`delivery-${bid.id}-${index}`} className="p-3 text-center text-gray-900 border-r border-gray-200 last:border-r-0">
                                    {safeFormatDate(bid.deliveryDate, 'dd/MM/yyyy')}
                                  </td>
                                ))}
                              </tr>

                              {/* Additional Information */}
                              <tr className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-3 font-medium text-gray-900 bg-gray-50 border-r border-gray-200">Additional Inputs provided by Bidders</td>
                                <td className="p-3 bg-gray-50 border-r border-gray-200"></td>
                                {bids.map((bid, index) => (
                                  <td key={`additional-inputs-${bid.id}-${index}`} className="p-3 text-center text-gray-900 border-r border-gray-200 last:border-r-0">
                                    <div className="text-xs text-gray-600 max-w-[150px] mx-auto" title={bid.additionalInputs}>
                                      {bid.additionalInputs ? (
                                        <div className="truncate">{bid.additionalInputs}</div>
                                      ) : (
                                        'N/A'
                                      )}
                                    </div>
                                  </td>
                                ))}
                              </tr>
 {/* Clarification Received Section */}
 <tr className="bg-green-500">
                        <td colSpan={bids.length + 2} className="p-3 text-center font-semibold text-white">
                          Clarification(s) Received
                        </td>
                      </tr>
                      {bids.map((bid, index) => (
                        <tr key={`clarification-${bid.id}`} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="p-3 font-medium text-gray-900 bg-gray-50 border-r border-gray-200">
                            Bidder {index + 1}
                          </td>
                          <td className="p-3 bg-gray-50 border-r border-gray-200"></td>
                          <td colSpan={bids.length} className="p-3 bg-gray-50 text-sm">
                            {index === 0 ? (
                              <div className="space-y-2">
                                <div className="bg-white border border-gray-200 rounded p-3">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-2 flex-1">
                                      <div className="bg-green-600 text-white text-xs px-2 py-1 rounded font-medium">R1</div>
                                      <div className="flex-1">
                                        <strong>Response to Q1:</strong> We will use DCF (Discounted Cash Flow) method combined with market multiple approach. Our methodology includes peer comparison analysis and will provide detailed assumptions and sensitivity analysis.
                                        <div className="text-xs text-gray-600 mt-1">Responded on: 16/01/2024 at 11:45 AM</div>
                                      </div>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="ml-2 text-xs"
                                      onClick={() => handleReplyToResponse('q1-r1', 'Response to Q1: DCF methodology...', 'Bidder 1')}
                                    >
                                      Reply
                                    </Button>
                                  </div>
                                </div>
                                <div className="bg-white border border-gray-200 rounded p-3">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-2 flex-1">
                                      <div className="bg-green-600 text-white text-xs px-2 py-1 rounded font-medium">R2</div>
                                      <div className="flex-1">
                                        <strong>Response to Q2:</strong> Stage 1 will take 15 days, Stage 2 will take 10 days. We have attached sample reports from 3 similar merger valuations completed in the last 6 months.
                                        <div className="text-xs text-gray-600 mt-1">Responded on: 16/01/2024 at 3:20 PM</div>
                                      </div>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="ml-2 text-xs"
                                      onClick={() => handleReplyToResponse('q2-r2', 'Response to Q2: Timeline details...', 'Bidder 1')}
                                    >
                                      Reply
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ) : index === 1 ? (
                              <div className="space-y-2">
                                <div className="bg-white border border-gray-200 rounded p-3">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-2 flex-1">
                                      <div className="bg-green-600 text-white text-xs px-2 py-1 rounded font-medium">R1</div>
                                      <div className="flex-1">
                                        <strong>Response to Q1:</strong> Our approach includes Asset-based valuation, Income approach using DCF, and Market approach. We will provide comprehensive peer analysis with 10+ comparable companies and detailed risk assessment.
                                        <div className="text-xs text-gray-600 mt-1">Responded on: 16/01/2024 at 4:15 PM</div>
                                      </div>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="ml-2 text-xs"
                                      onClick={() => handleReplyToResponse('bidder2-q1-r1', 'Response to Q1: Asset-based valuation approach...', 'Bidder 2')}
                                    >
                                      Reply
                                    </Button>
                                  </div>
                                </div>
                                <div className="bg-white border border-gray-200 rounded p-3">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-2 flex-1">
                                      <div className="bg-orange-600 text-white text-xs px-2 py-1 rounded font-medium">P</div>
                                      <div className="flex-1">
                                        <strong>Response to Q2:</strong> <em>Response pending - will provide detailed timeline by 17/01/2024</em>
                                        <div className="text-xs text-gray-600 mt-1">Status: Pending</div>
                                      </div>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="ml-2 text-xs"
                                      disabled
                                      onClick={() => handleReplyToResponse('bidder2-q2-pending', 'Response pending...', 'Bidder 2')}
                                    >
                                      Reply
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center text-gray-500 py-4">
                                <em>No clarifications requested for this bidder</em>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}

                              {/* Action Buttons Row */}
                              <tr className="bg-gray-100">
                                <td className="p-3 font-semibold text-gray-900 bg-gray-200 border-r border-gray-200">Actions</td>
                                <td className="p-3 bg-gray-200 border-r border-gray-200"></td>
                                {bids.map((bid) => (
                                  <td key={bid.id} className="p-3 text-center border-r border-gray-200 last:border-r-0 bg-gray-100">
                                    <div className="flex flex-col space-y-2">
                                      <Button
                                        size="sm"
                                        onClick={() => handleAcceptBidWithWorkOrder(bid.id)}
                                        className="bg-green-600 hover:bg-green-700 text-white text-xs"
                                        disabled={bid.status === BidStatus.REJECTED || bid.status === BidStatus.ACCEPTED}
                                      >
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Accept
                                      </Button>
                                      <Button
                                        size="sm"
                                        onClick={() => handleRejectBid(bid.id)}
                                        variant="destructive"
                                        className="text-xs"
                                        disabled={bid.status === BidStatus.REJECTED || bid.status === BidStatus.ACCEPTED}
                                      >
                                        <XCircle className="h-3 w-3 mr-1" />
                                        Reject Bid
                                      </Button>
                                      <Button
                                        size="sm"
                                        onClick={() => {
                          // For Service Providers - open negotiation chat
                          if (isServiceProvider) {
                            setNegotiationChatData({
                              bidId: bid.id,
                              serviceRequestId: serviceRequest.id,
                              seekerName: serviceRequest.clientProfile?.organizationName || 'Service Seeker'
                            });
                            setShowNegotiationChat(true);
                          } else {
                            // For Service Seekers - open structured negotiation
                            setSelectedBidForNegotiation(bid.id);
                            setShowStructuredNegotiation(true);
                          }
                        }}
                                        variant="outline"
                                        className="border-orange-300 text-orange-700 hover:bg-orange-50 text-xs"
                                        disabled={bid.status === BidStatus.REJECTED || bid.status === BidStatus.ACCEPTED}
                                      >
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        Renegotiate
                                      </Button>
                                      <Button
                                        size="sm"
                                        onClick={() => {
                                          setQueryTargetBid(bid.id);
                                          setShowQueriesDialog(true);
                                        }}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        <MessageSquare className="h-3 w-3 mr-1" />
                                        Ask Question
                                      </Button>
                                      <Button
                                        size="sm"
                                        onClick={() => {
                                          setShowQueryListView(true);
                                          // Load query threads for this bid
                                          loadQueryThreads(bid.id);
                                        }}
                                        variant="outline"
                                        className="text-xs border-purple-300 text-purple-700 hover:bg-purple-50"
                                      >
                                        <Eye className="h-3 w-3 mr-1" />
                                        View Queries
                                      </Button>
                                      {/* View Negotiation Terms button for bids with negotiation history */}
                                      {bid.negotiationThread && bid.negotiationThread.inputs.length > 0 && (
                                        <Button
                                          size="sm"
                                          onClick={() => {
                                            setSelectedBidForHistory(bid);
                                            setShowNegotiationHistory(true);
                                          }}
                                          variant="outline"
                                          className="border-blue-300 text-blue-700 hover:bg-blue-50 text-xs"
                                        >
                                          <Eye className="h-3 w-3 mr-1" />
                                          View Negotiation Terms
                                        </Button>
                                      )}
                                    </div>
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="documents" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {serviceRequest?.documents && serviceRequest.documents.length > 0 ? (
                      <div className="space-y-4">
                        {serviceRequest.documents.map((doc, index) => (
                          <div key={doc.id || index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                {doc.type?.includes('pdf') ? (
                                  <FileText className="h-8 w-8 text-red-500" />
                                ) : doc.type?.includes('excel') || doc.type?.includes('spreadsheet') ? (
                                  <FileText className="h-8 w-8 text-green-500" />
                                ) : (
                                  <FileText className="h-8 w-8 text-blue-500" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {doc.label || doc.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {doc.name} • {(doc.size / 1024 / 1024).toFixed(1)} MB
                                </p>
                                <p className="text-xs text-gray-400">
                                  Uploaded on {format(new Date(doc.uploadedAt), 'MMM dd, yyyy')}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // Mock download functionality
                                  toast({
                                    title: "Download Started",
                                    description: `Downloading ${doc.name}...`
                                  });
                                }}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // Mock view functionality
                                  toast({
                                    title: "Opening Document",
                                    description: `Opening ${doc.name} in viewer...`
                                  });
                                }}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No documents uploaded</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Created Date</span>
                  <span className="text-sm font-medium">
                    {safeFormatDate(serviceRequest.createdAt, 'dd/MM/yyyy')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Work Required By</span>
                  <span className="text-sm font-medium">
                    {serviceRequest.workRequiredBy ? safeFormatDate(serviceRequest.workRequiredBy, 'dd/MM/yyyy') : 'Not specified'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Deadline</span>
                  <span className="text-sm font-medium">
                    {safeFormatDate(serviceRequest.deadline, 'dd/MM/yyyy')}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {serviceRequest.preferredLocations && serviceRequest.preferredLocations.length > 0 ? (
                    serviceRequest.preferredLocations.map((location, index) => (
                      <p key={index} className="text-sm text-gray-600">{location}</p>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600">No location preference specified</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download Details
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
                {/* Only show withdraw button to service seekers who own the request */}
                {user && (
                  user.role === UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER ||
                  user.role === UserRole.SERVICE_SEEKER_ENTITY_ADMIN ||
                  user.role === UserRole.SERVICE_SEEKER_TEAM_MEMBER
                ) && serviceRequest?.createdBy === user.id && (
                  <Button
                    variant="destructive"
                    className="w-full justify-start"
                    onClick={() => setShowWithdrawDialog(true)}
                  >
                    Withdraw Request
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reply Dialog */}
        <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Reply to Query Response</DialogTitle>
              <DialogDescription>Send a public or private reply to the selected message.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {replyData && (
                <div className="bg-gray-50 p-3 rounded border">
                  <div className="text-sm text-gray-700">
                    <div className="font-medium text-gray-900 mb-1">Original Message from {replyData.bidderName}</div>
                    <div className="text-gray-800">{replyData.originalResponse}</div>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label>Visibility</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={replyType === 'public' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setReplyType('public')}
                  >
                    Public
                  </Button>
                  <Button
                    type="button"
                    variant={replyType === 'private' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setReplyType('private')}
                  >
                    Private
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="replyMessage">Your Reply</Label>
                <Textarea id="replyMessage" value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} rows={5} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowReplyDialog(false)}>Cancel</Button>
              <Button onClick={handleSendReply} disabled={!replyMessage.trim()}>Send Reply</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Withdraw Confirmation Dialog */}
        <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Withdraw Service Request</DialogTitle>
              <DialogDescription>
                This will make the service request inactive. All bidders may be notified and will no longer be able to place or update bids.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm text-gray-700">
              <p>Are you sure you want to withdraw this request?</p>
              <ul className="list-disc list-inside space-y-1">
                <li>You can recreate a new request later.</li>
                <li>Existing bids will be closed for further action.</li>
              </ul>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowWithdrawDialog(false)} disabled={withdrawing}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  if (!serviceRequest) return;
                  try {
                    setWithdrawing(true);
                    // TODO: integrate real API: await serviceRequestService.withdrawServiceRequest(serviceRequest.id)
                    await new Promise((res) => setTimeout(res, 600));
                    setServiceRequest({ ...serviceRequest, status: ServiceRequestStatus.CANCELLED });
                    toast({ title: 'Request Withdrawn', description: 'The service request has been withdrawn.' });
                    setShowWithdrawDialog(false);
                    navigate('/service-requests');
                  } catch (e) {
                    toast({ title: 'Failed to withdraw', description: 'Please try again.', variant: 'destructive' });
                  } finally {
                    setWithdrawing(false);
                  }
                }}
                disabled={withdrawing}
              >
                {withdrawing ? 'Withdrawing…' : 'Withdraw Request'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        

        {/* Negotiation Dialog */}
        <Dialog open={showNegotiationDialog} onOpenChange={setShowNegotiationDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Negotiate Bid Terms</DialogTitle>
              <DialogDescription>Propose changes to price, timeline, scope or terms.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                <div className="text-sm text-yellow-800">
                  <strong>Negotiation Process:</strong> Use this dialog to propose changes to bid terms. 
                  The bidder will receive your negotiation request and can respond with updated terms.
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="negotiationAmount">Proposed Amount (₹)</Label>
                  <Input
                    id="negotiationAmount"
                    type="number"
                    placeholder="Enter proposed amount"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="negotiationTimeline">Proposed Timeline (days)</Label>
                  <Input
                    id="negotiationTimeline"
                    type="number"
                    placeholder="Enter proposed timeline"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="negotiationTerms">Negotiation Terms & Conditions</Label>
                <Textarea
                  id="negotiationTerms"
                  placeholder="Specify the terms you want to negotiate (amount, timeline, deliverables, etc.)"
                  rows={4}
                  value={negotiationMessage}
                  onChange={(e) => setNegotiationMessage(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="negotiationReason">Reason for Negotiation</Label>
                {/* Primary Reason */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-700">Primary Reason</Label>
                    <Select value={negotiationType} onValueChange={(v) => setNegotiationType(v as 'price' | 'timeline' | 'scope' | 'terms')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select primary reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price">Price</SelectItem>
                        <SelectItem value="timeline">Timeline</SelectItem>
                        <SelectItem value="scope">Scope</SelectItem>
                        <SelectItem value="terms">Terms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-700">Specific Reason</Label>
                    <Select value={negotiationReasonDetail} onValueChange={setNegotiationReasonDetail}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select specific reason" />
                      </SelectTrigger>
                      <SelectContent>
                        {negotiationType === 'price' && (
                          <>
                            <SelectItem value="budget_constraints">Budget constraints</SelectItem>
                            <SelectItem value="market_rate_mismatch">Market rate mismatch</SelectItem>
                            <SelectItem value="value_not_justified">Value not justified</SelectItem>
                            <SelectItem value="prefer_milestones">Prefer milestone-based payments</SelectItem>
                          </>
                        )}
                        {negotiationType === 'timeline' && (
                          <>
                            <SelectItem value="need_faster_delivery">Need faster delivery</SelectItem>
                            <SelectItem value="flexible_with_deadline">Flexible with deadline</SelectItem>
                            <SelectItem value="dependency_constraints">Dependency constraints</SelectItem>
                          </>
                        )}
                        {negotiationType === 'scope' && (
                          <>
                            <SelectItem value="add_additional_tasks">Add additional tasks</SelectItem>
                            <SelectItem value="remove_certain_tasks">Remove certain tasks</SelectItem>
                            <SelectItem value="clarify_deliverables">Clarify deliverables</SelectItem>
                          </>
                        )}
                        {negotiationType === 'terms' && (
                          <>
                            <SelectItem value="payment_schedule">Payment schedule change</SelectItem>
                            <SelectItem value="warranty_support">Warranty/Support terms</SelectItem>
                            <SelectItem value="confidentiality_ip">Confidentiality/IP terms</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <div className="text-sm text-blue-800">
                  <strong>Next Steps:</strong> After sending this negotiation request:
                  <ul className="mt-2 space-y-1 list-disc list-inside">
                    <li>Bid status will change to "Under Negotiation"</li>
                    <li>Bidder will receive notification to review and respond</li>
                    <li>You can track negotiation progress in the bid details</li>
                    <li>Final acceptance will generate a Proforma Work Order</li>
                  </ul>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNegotiationDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSendNegotiation}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Send Negotiation Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Query Dialog */}
        <Dialog open={showQueriesDialog} onOpenChange={setShowQueriesDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Post Query</DialogTitle>
              <DialogDescription>Ask a question to a specific bidder or to all bidders.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded border border-blue-200">
                <div className="text-sm text-blue-800">
                  <strong>AI Moderation Notice:</strong> All messages are monitored for compliance. 
                  Do not share personal contact information. Violations may result in chat restrictions.
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="queryMessage">Your Question</Label>
                <Textarea
                  id="queryMessage"
                  placeholder="Enter your question or clarification request..."
                  rows={4}
                  value={queryMessage}
                  onChange={(e) => setQueryMessage(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Message Type</Label>
                  <Select value={queryType} onValueChange={(value) => setQueryType(value as 'public' | 'private')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private (Default)</SelectItem>
                      <SelectItem value="public">Public (All bidders can see)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Target Bidder</Label>
                  <Select value={queryTargetBid || 'all'} onValueChange={setQueryTargetBid}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bidder" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Bidders</SelectItem>
                      {bids.map((bid) => (
                        <SelectItem key={bid.id} value={bid.id}>
                          Bid #{bid.bidNumber.slice(-3)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowQueriesDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  // Handle query submission
                  toast({
                    title: "Query Posted",
                    description: `Your ${queryType} query has been posted successfully.`,
                  });
                  setShowQueriesDialog(false);
                  setQueryMessage('');
                  setQueryTargetBid('all');
                }}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!queryMessage.trim()}
              >
                Post Query
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Structured Negotiation Dialog */}
        <Dialog open={showStructuredNegotiation} onOpenChange={setShowStructuredNegotiation}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Structured Negotiation</DialogTitle>
              <DialogDescription>Send a structured negotiation request with guided reasons.</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                <div className="text-sm text-yellow-800">
                  <strong>Privacy & Compliance:</strong> This negotiation is monitored by AI for quality assurance. 
                  Personal contact information sharing is prohibited and will result in automatic warnings.
                </div>
              </div>

              <div className="space-y-2">
                <Label>Reason for Negotiation</Label>
                <Select value={negotiationReason} onValueChange={(value: 'timeline' | 'information' | 'documents' | 'pricing' | 'payment') => setNegotiationReason(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="timeline">Propose a Revised Delivery Timeline</SelectItem>
                    <SelectItem value="information">Request Additional Information</SelectItem>
                    <SelectItem value="documents">Request Documents</SelectItem>
                    <SelectItem value="pricing">Adjust Fee or Offer Counter Price</SelectItem>
                    <SelectItem value="payment">Change Payment Structure</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Timeline Negotiation */}
              {negotiationReason === 'timeline' && (
                <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-semibold text-gray-900">Timeline Adjustment</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Proposed New Completion Date</Label>
                      <Input
                        type="date"
                        value={negotiationData.timeline.proposedDate}
                        onChange={(e) => setNegotiationData(prev => ({
                          ...prev,
                          timeline: { ...prev.timeline, proposedDate: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Reason for Timeline Change</Label>
                      <Textarea
                        placeholder="Provide justification for requesting a revised timeline..."
                        rows={3}
                        maxLength={250}
                        value={negotiationData.timeline.reason}
                        onChange={(e) => setNegotiationData(prev => ({
                          ...prev,
                          timeline: { ...prev.timeline, reason: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Information Request */}
              {negotiationReason === 'information' && (
                <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-semibold text-gray-900">Additional Information Request</h3>
                  <div className="space-y-2">
                    <Label>Clarification Needed</Label>
                    <Textarea
                      placeholder="Clearly state the specific information or clarification required..."
                      rows={4}
                      value={negotiationData.information.clarification}
                      onChange={(e) => setNegotiationData(prev => ({
                        ...prev,
                        information: { ...prev.information, clarification: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              )}

              {/* Document Request */}
              {negotiationReason === 'documents' && (
                <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-semibold text-gray-900">Document Request</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Document Type Requested</Label>
                      <Select value={negotiationData.documents.type} onValueChange={(value) => setNegotiationData(prev => ({
                        ...prev,
                        documents: { ...prev.documents, type: value }
                      }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="government_registration">Government Registration Certificate</SelectItem>
                          <SelectItem value="industry_licenses">Industry-Specific Licenses</SelectItem>
                          <SelectItem value="portfolio_samples">Portfolio Samples</SelectItem>
                          <SelectItem value="nda_compliance">NDA/Compliance Documents</SelectItem>
                          <SelectItem value="other">Other (with description)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Purpose of Request</Label>
                      <Textarea
                        placeholder="Indicate why the document is required..."
                        rows={3}
                        value={negotiationData.documents.purpose}
                        onChange={(e) => setNegotiationData(prev => ({
                          ...prev,
                          documents: { ...prev.documents, purpose: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing Negotiation */}
              {negotiationReason === 'pricing' && (
                <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-semibold text-gray-900">Fee Adjustment</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Suggested Fee (₹)</Label>
                      <Input
                        type="number"
                        placeholder="Enter proposed amount"
                        value={negotiationData.pricing.suggestedFee}
                        onChange={(e) => setNegotiationData(prev => ({
                          ...prev,
                          pricing: { ...prev.pricing, suggestedFee: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Justification for Fee Adjustment</Label>
                      <Textarea
                        placeholder="State the reason for proposing a fee revision..."
                        rows={3}
                        value={negotiationData.pricing.justification}
                        onChange={(e) => setNegotiationData(prev => ({
                          ...prev,
                          pricing: { ...prev.pricing, justification: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Structure */}
              {negotiationReason === 'payment' && (
                <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-semibold text-gray-900">Payment Structure Change</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Preferred Payment Model</Label>
                      <Select value={negotiationData.payment.model} onValueChange={(value) => setNegotiationData(prev => ({
                        ...prev,
                        payment: { ...prev.payment, model: value }
                      }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lump_sum">Lump Sum</SelectItem>
                          <SelectItem value="milestone_based">Milestone-Based</SelectItem>
                          <SelectItem value="monthly_retainer">Monthly Retainer</SelectItem>
                          <SelectItem value="usage_based">Usage-Based Billing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Define Proposed Payment Terms</Label>
                      <Textarea
                        placeholder="Example: Milestone 1: Design Phase - ₹50,000 - Due: 15 days..."
                        rows={4}
                        value={negotiationData.payment.terms}
                        onChange={(e) => setNegotiationData(prev => ({
                          ...prev,
                          payment: { ...prev.payment, terms: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Reason for Payment Model Change</Label>
                      <Textarea
                        placeholder="Explain the business or operational need behind altering the payment structure..."
                        rows={3}
                        value={negotiationData.payment.reason}
                        onChange={(e) => setNegotiationData(prev => ({
                          ...prev,
                          payment: { ...prev.payment, reason: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowStructuredNegotiation(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  toast({
                    title: "Negotiation Request Sent",
                    description: "Your structured negotiation request has been sent to the service provider.",
                  });
                  setShowStructuredNegotiation(false);
                }}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Send Negotiation Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Negotiation History Dialog */}
        <Dialog open={showNegotiationHistory} onOpenChange={setShowNegotiationHistory}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Negotiation History - {selectedBidForHistory?.providerName}</DialogTitle>
              <DialogDescription>
                Complete negotiation thread and final agreed terms for this bid.
              </DialogDescription>
            </DialogHeader>
            
            {selectedBidForHistory && selectedBidForHistory.negotiationThread && (
              <div className="space-y-6">
                {/* Negotiation Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">Negotiation Status</h3>
                    <p className="text-sm text-gray-600">
                      Status: <span className="font-medium capitalize">{selectedBidForHistory.negotiationThread.status}</span>
                    </p>
                  </div>
                  <Badge className={
                    selectedBidForHistory.negotiationThread.status === 'completed' ? 'bg-green-100 text-green-800' :
                    selectedBidForHistory.negotiationThread.status === 'active' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {selectedBidForHistory.negotiationThread.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>

                {/* Negotiation Timeline */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Negotiation Timeline</h3>
                  {selectedBidForHistory.negotiationThread.inputs.map((input, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`${input.senderType === 'seeker' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'} px-3 py-1 rounded-full text-sm font-medium`}>
                            {input.senderType === 'seeker' ? 'Service Seeker' : 'Service Provider'}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {input.reason.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500">
                          {format(input.timestamp, 'dd MMM yyyy, hh:mm a')}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{input.message}</p>
                      
                      {/* Proposed Changes */}
                      {input.proposedChanges && (
                        <div className="bg-white p-3 rounded border">
                          <h4 className="font-medium text-gray-900 mb-2">Proposed Changes:</h4>
                          <div className="space-y-2 text-sm">
                            {input.proposedChanges.financials && (
                              <div>
                                <span className="font-medium">Financial Changes:</span>
                                <div className="ml-4 space-y-1">
                                  {input.proposedChanges.financials.professionalFee && (
                                    <div>Professional Fee: ₹{input.proposedChanges.financials.professionalFee.toLocaleString()}</div>
                                  )}
                                  {input.proposedChanges.financials.totalBidAmount && (
                                    <div>Total Amount: ₹{(input.proposedChanges.financials.totalBidAmount ?? 0).toLocaleString()}</div>
                                  )}
                                </div>
                              </div>
                            )}
                            {input.proposedChanges.deliveryDate && (
                              <div>
                                <span className="font-medium">Delivery Date:</span>
                                <span className="ml-2">{format(input.proposedChanges.deliveryDate, 'dd MMM yyyy')}</span>
                              </div>
                            )}
                            {input.proposedChanges.additionalInputs && (
                              <div>
                                <span className="font-medium">Additional Notes:</span>
                                <p className="ml-2 text-gray-600">{input.proposedChanges.additionalInputs}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Attachments */}
                      {input.attachments && input.attachments.length > 0 && (
                        <div className="mt-3">
                          <h4 className="font-medium text-gray-900 mb-2">Attachments:</h4>
                          <div className="space-y-1">
                            {input.attachments.map((attachment) => (
                              <div key={attachment.id} className="flex items-center space-x-2 text-sm">
                                <FileText className="h-4 w-4 text-gray-500" />
                                <a href={attachment.url} className="text-blue-600 hover:underline">
                                  {attachment.name}
                                </a>
                                <span className="text-gray-500">({format(attachment.uploadedAt, 'dd MMM yyyy')})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Final Agreed Terms */}
                {selectedBidForHistory.negotiationThread.status === 'completed' && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-900 mb-3">Final Agreed Terms</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Final Amount:</span>
                        <span className="ml-2 font-semibold text-green-700">₹{(selectedBidForHistory.financials.totalBidAmount ?? 0).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Delivery Date:</span>
                        <span className="ml-2">{format(selectedBidForHistory.deliveryDate, 'dd MMM yyyy')}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Payment Structure:</span>
                        <span className="ml-2">{selectedBidForHistory.financials.paymentStructure.replace('_', ' ')}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Professional Fee:</span>
                        <span className="ml-2">₹{selectedBidForHistory.financials.professionalFee.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNegotiationHistory(false)}>
                Close
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Export Started",
                  description: "Negotiation history is being exported to PDF.",
                });
              }}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Expired Service Request Dialog */}
        <Dialog open={showExpiredDialog} onOpenChange={setShowExpiredDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {expiredAction === 'close' && 'Accept and Close Request'}
                {expiredAction === 'extend' && 'Request Extension'}
                {expiredAction === 'rebid' && 'Start New Bidding Round'}
              </DialogTitle>
              <DialogDescription>
                {expiredAction === 'close' && 'This will permanently close the expired service request. All bidders will be notified.'}
                {expiredAction === 'extend' && 'Request an extension of the deadline with a valid reason.'}
                {expiredAction === 'rebid' && 'This will start a new bidding round with a fresh deadline. All previous bids will be cleared.'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {expiredAction === 'extend' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="extensionDays">Extension Period (Days)</Label>
                    <Select value={extensionDays.toString()} onValueChange={(value) => setExtensionDays(Number(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="extensionReason">Reason for Extension *</Label>
                    <Textarea
                      id="extensionReason"
                      placeholder="Please provide a detailed reason for the extension..."
                      value={extensionReason}
                      onChange={(e) => setExtensionReason(e.target.value)}
                      rows={4}
                    />
                  </div>
                </>
              )}
              
              {expiredAction === 'close' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-900">Confirm Closure</h4>
                      <p className="text-sm text-red-700 mt-1">
                        This action cannot be undone. The service request will be permanently closed and all bidders will be notified.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {expiredAction === 'rebid' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <RefreshCw className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">New Bidding Round</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        A new 7-day bidding period will start. All previous bids will be cleared and bidders can submit fresh proposals.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowExpiredDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleExpiredAction}
                disabled={expiredAction === 'extend' && !extensionReason.trim()}
                className={
                  expiredAction === 'close' ? 'bg-red-600 hover:bg-red-700' :
                  expiredAction === 'extend' ? 'bg-orange-600 hover:bg-orange-700' :
                  'bg-blue-600 hover:bg-blue-700'
                }
              >
                {expiredAction === 'close' && 'Accept & Close'}
                {expiredAction === 'extend' && 'Request Extension'}
                {expiredAction === 'rebid' && 'Start New Round'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Mark Not Interested Dialog */}
        <Dialog open={showNotInterestedDialog} onOpenChange={setShowNotInterestedDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {isMarkedNotInterested ? 'Reverse Not Interested Decision' : 'Mark as Not Interested'}
              </DialogTitle>
              <DialogDescription>
                {isMarkedNotInterested 
                  ? 'You can reverse your decision and participate in the bidding process again.'
                  : 'This opportunity will be marked as not interested. You can reverse this decision anytime from the opportunities list.'
                }
              </DialogDescription>
            </DialogHeader>
            
            {!isMarkedNotInterested && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notInterestedReason">Reason for not being interested *</Label>
                  <Select value={notInterestedReason} onValueChange={setNotInterestedReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget_constraints">Budget constraints</SelectItem>
                      <SelectItem value="timeline_issues">Timeline doesn't work</SelectItem>
                      <SelectItem value="scope_mismatch">Scope doesn't match expertise</SelectItem>
                      <SelectItem value="capacity_issues">Current capacity constraints</SelectItem>
                      <SelectItem value="client_requirements">Client requirements unclear</SelectItem>
                      <SelectItem value="other">Other reasons</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-orange-900">Note</h4>
                      <p className="text-sm text-orange-700 mt-1">
                        This opportunity will continue to be shown under Open Opportunities and you can reverse this decision anytime.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNotInterestedDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={isMarkedNotInterested 
                  ? () => {
                      setIsMarkedNotInterested(false);
                      setShowNotInterestedDialog(false);
                      toast({
                        title: "Decision Reversed",
                        description: "You can now participate in the bidding process.",
                      });
                    }
                  : handleMarkNotInterested
                }
                className={isMarkedNotInterested 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-red-600 hover:bg-red-700"
                }
              >
                {isMarkedNotInterested ? 'Reverse Decision' : 'Mark Not Interested'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Update Allocation Dialog */}
        <Dialog open={showAllocationDialog} onOpenChange={setShowAllocationDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Update Allocation Details</DialogTitle>
              <DialogDescription>
                Update the current assignee for this service request opportunity.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentAssignee">Current Assignee</Label>
                <Input 
                  id="currentAssignee"
                  value={serviceRequest?.currentAssignee?.name || ''}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newAssignee">New Assignee *</Label>
                <Select value={allocationData.newAssignee} onValueChange={(value) => setAllocationData(prev => ({...prev, newAssignee: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john-doe">John Doe - Senior Associate</SelectItem>
                    <SelectItem value="jane-smith">Jane Smith - Partner</SelectItem>
                    <SelectItem value="mike-johnson">Mike Johnson - Junior Associate</SelectItem>
                    <SelectItem value="sarah-wilson">Sarah Wilson - Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="allocationReason">Reason for Change *</Label>
                <Textarea
                  id="allocationReason"
                  placeholder="Please provide a reason for changing the assignee..."
                  value={allocationData.reason}
                  onChange={(e) => setAllocationData(prev => ({...prev, reason: e.target.value}))}
                  rows={3}
                />
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Allocation Update</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      The new assignee will be notified and given access to this opportunity. The previous assignee will be informed of the change.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAllocationDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateAllocation}
                disabled={!allocationData.newAssignee || !allocationData.reason.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Update Allocation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Query List View Dialog */}
        <Dialog open={showQueryListView} onOpenChange={setShowQueryListView}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Query and Clarifications</span>
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Sort by:</Label>
                  <Select value={querySortOrder} onValueChange={(value: 'latest' | 'oldest') => setQuerySortOrder(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">Latest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </DialogTitle>
              <DialogDescription>
                View queries posted by service seeker or service provider with response threads from bidders.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {queryThreads.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No queries posted yet</p>
                </div>
              ) : (
                queryThreads
                  .sort((a, b) => {
                    const dateA = new Date(a.timestamp).getTime();
                    const dateB = new Date(b.timestamp).getTime();
                    return querySortOrder === 'latest' ? dateB - dateA : dateA - dateB;
                  })
                  .map((thread, index) => (
                    <Card key={thread.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          {/* Query Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                Q{index + 1}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="font-semibold text-gray-900">{thread.bidderName}</span>
                                  <Badge variant="outline" className={thread.isPublic ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}>
                                    {thread.isPublic ? 'Public' : 'Private'}
                                  </Badge>
                                </div>
                                <p className="text-gray-700 mb-2">{thread.question}</p>
                                <div className="text-xs text-gray-500">
                                  Posted on: {format(new Date(thread.timestamp), 'dd MMM yyyy, hh:mm a')}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setReplyData({
                                    responseId: thread.id,
                                    parentQueryId: thread.id,
                                    originalResponse: thread.question,
                                    bidderName: thread.bidderName,
                                    bidId: thread.bidId
                                  });
                                  setShowReplyDialog(true);
                                }}
                              >
                                Reply
                              </Button>
                              {thread.isPublic && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    // Send to all providers
                                    toast({
                                      title: "Sent to All",
                                      description: "Response sent to all bidders"
                                    });
                                  }}
                                >
                                  Reply to All
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          {/* Response Threads */}
                          {thread.responses && thread.responses.length > 0 && (
                            <div className="ml-12 space-y-3">
                              {thread.responses.map((response: QueryResponse, respIndex: number) => (
                                <div key={respIndex} className="bg-gray-50 border border-gray-200 rounded p-3">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-2 flex-1">
                                      <div className="bg-green-600 text-white text-xs px-2 py-1 rounded font-medium">
                                        R{respIndex + 1}
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                          <span className="font-medium text-gray-900">{response.responderName}</span>
                                          <span className="text-xs text-gray-500">({response.responderType})</span>
                                        </div>
                                        <p className="text-gray-700 mb-2">{response.message}</p>
                                        <div className="text-xs text-gray-500">
                                          Responded on: {format(new Date(response.timestamp), 'dd MMM yyyy, hh:mm a')}
                                        </div>
                                      </div>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="ml-2 text-xs"
                                      onClick={() => {
                                        setReplyData({
                                          responseId: response.id,
                                          parentQueryId: thread.id,
                                          originalResponse: response.message,
                                          bidderName: response.responderName,
                                          bidId: thread.bidId
                                        });
                                        setShowReplyDialog(true);
                                      }}
                                    >
                                      Reply
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowQueryListView(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setShowQueryListView(false);
                setShowQueriesDialog(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Post New Query
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Negotiation Chat Dialog for Service Providers */}
        <Dialog open={showNegotiationChat} onOpenChange={setShowNegotiationChat}>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Bid Negotiation - Private Chat</DialogTitle>
              <DialogDescription>
                Secure negotiation interface with AI monitoring for compliance. Personal contact information sharing is prohibited.
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex h-[70vh] gap-4">
              {/* Chat Panel */}
              <div className="flex-1 flex flex-col border rounded-lg">
                <div className="bg-red-50 border-b border-red-200 p-3">
                  <div className="flex items-center gap-2 text-sm text-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <span><strong>AI Monitoring:</strong> This conversation is monitored for quality and compliance. Contact information sharing will result in warnings and potential ban.</span>
                  </div>
                  {violationCount > 0 && (
                    <div className="mt-2 text-sm text-red-700">
                      <strong>Warnings: {violationCount}/3</strong> - {violationCount >= 3 ? 'You have been banned from this negotiation.' : `${3 - violationCount} warnings remaining before ban.`}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                  {/* Chat messages would go here */}
                  <div className="space-y-3">
                    <div className="bg-blue-100 p-3 rounded-lg max-w-xs">
                      <p className="text-sm">Hello, I'd like to discuss the timeline and pricing for this project.</p>
                      <div className="text-xs text-gray-600 mt-1">Service Seeker - 10:30 AM</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg max-w-xs ml-auto">
                      <p className="text-sm">I'd be happy to discuss the details. Let me review your requirements.</p>
                      <div className="text-xs text-gray-600 mt-1">You - 10:32 AM</div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t p-3">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Type your message... (No contact information allowed)"
                      className="flex-1"
                      disabled={isBannedFromNegotiation}
                    />
                    <Button disabled={isBannedFromNegotiation}>
                      Send
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Structured Negotiation Panel */}
              <div className="w-96 border rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold text-gray-900 mb-4">Structured Negotiation Fields</h3>
                
                <div className="space-y-4">
                  {/* Service Seeker Inputs Display */}
                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <h4 className="font-medium text-blue-900 mb-2">Service Seeker Requests:</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Timeline:</strong> Need completion by 15th March</div>
                      <div><strong>Budget:</strong> ₹2,50,000 (negotiable)</div>
                      <div><strong>Additional Info:</strong> Require weekly progress updates</div>
                    </div>
                  </div>
                  
                  {/* Service Provider Response Fields */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Your Response:</h4>
                    
                    {/* Revised Timeline */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Proposed Revised Completion Date</Label>
                      <Input type="date" className="text-sm" />
                      <Label className="text-sm font-medium">Reason for Timeline Change</Label>
                      <Textarea rows={2} placeholder="Max 250 characters" maxLength={250} className="text-sm" />
                    </div>
                    
                    {/* Additional Information */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Clarification or Response</Label>
                      <Textarea rows={3} placeholder="Detailed responses to queries" className="text-sm" />
                      <Label className="text-sm font-medium">Attach Pre-Uploaded Documents</Label>
                      <Select>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Select from verified documents" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="portfolio1">Portfolio Sample 1.pdf</SelectItem>
                          <SelectItem value="certificate1">Professional Certificate.pdf</SelectItem>
                          <SelectItem value="license1">Business License.pdf</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Counter Price */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Proposed Counter Price (₹)</Label>
                      <Input type="number" placeholder="Enter revised fee" className="text-sm" />
                      <Label className="text-sm font-medium">Fee Title</Label>
                      <Input placeholder="e.g., Revised Fee - Phase 1" className="text-sm" />
                      <Label className="text-sm font-medium">Justification for Price Change</Label>
                      <Textarea rows={2} placeholder="Brief explanation" className="text-sm" />
                    </div>
                    
                    {/* Payment Structure */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Change Payment Structure</Label>
                      <Select>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Select payment model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lump_sum">Lump Sum</SelectItem>
                          <SelectItem value="milestone_based">Milestone-Based</SelectItem>
                          <SelectItem value="monthly_retainer">Monthly Retainer</SelectItem>
                          <SelectItem value="usage_based">Usage-Based Billing</SelectItem>
                        </SelectContent>
                      </Select>
                      <Label className="text-sm font-medium">Define Milestones</Label>
                      <Textarea rows={3} placeholder="Milestone name, amount, due date" className="text-sm" />
                      <Label className="text-sm font-medium">Rationale for Change</Label>
                      <Textarea rows={2} placeholder="Reason for payment structure change" className="text-sm" />
                    </div>
                    
                    <Button className="w-full" onClick={() => {
                      toast({
                        title: "Negotiation Inputs Submitted",
                        description: "Your structured negotiation response has been submitted."
                      });
                      setShowBidUpdateDialog(true);
                    }}>
                      Submit Negotiation Inputs
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNegotiationChat(false)}>
                Close Chat
              </Button>
              <Button onClick={() => {
                setShowNegotiationChat(false);
                setShowBidUpdateDialog(true);
              }}>
                Update Bid Details
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bid Update Dialog */}
        <Dialog open={showBidUpdateDialog} onOpenChange={setShowBidUpdateDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Update Bid Details</DialogTitle>
              <DialogDescription>
                Update your bid based on the negotiated terms. These changes will reflect in the bid for final review by the Service Seeker.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <h3 className="font-semibold text-green-900 mb-2">Negotiation Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Agreed Timeline:</strong> 25 days (revised from 30 days)</div>
                  <div><strong>Agreed Amount:</strong> ₹2,75,000 (revised from ₹3,00,000)</div>
                  <div><strong>Payment Structure:</strong> Milestone-based (3 milestones)</div>
                  <div><strong>Additional Terms:</strong> Weekly progress reports included</div>
                </div>
              </div>
              
              {/* Updated Bid Form */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Financial Details</h3>
                  <div className="space-y-3">
                    <div>
                      <Label>Professional Fee (₹)</Label>
                      <Input type="number" defaultValue="275000" />
                    </div>
                    <div>
                      <Label>Delivery Timeline (days)</Label>
                      <Input type="number" defaultValue="25" />
                    </div>
                    <div>
                      <Label>Payment Structure</Label>
                      <Select defaultValue="milestone_based">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="milestone_based">Milestone-Based</SelectItem>
                          <SelectItem value="lump_sum">Lump Sum</SelectItem>
                          <SelectItem value="monthly_retainer">Monthly Retainer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Milestone Breakdown</h3>
                  <div className="space-y-3">
                    <div className="border rounded p-3">
                      <Label className="text-sm">Milestone 1: Requirements Analysis</Label>
                      <Input type="number" defaultValue="100000" className="mt-1" placeholder="Amount" />
                      <Input defaultValue="10 days" className="mt-1" placeholder="Timeline" />
                    </div>
                    <div className="border rounded p-3">
                      <Label className="text-sm">Milestone 2: Development & Testing</Label>
                      <Input type="number" defaultValue="125000" className="mt-1" placeholder="Amount" />
                      <Input defaultValue="12 days" className="mt-1" placeholder="Timeline" />
                    </div>
                    <div className="border rounded p-3">
                      <Label className="text-sm">Milestone 3: Final Delivery</Label>
                      <Input type="number" defaultValue="50000" className="mt-1" placeholder="Amount" />
                      <Input defaultValue="3 days" className="mt-1" placeholder="Timeline" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label>Updated Methodology & Approach</Label>
                <Textarea rows={4} defaultValue="Based on our discussion, I will provide weekly progress reports and include additional quality assurance testing as requested. The methodology remains the same but with enhanced communication protocols." />
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <h4 className="font-medium text-blue-900 mb-2">Next Steps</h4>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Updated bid will be submitted for Service Seeker review</li>
                  <li>Service Seeker can Accept, Reject, or Renegotiate again</li>
                  <li>Upon acceptance, a Proforma Work Order will be generated</li>
                  <li>Negotiation history will be accessible under Opportunities &gt; Closed Tab</li>
                </ul>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBidUpdateDialog(false)}>
                Save as Draft
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Bid Updated Successfully",
                  description: "Your updated bid has been submitted. The Service Seeker will be notified."
                });
                setShowBidUpdateDialog(false);
                fetchData(); // Refresh bid data
              }}>
                Submit Updated Bid
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Service Request Chat Component */}
        <ServiceRequestChat
          serviceRequestId={id || ''}
          bidId={selectedBidForChat || undefined}
          currentUserId="seeker-001" // This should come from auth context
          currentUserRole={ChatParticipantRole.SERVICE_SEEKER}
          isOpen={showChat}
          onClose={() => {
            setShowChat(false);
            setSelectedBidForChat('');
            setInitialChatMessage('');
          }}
          initialMessage={initialChatMessage}
        />
      </div>
    </DashboardLayout>
  );
};

export default ServiceRequestDetails;
