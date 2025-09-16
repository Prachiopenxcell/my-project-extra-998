import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft,
  FileText,
  Users,
  Calendar,
  CheckCircle,
  Edit,
  Eye,
  Gavel,
  Building
} from "lucide-react";

// Minimal type aligned with LitigationManagementNew.tsx mock
interface PreFilingCase {
  id: string;
  caseNumber: string;
  title: string;
  type: 'pre-filing';
  status: string;
  court: string;
  lawyer: string;
  amount: number;
  plaintiff: string;
  defendant: string;
  daysLeft?: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdDate: string;
  responseType?: string;
  particulars?: string;
  reliefSought?: string;
  costBreakdown?: {
    drafting: number;
    filing: number;
    appearances: number;
    outOfPocket: number;
    counselFee: number;
    total: number;
  };
}

// For now, build a tiny in-page mock lookup matching IDs used in dashboard
const MOCK_PREFILINGS: Record<string, PreFilingCase> = {
  "pf-001": {
    id: "pf-001",
    caseNumber: "PRE-2025-001",
    title: "Application Draft - NCLT Petition against Delta Corp",
    type: "pre-filing",
    status: "draft",
    court: "NCLT Mumbai",
    lawyer: "Adv. Rajesh Sharma",
    amount: 1200000,
    plaintiff: "Acme Corporation Ltd",
    defendant: "Delta Corp Ltd",
    daysLeft: 15,
    priority: "high",
    createdDate: "2025-01-15",
    responseType: "Awaiting Response",
    particulars: "Corporate insolvency resolution process under Section 7 of IBC 2016",
    reliefSought: "Initiation of CIRP against the Corporate Debtor",
    costBreakdown: { drafting: 25000, filing: 15000, appearances: 0, outOfPocket: 5000, counselFee: 35000, total: 80000 }
  },
  "pf-002": {
    id: "pf-002",
    caseNumber: "PRE-2025-002",
    title: "Commercial Dispute - Contract Breach Preparation",
    type: "pre-filing",
    status: "draft",
    court: "High Court Delhi",
    lawyer: "Adv. Neha Gupta",
    amount: 950000,
    plaintiff: "TechSolutions Pvt Ltd",
    defendant: "Omega Industries",
    daysLeft: 22,
    priority: "medium",
    createdDate: "2025-01-10",
    responseType: "No Objection",
    particulars: "Breach of supply agreement and damages",
    reliefSought: "Damages and specific performance of contract",
    costBreakdown: { drafting: 20000, filing: 12000, appearances: 0, outOfPocket: 4000, counselFee: 28000, total: 64000 }
  },
  "pf-003": {
    id: "pf-003",
    caseNumber: "PRE-2025-003",
    title: "Property Dispute - Title Verification Case",
    type: "pre-filing",
    status: "draft",
    court: "District Court Mumbai",
    lawyer: "Adv. Rohit Patel",
    amount: 750000,
    plaintiff: "Global Ventures Inc",
    defendant: "City Developers Ltd",
    daysLeft: 30,
    priority: "low",
    createdDate: "2025-01-05",
    responseType: "Objection Received",
    particulars: "Dispute over property title and possession",
    reliefSought: "Declaration of title and possession",
    costBreakdown: { drafting: 18000, filing: 8000, appearances: 0, outOfPocket: 3000, counselFee: 22000, total: 51000 }
  }
};

const PreFilingDetails: React.FC = () => {
  const navigate = useNavigate();
  const { preFilingId } = useParams();
  const { toast } = useToast();

  const data = (preFilingId && MOCK_PREFILINGS[preFilingId]) || null;

  const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
  const formatCurrency = (n?: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/litigation')} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Pre-filing List
              </Button>
            </div>
            {!!data && (
              <div className="text-sm text-muted-foreground">Pre-filing: {data.caseNumber}</div>
            )}
          </div>

          {/* Summary Card */}
          <Card>
            <CardContent className="p-6">
              {data ? (
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <h1 className="text-xl font-semibold">{data.title}</h1>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          <span>{data.caseNumber}</span>
                        </div>
                        <span>Date of Creation: {formatDate(data.createdDate)}</span>
                        <span>Priority: {data.priority}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="mb-2">
                        <Badge variant="outline" className={data.responseType === 'Objection Received' ? 'border-red-300 text-red-700' : ''}>
                          {data.responseType || 'Awaiting Response'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">Number of Days: {data.daysLeft ?? '-'}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Record not found.</div>
              )}
            </CardContent>
          </Card>

          {data && (
            <>
              {/* Key Fields */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Application Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div><span className="text-muted-foreground">Court/Authority:</span> <span className="font-medium">{data.court}</span></div>
                    <div><span className="text-muted-foreground">Status:</span> <span className="font-medium capitalize">{data.status}</span></div>
                    <div><span className="text-muted-foreground">Particulars:</span> <span className="font-medium">{data.particulars || '-'}</span></div>
                    <div><span className="text-muted-foreground">Relief Sought:</span> <span className="font-medium">{data.reliefSought || '-'}</span></div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Parties & Lawyer</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div><span className="text-muted-foreground">Plaintiff/Appellant/Applicant:</span> <span className="font-medium">{data.plaintiff}</span></div>
                    <div><span className="text-muted-foreground">Defendant/Respondent:</span> <span className="font-medium">{data.defendant}</span></div>
                    <div><span className="text-muted-foreground">Assigned Lawyer:</span> <span className="font-medium">{data.lawyer}</span></div>
                  </CardContent>
                </Card>
              </div>

              {/* Cost Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Cost Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.costBreakdown ? (
                    <div className="overflow-x-auto rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Heads</TableHead>
                            <TableHead>Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Drafting</TableCell>
                            <TableCell>{formatCurrency(data.costBreakdown.drafting)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Filing</TableCell>
                            <TableCell>{formatCurrency(data.costBreakdown.filing)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Appearances</TableCell>
                            <TableCell>{formatCurrency(data.costBreakdown.appearances)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Out of Pocket</TableCell>
                            <TableCell>{formatCurrency(data.costBreakdown.outOfPocket)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Counsel Fee</TableCell>
                            <TableCell>{formatCurrency(data.costBreakdown.counselFee)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-semibold">Total</TableCell>
                            <TableCell className="font-semibold">{formatCurrency(data.costBreakdown.total)}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">No cost information available.</div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => navigate('/litigation')} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => navigate(`/litigation/create?edit=${data.id}`)} className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Modify
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PreFilingDetails;
