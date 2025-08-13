import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Search, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { StepComponentProps, BankAccount } from "./types";
import { useToast } from "@/components/ui/use-toast";

export const BasicDetailsStep = ({ formData, updateFormData }: StepComponentProps): JSX.Element => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [balanceSheetDate, setBalanceSheetDate] = useState<Date | undefined>();
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const { toast } = useToast();

  // Function to verify with MCA API
  const handleVerify = async () => {
    setVerifying(true);
    try {
      // Use our mock API service to verify CIN/LLPIN
      if (formData.cinNumber) {
        // Import the entityService
        const { entityService } = await import("@/services/entityServiceFactory");
        
        // Call the verification API
        const verificationData = await entityService.verifyEntityWithMCA(formData.cinNumber);
        
        // Update form data with verified information
        updateFormData(verificationData);
        
        setVerified(true);
        toast({
          title: "Verification Successful",
          description: "Company details have been auto-filled."
        });
      } else {
        setVerified(false);
        toast({
          title: "Verification Failed",
          description: "Please enter a valid CIN/LLPIN number.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      setVerified(false);
      toast({
        title: "Verification Failed",
        description: "An error occurred during verification. Please try again.",
        variant: "destructive"
      });
    } finally {
      setVerifying(false);
    }
  };

  // Handle bank account management
  const [bankAccounts, setBankAccounts] = useState([
    {
      accountNo: "1234567890123",
      ifscCode: "HDFC0001234",
      bankName: "HDFC Bank",
      branch: "Mumbai Central",
      isMain: true
    },
    {
      accountNo: "9876543210987",
      ifscCode: "ICIC0005678",
      bankName: "ICICI Bank",
      branch: "Andheri West",
      isMain: false
    }
  ]);

  const handleBankAccountChange = (index: number, field: keyof BankAccount, value: string | boolean) => {
    const updatedAccounts = [...bankAccounts];
    updatedAccounts[index] = { ...updatedAccounts[index], [field]: value };
    
    // If setting this account as main, unset others
    if (field === 'isMain' && value === true) {
      updatedAccounts.forEach((account, i) => {
        if (i !== index) account.isMain = false;
      });
    }
    
    setBankAccounts(updatedAccounts);
    updateFormData({ bankAccounts: updatedAccounts });
  };

  const addBankAccount = () => {
    setBankAccounts([
      ...bankAccounts,
      {
        accountNo: "",
        ifscCode: "",
        bankName: "",
        branch: "",
        isMain: bankAccounts.length === 0 // First account is main by default
      }
    ]);
  };

  const removeBankAccount = (index: number) => {
    const updatedAccounts = bankAccounts.filter((_, i) => i !== index);
    setBankAccounts(updatedAccounts);
    updateFormData({ bankAccounts: updatedAccounts });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Type of Entity</Label>
          <div className="flex flex-wrap gap-2">
            {["Company", "LLP", "Partnership", "Proprietorship", "Individual", "Society", "Trust"].map((type) => (
              <Button
                key={type}
                type="button"
                variant={formData.entityType === type ? "default" : "outline"}
                onClick={() => updateFormData({ entityType: type })}
                className="rounded-full"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cinNumber">CIN/LLPIN/Aadhar No</Label>
            <div className="flex gap-2">
              <Input
                id="cinNumber"
                value={formData.cinNumber}
                onChange={(e) => updateFormData({ cinNumber: e.target.value })}
                placeholder="Enter identification number"
              />
              <Button 
                type="button" 
                onClick={handleVerify}
                className="ml-2"
              >
                Verify
              </Button>
              <Button 
                type="button" 
                className="whitespace-nowrap"
              >
                <Search className="h-4 w-4 mr-2" /> Verify with MCA API
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="entityName">Name of Entity</Label>
            <Input
              id="entityName"
              value={formData.entityName}
              onChange={(e) => updateFormData({ entityName: e.target.value })}
              placeholder="Auto-filled from MCA"
              readOnly={formData.entityName !== ""}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="registrationNo">Registration No.</Label>
            <Input
              id="registrationNo"
              value={formData.registrationNo}
              onChange={(e) => updateFormData({ registrationNo: e.target.value })}
              placeholder="Enter registration number"
              readOnly={formData.registrationNo !== ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rocName">ROC Name</Label>
            <Input
              id="rocName"
              value={formData.rocName}
              onChange={(e) => updateFormData({ rocName: e.target.value })}
              placeholder="Enter ROC name"
              readOnly={formData.rocName !== ""}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category of Company</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => updateFormData({ category: e.target.value })}
              placeholder="Prefilled"
              readOnly={formData.category !== ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subcategory">Subcategory</Label>
            <Input
              id="subcategory"
              value={formData.subcategory}
              onChange={(e) => updateFormData({ subcategory: e.target.value })}
              placeholder="Prefilled"
              readOnly={formData.subcategory !== ""}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date of Last AGM</Label>
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
                  {selectedDate ? format(selectedDate, "PPP") : <span>DD/MM/YYYY</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    updateFormData({ lastAgmDate: date ? format(date, "yyyy-MM-dd") : "" });
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Date of Balance Sheet</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !balanceSheetDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {balanceSheetDate ? format(balanceSheetDate, "PPP") : <span>DD/MM/YYYY</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={balanceSheetDate}
                  onSelect={(date) => {
                    setBalanceSheetDate(date);
                    updateFormData({ balanceSheetDate: date ? format(date, "yyyy-MM-dd") : "" });
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyStatus">Company Status</Label>
            <Select 
              value={formData.companyStatus} 
              onValueChange={(value) => updateFormData({ companyStatus: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select company status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Dormant">Dormant</SelectItem>
                <SelectItem value="Under Liquidation">Under Liquidation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="entityStatus">Entity Status</Label>
            <Select 
              value={formData.entityStatus || 'pending'} 
              onValueChange={(value: 'pending' | 'active' | 'suspended' | 'inactive') => updateFormData({ entityStatus: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select entity status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Directors/Signatory Details</Label>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Designation</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">DIN</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">DoB/Reg Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Contact</th>
                </tr>
              </thead>
              <tbody>
                {formData.directors && formData.directors.length > 0 ? (
                  formData.directors.map((director, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{director.name}</td>
                      <td className="px-4 py-2">{director.designation}</td>
                      <td className="px-4 py-2">{director.din}</td>
                      <td className="px-4 py-2">{director.dob}</td>
                      <td className="px-4 py-2">{director.email}</td>
                      <td className="px-4 py-2">{director.contact}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-2 text-center text-muted-foreground">
                      No directors added yet. Verify with MCA API to auto-fill.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pan">PAN</Label>
          <div className="flex gap-2 items-center">
            <Input
              id="pan"
              value={formData.pan}
              onChange={(e) => updateFormData({ pan: e.target.value })}
              placeholder="Enter PAN"
            />
            <span className="text-green-600 flex items-center">
              ✅ Verified via KYC API
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>GSTN</Label>
          <RadioGroup
            defaultValue={formData.gstn?.available ? "available" : "notAvailable"}
            onValueChange={(value) => 
              updateFormData({ 
                gstn: { 
                  ...formData.gstn, 
                  available: value === "available" 
                } 
              })
            }
            className="flex items-center space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="available" id="gstn-available" />
              <Label htmlFor="gstn-available">Available</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="notAvailable" id="gstn-not-available" />
              <Label htmlFor="gstn-not-available">Not Available</Label>
            </div>
          </RadioGroup>
          
          {formData.gstn?.available && (
            <div className="flex gap-2 items-center mt-2">
              <Input
                value={formData.gstn?.number || ""}
                onChange={(e) => 
                  updateFormData({ 
                    gstn: { 
                      ...formData.gstn, 
                      number: e.target.value 
                    } 
                  })
                }
                placeholder="Enter GSTN number"
              />
              <Button variant="outline">
                📎 Upload Certificate (Optional)
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>MSME No.</Label>
          <RadioGroup
            defaultValue={formData.msme?.available ? "available" : "notAvailable"}
            onValueChange={(value) => 
              updateFormData({ 
                msme: { 
                  ...formData.msme, 
                  available: value === "available" 
                } 
              })
            }
            className="flex items-center space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="available" id="msme-available" />
              <Label htmlFor="msme-available">Available</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="notAvailable" id="msme-not-available" />
              <Label htmlFor="msme-not-available">Not Available</Label>
            </div>
          </RadioGroup>
          
          {formData.msme?.available && (
            <div className="flex gap-2 items-center mt-2">
              <Input
                value={formData.msme?.number || ""}
                onChange={(e) => 
                  updateFormData({ 
                    msme: { 
                      ...formData.msme, 
                      number: e.target.value 
                    } 
                  })
                }
                placeholder="Enter MSME number"
              />
              <Button variant="outline">
                📎 Upload Certificate (Optional)
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Shop & Establishment</Label>
          <RadioGroup
            defaultValue={formData.shopEstablishment?.available ? "available" : "notAvailable"}
            onValueChange={(value) => 
              updateFormData({ 
                shopEstablishment: { 
                  ...formData.shopEstablishment, 
                  available: value === "available" 
                } 
              })
            }
            className="flex items-center space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="available" id="shop-available" />
              <Label htmlFor="shop-available">Available</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="notAvailable" id="shop-not-available" />
              <Label htmlFor="shop-not-available">Not Available</Label>
            </div>
          </RadioGroup>
          
          {formData.shopEstablishment?.available && (
            <div className="flex gap-2 items-center mt-2">
              <Input
                value={formData.shopEstablishment?.number || ""}
                onChange={(e) => 
                  updateFormData({ 
                    shopEstablishment: { 
                      ...formData.shopEstablishment, 
                      number: e.target.value 
                    } 
                  })
                }
                placeholder="Enter Shop & Establishment number"
              />
              <Button variant="outline">
                📎 Upload Certificate (Optional)
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Bank Account Details</Label>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Account No.</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">IFSC Code</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Bank Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Branch</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Main Account</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bankAccounts.map((account, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">
                      <Input
                        value={account.accountNo}
                        onChange={(e) => handleBankAccountChange(index, 'accountNo', e.target.value)}
                        className="h-8"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        value={account.ifscCode}
                        onChange={(e) => handleBankAccountChange(index, 'ifscCode', e.target.value)}
                        className="h-8"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        value={account.bankName}
                        onChange={(e) => handleBankAccountChange(index, 'bankName', e.target.value)}
                        className="h-8"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        value={account.branch}
                        onChange={(e) => handleBankAccountChange(index, 'branch', e.target.value)}
                        className="h-8"
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Checkbox
                        checked={account.isMain}
                        onCheckedChange={(checked) => 
                          handleBankAccountChange(index, 'isMain', checked === true)
                        }
                      />
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeBankAccount(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={addBankAccount}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-2" /> Add More Bank Accounts
          </Button>
        </div>
      </div>
    </div>
  );
};
