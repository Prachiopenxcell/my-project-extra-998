import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft, 
  ArrowRight,
  CheckCircle, 
  FileText, 
  Calendar, 
  User, 
  Building, 
  DollarSign, 
  Scale, 
  Clock,
  AlertTriangle,
  Send,
  Save,
  Edit,
  Download,
  Eye,
  Upload,
  Gavel,
  Users,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface ReviewData {
  caseType: 'pre-filing' | 'active';
  caseNumber?: string;
  title: string;
  court: string;
  status: string;
  filingDate?: string;
  nextHearing?: string;
  plaintiff: string;
  defendant: string;
  amount: number;
  lawyer: {
    name: string;
    specialization: string;
    contact: string;
    email: string;
  };
  documents: {
    name: string;
    type: string;
    size: string;
    uploaded: boolean;
  }[];
  particulars: string;
  reliefSought: string;
  costEstimation: {
    filingFee: number;
    courtFee: number;
    counselFee: number;
    miscellaneous: number;
    total: number;
  };
}

const LitigationReviewSubmit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { type } = useParams();
  
  const [loading, setLoading] = useState(false);
  const [confirmSubmission, setConfirmSubmission] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Load review data from localStorage
  const [stage1Data, setStage1Data] = useState<Record<string, any> | null>(null);
  const [stage2Data, setStage2Data] = useState<Record<string, any> | null>(null);
  
  useEffect(() => {
    try {
      const s1 = localStorage.getItem('review_stage1');
      const s2 = localStorage.getItem('review_stage2');
      if (s1) setStage1Data(JSON.parse(s1));
      if (s2) setStage2Data(JSON.parse(s2));
    } catch { /* ignore */ }
  }, []);

  // Mock fallback data if no localStorage data
  const [reviewData] = useState<ReviewData>({
    caseType: stage2Data ? 'active' : 'pre-filing',
    caseNumber: stage2Data?.caseNumber || undefined,
    title: stage2Data ? (stage2Data.particulars?.slice(0, 50) || 'Active Litigation') : (stage1Data?.title || 'Pre-filing Application'),
    court: stage2Data?.court || stage1Data?.court || 'NCLT Mumbai',
    status: stage2Data?.status || 'Draft',
    filingDate: stage2Data?.filingDate || undefined,
    nextHearing: undefined,
    plaintiff: stage2Data?.plaintiff || 'Applicant',
    defendant: stage2Data?.defendant || 'Respondent',
    amount: 2500000,
    lawyer: stage2Data?.lawyer || stage1Data?.assignedLawyer ? {
      name: stage2Data?.lawyer?.name || 'Adv. Rajesh Sharma',
      specialization: stage2Data?.lawyer?.specialization || 'NCLT, NCLAT, Insolvency Law',
      contact: stage2Data?.lawyer?.contact || '+91-98765-43210',
      email: stage2Data?.lawyer?.email || 'rajesh.sharma@lawfirm.com'
    } : {
      name: 'Adv. Rajesh Sharma',
      specialization: 'NCLT, NCLAT, Insolvency Law',
      contact: '+91-98765-43210',
      email: 'rajesh.sharma@lawfirm.com'
    },
    documents: [
      { name: 'Application Copy.pdf', type: 'PDF', size: '2.5 MB', uploaded: true },
      { name: 'E-Filing Receipt.pdf', type: 'PDF', size: '1.2 MB', uploaded: true },
      { name: 'Supporting Documents.zip', type: 'ZIP', size: '5.8 MB', uploaded: true }
    ],
    particulars: stage2Data?.particulars || stage1Data?.particulars || 'Application particulars',
    reliefSought: stage2Data?.reliefSought || (Array.isArray(stage1Data?.reliefSought) ? stage1Data.reliefSought.join(', ') : stage1Data?.reliefSought) || 'Relief sought',
    costEstimation: stage2Data?.costEstimation || {
      filingFee: 15000,
      courtFee: 5000,
      counselFee: 35000,
      miscellaneous: 10000,
      total: 65000
    }
  });

  // Progress steps
  const steps = [
    { id: 1, title: "Stage Selection", completed: true },
    { id: 2, title: "Details", completed: true },
    { id: 3, title: "Documents", completed: true },
    { id: 4, title: "Review", completed: false, active: true }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleSubmit = async () => {
    if (!agreeTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions before submitting.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Clear review data after successful submit
      try {
        localStorage.removeItem('review_stage1');
        localStorage.removeItem('review_stage2');
      } catch { /* ignore */ }
      toast({
        title: "Case Submitted Successfully",
        description: `Your ${stage2Data ? 'litigation' : 'pre-filing'} case has been submitted for processing.`,
      });
      navigate('/litigation');
    }, 2000);
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your litigation case has been saved as draft.",
    });
    navigate('/litigation');
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/litigation/create/documents')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Documents
            </Button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed 
                    ? "bg-blue-500 text-white" 
                    : step.active 
                      ? "bg-blue-100 text-blue-800 border-2 border-blue-500" 
                      : "bg-gray-100 text-gray-400"
                }`}>
                  {step.completed ? <CheckCircle className="h-4 w-4" /> : step.id}
                </div>
                <span className={`text-xs mt-1 ${
                  step.active ? "font-medium text-blue-800" : "text-gray-500"
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Stage 1 Review */}
            {stage1Data && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-blue-600" />
                    Pre-filing Review (Stage 1)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Title</label>
                      <p className="font-medium mt-1">{stage1Data.title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Court</label>
                      <p className="mt-1">{stage1Data.court}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Act & Section</label>
                      <p className="mt-1">{stage1Data.actSection}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Response Type</label>
                      <p className="mt-1">{stage1Data.responseType} ({stage1Data.numberOfDays} days)</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Particulars</label>
                    <p className="mt-2 text-sm leading-relaxed">{stage1Data.particulars}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Relief Sought</label>
                    <p className="mt-2 text-sm leading-relaxed">{Array.isArray(stage1Data.reliefSought) ? stage1Data.reliefSought.join(', ') : stage1Data.reliefSought}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Documents</label>
                    <p className="mt-1">{stage1Data.documentsCount} documents uploaded</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stage 2 Review */}
            {stage2Data && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-orange-600" />
                    Active Litigation Review (Stage 2)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <p className="font-medium mt-1">{stage2Data.status}</p>
                    </div>
                    {stage2Data.caseNumber && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Case Number</label>
                        <p className="font-medium mt-1">{stage2Data.caseNumber}</p>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Plaintiff</label>
                      <p className="mt-1">{stage2Data.plaintiff}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Defendant</label>
                      <p className="mt-1">{stage2Data.defendant}</p>
                    </div>
                  </div>
                  {stage2Data.filingDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Filing Date</label>
                      <p className="mt-1">{formatDate(stage2Data.filingDate)}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-500">Particulars</label>
                    <p className="mt-2 text-sm leading-relaxed">{stage2Data.particulars}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Relief Sought</label>
                    <p className="mt-2 text-sm leading-relaxed">{stage2Data.reliefSought}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Application Versions</label>
                      <p className="mt-1">{stage2Data.applicationCopyVersions} versions</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">E-filing Receipt Versions</label>
                      <p className="mt-1">{stage2Data.eFilingReceiptVersions} versions</p>
                    </div>
                  </div>
                  {(stage2Data.interimOrders?.length > 0 || stage2Data.finalOrders?.length > 0) && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Orders</label>
                      <div className="mt-2 space-y-1 text-sm">
                        {stage2Data.interimOrders?.map((o, i) => (
                          <div key={i}>Interim: {o.date} - {o.summary}</div>
                        ))}
                        {stage2Data.finalOrders?.map((o, i) => (
                          <div key={i}>Final: {o.date} - {o.summary}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Combined Case Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-blue-600" />
                  Case Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Case Type</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={reviewData.caseType === 'active' ? 'default' : 'outline'}>
                        {reviewData.caseType === 'active' ? 'Active Litigation' : 'Pre-filing'}
                      </Badge>
                    </div>
                  </div>
                  
                  {reviewData.caseNumber && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Case Number</label>
                      <p className="font-medium mt-1">{reviewData.caseNumber}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Case Title</label>
                  <p className="font-medium mt-1">{reviewData.title}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Court</label>
                    <p className="mt-1">{reviewData.court}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <p className="mt-1">{reviewData.status}</p>
                  </div>
                </div>

                {reviewData.filingDate && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Filing Date</label>
                      <p className="mt-1">{formatDate(reviewData.filingDate)}</p>
                    </div>
                    
                    {reviewData.nextHearing && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Next Hearing</label>
                        <p className="mt-1">{formatDate(reviewData.nextHearing)}</p>
                      </div>
                    )}
                  </div>
                )}

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Plaintiff/Applicant</label>
                    <p className="mt-1">{reviewData.plaintiff}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Defendant/Respondent</label>
                    <p className="mt-1">{reviewData.defendant}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Amount Involved</label>
                  <p className="font-medium text-lg mt-1">{formatCurrency(reviewData.amount)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Lawyer Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-green-600" />
                  Assigned Lawyer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{reviewData.lawyer.name}</h4>
                    <p className="text-sm text-gray-500 mb-2">{reviewData.lawyer.specialization}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{reviewData.lawyer.contact}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{reviewData.lawyer.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Documents ({reviewData.documents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reviewData.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-gray-500">{doc.type} • {doc.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.uploaded && (
                          <Badge variant="outline" className="text-green-600 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Uploaded
                          </Badge>
                        )}
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Case Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-orange-600" />
                  Case Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Particulars of the Application</label>
                  <p className="mt-2 text-sm leading-relaxed">{reviewData.particulars}</p>
                </div>
                
                <Separator />
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Prayer/Relief Sought</label>
                  <p className="mt-2 text-sm leading-relaxed">{reviewData.reliefSought}</p>
                </div>
              </CardContent>
            </Card>

            {/* Terms and Confirmation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Final Confirmation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  />
                  <label htmlFor="terms" className="text-sm leading-relaxed">
                    I confirm that all the information provided is accurate and complete. I understand that any false information may result in rejection of the application and legal consequences.
                  </label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="confirm" 
                    checked={confirmSubmission}
                    onCheckedChange={(checked) => setConfirmSubmission(checked as boolean)}
                  />
                  <label htmlFor="confirm" className="text-sm leading-relaxed">
                    I authorize the submission of this {reviewData.caseType === 'active' ? 'active litigation case' : 'pre-filing application'} and agree to the associated costs and fees.
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={() => navigate('/litigation/create/documents')} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleSaveDraft} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Draft
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={!agreeTerms || loading}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Clock className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Case
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Cost Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Cost Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Filing Fee</span>
                    <span className="font-medium">{formatCurrency(reviewData.costEstimation.filingFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Court Fee</span>
                    <span className="font-medium">{formatCurrency(reviewData.costEstimation.courtFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Counsel Fee</span>
                    <span className="font-medium">{formatCurrency(reviewData.costEstimation.counselFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Miscellaneous</span>
                    <span className="font-medium">{formatCurrency(reviewData.costEstimation.miscellaneous)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total Cost</span>
                    <span className="text-green-600">{formatCurrency(reviewData.costEstimation.total)}</span>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-xs text-blue-800">
                    <AlertTriangle className="h-3 w-3 inline mr-1" />
                    Payment will be processed after case submission approval.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <p>Case will be reviewed by our legal team within 24 hours</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <p>You'll receive email notifications for all updates</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <p>Assigned lawyer will contact you within 48 hours</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <p>Track progress in the Litigation Management dashboard</p>
                </div>
              </CardContent>
            </Card>

            {/* Support Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>If you have questions about your submission:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>+91-1800-123-4567</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>support@998platform.com</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LitigationReviewSubmit;
