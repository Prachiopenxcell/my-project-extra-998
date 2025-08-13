import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { ServiceRequest, Bid, BidStatus } from "@/types/serviceRequest";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

const ServiceRequestBidDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [srData, bidsData] = await Promise.all([
        serviceRequestService.getServiceRequestById(id!),
        serviceRequestService.getBidsForServiceRequest(id!)
      ]);
      setServiceRequest(srData);
      setBids(bidsData);
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

  const handleAcceptBid = async (bidId: string) => {
    try {
      await serviceRequestService.acceptBid(bidId);
      toast({
        title: "Bid Accepted",
        description: "The bid has been accepted successfully.",
      });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept bid.",
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

  if (loading) {
    return (
      <DashboardLayout userType="service_seeker">
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
      <DashboardLayout userType="service_seeker">
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
    <DashboardLayout userType="service_seeker">
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

        {/* Bids Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Received Bids ({bids.length})</h2>
            <div className="text-sm text-gray-600">
              {bids.filter(bid => bid.status === BidStatus.SUBMITTED || bid.status === BidStatus.UNDER_REVIEW).length} Active Bids
            </div>
          </div>

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
                        {bids.map((bid, index) => (
                          <th key={bid.id} className="text-center p-4 min-w-[180px] bg-gray-50 border-r border-gray-200 last:border-r-0">
                            <div className="space-y-2">
                              <div className="font-semibold text-gray-900 text-sm">Bidder {index + 1}</div>
                              <div className="font-medium text-gray-800">{bid.providerName}</div>
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
                                <span className="ml-1">{bid.status.replace('_', ' ').toUpperCase()}</span>
                              </Badge>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {/* Financial Bids Header */}
                      <tr className="bg-green-500">
                        <td colSpan={bids.length + 1} className="p-3 text-center font-semibold text-white">
                          Financial Bids
                        </td>
                      </tr>
                      
                      {/* Professional Fee */}
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-900 bg-gray-50 border-r border-gray-200">Professional Fee</td>
                        {bids.map((bid) => (
                          <td key={bid.id} className="p-3 text-center font-semibold text-gray-900 border-r border-gray-200 last:border-r-0">
                            ₹{bid.financials.professionalFee.toLocaleString()}
                          </td>
                        ))}
                      </tr>

                      {/* Platform Fee */}
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-900 bg-gray-50 border-r border-gray-200">Platform's Fee</td>
                        {bids.map((bid) => (
                          <td key={bid.id} className="p-3 text-center text-gray-900 border-r border-gray-200 last:border-r-0">
                            ₹{bid.financials.platformFee.toLocaleString()}
                          </td>
                        ))}
                      </tr>

                      {/* GST */}
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-900 bg-gray-50 border-r border-gray-200">GST on above</td>
                        {bids.map((bid) => (
                          <td key={bid.id} className="p-3 text-center text-gray-900 border-r border-gray-200 last:border-r-0">
                            ₹{bid.financials.gst.toLocaleString()}
                          </td>
                        ))}
                      </tr>

                      {/* Reimbursements */}
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-900 bg-gray-50 border-r border-gray-200">Reimbursements</td>
                        {bids.map((bid) => (
                          <td key={bid.id} className="p-3 text-center text-gray-900 border-r border-gray-200 last:border-r-0">
                            ₹{bid.financials.reimbursements?.toLocaleString() || '0'}
                          </td>
                        ))}
                      </tr>

                      {/* Regulatory/Statutory Payouts */}
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-900 bg-gray-50 border-r border-gray-200">- Regulatory/Statutory Payouts</td>
                        {bids.map((bid) => (
                          <td key={bid.id} className="p-3 text-center text-gray-900 border-r border-gray-200 last:border-r-0">
                            ₹{bid.financials.regulatoryPayouts?.toLocaleString() || '0'}
                          </td>
                        ))}
                      </tr>

                      {/* OPE */}
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-900 bg-gray-50 border-r border-gray-200">- OPE of the Professional Team</td>
                        {bids.map((bid) => (
                          <td key={bid.id} className="p-3 text-center text-gray-900 border-r border-gray-200 last:border-r-0">
                            ₹{bid.financials.ope?.toLocaleString() || '0'}
                          </td>
                        ))}
                      </tr>

                      {/* Total Bid Amount */}
                      <tr className="border-b border-gray-200 bg-yellow-100 font-semibold">
                        <td className="p-3 font-bold text-gray-900 bg-yellow-200 border-r border-gray-200">TOTAL BID AMOUNT</td>
                        {bids.map((bid) => (
                          <td key={bid.id} className="p-3 text-center font-bold text-green-700 border-r border-gray-200 last:border-r-0 bg-yellow-100">
                            ₹{bid.financials.totalAmount.toLocaleString()}
                          </td>
                        ))}
                      </tr>

                      {/* Payment Structure */}
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-900 bg-gray-50 border-r border-gray-200">Payment %/ Amount</td>
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
                        {bids.map((bid) => (
                          <td key={bid.id} className="p-3 text-center text-gray-900 border-r border-gray-200 last:border-r-0">
                            {format(bid.deliveryDate, 'dd/MM/yyyy')}
                          </td>
                        ))}
                      </tr>

                      {/* Additional Information */}
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-900 bg-gray-50 border-r border-gray-200">Additional Inputs provided by Bidders</td>
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

                      {/* Query/Clarification Section */}
                      <tr className="bg-green-500">
                        <td colSpan={bids.length + 1} className="p-3 text-center font-semibold text-white">
                          Raise Query/Seek Clarification, if any
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td colSpan={bids.length + 1} className="p-4 bg-gray-50">
                          <div className="space-y-3">
                            <div className="bg-blue-50 border border-blue-200 rounded p-3">
                              <div className="flex items-start space-x-2">
                                <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium">Q1</div>
                                <div className="text-sm text-gray-800">
                                  <strong>Query:</strong> Can you provide more details about the valuation methodology you will use for this merger case?
                                  <div className="text-xs text-gray-600 mt-1">Asked on: 15/01/2024 at 2:30 PM</div>
                                </div>
                              </div>
                            </div>
                            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                              <div className="flex items-start space-x-2">
                                <div className="bg-yellow-600 text-white text-xs px-2 py-1 rounded font-medium">Q2</div>
                                <div className="text-sm text-gray-800">
                                  <strong>Query:</strong> What is the expected timeline for each milestone and can you provide sample reports from similar projects?
                                  <div className="text-xs text-gray-600 mt-1">Asked on: 16/01/2024 at 10:15 AM</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>

                      {/* Clarification Received Section */}
                      <tr className="bg-green-500">
                        <td colSpan={bids.length + 1} className="p-3 text-center font-semibold text-white">
                          Clarification(s) Received
                        </td>
                      </tr>
                      {bids.map((bid, index) => (
                        <tr key={`clarification-${bid.id}`} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="p-3 font-medium text-gray-900 bg-gray-50 border-r border-gray-200">
                            Bidder {index + 1}
                          </td>
                          <td colSpan={bids.length} className="p-3 bg-gray-50 text-sm">
                            {index === 0 ? (
                              <div className="space-y-2">
                                <div className="bg-white border border-gray-200 rounded p-3">
                                  <div className="flex items-start space-x-2">
                                    <div className="bg-green-600 text-white text-xs px-2 py-1 rounded font-medium">R1</div>
                                    <div>
                                      <strong>Response to Q1:</strong> We will use DCF (Discounted Cash Flow) method combined with market multiple approach. Our methodology includes peer comparison analysis and will provide detailed assumptions and sensitivity analysis.
                                      <div className="text-xs text-gray-600 mt-1">Responded on: 16/01/2024 at 11:45 AM</div>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-white border border-gray-200 rounded p-3">
                                  <div className="flex items-start space-x-2">
                                    <div className="bg-green-600 text-white text-xs px-2 py-1 rounded font-medium">R2</div>
                                    <div>
                                      <strong>Response to Q2:</strong> Stage 1 will take 15 days, Stage 2 will take 10 days. We have attached sample reports from 3 similar merger valuations completed in the last 6 months.
                                      <div className="text-xs text-gray-600 mt-1">Responded on: 16/01/2024 at 3:20 PM</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : index === 1 ? (
                              <div className="space-y-2">
                                <div className="bg-white border border-gray-200 rounded p-3">
                                  <div className="flex items-start space-x-2">
                                    <div className="bg-green-600 text-white text-xs px-2 py-1 rounded font-medium">R1</div>
                                    <div>
                                      <strong>Response to Q1:</strong> Our approach includes Asset-based valuation, Income approach using DCF, and Market approach. We will provide comprehensive peer analysis with 10+ comparable companies and detailed risk assessment.
                                      <div className="text-xs text-gray-600 mt-1">Responded on: 16/01/2024 at 4:15 PM</div>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-white border border-gray-200 rounded p-3">
                                  <div className="flex items-start space-x-2">
                                    <div className="bg-orange-600 text-white text-xs px-2 py-1 rounded font-medium">P</div>
                                    <div>
                                      <strong>Response to Q2:</strong> <em>Response pending - will provide detailed timeline by 17/01/2024</em>
                                      <div className="text-xs text-gray-600 mt-1">Status: Pending</div>
                                    </div>
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

                      {/* Accept Bid Section */}
                      <tr className="bg-red-500">
                        <td colSpan={bids.length + 1} className="p-3 text-center">
                          <div className="text-white font-semibold">
                            Accept Bid of
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-3 font-medium text-gray-900 bg-red-50 border-r border-gray-200 text-sm">
                          <div className="text-red-800">
                            On clicking the chosen bidder tab, a new window bearing Work Order will be generated for FINAL Acceptance.
                          </div>
                        </td>
                        {bids.map((bid) => (
                          <td key={bid.id} className="p-3 text-center border-r border-gray-200 last:border-r-0">
                            {bid.status === BidStatus.SUBMITTED || bid.status === BidStatus.UNDER_REVIEW ? (
                              <Button 
                                size="sm" 
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => handleAcceptBid(bid.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Accept
                              </Button>
                            ) : bid.status === BidStatus.ACCEPTED ? (
                              <Button size="sm" className="w-full bg-green-600 text-white" disabled>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Accepted
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm" className="w-full" disabled>
                                {bid.status.replace('_', ' ')}
                              </Button>
                            )}
                          </td>
                        ))}
                      </tr>

                      {/* Final Note */}
                      <tr>
                        <td colSpan={bids.length + 1} className="p-4 text-xs text-gray-600 bg-gray-50 border-t border-gray-200">
                          <div className="space-y-1">
                            <p><strong>On Final Acceptance:</strong> Link for making Payment/blocking amount on credit card will be provided by System.</p>
                            <p><strong>On making Payment:</strong> Work Order will be generated for execution and issuance, requiring DSC/e-Sign/Print + Sign + Scan + Upload.</p>
                            <p><strong>A Payment receipt will also be generated.</strong></p>
                            <p><strong>On execution issuance:</strong> SRN will close and a Work Order will appear under Open Work Orders.</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ServiceRequestBidDetails;
