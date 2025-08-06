import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Eye, Pencil, Trash2, Plus, Search, Filter, Loader2, MoreHorizontal, FileText, Users, Building, Landmark } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { EntityFormData } from "@/components/entity";
import { entityService } from "@/services/entityServiceFactory";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const EntityManagement = () => {
  console.log('EntityManagement component is rendering');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [entityType, setEntityType] = useState("");
  const [industry, setIndustry] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [pageSize, setPageSize] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [entities, setEntities] = useState<EntityFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Fetch entities from API
  useEffect(() => {
    const fetchEntities = async () => {
      try {
        setLoading(true);
        const data = await entityService.getAllEntities();
        setEntities(data);
      } catch (error) {
        console.error('Error fetching entities:', error);
        toast({
          title: "Error",
          description: "Failed to load entities. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEntities();
  }, [toast, refreshTrigger]);
  
  // Filter entities based on search and filters
  const filteredEntities = entities.filter(entity => {
    const matchesSearch = entity.entityName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         entity.cinNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !entityType || entityType === "all" || entity.entityType === entityType;
    const matchesIndustry = !industry || industry === "all" || (entity.industries && entity.industries.includes(industry));
    const matchesCategory = !category || category === "all" || entity.category === category;
    const matchesStatus = !status || status === "all" || entity.companyStatus === status;
    
    return matchesSearch && matchesType && matchesIndustry && matchesCategory && matchesStatus;
  });
  
  // Sort entities
  const sortedEntities = [...filteredEntities].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.entityName.localeCompare(b.entityName);
      case "name-desc":
        return b.entityName.localeCompare(a.entityName);
      case "latest":
        return new Date(b.lastAgmDate).getTime() - new Date(a.lastAgmDate).getTime();
      case "oldest":
        return new Date(a.lastAgmDate).getTime() - new Date(b.lastAgmDate).getTime();
      default:
        return 0;
    }
  });
  
  // Paginate entities
  const pageCount = Math.ceil(sortedEntities.length / parseInt(pageSize));
  const paginatedEntities = sortedEntities.slice(
    (currentPage - 1) * parseInt(pageSize),
    currentPage * parseInt(pageSize)
  );
  
  // Handle delete entity
  const handleDeleteEntity = async (cinNumber: string) => {
    if (confirm("Are you sure you want to delete this entity?")) {
      try {
        await entityService.deleteEntity(cinNumber);
        toast({
          title: "Success",
          description: "Entity deleted successfully",
        });
        // Refresh entities
        setRefreshTrigger(prev => prev + 1);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete entity",
          variant: "destructive"
        });
      }
    }
  };
  
  // Get document counts for an entity
  const getDocumentCounts = (entity: EntityFormData) => {
    const financialCount = entity.financialRecords?.length || 0;
    const creditorCount = entity.creditors?.length || 0;
    const bankDocCount = entity.bankDocuments?.length || 0;
    
    return { financialCount, creditorCount, bankDocCount };
  };

  // Early return for debugging
  if (loading) {
    return (
      <DashboardLayout userType="service_provider">
        <div className="container mx-auto p-6">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 animate-spin mb-4" />
              <p className="text-lg">Loading entities...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="service_provider">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">My Entities</h1>
            <p className="text-muted-foreground">Manage your business entities</p>
          </div>
          <div className="flex items-center gap-4">
            <Input 
              placeholder="Search entities..." 
              className="w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button 
              onClick={() => navigate("/create-entity")}
              className="whitespace-nowrap"
            >
              + Create Entity
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4 mb-4">
            <Select value={entityType || ""} onValueChange={setEntityType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Entity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Company">Company</SelectItem>
                <SelectItem value="LLP">LLP</SelectItem>
                <SelectItem value="Partnership">Partnership</SelectItem>
                <SelectItem value="Individual">Individual</SelectItem>
                <SelectItem value="Trust">Trust</SelectItem>
              </SelectContent>
            </Select>

            <Select value={industry || ""} onValueChange={setIndustry}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                <SelectItem value="Service">Service</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Real Estate">Real Estate</SelectItem>
                <SelectItem value="Educational">Educational</SelectItem>
              </SelectContent>
            </Select>

            <Select value={category || ""} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Private">Private</SelectItem>
                <SelectItem value="Public">Public</SelectItem>
                <SelectItem value="Individual">Individual</SelectItem>
                <SelectItem value="Non-Profit">Non-Profit</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={status || ""} onValueChange={setStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>

            <div className="ml-auto flex gap-2">
              <Select value={sortBy || "name-asc"} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name A-Z</SelectItem>
                  <SelectItem value="name-desc">Name Z-A</SelectItem>
                  <SelectItem value="latest">Latest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entity Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        <span>Loading entities...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedEntities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      No entities found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedEntities.map((entity) => {
                    const { financialCount, creditorCount, bankDocCount } = getDocumentCounts(entity);
                    return (
                      <TableRow key={entity.cinNumber}>
                        <TableCell>
                          <div>
                            <Link 
                              to={`/entity/${entity.id}`} 
                              className="font-medium hover:underline text-primary"
                            >
                              {entity.entityName}
                            </Link>
                            <div className="text-xs text-muted-foreground">{entity.cinNumber}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{entity.entityType}</span>
                            <span className="text-xs text-muted-foreground">{entity.category}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {entity.industries?.map((ind, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {ind}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge variant={financialCount > 0 ? "default" : "outline"} className="flex items-center gap-1">
                                    <FileText className="h-3 w-3" />
                                    <span>{financialCount}</span>
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Financial Records</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge variant={creditorCount > 0 ? "default" : "outline"} className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    <span>{creditorCount}</span>
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Creditors</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge variant={bankDocCount > 0 ? "default" : "outline"} className="flex items-center gap-1">
                                    <Landmark className="h-3 w-3" />
                                    <span>{bankDocCount}</span>
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Bank Documents</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={entity.companyStatus === 'Active' ? "default" : "secondary"} className={`capitalize ${entity.companyStatus === 'Active' ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                            {entity.companyStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => navigate(`/entity/${entity.cinNumber}`)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => navigate(`/edit-entity/${entity.cinNumber}`)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteEntity(entity.cinNumber)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="py-4 px-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {paginatedEntities.length} of {filteredEntities.length} entities
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
                    // Show first page, last page, and pages around current page
                    let pageNum;
                    if (pageCount <= 5) {
                      // If 5 or fewer pages, show all
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      // If near start, show first 5
                      pageNum = i + 1;
                    } else if (currentPage >= pageCount - 2) {
                      // If near end, show last 5
                      pageNum = pageCount - 4 + i;
                    } else {
                      // Otherwise show current and 2 on each side
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <PaginationItem key={i}>
                        <PaginationLink 
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  {pageCount > 5 && currentPage < pageCount - 2 && (
                    <>
                      <PaginationItem>
                        <PaginationLink className="cursor-default">...</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink 
                          onClick={() => setCurrentPage(pageCount)}
                          className="cursor-pointer"
                        >
                          {pageCount}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(pageCount, prev + 1))}
                      className={currentPage === pageCount ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Show:</span>
                <Select value={pageSize} onValueChange={setPageSize}>
                  <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EntityManagement;
