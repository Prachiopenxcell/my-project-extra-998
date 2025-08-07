import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { 
  ArrowLeft, 
  ArrowRight, 
  FileText, 
  Scale, 
  Building, 
  CheckCircle, 
  AlertTriangle,
  Clock
} from "lucide-react";

const LitigationStageSelection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State management
  const [selectedEntity, setSelectedEntity] = useState("Acme Corporation Ltd");
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock data for entities
  const entities = [
    { id: "entity-001", name: "Acme Corporation Ltd" },
    { id: "entity-002", name: "TechSolutions Pvt Ltd" },
    { id: "entity-003", name: "Global Ventures Inc" }
  ];

  // Progress steps
  const steps = [
    { id: 1, title: "Stage Selection", completed: false, active: true },
    { id: 2, title: "Details", completed: false },
    { id: 3, title: "Documents", completed: false },
    { id: 4, title: "Review", completed: false }
  ];

  const handleContinue = () => {
    if (!selectedStage) {
      toast({
        title: "Selection Required",
        description: "Please select a litigation stage to continue.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Navigate based on selected stage
    setTimeout(() => {
      setLoading(false);
      if (selectedStage === "pre-filing") {
        navigate("/litigation/create/pre-filing");
      } else {
        navigate("/litigation/create/active");
      }
    }, 500);
  };

  return (
    <DashboardLayout userType="service_provider">
      <div className="container mx-auto p-6">
        <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/litigation')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Litigation Dashboard
            </Button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed 
                    ? "bg-blue-500 text-white" 
                    : step.active 
                      ? "bg-blue-100 text-blue-800 border-2 border-blue-500" 
                      : "bg-gray-100 text-gray-400"
                }`}>
                  {step.completed ? <CheckCircle className="h-4 w-4" /> : step.id}
                </div>
                <span className={`text-xs mt-1 ${
                  step.active ? "font-medium text-blue-800" : "text-gray-500"
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className="hidden sm:block absolute left-0 w-full h-0.5 bg-gray-200" style={{ top: "20px", zIndex: -1 }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Scale className="h-5 w-5 text-blue-600" />
                  Litigation Stage Selection
                </CardTitle>
                <CardDescription>
                  Select the appropriate stage for your litigation process
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Entity Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Entity</label>
                  <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an entity" />
                    </SelectTrigger>
                    <SelectContent>
                      {entities.map(entity => (
                        <SelectItem key={entity.id} value={entity.name}>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-500" />
                            {entity.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Stage Selection */}
                <div className="space-y-4">
                  <label className="text-sm font-medium">Select Litigation Stage</label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Stage 1 Card */}
                    <Card 
                      className={`cursor-pointer border-2 transition-all ${
                        selectedStage === "pre-filing" 
                          ? "border-blue-500 bg-blue-50" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedStage("pre-filing")}
                    >
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center space-y-3">
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <FileText className="h-6 w-6 text-blue-600" />
                          </div>
                          <h3 className="font-semibold text-lg">Stage 1</h3>
                          <p className="text-base">Filing of Application</p>
                          <p className="text-sm text-gray-500">
                            Pre-filing stage for defining case details and preparing documents
                          </p>
                          <div className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            <Clock className="h-3 w-3" />
                            Preparation Phase
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Stage 2 Card */}
                    <Card 
                      className={`cursor-pointer border-2 transition-all ${
                        selectedStage === "active" 
                          ? "border-orange-500 bg-orange-50" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedStage("active")}
                    >
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center space-y-3">
                          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                            <Scale className="h-6 w-6 text-orange-600" />
                          </div>
                          <h3 className="font-semibold text-lg">Stage 2</h3>
                          <p className="text-base">Summary of Litigation</p>
                          <p className="text-sm text-gray-500">
                            Track and manage active litigation cases with the authorities
                          </p>
                          <div className="flex items-center gap-1 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                            <AlertTriangle className="h-3 w-3" />
                            Active Litigation
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => navigate('/litigation')}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleContinue} 
                  disabled={!selectedStage || loading}
                  className="flex items-center gap-2"
                >
                  {loading ? "Processing..." : "Continue"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Litigation Process</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    Stage 1: Filing of Application
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1 pl-6 list-disc">
                    <li>Define application details</li>
                    <li>Upload necessary documents</li>
                    <li>Assign lawyers for drafting</li>
                    <li>Set deadlines and follow-ups</li>
                    <li>Track costs and expenses</li>
                  </ul>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Scale className="h-4 w-4 text-orange-600" />
                    Stage 2: Summary of Litigation
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1 pl-6 list-disc">
                    <li>Track filed cases with authorities</li>
                    <li>Monitor hearing dates and outcomes</li>
                    <li>Manage case documents and orders</li>
                    <li>Record interim and final orders</li>
                    <li>Analyze case progress and status</li>
                  </ul>
                </div>

                <Separator />

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> You can select both stages if your process requires it. The system will guide you through Stage 1 first, followed by Stage 2.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LitigationStageSelection;
