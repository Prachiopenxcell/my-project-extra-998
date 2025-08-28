import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getUserTypeFromRole } from "@/utils/userTypeUtils";
import { serviceRequestService } from "@/services/serviceRequestService";
import { workOrderService } from "@/services/workOrderService";
import { SignatureType } from "@/types/workOrder";
import { ServiceRequest, Bid } from "@/types/serviceRequest";
import { 
  ArrowLeft, 
  CheckCircle2, 
  CreditCard, 
  FileText, 
  Landmark, 
  Loader2, 
  ShieldCheck, 
  Wallet,
  Calendar,
  MapPin,
  Star,
  User,
  Building2,
  Clock,
  DollarSign,
  Award,
  Target,
  ExternalLink,
  Upload,
  Download
} from "lucide-react";
import { format } from "date-fns";

const BidAcceptanceSummary = () => {
  const { serviceRequestId } = useParams<{ serviceRequestId: string }>();
  const [searchParams] = useSearchParams();
  const bidId = searchParams.get('bidId');
  const navigate = useNavigate();
  const { user } = useAuth();
  const layoutUserType = getUserTypeFromRole(user?.role);
  const signatureUserType: 'seeker' | 'provider' = layoutUserType === 'service_provider' ? 'provider' : 'seeker';

  const [loading, setLoading] = useState(true);
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [bid, setBid] = useState<Bid | null>(null);
  const [paying, setPaying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [proformaNumber, setProformaNumber] = useState<string>("");
  const [createdWorkOrderId, setCreatedWorkOrderId] = useState<string>("");
  const [referenceNumber, setReferenceNumber] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const totalAmount = useMemo(() => {
    if (!bid) return 0;
    return bid.financials.totalBidAmount ?? 0;
  }, [bid]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!serviceRequestId || !bidId) return;
      try {
        setLoading(true);
        const [srData, bidData] = await Promise.all([
          serviceRequestService.getServiceRequestById(serviceRequestId),
          serviceRequestService.getBidById(bidId)
        ]);
        if (mounted) {
          setServiceRequest(srData);
          setBid(bidData);
        }
      } catch (e) {
        toast({
          title: "Error",
          description: "Failed to load bid summary.",
          variant: "destructive"
        });
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [serviceRequestId, bidId]);

  const generateProformaNumber = () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    return `PF${year}${randomNum}`;
  };

  const handleMakePayment = async () => {
    if (!bid || !serviceRequest) return;
    try {
      setPaying(true);
      
      // Accept the bid first
      await serviceRequestService.acceptBid(bid.id);
      
      // Create work order from accepted bid
      const workOrder = await workOrderService.createWorkOrderFromBid(bid.id, serviceRequest.id);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Optionally mark payment in service (mock)
      await workOrderService.makePayment(workOrder.id, bid.financials.totalBidAmount ?? 0);

      // Use generated WO number from created work order
      setProformaNumber(workOrder.woNumber);
      setCreatedWorkOrderId(workOrder.id);
      
      toast({ 
        title: "Payment Successful", 
        description: "Bid accepted and payment processed successfully." 
      });
      
      setShowSuccess(true);
    } catch (e) {
      toast({ 
        title: "Payment Failed", 
        description: "Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setPaying(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate("/work-orders");
  };

  const handleDigitalSignature = async () => {
    try {
      if (!createdWorkOrderId) return;
      // Simulate redirect to third-party signature provider
      const url = `https://example-dsc.com/sign?workOrderId=${encodeURIComponent(createdWorkOrderId)}`;
      window.open(url, "_blank", "noopener,noreferrer");
      // After successful signing (mock), mark signed
      await workOrderService.signWorkOrder(createdWorkOrderId, SignatureType.DIGITAL_SIGNATURE, signatureUserType);
      toast({ title: "Digital Signature completed", description: "Work order has been digitally signed." });
      navigate(`/work-orders/${createdWorkOrderId}`);
    } catch (e) {
      toast({ title: "Signature failed", description: "Please try again.", variant: "destructive" });
    }
  };

  const handleAadhaarESign = async () => {
    try {
      if (!createdWorkOrderId) return;
      // Simulate Aadhaar eSign flow success
      await workOrderService.signWorkOrder(createdWorkOrderId, SignatureType.E_SIGN, signatureUserType);
      toast({ title: "eSign completed", description: "Work order has been eSigned using Aadhaar." });
      navigate(`/work-orders/${createdWorkOrderId}`);
    } catch (e) {
      toast({ title: "eSign failed", description: "Please try again.", variant: "destructive" });
    }
  };

  const handleDownloadWorkOrder = () => {
    if (!proformaNumber) return;
    const content = `Work Order ${proformaNumber}\nGenerated on ${new Date().toLocaleString()}\n\nThis is a placeholder document for print-sign-upload.`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${proformaNumber}-work-order.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast({ title: "Download started", description: "Work order downloaded. Please print, sign, scan, and upload." });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleUploadSignedCopy: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Mock upload flow
    toast({ title: "Uploading...", description: `Uploading ${file.name}` });
    await new Promise(res => setTimeout(res, 800));
    toast({ title: "Signed copy uploaded", description: "We'll notify the provider once verified." });
    if (createdWorkOrderId) {
      await workOrderService.signWorkOrder(createdWorkOrderId, SignatureType.PRINT_SIGN_UPLOAD, signatureUserType);
      navigate(`/work-orders/${createdWorkOrderId}`);
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

  if (!serviceRequest || !bid) {
    return (
      <DashboardLayout userType={layoutUserType}>
        <div className="container mx-auto p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Bid Not Found</h2>
            <Button onClick={() => navigate("/service-requests")}>Back to Service Requests</Button>
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
              <h1 className="text-2xl font-bold text-gray-900">Proforma Work Order</h1>
              <p className="text-gray-600">PWO-456214</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Selected Bid
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Request Summary */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <CardTitle className="flex items-center text-gray-900">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Service Request Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="text-lg font-semibold text-gray-900">{serviceRequest.title}</p>
                  <p className="text-gray-700 mt-1">{serviceRequest.description}</p>
                </div>
                <Separator className="my-2" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">SRN Number</p>
                    <p className="font-medium text-gray-900">{serviceRequest.srnNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Performa work order Number</p>
                    <p className="font-medium text-gray-900">PWO-456214</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Work Required By</p>
                    <p className="font-medium text-gray-900">{serviceRequest.workRequiredBy ? format(serviceRequest.workRequiredBy, 'dd/MM/yyyy') : '—'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Budget Range</p>
                    <p className="font-medium text-gray-900">₹{serviceRequest.budgetRange?.min.toLocaleString()} - ₹{serviceRequest.budgetRange?.max.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Locations</p>
                    <p className="font-medium text-gray-900">{serviceRequest.preferredLocations?.length ? serviceRequest.preferredLocations.join(', ') : '—'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected Service Provider */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <CardTitle className="flex items-center text-gray-900">
                  <Award className="h-5 w-5 mr-2 text-emerald-600" />
                  Selected Service Provider
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Provider Info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Bidder Name</p>
                      <p className="text-xs text-gray-600">Bid #{bid.bidNumber}</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Selected</Badge>
                </div>

                <Separator />

                {/* Financials */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Professional Fee</span>
                    <span className="font-semibold text-gray-900">₹{bid.financials.professionalFee.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Platform Fee</span>
                    <span className="font-semibold text-gray-900">₹{bid.financials.platformFee.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">GST</span>
                    <span className="font-semibold text-gray-900">₹{bid.financials.gst.toLocaleString()}</span>
                  </div>
                  {((bid.financials.reimbursements?.regulatoryStatutoryPayouts ?? 0) + (bid.financials.reimbursements?.opeProfessionalTeam ?? 0)) > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Reimbursements</span>
                      <span className="font-semibold text-gray-900">₹{((bid.financials.reimbursements?.regulatoryStatutoryPayouts ?? 0) + (bid.financials.reimbursements?.opeProfessionalTeam ?? 0)).toLocaleString()}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span className="text-gray-900">Total Amount</span>
                    <span className="text-emerald-700">₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Delivery & Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Payment Structure</p>
                    <p className="font-medium text-gray-900">{bid.financials.paymentStructure.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Delivery Date</p>
                    <p className="font-medium text-gray-900">{format(bid.deliveryDate, 'dd/MM/yyyy')}</p>
                  </div>
                </div>

                {/* Additional Inputs */}
                {bid.additionalInputs && (
                  <div>
                    <p className="text-sm text-gray-600">Additional Information</p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{bid.additionalInputs}</p>
                  </div>
                )}

                {/* Milestones */}
                {bid.financials.milestones && bid.financials.milestones.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-3">Payment Milestones</p>
                    <div className="space-y-2">
                      {bid.financials.milestones.map((milestone, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                          <span className="text-sm font-medium">Stage {index + 1}</span>
                          <span className="font-semibold text-gray-900">₹{(milestone.paymentAmount ?? 0).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          <div className="space-y-6">
            <Card className="border-gray-200 shadow-sm sticky top-6">
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <CardTitle className="flex items-center text-gray-900">
                  <Wallet className="h-5 w-5 mr-2 text-emerald-600" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Professional Fee</span>
                    <span className="font-semibold text-gray-900">₹{bid.financials.professionalFee.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Platform Fee</span>
                    <span className="font-semibold text-gray-900">₹{bid.financials.platformFee.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">GST</span>
                    <span className="font-semibold text-gray-900">₹{bid.financials.gst.toLocaleString()}</span>
                  </div>
                  {((bid.financials.reimbursements?.regulatoryStatutoryPayouts ?? 0) + (bid.financials.reimbursements?.opeProfessionalTeam ?? 0)) > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Reimbursements</span>
                      <span className="font-semibold text-gray-900">₹{((bid.financials.reimbursements?.regulatoryStatutoryPayouts ?? 0) + (bid.financials.reimbursements?.opeProfessionalTeam ?? 0)).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex items-center justify-between text-lg font-bold">
                  <span className="text-gray-900">Total Amount</span>
                  <span className="text-emerald-700">₹{totalAmount.toLocaleString()}</span>
                </div>

                <div className="rounded-md bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Secure Escrow Payment</p>
                      <p className="text-emerald-700 mt-1">Your payment is protected. Funds are released to the provider upon successful completion of milestones.</p>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3" 
                  onClick={handleMakePayment} 
                  disabled={paying}
                  size="lg"
                >
                  {paying ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Confirm & Pay Now
                    </>
                  )}
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate(-1)}
                  disabled={paying}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Bids
                </Button>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-600">
                    <ShieldCheck className="h-4 w-4 mr-2 text-green-600" />
                    SSL Encrypted Payment
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Landmark className="h-4 w-4 mr-2 text-blue-600" />
                    Bank-Grade Security
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-600" />
                    Money Back Guarantee
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-emerald-700">
              <CheckCircle2 className="h-6 w-6 mr-2" />
              Payment Successful!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-center">
              <div className="bg-emerald-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <p className="text-gray-700 mb-4">Now your service request is closed and your new open work order number is this it is converted to openwork order.</p>
            </div>
            
            <div className="rounded-md bg-gray-50 border p-4 text-center">
              <div className="text-sm text-gray-600 mb-1">Open Work Order Number</div>
              <div className="text-2xl font-bold text-gray-900 tracking-wider">{proformaNumber}</div>
              <div className="text-xs text-gray-500 mt-1">Please save this number for your records</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="referenceNumber" className="text-sm font-medium text-gray-700">
                Reference Number 
              </Label>
              <Input
                id="referenceNumber"
                type="text"
                placeholder="Enter your reference number"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="w-full"
              />
              <div className="text-xs text-gray-500">Add your internal reference number for tracking</div>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-semibold text-gray-800 text-center">Sign the Work Order</div>
              <div className="grid grid-cols-1 gap-2">
                <Button onClick={handleDigitalSignature} className="w-full" variant="default">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Digital Signature (DSC)
                </Button>
                <Button onClick={handleAadhaarESign} className="w-full" variant="secondary">
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  eSign via Aadhaar
                </Button>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={handleDownloadWorkOrder} className="flex-1" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download for Print
                  </Button>
                  <Button onClick={handleUploadClick} className="flex-1" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Signed Copy
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,image/*"
                  className="hidden"
                  onChange={handleUploadSignedCopy}
                />
              </div>
              <div className="text-xs text-gray-600 text-center">You will receive email confirmation shortly with complete details.</div>
            </div>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button onClick={handleSuccessClose} className="bg-emerald-600 hover:bg-emerald-700">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Continue to Work order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default BidAcceptanceSummary;
