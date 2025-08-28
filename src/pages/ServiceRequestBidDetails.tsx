import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin
} from "lucide-react";
import { serviceRequestService } from "@/services/serviceRequestService";
import ServiceRequestChat from "@/components/chat/ServiceRequestChat";
import { ChatParticipantRole } from "@/types/chat";
import { workOrderService } from "@/services/workOrderService";
import { ServiceRequest, Bid, BidStatus, QueryClarification } from "@/types/serviceRequest";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { getUserTypeFromRole } from "@/utils/userTypeUtils";

const ServiceRequestBidDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const layoutUserType = getUserTypeFromRole(user?.role);
  const isServiceSeeker = layoutUserType === 'service_seeker';
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
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
  const [showNegotiationHistory, setShowNegotiationHistory] = useState(false);
  const [selectedBidForHistory, setSelectedBidForHistory] = useState<Bid | null>(null);

  const [showChat, setShowChat] = useState(false);
  const [chatBidId, setChatBidId] = useState<string>("");
  const [initialChatMessage, setInitialChatMessage] = useState<string>("");

  const [showAskDialog, setShowAskDialog] = useState(false);
  const [askBidId, setAskBidId] = useState<string>("");
  const [askMessage, setAskMessage] = useState<string>("");
  const [askType, setAskType] = useState<'public' | 'private'>("public");
  const [queriesByBid, setQueriesByBid] = useState<Record<string, QueryClarification[]>>({});

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [srData, bidsData] = await Promise.all([
        serviceRequestService.getServiceRequestById(id),
        serviceRequestService.getBidsForServiceRequest(id)
      ]);
      setServiceRequest(srData);
      setBids(bidsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load service request details.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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



  const handleSendAsk = async () => {
    if (!askMessage.trim() || !askBidId || !serviceRequest) return;
    try {
      await serviceRequestService.postBidQuery(
        serviceRequest.id,
        askBidId,
        askMessage.trim(),
        askType === 'public'
      );
      const updated = await serviceRequestService.getQueriesForBid(serviceRequest.id, askBidId);
      setQueriesByBid(prev => ({ ...prev, [askBidId]: updated }));
      toast({ title: 'Query Posted', description: 'Your query has been posted.' });
      setShowAskDialog(false);
      setAskMessage("");
      setAskBidId("");
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to post query.', variant: 'destructive' });
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

  // Checkbox selection handlers
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

  const handleBulkRenegotiate = async () => {
    try {
      const selectedBidIds = Array.from(selectedBids);
      // Mock implementation for renegotiation
      await Promise.all(selectedBidIds.map(bidId => 
        serviceRequestService.updateBidStatus(bidId, BidStatus.UNDER_REVIEW)
      ));
      toast({
        title: "Renegotiation Initiated",
        description: `Renegotiation has been initiated for ${selectedBidIds.length} bid(s).`,
      });
      setSelectedBids(new Set());
      setShowBulkActions(false);
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate renegotiation for selected bids.",
        variant: "destructive"
      });
    }
  };



  const handleSendReply = async () => {
    if (!replyMessage.trim() || !replyData) return;

    try {
      await serviceRequestService.postReply(
        serviceRequest!.id,
        replyData.parentQueryId,
        replyMessage.trim(),
        replyType === 'public'
      );
      // refresh queries for this bid
      const updated = await serviceRequestService.getQueriesForBid(serviceRequest!.id, replyData.bidId);
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
  const handleReplyToResponse = (responseId: string, originalResponse: string, bidderName: string = "Bidder") => {
    setReplyData({
      responseId,
      parentQueryId: responseId,
      originalResponse,
      bidderName,
      bidId: askBidId
    });
    setReplyMessage('');
    setReplyType('public');
    setShowReplyDialog(true);
  };

  const handleAcceptBidWithWorkOrder = async (bidId: string) => {
    try {
      toast({
        title: "Redirecting",
        description: "Taking you to bid summary & payment...",
      });
      // Navigate to bid acceptance summary page
      navigate(`/service-requests/${id}/bid-summary?bidId=${bidId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to navigate to bid summary.",
        variant: "destructive"
      });
    }
  };

  const handleNegotiateBid = async (bidId: string) => {
    try {
      await serviceRequestService.updateBidStatus(bidId, BidStatus.UNDER_REVIEW);
      toast({
        title: "Renegotiation Initiated",
        description: `Renegotiation has been initiated for the selected bid.`,
      });
      fetchData();

      setChatBidId(bidId);
      setInitialChatMessage(
        `Hi, we have initiated renegotiation on your bid. Could we discuss possible revisions to the fee and/or delivery timeline?`
      );
      setShowChat(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate renegotiation for this bid.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <DashboardLayout userType={layoutUserType}>
        <div className="container mx-auto p-6">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!serviceRequest) {
    return (
      <DashboardLayout userType={layoutUserType}>
        <div className="container mx-auto p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Service Request Not Found</h2>
            <Button onClick={() => navigate("/service-requests")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Service Requests
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType={layoutUserType}>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/service-requests")}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{serviceRequest.title}</h1>
              <p className="text-gray-600">SRN: {serviceRequest.srnNumber}</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>

        {/* Service Request Summary */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="flex items-center text-gray-900">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Service Request Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-600">Budget Range</p>
                <p className="text-lg font-semibold text-gray-900">
                  ₹{serviceRequest.budgetRange.min.toLocaleString()} - ₹{serviceRequest.budgetRange.max.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Deadline</p>
                <p className="text-lg font-semibold text-gray-900">
                  {format(serviceRequest.workRequiredBy, 'dd MMM yyyy')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Bids Received</p>
                <p className="text-lg font-semibold text-blue-600">{bids.length} Bids</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Bids Table */}
            <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Received Bids ({bids.length})</h2>
            <div className="text-sm text-gray-600">
              {bids.filter(bid => bid.status === BidStatus.SUBMITTED || bid.status === BidStatus.UNDER_REVIEW).length} Active Bids
            </div>
          </div>

          {/* Bulk Action UI */}
          {isServiceSeeker && showBulkActions && selectedBids.size > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-blue-800">
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
                      variant="outline"
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

                      {/* Ask Query Dialog */}
                      <Dialog open={showAskDialog} onOpenChange={setShowAskDialog}>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Raise Query</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-3">
                            <Label htmlFor="askVisibility">Visibility</Label>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant={askType === 'public' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setAskType('public')}
                              >
                                Public
                              </Button>
                              <Button
                                type="button"
                                variant={askType === 'private' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setAskType('private')}
                              >
                                Private
                              </Button>
                            </div>
                            <Label htmlFor="askMessage">Message</Label>
                            <Textarea id="askMessage" value={askMessage} onChange={(e) => setAskMessage(e.target.value)} rows={4} />
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setShowAskDialog(false)}>Cancel</Button>
                            <Button onClick={handleSendAsk} disabled={!askMessage.trim()}>Send</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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
                        {bids.map((bid) => (
                          <td key={bid.id} className="p-3 text-center font-semibold text-gray-900 border-r border-gray-200 last:border-r-0">
                            ₹{bid.financials.professionalFee.toLocaleString()}
                          </td>
                        ))}
                      </tr>

                      {/* Platform Fee */}
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-900 bg-gray-50 border-r border-gray-200">Platform's Fee</td>
                        <td className="p-3 bg-gray-50 border-r border-gray-200"></td>
                        {bids.map((bid) => (
                          <td key={bid.id} className="p-3 text-center text-gray-900 border-r border-gray-200 last:border-r-0">
                            ₹{bid.financials.platformFee.toLocaleString()}
                          </td>
                        ))}
                      </tr>

                      {/* GST */}
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-900 bg-gray-50 border-r border-gray-200">GST on above</td>
                        <td className="p-3 bg-gray-50 border-r border-gray-200"></td>
                        {bids.map((bid) => (
                          <td key={bid.id} className="p-3 text-center text-gray-900 border-r border-gray-200 last:border-r-0">
                            ₹{bid.financials.gst.toLocaleString()}
                          </td>
                        ))}
                      </tr>

                      {/* Reimbursements */}
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-900 bg-gray-50 border-r border-gray-200">Reimbursements</td>
                        <td className="p-3 bg-gray-50 border-r border-gray-200"></td>
                        {bids.map((bid) => (
                          <td key={bid.id} className="p-3 text-center text-gray-900 border-r border-gray-200 last:border-r-0">
                            ₹{bid.financials.reimbursements?.toLocaleString() || '0'}
                          </td>
                        ))}
                      </tr>

                      {/* Regulatory/Statutory Payouts */}
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-900 bg-gray-50 border-r border-gray-200">- Regulatory/Statutory Payouts</td>
                        <td className="p-3 bg-gray-50 border-r border-gray-200"></td>
                        {bids.map((bid) => (
                          <td key={bid.id} className="p-3 text-center text-gray-900 border-r border-gray-200 last:border-r-0">
                            ₹{bid.financials.regulatoryPayouts?.toLocaleString() || '0'}
                          </td>
                        ))}
                      </tr>

                      {/* OPE */}
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-900 bg-gray-50 border-r border-gray-200">- OPE of the Professional Team</td>
                        <td className="p-3 bg-gray-50 border-r border-gray-200"></td>
                        {bids.map((bid) => (
                          <td key={bid.id} className="p-3 text-center text-gray-900 border-r border-gray-200 last:border-r-0">
                            ₹{bid.financials.ope?.toLocaleString() || '0'}
                          </td>
                        ))}
                      </tr>

                      {/* Total Bid Amount */}
                      <tr className="border-b border-gray-200 bg-yellow-100 font-semibold">
                        <td className="p-3 font-bold text-gray-900 bg-yellow-200 border-r border-gray-200">TOTAL BID AMOUNT</td>
                        <td className="p-3 bg-yellow-200 border-r border-gray-200"></td>
                        {bids.map((bid) => (
                          <td key={bid.id} className="p-3 text-center font-bold text-green-700 border-r border-gray-200 last:border-r-0 bg-yellow-100">
                            ₹{bid.financials.totalAmount.toLocaleString()}
                          </td>
                        ))}
                      </tr>

                      {/* Payment Structure */}
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-900 bg-gray-50 border-r border-gray-200">Payment %/ Amount</td>
                        <td className="p-3 bg-gray-50 border-r border-gray-200"></td>
                        {bids.map((bid) => (
                          <td key={bid.id} className="p-3 text-center text-gray-900 border-r border-gray-200 last:border-r-0">
                            <div className="text-sm">
                              {bid.financials.paymentStructure.replace('_', ' ')}
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* Stage 1 */}
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-900 bg-gray-50 border-r border-gray-200">Stage 1</td>
                        <td className="p-3 bg-gray-50 border-r border-gray-200"></td>
                        {bids.map((bid) => (
                          <td key={bid.id} className="p-3 text-center text-gray-900 border-r border-gray-200 last:border-r-0">
                            {bid.financials.milestones && bid.financials.milestones[0] ? 
                              `₹${bid.financials.milestones[0].amount.toLocaleString()}` : 
                              '-'
                            }
                          </td>
                        ))}
                      </tr>

                      {/* Stage 2 */}
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-900 bg-gray-50 border-r border-gray-200">Stage 2</td>
                        <td className="p-3 bg-gray-50 border-r border-gray-200"></td>
                        {bids.map((bid) => (
                          <td key={bid.id} className="p-3 text-center text-gray-900 border-r border-gray-200 last:border-r-0">
                            {bid.financials.milestones && bid.financials.milestones[1] ? 
                              `₹${bid.financials.milestones[1].amount.toLocaleString()}` : 
                              '-'
                            }
                          </td>
                        ))}
                      </tr>

                      {/* Delivery Date */}
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-900 bg-gray-50 border-r border-gray-200">Delivery of Work By</td>
                        <td className="p-3 bg-gray-50 border-r border-gray-200"></td>
                        {bids.map((bid) => (
                          <td key={bid.id} className="p-3 text-center text-gray-900 border-r border-gray-200 last:border-r-0">
                            {format(bid.deliveryDate, 'dd/MM/yyyy')}
                          </td>
                        ))}
                      </tr>

                      {/* Additional Information */}
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-900 bg-gray-50 border-r border-gray-200">Additional Inputs provided by Bidders</td>
                        <td className="p-3 bg-gray-50 border-r border-gray-200"></td>
                        {bids.map((bid) => (
                          <td key={bid.id} className="p-3 text-center text-gray-900 border-r border-gray-200 last:border-r-0">
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

                     

                      {/* Action Buttons Row - Last Row */}
                      <tr className="border-t-2 border-gray-300 bg-gray-50">
                        <td className="p-3 font-semibold text-gray-900 bg-gray-100 border-r border-gray-200">Actions</td>
                        <td className="p-3 bg-gray-100 border-r border-gray-200"></td>
                        {bids.map((bid) => (
                          <td key={bid.id} className="p-3 text-center border-r border-gray-200 last:border-r-0">
                            <div className="flex flex-col space-y-2">
                              {isServiceSeeker ? (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white text-xs"
                                    onClick={() => handleAcceptBidWithWorkOrder(bid.id)}
                                  >
                                    Accept
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="text-xs"
                                    onClick={() => handleRejectBid(bid.id)}
                                  >
                                    Reject
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-orange-300 text-orange-700 hover:bg-orange-50 text-xs"
                                    onClick={() => handleNegotiateBid(bid.id)}
                                  >
                                    Renegotiate
                                  </Button>
                                </>
                              ) : (
                                <div className="text-xs text-gray-500 py-2">
                                  Service Seeker Actions Only
                                </div>
                              )}
                              {bid.negotiationThread && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-blue-300 text-blue-700 hover:bg-blue-50 text-xs"
                                  onClick={() => {
                                    setSelectedBidForHistory(bid);
                                    setShowNegotiationHistory(true);
                                  }}
                                >
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
          </div>

          {/* Sidebar - Actions for Service Providers */}
          {!isServiceSeeker && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full bg-slate-700 hover:bg-slate-800 text-white"
                    onClick={() => {
                      // Handle negotiate terms
                      toast({
                        title: "Negotiate Terms",
                        description: "Opening negotiation interface...",
                      });
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Negotiate Terms
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setShowAskDialog(true);
                    }}
                  >
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Ask Question
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                    onClick={() => {
                      toast({
                        title: "Download Started",
                        description: "Your bid is being downloaded...",
                      });
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Bid
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-red-200 text-red-700 hover:bg-red-50"
                    onClick={() => {
                      toast({
                        title: "Withdraw Bid",
                        description: "Are you sure you want to withdraw your bid?",
                        variant: "destructive"
                      });
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Withdraw Bid
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Reply Dialog */}
        <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Reply to Query Response</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {replyData && (
                <div className="bg-gray-50 p-3 rounded border">
                  <div className="text-sm font-medium text-gray-700">Original Response from {replyData.bidderName}:</div>
                  <div className="text-sm text-gray-600 mt-1">{replyData.originalResponse}</div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="replyType">Message Type</Label>
                <Select value={replyType} onValueChange={(value: 'public' | 'private') => setReplyType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select message type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Public (visible to all bidders)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="private">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>Private (visible only to this bidder)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="replyMessage">Your Reply</Label>
                <Textarea
                  id="replyMessage"
                  placeholder="Type your reply here..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <div className="text-sm text-blue-800">
                  <strong>Preview:</strong> This {replyType} message will be sent to {replyType === 'public' ? 'all bidders' : replyData?.bidderName || 'the selected bidder'}.
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowReplyDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSendReply}
                disabled={!replyMessage.trim()}
                className={replyType === 'public' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-600 hover:bg-orange-700'}
              >
                Send {replyType === 'public' ? 'Public' : 'Private'} Reply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Negotiation Dialog */}
        <Dialog open={showNegotiationDialog} onOpenChange={setShowNegotiationDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Negotiate Bid Terms</DialogTitle>
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="negotiationReason">Reason for Negotiation</Label>
                <Textarea
                  id="negotiationReason"
                  placeholder="Explain why you want to negotiate these terms"
                  rows={3}
                />
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
                onClick={() => {
                  toast({
                    title: "Negotiation Initiated",
                    description: "Negotiation request has been sent to the bidder.",
                  });
                  setShowNegotiationDialog(false);
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
            </DialogHeader>
            {selectedBidForHistory?.negotiationThread && (
              <div className="space-y-6">
                {/* Negotiation Summary */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">Negotiation Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Status:</span>
                      <Badge className={`ml-2 ${
                        selectedBidForHistory.negotiationThread.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : selectedBidForHistory.negotiationThread.status === 'active'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedBidForHistory.negotiationThread.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Initiated By:</span>
                      <span className="ml-2 capitalize">{selectedBidForHistory.negotiationThread.initiatedBy}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Started:</span>
                      <span className="ml-2">{format(selectedBidForHistory.negotiationThread.initiatedAt, 'dd MMM yyyy, hh:mm a')}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Last Activity:</span>
                      <span className="ml-2">{format(selectedBidForHistory.negotiationThread.lastActivity, 'dd MMM yyyy, hh:mm a')}</span>
                    </div>
                  </div>
                </div>

                {/* Negotiation Thread */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Negotiation Thread</h3>
                  {selectedBidForHistory.negotiationThread.inputs.map((input, index) => (
                    <div key={input.id} className={`p-4 rounded-lg border ${
                      input.senderType === 'seeker' 
                        ? 'bg-blue-50 border-blue-200 ml-8' 
                        : 'bg-gray-50 border-gray-200 mr-8'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge className={`${
                            input.senderType === 'seeker' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {input.senderType === 'seeker' ? 'Service Seeker' : 'Service Provider'}
                          </Badge>
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
                                  {input.proposedChanges.financials.totalAmount && (
                                    <div>Total Amount: ₹{input.proposedChanges.financials.totalAmount.toLocaleString()}</div>
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
                        <span className="ml-2 font-semibold text-green-700">₹{selectedBidForHistory.financials.totalAmount.toLocaleString()}</span>
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
                // Export negotiation history
                toast({
                  title: "Export Started",
                  description: "Negotiation history is being exported to PDF.",
                });
              }}>
                <Download className="h-4 w-4 mr-2" />
                Export History
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      {/* Chat Dialog */}
      <Dialog open={showChat} onOpenChange={setShowChat}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Chat - Bid Communication</DialogTitle>
          </DialogHeader>
          {showChat && serviceRequest && (
            <ServiceRequestChat
              serviceRequestId={serviceRequest.id}
              bidId={chatBidId}
              currentUserId="seeker-001"
              currentUserRole={ChatParticipantRole.SERVICE_SEEKER}
              isOpen={showChat}
              onClose={() => {
                setShowChat(false);
                setChatBidId("");
                setInitialChatMessage("");
              }}
              initialMessage={initialChatMessage}
            />
          )}
        </DialogContent>
      </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ServiceRequestBidDetails;
