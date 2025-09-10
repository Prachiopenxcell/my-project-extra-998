import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  UserCheck, 
  Clock, 
  CheckCircle, 
  Plus, 
  Search, 
  Eye,
  Pencil,
  CalendarDays,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const ARFacilitators = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("inProgress");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPageInProgress, setCurrentPageInProgress] = useState<number>(1);
  const [currentPageCompleted, setCurrentPageCompleted] = useState<number>(1);

  type ProcessStatus = "Nomination Initiated" | "Sent EOI" | "Consent Received" | "On Hold" | "AR Selected";
  // Updated types as per new requirement
  type ProcessType = "IBBI CIRP" | "IBBI Liquidation" | "SEBI" | "IBBI Insolvency";

  interface SelectionProcessItem {
    id: string;
    initiationDate: string; // YYYY-MM-DD
    cocName: string;
    category: string; // e.g., Financial Creditors-Secured
    type: ProcessType;
    status: ProcessStatus;
  }

  const getDetailsPath = (row: SelectionProcessItem) => {
    // Map statuses to unified wizard steps
    switch (row.status) {
      case "Nomination Initiated":
        return `/ar-selection-process?id=${row.id}&step=4`;
      case "Sent EOI":
        // Step 6: General Summary (Call EOI)
        return `/ar-selection-process?id=${row.id}&step=6`;
      case "Consent Received":
        // Step 7: Initiate Consent Request
        return `/ar-selection-process?id=${row.id}&step=7`;
      case "On Hold":
        return `/ar-selection-process?id=${row.id}&step=1`;
      case "AR Selected":
      default:
        return `/ar-selection-details?id=${row.id}`;
    }
  };

  const goToDetails = (row: SelectionProcessItem) => {
    const path = getDetailsPath(row);
    navigate(path);
  };

  const selectionProcesses: {
    inProgress: SelectionProcessItem[];
    completed: SelectionProcessItem[];
    selectedARs: Array<{ id: string; name: string; entity: string; class: string; appointed: string }>;
  } = {
    inProgress: [
      {
        id: "1",
        initiationDate: "2024-01-15",
        cocName: "ABC Manufacturing Ltd",
        category: "Financial Creditors-Secured",
        type: "IBBI CIRP",
        status: "Sent EOI",
      },
      {
        id: "2",
        initiationDate: "2024-01-12",
        cocName: "DEF Industries Ltd",
        category: "Financial Creditors-Unsecured",
        type: "IBBI Liquidation",
        status: "Consent Received",
      },
      {
        id: "4",
        initiationDate: "2024-01-08",
        cocName: "GHI Corp Ltd",
        category: "Operational Creditors",
        type: "SEBI",
        status: "Nomination Initiated",
      },
      {
        id: "5",
        initiationDate: "2024-01-06",
        cocName: "JKL Ventures Pvt Ltd",
        category: "Bondholders-Secured",
        type: "IBBI Insolvency",
        status: "On Hold",
      },
      {
        id: "6",
        initiationDate: "2024-01-03",
        cocName: "MNO Textiles Ltd",
        category: "Financial Creditors-Secured",
        type: "IBBI CIRP",
        status: "Sent EOI",
      },
    ],
    completed: [
      {
        id: "3",
        initiationDate: "2024-01-10",
        cocName: "XYZ Services Pvt Ltd",
        category: "Financial Creditors-Unsecured",
        type: "IBBI Liquidation",
        status: "AR Selected",
      },
      {
        id: "7",
        initiationDate: "2023-12-28",
        cocName: "PQR Holdings Ltd",
        category: "Operational Creditors",
        type: "SEBI",
        status: "AR Selected",
      },
    ],
    selectedARs: [
      { id: "1", name: "John Smith", entity: "ABC Manufacturing Ltd", class: "Financial Creditors-Secured", appointed: "2024-01-25" },
      { id: "2", name: "Priya Sharma", entity: "DEF Industries Ltd", class: "Financial Creditors-Unsecured", appointed: "2024-01-22" },
      { id: "3", name: "Rajesh Kumar", entity: "XYZ Services Pvt Ltd", class: "Operational Creditors", appointed: "2023-12-31" },
      { id: "4", name: "Amit Patel", entity: "GHI Corp Ltd", class: "Bondholders-Secured", appointed: "2024-01-10" },
      { id: "5", name: "Sunita Verma", entity: "JKL Ventures Pvt Ltd", class: "Financial Creditors-Secured", appointed: "2024-01-05" },
      { id: "6", name: "Neha Gupta", entity: "MNO Textiles Ltd", class: "Financial Creditors-Unsecured", appointed: "2024-01-12" },
      { id: "7", name: "Deepak Mehta", entity: "PQR Holdings Ltd", class: "Operational Creditors", appointed: "2023-12-28" },
      { id: "8", name: "Karan Shah", entity: "RST Chemicals Pvt Ltd", class: "Bondholders-Secured", appointed: "2023-12-20" }
    ]
  };

  // Derived, filtered, sorted, and paginated lists
  const statusOptions: ProcessStatus[] = [
    "Nomination Initiated",
    "Sent EOI",
    "Consent Received",
    "On Hold",
    "AR Selected",
  ];

  const filterAndSort = useCallback((items: SelectionProcessItem[]) => {
    let result = items.filter((it) => {
      const matchesSearch = searchQuery.trim()
        ? (
            it.cocName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            it.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            it.type.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : true;
      const matchesType = typeFilter === "all" ? true : it.type === (typeFilter as ProcessType);
      const matchesStatus = statusFilter === "all" ? true : it.status === (statusFilter as ProcessStatus);
      return matchesSearch && matchesType && matchesStatus;
    });

    result = result.sort((a, b) => {
      const aDate = new Date(a.initiationDate).getTime();
      const bDate = new Date(b.initiationDate).getTime();
      return sortOrder === "latest" ? bDate - aDate : aDate - bDate;
    });

    return result;
  }, [searchQuery, typeFilter, statusFilter, sortOrder]);

  const filteredInProgress = useMemo(() => filterAndSort(selectionProcesses.inProgress), [filterAndSort, selectionProcesses.inProgress]);
  const filteredCompleted = useMemo(() => filterAndSort(selectionProcesses.completed), [filterAndSort, selectionProcesses.completed]);

  const totalPagesInProgress = Math.max(1, Math.ceil(filteredInProgress.length / pageSize));
  const totalPagesCompleted = Math.max(1, Math.ceil(filteredCompleted.length / pageSize));

  const paginatedInProgress = useMemo(() => {
    const start = (currentPageInProgress - 1) * pageSize;
    return filteredInProgress.slice(start, start + pageSize);
  }, [filteredInProgress, currentPageInProgress, pageSize]);

  const paginatedCompleted = useMemo(() => {
    const start = (currentPageCompleted - 1) * pageSize;
    return filteredCompleted.slice(start, start + pageSize);
  }, [filteredCompleted, currentPageCompleted, pageSize]);

  const resetPagination = () => {
    setCurrentPageInProgress(1);
    setCurrentPageCompleted(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-progress":
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <span className="text-xs font-medium text-amber-700">In Progress</span>
          </div>
        );
      case "completed":
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs font-medium text-green-700">Completed</span>
          </div>
        );
      case "active":
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs font-medium text-green-700">Active</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
            <span className="text-xs font-medium text-gray-700">Unknown</span>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">AR & Facilitators Management</h1>
            <p className="text-muted-foreground">Manage Authorized Representatives and Facilitators</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="h-9">
              <CalendarDays className="mr-2 h-4 w-4" />
              This Month
            </Button>
            <Button size="sm" className="h-9" onClick={() => navigate('/ar-selection-process')}>
              <Plus className="mr-2 h-4 w-4" />
              Initiate Selection Process
            </Button>
          </div>
        </div>

        {/* AR Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="mr-2 h-4 w-4 text-primary" />
                Active Processes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                Next: ABC Manufacturing Ltd
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                Last: XYZ Services Pvt Ltd
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <UserCheck className="mr-2 h-4 w-4 text-blue-600" />
                Selected ARs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                Active appointments
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="mr-2 h-4 w-4 text-purple-600" />
                Facilitators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">
                Across all classes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* My AR Processes Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">SELECTION PROCESS MANAGEMENT</h2>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search by Entity, Category, Type..." 
                  className="pl-8 w-80"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); resetPagination(); }}
                />
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Filter: Type</span>
                <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); resetPagination(); }}>
                  <SelectTrigger className="w-36 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="IBBI CIRP">IBBI CIRP</SelectItem>
                    <SelectItem value="IBBI Liquidation">IBBI Liquidation</SelectItem>
                    <SelectItem value="SEBI">SEBI</SelectItem>
                    <SelectItem value="IBBI Insolvency">IBBI Insolvency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Filter: Status</span>
                <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); resetPagination(); }}>
                  <SelectTrigger className="w-48 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {statusOptions.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort</span>
                <Select value={sortOrder} onValueChange={(v) => { setSortOrder(v as "latest" | "oldest"); resetPagination(); }}>
                  <SelectTrigger className="w-44 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Latest listed at top</SelectItem>
                    <SelectItem value="oldest">Oldest listed at top</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-muted-foreground">Counts on list</span>
                <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); resetPagination(); }}>
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList className="grid w-auto grid-cols-3">
                <TabsTrigger value="inProgress" className="text-sm">
                  In Progress ({filteredInProgress.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-sm">
                  Completed ({filteredCompleted.length})
                </TabsTrigger>
                <TabsTrigger value="selectedARs" className="text-sm">
                  Selected ARs (8)
                </TabsTrigger>
              </TabsList>
              
              {/* right side kept for future actions */}
            </div>

            <TabsContent value="inProgress" className="space-y-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="overflow-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-600">
                        <tr>
                          <th className="text-left font-medium p-3">Request Initiation Date</th>
                          <th className="text-left font-medium p-3">Entity Name</th>
                          <th className="text-left font-medium p-3">Category</th>
                          <th className="text-left font-medium p-3">Type</th>
                          <th className="text-left font-medium p-3">Status</th>
                          <th className="text-right font-medium p-3">View Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedInProgress.map((row) => (
                          <tr
                            key={row.id}
                            className="border-b hover:bg-gray-50 cursor-pointer"
                            onClick={() => goToDetails(row)}
                          >
                            <td className="p-3">{new Date(row.initiationDate).toLocaleDateString()}</td>
                            <td className="p-3">{row.cocName}</td>
                            <td className="p-3">{row.category}</td>
                            <td className="p-3"><Badge variant="outline">{row.type}</Badge></td>
                            <td className="p-3">
                              <Badge variant="outline">{row.status}</Badge>
                            </td>
                            <td className="p-3 text-right">
                              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); goToDetails(row); }}>
                                <Eye className="h-4 w-4 mr-1" /> View
                              </Button>
                            </td>
                          </tr>
                        ))}
                        {paginatedInProgress.length === 0 && (
                          <tr>
                            <td className="p-6 text-center text-muted-foreground" colSpan={6}>No results</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex items-center justify-between p-3">
                    <div className="text-xs text-muted-foreground">
                      Page {currentPageInProgress} of {totalPagesInProgress}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm" onClick={() => setCurrentPageInProgress(1)} disabled={currentPageInProgress === 1}>
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setCurrentPageInProgress(Math.max(1, currentPageInProgress - 1))} disabled={currentPageInProgress === 1}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      {Array.from({ length: totalPagesInProgress }).slice(0, 5).map((_, idx) => {
                        const page = idx + 1; // simple first 5 pages view
                        return (
                          <Button key={page} variant={currentPageInProgress === page ? "default" : "outline"} size="sm" onClick={() => setCurrentPageInProgress(page)}>
                            {page}
                          </Button>
                        );
                      })}
                      <Button variant="outline" size="sm" onClick={() => setCurrentPageInProgress(Math.min(totalPagesInProgress, currentPageInProgress - 1 + 2))} disabled={currentPageInProgress === totalPagesInProgress}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setCurrentPageInProgress(totalPagesInProgress)} disabled={currentPageInProgress === totalPagesInProgress}>
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="overflow-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-600">
                        <tr>
                          <th className="text-left font-medium p-3">Request Initiation Date</th>
                          <th className="text-left font-medium p-3">Entity Name</th>
                          <th className="text-left font-medium p-3">Category</th>
                          <th className="text-left font-medium p-3">Regulatory Provision</th>
                          <th className="text-left font-medium p-3">Type</th>
                          <th className="text-left font-medium p-3">Status</th>
                          <th className="text-right font-medium p-3">View Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedCompleted.map((row) => (
                          <tr
                            key={row.id}
                            className="border-b hover:bg-gray-50 cursor-pointer"
                            onClick={() => navigate(`/ar-selection-details?id=${row.id}&completed=1`)}
                          >
                            <td className="p-3">{new Date(row.initiationDate).toLocaleDateString()}</td>
                            <td className="p-3">{row.cocName}</td>
                            <td className="p-3">{row.category}</td>
                            <td className="p-3"><Badge variant="outline">{row.type}</Badge></td>
                            <td className="p-3">
                              <Badge variant="outline">{row.status}</Badge>
                            </td>
                            <td className="p-3 text-right">
                              <Button variant="ghost" size="sm" onClick={() => navigate(`/ar-selection-details?id=${row.id}&completed=1`)}>
                                <Eye className="h-4 w-4 mr-1" /> View
                              </Button>
                            </td>
                          </tr>
                        ))}
                        {paginatedCompleted.length === 0 && (
                          <tr>
                            <td className="p-6 text-center text-muted-foreground" colSpan={6}>No results</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex items-center justify-between p-3">
                    <div className="text-xs text-muted-foreground">
                      Page {currentPageCompleted} of {totalPagesCompleted}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm" onClick={() => setCurrentPageCompleted(1)} disabled={currentPageCompleted === 1}>
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setCurrentPageCompleted(Math.max(1, currentPageCompleted - 1))} disabled={currentPageCompleted === 1}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      {Array.from({ length: totalPagesCompleted }).slice(0, 5).map((_, idx) => {
                        const page = idx + 1;
                        return (
                          <Button key={page} variant={currentPageCompleted === page ? "default" : "outline"} size="sm" onClick={() => setCurrentPageCompleted(page)}>
                            {page}
                          </Button>
                        );
                      })}
                      <Button variant="outline" size="sm" onClick={() => setCurrentPageCompleted(Math.min(totalPagesCompleted, currentPageCompleted - 1 + 2))} disabled={currentPageCompleted === totalPagesCompleted}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setCurrentPageCompleted(totalPagesCompleted)} disabled={currentPageCompleted === totalPagesCompleted}>
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="selectedARs" className="space-y-4">
              {selectionProcesses.selectedARs.map((ar) => (
                <Card key={ar.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{ar.name}</h3>
                          {getStatusBadge("active")}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Nominated
                              </Badge>
                             
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Entity:</span>
                            <p>{ar.entity}</p>
                          </div>
                          <div>
                            <span className="font-medium">Class:</span>
                            <p>{ar.class}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/ar-details')}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Facilitator Appointment */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">FACILITATOR APPOINTMENT</h2>
            <Button variant="outline" size="sm" onClick={() => navigate('/ar-fee-structure')}>
              <FileText className="h-4 w-4 mr-2" />
              Manage Fee Structure
            </Button>
          </div>
          <div className="space-y-3">
            {/* Header Row */}
            <div className="grid grid-cols-12 px-4 py-2 text-xs text-muted-foreground">
              <div className="col-span-6">Class Name</div>
              <div className="col-span-3">Eligible Members</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>
            {/* Data Rows */}
            {[
              { id: 'FC_SEC', className: 'Financial Creditors-Secured', eligible: '1,487 creditors' },
              { id: 'FC_UNSEC', className: 'Financial Creditors-Unsecured', eligible: '2,304 creditors' },
              { id: 'OC', className: 'Operational Creditors', eligible: '865 creditors' },
              { id: 'BOND_SEC', className: 'Bondholders-Secured', eligible: '432 creditors' },
            ].map((row) => (
              <div key={row.id} className="grid grid-cols-12 items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="col-span-6 font-medium">{row.className}</div>
                <div className="col-span-3 font-medium text-primary">{row.eligible}</div>
                <div className="col-span-3 flex items-center gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => navigate('/ar-details')}>
                    View Appointment
                  </Button>
                  <Button variant="default" size="sm" onClick={() => navigate('/ar-fee-structure')}>
                    Appoint
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default ARFacilitators;
