import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface MeetingDetailsProps {
  formData: any;
  setFormData: (data: any) => void;
  prevStep: () => void;
  nextStep: () => void;
  saveAsDraft: () => void;
}

const MeetingDetails = ({ formData, setFormData, prevStep, nextStep, saveAsDraft }: MeetingDetailsProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setFormData((prev: any) => ({ ...prev, meetingDate: date }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Meeting Details:</h3>
        <div className="space-y-4 border rounded-md p-4">
          <div>
            <Label htmlFor="meetingTitle">Meeting Title: (Optional)</Label>
            <Input 
              id="meetingTitle" 
              name="meetingTitle" 
              value={formData.meetingTitle || ""} 
              onChange={handleInputChange} 
              placeholder="Enter meeting title"
            />
          </div>
          
          <div>
            <Label>Class of Meeting:</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {["AGM", "COC", "BM", "EGM", "Valuer Meeting"].map((type) => (
                <Button 
                  key={type} 
                  variant={formData.meetingClass === type ? "default" : "outline"}
                  onClick={() => handleSelectChange("meetingClass", type)}
                  className="min-w-20"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <Label htmlFor="meetingNumber">Meeting Number:</Label>
            <Input 
              id="meetingNumber" 
              name="meetingNumber" 
              type="text" 
              value={formData.meetingNumber || "2023-Q3-001"} 
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <Label>Type of Meeting:</Label>
            <Select 
              value={formData.meetingType} 
              onValueChange={(value) => handleSelectChange("meetingType", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select meeting type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="original">Original Meeting</SelectItem>
                <SelectItem value="adjourned">Adjourned Meeting</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Nature of Meeting:</Label>
            <Select 
              value={formData.meetingNature} 
              onValueChange={(value) => handleSelectChange("meetingNature", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select meeting nature" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="physical">Physical Meeting</SelectItem>
                <SelectItem value="hybrid">Hybrid Meeting</SelectItem>
                <SelectItem value="virtual">Virtual Meeting</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time - Required for all meeting types */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Meeting Date: *</Label>
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
            
            <div>
              <Label htmlFor="meetingTime">Meeting Time: *</Label>
              <Input 
                id="meetingTime" 
                name="meetingTime" 
                type="time" 
                value={formData.meetingTime || ""} 
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Venue - Required for Physical and Hybrid, not for Virtual */}
          {(formData.meetingNature === "physical" || formData.meetingNature === "hybrid") && (
            <div>
              <Label htmlFor="venue">Venue: *</Label>
              <Input 
                id="venue" 
                name="venue" 
                value={formData.venue || ""} 
                onChange={handleInputChange} 
                placeholder="Enter meeting venue"
              />
            </div>
          )}

          {/* Online Link Configuration - For Hybrid and Virtual */}
          {(formData.meetingNature === "hybrid" || formData.meetingNature === "virtual") && (
            <div className="border rounded-md p-4 space-y-4">
              <Label>Online Meeting Configuration:</Label>
              <RadioGroup 
                value={formData.virtualMeetingOption} 
                onValueChange={(value) => handleSelectChange("virtualMeetingOption", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="generate" id="generate" />
                  <Label htmlFor="generate">Generate meeting link automatically</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="manual" id="manual" />
                  <Label htmlFor="manual">Enter meeting link manually</Label>
                </div>
              </RadioGroup>
              
              {formData.virtualMeetingOption === "manual" && (
                <div>
                  <Label htmlFor="meetingLink">Meeting Link:</Label>
                  <Input 
                    id="meetingLink" 
                    name="meetingLink" 
                    value={formData.meetingLink || ""} 
                    onChange={handleInputChange} 
                    placeholder="Enter meeting link (e.g., Zoom, Teams, etc.)"
                  />
                </div>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="quorum">Quorum (%):</Label>
            <Input 
              id="quorum" 
              name="quorum" 
              type="number" 
              min="1" 
              max="100" 
              value={formData.quorum || 51} 
              onChange={handleInputChange}
            />
            <p className="text-xs text-muted-foreground mt-1">(auto-filled based on meeting class, editable)</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button variant="outline" onClick={prevStep}>← Back</Button>
        <Button variant="outline" onClick={saveAsDraft}>Save as Draft</Button>
        <Button onClick={nextStep}>Next: List of Participants →</Button>
      </div>
    </div>
  );
};

export default MeetingDetails;
