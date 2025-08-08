import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { 
  Settings, 
  Users, 
  UserCheck, 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Edit, 
  Eye,
  ChevronLeft,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Building,
  Calendar,
  Filter,
  ArrowUpDown,
  Shuffle,
  Target,
  FileText,
  User,
  Mail,
  Phone
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  workload: number;
  maxCapacity: number;
}

interface ClaimAllocationRule {
  id: string;
  category: string;
  amountRange: {
    min: number;
    max: number;
  };
  verificationTeamMember: string;
  admissionTeamMember: string;
  priority: 'high' | 'medium' | 'low';
  autoAssign: boolean;
}

interface Claim {
  id: string;
  claimantName: string;
  category: string;
  claimedAmount: number;
  receiptDate: string;
  verificationAssignee: string;
  admissionAssignee: string;
  status: string;
}

const ClaimsAllocationSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("global");
  const [loading, setLoading] = useState(false);

  // Mock team members data
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: "tm-001",
      name: "John Verifier",
      email: "john.v@company.com",
      role: "Claims Verifier",
      department: "Verification",
      workload: 15,
      maxCapacity: 25
    },
    {
      id: "tm-002",
      name: "Sarah Admitter",
      email: "sarah.a@company.com",
      role: "Claims Admitter",
      department: "Admission",
      workload: 12,
      maxCapacity: 20
    },
    {
      id: "tm-003",
      name: "Mike Analyst",
      email: "mike.a@company.com",
      role: "Senior Analyst",
      department: "Both",
      workload: 8,
      maxCapacity: 15
    },
    {
      id: "tm-004",
      name: "Lisa Manager",
      email: "lisa.m@company.com",
      role: "Team Manager",
      department: "Both",
      workload: 5,
      maxCapacity: 10
    }
  ]);

  // Mock allocation rules
  const [allocationRules, setAllocationRules] = useState<ClaimAllocationRule[]>([
    {
      id: "rule-001",
      category: "Financial Creditor - Secured",
      amountRange: { min: 1000000, max: 10000000 },
      verificationTeamMember: "tm-001",
      admissionTeamMember: "tm-002",
      priority: "high",
      autoAssign: true
    },
    {
      id: "rule-002",
      category: "Operational Creditor",
      amountRange: { min: 100000, max: 1000000 },
      verificationTeamMember: "tm-003",
      admissionTeamMember: "tm-004",
      priority: "medium",
      autoAssign: false
    }
  ]);

  // Mock claims data
  const [claims, setClaims] = useState<Claim[]>([
    {
      id: "claim-001",
      claimantName: "State Bank of India",
      category: "Financial Creditor - Secured",
      claimedAmount: 2500000,
      receiptDate: "2024-01-20",
      verificationAssignee: "Not Allocated",
      admissionAssignee: "Not Allocated",
      status: "pending_allocation"
    },
    {
      id: "claim-002",
      claimantName: "HDFC Bank Ltd",
      category: "Financial Creditor - Unsecured",
      claimedAmount: 1500000,
      receiptDate: "2024-01-18",
      verificationAssignee: "John Verifier",
      admissionAssignee: "Not Allocated",
      status: "verification_assigned"
    },
    {
      id: "claim-003",
      claimantName: "ABC Suppliers Ltd",
      category: "Operational Creditor",
      claimedAmount: 750000,
      receiptDate: "2024-01-19",
      verificationAssignee: "Not Allocated",
      admissionAssignee: "Not Allocated",
      status: "pending_allocation"
    }
  ]);

  // Auto-allocation settings
  const [autoAllocationSettings, setAutoAllocationSettings] = useState({
    enabled: false,
    method: "fixed_amount", // fixed_amount, range
    fixedAmount: {
      numberOfClaimants: 10,
      claimedAmount: 5000000
    },
    rangeSettings: {
      amountRanges: [
        { min: 0, max: 500000, assignee: "tm-003" },
        { min: 500001, max: 2000000, assignee: "tm-001" },
        { min: 2000001, max: 10000000, assignee: "tm-002" }
      ]
    }
  });

  const claimCategories = [
    "Financial Creditor - Secured",
    "Financial Creditor - Unsecured", 
    "FC in a class - Deposit Holder",
    "FC in a class - Home Buyers",
    "Operational Creditor",
    "Workmen/Staff/Employees",
    "Statutory Authorities",
    "Others"
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTeamMemberName = (id: string) => {
    const member = teamMembers.find(tm => tm.id === id);
    return member ? member.name : "Not Allocated";
  };

  const handleSaveGlobalRules = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Global Rules Saved",
        description: "Allocation rules have been successfully updated.",
      });
    }, 1000);
  };

  const handleAutoAllocate = () => {
    setLoading(true);
    setTimeout(() => {
      // Mock auto-allocation logic
      const updatedClaims = claims.map(claim => {
        if (claim.verificationAssignee === "Not Allocated") {
          const randomMember = teamMembers[Math.floor(Math.random() * teamMembers.length)];
          return {
            ...claim,
            verificationAssignee: randomMember.name,
            status: "verification_assigned"
          };
        }
        return claim;
      });
      setClaims(updatedClaims);
      setLoading(false);
      toast({
        title: "Auto-Allocation Complete",
        description: `${updatedClaims.filter(c => c.verificationAssignee !== "Not Allocated").length} claims have been automatically allocated.`,
      });
    }, 2000);
  };

  const handleManualAssignment = (claimId: string, field: 'verification' | 'admission', memberId: string) => {
    const updatedClaims = claims.map(claim => {
      if (claim.id === claimId) {
        const memberName = getTeamMemberName(memberId);
        return {
          ...claim,
          [field === 'verification' ? 'verificationAssignee' : 'admissionAssignee']: memberName,
          status: field === 'verification' ? 'verification_assigned' : 'admission_assigned'
        };
      }
      return claim;
    });
    setClaims(updatedClaims);
    toast({
      title: "Assignment Updated",
      description: `Claim has been assigned for ${field}.`,
    });
  };

  return (
    <DashboardLayout userType="service_provider">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Link 
                to="/claims"
                className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Back to Claims Dashboard</span>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <Settings className="h-8 w-8 text-blue-600" />
              <span>Claims Allocation Settings</span>
            </h1>
            <p className="text-gray-600 mt-1">Define rules and manage team member assignments for claim verification and admission</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSaveGlobalRules} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="global">Global Rules</TabsTrigger>
            <TabsTrigger value="claims">Claim Allocation</TabsTrigger>
            <TabsTrigger value="team">Team Management</TabsTrigger>
          </TabsList>

          {/* Global Rules Tab */}
          <TabsContent value="global" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Global Allocation Rules</span>
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Define global parameters for all claims received under this entity
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Allocation Rules Table */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Category-based Allocation Rules</h3>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Rule
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Category</TableHead>
                          <TableHead>Amount Range</TableHead>
                          <TableHead>Verification Team</TableHead>
                          <TableHead>Admission Team</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Auto-Assign</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allocationRules.map((rule) => (
                          <TableRow key={rule.id}>
                            <TableCell className="font-medium">{rule.category}</TableCell>
                            <TableCell>
                              {formatCurrency(rule.amountRange.min)} - {formatCurrency(rule.amountRange.max)}
                            </TableCell>
                            <TableCell>{getTeamMemberName(rule.verificationTeamMember)}</TableCell>
                            <TableCell>{getTeamMemberName(rule.admissionTeamMember)}</TableCell>
                            <TableCell>
                              <Badge className={
                                rule.priority === 'high' ? 'bg-red-100 text-red-800' :
                                rule.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }>
                                {rule.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {rule.autoAssign ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <Clock className="h-4 w-4 text-gray-400" />
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Auto-Allocation Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shuffle className="h-5 w-5" />
                      <span>Auto-Allocation Settings</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="auto-allocation"
                        checked={autoAllocationSettings.enabled}
                        onCheckedChange={(checked) => 
                          setAutoAllocationSettings(prev => ({ ...prev, enabled: !!checked }))
                        }
                      />
                      <Label htmlFor="auto-allocation">Enable automatic allocation for high volume claims</Label>
                    </div>

                    {autoAllocationSettings.enabled && (
                      <div className="space-y-4 pl-6 border-l-2 border-blue-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Allocation Method</Label>
                            <Select 
                              value={autoAllocationSettings.method}
                              onValueChange={(value: "fixed_amount" | "range") => 
                                setAutoAllocationSettings(prev => ({ ...prev, method: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="fixed_amount">Fixed Amount Distribution</SelectItem>
                                <SelectItem value="range">Range-based Distribution</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {autoAllocationSettings.method === "fixed_amount" && (
                            <>
                              <div>
                                <Label>Number of Claimants per Member</Label>
                                <Input 
                                  type="number"
                                  value={autoAllocationSettings.fixedAmount.numberOfClaimants}
                                  onChange={(e) => 
                                    setAutoAllocationSettings(prev => ({
                                      ...prev,
                                      fixedAmount: {
                                        ...prev.fixedAmount,
                                        numberOfClaimants: parseInt(e.target.value) || 0
                                      }
                                    }))
                                  }
                                />
                              </div>
                              <div>
                                <Label>Total Claimed Amount per Member</Label>
                                <Input 
                                  type="number"
                                  value={autoAllocationSettings.fixedAmount.claimedAmount}
                                  onChange={(e) => 
                                    setAutoAllocationSettings(prev => ({
                                      ...prev,
                                      fixedAmount: {
                                        ...prev.fixedAmount,
                                        claimedAmount: parseInt(e.target.value) || 0
                                      }
                                    }))
                                  }
                                />
                              </div>
                            </>
                          )}
                        </div>

                        <Button onClick={handleAutoAllocate} disabled={loading}>
                          <Shuffle className="w-4 h-4 mr-2" />
                          {loading ? "Allocating..." : "Apply Auto-Allocation"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Claims Allocation Tab */}
          <TabsContent value="claims" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Individual Claim Allocation</span>
                  </div>
                  <Badge variant="outline">{claims.length} Claims</Badge>
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Manage team member assignments for individual claims
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Claims Table */}
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            <div className="flex items-center space-x-2">
                              <span>Receipt Date</span>
                              <ArrowUpDown className="h-4 w-4" />
                            </div>
                          </TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Claimant Name</TableHead>
                          <TableHead>
                            <div className="flex items-center space-x-2">
                              <span>Claimed Amount</span>
                              <ArrowUpDown className="h-4 w-4" />
                            </div>
                          </TableHead>
                          <TableHead>Verification Team</TableHead>
                          <TableHead>Admission Team</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {claims.map((claim) => (
                          <TableRow key={claim.id}>
                            <TableCell>
                              {new Date(claim.receiptDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="max-w-32 truncate" title={claim.category}>
                                {claim.category}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{claim.claimantName}</TableCell>
                            <TableCell className="font-semibold">
                              {formatCurrency(claim.claimedAmount)}
                            </TableCell>
                            <TableCell>
                              <Select 
                                value={claim.verificationAssignee === "Not Allocated" ? "" : 
                                  teamMembers.find(tm => tm.name === claim.verificationAssignee)?.id || ""}
                                onValueChange={(value) => handleManualAssignment(claim.id, 'verification', value)}
                              >
                                <SelectTrigger className="w-40">
                                  <SelectValue placeholder="Not Allocated" />
                                </SelectTrigger>
                                <SelectContent>
                                  {teamMembers.map((member) => (
                                    <SelectItem key={member.id} value={member.id}>
                                      {member.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Select 
                                value={claim.admissionAssignee === "Not Allocated" ? "" : 
                                  teamMembers.find(tm => tm.name === claim.admissionAssignee)?.id || ""}
                                onValueChange={(value) => handleManualAssignment(claim.id, 'admission', value)}
                              >
                                <SelectTrigger className="w-40">
                                  <SelectValue placeholder="Not Allocated" />
                                </SelectTrigger>
                                <SelectContent>
                                  {teamMembers.map((member) => (
                                    <SelectItem key={member.id} value={member.id}>
                                      {member.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Badge className={
                                claim.status === 'pending_allocation' ? 'bg-red-100 text-red-800' :
                                claim.status === 'verification_assigned' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }>
                                {claim.status.replace('_', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => navigate(`/claims/claim/${claim.id}`)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Management Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Team Members & Workload</span>
                </CardTitle>
                <p className="text-sm text-gray-600">
                  View team member capacity and current workload distribution
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teamMembers.map((member) => (
                    <Card key={member.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{member.name}</h3>
                            <p className="text-sm text-gray-600">{member.role}</p>
                            <p className="text-xs text-gray-500">{member.department}</p>
                          </div>
                          <Badge variant="outline">{member.department}</Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{member.email}</span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Current Workload</span>
                              <span className="font-medium">{member.workload}/{member.maxCapacity}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  (member.workload / member.maxCapacity) > 0.8 ? 'bg-red-500' :
                                  (member.workload / member.maxCapacity) > 0.6 ? 'bg-yellow-500' :
                                  'bg-green-500'
                                }`}
                                style={{ width: `${(member.workload / member.maxCapacity) * 100}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500">
                              {Math.round((member.workload / member.maxCapacity) * 100)}% capacity
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ClaimsAllocationSettings;
