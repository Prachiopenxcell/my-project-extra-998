import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { 
  Plus,
  RefreshCw,
  FileText,
  BarChart3,
  TrendingUp,
  DollarSign,
  PieChart,
  Award,
  Star,
  Zap,
  Download,
  Mail,
  Save
} from "lucide-react";
import AddPlanForm from './AddPlanForm';

interface ResolutionPlan {
  id: string;
  praName: string;
  version: string;
  submitDate: string;
  npvValue: number;
  recoveryPercentage: number;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  securedCreditors: number;
  unsecuredCreditors: number;
  operationalCreditors: number;
  workmenDues: number;
  totalRecovery: number;
  rank: number;
}

interface PaymentTimeline {
  year: number;
  techsolPayment: number;
  infracorpPayment: number;
  techsolCumulative: number;
  infracorpCumulative: number;
}

const PlanAnalysis = () => {
  const [selectedPlan1, setSelectedPlan1] = useState("1");
  const [selectedPlan2, setSelectedPlan2] = useState("2");
  const [showAddPlanForm, setShowAddPlanForm] = useState(false);
  
  // State for managing resolution plans
  const [resolutionPlans, setResolutionPlans] = useState<ResolutionPlan[]>([
    {
      id: "1",
      praName: "TechSol Industries",
      version: "V1.2",
      submitDate: "2025-01-20",
      npvValue: 127.4,
      recoveryPercentage: 68,
      status: "under_review",
      securedCreditors: 85.2,
      unsecuredCreditors: 45.3,
      operationalCreditors: 8.9,
      workmenDues: 2.3,
      totalRecovery: 141.7,
      rank: 2
    },
    {
      id: "2",
      praName: "InfraCorp Solutions",
      version: "V2.0",
      submitDate: "2025-01-21",
      npvValue: 145.8,
      recoveryPercentage: 75,
      status: "approved",
      securedCreditors: 92.1,
      unsecuredCreditors: 58.7,
      operationalCreditors: 11.2,
      workmenDues: 2.3,
      totalRecovery: 164.3,
      rank: 1
    }
  ]);

  // Handler for adding new plan
  const handleAddPlan = (newPlan: ResolutionPlan) => {
    // Recalculate ranks for all plans based on NPV value
    const updatedPlans = [...resolutionPlans, newPlan].sort((a, b) => b.npvValue - a.npvValue);
    const rankedPlans = updatedPlans.map((plan, index) => ({ ...plan, rank: index + 1 }));
    
    setResolutionPlans(rankedPlans);
    
    toast({
      title: "Plan Added Successfully",
      description: `${newPlan.praName} has been added to the comparison matrix.`
    });
  };

  const liquidationValue = {
    securedCreditors: 78.5,
    unsecuredCreditors: 12.3,
    operationalCreditors: 5.1,
    workmenDues: 2.3,
    totalRecovery: 98.2,
    npvValue: 89.1
  };

  const paymentTimeline: PaymentTimeline[] = [
    { year: 1, techsolPayment: 45.2, infracorpPayment: 52.1, techsolCumulative: 32, infracorpCumulative: 38 },
    { year: 2, techsolPayment: 38.7, infracorpPayment: 48.9, techsolCumulative: 59, infracorpCumulative: 74 },
    { year: 3, techsolPayment: 32.1, infracorpPayment: 35.2, techsolCumulative: 82, infracorpCumulative: 100 },
    { year: 4, techsolPayment: 25.7, infracorpPayment: 28.1, techsolCumulative: 100, infracorpCumulative: 100 }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      submitted: { label: "Submitted", color: "bg-blue-100 text-blue-800" },
      under_review: { label: "Under Review", color: "bg-yellow-100 text-yellow-800" },
      approved: { label: "Approved", color: "bg-green-100 text-green-800" },
      rejected: { label: "Rejected", color: "bg-red-100 text-red-800" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const selectedPlan1Data = resolutionPlans.find(p => p.id === selectedPlan1);
  const selectedPlan2Data = resolutionPlans.find(p => p.id === selectedPlan2);

  return (
    <div className="space-y-6">

      {/* Plan Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Plans for Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Plan 1:</span>
              <Select value={selectedPlan1} onValueChange={setSelectedPlan1}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {resolutionPlans.map(plan => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.praName} - {plan.version}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Plan 2:</span>
              <Select value={selectedPlan2} onValueChange={setSelectedPlan2}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {resolutionPlans.map(plan => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.praName} - {plan.version}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setShowAddPlanForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Plan
            </Button>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Compare Selected
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              View All Plans
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Financial Comparison Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Financial Comparison Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Particulars</TableHead>
                <TableHead>TechSol Plan</TableHead>
                <TableHead>InfraCorp Plan</TableHead>
                <TableHead>Liquidation Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Secured Creditors</TableCell>
                <TableCell>₹ 85.2 Cr (95%)</TableCell>
                <TableCell>₹ 92.1 Cr (102%)</TableCell>
                <TableCell>₹ 78.5 Cr (87%)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Unsecured Creditors</TableCell>
                <TableCell>₹ 45.3 Cr (35%)</TableCell>
                <TableCell>₹ 58.7 Cr (45%)</TableCell>
                <TableCell>₹ 12.3 Cr (9.5%)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Operational Creditors</TableCell>
                <TableCell>₹ 8.9 Cr (78%)</TableCell>
                <TableCell>₹ 11.2 Cr (98%)</TableCell>
                <TableCell>₹ 5.1 Cr (45%)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Workmen Dues</TableCell>
                <TableCell>₹ 2.3 Cr (100%)</TableCell>
                <TableCell>₹ 2.3 Cr (100%)</TableCell>
                <TableCell>₹ 2.3 Cr (100%)</TableCell>
              </TableRow>
              <TableRow className="border-t-2">
                <TableCell className="font-bold">Total Recovery</TableCell>
                <TableCell className="font-bold">₹ 141.7 Cr</TableCell>
                <TableCell className="font-bold">₹ 164.3 Cr</TableCell>
                <TableCell className="font-bold">₹ 98.2 Cr</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">NPV @ 12%</TableCell>
                <TableCell className="font-bold">₹ 127.4 Cr</TableCell>
                <TableCell className="font-bold">₹ 145.8 Cr</TableCell>
                <TableCell className="font-bold">₹ 89.1 Cr</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold">Rank</TableCell>
                <TableCell>
                  <Badge variant="secondary">2nd Place</Badge>
                </TableCell>
                <TableCell>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Star className="h-3 w-3 mr-1" />
                    1st Place
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">Baseline</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Timeline Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Payment Timeline Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead>TechSol Payment</TableHead>
                <TableHead>InfraCorp Payment</TableHead>
                <TableHead>Cumulative Recovery</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentTimeline.map((timeline) => (
                <TableRow key={timeline.year}>
                  <TableCell className="font-medium">Y{timeline.year}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>₹ {timeline.techsolPayment} Cr</span>
                      <Progress value={timeline.techsolPayment / 52.1 * 100} className="w-16" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>₹ {timeline.infracorpPayment} Cr</span>
                      <Progress value={timeline.infracorpPayment / 52.1 * 100} className="w-16" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">TechSol: {timeline.techsolCumulative}%</div>
                      <div className="text-sm">InfraCorp: {timeline.infracorpCumulative}%</div>
                      {timeline.infracorpCumulative > timeline.techsolCumulative && (
                        <Badge variant="secondary" className="text-xs">
                          ✓ Faster payout
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* AI-Generated Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            AI-Generated Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <Award className="h-5 w-5 text-green-600" />
                <span className="text-sm"><strong>Best Plan:</strong> InfraCorp Solutions offers 16% higher NPV recovery</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
                <span className="text-sm"><strong>Risk Factor:</strong> TechSol has longer payback period but more stable structure</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <PieChart className="h-5 w-5 text-blue-600" />
                <span className="text-sm"><strong>Recommendation:</strong> Consider InfraCorp for higher creditor satisfaction</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                <FileText className="h-5 w-5 text-purple-600" />
                <span className="text-sm"><strong>Compliance:</strong> Both plans meet IBC Section 30 requirements</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-4">
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Generate Detailed Report
            </Button>
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Share with CoC
            </Button>
            <Button variant="outline">
              <Save className="h-4 w-4 mr-2" />
              Save Analysis
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Navigation Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Quick Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                NPV Analysis
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <DollarSign className="h-4 w-4 mr-2" />
                Payment Schedule
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <PieChart className="h-4 w-4 mr-2" />
                Liquidation vs Resolution
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Compliance Check
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Creditor Recovery
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">₹164.3 Cr</div>
                <div className="text-sm text-muted-foreground">Best Recovery</div>
                <Badge className="bg-green-100 text-green-800 mt-1">InfraCorp Plan</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">16%</div>
                <div className="text-sm text-muted-foreground">Higher NPV</div>
                <Badge variant="secondary" className="mt-1">vs TechSol</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">67%</div>
                <div className="text-sm text-muted-foreground">Better than Liquidation</div>
                <Badge variant="outline" className="mt-1">Both Plans</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Plan Form Modal */}
      <AddPlanForm
        isOpen={showAddPlanForm}
        onClose={() => setShowAddPlanForm(false)}
        onSave={handleAddPlan}
        existingPlans={resolutionPlans}
      />
    </div>
  );
};

export default PlanAnalysis;
