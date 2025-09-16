import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
  BarChart3,
  ArrowLeft
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const DocumentStorageEnhanced = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("recent");
  const [selectedEntity, setSelectedEntity] = useState("abc-corp");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [selectedOwner, setSelectedOwner] = useState("all");
  const [selectedModule, setSelectedModule] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10");
  const [searchQuery, setSearchQuery] = useState("");

  type RoomItem = {
    id: number;
    name: string;
    lastEdited: string;
    size: string;
    owner: string;
    isPinned: boolean;
    type: "folder" | "file";
    module: string;
    location?: string; // only for files
    entity?: string; // Entity Name
    group?: string;  // Group Name
  };

  const rooms: RoomItem[] = [
    {
      id: 1,
      name: "Q3 Audit Files",
      lastEdited: "2 hours ago",
      size: "2.4GB",
      owner: "John D.",
      isPinned: true,
      type: "folder",
      module: "audit",
      entity: "ABC Corp",
      group: "Audit Team"
    },
    {
      id: 2,
      name: "Board_Resolution.pdf",
      lastEdited: "4 hours ago",
      size: "1.2MB",
      owner: "Admin",
      isPinned: true,
      type: "file",
      module: "legal",
      location: "Q3 Audit Files",
      entity: "ABC Corp",
      group: "Legal Team"
    },
    {
      id: 3,
      name: "CIRP Documents",
      lastEdited: "1 day ago",
      size: "1.8GB",
      owner: "Jane S.",
      isPinned: false,
      type: "folder",
      module: "legal",
      entity: "ABC Corp",
      group: "CIRP Core"
    },
    {
      id: 4,
      name: "Legal Filings",
      lastEdited: "3 days ago",
      size: "856MB",
      owner: "Legal T.",
      isPinned: false,
      type: "folder",
      module: "legal",
      entity: "ABC Corp",
      group: "Legal Team"
    },
    {
      id: 5,
      name: "Compliance Audit",
      lastEdited: "1 week ago",
      size: "1.2GB",
      owner: "Audit T.",
      isPinned: false,
      type: "folder",
      module: "audit",
      entity: "ABC Corp",
      group: "Audit Team"
    }
  ];

  // Additional mock documents (files)
  rooms.push(
    {
      id: 6,
      name: "Financials_Q3.xlsx",
      lastEdited: "3 hours ago",
      size: "4.6MB",
      owner: "John D.",
      isPinned: false,
      type: "file",
      module: "audit",
      location: "Q3 Audit Files",
      entity: "ABC Corp",
      group: "Audit Team"
    },
    {
      id: 7,
      name: "Client_Agreement_v2.docx",
      lastEdited: "Yesterday",
      size: "820KB",
      owner: "John D.",
      isPinned: false,
      type: "file",
      module: "legal",
      location: "Legal Filings",
      entity: "ABC Corp",
      group: "Legal Team"
    },
    {
      id: 8,
      name: "Compliance_Checklist.pdf",
      lastEdited: "2 days ago",
      size: "540KB",
      owner: "Jane S.",
      isPinned: false,
      type: "file",
      module: "audit",
      location: "Compliance Audit",
      entity: "ABC Corp",
      group: "Audit Team"
    }
  );

  // Stateful items to support pin/unpin and other mutations
  const [items, setItems] = useState<RoomItem[]>(rooms);
  const allItems = items;
  // Build filter option lists
  const entities = Array.from(new Set(allItems.map(i => i.entity ?? "").filter(Boolean)));
  const groups = Array.from(new Set(allItems.map(i => i.group ?? "").filter(Boolean)));
  const owners = Array.from(new Set(allItems.map(i => i.owner)));

  // Apply filters
  const matchesEntity = (i: RoomItem) => selectedEntity === "all" || i.entity === selectedEntity;
  const matchesGroup = (i: RoomItem) => selectedGroup === "all" || i.group === selectedGroup;
  const matchesOwner = (i: RoomItem) => selectedOwner === "all" || i.owner === selectedOwner;

  // Text search across fields
  const q = (searchQuery || "").toLowerCase().trim();
  const matchesSearch = (i: RoomItem) =>
    !q ||
    i.name.toLowerCase().includes(q) ||
    i.owner.toLowerCase().includes(q) ||
    (i.module?.toLowerCase?.().includes(q)) ||
    (i.location?.toLowerCase?.().includes(q));

  const filteredAllItems = allItems.filter(i => matchesEntity(i) && matchesGroup(i) && matchesOwner(i) && matchesSearch(i));

  // Sorting
  const sortItems = (arr: RoomItem[]) => {
    switch (sortBy) {
      case 'oldest':
        return [...arr].sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
      case 'name':
        return [...arr].sort((a, b) => a.name.localeCompare(b.name));
      case 'size':
        // naive size sort by parsed number if ends with MB/GB
        const toBytes = (s: string) => {
          const m = /(\d+(?:\.\d+)?)\s*(KB|MB|GB)/i.exec(s || '');
          if (!m) return 0;
          const n = parseFloat(m[1]);
          const u = m[2].toUpperCase();
          if (u === 'GB') return n * 1024 * 1024 * 1024;
          if (u === 'MB') return n * 1024 * 1024;
          return n * 1024;
        };
        return [...arr].sort((a, b) => toBytes(a.size) - toBytes(b.size));
      case 'latest':
      default:
        return [...arr].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
    }
  };

  const sortedAllItems = sortItems(filteredAllItems);
  // Quick filters (icon buttons): type filter and "my items only"
  const [typeFilter, setTypeFilter] = useState<"all" | "folders" | "files">("all");
  const [myOnly, setMyOnly] = useState(false);

  const matchesType = (i: RoomItem) => typeFilter === "all" || (typeFilter === "folders" ? i.type === "folder" : i.type === "file");
  const matchesMyOnly = (i: RoomItem) => !myOnly || i.owner === currentUserName;

  const filteredWithQuick = sortedAllItems.filter(i => matchesType(i) && matchesMyOnly(i));

  // Pagination
  const pageSize = parseInt(itemsPerPage, 10) || 10;
  const totalItems = filteredWithQuick.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const current = Math.min(currentPage, totalPages);
  const start = (current - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = filteredWithQuick.slice(start, end);

  const pinnedItems = filteredWithQuick.filter(room => room.isPinned);
  const documentItems = filteredWithQuick.filter(room => room.type === "file");
  const currentUserName = "John D."; // mock current user
  const myDocuments = documentItems.filter(doc => doc.owner === currentUserName);
  const sharedDocuments = documentItems.filter(doc => doc.owner !== currentUserName);

  // const totalPages = 3; // replaced by computed

  // Actions: Preview / Download / Settings
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<RoomItem | null>(null);

  const openPreview = (item: RoomItem) => {
    if (item.type !== "file") return;
    logAudit("VIEW", item.name, item.location ?? "Root");
    setPreviewItem(item);
    setPreviewOpen(true);
  };

  const downloadItem = (item: RoomItem) => {
    // Mock download
    logAudit("DOWNLOAD", item.name, item.location ?? (item.type === 'folder' ? item.name : 'Root'));
    const link = document.createElement("a");
    link.href = "#";
    link.download = item.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const openSettings = (item: RoomItem) => {
    logAudit(item.type === 'folder' ? "OPEN_ROOM" : "OPEN_FILE", item.name, item.location ?? (item.type === 'folder' ? item.name : 'Root'));
    if (item.type === "folder") {
      navigate(`/data-room/room/${item.id}`); // reuse room view for settings placeholder
    } else {
      navigate(`/data-room/file/${item.id}`); // placeholder route for file details
    }
  };

  // Simple client-side audit logger for demo; backend can replace this later
  type AuditRecord = {
    timestamp: string; // ISO
    user: string;
    action: string;
    resource: string;
    location: string;
    module: string;
  };
  const logAudit = (action: string, resource: string, location: string) => {
    try {
      const key = "vdr_audit_log";
      const existing: AuditRecord[] = JSON.parse(localStorage.getItem(key) || "[]");
      const rec: AuditRecord = {
        timestamp: new Date().toISOString(),
        user: currentUserName,
        action,
        resource,
        location,
        module: "Document Storage"
      };
      localStorage.setItem(key, JSON.stringify([rec, ...existing].slice(0, 500)));
    } catch (err) {
      // Intentionally ignore localStorage errors (quota/permissions) in demo mode
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div className="space-y-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/data-room')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to VDR
            </Button>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">Document Storage & Management</h1>
              <p className="text-muted-foreground text-sm">
                Manage and organize your documents and data rooms
              </p>
            </div>
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={typeFilter === 'folders' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTypeFilter(prev => prev === 'folders' ? 'all' : 'folders')}
                      title="Filter by type"
                    >
                      <FolderOpen className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Show only folders (click again to show all)</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={myOnly ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setMyOnly(v => !v)}
                      title="My items only"
                    >
                      <Users className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Toggle to show only your items</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setTypeFilter('all'); setMyOnly(false); setSelectedEntity('all'); setSelectedGroup('all'); setSelectedOwner('all'); setSelectedModule('all'); }}
                      title="Reset filters"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reset all filters</TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
                          onClick={() => item.type === 'folder' ? navigate(`/data-room/room/${item.id}`) : openPreview(item)}
                          title={item.type === 'folder' ? "Open Room" : "Preview"}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => downloadItem(item)}
                          title="Download"
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openSettings(item)}
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
                              <span
                                className={`font-medium ${item.type === 'folder' ? 'cursor-pointer hover:underline' : ''}`}
                                title={item.type === 'folder' ? 'Open Room' : undefined}
                                onClick={() => item.type === 'folder' && navigate(`/data-room/room/${item.id}`)}
                              >
                                {item.name}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">{item.lastEdited}</td>
                          <td className="p-4 text-sm">{item.size}</td>
                          <td className="p-4 text-sm">{item.owner}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                title={item.type === 'folder' ? 'Open Room' : 'Preview'}
                                onClick={() => item.type === 'folder' ? navigate(`/data-room/room/${item.id}`) : openPreview(item)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => downloadItem(item)} title="Download">
                                <Upload className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => openSettings(item)} title="Settings">
                                <Settings className="h-4 w-4" />
                              </Button>
                              {item.type === 'folder' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title={item.isPinned ? 'Unpin' : 'Pin'}
                                  onClick={() => {
                                    setItems(prev => prev.map(x => x.id === item.id ? { ...x, isPinned: !x.isPinned } : x));
                                    logAudit(item.isPinned ? 'UNPIN' : 'PIN', item.name, item.location ?? item.name);
                                  }}
                                >
                                  {item.isPinned ? <Pin className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                                </Button>
                              )}
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
                              <span
                                className={`font-medium ${item.type === 'folder' ? 'cursor-pointer hover:underline' : ''}`}
                                title={item.type === 'folder' ? 'Open Room' : undefined}
                                onClick={() => item.type === 'folder' && navigate(`/data-room/room/${item.id}`)}
                              >
                                {item.name}
                              </span>
                              {item.isPinned && <Pin className="h-3 w-3 text-yellow-500" />}
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">{item.lastEdited}</td>
                          <td className="p-4 text-sm">{item.size}</td>
                          <td className="p-4 text-sm">{item.owner}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                title="View Room"
                                onClick={() => item.type === 'folder' && navigate(`/data-room/room/${item.id}`)}
                              >
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
                <CardTitle className="text-lg font-semibold">Documents</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Tabs defaultValue="my" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="my">My Documents</TabsTrigger>
                    <TabsTrigger value="shared">Shared Documents</TabsTrigger>
                  </TabsList>

                  <TabsContent value="my">
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
                            <th className="text-left p-4 font-medium">Last Edited</th>
                            <th className="text-left p-4 font-medium">Size</th>
                            <th className="text-left p-4 font-medium">Owner</th>
                            <th className="text-left p-4 font-medium">Location</th>
                            <th className="text-left p-4 font-medium">Module Name</th>
                            <th className="text-left p-4 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myDocuments.length === 0 ? (
                            <tr>
                              <td className="p-4 text-sm text-muted-foreground" colSpan={7}>No documents found.</td>
                            </tr>
                          ) : (
                            myDocuments.map((item) => (
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
                                <td className="p-4 text-sm">{item.location ?? "Root"}</td>
                                <td className="p-4 text-sm capitalize">{item.module || "-"}</td>
                                <td className="p-4">
                                  <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="sm" title="Preview" onClick={() => openPreview(item)}>
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" title="Download" onClick={() => downloadItem(item)}>
                                      <Upload className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" title="Settings" onClick={() => openSettings(item)}>
                                      <Settings className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>

                  <TabsContent value="shared">
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
                            <th className="text-left p-4 font-medium">Last Edited</th>
                            <th className="text-left p-4 font-medium">Size</th>
                            <th className="text-left p-4 font-medium">Owner</th>
                            <th className="text-left p-4 font-medium">Location</th>
                            <th className="text-left p-4 font-medium">Module Name</th>
                            <th className="text-left p-4 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sharedDocuments.length === 0 ? (
                            <tr>
                              <td className="p-4 text-sm text-muted-foreground" colSpan={7}>No shared documents found.</td>
                            </tr>
                          ) : (
                            sharedDocuments.map((item) => (
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
                                <td className="p-4 text-sm">{item.location ?? "Root"}</td>
                                <td className="p-4 text-sm capitalize">{item.module || "-"}</td>
                                <td className="p-4">
                                  <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="sm" title="Preview">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" title="Download">
                                      <Upload className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" title="Settings">
                                      <Settings className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                </Tabs>

        {/* Preview Dialog */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Preview: {previewItem?.name}</DialogTitle>
            </DialogHeader>
            {previewItem && (
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Owner:</span> {previewItem.owner}</div>
                <div><span className="font-medium">Last Edited:</span> {previewItem.lastEdited}</div>
                <div><span className="font-medium">Size:</span> {previewItem.size}</div>
                <div><span className="font-medium">Location:</span> {previewItem.location ?? 'Root'}</div>
                <div className="capitalize"><span className="font-medium">Module:</span> {previewItem.module}</div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setPreviewOpen(false)}>Close</Button>
              {previewItem && (
                <Button onClick={() => previewItem && downloadItem(previewItem)}>Download</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                      <SelectItem value="all">All Entities</SelectItem>
                      {entities.map(e => (
                        <SelectItem key={e} value={e}>{e}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Group:</span>
                  <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Groups</SelectItem>
                      {groups.map(g => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
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
                      {owners.map(o => (
                        <SelectItem key={o} value={o}>{o}</SelectItem>
                      ))}
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
