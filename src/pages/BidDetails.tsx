import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  AlertCircle
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { serviceRequestService } from "@/services/serviceRequestService";
import { Bid, BidStatus, PaymentStructure } from "@/types/serviceRequest";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

const BidDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [bid, setBid] = useState<Bid | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (id) {
      fetchBidDetails();
    }
  }, [id]);

  const fetchBidDetails = async () => {
    try {
      setLoading(true);
      // Mock implementation - replace with actual API call
      const mockBid: Bid = {
        id: id || 'bid-001',
        bidNumber: 'BID2024001',
        serviceRequestId: 'sr-001',
        providerId: 'provider-001',
        providerName: 'Expert CA Services',
        financials: {
          professionalFee: 75000,
          platformFee: 0,
          gst: 0,
          reimbursements: 0,
          regulatoryPayouts: 2000,
          ope: 3000,
          totalAmount: 80000,
          paymentStructure: PaymentStructure.MILESTONE_BASED
        },
        deliveryDate: new Date('2024-02-10'),
        additionalInputs: 'Comprehensive valuation with market analysis including detailed financial modeling, risk assessment, and comparative market analysis. Our team will provide thorough documentation and regular progress updates.',
        status: BidStatus.SUBMITTED,
        documents: [],
        isInvited: false,
        submittedAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-16'),
        lastEditDate: new Date('2024-01-16')
      };
      setBid(mockBid);
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
  };

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

  if (!bid) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Bid Not Found
            </h3>
            <p className="text-gray-600 mb-4">
              The bid you're looking for doesn't exist or has been removed.
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
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
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
                          <span className="font-medium">₹{bid.financials.professionalFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Regulatory Payouts</span>
                          <span className="font-medium">₹{bid.financials.regulatoryPayouts.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">OPE</span>
                          <span className="font-medium">₹{bid.financials.ope.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="border-l pl-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                          <p className="text-2xl font-bold text-gray-900">
                            ₹{bid.financials.totalAmount.toLocaleString()}
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
                {bid.status === BidStatus.UNDER_NEGOTIATION && (
                  <Button className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Open Negotiation
                  </Button>
                )}
                
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
      </div>
    </DashboardLayout>
  );
};

export default BidDetails;
