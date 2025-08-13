import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { 
  Star, 
  Search, 
  Filter, 
  Calendar, 
  Eye, 
  Download, 
  Share2, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertTriangle,
  CheckCircle,
  Clock,
  MessageSquare,
  FileText,
  BarChart3,
  Award,
  Target
} from "lucide-react";
import { feedbackService } from "@/services/feedbackService";
import { 
  FeedbackItem, 
  FeedbackStats, 
  FeedbackFilters, 
  FeedbackAnalytics,
  WorkOrderStatus,
  DisputeStatus,
  FeedbackStage
} from "@/types/feedback";
import { format } from "date-fns";

const Feedback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [allFeedbacks, setAllFeedbacks] = useState<FeedbackItem[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<FeedbackItem[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [analytics, setAnalytics] = useState<FeedbackAnalytics | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Filter states
  const [filters, setFilters] = useState<Partial<FeedbackFilters>>({
    searchTerm: '',
    dateFrom: '',
    dateTo: '',
    rating: 'all',
    workOrderStatus: 'all',
    serviceType: 'all'
  });

  // Load all feedbacks initially (without tab filtering)
  const loadAllFeedbacks = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await feedbackService.getFeedbacks(filters, {
        page: 1,
        limit: 100, // Load more data initially to support client-side filtering
        sortBy: 'feedbackDate',
        sortOrder: 'desc'
      });

      setAllFeedbacks(response.feedbacks);
      setStats(response.stats);
      setAnalytics(response.analytics);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load feedback data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  // Filter feedbacks based on active tab (client-side filtering)
  const filterFeedbacksByTab = useCallback(() => {
    let filtered = [...allFeedbacks];

    switch (activeTab) {
      case 'recent': {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filtered = filtered.filter(feedback => 
          new Date(feedback.feedbackDate) >= thirtyDaysAgo
        );
        break;
      }
      case 'disputes':
        filtered = filtered.filter(feedback => 
          feedback.disputeStatus !== DisputeStatus.NONE
        );
        break;
      case 'completed':
        filtered = filtered.filter(feedback => 
          feedback.status === WorkOrderStatus.COMPLETED
        );
        break;
      case 'in-progress':
        filtered = filtered.filter(feedback => 
          feedback.status === WorkOrderStatus.IN_PROGRESS
        );
        break;
      default:
        // 'all' tab shows all feedbacks
        break;
    }

    setFilteredFeedbacks(filtered);
    setTotalPages(Math.ceil(filtered.length / pageSize));
    setCurrentPage(1); // Reset to first page when switching tabs
  }, [allFeedbacks, activeTab, pageSize]);

  // Load all feedbacks on component mount and when filters change
  useEffect(() => {
    loadAllFeedbacks();
  }, [loadAllFeedbacks]);

  // Filter feedbacks when tab changes or when all feedbacks are loaded
  useEffect(() => {
    if (allFeedbacks.length > 0) {
      filterFeedbacksByTab();
    }
  }, [filterFeedbacksByTab, allFeedbacks]);

  const handleFilterChange = (key: keyof FeedbackFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      searchTerm: '',
      dateFrom: '',
      dateTo: '',
      rating: 'all',
      workOrderStatus: 'all',
      serviceType: 'all'
    });
    setCurrentPage(1);
  };

  const handleExport = async (format: 'excel' | 'pdf') => {
    try {
      const filename = await feedbackService.exportFeedbacks(format);
      toast({
        title: "Export Successful",
        description: `Feedback report exported as ${filename}`
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export feedback report",
        variant: "destructive"
      });
    }
  };

  const handleShare = async () => {
    try {
      await feedbackService.shareFeedbackSummary();
      toast({
        title: "Shared Successfully",
        description: "Feedback summary has been shared"
      });
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Failed to share feedback summary",
        variant: "destructive"
      });
    }
  };

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : star <= rating
                ? 'fill-yellow-200 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const getStatusBadge = (status: WorkOrderStatus) => {
    const statusConfig = {
      [WorkOrderStatus.COMPLETED]: { label: 'Completed', className: 'bg-green-100 text-green-800' },
      [WorkOrderStatus.IN_PROGRESS]: { label: 'In Progress', className: 'bg-blue-100 text-blue-800' },
      [WorkOrderStatus.ON_HOLD]: { label: 'On Hold', className: 'bg-yellow-100 text-yellow-800' },
      [WorkOrderStatus.CANCELLED]: { label: 'Cancelled', className: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status];
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getDisputeBadge = (disputeStatus: DisputeStatus) => {
    if (disputeStatus === DisputeStatus.NONE) return null;
    
    const disputeConfig = {
      [DisputeStatus.RAISED]: { label: 'Dispute', className: 'bg-red-100 text-red-800', icon: AlertTriangle },
      [DisputeStatus.UNDER_REVIEW]: { label: 'Under Review', className: 'bg-orange-100 text-orange-800', icon: Clock },
      [DisputeStatus.RESOLVED]: { label: 'Resolved', className: 'bg-green-100 text-green-800', icon: CheckCircle },
      [DisputeStatus.NONE]: { label: '', className: '', icon: null }
    };

    const config = disputeConfig[disputeStatus];
    const IconComponent = config.icon;

    return (
      <Badge variant="outline" className={config.className}>
        {IconComponent && <IconComponent className="w-3 h-3 mr-1" />}
        {config.label}
      </Badge>
    );
  };

  if (loading && !allFeedbacks.length) {
    return (
      <DashboardLayout userType="service_provider">
        <div className="container mx-auto p-6">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
            <Skeleton className="h-64" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="service_provider">
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Feedback & Reviews</h1>
              <p className="text-gray-600 mt-1">View all feedback received from service seekers across your work orders</p>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Overall Rating</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl font-bold text-gray-900">{stats.overallRating}/5</span>
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalReviews}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Recent Month</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl font-bold text-gray-900">{stats.recentMonthRating}/5</span>
                        {stats.improvementTrend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
                        {stats.improvementTrend === 'down' && <TrendingDown className="w-4 h-4 text-red-600" />}
                        {stats.improvementTrend === 'stable' && <Minus className="w-4 h-4 text-gray-600" />}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Improvement</p>
                      <p className="text-2xl font-bold text-green-600 mt-1">
                        {stats.improvementTrend === 'up' ? '+0.3' : stats.improvementTrend === 'down' ? '-0.1' : '0.0'}
                      </p>
                    </div>
                    <Target className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search feedback..."
                      value={filters.searchTerm || ''}
                      onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Input
                    type="date"
                    placeholder="From Date"
                    value={filters.dateFrom || ''}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  />
                </div>

                <div>
                  <Input
                    type="date"
                    placeholder="To Date"
                    value={filters.dateTo || ''}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  />
                </div>

                <div>
                  <Select value={filters.rating || 'all'} onValueChange={(value) => handleFilterChange('rating', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ratings</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                      <SelectItem value="4">4+ Stars</SelectItem>
                      <SelectItem value="3">3+ Stars</SelectItem>
                      <SelectItem value="2">2+ Stars</SelectItem>
                      <SelectItem value="1">1+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={filters.workOrderStatus || 'all'} onValueChange={(value) => handleFilterChange('workOrderStatus', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="WO Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value={WorkOrderStatus.COMPLETED}>Completed</SelectItem>
                      <SelectItem value={WorkOrderStatus.IN_PROGRESS}>In Progress</SelectItem>
                      <SelectItem value={WorkOrderStatus.ON_HOLD}>On Hold</SelectItem>
                      <SelectItem value={WorkOrderStatus.CANCELLED}>Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <Button variant="outline" onClick={handleResetFilters}>
                  Reset
                </Button>
                <Button onClick={loadAllFeedbacks}>
                  <Search className="w-4 h-4 mr-2" />
                  Apply
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Feedback Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                All Feedback
              </TabsTrigger>
              <TabsTrigger value="recent" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Recent
              </TabsTrigger>
              <TabsTrigger value="disputes" className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Disputes
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Completed
              </TabsTrigger>
              <TabsTrigger value="in-progress" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                In Progress
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {/* Feedback List */}
              <div className="space-y-4">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-48" />
                    ))}
                  </div>
                ) : filteredFeedbacks.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Feedback Found</h3>
                      <p className="text-gray-600">No feedback matches your current filters.</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredFeedbacks
                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                    .map((feedback) => (
                    <Card key={feedback.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Header Row */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <span className="font-semibold text-gray-900">{feedback.workOrderNumber}</span>
                              <span className="text-gray-600">|</span>
                              <span className="text-gray-700">{feedback.serviceType}</span>
                              <span className="text-gray-600">|</span>
                              {renderStarRating(feedback.overallRating)}
                              <span className="text-gray-600">|</span>
                              {getStatusBadge(feedback.status)}
                              <span className="text-gray-600">|</span>
                              <span className="text-gray-600">{format(new Date(feedback.feedbackDate), 'dd MMM yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => navigate(`/feedback/${feedback.id}`)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              {getDisputeBadge(feedback.disputeStatus)}
                            </div>
                          </div>

                          {/* Service Seeker Info */}
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-gray-700">
                              Service Seeker: {feedback.serviceSeekerCompany}
                            </p>
                          </div>

                          {/* Written Review */}
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-start gap-2">
                              <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <p className="text-gray-700 italic">"{feedback.writtenReview}"</p>
                            </div>
                          </div>

                          {/* Rating Breakdown */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">• Timely Deliverables:</span>
                              {renderStarRating(feedback.ratingBreakdown.timelyDeliverables)}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">• Quality of Work:</span>
                              {renderStarRating(feedback.ratingBreakdown.qualityOfWork)}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">• Communication Skills:</span>
                              {renderStarRating(feedback.ratingBreakdown.communicationSkills)}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">• Client Feedback:</span>
                              {renderStarRating(feedback.ratingBreakdown.clientFeedback)}
                            </div>
                          </div>

                          {/* Additional Info */}
                          <div className="flex items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>Feedback Stage: {feedback.feedbackStage === FeedbackStage.FINAL_COMPLETION ? 'Final Completion' : 'During Execution'}</span>
                            </div>
                            {feedback.hasAdditionalComments && (
                              <div className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                <span>Additional Comments: Yes</span>
                              </div>
                            )}
                            {feedback.concernsFlagged && feedback.concernsFlagged.length > 0 && (
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-orange-500" />
                                <span>Concerns Flagged: {feedback.concernsFlagged.join(', ')}</span>
                              </div>
                            )}
                            {feedback.disputeStatus === DisputeStatus.RESOLVED && feedback.adminReview && (
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span>Admin Review: {feedback.adminReview}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Pages:</span>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                          >
                            Prev
                          </Button>
                          {[...Array(Math.min(5, totalPages))].map((_, i) => {
                            const page = i + 1;
                            return (
                              <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                              >
                                {page}
                              </Button>
                            );
                          })}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Show:</span>
                          <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(parseInt(value))}>
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="25">25</SelectItem>
                              <SelectItem value="50">50</SelectItem>
                              <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                          </Select>
                          <span className="text-sm text-gray-600">items per page</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Export:</span>
                          <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
                            <Download className="w-4 h-4 mr-2" />
                            Excel Download
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
                            <FileText className="w-4 h-4 mr-2" />
                            PDF Report
                          </Button>
                          <Button variant="outline" size="sm" onClick={handleShare}>
                            <Share2 className="w-4 h-4 mr-2" />
                            Share Summary
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Analytics Dashboard */}
          {analytics && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Feedback Analytics Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Performance Trends */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Performance Trends (Last 6 Months):</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <span className="text-sm font-mono w-12">5.0 ★</span>
                          <div className="flex-1 bg-gray-200 h-6 rounded relative overflow-hidden">
                            <div className="bg-yellow-400 h-full" style={{ width: '85%' }}></div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-mono w-12">4.5 ★</span>
                          <div className="flex-1 bg-gray-200 h-6 rounded relative overflow-hidden">
                            <div className="bg-yellow-300 h-full" style={{ width: '75%' }}></div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-mono w-12">4.0 ★</span>
                          <div className="flex-1 bg-gray-200 h-6 rounded relative overflow-hidden">
                            <div className="bg-yellow-200 h-full" style={{ width: '65%' }}></div>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                          {analytics.performanceTrends.map((trend) => (
                            <span key={trend.month}>{trend.month}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Strengths and Areas for Improvement */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4 text-green-600" />
                        Strengths:
                      </h4>
                      <div className="space-y-2">
                        {analytics.strengths.map((strength, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">{strength.category}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">({strength.rating.toFixed(1)})</span>
                              {renderStarRating(strength.rating)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4 text-orange-600" />
                        Areas for Improvement:
                      </h4>
                      <div className="space-y-2">
                        {analytics.areasForImprovement.map((area, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">{area.category}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">({area.rating.toFixed(1)})</span>
                              {renderStarRating(area.rating)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Feedback;
