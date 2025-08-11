import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Clock, 
  Users, 
  Eye, 
  Download, 
  Upload, 
  MessageSquare, 
  Star,
  AlertTriangle,
  DollarSign,
  CalendarDays,
  CheckCircle,
  XCircle,
  Plus,
  ArrowLeft,
  UserPlus,
  AlertCircle,
  Clock3,
  Activity,
  User
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { workOrderService } from "@/services/workOrderService";
import { 
  WorkOrder, 
  WorkOrderStatus,
  FeeAdviceStatus
} from "@/types/workOrder";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const WorkOrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [showCreateFeeAdvice, setShowCreateFeeAdvice] = useState(false);
  const [showViewDocument, setShowViewDocument] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{id: string; label: string; category: string; uploadedAt: Date} | null>(null);
  const [selectedFeeAdvice, setSelectedFeeAdvice] = useState<{id: string; requestNumber: string; amount: number; description: string} | null>(null);

  const userType = user?.type === 'service_seeker' ? 'seeker' : 'provider';

  useEffect(() => {
    const fetchWorkOrder = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await workOrderService.getWorkOrderById(id);
        setWorkOrder(data);
      } catch (error) {
        console.error('Error fetching work order:', error);
        toast({
          title: "Error",
          description: "Failed to load work order details.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWorkOrder();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout userType={user?.type || "service_provider"}>
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

  if (!workOrder) {
    return (
      <DashboardLayout userType={user?.type || "service_provider"}>
        <div className="container mx-auto p-6">
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Work Order Not Found</h3>
              <p className="text-gray-500 mb-4">The requested work order could not be found.</p>
              <Button onClick={() => navigate('/work-orders')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Work Orders
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType={user?.type || "service_provider"}>
      <div className="container mx-auto p-6">
        <WorkOrderDetailsModule 
          workOrder={workOrder} 
          userType={userType}
          showCreateFeeAdvice={showCreateFeeAdvice}
          setShowCreateFeeAdvice={setShowCreateFeeAdvice}
          showViewDocument={showViewDocument}
          setShowViewDocument={setShowViewDocument}
          selectedDocument={selectedDocument}
          setSelectedDocument={setSelectedDocument}
          selectedFeeAdvice={selectedFeeAdvice}
          setSelectedFeeAdvice={setSelectedFeeAdvice}
        />
      </div>
    </DashboardLayout>
  );
};

interface WorkOrderDetailsModuleProps {
  workOrder: WorkOrder;
  userType: 'seeker' | 'provider';
  showCreateFeeAdvice: boolean;
  setShowCreateFeeAdvice: (show: boolean) => void;
  showViewDocument: boolean;
  setShowViewDocument: (show: boolean) => void;
  selectedDocument: {id: string; label: string; category: string; uploadedAt: Date} | null;
  setSelectedDocument: (doc: any) => void;
  selectedFeeAdvice: {id: string; requestNumber: string; amount: number; description: string} | null;
  setSelectedFeeAdvice: (advice: any) => void;
}

const WorkOrderDetailsModule = ({ 
  workOrder, 
  userType, 
  showCreateFeeAdvice, 
  setShowCreateFeeAdvice,
  showViewDocument,
  setShowViewDocument,
  selectedDocument,
  setSelectedDocument,
  selectedFeeAdvice,
  setSelectedFeeAdvice
}: WorkOrderDetailsModuleProps) => {
  const navigate = useNavigate();
  
  // Feedback dialog state
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 5,
    stage: 'during_execution',
    reviewSummary: '',
    suggestions: ''
  });

  // Handle feedback submission
  const handleSubmitFeedback = async () => {
    try {
      await workOrderService.provideFeedback(workOrder.id, {
        providedBy: userType === 'seeker' ? workOrder.serviceSeeker.id : workOrder.serviceProvider.id,
        providedByType: userType,
        stage: feedbackForm.stage as 'during_execution' | 'on_completion',
        rating: feedbackForm.rating,
        reviewSummary: feedbackForm.reviewSummary,
        suggestions: feedbackForm.suggestions
      });
      
      toast({
        title: "Success",
        description: "Feedback submitted successfully.",
      });
      
      setShowFeedbackDialog(false);
      setFeedbackForm({
        rating: 5,
        stage: 'during_execution',
        reviewSummary: '',
        suggestions: ''
      });
      
      // Refresh the page to show new feedback
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: WorkOrderStatus }) => {
    const getStatusColor = (status: WorkOrderStatus) => {
      switch (status) {
        case WorkOrderStatus.COMPLETED:
          return "bg-green-100 text-green-800 border-green-200";
        case WorkOrderStatus.IN_PROGRESS:
          return "bg-blue-100 text-blue-800 border-blue-200";
        case WorkOrderStatus.DISPUTED:
          return "bg-red-100 text-red-800 border-red-200";
        case WorkOrderStatus.ON_HOLD:
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case WorkOrderStatus.PAYMENT_PENDING:
        case WorkOrderStatus.PAYMENT_PENDING_COMPLETION:
          return "bg-orange-100 text-orange-800 border-orange-200";
        case WorkOrderStatus.SIGNATURE_PENDING:
          return "bg-purple-100 text-purple-800 border-purple-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };

    const getStatusLabel = (status: WorkOrderStatus) => {
      return status.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
    };

    return (
      <Badge className={`${getStatusColor(status)} border`}>
        {getStatusLabel(status)}
      </Badge>
    );
  };

  // Header component
  const WorkOrderHeader = () => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate('/work-orders')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900">{workOrder.woNumber}</h1>
            <StatusBadge status={workOrder.status} />
            {workOrder.referenceNumber && (
              <Badge variant="outline">Ref: {workOrder.referenceNumber}</Badge>
            )}
          </div>
          <p className="text-gray-600 mt-1">{workOrder.title}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {workOrder.status === WorkOrderStatus.IN_PROGRESS && (
          <>
            <Button variant="default">
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Complete
            </Button>
            <Button variant="destructive">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Raise Dispute
            </Button>
          </>
        )}
        
        <Button variant="outline">
          <Star className="h-4 w-4 mr-2" />
          Feedback
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <WorkOrderHeader />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="track-task">Track Task</TabsTrigger>
          <TabsTrigger value="payment">Payment & Fee Advices</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="allocation">WO Allocation</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Work Order Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Work Order Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">WO Number</label>
                    <p className="text-gray-900">{workOrder.woNumber}</p>
                  </div>
                  
                  {workOrder.referenceNumber && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Reference Number</label>
                      <p className="text-gray-900">{workOrder.referenceNumber}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Work Order Date</label>
                    <p className="text-gray-900">{format(workOrder.createdAt, 'dd/MM/yyyy')}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Expected Completion</label>
                    <p className="text-gray-900">{format(workOrder.timeline.expectedCompletionDate, 'dd/MM/yyyy')}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Party Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Party Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">From (Service Seeker)</h4>
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">{workOrder.serviceSeeker.name}</p>
                      <p className="text-gray-600">{workOrder.serviceSeeker.address}</p>
                      {workOrder.serviceSeeker.pan && <p>PAN: {workOrder.serviceSeeker.pan}</p>}
                      {workOrder.serviceSeeker.gst && <p>GST: {workOrder.serviceSeeker.gst}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">To (Service Provider)</h4>
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">{workOrder.serviceProvider.name}</p>
                      <p className="text-gray-600">{workOrder.serviceProvider.address}</p>
                      {workOrder.serviceProvider.pan && <p>PAN: {workOrder.serviceProvider.pan}</p>}
                      {workOrder.serviceProvider.gst && <p>GST: {workOrder.serviceProvider.gst}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Scope of Work */}
            <Card>
              <CardHeader>
                <CardTitle>Scope of Work</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{workOrder.scopeOfWork}</p>
                
                {workOrder.deliverables.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Deliverables</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {workOrder.deliverables.map((deliverable, index) => (
                        <li key={index}>{deliverable}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Financial Details */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Professional Fee</label>
                    <p className="text-lg font-semibold">₹{workOrder.financials.professionalFee.toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Platform Fee</label>
                    <p className="text-lg font-semibold">₹{workOrder.financials.platformFee.toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">GST</label>
                    <p className="text-lg font-semibold">₹{workOrder.financials.gst.toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Total Amount</label>
                    <p className="text-xl font-bold text-blue-600">₹{workOrder.financials.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="track-task" className="mt-6">
          <div className="space-y-6">
            {/* Task Milestones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock3 className="h-5 w-5 mr-2" />
                  Task Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workOrder.milestones.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No milestones defined for this work order.</p>
                ) : (
                  <div className="space-y-4">
                    {workOrder.milestones.map((milestone) => (
                      <div key={milestone.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                          <Badge className={
                            milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                            milestone.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            milestone.status === 'overdue' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {milestone.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">{milestone.description}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarDays className="h-4 w-4 mr-1" />
                          Due: {format(milestone.deliveryDate, 'dd/MM/yyyy')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Documents & Reports
                  </span>
                  <Button size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workOrder.documents.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No documents uploaded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {workOrder.documents.map((document) => (
                      <div key={document.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{document.name}</p>
                            <p className="text-sm text-gray-500">
                              {document.label} • Uploaded {format(document.uploadedAt, 'dd/MM/yyyy')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{document.category}</Badge>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedDocument(document);
                              setShowViewDocument(true);
                              toast({
                                title: "Document Viewer",
                                description: `Opening ${document.label}`,
                              });
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              toast({
                                title: "Download Started",
                                description: `Downloading ${document.label}`,
                              });
                            }}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payment" className="mt-6">
          <div className="space-y-6">
            {/* Payment Terms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Payment Terms
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workOrder.financials.paymentTerms.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No payment terms defined.</p>
                ) : (
                  <div className="space-y-3">
                    {workOrder.financials.paymentTerms.map((term) => (
                      <div key={term.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{term.stageLabel}</p>
                          <p className="text-sm text-gray-500">{term.amountPercentage}% of total amount</p>
                          {term.dueDate && (
                            <p className="text-sm text-gray-500">Due: {format(term.dueDate, 'dd/MM/yyyy')}</p>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <p className="text-lg font-semibold">₹{term.amount.toLocaleString()}</p>
                          <Badge className={
                            term.status === 'paid' ? 'bg-green-100 text-green-800' :
                            term.status === 'overdue' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {term.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Fee Advices */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Fee Advices</span>
                  {userType === 'provider' && (
                    <Button size="sm" onClick={() => setShowCreateFeeAdvice(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Fee Advice
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workOrder.financials.feeAdvices.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No fee advices raised.</p>
                ) : (
                  <div className="space-y-3">
                    {workOrder.financials.feeAdvices.map((feeAdvice) => (
                      <div key={feeAdvice.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium text-gray-900">{feeAdvice.requestNumber}</p>
                            <p className="text-sm text-gray-500">
                              {feeAdvice.date ? format(new Date(feeAdvice.date), 'dd/MM/yyyy') : 'Date not specified'}
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-lg font-semibold">₹{feeAdvice.amount.toLocaleString()}</p>
                            <Badge className={
                              feeAdvice.status === FeeAdviceStatus.PAID ? 'bg-green-100 text-green-800' :
                              feeAdvice.status === FeeAdviceStatus.ACCEPTED ? 'bg-blue-100 text-blue-800' :
                              feeAdvice.status === FeeAdviceStatus.REJECTED ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }>
                              {feeAdvice.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-2">{feeAdvice.description}</p>
                        
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedFeeAdvice(feeAdvice);
                              toast({
                                title: "Fee Advice Details",
                                description: `Viewing fee advice ${feeAdvice.requestNumber} for ₹${feeAdvice.amount.toLocaleString()}`,
                              });
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {userType === 'seeker' && feeAdvice.status === FeeAdviceStatus.PENDING && (
                            <>
                              <Button 
                                size="sm" 
                                variant="default"
                                onClick={() => {
                                  toast({
                                    title: "Fee Advice Accepted",
                                    description: `Fee advice ${feeAdvice.requestNumber} has been accepted`,
                                  });
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Accept
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => {
                                  toast({
                                    title: "Fee Advice Rejected",
                                    description: `Fee advice ${feeAdvice.requestNumber} has been rejected`,
                                  });
                                }}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Activity Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              {workOrder.activities.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No activities recorded yet.</p>
              ) : (
                <div className="space-y-4">
                  {workOrder.activities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        <Activity className="h-4 w-4 text-gray-400" />
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-gray-900">{activity.description}</p>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <span>By: {activity.performedBy}</span>
                          <span>{format(activity.timestamp, 'dd/MM/yyyy HH:mm')}</span>
                          <Badge variant="outline" className="text-xs">
                            {activity.type ? activity.type.replace('_', ' ').toLowerCase() : 'activity'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocation" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Team Member Allocation
                </span>
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Allocate Member
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {workOrder.teamMembers.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No team members allocated to this work order.</p>
              ) : (
                <div className="space-y-4">
                  {workOrder.teamMembers.map((member, index) => (
                    <div key={member.memberId || `member-${index}`} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium text-gray-900">{member.memberName}</p>
                          <p className="text-sm text-gray-500">{member.memberEmail}</p>
                        </div>
                        
                        <Badge className={
                          member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }>
                          {member.status ? member.status.toUpperCase() : 'UNKNOWN'}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        <p>Allocated by: {member.allocatedBy}</p>
                        <p>Date: {member.allocatedAt ? format(member.allocatedAt, 'dd/MM/yyyy') : 'Not specified'}</p>
                        <p>Access: {member.accessTabs ? member.accessTabs.length : 0} tabs</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Feedback
                </span>
                <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Feedback
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add Feedback</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="stage" className="text-right">
                          Stage
                        </Label>
                        <Select 
                          value={feedbackForm.stage} 
                          onValueChange={(value) => setFeedbackForm({...feedbackForm, stage: value})}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select stage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="during_execution">During Execution</SelectItem>
                            <SelectItem value="on_completion">On Completion</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="rating" className="text-right">
                          Rating
                        </Label>
                        <Select 
                          value={feedbackForm.rating.toString()} 
                          onValueChange={(value) => setFeedbackForm({...feedbackForm, rating: parseInt(value)})}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select rating" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Star</SelectItem>
                            <SelectItem value="2">2 Stars</SelectItem>
                            <SelectItem value="3">3 Stars</SelectItem>
                            <SelectItem value="4">4 Stars</SelectItem>
                            <SelectItem value="5">5 Stars</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="review" className="text-right">
                          Review
                        </Label>
                        <Textarea
                          id="review"
                          placeholder="Share your feedback..."
                          className="col-span-3"
                          value={feedbackForm.reviewSummary}
                          onChange={(e) => setFeedbackForm({...feedbackForm, reviewSummary: e.target.value})}
                        />
                      </div>
                      
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="suggestions" className="text-right">
                          Suggestions
                        </Label>
                        <Textarea
                          id="suggestions"
                          placeholder="Any suggestions for improvement..."
                          className="col-span-3"
                          value={feedbackForm.suggestions}
                          onChange={(e) => setFeedbackForm({...feedbackForm, suggestions: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowFeedbackDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSubmitFeedback} disabled={!feedbackForm.reviewSummary.trim()}>
                        Submit Feedback
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {workOrder.feedbacks.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No feedback provided yet.</p>
              ) : (
                <div className="space-y-4">
                  {workOrder.feedbacks.map((feedback) => (
                    <div key={feedback.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            ({feedback.rating}/5)
                          </span>
                        </div>
                        
                        <Badge variant="outline">
                          {feedback.stage.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-900 mb-2">{feedback.reviewSummary}</p>
                      
                      {feedback.suggestions && (
                        <p className="text-gray-600 text-sm mb-2">
                          <strong>Suggestions:</strong> {feedback.suggestions}
                        </p>
                      )}
                      
                      <div className="text-xs text-gray-500">
                        By: {feedback.providedBy} • {format(feedback.timestamp, 'dd/MM/yyyy HH:mm')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Fee Advice Dialog */}
      <Dialog open={showCreateFeeAdvice} onOpenChange={setShowCreateFeeAdvice}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Fee Advice</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                placeholder="Enter amount"
                className="col-span-3"
                type="number"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter description"
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowCreateFeeAdvice(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast({
                title: "Fee Advice Created",
                description: "Fee advice has been created and sent to client",
              });
              setShowCreateFeeAdvice(false);
            }}>
              Create Fee Advice
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Document Dialog */}
      <Dialog open={showViewDocument} onOpenChange={setShowViewDocument}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Document Viewer</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedDocument && (
              <div className="text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">{selectedDocument.label}</h3>
                <p className="text-sm text-gray-500 mb-4">Category: {selectedDocument.category}</p>
                <p className="text-sm text-gray-500">This is a preview of the document. In a real implementation, this would show the actual document content.</p>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setShowViewDocument(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkOrderDetails;
