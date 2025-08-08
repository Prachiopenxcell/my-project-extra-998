import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/components/ui/use-toast';
import { 
  CalendarIcon, 
  Save,
  DollarSign,
  FileText,
  Building,
  Users,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ResolutionPlan {
  id: string;
  praName: string;
  version: string;
  submitDate: string;
  npvValue: number;
  recoveryPercentage: number;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  securedCreditors: number;
  unsecuredCreditors: number;
  operationalCreditors: number;
  workmenDues: number;
  totalRecovery: number;
  rank: number;
}

interface AddPlanFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: ResolutionPlan) => void;
  existingPlans: ResolutionPlan[];
}

const AddPlanForm: React.FC<AddPlanFormProps> = ({ isOpen, onClose, onSave, existingPlans }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    praName: '',
    version: 'V1.0',
    submitDate: new Date(),
    status: 'submitted' as const,
    securedCreditors: 0,
    unsecuredCreditors: 0,
    operationalCreditors: 0,
    workmenDues: 0
  });

  const handleInputChange = (field: string, value: string | number | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateTotalRecovery = () => {
    return formData.securedCreditors + formData.unsecuredCreditors + 
           formData.operationalCreditors + formData.workmenDues;
  };

  const calculateRecoveryPercentage = () => {
    const totalRecovery = calculateTotalRecovery();
    // Assuming liquidation value total is around 98.2 Cr as baseline
    const liquidationTotal = 98.2;
    return Math.round((totalRecovery / liquidationTotal) * 100);
  };

  const calculateNPVValue = () => {
    const totalRecovery = calculateTotalRecovery();
    // NPV is typically 85-90% of total recovery for resolution plans
    return Math.round(totalRecovery * 0.87 * 10) / 10;
  };

  const handleSave = () => {
    if (!formData.praName.trim()) {
      toast({
        title: "Validation Error",
        description: "PRA Name is required.",
        variant: "destructive"
      });
      return;
    }

    const totalRecovery = calculateTotalRecovery();
    if (totalRecovery <= 0) {
      toast({
        title: "Validation Error",
        description: "At least one creditor amount must be greater than 0.",
        variant: "destructive"
      });
      return;
    }

    const newPlan: ResolutionPlan = {
      id: (existingPlans.length + 1).toString(),
      praName: formData.praName.trim(),
      version: formData.version,
      submitDate: formData.submitDate.toISOString().split('T')[0],
      status: formData.status,
      securedCreditors: formData.securedCreditors,
      unsecuredCreditors: formData.unsecuredCreditors,
      operationalCreditors: formData.operationalCreditors,
      workmenDues: formData.workmenDues,
      totalRecovery: totalRecovery,
      recoveryPercentage: calculateRecoveryPercentage(),
      npvValue: calculateNPVValue(),
      rank: existingPlans.length + 1
    };

    onSave(newPlan);
    
    // Reset form
    setFormData({
      praName: '',
      version: 'V1.0',
      submitDate: new Date(),
      status: 'submitted',
      securedCreditors: 0,
      unsecuredCreditors: 0,
      operationalCreditors: 0,
      workmenDues: 0
    });
    
    toast({
      title: "Plan Added",
      description: `Resolution plan for ${newPlan.praName} has been successfully added.`
    });
    
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      praName: '',
      version: 'V1.0',
      submitDate: new Date(),
      status: 'submitted',
      securedCreditors: 0,
      unsecuredCreditors: 0,
      operationalCreditors: 0,
      workmenDues: 0
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Add New Resolution Plan
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="financial">Financial Details</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Plan Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="praName">PRA Name *</Label>
                    <Input
                      id="praName"
                      value={formData.praName}
                      onChange={(e) => handleInputChange('praName', e.target.value)}
                      placeholder="Enter PRA company name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="version">Plan Version</Label>
                    <Select
                      value={formData.version}
                      onValueChange={(value) => handleInputChange('version', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="V1.0">V1.0</SelectItem>
                        <SelectItem value="V1.1">V1.1</SelectItem>
                        <SelectItem value="V1.2">V1.2</SelectItem>
                        <SelectItem value="V2.0">V2.0</SelectItem>
                        <SelectItem value="V2.1">V2.1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Submit Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.submitDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.submitDate ? format(formData.submitDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.submitDate}
                          onSelect={(date) => date && handleInputChange('submitDate', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Recovery Amounts (₹ Crores)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="securedCreditors">Secured Creditors</Label>
                    <Input
                      id="securedCreditors"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.securedCreditors}
                      onChange={(e) => handleInputChange('securedCreditors', parseFloat(e.target.value) || 0)}
                      placeholder="0.0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unsecuredCreditors">Unsecured Creditors</Label>
                    <Input
                      id="unsecuredCreditors"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.unsecuredCreditors}
                      onChange={(e) => handleInputChange('unsecuredCreditors', parseFloat(e.target.value) || 0)}
                      placeholder="0.0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="operationalCreditors">Operational Creditors</Label>
                    <Input
                      id="operationalCreditors"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.operationalCreditors}
                      onChange={(e) => handleInputChange('operationalCreditors', parseFloat(e.target.value) || 0)}
                      placeholder="0.0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workmenDues">Workmen Dues</Label>
                    <Input
                      id="workmenDues"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.workmenDues}
                      onChange={(e) => handleInputChange('workmenDues', parseFloat(e.target.value) || 0)}
                      placeholder="0.0"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Total Recovery:</span>
                    <span className="text-green-600">₹{calculateTotalRecovery().toFixed(1)} Cr</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Plan Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">PRA Name:</span>
                      <span className="font-medium">{formData.praName || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Version:</span>
                      <span className="font-medium">{formData.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Submit Date:</span>
                      <span className="font-medium">{format(formData.submitDate, "dd MMM yyyy")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium capitalize">{formData.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Recovery:</span>
                      <span className="font-semibold text-green-600">₹{calculateTotalRecovery().toFixed(1)} Cr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">NPV Value:</span>
                      <span className="font-semibold text-blue-600">₹{calculateNPVValue()} Cr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Recovery %:</span>
                      <span className="font-semibold text-purple-600">{calculateRecoveryPercentage()}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rank:</span>
                      <span className="font-medium">#{existingPlans.length + 1}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Recovery Breakdown:</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span>Secured Creditors:</span>
                      <span>₹{formData.securedCreditors.toFixed(1)} Cr</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Unsecured Creditors:</span>
                      <span>₹{formData.unsecuredCreditors.toFixed(1)} Cr</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Operational Creditors:</span>
                      <span>₹{formData.operationalCreditors.toFixed(1)} Cr</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Workmen Dues:</span>
                      <span>₹{formData.workmenDues.toFixed(1)} Cr</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Add Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPlanForm;
