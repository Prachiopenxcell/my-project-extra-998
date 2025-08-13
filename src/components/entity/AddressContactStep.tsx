import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, MapPin } from "lucide-react";
import { StepComponentProps, FactoryBranchAddress, BusinessLocation } from "./types";

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
  const [factoryBranchOffices, setFactoryBranchOffices] = useState<FactoryBranchAddress[]>(
    formData.factoryBranchOffices || []
  );
  const [additionalBusinessLocations, setAdditionalBusinessLocations] = useState<BusinessLocation[]>(
    formData.additionalBusinessLocations || []
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

  // Handle factory/branch office management
  const addFactoryBranchOffice = () => {
    const newOffice: FactoryBranchAddress = {
      type: 'factory',
      address: '',
      city: '',
      state: '',
      pincode: '',
      isMain: false
    };
    const updatedOffices = [...factoryBranchOffices, newOffice];
    setFactoryBranchOffices(updatedOffices);
    updateFormData({ factoryBranchOffices: updatedOffices });
  };

  const updateFactoryBranchOffice = (index: number, field: keyof FactoryBranchAddress, value: string | boolean) => {
    const updatedOffices = [...factoryBranchOffices];
    updatedOffices[index] = { ...updatedOffices[index], [field]: value };
    setFactoryBranchOffices(updatedOffices);
    updateFormData({ factoryBranchOffices: updatedOffices });
  };

  const removeFactoryBranchOffice = (index: number) => {
    const updatedOffices = factoryBranchOffices.filter((_, i) => i !== index);
    setFactoryBranchOffices(updatedOffices);
    updateFormData({ factoryBranchOffices: updatedOffices });
  };

  // Handle additional business location management
  const addAdditionalBusinessLocation = () => {
    const newLocation: BusinessLocation = {
      id: `loc_${Date.now()}`,
      name: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      type: 'office'
    };
    const updatedLocations = [...additionalBusinessLocations, newLocation];
    setAdditionalBusinessLocations(updatedLocations);
    updateFormData({ additionalBusinessLocations: updatedLocations });
  };

  const updateAdditionalBusinessLocation = (index: number, field: keyof BusinessLocation, value: string) => {
    const updatedLocations = [...additionalBusinessLocations];
    updatedLocations[index] = { ...updatedLocations[index], [field]: value };
    setAdditionalBusinessLocations(updatedLocations);
    updateFormData({ additionalBusinessLocations: updatedLocations });
  };

  const removeAdditionalBusinessLocation = (index: number) => {
    const updatedLocations = additionalBusinessLocations.filter((_, i) => i !== index);
    setAdditionalBusinessLocations(updatedLocations);
    updateFormData({ additionalBusinessLocations: updatedLocations });
  };

  // Indian states and cities data
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal', 'Delhi', 'Puducherry', 'Chandigarh', 'Dadra and Nagar Haveli',
    'Daman and Diu', 'Lakshadweep', 'Andaman and Nicobar Islands', 'Jammu and Kashmir', 'Ladakh'
  ];

  // State-wise cities mapping
  const stateCitiesMap: Record<string, string[]> = {
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Sangli', 'Malegaon', 'Jalgaon'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga', 'Davanagere', 'Bellary', 'Bijapur', 'Shimoga'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Tiruppur', 'Vellore', 'Erode', 'Thoothukudi'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand', 'Navsari'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Bharatpur', 'Pali', 'Bhilwara', 'Sikar'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Allahabad', 'Bareilly', 'Aligarh', 'Moradabad'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Malda', 'Bardhaman', 'Baharampur', 'Habra', 'Kharagpur'],
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry', 'Kadapa', 'Kakinada', 'Tirupati', 'Anantapur'],
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Suryapet', 'Miryalaguda'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa'],
    'Haryana': ['Gurgaon', 'Faridabad', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar', 'Karnal', 'Sonipat', 'Panchkula'],
    'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Firozpur', 'Batala', 'Pathankot', 'Moga'],
    'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif', 'Arrah', 'Begusarai', 'Katihar'],
    'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Brahmapur', 'Sambalpur', 'Puri', 'Balasore', 'Bhadrak', 'Baripada', 'Jharsuguda'],
    'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Kollam', 'Thrissur', 'Alappuzha', 'Palakkad', 'Kannur', 'Kasaragod', 'Kottayam'],
    'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Phusro', 'Hazaribagh', 'Giridih', 'Ramgarh', 'Medininagar'],
    'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur', 'Bongaigaon', 'Dhubri', 'North Lakhimpur'],
    'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Palampur', 'Baddi', 'Nahan', 'Paonta Sahib', 'Sundernagar', 'Chamba'],
    'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur', 'Rishikesh', 'Kotdwar', 'Ramnagar', 'Manglaur'],
    'Chhattisgarh': ['Raipur', 'Bhilai', 'Korba', 'Bilaspur', 'Durg', 'Rajnandgaon', 'Jagdalpur', 'Raigarh', 'Ambikapur', 'Mahasamund'],
    'Goa': ['Panaji', 'Vasco da Gama', 'Margao', 'Mapusa', 'Ponda', 'Bicholim', 'Curchorem', 'Sanquelim', 'Cuncolim', 'Quepem'],
    'Delhi': ['New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'North East Delhi', 'North West Delhi', 'South East Delhi', 'South West Delhi'],
    'Chandigarh': ['Chandigarh'],
    'Puducherry': ['Puducherry', 'Karaikal', 'Mahe', 'Yanam']
  };

  // Get cities for selected state
  const getCitiesForState = (state: string): string[] => {
    return stateCitiesMap[state] || [];
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
                <Label className="text-sm">State</Label>
                <Select 
                  value={registeredOffice.state} 
                  onValueChange={(value) => {
                    handleRegisteredOfficeChange('state', value);
                    // Reset city when state changes
                    if (registeredOffice.city && !getCitiesForState(value).includes(registeredOffice.city)) {
                      handleRegisteredOfficeChange('city', '');
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {indianStates.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">City</Label>
                <Select 
                  value={registeredOffice.city} 
                  onValueChange={(value) => handleRegisteredOfficeChange('city', value)}
                  disabled={!registeredOffice.state}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={registeredOffice.state ? "Select city" : "Select state first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {getCitiesForState(registeredOffice.state).map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                    {registeredOffice.state && getCitiesForState(registeredOffice.state).length === 0 && (
                      <SelectItem value="other" disabled>No cities available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
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
                <Label className="text-sm">State</Label>
                <Select 
                  value={corporateOffice.state} 
                  onValueChange={(value) => {
                    handleCorporateOfficeChange('state', value);
                    // Reset city when state changes
                    if (corporateOffice.city && !getCitiesForState(value).includes(corporateOffice.city)) {
                      handleCorporateOfficeChange('city', '');
                    }
                  }}
                  disabled={sameAddress}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {indianStates.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">City</Label>
                <Select 
                  value={corporateOffice.city} 
                  onValueChange={(value) => handleCorporateOfficeChange('city', value)}
                  disabled={sameAddress || !corporateOffice.state}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={corporateOffice.state ? "Select city" : "Select state first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {getCitiesForState(corporateOffice.state).map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                    {corporateOffice.state && getCitiesForState(corporateOffice.state).length === 0 && (
                      <SelectItem value="other" disabled>No cities available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
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
