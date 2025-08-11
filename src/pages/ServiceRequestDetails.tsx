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
  MapPin, 
  User, 
  FileText, 
  DollarSign,
  Clock,
  Building,
  Phone,
  Mail,
  Download,
  MessageSquare,
  Edit,
  Eye
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { serviceRequestService } from "@/services/serviceRequestService";
import { ServiceRequest, Bid, ServiceRequestStatus, BidStatus, PaymentStructure } from "@/types/serviceRequest";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";

const ServiceRequestDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Check if user is a Service Seeker (can edit service requests)
  const isServiceSeeker = user?.role === UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER ||
                          user?.role === UserRole.SERVICE_SEEKER_ENTITY_ADMIN ||
                          user?.role === UserRole.SERVICE_SEEKER_TEAM_MEMBER;

  useEffect(() => {
    if (id) {
      fetchServiceRequestDetails();
      fetchBids();
    }
  }, [id]);

  const fetchServiceRequestDetails = async () => {
    try {
      setLoading(true);
      // Mock implementation - replace with actual API call
      const mockServiceRequest: ServiceRequest = {
        id: id || 'sr-001',
        srnNumber: 'SRN2024001',
        title: 'Company Valuation for Merger',
        description: 'Comprehensive valuation of company assets and liabilities for merger proceedings',
        serviceCategory: [],
        serviceTypes: [],
        scopeOfWork: 'Comprehensive valuation with detailed analysis',
        budgetRange: {
          min: 50000,
          max: 100000
        },
        budgetNotClear: false,
        documents: [],
        questionnaire: [],
        workRequiredBy: new Date('2024-02-15'),
        preferredLocations: ['Mumbai', 'Maharashtra'],
        invitedProfessionals: [],
        repeatPastProfessionals: [],
        status: ServiceRequestStatus.OPEN,
        createdBy: 'user-001',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        deadline: new Date('2024-01-30'),
        isAIAssisted: false
      };
      setServiceRequest(mockServiceRequest);
    } catch (error) {
      console.error('Error fetching service request details:', error);
      toast({
        title: "Error",
        description: "Failed to load service request details.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async () => {
    try {
      // Mock bids data
      const mockBids: Bid[] = [
        {
          id: 'bid-001',
          bidNumber: 'BID2024001',
          serviceRequestId: id || 'sr-001',
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
          additionalInputs: 'Comprehensive valuation with market analysis',
          status: BidStatus.SUBMITTED,
          documents: [],
          isInvited: false,
          submittedAt: new Date('2024-01-16'),
          updatedAt: new Date('2024-01-16'),
          lastEditDate: new Date('2024-01-16')
        }
      ];
      setBids(mockBids);
    } catch (error) {
      console.error('Error fetching bids:', error);
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
      default:
        return 'bg-gray-100 text-gray-800';
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
              <Link to={`/service-requests/${id}/edit`}>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="bids">Bids ({bids.length})</TabsTrigger>
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
                        <p className="text-gray-600">{serviceRequest.workRequiredBy ? format(serviceRequest.workRequiredBy, 'PPP') : 'Not specified'}</p>
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
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bids" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Submitted Bids</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bids.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No bids submitted yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bids.map((bid) => (
                          <div key={bid.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-medium text-gray-900">{bid.providerName}</h4>
                                <p className="text-sm text-gray-600">{bid.bidNumber}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-gray-900">₹{bid.financials.totalAmount.toLocaleString()}</p>
                                <p className="text-sm text-gray-600">
                                  Delivery: {format(bid.deliveryDate, 'dd/MM/yyyy')}
                                </p>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{bid.additionalInputs}</p>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline">{bid.status}</Badge>
                              <div className="flex items-center gap-2">
                                <Link to={`/bids/${bid.id}`}>
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-3 w-3 mr-1" />
                                    View
                                  </Button>
                                </Link>
                                <Button variant="outline" size="sm">
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  Chat
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No documents uploaded</p>
                    </div>
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
                    {format(serviceRequest.createdAt, 'dd/MM/yyyy')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Work Required By</span>
                  <span className="text-sm font-medium">
                    {serviceRequest.workRequiredBy ? format(serviceRequest.workRequiredBy, 'dd/MM/yyyy') : 'Not specified'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Deadline</span>
                  <span className="text-sm font-medium">
                    {format(serviceRequest.deadline, 'dd/MM/yyyy')}
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ServiceRequestDetails;
