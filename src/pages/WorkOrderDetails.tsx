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
import { Checkbox } from "@/components/ui/checkbox";
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
  FeeAdviceStatus,
  DisputeReason
} from "@/types/workOrder";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getUserTypeFromRole } from "@/utils/userTypeUtils";

const WorkOrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const layoutUserType = getUserTypeFromRole(user?.role);
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [showCreateFeeAdvice, setShowCreateFeeAdvice] = useState(false);
  const [showViewDocument, setShowViewDocument] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{id: string; label: string; category: string; uploadedAt: Date} | null>(null);
  const [selectedFeeAdvice, setSelectedFeeAdvice] = useState<{id: string; requestNumber: string; amount: number; description: string} | null>(null);

  const moduleUserType = layoutUserType === 'service_seeker' ? 'seeker' : 'provider';

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

  if (!workOrder) {
    return (
      <DashboardLayout userType={layoutUserType}>
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
    <DashboardLayout userType={layoutUserType}>
      <div className="container mx-auto p-6">
        <WorkOrderDetailsModule 
          workOrder={workOrder} 
          userType={moduleUserType}
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
  setSelectedDocument: (doc: {id: string; label: string; category: string; uploadedAt: Date} | null) => void;
  selectedFeeAdvice: {id: string; requestNumber: string; amount: number; description: string} | null;
  setSelectedFeeAdvice: (advice: {id: string; requestNumber: string; amount: number; description: string} | null) => void;
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
    suggestions: '',
    concerns: [] as string[]
  });

  // Dispute dialog state
  const [showDisputeDialog, setShowDisputeDialog] = useState(false);
  const [disputeForm, setDisputeForm] = useState<{ 
    reason: DisputeReason; 
    description: string; 
    supportingDocuments: File[];
    otherExplanation?: string;
  }>({
    reason: DisputeReason.MISSED_DEADLINE,
    description: '',
    supportingDocuments: [],
    otherExplanation: ''
  });

  // Fee advice dialog state
  const [showFeeAdviceDialog, setShowFeeAdviceDialog] = useState(false);
  const [feeAdviceAction, setFeeAdviceAction] = useState<'accept' | 'reject' | 'dispute'>('accept');
  const [feeAdviceRejectionReason, setFeeAdviceRejectionReason] = useState('');
  const [feeAdviceModification, setFeeAdviceModification] = useState('');

  // Team member allocation dialog state
  const [showAllocateDialog, setShowAllocateDialog] = useState(false);
  const [allocationForm, setAllocationForm] = useState({
    memberId: '',
    memberName: '',
    memberEmail: '',
    role: '',
    accessTabs: [] as string[]
  });

  // Messages and edit requests state
  const [showEditRequestDialog, setShowEditRequestDialog] = useState(false);
  const [editRequestForm, setEditRequestForm] = useState({
    requestType: 'scope_change' as 'scope_change' | 'timeline_change' | 'financial_change' | 'other',
    description: '',
    urgency: 'medium' as 'low' | 'medium' | 'high',
    supportingDocuments: [] as File[]
  });

  // Edit WO state for service providers
  const [showEditWODialog, setShowEditWODialog] = useState(false);
  const [isEditingWO, setIsEditingWO] = useState(false);

  // Service seeker WO action states
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [signatureType, setSignatureType] = useState<'digital' | 'esign' | 'print_sign_upload'>('digital');

  // Mark complete handler
  const handleMarkComplete = async () => {
    try {
      const ok = await workOrderService.markComplete(workOrder.id);
      if (ok) {
        toast({ title: 'Success', description: 'Work Order marked as completed.' });
        window.location.reload();
      } else {
        toast({ title: 'Failed', description: 'Unable to mark as complete.', variant: 'destructive' });
      }
    } catch (e) {
      toast({ title: 'Error', description: 'Something went wrong. Please try again.', variant: 'destructive' });
    }
  };

  // Raise dispute submit
  const handleSubmitDispute = async () => {
    if (!disputeForm.description.trim()) {
      toast({ title: 'Error', description: 'Description is required.', variant: 'destructive' });
      return;
    }
    
    if (disputeForm.reason === DisputeReason.OTHER && !disputeForm.otherExplanation?.trim()) {
      toast({ title: 'Error', description: 'Explanation is required for "Other" reason.', variant: 'destructive' });
      return;
    }

    try {
      const ok = await workOrderService.raiseDispute(workOrder.id, {
        raisedBy: userType === 'seeker' ? workOrder.serviceSeeker.id : workOrder.serviceProvider.id,
        raisedByType: userType,
        reason: disputeForm.reason,
        description: disputeForm.description,
        supportingDocuments: [] // Files will be processed separately
      });
      if (ok) {
        toast({ title: 'Dispute Raised', description: 'Your dispute has been recorded and will be reviewed by our team.' });
        setShowDisputeDialog(false);
        setDisputeForm({ 
          reason: DisputeReason.MISSED_DEADLINE, 
          description: '', 
          supportingDocuments: [],
          otherExplanation: ''
        });
        window.location.reload();
      } else {
        toast({ title: 'Failed', description: 'Could not raise dispute.', variant: 'destructive' });
      }
    } catch (e) {
      toast({ title: 'Error', description: 'Something went wrong. Please try again.', variant: 'destructive' });
    }
  };

  // Handle fee advice action
  const handleFeeAdviceAction = async (feeAdviceId: string, action: 'accept' | 'reject' | 'dispute') => {
    try {
      if (action === 'accept') {
        const ok = await workOrderService.acceptFeeAdvice(workOrder.id, feeAdviceId);
        if (ok) {
          toast({ title: 'Fee Advice Accepted', description: 'Proceeding to payment...' });
          // Redirect to payment page or show payment dialog
        }
      } else if (action === 'reject') {
        if (!feeAdviceRejectionReason.trim()) {
          toast({ title: 'Error', description: 'Rejection reason is required.', variant: 'destructive' });
          return;
        }
        const ok = await workOrderService.rejectFeeAdvice(workOrder.id, feeAdviceId, {
          reason: feeAdviceRejectionReason,
          modification: feeAdviceModification
        });
        if (ok) {
          toast({ title: 'Fee Advice Rejected', description: 'Your response has been sent to the service provider.' });
        }
      } else if (action === 'dispute') {
        // Open dispute dialog for fee advice
        setShowDisputeDialog(true);
        setDisputeForm(prev => ({ ...prev, reason: DisputeReason.INVALID_FEE_ADVICE }));
      }
      
      setShowFeeAdviceDialog(false);
      setFeeAdviceRejectionReason('');
      setFeeAdviceModification('');
      window.location.reload();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to process fee advice action.', variant: 'destructive' });
    }
  };

  // Handle file upload for dispute
  const handleDisputeFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setDisputeForm(prev => ({
      ...prev,
      supportingDocuments: [...prev.supportingDocuments, ...files]
    }));
  };

  // Remove dispute file
  const removeDisputeFile = (index: number) => {
    setDisputeForm(prev => ({
      ...prev,
      supportingDocuments: prev.supportingDocuments.filter((_, i) => i !== index)
    }));
  };

  // Handle edit request submission (for service seekers)
  const handleSubmitEditRequest = async () => {
    if (!editRequestForm.description.trim()) {
      toast({ title: 'Error', description: 'Please provide a description for the edit request.', variant: 'destructive' });
      return;
    }

    try {
      // Mock edit request submission - in real implementation, this would call workOrderService
      toast({ 
        title: 'Edit Request Sent', 
        description: 'Your edit request has been sent to the service provider.' 
      });
      
      setShowEditRequestDialog(false);
      setEditRequestForm({
        requestType: 'scope_change',
        description: '',
        urgency: 'medium',
        supportingDocuments: []
      });
      
      // Refresh to show new message
      window.location.reload();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to send edit request.', variant: 'destructive' });
    }
  };

  // Handle WO editing for service providers
  const handleEditWO = () => {
    setIsEditingWO(true);
    toast({ title: 'Edit Mode', description: 'Work Order is now in edit mode.' });
  };

  // Handle save WO changes
  const handleSaveWOChanges = async () => {
    try {
      // Mock save changes - in real implementation, this would call workOrderService
      toast({ 
        title: 'Changes Saved', 
        description: 'Work Order changes have been saved successfully.' 
      });
      
      setIsEditingWO(false);
      window.location.reload();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save changes.', variant: 'destructive' });
    }
  };

  // Service seeker action handlers
  const handlePreviewWO = () => {
    setShowPreviewDialog(true);
  };

  const handleDownloadWO = () => {
    // Mock download functionality
    toast({ 
      title: 'Download Started', 
      description: 'Work Order document is being downloaded...' 
    });
    
    // In real implementation, this would generate and download the WO PDF
    const link = document.createElement('a');
    link.href = '#'; // Would be actual PDF URL
    link.download = `WO_${workOrder.woNumber}.pdf`;
    link.click();
  };

  const handleAcceptWO = () => {
    // Mock payment completion for demo - in real implementation, this would redirect to payment gateway
    toast({ 
      title: 'Payment Processing', 
      description: 'Processing payment...' 
    });
    
    // Simulate payment completion after 2 seconds
    setTimeout(() => {
      toast({ 
        title: 'Payment Successful', 
        description: 'Payment completed successfully. Please sign the work order.' 
      });
      
      // Open signature dialog after payment completion
      setShowSignatureDialog(true);
    }, 2000);
  };

  const handleRejectWO = async () => {
    if (!rejectReason.trim()) {
      toast({ title: 'Error', description: 'Please provide a reason for rejection.', variant: 'destructive' });
      return;
    }

    try {
      // Mock rejection - in real implementation, this would call workOrderService
      toast({ 
        title: 'Work Order Rejected', 
        description: 'Work order has been rejected and feedback sent to service provider.' 
      });
      
      setShowRejectDialog(false);
      setRejectReason('');
      
      // Navigate back to work orders list
      navigate('/work-orders');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to reject work order.', variant: 'destructive' });
    }
  };

  const handleSignatureComplete = async () => {
    try {
      // Mock signature completion - in real implementation, this would call workOrderService
      const updatedWorkOrder = await workOrderService.updateWorkOrderStatus(workOrder.id, WorkOrderStatus.IN_PROGRESS);
      
      toast({ 
        title: 'Signature Completed', 
        description: `Work order signed successfully! SRN closed and WO ${workOrder.woNumber} is now active.` 
      });
      
      setShowSignatureDialog(false);
      
      // Navigate to the updated work order in "Open Work Orders"
      navigate('/work-orders', { 
        state: { 
          activeTab: 'open',
          message: `Work Order ${workOrder.woNumber} is now active and trackable!`
        }
      });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to complete signature process.', variant: 'destructive' });
    }
  };

  // Handle team member allocation
  const handleAllocateTeamMember = async () => {
    if (!allocationForm.memberName.trim() || !allocationForm.memberEmail.trim() || !allocationForm.role.trim()) {
      toast({ title: 'Error', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }

    if (allocationForm.accessTabs.length === 0) {
      toast({ title: 'Error', description: 'Please select at least one tab access.', variant: 'destructive' });
      return;
    }

    try {
      // Mock allocation - in real implementation, this would call workOrderService
      toast({ 
        title: 'Team Member Allocated', 
        description: `${allocationForm.memberName} has been allocated to this work order.` 
      });
      
      setShowAllocateDialog(false);
      setAllocationForm({
        memberId: '',
        memberName: '',
        memberEmail: '',
        role: '',
        accessTabs: []
      });
      
      // Refresh the page to show new allocation
      window.location.reload();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to allocate team member.', variant: 'destructive' });
    }
  };

  // Handle feedback submission
  const handleSubmitFeedback = async () => {
    try {
      await workOrderService.provideFeedback(workOrder.id, {
        providedBy: userType === 'seeker' ? workOrder.serviceSeeker.id : workOrder.serviceProvider.id,
        providedByType: userType,
        stage: feedbackForm.stage as 'during_execution' | 'on_completion',
        rating: feedbackForm.rating,
        reviewSummary: feedbackForm.reviewSummary,
        suggestions: feedbackForm.suggestions,
        concerns: feedbackForm.concerns
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
        suggestions: '',
        concerns: []
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
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3 md:gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/work-orders')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="min-w-0">
          <div className="flex flex-nowrap items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 whitespace-nowrap">{workOrder.woNumber}</h1>
            <div className="flex flex-nowrap items-center gap-2 whitespace-nowrap">
              <StatusBadge status={workOrder.status} />
              {workOrder.referenceNumber && (
                <Badge variant="outline" className="whitespace-nowrap">Ref: {workOrder.referenceNumber}</Badge>
              )}
            </div>
          </div>
          <p className="text-gray-600 mt-1">{workOrder.title}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center  justify-end gap-2">
        {/* Service Seeker Actions for New Work Orders from Provider */}
        {userType === 'seeker' && workOrder.status === WorkOrderStatus.PAYMENT_PENDING && workOrder.createdByType === 'provider' && (
          <>
            <Button size="sm" variant="outline" onClick={handlePreviewWO}>
              <Eye className="h-4 w-4 mr-2" />
              Preview WO Details
            </Button>
            <Button size="sm" variant="outline" onClick={handleDownloadWO}>
              <Download className="h-4 w-4 mr-2" />
              Download WO Document
            </Button>
            <Button size="sm" variant="default" onClick={handleAcceptWO}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Accept the WO
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowEditRequestDialog(true)}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Request Modifications
            </Button>
            <Button size="sm" variant="destructive" onClick={() => setShowRejectDialog(true)}>
              <XCircle className="h-4 w-4 mr-2" />
              Reject WO
            </Button>
          </>
        )}

        {/* Service Seeker Signature Action when Signature Pending */}
        {userType === 'seeker' && workOrder.status === WorkOrderStatus.SIGNATURE_PENDING && (
          <>
            <Button size="sm" variant="default" onClick={() => setShowSignatureDialog(true)}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Sign Work Order
            </Button>
          </>
        )}

        {/* Service Provider Edit Actions */}
        {userType === 'provider' && (workOrder.status === WorkOrderStatus.PAYMENT_PENDING || workOrder.status === WorkOrderStatus.IN_PROGRESS) && (
          <>
            {!isEditingWO ? (
              <Button size="sm" variant="outline" onClick={handleEditWO}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Edit WO
              </Button>
            ) : (
              <Button size="sm" variant="default" onClick={handleSaveWOChanges}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            )}
          </>
        )}

        {/* In Progress Actions */}
        {workOrder.status === WorkOrderStatus.IN_PROGRESS && (
          <>
            <Button size="sm" variant="default" onClick={handleMarkComplete}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Complete
            </Button>
            <Button size="sm" variant="destructive" onClick={() => setShowDisputeDialog(true)}>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Raise Dispute
            </Button>
          </>
        )}
        
        <Button size="sm" variant="outline" onClick={() => { setShowFeedbackDialog(true); }}>
          <Star className="h-4 w-4 mr-2" />
          Feedback
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <WorkOrderHeader />

      {/* Raise Dispute Dialog */}
      <Dialog open={showDisputeDialog} onOpenChange={setShowDisputeDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Raise Dispute</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Mandatory Reason Selection */}
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-sm font-medium">Dispute Reason *</Label>
              <Select
                value={disputeForm.reason}
                onValueChange={(v) => setDisputeForm({ ...disputeForm, reason: v as DisputeReason })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={DisputeReason.MISSED_DEADLINE}>Missed Deadline</SelectItem>
                  <SelectItem value={DisputeReason.UNSATISFACTORY_DELIVERABLE}>Unsatisfactory Deliverable</SelectItem>
                  <SelectItem value={DisputeReason.UNRESPONSIVE_PROVIDER}>Unresponsive Provider</SelectItem>
                  <SelectItem value={DisputeReason.NON_RESPONSIVE_SEEKER}>Non Responsive Seeker</SelectItem>
                  <SelectItem value={DisputeReason.UNJUSTIFIED_DELAY}>Unjustified Delay</SelectItem>
                  <SelectItem value={DisputeReason.PAYMENT_NOT_RELEASED}>Payment Not Released</SelectItem>
                  <SelectItem value={DisputeReason.SCOPE_CREEP}>Scope Creep</SelectItem>
                  <SelectItem value={DisputeReason.UNPROFESSIONAL_CONDUCT}>Unprofessional Conduct</SelectItem>
                  <SelectItem value={DisputeReason.INVALID_FEE_ADVICE}>Invalid Fee Advice</SelectItem>
                  <SelectItem value={DisputeReason.WORK_REJECTION}>Work Rejection</SelectItem>
                  <SelectItem value={DisputeReason.EXCESSIVE_REVISIONS}>Excessive Revisions</SelectItem>
                  <SelectItem value={DisputeReason.OTHER}>Other (with explanation)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Other Explanation (shown only when "Other" is selected) */}
            {disputeForm.reason === DisputeReason.OTHER && (
              <div className="space-y-2">
                <Label htmlFor="otherExplanation" className="text-sm font-medium">Explanation *</Label>
                <Textarea
                  id="otherExplanation"
                  placeholder="Please explain the specific issue..."
                  value={disputeForm.otherExplanation || ''}
                  onChange={(e) => setDisputeForm({ ...disputeForm, otherExplanation: e.target.value })}
                  maxLength={200}
                />
                <p className="text-xs text-gray-500">{(disputeForm.otherExplanation || '').length}/200 characters</p>
              </div>
            )}

            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the issue in detail (max 500 characters)..."
                value={disputeForm.description}
                onChange={(e) => setDisputeForm({ ...disputeForm, description: e.target.value })}
                maxLength={500}
                rows={4}
              />
              <p className="text-xs text-gray-500">{disputeForm.description.length}/500 characters</p>
            </div>

            {/* Supporting Documents Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Supporting Documents/Screenshots</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                  onChange={handleDisputeFileUpload}
                  className="hidden"
                  id="dispute-file-upload"
                />
                <label htmlFor="dispute-file-upload" className="cursor-pointer">
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload files or drag and drop</p>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG, GIF (max 10MB each)</p>
                  </div>
                </label>
              </div>
              
              {/* Display uploaded files */}
              {disputeForm.supportingDocuments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Uploaded Files:</p>
                  {disputeForm.supportingDocuments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDisputeFile(index)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowDisputeDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmitDispute} disabled={!disputeForm.description.trim()}>Submit Dispute</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Fee Advice Action Dialog */}
      <Dialog open={showFeeAdviceDialog} onOpenChange={setShowFeeAdviceDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Fee Advice Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedFeeAdvice && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium">Request #{selectedFeeAdvice.requestNumber}</h4>
                <p className="text-sm text-gray-600 mt-1">{selectedFeeAdvice.description}</p>
                <p className="text-lg font-semibold mt-2">Amount: ₹{selectedFeeAdvice.amount.toLocaleString()}</p>
              </div>
            )}
            
            <div className="space-y-3">
              <Label className="text-sm font-medium">Choose Action:</Label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="feeAdviceAction"
                    value="accept"
                    checked={feeAdviceAction === 'accept'}
                    onChange={(e) => setFeeAdviceAction(e.target.value as 'accept')}
                  />
                  <span className="text-sm">Accept & Proceed to Pay</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="feeAdviceAction"
                    value="reject"
                    checked={feeAdviceAction === 'reject'}
                    onChange={(e) => setFeeAdviceAction(e.target.value as 'reject')}
                  />
                  <span className="text-sm">Reject with reason</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="feeAdviceAction"
                    value="dispute"
                    checked={feeAdviceAction === 'dispute'}
                    onChange={(e) => setFeeAdviceAction(e.target.value as 'dispute')}
                  />
                  <span className="text-sm">Raise a Dispute</span>
                </label>
              </div>
            </div>

            {feeAdviceAction === 'reject' && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="rejectionReason" className="text-sm font-medium">Rejection Reason *</Label>
                  <Textarea
                    id="rejectionReason"
                    placeholder="Please provide reason for rejection..."
                    value={feeAdviceRejectionReason}
                    onChange={(e) => setFeeAdviceRejectionReason(e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="modification" className="text-sm font-medium">Suggest Modification (Optional)</Label>
                  <Textarea
                    id="modification"
                    placeholder="Suggest any modifications to the fee advice..."
                    value={feeAdviceModification}
                    onChange={(e) => setFeeAdviceModification(e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowFeeAdviceDialog(false)}>Cancel</Button>
            <Button 
              onClick={() => selectedFeeAdvice && handleFeeAdviceAction(selectedFeeAdvice.id, feeAdviceAction)}
              disabled={feeAdviceAction === 'reject' && !feeAdviceRejectionReason.trim()}
            >
              {feeAdviceAction === 'accept' ? 'Accept & Pay' : 
               feeAdviceAction === 'reject' ? 'Reject' : 'Raise Dispute'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Team Member Allocation Dialog */}
      <Dialog open={showAllocateDialog} onOpenChange={setShowAllocateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Allocate Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Member Name */}
            <div className="space-y-2">
              <Label htmlFor="memberName" className="text-sm font-medium">Member Name *</Label>
              <Input
                id="memberName"
                placeholder="Enter team member name"
                value={allocationForm.memberName}
                onChange={(e) => setAllocationForm({ ...allocationForm, memberName: e.target.value })}
              />
            </div>

            {/* Member Email */}
            <div className="space-y-2">
              <Label htmlFor="memberEmail" className="text-sm font-medium">Email Address *</Label>
              <Input
                id="memberEmail"
                type="email"
                placeholder="Enter email address"
                value={allocationForm.memberEmail}
                onChange={(e) => setAllocationForm({ ...allocationForm, memberEmail: e.target.value })}
              />
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">Role *</Label>
              <Select
                value={allocationForm.role}
                onValueChange={(value) => setAllocationForm({ ...allocationForm, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead">Team Lead</SelectItem>
                  <SelectItem value="senior">Senior Associate</SelectItem>
                  <SelectItem value="associate">Associate</SelectItem>
                  <SelectItem value="junior">Junior Associate</SelectItem>
                  <SelectItem value="intern">Intern</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tab Access Control */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tab Access Permissions *</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'track-task', label: 'Track Task' },
                  { id: 'payment', label: 'Payment & Fee Advices' },
                  { id: 'activity', label: 'Activity Log' },
                  { id: 'allocation', label: 'WO Allocation' },
                  { id: 'feedback', label: 'Feedback' }
                ].map((tab) => (
                  <label key={tab.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={allocationForm.accessTabs.includes(tab.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setAllocationForm({
                            ...allocationForm,
                            accessTabs: [...allocationForm.accessTabs, tab.id]
                          });
                        } else {
                          setAllocationForm({
                            ...allocationForm,
                            accessTabs: allocationForm.accessTabs.filter(t => t !== tab.id)
                          });
                        }
                      }}
                    />
                    <span className="text-sm">{tab.label}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Select which tabs this team member can access in the work order.
              </p>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowAllocateDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAllocateTeamMember}
              disabled={!allocationForm.memberName.trim() || !allocationForm.memberEmail.trim() || !allocationForm.role.trim() || allocationForm.accessTabs.length === 0}
            >
              Allocate Member
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Request Dialog for Service Seekers */}
      <Dialog open={showEditRequestDialog} onOpenChange={setShowEditRequestDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Request Work Order Modification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Request Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Request Type *</Label>
              <Select
                value={editRequestForm.requestType}
                onValueChange={(value) => setEditRequestForm({ ...editRequestForm, requestType: value as 'scope_change' | 'timeline_change' | 'financial_change' | 'other' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select request type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scope_change">Scope Change</SelectItem>
                  <SelectItem value="timeline_change">Timeline Modification</SelectItem>
                  <SelectItem value="financial_change">Financial Adjustment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="editDescription" className="text-sm font-medium">Description *</Label>
              <Textarea
                id="editDescription"
                placeholder="Please describe the changes you would like to request..."
                value={editRequestForm.description}
                onChange={(e) => setEditRequestForm({ ...editRequestForm, description: e.target.value })}
                rows={4}
              />
            </div>

            {/* Urgency */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Urgency Level</Label>
              <Select
                value={editRequestForm.urgency}
                onValueChange={(value) => setEditRequestForm({ ...editRequestForm, urgency: value as 'low' | 'medium' | 'high' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Supporting Documents */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Supporting Documents (Optional)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Drag and drop files here or click to browse
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, DOC, DOCX, XLS, XLSX files up to 10MB
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowEditRequestDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitEditRequest}
              disabled={!editRequestForm.description.trim()}
            >
              Send Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview WO Details Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Work Order Preview - {workOrder.woNumber}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Work Order Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Work Order Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Title:</span> {workOrder.title}
                </div>
                <div>
                  <span className="font-medium">WO Number:</span> {workOrder.woNumber}
                </div>
                <div>
                  <span className="font-medium">Created Date:</span> {format(workOrder.createdAt, 'dd/MM/yyyy')}
                </div>
                <div>
                  <span className="font-medium">Expected Completion:</span> {format(workOrder.timeline.expectedCompletionDate, 'dd/MM/yyyy')}
                </div>
              </div>
            </div>

            {/* Scope of Work */}
            <div>
              <h3 className="font-semibold mb-2">Scope of Work</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded">{workOrder.scopeOfWork}</p>
            </div>

            {/* Financial Details */}
            <div>
              <h3 className="font-semibold mb-2">Financial Details</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Professional Fee:</span> ₹{workOrder.financials.professionalFee.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Platform Fee:</span> ₹{workOrder.financials.platformFee.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">GST:</span> ₹{workOrder.financials.gst.toLocaleString()}
                  </div>
                  <div className="font-semibold text-green-800">
                    <span>Total Amount:</span> ₹{workOrder.financials.totalAmount.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div>
              <h3 className="font-semibold mb-2">Project Milestones</h3>
              <div className="space-y-2">
                {workOrder.milestones.map((milestone, index) => (
                  <div key={milestone.id} className="border rounded p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Milestone {index + 1}: {milestone.title}</p>
                        <p className="text-sm text-gray-600">{milestone.description}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        Due: {milestone.deliveryDate ? format(new Date(milestone.deliveryDate), 'dd/MM/yyyy') : 'Not set'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
              Close Preview
            </Button>
            <Button variant="default" onClick={() => {
              setShowPreviewDialog(false);
              handleAcceptWO();
            }}>
              Accept Work Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject WO Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reject Work Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">
                You are about to reject this work order. Please provide a reason for rejection to help the service provider understand your concerns.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rejectReason" className="text-sm font-medium">Reason for Rejection *</Label>
              <Textarea
                id="rejectReason"
                placeholder="Please explain why you are rejecting this work order..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRejectWO}
              disabled={!rejectReason.trim()}
            >
              Reject Work Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Signature Dialog */}
      <Dialog open={showSignatureDialog} onOpenChange={setShowSignatureDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Sign Work Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm mb-2">
                <CheckCircle className="h-4 w-4 inline mr-2" />
                Payment completed successfully! 
              </p>
              <p className="text-sm text-gray-700">
                Your work order has been assigned number <strong>{workOrder.woNumber}</strong>. 
                Please sign the work order to make it official and start the project.
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Choose Signature Method:</Label>
              
              <div className="space-y-3">
                <label className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="signatureType"
                    value="digital"
                    checked={signatureType === 'digital'}
                    onChange={(e) => setSignatureType(e.target.value as 'digital')}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium">Digital Signature</p>
                    <p className="text-sm text-gray-600">
                      Sign using a third-party digital signature platform with legal validity
                    </p>
                  </div>
                </label>

                <label className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="signatureType"
                    value="esign"
                    checked={signatureType === 'esign'}
                    onChange={(e) => setSignatureType(e.target.value as 'esign')}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium">eSign (Aadhaar)</p>
                    <p className="text-sm text-gray-600">
                      Sign using Aadhaar-based electronic signature with OTP verification
                    </p>
                  </div>
                </label>

                <label className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="signatureType"
                    value="print_sign_upload"
                    checked={signatureType === 'print_sign_upload'}
                    onChange={(e) => setSignatureType(e.target.value as 'print_sign_upload')}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium">Print + Sign + Upload</p>
                    <p className="text-sm text-gray-600">
                      Download the work order, sign manually, scan and upload back
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowSignatureDialog(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleSignatureComplete}>
              Proceed with {signatureType === 'digital' ? 'Digital Signature' : 
                          signatureType === 'esign' ? 'eSign' : 'Print & Upload'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="track-task">Track Task</TabsTrigger>
          <TabsTrigger value="payment">Payment & Fee Advices</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
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
                
                {workOrder.deliverables && workOrder.deliverables.length > 0 && (
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
                    <label className="text-sm font-medium text-gray-500">Reimbursements</label>
                    <p className="text-lg font-semibold">₹{workOrder.financials.reimbursements?.toLocaleString() || '0'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Regulatory Payouts</label>
                    <p className="text-lg font-semibold">₹{workOrder.financials.regulatoryPayouts?.toLocaleString() || '0'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">OPE</label>
                    <p className="text-lg font-semibold">₹{workOrder.financials.ope?.toLocaleString() || '0'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Total Amount</label>
                    <p className="text-xl font-bold text-blue-600">₹{workOrder.financials.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Questionnaire */}
            <Card>
              <CardHeader>
                <CardTitle>Service Questionnaire</CardTitle>
              </CardHeader>
              <CardContent>
                {workOrder.questionnaire && workOrder.questionnaire.length > 0 ? (
                  <div className="space-y-3">
                    {workOrder.questionnaire.map((q) => (
                      <div key={q.id} className="p-3 border rounded-md">
                        <p className="text-sm font-medium text-gray-700">{q.question}</p>
                        <p className="text-gray-900 mt-1">{q.answer || '—'}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No questionnaire responses.</p>
                )}
              </CardContent>
            </Card>

            {/* Information Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Information Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workOrder.informationRequests.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No information requests.</p>
                ) : (
                  <div className="space-y-3">
                    {workOrder.informationRequests.map((ir) => (
                      <div key={ir.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-gray-900">{ir.title}</p>
                          <Badge className={
                            ir.status === 'responded' ? 'bg-green-100 text-green-800' :
                            ir.status === 'overdue' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {ir.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{ir.description}</p>
                        <p className="text-xs text-gray-500">Requested: {format(ir.requestedAt, 'dd/MM/yyyy')}</p>
                        {ir.response && (
                          <p className="mt-2 text-sm text-gray-800"><span className="font-medium">Response:</span> {ir.response}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="track-task" className="mt-6">
          <div className="space-y-6">
            {/* Information/Documents Sought by Professional */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Information/Documents Sought by the Professional
                  </span>
                  {userType === 'seeker' && (
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Text Information
                      </Button>
                      <Button size="sm" variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Add Document
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workOrder.informationRequests.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No information requests from the professional.</p>
                ) : (
                  <div className="space-y-4">
                    {workOrder.informationRequests.map((ir) => (
                      <div key={ir.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">{ir.title}</h4>
                          <Badge className={
                            ir.status === 'responded' ? 'bg-green-100 text-green-800' :
                            ir.status === 'overdue' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {ir.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{ir.description}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500">Requested: {format(ir.requestedAt, 'dd/MM/yyyy')}</p>
                          {userType === 'seeker' && ir.status === 'pending' && (
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Respond
                              </Button>
                              <Button size="sm" variant="outline">
                                <Upload className="h-4 w-4 mr-1" />
                                Upload Document
                              </Button>
                            </div>
                          )}
                        </div>
                        {ir.response && (
                          <div className="mt-3 p-3 bg-gray-50 rounded">
                            <p className="text-sm font-medium text-gray-700">Your Response:</p>
                            <p className="text-sm text-gray-800 mt-1">{ir.response}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* View Workings and Draft Report */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  View Workings and Draft Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const draftDocuments = workOrder.documents.filter(doc => 
                    doc.category === 'draft' || doc.category === 'working' || doc.label.toLowerCase().includes('draft')
                  );
                  return draftDocuments.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No draft documents or workings uploaded by the service provider yet.</p>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 mb-4">
                        WIP documents uploaded by the service provider. These documents are part of the Document Draft Cycle with full VC features.
                      </p>
                      {draftDocuments.map((document) => (
                        <div key={document.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-5 w-5 text-blue-500" />
                              <div>
                                <p className="font-medium text-gray-900">{document.label || document.name}</p>
                                <p className="text-sm text-gray-500">
                                  Draft • Uploaded {format(document.uploadedAt, 'dd/MM/yyyy')}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              Draft Document
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedDocument(document);
                                setShowViewDocument(true);
                                toast({
                                  title: "Document Viewer",
                                  description: `Opening ${document.label || document.name} with VC features`,
                                });
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Document
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                toast({
                                  title: "Download Started",
                                  description: `Downloading ${document.label || document.name}`,
                                });
                              }}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Add Comments
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>

            {/* Download Final Report */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="h-5 w-5 mr-2" />
                  Download Final Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const finalDocuments = workOrder.documents.filter(doc => 
                    doc.category === 'final' || doc.label.toLowerCase().includes('final') || 
                    doc.label.toLowerCase().includes('report')
                  );
                  return finalDocuments.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No final reports available for download yet.</p>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 mb-4">
                        Final reports and documents that can be downloaded. These are the completed deliverables from the service provider.
                      </p>
                      {finalDocuments.map((document) => (
                        <div key={document.id} className="border rounded-lg p-4 bg-green-50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-5 w-5 text-green-600" />
                              <div>
                                <p className="font-medium text-gray-900">{document.label || document.name}</p>
                                <p className="text-sm text-gray-500">
                                  Final Report • Uploaded {format(document.uploadedAt, 'dd/MM/yyyy')}
                                </p>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              Final
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedDocument(document);
                                setShowViewDocument(true);
                                toast({
                                  title: "Report Viewer",
                                  description: `Opening ${document.label || document.name}`,
                                });
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Report
                            </Button>
                            <Button 
                              size="sm" 
                              variant="default"
                              onClick={() => {
                                toast({
                                  title: "Download Started",
                                  description: `Downloading ${document.label || document.name}`,
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
                  );
                })()}
              </CardContent>
            </Card>

            {/* Comments by Client for Professional */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Comments by Client for the Professional
                  </span>
                  {userType === 'seeker' && (
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Comment
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  // Mock comments data - in real implementation, this would come from workOrder.comments
                  const mockComments = [
                    {
                      id: '1',
                      comment: 'Please review the financial projections in section 3.2 and provide more detailed analysis.',
                      createdAt: new Date('2024-01-15'),
                      status: 'pending'
                    },
                    {
                      id: '2', 
                      comment: 'The draft looks good overall. However, please include more recent market data in the competitive analysis.',
                      createdAt: new Date('2024-01-10'),
                      status: 'addressed'
                    }
                  ];
                  
                  return mockComments.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No comments added yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {mockComments.map((comment) => (
                        <div key={comment.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Client Comment</span>
                            <div className="flex items-center space-x-2">
                              <Badge className={
                                comment.status === 'addressed' ? 'bg-green-100 text-green-800' :
                                'bg-yellow-100 text-yellow-800'
                              }>
                                {comment.status.toUpperCase()}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {format(comment.createdAt, 'dd/MM/yyyy')}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-800">{comment.comment}</p>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>

            {/* Dispute Communication Section */}
            {workOrder.disputes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                    Dispute Communication
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {workOrder.disputes.map((dispute) => (
                      <div key={dispute.id} className="border rounded-lg p-4 bg-red-50">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              Dispute #{dispute.id.slice(-6)}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Raised by {dispute.raisedByType === 'seeker' ? 'Service Seeker' : 'Service Provider'} on {format(dispute.createdAt, 'dd/MM/yyyy')}
                            </p>
                          </div>
                          <Badge className={
                            dispute.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            dispute.status === 'escalated' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {dispute.status.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700">Reason:</p>
                          <p className="text-sm text-gray-900">{dispute.reason.replace(/_/g, ' ')}</p>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700">Description:</p>
                          <p className="text-sm text-gray-900">{dispute.description}</p>
                        </div>

                        {/* Supporting Documents */}
                        {dispute.supportingDocuments.length > 0 && (
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-700 mb-2">Supporting Documents:</p>
                            <div className="space-y-1">
                              {dispute.supportingDocuments.map((doc) => (
                                <div key={doc.id} className="flex items-center space-x-2 text-sm">
                                  <FileText className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-600">{doc.name}</span>
                                  <Button size="sm" variant="ghost" className="h-6 px-2">
                                    <Download className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Dispute Messages/Communication */}
                        {dispute.messages.length > 0 && (
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-700 mb-2">Communication:</p>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {dispute.messages.map((message) => (
                                <div key={message.id} className={`p-2 rounded text-sm ${
                                  message.authorType === 'admin' ? 'bg-blue-100' :
                                  message.authorType === userType ? 'bg-gray-100 ml-4' : 'bg-white mr-4'
                                }`}>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-xs">
                                      {message.authorType === 'admin' ? 'Platform Admin' :
                                       message.authorType === 'seeker' ? 'Service Seeker' : 'Service Provider'}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {format(message.timestamp, 'dd/MM/yyyy HH:mm')}
                                    </span>
                                  </div>
                                  <p className="text-gray-800">{message.message}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Resolution (if resolved) */}
                        {dispute.status === 'resolved' && dispute.resolution && (
                          <div className="mb-3 p-3 bg-green-100 rounded">
                            <p className="text-sm font-medium text-green-800">Resolution:</p>
                            <p className="text-sm text-green-700">{dispute.resolution}</p>
                            {dispute.resolvedAt && (
                              <p className="text-xs text-green-600 mt-1">
                                Resolved on {format(dispute.resolvedAt, 'dd/MM/yyyy')}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Add Response Button for Active Disputes */}
                        {dispute.status === 'active' && (
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Add Response
                            </Button>
                            {userType === 'seeker' && dispute.raisedByType === 'provider' && (
                              <Button size="sm" variant="outline">
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Escalate to Admin
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
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
                {!workOrder.financials.paymentTerms || workOrder.financials.paymentTerms.length === 0 ? (
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
                {!workOrder.financials.feeAdvices || workOrder.financials.feeAdvices.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No fee advices raised.</p>
                ) : (
                  <div className="space-y-3">
                    {/* Requests (Pending/Accepted/Rejected) */}
                    {(workOrder.financials.feeAdvices || []).filter(f => f.status !== FeeAdviceStatus.PAID).map((feeAdvice) => (
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
                            <Button 
                              size="sm" 
                              variant="default"
                              onClick={() => {
                                setSelectedFeeAdvice(feeAdvice);
                                setShowFeeAdviceDialog(true);
                                setFeeAdviceAction('accept');
                              }}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Accept / Reject / Dispute
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Paid Fee Advices */}
                    {(workOrder.financials.feeAdvices || []).filter(f => f.status === FeeAdviceStatus.PAID).length > 0 && (
                      <>
                        <h4 className="mt-4 text-sm font-semibold text-gray-700">Paid Fee Advices</h4>
                        {(workOrder.financials.feeAdvices || []).filter(f => f.status === FeeAdviceStatus.PAID).map((feeAdvice) => (
                          <div key={`paid-${feeAdvice.id}`} className="border rounded-lg p-4 bg-green-50">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-medium text-gray-900">{feeAdvice.requestNumber}</p>
                                <p className="text-sm text-gray-500">
                                  {feeAdvice.date ? format(new Date(feeAdvice.date), 'dd/MM/yyyy') : 'Date not specified'}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-semibold">₹{feeAdvice.amount.toLocaleString()}</p>
                                <Badge className="bg-green-100 text-green-800">PAID</Badge>
                              </div>
                            </div>
                            <p className="text-gray-600">{feeAdvice.description}</p>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Money Receipts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Money Receipts</span>
                  {userType === 'provider' && (
                    <Button size="sm" variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Receipt
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!workOrder.financials.moneyReceipts || workOrder.financials.moneyReceipts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No receipts available.</p>
                ) : (
                  <div className="space-y-3">
                    {workOrder.financials.moneyReceipts.map((mr) => (
                      <div key={mr.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{mr.receiptNumber}</p>
                          <p className="text-sm text-gray-500">Date: {format(mr.date, 'dd/MM/yyyy')}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-lg font-semibold">₹{mr.amount.toLocaleString()}</p>
                            <Badge className={mr.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                              {mr.status ? mr.status.toUpperCase() : 'PENDING'}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                toast({
                                  title: "Receipt Viewer",
                                  description: `Opening ${mr.receiptNumber}`,
                                });
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            {userType === 'seeker' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  toast({
                                    title: "Download Started",
                                    description: `Downloading ${mr.receiptNumber}`,
                                  });
                                }}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="messages" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Messages & Edit Requests
                </span>
                {userType === 'seeker' && (
                  <Button size="sm" onClick={() => setShowEditRequestDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Request Edit
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Mock edit requests data - in real implementation, this would come from workOrderService */}
              {workOrder.status === WorkOrderStatus.PAYMENT_PENDING && workOrder.createdByType === 'provider' ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className="bg-blue-100 text-blue-800">New Work Order</Badge>
                          <span className="text-sm text-gray-500">
                            {format(workOrder.createdAt, 'dd/MM/yyyy HH:mm')}
                          </span>
                        </div>
                        <p className="text-gray-900 mb-2">
                          Service provider has created a new work order for your review.
                        </p>
                        <p className="text-sm text-gray-600">
                          Please review the work order details, timeline, and financial terms. 
                          You can accept, request modifications, or reject this work order.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sample edit request from seeker */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className="bg-yellow-100 text-yellow-800">Edit Request</Badge>
                          <span className="text-sm text-gray-500">23/08/2025 14:30</span>
                        </div>
                        <p className="font-medium text-gray-900 mb-2">Scope Modification Request</p>
                        <p className="text-gray-700 mb-2">
                          Could you please include additional market research for the competitive analysis section? 
                          This would help us better understand the market positioning.
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">High Priority</Badge>
                          {userType === 'provider' && (
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Accept
                              </Button>
                              <Button size="sm" variant="outline">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Discuss
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-50 border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className="bg-green-100 text-green-800">Work Order Active</Badge>
                      <span className="text-sm text-gray-500">
                        {format(workOrder.createdAt, 'dd/MM/yyyy HH:mm')}
                      </span>
                    </div>
                    <p className="text-gray-700">
                      Work order is currently in progress. Use this section to communicate any changes or updates needed.
                    </p>
                  </div>

                  {/* Sample ongoing communication */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className="bg-blue-100 text-blue-800">Update Request</Badge>
                          <span className="text-sm text-gray-500">24/08/2025 10:15</span>
                        </div>
                        <p className="font-medium text-gray-900 mb-2">Timeline Extension Request</p>
                        <p className="text-gray-700 mb-2">
                          Due to additional requirements discovered during analysis, we need to extend the timeline by 5 business days.
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">Medium Priority</Badge>
                          <Badge className="bg-green-100 text-green-800 text-xs">Approved</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Empty state for no messages */}
              {workOrder.status === WorkOrderStatus.COMPLETED && (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No messages or edit requests for this completed work order.</p>
                </div>
              )}
            </CardContent>
          </Card>
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
                <Button size="sm" onClick={() => setShowAllocateDialog(true)}>
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

                      {/* Concern Flags */}
                      <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right mt-2">Concerns</Label>
                        <div className="col-span-3 space-y-2">
                          {['Delay', 'Miscommunication', 'Quality'].map((label) => {
                            const key = label.toLowerCase();
                            const checked = feedbackForm.concerns.includes(key);
                            return (
                              <label key={label} className="flex items-center space-x-2">
                                <Checkbox 
                                  checked={checked}
                                  onCheckedChange={(v) => {
                                    const isChecked = Boolean(v);
                                    setFeedbackForm((prev) => ({
                                      ...prev,
                                      concerns: isChecked
                                        ? Array.from(new Set([...prev.concerns, key]))
                                        : prev.concerns.filter(c => c !== key)
                                    }));
                                  }}
                                />
                                <span className="text-sm">{label}</span>
                              </label>
                            );
                          })}
                        </div>
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
              {(workOrder.feedbacks?.length ?? 0) === 0 ? (
                <p className="text-gray-500 text-center py-8">No feedback provided yet.</p>
              ) : (
                <div className="space-y-4">
                  {(workOrder.feedbacks ?? []).map((feedback) => (
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
                          {(feedback.stage || '').replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-900 mb-2">{feedback.reviewSummary}</p>
                      
                      {feedback.suggestions && (
                        <p className="text-gray-600 text-sm mb-2">
                          <strong>Suggestions:</strong> {feedback.suggestions}
                        </p>
                      )}
                      
                      <div className="text-xs text-gray-500">
                        By: {feedback.providedBy ?? 'Unknown'} • {feedback.timestamp ? format(new Date(feedback.timestamp), 'dd/MM/yyyy HH:mm') : '-'}
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
