import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { 
  BarChart3, 
  PieChart,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  Eye,
  FileText,
  Building,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Award,
  Zap,
  Mail,
  Share2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ComplianceMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

interface EntityPerformance {
  id: string;
  name: string;
  type: string;
  totalCompliances: number;
  completed: number;
  overdue: number;
  onTime: number;
  score: number;
  grade: 'A' | 'B' | 'C' | 'D';
}

interface ComplianceCategory {
  category: string;
  total: number;
  completed: number;
  overdue: number;
  percentage: number;
}

interface EntityWiseRow {
  entity: string;
  total: number;
  completed: number;
  overdue: number;
  onTimePercent: number;
  aiImpact: string;
  aiSteps: string;
}

interface LawWiseRow {
  law: string;
  authority: string;
  frequency: string;
  total: number;
  completed: number;
  overdue: number;
  aiImpact: string;
  aiSteps: string;
}

interface MissedRow {
  entity: string;
  title: string;
  authority: string;
  dueDate: string;
  daysOverdue: number;
  impactFlag: 'High' | 'Medium' | 'Low';
  aiImpact: string;
  aiSteps: string;
}

const ComplianceReportsAnalytics = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("this-quarter");
  const [selectedEntity, setSelectedEntity] = useState("all");
  const [reportType, setReportType] = useState("summary");
  // Track active sub-tab in Reports section so the top Export button can export the right table
  const [activeReportTab, setActiveReportTab] = useState<'entity-wise' | 'law-wise' | 'missed'>('entity-wise');

  const toReportTab = (v: string): 'entity-wise' | 'law-wise' | 'missed' => {
    if (v === 'law-wise') return 'law-wise';
    if (v === 'missed') return 'missed';
    return 'entity-wise';
  };

  // Removed dashboard metric cards to avoid dashboard-like look in Reports

  // Mock tables for Reports tab
  const [entityWiseRows] = useState<EntityWiseRow[]>([
    { entity: 'ABC Corp Ltd', total: 24, completed: 22, overdue: 2, onTimePercent: 91, aiImpact: 'Strong compliance posture; occasional delays.', aiSteps: 'Automate GST reminders; add pre-deadline checks.' },
    { entity: 'XYZ Partnership', total: 18, completed: 18, overdue: 0, onTimePercent: 94, aiImpact: 'Excellent on-time record.', aiSteps: 'Maintain current workflow; introduce quarterly audit.' },
  ]);
  const [lawWiseRows] = useState<LawWiseRow[]>([
    { law: 'GST Act, 2017', authority: 'GST Department', frequency: 'Monthly', total: 12, completed: 11, overdue: 1, aiImpact: 'Late filings increase penalty risk.', aiSteps: 'Set 7-day pre-due reminders; add document checklist.' },
    { law: 'Income Tax TDS', authority: 'Income Tax Dept', frequency: 'Quarterly', total: 4, completed: 4, overdue: 0, aiImpact: 'Stable; no gaps detected.', aiSteps: 'Keep current cadence; add exception alerts on payroll run.' },
  ]);
  const [missedRows] = useState<MissedRow[]>([
    { entity: 'ABC Corp Ltd', title: 'GSTR-9 Annual Return', authority: 'GST Department', dueDate: '31 Dec 2024', daysOverdue: 15, impactFlag: 'High', aiImpact: 'Penalty and interest likely.', aiSteps: 'Escalate to tax lead; compile turnover recon; file within 24h.' },
    { entity: 'Tech Innovations', title: 'PF Monthly Return', authority: 'EPFO', dueDate: '15 Jan 2025', daysOverdue: 3, impactFlag: 'Medium', aiImpact: 'Interest accrual started.', aiSteps: 'Finalize wage sheet; immediate ECR filing.' },
  ]);

  const [entityPerformance, setEntityPerformance] = useState<EntityPerformance[]>([
    {
      id: "1",
      name: "ABC Corp Ltd",
      type: "Private Limited",
      totalCompliances: 24,
      completed: 22,
      overdue: 2,
      onTime: 20,
      score: 91.7,
      grade: 'A'
    },
    {
      id: "2",
      name: "XYZ Partnership",
      type: "LLP",
      totalCompliances: 18,
      completed: 18,
      overdue: 0,
      onTime: 17,
      score: 94.4,
      grade: 'A'
    },
    {
      id: "3",
      name: "Tech Innovations",
      type: "Private Limited",
      totalCompliances: 20,
      completed: 18,
      overdue: 2,
      onTime: 16,
      score: 80.0,
      grade: 'B'
    },
    {
      id: "4",
      name: "StartUp Ventures",
      type: "OPC",
      totalCompliances: 12,
      completed: 11,
      overdue: 1,
      onTime: 10,
      score: 83.3,
      grade: 'B'
    }
  ]);

  const [complianceCategories, setComplianceCategories] = useState<ComplianceCategory[]>([
    {
      category: "Tax Compliance",
      total: 28,
      completed: 25,
      overdue: 3,
      percentage: 89.3
    },
    {
      category: "Labour Laws",
      total: 20,
      completed: 19,
      overdue: 1,
      percentage: 95.0
    },
    {
      category: "Corporate Laws",
      total: 16,
      completed: 14,
      overdue: 2,
      percentage: 87.5
    },
    {
      category: "Environmental",
      total: 8,
      completed: 8,
      overdue: 0,
      percentage: 100.0
    },
    {
      category: "Industry Specific",
      total: 12,
      completed: 10,
      overdue: 2,
      percentage: 83.3
    }
  ]);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Target className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleExportReport = () => {
    // Export the currently selected report tab as CSV
    if (activeReportTab === 'entity-wise') return downloadExcel('entity');
    if (activeReportTab === 'law-wise') return downloadExcel('law');
    return downloadExcel('missed');
  };

  // Utilities: CSV builder and download
  const arrayToCsv = (headers: string[], rows: (string | number)[][]) => {
    const escape = (v: string | number) => {
      const s = String(v ?? '');
      if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
      return s;
    };
    const csvHeader = headers.map(escape).join(',');
    const csvRows = rows.map(r => r.map(escape).join(',')).join('\n');
    return csvHeader + '\n' + csvRows;
  };

  const downloadBlob = (content: string, filename: string, type = 'text/csv;charset=utf-8;') => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadExcel = (report: 'entity' | 'law' | 'missed') => {
    if (report === 'entity') {
      const headers = ['Entity', 'Total', 'Completed', 'Overdue', 'On-Time %', 'AI Impact', 'AI Steps/Solution'];
      const rows = entityWiseRows.map(r => [
        r.entity,
        r.total,
        r.completed,
        r.overdue,
        r.onTimePercent + '%',
        r.aiImpact,
        r.aiSteps,
      ]);
      const csv = arrayToCsv(headers, rows);
      downloadBlob(csv, `entity-wise-compliance-${Date.now()}.csv`);
      return;
    }
    if (report === 'law') {
      const headers = ['Law/Regulation', 'Authority', 'Frequency', 'Total', 'Completed', 'Overdue', 'AI Impact', 'AI Steps/Solution'];
      const rows = lawWiseRows.map(r => [
        r.law,
        r.authority,
        r.frequency,
        r.total,
        r.completed,
        r.overdue,
        r.aiImpact,
        r.aiSteps,
      ]);
      const csv = arrayToCsv(headers, rows);
      downloadBlob(csv, `law-wise-compliance-${Date.now()}.csv`);
      return;
    }
    // missed
    const headers = ['Entity', 'Compliance', 'Authority', 'Due Date', 'Days Overdue', 'Impact Flag', 'AI Impact', 'AI Steps/Solution'];
    const rows = missedRows.map(r => [
      r.entity,
      r.title,
      r.authority,
      r.dueDate,
      r.daysOverdue,
      r.impactFlag,
      r.aiImpact,
      r.aiSteps,
    ]);
    const csv = arrayToCsv(headers, rows);
    downloadBlob(csv, `missed-compliances-${Date.now()}.csv`);
  };

  const downloadDoc = (report: 'entity' | 'law' | 'missed') => {
    console.log(`Downloading ${report} report as Document...`);
  };

  const handleScheduleReport = () => {
    // Implementation for scheduling reports
    console.log('Scheduling report...');
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Compliance Reports & Analytics</h1>
            <p className="text-muted-foreground">Comprehensive compliance performance insights</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="this-quarter">This Quarter</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
                <SelectItem value="last-year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExportReport} variant="outline" size="sm" className="h-9">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Removed Key Metrics cards */}

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="entities">Entity Performance</TabsTrigger>
            <TabsTrigger value="categories">By Category</TabsTrigger>
            <TabsTrigger value="trends">Trends & Insights</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Compliance Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="w-5 h-5 mr-2" />
                    Compliance Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Completed</span>
                      </div>
                      <span className="font-medium">68%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">In Progress</span>
                      </div>
                      <span className="font-medium">22%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Overdue</span>
                      </div>
                      <span className="font-medium">10%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Monthly Compliance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">January 2024</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '100%'}}></div>
                        </div>
                        <span className="text-sm font-medium">100%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">December 2023</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '87%'}}></div>
                        </div>
                        <span className="text-sm font-medium">87%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">November 2023</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '84%'}}></div>
                        </div>
                        <span className="text-sm font-medium">84%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Detailed Report
                  </Button>
                  <Button variant="outline" className="justify-start" onClick={handleScheduleReport}>
                    <Mail className="w-4 h-4 mr-2" />
                    Schedule Monthly Report
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Entity Performance Tab */}
          <TabsContent value="entities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  Entity Performance Scorecard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Entity</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Total</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Completed</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Overdue</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">On-Time %</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Score</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entityPerformance.map((entity) => (
                        <tr key={entity.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{entity.name}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline">{entity.type}</Badge>
                          </td>
                          <td className="py-3 px-4">{entity.totalCompliances}</td>
                          <td className="py-3 px-4 text-green-600">{entity.completed}</td>
                          <td className="py-3 px-4 text-red-600">{entity.overdue}</td>
                          <td className="py-3 px-4">
                            {Math.round((entity.onTime / entity.totalCompliances) * 100)}%
                          </td>
                          <td className="py-3 px-4 font-medium">{entity.score}%</td>
                          <td className="py-3 px-4">
                            <Badge className={getGradeColor(entity.grade)}>
                              {entity.grade}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Compliance by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceCategories.map((category, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{category.category}</h3>
                        <Badge variant={category.percentage >= 90 ? 'default' : category.percentage >= 80 ? 'secondary' : 'destructive'}>
                          {category.percentage.toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">Total:</span>
                          <p className="font-medium">{category.total}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Completed:</span>
                          <p className="font-medium text-green-600">{category.completed}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Overdue:</span>
                          <p className="font-medium text-red-600">{category.overdue}</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{width: `${category.percentage}%`}}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends & Insights Tab */}
          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    AI-Powered Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <p className="font-medium text-blue-900">Compliance Rate Improvement</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Your overall compliance rate has improved by 5.2% this quarter, primarily due to better GST return filing processes.
                      </p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <p className="font-medium text-green-900">Best Performing Entity</p>
                      <p className="text-sm text-gray-600 mt-1">
                        XYZ Partnership maintains the highest compliance score (94.4%) with zero overdue items.
                      </p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-4">
                      <p className="font-medium text-orange-900">Attention Required</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Labour law compliance shows slight decline. Consider additional training for the team.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Performance Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-green-900">Zero Penalties</p>
                        <p className="text-sm text-green-700">3 months running</p>
                      </div>
                      <Award className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-900">Early Submissions</p>
                        <p className="text-sm text-blue-700">78% filed before deadline</p>
                      </div>
                      <Target className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div>
                        <p className="font-medium text-purple-900">Process Efficiency</p>
                        <p className="text-sm text-purple-700">Average time reduced by 0.8 days</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        {/* Reports Tab */}
        <Tabs value={activeReportTab} onValueChange={(v) => setActiveReportTab(toReportTab(v))} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="entity-wise">Entity-wise Status</TabsTrigger>
            <TabsTrigger value="law-wise">Law-wise Summary</TabsTrigger>
            <TabsTrigger value="missed">Missed Compliances</TabsTrigger>
          </TabsList>

          <TabsContent value="entity-wise" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Entity-wise Compliance Status</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => downloadExcel('entity')}>
                  <Download className="w-4 h-4 mr-2" /> Excel
                </Button>
                <Button variant="outline" size="sm" onClick={() => downloadDoc('entity')}>
                  <FileText className="w-4 h-4 mr-2" /> Document
                </Button>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entity</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Overdue</TableHead>
                  <TableHead>On-Time %</TableHead>
                  <TableHead>AI Impact</TableHead>
                  <TableHead>AI Steps/Solution</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entityWiseRows.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.entity}</TableCell>
                    <TableCell>{row.total}</TableCell>
                    <TableCell className="text-green-600">{row.completed}</TableCell>
                    <TableCell className="text-red-600">{row.overdue}</TableCell>
                    <TableCell>{row.onTimePercent}%</TableCell>
                    <TableCell className="text-gray-700">{row.aiImpact}</TableCell>
                    <TableCell className="text-gray-700">{row.aiSteps}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="law-wise" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Law-wise Compliance Summary</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => downloadExcel('law')}>
                  <Download className="w-4 h-4 mr-2" /> Excel
                </Button>
                <Button variant="outline" size="sm" onClick={() => downloadDoc('law')}>
                  <FileText className="w-4 h-4 mr-2" /> Document
                </Button>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Law/Regulation</TableHead>
                  <TableHead>Authority</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Overdue</TableHead>
                  <TableHead>AI Impact</TableHead>
                  <TableHead>AI Steps/Solution</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lawWiseRows.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.law}</TableCell>
                    <TableCell>{row.authority}</TableCell>
                    <TableCell>{row.frequency}</TableCell>
                    <TableCell>{row.total}</TableCell>
                    <TableCell className="text-green-600">{row.completed}</TableCell>
                    <TableCell className="text-red-600">{row.overdue}</TableCell>
                    <TableCell className="text-gray-700">{row.aiImpact}</TableCell>
                    <TableCell className="text-gray-700">{row.aiSteps}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="missed" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Missed Compliance Report</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => downloadExcel('missed')}>
                  <Download className="w-4 h-4 mr-2" /> Excel
                </Button>
                <Button variant="outline" size="sm" onClick={() => downloadDoc('missed')}>
                  <FileText className="w-4 h-4 mr-2" /> Document
                </Button>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entity</TableHead>
                  <TableHead>Compliance</TableHead>
                  <TableHead>Authority</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Days Overdue</TableHead>
                  <TableHead>Impact Flag</TableHead>
                  <TableHead>AI Impact</TableHead>
                  <TableHead>AI Steps/Solution</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {missedRows.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.entity}</TableCell>
                    <TableCell>{row.title}</TableCell>
                    <TableCell>{row.authority}</TableCell>
                    <TableCell>{row.dueDate}</TableCell>
                    <TableCell className="text-red-600">{row.daysOverdue}</TableCell>
                    <TableCell>
                      <span className={row.impactFlag === 'High' ? 'text-red-600 font-medium' : row.impactFlag === 'Medium' ? 'text-orange-600 font-medium' : 'text-green-600 font-medium'}>
                        {row.impactFlag}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-700">{row.aiImpact}</TableCell>
                    <TableCell className="text-gray-700">{row.aiSteps}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ComplianceReportsAnalytics;
