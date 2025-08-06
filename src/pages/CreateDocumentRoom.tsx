import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  Building, 
  ChevronRight, 
  Bot, 
  FolderOpen, 
  FileText, 
  Scale, 
  Briefcase, 
  HelpCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateDocumentRoom = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [templateType, setTemplateType] = useState("custom");
  const [formData, setFormData] = useState({
    title: "Due Diligence - Series A Funding",
    description: "Document storage for Series A funding due diligence process",
    entity: "ABC Corp Ltd",
    privacy: "private"
  });

  const steps = [
    { id: 1, name: "Setup", completed: true },
    { id: 2, name: "Groups", completed: false },
    { id: 3, name: "Folders", completed: false },
    { id: 4, name: "Upload", completed: false },
    { id: 5, name: "Manage", completed: false }
  ];

  const aiSuggestedFolders = [
    "📁 Financial Documents",
    "📁 Legal & Compliance", 
    "📁 Business Plans & Strategy",
    "📁 Technical Documentation",
    "📁 Due Diligence Q&A"
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Navigate to the created room
      navigate("/data-room/document-storage/room/new");
    }
  };

  const handleCancel = () => {
    navigate("/data-room/document-storage");
  };

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Document Storage Room</h1>
            <p className="text-muted-foreground">
              📂 Create New Document Storage Room
            </p>
          </div>
        </div>

        {/* Progress Tracker */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    step.id <= currentStep 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : 'border-muted-foreground text-muted-foreground'
                  }`}>
                    {step.id}
                  </div>
                  <span className={`ml-2 text-sm ${
                    step.id <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 ${
                      step.id < currentStep ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <Progress value={(currentStep / steps.length) * 100} className="w-full" />
          </CardContent>
        </Card>

        {/* Step Content */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Room Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Template Selection */}
              <div className="space-y-3">
                <Label className="text-base font-medium">🎯 Template Selection:</Label>
                <RadioGroup value={templateType} onValueChange={setTemplateType}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ai" id="ai" />
                    <Label htmlFor="ai">AI Template</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom">Custom Template</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Room Details */}
              <div className="space-y-4">
                <Label className="text-base font-medium">📝 Room Details:</Label>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Title:</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter room title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description:</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Enter room description"
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <span>🏢 Entity: {formData.entity}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Change ▼
                  </Button>
                </div>

                {/* Privacy Settings */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">🔒 Privacy Settings:</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="private" 
                        checked={formData.privacy === "private"}
                        onCheckedChange={(checked) => checked && setFormData({...formData, privacy: "private"})}
                      />
                      <Label htmlFor="private">Private Room</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="internal" 
                        checked={formData.privacy === "internal"}
                        onCheckedChange={(checked) => checked && setFormData({...formData, privacy: "internal"})}
                      />
                      <Label htmlFor="internal">Internal Only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="public" 
                        checked={formData.privacy === "public"}
                        onCheckedChange={(checked) => checked && setFormData({...formData, privacy: "public"})}
                      />
                      <Label htmlFor="public">Public</Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleNext}>
                  Next: Create Groups
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Template Preview */}
        {templateType === "ai" && currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Template Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                🤖 Based on your description, I'll create:
              </p>
              <div className="space-y-2">
                {aiSuggestedFolders.map((folder, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <FolderOpen className="h-4 w-4 text-primary" />
                    {folder}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Placeholder for other steps */}
        {currentStep > 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Step {currentStep}: {steps[currentStep - 1].name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Step {currentStep} content will be implemented here
                </p>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                    Previous
                  </Button>
                  <Button onClick={handleNext}>
                    {currentStep === 5 ? "Create Room" : "Next"}
                    {currentStep < 5 && <ChevronRight className="h-4 w-4 ml-1" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CreateDocumentRoom;
