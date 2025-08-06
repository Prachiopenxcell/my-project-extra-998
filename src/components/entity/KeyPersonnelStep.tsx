import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { StepComponentProps, Personnel } from "./types";

export const KeyPersonnelStep = ({ formData, updateFormData }: StepComponentProps): JSX.Element => {
  // Initialize with existing personnel from formData or default mock data
  const [personnel, setPersonnel] = useState<Personnel[]>(
    formData.keyPersonnel?.length > 0 ? formData.keyPersonnel : [
      {
        id: 1,
        name: "John Smith",
        designation: "Managing Director",
        identityNo: "ABCPN1234E",
        din: "12345678",
        email: "j.smith@acme.com",
        contact: "9876543210"
      },
      {
        id: 2,
        name: "Jane Doe",
        designation: "Director",
        identityNo: "XYZPN5678F",
        din: "87654321",
        email: "j.doe@acme.com",
        contact: "8765432109"
      },
      {
        id: 3,
        name: "Mike Johnson",
        designation: "CFO",
        identityNo: "DEFPN9876G",
        din: "-",
        email: "m.johnson@acme.com",
        contact: "7654321098"
      },
      {
        id: 4,
        name: "Sarah Wilson",
        designation: "Company Secretary",
        identityNo: "GHIPN4567H",
        din: "-",
        email: "s.wilson@acme.com",
        contact: "6543210987"
      }
    ]
  );

  // State for the personnel being edited
  const [editingPersonnel, setEditingPersonnel] = useState<Personnel | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Handle adding a new personnel
  const handleAddPersonnel = () => {
    setEditingPersonnel({
      id: Date.now(), // Use timestamp as temporary ID
      name: "",
      designation: "",
      identityNo: "",
      din: "",
      email: "",
      contact: ""
    });
    setIsDialogOpen(true);
  };

  // Handle editing an existing personnel
  const handleEditPersonnel = (person: Personnel) => {
    setEditingPersonnel({ ...person });
    setIsDialogOpen(true);
  };

  // Handle saving personnel (add or update)
  const handleSavePersonnel = () => {
    if (!editingPersonnel) return;

    const isExisting = personnel.some(p => p.id === editingPersonnel.id);
    let updatedPersonnel: Personnel[];

    if (isExisting) {
      // Update existing personnel
      updatedPersonnel = personnel.map(p => 
        p.id === editingPersonnel.id ? editingPersonnel : p
      );
    } else {
      // Add new personnel
      updatedPersonnel = [...personnel, editingPersonnel];
    }

    setPersonnel(updatedPersonnel);
    updateFormData({ keyPersonnel: updatedPersonnel });
    setIsDialogOpen(false);
    setEditingPersonnel(null);
  };

  // Handle removing a personnel
  const handleRemovePersonnel = (id: number) => {
    const updatedPersonnel = personnel.filter(p => p.id !== id);
    setPersonnel(updatedPersonnel);
    updateFormData({ keyPersonnel: updatedPersonnel });
  };

  // Handle input change in the dialog
  const handleInputChange = (field: keyof Personnel, value: string) => {
    if (!editingPersonnel) return;
    setEditingPersonnel({
      ...editingPersonnel,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Key Personnel Details</h3>
        <Button 
          onClick={handleAddPersonnel}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" /> Add More Key Personnel
        </Button>
      </div>

      <div className="border rounded-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Designation</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Identity No.</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">DIN</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact No.</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-muted">
            {personnel.map((person) => (
              <tr key={person.id}>
                <td className="px-4 py-3 whitespace-nowrap">{person.name}</td>
                <td className="px-4 py-3 whitespace-nowrap">{person.designation}</td>
                <td className="px-4 py-3 whitespace-nowrap">{person.identityNo}</td>
                <td className="px-4 py-3 whitespace-nowrap">{person.din}</td>
                <td className="px-4 py-3 whitespace-nowrap">{person.email}</td>
                <td className="px-4 py-3 whitespace-nowrap">{person.contact}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEditPersonnel(person)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemovePersonnel(person.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {personnel.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-3 text-center text-muted-foreground">
                  No key personnel added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingPersonnel && editingPersonnel.name ? `Edit ${editingPersonnel.name}` : "Add New Personnel"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editingPersonnel?.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Select
                  value={editingPersonnel?.designation || ""}
                  onValueChange={(value) => handleInputChange("designation", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Managing Director">Managing Director</SelectItem>
                    <SelectItem value="Director">Director</SelectItem>
                    <SelectItem value="CEO">CEO</SelectItem>
                    <SelectItem value="CFO">CFO</SelectItem>
                    <SelectItem value="CTO">CTO</SelectItem>
                    <SelectItem value="Company Secretary">Company Secretary</SelectItem>
                    <SelectItem value="Partner">Partner</SelectItem>
                    <SelectItem value="Proprietor">Proprietor</SelectItem>
                    <SelectItem value="Authorized Signatory">Authorized Signatory</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="identityNo">Identity No. (PAN)</Label>
                <Input
                  id="identityNo"
                  value={editingPersonnel?.identityNo || ""}
                  onChange={(e) => handleInputChange("identityNo", e.target.value)}
                  placeholder="Enter PAN number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="din">DIN (if applicable)</Label>
                <Input
                  id="din"
                  value={editingPersonnel?.din || ""}
                  onChange={(e) => handleInputChange("din", e.target.value)}
                  placeholder="Enter DIN"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editingPersonnel?.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  value={editingPersonnel?.contact || ""}
                  onChange={(e) => handleInputChange("contact", e.target.value)}
                  placeholder="Enter contact number"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSavePersonnel}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
