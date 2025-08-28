import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Search, Star, MessageSquare, Eye, CheckCircle, XCircle, RotateCcw, FileText, Calendar, Building, Upload, Download } from 'lucide-react';
import { serviceRequestService } from '@/services/serviceRequestService';
import ServiceRequestChat from '@/components/chat/ServiceRequestChat';
import { Bid, BidStatus, PaymentStructure, BidFilters, ServiceRequestStatus } from '@/types/serviceRequest';
import { ChatParticipantRole } from '@/types/chat';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const BidsListing: React.FC = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [filteredBids, setFilteredBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('submittedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<BidFilters>({});
  const [showChat, setShowChat] = useState(false);
  const [chatBidId, setChatBidId] = useState<string>('');
  const [chatServiceRequestId, setChatServiceRequestId] = useState<string>('');
  const [initialChatMessage, setInitialChatMessage] = useState<string>('');

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchAllBids = async () => {
      try {
        setLoading(true);
        const serviceRequests = await serviceRequestService.getServiceRequests({
          status: [ServiceRequestStatus.BID_RECEIVED, ServiceRequestStatus.UNDER_NEGOTIATION, ServiceRequestStatus.BID_ACCEPTED]
        });
        
        const allBids: Bid[] = [];
        for (const sr of serviceRequests.data) {
          const bidsResponse = await serviceRequestService.getBidsForServiceRequest(sr.id);
          const bidsWithSRInfo = bidsResponse.map(bid => ({
            ...bid,
            serviceRequestTitle: sr.title,
            serviceRequestNumber: sr.srnNumber
          }));
          allBids.push(...bidsWithSRInfo);
        }
        setBids(allBids);
      } catch (error) {
        console.error('Error fetching bids:', error);
        toast({ title: "Error", description: "Failed to fetch bids.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchAllBids();
  }, [toast]);

  useEffect(() => {
    let filtered = [...bids];

    if (searchTerm) {
      filtered = filtered.filter(bid => 
        bid.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bid.bidNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (bid as Bid & { serviceRequestTitle?: string }).serviceRequestTitle?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(bid => filters.status!.includes(bid.status));
    }

    if (filters.amountRange) {
      filtered = filtered.filter(bid => 
        bid.financials.totalAmount >= (filters.amountRange!.min || 0) &&
        bid.financials.totalAmount <= (filters.amountRange!.max || Infinity)
      );
    }

    if (filters.invitedOnly) {
      filtered = filtered.filter(bid => bid.isInvited);
    }

    filtered.sort((a, b) => {
      if (a.isInvited && !b.isInvited) return -1;
      if (!a.isInvited && b.isInvited) return 1;
      return 0;
    });

    filtered.sort((a, b) => {
      let aValue: string | number | Date, bValue: string | number | Date;
      switch (sortBy) {
        case 'submittedAt':
          aValue = new Date(a.submittedAt);
          bValue = new Date(b.submittedAt);
          break;
        case 'totalAmount':
          aValue = a.financials.totalAmount;
          bValue = b.financials.totalAmount;
          break;
        default:
          aValue = new Date(a.submittedAt);
          bValue = new Date(b.submittedAt);
      }
      return sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });

    setFilteredBids(filtered);
  }, [bids, filters, sortBy, sortOrder, searchTerm]);

  const getBidStatusColor = (status: BidStatus) => {
    switch (status) {
      case BidStatus.ACCEPTED: return "bg-green-100 text-green-800 border-green-200";
      case BidStatus.REJECTED: return "bg-red-100 text-red-800 border-red-200";
      case BidStatus.UNDER_REVIEW: return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case BidStatus.SUBMITTED: return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleAcceptBid = async (bid: Bid) => {
    try {
      await serviceRequestService.acceptBid(bid.id);
      toast({ title: "Bid Accepted", description: "Redirecting to Work Order creation..." });
      navigate(`/work-orders/create?serviceRequestId=${bid.serviceRequestId}&bidId=${bid.id}`);
    } catch (error) {
      toast({ title: "Error", description: "Failed to accept bid.", variant: "destructive" });
    }
  };

  const handleViewDocuments = (bid: Bid) => {
    // Mock document viewing functionality
    toast({
      title: "Documents Viewer",
      description: `Viewing ${bid.documents.length} document(s) for ${bid.bidNumber}`,
    });
  };

  const handleOpenChat = (bid: Bid) => {
    setChatBidId(bid.id);
    setChatServiceRequestId(bid.serviceRequestId);
    setShowChat(true);
  };

  const handleRenegotiateBid = async (bid: Bid) => {
    try {
      await serviceRequestService.updateBidStatus(bid.id, BidStatus.UNDER_REVIEW);
      toast({ title: "Renegotiation Initiated", description: `Renegotiation started for ${bid.bidNumber}.` });
      // refresh list
      const serviceRequests = await serviceRequestService.getServiceRequests({
        status: [ServiceRequestStatus.BID_RECEIVED, ServiceRequestStatus.UNDER_NEGOTIATION, ServiceRequestStatus.BID_ACCEPTED]
      });
      const allBids: Bid[] = [];
      for (const sr of serviceRequests.data) {
        const bidsResponse = await serviceRequestService.getBidsForServiceRequest(sr.id);
        const bidsWithSRInfo = bidsResponse.map(b => ({
          ...b,
          serviceRequestTitle: sr.title,
          serviceRequestNumber: sr.srnNumber
        }));
        allBids.push(...bidsWithSRInfo);
      }
      setBids(allBids);

      setChatBidId(bid.id);
      setChatServiceRequestId(bid.serviceRequestId);
      setInitialChatMessage(
        `Hi, we have initiated renegotiation on your bid. Could we discuss possible revisions to the fee and/or delivery timeline?`
      );
      setShowChat(true);
    } catch (error) {
      toast({ title: "Error", description: "Failed to initiate renegotiation.", variant: "destructive" });
    }
  };

  const stats = {
    total: bids.length,
    submitted: bids.filter(b => b.status === BidStatus.SUBMITTED).length,
    underReview: bids.filter(b => b.status === BidStatus.UNDER_REVIEW).length,
    accepted: bids.filter(b => b.status === BidStatus.ACCEPTED).length,
    invited: bids.filter(b => b.isInvited).length
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Bids</h1>
            <p className="text-gray-600 mt-1">Manage all received bids across your service requests</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bids</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Submitted</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.submitted}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Under Review</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.underReview}</p>
                </div>
                <Eye className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Accepted</p>
                  <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Invited</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.invited}</p>
                </div>
                <Star className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search bids, providers, service requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={filters.status?.[0] || "all"}
                onValueChange={(value) => 
                  setFilters(prev => ({
                    ...prev,
                    status: value === "all" ? undefined : [value as BidStatus]
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value={BidStatus.SUBMITTED}>Submitted</SelectItem>
                  <SelectItem value={BidStatus.UNDER_REVIEW}>Under Review</SelectItem>
                  <SelectItem value={BidStatus.ACCEPTED}>Accepted</SelectItem>
                  <SelectItem value={BidStatus.REJECTED}>Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={`${sortBy}-${sortOrder}`}
                onValueChange={(value) => {
                  const [newSortBy, newSortOrder] = value.split('-');
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder as 'asc' | 'desc');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="submittedAt-desc">Latest First</SelectItem>
                  <SelectItem value="submittedAt-asc">Oldest First</SelectItem>
                  <SelectItem value="totalAmount-desc">Highest Amount</SelectItem>
                  <SelectItem value="totalAmount-asc">Lowest Amount</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => setFilters(prev => ({ ...prev, invitedOnly: !prev.invitedOnly }))}
                className={filters.invitedOnly ? "bg-blue-50 border-blue-200" : ""}
              >
                <Star className="h-4 w-4 mr-1" />
                Invited Only
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bids List */}
        <div className="space-y-4">
          {filteredBids.length === 0 ? (
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bids found</h3>
                <p className="text-gray-600">No bids match your current filters.</p>
              </CardContent>
            </Card>
          ) : (
            filteredBids.map((bid) => (
              <Card key={bid.id} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                    <div className="lg:col-span-4">
                      <div className="flex items-center space-x-2 mb-2">
                        {bid.isInvited && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                        <h3 className="font-semibold text-gray-900">{bid.bidNumber}</h3>
                        <Badge className={getBidStatusColor(bid.status)}>
                          {bid.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <Building className="h-3 w-3 inline mr-1" />
                        {bid.providerName}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <FileText className="h-3 w-3 inline mr-1" />
                        {(bid as Bid & { serviceRequestTitle?: string }).serviceRequestTitle}
                      </p>
                      <p className="text-xs text-gray-500">SR: {(bid as Bid & { serviceRequestNumber?: string }).serviceRequestNumber}</p>
                    </div>

                    <div className="lg:col-span-2">
                      <p className="text-lg font-bold text-gray-900">₹{bid.financials.totalAmount.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">{bid.financials.paymentStructure.replace('_', ' ')}</p>
                    </div>

                    <div className="lg:col-span-2">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          Delivery: {format(new Date(bid.deliveryDate), 'MMM dd, yyyy')}
                        </p>
                        <p className="text-xs text-gray-500">
                          Submitted: {format(new Date(bid.submittedAt), 'MMM dd, yyyy HH:mm')}
                        </p>
                        <p className="text-xs text-gray-500">
                          Last Edit: {format(new Date(bid.lastEditDate), 'MMM dd, yyyy HH:mm')}
                        </p>
                      </div>
                    </div>

                    {/* Documents */}
                    <div className="lg:col-span-2">
                      <div className="space-y-2">
                        {bid.documents.length > 0 ? (
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-600">
                              <FileText className="h-3 w-3 inline mr-1" />
                              {bid.documents.length} Document{bid.documents.length !== 1 ? 's' : ''}
                            </span>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  toast({
                                    title: "Upload Started",
                                    description: "Document upload functionality ready.",
                                  });
                                }}
                                className="h-6 px-2"
                              >
                                <Upload className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  toast({
                                    title: "Download Started",
                                    description: "Downloading bid documents...",
                                  });
                                }}
                                className="h-6 px-2"
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center p-2 bg-gray-50 rounded">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                toast({
                                  title: "Upload Started",
                                  description: "Document upload functionality ready.",
                                });
                              }}
                              className="text-gray-500"
                            >
                              <Upload className="h-3 w-3 mr-1" />
                              Upload
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:col-span-2">
                      <div className="space-y-2">
                        {/* Primary Actions Row */}
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => navigate(`/service-requests/${bid.serviceRequestId}`)}
                            className="flex-1"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View SR
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleOpenChat(bid)}
                            className="flex-1"
                          >
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Chat
                          </Button>
                        </div>
                        
                        {/* Secondary Actions Row - Only for Submitted Bids */}
                        {bid.status === BidStatus.SUBMITTED && (
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleAcceptBid(bid)} 
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Accept
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                toast({
                                  title: "Bid Rejected",
                                  description: "Bid rejection functionality ready.",
                                });
                              }}
                              className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                        
                        {/* Renegotiate Button - Full Width */}
                        {bid.status === BidStatus.SUBMITTED && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRenegotiateBid(bid)}
                            className="w-full"
                          >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Renegotiate
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Chat Dialog */}
        <Dialog open={showChat} onOpenChange={setShowChat}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Chat - Bid Communication</DialogTitle>
            </DialogHeader>
            {showChat && (
              <ServiceRequestChat
                serviceRequestId={chatServiceRequestId}
                bidId={chatBidId}
                currentUserId="seeker-001"
                currentUserRole={ChatParticipantRole.SERVICE_SEEKER}
                isOpen={showChat}
                onClose={() => {
                  setShowChat(false);
                  setChatBidId('');
                  setChatServiceRequestId('');
                  setInitialChatMessage('');
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

export default BidsListing;
