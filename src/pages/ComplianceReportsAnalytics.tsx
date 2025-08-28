import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const ComplianceReportsAnalytics = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("this-quarter");
  const [selectedEntity, setSelectedEntity] = useState("all");
  const [reportType, setReportType] = useState("summary");

  // Mock data - replace with actual API calls
  const [metrics, setMetrics] = useState<ComplianceMetric[]>([
    {
      label: "Overall Compliance Rate",
      value: 87,
      change: 5.2,
      trend: 'up',
      color: 'text-green-600'
    },
    {
      label: "On-Time Submissions",
      value: 92,
      change: 3.1,
      trend: 'up',
      color: 'text-blue-600'
    },
    {
      label: "Overdue Items",
      value: 8,
      change: -2.3,
      trend: 'down',
      color: 'text-red-600'
    },
    {
      label: "Average Processing Time",
      value: 4.2,
      change: -0.8,
      trend: 'down',
      color: 'text-orange-600'
    }
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
    // Implementation for exporting reports
    console.log('Exporting report...');
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

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                    <p className={`text-3xl font-bold ${metric.color}`}>
                      {metric.value}{metric.label.includes('Rate') || metric.label.includes('Submissions') ? '%' : metric.label.includes('Time') ? ' days' : ''}
                    </p>
                    <div className="flex items-center mt-1">
                      {getTrendIcon(metric.trend)}
                      <span className={`text-sm ml-1 ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    {index === 0 && <BarChart3 className="w-6 h-6 text-blue-600" />}
                    {index === 1 && <CheckCircle className="w-6 h-6 text-blue-600" />}
                    {index === 2 && <AlertTriangle className="w-6 h-6 text-blue-600" />}
                    {index === 3 && <Clock className="w-6 h-6 text-blue-600" />}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="entities">Entity Performance</TabsTrigger>
            <TabsTrigger value="categories">By Category</TabsTrigger>
            <TabsTrigger value="trends">Trends & Insights</TabsTrigger>
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
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '92%'}}></div>
                        </div>
                        <span className="text-sm font-medium">92%</span>
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
      </div>
    </DashboardLayout>
  );
};

export default ComplianceReportsAnalytics;
