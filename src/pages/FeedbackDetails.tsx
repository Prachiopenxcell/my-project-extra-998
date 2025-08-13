import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  Star, 
  Calendar, 
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  User,
  Building,
  Phone,
  Mail,
  MapPin,
  Download,
  Share2,
  ExternalLink
} from "lucide-react";
import { feedbackService } from "@/services/feedbackService";
import { 
  FeedbackItem,
  WorkOrderStatus,
  DisputeStatus,
  FeedbackStage
} from "@/types/feedback";
import { format } from "date-fns";

const FeedbackDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<FeedbackItem | null>(null);

  useEffect(() => {
    const loadFeedback = async () => {
      if (!id) {
        navigate('/feedback');
        return;
      }

      try {
        setLoading(true);
        const feedbackData = await feedbackService.getFeedbackById(id);
        if (feedbackData) {
          setFeedback(feedbackData);
        } else {
          toast({
            title: "Feedback Not Found",
            description: "The requested feedback could not be found.",
            variant: "destructive"
          });
          navigate('/feedback');
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load feedback details",
          variant: "destructive"
        });
        navigate('/feedback');
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  }, [id, navigate, toast]);

  const renderStarRating = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6"
    };

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : star <= rating
                ? 'fill-yellow-200 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className={`ml-2 font-medium ${size === 'lg' ? 'text-lg' : size === 'md' ? 'text-base' : 'text-sm'}`}>
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  const getStatusBadge = (status: WorkOrderStatus) => {
    const statusConfig = {
      [WorkOrderStatus.COMPLETED]: { label: 'Completed', className: 'bg-green-100 text-green-800' },
      [WorkOrderStatus.IN_PROGRESS]: { label: 'In Progress', className: 'bg-blue-100 text-blue-800' },
      [WorkOrderStatus.ON_HOLD]: { label: 'On Hold', className: 'bg-yellow-100 text-yellow-800' },
      [WorkOrderStatus.CANCELLED]: { label: 'Cancelled', className: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status];
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getDisputeBadge = (disputeStatus: DisputeStatus) => {
    if (disputeStatus === DisputeStatus.NONE) return null;
    
    const disputeConfig = {
      [DisputeStatus.RAISED]: { label: 'Dispute Raised', className: 'bg-red-100 text-red-800', icon: AlertTriangle },
      [DisputeStatus.UNDER_REVIEW]: { label: 'Under Review', className: 'bg-orange-100 text-orange-800', icon: Clock },
      [DisputeStatus.RESOLVED]: { label: 'Dispute Resolved', className: 'bg-green-100 text-green-800', icon: CheckCircle },
      [DisputeStatus.NONE]: { label: '', className: '', icon: null }
    };

    const config = disputeConfig[disputeStatus];
    const IconComponent = config.icon;

    return (
      <Badge variant="outline" className={config.className}>
        {IconComponent && <IconComponent className="w-3 h-3 mr-1" />}
        {config.label}
      </Badge>
    );
  };

  const handleDownloadReport = () => {
    toast({
      title: "Download Started",
      description: "Feedback report is being prepared for download"
    });
  };

  const handleShareFeedback = () => {
    toast({
      title: "Shared Successfully",
      description: "Feedback details have been shared"
    });
  };

  const handleViewWorkOrder = () => {
    if (feedback) {
      navigate(`/work-orders/${feedback.workOrderNumber.replace('WO#', '')}`);
    }
  };

  if (loading) {
    return (
      <DashboardLayout userType="service_provider">
        <div className="container mx-auto p-6">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!feedback) {
    return (
      <DashboardLayout userType="service_provider">
        <div className="container mx-auto p-6">
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Feedback Not Found</h3>
              <p className="text-gray-600 mb-4">The requested feedback could not be found.</p>
              <Button onClick={() => navigate('/feedback')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Feedback
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="service_provider">
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate('/feedback')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Feedback
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Feedback Details</h1>
                <p className="text-gray-600 mt-1">{feedback.workOrderNumber} - {feedback.serviceType}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleDownloadReport}>
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button variant="outline" onClick={handleShareFeedback}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button onClick={handleViewWorkOrder}>
                <ExternalLink className="w-4 h-4 mr-2" />
                View Work Order
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Feedback Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Overall Rating Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Overall Rating</span>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(feedback.status)}
                      {getDisputeBadge(feedback.disputeStatus)}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    {renderStarRating(feedback.overallRating, "lg")}
                    <p className="text-3xl font-bold text-gray-900 mt-2">{feedback.overallRating.toFixed(1)}/5</p>
                    <p className="text-gray-600 mt-1">Overall Rating</p>
                  </div>
                </CardContent>
              </Card>

              {/* Written Review */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Client Review
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-700 italic text-lg leading-relaxed">
                      "{feedback.writtenReview}"
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Submitted on {format(new Date(feedback.feedbackDate), 'dd MMM yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>Stage: {feedback.feedbackStage === FeedbackStage.FINAL_COMPLETION ? 'Final Completion' : 'During Execution'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rating Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Rating Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Timely Deliverables</span>
                      {renderStarRating(feedback.ratingBreakdown.timelyDeliverables)}
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Quality of Work</span>
                      {renderStarRating(feedback.ratingBreakdown.qualityOfWork)}
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Communication Skills</span>
                      {renderStarRating(feedback.ratingBreakdown.communicationSkills)}
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Client Feedback</span>
                      {renderStarRating(feedback.ratingBreakdown.clientFeedback)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Information */}
              {(feedback.hasAdditionalComments || feedback.concernsFlagged || feedback.adminReview) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {feedback.hasAdditionalComments && (
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-700">Additional comments provided by client</span>
                        </div>
                      )}
                      
                      {feedback.concernsFlagged && feedback.concernsFlagged.length > 0 && (
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                          <div>
                            <span className="text-sm font-medium text-gray-700">Concerns Flagged:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {feedback.concernsFlagged.map((concern, index) => (
                                <Badge key={index} variant="outline" className="bg-orange-50 text-orange-700">
                                  {concern}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {feedback.adminReview && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-700">Admin Review: {feedback.adminReview}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Service Seeker Info & Work Order Details */}
            <div className="space-y-6">
              {/* Service Seeker Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Service Seeker
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{feedback.serviceSeekerCompany}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">{feedback.serviceSeekerName}</span>
                    </div>
                    {/* Mock contact information */}
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">contact@{feedback.serviceSeekerCompany.toLowerCase().replace(/\s+/g, '')}.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">+91 98765 43210</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Mumbai, Maharashtra</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Work Order Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Work Order Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Work Order Number</span>
                      <p className="font-medium">{feedback.workOrderNumber}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Service Type</span>
                      <p className="font-medium">{feedback.serviceType}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Status</span>
                      <div className="mt-1">
                        {getStatusBadge(feedback.status)}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Feedback Date</span>
                      <p className="font-medium">{format(new Date(feedback.feedbackDate), 'dd MMM yyyy, hh:mm a')}</p>
                    </div>
                    {feedback.disputeStatus !== DisputeStatus.NONE && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Dispute Status</span>
                        <div className="mt-1">
                          {getDisputeBadge(feedback.disputeStatus)}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" onClick={handleViewWorkOrder}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Full Work Order
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={handleDownloadReport}>
                      <Download className="w-4 h-4 mr-2" />
                      Download Feedback Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={handleShareFeedback}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Feedback
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FeedbackDetails;
