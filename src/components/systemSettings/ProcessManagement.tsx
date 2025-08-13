import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { 
  Workflow, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Copy,
  Play,
  Pause,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  MoreHorizontal
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { systemSettingsService } from "@/services/systemSettingsService";
import { ProcessTemplate, ProcessCategory, ProcessStep, TeamMemberRole, SystemSettingsFilters } from "@/types/systemSettings";
import { format } from "date-fns";

const ProcessManagement = () => {
  const [templates, setTemplates] = useState<ProcessTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SystemSettingsFilters>({});
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ProcessTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    category: ProcessCategory.WORKFLOW,
    description: '',
    steps: [] as ProcessStep[]
  });

  useEffect(() => {
    loadTemplates();
  }, [filters]);

  const loadTemplates = async () => {
    try {
      const response = await systemSettingsService.getProcessTemplates(filters);
      setTemplates(response.data);
    } catch (error) {
      console.error('Failed to load process templates:', error);
      toast({
        title: "Error",
        description: "Failed to load process templates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    try {
      // Mock implementation - in real app, this would call the API
      const template: ProcessTemplate = {
        id: Date.now().toString(),
        ...newTemplate,
        isActive: true,
        createdBy: 'Current User',
        createdAt: new Date(),
        lastModified: new Date(),
        usageCount: 0
      };
      
      setTemplates(prev => [...prev, template]);
      setShowCreateDialog(false);
      setNewTemplate({ name: '', category: ProcessCategory.WORKFLOW, description: '', steps: [] });
      toast({
        title: "Success",
        description: "Process template created successfully",
      });
    } catch (error) {
      console.error('Failed to create template:', error);
      toast({
        title: "Error",
        description: "Failed to create process template",
        variant: "destructive"
      });
    }
  };

  const handleEditTemplate = async (template: ProcessTemplate) => {
    try {
      // Mock implementation
      setTemplates(prev => prev.map(t => t.id === template.id ? { ...template, lastModified: new Date() } : t));
      setShowEditDialog(false);
      setSelectedTemplate(null);
      toast({
        title: "Success",
        description: "Process template updated successfully",
      });
    } catch (error) {
      console.error('Failed to update template:', error);
      toast({
        title: "Error",
        description: "Failed to update process template",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this process template?')) return;

    try {
      setTemplates(prev => prev.filter(t => t.id !== templateId));
      toast({
        title: "Success",
        description: "Process template deleted successfully",
      });
    } catch (error) {
      console.error('Failed to delete template:', error);
      toast({
        title: "Error",
        description: "Failed to delete process template",
        variant: "destructive"
      });
    }
  };

  const handleDuplicateTemplate = async (template: ProcessTemplate) => {
    try {
      const duplicatedTemplate: ProcessTemplate = {
        ...template,
        id: Date.now().toString(),
        name: `${template.name} (Copy)`,
        createdAt: new Date(),
        lastModified: new Date(),
        usageCount: 0
      };
      
      setTemplates(prev => [...prev, duplicatedTemplate]);
      toast({
        title: "Success",
        description: "Process template duplicated successfully",
      });
    } catch (error) {
      console.error('Failed to duplicate template:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate process template",
        variant: "destructive"
      });
    }
  };

  const toggleTemplateStatus = async (templateId: string) => {
    try {
      setTemplates(prev => prev.map(t => 
        t.id === templateId ? { ...t, isActive: !t.isActive, lastModified: new Date() } : t
      ));
      toast({
        title: "Success",
        description: "Template status updated successfully",
      });
    } catch (error) {
      console.error('Failed to update template status:', error);
      toast({
        title: "Error",
        description: "Failed to update template status",
        variant: "destructive"
      });
    }
  };

  const addStep = (templateSteps: ProcessStep[], setSteps: (steps: ProcessStep[]) => void) => {
    const newStep: ProcessStep = {
      id: Date.now().toString(),
      title: '',
      description: '',
      order: templateSteps.length + 1,
      assignedRole: undefined,
      estimatedDuration: undefined,
      dependencies: []
    };
    setSteps([...templateSteps, newStep]);
  };

  const removeStep = (stepId: string, templateSteps: ProcessStep[], setSteps: (steps: ProcessStep[]) => void) => {
    setSteps(templateSteps.filter(step => step.id !== stepId));
  };

  const updateStep = (stepId: string, updates: Partial<ProcessStep>, templateSteps: ProcessStep[], setSteps: (steps: ProcessStep[]) => void) => {
    setSteps(templateSteps.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    ));
  };

  const getCategoryBadge = (category: ProcessCategory) => {
    const colors = {
      [ProcessCategory.ONBOARDING]: 'bg-blue-100 text-blue-800',
      [ProcessCategory.COMPLIANCE]: 'bg-red-100 text-red-800',
      [ProcessCategory.WORKFLOW]: 'bg-green-100 text-green-800',
      [ProcessCategory.APPROVAL]: 'bg-yellow-100 text-yellow-800',
      [ProcessCategory.DOCUMENTATION]: 'bg-purple-100 text-purple-800',
      [ProcessCategory.COMMUNICATION]: 'bg-orange-100 text-orange-800'
    };
    
    return <Badge className={colors[category]}>{category.charAt(0).toUpperCase() + category.slice(1)}</Badge>;
  };

  const activeTemplates = templates.filter(t => t.isActive).length;
  const totalTemplates = templates.length;

  const StepEditor = ({ steps, setSteps }: { steps: ProcessStep[], setSteps: (steps: ProcessStep[]) => void }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Process Steps</Label>
        <Button type="button" variant="outline" size="sm" onClick={() => addStep(steps, setSteps)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Step
        </Button>
      </div>
      
      {steps.map((step, index) => (
        <Card key={step.id} className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Step {index + 1}</Label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => removeStep(step.id, steps, setSteps)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor={`step-title-${step.id}`}>Title</Label>
                <Input
                  id={`step-title-${step.id}`}
                  value={step.title}
                  onChange={(e) => updateStep(step.id, { title: e.target.value }, steps, setSteps)}
                  placeholder="Step title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`step-role-${step.id}`}>Assigned Role</Label>
                <Select 
                  value={step.assignedRole || 'unassigned'} 
                  onValueChange={(value) => updateStep(step.id, { assignedRole: value === 'unassigned' ? undefined : value as TeamMemberRole }, steps, setSteps)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">No assignment</SelectItem>
                    <SelectItem value={TeamMemberRole.ADMIN}>Admin</SelectItem>
                    <SelectItem value={TeamMemberRole.TEAM_LEAD}>Team Lead</SelectItem>
                    <SelectItem value={TeamMemberRole.TEAM_MEMBER}>Team Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`step-description-${step.id}`}>Description</Label>
              <Textarea
                id={`step-description-${step.id}`}
                value={step.description}
                onChange={(e) => updateStep(step.id, { description: e.target.value }, steps, setSteps)}
                placeholder="Step description"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`step-duration-${step.id}`}>Estimated Duration (minutes)</Label>
              <Input
                id={`step-duration-${step.id}`}
                type="number"
                value={step.estimatedDuration || ''}
                onChange={(e) => updateStep(step.id, { estimatedDuration: parseInt(e.target.value) || undefined }, steps, setSteps)}
                placeholder="Duration in minutes"
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Templates</p>
              <p className="text-2xl font-bold">{activeTemplates}/{totalTemplates}</p>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Process Template</DialogTitle>
                  <DialogDescription>
                    Create a new process template that can be reused across your organization.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="templateName">Template Name</Label>
                      <Input
                        id="templateName"
                        value={newTemplate.name}
                        onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter template name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="templateCategory">Category</Label>
                      <Select 
                        value={newTemplate.category} 
                        onValueChange={(value) => setNewTemplate(prev => ({ ...prev, category: value as ProcessCategory }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ProcessCategory.ONBOARDING}>Onboarding</SelectItem>
                          <SelectItem value={ProcessCategory.COMPLIANCE}>Compliance</SelectItem>
                          <SelectItem value={ProcessCategory.WORKFLOW}>Workflow</SelectItem>
                          <SelectItem value={ProcessCategory.APPROVAL}>Approval</SelectItem>
                          <SelectItem value={ProcessCategory.DOCUMENTATION}>Documentation</SelectItem>
                          <SelectItem value={ProcessCategory.COMMUNICATION}>Communication</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="templateDescription">Description</Label>
                    <Textarea
                      id="templateDescription"
                      value={newTemplate.description}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the purpose and scope of this template"
                      rows={3}
                    />
                  </div>

                  <Separator />

                  <StepEditor 
                    steps={newTemplate.steps} 
                    setSteps={(steps) => setNewTemplate(prev => ({ ...prev, steps }))} 
                  />

                  <div className="flex gap-2">
                    <Button onClick={handleCreateTemplate} disabled={!newTemplate.name || !newTemplate.description}>
                      Create Template
                    </Button>
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={filters.searchTerm || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            <Select 
              value={filters.category || 'all'} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, category: value === 'all' ? undefined : value as ProcessCategory }))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value={ProcessCategory.ONBOARDING}>Onboarding</SelectItem>
                <SelectItem value={ProcessCategory.COMPLIANCE}>Compliance</SelectItem>
                <SelectItem value={ProcessCategory.WORKFLOW}>Workflow</SelectItem>
                <SelectItem value={ProcessCategory.APPROVAL}>Approval</SelectItem>
                <SelectItem value={ProcessCategory.DOCUMENTATION}>Documentation</SelectItem>
                <SelectItem value={ProcessCategory.COMMUNICATION}>Communication</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid gap-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className={`${!template.isActive ? 'opacity-60' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      {getCategoryBadge(template.category)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleTemplateStatus(template.id)}
                        title={template.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {template.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDuplicateTemplate(template)}
                        title="Duplicate"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedTemplate(template);
                          setShowEditDialog(true);
                        }}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTemplate(template.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Workflow className="h-4 w-4 text-muted-foreground" />
                      <span>{template.steps.length} steps</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{template.usageCount} uses</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Created by {template.createdBy}</span>
                    <span>{format(template.lastModified, 'MMM dd, yyyy')}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {template.isActive ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Inactive
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Template Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Process Template</DialogTitle>
            <DialogDescription>
              Update the process template details and steps.
            </DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editTemplateName">Template Name</Label>
                  <Input
                    id="editTemplateName"
                    value={selectedTemplate.name}
                    onChange={(e) => setSelectedTemplate(prev => prev ? { ...prev, name: e.target.value } : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editTemplateCategory">Category</Label>
                  <Select 
                    value={selectedTemplate.category} 
                    onValueChange={(value) => setSelectedTemplate(prev => prev ? { ...prev, category: value as ProcessCategory } : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ProcessCategory.ONBOARDING}>Onboarding</SelectItem>
                      <SelectItem value={ProcessCategory.COMPLIANCE}>Compliance</SelectItem>
                      <SelectItem value={ProcessCategory.WORKFLOW}>Workflow</SelectItem>
                      <SelectItem value={ProcessCategory.APPROVAL}>Approval</SelectItem>
                      <SelectItem value={ProcessCategory.DOCUMENTATION}>Documentation</SelectItem>
                      <SelectItem value={ProcessCategory.COMMUNICATION}>Communication</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editTemplateDescription">Description</Label>
                <Textarea
                  id="editTemplateDescription"
                  value={selectedTemplate.description}
                  onChange={(e) => setSelectedTemplate(prev => prev ? { ...prev, description: e.target.value } : null)}
                  rows={3}
                />
              </div>

              <Separator />

              <StepEditor 
                steps={selectedTemplate.steps} 
                setSteps={(steps) => setSelectedTemplate(prev => prev ? { ...prev, steps } : null)} 
              />

              <div className="flex gap-2">
                <Button onClick={() => handleEditTemplate(selectedTemplate)}>
                  Update Template
                </Button>
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { ProcessManagement };
