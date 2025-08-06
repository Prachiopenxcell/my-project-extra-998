import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { StepComponentProps } from "./types";

export const AddressContactStep = ({ formData, updateFormData }: StepComponentProps): JSX.Element => {
  // Initialize state with form data or defaults
  const [sameAddress, setSameAddress] = useState<boolean>(formData.sameAddress ?? true);
  const [registeredOffice, setRegisteredOffice] = useState(
    formData.registeredOffice || {
      address: "123 Business Park, Tower A, 5th Floor",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001"
    }
  );
  const [corporateOffice, setCorporateOffice] = useState(
    formData.corporateOffice || {
      address: "",
      city: "",
      state: "",
      pincode: ""
    }
  );
  const [businessLocations, setBusinessLocations] = useState<string[]>(
    formData.businessLocations || []
  );

  // Handle checkbox change for same address
  const handleSameAddressChange = (checked: boolean) => {
    setSameAddress(checked);
    updateFormData({ 
      sameAddress: checked,
      corporateOffice: checked ? registeredOffice : formData.corporateOffice
    });
  };

  // Handle registered office address change
  const handleRegisteredOfficeChange = (field: string, value: string) => {
    const updatedOffice = { ...registeredOffice, [field]: value };
    setRegisteredOffice(updatedOffice);
    
    updateFormData({ 
      registeredOffice: updatedOffice,
      // If same address is checked, update corporate office too
      corporateOffice: sameAddress ? updatedOffice : formData.corporateOffice
    });
  };
  
  // Handle corporate office address change
  const handleCorporateOfficeChange = (field: string, value: string) => {
    const updatedOffice = { ...corporateOffice, [field]: value };
    setCorporateOffice(updatedOffice);
    
    updateFormData({ 
      corporateOffice: updatedOffice
    });
  };

  // Handle adding a new business location
  const addBusinessLocation = () => {
    const newLocations = [...businessLocations, ""];
    setBusinessLocations(newLocations);
    updateFormData({ businessLocations: newLocations });
  };

  // Handle updating a business location
  const updateBusinessLocation = (index: number, value: string) => {
    const updatedLocations = [...businessLocations];
    updatedLocations[index] = value;
    setBusinessLocations(updatedLocations);
    updateFormData({ businessLocations: updatedLocations });
  };

  // Handle removing a business location
  const removeBusinessLocation = (index: number) => {
    const updatedLocations = businessLocations.filter((_, i) => i !== index);
    setBusinessLocations(updatedLocations);
    updateFormData({ businessLocations: updatedLocations });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Registered Office Address</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Address</Label>
              <Textarea
                value={registeredOffice.address}
                onChange={(e) => handleRegisteredOfficeChange('address', e.target.value)}
                placeholder="Enter address"
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm">City</Label>
                <Input
                  value={registeredOffice.city}
                  onChange={(e) => handleRegisteredOfficeChange('city', e.target.value)}
                  placeholder="Enter city"
                />
              </div>
              <div>
                <Label className="text-sm">State</Label>
                <Input
                  value={registeredOffice.state}
                  onChange={(e) => handleRegisteredOfficeChange('state', e.target.value)}
                  placeholder="Enter state"
                />
              </div>
              <div>
                <Label className="text-sm">Pincode</Label>
                <Input
                  value={registeredOffice.pincode}
                  onChange={(e) => handleRegisteredOfficeChange('pincode', e.target.value)}
                  placeholder="Enter pincode"
                />
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1 col-span-2">
              (Prefilled from MCA - Editable)
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="sameAddress" 
            checked={sameAddress}
            onCheckedChange={(checked) => handleSameAddressChange(checked === true)}
          />
          <Label htmlFor="sameAddress" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Use same address for Corporate Office
          </Label>
        </div>

        <div className="space-y-2">
          <Label>Factory/Branch Office Address</Label>
          <Textarea
            value={formData.factoryOffice || ""}
            onChange={(e) => updateFormData({ factoryOffice: e.target.value })}
            placeholder="Enter factory/branch office address"
            className="min-h-[100px]"
            disabled={sameAddress}
          />
          {sameAddress && (
            <div className="text-xs text-muted-foreground">
              (Same as Registered Office)
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Corporate Office Address</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Address</Label>
              <Textarea
                value={corporateOffice.address}
                onChange={(e) => handleCorporateOfficeChange('address', e.target.value)}
                placeholder="Enter address"
                className="min-h-[100px]"
                disabled={sameAddress}
              />
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm">City</Label>
                <Input
                  value={corporateOffice.city}
                  onChange={(e) => handleCorporateOfficeChange('city', e.target.value)}
                  placeholder="Enter city"
                  disabled={sameAddress}
                />
              </div>
              <div>
                <Label className="text-sm">State</Label>
                <Input
                  value={corporateOffice.state}
                  onChange={(e) => handleCorporateOfficeChange('state', e.target.value)}
                  placeholder="Enter state"
                  disabled={sameAddress}
                />
              </div>
              <div>
                <Label className="text-sm">Pincode</Label>
                <Input
                  value={corporateOffice.pincode}
                  onChange={(e) => handleCorporateOfficeChange('pincode', e.target.value)}
                  placeholder="Enter pincode"
                  disabled={sameAddress}
                />
              </div>
            </div>
            {sameAddress && (
              <div className="text-xs text-muted-foreground mt-1 col-span-2">
                (Same as Registered Office)
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Additional Business Locations</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={addBusinessLocation}
            >
              <Plus className="h-4 w-4 mr-2" /> Add More Business Locations
            </Button>
          </div>
          
          {businessLocations.length > 0 ? (
            <div className="space-y-2">
              {businessLocations.map((location, index) => (
                <div key={index} className="flex gap-2">
                  <Textarea
                    value={location}
                    onChange={(e) => updateBusinessLocation(index, e.target.value)}
                    placeholder={`Business Location ${index + 1}`}
                    className="min-h-[80px]"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeBusinessLocation(index)}
                    className="h-10 w-10 self-start"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground italic">
              No additional business locations added.
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium mb-4">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="registeredEmail">Registered Email ID</Label>
              <Input
                id="registeredEmail"
                type="email"
                value={formData.registeredEmail || "admin@acmecorp.com"}
                onChange={(e) => updateFormData({ registeredEmail: e.target.value })}
                placeholder="Enter registered email"
              />
              <div className="text-xs text-muted-foreground">
                (Prefilled from MCA - Editable)
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="alternateEmail">Alternate Email ID</Label>
              <Input
                id="alternateEmail"
                type="email"
                value={formData.alternateEmail || ""}
                onChange={(e) => updateFormData({ alternateEmail: e.target.value })}
                placeholder="Enter alternate email"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="correspondenceEmail">Correspondence Email ID</Label>
              <Input
                id="correspondenceEmail"
                type="email"
                value={formData.correspondenceEmail || ""}
                onChange={(e) => updateFormData({ correspondenceEmail: e.target.value })}
                placeholder="Enter correspondence email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone/Mobile No.</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber || ""}
                onChange={(e) => updateFormData({ phoneNumber: e.target.value })}
                placeholder="Enter phone/mobile number"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
