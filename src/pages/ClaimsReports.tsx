import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { 
  Download,
  FileText,
  BarChart3,
  Calendar as CalendarIcon,
  Filter,
  Eye,
  Save,
  Printer,
  Share,
  Settings,
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  PieChart,
  FileSpreadsheet
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ReportData {
  totalClaims: number;
  totalAmount: number;
  admittedAmount: number;
  rejectedAmount: number;
  pendingAmount: number;
  categoryBreakdown: Array<{
    category: string;
    count: number;
    amount: number;
    percentage: number;
  }>;
  statusBreakdown: Array<{
    status: string;
    count: number;
    amount: number;
    percentage: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    submitted: number;
    verified: number;
    admitted: number;
  }>;
}

const ClaimsReports = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);

  // Report configuration state
  const [reportConfig, setReportConfig] = useState({
    reportType: "standard",
    cutoffDate: undefined as Date | undefined,
    claimsReceivedTill: undefined as Date | undefined,
    claimsVerifiedTill: undefined as Date | undefined,
    claimsAdmittedTill: undefined as Date | undefined,
    selectedCategories: [] as string[],
    selectedFields: [] as string[],
    includeDocuments: false,
    includeSignature: true
  });

  // Mock data - replace with actual API calls
  const [reportData, setReportData] = useState<ReportData>({
    totalClaims: 156,
    totalAmount: 25000000,
    admittedAmount: 18500000,
    rejectedAmount: 2000000,
    pendingAmount: 4500000,
    categoryBreakdown: [
      { category: "Financial Creditor - Secured", count: 45, amount: 15000000, percentage: 60 },
      { category: "Financial Creditor - Unsecured", count: 32, amount: 6000000, percentage: 24 },
      { category: "Operational Creditor", count: 28, amount: 3000000, percentage: 12 },
      { category: "Workmen/Staff/Employees", count: 25, amount: 800000, percentage: 3.2 },
      { category: "Statutory Authorities", count: 26, amount: 200000, percentage: 0.8 }
    ],
    statusBreakdown: [
      { status: "Accepted", count: 89, amount: 18500000, percentage: 74 },
      { status: "Verification Pending", count: 23, amount: 3200000, percentage: 12.8 },
      { status: "Admission Pending", count: 12, amount: 1300000, percentage: 5.2 },
      { status: "Rejected", count: 18, amount: 2000000, percentage: 8 },
      { status: "Allocation Pending", count: 14, amount: 0, percentage: 0 }
    ],
    monthlyTrends: [
      { month: "Oct 2023", submitted: 25, verified: 20, admitted: 18 },
      { month: "Nov 2023", submitted: 32, verified: 28, admitted: 25 },
      { month: "Dec 2023", submitted: 41, verified: 35, admitted: 30 },
      { month: "Jan 2024", submitted: 58, verified: 45, admitted: 38 }
    ]
  });

  const reportTypes = [
    { value: "standard", label: "Standard Report" },
    { value: "ar_voting", label: "AR Voting Summary" },
    { value: "customized", label: "Customized Report" },
    { value: "ibc_summary", label: "IBC CIRP Summary List" },
    { value: "ibc_schedules", label: "IBC CIRP Schedules" },
    { value: "cutoff_claims", label: "Claims Received after Cut-off Date" }
  ];

  const availableCategories = [
    "Consolidated",
    "Financial Creditor - Secured",
    "Financial Creditor - Unsecured", 
    "FC in a class - Deposit Holder",
    "FC in a class - Home Buyers",
    "Operational Creditor",
    "Workmen/Staff/Employees",
    "Statutory Authorities",
    "Others"
  ];

  const availableFields = [
    "Claimant's Name",
    "Submitter's Name",
    "Claimant's PAN",
    "Claimant's ID",
    "Total Amount Claimed",
    "Principal Amount Claimed",
    "Interest Amount Claimed",
    "Relationship Status",
    "Security Status",
    "Security Details",
    "Total Amount Admitted",
    "Principal Amount Admitted",
    "Interest Amount Admitted",
    "Vote Share",
    "Amount under Verification",
    "Remarks",
    "Verified By",
    "Admitted By"
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleGenerateReport = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Report Generated",
        description: "Your claims report has been generated successfully.",
      });
    }, 2000);
  };

  const handleDownloadReport = (format: 'pdf' | 'excel') => {
    toast({
      title: "Download Started",
      description: `Report download in ${format.toUpperCase()} format has been initiated.`,
    });
  };

  const handleSaveReport = () => {
    toast({
      title: "Report Saved",
      description: "Report configuration has been saved for future use.",
    });
  };

  const toggleCategory = (category: string) => {
    setReportConfig(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter(c => c !== category)
        : [...prev.selectedCategories, category]
    }));
  };

  const toggleField = (field: string) => {
    setReportConfig(prev => ({
      ...prev,
      selectedFields: prev.selectedFields.includes(field)
        ? prev.selectedFields.filter(f => f !== field)
        : [...prev.selectedFields, field]
    }));
  };

  return (
    <DashboardLayout userType="service_provider">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Claims Reports & Analytics</h1>
            <p className="text-gray-600 mt-1">Generate comprehensive reports and analyze claim data</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSaveReport}>
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
            <Button onClick={handleGenerateReport} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              <BarChart3 className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="configure">Configure Report</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="saved">Saved Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.totalClaims}</div>
                  <p className="text-xs text-muted-foreground">
                    Claims submitted to date
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(reportData.totalAmount)}</div>
                  <p className="text-xs text-muted-foreground">
                    Total claimed amount
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Admitted Amount</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(reportData.admittedAmount)}</div>
                  <p className="text-xs text-muted-foreground">
                    {((reportData.admittedAmount / reportData.totalAmount) * 100).toFixed(1)}% of total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{formatCurrency(reportData.pendingAmount)}</div>
                  <p className="text-xs text-muted-foreground">
                    Under review/verification
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Claims by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportData.categoryBreakdown.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{category.category}</span>
                            <span className="text-sm text-gray-500">{category.count} claims</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${category.percentage}%` }}
                            ></div>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500">{formatCurrency(category.amount)}</span>
                            <span className="text-xs text-gray-500">{category.percentage}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Claims by Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportData.statusBreakdown.map((status, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{status.status}</span>
                            <span className="text-sm text-gray-500">{status.count} claims</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                status.status === 'Accepted' ? 'bg-green-600' :
                                status.status === 'Rejected' ? 'bg-red-600' :
                                'bg-yellow-600'
                              }`}
                              style={{ width: `${status.percentage}%` }}
                            ></div>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500">{formatCurrency(status.amount)}</span>
                            <span className="text-xs text-gray-500">{status.percentage}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="configure">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Report Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Report Type</Label>
                      <Select 
                        value={reportConfig.reportType} 
                        onValueChange={(value) => setReportConfig(prev => ({ ...prev, reportType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {reportTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Cut-off Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !reportConfig.cutoffDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {reportConfig.cutoffDate ? format(reportConfig.cutoffDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={reportConfig.cutoffDate}
                            onSelect={(date) => setReportConfig(prev => ({ ...prev, cutoffDate: date }))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {reportConfig.reportType === "customized" && (
                    <>
                      <div>
                        <Label className="text-base font-semibold">Select Categories</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                          {availableCategories.map((category) => (
                            <div key={category} className="flex items-center space-x-2">
                              <Checkbox
                                id={category}
                                checked={reportConfig.selectedCategories.includes(category)}
                                onCheckedChange={() => toggleCategory(category)}
                              />
                              <Label htmlFor={category} className="text-sm">{category}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-base font-semibold">Select Fields</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                          {availableFields.map((field) => (
                            <div key={field} className="flex items-center space-x-2">
                              <Checkbox
                                id={field}
                                checked={reportConfig.selectedFields.includes(field)}
                                onCheckedChange={() => toggleField(field)}
                              />
                              <Label htmlFor={field} className="text-sm">{field}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeSignature"
                        checked={reportConfig.includeSignature}
                        onCheckedChange={(checked) => setReportConfig(prev => ({ 
                          ...prev, 
                          includeSignature: checked as boolean 
                        }))}
                      />
                      <Label htmlFor="includeSignature">Include Digital Signature</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeDocuments"
                        checked={reportConfig.includeDocuments}
                        onCheckedChange={(checked) => setReportConfig(prev => ({ 
                          ...prev, 
                          includeDocuments: checked as boolean 
                        }))}
                      />
                      <Label htmlFor="includeDocuments">Include Supporting Documents</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Generate & Download</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      onClick={handleGenerateReport} 
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      {loading ? "Generating..." : "Generate Report"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleDownloadReport('pdf')}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleDownloadReport('excel')}
                    >
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      Download Excel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportData.monthlyTrends.map((trend, index) => (
                      <div key={index} className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{trend.month}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Submitted</p>
                          <p className="font-semibold text-blue-600">{trend.submitted}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Verified</p>
                          <p className="font-semibold text-yellow-600">{trend.verified}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Admitted</p>
                          <p className="font-semibold text-green-600">{trend.admitted}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-600">
                        {((reportData.admittedAmount / reportData.totalAmount) * 100).toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-600">Admission Rate</p>
                    </div>
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-green-600">
                        {Math.round((reportData.statusBreakdown.find(s => s.status === 'Accepted')?.count || 0) / reportData.totalClaims * 100)}%
                      </p>
                      <p className="text-sm text-gray-600">Claims Accepted</p>
                    </div>
                    <div className="text-center p-6 bg-yellow-50 rounded-lg">
                      <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-yellow-600">
                        {Math.round(((reportData.statusBreakdown.find(s => s.status === 'Verification Pending')?.count || 0) + 
                                    (reportData.statusBreakdown.find(s => s.status === 'Admission Pending')?.count || 0)) / reportData.totalClaims * 100)}%
                      </p>
                      <p className="text-sm text-gray-600">Claims Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="saved">
            <Card>
              <CardHeader>
                <CardTitle>Saved Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Monthly Claims Summary - January 2024</p>
                      <p className="text-sm text-gray-500">Generated on Jan 25, 2024 • PDF • 2.1 MB</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">AR Voting Summary Report</p>
                      <p className="text-sm text-gray-500">Generated on Jan 20, 2024 • Excel • 1.8 MB</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No more saved reports</p>
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

export default ClaimsReports;
