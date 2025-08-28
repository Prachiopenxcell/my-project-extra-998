import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  Save,
  Star,
  CalendarDays,
  Clock,
  Bell,
  FileText,
  Users,
  BarChart3,
  Building,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const CreateTimelineEvent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    eventType: "cirp_filing",
    activityName: "",
    natureOfActivity: "CIRP Filing",
    description: "",
    significance: 3,
    dueDate: "",
    actualDate: "",
    entity: "",
    process: "",
    isRecurring: false,
    recurringType: "monthly",
    recurringInterval: 1,
    endDate: "",
    notificationEnabled: true,
    notificationDays: 7,
    notificationChannels: {
      email: true,
      sms: false,
      whatsapp: false,
      dashboard: true
    },
    assignedTo: "",
    priority: "medium",
    tags: [],
    attachments: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChannelChange = (channel: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      notificationChannels: {
        ...prev.notificationChannels,
        [channel]: checked
      }
    }));
  };

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => handleInputChange('significance', i + 1)}
        className="p-1 hover:bg-muted rounded"
      >
        <Star
          className={`w-5 h-5 ${i < count ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />
      </button>
    ));
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "cirp_filing": return <FileText className="h-5 w-5 text-blue-500" />;
      case "coc_meeting": return <Users className="h-5 w-5 text-green-500" />;
      case "claims_submission": return <BarChart3 className="h-5 w-5 text-amber-500" />;
      case "board_meeting": return <Building className="h-5 w-5 text-purple-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleSave = async () => {
    if (!formData.activityName || !formData.dueDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Event Created",
        description: "Timeline event has been created successfully.",
      });
      
      navigate('/timeline');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create timeline event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndContinue = async () => {
    await handleSave();
    // Reset form for new event
    setFormData({
      ...formData,
      activityName: "",
      description: "",
      dueDate: "",
      actualDate: ""
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/timeline')}
            className="h-9"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Timeline
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create Timeline Event</h1>
            <p className="text-muted-foreground">Add a new event to your timeline</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getActivityIcon(formData.eventType)}
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventType">Event Type *</Label>
                    <Select value={formData.eventType} onValueChange={(value) => handleInputChange('eventType', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cirp_filing">CIRP Filing</SelectItem>
                        <SelectItem value="coc_meeting">COC Meeting</SelectItem>
                        <SelectItem value="claims_submission">Claims Submission</SelectItem>
                        <SelectItem value="board_meeting">Board Meeting</SelectItem>
                        <SelectItem value="compliance_filing">Compliance Filing</SelectItem>
                        <SelectItem value="custom_event">Custom Event</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activityName">Activity Name *</Label>
                    <Input
                      id="activityName"
                      value={formData.activityName}
                      onChange={(e) => handleInputChange('activityName', e.target.value)}
                      placeholder="Enter activity name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter event description"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Significance (Priority)</Label>
                  <div className="flex items-center gap-2">
                    {renderStars(formData.significance)}
                    <span className="text-sm text-muted-foreground ml-2">
                      {formData.significance} star{formData.significance !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Date & Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-blue-500" />
                  Date & Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date *</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="actualDate">Actual Date (if completed)</Label>
                    <Input
                      id="actualDate"
                      type="date"
                      value={formData.actualDate}
                      onChange={(e) => handleInputChange('actualDate', e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isRecurring"
                      checked={formData.isRecurring}
                      onCheckedChange={(checked) => handleInputChange('isRecurring', checked)}
                    />
                    <Label htmlFor="isRecurring">Recurring Event</Label>
                  </div>

                  {formData.isRecurring && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6">
                      <div className="space-y-2">
                        <Label>Frequency</Label>
                        <Select value={formData.recurringType} onValueChange={(value) => handleInputChange('recurringType', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Interval</Label>
                        <Input
                          type="number"
                          min="1"
                          value={formData.recurringInterval}
                          onChange={(e) => handleInputChange('recurringInterval', parseInt(e.target.value))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => handleInputChange('endDate', e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Entity & Process */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-green-500" />
                  Entity & Process
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Select Entity</Label>
                    <Select value={formData.entity} onValueChange={(value) => handleInputChange('entity', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose entity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="acme_corporation">Acme Corporation</SelectItem>
                        <SelectItem value="tech_solutions">Tech Solutions Ltd</SelectItem>
                        <SelectItem value="global_industries">Global Industries</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Process Type</Label>
                    <Select value={formData.process} onValueChange={(value) => handleInputChange('process', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose process" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cirp">CIRP Process</SelectItem>
                        <SelectItem value="liquidation">Liquidation Process</SelectItem>
                        <SelectItem value="compliance">Compliance Process</SelectItem>
                        <SelectItem value="restructuring">Restructuring</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-amber-500" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notificationEnabled"
                    checked={formData.notificationEnabled}
                    onCheckedChange={(checked) => handleInputChange('notificationEnabled', checked)}
                  />
                  <Label htmlFor="notificationEnabled">Enable Notifications</Label>
                </div>

                {formData.notificationEnabled && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Notify me</Label>
                      <Select 
                        value={formData.notificationDays.toString()} 
                        onValueChange={(value) => handleInputChange('notificationDays', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 day before</SelectItem>
                          <SelectItem value="3">3 days before</SelectItem>
                          <SelectItem value="7">7 days before</SelectItem>
                          <SelectItem value="14">14 days before</SelectItem>
                          <SelectItem value="30">30 days before</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label>Notification Channels</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="email"
                            checked={formData.notificationChannels.email}
                            onCheckedChange={(checked) => handleNotificationChannelChange('email', checked as boolean)}
                          />
                          <Label htmlFor="email">Email</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="sms"
                            checked={formData.notificationChannels.sms}
                            onCheckedChange={(checked) => handleNotificationChannelChange('sms', checked as boolean)}
                          />
                          <Label htmlFor="sms">SMS</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="whatsapp"
                            checked={formData.notificationChannels.whatsapp}
                            onCheckedChange={(checked) => handleNotificationChannelChange('whatsapp', checked as boolean)}
                          />
                          <Label htmlFor="whatsapp">WhatsApp</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="dashboard"
                            checked={formData.notificationChannels.dashboard}
                            onCheckedChange={(checked) => handleNotificationChannelChange('dashboard', checked as boolean)}
                          />
                          <Label htmlFor="dashboard">Dashboard</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Priority & Assignment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Priority & Assignment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Priority Level</Label>
                  <RadioGroup value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="low" />
                      <Label htmlFor="low">Low</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium">Medium</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="high" />
                      <Label htmlFor="high">High</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="urgent" id="urgent" />
                      <Label htmlFor="urgent">Urgent</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Assigned To</Label>
                  <Select value={formData.assignedTo} onValueChange={(value) => handleInputChange('assignedTo', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john_doe">John Doe</SelectItem>
                      <SelectItem value="jane_smith">Jane Smith</SelectItem>
                      <SelectItem value="mike_wilson">Mike Wilson</SelectItem>
                      <SelectItem value="sarah_johnson">Sarah Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button 
                    onClick={handleSave} 
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Create Event
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleSaveAndContinue}
                    disabled={loading}
                    className="w-full"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save & Create Another
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/timeline')}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateTimelineEvent;
