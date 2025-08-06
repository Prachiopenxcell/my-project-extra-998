import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Save } from "lucide-react";

interface EntryDetailsProps {
  formData: any;
  setFormData: (data: any) => void;
  nextStep: () => void;
  saveAsDraft: () => void;
}

const EntryDetails = ({ formData, setFormData, nextStep, saveAsDraft }: EntryDetailsProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Entity Details</h3>
        <p className="text-sm text-muted-foreground mb-6">Select or create the entity for this meeting</p>
      </div>

      <Card className="border rounded-lg">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="w-3/4">
                <Label htmlFor="entity">Choose Entity: *</Label>
                <Select 
                  value={formData.entity} 
                  onValueChange={(value) => handleSelectChange("entity", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an entity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acme">Acme Corporation</SelectItem>
                    <SelectItem value="tech">Tech Solutions</SelectItem>
                    <SelectItem value="healthcare">Healthcare Ltd</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline">+ Create New Entity</Button>
            </div>
            
            <div>
              <Label htmlFor="entityType">Entity Type:</Label>
              <Input 
                id="entityType" 
                name="entityType" 
                value="Private Limited Company" 
                disabled 
                className="bg-muted"
              />
            </div>
            
            <div>
              <Label htmlFor="entityName">Entity Name:</Label>
              <Input 
                id="entityName" 
                name="entityName" 
                value="Acme Corporation" 
                disabled 
                className="bg-muted"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4 pt-4">
        <Button variant="outline" onClick={saveAsDraft}>
          <Save className="w-4 h-4 mr-2" />
          Save as Draft
        </Button>
        <Button onClick={nextStep}>Next: Meeting Details →</Button>
      </div>
    </div>
  );
};

export default EntryDetails;
