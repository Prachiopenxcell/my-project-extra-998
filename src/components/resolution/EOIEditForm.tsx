import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/components/ui/use-toast';
import { 
  CalendarIcon, 
  Plus, 
  Trash2, 
  Save,
  FileText,
  Users,
  Settings
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface EOI {
  id: string;
  title: string;
  status: 'draft' | 'published' | 'closed' | 'evaluation';
  publishDate: string;
  closingDate: string;
  totalApplications: number;
  cocMembers: number;
  completionPercentage: number;
  description: string;
  requirements: string[];
  documents: Array<{
    name: string;
    required: boolean;
    uploaded: boolean;
  }>;
  timeline: Array<{
    date: string;
    event: string;
    completed: boolean;
  }>;
}

interface EOIEditFormProps {
  eoi: EOI | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (eoi: EOI) => void;
}

const EOIEditForm: React.FC<EOIEditFormProps> = ({ eoi, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<EOI | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [newRequirement, setNewRequirement] = useState('');
  const [newDocument, setNewDocument] = useState({ name: '', required: false });
  const [newTimelineEvent, setNewTimelineEvent] = useState({ event: '', date: new Date() });

  useEffect(() => {
    if (eoi) {
      setFormData({ ...eoi });
    }
  }, [eoi]);

  if (!formData) return null;

  const handleInputChange = (field: keyof EOI, value: any) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      toast({
        title: "EOI Updated",
        description: "The EOI has been successfully updated."
      });
      onClose();
    }
  };

  const addRequirement = () => {
    if (newRequirement.trim() && formData) {
      setFormData(prev => prev ? {
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      } : null);
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    if (formData) {
      setFormData(prev => prev ? {
        ...prev,
        requirements: prev.requirements.filter((_, i) => i !== index)
      } : null);
    }
  };

  const addDocument = () => {
    if (newDocument.name.trim() && formData) {
      setFormData(prev => prev ? {
        ...prev,
        documents: [...prev.documents, { ...newDocument, uploaded: false }]
      } : null);
      setNewDocument({ name: '', required: false });
    }
  };

  const removeDocument = (index: number) => {
    if (formData) {
      setFormData(prev => prev ? {
        ...prev,
        documents: prev.documents.filter((_, i) => i !== index)
      } : null);
    }
  };

  const addTimelineEvent = () => {
    if (newTimelineEvent.event.trim() && formData) {
      setFormData(prev => prev ? {
        ...prev,
        timeline: [...prev.timeline, {
          ...newTimelineEvent,
          date: newTimelineEvent.date.toISOString(),
          completed: false
        }]
      } : null);
      setNewTimelineEvent({ event: '', date: new Date() });
    }
  };

  const removeTimelineEvent = (index: number) => {
    if (formData) {
      setFormData(prev => prev ? {
        ...prev,
        timeline: prev.timeline.filter((_, i) => i !== index)
      } : null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Edit EOI: {formData.title}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">EOI Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter EOI title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="evaluation">Under Evaluation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Publish Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.publishDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.publishDate ? format(new Date(formData.publishDate), "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={new Date(formData.publishDate)}
                      onSelect={(date) => date && handleInputChange('publishDate', date.toISOString())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Closing Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.closingDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.closingDate ? format(new Date(formData.closingDate), "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={new Date(formData.closingDate)}
                      onSelect={(date) => date && handleInputChange('closingDate', date.toISOString())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter EOI description"
                rows={4}
              />
            </div>
          </TabsContent>

          <TabsContent value="requirements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">EOI Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    placeholder="Add new requirement"
                    className="flex-1"
                  />
                  <Button onClick={addRequirement} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">{requirement}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRequirement(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Document Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newDocument.name}
                    onChange={(e) => setNewDocument(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Document name"
                    className="flex-1"
                  />
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="required"
                      checked={newDocument.required}
                      onCheckedChange={(checked) => 
                        setNewDocument(prev => ({ ...prev, required: !!checked }))
                      }
                    />
                    <Label htmlFor="required" className="text-sm">Required</Label>
                  </div>
                  <Button onClick={addDocument} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">{doc.name}</span>
                        <Badge variant={doc.required ? 'default' : 'secondary'}>
                          {doc.required ? 'Required' : 'Optional'}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">EOI Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newTimelineEvent.event}
                    onChange={(e) => setNewTimelineEvent(prev => ({ ...prev, event: e.target.value }))}
                    placeholder="Timeline event"
                    className="flex-1"
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newTimelineEvent.date}
                        onSelect={(date) => date && setNewTimelineEvent(prev => ({ ...prev, date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Button onClick={addTimelineEvent} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.timeline.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">{event.event}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(event.date), "dd MMM yyyy")}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTimelineEvent(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EOIEditForm;
