import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, ArrowLeft, Save, CheckCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Reusing components from CreateMeeting with modifications for edit functionality
const EntityAndMeetingDetails = ({ formData, setFormData, nextStep, saveChanges }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    formData.meetingDate ? new Date(formData.meetingDate) : undefined
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setFormData({ ...formData, meetingDate: date });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="entity">Entity:</Label>
            <Select 
              value={formData.entity || ""} 
              onValueChange={(value) => handleSelectChange("entity", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="acme">Acme Corporation</SelectItem>
                <SelectItem value="globex">Globex Industries</SelectItem>
                <SelectItem value="initech">Initech LLC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="meetingClass">Meeting Class:</Label>
            <Select 
              value={formData.meetingClass || ""} 
              onValueChange={(value) => handleSelectChange("meetingClass", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select meeting class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AGM">Annual General Meeting (AGM)</SelectItem>
                <SelectItem value="EGM">Extraordinary General Meeting (EGM)</SelectItem>
                <SelectItem value="BM">Board Meeting</SelectItem>
                <SelectItem value="CM">Committee Meeting</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="meetingNumber">Meeting Number:</Label>
            <Input 
              id="meetingNumber" 
              name="meetingNumber" 
              type="number" 
              value={formData.meetingNumber || ""} 
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label htmlFor="meetingType">Meeting Type:</Label>
            <RadioGroup 
              value={formData.meetingType || "original"} 
              onValueChange={(value) => handleSelectChange("meetingType", value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="original" id="original" />
                <Label htmlFor="original">Original</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="adjourned" id="adjourned" />
                <Label htmlFor="adjourned">Adjourned</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="meetingNature">Meeting Nature:</Label>
            <RadioGroup 
              value={formData.meetingNature || "virtual"} 
              onValueChange={(value) => handleSelectChange("meetingNature", value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="physical" id="physical" />
                <Label htmlFor="physical">Physical</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="virtual" id="virtual" />
                <Label htmlFor="virtual">Virtual</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hybrid" id="hybrid" />
                <Label htmlFor="hybrid">Hybrid</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.meetingNature === "virtual" || formData.meetingNature === "hybrid" ? (
            <div>
              <Label htmlFor="virtualMeetingOption">Virtual Meeting Option:</Label>
              <RadioGroup 
                value={formData.virtualMeetingOption || "generate"} 
                onValueChange={(value) => handleSelectChange("virtualMeetingOption", value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="generate" id="generate" />
                  <Label htmlFor="generate">Generate Meeting Link</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="external" id="external" />
                  <Label htmlFor="external">External Meeting Link</Label>
                </div>
              </RadioGroup>
              
              {formData.virtualMeetingOption === "external" && (
                <div className="mt-2">
                  <Input 
                    id="externalMeetingLink" 
                    name="externalMeetingLink" 
                    placeholder="Enter external meeting link" 
                    value={formData.externalMeetingLink || ""} 
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </div>
          ) : null}

          {formData.meetingNature === "physical" || formData.meetingNature === "hybrid" ? (
            <div>
              <Label htmlFor="venue">Venue:</Label>
              <Input 
                id="venue" 
                name="venue" 
                placeholder="Enter meeting venue" 
                value={formData.venue || ""} 
                onChange={handleInputChange}
              />
            </div>
          ) : null}

          <div>
            <Label>Date & Time:</Label>
            <div className="flex space-x-4 mt-1">
              <div className="w-1/2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="w-1/2">
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    type="time" 
                    className="pl-10" 
                    value={formData.meetingTime || ""}
                    onChange={(e) => handleSelectChange("meetingTime", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="quorum">Quorum Required:</Label>
            <div className="flex items-center">
              <Input 
                id="quorum" 
                name="quorum" 
                type="number" 
                value={formData.quorum || 51} 
                onChange={handleInputChange}
                className="w-24"
              />
              <span className="ml-2">%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">(auto-filled based on meeting class, editable)</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button variant="outline" onClick={saveChanges}>Save Changes</Button>
        <Button onClick={nextStep}>Next: Participants →</Button>
      </div>
    </div>
  );
};

// Main EditMeeting component
const EditMeetingContent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    entity: "acme",
    meetingClass: "BM",
    meetingNumber: 4,
    meetingType: "original",
    meetingNature: "virtual",
    virtualMeetingOption: "generate",
    quorum: 51,
    meetingDate: new Date(),
    meetingTime: "14:00"
  });
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching meeting data
  useEffect(() => {
    // In a real app, this would fetch meeting data from API
    setTimeout(() => {
      setIsLoading(false);
      // Simulated data would be set here
    }, 500);
  }, [id]);

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const saveChanges = () => {
    // In a real app, this would save the meeting data to a database
    toast({
      title: "Changes saved",
      description: "Meeting details have been updated successfully."
    });
    navigate("/meetings");
  };

  const renderStep = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading meeting details...</p>
          </div>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <EntityAndMeetingDetails 
            formData={formData} 
            setFormData={setFormData} 
            nextStep={nextStep} 
            saveChanges={saveChanges} 
          />
        );
      // Additional steps would be implemented here similar to CreateMeeting
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Meeting</h1>
          <p className="text-muted-foreground">Meeting ID: {id || 'BM-2024-004'}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate('/meetings')}>
            Cancel
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border rounded-lg">
        <CardContent className="pt-6">
          {renderStep()}
        </CardContent>
      </Card>
    </div>
  );
};

const EditMeeting = () => {
  return (
    <DashboardLayout userType="service_provider">
      <EditMeetingContent />
    </DashboardLayout>
  );
};

export default EditMeeting;
