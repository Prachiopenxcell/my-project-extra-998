import React, { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, FileText, AlertTriangle, User, Plus, Calculator, AlertCircle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  ARFeeStructure,
  ARAttendance,
  LawType,
  FeeStructureType,
  CreditorsSlab,
  EventTrigger,
  Recurrence,
  AttendanceStatus,
  FeeBreakdown,
  EventFeeLine,
  PeriodicFee,
  CoCMeetingAttendance,
  ClassMeeting,
  DEFAULT_CIRP_SLABS,
  LEGAL_RANGES
} from "@/types/ar";
import {
  getARFeeStructure,
  saveARFeeStructure,
  getAttendance,
  saveAttendance,
  addCoCMeeting,
  addClassMeeting,
  createDefaultCirpFeeStructure,
  createDefaultAttendance
} from "@/services/arService";
import {
  computeArFees,
  validateFeeAmount,
  calculateCoCMeetingFee,
  calculateClassMeetingFees
} from "@/services/arFeeService";

const ARDetails = () => {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  type TabKey =
    | "details"
    | "feeStructure"
    | "arAttendance"
    | "facilitatorDetails"
    | "selectFacilitator"
    | "facilitatorAttendance"
    | "facilitatorFees";
  const initialTab = (sp.get("tab") || "details") as TabKey;
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  // Types
  type Facilitator = { name: string; email: string };
  type FacAttendance = { facilitator: string; date: string; type: "CoC Meeting" | "Class Meeting"; status: "Present" | "Absent" | "Not Applicable" };

  // Stateful data
  const [facilitators, setFacilitators] = useState<Facilitator[]>([
    { name: "Rajesh Kumar", email: "rajesh.k@email.com" },
    { name: "Priya Sharma", email: "priya.s@email.com" },
  ]);
  const [facAttendance, setFacAttendance] = useState<FacAttendance[]>([
    { facilitator: "Rajesh Kumar", date: "2025-01-05", type: "CoC Meeting", status: "Present" },
  ]);

  // AR Fee Structure and Attendance State
  const [feeStructure, setFeeStructure] = useState<ARFeeStructure | null>(null);
  const [attendance, setAttendance] = useState<ARAttendance | null>(null);
  const [feeBreakdown, setFeeBreakdown] = useState<FeeBreakdown | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Current AR and Class (would come from route params in real app)
  const currentARId = "ar-john-smith";
  const currentClassName = "Financial Creditors-Secured";

  // Facilitator Termination State
  const [terminatingFacilitator, setTerminatingFacilitator] = useState<Facilitator | null>(null);
  const [terminationDate, setTerminationDate] = useState<string>("");
  const [terminationReason, setTerminationReason] = useState<string>("");
  const [showTerminateModal, setShowTerminateModal] = useState<boolean>(false);

  // Controlled inputs for new rows
  const [newCoCDate, setNewCoCDate] = useState("");
  const [newCoCar1Status, setNewCoCar1Status] = useState<AttendanceStatus>("Present");
  const [newCoCar2Status, setNewCoCar2Status] = useState<AttendanceStatus>("Not Applicable");
  const [newClassDate, setNewClassDate] = useState("");
  const [newClassStatus, setNewClassStatus] = useState<AttendanceStatus>("Present");
  const [newFacName, setNewFacName] = useState("Rajesh Kumar");
  const [newFacDate, setNewFacDate] = useState("");
  const [newFacType, setNewFacType] = useState<"CoC Meeting"|"Class Meeting">("CoC Meeting");
  const [newFacStatus, setNewFacStatus] = useState<"Present"|"Absent"|"Not Applicable">("Present");
  // Refs for file uploads
  const detailsUploadRef = useRef<HTMLInputElement>(null);
  const removalUploadRef = useRef<HTMLInputElement>(null);
  const facilitatorUploadRef = useRef<HTMLInputElement>(null);

  // Handlers
  const triggerUpload = (ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.click();
  };
  const onFilesSelected = (e: React.ChangeEvent<HTMLInputElement>, context: string) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      console.log(`[Upload:${context}]`, files.map(f => f.name));
      alert(`${context}: ${files.length} file(s) selected`);
    }
  };
  const handleGenerateInvoice = () => {
    alert("Invoice generated (demo)");
  };
  const handleSendNotification = () => {
    navigate("/notifications");
  };
  const handleGenerateLetter = () => {
    alert("Appointment letter generated and saved (demo)");
  };
  const handleViewProfile = () => {
    alert("Opening AR profile (demo)");
  };
  const handleViewFeesAuto = () => {
    setActiveTab("feeStructure");
  };
  const handleFeeAction = (action: "view"|"process"|"edit", period: string) => {
    if (action === "edit") {
      setActiveTab("feeStructure");
      return;
    }
    alert(`${action.toUpperCase()} fees for ${period}`);
  };
  const handleTerminateFacilitator = (f: Facilitator) => {
    setTerminatingFacilitator(f);
    setActiveTab("facilitatorDetails");
    setShowTerminateModal(true);
  };
  const handleRemoveAR = () => {
    if (confirm("Initiate removal of AR?")) {
      alert("Removal process started (demo)");
    }
  };
  // Load data on component mount
  useEffect(() => {
    loadFeeStructureAndAttendance();
  }, []);

  const loadFeeStructureAndAttendance = async () => {
    setIsLoading(true);
    try {
      const [feeStructureData, attendanceData] = await Promise.all([
        getARFeeStructure(currentARId, currentClassName),
        getAttendance(currentARId, currentClassName)
      ]);
      
      setFeeStructure(feeStructureData || createDefaultCirpFeeStructure(currentARId, currentClassName));
      setAttendance(attendanceData || createDefaultAttendance(currentARId, currentClassName));
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load fee structure and attendance data');
    } finally {
      setIsLoading(false);
    }
  };

  const recalculateFees = useCallback(() => {
    if (!feeStructure || !attendance) return;
    
    try {
      const breakdown = computeArFees({
        feeStructure,
        attendance,
        creditorsSlab: feeStructure.selectedSlab || "101-1000"
      });
      setFeeBreakdown(breakdown);
    } catch (error) {
      console.error('Error calculating fees:', error);
      toast.error('Failed to calculate fees');
    }
  }, [feeStructure, attendance]);

  // Recalculate fees when data changes
  useEffect(() => {
    if (feeStructure && attendance) {
      recalculateFees();
    }
  }, [feeStructure, attendance, recalculateFees]);

  const handleAddCoCMeeting = async () => {
    if (!newCoCDate) {
      toast.error("Please select a date");
      return;
    }
    
    try {
      const updatedAttendance = await addCoCMeeting(currentARId, currentClassName, {
        date: newCoCDate,
        ar1: newCoCar1Status,
        ar2: newCoCar2Status
      });
      setAttendance(updatedAttendance);
      setNewCoCDate("");
      toast.success("CoC meeting added successfully");
    } catch (error) {
      console.error('Error adding CoC meeting:', error);
      toast.error('Failed to add CoC meeting');
    }
  };

  const handleAddClassMeeting = async () => {
    if (!newClassDate) {
      toast.error("Please select a date");
      return;
    }
    
    try {
      const updatedAttendance = await addClassMeeting(
        currentARId, 
        currentClassName, 
        "John Smith", 
        newClassDate, 
        newClassStatus
      );
      setAttendance(updatedAttendance);
      setNewClassDate("");
      toast.success("Class meeting added successfully");
    } catch (error) {
      console.error('Error adding class meeting:', error);
      toast.error('Failed to add class meeting');
    }
  };

  const handleFeeStructureChange = async (updates: Partial<ARFeeStructure>) => {
    if (!feeStructure) return;
    
    try {
      const updatedFeeStructure = await saveARFeeStructure(
        currentARId,
        currentClassName,
        { ...feeStructure, ...updates }
      );
      setFeeStructure(updatedFeeStructure);
      toast.success("Fee structure updated successfully");
    } catch (error) {
      console.error('Error updating fee structure:', error);
      toast.error('Failed to update fee structure');
    }
  };
  const handleAddFacilitatorAttendance = () => {
    if (!newFacDate) return alert("Please select a date");
    setFacAttendance(prev => [...prev, { facilitator: newFacName, date: newFacDate, type: newFacType, status: newFacStatus }]);
    setNewFacDate("");
  };

  return (
    <>
    <DashboardLayout>
      <div className="container mx-auto p-6">
      {/* Hidden file inputs for uploads */}
      <input ref={detailsUploadRef} type="file" multiple className="hidden" onChange={(e) => onFilesSelected(e, "Appointment Docs")} />
      <input ref={removalUploadRef} type="file" multiple className="hidden" onChange={(e) => onFilesSelected(e, "Removal Docs")} />
      <input ref={facilitatorUploadRef} type="file" multiple className="hidden" onChange={(e) => onFilesSelected(e, "Facilitator Docs")} />
      <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">AR Details & Management</h1>
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={() => navigate("/ar-facilitators")}
            >
              <ArrowLeft size={16} /> Back
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <Tabs defaultValue="details" onValueChange={(v) => setActiveTab(v as TabKey)}>
              <TabsList className="grid grid-cols-7 w-full">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="feeStructure">Fee Structure</TabsTrigger>
                <TabsTrigger value="arAttendance">Attendance of AR</TabsTrigger>
                <TabsTrigger value="facilitatorDetails">Facilitator Details</TabsTrigger>
                <TabsTrigger value="selectFacilitator">Selection of Facilitator</TabsTrigger>
                <TabsTrigger value="facilitatorAttendance">Attendance of Facilitator</TabsTrigger>
                <TabsTrigger value="facilitatorFees">Fees of Facilitator</TabsTrigger>
              </TabsList>

              {/* Details Tab */}
              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>AR DETAILS</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Class of Creditors</p>
                      <p className="font-medium">Financial Creditors-Secured</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Selected AR</p>
                      <p className="font-medium">John Smith (IBBI Reg: IB123456)</p>
                    </div>

                    {/* Appointment Details */}
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-3">Appointment Details</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Appointment Date</p>
                            <input type="date" className="w-full p-2 border rounded-md" defaultValue="2025-01-25" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Terms of Appointment</p>
                            <textarea className="w-full p-2 border rounded-md" rows={2} placeholder="Enter key terms">Standard CIRP terms apply. Fees as per regulation...</textarea>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Option</p>
                            <Button variant="outline" className="w-full" onClick={handleViewFeesAuto}>View Fees (Auto-calculated)</Button>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Supporting Documents</p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2"><span className="text-primary">📄</span><span>Appointment Letter.pdf</span></div>
                            <div className="flex items-center gap-2"><span className="text-primary">📄</span><span>Resolution Copy.pdf</span></div>
                            <div className="flex items-center gap-2"><span className="text-primary">📄</span><span>Court Order.pdf</span></div>
                            <div className="flex items-center gap-2"><span className="text-primary">📄</span><span>CTC of Minutes.pdf</span></div>
                            <Button onClick={() => triggerUpload(detailsUploadRef)} variant="outline" size="sm" className="flex items-center gap-1 mt-2"><span>📎</span> Upload Document</Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">Allowed: PDF, Word, Excel</p>
                        </div>
                      </div>
                    </div>

                    {/* AR Contact Information */}
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-3">AR Contact Information</h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p>john.smith@email.com</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p>+91-9876543210</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Office</p>
                          <p>123 Business District, Mumbai - 400001</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Firm</p>
                          <p>Smith & Associates</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-3">Actions</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="flex items-center gap-2" onClick={handleSendNotification}>
                          <Mail size={16} /> Send Notification
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2" onClick={handleGenerateLetter}>
                          <FileText size={16} /> Generate Letter
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                          <AlertTriangle size={16} /> Remove AR
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2" onClick={handleViewProfile}>
                          <User size={16} /> View Profile
                        </Button>
                      </div>
                      {/* Removal Workflow */}
                      <div className="mt-4 border rounded-md p-3">
                        <h4 className="font-medium mb-2">Removal of AR</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <p className="text-sm text-muted-foreground">Date</p>
                            <input type="date" className="w-full p-2 border rounded-md" />
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-sm text-muted-foreground">Reason</p>
                            <input type="text" className="w-full p-2 border rounded-md" placeholder="Enter reason" />
                          </div>
                          <div className="md:col-span-3">
                            <p className="text-sm text-muted-foreground mb-1">Supporting Docs (CTC of Minutes / Resolution / Order of Tribunal / Appointment letter)</p>
                            <Button onClick={() => triggerUpload(removalUploadRef)} variant="outline" size="sm"><span>📎</span> Upload</Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-3">Quick Stats</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">CoC Meetings Attended</p>
                          <p className="font-medium">5/6</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Fees Earned</p>
                          <p className="font-medium">₹1,50,000</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Class Meetings Held</p>
                          <p className="font-medium">3</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Next Meeting</p>
                          <p className="font-medium">05 Feb 2025</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Fee Structure Tab */}
              <TabsContent value="feeStructure">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      FEE STRUCTURE
                      <Button 
                        onClick={recalculateFees} 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Calculator size={16} />
                        Recalculate
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isLoading ? (
                      <div className="text-center py-8">Loading fee structure...</div>
                    ) : !feeStructure ? (
                      <div className="text-center py-8">No fee structure found</div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <p>AR: John Smith | Class: {currentClassName}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Law Type</Label>
                            <Select 
                              value={feeStructure.lawType} 
                              onValueChange={(value: LawType) => handleFeeStructureChange({ lawType: value })}
                            >
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="IBBI CIRP">IBBI CIRP</SelectItem>
                                <SelectItem value="IBBI Liquidation">IBBI Liquidation</SelectItem>
                                <SelectItem value="SEBI">SEBI</SelectItem>
                                <SelectItem value="IBBI Insolvency">IBBI Insolvency</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Fee Structure Type</Label>
                            <Select 
                              value={feeStructure.structureType} 
                              onValueChange={(value: FeeStructureType) => handleFeeStructureChange({ structureType: value })}
                              disabled={feeStructure.lawType === "IBBI CIRP"}
                            >
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="EventBasis">Event Basis</SelectItem>
                                <SelectItem value="Periodic">Periodic</SelectItem>
                                <SelectItem value="FixedLumpSum">Fixed/Lump Sum</SelectItem>
                                <SelectItem value="Mixed">Mixed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {feeStructure.lawType === "IBBI CIRP" && (
                          <div className="border rounded-md p-4 bg-blue-50">
                            <h3 className="font-medium mb-3 flex items-center gap-2">
                              <Badge variant="secondary">CIRP Regulations</Badge>
                              Event-Based Fees (System Suggested)
                            </h3>
                            
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Number of Creditors in Class</Label>
                                <Select 
                                  value={feeStructure.selectedSlab || "101-1000"} 
                                  onValueChange={(value: CreditorsSlab) => handleFeeStructureChange({ selectedSlab: value })}
                                >
                                  <SelectTrigger><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="10-100">10-100 creditors</SelectItem>
                                    <SelectItem value="101-1000">101-1000 creditors</SelectItem>
                                    <SelectItem value="1000+">1000+ creditors</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>CoC Meeting Fee</Label>
                                  <Input 
                                    value={`₹${DEFAULT_CIRP_SLABS.cocFeePerMeeting[feeStructure.selectedSlab || "101-1000"].toLocaleString()}`}
                                    disabled
                                    className="bg-gray-50"
                                  />
                                  <p className="text-xs text-muted-foreground">Only first 2 meetings paid</p>
                                </div>
                                <div className="space-y-2">
                                  <Label>Class Meeting Fee</Label>
                                  <Input 
                                    value={`₹${DEFAULT_CIRP_SLABS.classFeePerMeeting[feeStructure.selectedSlab || "101-1000"].toLocaleString()}`}
                                    disabled
                                    className="bg-gray-50"
                                  />
                                  <p className="text-xs text-muted-foreground">Only first 2 per class paid</p>
                                </div>
                              </div>

                              <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                  Under CIRP law, fees are fixed by regulation. Only first two CoC meetings and first two class meetings per class are payable.
                                </AlertDescription>
                              </Alert>
                            </div>
                          </div>
                        )}

                        {feeBreakdown && (
                          <div className="border rounded-md p-4 bg-green-50">
                            <h3 className="font-medium mb-3">Fee Calculation Summary</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p>CoC Meetings (Paid): {feeBreakdown.cocPaidCount}</p>
                                <p>CoC Meetings (Unpaid): {feeBreakdown.cocUnpaidCount}</p>
                                <p>CoC Total: ₹{feeBreakdown.cocTotal.toLocaleString()}</p>
                              </div>
                              <div>
                                <p>Class Meetings Total: ₹{feeBreakdown.classTotal.toLocaleString()}</p>
                                <p className="font-medium">AR Meeting Fees: ₹{feeBreakdown.arMeetingFeesTotal.toLocaleString()}</p>
                                <p className="font-medium text-blue-600">Facilitator Fee (20%): ₹{feeBreakdown.facilitatorFee.toLocaleString()}</p>
                              </div>
                            </div>
                            {feeBreakdown.validationWarnings.length > 0 && (
                              <div className="mt-3">
                                {feeBreakdown.validationWarnings.map((warning, idx) => (
                                  <Alert key={idx} className="mt-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{warning}</AlertDescription>
                                  </Alert>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Attendance of AR Tab */}
              <TabsContent value="arAttendance">
                <Card>
                  <CardHeader>
                    <CardTitle>AR ATTENDANCE RECORD</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isLoading ? (
                      <div className="text-center py-8">Loading attendance records...</div>
                    ) : !attendance ? (
                      <div className="text-center py-8">No attendance records found</div>
                    ) : (
                      <>
                        <p className="text-muted-foreground">Attendance records for John Smith - {currentClassName}</p>
                        
                        {/* CoC Meetings Section */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">Committee of Creditors (CoC) Meetings</h3>
                            <Badge variant="outline">
                              {feeStructure?.lawType === "IBBI CIRP" ? "Only first 2 meetings paid" : "All meetings paid"}
                            </Badge>
                          </div>
                          
                          <div className="border rounded-md overflow-hidden">
                            <table className="w-full">
                              <thead className="bg-muted">
                                <tr>
                                  <th className="p-3 text-left">Meeting #</th>
                                  <th className="p-3 text-left">Date</th>
                                  <th className="p-3 text-left">AR1 Status</th>
                                  <th className="p-3 text-left">AR2 Status</th>
                                  <th className="p-3 text-left">Payable?</th>
                                  <th className="p-3 text-left">Fee</th>
                                </tr>
                              </thead>
                              <tbody>
                                {attendance.cocMeetings.map((meeting, idx) => {
                                  const isPresent = meeting.ar1 === "Present" || (meeting.ar2 && meeting.ar2 === "Present");
                                  const isPaid = feeStructure?.lawType === "IBBI CIRP" ? 
                                    (isPresent && meeting.index <= 2) : isPresent;
                                  const feeAmount = isPaid ? 
                                    (feeStructure?.cirpSlabs?.cocFeePerMeeting[feeStructure.selectedSlab || "101-1000"] || 40000) : 0;
                                  
                                  return (
                                    <tr key={idx} className="border-b">
                                      <td className="p-3">{meeting.index}</td>
                                      <td className="p-3">{new Date(meeting.date).toLocaleDateString()}</td>
                                      <td className="p-3">
                                        <Badge variant={meeting.ar1 === "Present" ? "default" : meeting.ar1 === "Absent" ? "destructive" : "secondary"}>
                                          {meeting.ar1}
                                        </Badge>
                                      </td>
                                      <td className="p-3">
                                        {meeting.ar2 ? (
                                          <Badge variant={meeting.ar2 === "Present" ? "default" : meeting.ar2 === "Absent" ? "destructive" : "secondary"}>
                                            {meeting.ar2}
                                          </Badge>
                                        ) : (
                                          <span className="text-muted-foreground">-</span>
                                        )}
                                      </td>
                                      <td className="p-3">
                                        <Badge variant={isPaid ? "default" : "outline"}>
                                          {isPaid ? "Yes" : "No"}
                                        </Badge>
                                      </td>
                                      <td className="p-3 font-medium">
                                        ₹{feeAmount.toLocaleString()}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                          
                          {/* Add CoC Meeting */}
                          <div className="flex gap-3 items-center p-3 bg-muted/50 rounded-md">
                            <Input 
                              type="date" 
                              value={newCoCDate} 
                              onChange={e => setNewCoCDate(e.target.value)}
                              className="w-auto"
                            />
                            <Select value={newCoCar1Status} onValueChange={(v: AttendanceStatus) => setNewCoCar1Status(v)}>
                              <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="AR1 Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Present">Present</SelectItem>
                                <SelectItem value="Absent">Absent</SelectItem>
                                <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                              </SelectContent>
                            </Select>
                            <Select value={newCoCar2Status} onValueChange={(v: AttendanceStatus) => setNewCoCar2Status(v)}>
                              <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="AR2 Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Present">Present</SelectItem>
                                <SelectItem value="Absent">Absent</SelectItem>
                                <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button onClick={handleAddCoCMeeting} className="flex items-center gap-2">
                              <Plus size={16} />
                              Add CoC Meeting
                            </Button>
                          </div>
                        </div>

                        {/* Class Meetings Section */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">Class of Creditors Meetings</h3>
                            <Badge variant="outline">
                              {feeStructure?.lawType === "IBBI CIRP" ? "Only first 2 per class paid" : "All meetings paid"}
                            </Badge>
                          </div>
                          
                          {attendance.classMeetings.map((classGroup, groupIdx) => (
                            <div key={groupIdx} className="border rounded-md p-4">
                              <h4 className="font-medium mb-3">{classGroup.arName} - {classGroup.className}</h4>
                              
                              <div className="border rounded-md overflow-hidden">
                                <table className="w-full">
                                  <thead className="bg-muted">
                                    <tr>
                                      <th className="p-3 text-left">Meeting #</th>
                                      <th className="p-3 text-left">Date</th>
                                      <th className="p-3 text-left">Status</th>
                                      <th className="p-3 text-left">Payable?</th>
                                      <th className="p-3 text-left">Fee</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {classGroup.meetings.map((meeting, meetingIdx) => {
                                      const isPaid = feeStructure?.lawType === "IBBI CIRP" ? 
                                        (meeting.status === "Present" && meetingIdx < 2) : 
                                        (meeting.status === "Present");
                                      const feeAmount = isPaid ? 
                                        (feeStructure?.cirpSlabs?.classFeePerMeeting[feeStructure.selectedSlab || "101-1000"] || 12000) : 0;
                                      
                                      return (
                                        <tr key={meeting.id} className="border-b">
                                          <td className="p-3">{meetingIdx + 1}</td>
                                          <td className="p-3">{new Date(meeting.date).toLocaleDateString()}</td>
                                          <td className="p-3">
                                            <Badge variant={meeting.status === "Present" ? "default" : meeting.status === "Absent" ? "destructive" : "secondary"}>
                                              {meeting.status}
                                            </Badge>
                                          </td>
                                          <td className="p-3">
                                            <Badge variant={isPaid ? "default" : "outline"}>
                                              {isPaid ? "Yes" : "No"}
                                            </Badge>
                                            {feeStructure?.lawType === "IBBI CIRP" && meetingIdx >= 2 && meeting.status === "Present" && (
                                              <span className="text-xs text-muted-foreground ml-2">(&gt;2 meetings)</span>
                                            )}
                                          </td>
                                          <td className="p-3 font-medium">
                                            ₹{feeAmount.toLocaleString()}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ))}
                          
                          {/* Add Class Meeting */}
                          <div className="flex gap-3 items-center p-3 bg-muted/50 rounded-md">
                            <Input 
                              type="date" 
                              value={newClassDate} 
                              onChange={e => setNewClassDate(e.target.value)}
                              className="w-auto"
                            />
                            <Select value={newClassStatus} onValueChange={(v: AttendanceStatus) => setNewClassStatus(v)}>
                              <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Present">Present</SelectItem>
                                <SelectItem value="Absent">Absent</SelectItem>
                                <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button onClick={handleAddClassMeeting} className="flex items-center gap-2">
                              <Plus size={16} />
                              Add Class Meeting
                            </Button>
                          </div>
                        </div>

                        {/* Attendance Summary */}
                        {feeBreakdown && (
                          <div className="border rounded-md p-4 bg-blue-50">
                            <h3 className="font-medium mb-3">Attendance Summary</h3>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">CoC Meetings</p>
                                <p>Paid: {feeBreakdown.cocPaidCount} | Unpaid: {feeBreakdown.cocUnpaidCount}</p>
                                <p className="font-medium">Total: ₹{feeBreakdown.cocTotal.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Class Meetings</p>
                                <p>Total Paid: {Object.values(feeBreakdown.classPaidByClass).reduce((a, b) => a + b, 0)}</p>
                                <p className="font-medium">Total: ₹{feeBreakdown.classTotal.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Overall</p>
                                <p className="font-medium">AR Fees: ₹{feeBreakdown.arMeetingFeesTotal.toLocaleString()}</p>
                                <p className="font-medium text-blue-600">Facilitator (20%): ₹{feeBreakdown.facilitatorFee.toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Facilitator Details Tab */}
              <TabsContent value="facilitatorDetails">
                <Card>
                  <CardHeader>
                    <CardTitle>FACILITATOR MANAGEMENT</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-3 rounded-md bg-blue-50 text-blue-800 text-sm">
                      The facilitator will be appointed after the 1st CoC meeting is conducted by the CoC and AR.
                    </div>
                    <p>Manage facilitators for Financial Creditors-Secured class</p>
                    
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-3">Assigned Facilitators</h3>
                      <div className="space-y-4">
                        {facilitators.map((f, idx) => (
                          <div key={idx} className="grid grid-cols-3 gap-4 p-3 bg-muted rounded-md">
                            <div>
                              <p className="text-sm text-muted-foreground">Name</p>
                              <p className="font-medium">{f.name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Contact</p>
                              <p>{f.email}</p>
                            </div>
                            <div className="flex justify-end items-center">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleTerminateFacilitator(f)}
                              >
                                Terminate
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <Button className="mt-4" onClick={() => setFacilitators(prev => [...prev, { name: `New Facilitator ${prev.length+1}`, email: "new.facilitator@email.com" }])}>
                        + Add New Facilitator
                      </Button>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-3">Facilitator Responsibilities</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Assist AR in communication with class members</li>
                        <li>Collect and organize documentation from creditors</li>
                        <li>Coordinate meetings and voting processes</li>
                        <li>Prepare reports and summaries for the AR</li>
                        <li>Handle queries from class members</li>
                      </ul>
                    </div>

                    {/* Termination handled via modal */}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Selection of Facilitator Tab */}
              <TabsContent value="selectFacilitator">
                <Card>
                  <CardHeader>
                    <CardTitle>SELECTION OF FACILITATOR</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 rounded-md bg-blue-50 text-blue-800 text-sm">
                      Eligibility: Facilitator appointment triggers if Class creditors &gt; 1000 and Sub-class &ge; 100. Current class has 1487 creditors — eligible.
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm">Proposed Facilitator Name</label>
                        <input className="w-full p-2 border rounded-md" placeholder="Enter name" />
                      </div>
                      <div>
                        <label className="text-sm">IBBI Reg No. / PAN / UID</label>
                        <input className="w-full p-2 border rounded-md" placeholder="Enter identifier" />
                      </div>
                      <div>
                        <label className="text-sm">Bank Details</label>
                        <input className="w-full p-2 border rounded-md" placeholder="Enter bank details" />
                      </div>
                      <div>
                        <label className="text-sm">Date of Appointment</label>
                        <input type="date" className="w-full p-2 border rounded-md" />
                      </div>
                      <div>
                        <label className="text-sm">Class of Creditors</label>
                        <input className="w-full p-2 border rounded-md bg-gray-50" defaultValue="Financial Creditors-Secured" readOnly />
                      </div>
                      <div>
                        <label className="text-sm">Sub-class of Creditors</label>
                        <select multiple className="w-full p-2 border rounded-md h-24">
                          <option>Senior Secured</option>
                          <option>Junior Secured</option>
                          <option>Institutional</option>
                          <option>Retail</option>
                        </select>
                        <p className="text-xs text-muted-foreground mt-1">Select one or more eligible subclasses</p>
                      </div>
                      <div className="md:col-span-3">
                        <label className="text-sm">Upload Supporting Docs</label>
                        <div className="mt-1"><Button onClick={() => triggerUpload(facilitatorUploadRef)} variant="outline" size="sm"><span>📎</span> Upload</Button></div>
                      </div>
                    </div>
                    <div className="flex justify-end"><Button>Save Facilitator</Button></div>
                    <div className="text-xs text-muted-foreground">Note: Appointment of facilitator can occur outside the system; this records details and conditions.</div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Attendance of Facilitator Tab */}
              <TabsContent value="facilitatorAttendance">
                <Card>
                  <CardHeader>
                    <CardTitle>FACILITATOR ATTENDANCE</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-md overflow-hidden mb-4">
                      <table className="w-full">
                        <thead className="bg-muted">
                          <tr>
                            <th className="p-3 text-left">Facilitator</th>
                            <th className="p-3 text-left">Meeting Date</th>
                            <th className="p-3 text-left">Type</th>
                            <th className="p-3 text-left">Attendance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {facAttendance.map((r, i) => (
                            <tr key={i} className="border-b">
                              <td className="p-3">{r.facilitator}</td>
                              <td className="p-3">{new Date(r.date).toLocaleDateString()}</td>
                              <td className="p-3">{r.type}</td>
                              <td className="p-3">{r.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="min-w-[180px]">
                        <Select value={newFacName} onValueChange={(v: string) => setNewFacName(v)}>
                          <SelectTrigger><SelectValue placeholder="Facilitator" /></SelectTrigger>
                          <SelectContent>
                            {facilitators.map(f => (
                              <SelectItem key={f.name} value={f.name}>{f.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <input type="date" className="p-2 border rounded-md" value={newFacDate} onChange={e => setNewFacDate(e.target.value)} />
                      <div className="min-w-[160px]">
                        <Select value={newFacType} onValueChange={(v: "CoC Meeting"|"Class Meeting") => setNewFacType(v)}>
                          <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CoC Meeting">CoC Meeting</SelectItem>
                            <SelectItem value="Class Meeting">Class Meeting</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="min-w-[180px]">
                        <Select value={newFacStatus} onValueChange={(v: "Present"|"Absent"|"Not Applicable") => setNewFacStatus(v)}>
                          <SelectTrigger><SelectValue placeholder="Attendance" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Present">Present</SelectItem>
                            <SelectItem value="Absent">Absent</SelectItem>
                            <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleAddFacilitatorAttendance}>Add</Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Fees of Facilitator are 20% of AR meeting fees as per logic.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Fees of Facilitator Tab */}
              <TabsContent value="facilitatorFees">
                <Card>
                  <CardHeader>
                    <CardTitle>FEES OF FACILITATOR</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Facilitator Fees are 20% of AR meeting fees</p>
                        <p className="font-medium">Financial Creditors-Secured</p>
                      </div>
                      <Button onClick={handleGenerateInvoice}>Generate Invoice</Button>
                    </div>
                    
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted">
                          <tr>
                            <th className="p-3 text-left">Period</th>
                            <th className="p-3 text-left">Description</th>
                            <th className="p-3 text-left">Amount (20% of AR)</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-3">Jan 2025</td>
                            <td className="p-3">Facilitator share for meetings (20%)</td>
                            <td className="p-3">₹12,800</td>
                            <td className="p-3">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Paid
                              </span>
                            </td>
                            <td className="p-3">
                              <Button variant="ghost" size="sm" onClick={() => handleFeeAction('view','Jan 2025')}>View</Button>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3">Feb 2025</td>
                            <td className="p-3">Facilitator share for meetings (20%)</td>
                            <td className="p-3">₹16,000</td>
                            <td className="p-3">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            </td>
                            <td className="p-3">
                              <Button variant="ghost" size="sm" onClick={() => handleFeeAction('process','Feb 2025')}>Process</Button>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3">Mar 2025</td>
                            <td className="p-3">Facilitator share for meetings (20%)</td>
                            <td className="p-3">₹2,400</td>
                            <td className="p-3">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Draft
                              </span>
                            </td>
                            <td className="p-3">
                              <Button variant="ghost" size="sm" onClick={() => handleFeeAction('edit','Mar 2025')}>Edit</Button>
                            </td>
                          </tr>
                        </tbody>
                        <tfoot className="bg-muted/50">
                          <tr>
                            <td className="p-3" colSpan={2}><strong>Total</strong></td>
                            <td className="p-3" colSpan={3}><strong>₹31,200</strong></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-3">Payment Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Bank Account</p>
                          <p>HDFC Bank - XXXX1234</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Payment Method</p>
                          <p>NEFT/RTGS</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">GST Number</p>
                          <p>22AAAAA0000A1Z5</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">PAN</p>
                          <p>AAAAA0000A</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-8 text-sm text-muted-foreground border-t pt-4">
            John Doe - Service Provider - ID: TRN-636169
          </div>
      </div>
    </DashboardLayout>

    {/* Terminate Facilitator Modal */}
    <Dialog open={showTerminateModal} onOpenChange={(open) => {
      setShowTerminateModal(open);
      if (!open) {
        setTerminatingFacilitator(null);
        setTerminationDate("");
        setTerminationReason("");
      }
    }}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Terminate Facilitator</DialogTitle>
          <DialogDescription>
            Provide termination details. Facilitator fees are auto-calculated as 20% of AR meeting fees.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Facilitator</Label>
            <Input value={terminatingFacilitator?.name ?? ""} disabled className="bg-gray-50" />
            {terminatingFacilitator?.email && (
              <p className="text-xs text-muted-foreground mt-1">Contact: {terminatingFacilitator.email}</p>
            )}
          </div>
          <div>
            <Label>Fees of Facilitator (Auto)</Label>
            <Input 
              value={`₹${(feeBreakdown?.facilitatorFee ?? 0).toLocaleString()}`}
              disabled
              className="bg-gray-50"
            />
          </div>
          <div>
            <Label>Date of Termination</Label>
            <Input type="date" value={terminationDate} onChange={(e) => setTerminationDate(e.target.value)} />
          </div>
          <div>
            <Label>Upload Supporting Docs for Removal</Label>
            <div className="mt-1">
              <Button variant="outline" size="sm" onClick={() => triggerUpload(facilitatorUploadRef)}>
                <span>📎</span> Upload
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Allowed: PDF, Word, Excel</p>
          </div>
          <div className="md:col-span-2">
            <Label>Reason of Termination</Label>
            <textarea 
              className="w-full p-2 border rounded-md" 
              rows={3}
              placeholder="Provide detailed reason"
              value={terminationReason}
              onChange={(e) => setTerminationReason(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="ghost"
            onClick={() => setShowTerminateModal(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => {
              if (!terminationDate || !terminationReason) {
                toast.error("Please provide date and reason for termination");
                return;
              }
              toast.success("Facilitator termination saved. Fees auto-calculated.");
              setShowTerminateModal(false);
            }}
          >
            Save Termination
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default ARDetails;
