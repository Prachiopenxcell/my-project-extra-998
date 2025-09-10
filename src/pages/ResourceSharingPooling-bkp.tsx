import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, Plus, Search, Filter, Eye, Pencil, Trash2, CheckCircle2, XCircle, Info,
  CalendarDays, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Upload,
  Shield, Building2
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { resourceSharingService } from "@/services/resourceSharingService";
import {
  Resource, ResourceStatus, ResourceType,
  Request, RequestType, CollaborationMode, Urgency
} from "@/types/resourceSharing";

const maskName = (name: string) => {
  if (!name) return "Hidden";
  const first = name.split(" ")[0] ?? name;
  return `${first[0]}****`;
};

// Team Resources Modal
const TeamResourcesModal = ({ onClose }: { onClose: () => void }) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Resource[]>([]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const res = await resourceSharingService.listResources({ pageSize: 100 });
      setItems(res.items);
      setLoading(false);
    };
    run();
  }, []);

  const grouped = useMemo(() => {
    const map: Record<string, Resource[]> = {};
    for (const r of items) {
      map[r.ownerName] = map[r.ownerName] ? [...map[r.ownerName], r] : [r];
    }
    return map;
  }, [items]);

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-md shadow-lg w-full max-w-3xl p-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /><h3 className="font-semibold">Team Resources</h3></div>
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </div>
        {loading ? (
          <div className="p-6"><Skeleton className="h-4 w-1/2 mb-2" /><Skeleton className="h-4 w-1/3" /></div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">No resources</div>
        ) : (
          <div className="space-y-4 max-h-[70vh] overflow-auto pr-2">
            {Object.entries(grouped).map(([owner, list]) => (
              <Card key={owner} className="border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{owner} <span className="text-muted-foreground">• {list.length} item(s)</span></CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {list.map(r => (
                      <div key={r.id} className="border rounded-md p-3">
                        <div className="font-medium mb-1">{r.title}</div>
                        <div className="text-xs text-muted-foreground mb-1">{r.type} • {r.location}</div>
                        <div className="text-xs">Status: {r.status}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ResourceSharingPooling = () => {
  return (
    <DashboardLayout>
      <ModuleView />
    </DashboardLayout>
  );
};

const ModuleView = () => {
  const [activeTab, setActiveTab] = useState<string>("provider");
  const [teamModalOpen, setTeamModalOpen] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Resource Pooling & Sharing</h1>
          <p className="text-muted-foreground">List resources or request resources from the pool</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9" onClick={() => setTeamModalOpen(true)}>
            <Users className="mr-2 h-4 w-4" /> Team Resources
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="provider">Resource Provider</TabsTrigger>
          <TabsTrigger value="seeker">Resource Seeker</TabsTrigger>
        </TabsList>

        <TabsContent value="provider" className="mt-4">
          <ProviderView />
        </TabsContent>
        <TabsContent value="seeker" className="mt-4">
          <SeekerView />
        </TabsContent>
      </Tabs>
      {teamModalOpen && (
        <TeamResourcesModal onClose={() => setTeamModalOpen(false)} />
      )}
    </div>
  );
};

// Provider View
const ProviderView = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [resources, setResources] = useState<Resource[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<ResourceType | 'All'>("All");
  const [statusFilter, setStatusFilter] = useState<ResourceStatus | 'All'>("All");
  const [sort, setSort] = useState<'Latest' | 'Oldest'>("Latest");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Form state
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<{
    type: ResourceType | '';
    title: string;
    information: string;
    ownerName: string;
    location: string;
    endDate?: string;
    status: ResourceStatus;
  }>({ type: '', title: '', information: '', ownerName: '', location: '', endDate: undefined, status: 'Available' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await resourceSharingService.listResources({ search, type: typeFilter, status: statusFilter, sort, page, pageSize });
      setResources(res.items);
      setTotal(res.total);
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to load resources', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, [search, typeFilter, statusFilter, sort, page, pageSize]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  const resetForm = () => { setEditId(null); setForm({ type: '', title: '', information: '', ownerName: '', location: '', endDate: undefined, status: 'Available' }); };

  const handleSave = async () => {
    if (!form.type || !form.title || !form.information || !form.ownerName || !form.location) {
      toast({ title: 'Validation', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }
    try {
      setSaving(true);
      if (editId) {
        await resourceSharingService.updateResource(editId, {
          type: form.type as ResourceType,
          title: form.title,
          information: form.information,
          ownerName: form.ownerName,
          location: form.location,
          endDate: form.endDate,
          status: form.status
        });
        toast({ title: 'Resource updated', description: 'Changes have been saved' });
      } else {
        await resourceSharingService.createResource({
          type: form.type as ResourceType,
          title: form.title,
          information: form.information,
          ownerName: form.ownerName,
          location: form.location,
          endDate: form.endDate,
          status: form.status
        });
        toast({ title: 'Resource saved', description: 'Your resource is now in the pool' });
      }
      resetForm();
      setPage(1);
      await fetchData();
      setFormOpen(false);
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to save resource', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await resourceSharingService.deleteResource(id);
    toast({ title: 'Deleted', description: 'Resource deleted successfully' });
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button onClick={() => { resetForm(); setFormOpen(true); }}><Plus className="h-4 w-4 mr-2" /> Upload Resource in Pool</Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">View:</span>
          <Select value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
            <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="table">Table</SelectItem>
              <SelectItem value="cards">Cards</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /> My Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input className="pl-8 w-64" placeholder="Search resources..." value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Filter:</span>
              <Select value={typeFilter} onValueChange={(v) => { setPage(1); setTypeFilter(v as any); }}>
                <SelectTrigger className="w-[150px]"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="Article">Article</SelectItem>
                  <SelectItem value="Trainee_CA">Trainee CA</SelectItem>
                  <SelectItem value="Trainee_CS">Trainee CS</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => { setPage(1); setStatusFilter(v as any); }}>
                <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Occupied">Occupied</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Sort:</span>
              <Select value={sort} onValueChange={(v) => { setPage(1); setSort(v as any); }}>
                <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Latest">Latest</SelectItem>
                  <SelectItem value="Oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm">Per page:</span>
              <Select value={String(pageSize)} onValueChange={(v) => { setPage(1); setPageSize(Number(v)); }}>
                <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {viewMode === 'table' ? (
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 pl-4 text-xs uppercase text-muted-foreground tracking-wider">Title</th>
                    <th className="text-left p-3 text-xs uppercase text-muted-foreground tracking-wider">Type</th>
                    <th className="text-left p-3 text-xs uppercase text-muted-foreground tracking-wider">Location</th>
                    <th className="text-left p-3 text-xs uppercase text-muted-foreground tracking-wider">Status</th>
                    <th className="text-left p-3 text-xs uppercase text-muted-foreground tracking-wider">Requests</th>
                    <th className="text-left p-3 text-xs uppercase text-muted-foreground tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} className="p-6"><Skeleton className="h-4 w-1/2 mb-2" /><Skeleton className="h-4 w-1/3" /></td></tr>
                  ) : resources.length === 0 ? (
                    <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No resources found</td></tr>
                  ) : (
                    resources.map((r) => (
                      <tr key={r.id} className="border-b">
                        <td className="p-3 pl-4">
                          <div className="font-medium flex items-center gap-2">
                            <Eye className="h-3.5 w-3.5 text-primary" /> {r.title}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                            <Shield className="h-3 w-3" /> Owner: {r.ownerName}
                          </div>
                        </td>
                        <td className="p-3 text-sm">{r.type}</td>
                        <td className="p-3 text-sm">{r.location}</td>
                        <td className="p-3">
                          {r.status === 'Available' && <Badge className="bg-green-50 text-green-700 border-green-200" variant="outline">Available</Badge>}
                          {r.status === 'Occupied' && <Badge className="bg-amber-50 text-amber-700 border-amber-200" variant="outline">Occupied</Badge>}
                          {r.status === 'Inactive' && <Badge className="bg-gray-50 text-gray-700 border-gray-200" variant="outline">Inactive</Badge>}
                        </td>
                        <td className="p-3 text-sm">
                          {r.requestIds.length > 0 ? (
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{r.requestIds.length} pending</Badge>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" title="Edit" onClick={() => { setEditId(r.id); setForm({ type: r.type, title: r.title, information: r.information, ownerName: r.ownerName, location: r.location, endDate: r.endDate, status: r.status }); setFormOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                            <Button size="sm" variant="ghost" title="Delete" onClick={() => handleDelete(r.id)}><Trash2 className="h-4 w-4" /></Button>
                            <ResourceRequestsButton resourceId={r.id} />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                <Skeleton className="h-24 w-full" />
              ) : resources.length === 0 ? (
                <div className="text-center text-muted-foreground w-full py-8">No resources found</div>
              ) : (
                resources.map(r => (
                  <Card key={r.id} className="border">
                    <CardContent className="p-4">
                      <div className="font-semibold flex items-center gap-2 mb-1"><Eye className="h-3.5 w-3.5 text-primary" /> {r.title}</div>
                      <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2"><Shield className="h-3 w-3" /> Owner: {r.ownerName}</div>
                      <div className="text-sm mb-2">{r.information}</div>
                      <div className="flex items-center justify-between text-sm mb-3">
                        <span className="text-muted-foreground">{r.type} • {r.location}</span>
                        <span>
                          {r.status === 'Available' && <Badge className="bg-green-50 text-green-700 border-green-200" variant="outline">Available</Badge>}
                          {r.status === 'Occupied' && <Badge className="bg-amber-50 text-amber-700 border-amber-200" variant="outline">Occupied</Badge>}
                          {r.status === 'Inactive' && <Badge className="bg-gray-50 text-gray-700 border-gray-200" variant="outline">Inactive</Badge>}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" title="Edit" onClick={() => { setEditId(r.id); setForm({ type: r.type, title: r.title, information: r.information, ownerName: r.ownerName, location: r.location, endDate: r.endDate, status: r.status }); setFormOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" title="Delete" onClick={() => handleDelete(r.id)}><Trash2 className="h-4 w-4" /></Button>
                        <ResourceRequestsButton resourceId={r.id} />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {(total === 0 ? 0 : (page - 1) * pageSize + 1)} - {Math.min(page * pageSize, total)} of {total}
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" onClick={() => setPage(1)} disabled={page === 1}><ChevronsLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="h-4 w-4" /></Button>
              <span className="px-2 text-sm">Page {page} of {totalPages}</span>
              <Button variant="outline" size="icon" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" onClick={() => setPage(totalPages)} disabled={page === totalPages}><ChevronsRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {formOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setFormOpen(false)}>
          <div className="bg-white rounded-md shadow-lg w-full max-w-2xl p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2"><Plus className="h-4 w-4 text-primary" /><h3 className="font-semibold">{editId ? 'Edit Resource' : 'Upload Resource in Pool'}</h3></div>
              <Button variant="ghost" size="sm" onClick={() => setFormOpen(false)}>Close</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-1 block">Type of Resource</label>
                <Select value={form.type} onValueChange={(v) => setForm(f => ({ ...f, type: v as ResourceType }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="Article">Article</SelectItem>
                    <SelectItem value="Trainee_CA">Trainees under CA</SelectItem>
                    <SelectItem value="Trainee_CS">Trainees under CS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm mb-1 block">Title</label>
                <Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Enter title" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm mb-1 block">Information</label>
                <Textarea value={form.information} onChange={(e) => setForm(f => ({ ...f, information: e.target.value }))} placeholder="Describe the resource" rows={4} />
              </div>
              <div>
                <label className="text-sm mb-1 block">Name</label>
                <Input value={form.ownerName} onChange={(e) => setForm(f => ({ ...f, ownerName: e.target.value }))} placeholder="Provider/Team Member" />
                <p className="text-xs text-muted-foreground mt-1">Name will be masked to seekers until request is accepted.</p>
              </div>
              <div>
                <label className="text-sm mb-1 block">Location</label>
                <Input value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} placeholder="City / Area" />
              </div>
              <div>
                <label className="text-sm mb-1 block">End Date (optional)</label>
                <Input type="date" value={form.endDate ?? ''} onChange={(e) => setForm(f => ({ ...f, endDate: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm mb-1 block">Status</label>
                <Select value={form.status} onValueChange={(v) => setForm(f => ({ ...f, status: v as ResourceStatus }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Occupied">Occupied</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 mt-4 justify-end">
              <Button type="button" variant="outline" onClick={resetForm}>Reset</Button>
              <Button onClick={handleSave} disabled={saving}><CheckCircle2 className="h-4 w-4 mr-2" /> {editId ? 'Save Changes' : 'Save Resource'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ResourceRequestsButton = ({ resourceId }: { resourceId: string }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Request[]>([]);

  useEffect(() => {
    if (!open) return;
    const run = async () => {
      setLoading(true);
      const list = await resourceSharingService.listRequestsByResource(resourceId);
      setItems(list);
      setLoading(false);
    };
    run();
  }, [open, resourceId]);

  const accept = async (id: string) => {
    await resourceSharingService.acceptRequest(id);
    toast({ title: 'Accepted', description: 'Request accepted and resource marked occupied.' });
    const list = await resourceSharingService.listRequestsByResource(resourceId);
    setItems(list);
  };
  const reject = async (id: string) => {
    await resourceSharingService.rejectRequest(id);
    toast({ title: 'Rejected', description: 'Request rejected. Seeker can re-request.' });
    const list = await resourceSharingService.listRequestsByResource(resourceId);
    setItems(list);
  };

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)} title="View Requests"><Filter className="h-4 w-4 mr-1" /> Requests</Button>
      {open && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-md shadow-lg w-full max-w-3xl p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2"><Info className="h-4 w-4 text-primary" /><h3 className="font-semibold">Pool Requests</h3></div>
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Close</Button>
            </div>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 text-xs uppercase text-muted-foreground tracking-wider">Request Type</th>
                    <th className="text-left p-3 text-xs uppercase text-muted-foreground tracking-wider">Duration</th>
                    <th className="text-left p-3 text-xs uppercase text-muted-foreground tracking-wider">Mode</th>
                    <th className="text-left p-3 text-xs uppercase text-muted-foreground tracking-wider">Confidentiality</th>
                    <th className="text-left p-3 text-xs uppercase text-muted-foreground tracking-wider">Status</th>
                    <th className="text-left p-3 text-xs uppercase text-muted-foreground tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} className="p-6"><Skeleton className="h-4 w-1/2 mb-2" /><Skeleton className="h-4 w-1/3" /></td></tr>
                  ) : items.length === 0 ? (
                    <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No requests</td></tr>
                  ) : (
                    items.map(req => (
                      <tr key={req.id} className="border-b">
                        <td className="p-3 text-sm">{req.typeOfRequest}{req.typeOfRequest === 'Other' && req.otherRequestText ? ` - ${req.otherRequestText}` : ''}</td>
                        <td className="p-3 text-sm">{req.durationLabel || '-'}
                          <div className="text-xs text-muted-foreground">{req.requestedStart ? `${format(new Date(req.requestedStart), 'dd MMM, HH:mm')}` : ''}{req.requestedEnd ? ` - ${format(new Date(req.requestedEnd), 'dd MMM, HH:mm')}` : ''}</div>
                        </td>
                        <td className="p-3 text-sm">{req.mode}</td>
                        <td className="p-3 text-sm">{req.confidentiality ? 'Yes' : 'No'}</td>
                        <td className="p-3 text-sm">{req.status}</td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" disabled={req.status !== 'Action Pending'} onClick={() => accept(req.id)}><CheckCircle2 className="h-4 w-4" /></Button>
                            <Button size="sm" variant="ghost" disabled={req.status !== 'Action Pending'} onClick={() => reject(req.id)}><XCircle className="h-4 w-4" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Seeker View
const SeekerView = () => {
  const [step, setStep] = useState<1 | 2>(1);
  // List & select resources
  const [loading, setLoading] = useState<boolean>(true);
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<ResourceType | 'All'>("All");
  const [sort, setSort] = useState<'Latest' | 'Oldest'>("Latest");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Request form
  const [submitting, setSubmitting] = useState(false);
  const [requestForm, setRequestForm] = useState<{
    typeOfRequest: RequestType | '';
    otherRequestText?: string;
    purpose: string;
    requestedStart?: string;
    requestedEnd?: string;
    durationLabel?: string;
    mode: CollaborationMode | '';
    confidentiality: boolean;
    comments?: string;
    urgency: Urgency | '';
    recurrence?: boolean;
    recurrenceFrequency?: 'Daily' | 'Weekly' | 'Monthly';
  }>({ typeOfRequest: '', purpose: '', mode: '', confidentiality: false, urgency: '' });

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await resourceSharingService.listResources({ search, type: typeFilter, status: 'Available', sort, page, pageSize });
      setResources(res.items);
      setTotal(res.total);
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to load resources', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResources(); /* eslint-disable-next-line */ }, [search, typeFilter, sort, page, pageSize]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const goNext = () => {
    if (selectedIds.length === 0) {
      toast({ title: 'Validation', description: 'Please select at least one resource', variant: 'destructive' });
      return;
    }
    setStep(2);
  };

  const submitRequest = async () => {
    if (!requestForm.typeOfRequest || !requestForm.purpose || !requestForm.mode || !requestForm.urgency) {
      toast({ title: 'Validation', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }
    try {
      setSubmitting(true);
      for (const rid of selectedIds) {
        const payload = {
          resourceId: rid,
          typeOfRequest: requestForm.typeOfRequest as RequestType,
          otherRequestText: requestForm.otherRequestText,
          purpose: requestForm.purpose,
          requestedStart: requestForm.requestedStart,
          requestedEnd: requestForm.requestedEnd,
          durationLabel: requestForm.durationLabel,
          mode: requestForm.mode as CollaborationMode,
          confidentiality: requestForm.confidentiality,
          comments: requestForm.comments,
          urgency: requestForm.urgency as Urgency,
          recurrence: requestForm.recurrence,
          recurrenceFrequency: requestForm.recurrenceFrequency,
        };
        await resourceSharingService.createRequest(payload);
      }
      toast({ title: 'Request submitted', description: `${selectedIds.length} request(s) created` });
      setStep(1);
      setSelectedIds([]);
      setRequestForm({ typeOfRequest: '', purpose: '', mode: '', confidentiality: false, urgency: '' });
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to submit request', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {step === 1 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><Search className="h-4 w-4 text-primary" /> Select Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input className="pl-8 w-64" placeholder="Search resources..." value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Filter:</span>
                <Select value={typeFilter} onValueChange={(v) => { setPage(1); setTypeFilter(v as any); }}>
                  <SelectTrigger className="w-[150px]"><SelectValue placeholder="Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Types</SelectItem>
                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="Article">Article</SelectItem>
                    <SelectItem value="Trainee_CA">Trainee CA</SelectItem>
                    <SelectItem value="Trainee_CS">Trainee CS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Sort:</span>
                <Select value={sort} onValueChange={(v) => { setPage(1); setSort(v as any); }}>
                  <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Latest">Latest</SelectItem>
                    <SelectItem value="Oldest">Oldest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm">Per page:</span>
                <Select value={String(pageSize)} onValueChange={(v) => { setPage(1); setPageSize(Number(v)); }}>
                  <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <div />
              <div className="flex items-center gap-2">
                <span className="text-sm">View:</span>
                <Select value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
                  <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="table">Table</SelectItem>
                    <SelectItem value="cards">Cards</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {viewMode === 'table' ? (
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 pl-4 text-xs uppercase text-muted-foreground tracking-wider">Select</th>
                      <th className="text-left p-3 text-xs uppercase text-muted-foreground tracking-wider">Title</th>
                      <th className="text-left p-3 text-xs uppercase text-muted-foreground tracking-wider">Type</th>
                      <th className="text-left p-3 text-xs uppercase text-muted-foreground tracking-wider">Info</th>
                      <th className="text-left p-3 text-xs uppercase text-muted-foreground tracking-wider">Location</th>
                      <th className="text-left p-3 text-xs uppercase text-muted-foreground tracking-wider">End Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={6} className="p-6"><Skeleton className="h-4 w-1/2 mb-2" /><Skeleton className="h-4 w-1/3" /></td></tr>
                    ) : resources.length === 0 ? (
                      <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No resources available</td></tr>
                    ) : (
                      resources.map(r => (
                        <tr key={r.id} className="border-b">
                          <td className="p-3 pl-4"><input type="checkbox" checked={selectedIds.includes(r.id)} onChange={() => toggleSelect(r.id)} /></td>
                          <td className="p-3">
                            <div className="font-medium">{r.title}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1"><Shield className="h-3 w-3" /> Provider: {maskName(r.ownerName)}</div>
                          </td>
                          <td className="p-3 text-sm">{r.type}</td>
                          <td className="p-3 text-sm">{r.information}</td>
                          <td className="p-3 text-sm">{r.location}</td>
                          <td className="p-3 text-sm">{r.endDate ? format(new Date(r.endDate), 'dd MMM yyyy') : '-'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                  <Skeleton className="h-24 w-full" />
                ) : resources.length === 0 ? (
                  <div className="text-center text-muted-foreground w-full py-8">No resources available</div>
                ) : (
                  resources.map(r => (
                    <Card key={r.id} className={`border ${selectedIds.includes(r.id) ? 'ring-2 ring-primary' : ''}`} onClick={() => toggleSelect(r.id)}>
                      <CardContent className="p-4 cursor-pointer">
                        <div className="flex items-start justify-between mb-1">
                          <div className="font-semibold">{r.title}</div>
                          <input type="checkbox" checked={selectedIds.includes(r.id)} readOnly />
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mb-2"><Shield className="h-3 w-3" /> Provider: {maskName(r.ownerName)}</div>
                        <div className="text-sm mb-2">{r.information}</div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{r.type} • {r.location}</span>
                          <span>{r.endDate ? format(new Date(r.endDate), 'dd MMM yyyy') : '-'}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(total === 0 ? 0 : (page - 1) * pageSize + 1)} - {Math.min(page * pageSize, total)} of {total}
              </div>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" onClick={() => setPage(1)} disabled={page === 1}><ChevronsLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="h-4 w-4" /></Button>
                <span className="px-2 text-sm">Page {page} of {totalPages}</span>
                <Button variant="outline" size="icon" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" onClick={() => setPage(totalPages)} disabled={page === totalPages}><ChevronsRight className="h-4 w-4" /></Button>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button onClick={goNext} disabled={selectedIds.length === 0}><Upload className="h-4 w-4 mr-2" /> Proceed to Request</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><Plus className="h-4 w-4 text-primary" /> Request Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-1 block">Type of Request</label>
                <Select value={requestForm.typeOfRequest} onValueChange={(v) => setRequestForm(f => ({ ...f, typeOfRequest: v as RequestType }))}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Module">Module</SelectItem>
                    <SelectItem value="Checklist Task">Checklist Task</SelectItem>
                    <SelectItem value="Sub Task">Sub Task</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {requestForm.typeOfRequest === 'Other' && (
                <div>
                  <label className="text-sm mb-1 block">Other (specify)</label>
                  <Input value={requestForm.otherRequestText ?? ''} onChange={(e) => setRequestForm(f => ({ ...f, otherRequestText: e.target.value }))} placeholder="Enter custom type" />
                </div>
              )}
              <div className="md:col-span-2">
                <label className="text-sm mb-1 block">Purpose of Request</label>
                <Textarea value={requestForm.purpose} onChange={(e) => setRequestForm(f => ({ ...f, purpose: e.target.value }))} rows={4} placeholder="Describe purpose" />
              </div>
              <div>
                <label className="text-sm mb-1 block">Requested Start</label>
                <Input type="datetime-local" value={requestForm.requestedStart ?? ''} onChange={(e) => setRequestForm(f => ({ ...f, requestedStart: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm mb-1 block">Requested End</label>
                <Input type="datetime-local" value={requestForm.requestedEnd ?? ''} onChange={(e) => setRequestForm(f => ({ ...f, requestedEnd: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm mb-1 block">Duration</label>
                <Select value={requestForm.durationLabel ?? ''} onValueChange={(v) => setRequestForm(f => ({ ...f, durationLabel: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select duration" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2 Days">2 Days</SelectItem>
                    <SelectItem value="4 Hours">4 Hours</SelectItem>
                    <SelectItem value="1 Week">1 Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm mb-1 block">Preferred Mode</label>
                <Select value={requestForm.mode} onValueChange={(v) => setRequestForm(f => ({ ...f, mode: v as CollaborationMode }))}>
                  <SelectTrigger><SelectValue placeholder="Select mode" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Virtual">Virtual</SelectItem>
                    <SelectItem value="In-Person">In-Person</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm mb-1 block">Confidentiality</label>
                <Select value={requestForm.confidentiality ? 'Yes' : 'No'} onValueChange={(v) => setRequestForm(f => ({ ...f, confidentiality: v === 'Yes' }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">If Yes, NDA/invite-only access may be applied on acceptance.</p>
              </div>
              <div>
                <label className="text-sm mb-1 block">Urgency</label>
                <Select value={requestForm.urgency} onValueChange={(v) => setRequestForm(f => ({ ...f, urgency: v as Urgency }))}>
                  <SelectTrigger><SelectValue placeholder="Select urgency" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm mb-1 block">Comments / Additional Information</label>
                <Textarea value={requestForm.comments ?? ''} onChange={(e) => setRequestForm(f => ({ ...f, comments: e.target.value }))} rows={3} placeholder="Any notes for provider" />
              </div>
              <div>
                <label className="text-sm mb-1 block">Recurrence</label>
                <Select value={requestForm.recurrence ? 'Yes' : 'No'} onValueChange={(v) => setRequestForm(f => ({ ...f, recurrence: v === 'Yes' }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {requestForm.recurrence && (
                <div>
                  <label className="text-sm mb-1 block">Frequency</label>
                  <Select value={requestForm.recurrenceFrequency ?? ''} onValueChange={(v) => setRequestForm(f => ({ ...f, recurrenceFrequency: v as any }))}>
                    <SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={submitRequest} disabled={submitting}><Upload className="h-4 w-4 mr-2" /> Submit Request</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResourceSharingPooling;