import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FolderOpen, 
  FileText, 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Upload, 
  Settings, 
  MoreHorizontal,
  Pin,
  Clock,
  HardDrive,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  BarChart3
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const DocumentStorageEnhanced = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("recent");
  const [selectedEntity, setSelectedEntity] = useState("abc-corp");
  const [selectedOwner, setSelectedOwner] = useState("all");
  const [selectedModule, setSelectedModule] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10");
  const [searchQuery, setSearchQuery] = useState("");

  const rooms = [
    {
      id: 1,
      name: "Q3 Audit Files",
      lastEdited: "2 hours ago",
      size: "2.4GB",
      owner: "John D.",
      isPinned: true,
      type: "folder",
      module: "audit"
    },
    {
      id: 2,
      name: "Board_Resolution.pdf",
      lastEdited: "4 hours ago",
      size: "1.2MB",
      owner: "Admin",
      isPinned: true,
      type: "file",
      module: "legal"
    },
    {
      id: 3,
      name: "CIRP Documents",
      lastEdited: "1 day ago",
      size: "1.8GB",
      owner: "Jane S.",
      isPinned: false,
      type: "folder",
      module: "legal"
    },
    {
      id: 4,
      name: "Legal Filings",
      lastEdited: "3 days ago",
      size: "856MB",
      owner: "Legal T.",
      isPinned: false,
      type: "folder",
      module: "legal"
    },
    {
      id: 5,
      name: "Compliance Audit",
      lastEdited: "1 week ago",
      size: "1.2GB",
      owner: "Audit T.",
      isPinned: false,
      type: "folder",
      module: "audit"
    }
  ];

  const pinnedItems = rooms.filter(room => room.isPinned);
  const allItems = rooms;
  const documentItems = rooms.filter(room => room.type === "file");

  const totalPages = 3;

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Document Storage & Management</h1>
            <p className="text-muted-foreground text-sm">
              Manage and organize your documents and data rooms
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" onClick={() => navigate('/data-room/create-room')}>
              <Plus className="mr-2 h-4 w-4" />
              Create Room
            </Button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Bulk Upload
            </Button>
            <Button variant="outline" size="sm">
              <Users className="mr-2 h-4 w-4" />
              Manage Teams
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="w-80 pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tabs and Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="recent" className="flex items-center gap-2">
                <Pin className="h-4 w-4" />
                Recent Visit
              </TabsTrigger>
              <TabsTrigger value="all" className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                All
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documents
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">FILTERS:</span>
              <Button variant="outline" size="sm">
                <FolderOpen className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="recent" className="space-y-6">
            {/* Pinned Items */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Pin className="h-5 w-5 text-primary" />
                  Pinned Items
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {pinnedItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        {item.type === "folder" ? (
                          <FolderOpen className="h-5 w-5 text-blue-600" />
                        ) : (
                          <FileText className="h-5 w-5 text-green-600" />
                        )}
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.lastEdited} • {item.size} • {item.owner}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/data-room/room/${item.id}`)}
                          title="View Room"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            // Download functionality
                            const link = document.createElement('a');
                            link.href = '#';
                            link.download = `${item.name}.zip`;
                            link.click();
                          }}
                          title="Download"
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            alert(`Settings for ${item.name}`);
                          }}
                          title="Settings"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Items Table */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">All Items</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-4 font-medium">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Room Name
                          </div>
                        </th>
                        <th className="text-left p-4 font-medium">Last Edited</th>
                        <th className="text-left p-4 font-medium">Size</th>
                        <th className="text-left p-4 font-medium">Owner</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allItems.filter(item => !item.isPinned).map((item) => (
                        <tr key={item.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {item.type === "folder" ? (
                                <FolderOpen className="h-5 w-5 text-blue-600" />
                              ) : (
                                <FileText className="h-5 w-5 text-green-600" />
                              )}
                              <span className="font-medium">{item.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">{item.lastEdited}</td>
                          <td className="p-4 text-sm">{item.size}</td>
                          <td className="p-4 text-sm">{item.owner}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Upload className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">All Documents & Rooms</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-4 font-medium">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Room Name
                          </div>
                        </th>
                        <th className="text-left p-4 font-medium">Last Edited</th>
                        <th className="text-left p-4 font-medium">Size</th>
                        <th className="text-left p-4 font-medium">Owner</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allItems.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {item.type === "folder" ? (
                                <FolderOpen className="h-5 w-5 text-blue-600" />
                              ) : (
                                <FileText className="h-5 w-5 text-green-600" />
                              )}
                              <span className="font-medium">{item.name}</span>
                              {item.isPinned && <Pin className="h-3 w-3 text-yellow-500" />}
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">{item.lastEdited}</td>
                          <td className="p-4 text-sm">{item.size}</td>
                          <td className="p-4 text-sm">{item.owner}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Upload className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">Documents Only</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-4 font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Document Name
                          </div>
                        </th>
                        <th className="text-left p-4 font-medium">Last Modified</th>
                        <th className="text-left p-4 font-medium">Size</th>
                        <th className="text-left p-4 font-medium">Owner</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documentItems.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-green-600" />
                              <span className="font-medium">{item.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">{item.lastEdited}</td>
                          <td className="p-4 text-sm">{item.size}</td>
                          <td className="p-4 text-sm">{item.owner}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Upload className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Filter Options */}
        <Card className="mt-8 mb-8">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Entity:</span>
                  <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="abc-corp">ABC Corp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Owner:</span>
                  <Select value={selectedOwner} onValueChange={setSelectedOwner}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="john">John D.</SelectItem>
                      <SelectItem value="jane">Jane S.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Module:</span>
                  <Select value={selectedModule} onValueChange={setSelectedModule}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Modules</SelectItem>
                      <SelectItem value="audit">Audit</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Sort:</span>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1">
                      <input 
                        type="radio" 
                        name="sort" 
                        value="latest"
                        checked={sortBy === "latest"}
                        onChange={(e) => setSortBy(e.target.value)}
                      />
                      <span className="text-sm">Latest</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input 
                        type="radio" 
                        name="sort" 
                        value="oldest"
                        checked={sortBy === "oldest"}
                        onChange={(e) => setSortBy(e.target.value)}
                      />
                      <span className="text-sm">Oldest</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input 
                        type="radio" 
                        name="sort" 
                        value="name-az"
                        checked={sortBy === "name-az"}
                        onChange={(e) => setSortBy(e.target.value)}
                      />
                      <span className="text-sm">Name A-Z</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <input 
                        type="radio" 
                        name="sort" 
                        value="size"
                        checked={sortBy === "size"}
                        onChange={(e) => setSortBy(e.target.value)}
                      />
                      <span className="text-sm">Size</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                  First
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </Button>
                <span className="text-sm">Page {currentPage} of {totalPages}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Show:</span>
                <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm">per page</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DocumentStorageEnhanced;
