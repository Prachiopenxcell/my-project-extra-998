import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { 
  ArrowLeft,
  Save,
  CheckCircle,
  XCircle,
  AlertTriangle,
  DollarSign,
  FileText,
  Upload,
  Download,
  Eye,
  Calculator,
  Zap,
  MessageSquare,
  Clock,
  User
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface VerificationData {
  claimId: string;
  claimantName: string;
  claimantCategory: string;
  claimedAmount: number;
  principalAmount: number;
  interestAmount: number;
  securityType: string;
  relationshipStatus: string;
  platformRemarks: string;
  platformAmount: number;
  verifierAmount: number;
  verifierRemarks: string;
  verificationStatus: 'pending' | 'ongoing' | 'completed' | 'modification_done';
  queries: Array<{
    id: string;
    question: string;
    response: string;
    timestamp: string;
  }>;
  checklist: {
    relatedParty: boolean;
    formFilled: boolean;
    formSigned: boolean;
    formVerified: boolean;
    formDeclared: boolean;
    authorizedSignatory: boolean;
    letterOfAuthority: boolean;
    limitationTest: boolean;
    msmeRegistered: boolean;
    receiptsOnTime: boolean;
    interestCalculation: boolean;
  };
}

const ClaimVerification = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [verificationData, setVerificationData] = useState<VerificationData>({
    claimId: "claim-001",
    claimantName: "State Bank of India",
    claimantCategory: "Financial Creditor - Secured",
    claimedAmount: 5000000,
    principalAmount: 4500000,
    interestAmount: 500000,
    securityType: "Secured",
    relationshipStatus: "Not Related",
    platformRemarks: "Documents verified. Amount calculation matches ledger entries.",
    platformAmount: 4800000,
    verifierAmount: 0,
    verifierRemarks: "",
    verificationStatus: "ongoing",
    queries: [
      {
        id: "q1",
        question: "Please provide updated bank statements for the last 6 months",
        response: "Updated statements have been uploaded to the document section",
        timestamp: "2024-01-21T10:30:00"
      }
    ],
    checklist: {
      relatedParty: false,
      formFilled: true,
      formSigned: true,
      formVerified: true,
      formDeclared: true,
      authorizedSignatory: true,
      letterOfAuthority: true,
      limitationTest: true,
      msmeRegistered: false,
      receiptsOnTime: true,
      interestCalculation: true
    }
  });

  const [newQuery, setNewQuery] = useState("");
  const [additionalDocuments, setAdditionalDocuments] = useState("");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleAcceptPlatformFigure = () => {
    setVerificationData(prev => ({
      ...prev,
      verifierAmount: prev.platformAmount,
      verificationStatus: 'completed'
    }));
    toast({
      title: "Platform Figure Accepted",
      description: "Verification completed with platform suggested amount.",
    });
  };

  const handleSaveVerification = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Verification Saved",
        description: "Claim verification has been saved successfully.",
      });
    }, 1000);
  };

  const handleCompleteVerification = () => {
    if (!verificationData.verifierAmount) {
      toast({
        title: "Amount Required",
        description: "Please specify the admissible amount before completing verification.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVerificationData(prev => ({
        ...prev,
        verificationStatus: 'completed'
      }));
      toast({
        title: "Verification Completed",
        description: "Claim verification has been completed successfully.",
      });
      navigate(`/claims/claim/${id}`);
    }, 1500);
  };

  const handleAddQuery = () => {
    if (!newQuery.trim()) return;

    const query = {
      id: `q${verificationData.queries.length + 1}`,
      question: newQuery,
      response: "",
      timestamp: new Date().toISOString()
    };

    setVerificationData(prev => ({
      ...prev,
      queries: [...prev.queries, query]
    }));

    setNewQuery("");
    toast({
      title: "Query Added",
      description: "Query has been sent to the claimant.",
    });
  };

  const updateChecklist = (field: keyof typeof verificationData.checklist, value: boolean) => {
    setVerificationData(prev => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [field]: value
      }
    }));
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate(`/claims/claim/${id}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Claim
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Claim Verification</h1>
            <p className="text-gray-600 mt-1">Verify and validate claim details</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSaveVerification} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              Save Progress
            </Button>
            <Button 
              onClick={handleCompleteVerification} 
              disabled={loading || verificationData.verificationStatus === 'completed'}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete Verification
            </Button>
          </div>
        </div>

        {/* Status Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-600">Claimant</p>
                <p className="font-semibold">{verificationData.claimantName}</p>
                <p className="text-xs text-gray-500">{verificationData.claimantCategory}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Claimed Amount</p>
                <p className="font-semibold text-lg">{formatCurrency(verificationData.claimedAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Platform Suggested</p>
                <p className="font-semibold text-lg text-blue-600">{formatCurrency(verificationData.platformAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Verification Status</p>
                <Badge className={
                  verificationData.verificationStatus === 'completed' ? 'bg-green-100 text-green-800' :
                  verificationData.verificationStatus === 'ongoing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }>
                  {verificationData.verificationStatus}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
            <TabsTrigger value="amounts">Amount Review</TabsTrigger>
            <TabsTrigger value="queries">Queries</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Claim Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Security Type</Label>
                      <Select value={verificationData.securityType} onValueChange={(value) => 
                        setVerificationData(prev => ({ ...prev, securityType: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Secured">Secured</SelectItem>
                          <SelectItem value="Unsecured">Unsecured</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Relationship Status</Label>
                      <Select value={verificationData.relationshipStatus} onValueChange={(value) => 
                        setVerificationData(prev => ({ ...prev, relationshipStatus: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Not Related">Not Related</SelectItem>
                          <SelectItem value="Related Party">Related Party</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    AI Platform Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Platform Remarks</Label>
                    <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                      {verificationData.platformRemarks}
                    </p>
                  </div>
                  <div>
                    <Label>Suggested Amount</Label>
                    <p className="text-lg font-semibold text-blue-600">
                      {formatCurrency(verificationData.platformAmount)}
                    </p>
                  </div>
                  <Button 
                    onClick={handleAcceptPlatformFigure}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Accept Platform's Figure
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="checklist">
            <Card>
              <CardHeader>
                <CardTitle>Verification Checklist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Form Verification</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="formFilled"
                          checked={verificationData.checklist.formFilled}
                          onCheckedChange={(checked) => updateChecklist('formFilled', checked as boolean)}
                        />
                        <Label htmlFor="formFilled">Form properly filled</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="formSigned"
                          checked={verificationData.checklist.formSigned}
                          onCheckedChange={(checked) => updateChecklist('formSigned', checked as boolean)}
                        />
                        <Label htmlFor="formSigned">Form properly signed</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="formVerified"
                          checked={verificationData.checklist.formVerified}
                          onCheckedChange={(checked) => updateChecklist('formVerified', checked as boolean)}
                        />
                        <Label htmlFor="formVerified">Form properly verified</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="formDeclared"
                          checked={verificationData.checklist.formDeclared}
                          onCheckedChange={(checked) => updateChecklist('formDeclared', checked as boolean)}
                        />
                        <Label htmlFor="formDeclared">Form properly declared</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Authorization & Documentation</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="authorizedSignatory"
                          checked={verificationData.checklist.authorizedSignatory}
                          onCheckedChange={(checked) => updateChecklist('authorizedSignatory', checked as boolean)}
                        />
                        <Label htmlFor="authorizedSignatory">Authorized signatory verified</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="letterOfAuthority"
                          checked={verificationData.checklist.letterOfAuthority}
                          onCheckedChange={(checked) => updateChecklist('letterOfAuthority', checked as boolean)}
                        />
                        <Label htmlFor="letterOfAuthority">Letter of Authority attached</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="relatedParty"
                          checked={verificationData.checklist.relatedParty}
                          onCheckedChange={(checked) => updateChecklist('relatedParty', checked as boolean)}
                        />
                        <Label htmlFor="relatedParty">Related party status verified</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Compliance & Timing</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="limitationTest"
                          checked={verificationData.checklist.limitationTest}
                          onCheckedChange={(checked) => updateChecklist('limitationTest', checked as boolean)}
                        />
                        <Label htmlFor="limitationTest">Limitation test passed</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="receiptsOnTime"
                          checked={verificationData.checklist.receiptsOnTime}
                          onCheckedChange={(checked) => updateChecklist('receiptsOnTime', checked as boolean)}
                        />
                        <Label htmlFor="receiptsOnTime">Receipts submitted on time</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="msmeRegistered"
                          checked={verificationData.checklist.msmeRegistered}
                          onCheckedChange={(checked) => updateChecklist('msmeRegistered', checked as boolean)}
                        />
                        <Label htmlFor="msmeRegistered">MSME registered (if applicable)</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Financial Verification</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="interestCalculation"
                          checked={verificationData.checklist.interestCalculation}
                          onCheckedChange={(checked) => updateChecklist('interestCalculation', checked as boolean)}
                        />
                        <Label htmlFor="interestCalculation">Interest calculation verified</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="amounts">
            <Card>
              <CardHeader>
                <CardTitle>Amount Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Claimed Amount</h4>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(verificationData.claimedAmount)}</p>
                    <p className="text-sm text-gray-600">As submitted by claimant</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Platform Suggested</h4>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(verificationData.platformAmount)}</p>
                    <p className="text-sm text-blue-600">AI analysis result</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Verifier Amount</h4>
                    <Input
                      type="number"
                      value={verificationData.verifierAmount || ''}
                      onChange={(e) => setVerificationData(prev => ({
                        ...prev,
                        verifierAmount: parseFloat(e.target.value) || 0
                      }))}
                      placeholder="Enter verified amount"
                      className="text-lg font-bold"
                    />
                    <p className="text-sm text-green-600 mt-1">Final verified amount</p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="verifierRemarks">Verifier Remarks</Label>
                  <Textarea
                    id="verifierRemarks"
                    value={verificationData.verifierRemarks}
                    onChange={(e) => setVerificationData(prev => ({
                      ...prev,
                      verifierRemarks: e.target.value
                    }))}
                    placeholder="Add your verification comments and remarks..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="queries">
            <Card>
              <CardHeader>
                <CardTitle>Queries & Communication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {verificationData.queries.map((query) => (
                    <div key={query.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium">Query:</p>
                          <p className="text-gray-700 mb-2">{query.question}</p>
                          {query.response && (
                            <>
                              <p className="font-medium text-green-700">Response:</p>
                              <p className="text-gray-700">{query.response}</p>
                            </>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(query.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <Label htmlFor="newQuery">Add New Query</Label>
                  <div className="flex gap-2 mt-2">
                    <Textarea
                      id="newQuery"
                      value={newQuery}
                      onChange={(e) => setNewQuery(e.target.value)}
                      placeholder="Enter your query for the claimant..."
                      rows={3}
                      className="flex-1"
                    />
                    <Button onClick={handleAddQuery} disabled={!newQuery.trim()}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Query
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="additionalDocs">Request Additional Documents</Label>
                  <Textarea
                    id="additionalDocs"
                    value={additionalDocuments}
                    onChange={(e) => setAdditionalDocuments(e.target.value)}
                    placeholder="Specify additional documents required..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Supporting Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Loan Agreement.pdf</p>
                        <p className="text-sm text-gray-500">PDF • 2.5 MB • Uploaded Jan 20, 2024</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Bank Statements.pdf</p>
                        <p className="text-sm text-gray-500">PDF • 1.8 MB • Uploaded Jan 20, 2024</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Upload additional verification documents</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Choose Files
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ClaimVerification;
