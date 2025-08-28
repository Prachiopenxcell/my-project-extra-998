import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Save, 
  DollarSign, 
  Calendar, 
  FileText,
  AlertCircle
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { serviceRequestService } from "@/services/serviceRequestService";
import { Bid, PaymentStructure, BidStatus } from "@/types/serviceRequest";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { getUserTypeFromRole } from "@/utils/userTypeUtils";

const EditBid = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const layoutUserType = getUserTypeFromRole(user?.role);
  const [bid, setBid] = useState<Bid | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    professionalFees: 0,
    regulatoryPayouts: 0,
    ope: 0,
    paymentStructure: PaymentStructure.MILESTONE_BASED,
    deliveryDate: '',
    additionalInputs: ''
  });

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
        additionalInputs: 'Comprehensive valuation with market analysis including detailed financial modeling, risk assessment, and comparative market analysis.',
        status: BidStatus.SUBMITTED,
        documents: [],
        isInvited: false,
        submittedAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-16'),
        lastEditDate: new Date('2024-01-16')
      };
      
      setBid(mockBid);
      setFormData({
        professionalFees: mockBid.financials.professionalFee,
        regulatoryPayouts: mockBid.financials.regulatoryPayouts,
        ope: mockBid.financials.ope,
        paymentStructure: mockBid.financials.paymentStructure,
        deliveryDate: format(mockBid.deliveryDate, 'yyyy-MM-dd'),
        additionalInputs: mockBid.additionalInputs
      });
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

  const calculateTotal = () => {
    return formData.professionalFees + formData.regulatoryPayouts + formData.ope;
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Validation
      if (!formData.deliveryDate) {
        toast({
          title: "Validation Error",
          description: "Please select a delivery date.",
          variant: "destructive"
        });
        return;
      }

      if (formData.professionalFees <= 0) {
        toast({
          title: "Validation Error",
          description: "Professional fees must be greater than 0.",
          variant: "destructive"
        });
        return;
      }

      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Bid updated successfully.",
      });
      
      navigate(`/bids/${id}`);
    } catch (error) {
      console.error('Error updating bid:', error);
      toast({
        title: "Error",
        description: "Failed to update bid. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout userType={layoutUserType}>
        <div className="container mx-auto px-4 py-6 space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!bid) {
    return (
      <DashboardLayout userType={layoutUserType}>
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Bid Not Found</h2>
            <p className="text-gray-600 mb-6">
              The bid you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/service-requests">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Opportunities
              </Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType={layoutUserType}>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={`/bids/${id}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Bid</h1>
              <p className="text-gray-600">{bid.bidNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate(`/bids/${id}`)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Financial Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Financial Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="professionalFees">Professional Fees (₹)</Label>
                    <Input
                      id="professionalFees"
                      type="number"
                      value={formData.professionalFees}
                      onChange={(e) => handleInputChange('professionalFees', Number(e.target.value))}
                      placeholder="Enter professional fees"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regulatoryPayouts">Regulatory Payouts (₹)</Label>
                    <Input
                      id="regulatoryPayouts"
                      type="number"
                      value={formData.regulatoryPayouts}
                      onChange={(e) => handleInputChange('regulatoryPayouts', Number(e.target.value))}
                      placeholder="Enter regulatory payouts"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ope">OPE (₹)</Label>
                    <Input
                      id="ope"
                      type="number"
                      value={formData.ope}
                      onChange={(e) => handleInputChange('ope', Number(e.target.value))}
                      placeholder="Enter OPE"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentStructure">Payment Structure</Label>
                    <Select 
                      value={formData.paymentStructure} 
                      onValueChange={(value) => handleInputChange('paymentStructure', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment structure" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={PaymentStructure.MILESTONE_BASED}>Milestone Based</SelectItem>
                        <SelectItem value={PaymentStructure.LUMP_SUM}>Lump Sum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{calculateTotal().toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery & Additional Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Delivery & Additional Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deliveryDate">Expected Delivery Date</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInputs">Additional Inputs & Approach</Label>
                  <Textarea
                    id="additionalInputs"
                    value={formData.additionalInputs}
                    onChange={(e) => handleInputChange('additionalInputs', e.target.value)}
                    placeholder="Describe your approach, methodology, and any additional value you'll provide..."
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>
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

            {/* Important Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Important Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p className="mb-2">• Changes to your bid will update the "Last Modified" timestamp</p>
                  <p className="mb-2">• You can edit your bid until it's accepted or the deadline passes</p>
                  <p>• All financial amounts should be in INR</p>
                </div>
              </CardContent>
            </Card>

            {/* Bid Status */}
            <Card>
              <CardHeader>
                <CardTitle>Current Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status</span>
                    <span className="font-medium">{bid.status}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Submitted</span>
                    <span className="font-medium">
                      {format(bid.submittedAt, 'dd/MM/yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="font-medium">
                      {format(bid.lastEditDate, 'dd/MM/yyyy')}
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

export default EditBid;
