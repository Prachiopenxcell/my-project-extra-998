import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Database, 
  FileText, 
  Plus, 
  Eye, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  BarChart3,
  Phone
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Demo audit logging to appear in /data-room/analytics
type AuditRecord = { timestamp: string; user: string; action: string; resource: string; location: string; module: string };
const logAudit = (action: string, resource: string, location: string) => {
  try {
    const key = "vdr_audit_log";
    const existing: AuditRecord[] = JSON.parse(localStorage.getItem(key) || "[]");
    const rec: AuditRecord = { timestamp: new Date().toISOString(), user: "John D.", action, resource, location, module: "Data Records" };
    localStorage.setItem(key, JSON.stringify([rec, ...existing].slice(0, 500)));
  } catch (e) { /* ignore */ }
};

const entities = [
  "ABC Corporation Ltd",
  "XYZ Industries Ltd",
  "PQR Services Inc"
];

// Schema generator: fields per process + section
type FieldDef = { key: string; label: string; type?: 'text'|'textarea'|'number'|'date' };
const SCHEMAS: Record<string, Record<string, FieldDef[]>> = {
    cirp: {
      'basic-info': [
        { key: 'entity_name', label: 'Entity Name' },
        { key: 'cin', label: 'CIN' },
        { key: 'roc_registration', label: 'ROC Registration' },
        { key: 'registered_address', label: 'Registered Address', type: 'textarea' }
      ],
      financial: [
        { key: 'assets_value', label: 'Assets Value (INR Crores)', type: 'number' },
        { key: 'liabilities_value', label: 'Liabilities (INR Crores)', type: 'number' },
        { key: 'latest_audited_fy', label: 'Latest Audited FY' }
      ],
      legal: [
        { key: 'irp_name', label: 'IRP/RP Name' },
        { key: 'irp_reg_no', label: 'IRP/RP Reg. No.' },
        { key: 'coC_constituted_on', label: 'CoC Constituted On', type: 'date' }
      ],
      operational: [
        { key: 'workers_count', label: 'Workers Count', type: 'number' },
        { key: 'plants', label: 'Plants/Locations', type: 'textarea' }
      ]
    },
    liquidation: {
      'basic-info': [
        { key: 'entity_name', label: 'Entity Name' },
        { key: 'liquidator', label: 'Liquidator' },
        { key: 'liquidation_start', label: 'Liquidation Start', type: 'date' }
      ],
      financial: [
        { key: 'realisations', label: 'Realisations (INR Crores)', type: 'number' },
        { key: 'distribution', label: 'Distribution Details', type: 'textarea' }
      ],
      legal: [
        { key: 'court_orders', label: 'Court Orders', type: 'textarea' }
      ],
      operational: [
        { key: 'assets_to_sale', label: 'Assets for Sale', type: 'textarea' }
      ]
    },
    audit: {
      'basic-info': [
        { key: 'auditor', label: 'Auditor' },
        { key: 'period', label: 'Audit Period' }
      ],
      financial: [
        { key: 'revenue', label: 'Revenue (INR Crores)', type: 'number' },
        { key: 'ebitda', label: 'EBITDA (INR Crores)', type: 'number' }
      ],
      legal: [
        { key: 'pending_cases', label: 'Pending Cases', type: 'number' }
      ],
      operational: [
        { key: 'key_observations', label: 'Key Observations', type: 'textarea' }
      ]
    },
    litigation: {
      'basic-info': [
        { key: 'case_title', label: 'Case Title' },
        { key: 'court', label: 'Court/Tribunal' }
      ],
      legal: [
        { key: 'next_hearing', label: 'Next Hearing Date', type: 'date' },
        { key: 'advocate', label: 'Advocate' }
      ],
      operational: [
        { key: 'brief_facts', label: 'Brief Facts', type: 'textarea' }
      ],
      financial: [
        { key: 'claim_amount', label: 'Claim Amount (INR Crores)', type: 'number' }
      ]
    },
    funding: {
      'basic-info': [
        { key: 'dd_phase', label: 'DD Phase' },
        { key: 'im_version', label: 'IM Version' }
      ],
      financial: [
        { key: 'projected_revenue', label: 'Projected Revenue (INR Crores)', type: 'number' }
      ],
      operational: [
        { key: 'requirements', label: 'Requirements', type: 'textarea' }
      ],
      legal: [
        { key: 'regulatory_clearances', label: 'Regulatory Clearances', type: 'textarea' }
      ]
    }
  };

