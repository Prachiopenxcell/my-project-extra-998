import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { 
  ArrowLeft,
  ArrowRight,
  Bot,
  Plus,
  FileText,
  Building,
  CheckCircle,
  Settings,
  Upload,
  Save,
  Eye,
  Zap,
  Edit,
  Trash2,
  X
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { complianceService } from "@/services/complianceService";
import {
  ComplianceRequirement as ComplianceRequirementType,
  ComplianceEntity as ComplianceEntityType,
  ComplianceGuideline,
  ComplianceReminder,
  ReminderChannel,
  CustomLawTemplate,
} from "@/types/compliance";

// Use centralized types for requirements
type ComplianceRequirement = ComplianceRequirementType;

interface CustomRequirement {
  title: string;
  authority: string;
  frequency: string;
  documentation: File | null;
  details: string;
  complianceItem: string;
  dueDate: string;
  formFormat: string;
  assignedTo: string;
  status: string;
  remarksLinks: string;
  guidelines: ComplianceGuideline[];
  reminders: ComplianceReminder[];
  saveAsTemplate?: boolean;
}

const ComplianceChecklistGeneration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const selectedEntities = (location.state?.selectedEntities || []) as ComplianceEntityType[];
  const selectedEntity: ComplianceEntityType | undefined = selectedEntities[0];

  // Templates storage
  const [templates, setTemplates] = useState<CustomLawTemplate[]>([]);
  
  // Jurisdiction-based mapping state
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('');
  const [jurisdictionLaws, setJurisdictionLaws] = useState<ComplianceRequirement[]>([]);
  const [showJurisdictionMapping, setShowJurisdictionMapping] = useState(false);
  
  // Jurisdiction-specific law mappings
  const jurisdictionMappings: Record<string, ComplianceRequirement[]> = {
    'maharashtra': [
      {
        id: "mh-1",
        title: "Shops & Establishment Act (Maharashtra)",
        authority: "Maharashtra Labour Department",
        category: "jurisdiction" as const,
        description: "Shop and establishment registration and renewals for Maharashtra",
        frequency: "Annual",
        selected: true,
        autoDetected: true
      },
      {
        id: "mh-2",
        title: "Maharashtra Professional Tax",
        authority: "Maharashtra Revenue Department",
        category: "jurisdiction" as const,
        description: "Professional tax compliance for Maharashtra entities",
        frequency: "Monthly",
        selected: true,
        autoDetected: true
      },
      {
        id: "mh-3",
        title: "Maharashtra VAT (Legacy)",
        authority: "Maharashtra Commercial Tax Department",
        category: "jurisdiction" as const,
        description: "Legacy VAT compliance for pre-GST transactions",
        frequency: "Monthly",
        selected: false,
        autoDetected: true
      }
    ],
    'delhi': [
      {
        id: "dl-1",
        title: "Delhi Shops & Establishment Act",
        authority: "Delhi Labour Department",
        category: "jurisdiction" as const,
        description: "Shop and establishment compliance for Delhi",
        frequency: "Annual",
        selected: true,
        autoDetected: true
      },
      {
        id: "dl-2",
        title: "Delhi Professional Tax",
        authority: "Delhi Revenue Department",
        category: "jurisdiction" as const,
        description: "Professional tax for Delhi-based entities",
        frequency: "Monthly",
        selected: true,
        autoDetected: true
      },
      {
        id: "dl-3",
        title: "Delhi Pollution Control Board",
        authority: "Delhi PCB",
        category: "jurisdiction" as const,
        description: "Environmental clearances for Delhi operations",
        frequency: "Annual",
        selected: false,
        autoDetected: true
      }
    ],
    'karnataka': [
      {
        id: "ka-1",
        title: "Karnataka Shops & Commercial Establishments Act",
        authority: "Karnataka Labour Department",
        category: "jurisdiction" as const,
        description: "Shop and establishment compliance for Karnataka",
        frequency: "Annual",
        selected: true,
        autoDetected: true
      },
      {
        id: "ka-2",
        title: "Karnataka Professional Tax",
        authority: "Karnataka Revenue Department",
        category: "jurisdiction" as const,
        description: "Professional tax compliance for Karnataka",
        frequency: "Monthly",
        selected: true,
        autoDetected: true
      },
      {
        id: "ka-3",
        title: "Karnataka IT Policy Benefits",
        authority: "Karnataka IT Department",
        category: "jurisdiction" as const,
        description: "IT policy compliance and benefits for Karnataka",
        frequency: "Annual",
        selected: false,
        autoDetected: true
      }
    ],
    'gujarat': [
      {
        id: "gj-1",
        title: "Gujarat Shops & Establishment Act",
        authority: "Gujarat Labour Department",
        category: "jurisdiction" as const,
        description: "Shop and establishment compliance for Gujarat",
        frequency: "Annual",
        selected: true,
        autoDetected: true
      },
      {
        id: "gj-2",
        title: "Gujarat Professional Tax",
        authority: "Gujarat Revenue Department",
        category: "jurisdiction" as const,
        description: "Professional tax for Gujarat entities",
        frequency: "Monthly",
        selected: true,
        autoDetected: true
      }
    ],
    'tamilnadu': [
      {
        id: "tn-1",
        title: "Tamil Nadu Shops & Commercial Establishments Act",
        authority: "Tamil Nadu Labour Department",
        category: "jurisdiction" as const,
        description: "Shop and establishment compliance for Tamil Nadu",
        frequency: "Annual",
        selected: true,
        autoDetected: true
      },
      {
        id: "tn-2",
        title: "Tamil Nadu Professional Tax",
        authority: "Tamil Nadu Revenue Department",
        category: "jurisdiction" as const,
        description: "Professional tax compliance for Tamil Nadu",
        frequency: "Monthly",
        selected: true,
        autoDetected: true
      }
    ]
  };

  const [requirements, setRequirements] = useState<ComplianceRequirement[]>([]);

  const [customRequirement, setCustomRequirement] = useState<CustomRequirement>({
    title: '',
    authority: '',
    frequency: '',
    documentation: null,
    details: '',
    complianceItem: '',
    dueDate: '',
    formFormat: '',
    assignedTo: '',
    status: 'pending',
    remarksLinks: '',
    guidelines: [],
    reminders: [],
    saveAsTemplate: true,
  });

  // Load initial requirements via service
  useEffect(() => {
    const mapped = complianceService.autoMapRequirements({ entity: selectedEntity || {
      id: 'unknown', name: 'Unknown', type: 'Entity', location: 'Mumbai', sector: 'IT'
    }});
    setRequirements(mapped);
    setTemplates(complianceService.getCustomLawTemplates());
    // Auto-apply jurisdiction when entity present
    if (selectedEntity?.location) {
      autoDetectJurisdictionFromEntity();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [showCustomForm, setShowCustomForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requirementToDelete, setRequirementToDelete] = useState<string | null>(null);
  const [editingRequirement, setEditingRequirement] = useState<string | null>(null);

  // Jurisdiction-based auto-mapping functions
  const handleJurisdictionChange = (jurisdiction: string) => {
    setSelectedJurisdiction(jurisdiction);
    const jurisdictionSpecificLaws = jurisdictionMappings[jurisdiction as keyof typeof jurisdictionMappings] || [];
    setJurisdictionLaws(jurisdictionSpecificLaws);
    
    // Auto-merge jurisdiction laws with existing requirements
    setRequirements(prev => {
      // Remove any existing jurisdiction laws
      const withoutJurisdiction = prev.filter(req => req.category !== 'jurisdiction');
      // Add new jurisdiction laws
      return [...withoutJurisdiction, ...jurisdictionSpecificLaws];
    });
    
    toast({
      title: "Jurisdiction Laws Applied",
      description: `${jurisdictionSpecificLaws.length} jurisdiction-specific laws added for ${jurisdiction.charAt(0).toUpperCase() + jurisdiction.slice(1)}.`,
    });
  };

  const autoDetectJurisdictionFromEntity = () => {
    if (selectedEntities.length > 0) {
      // Mock logic - in real implementation, this would read from entity data
      const entityLocation = selectedEntities[0]?.location?.toLowerCase();
      if (entityLocation) {
        const jurisdictionMap = {
          'mumbai': 'maharashtra',
          'pune': 'maharashtra',
          'delhi': 'delhi',
          'bangalore': 'karnataka',
          'ahmedabad': 'gujarat',
          'chennai': 'tamilnadu'
        };
        
        const detectedJurisdiction = jurisdictionMap[entityLocation as keyof typeof jurisdictionMap];
        if (detectedJurisdiction) {
          handleJurisdictionChange(detectedJurisdiction);
          return detectedJurisdiction;
        }
      }
    }
    return null;
  };

  const handleRequirementToggle = (id: string) => {
    setRequirements(prev => 
      prev.map(req => 
        req.id === id ? { ...req, selected: !req.selected } : req
      )
    );
    
    // Also update jurisdiction laws if applicable
    setJurisdictionLaws(prev => 
      prev.map(req => 
        req.id === id ? { ...req, selected: !req.selected } : req
      )
    );
  };

  // CRUD Functions
  const handleEditRequirement = (requirementId: string) => {
    setEditingRequirement(requirementId);
    toast({
      title: "Edit Mode",
      description: "Requirement edit functionality would open here.",
    });
  };

  const handleDeleteRequirement = (requirementId: string) => {
    setRequirementToDelete(requirementId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteRequirement = () => {
    if (requirementToDelete) {
      setRequirements(requirements.filter(req => req.id !== requirementToDelete));
      toast({
        title: "Requirement Deleted",
        description: "The compliance requirement has been successfully removed.",
      });
      setDeleteDialogOpen(false);
      setRequirementToDelete(null);
    }
  };

  const handleSelectAll = () => {
    setRequirements(prev => prev.map(req => ({ ...req, selected: true })));
  };

  const handleDeselectAll = () => {
    setRequirements(prev => prev.map(req => ({ ...req, selected: false })));
  };

  const handleAddCustomRequirement = () => {
    if (customRequirement.title && customRequirement.authority) {
      const newRequirement: ComplianceRequirement = {
        id: `custom-${Date.now()}`,
        title: customRequirement.title,
        authority: customRequirement.authority,
        category: 'core',
        description: `Custom requirement: ${customRequirement.title}`,
        frequency: customRequirement.frequency,
        selected: true,
        autoDetected: false,
        guidelines: customRequirement.guidelines,
        reminders: customRequirement.reminders,
      };
      
      setRequirements(prev => [...prev, newRequirement]);

      // Optionally persist as reusable template
      if (customRequirement.saveAsTemplate) {
        const tpl = complianceService.saveCustomLawTemplate({
          title: customRequirement.title,
          authority: customRequirement.authority,
          frequency: customRequirement.frequency,
          description: customRequirement.details,
          documents: [],
          guidelines: customRequirement.guidelines,
          reminders: customRequirement.reminders,
        });
        setTemplates(prev => [...prev, tpl]);
        toast({ title: 'Custom Law Saved', description: 'Saved as reusable template for future entities.' });
      }

      setCustomRequirement({
        title: "",
        authority: "",
        frequency: "monthly",
        documentation: null,
        details: '',
        complianceItem: '',
        dueDate: '',
        formFormat: '',
        assignedTo: '',
        status: 'pending',
        remarksLinks: '',
        guidelines: [],
        reminders: [],
        saveAsTemplate: true,
      });
      setShowCustomForm(false);
    }
  };

  const handleContinue = () => {
    const selectedRequirements = requirements.filter(req => req.selected);
    navigate('/compliance/assignment', {
      state: {
        selectedEntities,
        selectedRequirements
      }
    });
  };

  const selectedCount = requirements.filter(req => req.selected).length;
  const coreRequirements = requirements.filter(req => req.category === 'core');
  const sectoralRequirements = requirements.filter(req => req.category === 'sectoral');
  const sizeBasedRequirements = requirements.filter(req => req.category === 'size-based');
  const jurisdictionRequirements = requirements.filter(req => req.category === 'jurisdiction');

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Compliance</h1>
            <p className="text-muted-foreground">ABC Corp → Checklist Generation</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <Card className="mb-6 bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <FileText className="w-6 h-6 text-slate-600 mr-3" />
              <div>
                <h3 className="font-semibold text-slate-900">COMPLIANCE CHECKLIST FOR: ABC CORPORATION LTD</h3>
                <p className="text-slate-700 text-sm mt-1">Step 2 of 3: Generate & Customize Compliance Requirements</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jurisdiction Mapping Section */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-700">
              <Settings className="w-5 h-5 mr-2" />
              JURISDICTION-BASED AUTO-MAPPING
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-blue-900 mb-2 block">
                    Select Jurisdiction for Entity Location
                  </label>
                  <Select value={selectedJurisdiction} onValueChange={handleJurisdictionChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose jurisdiction..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                      <SelectItem value="gujarat">Gujarat</SelectItem>
                      <SelectItem value="tamilnadu">Tamil Nadu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={autoDetectJurisdictionFromEntity}
                  variant="outline"
                  className="mt-6"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Auto-Detect
                </Button>
              </div>
              
              {selectedJurisdiction && (
                <div className="bg-blue-100 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>{jurisdictionLaws.length}</strong> jurisdiction-specific laws applied for{' '}
                    <strong>{selectedJurisdiction.charAt(0).toUpperCase() + selectedJurisdiction.slice(1)}</strong>
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Auto-Generated Section */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <Bot className="w-5 h-5 mr-2" />
                AUTO-GENERATED
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-semibold">24 laws detected</span>
                </div>
                
                <div className="text-sm space-y-2">
                  <p><strong>Based on:</strong></p>
                  <ul className="space-y-1 ml-4">
                    <li>• Entity type</li>
                    <li>• Location (Mumbai)</li>
                    <li>• Sector (IT)</li>
                    <li>• Size (50-100 emp)</li>
                    <li>• Turnover (₹10Cr)</li>
                  </ul>
                </div>

                <div className="flex flex-col space-y-2">
                  <Button variant="outline" size="sm" className="h-9">
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="h-9">
                    <Settings className="mr-2 h-4 w-4" />
                    Customize
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Custom Additions Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-700">
                <Plus className="w-5 h-5 mr-2" />
                CUSTOM ADDITIONS
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Saved templates list */}
              {templates.length > 0 && !showCustomForm && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold mb-2">Saved Custom Laws</h4>
                  <div className="space-y-2">
                    {templates.map((tpl) => (
                      <div key={tpl.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{tpl.title}</p>
                          <p className="text-xs text-gray-600">{tpl.authority} • {tpl.frequency}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newRequirement: ComplianceRequirement = {
                                id: `custom-${Date.now()}`,
                                title: tpl.title,
                                authority: tpl.authority,
                                category: 'core',
                                description: tpl.description || `Custom requirement: ${tpl.title}`,
                                frequency: tpl.frequency,
                                selected: true,
                                autoDetected: false,
                                guidelines: tpl.guidelines,
                                reminders: tpl.reminders,
                              };
                              setRequirements(prev => [...prev, newRequirement]);
                              toast({ title: 'Added from Template', description: 'Custom law was added to the checklist.' });
                            }}
                          >
                            Add to Checklist
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!showCustomForm ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Add specialized requirements</p>
                  <Button onClick={() => setShowCustomForm(true)} className="bg-slate-600 hover:bg-slate-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Custom Requirement
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Law/Regulation Title
                    </label>
                    <Input
                      value={customRequirement.title}
                      onChange={(e) => setCustomRequirement(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter law or regulation title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Authority/Department
                    </label>
                    <Input
                      value={customRequirement.authority}
                      onChange={(e) => setCustomRequirement(prev => ({ ...prev, authority: e.target.value }))}
                      placeholder="Enter authority or department"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequency
                    </label>
                    <Select value={customRequirement.frequency} onValueChange={(value) => 
                      setCustomRequirement(prev => ({ ...prev, frequency: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annual">Annual</SelectItem>
                        <SelectItem value="biannual">Bi-Annual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Details
                    </label>
                    <Textarea
                      value={customRequirement.details}
                      onChange={(e) => setCustomRequirement(prev => ({ ...prev, details: e.target.value }))}
                      placeholder="Enter detailed description of the compliance requirement"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Compliance Item
                    </label>
                    <Input
                      value={customRequirement.complianceItem}
                      onChange={(e) => setCustomRequirement(prev => ({ ...prev, complianceItem: e.target.value }))}
                      placeholder="Enter specific compliance item or requirement"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date
                    </label>
                    <Input
                      type="date"
                      value={customRequirement.dueDate}
                      onChange={(e) => setCustomRequirement(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Form/Format
                    </label>
                    <Input
                      value={customRequirement.formFormat}
                      onChange={(e) => setCustomRequirement(prev => ({ ...prev, formFormat: e.target.value }))}
                      placeholder="Enter required form number or format (e.g., Form 16, GSTR-1)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assigned To
                    </label>
                    <Input
                      value={customRequirement.assignedTo}
                      onChange={(e) => setCustomRequirement(prev => ({ ...prev, assignedTo: e.target.value }))}
                      placeholder="Enter person or department responsible"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <Select value={customRequirement.status} onValueChange={(value) => 
                      setCustomRequirement(prev => ({ ...prev, status: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                        <SelectItem value="not-applicable">Not Applicable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Remarks/Links
                    </label>
                    <Textarea
                      value={customRequirement.remarksLinks}
                      onChange={(e) => setCustomRequirement(prev => ({ ...prev, remarksLinks: e.target.value }))}
                      placeholder="Enter additional remarks, notes, or relevant links"
                      rows={2}
                    />
                  </div>

                  {/* Guidelines builder */}
                  <div className="border rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">Guidelines</label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCustomRequirement(prev => ({
                          ...prev,
                          guidelines: [
                            ...prev.guidelines,
                            { id: `gl-${Date.now()}`, title: 'New Guideline', createdAt: new Date().toISOString() } as ComplianceGuideline,
                          ],
                        }))}
                      >
                        Add Guideline
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {customRequirement.guidelines.map((g, idx) => (
                        <div key={g.id} className="flex items-center gap-2">
                          <Input
                            value={g.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCustomRequirement(prev => ({
                                ...prev,
                                guidelines: prev.guidelines.map((x, i) => i === idx ? { ...x, title: val } : x),
                              }));
                            }}
                            placeholder="Guideline title"
                          />
                          <Button
                            variant="ghost"
                            onClick={() => setCustomRequirement(prev => ({
                              ...prev,
                              guidelines: prev.guidelines.filter((_, i) => i !== idx),
                            }))}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reminders builder */}
                  <div className="border rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">Alerts & Reminders</label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCustomRequirement(prev => ({
                          ...prev,
                          reminders: [
                            ...prev.reminders,
                            { id: `rm-${Date.now()}`, title: 'Reminder', daysBeforeDue: 7, frequency: 'once', channels: ['in-app'], active: true },
                          ],
                        }))}
                      >
                        Add Reminder
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {customRequirement.reminders.map((r, idx) => (
                        <div key={r.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
                          <Input
                            value={r.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCustomRequirement(prev => ({
                                ...prev,
                                reminders: prev.reminders.map((x, i) => i === idx ? { ...x, title: val } : x),
                              }));
                            }}
                            placeholder="Reminder title"
                          />
                          <Input
                            type="number"
                            value={r.daysBeforeDue}
                            onChange={(e) => {
                              const val = Number(e.target.value || 0);
                              setCustomRequirement(prev => ({
                                ...prev,
                                reminders: prev.reminders.map((x, i) => i === idx ? { ...x, daysBeforeDue: val } : x),
                              }));
                            }}
                            placeholder="Days before due"
                          />
                          <Select
                            value={r.frequency}
                            onValueChange={(v) => setCustomRequirement(prev => ({
                              ...prev,
                              reminders: prev.reminders.map((x, i) => i === idx ? { ...x, frequency: v as ComplianceReminder['frequency'] } : x),
                            }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="once">Once</SelectItem>
                              <SelectItem value="repeat-weekly">Repeat Weekly</SelectItem>
                              <SelectItem value="repeat-daily">Repeat Daily</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select
                            value={(r.channels[0] || 'in-app') as ReminderChannel}
                            onValueChange={(v) => setCustomRequirement(prev => ({
                              ...prev,
                              reminders: prev.reminders.map((x, i) => i === idx ? { ...x, channels: [v as ReminderChannel] } : x),
                            }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Channel" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="in-app">In-App</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="sms">SMS</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="flex items-center justify-end">
                            <Button
                              variant="ghost"
                              onClick={() => setCustomRequirement(prev => ({
                                ...prev,
                                reminders: prev.reminders.filter((_, i) => i !== idx),
                              }))}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={!!customRequirement.saveAsTemplate}
                      onCheckedChange={(v) => setCustomRequirement(prev => ({ ...prev, saveAsTemplate: v === true }))}
                    />
                    <span className="text-sm text-gray-700">Save as reusable template</span>
                  </div>

                  <div>
                    <Button variant="outline" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Documentation
                    </Button>
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleAddCustomRequirement} size="sm" className="flex-1 h-9">
                      <Save className="mr-2 h-4 w-4" />
                      Save Custom Law
                    </Button>
                    <Button variant="outline" size="sm" className="h-9" onClick={() => setShowCustomForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detected Requirements */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                DETECTED COMPLIANCE REQUIREMENTS
              </CardTitle>
              <div className="text-sm text-gray-600">
                {selectedCount} of {requirements.length} selected
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Core Legal Requirements */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Core Legal Requirements (Auto-detected):</h3>
              <div className="space-y-3">
                {coreRequirements.map((req) => (
                  <div key={req.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Checkbox
                      checked={req.selected}
                      onCheckedChange={() => handleRequirementToggle(req.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{req.title}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Authority: {req.authority} | Frequency: {req.frequency}
                          </p>
                        </div>
                        {req.autoDetected && (
                          <Badge variant="secondary" className="ml-2">
                            Auto-detected
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sectoral Requirements */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Sectoral Requirements (IT Sector):</h3>
              <div className="space-y-3">
                {sectoralRequirements.map((req) => (
                  <div key={req.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Checkbox
                      checked={req.selected}
                      onCheckedChange={() => handleRequirementToggle(req.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{req.title}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Authority: {req.authority} | Frequency: {req.frequency}
                          </p>
                        </div>
                        {req.autoDetected && (
                          <Badge variant="secondary" className="ml-2">
                            Auto-detected
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Size-based Requirements */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Size-based Requirements (50-100 employees):</h3>
              <div className="space-y-3">
                {sizeBasedRequirements.map((req) => (
                  <div key={req.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <Checkbox
                      checked={req.selected}
                      onCheckedChange={() => handleRequirementToggle(req.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{req.title}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Authority: {req.authority} | Frequency: {req.frequency}
                          </p>
                        </div>
                        {req.autoDetected && (
                          <Badge variant="secondary" className="ml-2">
                            Auto-detected
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleSelectAll}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Select All
                </Button>
                <Button variant="outline" onClick={handleDeselectAll}>
                  Deselect All
                </Button>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Customize Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" size="sm" className="h-9" onClick={() => navigate('/compliance/setup')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Entity Selection
          </Button>
          
          <Button 
            onClick={handleContinue}
            disabled={selectedCount === 0}
            size="sm"
            className="h-9"
          >
            Continue to Assignment
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ComplianceChecklistGeneration;
