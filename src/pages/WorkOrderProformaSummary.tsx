import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getUserTypeFromRole } from "@/utils/userTypeUtils";
import { workOrderService } from "@/services/workOrderService";
import { WorkOrder, WorkOrderStatus } from "@/types/workOrder";
import { ArrowLeft, CheckCircle2, CreditCard, FileText, Landmark, Loader2, ShieldCheck, Wallet } from "lucide-react";

const WorkOrderProformaSummary = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const layoutUserType = getUserTypeFromRole(user?.role);

  const [loading, setLoading] = useState(true);
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [paying, setPaying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const amountDue = useMemo(() => {
    if (!workOrder) return 0;
    // For mock flow, allow paying total amount
    return workOrder.financials?.totalAmount || 0;
  }, [workOrder]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const wo = await workOrderService.getWorkOrderById(id);
        if (mounted) setWorkOrder(wo);
      } catch (e) {
        toast({
          title: "Error",
          description: "Failed to load work order summary.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [id]);

  const handleMakePayment = async () => {
    if (!workOrder) return;
    try {
      setPaying(true);
      const ok = await workOrderService.makePayment(workOrder.id, amountDue);
      if (!ok) throw new Error("Payment failed");
      toast({ title: "Payment Successful", description: "Escrow funded. Proceed to signatures." });
      setShowSuccess(true);
    } catch (e) {
      toast({ title: "Payment Failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout userType={layoutUserType}>
        <div className="container mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-9 w-28" />
          </div>
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!workOrder) {
    return (
      <DashboardLayout userType={layoutUserType}>
        <div className="container mx-auto p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Work Order Not Found</h2>
            <Button onClick={() => navigate("/service-requests")}>Back</Button>
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
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Work Order Proforma Summary</h1>
              <p className="text-gray-600">WO#: {workOrder.woNumber} {workOrder.status === WorkOrderStatus.PROFORMA && (
                <Badge variant="secondary" className="ml-2">Proforma</Badge>
              )}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate(`/work-orders/${workOrder.id}`)}>View Full Details</Button>
        </div>

        {/* Parties & Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="flex items-center text-gray-900">
                <FileText className="h-5 w-5 mr-2 text-blue-600" /> Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <p className="text-sm text-gray-600">Title</p>
                <p className="text-lg font-semibold text-gray-900">{workOrder.title}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Service Seeker</p>
                  <p className="font-medium text-gray-900">{workOrder.serviceSeeker?.name}</p>
                  <p className="text-sm text-gray-600">{workOrder.serviceSeeker?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Service Provider</p>
                  <p className="font-medium text-gray-900">{workOrder.serviceProvider?.name}</p>
                  <p className="text-sm text-gray-600">{workOrder.serviceProvider?.email}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Scope of Work</p>
                <p className="text-gray-900">{workOrder.scopeOfWork}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Deliverables</p>
                <ul className="list-disc pl-5 text-gray-900">
                  {workOrder.deliverables?.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Payment Card */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="flex items-center text-gray-900">
                <Wallet className="h-5 w-5 mr-2 text-emerald-600" /> Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Professional Fee</span>
                <span className="font-semibold text-gray-900">₹{(workOrder.financials?.professionalFee || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Platform Fee</span>
                <span className="font-semibold text-gray-900">₹{(workOrder.financials?.platformFee || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">GST</span>
                <span className="font-semibold text-gray-900">₹{(workOrder.financials?.gst || 0).toLocaleString()}</span>
              </div>
              {(workOrder.financials?.reimbursements || 0) > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Reimbursements</span>
                  <span className="font-semibold text-gray-900">₹{(workOrder.financials?.reimbursements || 0).toLocaleString()}</span>
                </div>
              )}
              {(workOrder.financials?.regulatoryPayouts || 0) > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Regulatory Payouts</span>
                  <span className="font-semibold text-gray-900">₹{(workOrder.financials?.regulatoryPayouts || 0).toLocaleString()}</span>
                </div>
              )}
              <div className="border-t pt-3 flex items-center justify-between">
                <span className="text-gray-900 font-semibold">Total Amount</span>
                <span className="text-green-700 font-bold">₹{amountDue.toLocaleString()}</span>
              </div>
              <div className="rounded-md bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-800 flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 mt-0.5" />
                <div>Secure escrow payment. Funds are released to provider as per terms.</div>
              </div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={handleMakePayment} disabled={paying}>
                {paying ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...</>) : (<><CreditCard className="h-4 w-4 mr-2" /> Pay Now</>)}
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate(`/work-orders/${workOrder.id}`)}>
                <Landmark className="h-4 w-4 mr-2" /> Go to Work Order
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Timeline/Terms */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="flex items-center text-gray-900">
              <CheckCircle2 className="h-5 w-5 mr-2 text-blue-600" /> Payment Terms & Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-medium text-gray-900">{workOrder.timeline?.startDate?.toLocaleDateString?.() || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Expected Completion</p>
                <p className="font-medium text-gray-900">{workOrder.timeline?.expectedCompletionDate?.toLocaleDateString?.() || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge>{String(workOrder.status || '').replace(/_/g, ' ')}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-emerald-700">
              <CheckCircle2 className="h-5 w-5 mr-2" /> Payment Successful
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-gray-700">Your proforma work order has been created.</p>
            <div className="rounded-md bg-gray-50 border p-3">
              <div className="text-sm text-gray-600">Work Order Number</div>
              <div className="text-lg font-semibold text-gray-900">{workOrder.woNumber}</div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => { setShowSuccess(false); navigate(`/work-orders/${workOrder.id}`); }}>
              Proceed to Signatures
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default WorkOrderProformaSummary;