const processes = [
  { value: "cirp", label: "CIRP" },
  { value: "liquidation", label: "Liquidation" },
  { value: "funding", label: "Funding Due Diligence" },
  { value: "audit", label: "Audit" },
  { value: "litigation", label: "Litigation" }
];

const suggestedHierarchy: Record<string, string[]> = {
  cirp: ["COC", "Financial Creditors", "Operational Creditors", "EOIs", "Resolution Plans"],
  liquidation: ["Asset Valuation", "Asset Sale", "Distribution"],
  funding: ["IM", "DDQ", "Financials", "Compliance"],
  audit: ["Financials", "Compliance", "Board Resolutions"],
  litigation: ["Cases", "Pleadings", "Evidence", "Orders"]
};

const DataRecordsRoom = () => {
  const navigate = useNavigate();
  const [selectedEntity, setSelectedEntity] = useState("ABC Corporation Ltd");
  const [selectedModule, setSelectedModule] = useState("entity");
  const [selectedSection, setSelectedSection] = useState("basic-info");
  const [selectedProcess, setSelectedProcess] = useState("cirp");
  
  // Record list view state
  const [activeTab, setActiveTab] = useState<'recent'|'all'>('recent');
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEntity, setFilterEntity] = useState<string>("all");
  const [filterOwner, setFilterOwner] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<'latest'|'oldest'>('latest');
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  type RecordFolder = {
    id: string;
    name: string;
    lastEdited: string; // ISO date
    size: string; // e.g., "45 MB"
    owner: string;
    entity: string;
    pinned?: boolean;
    targetInvitationId?: string; // for navigation to Claim Invitation details
  };
  
  const [folders, setFolders] = useState<RecordFolder[]>([
    { id: 'vdr-001', name: 'COC Documents', lastEdited: '2025-09-14T11:30:00.000Z', size: '45 MB', owner: 'John D.', entity: 'ABC Corporation Ltd', pinned: true, targetInvitationId: 'inv-001' },
    { id: 'vdr-002', name: 'Financial Creditors', lastEdited: '2025-09-13T09:05:00.000Z', size: '88 MB', owner: 'Priya S.', entity: 'XYZ Industries Ltd', targetInvitationId: 'inv-002' },
    { id: 'vdr-003', name: 'Operational Creditors', lastEdited: '2025-09-10T16:42:00.000Z', size: '22 MB', owner: 'Arun K.', entity: 'PQR Services Inc', pinned: true, targetInvitationId: 'inv-003' },
    { id: 'vdr-004', name: 'EOIs', lastEdited: '2025-09-01T08:15:00.000Z', size: '10 MB', owner: 'John D.', entity: 'ABC Corporation Ltd' },
    { id: 'vdr-005', name: 'Resolution Plans', lastEdited: '2025-08-25T13:25:00.000Z', size: '120 MB', owner: 'Neha M.', entity: 'XYZ Industries Ltd' },
  ]);
  
  const syncSettings = {
    autoSync: true,
    realTimeUpdates: true,
    syncFrequency: "2-hours",
    conflictResolution: "manual"
  };

  const mappedFields = [
    { source: "Company Name", target: "Entity.company_name" },
    { source: "CIN Number", target: "Entity.cin" },
    { source: "Registered Address", target: "Entity.registered_address" },
    { source: "ROC Registration", target: "Entity.roc_details" }
  ];

  // Active schema and record form state (component scope)
  const activeSchema = useMemo(() => {
    const byProcess = SCHEMAS[selectedProcess] || SCHEMAS.cirp;
    return byProcess[selectedSection] || byProcess['basic-info'];
  }, [selectedProcess, selectedSection]);

  const [recordData, setRecordData] = useState<Record<string, string | number>>({});

  useEffect(() => {
    const next: Record<string, string | number> = {};
    activeSchema.forEach(f => { next[f.key] = ""; });
    setRecordData(next);
  }, [activeSchema]);

  // helper used by Reset button
  const resetFormForSchema = () => {
    const next: Record<string, string | number> = {};
    activeSchema.forEach(f => { next[f.key] = ""; });
    setRecordData(next);
  };

  // Derived data for Record List View
  const owners = useMemo(() => Array.from(new Set(folders.map(f => f.owner))), [folders]);
  const entitiesList = useMemo(() => Array.from(new Set(folders.map(f => f.entity))), [folders]);
  
  const filteredFolders = useMemo(() => {
    const byTab = activeTab === 'recent' ? folders.filter(f => f.pinned) : folders;
    const bySearch = byTab.filter(f =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.entity.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const byEntity = filterEntity === 'all' ? bySearch : bySearch.filter(f => f.entity === filterEntity);
    const byOwner = filterOwner === 'all' ? byEntity : byEntity.filter(f => f.owner === filterOwner);
    const sorted = [...byOwner].sort((a, b) => {
      const da = new Date(a.lastEdited).getTime();
      const db = new Date(b.lastEdited).getTime();
      return sortOrder === 'latest' ? db - da : da - db;
    });
    return sorted;
  }, [activeTab, folders, searchTerm, filterEntity, filterOwner, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredFolders.length / pageSize));
  const pageStart = (currentPage - 1) * pageSize;
  const pageItems = filteredFolders.slice(pageStart, pageStart + pageSize);

  const togglePin = (id: string) => {
    setFolders(prev => prev.map(f => f.id === id ? { ...f, pinned: !f.pinned } : f));
    const folder = folders.find(f => f.id === id);
    if (folder) logAudit(folder.pinned ? 'UNPIN_FOLDER' : 'PIN_FOLDER', folder.name, folder.entity);
  };

  const handleOpenFolder = (f: RecordFolder) => {
    logAudit('OPEN_FOLDER', f.name, f.entity);
    if (f.targetInvitationId) {
      navigate(`/claims/invitation/${f.targetInvitationId}`);
    }
  };

  const syncHistory = [
    { time: "Today 2:15 PM", action: "4 records updated" },
    { time: "Today 12:30 PM", action: "1 record added" },
    { time: "Yesterday 6:45 PM", action: "2 records modified" }
  ];

  const conflicts = [
    {
      id: 1,
      title: "Board Member Data Mismatch",
      source1: "Meetings Module: John Doe - Executive Director",
      source2: "Data Records: John Doe - Managing Director",
      type: "role_mismatch"
    },
    {
      id: 2,
      title: "Creditor Amount Discrepancy",
      source1: "Claims Module: SBI - ₹25,50,00,000",
      source2: "Data Records: SBI - ₹25,00,00,000",
      type: "amount_mismatch"
    }
  ];

  const errorLogs = [
    {
      id: 1,
      module: "Litigation Module",
      error: "API endpoint not responding - Connection timeout",
      time: "3 days ago",
      severity: "error"
    },
    {
      id: 2,
      module: "E-Voting Module",
      error: "5 member records could not be matched",
      time: "3 days ago",
      severity: "warning"
    }
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Data Records Room & Management</h1>
            <p className="text-muted-foreground">
              Central repository for cross-module data synchronization and AI-powered data mapping
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="h-9" onClick={() => navigate('/data-room/analytics')}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
            <Button size="sm" className="h-9" onClick={() => navigate('/data-room/create-data-record')}>
              <Plus className="mr-2 h-4 w-4" />
              Create Record
            </Button>
          </div>
        </div>

        {/* Entity, Process, Module Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Module & Section Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Entity:</label>
                <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {entities.map((e) => (
                      <SelectItem key={e} value={e}>{e}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Module:</label>
                <Select value={selectedModule} onValueChange={setSelectedModule}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entity">Entity Module</SelectItem>
                    <SelectItem value="meetings">Meetings Module</SelectItem>
                    <SelectItem value="claims">Claims Module</SelectItem>
                    <SelectItem value="litigation">Litigation Module</SelectItem>
                    <SelectItem value="evoting">E-Voting Module</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Section:</label>
                <Select value={selectedSection} onValueChange={setSelectedSection}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic-info">Basic Information</SelectItem>
                    <SelectItem value="financial">Financial Data</SelectItem>
                    <SelectItem value="legal">Legal Information</SelectItem>
                    <SelectItem value="operational">Operational Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Process:</label>
                <Select value={selectedProcess} onValueChange={setSelectedProcess}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {processes.map(p => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium mb-1 block">System Suggestion (Auto-Structure)</label>
                <div className="p-3 rounded border bg-muted/30 text-sm">
                  Suggested folders for <span className="font-medium uppercase">{processes.find(p => p.value===selectedProcess)?.label}</span>:
                  <div className="mt-2 flex flex-wrap gap-2">
                    {suggestedHierarchy[selectedProcess]?.map((s) => (
                      <Badge key={s} variant="secondary">{s}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Record List View */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Record List</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Tabs */}
            <div className="flex items-center gap-4">
              <Button variant={activeTab === 'recent' ? 'default' : 'outline'} size="sm" onClick={() => { setActiveTab('recent'); setCurrentPage(1); }}>
                Recent
              </Button>
              <Button variant={activeTab === 'all' ? 'default' : 'outline'} size="sm" onClick={() => { setActiveTab('all'); setCurrentPage(1); }}>
                All
              </Button>
            </div>

            {/* Search, Filters, Sort, Counts on list */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Input placeholder="Search folders..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
              <Select value={filterEntity} onValueChange={(v) => { setFilterEntity(v); setCurrentPage(1); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  {entitiesList.map(e => (
                    <SelectItem key={e} value={e}>{e}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterOwner} onValueChange={(v) => { setFilterOwner(v); setCurrentPage(1); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Owner/User" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Owners</SelectItem>
                  {owners.map(o => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Select value={sortOrder} onValueChange={(v: 'latest'|'oldest') => setSortOrder(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Latest listed at top</SelectItem>
                    <SelectItem value="oldest">Oldest listed at top</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(parseInt(v, 10)); setCurrentPage(1); }}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Count on List" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                    <SelectItem value="100">100 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 px-2">Folder Name</th>
                    <th className="py-2 px-2">Last Edited</th>
                    <th className="py-2 px-2">Size</th>
                    <th className="py-2 px-2">Owner</th>
                    <th className="py-2 px-2">Entity</th>
                    <th className="py-2 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((f) => (
                    <tr key={f.id} className="border-b hover:bg-muted/40">
                      <td className="py-2 px-2">
                        <button className="text-blue-600 hover:underline" onClick={() => handleOpenFolder(f)}>
                          {f.name}
                        </button>
                        {f.pinned && <Badge variant="secondary" className="ml-2">Pinned</Badge>}
                      </td>
                      <td className="py-2 px-2">{new Date(f.lastEdited).toLocaleString()}</td>
                      <td className="py-2 px-2">{f.size}</td>
                      <td className="py-2 px-2">{f.owner}</td>
                      <td className="py-2 px-2">{f.entity}</td>
                      <td className="py-2 px-2">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleOpenFolder(f)}>
                            <Eye className="h-3 w-3 mr-1" /> View
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => togglePin(f.id)}>
                            <CheckCircle className="h-3 w-3 mr-1" /> {f.pinned ? 'Unpin' : 'Pin'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pageItems.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-muted-foreground">No folders found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination: skip to front/back, page numbers */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-muted-foreground">
                Showing {filteredFolders.length === 0 ? 0 : pageStart + 1} to {Math.min(pageStart + pageSize, filteredFolders.length)} of {filteredFolders.length} results
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>Skip to front</Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <Button key={p} size="sm" variant={currentPage === p ? 'default' : 'outline'} onClick={() => setCurrentPage(p)}>
                      {p}
                    </Button>
                  ))}
                </div>
                <Button size="sm" variant="outline" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>Skip to back</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sync Settings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>SYNC SETTINGS:</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Auto-sync enabled</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Real-time updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Sync Frequency:</span>
                  <Select value={syncSettings.syncFrequency}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2-hours">Every 2 hours</SelectItem>
                      <SelectItem value="4-hours">Every 4 hours</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Conflict Resolution:</span>
                  <Select value={syncSettings.conflictResolution}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual Review</SelectItem>
                      <SelectItem value="auto">Auto Resolve</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">MAPPED FIELDS:</h4>
                <div className="space-y-2 text-sm">
                  {mappedFields.map((field, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span>• {field.source}</span>
                      <span className="text-muted-foreground">↔</span>
                      <span className="font-mono text-xs bg-muted px-1 rounded">{field.target}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">SYNC HISTORY:</h4>
              <div className="space-y-1 text-sm">
                {syncHistory.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span>• {entry.time} - {entry.action}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" onClick={() => logAudit('SAVE_SETTINGS', `${selectedModule}:${selectedSection}`, selectedEntity)}>
                <Download className="h-3 w-3 mr-1" />
                Save Settings
              </Button>
              <Button size="sm" variant="outline" onClick={() => logAudit('FORCE_SYNC', `${selectedModule}:${selectedSection}`, selectedEntity)}>
                <RefreshCw className="h-3 w-3 mr-1" />
                Force Sync Now
              </Button>
              <Button size="sm" variant="outline" onClick={() => logAudit('VIEW_SYNC_LOG', `${selectedModule}:${selectedSection}`, selectedEntity)}>
                <BarChart3 className="h-3 w-3 mr-1" />
                View Sync Log
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Record Data (Generated from Process & Section) */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Record Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeSchema.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  {field.type === 'textarea' ? (
                    <Textarea id={field.key} value={String(recordData[field.key] ?? '')}
                      onChange={(e) => setRecordData(prev => ({ ...prev, [field.key]: e.target.value }))}
                      rows={3}
                    />
                  ) : (
                    <Input id={field.key}
                      type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                      value={String(recordData[field.key] ?? '')}
                      onChange={(e) => setRecordData(prev => ({ ...prev, [field.key]: e.target.value }))}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => { resetFormForSchema(); toast({ title: 'Form reset', description: 'Cleared values for current schema.' }); }}>Reset</Button>
              <Button size="sm" onClick={() => { logAudit('SAVE_RECORD', `${selectedProcess}:${selectedSection}`, selectedEntity); toast({ title: 'Record saved', description: 'Data stored (demo). Visible in Analytics.' }); }}>Save</Button>
            </div>
          </CardContent>
        </Card>

        {/* Conflict Resolution Queue */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              CONFLICT RESOLUTION QUEUE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="border-orange-200 bg-orange-50 mb-4">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <span className="font-semibold flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  2 CONFLICTS REQUIRE ATTENTION
                </span>
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              {conflicts.map((conflict, index) => (
                <div key={conflict.id} className="border rounded-lg p-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">{index + 1}. {conflict.title}</h4>
                    <div className="space-y-2 text-sm pl-4">
                      <div>Meetings Module: "{conflict.source1.split(': ')[1]}"</div>
                      <div>Data Records: "{conflict.source2.split(': ')[1]}"</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Review
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Accept Source
                      </Button>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Keep Current
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Error Logs & Troubleshooting */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>ERROR LOGS & TROUBLESHOOTING</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {errorLogs.map((log) => (
              <div key={log.id} className={`border rounded-lg p-4 ${
                log.severity === 'error' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'
              }`}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {log.severity === 'error' ? (
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                    ) : (
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    )}
                    <span className="font-medium">{log.module} Sync {log.severity === 'error' ? 'Error' : 'Partial Sync'}</span>
                    <span className="text-sm text-muted-foreground">({log.time})</span>
                  </div>
                  <p className="text-sm">{log.severity === 'error' ? 'Error:' : 'Warning:'} "{log.error}"</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Retry Sync
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="h-3 w-3 mr-1" />
                      Contact Support
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-3 w-3 mr-1" />
                      {log.severity === 'error' ? 'Reconfigure' : 'Configure'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DataRecordsRoom;
