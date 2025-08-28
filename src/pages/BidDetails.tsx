import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  FileText, 
  User, 
  Building,
  Edit,
  Download,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Handshake,
  Send,
  Eye,
  Shield,
  Users,
  History,
  RefreshCw,
  UserPlus,
  Save
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { serviceRequestService } from "@/services/serviceRequestService";
import { Bid, BidStatus, PaymentStructure } from "@/types/serviceRequest";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { getUserTypeFromRole } from "@/utils/userTypeUtils";
import ServiceRequestChat from "@/components/chat/ServiceRequestChat";
import { ChatParticipantRole } from "@/types/chat";

const BidDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const layoutUserType = getUserTypeFromRole(user?.role);
  const [bid, setBid] = useState<Bid | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Dialog states for negotiate, query, and chat
  const [showNegotiateDialog, setShowNegotiateDialog] = useState(false);
  const [showQueryDialog, setShowQueryDialog] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showStructuredNegotiation, setShowStructuredNegotiation] = useState(false);
  const [showUpdateBidDialog, setShowUpdateBidDialog] = useState(false);
  const [showTeamAllocationDialog, setShowTeamAllocationDialog] = useState(false);
  const [showNegotiationHistoryDialog, setShowNegotiationHistoryDialog] = useState(false);
  const [negotiateMessage, setNegotiateMessage] = useState('');
  const [negotiateType, setNegotiateType] = useState<'price' | 'timeline' | 'scope' | 'terms'>('price');
  const [queryMessage, setQueryMessage] = useState('');
  const [queryType, setQueryType] = useState<'public' | 'private'>('private');

  // Structured negotiation states
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [structuredInputs, setStructuredInputs] = useState({
    revisedDeliveryDate: '',
    timelineChangeReason: '',
    clarificationResponse: '',
    supportingDocuments: '',
    counterPrice: '',
    feeTitle: '',
    priceJustification: '',
    paymentStructure: '',
    milestones: '',
    paymentRationale: ''
  });

  // Bid update states
  const [updatedBid, setUpdatedBid] = useState({
    deliveryDate: '',
    professionalFee: '',
    totalAmount: '',
    paymentStructure: '',
    milestones: '',
    additionalInputs: ''
  });

  // Team allocation states
  const [selectedTeamMember, setSelectedTeamMember] = useState('');
  const [teamMembers] = useState([
    { id: 'tm1', name: 'John Smith', role: 'Senior Consultant' },
    { id: 'tm2', name: 'Sarah Johnson', role: 'Project Manager' },
    { id: 'tm3', name: 'Mike Chen', role: 'Technical Lead' },
    { id: 'tm4', name: 'Lisa Williams', role: 'Business Analyst' }
  ]);

  const fetchBidDetails = useCallback(async () => {
    try {
      setLoading(true);
      // Use actual service to get bid details
      const bidData = await serviceRequestService.getBidById(id!);
      if (bidData) {
        setBid(bidData);
      } else {
        toast({
          title: "Error",
          description: "Bid not found.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching bid details:', error);
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
      fetchBidDetails();
    }
  }, [id, fetchBidDetails]);


  const getStatusColor = (status: BidStatus) => {
    switch (status) {
      case BidStatus.SUBMITTED:
        return 'bg-blue-100 text-blue-800';
      case BidStatus.UNDER_REVIEW:
        return 'bg-yellow-100 text-yellow-800';
      case BidStatus.UNDER_NEGOTIATION:
        return 'bg-orange-100 text-orange-800';
      case BidStatus.ACCEPTED:
        return 'bg-green-100 text-green-800';
      case BidStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      case BidStatus.WITHDRAWN:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: BidStatus) => {
    switch (status) {
      case BidStatus.SUBMITTED:
        return <Clock className="h-4 w-4" />;
      case BidStatus.UNDER_REVIEW:
        return <AlertCircle className="h-4 w-4" />;
      case BidStatus.ACCEPTED:
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleWithdrawBid = async () => {
    if (window.confirm('Are you sure you want to withdraw this bid?')) {
      try {
        await serviceRequestService.withdrawBid(bid!.id);
        toast({
          title: "Success",
          description: "Bid withdrawn successfully.",
        });
        // Refresh bid details
        fetchBidDetails();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to withdraw bid. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleNegotiate = async () => {
    if (!bid || !negotiateMessage.trim()) return;
    
    try {
      // TODO: Integrate with real API
      // await serviceRequestService.submitNegotiation(bid.id, {
      //   type: negotiateType,
      //   message: negotiateMessage
      // });
      
      toast({
        title: "Negotiation Submitted",
        description: `Your ${negotiateType} negotiation has been sent to the client.`,
      });
      
      setShowNegotiateDialog(false);
      setNegotiateMessage('');
      
      // Refresh bid details to show updated status
      fetchBidDetails();
    } catch (error) {
      toast({
        title: "Failed to Submit",
        description: "Failed to submit negotiation. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleQuery = async () => {
    if (!bid || !queryMessage.trim()) return;
    
    try {
      // TODO: Integrate with real API
      // await serviceRequestService.submitQuery(bid.serviceRequestId, {
      //   bidId: bid.id,
      //   type: queryType,
      //   message: queryMessage
      // });
      
      toast({
        title: "Query Submitted",
        description: `Your ${queryType} query has been sent to the client.`,
      });
      
      setShowQueryDialog(false);
      setQueryMessage('');
    } catch (error) {
      toast({
        title: "Failed to Submit",
        description: "Failed to submit query. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateBid = async () => {
    if (!bid) return;
    
    try {
      // TODO: Integrate with real API
      // await serviceRequestService.updateBid(bid.id, updatedBid);
      
      toast({
        title: "Bid Updated",
        description: "Your bid has been updated successfully based on negotiation outcomes.",
      });
      
      setShowUpdateBidDialog(false);
      fetchBidDetails(); // Refresh bid details
    } catch (error) {
      toast({
        title: "Failed to Update",
        description: "Failed to update bid. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleTeamAllocation = async () => {
    if (!bid || !selectedTeamMember) return;
    
    try {
      // TODO: Integrate with real API
      // await serviceRequestService.allocateTeamMember(bid.id, selectedTeamMember);
      
      toast({
        title: "Team Member Allocated",
        description: "Team member has been assigned to this opportunity. Notification sent.",
      });
      
      setShowTeamAllocationDialog(false);
      setSelectedTeamMember('');
    } catch (error) {
      toast({
        title: "Failed to Allocate",
        description: "Failed to allocate team member. Please try again.",
        variant: "destructive"
      });
    }
  };

  const isEntityAdmin = true; // Temporarily force to true for testing
  // const isEntityAdmin = user?.role?.includes('ENTITY_ADMIN') || user?.role?.includes('ORGANIZATION_ADMIN');

  if (loading) {
    return (
      <DashboardLayout userType={layoutUserType}>
        <div className="container mx-auto px-4 py-6 space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-32" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!bid) {
    return (
      <DashboardLayout userType={layoutUserType}>
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Bid Not Found</h2>
            <p className="text-gray-600 mb-6">
              The bid you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/service-requests">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Opportunities
              </Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType={layoutUserType}>
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
              <h1 className="text-2xl font-bold text-gray-900">Bid Details</h1>
              <p className="text-gray-600">{bid.bidNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(bid.status)}>
              {getStatusIcon(bid.status)}
              <span className="ml-1">{bid.status.replace('_', ' ')}</span>
            </Badge>
            {[BidStatus.SUBMITTED, BidStatus.UNDER_REVIEW].includes(bid.status) && (
              <Link to={`/bids/${bid.id}/edit`}>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Bid
                </Button>
              </Link>
            )}
            {bid.status === BidStatus.UNDER_NEGOTIATION && (
              <Button onClick={() => setShowUpdateBidDialog(true)}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Update Bid
              </Button>
            )}
            {isEntityAdmin && (
              <Button variant="outline" onClick={() => setShowTeamAllocationDialog(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Allocate Team
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="negotiation">Negotiation</TabsTrigger>
                <TabsTrigger value="structured">Structured</TabsTrigger>
                <TabsTrigger value="queries">Queries</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Bid Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Service Provider</h4>
                      <p className="text-gray-600">{bid.providerName}</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Additional Inputs & Approach</h4>
                      <p className="text-gray-600">{bid.additionalInputs}</p>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Delivery Date</h4>
                        <p className="text-gray-600 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {format(bid.deliveryDate, 'dd MMMM yyyy')}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Submitted On</h4>
                        <p className="text-gray-600 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {format(bid.submittedAt, 'dd MMMM yyyy, HH:mm')}
                        </p>
                      </div>
                    </div>

                    {bid.isInvited && (
                      <>
                        <Separator />
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">Invited Bid</span>
                          </div>
                          <p className="text-sm text-blue-700 mt-1">
                            This service provider was specifically invited to submit this bid.
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="financials" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Financial Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Professional Fees</span>
                          <span className="font-medium">₹{(bid.financials?.professionalFee ?? 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Regulatory Payouts</span>
                          <span className="font-medium">₹{(bid.financials?.reimbursements?.regulatoryStatutoryPayouts ?? 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">OPE</span>
                          <span className="font-medium">₹{(bid.financials?.reimbursements?.opeProfessionalTeam ?? 0).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="border-l pl-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                          <p className="text-2xl font-bold text-gray-900">
                            ₹{(bid.financials?.totalBidAmount ?? 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Payment Structure</h4>
                      <Badge variant="outline">
                        {bid.financials.paymentStructure === PaymentStructure.MILESTONE_BASED 
                          ? 'Milestone Based' 
                          : 'Lump Sum'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Bid Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2" />
                        <div>
                          <p className="font-medium text-gray-900">Bid Submitted</p>
                          <p className="text-sm text-gray-600">
                            {format(bid.submittedAt, 'dd MMMM yyyy, HH:mm')}
                          </p>
                        </div>
                      </div>
                      
                      {bid.status === BidStatus.UNDER_REVIEW && (
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2" />
                          <div>
                            <p className="font-medium text-gray-900">Under Review</p>
                            <p className="text-sm text-gray-600">Currently being evaluated</p>
                          </div>
                        </div>
                      )}

                      {bid.status === BidStatus.UNDER_NEGOTIATION && (
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                          <div>
                            <p className="font-medium text-gray-900">Under Negotiation</p>
                            <p className="text-sm text-gray-600">Terms are being negotiated</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-gray-300 rounded-full mt-2" />
                        <div>
                          <p className="font-medium text-gray-400">Expected Delivery</p>
                          <p className="text-sm text-gray-400">
                            {format(bid.deliveryDate, 'dd MMMM yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="negotiation" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Handshake className="h-4 w-4" />
                        Negotiation Thread
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        {bid.negotiationThread?.inputs?.length || 0} messages in this negotiation
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {bid.negotiationThread?.inputs?.map((input, index) => (
                          <div key={input.id} className={`flex ${input.senderType === 'provider' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-lg p-4 ${
                              input.senderType === 'provider' 
                                ? 'bg-blue-50 border border-blue-200' 
                                : 'bg-gray-50 border border-gray-200'
                            }`}>
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  input.senderType === 'provider' ? 'bg-blue-600' : 'bg-gray-600'
                                }`} />
                                <span className="text-sm font-medium">
                                  {input.senderType === 'provider' ? 'Service Provider' : 'Service Seeker'}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {format(new Date(input.timestamp), 'dd MMM yyyy, HH:mm')}
                                </span>
                              </div>
                              
                              {input.reason && (
                                <div className="mb-2">
                                  <Badge variant="outline" className="text-xs">
                                    {input.reason.replace('_', ' ').toUpperCase()}
                                  </Badge>
                                </div>
                              )}
                              
                              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                                {input.message}
                              </p>
                              
                              {input.proposedChanges && Array.isArray(input.proposedChanges) && input.proposedChanges.length > 0 && (
                                <div className="mt-3 p-3 bg-white rounded border">
                                  <h5 className="text-xs font-medium text-gray-700 mb-2">Proposed Changes:</h5>
                                  <div className="space-y-1">
                                    {input.proposedChanges.map((change, changeIndex) => (
                                      <div key={changeIndex} className="text-xs text-gray-600">
                                        <span className="font-medium">{change.field}:</span> {change.currentValue} → {change.proposedValue}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {input.attachments && input.attachments.length > 0 && (
                                <div className="mt-3">
                                  <h5 className="text-xs font-medium text-gray-700 mb-2">Attachments:</h5>
                                  <div className="space-y-1">
                                    {input.attachments.map((attachment, attachIndex) => (
                                      <div key={attachIndex} className="flex items-center gap-2 text-xs text-blue-600">
                                        <FileText className="h-3 w-3" />
                                        <span>{attachment.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {(!bid.negotiationThread?.inputs || bid.negotiationThread.inputs.length === 0) && (
                        <div className="text-center py-8 text-gray-500">
                          <Handshake className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p>No negotiation messages yet</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

              <TabsContent value="structured" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Structured Negotiation Framework
                    </CardTitle>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                      <p className="text-sm text-blue-800">
                        <Shield className="h-4 w-4 inline mr-1" />
                        System monitors all negotiations for quality and compliance
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Service Seeker Inputs Display */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Service Seeker Negotiation Requests</h4>
                      <div className="space-y-4">
                        {bid.negotiationThread?.inputs?.filter(input => input.senderType === 'seeker').map((input, index) => (
                          <div key={input.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline" className="text-xs">
                                {input.reason?.replace('_', ' ').toUpperCase()}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {format(new Date(input.timestamp), 'dd MMM yyyy, HH:mm')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-900 mb-3">{input.message}</p>
                            
                            {input.proposedChanges && Array.isArray(input.proposedChanges) && input.proposedChanges.length > 0 && (
                              <div className="bg-white rounded border p-3">
                                <h5 className="text-xs font-medium text-gray-700 mb-2">Requested Changes:</h5>
                                <div className="space-y-1">
                                  {input.proposedChanges.map((change, changeIndex) => (
                                    <div key={changeIndex} className="text-xs text-gray-600">
                                      <span className="font-medium">{change.field}:</span> {change.currentValue} → {change.proposedValue}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Provider Response Section */}
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <Button 
                                size="sm" 
                                onClick={() => {
                                  setSelectedReason(input.reason || '');
                                  setShowStructuredNegotiation(true);
                                }}
                              >
                                <Send className="h-4 w-4 mr-2" />
                                Respond to Request
                              </Button>
                            </div>
                          </div>
                        ))}
                        
                        {(!bid.negotiationThread?.inputs || bid.negotiationThread.inputs.filter(input => input.senderType === 'seeker').length === 0) && (
                          <div className="text-center py-8 text-gray-500">
                            <Eye className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <p>No negotiation requests from service seeker yet</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Provider Responses Display */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Your Responses</h4>
                      <div className="space-y-4">
                        {bid.negotiationThread?.inputs?.filter(input => input.senderType === 'provider').map((input, index) => (
                          <div key={input.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <Badge className="bg-blue-100 text-blue-800 text-xs">
                                YOUR RESPONSE: {input.reason?.replace('_', ' ').toUpperCase()}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {format(new Date(input.timestamp), 'dd MMM yyyy, HH:mm')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-900">{input.message}</p>
                          </div>
                        ))}
                        
                        {(!bid.negotiationThread?.inputs || bid.negotiationThread.inputs.filter(input => input.senderType === 'provider').length === 0) && (
                          <div className="text-center py-6 text-gray-500">
                            <p className="text-sm">No responses submitted yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="queries" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      Queries & Clarifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Query Submission */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Raise New Query</h4>
                      <Button onClick={() => setShowQueryDialog(true)}>
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Ask Question
                      </Button>
                    </div>

                    {/* Query History */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Query History</h4>
                      <div className="space-y-4">
                        {/* Mock query data - replace with actual data */}
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">PRIVATE QUERY</Badge>
                            <span className="text-xs text-gray-500">2 days ago</span>
                          </div>
                          <p className="text-sm text-gray-900 mb-2">
                            Can you clarify the specific compliance requirements for this project?
                          </p>
                          <div className="bg-green-50 border border-green-200 rounded p-3 mt-3">
                            <p className="text-xs font-medium text-green-800 mb-1">Service Seeker Response:</p>
                            <p className="text-sm text-green-700">
                              Please refer to the attached compliance checklist. All items must be completed before project delivery.
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-center py-6 text-gray-500">
                          <p className="text-sm">Additional queries will appear here</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Service Request Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Service Request
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link to={`/service-requests/${bid.serviceRequestId}`}>
                  <Button variant="outline" className="w-full">
                    View Service Request
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* Negotiate button for submitted/under review bids */}
                {[BidStatus.SUBMITTED, BidStatus.UNDER_REVIEW].includes(bid.status) && (
                  <Button 
                    className="w-full justify-start"
                    onClick={() => setShowNegotiateDialog(true)}
                  >
                    <Handshake className="h-4 w-4 mr-2" />
                    Negotiate Terms
                  </Button>
                )}
                
                {/* Query button for all active bids */}
                {[BidStatus.SUBMITTED, BidStatus.UNDER_REVIEW, BidStatus.UNDER_NEGOTIATION].includes(bid.status) && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setShowQueryDialog(true)}
                  >
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Ask Question
                  </Button>
                )}
                
                {/* Chat button for negotiation status */}
                {bid.status === BidStatus.UNDER_NEGOTIATION && (
                  <Button 
                    className="w-full justify-start"
                    onClick={() => setShowChat(true)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Open Chat
                  </Button>
                )}

                {/* View Negotiation History for closed bids */}
                {/**
                 * Temporarily disabled. Original conditional rendering kept for reference.
                 *
                 * {[BidStatus.ACCEPTED, BidStatus.REJECTED].includes(bid.status) && (
                 *   <Button 
                 *     variant="outline"
                 *     className="w-full justify-start"
                 *     onClick={() => setShowNegotiationHistoryDialog(true)}
                 *   >
                 *     <History className="h-4 w-4 mr-2" />
                 *     View Negotiation History
                 *   </Button>
                 * )}
                 */}
                
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download Bid
                </Button>

                {[BidStatus.SUBMITTED, BidStatus.UNDER_REVIEW, BidStatus.UNDER_NEGOTIATION].includes(bid.status) && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-600 hover:text-red-700"
                    onClick={handleWithdrawBid}
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Withdraw Bid
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Status History */}
            <Card>
              <CardHeader>
                <CardTitle>Status History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Current Status</span>
                    <Badge className={getStatusColor(bid.status)} variant="outline">
                      {bid.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="text-gray-900">
                      {format(bid.updatedAt, 'dd/MM/yyyy')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Chat Component */}
        {showChat && bid && user && (
          <ServiceRequestChat
            serviceRequestId={bid.serviceRequestId}
            bidId={bid.id}
            currentUserId={user.id}
            currentUserRole={ChatParticipantRole.SERVICE_PROVIDER}
            isOpen={showChat}
            onClose={() => setShowChat(false)}
          />
        )}

        {/* Negotiate Dialog */}
        <Dialog open={showNegotiateDialog} onOpenChange={setShowNegotiateDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Negotiate Bid Terms</DialogTitle>
              <DialogDescription>
                Propose changes to your bid {bid?.bidNumber}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="negotiateType">Negotiation Type</Label>
                <Select value={negotiateType} onValueChange={(value: 'price' | 'timeline' | 'scope' | 'terms') => setNegotiateType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price Adjustment</SelectItem>
                    <SelectItem value="timeline">Timeline Extension</SelectItem>
                    <SelectItem value="scope">Scope Modification</SelectItem>
                    <SelectItem value="terms">Terms & Conditions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="negotiateMessage">Negotiation Details</Label>
                <Textarea 
                  id="negotiateMessage"
                  value={negotiateMessage}
                  onChange={(e) => setNegotiateMessage(e.target.value)}
                  placeholder="Explain your proposed changes and reasoning..."
                  rows={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNegotiateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleNegotiate} disabled={!negotiateMessage.trim()}>
                Submit Negotiation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Query Dialog */}
        <Dialog open={showQueryDialog} onOpenChange={setShowQueryDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ask Question</DialogTitle>
              <DialogDescription>
                Send a query about service request for {bid?.bidNumber}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="queryType">Query Type</Label>
                <Select value={queryType} onValueChange={(value: 'public' | 'private') => setQueryType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private (Only to Client)</SelectItem>
                    <SelectItem value="public">Public (Visible to All Bidders)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="queryMessage">Your Question</Label>
                <Textarea 
                  id="queryMessage"
                  value={queryMessage}
                  onChange={(e) => setQueryMessage(e.target.value)}
                  placeholder="Ask your question about the service request..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowQueryDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleQuery} disabled={!queryMessage.trim()}>
                Send Query
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Structured Negotiation Dialog */}
        <Dialog open={showStructuredNegotiation} onOpenChange={setShowStructuredNegotiation}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Structured Negotiation Response</DialogTitle>
              <DialogDescription>
                Respond to negotiation request using structured fields (Reason: {selectedReason.replace('_', ' ')})
              </DialogDescription>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
                <p className="text-sm text-yellow-800">
                  <Shield className="h-4 w-4 inline mr-1" />
                  System will review and monitor this negotiation for quality and compliance
                </p>
              </div>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Timeline Changes */}
              {(selectedReason === 'timeline_extension' || selectedReason === 'scope_change') && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Propose Revised Delivery Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="revisedDate">Expected Revised Completion Date</Label>
                      <Input
                        id="revisedDate"
                        type="date"
                        value={structuredInputs.revisedDeliveryDate}
                        onChange={(e) => setStructuredInputs(prev => ({...prev, revisedDeliveryDate: e.target.value}))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="timelineReason">Reason for Timeline Change (max 250 characters)</Label>
                      <Textarea
                        id="timelineReason"
                        value={structuredInputs.timelineChangeReason}
                        onChange={(e) => setStructuredInputs(prev => ({...prev, timelineChangeReason: e.target.value}))}
                        placeholder="Explain rationale for revised timeline (e.g., resource availability, dependency delays, additional requirements)"
                        maxLength={250}
                        rows={3}
                      />
                      <p className="text-xs text-gray-500 mt-1">{structuredInputs.timelineChangeReason.length}/250 characters</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Additional Information Request */}
              {(selectedReason === 'clarification_request' || selectedReason === 'scope_change') && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Request Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="clarificationResponse">Clarification or Response</Label>
                      <Textarea
                        id="clarificationResponse"
                        value={structuredInputs.clarificationResponse}
                        onChange={(e) => setStructuredInputs(prev => ({...prev, clarificationResponse: e.target.value}))}
                        placeholder="Enter detailed responses or explanations to queries raised by the Service Seeker"
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="supportingDocs">Attach Pre-Uploaded Supporting Documents (Optional)</Label>
                      <Select value={structuredInputs.supportingDocuments} onValueChange={(value) => setStructuredInputs(prev => ({...prev, supportingDocuments: value}))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select from verified profile documents" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="company_profile">Company Profile Document</SelectItem>
                          <SelectItem value="certification">Professional Certification</SelectItem>
                          <SelectItem value="portfolio">Portfolio Sample</SelectItem>
                          <SelectItem value="compliance_cert">Compliance Certificate</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500 mt-1">
                        Only pre-uploaded and system-approved documents can be attached. Names and contact details will be masked by AI.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Fee Adjustment */}
              {(selectedReason === 'price_negotiation' || selectedReason === 'scope_change') && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Adjust Fee or Offer Counter Price</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="counterPrice">Proposed Counter Price (₹)</Label>
                      <Input
                        id="counterPrice"
                        type="number"
                        value={structuredInputs.counterPrice}
                        onChange={(e) => setStructuredInputs(prev => ({...prev, counterPrice: e.target.value}))}
                        placeholder="Enter revised fee proposal"
                      />
                    </div>
                    <div>
                      <Label htmlFor="feeTitle">Label or Fee Title</Label>
                      <Input
                        id="feeTitle"
                        value={structuredInputs.feeTitle}
                        onChange={(e) => setStructuredInputs(prev => ({...prev, feeTitle: e.target.value}))}
                        placeholder="e.g., Revised Fee – Phase 1, Retainer Fee"
                      />
                    </div>
                    <div>
                      <Label htmlFor="priceJustification">Justification for Price Change</Label>
                      <Textarea
                        id="priceJustification"
                        value={structuredInputs.priceJustification}
                        onChange={(e) => setStructuredInputs(prev => ({...prev, priceJustification: e.target.value}))}
                        placeholder="Brief explanation outlining why the fee has been adjusted (e.g., scope expansion, complexity, added services)"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Structure Change */}
              {(selectedReason === 'payment_terms' || selectedReason === 'price_negotiation') && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Change Payment Structure</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="paymentStructure">Select New Payment Model</Label>
                      <Select value={structuredInputs.paymentStructure} onValueChange={(value) => setStructuredInputs(prev => ({...prev, paymentStructure: value}))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose payment structure" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lump_sum">Lump Sum</SelectItem>
                          <SelectItem value="milestone_based">Milestone-Based</SelectItem>
                          <SelectItem value="monthly_retainer">Monthly Retainer</SelectItem>
                          <SelectItem value="usage_based">Usage-Based Billing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {structuredInputs.paymentStructure === 'milestone_based' && (
                      <div>
                        <Label htmlFor="milestones">Define Milestones</Label>
                        <Textarea
                          id="milestones"
                          value={structuredInputs.milestones}
                          onChange={(e) => setStructuredInputs(prev => ({...prev, milestones: e.target.value}))}
                          placeholder="Milestone Name | Amount | Due Date&#10;Phase 1 Completion | ₹50,000 | 15 Jan 2024&#10;Phase 2 Delivery | ₹75,000 | 30 Jan 2024"
                          rows={4}
                        />
                      </div>
                    )}
                    <div>
                      <Label htmlFor="paymentRationale">Rationale for Change</Label>
                      <Textarea
                        id="paymentRationale"
                        value={structuredInputs.paymentRationale}
                        onChange={(e) => setStructuredInputs(prev => ({...prev, paymentRationale: e.target.value}))}
                        placeholder="Outline the reason for changing the payment structure (e.g., better alignment with delivery phases or risk distribution)"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Response Message */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Response Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="responseMessage">Response Message</Label>
                    <Textarea
                      id="responseMessage"
                      value={negotiateMessage}
                      onChange={(e) => setNegotiateMessage(e.target.value)}
                      placeholder="Enter your response message to the service seeker's negotiation request..."
                      rows={4}
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This message will accompany your structured response fields above.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Restricted Chat Notice */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">Important: Restricted Communication</h4>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• Pricing terms must be submitted via designated fields above</li>
                  <li>• Contact details cannot be shared in free-text chat</li>
                  <li>• Confidential information must use structured fields only</li>
                  <li>• All communications are monitored for compliance</li>
                </ul>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowStructuredNegotiation(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Response Submitted",
                  description: "Your structured negotiation response has been sent to the service seeker.",
                });
                setShowStructuredNegotiation(false);
                // Reset form
                setStructuredInputs({
                  revisedDeliveryDate: '',
                  timelineChangeReason: '',
                  clarificationResponse: '',
                  supportingDocuments: '',
                  counterPrice: '',
                  feeTitle: '',
                  priceJustification: '',
                  paymentStructure: '',
                  milestones: '',
                  paymentRationale: ''
                });
              }}>
                Submit Response
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Update Bid Dialog */}
        <Dialog open={showUpdateBidDialog} onOpenChange={setShowUpdateBidDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Update Bid After Negotiation</DialogTitle>
              <DialogDescription>
                Update your bid details based on negotiation outcomes for {bid?.bidNumber}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="updatedDeliveryDate">Revised Delivery Date</Label>
                  <Input
                    id="updatedDeliveryDate"
                    type="date"
                    value={updatedBid.deliveryDate}
                    onChange={(e) => setUpdatedBid(prev => ({...prev, deliveryDate: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="updatedProfessionalFee">Professional Fee (₹)</Label>
                  <Input
                    id="updatedProfessionalFee"
                    type="number"
                    value={updatedBid.professionalFee}
                    onChange={(e) => setUpdatedBid(prev => ({...prev, professionalFee: e.target.value}))}
                    placeholder="Enter revised professional fee"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="updatedPaymentStructure">Payment Structure</Label>
                <Select value={updatedBid.paymentStructure} onValueChange={(value) => setUpdatedBid(prev => ({...prev, paymentStructure: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment structure" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lump_sum">Lump Sum</SelectItem>
                    <SelectItem value="milestone_based">Milestone-Based</SelectItem>
                    <SelectItem value="monthly_retainer">Monthly Retainer</SelectItem>
                    <SelectItem value="usage_based">Usage-Based Billing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {updatedBid.paymentStructure === 'milestone_based' && (
                <div>
                  <Label htmlFor="updatedMilestones">Payment Milestones</Label>
                  <Textarea
                    id="updatedMilestones"
                    value={updatedBid.milestones}
                    onChange={(e) => setUpdatedBid(prev => ({...prev, milestones: e.target.value}))}
                    placeholder="Milestone Name | Amount | Due Date&#10;Phase 1 | ₹50,000 | 15 Jan 2024"
                    rows={4}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="updatedAdditionalInputs">Updated Approach & Additional Inputs</Label>
                <Textarea
                  id="updatedAdditionalInputs"
                  value={updatedBid.additionalInputs}
                  onChange={(e) => setUpdatedBid(prev => ({...prev, additionalInputs: e.target.value}))}
                  placeholder="Updated approach based on negotiation discussions..."
                  rows={4}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Work Order Status</h4>
                <p className="text-sm text-blue-800">
                  After updating your bid, the Service Seeker will have options to:
                </p>
                <ul className="text-sm text-blue-800 mt-2 space-y-1">
                  <li>• Accept the Bid and Proceed to Work Order</li>
                  <li>• Reject the Bid</li>
                  <li>• Renegotiate Again</li>
                </ul>
                <p className="text-sm text-blue-800 mt-2">
                  Your bid remains editable until Work Order confirmation.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUpdateBidDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateBid}>
                <Save className="h-4 w-4 mr-2" />
                Update Bid
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Team Allocation Dialog */}
        <Dialog open={showTeamAllocationDialog} onOpenChange={setShowTeamAllocationDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Allocate Team Member</DialogTitle>
              <DialogDescription>
                Assign a team member to opportunity {bid?.bidNumber}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">SRN Number</h4>
                <p className="text-sm text-gray-600">{bid?.serviceRequestId}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => setShowTeamAllocationDialog(false)}
                >
                  Remove from Selection
                </Button>
              </div>

              <div>
                <Label htmlFor="teamMemberSelect">Select Team Member</Label>
                <Select value={selectedTeamMember} onValueChange={setSelectedTeamMember}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose team member to assign" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name} - {member.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2">Assignment Notification</h4>
                <p className="text-sm text-yellow-800">
                  The selected team member will receive email and push notifications about this opportunity allocation.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTeamAllocationDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleTeamAllocation} disabled={!selectedTeamMember}>
                <UserPlus className="h-4 w-4 mr-2" />
                Assign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Negotiation History Dialog */}
        <Dialog open={showNegotiationHistoryDialog} onOpenChange={setShowNegotiationHistoryDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Complete Negotiation History</DialogTitle>
              <DialogDescription>
                Full chat history and agreed terms for {bid?.bidNumber}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Service Seeker Inputs */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Service Seeker Negotiation Inputs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bid?.negotiationThread?.inputs?.filter(input => input.senderType === 'seeker').map((input, index) => (
                      <div key={input.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">
                            {input.reason?.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {format(new Date(input.timestamp), 'dd MMM yyyy, HH:mm')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-900">{input.message}</p>
                        {input.proposedChanges && Array.isArray(input.proposedChanges) && input.proposedChanges.length > 0 && (
                          <div className="mt-3 p-3 bg-white rounded border">
                            <h5 className="text-xs font-medium text-gray-700 mb-2">Requested Changes:</h5>
                            <div className="space-y-1">
                              {input.proposedChanges.map((change, changeIndex) => (
                                <div key={changeIndex} className="text-xs text-gray-600">
                                  <span className="font-medium">{change.field}:</span> {change.currentValue} → {change.proposedValue}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Provider Responses */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Responses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bid?.negotiationThread?.inputs?.filter(input => input.senderType === 'provider').map((input, index) => (
                      <div key={input.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-blue-100 text-blue-800">
                            YOUR RESPONSE: {input.reason?.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {format(new Date(input.timestamp), 'dd MMM yyyy, HH:mm')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-900">{input.message}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Final Agreed Terms */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Final Agreed Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Final Delivery Date</h4>
                      <p className="text-gray-600">{format(bid?.deliveryDate || new Date(), 'dd MMMM yyyy')}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Final Amount</h4>
                      <p className="text-gray-600">₹{(bid?.financials?.totalBidAmount || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Payment Structure</h4>
                      <p className="text-gray-600">
                        {bid?.financials?.paymentStructure === PaymentStructure.MILESTONE_BASED ? 'Milestone Based' : 'Lump Sum'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Status</h4>
                      <Badge className={getStatusColor(bid?.status || BidStatus.SUBMITTED)}>
                        {bid?.status?.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowNegotiationHistoryDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default BidDetails;
